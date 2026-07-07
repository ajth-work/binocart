const assert = require("node:assert/strict");
const test = require("node:test");
const { createHarness, receiptRow } = require("./browser-script-harness");

test("new profiles include archive and receipt collections", () => {
  const { context } = createHarness("pages.js");
  const profile = context.defaultProfile();

  assert.equal(profile.groups.length, 2);
  assert.equal(profile.archivedGroups.length, 0);
  assert.equal(profile.archivedSaved.length, 0);
  assert.equal(profile.receipts.length, 0);
  assert.equal(profile.receiptLineItems.length, 0);
  assert.equal(profile.priceObservations.length, 0);
  assert.equal(profile.pulsePreview, false);
  assert.equal(profile.pulseFastSnap, false);
  assert.equal(profile.receiptDebugLog, false);
});

test("archive, restore, and delete list workflow persists to localStorage", () => {
  const { context, profile } = createHarness("pages.js", { confirm: () => true });

  context.createGroup("Warehouse run");
  let stored = profile();
  const groupId = stored.groups.find((group) => group.name === "Warehouse run").id;

  context.archiveGroup(groupId);
  stored = profile();
  assert.equal(stored.groups.some((group) => group.id === groupId), false);
  assert.equal(stored.archivedGroups.some((group) => group.id === groupId), true);

  context.restoreArchivedGroup(groupId);
  stored = profile();
  assert.equal(stored.groups.some((group) => group.id === groupId), true);
  assert.equal(stored.archivedGroups.length, 0);

  context.archiveGroup(groupId);
  context.deleteArchivedGroup(groupId);
  stored = profile();
  assert.equal(stored.archivedGroups.some((group) => group.id === groupId), false);
});

test("archived saved products restore before permanent deletion", () => {
  const { context, storage, profile } = createHarness("pages.js", { confirm: () => true });
  const seed = context.defaultProfile();
  seed.saved.push({
    upc: "041570052057",
    name: "Jif Creamy Peanut Butter",
    brand: "J.M. Smucker",
    size: "16 oz",
    stores: []
  });
  storage.setItem("binocart.profile.v1", JSON.stringify(seed));
  context.loadProfile();

  context.archiveSavedProduct("041570052057");
  let stored = profile();
  assert.equal(stored.saved.length, 0);
  assert.equal(stored.archivedSaved.length, 1);

  context.restoreArchivedSaved("041570052057");
  stored = profile();
  assert.equal(stored.saved.length, 1);
  assert.equal(stored.archivedSaved.length, 0);

  context.archiveSavedProduct("041570052057");
  context.deleteArchivedSaved("041570052057");
  stored = profile();
  assert.equal(stored.archivedSaved.length, 0);
});

test("saving a reviewed receipt creates receipt memory and price observations", () => {
  const { context, element, profile } = createHarness("pages.js");

  element("#receiptStore").value = "Kroger";
  element("#receiptLocation").value = "Columbus, OH";
  element("#receiptDate").value = "2026-07-03";
  element("#receiptSubtotal").value = "6.82";
  element("#receiptTax").value = "0.20";
  element("#receiptTotal").value = "7.02";
  element("#receiptItems").querySelectorAll = (selector) => selector === "[data-receipt-item]"
    ? [
      receiptRow("Jif Creamy Peanut Butter", 1, 2.84, "051500255162"),
      receiptRow("Chobani Oatmilk Original", 1, 3.98)
    ]
    : [];

  context.saveReceiptFromReview();
  const stored = profile();

  assert.equal(stored.receipts.length, 1);
  assert.equal(stored.receipts[0].store, "Kroger");
  assert.equal(stored.receipts[0].receiptJson.business.store_name, "Kroger");
  assert.equal(stored.receipts[0].receiptJson.items[0].barcode, "051500255162");
  assert.equal(stored.receipts[0].receiptJson.items[0].unit_price, 2.84);
  assert.equal(stored.receiptLineItems.length, 2);
  assert.equal(stored.receiptLineItems[0].receiptId, stored.receipts[0].id);
  assert.equal(stored.receiptLineItems[0].itemName, "Jif Creamy Peanut Butter");
  assert.equal(stored.receiptLineItems[0].barcode, "051500255162");
  assert.equal(stored.priceObservations.length, 2);
  assert.equal(stored.priceObservations[0].barcode, "051500255162");
  assert.deepEqual([...stored.priceObservations.map((item) => item.itemName)], [
    "Jif Creamy Peanut Butter",
    "Chobani Oatmilk Original"
  ]);
});

