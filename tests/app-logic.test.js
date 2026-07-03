const assert = require("node:assert/strict");
const test = require("node:test");
const { createHarness } = require("./browser-script-harness");

test("normalizes manual UPC input and aliases", () => {
  const { context } = createHarness("app.js");

  assert.equal(context.normalizedCode("  04157-0052057 "), "041570052057");
  assert.equal(context.normalizedCode("peanut butter"), "041570052057");
  assert.equal(context.getProduct("tissues").name, "Kleenex Trusted Care Tissues");
});

test("builds barcode candidates for common UPC and EAN variants", () => {
  const { context } = createHarness("app.js");

  assert.deepEqual([...context.barcodeCandidates("041570052057")], ["041570052057", "0041570052057"]);
  assert.deepEqual([...context.barcodeCandidates("004963406")], ["004963406", "000004963406"]);
  assert.deepEqual([...context.barcodeCandidates("0000000000000")], ["0000000000000", "000000000000"]);
});

test("uses major brand fallback without pretending local prices exist", () => {
  const { context } = createHarness("app.js");
  const fallback = context.majorBrandFallback("025500204086");
  const merged = context.mergeLiveProduct(null, fallback, "025500204086");

  assert.equal(fallback.brand, "Folgers");
  assert.equal(merged.stores.length, 0);
  assert.match(merged.insight, /exact product match|local price/i);
});

test("optimizer compares one-store and multi-store plans", () => {
  const { context } = createHarness("app.js");

  context.loadProfile();
  context.addProductToBasket(context.getProduct("04963406"));
  context.addProductToBasket(context.getProduct("041570052057"));
  context.addProductToBasket(context.getProduct("036000291452"));

  const single = context.singleStorePlan();
  const multi = context.multiStorePlan();

  assert.ok(["Kroger", "Walmart", "Meijer", "Aldi"].includes(single.storeName));
  assert.ok(single.total > 0);
  assert.ok(multi.length >= 1);
  assert.ok(multi.reduce((sum, stop) => sum + stop.total, 0) <= single.total);
});
