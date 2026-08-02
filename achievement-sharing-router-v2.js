(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAchievementSharingRouterV2Installed";
  const RELEASE = "5.5.16-streamlined-social-menu";
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
    if (share.protocol !== "https:" || share.origin !== apiOrigin || !share.pathname.startsWith("/share/")) throw new Error("The public achievement page is not a valid hosted share page.");
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
      if (!base) throw new Error("Public achievement posts are temporarily unavailable.");
      if (api?.ensureHosted && !(await api.ensureHosted())) throw new Error("Public achievement posts are temporarily unavailable.");
      setStatus("Preparing your achievement share…");
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
      if (!response.ok) throw new Error(data.message || `Public achievement post failed (${response.status}).`);
      prepared.hosted = validateHostedResponse(data,base);
      prepared.caption = `${prepared.text}\n\nPlay Salita Quest free:\n${prepared.hosted.shareUrl}`;
      setStatus("Ready to post or send.");
      return prepared.hosted;
    })().catch(error => {
      setStatus(`${error.message || "The share could not be prepared."} Try again.`,true);
      throw error;
    }).finally(() => { hostedPromise = null; });
    return hostedPromise;
  }

  async function copyText(value) {
    const text = String(value || "");
    if (!text) throw new Error("The post caption is not ready.");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch {}
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly","");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0,textarea.value.length);
    const copied = document.execCommand?.("copy");
    textarea.remove();
    if (!copied) throw new Error("The caption could not be copied. Use Copy caption and link instead.");
  }

  function canShareImage(file) {
    if (!navigator.share) return false;
    if (!navigator.canShare) return true;
    try { return navigator.canShare({files:[file]}); }
    catch { return false; }
  }

  async function shareSocialPost() {
    await ensureHostedShare();
    const file = await ensureImageFile();
    await copyText(prepared.caption);
    setStatus("Caption and play link copied. Choose your social app, then paste if its caption box is blank.");
    if (!canShareImage(file)) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = prepared.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(link.href),1500);
      setStatus("Image downloaded and caption copied. Upload it to your social app, then paste the caption.");
      return;
    }
    await navigator.share({
      title:prepared.title,
      text:prepared.caption,
      files:[file]
    });
    setStatus("Social sharing opened. Paste the copied caption if the app removed it.");
  }

  async function shareMessageLink() {
    const hosted = await ensureHostedShare();
    if (!navigator.share) throw new Error("This browser cannot open messaging apps. Copy the caption and link instead.");
    await navigator.share({
      title:prepared.title,
      text:prepared.text,
      url:hosted.shareUrl
    });
    setStatus("Messaging share opened with the clickable Salita Quest link.");
  }

  async function copyPost() {
    await ensureHostedShare();
    await copyText(prepared.caption);
    setStatus("Caption and playable link copied.");
  }

  async function downloadImage() {
    const file = await ensureImageFile();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = prepared.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href),1500);
    setStatus("Achievement image downloaded.");
  }

  function renderActions() {
    const platformHost = document.getElementById("achievementSharePlatforms");
    const secondary = modal()?.querySelector(".achievement-share-secondary");
    if (!platformHost || !secondary) return;
    platformHost.className = "achievement-share-router-v2";
    platformHost.innerHTML = `
      <section class="achievement-share-mode-group">
        <div class="achievement-share-mode-heading"><span>POST</span><small>For Facebook and other social feeds</small></div>
        <div class="achievement-share-mode-actions public-actions">
          <button type="button" data-sq-share-social><strong>Post to social media</strong><small>Large image with the caption and play link copied</small></button>
        </div>
      </section>
      <section class="achievement-share-mode-group">
        <div class="achievement-share-mode-heading"><span>SEND</span><small>For Messenger and other messaging apps</small></div>
        <div class="achievement-share-mode-actions private-actions">
          <button type="button" data-sq-share-message><strong>Send in a messaging app</strong><small>Send the clickable Salita Quest link</small></button>
          <button type="button" data-sq-share-copy><strong>Copy caption and link</strong><small>Paste the complete post anywhere</small></button>
        </div>
      </section>
      <section class="achievement-share-mode-group">
        <div class="achievement-share-mode-heading"><span>SAVE</span></div>
        <div class="achievement-share-mode-actions image-actions">
          <button type="button" data-sq-share-download><strong>Download image</strong><small>Save the achievement card</small></button>
        </div>
      </section>`;
    secondary.hidden = true;
  }

  async function runAction(button,action) {
    if (actionInProgress) return;
    actionInProgress = true;
    if (button) { button.disabled = true; button.dataset.busy = "true"; }
    try { await action(); }
    catch (error) { setStatus(error?.name === "AbortError" ? "Sharing cancelled." : error?.message || "The sharing action could not be completed.",error?.name !== "AbortError"); }
    finally {
      actionInProgress = false;
      if (button) { button.disabled = false; delete button.dataset.busy; }
    }
  }

  function handleClick(event) {
    const button = event.target.closest?.("[data-sq-share-social],[data-sq-share-message],[data-sq-share-copy],[data-sq-share-download]");
    if (!button || !prepared || modal()?.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (button.hasAttribute("data-sq-share-social")) return runAction(button,shareSocialPost);
    if (button.hasAttribute("data-sq-share-message")) return runAction(button,shareMessageLink);
    if (button.hasAttribute("data-sq-share-copy")) return runAction(button,copyPost);
    if (button.hasAttribute("data-sq-share-download")) return runAction(button,downloadImage);
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
      hosted:null,
      caption:""
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
    modes:Object.freeze(["social_image_caption","message_link","copy_post","download_file"]),
    ensureHostedShare,
    shareSocialPost,
    sendPrivately:shareMessageLink,
    shareMessageLink
  });
  document.documentElement.dataset.achievementSharingRouter = RELEASE;
})();