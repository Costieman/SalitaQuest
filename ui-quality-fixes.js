(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestQualityFixesInstalled";

  function retryInstall() {
    window.setTimeout(installQualityFixes, 60);
  }

  function installQualityFixes() {
    try {
      if (
        typeof state === "undefined" ||
        typeof DEFAULT_STATE === "undefined" ||
        typeof DAILY_QUESTS === "undefined" ||
        typeof ensureDailyActivity !== "function" ||
        typeof renderDailyQuests !== "function" ||
        typeof finishSession !== "function" ||
        typeof showAnswerPop !== "function"
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

    DEFAULT_STATE.dailyActivity = {
      ...(DEFAULT_STATE.dailyActivity || {}),
      quickReviews: Number(DEFAULT_STATE.dailyActivity?.quickReviews || 0)
    };

    const baseEnsureDailyActivity = ensureDailyActivity;
    ensureDailyActivity = function ensureDailyActivityWithQuickReviews() {
      const activity = baseEnsureDailyActivity();
      const current = Number(activity.quickReviews);
      activity.quickReviews = Number.isFinite(current) ? current : 0;
      return activity;
    };

    ensureDailyActivity();

    if (!DAILY_QUESTS.some(quest => quest.id === "quick_twice")) {
      DAILY_QUESTS.push({
        id: "quick_twice",
        icon: "⚡",
        title: "Complete 2 Quick Reviews",
        detail: "Finish two short Quick Review sessions today.",
        target: 2,
        reward: 15,
        metric: activity => Number(activity.quickReviews || 0)
      });
    }

    const baseRenderDailyQuests = renderDailyQuests;
    renderDailyQuests = function renderDailyQuestsWithQuickReviewGoal() {
      baseRenderDailyQuests();
      const activity = ensureDailyActivity();
      const completed = DAILY_QUESTS.filter(quest => activity.questsClaimed.includes(quest.id)).length;
      const score = document.getElementById("dailyQuestScore");
      if (score) score.textContent = `${completed}/${DAILY_QUESTS.length}`;
      const chestTitle = document.getElementById("questChestTitle");
      if (chestTitle && !activity.chestClaimed) chestTitle.textContent = `Complete all ${DAILY_QUESTS.length} quests`;
    };

    const baseFinishSession = finishSession;
    finishSession = function finishSessionWithQuickReviewTracking() {
      if (session?.mode === "quick") {
        const activity = ensureDailyActivity();
        activity.quickReviews = Number(activity.quickReviews || 0) + 1;
      }
      return baseFinishSession();
    };

    function flashCorrectSelection() {
      const targets = [];
      const selectedChoice = document.querySelector(".choice-btn.selected");
      if (selectedChoice) targets.push(selectedChoice);

      const sentenceBuilder = document.getElementById("sentenceBuilder");
      if (sentenceBuilder && !sentenceBuilder.classList.contains("hidden")) {
        const builtSentence = sentenceBuilder.querySelector(".built-sentence");
        if (builtSentence) targets.push(builtSentence);
        targets.push(...sentenceBuilder.querySelectorAll(".selected-word-tile"));
      }

      const answerInput = document.getElementById("answerInput");
      if (answerInput && !answerInput.classList.contains("hidden")) targets.push(answerInput);

      targets.forEach(target => {
        target.classList.remove("answer-correct-flash");
        void target.offsetWidth;
        target.classList.add("answer-correct-flash");
        window.setTimeout(() => target.classList.remove("answer-correct-flash"), 950);
      });
    }

    const baseShowAnswerPop = showAnswerPop;
    showAnswerPop = function showAnswerPopWithLightFlash(xpGain, combo) {
      baseShowAnswerPop(xpGain, combo);
      flashCorrectSelection();
    };

    if (typeof updateAll === "function") updateAll();
  }

  installQualityFixes();
})();
