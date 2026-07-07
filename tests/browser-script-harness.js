const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createClassList() {
  const values = new Set();
  return {
    add: (...tokens) => tokens.forEach((token) => values.add(token)),
    remove: (...tokens) => tokens.forEach((token) => values.delete(token)),
    toggle: (token, force) => {
      if (force === undefined ? !values.has(token) : force) {
        values.add(token);
        return true;
      }
      values.delete(token);
      return false;
    },
    contains: (token) => values.has(token),
    toString: () => [...values].join(" ")
  };
}

function createElement(overrides = {}) {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    dataset: {},
    files: [],
    style: {},
    classList: createClassList(),
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() {
      return null;
    },
    closest() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
    ...overrides
  };
}

function createStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key) => store.has(key) ? store.get(key) : null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    snapshot: () => Object.fromEntries(store.entries())
  };
}

function createHarness(scriptName, options = {}) {
  const root = path.resolve(__dirname, "..");
  const elements = new Map();
  const storage = createStorage(options.storage);

  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, createElement());
      return elements.get(selector);
    },
    querySelectorAll(selector) {
      if (selector === "[data-code]" || selector === "[data-view-target]" || selector === "[data-view]") return [];
      return [];
    }
  };

  const context = {
    console,
    Intl,
    Date,
    Math,
    JSON,
    Number,
    String,
    Array,
    URL,
    URLSearchParams,
    document,
    localStorage: storage,
    navigator: { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [] }) } },
    BarcodeDetector: undefined,
    fetch: async () => ({ ok: false, json: async () => ({}) }),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    FileReader: class {
      addEventListener() {}
      readAsDataURL() {}
    }
  };

  context.window = {
    document,
    localStorage: storage,
    location: { search: options.search || "" },
    confirm: options.confirm || (() => true),
    prompt: options.prompt || (() => ""),
    requestAnimationFrame: (callback) => callback(),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };
  context.globalThis = context;

  vm.createContext(context);
  const source = fs.readFileSync(path.join(root, scriptName), "utf8");
  vm.runInContext(source, context, { filename: scriptName });

  return {
    context,
    elements,
    storage,
    element: (selector) => elements.get(selector) || document.querySelector(selector),
    profile: () => JSON.parse(storage.getItem("binocart.profile.v1"))
  };
}

function receiptRow(name, quantity, unitPrice) {
  const inputs = [
    createElement({ value: name }),
    createElement({ value: String(quantity) }),
    createElement({ value: String(unitPrice) })
  ];
  return createElement({
    querySelectorAll(selector) {
      return selector === "input" ? inputs : [];
    }
  });
}

module.exports = {
  createElement,
  createHarness,
  receiptRow
};
