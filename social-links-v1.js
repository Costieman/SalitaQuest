(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestSocialLinksV1Installed";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const PLATFORMS = [
    ["facebook","Facebook","https://facebook.com/"],
    ["instagram","Instagram","https://instagram.com/"],
    ["tiktok","TikTok","https://tiktok.com/@"],
    ["x","X","https://x.com/"],
    ["youtube","YouTube","https://youtube.com/@"],
    ["linkedin","LinkedIn","https://linkedin.com/in/"]
  ];

  function retry() { window.setTimeout(install,100); }
  function escapeHTML(value) { return String(value ?? "").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return value && Array.isArray(value.profiles) ? value : {schemaVersion:1,profiles:[]};
    } catch { return {schemaVersion:1,profiles:[]}; }
  }

  function writeStore(store) {
    store.schemaVersion = 1;
    store.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_STORE,JSON.stringify(store));
  }

  function activeProfile(store=readStore()) {
    const id = sessionStorage.getItem(ACTIVE_PROFILE);
    return store.profiles.find(profile=>profile.id===id) || null;
  }

  function normalise(value,base) {
    const text = String(value || "").trim();
    if (!text) return "";
    if (/^https?:\/\//i.test(text)) return text;
    return `${base}${text.replace(/^@/,"").replace(/^\/+/,"")}`;
  }

  function handleFrom(url) {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      const part = parsed.pathname.split("/").filter(Boolean).pop() || parsed.hostname;
      return part.startsWith("@") ? part : `@${part}`;
    } catch { return url; }
  }

  function ensureCard() {
    const settingsView = document.getElementById("settingsView");
    if (!settingsView || document.getElementById("socialLinksCard")) return;
    const card = document.createElement("article");
    card.id = "socialLinksCard";
    card.className = "panel social-links-card";
    card.innerHTML = `<div class="social-links-heading"><div><p class="eyebrow">OPTIONAL PROFILE LINKS</p><h3>Link your socials</h3><p>Add profile links or handles for sharing badges. These stay in this learner profile on this device and are never used to post automatically.</p></div><span>🔗</span></div><form id="socialLinksForm"><div id="socialLinksGrid" class="social-links-grid"></div><div class="social-links-footer"><label><span>Primary handle on shared captions</span><select id="socialPrimaryPlatform"><option value="">Do not include a handle</option>${PLATFORMS.map(([id,label])=>`<option value="${id}">${label}</option>`).join("")}</select></label><button class="primary-btn" type="submit">Save social links</button></div></form><p id="socialLinksStatus" class="social-links-status"></p>`;
    settingsView.appendChild(card);
    card.querySelector("form").addEventListener("submit",saveLinks);
  }

  function render() {
    ensureCard();
    const store = readStore();
    const profile = activeProfile(store);
    const grid = document.getElementById("socialLinksGrid");
    const primary = document.getElementById("socialPrimaryPlatform");
    if (!grid || !profile) return;
    profile.socialLinks = profile.socialLinks && typeof profile.socialLinks === "object" ? profile.socialLinks : {};
    grid.innerHTML = PLATFORMS.map(([id,label,base])=>`<label class="social-link-field"><span>${label}</span><input type="text" inputmode="url" autocomplete="url" data-social-platform="${id}" data-social-base="${base}" value="${escapeHTML(profile.socialLinks[id] || "")}" placeholder="${escapeHTML(base)}your-profile"></label>`).join("");
    if (primary) primary.value = profile.primarySocial || "";
  }

  function saveLinks(event) {
    event.preventDefault();
    const store = readStore();
    const profile = activeProfile(store);
    if (!profile) return;
    profile.socialLinks = {};
    document.querySelectorAll("[data-social-platform]").forEach(input=>{
      const value = normalise(input.value,input.dataset.socialBase);
      if (value) profile.socialLinks[input.dataset.socialPlatform] = value;
    });
    const requested = document.getElementById("socialPrimaryPlatform")?.value || "";
    profile.primarySocial = requested && profile.socialLinks[requested] ? requested : "";
    profile.socialUpdatedAt = new Date().toISOString();
    writeStore(store);
    const status = document.getElementById("socialLinksStatus");
    if (status) status.textContent = "Social links saved to this learner profile.";
    try { if (typeof toast === "function") toast("Social links saved."); } catch {}
    window.dispatchEvent(new CustomEvent("salita-social-links-updated",{detail:{profileId:profile.id}}));
  }

  function expose() {
    window.SalitaQuestSocialProfile = {
      get() {
        const profile = activeProfile();
        if (!profile) return null;
        const platform = profile.primarySocial || "";
        const url = platform ? profile.socialLinks?.[platform] || "" : "";
        return {name:profile.name || "",platform,url,handle:handleFrom(url),links:{...(profile.socialLinks || {})}};
      }
    };
  }

  function install() {
    if (window[INSTALL_FLAG]) return;
    const settings = document.getElementById("settingsView");
    if (!settings) { retry(); return; }
    window[INSTALL_FLAG] = true;
    ensureCard();
    render();
    expose();
    const baseSwitchView = typeof switchView === "function" ? switchView : null;
    if (baseSwitchView) {
      switchView = function switchViewWithSocialLinks(view) {
        const result = baseSwitchView.apply(this,arguments);
        if (view === "settings") window.setTimeout(render,20);
        return result;
      };
    }
  }

  install();
})();
