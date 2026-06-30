const products = {
  "04963406": {
    upc: "04963406",
    name: "Chobani Oatmilk Original",
    brand: "Chobani",
    size: "52 fl oz",
    category: "Dairy alternatives",
    stores: [
      { name: "Kroger", price: 4.49, distance: "1.2 mi", confidence: "Updated today" },
      { name: "Walmart", price: 3.98, distance: "2.5 mi", confidence: "Updated 2 hr ago" },
      { name: "Meijer", price: 4.29, distance: "3.1 mi", confidence: "Updated yesterday" },
      { name: "Aldi", price: 3.89, distance: "4.4 mi", confidence: "Likely in stock" }
    ],
    history: [4.79, 4.69, 4.59, 4.49, 4.29, 3.98],
    alternative: { name: "Friendly Farms Oatmilk", store: "Aldi", price: 2.95 },
    insight: "This is a good time to buy: the best local price is down 17% from its six-month high, and Aldi has an even cheaper store-brand option."
  },
  "041570052057": {
    upc: "041570052057",
    name: "Jif Creamy Peanut Butter",
    brand: "J.M. Smucker",
    size: "16 oz",
    category: "Pantry",
    stores: [
      { name: "Kroger", price: 3.49, distance: "1.2 mi", confidence: "Updated today" },
      { name: "Walmart", price: 2.84, distance: "2.5 mi", confidence: "Updated today" },
      { name: "Meijer", price: 3.19, distance: "3.1 mi", confidence: "Updated 5 hr ago" },
      { name: "Aldi", price: 2.99, distance: "4.4 mi", confidence: "Likely in stock" }
    ],
    history: [2.79, 2.89, 2.89, 2.99, 3.09, 2.84],
    alternative: { name: "Great Value Creamy Peanut Butter", store: "Walmart", price: 2.18 },
    insight: "Walmart is the clear buy for the name brand, but the store-brand jar saves another 23% with a very similar size."
  },
  "036000291452": {
    upc: "036000291452",
    name: "Kleenex Trusted Care Tissues",
    brand: "Kleenex",
    size: "3 pack",
    category: "Household",
    stores: [
      { name: "Kroger", price: 6.99, distance: "1.2 mi", confidence: "Updated yesterday" },
      { name: "Walmart", price: 5.88, distance: "2.5 mi", confidence: "Updated today" },
      { name: "Meijer", price: 6.49, distance: "3.1 mi", confidence: "Updated today" },
      { name: "Aldi", price: 5.79, distance: "4.4 mi", confidence: "Limited availability" }
    ],
    history: [4.99, 5.29, 5.49, 5.79, 6.19, 5.88],
    alternative: { name: "Up & Up Facial Tissues", store: "Target", price: 4.89 },
    insight: "Prices are still elevated versus earlier months, so only buy the name brand if you need it now; the Target store brand is the better value."
  }
};

const aliases = {
  oats: "04963406",
  oat: "04963406",
  "oat milk": "04963406",
  peanut: "041570052057",
  "peanut butter": "041570052057",
  tissue: "036000291452",
  tissues: "036000291452",
  towels: "036000291452"
};

const els = {
  video: document.querySelector("#camera"),
  fallback: document.querySelector("#cameraFallback"),
  cameraNotice: document.querySelector("#cameraNotice"),
  scanLine: document.querySelector("#scanLine"),
  startCamera: document.querySelector("#startCamera"),
  stopCamera: document.querySelector("#stopCamera"),
  demoScan: document.querySelector("#demoScan"),
  lookupForm: document.querySelector("#lookupForm"),
  upcInput: document.querySelector("#upcInput"),
  emptyState: document.querySelector("#emptyState"),
  loadingState: document.querySelector("#loadingState"),
  productResult: document.querySelector("#productResult"),
  progressBar: document.querySelector("#progressBar"),
  loadingText: document.querySelector("#loadingText"),
  productMeta: document.querySelector("#productMeta"),
  productName: document.querySelector("#productName"),
  productBrand: document.querySelector("#productBrand"),
  dealBadge: document.querySelector("#dealBadge"),
  bestPrice: document.querySelector("#bestPrice"),
  bestStore: document.querySelector("#bestStore"),
  trendValue: document.querySelector("#trendValue"),
  trendCopy: document.querySelector("#trendCopy"),
  savingsValue: document.querySelector("#savingsValue"),
  alternativeName: document.querySelector("#alternativeName"),
  insightText: document.querySelector("#insightText"),
  storeList: document.querySelector("#storeList"),
  historyChart: document.querySelector("#historyChart"),
  alternativeCard: document.querySelector("#alternativeCard"),
  sortStores: document.querySelector("#sortStores")
};

