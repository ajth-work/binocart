const profileKey = "binocart.profile.v1";
const legacyProfileKey = "pricescout.profile.v1";

const els = {
  profileName: document.querySelector("#profileName"),
  profileButton: document.querySelector("#profileButton"),
  profileNameInput: document.querySelector("#profileNameInput"),
  profileForm: document.querySelector("#profileForm"),
  profileStats: document.querySelector("#profileStats"),
  supabaseConfigForm: document.querySelector("#supabaseConfigForm"),
  supabaseUrlInput: document.querySelector("#supabaseUrlInput"),
  supabaseAnonKeyInput: document.querySelector("#supabaseAnonKeyInput"),
  clearSupabaseConfig: document.querySelector("#clearSupabaseConfig"),
  authEmailForm: document.querySelector("#authEmailForm"),
  authEmailInput: document.querySelector("#authEmailInput"),
  authEmailSubmit: document.querySelector("#authEmailSubmit"),
  authModePill: document.querySelector("#authModePill"),
  authSummary: document.querySelector("#authSummary"),
  authStatusMessage: document.querySelector("#authStatusMessage"),
  refreshAuthSession: document.querySelector("#refreshAuthSession"),
  signOutButton: document.querySelector("#signOutButton"),
  groupCards: document.querySelector("#groupCards"),
  newGroupQuick: document.querySelector("#newGroupQuick"),
  historyList: document.querySelector("#historyList"),
  clearHistory: document.querySelector("#clearHistory"),
  savedList: document.querySelector("#savedList"),
  receiptFile: document.querySelector("#receiptFile"),
  receiptFileName: document.querySelector("#receiptFileName"),
  receiptPreview: document.querySelector("#receiptPreview"),
  receiptTextInput: document.querySelector("#receiptTextInput"),
  receiptApiBase: document.querySelector("#receiptApiBase"),
  receiptApiStatus: document.querySelector("#receiptApiStatus"),
  receiptDebugLog: document.querySelector("#receiptDebugLog"),
  parseReceiptOpenAI: document.querySelector("#parseReceiptOpenAI"),
  parseReceiptText: document.querySelector("#parseReceiptText"),
  parseReceiptDemo: document.querySelector("#parseReceiptDemo"),
  addReceiptItem: document.querySelector("#addReceiptItem"),
  resetReceiptReview: document.querySelector("#resetReceiptReview"),
  receiptForm: document.querySelector("#receiptForm"),
  receiptStore: document.querySelector("#receiptStore"),
  receiptLocation: document.querySelector("#receiptLocation"),
  receiptDate: document.querySelector("#receiptDate"),
  receiptItems: document.querySelector("#receiptItems"),
  receiptSubtotal: document.querySelector("#receiptSubtotal"),
  receiptTax: document.querySelector("#receiptTax"),
  receiptTotal: document.querySelector("#receiptTotal"),
  receiptReviewSummary: document.querySelector("#receiptReviewSummary"),
  receiptHistory: document.querySelector("#receiptHistory"),
  receiptHistoryCount: document.querySelector("#receiptHistoryCount"),
  receiptDetailModal: document.querySelector("#receiptDetailModal"),
  receiptDetailTitle: document.querySelector("#receiptDetailTitle"),
  receiptDetailContent: document.querySelector("#receiptDetailContent"),
  closeReceiptDetail: document.querySelector("#closeReceiptDetail"),
  showLabelsToggle: document.querySelector("#showLabelsToggle"),
  navStyleToggle: document.querySelector("#navStyleToggle"),
  blurRange: document.querySelector("#blurRange"),
  blurValue: document.querySelector("#blurValue"),
  pulsePreviewToggle: document.querySelector("#pulsePreviewToggle"),
  pulseFastSnapToggle: document.querySelector("#pulseFastSnapToggle"),
  receiptDebugToggle: document.querySelector("#receiptDebugToggle"),
  navPlusAction: document.querySelector("#navPlusAction"),
  actionOverlay: document.querySelector("#actionOverlay"),
  closeActions: document.querySelector("#closeActions"),
  actionBarcodeScan: document.querySelector("#actionBarcodeScan"),
  plusButtonToggle: document.querySelector("#plusButtonToggle")
};

let profile = null;
let receiptDraft = null;
let receiptImageDataUrl = "";
const receiptApiBaseKey = "binocart.receiptApiBase.v1";
const receiptRequestTimeoutMs = 45000;
let authUiStatus = '';

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultProfile() {
  const weeklyId = makeId("group");
  return {
    id: makeId("profile"),
    name: "My profile",
    activeGroupId: weeklyId,
    groups: [
      { id: weeklyId, name: "Weekly staples", items: [] },
      { id: makeId("group"), name: "Snacks for Derek", items: [] }
    ],
    history: [],
    saved: [],
    archivedGroups: [],
    archivedSaved: [],
    receipts: [],
    receiptLineItems: [],
    priceObservations: [],
    showMenuLabels: false,
    menuBlur: 2,
    navStyle: "fab",
    pulsePreview: false,
    pulseFastSnap: false,
    receiptDebugLog: false
  };
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(profileKey) || localStorage.getItem(legacyProfileKey));
    profile = stored?.id ? stored : defaultProfile();
  } catch (error) {
    profile = defaultProfile();
  }

  profile.groups = Array.isArray(profile.groups) && profile.groups.length ? profile.groups : defaultProfile().groups;
  profile.history = Array.isArray(profile.history) ? profile.history : [];
  profile.saved = Array.isArray(profile.saved) ? profile.saved : [];
  profile.archivedGroups = Array.isArray(profile.archivedGroups) ? profile.archivedGroups : [];
  profile.archivedSaved = Array.isArray(profile.archivedSaved) ? profile.archivedSaved : [];
  profile.receipts = Array.isArray(profile.receipts) ? profile.receipts : [];
  profile.receiptLineItems = Array.isArray(profile.receiptLineItems) ? profile.receiptLineItems : [];
  profile.priceObservations = Array.isArray(profile.priceObservations) ? profile.priceObservations : [];
  profile.showMenuLabels = typeof profile.showMenuLabels === "boolean" ? profile.showMenuLabels : false;
  profile.menuBlur = typeof profile.menuBlur === "number" ? profile.menuBlur : 2;
  profile.pulsePreview = typeof profile.pulsePreview === "boolean" ? profile.pulsePreview : false;
  profile.pulseFastSnap = typeof profile.pulseFastSnap === "boolean" ? profile.pulseFastSnap : false;
  profile.receiptDebugLog = typeof profile.receiptDebugLog === "boolean" ? profile.receiptDebugLog : false;
  profile.navStyle = "navbar";
  profile.showPlusButton = false;

  document.body?.classList.toggle("nav-style-navbar", profile.navStyle === "navbar");
  document.body?.classList.toggle("hide-nav-plus", true);

  if (!profile.activeGroupId || !profile.groups.some((group) => group.id === profile.activeGroupId)) {
    profile.activeGroupId = profile.groups[0].id;
  }
}

