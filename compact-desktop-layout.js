(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestCompactDesktopInstalled";

  function installCompactDesktopLayout() {
    if (window[INSTALL_FLAG]) return;

    const lessonCard = document.getElementById("lessonCard");
    const footer = lessonCard?.querySelector(".lesson-footer");
    const rewards = document.querySelector(".learn-layout > .session-panel") || document.querySelector("#learnView .session-panel");

    if (!lessonCard || !footer || !rewards) {
      window.setTimeout(installCompactDesktopLayout, 60);
      return;
    }

    window[INSTALL_FLAG] = true;
    rewards.classList.add("session-rewards-strip");
    lessonCard.insertBefore(rewards, footer);

    const firstEyebrow = rewards.querySelector(":scope > .eyebrow");
    if (firstEyebrow) {
      firstEyebrow.classList.add("session-rewards-label");
      firstEyebrow.textContent = "Session rewards";
    }

    const masteryLabel = [...rewards.querySelectorAll(":scope > .eyebrow")].find(node => node !== firstEyebrow);
    if (masteryLabel) masteryLabel.classList.add("session-mastery-label");

    const updateCompactState = () => {
      document.body.classList.toggle("compact-nonhome-view", document.body.dataset.currentView !== "home");
    };

    updateCompactState();
    const observer = new MutationObserver(updateCompactState);
    observer.observe(document.body, {attributes: true, attributeFilter: ["data-current-view"]});
  }

  installCompactDesktopLayout();
})();
