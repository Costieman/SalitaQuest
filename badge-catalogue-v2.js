(() => {
  "use strict";

  const COORDINATOR_FLAG = "__salitaQuestBadgeCatalogueV2CoordinatorInstalled";
  const LOADING_FLAG = "__salitaQuestBadgeCatalogueV2CompatibilityLoading";
  const FEATURE_FLAG = "__salitaQuestBadgeCatalogueV2Installed";
  const ADAPTER_URL = "./src/adapters/badges/badge-catalogue-runtime-v1.js?v=5.6.0";
  const FEATURE_URL = "./src/features/badges/badge-catalogue-v2.js?v=5.4.23";
  if (window[COORDINATOR_FLAG]) return;
  window[COORDINATOR_FLAG] = true;

  function loadDependency(ready, target, marker) {
    if (ready()) return Promise.resolve();
    const selector = `script[data-sq-badge-catalogue-dependency="${marker}"]`;
    const existing = document.querySelector(selector);
    if (existing) return new Promise((resolve,reject) => {
      existing.addEventListener("load",resolve,{once:true});
      existing.addEventListener("error",reject,{once:true});
    });
    return new Promise((resolve,reject) => {
      const script = document.createElement("script");
      script.src = new URL(target, document.currentScript?.src || document.baseURI).href;
      script.async = false;
      script.dataset.sqBadgeCatalogueDependency = marker;
      script.addEventListener("load",resolve,{once:true});
      script.addEventListener("error",reject,{once:true});
      (document.head || document.documentElement).appendChild(script);
    });
  }

  function install() {
    if (window[FEATURE_FLAG] || window[LOADING_FLAG]) return;
    window[LOADING_FLAG] = true;
    const current = document.currentScript;
    if (document.readyState === "loading" && current) {
      const base = current.src || document.baseURI;
      if (!window.SalitaBadgeCatalogueRuntimeV1) document.write(`<script src="${new URL(ADAPTER_URL,base).href}"><\/script>`);
      if (!window[FEATURE_FLAG]) document.write(`<script src="${new URL(FEATURE_URL,base).href}"><\/script>`);
      window[LOADING_FLAG] = false;
      return;
    }
    loadDependency(() => Boolean(window.SalitaBadgeCatalogueRuntimeV1),ADAPTER_URL,"runtime-v1")
      .then(() => loadDependency(() => Boolean(window[FEATURE_FLAG]),FEATURE_URL,"feature-v2"))
      .catch(error => console.warn("Badge catalogue compatibility could not load",error))
      .finally(() => { window[LOADING_FLAG] = false; });
  }

  install();
})();