function saveProfile() {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

function authState() {
  return window.BinoCartAuth?.getState?.() || {
    authAvailable: Boolean(window.supabase?.createClient),
    configured: false,
    ready: true,
    session: null,
    user: null,
    error: ""
  };
}

function renderAuthPanel() {
  if (els.supabaseUrlInput) els.supabaseUrlInput.value = window.BinoCartAuth?.getConfig?.().url || "";
  if (els.supabaseAnonKeyInput) els.supabaseAnonKeyInput.value = window.BinoCartAuth?.getConfig?.().anonKey || "";
  if (!els.authSummary) return;

  const state = authState();
  const hasUser = Boolean(state.user?.email);
  const isConfigured = Boolean(state.configured);

  if (els.authModePill) {
    els.authModePill.className = "auth-pill";
    if (hasUser) {
      els.authModePill.textContent = "Signed in";
      els.authModePill.classList.add("success");
    } else if (isConfigured) {
      els.authModePill.textContent = "Guest sync-ready";
      els.authModePill.classList.add("warning");
    } else {
      els.authModePill.textContent = "Guest";
    }
  }

  if (hasUser) {
    els.authSummary.textContent = `Signed in as ${state.user.email}. Guest mode is no longer your only path.`;
  } else if (!state.authAvailable) {
    els.authSummary.textContent = "Guest mode is active. Supabase client loading is unavailable right now.";
  } else if (!isConfigured) {
    els.authSummary.textContent = "Guest mode is active on this device. Add your Supabase URL and anon key to enable email sign-in.";
  } else if (!state.ready) {
    els.authSummary.textContent = "Supabase is configured. Checking your saved session now.";
  } else {
    els.authSummary.textContent = "Supabase is configured. Send a magic link when you are ready to sign in.";
  }

  if (els.authEmailSubmit) els.authEmailSubmit.disabled = !state.authAvailable || !isConfigured;
  if (els.signOutButton) els.signOutButton.disabled = !hasUser;
  if (els.refreshAuthSession) els.refreshAuthSession.disabled = !state.authAvailable || !isConfigured;
  if (els.authStatusMessage) els.authStatusMessage.textContent = authUiStatus || state.error || "";
}

function hasPriceProfile(product) {
  return Array.isArray(product?.stores) && product.stores.length > 0;
}

function bestStore(product) {
  if (!hasPriceProfile(product)) return null;
  return [...product.stores].sort((a, b) => a.price - b.price)[0];
}

function basketLabel(count) {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

function updateProfileHeader() {
  if (els.profileName) els.profileName.textContent = profile.name;
  if (els.profileButton) els.profileButton.title = `Profile: ${profile.name}`;
  if (els.showLabelsToggle) els.showLabelsToggle.checked = profile.showMenuLabels;
  if (els.pulsePreviewToggle) els.pulsePreviewToggle.checked = profile.pulsePreview;
  if (els.pulseFastSnapToggle) els.pulseFastSnapToggle.checked = profile.pulseFastSnap;
  if (els.receiptDebugToggle) els.receiptDebugToggle.checked = profile.receiptDebugLog;
  if (els.navStyleToggle) els.navStyleToggle.checked = profile.navStyle === "navbar";
  if (els.blurRange) {
    els.blurRange.value = profile.menuBlur;
    if (els.blurValue) els.blurValue.textContent = `${profile.menuBlur}px`;
  }
}

function createGroup(name = "New list") {
  const group = { id: makeId("group"), name, items: [] };
  profile.groups.push(group);
  profile.activeGroupId = group.id;
  saveProfile();
  renderCurrentPage();
}

function archiveGroup(groupId) {
  if (profile.groups.length <= 1) return;
  const group = profile.groups.find((item) => item.id === groupId);
  if (!group) return;
  if (!window.confirm(`Archive "${group.name}" and its ${basketLabel(group.items.length)}?`)) return;

  profile.archivedGroups.unshift({ ...group, archivedAt: new Date().toISOString() });
  profile.groups = profile.groups.filter((item) => item.id !== groupId);
  if (profile.activeGroupId === groupId) {
    profile.activeGroupId = profile.groups[0].id;
  }
  saveProfile();
  renderCurrentPage();
}

function restoreArchivedGroup(groupId) {
  const group = profile.archivedGroups.find((item) => item.id === groupId);
  if (!group) return;

  profile.archivedGroups = profile.archivedGroups.filter((item) => item.id !== groupId);
  profile.groups.push({
    id: group.id,
    name: group.name,
    items: Array.isArray(group.items) ? group.items : []
  });
  profile.activeGroupId = group.id;
  saveProfile();
  renderCurrentPage();
}

function deleteArchivedGroup(groupId) {
  const group = profile.archivedGroups.find((item) => item.id === groupId);
  if (!group) return;
  if (!window.confirm(`Permanently delete archived list "${group.name}"?`)) return;

  profile.archivedGroups = profile.archivedGroups.filter((item) => item.id !== groupId);
  saveProfile();
  renderCurrentPage();
}

function renameGroup(groupId) {
  const group = profile.groups.find((item) => item.id === groupId);
  if (!group) return;
  const nextName = window.prompt("Rename list", group.name)?.trim();
  if (!nextName || nextName === group.name) return;

  group.name = nextName;
  saveProfile();
  renderCurrentPage();
}

function addProductToActiveGroup(product) {
  const group = profile.groups.find((item) => item.id === profile.activeGroupId) || profile.groups[0];
  if (!group.items.some((item) => item.upc === product.upc)) group.items.push(product);
  saveProfile();
}

function archiveSavedProduct(upc) {
  const product = profile.saved.find((item) => item.upc === upc);
  if (!product) return;

  profile.saved = profile.saved.filter((item) => item.upc !== upc);
  profile.archivedSaved.unshift({ ...product, archivedAt: new Date().toISOString() });
  saveProfile();
  renderCurrentPage();
}

function restoreArchivedSaved(upc) {
  const product = profile.archivedSaved.find((item) => item.upc === upc);
  if (!product) return;

  profile.archivedSaved = profile.archivedSaved.filter((item) => item.upc !== upc);
  profile.saved.unshift(product);
  saveProfile();
  renderCurrentPage();
}

function deleteArchivedSaved(upc) {
  const product = profile.archivedSaved.find((item) => item.upc === upc);
  if (!product) return;
  if (!window.confirm(`Permanently delete archived product "${product.name}"?`)) return;

  profile.archivedSaved = profile.archivedSaved.filter((item) => item.upc !== upc);
  saveProfile();
  renderCurrentPage();
}

function mockParsedReceipt() {
  return {
    store: "Kroger",
    location: "Columbus, OH",
    date: new Date().toISOString().slice(0, 10),
    subtotal: 13.31,
    tax: 0.48,
    total: 13.79,
    source: "demo parser",
    items: [
      { name: "Jif Creamy Peanut Butter", barcode: "", quantity: 1, unitPrice: 2.84 },
      { name: "Chobani Oatmilk Original", barcode: "", quantity: 1, unitPrice: 3.98 },
      { name: "Kleenex Trusted Care Tissues", barcode: "", quantity: 1, unitPrice: 5.99 }
    ]
  };
}

function updateReceiptDebugVisibility() {
  if (!els.receiptDebugLog) return;
  els.receiptDebugLog.classList.toggle("hidden", !profile.receiptDebugLog);
  if (profile.receiptDebugLog && !els.receiptDebugLog.innerHTML.trim()) {
    els.receiptDebugLog.innerHTML = `<div class="receipt-debug-line">Receipt debug log ready.</div>`;
  }
}

function logReceiptDebug(message, detail = "") {
  if (!profile?.receiptDebugLog || !els.receiptDebugLog) return;
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const detailText = detail
    ? ` ${typeof detail === "string" ? detail : JSON.stringify(detail)}`
    : "";
  els.receiptDebugLog.innerHTML += `<div class="receipt-debug-line">[${escapeHtml(now)}] ${escapeHtml(message)}${escapeHtml(detailText)}</div>`;
  const lines = els.receiptDebugLog.querySelectorAll(".receipt-debug-line");
  if (lines.length > 40) lines[0].remove();
  els.receiptDebugLog.scrollTop = els.receiptDebugLog.scrollHeight;
}

function parseReceiptDate(text) {
  const match = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/);
  if (!match) return new Date().toISOString().slice(0, 10);
  const [, month, day, rawYear] = match;
  const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function cleanReceiptItemName(value) {
  return value
    .replace(/\b(?:qty|quantity|item|total|sale|regular|price|each|ea)\b/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseReceiptLine(line) {
  const normalized = line.replace(/\$/g, "").replace(/\s+/g, " ").trim();
  if (!normalized || /^(subtotal|tax|total|change|cash|card|visa|mastercard|amex|debit|credit)\b/i.test(normalized)) return null;

  const priceMatch = normalized.match(/(-?\d+\.\d{2})(?!.*-?\d+\.\d{2})/);
  if (!priceMatch) return null;

  const unitPrice = Number(priceMatch[1]);
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return null;

  const beforePrice = normalized.slice(0, priceMatch.index).trim();
  const afterPrice = normalized.slice(priceMatch.index + priceMatch[0].length).trim();
  const quantityMatch = beforePrice.match(/\b(\d+)\s*(?:x|@)?\s*$/i) || afterPrice.match(/^(?:x\s*)?(\d+)\b/i);
  const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;
  const rawName = quantityMatch && beforePrice.endsWith(quantityMatch[0])
    ? beforePrice.slice(0, -quantityMatch[0].length)
    : beforePrice;
  const name = cleanReceiptItemName(rawName);

  if (!name || name.length < 3) return null;
  return { name, quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1, unitPrice };
}

function parseReceiptText(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const items = lines.map(parseReceiptLine).filter(Boolean);
  const subtotalLine = lines.find((line) => /^subtotal\b/i.test(line));
  const taxLine = lines.find((line) => /^tax\b/i.test(line));
  const totalLine = [...lines].reverse().find((line) => /^total\b/i.test(line));
  const numberFromLine = (line) => Number(line?.replace(/\$/g, "").match(/-?\d+\.\d{2}/)?.[0] || 0);
  const itemTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const storeLine = lines.find((line) => !parseReceiptLine(line) && !/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(line));

  return {
    store: storeLine || "Unknown store",
    location: "Confirm location",
    date: parseReceiptDate(lines.join("\n")),
    subtotal: numberFromLine(subtotalLine) || itemTotal,
    tax: numberFromLine(taxLine),
    total: numberFromLine(totalLine) || itemTotal + numberFromLine(taxLine),
    source: "text parser",
    items
  };
}

function dateForReceiptJson(date) {
  return String(date || new Date().toISOString().slice(0, 10)).replaceAll("-", ".");
}

function makeSuggestedReceiptFilename(store, date) {
  const safeStore = String(store || "UnknownStore").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "UnknownStore";
  return `${safeStore}_[${dateForReceiptJson(date)}] 000000`;
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

function buildCanonicalReceiptJson(receipt) {
  const existing = receipt.receiptJson || {};
  const business = existing.business || {};
  const address = business.address || {};
  return {
    gas_station: Boolean(existing.gas_station),
    handwriting_detected: Boolean(existing.handwriting_detected),
    business: {
      brand: business.brand || receipt.store || "",
      store_id: business.store_id || "",
      store_name: business.store_name || receipt.store || "",
      location: business.location || receipt.location || "",
      full_address: business.full_address || "",
      address: {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || ""
      }
    },
    date: dateForReceiptJson(receipt.date),
    gas: {
      fuel_type: existing.gas?.fuel_type || "",
      gallons: Number(existing.gas?.gallons || 0),
      price_per_gallon: Number(existing.gas?.price_per_gallon || 0),
      total_cost: Number(existing.gas?.total_cost || 0)
    },
    items: receipt.items.map((item) => ({
      name: item.name,
      barcode: itemBarcode(item),
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.unitPrice || item.unit_price || 0)
    })),
    subtotal: Number(receipt.subtotal || 0),
    tax: Number(receipt.tax || 0),
    total: Number(receipt.total || 0),
    payment_method: existing.payment_method || "",
    card_last_four: existing.card_last_four || "",
    transaction_id: existing.transaction_id || "",
    misc: existing.misc || "",
    suggested_filename: existing.suggested_filename || makeSuggestedReceiptFilename(receipt.store, receipt.date)
  };
}

function buildReceiptLineItems(receipt) {
  return receipt.receiptJson.items.map((item, index) => ({
    id: makeId("receipt-line"),
    receiptId: receipt.id,
    lineIndex: index,
    itemName: item.name,
    barcode: item.barcode || "",
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unit_price || 0),
    store: receipt.receiptJson.business.store_name || receipt.store,
    brand: receipt.receiptJson.business.brand || "",
    storeId: receipt.receiptJson.business.store_id || "",
    location: receipt.receiptJson.business.location || receipt.location,
    date: receipt.date,
    source: receipt.source,
    observedAt: receipt.savedAt
  }));
}

async function persistReceiptToDatabase(receipt) {
  logReceiptDebug("Saving reviewed receipt to database", {
    store: receipt.store,
    items: receipt.items.length,
    api: receiptApiBase()
  });
  try {
    const response = await fetchWithTimeout(`${receiptApiBase()}/api/receipts/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receipt })
    }, 12000);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Receipt database save failed.");
    if (els.receiptApiStatus) {
      els.receiptApiStatus.textContent = `Saved to receipt database: ${data.database.receiptItemsInserted} line rows.`;
    }
    logReceiptDebug("Database save complete", data.database);
  } catch (error) {
    if (els.receiptApiStatus) {
      els.receiptApiStatus.textContent = `Saved locally, but database sync failed: ${error.message}`;
    }
    logReceiptDebug("Database save failed", error.message);
  }
}

function defaultReceiptApiBase() {
  const { protocol, hostname } = window.location;
  if (hostname && hostname !== "127.0.0.1" && hostname !== "localhost") {
    return `${protocol}//${hostname}:8787`;
  }
  return "http://127.0.0.1:8787";
}

function receiptApiBase() {
  const params = new URLSearchParams(window.location.search);
  const queryBase = params.get("receiptApi") || params.get("apiBase");
  if (queryBase) {
    localStorage.setItem(receiptApiBaseKey, queryBase);
    return queryBase.replace(/\/$/, "");
  }
  return (localStorage.getItem(receiptApiBaseKey) || defaultReceiptApiBase()).replace(/\/$/, "");
}

function updateReceiptApiBaseField() {
  if (!els.receiptApiBase) return;
  els.receiptApiBase.value = receiptApiBase();
}

function fetchWithTimeout(url, options = {}, timeoutMs = receiptRequestTimeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("Could not read receipt image.")));
    reader.readAsDataURL(file);
  });
}

