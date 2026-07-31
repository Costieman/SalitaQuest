(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestLevelUpMobileSafetyV552Installed";
  const RELEASE = "5.5.2";
  const STALE_PENDING_MS = 10 * 60 * 1000;

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
        detail:{release:RELEASE, reason}
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

  function sanitisePending(reason = "startup") {
    const system = progressionSystem();
    const level = currentLevel();
    if (!system || level == null) return false;

    let changed = false;
    const pending = system.pendingLevelUp;
    const lastKnown = Math.max(1, Number(system.lastKnownLevel) || level);
    const lastCelebrated = Math.max(1, Number(system.lastCelebratedLevel) || level);

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
        || (Number.isFinite(from) && from >= to);

      if (impossible || stale) {
        if (Number.isFinite(to) && to <= level) {
          system.lastCelebratedLevel = Math.max(Number(system.lastCelebratedLevel) || 1, to);
        }
        system.pendingLevelUp = null;
        changed = true;
      }
    }

    if (changed) save(`sanitise_${reason}`);
    return changed;
  }

  function acknowledgeVisibleCelebration(reason = "celebration_started") {
    const system = progressionSystem();
    const pending = system?.pendingLevelUp;
    if (!system || !pending) return false;

    const level = currentLevel();
    const target = Math.max(1, Math.min(99, Number(pending.to) || level || 1));
    system.pendingLevelUp = null;
    system.lastKnownLevel = Math.max(Number(system.lastKnownLevel) || 1, level || target);
    system.lastCelebratedLevel = Math.max(Number(system.lastCelebratedLevel) || 1, target);
    system.lastCelebrationAcknowledgedAt = new Date().toISOString();
    system.lastCelebrationAcknowledgedBy = RELEASE;
    save(reason);
    return true;
  }

  function containsCelebration(node) {
    if (!(node instanceof Element)) return false;
    return node.matches?.(".level-up-celebration") || Boolean(node.querySelector?.(".level-up-celebration"));
  }

  function installObserver() {
    const existing = document.querySelector(".level-up-celebration");
    if (existing) acknowledgeVisibleCelebration("existing_celebration");

    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (containsCelebration(node)) {
            acknowledgeVisibleCelebration("celebration_dom_inserted");
            return;
          }
        }
      }
    });
    observer.observe(document.documentElement, {childList:true, subtree:true});

    window.addEventListener("pagehide", () => {
      if (document.querySelector(".level-up-celebration")) {
        acknowledgeVisibleCelebration("pagehide_during_celebration");
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && document.querySelector(".level-up-celebration")) {
        acknowledgeVisibleCelebration("hidden_during_celebration");
      }
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
    document.documentElement.dataset.levelUpSafety = RELEASE;
    window.SalitaLevelUpMobileSafety = Object.freeze({
      version:RELEASE,
      sanitise:() => sanitisePending("manual"),
      acknowledge:() => acknowledgeVisibleCelebration("manual")
    });
  }

  install();
})();
