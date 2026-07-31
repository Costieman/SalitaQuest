(() => {
  "use strict";

  const globalRoot = typeof window !== "undefined" ? window : globalThis;
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const INSTALL_FLAG = "__salitaQuestAvatarUnlockCelebrationV2Installed";
  const HISTORY_LIMIT = 100;

  function entryKey(entry = {}) {
    return [entry.avatarId || "", entry.source || "unknown", entry.level || "", entry.weekKey || ""].join("|");
  }
  function nextPending(sourceCollection, model) {
    if (!model?.normaliseCollectionState) return null;
    const collection = model.normaliseCollectionState(sourceCollection);
    const history = new Set((sourceCollection?.avatarUnlockHistory || []).map(entryKey));
    return collection.pendingUnlocks.find(entry => {
      const item = model.get(entry?.avatarId);
      return item && collection.ownedAvatarIds.includes(item.id) &&
        entry.animationSeen !== true && !history.has(entryKey(entry));
    }) || null;
  }
  function consumePending(sourceCollection, pendingEntry, model, now = new Date().toISOString()) {
    const collection = model.normaliseCollectionState(sourceCollection);
    const targetKey = entryKey(pendingEntry);
    let consumed = null;
    collection.pendingUnlocks = collection.pendingUnlocks.filter(entry => {
      if (entry?.animationSeen === true) return false;
      const same = entryKey(entry) === targetKey || (
        entry?.avatarId === pendingEntry?.avatarId &&
        (entry?.source || "unknown") === (pendingEntry?.source || "unknown") &&
        Number(entry?.level || 0) === Number(pendingEntry?.level || 0)
      );
      if (!same) return true;
      if (!consumed) consumed = {...entry, animationSeen:true, animationSeenAt:now};
      return false;
    });
    return Object.freeze({collection, consumed});
  }

  globalRoot.SalitaAvatarUnlockCelebrationLogic = Object.freeze({
    version:2, entryKey, nextPending, consumePending
  });

  if (typeof document === "undefined" || typeof window === "undefined") return;
  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  let model = null;
  let playing = false;
  let finishing = false;
  let retryTimer = 0;
  let layer = null;
  const wait = milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds));

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      return value && Array.isArray(value.profiles) ? value : {schemaVersion:1, profiles:[]};
    } catch { return {schemaVersion:1, profiles:[]}; }
  }
  function writeStore(store) {
    store.schemaVersion = 1;
    store.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_STORE, JSON.stringify(store));
  }
  function activeProfile(store) {
    const id = sessionStorage.getItem(ACTIVE_PROFILE);
    return store.profiles.find(profile => profile.id === id) || null;
  }
  function reducedMotion() {
    try { if (typeof state !== "undefined" && state.settings?.reducedMotion) return true; } catch {}
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  }
  function homeIsReady() {
    const home = document.getElementById("homeView");
    return !home || home.classList.contains("active") || document.body.dataset.currentView === "home";
  }
  function celebrationBlocked() {
    if (document.hidden || !homeIsReady()) return true;
    return Boolean(document.querySelector(
      ".level-up-celebration,.daily-key-celebration,.daily-key-award," +
      ".weekly-avatar-shard-modal:not([hidden]),.achievement-share-modal:not([hidden])," +
      ".sq-avatar-unlock-layer"
    ));
  }
  function sourceCopy(entry) {
    if (entry?.source === "level_milestone") {
      return {eyebrow:`LEVEL ${entry.level || ""} REWARD`, text:"A milestone avatar has joined your account-wide collection."};
    }
    if (entry?.source === "weekly_reward" || entry?.source === "weekly_keys") {
      return {eyebrow:"WEEKLY REWARD COMPLETE", text:"Your chosen shard target is complete and this avatar is now unlocked."};
    }
    return {eyebrow:"NEW AVATAR UNLOCKED", text:"This avatar has joined your account-wide collection."};
  }
  function playChime() {
    try {
      if (typeof state !== "undefined" && state.settings?.celebrationSounds === false) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const start = context.currentTime + .03;
      [659.25,783.99,987.77,1318.51].forEach((frequency,index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 3 ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(frequency,start + index * .10);
        gain.gain.setValueAtTime(.0001,start + index * .10);
        gain.gain.exponentialRampToValueAtTime(index === 3 ? .13 : .08,start + index * .10 + .025);
        gain.gain.exponentialRampToValueAtTime(.0001,start + index * .10 + .42);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.start(start + index * .10); oscillator.stop(start + index * .10 + .46);
      });
      window.setTimeout(() => context.close().catch(() => {}),1200);
    } catch {}
  }
  function buildLayer(item, entry) {
    const copy = sourceCopy(entry);
    const node = document.createElement("div");
    node.className = "sq-avatar-unlock-layer";
    node.setAttribute("role","dialog");
    node.setAttribute("aria-modal","true");
    node.setAttribute("aria-labelledby","sqAvatarUnlockTitle");
    node.innerHTML = `
      <div class="sq-avatar-unlock-rays" aria-hidden="true"></div>
      <div class="sq-avatar-unlock-sparks" aria-hidden="true">${Array.from({length:12},(_,index)=>`<i style="--i:${index}"></i>`).join("")}</div>
      <section class="sq-avatar-unlock-card">
        <p class="sq-avatar-unlock-eyebrow">${copy.eyebrow}</p>
        <h2 id="sqAvatarUnlockTitle">${item.name}</h2>
        <div class="sq-avatar-unlock-art"><img src="${item.image}" alt="${item.name}"></div>
        <p>${copy.text}</p>
        <span class="sq-avatar-unlock-meta">${item.starter ? "Starter · Common reward" : `${item.rarity} · ${item.category}`}</span>
        <div class="sq-avatar-unlock-actions">
          <button class="sq-avatar-unlock-add" type="button" data-unlock-add>Add to collection</button>
          <button class="sq-avatar-unlock-skip" type="button" data-unlock-skip>Skip animation</button>
        </div>
      </section>`;
    document.body.appendChild(node);
    return node;
  }

  function saveCompletion(pendingEntry, item) {
    const store = readStore();
    const profile = activeProfile(store);
    if (!profile) return false;
    const result = consumePending(profile.avatarCollection, pendingEntry, model);
    profile.avatarCollection = result.collection;
    profile.avatarUnlockHistory = Array.isArray(profile.avatarUnlockHistory) ? profile.avatarUnlockHistory : [];
    const key = entryKey(pendingEntry);
    if (!profile.avatarUnlockHistory.some(entry => entryKey(entry) === key)) {
      profile.avatarUnlockHistory.push({
        avatarId:item.id, source:pendingEntry.source || "unknown",
        level:pendingEntry.level || null, weekKey:pendingEntry.weekKey || null,
        unlockedAt:pendingEntry.unlockedAt || null, animationSeenAt:new Date().toISOString()
      });
      profile.avatarUnlockHistory = profile.avatarUnlockHistory.slice(-HISTORY_LIMIT);
    }
    writeStore(store);
    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {
      detail:{source:"unlock_animation", avatarId:item.id}
    }));
    return true;
  }
  async function openCollectionTarget(item) {
    const api = window.SalitaAvatarCollectionScreen;
    if (api?.open) api.open();
    else document.dispatchEvent(new CustomEvent("salita:open-avatar-collection"));
    await wait(100);
    let card = document.querySelector(`[data-avatar-card="${CSS.escape(item.id)}"]`);
    if (!card) { await wait(300); card = document.querySelector(`[data-avatar-card="${CSS.escape(item.id)}"]`); }
    if (card) {
      card.scrollIntoView({block:"center",inline:"center",behavior:reducedMotion() ? "auto" : "smooth"});
      await wait(reducedMotion() ? 40 : 360);
    }
    return card;
  }
  async function flyToCollection(item) {
    const art = layer?.querySelector(".sq-avatar-unlock-art img");
    const startRect = art?.getBoundingClientRect();
    const card = await openCollectionTarget(item);
    const target = card?.querySelector(".sq-avatar-card-art") || card;
    const targetRect = target?.getBoundingClientRect();

    if (reducedMotion() || !startRect || !targetRect || typeof Element.prototype.animate !== "function") {
      layer?.remove(); layer = null;
      card?.classList.add("sq-avatar-unlock-arrived");
      window.setTimeout(() => card?.classList.remove("sq-avatar-unlock-arrived"),1400);
      return;
    }

    const flyer = document.createElement("img");
    flyer.className = "sq-avatar-unlock-flyer";
    flyer.src = item.image; flyer.alt = "";
    Object.assign(flyer.style,{left:`${startRect.left}px`,top:`${startRect.top}px`,width:`${startRect.width}px`,height:`${startRect.height}px`});
    document.body.appendChild(flyer);
    layer?.classList.add("is-travelling");
    const dx = targetRect.left + targetRect.width/2 - (startRect.left + startRect.width/2);
    const dy = targetRect.top + targetRect.height/2 - (startRect.top + startRect.height/2);
    const scale = Math.max(.08,Math.min(1,targetRect.width/startRect.width));
    const animation = flyer.animate([
      {transform:"translate(0,0) scale(1) rotate(0deg)",opacity:1,filter:"brightness(1.4) drop-shadow(0 16px 20px rgba(0,0,0,.35))"},
      {transform:`translate(${dx*.28}px,${dy*.10-70}px) scale(.92) rotate(180deg)`,opacity:1,offset:.35},
      {transform:`translate(${dx*.70}px,${dy*.58-42}px) scale(${Math.max(scale*1.35,.28)}) rotate(430deg)`,opacity:1,offset:.72},
      {transform:`translate(${dx}px,${dy}px) scale(${scale}) rotate(720deg)`,opacity:.15,filter:"brightness(2.1) drop-shadow(0 0 24px rgba(247,201,72,.9))"}
    ],{duration:1300,easing:"cubic-bezier(.16,.82,.18,1)",fill:"forwards"});
    await animation.finished.catch(() => {});
    flyer.remove(); layer?.remove(); layer = null;
    card?.classList.add("sq-avatar-unlock-arrived");
    window.setTimeout(() => card?.classList.remove("sq-avatar-unlock-arrived"),1400);
  }
  function skipAnimation() { layer?.remove(); layer = null; }

  async function playNext() {
    window.clearTimeout(retryTimer);
    if (playing || finishing || celebrationBlocked() || !model) {
      retryTimer = window.setTimeout(playNext,900);
      return;
    }
    const store = readStore();
    const profile = activeProfile(store);
    if (!profile) return;
    const pendingEntry = nextPending(profile.avatarCollection,model);
    if (!pendingEntry) return;
    const item = model.get(pendingEntry.avatarId);
    if (!item) return;

    playing = true;
    layer = buildLayer(item,pendingEntry);
    playChime();
    document.dispatchEvent(new CustomEvent("salita:avatar-unlock-animation-started", {
      detail:{avatarId:item.id,source:pendingEntry.source || "unknown"}
    }));

    const finish = async useFlight => {
      if (!playing || finishing) return;
      finishing = true;
      saveCompletion(pendingEntry,item);
      try {
        if (useFlight) await flyToCollection(item);
        else skipAnimation();
      } finally {
        playing = false;
        finishing = false;
        document.dispatchEvent(new CustomEvent("salita:avatar-unlock-animation-finished", {
          detail:{avatarId:item.id,source:pendingEntry.source || "unknown"}
        }));
        retryTimer = window.setTimeout(playNext,650);
      }
    };

    layer.querySelector("[data-unlock-add]")?.addEventListener("click",()=>finish(true),{once:true});
    layer.querySelector("[data-unlock-skip]")?.addEventListener("click",()=>finish(false),{once:true});
    document.addEventListener("keydown",event => {
      if (event.key === "Escape" && layer) finish(false);
    },{once:true});
    layer.querySelector("[data-unlock-add]")?.focus();
  }
  function schedule(delay=500) {
    window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(playNext,delay);
  }
  function install() {
    model = window.SalitaAvatarModel || null;
    if (!model) { window.setTimeout(install,100); return; }
    schedule(1500);
    document.addEventListener("salita:avatar-collection-changed",()=>schedule(450));
    document.addEventListener("salita:avatar-milestones-awarded",()=>schedule(900));
    document.addEventListener("visibilitychange",()=>{ if (!document.hidden) schedule(300); });
    document.addEventListener("click",()=>{ if (!playing && !finishing) schedule(700); },{passive:true});
    window.SalitaAvatarUnlockCelebration = Object.freeze({version:2,playNext,schedule});
  }
  install();
})();