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
  assert.equal(profile.priceObservations.length, 0);
  assert.equal(profile.pulsePreview, false);
  assert.equal(profile.pulseFastSnap, false);
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
      receiptRow("Jif Creamy Peanut Butter", 1, 2.84),
      receiptRow("Chobani Oatmilk Original", 1, 3.98)
    ]
    : [];

  context.saveReceiptFromReview();
  const stored = profile();

  assert.equal(stored.receipts.length, 1);
  assert.equal(stored.receipts[0].store, "Kroger");
  assert.equal(stored.priceObservations.length, 2);
  assert.deepEqual([...stored.priceObservations.map((item) => item.itemName)], [
    "Jif Creamy Peanut Butter",
    "Chobani Oatmilk Original"
  ]);
});
