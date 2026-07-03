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
  },
  "000000000001": {
    upc: "000000000001",
    name: "Whole Milk",
    brand: "Generic",
    size: "1 Gallon",
    category: "Dairy",
    stores: [
      { name: "Aldi", price: 3.05, distance: "4.4 mi", confidence: "Updated today" },
      { name: "Walmart", price: 3.12, distance: "2.5 mi", confidence: "Updated 1 hr ago" },
      { name: "Kroger", price: 3.29, distance: "1.2 mi", confidence: "Updated today" }
    ],
    history: [3.45, 3.35, 3.25, 3.15, 3.10, 3.12],
    insight: "Milk prices have stabilized after a spring peak. Walmart and Aldi are neck-and-neck."
  },
  "000000000002": {
    upc: "000000000002",
    name: "White Bread",
    brand: "Generic",
    size: "20 oz Loaf",
    category: "Bakery",
    stores: [
      { name: "Aldi", price: 1.29, distance: "4.4 mi", confidence: "Updated today" },
      { name: "Walmart", price: 1.35, distance: "2.5 mi", confidence: "Updated today" },
      { name: "Meijer", price: 1.49, distance: "3.1 mi", confidence: "Updated yesterday" }
    ],
    history: [1.19, 1.19, 1.25, 1.29, 1.29, 1.29],
    insight: "Bread is up 8% this year. Aldi remains the most affordable option for staples."
  },
  "000000000003": {
    upc: "000000000003",
    name: "Bananas",
    brand: "Produce",
    size: "1 lb",
    category: "Produce",
    stores: [
      { name: "Walmart", price: 0.48, distance: "2.5 mi", confidence: "Updated 1 hr ago" },
      { name: "Aldi", price: 0.49, distance: "4.4 mi", confidence: "Updated today" },
      { name: "Kroger", price: 0.55, distance: "1.2 mi", confidence: "Updated today" }
    ],
    history: [0.44, 0.44, 0.46, 0.48, 0.48, 0.48],
    insight: "Bananas are the ultimate stable-price item. Meijer is slightly higher today."
  },
  "000000000004": {
    upc: "000000000004",
    name: "Unsalted Butter",
    brand: "Generic",
    size: "16 oz (4 sticks)",
    category: "Dairy",
    stores: [
      { name: "Aldi", price: 3.49, distance: "4.4 mi", confidence: "Updated today" },
      { name: "Walmart", price: 3.68, distance: "2.5 mi", confidence: "Updated today" },
      { name: "Kroger", price: 4.29, distance: "1.2 mi", confidence: "Updated today" }
    ],
    history: [3.99, 3.89, 3.79, 3.69, 3.59, 3.49],
    insight: "Butter has seen a significant price drop lately. Great time to stock up at Aldi."
  },
  "000000000005": {
    upc: "000000000005",
    name: "Boneless Skinless Chicken Breast",
    brand: "Produce",
    size: "1 lb",
    category: "Meat",
    stores: [
      { name: "Aldi", price: 2.49, distance: "4.4 mi", confidence: "Updated today" },
      { name: "Walmart", price: 2.67, distance: "2.5 mi", confidence: "Updated today" },
      { name: "Meijer", price: 2.99, distance: "3.1 mi", confidence: "Updated 4 hr ago" }
    ],
    history: [3.29, 3.19, 2.99, 2.89, 2.69, 2.49],
    insight: "Meat prices are fluctuating. Aldi's current price is a 6-month low."
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
  towels: "036000291452",
  milk: "000000000001",
  bread: "000000000002",
  bananas: "000000000003",
  banana: "000000000003",
  butter: "000000000004",
  chicken: "000000000005"
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
  basketTotal: document.querySelector("#basketTotal"),
  basketStores: document.querySelector("#basketStores"),
  basketList: document.querySelector("#basketList"),
  seedBasket: document.querySelector("#seedBasket"),
  clearBasket: document.querySelector("#clearBasket"),
  optimizerPanel: document.querySelector("#optimizerPanel"),
  scannerSection: document.querySelector("#scannerSection"),
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
  saveCurrent: document.querySelector("#saveCurrent"),
  breakdownModal: document.querySelector("#breakdownModal"),
  breakdownSummary: document.querySelector("#breakdownSummary"),
  storeDrilldown: document.querySelector("#storeDrilldown"),
  drilldownList: document.querySelector("#drilldownList"),
  drilldownStoreName: document.querySelector("#drilldownStoreName"),
  backToSummary: document.querySelector("#backToSummary"),
  closeModal: document.querySelector("#closeModal"),
  modalTitle: document.querySelector("#modalTitle"),
  modalIcon: document.querySelector("#modalIcon"),
  navStyleToggle: document.querySelector("#navStyleToggle"),
  plusButtonToggle: document.querySelector("#plusButtonToggle"),
  navPlusAction: document.querySelector("#navPlusAction"),
  actionOverlay: document.querySelector("#actionOverlay"),
  closeActions: document.querySelector("#closeActions"),
  actionBarcodeScan: document.querySelector("#actionBarcodeScan")
};

