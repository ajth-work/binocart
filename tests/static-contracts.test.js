const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const pages = ["index.html", "scan.html", "list.html", "receipts.html", "history.html", "saved.html", "profile.html"];
const primaryNav = [
  { href: "index.html", label: "Intel" },
  { href: "scan.html", label: "Scan" },
  { href: "list.html", label: "List" },
  { href: "receipts.html", label: "Receipts" },
  { href: "history.html", label: "History" },
  { href: "saved.html", label: "Saved" },
  { href: "profile.html", label: "Profile" }
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("all public pages include shared navigation targets", () => {
  for (const page of pages) {
    const html = read(page);
    for (const target of pages) {
      assert.match(html, new RegExp(`href="${target}"`), `${page} should link to ${target}`);
    }
  }
});

test("all public pages use the same primary navigation order", () => {
  for (const page of pages) {
    const html = read(page);
    const nav = html.match(/<nav aria-label="Primary">([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, `${page} should include primary navigation`);

    const links = [...nav.matchAll(/<a class="nav-btn(?: active)?" href="([^"]+)">([^<]+)<\/a>/g)]
      .map((match) => ({ href: match[1], label: match[2] }));
    assert.deepEqual(links, primaryNav, `${page} should use the shared primary nav`);
  }
});

test("pages load the expected static script", () => {
  assert.match(read("index.html"), /<script src="app\.js\?v=/);
  assert.match(read("scan.html"), /<script src="app\.js\?v=/);

  for (const page of pages.filter((name) => !["index.html", "scan.html"].includes(name))) {
    assert.match(read(page), /<script src="pages\.js\?v=/, `${page} should load pages.js`);
  }
});

test("scan page exposes camera controls and scan actions target scanner startup", () => {
  const scan = read("scan.html");
  const app = read("app.js");
  assert.match(scan, /id="startCamera"/);
  assert.match(scan, /id="stopCamera"/);
  assert.match(scan, /id="demoScan"/);
  assert.match(app, /startCamera:\s*document\.querySelector\("#startCamera"\)/);
  assert.match(app, /stopCamera:\s*document\.querySelector\("#stopCamera"\)/);
  assert.match(app, /els\.startCamera\?\.addEventListener\("click", startCamera\)/);
  assert.match(app, /els\.stopCamera\?\.addEventListener\("click", stopCamera\)/);
  assert.match(app, /initialParams\.get\("scan"\) === "true"\)\s*startCamera\(\)/);

  for (const page of pages) {
    const html = read(page);
    assert.doesNotMatch(html, /href="index\.html\?scan=true"/, `${page} should not route scanner startup to Intel`);
    if (html.includes("Barcode Scan")) {
      assert.match(html, /href="scan\.html\?scan=true"[\s\S]*?<span>Barcode Scan<\/span>/, `${page} should route Barcode Scan actions to scanner startup`);
    }
  }

  assert.match(read("index.html"), /href="scan\.html\?scan=true" class="primary-btn scan-hero-btn"/);
});

test("receipts page exposes intake controls for receipt scanning", () => {
  const receipts = read("receipts.html");
  const pages = read("pages.js");

  assert.match(receipts, /id="receiptFile"[^>]+accept="image\/\*,\.pdf"[^>]+capture="environment"/);
  assert.match(receipts, /id="receiptTextInput"/);
  assert.match(receipts, /id="receiptApiBase"/);
  assert.match(receipts, /id="receiptDebugLog"/);
  assert.match(receipts, /id="receiptReviewSummary"/);
  assert.match(receipts, /Barcode \/ UPC/);
  assert.match(receipts, /id="parseReceiptOpenAI"/);
  assert.match(receipts, /id="parseReceiptText"/);
  assert.match(receipts, /id="addReceiptItem"/);
  assert.match(read("profile.html"), /id="receiptDebugToggle"/);
  assert.match(pages, /function parseReceiptText\(text\)/);
  assert.match(pages, /function parseReceiptWithOpenAI\(\)/);
  assert.match(pages, /function logReceiptDebug\(message/);
  assert.match(pages, /function updateReceiptReviewSummary\(\)/);
  assert.match(pages, /function receiptApiBase\(\)/);
  assert.match(pages, /hasOpenAiKey/);
  assert.match(pages, /function fetchWithTimeout\(url/);
  assert.match(pages, /function compressReceiptImage\(dataUrl\)/);
  assert.match(pages, /function buildCanonicalReceiptJson\(receipt\)/);
  assert.match(pages, /function buildReceiptLineItems\(receipt\)/);
  assert.match(pages, /function itemBarcode\(item\)/);
  assert.match(pages, /barcode_number/);
  assert.match(pages, /barcode: item\.barcode/);
  assert.match(pages, /function persistReceiptToDatabase\(receipt\)/);
  assert.match(pages, /function downloadReceiptJson\(receiptId\)/);
  assert.match(pages, /\/api\/receipts\/health/);
  assert.match(pages, /\/api\/receipts\/save/);
  assert.match(pages, /\$\{receiptApiBase\(\)\}\/api\/receipts\/parse/);
  assert.match(pages, /profile\.receiptLineItems\.unshift/);
  assert.match(pages, /profile\.priceObservations\.unshift/);
  assert.match(pages, /function renderPriceMemoryGraph\(\)/);
  assert.match(pages, /Price memory graph/);
  assert.match(read("profile.html"), /id="receiptDetailModal"/);
  assert.match(pages, /function openReceiptDetail\(receiptId\)/);
  assert.match(pages, /data-view-receipt/);
});

test("receipt OpenAI API keeps credentials server-side", () => {
  const api = read("scripts/receipt-api.js");
  const dbWorker = read("scripts/receipt-db-worker.py");
  const env = read(".env.example");
  const ignore = read(".gitignore");

  assert.match(api, /process\.env\.OPENAI_API_KEY/);
  assert.match(api, /receipt-db-worker\.py/);
  assert.match(api, /\/api\/receipts\/save/);
  assert.match(api, /\/api\/receipts\/export/);
  assert.match(api, /https:\/\/api\.openai\.com\/v1\/responses/);
  assert.match(api, /OPENAI_RECEIPT_TIMEOUT_MS/);
  assert.match(api, /\/api\/receipts\/health/);
  assert.match(api, /function normalizeReceiptJson\(parsed\)/);
  assert.match(api, /function itemBarcode\(item\)/);
  assert.match(api, /product_code/);
  assert.match(api, /unit_price/);
  assert.match(api, /input_image/);
  assert.match(dbWorker, /CREATE TABLE IF NOT EXISTS receipts/);
  assert.match(dbWorker, /CREATE TABLE IF NOT EXISTS receipt_items/);
  assert.match(dbWorker, /CREATE TABLE IF NOT EXISTS price_observations/);
  assert.match(env, /OPENAI_API_KEY=/);
  assert.match(env, /BINOCART_RECEIPT_DB=/);
  assert.match(ignore, /^\.env$/m);
  assert.match(ignore, /^data\/$/m);
  assert.doesNotMatch(read("pages.js"), /OPENAI_API_KEY/);
});

test("Codespaces configuration forwards the web and receipt API ports", () => {
  const devcontainer = read(".devcontainer/devcontainer.json");
  const scripts = JSON.parse(read("package.json")).scripts;

  assert.match(devcontainer, /"forwardPorts": \[4173, 8787\]/);
  assert.equal(scripts["dev:web"], "node scripts/serve-static.js 4173");
  assert.equal(scripts["api:receipts"], "node scripts/receipt-api.js");
});

test("brand manifest points to files that exist", () => {
  const manifest = read("assets/brand/manifest.csv").trim().split(/\r?\n/).slice(1);
  assert.ok(manifest.length > 20, "expected a populated brand asset manifest");

  for (const row of manifest) {
    const assetPath = row.match(/^"([^"]+)"/)?.[1];
    assert.ok(assetPath, `could not parse manifest row: ${row}`);
    assert.ok(fs.existsSync(path.join(root, "assets/brand", assetPath)), `${assetPath} should exist`);
  }
});

test("raw brand uploads stay isolated from usable app assets", () => {
  const rawDir = path.join(root, "assets/brand/reference/raw");
  const rawFiles = fs.readdirSync(rawDir).filter((name) => name.endsWith(".png"));

  assert.ok(rawFiles.length >= 40, "expected raw uploaded screenshots to be preserved");
  assert.ok(fs.existsSync(path.join(root, "assets/brand/icons/app/app-icon-green-1024.png")));
  assert.ok(fs.existsSync(path.join(root, "assets/brand/logos/horizontal/logo-primary-horizontal.png")));
});
