(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestDailyGoalRefinementInstalled";

  function retry() {
    window.setTimeout(install, 70);
  }

  function install() {
    try {
      if (
        typeof state === "undefined" ||
        typeof DEFAULT_STATE === "undefined" ||
        typeof DAILY_QUESTS === "undefined" ||
        typeof ensureDailyActivity !== "function" ||
        typeof questProgress !== "function" ||
        typeof recordDailyAnswer !== "function" ||
        typeof finishSession !== "function" ||
        typeof saveState !== "function"
      ) {
        retry();
        return;
      }
    } catch {
      retry();
      return;
    }

    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    DEFAULT_STATE.dailyActivity = {
      ...(DEFAULT_STATE.dailyActivity || {}),
      dailySessions: Number(DEFAULT_STATE.dailyActivity?.dailySessions || 0),
      quickReviewItems: Number(DEFAULT_STATE.dailyActivity?.quickReviewItems || 0)
    };

    const baseEnsureDailyActivity = ensureDailyActivity;
    ensureDailyActivity = function ensureDailyActivityWithHarderGoals() {
      const activity = baseEnsureDailyActivity();
      activity.dailySessions = Number.isFinite(Number(activity.dailySessions)) ? Number(activity.dailySessions) : 0;
      activity.quickReviewItems = Number.isFinite(Number(activity.quickReviewItems)) ? Number(activity.quickReviewItems) : 0;
      activity.quickReviews = Number.isFinite(Number(activity.quickReviews)) ? Number(activity.quickReviews) : 0;
      activity.questsClaimed = Array.isArray(activity.questsClaimed) ? activity.questsClaimed : [];
      return activity;
    };

    const sessionQuest = DAILY_QUESTS.find(quest => quest.id === "session");
    if (sessionQuest) {
      sessionQuest.title = "Finish one Daily Session";
      sessionQuest.detail = "Complete the full recommended Daily Session.";
      sessionQuest.target = 1;
      sessionQuest.metric = activity => Number(activity.dailySessions || 0);
    }

    const correctQuest = DAILY_QUESTS.find(quest => quest.id === "correct");
    if (correctQuest) {
      correctQuest.title = "Get 15 answers right";
      correctQuest.detail = "Build 15 correct answers across today’s practice.";
      correctQuest.target = 15;
      correctQuest.metric = activity => Number(activity.correct || 0);
    }

    let quickQuest = DAILY_QUESTS.find(quest => quest.id === "quick_twice");
    if (!quickQuest) {
      quickQuest = {id:"quick_twice", icon:"⚡", reward:15};
      DAILY_QUESTS.push(quickQuest);
    }
    quickQuest.icon = "⚡";
    quickQuest.title = "Complete 15 Quick Review items";
    quickQuest.detail = "Answer 15 Quick Review questions in one long review or several shorter reviews.";
    quickQuest.target = 15;
    quickQuest.reward = 15;
    quickQuest.metric = activity => Number(activity.quickReviewItems || 0);

    const activity = ensureDailyActivity();
    activity.questsClaimed = activity.questsClaimed.filter(id => {
      const quest = DAILY_QUESTS.find(item => item.id === id);
      return quest && questProgress(quest) >= quest.target;
    });
    if (!DAILY_QUESTS.every(quest => activity.questsClaimed.includes(quest.id))) activity.chestClaimed = false;
    saveState();

    /*
      The lesson buttons were bound to the original checkAnswer function before
      enhancement scripts load. recordDailyAnswer is resolved dynamically from
      that original function, so this is the reliable one-per-submission hook.
    */
    const baseRecordDailyAnswer = recordDailyAnswer;
    recordDailyAnswer = function recordDailyAnswerWithQuickItemTracking(correct, isReview = false) {
      const wasQuickReview = session?.mode === "quick";
      if (wasQuickReview) {
        const current = ensureDailyActivity();
        current.quickReviewItems = Number(current.quickReviewItems || 0) + 1;
      }

      const result = baseRecordDailyAnswer.apply(this, arguments);

      if (wasQuickReview) {
        if (typeof renderDailyQuests === "function") renderDailyQuests();
        saveState();
      }
      return result;
    };

    const baseFinishSession = finishSession;
    finishSession = function finishSessionWithDailyModeTracking() {
      const completedDaily = session?.mode === "daily";
      if (completedDaily) {
        const current = ensureDailyActivity();
        current.dailySessions = Number(current.dailySessions || 0) + 1;
      }
      return baseFinishSession.apply(this, arguments);
    };

    if (typeof updateAll === "function") updateAll();
  }

  install();
})();