(() => {
  "use strict";

  if (window.__salitaCoinAvatarShopTopbarV1Installed) return;
  window.__salitaCoinAvatarShopTopbarV1Installed = true;

  const selectors = [
    "#coinCount", "#coinsCount", "#coinBalance", "#coinsBalance",
    "[data-coin-count]", "[data-coins]", "[data-currency='coins']",
    ".coin-count", ".coins-count", ".coin-balance", ".coins-balance",
    ".topbar-coins", ".player-coins", ".currency-coins"
  ];

  function coinAnchor() {
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (node) return node.closest("button,div,span,li") || node;
    }
    const candidates = [...document.querySelectorAll("header *, .topbar *, .app-header *, .player-stats *")];
    return candidates.find(node => /🪙|\bcoins?\b/i.test(node.textContent || "") && node.children.length <= 3) || null;
  }

  function openShop(event) {
    event?.preventDefault();
    event?.stopPropagation();
    window.SalitaCoinAvatarShop?.open?.();
  }

  function installTrigger() {
    document.querySelectorAll(".sq-avatar-collection-header [data-open-coin-shop]").forEach(button => button.remove());
    const anchor = coinAnchor();
    if (!anchor) return false;
    let button = document.querySelector("[data-topbar-coin-shop]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "sq-topbar-coin-shop";
      button.dataset.topbarCoinShop = "true";
      button.setAttribute("aria-label", "Open avatar shard shop");
      button.title = "Open Avatar Shard Shop";
      button.innerHTML = '<span aria-hidden="true">🛍️</span><span class="sq-topbar-coin-shop-label">Shop</span>';
      button.addEventListener("click", openShop);
    }
    if (button.previousElementSibling !== anchor) anchor.insertAdjacentElement("afterend", button);
    return true;
  }

  function raiseOverlay() {
    const modal = document.querySelector(".sq-coin-shop-backdrop");
    if (!modal) return;
    if (modal.parentElement !== document.body) document.body.appendChild(modal);
    modal.style.setProperty("z-index", "2147483000", "important");
  }

  function sync() {
    installTrigger();
    raiseOverlay();
  }

  document.addEventListener("salita:coin-avatar-shop-ready", sync);
  new MutationObserver(sync).observe(document.documentElement, {childList:true, subtree:true});
  sync();
})();