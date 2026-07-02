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

  profile.groups = Array.isArray(profile.groups) && profile.groups.length ? profile.groups : defaultProfile().groups;
  profile.history = Array.isArray(profile.history) ? profile.history : [];
  profile.saved = Array.isArray(profile.saved) ? profile.saved : [];
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

function deleteGroup(groupId) {
  if (profile.groups.length <= 1) return;
  const group = profile.groups.find((item) => item.id === groupId);
  if (!group) return;
  if (!window.confirm(`Delete "${group.name}" and its ${basketLabel(group.items.length)}?`)) return;

  profile.groups = profile.groups.filter((item) => item.id !== groupId);
  if (profile.activeGroupId === groupId) {
    profile.activeGroupId = profile.groups[0].id;
  }
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

function renderProfile() {
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

function renderCurrentPage() {
  updateProfileHeader();
  renderGroups();
  renderHistory();
  renderSaved();
  renderProfile();
}

function handleProductAction(event) {
  const addButton = event.target.closest("[data-add-snapshot]");
  if (!addButton) return;
  const source = addButton.dataset.source === "saved" ? profile.saved : profile.history;
  const product = source.find((item) => item.upc === addButton.dataset.addSnapshot);
  if (product) addProductToActiveGroup(product);
}

function handleGroupAction(event) {
  const renameButton = event.target.closest("[data-rename-group]");
  const deleteButton = event.target.closest("[data-delete-group]");
  if (renameButton) renameGroup(renameButton.dataset.renameGroup);
  if (deleteButton) deleteGroup(deleteButton.dataset.deleteGroup);
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
