(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestLongTermBadgesV1Installed";
  const RELEASE = "5.6.0-long-term-badges";
  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  const number = value => Math.max(0, Number(value || 0));
  const collectionSize = value => Array.isArray(value) ? value.length : value instanceof Set ? value.size : value && typeof value === "object" ? Object.keys(value).length : 0;
  const stateValue = (...paths) => {
    for (const path of paths) {
      let value = window.state;
      for (const key of path.split(".")) value = value?.[key];
      if (value !== undefined && value !== null) return value;
    }
    return 0;
  };
  const itemCountAt = threshold => Object.values(window.state?.itemState || {}).filter(item => number(item?.mastery) >= threshold).length;
  const durableCountAt = threshold => Object.values(window.state?.itemState || {}).filter(item => number(item?.longTermMastery || item?.durableMastery) >= threshold).length;
  const level = () => typeof window.levelInfo === "function" ? number(window.levelInfo()?.level || 1) : number(stateValue("level", "learnerLevel")) || 1;
  const points = () => typeof window.totalLearningPoints === "function" ? number(window.totalLearningPoints()) : number(stateValue("xp", "totalXp", "learningPoints"));
  const activeProfile = () => {
    try {
      const id = sessionStorage.getItem("salitaQuestActiveProfileId");
      const store = JSON.parse(localStorage.getItem("salitaQuestLocalProfilesV1") || "null");
      return store?.profiles?.find(profile => profile.id === id) || null;
    } catch { return null; }
  };
  const ownedAvatars = () => {
    const profile = activeProfile();
    const collection = profile?.avatarCollection || {};
    return Math.max(
      collectionSize(collection.ownedIds),
      collectionSize(collection.unlockedIds),
      collectionSize(collection.avatars),
      collectionSize(profile?.ownedAvatarIds),
      collectionSize(window.state?.avatarCollection?.ownedIds)
    );
  };
  const totalAvatars = () => number(window.SalitaAvatarModel?.catalogue?.length || window.SalitaAvatarModel?.all?.().length || 0);
  const metric = key => {
    const map = {
      answers: () => number(stateValue("totalAnswers")),
      correct: () => number(stateValue("correctAnswers")),
      streak: () => number(stateValue("bestStreak", "streak")),
      xp: () => points(),
      coins: () => number(stateValue("totalCoinsEarned", "coinsEarned", "coins")),
      level,
      mastery: () => itemCountAt(5),
      durable: () => durableCountAt(1),
      quick: () => number(stateValue("badgeMetrics.quickReviewItems")),
      daily: () => number(stateValue("badgeMetrics.dailySessions")),
      lessons: () => Math.max(number(stateValue("badgeMetrics.lessonsCompleted", "lessonsCompleted")), collectionSize(stateValue("completedLessons"))),
      avatars: ownedAvatars,
      scenarios: () => number(stateValue("bossWins", "badgeMetrics.scenariosCompleted")),
      perfect: () => number(stateValue("badgeMetrics.perfectLessons", "perfectLessons")),
      handsfree: () => number(stateValue("badgeMetrics.handsFreeItems", "badgeMetrics.handsFreeReviews")),
      days: () => Math.max(number(stateValue("badgeMetrics.daysStudied")), collectionSize(stateValue("studyDates", "activityDates"))),
      keys: () => Math.max(number(stateValue("badgeMetrics.keysEarned")), collectionSize(stateValue("weeklyAvatarChest.keyDates"))),
      chests: () => Math.max(number(stateValue("badgeMetrics.chestsOpened")), collectionSize(stateValue("weeklyAvatarChest.keyRunClaims"))),
      correctStreak: () => number(stateValue("bestCorrectStreak", "badgeMetrics.bestCorrectStreak")),
      mastery1: () => itemCountAt(1),
      mastery2: () => itemCountAt(2),
      mastery3: () => itemCountAt(3),
      mastery4: () => itemCountAt(4),
      badges: () => Object.keys(window.state?.badgeProgress?.earnedAt || {}).length
    };
    return map[key]?.() || 0;
  };

  const LABELS = {
    answers:["Practice","Questions Answered","Answer {n} learning questions","📝"],
    correct:["Accuracy","Correct Answers","Give {n} correct answers","🎯"],
    streak:["Consistency","Study Streak","Build a {n}-day study streak","🔥"],
    xp:["Progress","XP Earned","Earn {n} XP","⭐"],
    coins:["Rewards","Coins Earned","Earn {n} coins","🪙"],
    level:["Level","Learner Level","Reach learner Level {n}","🌟"],
    mastery:["Mastery","Phrases Mastered","Master {n} phrases","💎"],
    durable:["Long-term","Durable Memories","Build long-term mastery on {n} phrases","🛡️"],
    quick:["Review","Quick Review","Complete {n} Quick Review items","🔁"],
    daily:["Practice","Daily Sessions","Complete {n} Daily Sessions","☀️"],
    lessons:["Journey","Lessons Completed","Complete {n} lessons","📚"],
    avatars:["Collection","Avatar Collector","Collect {n} avatars","🦜"],
    scenarios:["Conversation","Scenario Speaker","Clear {n} conversation scenarios","🎭"],
    perfect:["Accuracy","Perfect Lessons","Complete {n} perfect lessons","🏆"],
    handsfree:["Review","Hands-Free Review","Complete {n} Hands-Free Review items","🎧"],
    days:["Consistency","Days Studied","Study on {n} different days","📅"],
    keys:["Rewards","Keys Earned","Earn {n} Daily Keys","🔑"],
    chests:["Rewards","Chests Opened","Open {n} reward chests","🎁"],
    correctStreak:["Accuracy","Correct Streak","Give {n} correct answers in a row","⚡"],
    mastery1:["Vocabulary","Words Encountered","Reach mastery 1 on {n} phrases","🌱"],
    mastery2:["Vocabulary","Words Practised","Reach mastery 2 on {n} phrases","🌿"],
    mastery3:["Vocabulary","Words Strengthened","Reach mastery 3 on {n} phrases","🌳"],
    mastery4:["Vocabulary","Words Nearly Mastered","Reach mastery 4 on {n} phrases","🏛️"],
    badges:["Collection","Badge Collector","Earn {n} badges","🏅"]
  };

  const compact = value => number(value).toLocaleString("en-US");
  const makeBadge = (metricKey, target, index, thresholds) => {
    const [category, family, description, icon] = LABELS[metricKey];
    const previous = index > 0 ? thresholds[index - 1] : 0;
    return {
      id:`lt_${metricKey}_${target}`,
      icon,
      name:index === thresholds.length - 1 ? `${family}: Legend` : `${family}: ${compact(target)}`,
      description:description.replace("{n}", compact(target)),
      category,
      rarity:index >= thresholds.length - 1 ? "legendary" : index >= Math.ceil(thresholds.length * .7) ? "epic" : index >= Math.ceil(thresholds.length * .4) ? "rare" : "common",
      target,
      current:() => metric(metricKey),
      test:() => metric(metricKey) >= target,
      unlockTest:() => previous === 0 || metric(metricKey) >= previous,
      image:`badges/lt_${metricKey}_${target}.png`
    };
  };

  const CHAINS = Object.freeze({
    answers:[250,500,1000,2500,5000,10000,20000,50000,100000],
    correct:[500,1000,2500,5000,10000,25000,50000,100000],
    streak:[14,60,100,180,365,730],
    xp:[1000,2500,5000,10000,25000,50000,100000,250000,500000,1000000],
    coins:[500,1000,2500,5000,10000,25000,50000,100000,250000,500000,1000000],
    level:[5,15,20,30,40,60,75,100],
    mastery:[25,50,100,150,250,500,750,1000],
    durable:[10,25,50,100,250,500,750,1000],
    quick:[250,500,1000,2500,5000,10000],
    daily:[25,50,100,250,500,1000],
    lessons:[5,10,25,50,100,250,500,1000],
    avatars:[2,5,10,15,20,25,30,40,50],
    scenarios:[5,10,25,50,100,250],
    perfect:[1,5,10,25,50,100,250],
    handsfree:[1,5,10,25,50,100,250,500,1000],
    days:[3,7,14,30,60,100,180,365,730],
    keys:[5,10,25,50,100,250,500,1000],
    chests:[1,5,10,25,50,100,250],
    correctStreak:[10,25,50,100,250,500],
    mastery1:[10,25,50,100,250,500,750,1000],
    mastery2:[10,25,50,100,250,500,750,1000],
    mastery3:[10,25,50,100,250,500,750,1000],
    mastery4:[10,25,50,100,250,500,750,1000],
    badges:[10,25,50,75,100,150,200,250]
  });

  function specialBadges() {
    return [
      {
        id:"lt_avatars_all",icon:"👑",name:"Avatar Curator",description:"Collect every available avatar",category:"Collection",rarity:"legendary",target:1,
        current:() => totalAvatars() > 0 && ownedAvatars() >= totalAvatars() ? 1 : 0,
        test:() => totalAvatars() > 0 && ownedAvatars() >= totalAvatars(),
        unlockTest:() => totalAvatars() > 0 && ownedAvatars() >= Math.max(1, Math.ceil(totalAvatars() * .75)),
        image:"badges/lt_avatars_all.png"
      },
      {
        id:"lt_mastery_all",icon:"📖",name:"Walking Dictionary",description:"Master every phrase currently available in the course",category:"Mastery",rarity:"legendary",target:1,
        current:() => { const total = Object.keys(window.state?.itemState || {}).length; return total > 0 && itemCountAt(5) >= total ? 1 : 0; },
        test:() => { const total = Object.keys(window.state?.itemState || {}).length; return total > 0 && itemCountAt(5) >= total; },
        unlockTest:() => itemCountAt(5) >= 100,
        image:"badges/lt_mastery_all.png"
      },
      {
        id:"lt_legend_of_salita",icon:"🏆",name:"Legend of Salita",description:"Earn every non-secret badge currently available",category:"Legend",rarity:"legendary",target:1,
        current:() => { const candidates = window.BADGES?.filter(badge => badge.id !== "lt_legend_of_salita" && !badge.hidden) || []; const earned = window.state?.badgeProgress?.earnedAt || {}; return candidates.length > 0 && candidates.every(badge => earned[badge.id] || badge.test?.(window.state)) ? 1 : 0; },
        test:() => { const candidates = window.BADGES?.filter(badge => badge.id !== "lt_legend_of_salita" && !badge.hidden) || []; const earned = window.state?.badgeProgress?.earnedAt || {}; return candidates.length > 0 && candidates.every(badge => earned[badge.id] || badge.test?.(window.state)); },
        unlockTest:() => metric("badges") >= 200,
        image:"badges/lt_legend_of_salita.png"
      }
    ];
  }

  function buildCatalogue() {
    const badges = [];
    for (const [metricKey, thresholds] of Object.entries(CHAINS)) thresholds.forEach((target,index) => badges.push(makeBadge(metricKey,target,index,thresholds)));
    badges.push(...specialBadges());
    return badges;
  }

  function install() {
    if (!Array.isArray(window.BADGES) || !window.state) {
      window.setTimeout(install,120);
      return;
    }
    const ids = new Set(window.BADGES.map(badge => badge.id));
    const additions = buildCatalogue().filter(badge => !ids.has(badge.id));
    window.BADGES.push(...additions);
    document.documentElement.dataset.longTermBadges = RELEASE;
    document.dispatchEvent(new CustomEvent("salita:long-term-badges-ready", {detail:{release:RELEASE,added:additions.length,total:window.BADGES.length}}));
    try { window.syncEarned?.({bootstrap:true}); window.renderCatalogue?.(); } catch {}
  }

  install();
})();