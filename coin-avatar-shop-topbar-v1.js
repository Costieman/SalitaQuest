(() => {
  "use strict";

  // Emergency production hotfix: keep the document-wide topbar observer disabled.
  // The core shard shop remains available through the stable avatar collection entry.
  window.__salitaCoinAvatarShopTopbarV1Installed = true;
  document.querySelectorAll("[data-topbar-coin-shop]").forEach(button => button.remove());

  if (!document.querySelector('link[data-sq-reveal-rarity]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./coin-avatar-reveal-rarity-v1.css?v=5.6.6";
    link.dataset.sqRevealRarity = "true";
    document.head.appendChild(link);
  }

  if (!document.querySelector('link[data-sq-collection-rarity-fill]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./avatar-collection-rarity-fill-v1.css?v=5.6.7";
    link.dataset.sqCollectionRarityFill = "true";
    document.head.appendChild(link);
  }

  if (!document.querySelector('script[data-sq-testing-grant-100k]')) {
    const script = document.createElement("script");
    script.src = "./coin-testing-grant-100k-v1.js?v=5.6.8";
    script.async = false;
    script.dataset.sqTestingGrant100k = "true";
    document.body.appendChild(script);
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
