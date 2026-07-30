(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestLevelProgressionV2Installed";
  const MAX_LEVEL = 99;
  const SYSTEM_VERSION = 2;
  let celebrationTimer = 0;
  let celebrationPlaying = false;

  const LEVEL_RANKS = [
    [1, "Starter", "Build your first conversational habits."],
    [5, "Explorer", "Recognise familiar language across useful situations."],
    [10, "Connector", "Link phrases into practical exchanges."],
    [20, "Navigator", "Retrieve useful language with growing flexibility."],
    [30, "Conversation Builder", "Sustain longer and more varied exchanges."],
    [40, "Language Pathfinder", "Choose language confidently across situations."],
    [55, "Fluency Climber", "Develop speed, depth, and durable recall."],
    [70, "Confident Speaker", "Respond naturally with a broad active toolkit."],
    [85, "Master Communicator", "Maintain accurate, flexible communication."],
    [99, "Salita Legend", "The summit of the Salita Quest learning journey."]
  ];

  function retry() {
    window.setTimeout(install, 80);
  }

  function xpNeededForLevel(level) {
    const safeLevel = Math.max(1, Math.min(MAX_LEVEL - 1, Number(level) || 1));
    return Math.round(180 + 8 * safeLevel + 0.12 * safeLevel * safeLevel);
  }

  function rankForLevel(level) {
    let rank = LEVEL_RANKS[0];
    LEVEL_RANKS.forEach(candidate => {
      if (level >= candidate[0]) rank = candidate;
    });
    return rank;
  }

  function ensureSystem() {
    const currentXp = Math.max(0, Number(state.xp || 0));
    let system = state.levelProgressionV2;
    if (!system || system.version !== SYSTEM_VERSION) {
      const legacyLevel = Math.max(1, Math.min(MAX_LEVEL, Math.floor(currentXp / 250) + 1));
      const legacyProgress = legacyLevel >= MAX_LEVEL ? 1 : (currentXp % 250) / 250;
      const equivalentProgress = legacyLevel >= MAX_LEVEL ? 0 : Math.round(legacyProgress * xpNeededForLevel(legacyLevel));
      system = {
        version: SYSTEM_VERSION,
        baseLevel: legacyLevel,
        baseXp: Math.max(0, currentXp - equivalentProgress),
        lastKnownLevel: legacyLevel,
        lastCelebratedLevel: legacyLevel,
        pendingLevelUp: null,
        migratedAt: new Date().toISOString()
      };
      state.levelProgressionV2 = system;
      try { saveState(); } catch {}
    }

    system.baseLevel = Math.max(1, Math.min(MAX_LEVEL, Number(system.baseLevel || 1)));
    system.baseXp = Math.max(0, Number(system.baseXp || 0));
    system.lastKnownLevel = Math.max(system.baseLevel, Math.min(MAX_LEVEL, Number(system.lastKnownLevel || system.baseLevel)));
    system.lastCelebratedLevel = Math.max(system.baseLevel, Math.min(MAX_LEVEL, Number(system.lastCelebratedLevel || system.baseLevel)));
    return system;
  }

  function calculateLevel() {
    const system = ensureSystem();
    let level = system.baseLevel;
    let remainingXp = Math.max(0, Number(state.xp || 0) - system.baseXp);

    while (level < MAX_LEVEL) {
      const requirement = xpNeededForLevel(level);
      if (remainingXp < requirement) break;
      remainingXp -= requirement;
      level += 1;
    }

    const rank = rankForLevel(level);
    if (level >= MAX_LEVEL) {
      return {
        level: MAX_LEVEL,
        title: rank[1],
        subtitle: rank[2],
        inLevel: 0,
        requirement: 0,
        toNext: 0,
        progressPercent: 100,
        maxed: true
      };
    }

    const requirement = xpNeededForLevel(level);
    return {
      level,
      title: rank[1],
      subtitle: rank[2],
      inLevel: Math.max(0, Math.floor(remainingXp)),
      requirement,
      toNext: Math.max(0, requirement - Math.floor(remainingXp)),
      progressPercent: Math.max(0, Math.min(100, remainingXp / requirement * 100)),
      maxed: false
    };
  }

  function queueLevelUp(info) {
    const system = ensureSystem();
    if (info.level <= system.lastKnownLevel) return false;

    const previousKnown = system.lastKnownLevel;
    const existing = system.pendingLevelUp;
    system.pendingLevelUp = {
      from: existing?.from || previousKnown,
      to: info.level,
      queuedAt: existing?.queuedAt || new Date().toISOString()
    };
    system.lastKnownLevel = info.level;
    saveState();
    return true;
  }

  function updateLevelUI(info) {
    const percent = info.maxed ? 100 : info.progressPercent;
    const levelValue = document.getElementById("levelValue");
    const levelBar = document.getElementById("levelBar");
    const badge = document.getElementById("playerLevelBadge");
    const title = document.getElementById("playerLevelTitle");
    const subtitle = document.getElementById("playerLevelSubtitle");
    const xpText = document.getElementById("playerXpText");
    const remaining = document.getElementById("playerXpRemaining");
    const playerBar = document.getElementById("playerXpBar");
    const progressTitle = document.getElementById("progressLevelTitle");
    const progressBar = document.getElementById("progressXpBar");

    if (levelValue) {
      levelValue.textContent = info.maxed ? "Level 99 · MAX" : `Level ${info.level}`;
      levelValue.title = `Level ${info.level} of ${MAX_LEVEL}`;
    }
    if (levelBar) levelBar.style.width = `${percent}%`;
    if (badge) {
      badge.textContent = String(info.level);
      badge.dataset.digits = String(String(info.level).length);
      badge.classList.toggle("max-level", info.maxed);
    }
    if (title) title.textContent = info.title;
    if (subtitle) subtitle.textContent = info.subtitle;
    if (xpText) xpText.textContent = info.maxed ? "Maximum level reached" : `${info.inLevel} / ${info.requirement} XP`;
    if (remaining) remaining.textContent = info.maxed ? "Level 99 summit" : `${info.toNext} to next level`;
    if (playerBar) playerBar.style.width = `${percent}%`;
    if (progressTitle) progressTitle.textContent = `Level ${info.level} · ${info.title}`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    document.body.dataset.learnerLevel = String(info.level);
  }

  function homeIsActive() {
    const home = document.getElementById("homeView");
    return Boolean(home?.classList.contains("active")) && document.body.dataset.currentView === "home";
  }

  function visibleEmblem() {
    return [...document.querySelectorAll(".sq-profile-emblem-trigger")].find(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    }) || null;
  }

  function playLevelChime() {
    if (state.settings?.celebrationSounds === false) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const start = context.currentTime + .03;
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 3 ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(frequency, start + index * .11);
        gain.gain.setValueAtTime(.0001, start + index * .11);
        gain.gain.exponentialRampToValueAtTime(index === 3 ? .15 : .095, start + index * .11 + .025);
        gain.gain.exponentialRampToValueAtTime(.0001, start + index * .11 + .46);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start + index * .11);
        oscillator.stop(start + index * .11 + .5);
      });
      window.setTimeout(() => context.close().catch(() => {}), 1400);
    } catch {}
  }

  function markCelebrated(pending) {
    const system = ensureSystem();
    if (system.pendingLevelUp?.to === pending.to) system.pendingLevelUp = null;
    system.lastCelebratedLevel = Math.max(system.lastCelebratedLevel, pending.to);
    saveState();
  }

  async function playLevelCelebration() {
    window.clearTimeout(celebrationTimer);
    if (celebrationPlaying || !homeIsActive()) return;
    const system = ensureSystem();
    const pending = system.pendingLevelUp;
    if (!pending) return;

    if (document.querySelector(".daily-key-celebration, .daily-key-award")) {
      celebrationTimer = window.setTimeout(playLevelCelebration, 900);
      return;
    }

    const target = visibleEmblem();
    const imageSource = target?.querySelector("img")?.src || document.querySelector(".player-avatar img")?.src || "avatars/tarsier.png";
    celebrationPlaying = true;

    const layer = document.createElement("div");
    layer.className = "level-up-celebration";
    layer.setAttribute("aria-live", "polite");
    layer.innerHTML = `
      <div class="level-up-backdrop"></div>
      <div class="level-up-rays" aria-hidden="true"></div>
      <div class="level-up-banner"><span>LEVEL UP!</span><strong>Level ${pending.to}</strong><small>${rankForLevel(pending.to)[1]}</small></div>
      <div class="level-up-avatar"><img src="${imageSource}" alt=""><b>${pending.to}</b></div>
      <div class="level-up-sparks" aria-hidden="true">${Array.from({length:24}, (_, index) => `<i style="--i:${index}"></i>`).join("")}</div>`;
    document.body.appendChild(layer);
    requestAnimationFrame(() => layer.classList.add("show"));
    playLevelChime();

    const reduced = Boolean(state.settings?.reducedMotion) || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const avatar = layer.querySelector(".level-up-avatar");

    if (reduced || !target) {
      await new Promise(resolve => window.setTimeout(resolve, 1500));
      layer.classList.add("leaving");
      await new Promise(resolve => window.setTimeout(resolve, 420));
      layer.remove();
      target?.classList.add("level-up-emblem-impact");
      window.setTimeout(() => target?.classList.remove("level-up-emblem-impact"), 900);
      markCelebrated(pending);
      celebrationPlaying = false;
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = Math.min(window.innerHeight * .47, window.innerHeight - 220);
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;
    const dx = endX - startX;
    const dy = endY - startY;

    avatar.style.left = `${startX}px`;
    avatar.style.top = `${startY}px`;
    const animation = avatar.animate([
      {opacity:0, transform:"translate(-50%,-50%) scale(.18) rotate(-80deg)", filter:"brightness(1) blur(3px)"},
      {opacity:1, transform:"translate(-50%,-50%) scale(1.28) rotate(360deg)", filter:"brightness(1.7) blur(0)", offset:.24},
      {opacity:1, transform:"translate(-50%,-54%) scale(1.08) rotate(720deg)", filter:"brightness(1.25)", offset:.52},
      {opacity:1, transform:`translate(calc(-50% + ${dx * .35}px),calc(-54% + ${dy * .2}px)) scale(.92) rotate(850deg)`, filter:"brightness(1.35)", offset:.70},
      {opacity:1, transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.22) rotate(1080deg)`, filter:"brightness(2)", offset:.94},
      {opacity:0, transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.1) rotate(1110deg)`, filter:"brightness(2.4)"}
    ], {duration:2700, easing:"cubic-bezier(.18,.8,.16,1)", fill:"forwards"});

    window.setTimeout(() => layer.classList.add("travelling"), 1450);
    window.setTimeout(() => layer.classList.add("leaving"), 2200);
    await animation.finished.catch(() => {});

    target.classList.remove("level-up-emblem-impact");
    void target.offsetWidth;
    target.classList.add("level-up-emblem-impact");
    window.setTimeout(() => target.classList.remove("level-up-emblem-impact"), 1050);
    window.setTimeout(() => layer.remove(), 380);
    markCelebrated(pending);
    celebrationPlaying = false;
  }

  function scheduleCelebration(delay = 500) {
    window.clearTimeout(celebrationTimer);
    celebrationTimer = window.setTimeout(playLevelCelebration, delay);
  }

  function install() {
    try {
      if (
        typeof state === "undefined" ||
        typeof levelInfo !== "function" ||
        typeof updateGlobalUI !== "function" ||
        typeof switchView !== "function" ||
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

    ensureSystem();
    levelInfo = calculateLevel;

    const baseUpdateGlobalUI = updateGlobalUI;
    updateGlobalUI = function updateGlobalUIWithLevel99() {
      const result = baseUpdateGlobalUI.apply(this, arguments);
      const info = calculateLevel();
      const levelChanged = queueLevelUp(info);
      updateLevelUI(info);
      if ((levelChanged || ensureSystem().pendingLevelUp) && homeIsActive()) scheduleCelebration(700);
      return result;
    };

    const baseSwitchView = switchView;
    switchView = function switchViewWithLevelCelebration(view) {
      const result = baseSwitchView.apply(this, arguments);
      if (view === "home") scheduleCelebration(650);
      return result;
    };

    const version = document.querySelector(".version-label");
    if (version) version.textContent = document.body.dataset.course === "cebuano"
      ? "Bisaya Foundation 0.3 · Level 99 Edition"
      : "Version 5.4.21 · Level 99 Edition";

    updateGlobalUI();
    if (homeIsActive()) scheduleCelebration(900);
  }

  install();
})();