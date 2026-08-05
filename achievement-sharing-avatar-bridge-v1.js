(() => {
  "use strict";

  const COORDINATOR_FLAG = "__salitaQuestAchievementSharingAvatarBridgeCoordinatorInstalled";
  const LOADING_FLAG = "__salitaQuestAchievementSharingAvatarBridgeCompatibilityLoading";
  const FEATURE_FLAG = "__salitaQuestAchievementSharingAvatarCompatibilityV558Installed";
  const PROFILE_URL = "./src/core/learner-profile-runtime-v1.js?v=5.6.1";
  const ADAPTER_URL = "./src/adapters/avatar/avatar-collection-profile-runtime-v1.js?v=5.5.6";
  const FEATURE_URL = "./src/features/sharing/achievement-sharing-avatar-bridge-v1.js?v=5.5.20.1";

  if (window[COORDINATOR_FLAG]) return;
  window[COORDINATOR_FLAG] = true;

  function loadDependency(ready, target, marker) {
    if (ready()) return Promise.resolve();
    const selector = `script[data-sq-avatar-sharing-bridge-dependency="${marker}"]`;
    const existing = document.querySelector(selector);
    if (existing) return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, {once:true});
      existing.addEventListener("error", reject, {once:true});
    });
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(target, document.currentScript?.src || document.baseURI).href;
      script.async = false;
      script.dataset.sqAvatarSharingBridgeDependency = marker;
      script.addEventListener("load", resolve, {once:true});
      script.addEventListener("error", reject, {once:true});
      (document.head || document.documentElement).appendChild(script);
    });
  }

  function install() {
    if (window[FEATURE_FLAG] || window[LOADING_FLAG]) return;
    window[LOADING_FLAG] = true;
    const current = document.currentScript;
    if (document.readyState === "loading" && current) {
      const base = current.src || document.baseURI;
      if (!window.SalitaQuestLearnerProfileRuntimeV1) {
        document.write(`<script src="${new URL(PROFILE_URL, base).href}"><\/script>`);
      }
      if (!window.SalitaAvatarCollectionProfileRuntimeV1) {
        document.write(`<script src="${new URL(ADAPTER_URL, base).href}"><\/script>`);
      }
      if (!window[FEATURE_FLAG]) {
        document.write(`<script src="${new URL(FEATURE_URL, base).href}"><\/script>`);
      }
      window[LOADING_FLAG] = false;
      return;
    }
    loadDependency(
      () => Boolean(window.SalitaQuestLearnerProfileRuntimeV1),
      PROFILE_URL,
      "learner-profile-runtime"
    ).then(() => loadDependency(
      () => Boolean(window.SalitaAvatarCollectionProfileRuntimeV1),
      ADAPTER_URL,
      "profile-runtime"
    )).then(() => loadDependency(
      () => Boolean(window[FEATURE_FLAG]),
      FEATURE_URL,
      "feature"
    )).catch(error => console.warn("Avatar sharing bridge compatibility could not load", error))
      .finally(() => { window[LOADING_FLAG] = false; });
  }

  install();
})();