let stream = null;
let detector = null;
let scanning = false;
let currentProduct = null;
let sortAscending = true;

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function getProduct(query) {
  const normalized = String(query).trim().toLowerCase();
  const code = products[normalized] ? normalized : aliases[normalized] || normalized.replace(/\D/g, "");
  return products[code] || null;
}

function setMode(mode) {
  els.emptyState.classList.toggle("hidden", mode !== "empty");
  els.loadingState.classList.toggle("hidden", mode !== "loading");
  els.productResult.classList.toggle("hidden", mode !== "result");
  els.scanLine.classList.toggle("active", mode === "loading" || scanning);
}

function showCameraNotice(title, copy) {
  els.cameraNotice.innerHTML = `<strong>${title}</strong>${copy}`;
  els.cameraNotice.classList.remove("hidden");
}

function clearCameraNotice() {
  els.cameraNotice.textContent = "";
  els.cameraNotice.classList.add("hidden");
}

function bestStore(product) {
  return [...product.stores].sort((a, b) => a.price - b.price)[0];
}

function trend(product) {
  const first = product.history[0];
  const last = product.history[product.history.length - 1];
  const change = ((last - first) / first) * 100;
  return {
    change,
    label: change <= -4 ? "Down from spring" : change >= 4 ? "Up recently" : "Mostly stable"
  };
}

function deal(product) {
  const localBest = bestStore(product).price;
  const average = product.stores.reduce((sum, store) => sum + store.price, 0) / product.stores.length;
  if (localBest <= average * 0.9) return "Great";
  if (localBest >= average * 1.04) return "High";
  return "Fair";
}

function renderStores(product) {
  const localBest = bestStore(product);
  const stores = [...product.stores].sort((a, b) => sortAscending ? a.price - b.price : a.name.localeCompare(b.name));
  els.storeList.innerHTML = stores.map((store) => `
    <div class="store-row ${store.name === localBest.name ? "best" : ""}">
      <div>
        <strong>${store.name}</strong>
        <div class="store-distance">${store.distance} - ${store.confidence}</div>
      </div>
      <strong>${money(store.price)}</strong>
      <span>${store.name === localBest.name ? "Best" : ""}</span>
    </div>
  `).join("");
}

