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
  savedList: document.querySelector("#savedList")
};

let profile = null;

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
    archivedSaved: []
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

function renderCurrentPage() {
  updateProfileHeader();
  renderGroups();
  renderHistory();
  renderSaved();
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

loadProfile();
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
els.historyList?.addEventListener("click", handleProductAction);
els.savedList?.addEventListener("click", handleProductAction);
els.groupCards?.addEventListener("click", handleGroupAction);
els.profileStats?.addEventListener("click", handleProfileArchiveAction);
