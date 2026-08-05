(() => {
  "use strict";

  const COORDINATOR_FLAG = "__salitaQuestAvatarCollectionScreenCoordinatorInstalled";
  const LOADING_FLAG = "__salitaQuestAvatarCollectionScreenCompatibilityLoading";
  const PROFILE_URL = "./src/core/learner-profile-runtime-v1.js?v=5.6.1";
  const ADAPTER_URL = "./src/adapters/avatar/avatar-collection-profile-runtime-v1.js?v=5.5.6";
  const FEATURE_URL = "./src/features/avatar/avatar-collection-screen-v1.js?v=5.5.6";
  if (window[COORDINATOR_FLAG]) return;
  window[COORDINATOR_FLAG] = true;

  function loadDependency(apiName, target, marker) {
    if (window[apiName]) return Promise.resolve(window[apiName]);
    const selector = `script[data-sq-avatar-collection-dependency="${marker}"]`;
    const existing = document.querySelector(selector);
    if (existing) return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(window[apiName]), {once:true});
      existing.addEventListener("error", reject, {once:true});
    });
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(target, document.currentScript?.src || document.baseURI).href;
      script.async = false;
      script.dataset.sqAvatarCollectionDependency = marker;
      script.addEventListener("load", () => resolve(window[apiName]), {once:true});
      script.addEventListener("error", () => reject(new Error(`Avatar Collection dependency could not load: ${target}`)), {once:true});
      (document.head || document.documentElement).appendChild(script);
    });
  }

  function install() {
    if (window.__salitaAvatarCollectionScreenInstalled) return;
    if (window[LOADING_FLAG]) return;
    window[LOADING_FLAG] = true;
    const current = document.currentScript;
    if (document.readyState === "loading" && current) {
      const base = current.src || document.baseURI;
      if (!window.SalitaQuestLearnerProfileRuntimeV1) document.write(`<script src="${new URL(PROFILE_URL, base).href}"><\/script>`);
      if (!window.SalitaAvatarCollectionProfileRuntimeV1) document.write(`<script src="${new URL(ADAPTER_URL, base).href}"><\/script>`);
      if (!window.__salitaAvatarCollectionScreenInstalled) document.write(`<script src="${new URL(FEATURE_URL, base).href}"><\/script>`);
      window[LOADING_FLAG] = false;
      return;
    }
    Promise.resolve()
      .then(() => loadDependency("SalitaQuestLearnerProfileRuntimeV1", PROFILE_URL, "learner-profile-runtime-v1"))
      .then(() => loadDependency("SalitaAvatarCollectionProfileRuntimeV1", ADAPTER_URL, "profile-runtime-v1"))
      .then(() => window.__salitaAvatarCollectionScreenInstalled || loadDependency("__salitaAvatarCollectionScreenInstalled", FEATURE_URL, "feature-v1"))
      .then(() => { window[LOADING_FLAG] = false; })
      .catch(error => {
        window[LOADING_FLAG] = false;
        console.warn("Salita Quest Avatar Collection could not load", error);
      });
  }

  install();
})();
