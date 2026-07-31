(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const ACTIVE_COURSE = "salitaQuestActiveCourse";
  const INSTALL_FLAG = "__salitaQuestLevelAvatarRewardsInstalled";
  const MILESTONE_LEVELS = Object.freeze([10,20,30,40,50,60,70,80,90,99]);

  function applyMilestoneRewards(level, sourceCollection, model, options = {}) {
    if (!model?.normaliseCollectionState || !model?.levelRewards) {
      throw new Error("Avatar model is required");
    }

    const safeLevel = Math.max(1, Math.min(99, Math.floor(Number(level) || 1)));
    const collection = model.normaliseCollectionState(sourceCollection);
    const claimed = new Set(collection.levelRewardsClaimed || []);
    const owned = new Set(collection.ownedAvatarIds || []);
    const pending = Array.isArray(collection.pendingUnlocks) ? [...collection.pendingUnlocks] : [];
    const awarded = [];
    const acknowledged = [];
    const now = options.now || new Date().toISOString();
    const course = options.course || "tagalog";

    for (const milestone of MILESTONE_LEVELS) {
      if (milestone > safeLevel || claimed.has(milestone)) continue;
      const avatarId = model.levelRewards[milestone];
      const item = model.get(avatarId);
      if (!item) continue;

      const validStandardReward = milestone < 99 && ["common", "uncommon"].includes(item.rarity);
      const validSummitReward = milestone === 99 && item.id === "golden_salita_crest" && item.rarity === "special";
      if (!validStandardReward && !validSummitReward) continue;

      claimed.add(milestone);
      acknowledged.push({level:milestone, avatarId:item.id});

      if (!owned.has(item.id)) {
        owned.add(item.id);
        if (item.shardRequirement > 0) collection.shards[item.id] = item.shardRequirement;
        if (!pending.some(entry => entry?.avatarId === item.id)) {
          pending.push({
            avatarId:item.id,
            source:"level_milestone",
            level:milestone,
            course,
            unlockedAt:now,
            animationSeen:false
          });
        }
        awarded.push({level:milestone, avatarId:item.id, avatar:item});
      }
    }

    collection.ownedAvatarIds = [...owned];
    collection.levelRewardsClaimed = [...claimed].sort((a, b) => a - b);
    collection.pendingUnlocks = pending;

    return Object.freeze({
      level:safeLevel,
      collection,
      awarded:Object.freeze(awarded),
      acknowledged:Object.freeze(acknowledged)
    });
  }

  root.SalitaLevelAvatarRewardLogic = Object.freeze({
    milestoneLevels:MILESTONE_LEVELS,
    applyMilestoneRewards
  });

  if (typeof document === "undefined" || typeof window === "undefined") return;
  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  let model = null;
  let lastCheckedLevel = 0;
  let syncTimer = 0;

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return value && Array.isArray(value.profiles) ? value : {schemaVersion:1, profiles:[]};
    } catch {
      return {schemaVersion:1, profiles:[]};
    }
  }

  function writeStore(store) {
    store.schemaVersion = 1;
    store.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_STORE, JSON.stringify(store));
  }

  function activeCourse() {
    return document.body.dataset.course || sessionStorage.getItem(ACTIVE_COURSE) || "tagalog";
  }

  function currentLevel() {
    try {
      if (typeof levelInfo !== "function") return null;
      const info = levelInfo();
      return Number.isFinite(Number(info?.level)) ? Math.floor(Number(info.level)) : null;
    } catch {
      return null;
    }
  }

  function announce(result) {
    if (!result.awarded.length) return;
    const newest = result.awarded[result.awarded.length - 1];
    const message = result.awarded.length === 1
      ? `Level ${newest.level} reward · ${newest.avatar.name} unlocked!`
      : `${result.awarded.length} level milestone avatars added to your collection`;

    try {
      if (typeof showRewardBurst === "function") showRewardBurst("🏆", message, true);
    } catch {}

    document.dispatchEvent(new CustomEvent("salita:avatar-milestones-awarded", {
      detail:{level:result.level, rewards:result.awarded}
    }));
  }

  function syncForLevel(level, reason = "level_update") {
    if (!model || !Number.isFinite(Number(level))) return null;
    const store = readStore();
    const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
    const profile = store.profiles.find(item => item.id === activeId);
    if (!profile) return null;

    const baseCollection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
    const result = applyMilestoneRewards(level, baseCollection, model, {
      course:activeCourse(),
      now:new Date().toISOString()
    });

    const before = JSON.stringify(profile.avatarCollection || null);
    const after = JSON.stringify(result.collection);
    profile.avatarCollection = result.collection;
    if (result.collection.equippedAvatarId) profile.avatarId = result.collection.equippedAvatarId;

    profile.avatarMilestoneRewards = profile.avatarMilestoneRewards && typeof profile.avatarMilestoneRewards === "object"
      ? profile.avatarMilestoneRewards
      : {version:1, claims:{}, highestLevelObserved:1};
    profile.avatarMilestoneRewards.version = 1;
    profile.avatarMilestoneRewards.claims = profile.avatarMilestoneRewards.claims && typeof profile.avatarMilestoneRewards.claims === "object"
      ? profile.avatarMilestoneRewards.claims
      : {};
    profile.avatarMilestoneRewards.highestLevelObserved = Math.max(
      Number(profile.avatarMilestoneRewards.highestLevelObserved || 1),
      result.level
    );
    profile.avatarMilestoneRewards.lastCheckedCourse = activeCourse();
    profile.avatarMilestoneRewards.lastCheckedAt = new Date().toISOString();
    for (const reward of result.acknowledged) {
      profile.avatarMilestoneRewards.claims[String(reward.level)] ||= {
        avatarId:reward.avatarId,
        course:activeCourse(),
        claimedAt:new Date().toISOString(),
        reason
      };
    }

    if (before !== after || result.acknowledged.length) writeStore(store);
    lastCheckedLevel = Math.max(lastCheckedLevel, result.level);

    if (result.acknowledged.length) {
      document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {
        detail:{source:"level_milestone", level:result.level, rewards:result.awarded}
      }));
      announce(result);
    }
    return result;
  }

  function scheduleSync(reason = "scheduled", delay = 80) {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => {
      const level = currentLevel();
      if (level != null) syncForLevel(level, reason);
    }, delay);
  }

  function wrapLevelUpdates() {
    if (typeof updateGlobalUI !== "function" || updateGlobalUI.__avatarMilestoneWrapped) return false;
    const baseUpdateGlobalUI = updateGlobalUI;
    const wrapped = function updateGlobalUIWithAvatarMilestones() {
      const result = baseUpdateGlobalUI.apply(this, arguments);
      scheduleSync("global_ui_update", 0);
      return result;
    };
    wrapped.__avatarMilestoneWrapped = true;
    updateGlobalUI = wrapped;
    return true;
  }

  function install() {
    model = window.SalitaAvatarModel || null;
    if (!model || typeof levelInfo !== "function" || typeof updateGlobalUI !== "function") {
      window.setTimeout(install, 100);
      return;
    }

    wrapLevelUpdates();
    scheduleSync("initial_migration", 120);
    window.setTimeout(() => scheduleSync("delayed_migration", 0), 1200);
    window.setTimeout(() => scheduleSync("late_level_runtime", 0), 3200);

    document.addEventListener("salita:level-updated", event => {
      const level = Number(event.detail?.level);
      if (Number.isFinite(level)) syncForLevel(level, "level_event");
    });
    document.addEventListener("salita:course-progress-restored", () => scheduleSync("course_restore", 120));

    window.SalitaLevelAvatarRewards = Object.freeze({
      sync:() => syncForLevel(currentLevel(), "manual_sync"),
      grantForLevel:level => syncForLevel(level, "manual_level"),
      getLastCheckedLevel:() => lastCheckedLevel
    });
  }

  install();
})();
