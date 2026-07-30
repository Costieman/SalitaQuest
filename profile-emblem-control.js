(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestProfileEmblemControlInstalled";

  function retry() {
    window.setTimeout(install, 90);
  }

  function install() {
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

    makeTrigger(desktopMark, false);
    makeTrigger(mobileMark, true);

    const observer = new MutationObserver(syncExpanded);
    observer.observe(menu, {attributes:true, attributeFilter:["hidden"]});
    window.addEventListener("resize", () => {
      if (menu.hidden) return;
      const visibleTrigger = window.matchMedia("(max-width: 1000px)").matches ? mobileMark : desktopMark;
      positionMenu(visibleTrigger);
    }, {passive:true});

    const version = document.querySelector(".version-label");
    if (version) {
      version.textContent = document.body.dataset.course === "cebuano"
        ? "Bisaya Foundation 0.3 · Key Run Edition"
        : "Version 5.4.20 · Key Run Edition";
    }
  }

  install();
})();