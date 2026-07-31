(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestProfileEmblemControlInstalled";

  function loadAvatarCollectionAssets() {
    if (!document.querySelector('link[data-avatar-collection-screen]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./avatar-collection-screen-v1.css?v=5.5.0";
      link.dataset.avatarCollectionScreen = "true";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-avatar-collection-screen]')) {
      const script = document.createElement("script");
      script.src = "./avatar-collection-screen-v1.js?v=5.5.0";
      script.dataset.avatarCollectionScreen = "true";
      script.onerror = () => console.warn("Avatar collection screen could not be loaded.");
      document.body.appendChild(script);
    }
  }

  function loadWeeklyAvatarRewardAssets() {
    if (!document.querySelector('link[data-weekly-avatar-shards]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./weekly-avatar-shard-rewards-v1.css?v=5.5.0";
      link.dataset.weeklyAvatarShards = "true";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-weekly-avatar-shards]')) {
      const script = document.createElement("script");
      script.src = "./weekly-avatar-shard-rewards-v1.js?v=5.5.0";
      script.dataset.weeklyAvatarShards = "true";
      script.onerror = () => console.warn("Weekly avatar shard rewards could not be loaded.");
      document.body.appendChild(script);
    }
  }

  function loadLevelAvatarRewardAssets() {
    if (document.querySelector('script[data-level-avatar-rewards]')) return;
    const script = document.createElement("script");
    script.src = "./level-avatar-rewards-v1.js?v=5.5.0";
    script.dataset.levelAvatarRewards = "true";
    script.onerror = () => console.warn("Level milestone avatar rewards could not be loaded.");
    document.body.appendChild(script);
  }

  function loadAvatarUnlockCelebrationAssets() {
    if (!document.querySelector('link[data-avatar-unlock-celebration]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./avatar-unlock-celebration-v1.css?v=5.5.0";
      link.dataset.avatarUnlockCelebration = "true";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-avatar-unlock-celebration]')) {
      const script = document.createElement("script");
      script.src = "./avatar-unlock-celebration-v1.js?v=5.5.0";
      script.dataset.avatarUnlockCelebration = "true";
      script.onerror = () => console.warn("Avatar unlock celebrations could not be loaded.");
      document.body.appendChild(script);
    }
  }

  function loadAchievementAvatarBridgeAssets() {
    if (document.querySelector('script[data-achievement-avatar-bridge]')) return;
    const script = document.createElement("script");
    script.src = "./achievement-sharing-avatar-bridge-v1.js?v=5.5.0";
    script.dataset.achievementAvatarBridge = "true";
    script.onerror = () => console.warn("Avatar-aware achievement sharing could not be loaded.");
    document.body.appendChild(script);
  }

  function loadAvatarProgressionAssets() {
    loadAvatarCollectionAssets();
    loadWeeklyAvatarRewardAssets();
    loadLevelAvatarRewardAssets();
    loadAvatarUnlockCelebrationAssets();
    loadAchievementAvatarBridgeAssets();
  }

  function retry() {
    window.setTimeout(install, 90);
  }

  function install() {
    loadAvatarProgressionAssets();
    const host = document.querySelector(".sq-profile-control");
    const originalButton = host?.querySelector(".sq-profile-button");
    const menu = host?.querySelector(".sq-profile-menu");
    const desktopMark = document.querySelector(".sidebar .brand-mark");
    const mobileMark = document.querySelector(".mobile-brand-mark");
    if (!host || !originalButton || !menu || !desktopMark || !mobileMark) {
      retry();
      return;
    }
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    const imageSource = originalButton.querySelector("img")?.src || "avatars/tarsier.png";
    const triggers = [];

    function makeTrigger(anchor, mobile = false) {
      anchor.innerHTML = `<img src="${imageSource}" alt="" aria-hidden="true">`;
      anchor.classList.add("sq-profile-emblem-trigger");
      anchor.dataset.profileEmblem = mobile ? "mobile" : "desktop";
      anchor.setAttribute("role", "button");
      anchor.setAttribute("tabindex", "0");
      anchor.setAttribute("aria-label", "Open learner menu");
      anchor.setAttribute("aria-expanded", "false");
      triggers.push(anchor);

      const open = event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        const opening = menu.hidden;
        if (opening) positionMenu(anchor);
        originalButton.click();
        syncExpanded();
      };
      anchor.addEventListener("click", open, true);
      anchor.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") open(event);
      }, true);
    }

    function positionMenu(trigger) {
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(260, window.innerWidth - 24);
      let left = rect.left;
      if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
      left = Math.max(12, left);
      menu.style.left = `${left}px`;
      menu.style.top = `${Math.min(window.innerHeight - 20, rect.bottom + 10)}px`;
      menu.style.right = "auto";
      menu.style.bottom = "auto";
      menu.style.width = `${width}px`;
    }

    function syncExpanded() {
      triggers.forEach(trigger => trigger.setAttribute("aria-expanded", String(!menu.hidden)));
    }

    function syncAvatarImage(source) {
      if (!source) return;
      triggers.forEach(trigger => {
        const image = trigger.querySelector("img");
        if (image) image.src = source;
      });
    }

    makeTrigger(desktopMark, false);
    makeTrigger(mobileMark, true);

    const observer = new MutationObserver(syncExpanded);
    observer.observe(menu, {attributes:true, attributeFilter:["hidden"]});
    window.addEventListener("resize", () => {
      if (menu.hidden) return;
      const visibleTrigger = window.matchMedia("(max-width: 1000px)").matches ? mobileMark : desktopMark;
      positionMenu(visibleTrigger);
    }, {passive:true});
    document.addEventListener("salita:avatar-equipped", event => {
      syncAvatarImage(event.detail?.avatar?.image);
    });

    const version = document.querySelector(".version-label");
    if (version) {
      version.textContent = document.body.dataset.course === "cebuano"
        ? "Bisaya Foundation 0.3 · Avatar Collection"
        : "Version 5.5.0 · Avatar Collection";
    }
  }

  loadAvatarProgressionAssets();
  install();
})();