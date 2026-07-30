(() => {
  "use strict";
  if (window.__salitaAvatarImageShimInstalled) return;
  window.__salitaAvatarImageShimInstalled = true;

  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const legacyPattern = /(?:^|\/)avatars\/(tarsier|eagle|tamaraw|peacock|orchid|jade|rafflesia|anahaw)\.png(?:[?#].*)?$/i;
  const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (!descriptor?.set || !descriptor?.get) return;

  function equippedId() {
    try {
      const id = sessionStorage.getItem(ACTIVE_PROFILE);
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      const profile = store?.profiles?.find(item => item.id === id);
      return window.SalitaAvatarAssets?.normalise(profile?.avatarCollection?.equippedAvatarId || profile?.avatarId || "anahaw");
    } catch {
      return "anahaw";
    }
  }

  Object.defineProperty(HTMLImageElement.prototype, "src", {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) {
      let next = value;
      try {
        const match = legacyPattern.exec(String(value || ""));
        const equipped = equippedId();
        const activeProfile = sessionStorage.getItem(ACTIVE_PROFILE);
        if (match && activeProfile && equipped && !["tarsier","eagle","tamaraw","peacock","orchid","jade","rafflesia","anahaw"].includes(equipped)) {
          const profileStore = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
          const profile = profileStore?.profiles?.find(item => item.id === activeProfile);
          if ((profile?.avatarId || "tarsier") === match[1]) next = window.SalitaAvatarAssets.src(equipped);
        }
      } catch {}
      descriptor.set.call(this, next);
    }
  });
})();
