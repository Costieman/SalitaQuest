(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAchievementSharingRouterV2Installed";
  const RELEASE = "5.5.17-two-action-share";
  const MODAL_ID = "achievementShareModalV4";
  const PREVIEW_ID = "achievementSharePreview";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";

  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  let prepared = null;
  let imageFilePromise = null;
  let hostedPromise = null;
  let actionInProgress = false;

  const TYPE_CAMPAIGN = Object.freeze({
    badge:"badge-share",
    badge_chest:"badge-chest",
    avatar:"avatar-share",
    avatar_case:"avatar-case",
    level_up:"level-up"
  });

  const modal = () => document.getElementById(MODAL_ID);
  const preview = () => document.getElementById(PREVIEW_ID);

  function setStatus(message,error=false) {
    const node = document.getElementById("achievementShareStatus");
    if (!node) return;
    node.textContent = message || "";
    node.classList.toggle("error",Boolean(error));
  }

  function activeProfile() {
    try {
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      const id = sessionStorage.getItem(ACTIVE_PROFILE);
      return store?.profiles?.find(profile => profile.id === id) || null;
    } catch { return null; }
  }

  function courseLabel() {
    return document.body.dataset.course === "cebuano" ? "Cebuano / Bisaya" : "Tagalog";
  }

  function cleanFilePart(value) {
    return String(value || "achievement").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,56) || "achievement";
  }

  function titleFromModal() {
    return document.getElementById("achievementShareTitle")?.textContent?.trim() || "Salita Quest achievement";
  }

  function textFromModal() {
    return document.getElementById("achievementShareDescription")?.textContent?.trim() || "My Salita Quest achievement.";
  }

  function dataUrl(blob) {
    return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("The card image could not be read."));
      reader.readAsDataURL(blob);
    });
  }

  function canvasBlob(canvas) {
    return new Promise((resolve,reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("The social preview could not be created.")),"image/png",1));
  }

  function loadImage(source) {
    return new Promise((resolve,reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("The achievement image could not be loaded."));
      image.src = source;
    });
  }

  function wrapText(context,text,x,y,maxWidth,lineHeight,maxLines) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && context.measureText(candidate).width > maxWidth) {
        lines.push(current);
        current = word;
      } else current = candidate;
    }
    if (current) lines.push(current);
    lines.slice(0,maxLines).forEach((line,index) => context.fillText(line,x,y + index * lineHeight));
  }

  async function openGraphBlob(squareSource,title,text) {
    const image = await loadImage(squareSource);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0,0,1200,630);
    gradient.addColorStop(0,"#071427");
    gradient.addColorStop(.58,"#123e49");
    gradient.addColorStop(1,"#087166");
    context.fillStyle = gradient;
    context.fillRect(0,0,1200,630);
    context.save();
    context.beginPath();
    context.roundRect(22,20,590,590,28);
    context.clip();
    context.drawImage(image,22,20,590,590);
    context.restore();
    context.strokeStyle = "rgba(247,201,72,.55)";
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(22,20,590,590,28);
    context.stroke();
    context.textAlign = "left";
    context.fillStyle = "#f7c948";
    context.font = "900 24px system-ui,sans-serif";
    context.fillText("SALITA QUEST",660,84);
    context.fillStyle = "#fff";
    context.font = "900 48px system-ui,sans-serif";
    wrapText(context,title,660,158,480,55,3);
    context.fillStyle = "rgba(255,255,255,.82)";
    context.font = "700 23px system-ui,sans-serif";
    wrapText(context,text,660,340,470,33,4);
    context.fillStyle = "rgba(255,255,255,.72)";
    context.font = "800 17px system-ui,sans-serif";
    context.fillText("CHOOSE TAGALOG OR CEBUANO",660,500);
    context.fillStyle = "#f7c948";
    context.beginPath();
    context.roundRect(660,520,454,64,32);
    context.fill();
    context.fillStyle = "#10213b";
    context.font = "950 24px system-ui,sans-serif";
    context.fillText("START LEARNING FREE  →",700,561);
    return canvasBlob(canvas);
  }

  function ensureImageFile() {
    if (!prepared?.source) return Promise.reject(new Error("The achievement image is not ready."));
    if (prepared.file) return Promise.resolve(prepared.file);
    if (imageFilePromise) return imageFilePromise;
    imageFilePromise = fetch(prepared.source)
      .then(response => {
        if (!response.ok) throw new Error("The achievement image could not be read.");
        return response.blob();
      })
      .then(blob => {
        const png = blob.type === "image/png" ? blob : new Blob([blob],{type:"image/png"});
        prepared.file = new File([png],prepared.fileName,{type:"image/png"});
        return prepared.file;
      })
      .finally(() => { imageFilePromise = null; });
    return imageFilePromise;
  }

  function validateHostedResponse(data,apiBase) {
    let share;
    let image;
    try {
      share = new URL(data?.shareUrl || "");
      image = new URL(data?.imageUrl || "");
    } catch { throw new Error("The public achievement page returned an invalid address."); }
    const apiOrigin = new URL(apiBase).origin;
    if (share.protocol !== "https:" || share.origin !== apiOrigin || !share.pathname.startsWith("/share/")) throw new Error("The public achievement page is not valid.");
    if (image.protocol !== "https:" || image.origin !== apiOrigin || !image.pathname.startsWith("/media/")) throw new Error("The public achievement image is not available.");
    return data;
  }

  function ensureHostedShare() {
    if (!prepared) return Promise.reject(new Error("No achievement is ready to share."));
    if (prepared.hosted) return Promise.resolve(prepared.hosted);
    if (hostedPromise) return hostedPromise;
    hostedPromise = (async () => {
      const api = window.SalitaQuestSocialConnections || null;
      const base = String(api?.apiBase?.() || "").replace(/\/$/,"");
      if (!base) throw new Error("Sharing is temporarily unavailable.");
      if (api?.ensureHosted && !(await api.ensureHosted())) throw new Error("Sharing is temporarily unavailable.");
      const file = await ensureImageFile();
      const ogBlob = await openGraphBlob(prepared.source,prepared.title,prepared.text);
      const [squareImageDataUrl,ogImageDataUrl] = await Promise.all([dataUrl(file),dataUrl(ogBlob)]);
      const response = await fetch(`${base}/api/share-cards`,{
        method:"POST",
        credentials:"omit",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          type:prepared.type,
          title:prepared.title,
          description:prepared.text,
          learnerName:activeProfile()?.name || "",
          course:courseLabel(),
          campaign:prepared.campaign,
          squareImageDataUrl,
          ogImageDataUrl
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Sharing failed (${response.status}).`);
      prepared.hosted = validateHostedResponse(data,base);
      return prepared.hosted;
    })().finally(() => { hostedPromise = null; });
    return hostedPromise;
  }

  async function shareAchievement() {
    const hosted = await ensureHostedShare();
    if (!navigator.share) throw new Error("This browser cannot open app sharing.");
    await navigator.share({
      title:prepared.title,
      text:prepared.text,
      url:hosted.shareUrl
    });
  }

  async function saveAchievement() {
    const file = await ensureImageFile();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = prepared.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href),1500);
  }

  function renderActions() {
    const platformHost = document.getElementById("achievementSharePlatforms");
    const secondary = modal()?.querySelector(".achievement-share-secondary");
    if (!platformHost || !secondary) return;
    platformHost.className = "achievement-share-router-v2 achievement-share-two-actions";
    platformHost.innerHTML = `
      <button class="achievement-share-primary" type="button" data-sq-share-main>Share</button>
      <button class="achievement-share-save" type="button" data-sq-share-save>Save</button>`;
    secondary.hidden = true;
  }

  async function runAction(button,action) {
    if (actionInProgress) return;
    actionInProgress = true;
    if (button) { button.disabled = true; button.dataset.busy = "true"; }
    try {
      await action();
      setStatus("");
    } catch (error) {
      if (error?.name !== "AbortError") setStatus(error?.message || "The action could not be completed.",true);
    } finally {
      actionInProgress = false;
      if (button) { button.disabled = false; delete button.dataset.busy; }
    }
  }

  function handleClick(event) {
    const button = event.target.closest?.("[data-sq-share-main],[data-sq-share-save]");
    if (!button || !prepared || modal()?.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (button.hasAttribute("data-sq-share-main")) return runAction(button,shareAchievement);
    if (button.hasAttribute("data-sq-share-save")) return runAction(button,saveAchievement);
  }

  document.addEventListener("click",handleClick,true);
  document.addEventListener("salita:achievement-share-prepared",event => {
    prepared = {
      type:event.detail?.type || "badge",
      title:titleFromModal(),
      text:textFromModal(),
      campaign:TYPE_CAMPAIGN[event.detail?.type] || "achievement-share",
      fileName:`salita-quest-${cleanFilePart(event.detail?.type)}-${cleanFilePart(titleFromModal())}.png`,
      source:preview()?.src || "",
      file:null,
      hosted:null
    };
    imageFilePromise = null;
    hostedPromise = null;
    renderActions();
    ensureImageFile().catch(() => {});
    ensureHostedShare().catch(() => {});
  });

  document.addEventListener("salita:achievement-share-closed",() => {
    prepared = null;
    imageFilePromise = null;
    hostedPromise = null;
  });

  window.SalitaQuestSharingRouter = Object.freeze({
    version:2,
    release:RELEASE,
    modes:Object.freeze(["share","save"]),
    ensureHostedShare,
    shareAchievement,
    saveAchievement
  });
  document.documentElement.dataset.achievementSharingRouter = RELEASE;
})();