(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestDesktopNavigationRefinementInstalled";
  const STORAGE_KEY = "salitaQuestDesktopNavigationCollapsed";
  const DESKTOP_QUERY = "(min-width: 1001px)";

  function retry() {
    window.setTimeout(install, 80);
  }

  function badgeIcon() {
    return `<svg class="pictogram" viewBox="0 0 64 64" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 8h20l5 13-15 11-15-11Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="32" cy="39" r="14" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="m32 31 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" fill="currentColor"/>
    </svg>`;
  }

  function install() {
    try {
      if (
        typeof switchView !== "function" ||
        typeof renderBadges !== "function" ||
        typeof state === "undefined"
      ) {
        retry();
        return;
      }
    } catch {
      retry();
      return;
    }

    const sidebar = document.querySelector(".sidebar");
    const nav = sidebar?.querySelector(".nav-list");
    const main = document.querySelector(".main-area");
    const progressView = document.getElementById("progressView");
    const settingsView = document.getElementById("settingsView");
    if (!sidebar || !nav || !main || !progressView || !settingsView) {
      retry();
      return;
    }
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    function navLabel(button) {
      return button.querySelector(":scope > span:last-child")?.textContent?.trim() || button.getAttribute("aria-label") || "Navigation";
    }

    nav.querySelectorAll(".nav-item").forEach(button => {
      const label = navLabel(button);
      button.title = label;
      button.setAttribute("aria-label", label);
    });

    const progressNav = nav.querySelector('[data-view="progress"]');
    const badgesButton = document.createElement("button");
    badgesButton.className = "nav-item";
    badgesButton.type = "button";
    badgesButton.dataset.view = "badges";
    badgesButton.title = "Badges";
    badgesButton.setAttribute("aria-label", "Badges");
    badgesButton.innerHTML = `<span class="nav-art desktop-badge-nav-art">${badgeIcon()}</span><span>Badges</span>`;
    if (progressNav?.nextSibling) nav.insertBefore(badgesButton, progressNav.nextSibling);
    else nav.appendChild(badgesButton);

    const badgesView = document.createElement("section");
    badgesView.id = "badgesView";
    badgesView.className = "view badges-view";
    badgesView.innerHTML = `
      <section class="badges-page-hero">
        <div>
          <p class="eyebrow">Achievement collection</p>
          <h2>Your Badges</h2>
          <p>Badges recognise meaningful language milestones, sustained practice, and successful conversation challenges.</p>
        </div>
        <div class="badges-page-emblem" aria-hidden="true">${badgeIcon()}</div>
      </section>
      <div class="badges-page-summary"></div>
      <div class="badges-page-shelf"></div>`;
    main.insertBefore(badgesView, settingsView);

    const achievementSummary = progressView.querySelector(".progress-achievement-card");
    const achievementPanel = document.querySelector("#homeView > .achievement-panel, .achievement-panel");
    if (achievementSummary) badgesView.querySelector(".badges-page-summary").appendChild(achievementSummary);
    if (achievementPanel) badgesView.querySelector(".badges-page-shelf").appendChild(achievementPanel);

    const mobileSheetGrid = document.querySelector(".mobile-more-grid");
    let mobileBadgesButton = null;
    if (mobileSheetGrid) {
      mobileBadgesButton = document.createElement("button");
      mobileBadgesButton.type = "button";
      mobileBadgesButton.dataset.view = "badges";
      mobileBadgesButton.innerHTML = `<span>🏅</span><strong>Badges</strong><small>Achievement collection</small>`;
      mobileSheetGrid.appendChild(mobileBadgesButton);
    }

    function openBadges() {
      if (typeof closeMobileMenu === "function") closeMobileMenu();
      switchView("badges");
      renderBadges();
    }

    badgesButton.addEventListener("click", openBadges);
    mobileBadgesButton?.addEventListener("click", openBadges);

    const collapseButton = document.createElement("button");
    collapseButton.className = "desktop-nav-collapse";
    collapseButton.type = "button";
    collapseButton.innerHTML = '<span aria-hidden="true">‹</span><span class="sr-only">Collapse navigation</span>';
    sidebar.appendChild(collapseButton);

    function collapsedPreference() {
      try { return localStorage.getItem(STORAGE_KEY) === "1"; }
      catch { return false; }
    }

    function applyCollapsed(collapsed, persist = true) {
      const desktop = window.matchMedia(DESKTOP_QUERY).matches;
      document.body.classList.toggle("desktop-nav-collapsed", desktop && collapsed);
      sidebar.dataset.collapsed = String(desktop && collapsed);
      collapseButton.setAttribute("aria-expanded", String(!(desktop && collapsed)));
      collapseButton.setAttribute("aria-label", desktop && collapsed ? "Expand navigation" : "Collapse navigation");
      collapseButton.title = desktop && collapsed ? "Expand navigation" : "Collapse navigation";
      collapseButton.querySelector("span:first-child").textContent = desktop && collapsed ? "›" : "‹";
      const hiddenText = collapseButton.querySelector(".sr-only");
      if (hiddenText) hiddenText.textContent = desktop && collapsed ? "Expand navigation" : "Collapse navigation";
      if (persist) {
        try { localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0"); } catch {}
      }
    }

    collapseButton.addEventListener("click", () => {
      applyCollapsed(!document.body.classList.contains("desktop-nav-collapsed"));
    });

    const media = window.matchMedia(DESKTOP_QUERY);
    media.addEventListener?.("change", () => applyCollapsed(collapsedPreference(), false));
    applyCollapsed(collapsedPreference(), false);

    const baseSwitchView = switchView;
    switchView = function switchViewWithBadges(view) {
      const result = baseSwitchView.apply(this, arguments);
      if (view === "badges") {
        renderBadges();
        document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === "badges"));
        const title = document.getElementById("viewTitle");
        const mobileTitle = document.getElementById("mobileViewTitle");
        if (title) title.textContent = "Your Badges";
        if (mobileTitle) mobileTitle.textContent = "Badges";
      }
      return result;
    };

    renderBadges();
  }

  install();
})();