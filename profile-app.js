(() => {
  "use strict";

  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const ACTIVE_COURSE = "salitaQuestActiveCourse";
  const BASE_PROGRESS = "salitaQuestProgress";
  const BASE_OWNER = "salitaQuestBaseProgressOwner";
  const PROFILE_PROGRESS_PREFIX = "salitaQuestProgress.profile.";
  const COURSE = document.body.dataset.course || sessionStorage.getItem(ACTIVE_COURSE) || "tagalog";

  function readProfiles() {
    try {
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return store && Array.isArray(store.profiles) ? store.profiles : [];
    } catch {
      return [];
    }
  }

  const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
  const profile = readProfiles().find(item => item.id === activeId);

  if (!activeId || !profile) {
    window.location.replace("./");
    return;
  }

  sessionStorage.setItem(ACTIVE_COURSE, COURSE);
  const profileProgressKey = `${PROFILE_PROGRESS_PREFIX}${activeId}.${COURSE}`;
  const legacyTagalogKey = `${PROFILE_PROGRESS_PREFIX}${activeId}`;
  let lastProgress = localStorage.getItem(BASE_PROGRESS);

  function syncProgress() {
    const progress = localStorage.getItem(BASE_PROGRESS);
    if (progress === lastProgress) return;
    if (progress) {
      localStorage.setItem(profileProgressKey, progress);
      if (COURSE === "tagalog") localStorage.setItem(legacyTagalogKey, progress);
    } else {
      localStorage.removeItem(profileProgressKey);
    }
    localStorage.setItem(BASE_OWNER, `${activeId}:${COURSE}`);
    lastProgress = progress;
  }

  function finishSession() {
    syncProgress();
    sessionStorage.removeItem(ACTIVE_PROFILE);
    sessionStorage.removeItem(ACTIVE_COURSE);
    localStorage.removeItem(BASE_PROGRESS);
    localStorage.removeItem(BASE_OWNER);
    window.location.replace("./");
  }

  function switchCourse() {
    syncProgress();
    const nextCourse = COURSE === "cebuano" ? "tagalog" : "cebuano";
    const nextKey = `${PROFILE_PROGRESS_PREFIX}${activeId}.${nextCourse}`;
    const nextProgress = localStorage.getItem(nextKey) || (nextCourse === "tagalog" ? localStorage.getItem(legacyTagalogKey) : null);
    if (nextProgress) localStorage.setItem(BASE_PROGRESS, nextProgress);
    else localStorage.removeItem(BASE_PROGRESS);
    localStorage.setItem(BASE_OWNER, `${activeId}:${nextCourse}`);
    sessionStorage.setItem(ACTIVE_COURSE, nextCourse);
    window.location.replace(nextCourse === "cebuano" ? `bisaya.html?profile=${encodeURIComponent(activeId)}` : `app.html?profile=${encodeURIComponent(activeId)}`);
  }

  function avatarPath() {
    const valid = new Set(["tarsier", "eagle", "tamaraw", "peacock", "orchid", "jade", "rafflesia", "anahaw"]);
    const avatarId = valid.has(profile.avatarId) ? profile.avatarId : "tarsier";
    return `avatars/${avatarId}.png`;
  }

  function installProfileControl() {
    const style = document.createElement("style");
    style.textContent = `
      .sq-profile-control{position:fixed;right:18px;bottom:20px;z-index:10000;font-family:Inter,"Segoe UI",system-ui,sans-serif}
      .sq-profile-button{width:50px;height:50px;border:2px solid rgba(255,255,255,.92);border-radius:16px;padding:3px;background:#0b6f67;box-shadow:0 10px 30px rgba(8,63,59,.28);cursor:pointer;display:grid;place-items:center}
      .sq-profile-button img{width:40px;height:40px;object-fit:contain;image-rendering:pixelated;border-radius:11px;background:#e6f4ef}
      .sq-profile-menu{position:absolute;right:0;bottom:60px;width:230px;padding:10px;background:#fff;border:1px solid #dbe8e4;border-radius:16px;box-shadow:0 18px 45px rgba(20,62,57,.22)}
      .sq-profile-menu[hidden]{display:none!important}
      .sq-profile-identity{display:flex;align-items:center;gap:10px;padding:7px 7px 11px;border-bottom:1px solid #e5eeeb;margin-bottom:6px}
      .sq-profile-identity img{width:40px;height:40px;object-fit:contain;image-rendering:pixelated;border-radius:11px;background:#edf5f1}
      .sq-profile-identity small,.sq-profile-identity strong,.sq-profile-identity em{display:block}.sq-profile-identity small{font-size:9px;letter-spacing:.12em;color:#607773;font-weight:800}.sq-profile-identity strong{font-size:14px;color:#173a37;max-width:145px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sq-profile-identity em{font-size:11px;color:#0b6f67;font-style:normal;font-weight:800;margin-top:2px}
      .sq-profile-action{width:100%;border:0;border-radius:10px;padding:10px 11px;text-align:left;background:transparent;color:#173a37;font-weight:750;cursor:pointer}.sq-profile-action:hover{background:#edf7f3}.sq-profile-action.course{color:#0b6f67}.sq-profile-action.danger{color:#9b3434}
      @media(max-width:760px){.sq-profile-control{right:12px;bottom:calc(76px + env(safe-area-inset-bottom))}.sq-profile-button{width:46px;height:46px;border-radius:14px}.sq-profile-button img{width:36px;height:36px}}
    `;
    document.head.appendChild(style);

    const courseName = COURSE === "cebuano" ? "Bisaya" : "Tagalog";
    const nextCourseName = COURSE === "cebuano" ? "Tagalog" : "Bisaya";
    const control = document.createElement("div");
    control.className = "sq-profile-control";
    control.innerHTML = `
      <button class="sq-profile-button" type="button" aria-label="Open learner profile menu" aria-expanded="false">
        <img src="${avatarPath()}" alt="">
      </button>
      <div class="sq-profile-menu" hidden>
        <div class="sq-profile-identity">
          <img src="${avatarPath()}" alt="">
          <div><small>LEARNING AS</small><strong></strong><em>${courseName} course</em></div>
        </div>
        <button class="sq-profile-action course" type="button" data-course>Switch to ${nextCourseName}</button>
        <button class="sq-profile-action" type="button" data-change>Change learner</button>
        <button class="sq-profile-action danger" type="button" data-logout>Log out</button>
      </div>`;

    control.querySelector(".sq-profile-identity strong").textContent = profile.name;
    const button = control.querySelector(".sq-profile-button");
    const menu = control.querySelector(".sq-profile-menu");

    button.addEventListener("click", event => {
      event.stopPropagation();
      const opening = menu.hidden;
      menu.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
    });
    control.querySelector("[data-course]").addEventListener("click", switchCourse);
    control.querySelector("[data-change]").addEventListener("click", finishSession);
    control.querySelector("[data-logout]").addEventListener("click", finishSession);
    document.addEventListener("click", event => {
      if (!control.contains(event.target)) {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
      }
    });

    document.body.appendChild(control);

    const selectedAvatar = document.querySelector(".player-avatar");
    if (selectedAvatar) {
      selectedAvatar.innerHTML = `<img src="${avatarPath()}" alt="">`;
      selectedAvatar.style.overflow = "hidden";
      const avatarStyle = document.createElement("style");
      avatarStyle.textContent = ".player-avatar img{width:100%;height:100%;object-fit:contain;image-rendering:pixelated}";
      document.head.appendChild(avatarStyle);
    }

    const version = document.querySelector(".version-label");
    if (version) version.textContent = COURSE === "cebuano" ? "Bisaya Foundation 0.1" : "Version 5.4 Full-Screen Profiles";
  }

  const timer = window.setInterval(syncProgress, 700);
  window.addEventListener("beforeunload", syncProgress);
  window.addEventListener("pagehide", syncProgress);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) syncProgress();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installProfileControl, { once: true });
  } else {
    installProfileControl();
  }

  window.addEventListener("unload", () => window.clearInterval(timer));
})();
