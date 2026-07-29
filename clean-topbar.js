(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestCleanTopbarInstalled";

  function retryInstall() {
    window.setTimeout(installCleanTopbar, 60);
  }

  function structureMasteryShell() {
    const shell = document.querySelector(".mastery-rail-shell");
    if (!shell) return false;
    if (shell.dataset.compactMastery === "true") return true;

    const heading = shell.querySelector(":scope > .mastery-rail-heading");
    const milestones = shell.querySelector(":scope > .mastery-milestones");
    if (!heading || !milestones) return false;

    const summary = heading.firstElementChild;
    const nextCopy = heading.querySelector(".mastery-next-copy");
    if (!summary || !nextCopy) return false;

    summary.classList.add("mastery-summary-compact");
    shell.insertBefore(summary, milestones);
    shell.insertBefore(nextCopy, milestones.nextSibling);
    heading.remove();
    shell.dataset.compactMastery = "true";
    return true;
  }

  function compactMasteryCopy() {
    structureMasteryShell();

    const title = document.getElementById("masteryRailTitle");
    const nextRegion = document.getElementById("masteryNextRegion");
    const nextText = document.getElementById("masteryNextText");

    if (title) {
      const points = typeof totalLearningPoints === "function"
        ? totalLearningPoints()
        : Number((title.textContent.match(/\d+/) || [0])[0]);
      title.textContent = `World Progress · ${points} MP`;
    }

    if (!nextRegion || !nextText) return;

    const currentRegion = nextRegion.textContent.trim();
    if (/all current regions unlocked/i.test(currentRegion) || /all regions unlocked/i.test(currentRegion)) {
      nextRegion.textContent = "All regions unlocked";
      nextText.textContent = "Keep building durable recall";
      return;
    }

    const regionName = currentRegion
      .replace(/^Next unlock\s*[·:-]\s*/i, "")
      .replace(/^Next\s*[·:-]\s*/i, "")
      .trim();
    const remaining = (nextText.textContent.match(/\d+/) || [""])[0];

    if (regionName) nextRegion.textContent = `Next: ${regionName}`;
    if (remaining) nextText.textContent = `${remaining} MP to go`;
  }

  function installCleanTopbar() {
    try {
      if (typeof renderMasteryRail !== "function" || !document.querySelector(".mastery-rail-shell")) {
        retryInstall();
        return;
      }
    } catch {
      retryInstall();
      return;
    }

    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    structureMasteryShell();

    const baseRenderMasteryRail = renderMasteryRail;
    renderMasteryRail = function renderMasteryRailWithCompactCopy() {
      const result = baseRenderMasteryRail.apply(this, arguments);
      compactMasteryCopy();
      return result;
    };

    compactMasteryCopy();
  }

  installCleanTopbar();
})();