function compressReceiptImage(dataUrl) {
  return new Promise((resolve) => {
    if (typeof Image === "undefined" || !document.createElement) return resolve(dataUrl);

    const image = new Image();
    image.addEventListener("load", () => {
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      if (scale >= 1) return resolve(dataUrl);

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      if (!context) return resolve(dataUrl);

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    });
    image.addEventListener("error", () => resolve(dataUrl));
    image.src = dataUrl;
  });
}

async function parseReceiptWithOpenAI() {
  if (!els.parseReceiptOpenAI) return;
  if (!receiptImageDataUrl) {
    if (els.receiptApiStatus) els.receiptApiStatus.textContent = "Choose a receipt image before using OpenAI parsing.";
    logReceiptDebug("Parse blocked because no image is ready");
    return;
  }

  const previousLabel = els.parseReceiptOpenAI.textContent;
  els.parseReceiptOpenAI.disabled = true;
  els.parseReceiptOpenAI.textContent = "Parsing...";
  if (els.receiptApiStatus) els.receiptApiStatus.textContent = "Sending receipt image to local OpenAI API...";
  logReceiptDebug("Starting OpenAI receipt parse", {
    api: receiptApiBase(),
    imageChars: receiptImageDataUrl.length,
    hasTextHint: Boolean(els.receiptTextInput?.value)
  });

  try {
    if (els.receiptApiStatus) els.receiptApiStatus.textContent = "Checking receipt API health...";
    const health = await fetchWithTimeout(`${receiptApiBase()}/api/receipts/health`, { method: "GET" }, 8000);
    if (!health.ok) throw new Error("Receipt API is reachable but not healthy.");
    const healthData = await health.json().catch(() => ({}));
    logReceiptDebug("Receipt API health check passed", {
      model: healthData.model || "unknown",
      hasOpenAiKey: Boolean(healthData.hasOpenAiKey),
      database: healthData.database || "database status unavailable"
    });
    if (!healthData.hasOpenAiKey) {
      throw new Error("Receipt API is running, but its OpenAI API key is not configured on the server.");
    }

    if (els.receiptApiStatus) els.receiptApiStatus.textContent = "Receipt API ready. Sending image to OpenAI...";
    const response = await fetchWithTimeout(`${receiptApiBase()}/api/receipts/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl: receiptImageDataUrl,
        textHint: els.receiptTextInput?.value || "",
        fileName: els.receiptFile?.files?.[0]?.name || ""
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Receipt API request failed.");
    renderReceiptReview(data.receipt);
    if (els.receiptApiStatus) els.receiptApiStatus.textContent = `Parsed with ${data.receipt.source}. Review before saving.`;
    logReceiptDebug("OpenAI parse complete", {
      source: data.receipt.source,
      store: data.receipt.store,
      items: data.receipt.items.length
    });
  } catch (error) {
    const message = error.name === "AbortError"
      ? "Receipt parsing timed out. Check the API URL, server log, or try a clearer/smaller image."
      : error.message;
    if (els.receiptApiStatus) els.receiptApiStatus.textContent = message;
    logReceiptDebug("OpenAI parse failed", message);
  } finally {
    els.parseReceiptOpenAI.disabled = false;
    els.parseReceiptOpenAI.textContent = previousLabel;
  }
}

function receiptItemRow(item = {}, index = 0) {
  return `
    <div class="receipt-item-row" data-receipt-item="${index}">
      <div class="receipt-item-row-header">
        <span>Item ${index + 1}</span>
        <small>Receipt line</small>
      </div>
      <label class="receipt-item-name"><span>Item</span><input type="text" value="${escapeHtml(item.name || "")}" aria-label="Receipt item name ${index + 1}" /></label>
      <label><span>Barcode / UPC</span><input type="text" inputmode="numeric" value="${escapeHtml(itemBarcode(item))}" aria-label="Receipt item barcode ${index + 1}" placeholder="UPC" /></label>
      <label><span>Qty</span><input type="number" min="0" step="1" value="${item.quantity || 1}" aria-label="Receipt item quantity ${index + 1}" /></label>
      <label><span>Price</span><input type="number" min="0" step="0.01" value="${Number(item.unitPrice || 0).toFixed(2)}" aria-label="Receipt item price ${index + 1}" /></label>
    </div>
  `;
}

function updateReceiptReviewSummary() {
  if (!els.receiptReviewSummary) return;
  const rows = [...(els.receiptItems?.querySelectorAll("[data-receipt-item]") || [])];
  const parsedLineTotal = rows.reduce((sum, row) => {
    const inputs = row.querySelectorAll("input");
    const quantity = Number(inputs[2]?.value || 0);
    const unitPrice = Number(inputs[3]?.value || 0);
    return sum + quantity * unitPrice;
  }, 0);
  const subtotal = Number(els.receiptSubtotal?.value || 0);
  const tax = Number(els.receiptTax?.value || 0);
  const total = Number(els.receiptTotal?.value || 0);
  els.receiptReviewSummary.innerHTML = `
    <div><span>Items</span><strong>${rows.length}</strong></div>
    <div><span>Line total</span><strong>${money(parsedLineTotal)}</strong></div>
    <div><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div><span>Tax</span><strong>${money(tax)}</strong></div>
    <div><span>Total</span><strong>${money(total)}</strong></div>
  `;
}

function addReceiptReviewRow(item = {}) {
  if (!els.receiptItems) return;
  const index = els.receiptItems.querySelectorAll("[data-receipt-item]").length;
  els.receiptItems.insertAdjacentHTML("beforeend", receiptItemRow(item, index));
  els.receiptForm?.classList.remove("hidden");
  updateReceiptReviewSummary();
}

function renderReceiptReview(receipt) {
  if (!els.receiptForm) return;
  receiptDraft = receipt;
  els.receiptForm.classList.remove("hidden");
  els.receiptStore.value = receipt.store || "";
  els.receiptLocation.value = receipt.location || "";
  els.receiptDate.value = receipt.date || new Date().toISOString().slice(0, 10);
  els.receiptSubtotal.value = Number(receipt.subtotal || 0).toFixed(2);
  els.receiptTax.value = Number(receipt.tax || 0).toFixed(2);
  els.receiptTotal.value = Number(receipt.total || 0).toFixed(2);
  els.receiptItems.innerHTML = (receipt.items.length ? receipt.items : [{}]).map(receiptItemRow).join("");
  updateReceiptReviewSummary();
}

function clearReceiptReview() {
  receiptDraft = null;
  els.receiptForm?.classList.add("hidden");
  if (els.receiptItems) els.receiptItems.innerHTML = "";
  if (els.receiptReviewSummary) els.receiptReviewSummary.innerHTML = "";
}

function readReceiptReview() {
  const items = [...els.receiptItems.querySelectorAll("[data-receipt-item]")].map((row) => {
    const [nameInput, barcodeInput, quantityInput, priceInput] = row.querySelectorAll("input");
    return {
      name: nameInput.value.trim(),
      barcode: barcodeInput.value.trim(),
      quantity: Number(quantityInput.value) || 1,
      unitPrice: Number(priceInput.value) || 0
    };
  }).filter((item) => item.name);

  const receipt = {
    id: makeId("receipt"),
    store: els.receiptStore.value.trim() || "Unknown store",
    location: els.receiptLocation.value.trim() || "Unknown location",
    date: els.receiptDate.value || new Date().toISOString().slice(0, 10),
    subtotal: Number(els.receiptSubtotal.value) || 0,
    tax: Number(els.receiptTax.value) || 0,
    total: Number(els.receiptTotal.value) || 0,
    source: receiptDraft?.source || "manual review",
    originalFileName: els.receiptFile?.files?.[0]?.name || "",
    savedAt: new Date().toISOString(),
    items
  };
  receipt.receiptJson = buildCanonicalReceiptJson({
    ...receipt,
    receiptJson: receiptDraft?.receiptJson
  });
  return receipt;
}

function saveReceiptFromReview() {
  const receipt = readReceiptReview();
  if (receipt.items.length === 0) return;
  const lineItems = buildReceiptLineItems(receipt);

  profile.receipts.unshift(receipt);
  profile.receiptLineItems.unshift(...lineItems);
  profile.priceObservations.unshift(...lineItems.map((item) => ({
    id: makeId("price"),
    receiptId: receipt.id,
    receiptLineItemId: item.id,
    itemName: item.itemName,
    barcode: item.barcode,
    store: item.store,
    location: item.location,
    date: item.date,
    quantity: item.quantity,
    unitPrice: item.unitPrice
  })));
  profile.receipts = profile.receipts.slice(0, 50);
  profile.receiptLineItems = profile.receiptLineItems.slice(0, 1000);
  profile.priceObservations = profile.priceObservations.slice(0, 500);
  saveProfile();
  clearReceiptReview();
  renderCurrentPage();
  persistReceiptToDatabase(receipt);
}

function renderReceiptHistory() {
  if (!els.receiptHistory) return;
  if (els.receiptHistoryCount) els.receiptHistoryCount.textContent = profile.receipts.length;
  els.receiptHistory.innerHTML = profile.receipts.length
    ? profile.receipts.map((receipt) => `
      <article class="history-card">
        <div>
          <strong>${receipt.store}</strong>
          <p class="subtle">${receipt.location} - ${receipt.date}</p>
          <p class="subtle">${receipt.items.length} items - ${money(receipt.total)}</p>
        </div>
        <div class="card-actions">
          <button class="ghost-btn" type="button" data-download-receipt-json="${receipt.id}">JSON</button>
          <a class="ghost-btn" href="profile.html">Profile</a>
        </div>
      </article>
    `).join("")
    : `<div class="basket-empty">Parsed receipts will appear here after review.</div>`;
}

function downloadReceiptJson(receiptId) {
  const receipt = profile.receipts.find((item) => item.id === receiptId);
  if (!receipt?.receiptJson) return;

  const blob = new Blob([JSON.stringify(receipt.receiptJson, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${receipt.receiptJson.suggested_filename || receipt.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function renderReceiptDetail(receipt) {
  const items = Array.isArray(receipt.items) ? receipt.items : [];
  const lineTotal = items.reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.unitPrice || item.unit_price || 0), 0);
  return `
    <div class="receipt-detail-summary">
      <div><span>Store</span><strong>${escapeHtml(receipt.store || "Unknown store")}</strong></div>
      <div><span>Date</span><strong>${escapeHtml(receipt.date || "")}</strong></div>
      <div><span>Items</span><strong>${items.length}</strong></div>
      <div><span>Total</span><strong>${money(receipt.total || 0)}</strong></div>
    </div>
    <div class="receipt-detail-meta">
      <p>${escapeHtml(receipt.location || "Unknown location")}</p>
      <p>${escapeHtml(receipt.source || "manual review")}</p>
    </div>
    <div class="receipt-detail-items">
      ${items.map((item, index) => `
        <article class="receipt-detail-item">
          <div>
            <span>Item ${index + 1}</span>
            <strong>${escapeHtml(item.name || "Unnamed item")}</strong>
            <p>${itemBarcode(item) ? `Barcode ${escapeHtml(itemBarcode(item))}` : "No barcode captured"}</p>
          </div>
          <div>
            <span>Qty</span>
            <strong>${Number(item.quantity || 1)}</strong>
          </div>
          <div>
            <span>Price</span>
            <strong>${money(Number(item.unitPrice || item.unit_price || 0))}</strong>
          </div>
        </article>
      `).join("")}
    </div>
    <div class="receipt-detail-totals">
      <div><span>Line total</span><strong>${money(lineTotal)}</strong></div>
      <div><span>Subtotal</span><strong>${money(receipt.subtotal || 0)}</strong></div>
      <div><span>Tax</span><strong>${money(receipt.tax || 0)}</strong></div>
      <div><span>Total</span><strong>${money(receipt.total || 0)}</strong></div>
    </div>
    <div class="basket-actions">
      <button class="ghost-btn" type="button" data-download-receipt-json="${receipt.id}">Download JSON</button>
    </div>
  `;
}

function openReceiptDetail(receiptId) {
  const receipt = profile.receipts.find((item) => item.id === receiptId);
  if (!receipt || !els.receiptDetailModal || !els.receiptDetailContent) return;
  if (els.receiptDetailTitle) els.receiptDetailTitle.textContent = `${receipt.store || "Receipt"} - ${receipt.date || ""}`;
  els.receiptDetailContent.innerHTML = renderReceiptDetail(receipt);
  els.receiptDetailModal.classList.remove("hidden");
}

function closeReceiptDetail() {
  els.receiptDetailModal?.classList.add("hidden");
}

function productListCard(product, source) {
  const image = product.imageUrl
    ? `<img src="${product.imageUrl}" alt="" />`
    : `<div class="history-thumb">UPC</div>`;
  return `
    <article class="history-card">
      <div class="history-product">
        ${image}
        <div>
          <strong>${product.name}</strong>
          <p class="subtle">${product.brand} - ${product.size}</p>
          ${product.scannedAt ? `<p class="subtle">${new Date(product.scannedAt).toLocaleString()}</p>` : ""}
        </div>
      </div>
      <div class="card-actions">
        <a class="ghost-btn" href="index.html?lookup=${encodeURIComponent(product.upc)}">View</a>
        ${hasPriceProfile(product) ? `<button class="ghost-btn" type="button" data-add-snapshot="${product.upc}" data-source="${source}">Add</button>` : ""}
        ${source === "saved" ? `<button class="ghost-btn archive-btn" type="button" data-archive-saved="${product.upc}">Archive</button>` : ""}
      </div>
    </article>
  `;
}

function renderGroups() {
  if (!els.groupCards) return;
  els.groupCards.innerHTML = profile.groups.map((group) => {
    const pricedItems = group.items.filter(hasPriceProfile);
    const total = pricedItems.reduce((sum, product) => sum + (bestStore(product)?.price || 0), 0);
    return `
      <article class="group-card">
        <header>
          <div>
            <div class="group-title-row">
              <h3>${group.name}</h3>
              <button class="icon-edit-btn" type="button" data-rename-group="${group.id}" aria-label="Rename ${group.name}" title="Rename list">&#9998;</button>
            </div>
            <p class="subtle">${basketLabel(group.items.length)} - best-item total ${money(total)}</p>
          </div>
          <div class="card-actions">
            <a class="ghost-btn" href="index.html?group=${encodeURIComponent(group.id)}">Open</a>
            <button class="ghost-btn archive-btn" type="button" data-archive-group="${group.id}" ${profile.groups.length <= 1 ? "disabled" : ""}>Archive</button>
          </div>
        </header>
        <div class="basket-list">
          ${group.items.length ? group.items.map((product) => `
            <div class="basket-item">
              <div>
                <strong>${product.name}</strong>
                <p>${product.size} - ${hasPriceProfile(product) ? `${money(bestStore(product).price)} at ${bestStore(product).name}` : "needs local price"}</p>
              </div>
            </div>
          `).join("") : `<div class="basket-empty">No items in this group yet.</div>`}
        </div>
      </article>
    `;
  }).join("");
}

function renderHistory() {
  if (!els.historyList) return;
  els.historyList.innerHTML = profile.history.length
    ? profile.history.map((product) => productListCard(product, "history")).join("")
    : `<div class="basket-empty">Scanned products will appear here automatically.</div>`;
}

function renderSaved() {
  if (!els.savedList) return;
  els.savedList.innerHTML = profile.saved.length
    ? profile.saved.map((product) => productListCard(product, "saved")).join("")
    : `<div class="basket-empty">Save products you buy often, then add them back to a list quickly.</div>`;
}

function groupPriceObservations() {
  const groups = new Map();
  profile.priceObservations.forEach((observation) => {
    if (!observation.itemName || !Number.isFinite(Number(observation.unitPrice))) return;
    const key = observation.barcode || observation.itemName.toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: observation.itemName,
        barcode: observation.barcode || "",
        observations: []
      });
    }
    groups.get(key).observations.push({
      date: observation.date || "",
      store: observation.store || "Unknown store",
      unitPrice: Number(observation.unitPrice)
    });
  });
  return [...groups.values()]
    .map((group) => ({
      ...group,
      observations: group.observations.sort((a, b) => String(a.date).localeCompare(String(b.date)))
    }))
    .sort((a, b) => b.observations.length - a.observations.length || a.name.localeCompare(b.name));
}

function renderPriceMemoryGraph() {
  const groups = groupPriceObservations();
  if (!groups.length) {
    return `<div class="basket-empty">Save a few parsed receipts to start building price memory.</div>`;
  }

  const tracked = groups[0];
  const points = tracked.observations;
  const prices = points.map((point) => point.unitPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const width = 640;
  const height = 220;
  const pad = 28;
  const span = Math.max(0.01, maxPrice - minPrice);
  const xStep = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;
  const coords = points.map((point, index) => {
    const x = points.length > 1 ? pad + index * xStep : width / 2;
    const y = height - pad - ((point.unitPrice - minPrice) / span) * (height - pad * 2);
    return { ...point, x, y };
  });
  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const first = points[0];
  const latest = points[points.length - 1];
  const delta = latest.unitPrice - first.unitPrice;
  const deltaLabel = `${delta >= 0 ? "+" : ""}${money(delta)}`;

  return `
    <article class="price-memory-card">
      <div class="price-memory-header">
        <div>
          <span class="eyebrow">Tracked item</span>
          <h4>${escapeHtml(tracked.name)}</h4>
          <p class="subtle">${tracked.barcode ? `Barcode ${escapeHtml(tracked.barcode)} - ` : ""}${points.length} observations</p>
        </div>
        <div class="price-memory-delta ${delta > 0 ? "up" : delta < 0 ? "down" : ""}">
          <span>Since first receipt</span>
          <strong>${deltaLabel}</strong>
        </div>
      </div>
      <svg class="price-memory-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(tracked.name)} price graph">
        <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" />
        <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" />
        ${path ? `<path d="${path}" />` : ""}
        ${coords.map((point) => `
          <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="6" />
          <text x="${point.x.toFixed(1)}" y="${Math.max(16, point.y - 12).toFixed(1)}">${money(point.unitPrice)}</text>
        `).join("")}
      </svg>
      <div class="price-memory-foot">
        <span>${escapeHtml(first.date || "First receipt")} at ${escapeHtml(first.store)}</span>
        <span>${escapeHtml(latest.date || "Latest receipt")} at ${escapeHtml(latest.store)}</span>
      </div>
      <div class="price-memory-items">
        ${groups.slice(0, 4).map((group) => `
          <div>
            <strong>${escapeHtml(group.name)}</strong>
            <span>${group.observations.length} obs - latest ${money(group.observations[group.observations.length - 1].unitPrice)}</span>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderProfile() {
  renderAuthPanel();
  if (els.profileNameInput) els.profileNameInput.value = profile.name;
  if (els.navStyleToggle) els.navStyleToggle.checked = profile.navStyle === "navbar";
  if (els.plusButtonToggle) els.plusButtonToggle.checked = false;
  if (els.showLabelsToggle) els.showLabelsToggle.checked = profile.showMenuLabels;
  if (els.pulsePreviewToggle) els.pulsePreviewToggle.checked = profile.pulsePreview;
  if (els.pulseFastSnapToggle) els.pulseFastSnapToggle.checked = profile.pulseFastSnap;
  if (els.receiptDebugToggle) els.receiptDebugToggle.checked = profile.receiptDebugLog;
  if (els.blurRange) els.blurRange.value = profile.menuBlur;
  if (els.blurValue) els.blurValue.textContent = `${profile.menuBlur}px`;
  if (!els.profileStats) return;
  const recentReceipts = profile.receipts.slice(0, 5).map((receipt) => `
    <article class="archive-row receipt-memory-row" role="button" tabindex="0" data-view-receipt="${receipt.id}">
      <div>
        <strong>${receipt.store}</strong>
        <p class="subtle">${receipt.location} - ${receipt.date} - ${receipt.items.length} items</p>
      </div>
      <strong>${money(receipt.total)}</strong>
    </article>
  `).join("");
  const archivedGroups = profile.archivedGroups.map((group) => `
    <article class="archive-row">
      <div>
        <strong>${group.name}</strong>
        <p class="subtle">${basketLabel(Array.isArray(group.items) ? group.items.length : 0)} archived ${new Date(group.archivedAt).toLocaleDateString()}</p>
      </div>
      <div class="card-actions">
        <button class="ghost-btn" type="button" data-restore-group="${group.id}">Restore</button>
        <button class="ghost-btn danger-btn" type="button" data-delete-archived-group="${group.id}">Delete</button>
      </div>
    </article>
  `).join("");
  const archivedSaved = profile.archivedSaved.map((product) => `
    <article class="archive-row">
      <div>
        <strong>${product.name}</strong>
        <p class="subtle">${product.brand} - ${product.size} archived ${new Date(product.archivedAt).toLocaleDateString()}</p>
      </div>
      <div class="card-actions">
        <button class="ghost-btn" type="button" data-restore-saved="${product.upc}">Restore</button>
        <button class="ghost-btn danger-btn" type="button" data-delete-archived-saved="${product.upc}">Delete</button>
      </div>
    </article>
  `).join("");
  els.profileStats.innerHTML = `
    <article class="profile-card">
      <strong>${profile.name}</strong>
      <p class="subtle">${authState().user?.email ? `Signed in as ${authState().user.email}. Core Supabase sync is now enabled for Phase 1 groundwork.` : `Guest profile on this device. Supabase sign-in is optional while sync is being phased in.`}</p>
      <p>${profile.groups.length} list groups - ${profile.history.length} recent scans - ${profile.saved.length} saved products - ${profile.receipts.length} receipts - ${profile.receiptLineItems.length} receipt line rows - ${profile.priceObservations.length} price observations</p>
    </article>
    <section class="archive-section">
      <div class="section-heading">
        <h3>Receipt memory</h3>
        <span>${profile.receipts.length}</span>
      </div>
      ${recentReceipts || `<div class="basket-empty">Receipt history will appear here after you save reviewed receipts.</div>`}
    </section>
    <section class="archive-section">
      <div class="section-heading">
        <h3>Price memory graph</h3>
        <span>${profile.priceObservations.length}</span>
      </div>
      ${renderPriceMemoryGraph()}
    </section>
    <section class="archive-section">
      <div class="section-heading">
        <h3>Archived lists</h3>
        <span>${profile.archivedGroups.length}</span>
      </div>
      ${archivedGroups || `<div class="basket-empty">Archived lists will appear here.</div>`}
    </section>
    <section class="archive-section">
      <div class="section-heading">
        <h3>Archived saved products</h3>
        <span>${profile.archivedSaved.length}</span>
      </div>
      ${archivedSaved || `<div class="basket-empty">Archived saved products will appear here.</div>`}
    </section>
  `;
}

function renderCurrentPage() {
  updateProfileHeader();
  updateReceiptApiBaseField();
  updateReceiptDebugVisibility();
  renderGroups();
  renderHistory();
  renderSaved();
  renderReceiptHistory();
  renderProfile();
}

function handleProductAction(event) {
  const addButton = event.target.closest("[data-add-snapshot]");
  const archiveButton = event.target.closest("[data-archive-saved]");
  if (addButton) {
    const source = addButton.dataset.source === "saved" ? profile.saved : profile.history;
    const product = source.find((item) => item.upc === addButton.dataset.addSnapshot);
    if (product) addProductToActiveGroup(product);
  }
  if (archiveButton) archiveSavedProduct(archiveButton.dataset.archiveSaved);
}

function handleGroupAction(event) {
  const renameButton = event.target.closest("[data-rename-group]");
  const archiveButton = event.target.closest("[data-archive-group]");
  if (renameButton) renameGroup(renameButton.dataset.renameGroup);
  if (archiveButton) archiveGroup(archiveButton.dataset.archiveGroup);
}

function handleProfileArchiveAction(event) {
  const restoreGroupButton = event.target.closest("[data-restore-group]");
  const restoreSavedButton = event.target.closest("[data-restore-saved]");
  const deleteGroupButton = event.target.closest("[data-delete-archived-group]");
  const deleteSavedButton = event.target.closest("[data-delete-archived-saved]");
  if (restoreGroupButton) restoreArchivedGroup(restoreGroupButton.dataset.restoreGroup);
  if (restoreSavedButton) restoreArchivedSaved(restoreSavedButton.dataset.restoreSaved);
  if (deleteGroupButton) deleteArchivedGroup(deleteGroupButton.dataset.deleteArchivedGroup);
  if (deleteSavedButton) deleteArchivedSaved(deleteSavedButton.dataset.deleteArchivedSaved);
}

function handleReceiptHistoryAction(event) {
  const downloadButton = event.target.closest("[data-download-receipt-json]");
  if (downloadButton) downloadReceiptJson(downloadButton.dataset.downloadReceiptJson);
}

function handleProfileReceiptAction(event) {
  const receiptButton = event.target.closest("[data-view-receipt]");
  const downloadButton = event.target.closest("[data-download-receipt-json]");
  if (downloadButton) {
    event.stopPropagation();
    downloadReceiptJson(downloadButton.dataset.downloadReceiptJson);
    return true;
  }
  if (receiptButton) {
    openReceiptDetail(receiptButton.dataset.viewReceipt);
    return true;
  }
  return false;
}

function setupRadialMenu() {
  const menu = document.querySelector("#radialMenu");
  const toggle = document.querySelector("#menuToggle");
  const overlay = document.querySelector("#radialOverlay");

  if (!menu || !toggle || !overlay) return;

  menu.classList.toggle("show-labels", profile?.showMenuLabels ?? false);
  overlay.style.backdropFilter = `blur(${profile?.menuBlur ?? 5}px)`;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  overlay.addEventListener("click", () => {
    menu.classList.remove("open");
  });
}

loadProfile();
setupRadialMenu();
window.addEventListener?.('binocart-auth-change', () => {
  renderCurrentPage();
});
renderCurrentPage();

els.newGroupQuick?.addEventListener("click", () => createGroup());
els.clearHistory?.addEventListener("click", () => {
  profile.history = [];
  saveProfile();
  renderCurrentPage();
});
els.profileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  profile.name = els.profileNameInput.value.trim() || "My profile";
  saveProfile();
  renderCurrentPage();
});
els.supabaseConfigForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  authUiStatus = "Saving Supabase config...";
  renderAuthPanel();
  try {
    await window.BinoCartAuth?.setConfig?.(els.supabaseUrlInput?.value, els.supabaseAnonKeyInput?.value);
    authUiStatus = "Supabase config saved.";
  } catch (error) {
    authUiStatus = error?.message || "Could not save Supabase config.";
  }
  renderCurrentPage();
});
els.clearSupabaseConfig?.addEventListener("click", async () => {
  authUiStatus = "Clearing Supabase config...";
  renderAuthPanel();
  try {
    await window.BinoCartAuth?.clearConfig?.();
    authUiStatus = "Supabase config cleared. Guest mode remains available.";
  } catch (error) {
    authUiStatus = error?.message || "Could not clear Supabase config.";
  }
  renderCurrentPage();
});
els.authEmailForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  authUiStatus = "Sending magic link...";
  renderAuthPanel();
  try {
    const result = await window.BinoCartAuth?.signInWithOtp?.(els.authEmailInput?.value || "");
    authUiStatus = `Magic link sent to ${result?.email || els.authEmailInput?.value || "your email"}.`;
  } catch (error) {
    authUiStatus = error?.message || "Could not send magic link.";
  }
  renderAuthPanel();
});
els.refreshAuthSession?.addEventListener("click", async () => {
  authUiStatus = "Refreshing Supabase session...";
  renderAuthPanel();
  try {
    await window.BinoCartAuth?.init?.();
    authUiStatus = authState().user?.email ? `Session refreshed for ${authState().user.email}.` : "No saved session found. Guest mode is still active.";
  } catch (error) {
    authUiStatus = error?.message || "Could not refresh session.";
  }
  renderCurrentPage();
});
els.signOutButton?.addEventListener("click", async () => {
  authUiStatus = "Signing out...";
  renderAuthPanel();
  try {
    await window.BinoCartAuth?.signOut?.();
    authUiStatus = "Signed out. Guest mode is still available on this device.";
  } catch (error) {
    authUiStatus = error?.message || "Could not sign out.";
  }
  renderCurrentPage();
});
els.navStyleToggle?.addEventListener("change", (event) => {
  profile.navStyle = event.target.checked ? "navbar" : "fab";
  document.body.classList.toggle("nav-style-navbar", event.target.checked);
  saveProfile();
});
els.showLabelsToggle?.addEventListener("change", (event) => {
  profile.showMenuLabels = event.target.checked;
  const menu = document.querySelector("#radialMenu");
  if (menu) menu.classList.toggle("show-labels", profile.showMenuLabels);
  saveProfile();
});
els.pulsePreviewToggle?.addEventListener("change", (event) => {
  profile.pulsePreview = event.target.checked;
  saveProfile();
});
els.pulseFastSnapToggle?.addEventListener("change", (event) => {
  profile.pulseFastSnap = event.target.checked;
  saveProfile();
});
els.receiptDebugToggle?.addEventListener("change", (event) => {
  profile.receiptDebugLog = event.target.checked;
  saveProfile();
  updateReceiptDebugVisibility();
  logReceiptDebug(event.target.checked ? "Receipt debug log enabled" : "Receipt debug log disabled");
});
els.blurRange?.addEventListener("input", (event) => {
  const val = Number(event.target.value);
  profile.menuBlur = val;
  if (els.blurValue) els.blurValue.textContent = `${val}px`;
  const overlay = document.querySelector("#radialOverlay");
  if (overlay) overlay.style.backdropFilter = `blur(${val}px)`;
  saveProfile();
});
els.historyList?.addEventListener("click", handleProductAction);
els.savedList?.addEventListener("click", handleProductAction);
els.groupCards?.addEventListener("click", handleGroupAction);
els.profileStats?.addEventListener("click", (event) => {
  if (!handleProfileReceiptAction(event)) handleProfileArchiveAction(event);
});
els.profileStats?.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && handleProfileReceiptAction(event)) event.preventDefault();
});
els.closeReceiptDetail?.addEventListener("click", closeReceiptDetail);
els.receiptDetailModal?.addEventListener("click", (event) => {
  if (event.target === els.receiptDetailModal) closeReceiptDetail();
});
els.receiptDetailContent?.addEventListener("click", handleReceiptHistoryAction);
els.receiptHistory?.addEventListener("click", handleReceiptHistoryAction);
els.receiptFile?.addEventListener("change", async () => {
  const file = els.receiptFile.files?.[0];
  if (!file) return;
  els.receiptFileName.textContent = file.name;
  receiptImageDataUrl = "";
  logReceiptDebug("Receipt file selected", { name: file.name, type: file.type || "unknown", bytes: file.size || 0 });
  if (file.type.startsWith("image/")) {
    const url = URL.createObjectURL(file);
    els.receiptPreview.innerHTML = `<img src="${url}" alt="Uploaded receipt preview" />`;
    if (els.receiptApiStatus) els.receiptApiStatus.textContent = "Preparing receipt image...";
    try {
      receiptImageDataUrl = await compressReceiptImage(await readFileAsDataUrl(file));
      if (els.receiptApiStatus) els.receiptApiStatus.textContent = "Receipt image ready. Tap Parse with OpenAI.";
      logReceiptDebug("Receipt image prepared for parsing", { imageChars: receiptImageDataUrl.length });
    } catch (error) {
      if (els.receiptApiStatus) els.receiptApiStatus.textContent = error.message;
      logReceiptDebug("Receipt image preparation failed", error.message);
    }
  } else {
    els.receiptPreview.innerHTML = `<div class="basket-empty">${file.name} selected. PDF preview can come with backend processing.</div>`;
    if (els.receiptApiStatus) els.receiptApiStatus.textContent = "Receipt parsing currently needs an image file.";
    logReceiptDebug("Receipt file is not an image; OpenAI image parsing skipped");
  }
});
els.receiptApiBase?.addEventListener("change", () => {
  localStorage.setItem(receiptApiBaseKey, els.receiptApiBase.value.trim().replace(/\/$/, ""));
  updateReceiptApiBaseField();
});
els.parseReceiptOpenAI?.addEventListener("click", parseReceiptWithOpenAI);
els.parseReceiptDemo?.addEventListener("click", () => renderReceiptReview(mockParsedReceipt()));
els.parseReceiptText?.addEventListener("click", () => {
  logReceiptDebug("Parsing pasted receipt text", { chars: (els.receiptTextInput?.value || "").length });
  const parsed = parseReceiptText(els.receiptTextInput?.value || "");
  renderReceiptReview(parsed);
  logReceiptDebug("Pasted receipt text parsed", { store: parsed.store, items: parsed.items.length });
});
els.addReceiptItem?.addEventListener("click", () => addReceiptReviewRow());
els.resetReceiptReview?.addEventListener("click", clearReceiptReview);
els.receiptForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveReceiptFromReview();
});
els.receiptForm?.addEventListener("input", updateReceiptReviewSummary);


