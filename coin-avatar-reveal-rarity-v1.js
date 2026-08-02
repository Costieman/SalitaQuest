(() => {
  "use strict";

  if (window.__salitaCoinAvatarRevealRarityV1Installed) return;
  window.__salitaCoinAvatarRevealRarityV1Installed = true;

  document.addEventListener("salita:coin-shard-pack-purchased", event => {
    const host = document.querySelector(".sq-coin-reveal-backdrop");
    if (!host) return;
    const rarity = ["common", "uncommon", "rare"].includes(event.detail?.rarity)
      ? event.detail.rarity
      : "common";
    host.dataset.rarity = rarity;
  });
})();
