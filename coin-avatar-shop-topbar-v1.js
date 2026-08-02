(() => {
  "use strict";

  // Emergency production hotfix: keep the document-wide topbar observer disabled.
  // The core shard shop remains available through the stable avatar collection entry.
  window.__salitaCoinAvatarShopTopbarV1Installed = true;
  document.querySelectorAll("[data-topbar-coin-shop]").forEach(button => button.remove());

  if (!document.querySelector('link[data-sq-reveal-rarity]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./coin-avatar-reveal-rarity-v1.css?v=5.6.5";
    link.dataset.sqRevealRarity = "true";
    document.head.appendChild(link);
  }

  document.addEventListener("salita:coin-shard-pack-purchased", event => {
    const host = document.querySelector(".sq-coin-reveal-backdrop");
    if (!host) return;
    const rarity = ["common", "uncommon", "rare"].includes(event.detail?.rarity)
      ? event.detail.rarity
      : "common";
    host.dataset.rarity = rarity;
  });
})();
