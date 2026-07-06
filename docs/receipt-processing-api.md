# Receipt Processing API Contract

BinoCart should not ship OpenAI or OCR provider credentials inside the Android app. The Capacitor app should send receipt images to a BinoCart backend, and the backend should call AI/OCR services with server-held credentials.

Confirmed receipts should eventually feed the community price database: store locations, normalized products/SKUs, observed prices, purchase dates, confidence, and user-reviewed corrections.

## Parse Receipt

`POST /api/receipts/parse`

Request:

- `multipart/form-data`
- `receipt`: image or PDF file
- `clientReceiptId`: app-generated id for retry safety
- `capturedAt`: ISO timestamp
- `timezone`: IANA timezone, such as `America/New_York`

Response:

```json
{
  "receiptId": "receipt_123",
  "status": "review_required",
  "store": {
    "name": "Kroger",
    "locationText": "Columbus, OH",
    "address": "",
    "latitude": null,
    "longitude": null
  },
  "purchaseDate": "2026-07-03",
  "items": [
    {
      "lineId": "line_1",
      "rawText": "JIF CREAMY 16OZ",
      "name": "Jif Creamy Peanut Butter",
      "quantity": 1,
      "unitPrice": 2.84,
      "totalPrice": 2.84,
      "upc": "",
      "confidence": 0.82
    }
  ],
  "subtotal": 13.31,
  "tax": 0.48,
  "total": 13.79
}
```

## Confirm Receipt

`POST /api/receipts/{receiptId}/confirm`

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
  "source": "receipt-confirmed"
}
```

## Security Notes

- Require user auth before accepting community observations.
- Rate-limit uploads by account and device.
- Store original receipt images separately from normalized price observations.
- Treat AI/OCR output as untrusted until the user confirms it.
- Keep provider API keys only in backend environment variables.
- Deduplicate repeated receipt submissions and preserve enough source metadata to audit questionable observations later.
