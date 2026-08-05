(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestSocialConnectionsRuntimeV1Installed";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const API_STORAGE = "salitaQuestSocialApiBase";
  const RELEASE = "5.6.0";
  if (window[INSTALL_FLAG] && window.SalitaQuestSocialConnectionsRuntimeV1) return;

  function readStore() {
    try { return JSON.parse(localStorage.getItem(PROFILE_STORE) || "null") || {profiles:[]}; }
    catch { return {profiles:[]}; }
  }

  function activeProfile() {
    const store = readStore();
    const id = sessionStorage.getItem(ACTIVE_PROFILE);
    return store.profiles?.find(profile => profile.id === id) || null;
  }

  function explicitApiBase() {
    return String(window.SALITA_SOCIAL_API_BASE || "").trim();
  }

  function developerApiBase() {
    try { return String(localStorage.getItem(API_STORAGE) || "").trim(); }
    catch { return ""; }
  }

  function setDeveloperApiBase(value) {
    const next = String(value || "").trim().replace(/\/$/, "");
    try {
      if (next) localStorage.setItem(API_STORAGE, next);
      else localStorage.removeItem(API_STORAGE);
    } catch {}
    return next;
  }

  function currentViewHandler() {
    try { return typeof switchView === "function" ? switchView : null; }
    catch { return null; }
  }

  function openView(view) {
    const handler = currentViewHandler();
    return handler ? handler(view) : undefined;
  }

  function wrapView(createWrapper) {
    const base = currentViewHandler();
    if (!base) return false;
    const wrapped = createWrapper(base);
    if (typeof wrapped !== "function") throw new TypeError("Social connections view wrapper must be a function.");
    switchView = wrapped;
    return true;
  }

  window[INSTALL_FLAG] = true;
  window.SalitaQuestSocialConnectionsRuntimeV1 = Object.freeze({
    version:1,
    release:RELEASE,
    activeProfile,
    explicitApiBase,
    developerApiBase,
    setDeveloperApiBase,
    openView,
    wrapView
  });
})();
