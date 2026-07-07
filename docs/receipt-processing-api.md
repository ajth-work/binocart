# Receipt Processing API Contract

BinoCart should not ship OpenAI or OCR provider credentials inside the Android app. The Capacitor app should send receipt images to a BinoCart backend, and the backend should call AI/OCR services with server-held credentials.

Confirmed receipts should eventually feed the community price database: store locations, normalized products/SKUs, observed prices, purchase dates, confidence, and user-reviewed corrections.

This document describes the current local prototype and the intended backend direction. The current implementation is a local Node API backed by OpenAI and a local SQLite database.

## Parse Receipt

`POST /api/receipts/parse`

Request:

- JSON body.
- `imageDataUrl`: browser-generated receipt image data URL.
- `textHint`: optional pasted OCR/user hint text.
- `fileName`: optional original file name.

Notes:

- The browser compresses image uploads before sending them to the local API.
- PDF support is not implemented in the current prototype.
- Provider credentials stay in `.env` or the server environment.
- Profile > Advanced UI Controls can enable a visible receipt parse debug log.

Response:

```json
{
  "ok": true,
  "receipt": {
    "store": "Kroger",
    "location": "Columbus, OH",
    "date": "2026-07-03",
    "subtotal": 13.31,
    "tax": 0.48,
    "total": 13.79,
    "source": "openai:gpt-5.4-mini",
    "items": [
      {
        "name": "Jif Creamy Peanut Butter",
        "barcode": "051500255162",
        "quantity": 1,
        "unitPrice": 2.84
      }
    ],
    "receiptJson": {}
  }
}
```

The canonical `receiptJson` shape is receipt-processor-inspired JSON:

```json
{
  "gas_station": false,
  "handwriting_detected": false,
  "business": {
    "brand": "Kroger",
    "store_id": "104",
    "store_name": "Kroger",
    "location": "Columbus, OH",
    "full_address": "",
    "address": {
      "street": "",
      "city": "Columbus",
      "state": "OH",
      "zip": ""
    }
  },
  "date": "2026.07.03",
  "items": [
    {
      "name": "Jif Creamy Peanut Butter",
      "barcode": "051500255162",
      "quantity": 1,
      "unit_price": 2.84
    }
  ],
  "subtotal": 13.31,
  "tax": 0.48,
  "total": 13.79,
  "payment_method": "",
  "card_last_four": "",
  "transaction_id": "",
  "misc": "",
  "suggested_filename": "Kroger_[2026.07.03] 000000"
}
```

The parser and review UI normalize barcode aliases such as `barcode_number`, `barcodeNumber`, `upc`, `ean`, `sku`, `product_code`, `productCode`, `item_code`, and `itemCode` into `items[].barcode`.

## Save Reviewed Receipt

`POST /api/receipts/save`

The app sends the user-reviewed receipt. Confirmed line items become community price observations with this shape:

```json
{
  "itemName": "Jif Creamy Peanut Butter",
  "normalizedProductId": null,
  "storeName": "Kroger",
  "locationText": "Columbus, OH",
  "date": "2026-07-03",
  "unitPrice": 2.84,
  "quantity": 1,
  "barcode": "051500255162",
  "source": "receipt-confirmed"
}
```

The current local save path writes to browser localStorage profile memory and to SQLite:

```text
data/binocart-receipts.sqlite
```

Tables:

- `receipts`: one row per reviewed receipt JSON artifact.
- `receipt_items`: one row per purchased line item.
- `price_observations`: one market-price observation per receipt item.

## Other Local API Endpoints

`GET /api/receipts/health`

Returns model, OpenAI-key presence, and database stats without exposing the key.

`GET /api/receipts/export`

Exports recent local receipt, item, and price-observation rows for inspection.

## Current App Surfaces

- Receipts page: upload image, paste text, parse with OpenAI, review item tiles, edit barcode/UPC, and save.
- Profile page: receipt memory cards, receipt detail modal, JSON download, and first-pass price memory graph.

## Security Notes

- Require user auth before accepting community observations.
- Rate-limit uploads by account and device.
- Store original receipt images separately from normalized price observations.
- Treat AI/OCR output as untrusted until the user confirms it.
- Keep provider API keys only in backend environment variables.
- Deduplicate repeated receipt submissions and preserve enough source metadata to audit questionable observations later.
- Treat barcode/product-code values from receipts as unverified until reconciled against scanned UPCs, trusted product catalogs, or user-reviewed product identities.
