const profileKey = "binocart.profile.v1";
const legacyProfileKey = "pricescout.profile.v1";

const els = {
  profileName: document.querySelector("#profileName"),
  profileButton: document.querySelector("#profileButton"),
  profileNameInput: document.querySelector("#profileNameInput"),
  profileForm: document.querySelector("#profileForm"),
  profileStats: document.querySelector("#profileStats"),
  groupCards: document.querySelector("#groupCards"),
  newGroupQuick: document.querySelector("#newGroupQuick"),
  historyList: document.querySelector("#historyList"),
  clearHistory: document.querySelector("#clearHistory"),
  savedList: document.querySelector("#savedList"),
  receiptFile: document.querySelector("#receiptFile"),
  receiptFileName: document.querySelector("#receiptFileName"),
  receiptPreview: document.querySelector("#receiptPreview"),
  parseReceiptDemo: document.querySelector("#parseReceiptDemo"),
  resetReceiptReview: document.querySelector("#resetReceiptReview"),
  receiptForm: document.querySelector("#receiptForm"),
  receiptStore: document.querySelector("#receiptStore"),
  receiptLocation: document.querySelector("#receiptLocation"),
  receiptDate: document.querySelector("#receiptDate"),
  receiptItems: document.querySelector("#receiptItems"),
  receiptSubtotal: document.querySelector("#receiptSubtotal"),
  receiptTax: document.querySelector("#receiptTax"),
  receiptTotal: document.querySelector("#receiptTotal"),
  receiptHistory: document.querySelector("#receiptHistory"),
  receiptHistoryCount: document.querySelector("#receiptHistoryCount"),
  showLabelsToggle: document.querySelector("#showLabelsToggle"),
  navStyleToggle: document.querySelector("#navStyleToggle"),
  blurRange: document.querySelector("#blurRange"),
  blurValue: document.querySelector("#blurValue"),
  navPlusAction: document.querySelector("#navPlusAction"),
  actionOverlay: document.querySelector("#actionOverlay"),
  closeActions: document.querySelector("#closeActions"),
  actionBarcodeScan: document.querySelector("#actionBarcodeScan"),
  plusButtonToggle: document.querySelector("#plusButtonToggle")
};

let profile = null;
let receiptDraft = null;

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
    priceObservations: [],
    showMenuLabels: false,
    menuBlur: 2,
    navStyle: "fab"
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
  profile.priceObservations = Array.isArray(profile.priceObservations) ? profile.priceObservations : [];
  profile.showMenuLabels = typeof profile.showMenuLabels === "boolean" ? profile.showMenuLabels : false;
  profile.menuBlur = typeof profile.menuBlur === "number" ? profile.menuBlur : 2;
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
      { name: "Jif Creamy Peanut Butter", quantity: 1, unitPrice: 2.84 },
      { name: "Chobani Oatmilk Original", quantity: 1, unitPrice: 3.98 },
      { name: "Kleenex Trusted Care Tissues", quantity: 1, unitPrice: 5.99 }
    ]
  };
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
  els.receiptItems.innerHTML = receipt.items.map((item, index) => `
    <div class="receipt-item-row" data-receipt-item="${index}">
      <input type="text" value="${escapeHtml(item.name)}" aria-label="Receipt item name ${index + 1}" />
      <input type="number" min="0" step="1" value="${item.quantity || 1}" aria-label="Receipt item quantity ${index + 1}" />
      <input type="number" min="0" step="0.01" value="${Number(item.unitPrice || 0).toFixed(2)}" aria-label="Receipt item price ${index + 1}" />
    </div>
  `).join("");
}

function clearReceiptReview() {
  receiptDraft = null;
  els.receiptForm?.classList.add("hidden");
  if (els.receiptItems) els.receiptItems.innerHTML = "";
}

function readReceiptReview() {
  const items = [...els.receiptItems.querySelectorAll("[data-receipt-item]")].map((row) => {
    const [nameInput, quantityInput, priceInput] = row.querySelectorAll("input");
    return {
      name: nameInput.value.trim(),
      quantity: Number(quantityInput.value) || 1,
      unitPrice: Number(priceInput.value) || 0
    };
  }).filter((item) => item.name);

  return {
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
}

function saveReceiptFromReview() {
  const receipt = readReceiptReview();
  if (receipt.items.length === 0) return;

  profile.receipts.unshift(receipt);
  profile.priceObservations.unshift(...receipt.items.map((item) => ({
    id: makeId("price"),
    receiptId: receipt.id,
    itemName: item.name,
    store: receipt.store,
    location: receipt.location,
    date: receipt.date,
    quantity: item.quantity,
    unitPrice: item.unitPrice
  })));
  profile.receipts = profile.receipts.slice(0, 50);
  profile.priceObservations = profile.priceObservations.slice(0, 500);
  saveProfile();
  clearReceiptReview();
  renderCurrentPage();
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
          <a class="ghost-btn" href="profile.html">Profile</a>
        </div>
      </article>
    `).join("")
    : `<div class="basket-empty">Parsed receipts will appear here after review.</div>`;
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

function renderProfile() {
  if (els.profileNameInput) els.profileNameInput.value = profile.name;
  if (els.navStyleToggle) els.navStyleToggle.checked = profile.navStyle === "navbar";
  if (els.plusButtonToggle) els.plusButtonToggle.checked = false;
  if (els.showLabelsToggle) els.showLabelsToggle.checked = profile.showMenuLabels;
  if (els.blurRange) els.blurRange.value = profile.menuBlur;
  if (els.blurValue) els.blurValue.textContent = `${profile.menuBlur}px`;
  if (!els.profileStats) return;
  const recentReceipts = profile.receipts.slice(0, 5).map((receipt) => `
    <article class="archive-row">
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
      <p class="subtle">Local-only profile. Email sync can come later.</p>
      <p>${profile.groups.length} list groups - ${profile.history.length} recent scans - ${profile.saved.length} saved products - ${profile.receipts.length} receipts - ${profile.priceObservations.length} price observations</p>
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
els.profileStats?.addEventListener("click", handleProfileArchiveAction);
els.receiptFile?.addEventListener("change", () => {
  const file = els.receiptFile.files?.[0];
  if (!file) return;
  els.receiptFileName.textContent = file.name;
  if (file.type.startsWith("image/")) {
    const url = URL.createObjectURL(file);
    els.receiptPreview.innerHTML = `<img src="${url}" alt="Uploaded receipt preview" />`;
  } else {
    els.receiptPreview.innerHTML = `<div class="basket-empty">${file.name} selected. PDF preview can come with backend processing.</div>`;
  }
});
els.parseReceiptDemo?.addEventListener("click", () => renderReceiptReview(mockParsedReceipt()));
els.resetReceiptReview?.addEventListener("click", clearReceiptReview);
els.receiptForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveReceiptFromReview();
});
