(() => {
  "use strict";

  if (window.__salitaCoinAvatarShardShopV1Installed) return;
  window.__salitaCoinAvatarShardShopV1Installed = true;

  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const SHARDS_PER_PACK = 25;
  const PACKS = Object.freeze({
    common:{cost:1000,label:"Common",icon:"🌿"},
    uncommon:{cost:2000,label:"Uncommon",icon:"🌺"},
    rare:{cost:4000,label:"Rare",icon:"🦅"}
  });

  let modal = null;
  let lastKnownBalance = null;
  let internalBalanceWrite = false;

  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[character]));
  const globalValue = name => { try { return eval(`typeof ${name} !== "undefined" ? ${name} : undefined`); } catch { return undefined; } };
  const appState = () => globalValue("state") || window.state || null;
  const save = () => { const fn = globalValue("saveState") || window.saveState; if (typeof fn === "function") fn(); };
  const syncBadges = () => {
    try { (globalValue("syncEarned") || window.syncEarned)?.(); (globalValue("renderCatalogue") || window.renderCatalogue)?.(); } catch {}
  };
  const balance = () => Math.max(0, Math.floor(Number(appState()?.coins || 0)));

  function economy() {
    const state = appState();
    if (!state) return null;
    state.coinEconomy = state.coinEconomy && typeof state.coinEconomy === "object" ? state.coinEconomy : {};
    const data = state.coinEconomy;
    data.lifetimeEarned = Math.max(0, Math.floor(Number(data.lifetimeEarned ?? state.totalCoinsEarned ?? state.coinsEarned ?? state.coins ?? 0)));
    data.lifetimeSpent = Math.max(0, Math.floor(Number(data.lifetimeSpent || 0)));
    data.shardPacksPurchased = Math.max(0, Math.floor(Number(data.shardPacksPurchased || 0)));
    data.packsByRarity = data.packsByRarity && typeof data.packsByRarity === "object" ? data.packsByRarity : {};
    for (const rarity of Object.keys(PACKS)) data.packsByRarity[rarity] = Math.max(0, Math.floor(Number(data.packsByRarity[rarity] || 0)));
    data.purchaseHistory = Array.isArray(data.purchaseHistory) ? data.purchaseHistory.slice(-100) : [];
    return data;
  }

  function trackExternalCoinChanges() {
    const state = appState();
    if (!state) return;
    const current = balance();
    const data = economy();
    if (lastKnownBalance == null) {
      lastKnownBalance = current;
      save();
      return;
    }
    if (!internalBalanceWrite && current > lastKnownBalance) {
      data.lifetimeEarned += current - lastKnownBalance;
      save();
      syncBadges();
    }
    lastKnownBalance = current;
    internalBalanceWrite = false;
    updateOpenShop();
  }

  function readAccount() {
    try {
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
      const profile = store?.profiles?.find(item => item.id === activeId);
      const model = window.SalitaAvatarModel;
      if (!store || !profile || !model) return null;
      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
      return {store, profile, model, collection};
    } catch { return null; }
  }

  function writeAccount(account) {
    account.profile.avatarCollection = account.collection;
    if (account.collection.equippedAvatarId) account.profile.avatarId = account.collection.equippedAvatarId;
    account.store.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_STORE, JSON.stringify(account.store));
  }

  function eligible(account, rarity) {
    return account.model.list({rarity}).filter(item => !account.collection.ownedAvatarIds.includes(item.id));
  }

  function purchase(rarity) {
    const pack = PACKS[rarity];
    const state = appState();
    const account = readAccount();
    if (!pack || !state || !account) return {ok:false,message:"The shop is not ready yet."};
    if (balance() < pack.cost) return {ok:false,message:`You need ${pack.cost.toLocaleString()} coins.`};
    const pool = eligible(account,rarity);
    if (!pool.length) return {ok:false,message:`All ${pack.label} avatars are already collected.`};

    const item = pool[Math.floor(Math.random() * pool.length)];
    const before = Math.max(0, Number(account.collection.shards[item.id]) || 0);
    const after = Math.min(item.shardRequirement, before + SHARDS_PER_PACK);
    const unlocked = after >= item.shardRequirement;
    account.collection.shards[item.id] = after;
    if (unlocked && !account.collection.ownedAvatarIds.includes(item.id)) {
      account.collection.ownedAvatarIds.push(item.id);
      account.collection.pendingUnlocks.push({avatarId:item.id,source:"coin_shard_pack",unlockedAt:new Date().toISOString(),seen:false});
    }
    writeAccount(account);

    const data = economy();
    internalBalanceWrite = true;
    state.coins = balance() - pack.cost;
    lastKnownBalance = state.coins;
    data.lifetimeSpent += pack.cost;
    data.shardPacksPurchased += 1;
    data.packsByRarity[rarity] += 1;
    data.purchaseHistory.push({rarity,avatarId:item.id,cost:pack.cost,shards:SHARDS_PER_PACK,before,after,unlocked,purchasedAt:new Date().toISOString()});
    data.purchaseHistory = data.purchaseHistory.slice(-100);
    save();
    syncBadges();
    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed",{detail:{avatarId:item.id,source:"coin_shard_pack"}}));
    document.dispatchEvent(new CustomEvent("salita:coin-shard-pack-purchased",{detail:{rarity,avatar:item,cost:pack.cost,before,after,unlocked}}));
    return {ok:true,item,before,after,unlocked,cost:pack.cost};
  }

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "sq-coin-shop-backdrop";
    modal.hidden = true;
    modal.innerHTML = `<section class="sq-coin-shop" role="dialog" aria-modal="true" aria-labelledby="sqCoinShopTitle"><button class="sq-coin-shop-close" type="button" aria-label="Close">×</button><header><p>AVATAR SHARD SHOP</p><h2 id="sqCoinShopTitle">Spend coins on random shard packs</h2><span class="sq-coin-shop-balance"></span></header><div class="sq-coin-shop-message" aria-live="polite"></div><div class="sq-coin-shop-grid"></div><p class="sq-coin-shop-note">Each pack gives 25 shards to one random incomplete avatar within the chosen rarity. Weekly key rewards are unchanged.</p></section>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", event => {
      if (event.target === modal || event.target.closest(".sq-coin-shop-close")) close();
      const button = event.target.closest("[data-coin-pack]");
      if (!button) return;
      const result = purchase(button.dataset.coinPack);
      const message = modal.querySelector(".sq-coin-shop-message");
      message.textContent = result.ok
        ? `${result.item.name} received 25 shards${result.unlocked ? " and was unlocked!" : ` (${result.after}/100).`}`
        : result.message;
      render();
    });
    return modal;
  }

  function render() {
    const account = readAccount();
    if (!modal || !account) return;
    modal.querySelector(".sq-coin-shop-balance").textContent = `🪙 ${balance().toLocaleString()} coins`;
    modal.querySelector(".sq-coin-shop-grid").innerHTML = Object.entries(PACKS).map(([rarity,pack]) => {
      const remaining = eligible(account,rarity).length;
      const affordable = balance() >= pack.cost;
      return `<article class="sq-coin-pack ${rarity}"><span class="sq-coin-pack-icon">${pack.icon}</span><h3>${pack.label} pack</h3><strong>25 random shards</strong><p>${remaining ? `${remaining} incomplete avatars available` : `All ${pack.label} avatars collected`}</p><button type="button" data-coin-pack="${rarity}" ${!remaining || !affordable ? "disabled" : ""}>${remaining ? `${pack.cost.toLocaleString()} coins` : "Collected"}</button></article>`;
    }).join("");
  }

  function updateOpenShop() { if (modal && !modal.hidden) render(); }
  function open() { ensureModal(); render(); modal.hidden = false; document.documentElement.style.overflow = "hidden"; modal.querySelector(".sq-coin-shop-close")?.focus(); }
  function close() { if (!modal) return; modal.hidden = true; document.documentElement.style.overflow = ""; }

  function installButton() {
    const header = document.querySelector(".sq-avatar-collection-header");
    if (!header || header.querySelector("[data-open-coin-shop]")) return false;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sq-open-coin-shop";
    button.dataset.openCoinShop = "true";
    button.textContent = "🪙 Shard Shop";
    button.addEventListener("click",open);
    header.insertBefore(button,header.querySelector(".sq-avatar-collection-close"));
    return true;
  }

  function install() {
    if (!window.SalitaAvatarModel || !appState()) { window.setTimeout(install,120); return; }
    economy();
    lastKnownBalance = balance();
    save();
    installButton();
    new MutationObserver(installButton).observe(document.body,{childList:true,subtree:true});
    window.setInterval(trackExternalCoinChanges,750);
    window.SalitaCoinAvatarShop = Object.freeze({packs:PACKS,shardsPerPack:SHARDS_PER_PACK,open,purchase,eligible});
    document.dispatchEvent(new CustomEvent("salita:coin-avatar-shop-ready"));
  }

  install();
})();