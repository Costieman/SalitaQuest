(() => {
  "use strict";

  const API = "SalitaBadgeCatalogueRuntimeV1";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const WRAPPABLE = new Set(["recordDailyAnswer","recordDailySession","renderBadges","switchView"]);
  if (window[API]) return;

  const globalValue = name => {
    try { return eval(`typeof ${name} !== "undefined" ? ${name} : undefined`); }
    catch { return undefined; }
  };
  const stateValue = () => globalValue("state") || window.state || null;
  const catalogueValue = () => globalValue("BADGES") || window.BADGES || null;
  const functionValue = name => globalValue(name) || window[name];
  const positive = value => Math.max(0, Number(value || 0));

  function ready() {
    return Array.isArray(catalogueValue()) && Boolean(stateValue());
  }

  function catalogueFeatureReady() {
    return ready() && [...WRAPPABLE, "saveState"].every(name => typeof functionValue(name) === "function");
  }

  function activeProfile() {
    try {
      const id = sessionStorage.getItem(ACTIVE_PROFILE);
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return store?.profiles?.find(profile => profile.id === id) || null;
    } catch { return null; }
  }

  function avatarModel() {
    return window.SalitaAvatarModel || null;
  }

  function level() {
    const readLevel = functionValue("levelInfo");
    return typeof readLevel === "function"
      ? positive(readLevel()?.level || 1)
      : positive(stateValue()?.level || stateValue()?.learnerLevel) || 1;
  }

  function learningPoints() {
    const readPoints = functionValue("totalLearningPoints");
    return typeof readPoints === "function"
      ? positive(readPoints())
      : positive(stateValue()?.xp || stateValue()?.totalXp || stateValue()?.learningPoints);
  }

  function sessionValue() {
    return globalValue("session") || window.session || null;
  }

  function save() {
    const persist = functionValue("saveState");
    if (typeof persist !== "function") return false;
    persist();
    return true;
  }

  function badgeArtValue(id) {
    const render = functionValue("badgeArt");
    if (typeof render !== "function") return null;
    try { return render(id); } catch { return null; }
  }

  function bossReadyValue() {
    const read = functionValue("bossReady");
    if (typeof read !== "function") return false;
    try { return Boolean(read()); } catch { return false; }
  }

  function readFunction(name) {
    return typeof name === "string" ? functionValue(name) : undefined;
  }

  function replaceFunction(name, next) {
    if (!WRAPPABLE.has(name) || typeof next !== "function") return false;
    try { window[name] = next; } catch { return false; }
    return functionValue(name) === next;
  }

  function wrapFunction(name, factory) {
    const base = readFunction(name);
    if (!WRAPPABLE.has(name) || typeof base !== "function" || typeof factory !== "function") return null;
    const next = factory(base);
    return replaceFunction(name, next) ? next : null;
  }

  function invoke(name, ...args) {
    const fn = readFunction(name);
    return typeof fn === "function" ? fn(...args) : undefined;
  }

  function refresh(options = {bootstrap:true}) {
    try { functionValue("syncEarned")?.(options); } catch {}
    try { functionValue("renderCatalogue")?.(); } catch {}
  }

  window[API] = Object.freeze({
    ready,
    catalogueFeatureReady,
    state:stateValue,
    catalogue:catalogueValue,
    activeProfile,
    avatarModel,
    level,
    learningPoints,
    session:sessionValue,
    save,
    badgeArt:badgeArtValue,
    bossReady:bossReadyValue,
    readFunction,
    replaceFunction,
    wrapFunction,
    invoke,
    refresh
  });
})();
