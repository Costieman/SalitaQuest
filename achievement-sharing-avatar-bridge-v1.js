(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAchievementSharingAvatarCompatibilityV558Installed";
  const RELEASE = "5.5.8-sharing-foundation";

  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  function controller() {
    return window.SalitaQuestAchievementSharing || null;
  }

  function equippedAvatar() {
    try {
      const model = window.SalitaAvatarModel;
      const profileStore = JSON.parse(localStorage.getItem("salitaQuestLocalProfilesV1") || "null");
      const profileId = sessionStorage.getItem("salitaQuestActiveProfileId");
      const profile = profileStore?.profiles?.find(item => item.id === profileId) || null;
      const id = profile?.avatarCollection?.equippedAvatarId || profile?.avatarId || "anahaw";
      return model?.get?.(id) || model?.get?.("anahaw") || null;
    } catch {
      return null;
    }
  }

  function canonicalAvatarPath(id = null) {
    const item = id ? window.SalitaAvatarModel?.get?.(id) : equippedAvatar();
    try {
      return window.SalitaAvatarArtwork?.getAvatarImagePath?.(item?.id || id || "anahaw") ||
        window.getAvatarImagePath?.(item?.id || id || "anahaw") ||
        item?.image ||
        "avatars/canonical/anahaw.png";
    } catch {
      return item?.image || "avatars/canonical/anahaw.png";
    }
  }

  const compatibilityApi = Object.freeze({
    release:RELEASE,
    equippedAvatar,
    canonicalAvatarPath,
    openBadge(...args) { return controller()?.openBadge?.(...args); },
    openChest(...args) { return controller()?.openChest?.(...args); },
    openAvatar(...args) { return controller()?.openAvatar?.(...args); },
    openLevel(...args) { return controller()?.openLevel?.(...args); }
  });

  // Compatibility only. This bridge deliberately does not replace the shared
  // controller and does not install click handlers. The achievement-sharing
  // runtime remains the sole owner of badge, avatar and level sharing.
  window.SalitaAchievementAvatarBridge = compatibilityApi;
  document.documentElement.dataset.avatarSharingBridge = RELEASE;
  document.dispatchEvent(new CustomEvent("salita:avatar-sharing-bridge-ready", {
    detail:{release:RELEASE, compatibilityOnly:true}
  }));
})();
