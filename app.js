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
    insight: "Bino sees a strong buy signal: today's best decision price is down 17% from its six-month high, and Aldi has an even cheaper store-brand option."
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
  toggleTorch: document.querySelector("#toggleTorch"),
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
  productImage: document.querySelector("#productImage"),
  productSource: document.querySelector("#productSource"),
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
  sortStores: document.querySelector("#sortStores"),
  addToBasket: document.querySelector("#addToBasket"),
  saveProduct: document.querySelector("#saveProduct"),
  basketCount: document.querySelector("#basketCount"),
  basketList: document.querySelector("#basketList"),
  seedBasket: document.querySelector("#seedBasket"),
  clearBasket: document.querySelector("#clearBasket"),
  optimizerPanel: document.querySelector("#optimizerPanel"),
  singleStoreMode: document.querySelector("#singleStoreMode"),
  multiStoreMode: document.querySelector("#multiStoreMode"),
  optimizedTotal: document.querySelector("#optimizedTotal"),
  optimizedSavings: document.querySelector("#optimizedSavings"),
  optimizedStops: document.querySelector("#optimizedStops"),
  routeTitle: document.querySelector("#routeTitle"),
  routeSubtitle: document.querySelector("#routeSubtitle"),
  routeList: document.querySelector("#routeList"),
  profileName: document.querySelector("#profileName"),
  profileButton: document.querySelector("#profileButton"),
  profileNameInput: document.querySelector("#profileNameInput"),
  profileForm: document.querySelector("#profileForm"),
  profileStats: document.querySelector("#profileStats"),
  navButtons: document.querySelectorAll("[data-view-target]"),
  views: document.querySelectorAll("[data-view]"),
  groupForm: document.querySelector("#groupForm"),
  groupSelect: document.querySelector("#groupSelect"),
  groupNameInput: document.querySelector("#groupNameInput"),
  groupCards: document.querySelector("#groupCards"),
  newGroupQuick: document.querySelector("#newGroupQuick"),
  historyList: document.querySelector("#historyList"),
  clearHistory: document.querySelector("#clearHistory"),
  savedList: document.querySelector("#savedList"),
  saveCurrent: document.querySelector("#saveCurrent")
};

let stream = null;
let detector = null;
let scanning = false;
let torchOn = false;
let torchSupported = false;
let currentProduct = null;
let sortAscending = true;
let profile = null;
let basket = [];
let optimizerMode = "single";
let activeViewName = "scan";
const viewScrollPositions = {};
const profileKey = "binocart.profile.v1";
const legacyProfileKey = "pricescout.profile.v1";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
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
    saved: []
  };
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(profileKey) || localStorage.getItem(legacyProfileKey));
    profile = stored?.id ? stored : defaultProfile();
  } catch (error) {
    profile = defaultProfile();
  }

  if (!Array.isArray(profile.groups) || profile.groups.length === 0) {
    profile.groups = defaultProfile().groups;
  }
  if (!profile.activeGroupId || !profile.groups.some((group) => group.id === profile.activeGroupId)) {
    profile.activeGroupId = profile.groups[0].id;
  }
  profile.history = Array.isArray(profile.history) ? profile.history : [];
  profile.saved = Array.isArray(profile.saved) ? profile.saved : [];
  basket = activeGroup().items;
}

function saveProfile() {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

function activeGroup() {
  return profile.groups.find((group) => group.id === profile.activeGroupId) || profile.groups[0];
}

function productSnapshot(product) {
  return {
    upc: product.upc,
    name: product.name,
    brand: product.brand,
    size: product.size,
    category: product.category,
    imageUrl: product.imageUrl || "",
    source: product.source || "",
    stores: product.stores || [],
    history: product.history || [],
    alternative: product.alternative || null,
    insight: product.insight || ""
  };
}

function switchView(viewName) {
  viewScrollPositions[activeViewName] = window.scrollY;
  activeViewName = viewName;
  els.views.forEach((view) => view.classList.toggle("active", view.dataset.view === viewName));
  els.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.viewTarget === viewName));
  if (viewName === "list") renderGroupCards();
  if (viewName === "history") renderHistory();
  if (viewName === "saved") renderSaved();
  if (viewName === "profile") renderProfile();
  requestAnimationFrame(() => {
    window.scrollTo(0, viewScrollPositions[viewName] || 0);
  });
}

function recordScan(product) {
  const scan = {
    ...productSnapshot(product),
    scannedAt: new Date().toISOString()
  };
  profile.history = [scan, ...profile.history.filter((item) => item.upc !== product.upc)].slice(0, 30);
  saveProfile();
  renderHistory();
  renderProfile();
}

