import json
import os
import sqlite3
import sys


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DB_PATH = os.environ.get(
    "BINOCART_RECEIPT_DB",
    os.path.join(ROOT, "data", "binocart-receipts.sqlite"),
)


def connect():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_column(conn, table, column, definition):
    columns = [row["name"] for row in conn.execute(f"PRAGMA table_info({table})")]
    if column not in columns:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def init_db(conn):
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS receipts (
            receipt_id TEXT PRIMARY KEY,
            saved_at TEXT,
            source TEXT,
            original_file_name TEXT,
            handwriting_detected INTEGER,
            brand TEXT,
            store_id TEXT,
            store_name TEXT,
            location TEXT,
            full_address TEXT,
            street TEXT,
            city TEXT,
            state TEXT,
            zip TEXT,
            date TEXT,
            subtotal REAL,
            tax REAL,
            total REAL,
            payment_method TEXT,
            card_last_four TEXT,
            transaction_id TEXT,
            gas_station INTEGER,
            gas_fuel_type TEXT,
            gas_gallons REAL,
            gas_price_per_gallon REAL,
            gas_total_cost REAL,
            misc TEXT,
            suggested_filename TEXT,
            receipt_json TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS receipt_items (
            id TEXT PRIMARY KEY,
            receipt_id TEXT,
            line_index INTEGER,
            name TEXT,
            barcode TEXT,
            quantity REAL,
            unit_price REAL,
            store_name TEXT,
            brand TEXT,
            store_id TEXT,
            location TEXT,
            date TEXT,
            observed_at TEXT,
            FOREIGN KEY(receipt_id) REFERENCES receipts(receipt_id)
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS price_observations (
            id TEXT PRIMARY KEY,
            receipt_id TEXT,
            receipt_item_id TEXT,
            item_name TEXT,
            barcode TEXT,
            store_name TEXT,
            location TEXT,
            date TEXT,
            quantity REAL,
            unit_price REAL,
            observed_at TEXT,
            FOREIGN KEY(receipt_id) REFERENCES receipts(receipt_id),
            FOREIGN KEY(receipt_item_id) REFERENCES receipt_items(id)
        )
        """
    )
    ensure_column(conn, "receipt_items", "barcode", "TEXT")
    ensure_column(conn, "price_observations", "barcode", "TEXT")
    conn.commit()


def save_receipt(conn, receipt):
    receipt_json = receipt.get("receiptJson") or {}
    business = receipt_json.get("business") or {}
    address = business.get("address") or {}
    gas = receipt_json.get("gas") or {}
    receipt_id = receipt["id"]

    conn.execute("DELETE FROM price_observations WHERE receipt_id=?", (receipt_id,))
    conn.execute("DELETE FROM receipt_items WHERE receipt_id=?", (receipt_id,))
    conn.execute("DELETE FROM receipts WHERE receipt_id=?", (receipt_id,))

    conn.execute(
        """
        INSERT INTO receipts (
            receipt_id, saved_at, source, original_file_name,
            handwriting_detected, brand, store_id, store_name, location,
            full_address, street, city, state, zip, date, subtotal, tax, total,
            payment_method, card_last_four, transaction_id, gas_station,
            gas_fuel_type, gas_gallons, gas_price_per_gallon, gas_total_cost,
            misc, suggested_filename, receipt_json
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """,
        (
            receipt_id,
            receipt.get("savedAt", ""),
            receipt.get("source", ""),
            receipt.get("originalFileName", ""),
            1 if receipt_json.get("handwriting_detected") else 0,
            business.get("brand", ""),
            business.get("store_id", ""),
            business.get("store_name", receipt.get("store", "")),
            business.get("location", receipt.get("location", "")),
            business.get("full_address", ""),
            address.get("street", ""),
            address.get("city", ""),
            address.get("state", ""),
            address.get("zip", ""),
            receipt_json.get("date", receipt.get("date", "")),
            receipt_json.get("subtotal", receipt.get("subtotal", 0)),
            receipt_json.get("tax", receipt.get("tax", 0)),
            receipt_json.get("total", receipt.get("total", 0)),
            receipt_json.get("payment_method", ""),
            receipt_json.get("card_last_four", ""),
            receipt_json.get("transaction_id", ""),
            1 if receipt_json.get("gas_station") else 0,
            gas.get("fuel_type", ""),
            gas.get("gallons", 0),
            gas.get("price_per_gallon", 0),
            gas.get("total_cost", 0),
            json.dumps(receipt_json.get("misc", "")) if isinstance(receipt_json.get("misc"), dict) else receipt_json.get("misc", ""),
            receipt_json.get("suggested_filename", ""),
            json.dumps(receipt_json, ensure_ascii=False),
        ),
    )

    rows = []
    for index, item in enumerate(receipt_json.get("items") or []):
        item_id = f"{receipt_id}-line-{index + 1}"
        rows.append(item_id)
        conn.execute(
            """
            INSERT INTO receipt_items (
                id, receipt_id, line_index, name, barcode, quantity, unit_price,
                store_name, brand, store_id, location, date, observed_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                item_id,
                receipt_id,
                index,
                item.get("name", ""),
                item.get("barcode", ""),
                item.get("quantity", 1),
                item.get("unit_price", 0),
                business.get("store_name", receipt.get("store", "")),
                business.get("brand", ""),
                business.get("store_id", ""),
                business.get("location", receipt.get("location", "")),
                receipt.get("date", ""),
                receipt.get("savedAt", ""),
            ),
        )
        conn.execute(
            """
            INSERT INTO price_observations (
                id, receipt_id, receipt_item_id, item_name, barcode, store_name,
                location, date, quantity, unit_price, observed_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                f"{item_id}-price",
                receipt_id,
                item_id,
                item.get("name", ""),
                item.get("barcode", ""),
                business.get("store_name", receipt.get("store", "")),
                business.get("location", receipt.get("location", "")),
                receipt.get("date", ""),
                item.get("quantity", 1),
                item.get("unit_price", 0),
                receipt.get("savedAt", ""),
            ),
        )

    conn.commit()
    return {
        "receiptId": receipt_id,
        "receiptItemsInserted": len(rows),
        "priceObservationsInserted": len(rows),
    }


def stats(conn):
    return {
        "dbPath": DB_PATH,
        "receipts": conn.execute("SELECT COUNT(*) FROM receipts").fetchone()[0],
        "receiptItems": conn.execute("SELECT COUNT(*) FROM receipt_items").fetchone()[0],
        "priceObservations": conn.execute("SELECT COUNT(*) FROM price_observations").fetchone()[0],
    }


def export_recent(conn):
    receipts = [dict(row) for row in conn.execute("SELECT * FROM receipts ORDER BY saved_at DESC LIMIT 50")]
    items = [dict(row) for row in conn.execute("SELECT * FROM receipt_items ORDER BY observed_at DESC LIMIT 500")]
    observations = [dict(row) for row in conn.execute("SELECT * FROM price_observations ORDER BY observed_at DESC LIMIT 500")]
    return {"receipts": receipts, "receiptItems": items, "priceObservations": observations}


def main():
    action = sys.argv[1] if len(sys.argv) > 1 else "stats"
    payload = json.load(sys.stdin) if not sys.stdin.isatty() else {}

    conn = connect()
    init_db(conn)
    if action == "init":
        result = stats(conn)
    elif action == "save-receipt":
        result = save_receipt(conn, payload["receipt"])
    elif action == "stats":
        result = stats(conn)
    elif action == "export":
        result = export_recent(conn)
    else:
        raise SystemExit(f"Unknown action: {action}")

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
