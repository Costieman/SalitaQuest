(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAvatarCollectionProfileRuntimeV1Installed";
  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return value && Array.isArray(value.profiles) ? value : {schemaVersion:1, profiles:[]};
    } catch {
      return {schemaVersion:1, profiles:[]};
    }
  }

  function writeStore(store) {
    if (!store) return false;
    store.schemaVersion = 1;
    store.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_STORE, JSON.stringify(store));
    return true;
  }

  function readContext() {
    const model = window.SalitaAvatarModel;
    if (!model) return null;
    const store = readStore();
    const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
    const profile = store.profiles.find(item => item.id === activeId) || null;
    if (!profile) return null;
    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
    profile.avatarCollection = collection;
    if (collection.equippedAvatarId) profile.avatarId = collection.equippedAvatarId;
    writeStore(store);
    return {store, profile, collection, model};
  }

  function saveContext(context) {
    if (!context?.store || !context?.profile || !context?.collection) return false;
    context.profile.avatarCollection = context.collection;
    if (context.collection.equippedAvatarId) context.profile.avatarId = context.collection.equippedAvatarId;
    return writeStore(context.store);
  }

  function equip(avatarId) {
    const context = readContext();
    if (!context) return null;
    const item = context.model.get(avatarId);
    if (!item || !context.collection.ownedAvatarIds.includes(item.id)) return null;
    context.collection.equippedAvatarId = item.id;
    saveContext(context);
    return {context, item};
  }

  window.SalitaAvatarCollectionProfileRuntimeV1 = Object.freeze({
    version:1,
    profileStoreKey:PROFILE_STORE,
    activeProfileKey:ACTIVE_PROFILE,
    readContext,
    saveContext,
    equip
  });
})();