function saveProduct(product) {
  if (!product) return;
  if (!profile.saved.some((item) => item.upc === product.upc)) {
    profile.saved.unshift(productSnapshot(product));
    profile.saved = profile.saved.slice(0, 30);
    saveProfile();
  }
  renderSaved();
  renderProfile();
}

function getProduct(query) {
  const normalized = String(query).trim().toLowerCase();
  const code = products[normalized] ? normalized : aliases[normalized] || normalized.replace(/\D/g, "");
  return products[code] || null;
}

function normalizedCode(query) {
  const normalized = String(query).trim().toLowerCase();
  return products[normalized] ? normalized : aliases[normalized] || normalized.replace(/\D/g, "");
}

function hasPriceProfile(product) {
  return Array.isArray(product?.stores) && product.stores.length > 0;
}

async function fetchOpenFoodFactsProduct(code) {
  if (!/^\d{6,14}$/.test(code)) return null;

  const fields = [
    "code",
    "product_name",
    "brands",
    "quantity",
    "categories",
    "image_front_url",
    "image_url"
  ].join(",");
  const candidates = barcodeCandidates(code);

  for (const candidate of candidates) {
    const urls = [
      `https://world.openfoodfacts.org/api/v3/product/${candidate}.json?fields=${fields}`,
      `https://us.openfoodfacts.org/api/v3/product/${candidate}.json?fields=${fields}`
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const data = await response.json();
        if (data.status !== "success" || !data.product) continue;

        const product = data.product;
        return {
          upc: product.code || candidate,
          name: product.product_name || "Unknown product",
          brand: product.brands || "Brand unavailable",
          size: product.quantity || "Size unavailable",
          category: (product.categories || "Product").split(",")[0].trim(),
          imageUrl: product.image_front_url || product.image_url || "",
          source: "Open Food Facts"
        };
      } catch (error) {
        continue;
      }
    }
  }

  return null;
}

function barcodeCandidates(code) {
  const raw = String(code).replace(/\D/g, "");
  const candidates = new Set([raw]);
  if (raw.length === 13 && raw.startsWith("0")) candidates.add(raw.slice(1));
  if (raw.length === 12) candidates.add(`0${raw}`);
  if (raw.length < 12) candidates.add(raw.padStart(12, "0"));
  return [...candidates].filter((candidate) => /^\d{6,14}$/.test(candidate));
}

