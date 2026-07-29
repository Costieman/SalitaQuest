(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestWeeklyAvatarPolishInstalled";
  const KEY_TARGET = 6;

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

    function keyDates() {
      const weekly = state.weeklyAvatarChest || (state.weeklyAvatarChest = {});
      weekly.keyDates = Array.isArray(weekly.keyDates) ? [...new Set(weekly.keyDates.filter(Boolean))] : [];
      return weekly.keyDates;
    }

    function keysThisWeek() {
      const week = weekKeyForDate(activityDate());
      return keyDates().filter(key => weekKeyForDate(key) === week).length;
    }

    function allFourWinsComplete() {
      const activity = ensureDailyActivity();
      return DAILY_QUESTS.length === 4 && DAILY_QUESTS.every(quest => activity.questsClaimed.includes(quest.id));
    }

    function removePrematureTodayKey() {
      if (allFourWinsComplete()) return false;
      const date = activityDate();
      const dates = keyDates();
      const index = dates.indexOf(date);
      if (index < 0) return false;
      dates.splice(index, 1);
      return true;
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

    function animateDailyKeyAward(count) {
      const target = document.querySelector(`.weekly-key-slot:nth-child(${Math.max(1, count)})`);
      if (!target) return;

      target.classList.remove("key-arrival");
      const reduced = Boolean(state.settings?.reducedMotion) || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      if (reduced) {
        void target.offsetWidth;
        target.classList.add("key-arrival");
        window.setTimeout(() => target.classList.remove("key-arrival"), 800);
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
        target.classList.remove("key-arrival");
        void target.offsetWidth;
        target.classList.add("key-arrival");
        window.setTimeout(() => target.classList.remove("key-arrival"), 850);
      });
    }

    const baseClaimDailyQuestRewards = claimDailyQuestRewards;
    claimDailyQuestRewards = function claimDailyQuestRewardsWithKeyFlight(celebrate = false) {
      const before = keysThisWeek();
      const result = baseClaimDailyQuestRewards(celebrate);
      const valid = allFourWinsComplete();
      const removed = removePrematureTodayKey();
      if (removed) saveState();
      const after = keysThisWeek();

      if (celebrate && valid && after > before) {
        window.setTimeout(() => {
          renderDailyQuests();
          animateDailyKeyAward(Math.min(KEY_TARGET, after));
        }, 220);
      }
      return result;
    };

    const baseRenderDailyQuests = renderDailyQuests;
    renderDailyQuests = function renderDailyQuestsWithFourWinsHeading() {
      baseRenderDailyQuests();
      correctDailyKeyMessage();
    };

    if (removePrematureTodayKey()) saveState();
    setFourWinsHeading();
    renderDailyQuests();
  }

  installPolish();
})();
