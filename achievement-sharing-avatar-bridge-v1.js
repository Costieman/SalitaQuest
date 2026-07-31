(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAchievementAvatarBridgeInstalled";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const LEGACY_AVATAR_PATTERN = /(?:^|\/)avatars\/(?:tarsier|eagle|tamaraw|peacock|orchid|jade|rafflesia|anahaw)\.png(?:[?#].*)?$/i;

  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  function activeProfile() {
    try {
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      const id = sessionStorage.getItem(ACTIVE_PROFILE);
      return store?.profiles?.find(profile => profile.id === id) || null;
    } catch {
      return null;
    }
  }

  function equippedAvatar() {
    const profile = activeProfile();
    const id = profile?.avatarCollection?.equippedAvatarId || profile?.avatarId;
    return window.SalitaAvatarModel?.get(id) || window.SalitaAvatarModel?.get("anahaw") || null;
  }

  async function withEquippedAvatarImages(action) {
    const avatar = equippedAvatar();
    if (!avatar?.image || typeof action !== "function") return action?.();

    const NativeImage = window.Image;
    const nativeDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
    if (!NativeImage || !nativeDescriptor?.get || !nativeDescriptor?.set) return action();

    function RedirectedImage(width, height) {
      const image = new NativeImage(width, height);
      Object.defineProperty(image, "src", {
        configurable:true,
        enumerable:true,
        get() { return nativeDescriptor.get.call(image); },
        set(value) {
          const source = String(value || "");
          nativeDescriptor.set.call(image, LEGACY_AVATAR_PATTERN.test(source) ? avatar.image : value);
        }
      });
      return image;
    }
    RedirectedImage.prototype = NativeImage.prototype;

    window.Image = RedirectedImage;
    try {
      return await action();
    } finally {
      window.Image = NativeImage;
    }
  }

  function wrapApi(api) {
    if (!api || api.__equippedAvatarBridge) return false;
    for (const method of ["openBadge", "openChest", "openLevel"]) {
      const original = api[method];
      if (typeof original !== "function") continue;
      api[method] = function avatarAwareShareMethod() {
        const args = arguments;
        return withEquippedAvatarImages(() => original.apply(api, args));
      };
    }
    Object.defineProperty(api, "__equippedAvatarBridge", {value:true});
    return true;
  }

  function badgeId(button) {
    return button?.dataset.shareBadge || button?.closest("[data-badge-id]")?.dataset.badgeId || "";
  }

  function interceptSharingClicks(event) {
    const api = window.SalitaQuestAchievementSharing;
    if (!api?.__equippedAvatarBridge) return;

    const badgeButton = event.target.closest?.("[data-share-badge]");
    if (badgeButton) {
      const id = badgeId(badgeButton);
      if (!id) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      api.openBadge(id, badgeButton);
      return;
    }

    const chestButton = event.target.closest?.("[data-share-badge-chest]");
    if (chestButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      api.openChest(chestButton);
      return;
    }

    const levelButton = event.target.closest?.("[data-share-level-v4]");
    if (levelButton) {
      const prompt = levelButton.closest("#levelSharePromptV4");
      const levelData = prompt?.__levelData;
      if (!levelData) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.clearTimeout(prompt.__dismissTimer);
      prompt.remove();
      api.openLevel(levelData);
    }
  }

  function install() {
    const api = window.SalitaQuestAchievementSharing;
    if (!api || !window.SalitaAvatarModel) {
      window.setTimeout(install, 100);
      return;
    }
    wrapApi(api);
    document.addEventListener("click", interceptSharingClicks, true);
    window.SalitaAchievementAvatarBridge = Object.freeze({
      equippedAvatar,
      withEquippedAvatarImages
    });
  }

  install();
})();