const pulseData = {
  eggs: {
    name: "Eggs (Large, Dozen)",
    icon: "🥚",
    shelfLife: 21,
    stores: [
      {
        name: "Aldi",
        distance: "1.2 mi",
        options: [
          { brand: "Friendly Farms", price: 1.89, analysis: "Industry-leading price for standard grade A large eggs." },
          { brand: "Goldhen (Free Range)", price: 3.49, analysis: "Premium for certified humane cage-free status." }
        ]
      },
      {
        name: "Walmart",
        distance: "2.5 mi",
        options: [
          { brand: "Great Value", price: 1.94, analysis: "Consistent stock, high-volume value option." },
          { brand: "Eggland's Best", price: 4.12, analysis: "Brand premium for added Omega-3 claims." }
        ]
      },
      {
        name: "Kroger",
        distance: "0.8 mi",
        options: [
          { brand: "Kroger Brand", price: 2.19, analysis: "Standard value, often discounted via loyalty app." }
        ]
      }
    ]
  },
  bread: {
    name: "White Bread (Loaf)",
    icon: "🍞",
    shelfLife: 7,
    stores: [
      {
        name: "Aldi",
        distance: "1.2 mi",
        options: [
          { brand: "L'oven Fresh", price: 1.29, analysis: "Lowest possible price point for sandwich staples." },
          { brand: "Specially Selected Brioche", price: 3.99, analysis: "Gourmet recipe, higher fat and sugar content." }
        ]
      },
      {
        name: "Walmart",
        distance: "2.5 mi",
        options: [
          { brand: "Great Value", price: 1.35, analysis: "Direct competitor to Aldi's staple loaf." },
          { brand: "Nature's Own", price: 3.48, analysis: "No high fructose corn syrup, cleaner label." }
        ]
      },
      {
        name: "Meijer",
        distance: "3.1 mi",
        options: [
          { brand: "Meijer Brand", price: 1.49, analysis: "Solid regional value for daily use." }
        ]
      }
    ]
  },
  milk: {
    name: "Whole Milk (Gallon)",
    icon: "🥛",
    shelfLife: 10,
    stores: [
      {
        name: "Aldi",
        distance: "1.2 mi",
        options: [
          { brand: "Friendly Farms", price: 3.05, analysis: "Consistently undercuts big-box retailers by cents." }
        ]
      },
      {
        name: "Walmart",
        distance: "2.5 mi",
        options: [
          { brand: "Great Value", price: 3.12, analysis: "Highest turnover ensures maximum freshness." }
        ]
      }
    ]
  },
  bananas: {
    name: "Bananas (lb)",
    icon: "🍌",
    shelfLife: 5,
    stores: [
      {
        name: "Walmart",
        distance: "2.5 mi",
        options: [
          { brand: "Produce", price: 0.48, analysis: "Loss-leader pricing to drive foot traffic." }
        ]
      },
      {
        name: "Aldi",
        distance: "1.2 mi",
        options: [
          { brand: "Produce", price: 0.49, analysis: "Standard competitive pricing." }
        ]
      }
    ]
  },
  butter: {
    name: "Unsalted Butter (16oz)",
    icon: "🧈",
    shelfLife: 30,
    stores: [
      {
        name: "Aldi",
        distance: "1.2 mi",
        options: [
          { brand: "Countryside Creamery", price: 3.49, analysis: "Exceptional value for baking needs." }
        ]
      },
      {
        name: "Kroger",
        distance: "0.8 mi",
        options: [
          { brand: "Kroger Brand", price: 4.29, analysis: "Premium over Aldi/Walmart unless on sale." }
        ]
      }
    ]
  }
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
    saved: [],
    archivedGroups: [],
    archivedSaved: [],
    receipts: [],
    priceObservations: [],
    showMenuLabels: false,
    menuBlur: 2,
    navStyle: "fab",
    showPlusButton: false
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
  profile.archivedGroups = Array.isArray(profile.archivedGroups) ? profile.archivedGroups : [];
  profile.archivedSaved = Array.isArray(profile.archivedSaved) ? profile.archivedSaved : [];
  profile.receipts = Array.isArray(profile.receipts) ? profile.receipts : [];
  profile.priceObservations = Array.isArray(profile.priceObservations) ? profile.priceObservations : [];
  profile.showMenuLabels = typeof profile.showMenuLabels === "boolean" ? profile.showMenuLabels : false;
  profile.menuBlur = typeof profile.menuBlur === "number" ? profile.menuBlur : 2;
  profile.navStyle = "navbar";
  profile.showPlusButton = false;

  document.body?.classList.toggle("nav-style-navbar", profile.navStyle === "navbar");
  document.body?.classList.toggle("hide-nav-plus", true);

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
    insight: product.insight || "",
    quantity: Number(product.quantity) > 0 ? Number(product.quantity) : 1
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

function archiveSavedProduct(upc) {
  const product = profile.saved.find((item) => item.upc === upc);
  if (!product) return;

  profile.saved = profile.saved.filter((item) => item.upc !== upc);
  profile.archivedSaved.unshift({ ...product, archivedAt: new Date().toISOString() });
  saveProfile();
  renderSaved();
  renderProfile();
}

function restoreArchivedSaved(upc) {
  const product = profile.archivedSaved.find((item) => item.upc === upc);
  if (!product) return;

  profile.archivedSaved = profile.archivedSaved.filter((item) => item.upc !== upc);
  profile.saved.unshift(product);
  saveProfile();
  renderSaved();
  renderProfile();
}

function deleteArchivedSaved(upc) {
  const product = profile.archivedSaved.find((item) => item.upc === upc);
  if (!product) return;
  if (!window.confirm(`Permanently delete archived product "${product.name}"?`)) return;

  profile.archivedSaved = profile.archivedSaved.filter((item) => item.upc !== upc);
  saveProfile();
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

function itemQuantity(product) {
  return Number(product?.quantity) > 0 ? Number(product.quantity) : 1;
}

function basketQuantity(items) {
  return items.reduce((sum, item) => sum + itemQuantity(item), 0);
}

function basketBestTotal(items) {
  return items
    .filter(hasPriceProfile)
    .reduce((sum, product) => sum + ((bestStore(product)?.price || 0) * itemQuantity(product)), 0);
}

function basketStoreSummary(items) {
  const stores = items.filter(hasPriceProfile).reduce((summary, product) => {
    const store = bestStore(product);
    if (!store) return summary;
    summary[store.name] = (summary[store.name] || 0) + itemQuantity(product);
    return summary;
  }, {});
  return Object.entries(stores).sort(([a], [b]) => a.localeCompare(b));
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
  const existing = group.items.find((item) => item.upc === product.upc);
  if (existing) {
    existing.quantity = itemQuantity(existing) + 1;
  } else {
    group.items.push(productSnapshot({ ...product, quantity: 1 }));
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
    const total = items.reduce((sum, item) => sum + (item.price * itemQuantity(item.product)), 0);
    return { storeName, items, total };
  }).filter((plan) => plan.items.length === basket.length);

  return storePlans.sort((a, b) => a.total - b.total)[0] || null;
}

function multiStorePlan() {
  const assignments = basket.filter(hasPriceProfile).map((product) => {
    const store = bestStore(product);
    return { product, storeName: store.name, price: store.price * itemQuantity(product) };
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
        ${stop.items.map((item) => `<li><strong>${item.product.name}${itemQuantity(item.product) > 1 ? ` x${itemQuantity(item.product)}` : ""}</strong> - ${money(item.price)}</li>`).join("")}
      </ol>
    </article>
  `).join("");
}

function renderBasket() {
  basket = activeGroup().items;
  els.basketCount.textContent = basketLabel(basketQuantity(basket));
  if (els.basketTotal) {
    els.basketTotal.textContent = `${money(basketBestTotal(basket))} estimated`;
  }
  if (els.basketStores) {
    const stores = basketStoreSummary(basket);
    els.basketStores.innerHTML = stores.length
      ? stores.map(([storeName, count]) => `<span class="store-pill">${storeName}${count > 1 ? ` x${count}` : ""}</span>`).join("")
      : `<span class="store-pill muted">No stores yet</span>`;
  }
  if (basket.length === 0) {
    els.basketList.innerHTML = `<div class="basket-empty">Add pulse picks to start building this cart.</div>`;
  } else {
    els.basketList.innerHTML = basket.map((product) => `
      <div class="basket-item">
        <div>
          <div class="basket-item-title">
            <strong>${product.name}</strong>
            ${itemQuantity(product) > 1 ? `<span class="quantity-badge">x${itemQuantity(product)}</span>` : ""}
          </div>
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
  basket = activeGroup().items;
  saveProfile();
  renderBasket();
  renderGroupCards();
  renderProfile();
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
  basket = activeGroup().items;
  saveProfile();
  renderBasket();
  renderGroupCards();
  renderProfile();
}

function deleteArchivedGroup(groupId) {
  const group = profile.archivedGroups.find((item) => item.id === groupId);
  if (!group) return;
  if (!window.confirm(`Permanently delete archived list "${group.name}"?`)) return;

  profile.archivedGroups = profile.archivedGroups.filter((item) => item.id !== groupId);
  saveProfile();
  renderProfile();
}

function renameGroup(groupId) {
  const group = profile.groups.find((item) => item.id === groupId);
  if (!group) return;
  const nextName = window.prompt("Rename list", group.name)?.trim();
  if (!nextName || nextName === group.name) return;

  group.name = nextName;
  saveProfile();
  renderBasket();
  renderGroupCards();
  renderProfile();
}

function renderGroupCards() {
  if (!els.groupCards) return;
  els.groupCards.innerHTML = profile.groups.map((group) => {
    const pricedItems = group.items.filter(hasPriceProfile);
    const total = pricedItems.reduce((sum, product) => sum + ((bestStore(product)?.price || 0) * itemQuantity(product)), 0);
    return `
      <article class="group-card">
        <header>
          <div>
            <div class="group-title-row">
              <h3>${group.name}</h3>
              <button class="icon-edit-btn" type="button" data-rename-group="${group.id}" aria-label="Rename ${group.name}" title="Rename list">&#9998;</button>
            </div>
            <p class="subtle">${basketLabel(basketQuantity(group.items))} - best-item total ${money(total)}</p>
          </div>
          <div class="card-actions">
            <button class="ghost-btn" type="button" data-open-group="${group.id}">Open</button>
            <button class="ghost-btn" type="button" data-seed-group="${group.id}">Demo</button>
            <button class="ghost-btn archive-btn" type="button" data-archive-group="${group.id}" ${profile.groups.length <= 1 ? "disabled" : ""}>Archive</button>
          </div>
        </header>
        <div class="basket-list">
          ${group.items.length ? group.items.map((product) => `
            <div class="basket-item">
              <div>
                <div class="basket-item-title">
                  <strong>${product.name}</strong>
                  ${itemQuantity(product) > 1 ? `<span class="quantity-badge">x${itemQuantity(product)}</span>` : ""}
                </div>
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
        ${source === "saved" ? `<button class="ghost-btn archive-btn" type="button" data-archive-saved="${product.upc}">Archive</button>` : ""}
      </div>
    </article>
  `;
}

function renderProfile() {
  if (els.profileName) els.profileName.textContent = profile.name;
  if (els.profileButton) els.profileButton.title = `Profile: ${profile.name}`;
  if (els.profileNameInput) els.profileNameInput.value = profile.name;
  if (els.navStyleToggle) els.navStyleToggle.checked = profile.navStyle === "navbar";
  if (els.plusButtonToggle) els.plusButtonToggle.checked = profile.showPlusButton;
  if (!els.profileStats) return;
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
      <p class="subtle">Local-only profile. Email sync can come later.</p>
      <p>${profile.groups.length} list groups - ${profile.history.length} recent scans - ${profile.saved.length} saved products - ${profile.archivedGroups.length + profile.archivedSaved.length} archived items</p>
    </article>
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
  els.scannerSection?.classList.remove("hidden");

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
  els.scannerSection?.classList.add("hidden");
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
els.navStyleToggle?.addEventListener("change", (event) => {
  profile.navStyle = event.target.checked ? "navbar" : "fab";
  document.body.classList.toggle("nav-style-navbar", event.target.checked);
  saveProfile();
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
  const renameButton = event.target.closest("[data-rename-group]");
  const archiveButton = event.target.closest("[data-archive-group]");
  if (renameButton) {
    renameGroup(renameButton.dataset.renameGroup);
    return;
  }
  if (archiveButton) {
    archiveGroup(archiveButton.dataset.archiveGroup);
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
  const archiveSaved = event.target.closest("[data-archive-saved]");
  if (relookup) {
    switchView("scan");
    lookup(relookup.dataset.relookup);
  }
  if (addSnapshot) {
    const source = addSnapshot.dataset.source === "saved" ? profile.saved : profile.history;
    const product = source.find((item) => item.upc === addSnapshot.dataset.addSnapshot);
    if (product) addProductToBasket(product);
  }
  if (archiveSaved) archiveSavedProduct(archiveSaved.dataset.archiveSaved);
}
els.historyList?.addEventListener("click", handleProductListAction);
els.savedList?.addEventListener("click", handleProductListAction);
els.profileStats?.addEventListener("click", (event) => {
  const restoreGroup = event.target.closest("[data-restore-group]");
  const restoreSaved = event.target.closest("[data-restore-saved]");
  const deleteGroup = event.target.closest("[data-delete-archived-group]");
  const deleteSaved = event.target.closest("[data-delete-archived-saved]");
  if (restoreGroup) restoreArchivedGroup(restoreGroup.dataset.restoreGroup);
  if (restoreSaved) restoreArchivedSaved(restoreSaved.dataset.restoreSaved);
  if (deleteGroup) deleteArchivedGroup(deleteGroup.dataset.deleteArchivedGroup);
  if (deleteSaved) deleteArchivedSaved(deleteSaved.dataset.deleteArchivedSaved);
});

// Pulse & Modal Listeners
document.querySelector(".pulse-grid")?.addEventListener("click", (e) => {
  const card = e.target.closest("[data-pulse-trigger]");
  const quickAdd = e.target.closest("[data-add-cheapest]");

  if (quickAdd) {
    addPulseItem(quickAdd.dataset.addCheapest);
    return;
  }

  if (card) {
    openBreakdown(card.dataset.pulseTrigger);
  }
});

els.closeModal?.addEventListener("click", closeBreakdown);

els.backToSummary?.addEventListener("click", () => {
  els.storeDrilldown.classList.add("hidden");
  els.breakdownSummary.classList.remove("hidden");
});

els.breakdownSummary?.addEventListener("click", (e) => {
  const drillBtn = e.target.closest("[data-drilldown-store]");
  const addBtn = e.target.closest(".add-specific-btn");

  if (drillBtn) {
    openStoreDrilldown(drillBtn.dataset.drilldownType, drillBtn.dataset.drilldownStore);
  } else if (addBtn) {
    addPulseItem(addBtn.dataset.pulseType, addBtn.dataset.store, addBtn.dataset.brand);
  }
});

els.drilldownList?.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-specific-btn");
  if (btn) {
    addPulseItem(btn.dataset.pulseType, btn.dataset.store, btn.dataset.brand);
  }
});

document.querySelectorAll("[data-code]").forEach((button) => {
  button.addEventListener("click", () => lookup(button.dataset.code));
});

function openBreakdown(type) {
  const data = pulseData[type];
  if (!data) return;

  els.modalTitle.textContent = data.name;
  els.modalIcon.textContent = data.icon;

  renderBreakdownSummary(type);
  els.breakdownModal.classList.remove("hidden");
  els.breakdownSummary.classList.remove("hidden");
  els.storeDrilldown.classList.add("hidden");
}

function renderBreakdownSummary(type) {
  const data = pulseData[type];
  els.breakdownSummary.innerHTML = data.stores.map((store) => {
    const cheapest = [...store.options].sort((a, b) => a.price - b.price)[0];
    return `
      <div class="store-summary-card">
        <div class="summary-header">
          <strong>${store.name}</strong>
          <span class="summary-meta">${store.distance} away</span>
        </div>
        <div class="summary-details">
          <div>
            <span class="summary-brand">${cheapest.brand}</span>
            <span class="summary-meta">Cheapest option: ${money(cheapest.price)}</span>
          </div>
          <button class="view-all-btn" data-drilldown-type="${type}" data-drilldown-store="${store.name}">View all options →</button>
        </div>
        <button class="add-specific-btn" data-pulse-type="${type}" data-store="${store.name}" data-brand="${cheapest.brand}">Add Cheapest</button>
      </div>
    `;
  }).join("");
}

function openStoreDrilldown(type, storeName) {
  const data = pulseData[type];
  const store = data.stores.find(s => s.name === storeName);
  if (!store) return;

  els.drilldownStoreName.textContent = store.name;

  // Expiration logic
  const today = new Date();
  const expDate = new Date();
  expDate.setDate(today.getDate() + data.shelfLife);
  const dateStr = expDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const relativeStr = `${data.shelfLife} days from today`;

  els.drilldownList.innerHTML = [...store.options]
    .sort((a, b) => a.price - b.price)
    .map((opt) => `
      <div class="breakdown-item">
        <div class="item-main">
          <strong>${opt.brand}</strong>
          <div class="item-meta">
            <span>${money(opt.price)}</span>
            <span>Exp: ${dateStr} (${relativeStr})</span>
          </div>
          <p class="analysis-text">${opt.analysis}</p>
          <button class="query-btn" onclick="alert('Bino Analysis: This brand offers the best balance of price and shelf stability for your local market.')">Why this brand?</button>
        </div>
        <div class="item-action">
          <button class="add-specific-btn" data-pulse-type="${type}" data-store="${store.name}" data-brand="${opt.brand}">Add</button>
        </div>
      </div>
    `).join("");

  els.breakdownSummary.classList.add("hidden");
  els.storeDrilldown.classList.remove("hidden");
}

function closeBreakdown() {
  els.breakdownModal.classList.add("hidden");
}

function addPulseItem(type, storeName, brandName) {
  const data = pulseData[type];
  const store = storeName ? data.stores.find(s => s.name === storeName) : data.stores[0];
  const option = brandName
    ? store.options.find(o => o.brand === brandName)
    : [...store.options].sort((a, b) => a.price - b.price)[0];

  if (!option) return;

  const product = {
    upc: `pulse-${type}-${store.name.toLowerCase()}-${option.brand.replace(/\s+/g, '-').toLowerCase()}`,
    name: `${data.name}`,
    brand: option.brand,
    size: "Standard",
    category: "Market Pulse",
    stores: [{ name: store.name, price: option.price, distance: store.distance, confidence: "Pulse match" }]
  };

  addProductToBasket(product);
  closeBreakdown();
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
const initialLookup = initialParams.get("lookup");
if (document.body?.dataset.page === "scan") {
  updateTorchButton();
  setMode("empty");
  if (initialLookup) lookup(initialLookup);
  if (initialParams.get("scan") === "true") startCamera();
}
