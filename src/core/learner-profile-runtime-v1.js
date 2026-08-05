(() => {
  "use strict";

  const API = "SalitaQuestLearnerProfileRuntimeV1";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  if (window[API]) return;

  function emptyStore() {
    return {schemaVersion:1, profiles:[]};
  }

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return value && Array.isArray(value.profiles) ? value : emptyStore();
    } catch {
      return emptyStore();
    }
  }

  function writeStore(store, options = {}) {
    if (!store || !Array.isArray(store.profiles)) return false;
    if (Number.isFinite(Number(options.schemaVersion))) {
      store.schemaVersion = Number(options.schemaVersion);
    } else {
      store.schemaVersion = Math.max(1, Number(store.schemaVersion || 1));
    }
    store.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_STORE, JSON.stringify(store));
    return true;
  }

  function activeId() {
    try { return sessionStorage.getItem(ACTIVE_PROFILE); }
    catch { return null; }
  }

  function activeRecord() {
    const store = readStore();
    const profileId = activeId();
    const profile = store.profiles.find(item => item.id === profileId) || null;
    return {store, profileId, profile};
  }

  function activeProfile() {
    return activeRecord().profile;
  }

  window[API] = Object.freeze({
    version:1,
    profileStoreKey:PROFILE_STORE,
    activeProfileKey:ACTIVE_PROFILE,
    readStore,
    writeStore,
    activeId,
    activeRecord,
    activeProfile
  });
})();
