(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAvatarCollectionProfileRuntimeV1Installed";
  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  function profiles() {
    return window.SalitaQuestLearnerProfileRuntimeV1 || null;
  }

  function buildContext({persistNormalisation = false} = {}) {
    const runtime = profiles();
    const model = window.SalitaAvatarModel;
    if (!runtime || !model) return null;
    const {store, profile} = runtime.activeRecord();
    if (!profile) return null;
    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
    if (persistNormalisation) {
      profile.avatarCollection = collection;
      if (collection.equippedAvatarId) profile.avatarId = collection.equippedAvatarId;
      runtime.writeStore(store, {schemaVersion:1});
    }
    return {store, profile, collection, model};
  }

  function peekContext() {
    return buildContext();
  }

  function readContext() {
    return buildContext({persistNormalisation:true});
  }

  function saveContext(context) {
    const runtime = profiles();
    if (!runtime || !context?.store || !context?.profile || !context?.collection) return false;
    context.profile.avatarCollection = context.collection;
    if (context.collection.equippedAvatarId) context.profile.avatarId = context.collection.equippedAvatarId;
    return runtime.writeStore(context.store, {schemaVersion:1});
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

  const runtime = profiles();
  window.SalitaAvatarCollectionProfileRuntimeV1 = Object.freeze({
    version:1,
    profileStoreKey:runtime?.profileStoreKey || "",
    activeProfileKey:runtime?.activeProfileKey || "",
    peekContext,
    readContext,
    saveContext,
    equip
  });
})();
