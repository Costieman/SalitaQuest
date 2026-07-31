(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const ACTIVE_COURSE = "salitaQuestActiveCourse";
  const INSTALL_FLAG = "__salitaQuestLevelAvatarRewardsV2Installed";
  const MILESTONE_LEVELS = Object.freeze([10,20,30,40,50,60,70,80,90,99]);

  function applyMilestoneRewards(level, sourceCollection, model, options = {}) {
    if (!model?.normaliseCollectionState || !model?.levelRewards) throw new Error("Avatar model is required");
    const safeLevel = Math.max(1, Math.min(99, Math.floor(Number(level) || 1)));
    const collection = model.normaliseCollectionState(sourceCollection);
    const claimed = new Set(collection.levelRewardsClaimed || []);
    const owned = new Set(collection.ownedAvatarIds || []);
    const pending = Array.isArray(collection.pendingUnlocks) ? [...collection.pendingUnlocks] : [];
    const awarded = [];
    const acknowledged = [];
    const now = options.now || new Date().toISOString();
    const course = options.course || "tagalog";

    MILESTONE_LEVELS.forEach(milestone => {
      if (milestone > safeLevel || claimed.has(milestone)) return;
      const item = model.get(model.levelRewards[milestone]);
      if (!item) return;
      const standard = milestone < 99 && ["common", "uncommon"].includes(item.weeklyRarity || item.rarity);
      const summit = milestone === 99 && item.id === "golden_salita_crest" && item.rarity === "special";
      if (!standard && !summit) return;

      claimed.add(milestone);
      acknowledged.push({level:milestone, avatarId:item.id});
      if (owned.has(item.id)) return;

      owned.add(item.id);
      if (item.shardRequirement > 0) collection.shards[item.id] = item.shardRequirement;
      if (!pending.some(entry => entry?.avatarId === item.id && entry?.source === "level_milestone" && Number(entry?.level) === milestone)) {
        pending.push({
          avatarId:item.id, source:"level_milestone", level:milestone, course,
          unlockedAt:now, animationSeen:false
        });
      }
      awarded.push({level:milestone, avatarId:item.id, avatar:item});
    });

    collection.ownedAvatarIds = [...owned];
    collection.levelRewardsClaimed = [...claimed].sort((a,b) => a-b);
    collection.pendingUnlocks = pending;
    return Object.freeze({level:safeLevel, collection, awarded:Object.freeze(awarded), acknowledged:Object.freeze(acknowledged)});
  }

  function weeklyEvidence(profile, avatarId, requirement = 100) {
    let after = 0;
    let unlocked = false;
    Object.values(profile?.avatarWeeklyRewards?.claims || {}).forEach(claim => {
      if (claim?.avatarId !== avatarId) return;
      after = Math.max(after, Number(claim.after) || 0);
      unlocked ||= claim.unlocked === true || after >= requirement;
    });
    return {after:Math.min(requirement, after), unlocked};
  }

  function repairFutureMilestones(profile, level, model) {
    if (!profile || !model) return {changed:false, removed:[]};
    const safeLevel = Math.max(1, Math.min(99, Math.floor(Number(level) || 1)));
    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
    const falseLevels = (collection.levelRewardsClaimed || []).filter(value => value > safeLevel && MILESTONE_LEVELS.includes(value));
    const claimMap = profile.avatarMilestoneRewards?.claims && typeof profile.avatarMilestoneRewards.claims === "object"
      ? profile.avatarMilestoneRewards.claims : {};
    Object.keys(claimMap).map(Number).filter(value => value > safeLevel && MILESTONE_LEVELS.includes(value))
      .forEach(value => { if (!falseLevels.includes(value)) falseLevels.push(value); });
    if (!falseLevels.length) return {changed:false, removed:[]};

    const removed = [];
    const falseSet = new Set(falseLevels);
    collection.levelRewardsClaimed = collection.levelRewardsClaimed.filter(value => !falseSet.has(value));
    collection.pendingUnlocks = (collection.pendingUnlocks || []).filter(entry =>
      !(entry?.source === "level_milestone" && falseSet.has(Number(entry?.level)))
    );
    profile.avatarUnlockHistory = (Array.isArray(profile.avatarUnlockHistory) ? profile.avatarUnlockHistory : []).filter(entry =>
      !(entry?.source === "level_milestone" && falseSet.has(Number(entry?.level)))
    );

    falseLevels.forEach(milestone => {
      delete claimMap[String(milestone)];
      const avatarId = model.levelRewards[milestone];
      const item = model.get(avatarId);
      if (!item) return;
      removed.push({level:milestone, avatarId:item.id});
      const evidence = weeklyEvidence(profile, item.id, item.shardRequirement || 100);
      const equipped = collection.equippedAvatarId === item.id;
      if (!equipped && !evidence.unlocked) {
        collection.ownedAvatarIds = collection.ownedAvatarIds.filter(id => id !== item.id);
        if (evidence.after > 0) collection.shards[item.id] = evidence.after;
        else delete collection.shards[item.id];
      } else if (evidence.unlocked && item.shardRequirement) {
        if (!collection.ownedAvatarIds.includes(item.id)) collection.ownedAvatarIds.push(item.id);
        collection.shards[item.id] = item.shardRequirement;
      }
    });

    profile.avatarCollection = model.normaliseCollectionState(collection, profile.avatarId);
    profile.avatarMilestoneRewards = profile.avatarMilestoneRewards && typeof profile.avatarMilestoneRewards === "object"
      ? profile.avatarMilestoneRewards : {version:2, claims:{}};
    profile.avatarMilestoneRewards.version = 2;
    profile.avatarMilestoneRewards.claims = claimMap;
    profile.avatarMilestoneRewards.highestLevelObserved = safeLevel;
    profile.avatarMilestoneRewards.repairedAt = new Date().toISOString();
    profile.avatarMilestoneRewards.repairedFutureLevels = falseLevels.sort((a,b) => a-b);
    return {changed:true, removed};
  }

  root.SalitaLevelAvatarRewardLogic = Object.freeze({
    version:2, milestoneLevels:MILESTONE_LEVELS, applyMilestoneRewards, repairFutureMilestones
  });

  if (typeof document === "undefined" || typeof window === "undefined") return;
  if (window[INSTALL_FLAG]) return;

  let model = null;
  let syncTimer = 0;
  let syncing = false;
  let lastCheckedLevel = 0;

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return value && Array.isArray(value.profiles) ? value : {schemaVersion:1, profiles:[]};
    } catch { return {schemaVersion:1, profiles:[]}; }
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
    if (!window.__salitaQuestLevelProgressionV2Installed || typeof levelInfo !== "function") return null;
    try {
      const value = Number(levelInfo()?.level);
      return Number.isFinite(value) ? Math.max(1, Math.min(99, Math.floor(value))) : null;
    } catch { return null; }
  }
  function announce(result) {
    if (!result.awarded.length) return;
    const newest = result.awarded[result.awarded.length - 1];
    const message = result.awarded.length === 1
      ? `Level ${newest.level} reward · ${newest.avatar.name} unlocked!`
      : `${result.awarded.length} earned level avatars added to your collection`;
    try { if (typeof showRewardBurst === "function") showRewardBurst("🏆", message, true); } catch {}
    document.dispatchEvent(new CustomEvent("salita:avatar-milestones-awarded", {
      detail:{level:result.level, rewards:result.awarded}
    }));
  }

  function syncForLevel(level, reason = "level_update") {
    if (syncing || !model || !Number.isFinite(Number(level))) return null;
    syncing = true;
    try {
      const safeLevel = Math.max(1, Math.min(99, Math.floor(Number(level))));
      const store = readStore();
      const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
      const profile = store.profiles.find(item => item.id === activeId);
      if (!profile) return null;

      const before = JSON.stringify(profile);
      const repair = repairFutureMilestones(profile, safeLevel, model);
      const baseCollection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
      const result = applyMilestoneRewards(safeLevel, baseCollection, model, {
        course:activeCourse(), now:new Date().toISOString()
      });
      profile.avatarCollection = result.collection;
      if (result.collection.equippedAvatarId) profile.avatarId = result.collection.equippedAvatarId;
      profile.avatarMilestoneRewards = profile.avatarMilestoneRewards && typeof profile.avatarMilestoneRewards === "object"
        ? profile.avatarMilestoneRewards : {version:2, claims:{}, highestLevelObserved:1};
      profile.avatarMilestoneRewards.version = 2;
      profile.avatarMilestoneRewards.claims = profile.avatarMilestoneRewards.claims && typeof profile.avatarMilestoneRewards.claims === "object"
        ? profile.avatarMilestoneRewards.claims : {};
      profile.avatarMilestoneRewards.highestLevelObserved = Math.max(
        Number(profile.avatarMilestoneRewards.highestLevelObserved || 1), safeLevel
      );
      profile.avatarMilestoneRewards.lastCheckedCourse = activeCourse();
      profile.avatarMilestoneRewards.lastCheckedAt = new Date().toISOString();
      result.acknowledged.forEach(reward => {
        profile.avatarMilestoneRewards.claims[String(reward.level)] ||= {
          avatarId:reward.avatarId, course:activeCourse(), claimedAt:new Date().toISOString(), reason
        };
      });

      if (before !== JSON.stringify(profile)) writeStore(store);
      lastCheckedLevel = safeLevel;
      if (repair.changed) {
        document.dispatchEvent(new CustomEvent("salita:avatar-milestones-repaired", {
          detail:{level:safeLevel, removed:repair.removed}
        }));
      }
      if (result.awarded.length) {
        document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {
          detail:{source:"level_milestone", level:safeLevel, rewards:result.awarded}
        }));
        announce(result);
      }
      return result;
    } finally {
      syncing = false;
    }
  }

  function scheduleSync(reason = "scheduled", delay = 100) {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => {
      const level = currentLevel();
      if (level != null) syncForLevel(level, reason);
    }, delay);
  }
  function wrapLevelUpdates() {
    if (typeof updateGlobalUI !== "function" || updateGlobalUI.__avatarMilestoneV2Wrapped) return;
    const base = updateGlobalUI;
    const wrapped = function updateGlobalUIWithSafeAvatarMilestones() {
      const result = base.apply(this, arguments);
      scheduleSync("global_ui_update", 20);
      return result;
    };
    wrapped.__avatarMilestoneV2Wrapped = true;
    updateGlobalUI = wrapped;
  }
  function install() {
    model = window.SalitaAvatarModel || null;
    if (!model || !window.__salitaQuestLevelProgressionV2Installed ||
        typeof levelInfo !== "function" || typeof updateGlobalUI !== "function") {
      window.setTimeout(install, 100);
      return;
    }
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;
    wrapLevelUpdates();
    scheduleSync("initial_safe_sync", 180);
    window.setTimeout(() => scheduleSync("delayed_safe_sync", 0), 1400);
    document.addEventListener("salita:level-updated", event => {
      const level = Number(event.detail?.level);
      if (Number.isFinite(level)) syncForLevel(level, "level_event");
    });
    document.addEventListener("salita:course-progress-restored", () => scheduleSync("course_restore", 160));
    document.addEventListener("salita:placement-complete", () => scheduleSync("placement_complete", 250));
    window.SalitaLevelAvatarRewards = Object.freeze({
      version:2,
      sync:() => syncForLevel(currentLevel(), "manual_sync"),
      grantForLevel:value => syncForLevel(value, "manual_level"),
      getLastCheckedLevel:() => lastCheckedLevel
    });
  }
  install();
})();