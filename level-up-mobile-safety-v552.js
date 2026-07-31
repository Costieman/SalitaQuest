(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestLevelUpMobileSafetyV552Installed";
  const RELEASE = "5.5.2"; // Compatibility marker retained for the 5.5.2 validator.
  const ACTIVE_RELEASE = "5.5.3";
  const STALE_PENDING_MS = 10 * 60 * 1000;
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";

  function retry() {
    window.setTimeout(install, 100);
  }

  function currentLevel() {
    try {
      if (typeof levelInfo !== "function") return null;
      const value = Number(levelInfo()?.level);
      return Number.isFinite(value) ? Math.max(1, Math.min(99, Math.floor(value))) : null;
    } catch {
      return null;
    }
  }

  function save(reason) {
    try {
      if (typeof saveState === "function") saveState();
      document.dispatchEvent(new CustomEvent("salita:level-up-safety-saved", {
        detail:{release:ACTIVE_RELEASE, reason}
      }));
    } catch {}
  }

  function progressionSystem() {
    try {
      return state?.levelProgressionV2 && typeof state.levelProgressionV2 === "object"
        ? state.levelProgressionV2
        : null;
    } catch {
      return null;
    }
  }

  function cleanLevels(values) {
    return [...new Set((Array.isArray(values) ? values : []).map(Number)
      .filter(value => Number.isInteger(value) && value >= 1 && value <= 99))]
      .sort((a,b) => a-b);
  }

  function sanitisePending(reason = "startup") {
    const system = progressionSystem();
    const level = currentLevel();
    if (!system || level == null) return false;

    let changed = false;
    const pending = system.pendingLevelUp;
    const lastKnown = Math.max(1, Number(system.lastKnownLevel) || level);
    const lastCelebrated = Math.max(1, Number(system.lastCelebratedLevel) || level);
    system.celebratedLevels = cleanLevels(system.celebratedLevels);
    system.milestoneAnimationsSeen = cleanLevels(system.milestoneAnimationsSeen);

    if (lastKnown > level) {
      system.lastKnownLevel = level;
      changed = true;
    }
    if (lastCelebrated > level) {
      system.lastCelebratedLevel = level;
      changed = true;
    }

    if (pending) {
      const from = Number(pending.from);
      const to = Number(pending.to);
      const queuedAt = Date.parse(pending.queuedAt || "");
      const stale = Number.isFinite(queuedAt) && Date.now() - queuedAt > STALE_PENDING_MS;
      const impossible = !Number.isFinite(to)
        || to < 1
        || to > level
        || to <= Math.max(1, Number(system.lastCelebratedLevel) || 1)
        || system.celebratedLevels.includes(to)
        || (Number.isFinite(from) && from >= to);

      if (impossible || stale) {
        if (Number.isFinite(to) && to <= level) {
          system.lastCelebratedLevel = Math.max(Number(system.lastCelebratedLevel) || 1, to);
          system.celebratedLevels = cleanLevels([...system.celebratedLevels, to]);
        }
        system.pendingLevelUp = null;
        changed = true;
      }
    }

    if (changed) save(`sanitise_${reason}`);
    return changed;
  }

  function acknowledgeVisibleCelebration(reason = "celebration_started", explicitLevel = null) {
    const system = progressionSystem();
    if (!system) return false;
    const pending = system.pendingLevelUp;
    const level = currentLevel();
    const target = Math.max(1, Math.min(99,
      Number(explicitLevel) || Number(pending?.to) || level || 1
    ));
    const alreadySeen = cleanLevels(system.celebratedLevels).includes(target);

    system.pendingLevelUp = null;
    system.lastKnownLevel = Math.max(Number(system.lastKnownLevel) || 1, level || target);
    system.lastCelebratedLevel = Math.max(Number(system.lastCelebratedLevel) || 1, target);
    system.celebratedLevels = cleanLevels([...(system.celebratedLevels || []), target]);
    const reward = window.SalitaAvatarModel?.get?.(window.SalitaAvatarModel?.levelRewards?.[target]);
    if (reward) {
      system.milestoneAnimationsSeen = cleanLevels([...(system.milestoneAnimationsSeen || []), target]);
    }
    system.lastCelebrationAcknowledgedAt = new Date().toISOString();
    system.lastCelebrationAcknowledgedBy = ACTIVE_RELEASE;
    save(reason);
    return !alreadySeen;
  }

  function readProfiles() {
    try {
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return store && Array.isArray(store.profiles) ? store : {schemaVersion:1, profiles:[]};
    } catch {
      return {schemaVersion:1, profiles:[]};
    }
  }

  function writeProfiles(store) {
    store.schemaVersion = 1;
    store.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_STORE, JSON.stringify(store));
  }

  function entryKey(entry = {}) {
    return [entry.avatarId || "", entry.source || "unknown", entry.level || "", entry.weekKey || ""].join("|");
  }

  function acknowledgeAvatarLayer(node, reason = "avatar_layer_inserted") {
    const model = window.SalitaAvatarModel;
    if (!model?.normaliseCollectionState) return false;
    const store = readProfiles();
    const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
    const profile = store.profiles.find(item => item.id === activeId);
    if (!profile) return false;

    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
    const explicitId = node?.dataset?.avatarId || "";
    const pending = collection.pendingUnlocks.find(entry => !explicitId || entry?.avatarId === explicitId)
      || collection.pendingUnlocks[0];
    if (!pending) return false;

    const key = entryKey(pending);
    const priorKeys = new Set(profile.avatarUnlockRunOnce?.keys || []);
    const alreadySeen = priorKeys.has(key) || (profile.avatarUnlockHistory || []).some(entry => entryKey(entry) === key);
    collection.pendingUnlocks = collection.pendingUnlocks.filter(entry => entryKey(entry) !== key);
    profile.avatarCollection = collection;
    profile.avatarUnlockHistory = Array.isArray(profile.avatarUnlockHistory) ? profile.avatarUnlockHistory : [];
    if (!profile.avatarUnlockHistory.some(entry => entryKey(entry) === key)) {
      profile.avatarUnlockHistory.push({
        avatarId:pending.avatarId,
        source:pending.source || "unknown",
        level:pending.level || null,
        weekKey:pending.weekKey || null,
        animationSeenAt:new Date().toISOString(),
        acknowledgedBeforeAnimation:true,
        acknowledgedBy:ACTIVE_RELEASE
      });
      profile.avatarUnlockHistory = profile.avatarUnlockHistory.slice(-160);
    }
    profile.avatarUnlockRunOnce = profile.avatarUnlockRunOnce && typeof profile.avatarUnlockRunOnce === "object"
      ? profile.avatarUnlockRunOnce : {version:1, keys:[]};
    profile.avatarUnlockRunOnce.keys = [...new Set([...(profile.avatarUnlockRunOnce.keys || []), key])].slice(-160);
    profile.avatarUnlockRunOnce.lastAcknowledgedAt = new Date().toISOString();
    profile.avatarUnlockRunOnce.lastAcknowledgedBy = ACTIVE_RELEASE;
    profile.avatarUnlockRunOnce.lastReason = reason;
    writeProfiles(store);

    if (alreadySeen && node) {
      node.style.visibility = "hidden";
      window.setTimeout(() => node.querySelector?.("[data-unlock-skip]")?.click(), 0);
    }
    return !alreadySeen;
  }

  function decorateLevelReward(node, level) {
    const model = window.SalitaAvatarModel;
    const reward = model?.get?.(model?.levelRewards?.[level]);
    if (!reward || !node) return;
    node.dataset.rewardAvatarId = reward.id;
    const image = node.querySelector(".level-up-avatar img");
    if (image) {
      image.src = reward.image;
      image.alt = reward.name;
      image.addEventListener("error", () => {
        if (image.dataset.fallbackApplied === "true") return;
        image.dataset.fallbackApplied = "true";
        image.src = model.get("tarsier")?.image || "avatars/tarsier.png";
      }, {once:true});
    }
    const banner = node.querySelector(".level-up-banner");
    if (banner && !banner.querySelector(".level-up-reward-safety-label")) {
      const label = document.createElement("div");
      label.className = "level-up-reward-safety-label";
      label.textContent = `Avatar reward: ${reward.name}`;
      banner.appendChild(label);
    }
  }

  function containsCelebration(node) {
    if (!(node instanceof Element)) return false;
    return node.matches?.(".level-up-celebration") || Boolean(node.querySelector?.(".level-up-celebration"));
  }

  function containsAvatarUnlock(node) {
    if (!(node instanceof Element)) return false;
    return node.matches?.(".sq-avatar-unlock-layer") || Boolean(node.querySelector?.(".sq-avatar-unlock-layer"));
  }

  function handleLevelNode(node, reason) {
    const layer = node.matches?.(".level-up-celebration") ? node : node.querySelector?.(".level-up-celebration");
    if (!layer) return;
    const level = Number(layer.dataset.level || layer.querySelector(".level-up-banner strong")?.textContent?.match(/\d+/)?.[0]);
    const firstRun = acknowledgeVisibleCelebration(reason, level);
    decorateLevelReward(layer, level);
    if (!firstRun) layer.style.visibility = "hidden";
  }

  function handleAvatarNode(node, reason) {
    const layer = node.matches?.(".sq-avatar-unlock-layer") ? node : node.querySelector?.(".sq-avatar-unlock-layer");
    if (layer) acknowledgeAvatarLayer(layer, reason);
  }

  function installObserver() {
    const existing = document.querySelector(".level-up-celebration");
    if (existing) handleLevelNode(existing, "existing_celebration");
    const existingAvatar = document.querySelector(".sq-avatar-unlock-layer");
    if (existingAvatar) handleAvatarNode(existingAvatar, "existing_avatar_layer");

    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (containsCelebration(node)) handleLevelNode(node, "celebration_dom_inserted");
          if (containsAvatarUnlock(node)) handleAvatarNode(node, "avatar_dom_inserted");
        }
      }
    });
    observer.observe(document.documentElement, {childList:true, subtree:true});

    window.addEventListener("pagehide", () => {
      if (document.querySelector(".level-up-celebration")) {
        acknowledgeVisibleCelebration("pagehide_during_celebration");
      }
      const avatar = document.querySelector(".sq-avatar-unlock-layer");
      if (avatar) acknowledgeAvatarLayer(avatar, "pagehide_during_avatar");
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && document.querySelector(".level-up-celebration")) {
        acknowledgeVisibleCelebration("hidden_during_celebration");
      }
      const avatar = document.querySelector(".sq-avatar-unlock-layer");
      if (document.hidden && avatar) acknowledgeAvatarLayer(avatar, "hidden_during_avatar");
    });
    document.addEventListener("salita:level-updated", () => {
      window.setTimeout(() => sanitisePending("level_event"), 120);
    });
  }

  function install() {
    try {
      if (
        window[INSTALL_FLAG] ||
        typeof state === "undefined" ||
        typeof saveState !== "function" ||
        typeof levelInfo !== "function"
      ) {
        retry();
        return;
      }
    } catch {
      retry();
      return;
    }

    window[INSTALL_FLAG] = true;
    sanitisePending("install");
    installObserver();
    document.documentElement.dataset.levelUpSafety = ACTIVE_RELEASE;
    window.SalitaLevelUpMobileSafety = Object.freeze({
      version:ACTIVE_RELEASE,
      sanitise:() => sanitisePending("manual"),
      acknowledge:() => acknowledgeVisibleCelebration("manual"),
      acknowledgeAvatar:node => acknowledgeAvatarLayer(node, "manual")
    });
    window.SalitaLevelUpRunOnceSafety = window.SalitaLevelUpMobileSafety;
  }

  install();
})();
