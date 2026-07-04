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

test("adding the same product increments basket quantity", () => {
  const { context, profile, element } = createHarness("app.js");

  context.loadProfile();
  const butter = context.getProduct("butter");
  context.addProductToBasket(butter);
  context.addProductToBasket(butter);

  const activeGroup = profile().groups[0];
  assert.equal(activeGroup.items.length, 1);
  assert.equal(activeGroup.items[0].quantity, 2);
  assert.equal(element("#basketCount").textContent, "2 items");
  assert.match(element("#basketList").innerHTML, /quantity-badge">x2/);
  assert.equal(element("#basketTotal").textContent, "$6.98 estimated");
  assert.match(element("#basketStores").innerHTML, /Aldi x2/);
});

test("removing a pulse item decrements quantity before removing the row", () => {
  const { context, profile, element } = createHarness("app.js");

  context.loadProfile();
  context.addPulseItem("butter");
  context.addPulseItem("butter");
  context.removePulseItem("butter");

  let activeGroup = profile().groups[0];
  assert.equal(activeGroup.items.length, 1);
  assert.equal(activeGroup.items[0].quantity, 1);
  assert.equal(element("#basketCount").textContent, "1 item");
  assert.equal(element("#basketTotal").textContent, "$3.49 estimated");

  context.removePulseItem("butter");

  activeGroup = profile().groups[0];
  assert.equal(activeGroup.items.length, 0);
  assert.equal(element("#basketCount").textContent, "0 items");
  assert.equal(element("#basketTotal").textContent, "$0.00 estimated");
});
