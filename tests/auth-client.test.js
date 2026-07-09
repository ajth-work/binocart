const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function createStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

function runAuthScript(options = {}) {
  const storage = createStorage(options.storage);
  const context = {
    console,
    localStorage: storage,
    setTimeout,
    clearTimeout,
    CustomEvent: class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
      }
    },
    Event: class Event {
      constructor(type) {
        this.type = type;
      }
    },
    supabase: options.supabase,
    window: {
      location: { origin: "https://ajth-work.github.io", pathname: "/binocart/profile.html" },
      dispatchEvent() {}
    }
  };
  context.globalThis = context;
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, "..", "auth.js"), "utf8");
  vm.runInContext(source, context, { filename: "auth.js" });
  return { context, storage };
}

test("auth bootstrap stays in guest mode when Supabase is not configured", () => {
  const { context } = runAuthScript();
  const state = context.BinoCartAuth.getState();

  assert.equal(state.configured, false);
  assert.equal(state.ready, true);
  assert.equal(state.userEmail, "");
});

test("auth bootstrap stores config and hydrates a saved session", async () => {
  const supabase = {
    createClient() {
      return {
        auth: {
          onAuthStateChange() {},
          async getSession() {
            return { data: { session: { user: { email: "bino@example.com" } } }, error: null };
          },
          async signInWithOtp(payload) {
            return { data: payload, error: null };
          },
          async signOut() {
            return { error: null };
          }
        }
      };
    }
  };
  const { context, storage } = runAuthScript({ supabase });

  await context.BinoCartAuth.setConfig("https://demo.supabase.co", "anon-key");
  const state = context.BinoCartAuth.getState();

  assert.equal(storage.getItem("binocart.supabase.url.v1"), "https://demo.supabase.co");
  assert.equal(storage.getItem("binocart.supabase.anon.v1"), "anon-key");
  assert.equal(state.configured, true);
  assert.equal(state.userEmail, "bino@example.com");
});