test("pasted receipt text parses into editable receipt memory", () => {
  const { context, element, profile } = createHarness("pages.js");
  const parsed = context.parseReceiptText(`
    Kroger Columbus OH
    07/06/2026
    Milk Gallon 1 3.05
    Eggs Large Dozen 1.89
    Subtotal 4.94
    Tax 0.00
    Total 4.94
  `);

  context.renderReceiptReview(parsed);
  element("#receiptItems").querySelectorAll = (selector) => selector === "[data-receipt-item]"
    ? parsed.items.map((item) => receiptRow(item.name, item.quantity, item.unitPrice))
    : [];
  context.saveReceiptFromReview();
  const stored = profile();

  assert.equal(stored.receipts.length, 1);
  assert.equal(stored.receipts[0].source, "text parser");
  assert.equal(stored.receipts[0].date, "2026-07-06");
  assert.equal(stored.receipts[0].items.length, 2);
  assert.equal(stored.receipts[0].receiptJson.suggested_filename, "Kroger_Columbus_OH_[2026.07.06] 000000");
  assert.equal(stored.receiptLineItems.length, 2);
  assert.equal(stored.priceObservations.length, 2);
  assert.equal(stored.priceObservations[0].store, "Kroger Columbus OH");
});

test("price memory graph renders saved receipt observations", () => {
  const seed = {
    id: "profile-test",
    name: "My profile",
    activeGroupId: "group-test",
    groups: [{ id: "group-test", name: "Weekly staples", items: [] }],
    history: [],
    saved: [],
    archivedGroups: [],
    archivedSaved: [],
    receipts: [],
    receiptLineItems: [],
    priceObservations: [
      { itemName: "Milk Gallon", barcode: "011110038342", unitPrice: 3.49, date: "2026-07-01", store: "Kroger" },
      { itemName: "Milk Gallon", barcode: "011110038342", unitPrice: 3.19, date: "2026-07-08", store: "Aldi" }
    ]
  };
  const { context } = createHarness("pages.js", {
    storage: { "binocart.profile.v1": JSON.stringify(seed) }
  });

  const html = context.renderPriceMemoryGraph();
  assert.match(html, /Milk Gallon/);
  assert.match(html, /Barcode 011110038342/);
  assert.match(html, /price-memory-chart/);
});

test("receipt barcode aliases populate canonical receipt rows", () => {
  const { context } = createHarness("pages.js");
  const receipt = {
    store: "Aldi",
    location: "Columbus, OH",
    date: "2026-07-07",
    subtotal: 2.99,
    tax: 0,
    total: 2.99,
    items: [
      { name: "Parmesan Cheese", barcode_number: "041498124578", quantity: 1, unitPrice: 2.99 }
    ]
  };

  const json = context.buildCanonicalReceiptJson(receipt);
  assert.equal(json.items[0].barcode, "041498124578");
  assert.match(context.receiptItemRow(receipt.items[0], 0), /041498124578/);
});

test("receipt detail renders saved receipt rows and totals", () => {
  const { context } = createHarness("pages.js");
  const html = context.renderReceiptDetail({
    id: "receipt-1",
    store: "Meijer #104",
    location: "Columbus, OH",
    date: "2026-01-24",
    subtotal: 12.99,
    tax: 1.48,
    total: 14.47,
    source: "openai:gpt-5.4-mini",
    items: [
      { name: "Parmesan Cheese", barcode: "041498124578", quantity: 1, unitPrice: 2.99 }
    ]
  });

  assert.match(html, /Meijer #104/);
  assert.match(html, /Parmesan Cheese/);
  assert.match(html, /Barcode 041498124578/);
  assert.match(html, /Download JSON/);
});
