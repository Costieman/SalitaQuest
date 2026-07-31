(() => {
  "use strict";

  if (window.__salitaAvatarArtworkRegistryV555Installed) return;
  window.__salitaAvatarArtworkRegistryV555Installed = true;

  const RELEASE = "5.5.5";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const RAW_ROOT = "https://raw.githubusercontent.com/Costieman/SalitaQuest/main/";
  const LOAD_TIMEOUT_MS = 10000;

  const PATH_BY_ID = Object.freeze({
    eagle:"avatars/eagle.png",
    tamaraw:"avatars/tamaraw.png",
    anahaw:"avatars/anahaw.png",
    peacock:"avatars/peacock.png",
    orchid:"avatars/orchid.png",
    jade:"avatars/jade.png",
    rafflesia:"avatars/rafflesia.png",
    tarsier:"avatars/tarsier.png",
    narra:"avatars/narra.png",
    nipa_palm:"avatars/nipa.png",
    buri_palm:"avatars/buri.png",
    almaciga:"avatars/almaciga.png",
    pandan:"avatars/pandan.png",
    bakawan_mangrove:"avatars/bakawan.png",
    kawayang_tinik:"avatars/kawayang-tinik.png",
    pili:"avatars/pili.png",
    katmon:"avatars/katmon.png",
    medinilla:"avatars/medinilla.png",
    philippine_teak:"avatars/philippine-teak.png",
    banaba:"avatars/banaba.png",
    mangkono:"avatars/mangkono.png",
    attenborough_pitcher:"avatars/attenborough-pitcher.png",
    slipper_orchid:"avatars/slipper-orchid.png",
    philippine_hoya:"avatars/philippine-hoya.png",
    parol:"avatars/parol.svg",
    vinta:"avatars/vinta.svg",
    kulintang:"avatars/kulintang.svg",
    bangka:"avatars/bangka.svg",
    jeepney:"avatars/jeepney.svg",
    bahay_kubo:"avatars/bahay-kubo.svg",
    sarimanok:"avatars/sarimanok.svg",
    golden_salita_crest:"avatars/golden-salita-crest.svg",
    philippine_pangolin:"avatars/philippine-pangolin.webp",
    visayan_spotted_deer:"avatars/visayan-spotted-deer.webp",
    visayan_warty_pig:"avatars/visayan-warty-pig.webp",
    philippine_crocodile:"avatars/philippine-crocodile.webp",
    philippine_forest_turtle:"avatars/philippine-forest-turtle.webp",
    philippine_sailfin_lizard:"avatars/philippine-sailfin-lizard.webp",
    golden_crowned_flying_fox:"avatars/golden-crowned-flying-fox.webp",
    philippine_colugo:"avatars/philippine-colugo.webp",
    philippine_cockatoo:"avatars/philippine-cockatoo.svg",
    rufous_hornbill:"avatars/rufous-hornbill.svg",
    luzon_bleeding_heart_dove:"avatars/luzon-bleeding-heart-dove.svg",
    cebu_flowerpecker:"avatars/cebu-flowerpecker.svg",
    philippine_eagle_owl:"avatars/philippine-eagle-owl.svg",
    whale_shark_butanding:"avatars/whale-shark-butanding.svg",
    dugong:"avatars/dugong.svg",
    hawksbill_sea_turtle:"avatars/hawksbill-sea-turtle.svg"
  });

  const SPRITE_PATH = "avatars/rare-animals-set2-sprite.png";
  const SPRITE_CELLS = Object.freeze({
    philippine_cockatoo:[0,0],
    rufous_hornbill:[1,0],
    luzon_bleeding_heart_dove:[2,0],
    cebu_flowerpecker:[3,0],
    philippine_eagle_owl:[0,1],
    whale_shark_butanding:[1,1],
    dugong:[2,1],
    hawksbill_sea_turtle:[3,1]
  });

  const ALIASES = Object.freeze({
    philippine_eagle:"eagle",
    philippine_tarsier:"tarsier",
    palawan_peacock_pheasant:"peacock",
    waling_waling:"orchid",
    waling_waling_orchid:"orchid",
    jade_vine:"jade",
    philippine_rafflesia:"rafflesia",
    nipa:"nipa_palm",
    buri:"buri_palm",
    bakawan:"bakawan_mangrove",
    philippine_teak_blossom:"philippine_teak",
    attenborough_pitcher_plant:"attenborough_pitcher",
    luzon_bleeding_heart:"luzon_bleeding_heart_dove",
    whale_shark:"whale_shark_butanding",
    butanding:"whale_shark_butanding",
    hawksbill_turtle:"hawksbill_sea_turtle"
  });

  const ID_BY_FILE = Object.freeze(Object.fromEntries(
    Object.entries(PATH_BY_ID).map(([id,path]) => [path.split("/").pop(),id])
  ));
  const spriteResults = new Map();
  const spritePending = new Map();
  let spriteImagePromise = null;

  function slug(value) {
    return String(value || "").trim().toLowerCase().replace(/[’']/g, "")
      .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  function normaliseId(value) {
    const key = slug(value);
    return window.SalitaAvatarModel?.normaliseId?.(key) || ALIASES[key] || key;
  }

  function itemFor(id) {
    return window.SalitaAvatarModel?.get?.(normaliseId(id)) || null;
  }

  function localUrl(path, fresh = true) {
    const url = new URL(`./${path}`, document.baseURI);
    if (fresh) url.searchParams.set("avatar", RELEASE);
    return url.href;
  }

  function rawUrl(path) {
    return `${RAW_ROOT}${path}?avatar=${encodeURIComponent(RELEASE)}`;
  }

  function placeholder(id) {
    const item = itemFor(id);
    const label = item?.name || String(id || "Avatar").replace(/_/g, " ");
    const initials = label.split(/\s+/).filter(Boolean).slice(0,2)
      .map(word => word[0]).join("").toUpperCase() || "SQ";
    const safeLabel = label.replace(/[&<>"']/g, character => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[character]));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="22" fill="#e7f1ed"/><circle cx="64" cy="52" r="30" fill="#c8ddd5"/><text x="64" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="27" font-weight="800" fill="#244842">${initials}</text><text x="64" y="104" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" font-weight="700" fill="#46645f">${safeLabel.slice(0,24)}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function candidates(id) {
    const path = PATH_BY_ID[normaliseId(id)];
    if (!path) return [];
    return [localUrl(path,true), localUrl(path,false), rawUrl(path)];
  }

  function loadImage(url, crossOrigin = false) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      let settled = false;
      const finish = (ok, error) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        image.onload = null;
        image.onerror = null;
        if (ok && image.naturalWidth > 0 && image.naturalHeight > 0) resolve(image);
        else reject(error || new Error(`Avatar image could not be decoded: ${url}`));
      };
      const timer = window.setTimeout(
        () => finish(false, new Error(`Avatar image timed out: ${url}`)),
        LOAD_TIMEOUT_MS
      );
      if (crossOrigin) image.crossOrigin = "anonymous";
      image.decoding = "async";
      image.onload = () => finish(true);
      image.onerror = error => finish(false,error);
      image.src = url;
      if (image.complete) window.queueMicrotask(() => finish(image.naturalWidth > 0));
    });
  }

  async function loadSprite() {
    if (spriteImagePromise) return spriteImagePromise;
    spriteImagePromise = (async () => {
      const sources = [localUrl(SPRITE_PATH,true), localUrl(SPRITE_PATH,false), rawUrl(SPRITE_PATH)];
      let lastError = null;
      for (const source of sources) {
        try { return await loadImage(source, source.startsWith(RAW_ROOT)); }
        catch (error) { lastError = error; }
      }
      throw lastError || new Error("Rare animal sprite could not be loaded");
    })().catch(error => {
      spriteImagePromise = null;
      throw error;
    });
    return spriteImagePromise;
  }

  function cropSprite(id) {
    const key = normaliseId(id);
    if (spriteResults.has(key)) return Promise.resolve(spriteResults.get(key));
    if (spritePending.has(key)) return spritePending.get(key);
    const task = (async () => {
      const cell = SPRITE_CELLS[key];
      if (!cell) return "";
      const sprite = await loadSprite();
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext("2d", {alpha:true});
      if (!context) throw new Error("Canvas is unavailable for avatar sprite extraction");
      context.imageSmoothingEnabled = false;
      context.clearRect(0,0,128,128);
      context.drawImage(sprite,cell[0]*128,cell[1]*128,128,128,0,0,128,128);
      const source = canvas.toDataURL("image/png");
      if (!source || source === "data:,") throw new Error(`Sprite extraction failed for ${key}`);
      spriteResults.set(key,source);
      return source;
    })().catch(() => placeholder(key)).finally(() => spritePending.delete(key));
    spritePending.set(key,task);
    return task;
  }

  function resolve(id) {
    const key = normaliseId(id);
    if (!PATH_BY_ID[key]) return Promise.resolve(placeholder(key));
    if (SPRITE_CELLS[key]) return cropSprite(key);
    return Promise.resolve(candidates(key)[0]);
  }

  function inferId(image) {
    const direct = image?.dataset?.avatarId || image?.dataset?.sqAvatarId;
    if (direct) return normaliseId(direct);
    const owner = image?.closest?.("[data-avatar-card],[data-avatar-choice],[data-avatar-action],[data-detail-equip]");
    const contextual = owner?.dataset.avatarCard || owner?.dataset.avatarChoice ||
      owner?.dataset.avatarAction || owner?.dataset.detailEquip;
    if (contextual) return normaliseId(contextual);
    const source = image?.getAttribute?.("src") || "";
    if (!source || source.startsWith("data:")) return "";
    try {
      const file = new URL(source,document.baseURI).pathname.split("/").pop();
      return ID_BY_FILE[file] || "";
    } catch {
      return "";
    }
  }

  function setFallbackChain(image, id, sourceList) {
    image.dataset.sqAvatarFallbackStage = "0";
    image.onerror = () => {
      const stage = Number(image.dataset.sqAvatarFallbackStage || 0) + 1;
      image.dataset.sqAvatarFallbackStage = String(stage);
      const next = sourceList[stage];
      if (next) {
        image.src = next;
        return;
      }
      image.onerror = null;
      image.src = placeholder(id);
    };
    image.onload = () => {
      image.dataset.sqAvatarLoaded = "true";
    };
  }

  function bind(image, id, options = {}) {
    if (!(image instanceof HTMLImageElement)) return Promise.resolve("");
    const key = normaliseId(id || inferId(image));
    if (!PATH_BY_ID[key]) return Promise.resolve("");
    image.dataset.sqAvatarId = key;
    if (options.alt !== undefined) image.alt = options.alt;
    const token = String((Number(image.dataset.sqAvatarToken) || 0) + 1);
    image.dataset.sqAvatarToken = token;

    if (!SPRITE_CELLS[key]) {
      const sourceList = candidates(key);
      setFallbackChain(image,key,sourceList);
      if (image.getAttribute("src") !== sourceList[0]) image.src = sourceList[0];
      return Promise.resolve(sourceList[0]);
    }

    return cropSprite(key).then(source => {
      if (image.dataset.sqAvatarToken !== token || !image.isConnected) return source;
      image.onerror = null;
      image.onload = null;
      if (image.getAttribute("src") !== source) image.src = source;
      return source;
    });
  }

  function repairScope(scope = document) {
    if (scope instanceof HTMLImageElement) {
      const id = inferId(scope);
      if (id) bind(scope,id);
      return;
    }
    scope?.querySelectorAll?.("img").forEach(image => {
      const id = inferId(image);
      if (id) bind(image,id);
    });
  }

  function activeEquippedId() {
    try {
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
      const profile = store?.profiles?.find?.(item => item.id === activeId);
      return normaliseId(profile?.avatarCollection?.equippedAvatarId || profile?.avatarId || "");
    } catch {
      return "";
    }
  }

  function syncEquipped(id) {
    const key = normaliseId(id || activeEquippedId());
    if (!PATH_BY_ID[key]) return;
    const item = itemFor(key);
    document.querySelectorAll(
      ".sq-profile-button img,.sq-profile-identity img,.sq-profile-emblem-trigger img,.player-avatar img"
    ).forEach(image => bind(image,key,{alt:item?.name || ""}));
  }

  async function waitForModel() {
    for (let attempt = 0; attempt < 150; attempt += 1) {
      if (window.SalitaAvatarModel?.catalogue?.length) return window.SalitaAvatarModel;
      await new Promise(resolveWait => window.setTimeout(resolveWait,40));
    }
    return null;
  }

  async function verifyAll() {
    const results = [];
    for (const id of Object.keys(PATH_BY_ID)) {
      const source = await resolve(id);
      try {
        await loadImage(source,source.startsWith(RAW_ROOT));
        results.push({id,working:true});
      } catch {
        results.push({id,working:false});
      }
    }
    const failed = results.filter(result => !result.working).map(result => result.id);
    return Object.freeze({release:RELEASE,total:results.length,working:results.length-failed.length,failed:Object.freeze(failed)});
  }

  const api = Object.freeze({
    release:RELEASE,
    paths:PATH_BY_ID,
    spriteCells:SPRITE_CELLS,
    normaliseId,
    getAvatarImagePath:id => {
      const key = normaliseId(id);
      return spriteResults.get(key) || candidates(key)[0] || placeholder(key);
    },
    resolve,
    bind,
    repair:repairScope,
    syncEquipped,
    verifyAll
  });

  window.SalitaAvatarArtwork = api;
  window.getAvatarImagePath = api.getAvatarImagePath;
  window.SalitaAvatarArtworkReady = (async () => {
    await waitForModel();
    repairScope(document);
    syncEquipped();
    document.addEventListener("salita:avatar-equipped", event => {
      syncEquipped(event.detail?.avatarId || event.detail?.avatar?.id);
    });
    document.addEventListener("salita:avatar-model-hotfixed", () => {
      repairScope(document);
      syncEquipped();
    });
    document.addEventListener("salita:avatar-collection-changed", () => syncEquipped());
    return api;
  })();
})();
