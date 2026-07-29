(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestWeeklyAvatarPolishInstalled";
  const KEY_TARGET = 6;
  let pendingPlaybackTimer = 0;
  let playingPendingAward = false;

  function retryInstall() {
    window.setTimeout(installPolish, 80);
  }

  function installPolish() {
    try {
      if (
        typeof state === "undefined" ||
        typeof DAILY_QUESTS === "undefined" ||
        typeof ensureDailyActivity !== "function" ||
        typeof claimDailyQuestRewards !== "function" ||
        typeof renderDailyQuests !== "function" ||
        typeof switchView !== "function" ||
        typeof saveState !== "function" ||
        !state.weeklyAvatarChest
      ) {
        retryInstall();
        return;
      }
    } catch {
      retryInstall();
      return;
    }

    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    function parseDateKey(key) {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || ""));
      return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12) : new Date();
    }

    function localDateKey(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
    }

    function weekKeyForDate(value) {
      const date = parseDateKey(value);
      date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      return localDateKey(date);
    }

    function activityDate() {
      return ensureDailyActivity().date || localDateKey(new Date());
    }

    function weeklyState() {
      return state.weeklyAvatarChest || (state.weeklyAvatarChest = {});
    }

    function keyDates() {
      const weekly = weeklyState();
      weekly.keyDates = Array.isArray(weekly.keyDates) ? [...new Set(weekly.keyDates.filter(Boolean))] : [];
      return weekly.keyDates;
    }

    function pendingAwards() {
      const weekly = weeklyState();
      weekly.pendingKeyAwards = Array.isArray(weekly.pendingKeyAwards)
        ? weekly.pendingKeyAwards.filter(award => award && award.date && award.week)
        : [];
      return weekly.pendingKeyAwards;
    }

    function animatedDates() {
      const weekly = weeklyState();
      weekly.animatedKeyDates = Array.isArray(weekly.animatedKeyDates)
        ? [...new Set(weekly.animatedKeyDates.filter(Boolean))]
        : [];
      return weekly.animatedKeyDates;
    }

    function keysThisWeek() {
      const week = weekKeyForDate(activityDate());
      return keyDates().filter(key => weekKeyForDate(key) === week).length;
    }

    function allFourWinsComplete() {
      const activity = ensureDailyActivity();
      return DAILY_QUESTS.length === 4 && DAILY_QUESTS.every(quest => activity.questsClaimed.includes(quest.id));
    }

    function removePendingAwardForDate(date) {
      const awards = pendingAwards();
      const next = awards.filter(award => award.date !== date);
      if (next.length === awards.length) return false;
      weeklyState().pendingKeyAwards = next;
      return true;
    }

    function removePrematureTodayKey() {
      if (allFourWinsComplete()) return false;
      const date = activityDate();
      const dates = keyDates();
      const index = dates.indexOf(date);
      let changed = false;
      if (index >= 0) {
        dates.splice(index, 1);
        changed = true;
      }
      if (removePendingAwardForDate(date)) changed = true;
      return changed;
    }

    function queuePendingKeyAward(count, date = activityDate()) {
      const weekly = weeklyState();
      const awards = pendingAwards();
      if (animatedDates().includes(date) || awards.some(award => award.date === date)) return false;
      awards.push({
        date,
        week: weekKeyForDate(date),
        count: Math.max(1, Math.min(KEY_TARGET, Number(count) || 1)),
        queuedAt: new Date().toISOString()
      });
      weekly.pendingKeyAwards = awards;
      return true;
    }

    function recoverMissedTodayAnimation() {
      const date = activityDate();
      if (!allFourWinsComplete() || !keyDates().includes(date)) return false;
      return queuePendingKeyAward(Math.min(KEY_TARGET, keysThisWeek()), date);
    }

    function setFourWinsHeading() {
      const heading = document.querySelector(".daily-quests-card .quest-card-header h3");
      if (heading) heading.textContent = "4 small wins";
    }

    function correctDailyKeyMessage() {
      setFourWinsHeading();
      const chest = document.getElementById("questChest");
      if (!chest || chest.classList.contains("weekly-ready") || chest.classList.contains("weekly-claimed")) return;

      const date = activityDate();
      const earned = keyDates().includes(date);
      const count = Math.min(KEY_TARGET, keysThisWeek());
      chest.classList.toggle("unlocked", earned);
      chest.classList.toggle("locked", !earned);

      const title = document.getElementById("questChestTitle");
      const text = document.getElementById("questChestText");
      const status = document.getElementById("questChestStatus");
      if (title) title.textContent = earned ? `Daily Key collected · ${count}/${KEY_TARGET}` : `Earn today’s Daily Key · ${count}/${KEY_TARGET}`;
      if (text) text.textContent = earned ? "Return on another day and complete all four quests to collect the next key." : "Complete all four Daily Quests to add one key to this week.";
      if (status) status.innerHTML = `<span class="weekly-key-status">${earned ? "✓" : "🔒"}</span>`;
    }

    function isHomeActive() {
      const home = document.getElementById("homeView");
      return Boolean(home?.classList.contains("active")) && document.body.dataset.currentView !== "learn";
    }

    function restoreTargetSlot(target) {
      target.textContent = "🔑";
      target.classList.add("collected");
      target.classList.remove("pending-key-arrival");
      target.classList.remove("key-arrival");
      void target.offsetWidth;
      target.classList.add("key-arrival");
      window.setTimeout(() => target.classList.remove("key-arrival"), 850);
    }

    function animateDailyKeyAward(count) {
      return new Promise(resolve => {
        const target = document.querySelector(`.weekly-key-slot:nth-child(${Math.max(1, count)})`);
        if (!target || !isHomeActive()) {
          resolve(false);
          return;
        }

        target.classList.remove("key-arrival", "collected");
        target.classList.add("pending-key-arrival");
        target.textContent = "";

        const reduced = Boolean(state.settings?.reducedMotion) || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (reduced) {
          window.setTimeout(() => {
            restoreTargetSlot(target);
            resolve(true);
          }, 260);
          return;
        }

        const source = document.querySelector(".daily-quest:last-child") || document.getElementById("questChest");
        const sourceRect = source?.getBoundingClientRect() || {left:window.innerWidth / 2,top:window.innerHeight / 2,width:0,height:0};
        const targetRect = target.getBoundingClientRect();
        const startX = sourceRect.left + sourceRect.width / 2;
        const startY = sourceRect.top + sourceRect.height / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;
        const dx = endX - startX;
        const dy = endY - startY;

        const key = document.createElement("div");
        key.className = "daily-key-award";
        key.textContent = "🔑";
        key.setAttribute("aria-hidden", "true");
        key.style.left = `${startX}px`;
        key.style.top = `${startY}px`;
        document.body.appendChild(key);

        const animation = key.animate([
          {opacity:0,transform:"translate(-50%,-25%) scale(.35) rotate(-20deg)",filter:"brightness(1)"},
          {opacity:1,transform:"translate(-50%,-115%) scale(1.55) rotate(9deg)",filter:"brightness(1.65)",offset:.32},
          {opacity:1,transform:`translate(calc(-50% + ${dx * .18}px),calc(-115% + ${dy * .18}px)) scale(1.7) rotate(-7deg)`,filter:"brightness(1.9)",offset:.48},
          {opacity:1,transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.72) rotate(350deg)`,filter:"brightness(1.25)",offset:.88},
          {opacity:0,transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.2) rotate(390deg)`,filter:"brightness(2)"}
        ],{duration:1450,easing:"cubic-bezier(.2,.8,.2,1)",fill:"forwards"});

        animation.finished.catch(() => {}).finally(() => {
          key.remove();
          restoreTargetSlot(target);
          resolve(true);
        });
      });
    }

    function currentWeekPendingAward() {
      const week = weekKeyForDate(activityDate());
      return pendingAwards().find(award => award.week === week) || null;
    }

    function markAwardPlayed(award) {
      const weekly = weeklyState();
      weekly.pendingKeyAwards = pendingAwards().filter(item => item.date !== award.date);
      const played = animatedDates();
      if (!played.includes(award.date)) played.push(award.date);
      weekly.animatedKeyDates = played.slice(-180);
      saveState();
    }

    async function playPendingAwardOnHome() {
      window.clearTimeout(pendingPlaybackTimer);
      if (playingPendingAward || !isHomeActive()) return;
      const award = currentWeekPendingAward();
      if (!award) return;

      playingPendingAward = true;
      renderDailyQuests();
      await new Promise(resolve => window.setTimeout(resolve, 260));
      const played = await animateDailyKeyAward(award.count);
      if (played) markAwardPlayed(award);
      playingPendingAward = false;

      if (currentWeekPendingAward() && isHomeActive()) {
        pendingPlaybackTimer = window.setTimeout(playPendingAwardOnHome, 450);
      }
    }

    function schedulePendingPlayback(delay = 280) {
      window.clearTimeout(pendingPlaybackTimer);
      pendingPlaybackTimer = window.setTimeout(playPendingAwardOnHome, delay);
    }

    const baseClaimDailyQuestRewards = claimDailyQuestRewards;
    claimDailyQuestRewards = function claimDailyQuestRewardsWithDeferredKeyFlight(celebrate = false) {
      const before = keysThisWeek();
      const result = baseClaimDailyQuestRewards(celebrate);
      const valid = allFourWinsComplete();
      const removed = removePrematureTodayKey();
      const after = keysThisWeek();
      let changed = removed;

      if (valid && after > before) {
        changed = queuePendingKeyAward(Math.min(KEY_TARGET, after)) || changed;
      }
      if (changed) saveState();

      if (valid && after > before && isHomeActive()) schedulePendingPlayback(320);
      return result;
    };

    const baseRenderDailyQuests = renderDailyQuests;
    renderDailyQuests = function renderDailyQuestsWithFourWinsHeading() {
      baseRenderDailyQuests();
      correctDailyKeyMessage();
    };

    const baseSwitchView = switchView;
    switchView = function switchViewWithPendingKeyAward(view) {
      const result = baseSwitchView.apply(this, arguments);
      if (view === "home") schedulePendingPlayback(360);
      return result;
    };

    let changed = removePrematureTodayKey();
    changed = recoverMissedTodayAnimation() || changed;
    if (changed) saveState();
    setFourWinsHeading();
    renderDailyQuests();
    if (isHomeActive()) schedulePendingPlayback(420);
  }

  installPolish();
})();
