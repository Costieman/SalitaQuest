(() => {
  "use strict";

  const API_NAME = "SalitaAvatarCaseProfileRuntimeV1";
  if (window[API_NAME]) return;

  function profiles() {
    return window.SalitaQuestLearnerProfileRuntimeV1 || null;
  }

  function model() {
    return window.SalitaAvatarModel || null;
  }

  function activeRecord() {
    return profiles()?.activeRecord() || {store:{schemaVersion:1, profiles:[]}, profile:null};
  }

  function ownedIds(profile = activeRecord().profile) {
    if (!profile || !model()) return [];
    const collection = model().normaliseCollectionState(profile.avatarCollection, profile.avatarId);
    return [...new Set(collection.ownedAvatarIds || [])];
  }

  function cleanIds(values, max = 4, profile = activeRecord().profile) {
    const owned = new Set(ownedIds(profile));
    const result = [];
    for (const raw of Array.isArray(values) ? values : []) {
      const item = model()?.get?.(raw);
      if (!item || !owned.has(item.id) || result.includes(item.id)) continue;
      result.push(item.id);
      if (result.length >= Math.max(1, Math.floor(Number(max) || 4))) break;
    }
    return result;
  }

  function getIds(max = 4) {
    const {profile} = activeRecord();
    if (!profile) return [];
    const legacy = profile.avatarCollection?.caseAvatarIds;
    return cleanIds(profile.avatarCaseIds || legacy || [], max, profile);
  }

  function getAvatars(max = 4) {
    return getIds(max).map(id => model()?.get?.(id)).filter(Boolean);
  }

  function persist(ids, options = {}) {
    const runtime = profiles();
    const {store, profile} = activeRecord();
    if (!runtime || !profile) return [];
    const max = Math.max(1, Math.floor(Number(options.max) || 4));
    const cleaned = cleanIds(ids, max, profile);
    profile.avatarCaseIds = cleaned;
    if (profile.avatarCollection && Object.hasOwn(profile.avatarCollection,"caseAvatarIds")) {
      delete profile.avatarCollection.caseAvatarIds;
    }
    runtime.writeStore(store);
    return cleaned;
  }

  const runtime = profiles();
  window[API_NAME] = Object.freeze({
    profileStoreKey:runtime?.profileStoreKey || "",
    activeProfileKey:runtime?.activeProfileKey || "",
    model,
    activeRecord,
    ownedIds,
    cleanIds,
    getIds,
    getAvatars,
    persist
  });
})();
