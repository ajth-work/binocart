const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const port = Number(process.env.BINOCART_RECEIPT_API_PORT || 8787);
const model = process.env.OPENAI_RECEIPT_MODEL || "gpt-5.5";
const openAiTimeoutMs = Number(process.env.OPENAI_RECEIPT_TIMEOUT_MS || 45000);
const dbWorker = path.join(__dirname, "receipt-db-worker.py");

function runDb(action, payload = {}) {
  const result = spawnSync("python", [dbWorker, action], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    env: process.env
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `Database worker failed with exit ${result.status}.`);
  }
  return JSON.parse(result.stdout || "{}");
}

function send(response, status, body) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
      if (data.length > 12 * 1024 * 1024) {
        request.destroy();
        reject(new Error("Receipt payload is too large."));
      }
    });
    request.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function parseModelJson(outputText) {
  const trimmed = String(outputText || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw error;
    return JSON.parse(match[0]);
  }
}

function itemBarcode(item) {
  return String(
    item.barcode
    || item.barcode_number
    || item.barcodeNumber
    || item.upc
    || item.ean
    || item.sku
    || item.product_code
    || item.productCode
    || item.item_code
    || item.itemCode
    || ""
  ).trim();
}

function normalizeReceiptJson(parsed) {
  const business = parsed.business || {};
  const address = business.address || {};
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  return {
    gas_station: Boolean(parsed.gas_station),
    handwriting_detected: Boolean(parsed.handwriting_detected),
    business: {
      brand: business.brand || parsed.store || "",
      store_id: business.store_id || "",
      store_name: business.store_name || parsed.store || business.brand || "",
      location: business.location || parsed.location || "",
      full_address: business.full_address || "",
      address: {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || ""
      }
    },
    date: parsed.date || "",
    gas: {
      fuel_type: parsed.gas?.fuel_type || "",
      gallons: Number(parsed.gas?.gallons || 0),
      price_per_gallon: Number(parsed.gas?.price_per_gallon || 0),
      total_cost: Number(parsed.gas?.total_cost || 0)
    },
    items: items.map((item) => ({
      name: String(item.name || "").trim(),
      barcode: itemBarcode(item),
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.unit_price ?? item.unitPrice ?? 0)
    })).filter((item) => item.name),
    subtotal: Number(parsed.subtotal || 0),
    tax: Number(parsed.tax || 0),
    total: Number(parsed.total || 0),
    payment_method: parsed.payment_method || "",
    card_last_four: parsed.card_last_four || "",
    transaction_id: parsed.transaction_id || "",
    misc: parsed.misc || "",
    suggested_filename: parsed.suggested_filename || ""
  };
}

function receiptJsonToReviewReceipt(receiptJson) {
  return {
    store: receiptJson.business.store_name || receiptJson.business.brand || "Unknown store",
    location: receiptJson.business.location || receiptJson.business.full_address || "Confirm location",
    date: String(receiptJson.date || new Date().toISOString().slice(0, 10)).replaceAll(".", "-"),
    subtotal: receiptJson.subtotal,
    tax: receiptJson.tax,
    total: receiptJson.total,
    source: `openai:${model}`,
    receiptJson,
    items: receiptJson.items.map((item) => ({
      name: item.name,
      barcode: item.barcode || "",
      quantity: item.quantity,
      unitPrice: item.unit_price
    }))
  };
}

async function parseReceiptWithOpenAI({ imageDataUrl, textHint = "", fileName = "" }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Create .env from .env.example.");
  }
  if (!imageDataUrl?.startsWith("data:image/")) {
    throw new Error("Receipt parsing currently requires an image file.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), openAiTimeoutMs);
  let response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: [
                  "Extract this grocery or retail receipt into strict JSON.",
                  "Return only JSON with this shape:",
                  '{"gas_station":false,"handwriting_detected":false,"business":{"brand":"","store_id":"","store_name":"","location":"","full_address":"","address":{"street":"","city":"","state":"","zip":""}},"date":"YYYY.MM.DD","gas":{"fuel_type":"","gallons":0,"price_per_gallon":0,"total_cost":0},"items":[{"name":"","barcode":"","quantity":1,"unit_price":0}],"subtotal":0,"tax":0,"total":0,"payment_method":"","card_last_four":"","transaction_id":"","misc":"","suggested_filename":""}',
                  "Use null only when a numeric value is not visible. Do not invent line items.",
                  "If a receipt has no product line items, return an empty items array rather than guessing.",
                  "If a line item includes a UPC, EAN, SKU, barcode, or product code, put the visible numeric code in item.barcode; otherwise use an empty string.",
                  "Use the business logo/header to identify brand and store_name when OCR text is weak.",
                  "If the business name contains a number, put the base brand in brand and the number in store_id.",
                  "Use suggested_filename format StoreName_[YYYY.MM.DD] HHMMSS, using 000000 when time is unavailable.",
                  textHint ? `User hint or OCR text:\n${textHint}` : "",
                  fileName ? `File name: ${fileName}` : ""
                ].filter(Boolean).join("\n")
              },
              { type: "input_image", image_url: imageDataUrl }
            ]
          }
        ]
      })
    });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("OpenAI receipt parsing timed out.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `OpenAI request failed with HTTP ${response.status}.`);
  }

  const outputText = data.output_text
    || data.output?.flatMap((item) => item.content || []).map((item) => item.text).filter(Boolean).join("\n")
    || "";
  return receiptJsonToReviewReceipt(normalizeReceiptJson(parseModelJson(outputText)));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") return send(response, 204, {});
  if (request.method === "GET" && request.url === "/api/receipts/health") {
    return send(response, 200, {
      ok: true,
      model,
      hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY),
      database: runDb("stats")
    });
  }
  if (request.method === "GET" && request.url === "/api/receipts/export") {
    return send(response, 200, runDb("export"));
  }
  if (request.method === "POST" && request.url === "/api/receipts/save") {
    try {
      const payload = await readJson(request);
      return send(response, 200, { ok: true, database: runDb("save-receipt", payload) });
    } catch (error) {
      return send(response, 400, { error: error.message });
    }
  }
  if (request.method !== "POST" || request.url !== "/api/receipts/parse") {
    return send(response, 404, { error: "Not found" });
  }

  try {
    const payload = await readJson(request);
    const receipt = await parseReceiptWithOpenAI(payload);
    return send(response, 200, { receipt });
  } catch (error) {
    return send(response, 400, { error: error.message });
  }
});

server.listen(port, () => {
  runDb("init");
  console.log(`BinoCart receipt API listening at http://127.0.0.1:${port}`);
});