function renderChart(product) {
  const width = 640;
  const height = 180;
  const pad = 24;
  const min = Math.min(...product.history) - 0.25;
  const max = Math.max(...product.history) + 0.25;
  const points = product.history.map((price, index) => {
    const x = pad + index * ((width - pad * 2) / (product.history.length - 1));
    const y = height - pad - ((price - min) / (max - min)) * (height - pad * 2);
    return { x, y, price };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const fillPath = `${path} L ${width - pad} ${height - pad} L ${pad} ${height - pad} Z`;
  const lastChange = product.history.at(-1) - product.history[0];
  const lineColor = lastChange <= 0 ? "#35d07f" : "#f4b63f";

  els.historyChart.innerHTML = `
    <defs>
      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.26" />
        <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.02" />
      </linearGradient>
    </defs>
    <path d="${fillPath}" fill="url(#chartFill)"></path>
    <path d="${path}" fill="none" stroke="${lineColor}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
    ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="5" fill="${lineColor}"></circle>`).join("")}
    ${points.map((point, index) => `<text x="${point.x}" y="${height - 6}" text-anchor="middle" fill="#9aa7b8" font-size="13">${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</text>`).join("")}
  `;
}

function renderProduct(product) {
  currentProduct = product;
  const store = bestStore(product);
  const priceTrend = trend(product);
  const rating = deal(product);
  const savings = store.price - product.alternative.price;

  els.productMeta.textContent = `UPC ${product.upc} - ${product.category}`;
  els.productName.textContent = product.name;
  els.productBrand.textContent = `${product.brand} - ${product.size}`;
  els.dealBadge.textContent = rating;
  els.dealBadge.className = `deal-badge ${rating.toLowerCase()}`;
  els.bestPrice.textContent = money(store.price);
  els.bestStore.textContent = `${store.name} - ${store.distance}`;
  els.trendValue.textContent = `${priceTrend.change > 0 ? "+" : ""}${Math.round(priceTrend.change)}%`;
  els.trendCopy.textContent = priceTrend.label;
  els.savingsValue.textContent = money(Math.max(savings, 0));
  els.alternativeName.textContent = product.alternative.name;
  els.insightText.textContent = product.insight;
  els.alternativeCard.innerHTML = `
    <div>
      <strong>${product.alternative.name}</strong>
      <p>${product.alternative.store} - store-brand alternative</p>
    </div>
    <strong>${money(product.alternative.price)}</strong>
  `;

  renderStores(product);
  renderChart(product);
  setMode("result");
}

function simulateLookup(product) {
  setMode("loading");
  const steps = ["Identifying product", "Checking nearby stores", "Reading price history", "Finding cheaper alternatives"];
  let step = 0;
  els.progressBar.style.width = "0%";
  const timer = window.setInterval(() => {
    step += 1;
    els.progressBar.style.width = `${Math.min(step * 28, 100)}%`;
    els.loadingText.textContent = steps[Math.min(step, steps.length - 1)];
    if (step >= 4) {
      window.clearInterval(timer);
      renderProduct(product);
    }
  }, 360);
}

function lookup(query) {
  const product = getProduct(query);
  if (!product) {
    els.loadingText.textContent = "No local price profile found yet. Try a demo product.";
    setMode("loading");
    els.progressBar.style.width = "100%";
    window.setTimeout(() => setMode(currentProduct ? "result" : "empty"), 1300);
    return;
  }
  simulateLookup(product);
}

async function startCamera() {
  clearCameraNotice();

  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    showCameraNotice(
      "Camera needs a secure URL",
      "Phone browsers usually require HTTPS for camera access. Localhost works on this computer, but a phone needs an HTTPS tunnel or deployed site."
    );
    els.loadingText.textContent = "Camera access is blocked because this phone is opening the app over plain HTTP.";
    setMode("loading");
    els.progressBar.style.width = "100%";
    window.setTimeout(() => setMode(currentProduct ? "result" : "empty"), 2200);
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    els.video.srcObject = stream;
    els.video.classList.add("is-live");
    scanning = true;
    els.scanLine.classList.add("active");

    if (!("BarcodeDetector" in window)) {
      showCameraNotice(
        "Camera is open, scanner is not",
        "This browser does not support native barcode detection. Manual lookup and demo scans still work."
      );
      return;
    }

    detector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
    detectLoop();
  } catch (error) {
    const message = error?.name === "NotAllowedError"
      ? "Camera permission was denied or blocked for this site."
      : "Camera hardware was unavailable or the browser could not start it.";
    showCameraNotice("Camera did not start", `${message} Manual lookup still works.`);
    els.loadingText.textContent = message;
    setMode("loading");
    els.progressBar.style.width = "100%";
    window.setTimeout(() => setMode(currentProduct ? "result" : "empty"), 1800);
  }
}

async function detectLoop() {
  if (!scanning || !detector) return;
  try {
    const barcodes = await detector.detect(els.video);
    if (barcodes.length > 0) {
      const code = barcodes[0].rawValue;
      stopCamera();
      els.upcInput.value = code;
      lookup(code);
      return;
    }
  } catch (error) {
    /* Some browsers throw until the video has enough frames. Keep scanning. */
  }
  window.requestAnimationFrame(detectLoop);
}

function stopCamera() {
  scanning = false;
  clearCameraNotice();
  els.scanLine.classList.remove("active");
  els.video.classList.remove("is-live");
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
}

els.startCamera.addEventListener("click", startCamera);
els.stopCamera.addEventListener("click", stopCamera);
els.demoScan.addEventListener("click", () => lookup("04963406"));
els.lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  lookup(els.upcInput.value);
});
els.sortStores.addEventListener("click", () => {
  sortAscending = !sortAscending;
  els.sortStores.textContent = sortAscending ? "Sort by price" : "Sort by store";
  if (currentProduct) renderStores(currentProduct);
});
document.querySelectorAll("[data-code]").forEach((button) => {
  button.addEventListener("click", () => lookup(button.dataset.code));
});

setMode("empty");
