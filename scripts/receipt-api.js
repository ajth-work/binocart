const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

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

async function parseReceiptWithOpenAI({ imageDataUrl, textHint = "", fileName = "" }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Create .env from .env.example.");
  }
  if (!imageDataUrl?.startsWith("data:image/")) {
    throw new Error("Receipt parsing currently requires an image file.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
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
                '{"store":"","location":"","date":"YYYY-MM-DD","subtotal":0,"tax":0,"total":0,"items":[{"name":"","quantity":1,"unitPrice":0}]}',
                "Use null only when a numeric value is not visible. Do not invent line items.",
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `OpenAI request failed with HTTP ${response.status}.`);
  }

  const outputText = data.output_text
    || data.output?.flatMap((item) => item.content || []).map((item) => item.text).filter(Boolean).join("\n")
    || "";
  const parsed = parseModelJson(outputText);
  return {
    store: parsed.store || "Unknown store",
    location: parsed.location || "Confirm location",
    date: parsed.date || new Date().toISOString().slice(0, 10),
    subtotal: Number(parsed.subtotal || 0),
    tax: Number(parsed.tax || 0),
    total: Number(parsed.total || 0),
    source: `openai:${model}`,
    items: Array.isArray(parsed.items)
      ? parsed.items.map((item) => ({
        name: String(item.name || "").trim(),
        quantity: Number(item.quantity || 1),
        unitPrice: Number(item.unitPrice || 0)
      })).filter((item) => item.name)
      : []
  };
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") return send(response, 204, {});
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
  console.log(`BinoCart receipt API listening at http://127.0.0.1:${port}`);
});
