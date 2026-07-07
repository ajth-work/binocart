const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const worker = path.join(root, "scripts", "receipt-db-worker.py");

function runDb(action, payload, dbPath) {
  const result = spawnSync("python", [worker, action], {
    input: JSON.stringify(payload || {}),
    encoding: "utf8",
    env: { ...process.env, BINOCART_RECEIPT_DB: dbPath }
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("receipt database stores one receipt and per-item rows", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "binocart-db-"));
  const dbPath = path.join(dir, "receipts.sqlite");
  const receipt = {
    id: "receipt-test-1",
    savedAt: "2026-07-07T10:00:00.000Z",
    source: "test",
    originalFileName: "receipt.jpg",
    store: "Kroger",
    location: "Columbus, OH",
    date: "2026-07-07",
    receiptJson: {
      gas_station: false,
      handwriting_detected: false,
      business: {
        brand: "Kroger",
        store_id: "123",
        store_name: "Kroger",
        location: "Columbus, OH",
        full_address: "",
        address: { street: "", city: "Columbus", state: "OH", zip: "" }
      },
      date: "2026.07.07",
      gas: { fuel_type: "", gallons: 0, price_per_gallon: 0, total_cost: 0 },
      items: [
        { name: "Milk Gallon", barcode: "011110038342", quantity: 1, unit_price: 3.05 },
        { name: "Eggs Dozen", barcode: "", quantity: 1, unit_price: 1.89 }
      ],
      subtotal: 4.94,
      tax: 0,
      total: 4.94,
      payment_method: "",
      card_last_four: "",
      transaction_id: "",
      misc: "",
      suggested_filename: "Kroger_[2026.07.07] 000000"
    }
  };

  const saved = runDb("save-receipt", { receipt }, dbPath);
  assert.equal(saved.receiptItemsInserted, 2);
  assert.equal(saved.priceObservationsInserted, 2);

  const stats = runDb("stats", {}, dbPath);
  assert.equal(stats.receipts, 1);
  assert.equal(stats.receiptItems, 2);
  assert.equal(stats.priceObservations, 2);

  const exported = runDb("export", {}, dbPath);
  assert.equal(exported.receipts[0].store_name, "Kroger");
  assert.equal(exported.receiptItems.find((item) => item.name === "Milk Gallon").barcode, "011110038342");
  assert.equal(exported.priceObservations.find((item) => item.item_name === "Milk Gallon").barcode, "011110038342");
  assert.deepEqual(exported.receiptItems.map((item) => item.name).sort(), ["Eggs Dozen", "Milk Gallon"]);
});