async function fetchUpcItemDbProduct(code) {
  for (const candidate of barcodeCandidates(code)) {
    try {
      const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${candidate}`);
      if (!response.ok) continue;
      const data = await response.json();
      const item = data.items?.[0];
      if (!item) continue;

      return {
        upc: item.upc || candidate,
        name: item.title || "Unknown product",
        brand: item.brand || "Brand unavailable",
        size: item.size || "Size unavailable",
        category: item.category || "Product",
        imageUrl: item.images?.[0] || "",
        source: "UPCItemDB"
      };
    } catch (error) {
      continue;
    }
  }

  return null;
}

function majorBrandFallback(code) {
  const compact = String(code).replace(/\D/g, "");
  const withoutLeadingZero = compact.startsWith("0") ? compact.slice(1) : compact;

  if (withoutLeadingZero.startsWith("25500")) {
    return {
      upc: compact,
      name: "Folgers Coffee",
      brand: "Folgers",
      size: "Size varies by package",
      category: "Coffee",
      imageUrl: "",
      source: "major brand fallback",
      confidence: "brand-prefix"
    };
  }

  return null;
}

async function fetchLiveProduct(code) {
  return await fetchOpenFoodFactsProduct(code)
    || await fetchUpcItemDbProduct(code)
    || majorBrandFallback(code);
}

function mergeLiveProduct(localProduct, liveProduct, code) {
  if (localProduct) return localProduct;

  if (liveProduct) {
    return {
      ...liveProduct,
      stores: [],
      history: [],
      alternative: null,
      insight: liveProduct.confidence === "brand-prefix"
        ? "Bino recognized the manufacturer prefix, but still needs an exact product match or local price confirmations for this package."
        : "Product data was found live, but BinoCart has not collected local price history for this item yet."
    };
  }

  return {
    upc: code,
    name: "Product not found yet",
    brand: "UPC database miss",
    size: "Scan saved as unknown",
    category: "Unknown",
    stores: [],
    history: [],
    alternative: null,
    insight: "No product record was found in the live UPC database. Manual lookup and future crowdsourced entries can still add it."
  };
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

function cameraTrack() {
  return stream?.getVideoTracks?.()[0] || null;
}

function updateTorchButton() {
  els.toggleTorch.disabled = !stream;
  els.toggleTorch.classList.toggle("active", torchOn);
  els.toggleTorch.textContent = torchOn ? "Lit" : "Light";
  els.toggleTorch.title = stream
    ? "Toggle flashlight"
    : "Start camera before using flashlight";
}

function setupTorchControl() {
  const track = cameraTrack();
  const capabilities = track?.getCapabilities?.() || {};
  torchSupported = Boolean(capabilities.torch);
  torchOn = false;
  updateTorchButton();
}

async function setTorch(enabled) {
  const track = cameraTrack();
  if (!track?.applyConstraints) {
    showCameraNotice(
      "Flashlight unavailable",
      "This browser cannot change camera torch settings from the web page."
    );
    return;
  }

  try {
    await track.applyConstraints({ advanced: [{ torch: enabled }] });
    torchOn = enabled;
    torchSupported = true;
    updateTorchButton();
    clearCameraNotice();
  } catch (error) {
    torchOn = false;
    updateTorchButton();
    showCameraNotice(
      "Flashlight unavailable",
      "This phone or browser rejected torch control for the active camera. Try Chrome on Android, and make sure the rear camera is selected."
    );
  }
}

function bestStore(product) {
  if (!hasPriceProfile(product)) return null;
  return [...product.stores].sort((a, b) => a.price - b.price)[0];
}

function trend(product) {
  if (!Array.isArray(product.history) || product.history.length < 2) {
    return { change: 0, label: "No history yet" };
  }
  const first = product.history[0];
  const last = product.history[product.history.length - 1];
  const change = ((last - first) / first) * 100;
  return {
    change,
    label: change <= -4 ? "Down from spring" : change >= 4 ? "Up recently" : "Mostly stable"
  };
}

function deal(product) {
  if (!hasPriceProfile(product)) return "Tracking";
  const localBest = bestStore(product).price;
  const average = product.stores.reduce((sum, store) => sum + store.price, 0) / product.stores.length;
  if (localBest <= average * 0.9) return "Great";
  if (localBest >= average * 1.04) return "High";
  return "Fair";
}

function renderStores(product) {
  const localBest = bestStore(product);
  if (!localBest) {
    els.storeList.innerHTML = `<div class="basket-empty">No local prices tracked yet. This is where crowdsourced store prices will appear once shoppers confirm them.</div>`;
    return;
  }
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
  if (!Array.isArray(product.history) || product.history.length < 2) {
    els.historyChart.innerHTML = `
      <text x="320" y="92" text-anchor="middle" fill="#9aa7b8" font-size="18">No price history yet</text>
      <text x="320" y="122" text-anchor="middle" fill="#9aa7b8" font-size="13">Confirmed prices will build this chart over time.</text>
    `;
    return;
  }
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
  recordScan(product);
  const store = bestStore(product);
  const priceTrend = trend(product);
  const rating = deal(product);
  const savings = store && product.alternative ? store.price - product.alternative.price : 0;

  els.productMeta.textContent = `UPC ${product.upc} - ${product.category}`;
  els.productName.textContent = product.name;
  els.productBrand.textContent = `${product.brand} - ${product.size}`;
  els.productSource.textContent = product.source ? `Live product data from ${product.source}` : "Seeded BinoCart profile";
  els.productImage.classList.toggle("hidden", !product.imageUrl);
  if (product.imageUrl) {
    els.productImage.src = product.imageUrl;
    els.productImage.alt = product.name;
  } else {
    els.productImage.removeAttribute("src");
    els.productImage.alt = "";
  }
  els.dealBadge.textContent = rating;
  els.dealBadge.className = `deal-badge ${rating.toLowerCase()}`;
  els.bestPrice.textContent = store ? money(store.price) : "TBD";
  els.bestStore.textContent = store ? `${store.name} - ${store.distance}` : "Waiting for local prices";
  els.trendValue.textContent = `${priceTrend.change > 0 ? "+" : ""}${Math.round(priceTrend.change)}%`;
  els.trendCopy.textContent = priceTrend.label;
  els.savingsValue.textContent = product.alternative ? money(Math.max(savings, 0)) : "TBD";
  els.alternativeName.textContent = product.alternative?.name || "No swap found yet";
  els.insightText.textContent = product.insight;
  els.addToBasket.disabled = !store;
  els.addToBasket.textContent = store ? "Add to list" : "Needs price";
  els.alternativeCard.innerHTML = product.alternative
    ? `
      <div>
        <strong>${product.alternative.name}</strong>
        <p>${product.alternative.store} - store-brand alternative</p>
      </div>
      <strong>${money(product.alternative.price)}</strong>
    `
    : `<div><strong>No Bino swap yet</strong><p>Bino can suggest one after local price data exists for this item.</p></div>`;

  renderStores(product);
  renderChart(product);
  setMode("result");
}

function basketLabel(count) {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

function productStorePrice(product, storeName) {
  if (!hasPriceProfile(product)) return undefined;
  return product.stores.find((store) => store.name === storeName)?.price;
}

function allStoreNames() {
  return [...new Set(Object.values(products).flatMap((product) => product.stores.map((store) => store.name)))];
}

function addProductToBasket(product) {
  const group = activeGroup();
  if (!group.items.some((item) => item.upc === product.upc)) {
    group.items.push(productSnapshot(product));
  }
  basket = group.items;
  saveProfile();
  renderBasket();
  renderGroupCards();
}

function removeProductFromBasket(upc) {
  const group = activeGroup();
  group.items = group.items.filter((item) => item.upc !== upc);
  basket = group.items;
  saveProfile();
  renderBasket();
  renderGroupCards();
}

function singleStorePlan() {
  const storePlans = allStoreNames().map((storeName) => {
    const items = basket.map((product) => ({
      product,
      price: productStorePrice(product, storeName)
    })).filter((item) => typeof item.price === "number");
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return { storeName, items, total };
  }).filter((plan) => plan.items.length === basket.length);

  return storePlans.sort((a, b) => a.total - b.total)[0] || null;
}

function multiStorePlan() {
  const assignments = basket.filter(hasPriceProfile).map((product) => {
    const store = bestStore(product);
    return { product, storeName: store.name, price: store.price };
  });
  const grouped = assignments.reduce((groups, item) => {
    groups[item.storeName] = groups[item.storeName] || [];
    groups[item.storeName].push(item);
    return groups;
  }, {});

  return Object.entries(grouped).map(([storeName, items]) => ({
    storeName,
    items,
    total: items.reduce((sum, item) => sum + item.price, 0),
    distance: items[0].product.stores.find((store) => store.name === storeName)?.distance || ""
  })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
}

function renderOptimizer() {
  els.optimizerPanel.classList.toggle("hidden", basket.length === 0);
  if (basket.length === 0) return;

  const singlePlan = singleStorePlan();
  const multiPlan = multiStorePlan();
  const multiTotal = multiPlan.reduce((sum, stop) => sum + stop.total, 0);
  const currentStops = optimizerMode === "single" && singlePlan
    ? [{ ...singlePlan, distance: singlePlan.items[0]?.product.stores.find((store) => store.name === singlePlan.storeName)?.distance || "" }]
    : multiPlan;
  const currentTotal = currentStops.reduce((sum, stop) => sum + stop.total, 0);
  const savings = singlePlan ? singlePlan.total - multiTotal : 0;

  els.singleStoreMode.classList.toggle("active", optimizerMode === "single");
  els.multiStoreMode.classList.toggle("active", optimizerMode === "multi");
  els.optimizedTotal.textContent = money(currentTotal);
  els.optimizedSavings.textContent = optimizerMode === "multi" ? money(Math.max(savings, 0)) : money(0);
  els.optimizedStops.textContent = String(currentStops.length);
  els.routeTitle.textContent = optimizerMode === "single" ? "Best single store" : "Optimized route";
  els.routeSubtitle.textContent = optimizerMode === "single"
    ? "One checkout, lowest basket total"
    : "Split only where the savings justify another stop";

  els.routeList.innerHTML = currentStops.map((stop, index) => `
    <article class="route-stop">
      <header>
        <div>
          <strong>${index + 1}. ${stop.storeName}</strong>
          <div class="store-distance">${stop.distance ? `${stop.distance} away` : "Best basket match"}</div>
        </div>
        <strong>${money(stop.total)}</strong>
      </header>
      <ol>
        ${stop.items.map((item) => `<li><strong>${item.product.name}</strong> - ${money(item.price)}</li>`).join("")}
      </ol>
    </article>
  `).join("");
}

function renderBasket() {
  basket = activeGroup().items;
  els.basketCount.textContent = basketLabel(basket.length);
  if (basket.length === 0) {
    els.basketList.innerHTML = `<div class="basket-empty">Scan items or add demo products to plan a trip.</div>`;
  } else {
    els.basketList.innerHTML = basket.map((product) => `
      <div class="basket-item">
        <div>
          <strong>${product.name}</strong>
          <p>${product.size} - ${hasPriceProfile(product) ? `best ${money(bestStore(product).price)} at ${bestStore(product).name}` : "needs local price"}</p>
        </div>
        <button type="button" data-remove="${product.upc}" aria-label="Remove ${product.name}">x</button>
      </div>
    `).join("");
  }
  renderOptimizer();
  renderGroupSelect();
}

function renderGroupSelect() {
  if (!els.groupSelect) return;
  els.groupSelect.innerHTML = profile.groups.map((group) => `
    <option value="${group.id}" ${group.id === profile.activeGroupId ? "selected" : ""}>${group.name}</option>
  `).join("");
}

function createGroup(name) {
  const trimmed = name.trim() || `List ${profile.groups.length + 1}`;
  const group = { id: makeId("group"), name: trimmed, items: [] };
  profile.groups.push(group);
  profile.activeGroupId = group.id;
  basket = group.items;
  saveProfile();
  renderBasket();
  renderGroupCards();
  renderProfile();
}

function deleteGroup(groupId) {
  if (profile.groups.length <= 1) return;
  const group = profile.groups.find((item) => item.id === groupId);
  if (!group) return;
  if (!window.confirm(`Delete "${group.name}" and its ${basketLabel(group.items.length)}?`)) return;

  profile.groups = profile.groups.filter((item) => item.id !== groupId);
  if (profile.activeGroupId === groupId) {
    profile.activeGroupId = profile.groups[0].id;
  }
  basket = activeGroup().items;
  saveProfile();
  renderBasket();
  renderGroupCards();
  renderProfile();
}

function renderGroupCards() {
  if (!els.groupCards) return;
  els.groupCards.innerHTML = profile.groups.map((group) => {
    const pricedItems = group.items.filter(hasPriceProfile);
    const total = pricedItems.reduce((sum, product) => sum + (bestStore(product)?.price || 0), 0);
    return `
      <article class="group-card">
        <header>
          <div>
            <h3>${group.name}</h3>
            <p class="subtle">${basketLabel(group.items.length)} - best-item total ${money(total)}</p>
          </div>
          <div class="card-actions">
            <button class="ghost-btn" type="button" data-open-group="${group.id}">Open</button>
            <button class="ghost-btn" type="button" data-seed-group="${group.id}">Demo</button>
            <button class="ghost-btn danger-btn" type="button" data-delete-group="${group.id}" ${profile.groups.length <= 1 ? "disabled" : ""}>Delete</button>
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
        <button class="ghost-btn" type="button" data-relookup="${product.upc}">View</button>
        ${hasPriceProfile(product) ? `<button class="ghost-btn" type="button" data-add-snapshot="${product.upc}" data-source="${source}">Add</button>` : ""}
      </div>
    </article>
  `;
}

function renderProfile() {
  if (els.profileName) els.profileName.textContent = profile.name;
  if (els.profileButton) els.profileButton.title = `Profile: ${profile.name}`;
  if (els.profileNameInput) els.profileNameInput.value = profile.name;
  if (!els.profileStats) return;
  els.profileStats.innerHTML = `
    <article class="profile-card">
      <strong>${profile.name}</strong>
      <p class="subtle">Local-only profile. Email sync can come later.</p>
      <p>${profile.groups.length} list groups - ${profile.history.length} recent scans - ${profile.saved.length} saved products</p>
    </article>
  `;
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

async function lookup(query) {
  const code = normalizedCode(query);
  const localProduct = getProduct(query);
  const shouldFetchLive = !localProduct && /^\d{6,14}$/.test(code);

  setMode("loading");
  els.progressBar.style.width = "18%";
  els.loadingText.textContent = shouldFetchLive ? "Checking live UPC database" : "Checking local product profiles";

  const liveProduct = shouldFetchLive ? await fetchLiveProduct(code) : null;
  const product = mergeLiveProduct(localProduct, liveProduct, code || query);

  if (!hasPriceProfile(product)) {
    els.progressBar.style.width = "100%";
    els.loadingText.textContent = liveProduct ? "Found product data" : "No live product data found";
    window.setTimeout(() => renderProduct(product), 450);
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
    setupTorchControl();

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
  torchOn = false;
  torchSupported = false;
  updateTorchButton();
  clearCameraNotice();
  els.scanLine.classList.remove("active");
  els.video.classList.remove("is-live");
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
}

els.startCamera?.addEventListener("click", startCamera);
els.stopCamera?.addEventListener("click", stopCamera);
els.toggleTorch?.addEventListener("click", () => setTorch(!torchOn));
els.demoScan?.addEventListener("click", () => lookup("04963406"));
els.lookupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  lookup(els.upcInput.value);
});
els.sortStores?.addEventListener("click", () => {
  sortAscending = !sortAscending;
  els.sortStores.textContent = sortAscending ? "Sort by price" : "Sort by store";
  if (currentProduct) renderStores(currentProduct);
});
els.addToBasket?.addEventListener("click", () => {
  if (currentProduct) addProductToBasket(currentProduct);
});
els.saveProduct?.addEventListener("click", () => {
  saveProduct(currentProduct);
});
els.seedBasket?.addEventListener("click", () => {
  activeGroup().items = Object.values(products).map(productSnapshot);
  basket = activeGroup().items;
  saveProfile();
  renderBasket();
  renderGroupCards();
});
els.clearBasket?.addEventListener("click", () => {
  activeGroup().items = [];
  basket = activeGroup().items;
  saveProfile();
  renderBasket();
  renderGroupCards();
});
els.basketList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (button) removeProductFromBasket(button.dataset.remove);
});
els.singleStoreMode?.addEventListener("click", () => {
  optimizerMode = "single";
  renderOptimizer();
});
els.multiStoreMode?.addEventListener("click", () => {
  optimizerMode = "multi";
  renderOptimizer();
});
els.navButtons.forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.viewTarget));
});
els.groupSelect?.addEventListener("change", () => {
  profile.activeGroupId = els.groupSelect.value;
  basket = activeGroup().items;
  saveProfile();
  renderBasket();
});
els.groupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  createGroup(els.groupNameInput.value);
  els.groupNameInput.value = "";
});
els.newGroupQuick?.addEventListener("click", () => {
  createGroup("New list");
  switchView("list");
});
els.profileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  profile.name = els.profileNameInput.value.trim() || "My profile";
  saveProfile();
  renderProfile();
});
els.clearHistory?.addEventListener("click", () => {
  profile.history = [];
  saveProfile();
  renderHistory();
  renderProfile();
});
els.saveCurrent?.addEventListener("click", () => {
  saveProduct(currentProduct);
});
els.groupCards?.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-group]");
  const seedButton = event.target.closest("[data-seed-group]");
  const deleteButton = event.target.closest("[data-delete-group]");
  if (deleteButton) {
    deleteGroup(deleteButton.dataset.deleteGroup);
    return;
  }
  if (openButton) {
    profile.activeGroupId = openButton.dataset.openGroup;
    basket = activeGroup().items;
    saveProfile();
    renderBasket();
    switchView("scan");
  }
  if (seedButton) {
    const group = profile.groups.find((item) => item.id === seedButton.dataset.seedGroup);
    if (group) {
      group.items = Object.values(products).map(productSnapshot);
      saveProfile();
      renderGroupCards();
      if (group.id === profile.activeGroupId) renderBasket();
    }
  }
});
function handleProductListAction(event) {
  const relookup = event.target.closest("[data-relookup]");
  const addSnapshot = event.target.closest("[data-add-snapshot]");
  if (relookup) {
    switchView("scan");
    lookup(relookup.dataset.relookup);
  }
  if (addSnapshot) {
    const source = addSnapshot.dataset.source === "saved" ? profile.saved : profile.history;
    const product = source.find((item) => item.upc === addSnapshot.dataset.addSnapshot);
    if (product) addProductToBasket(product);
  }
}
els.historyList?.addEventListener("click", handleProductListAction);
els.savedList?.addEventListener("click", handleProductListAction);
document.querySelectorAll("[data-code]").forEach((button) => {
  button.addEventListener("click", () => lookup(button.dataset.code));
});

loadProfile();
const initialParams = new URLSearchParams(window.location.search);
const initialGroup = initialParams.get("group");
if (initialGroup && profile.groups.some((group) => group.id === initialGroup)) {
  profile.activeGroupId = initialGroup;
  basket = activeGroup().items;
  saveProfile();
}
renderBasket();
renderHistory();
renderSaved();
renderProfile();
updateTorchButton();
setMode("empty");
const initialLookup = initialParams.get("lookup");
if (initialLookup) lookup(initialLookup);
