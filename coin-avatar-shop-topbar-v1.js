(() => {
  "use strict";

  // Emergency production hotfix: disable the document-wide topbar observer.
  // The core shard shop remains available through the stable avatar collection entry.
  window.__salitaCoinAvatarShopTopbarV1Installed = true;
  document.querySelectorAll("[data-topbar-coin-shop]").forEach(button => button.remove());
})();
