(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAchievementSharingV3Installed";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const PROMPT_ID = "levelSharePromptV3";
  const PLATFORM_META = {
    facebook: {label: "Facebook", icon: "f", publicLabel: "Post the hosted achievement card"},
    instagram: {label: "Instagram", icon: "◎", publicLabel: "Send the square image to the app"},
    tiktok: {label: "TikTok", icon: "♪", publicLabel: "Send the square image to the app"},
    x: {label: "X", icon: "𝕏", publicLabel: "Post the hosted achievement card"},
    linkedin: {label: "LinkedIn", icon: "in", publicLabel: "Post the hosted achievement card"},
    whatsapp: {label: "WhatsApp", icon: "◉", publicLabel: "Send the hosted card and invitation"}
  };

  let activeShare = null;
  let lastPromptedLevel = 0;

  function readStore() {
    try { return JSON.parse(localStorage.getItem(PROFILE_STORE) || "null") || {profiles: []}; }
    catch { return {profiles: []}; }
  }

  function activeProfile() {
    const store = readStore();
    const id = sessionStorage.getItem(ACTIVE_PROFILE);
    return store.profiles?.find(profile => profile.id === id) || null;
  }

  function avatarPath() {
    const valid = new Set(["tarsier", "eagle", "tamaraw", "peacock", "orchid", "jade", "rafflesia", "anahaw"]);
    const id = activeProfile()?.avatarId;
    return `avatars/${valid.has(id) ? id : "tarsier"}.png`;
  }

  function courseLabel() {
    return document.body.dataset.course === "cebuano" ? "Cebuano / Bisaya" : "Tagalog";
  }

  function shareRoot(campaign) {
    try {
      const url = new URL("./", location.href);
      url.hash = "";
      url.search = "";
      if (/^https?:$/.test(url.protocol)) {
        url.searchParams.set("ref", campaign);
        return url.toString();
      }
    } catch {}
    return `https://costieman.github.io/SalitaQuest/?ref=${encodeURIComponent(campaign)}`;
  }

  function badgeById(id) {
    try { return BADGES.find(badge => badge.id === id) || null; }
    catch { return null; }
  }

  function isEarned(badge) {
    try { return Boolean(badge?.test?.(state)); }
    catch { return false; }
  }

  function notify(message) {
    try {
      if (typeof toast === "function") { toast(message); return; }
      if (typeof showRewardBurst === "function") { showRewardBurst("🏅", message, false); return; }
    } catch {}
    console.info(message);
  }

  function loadImage(src) {
    return new Promise(resolve => {
      if (!src) { resolve(null); return; }
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  function makeCanvas(width = 1080, height = 1080) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function roundRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (line && context.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
  }

  function drawBackground(context, width = 1080, height = 1080) {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#08152d");
    gradient.addColorStop(.52, "#123e49");
    gradient.addColorStop(1, "#087166");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(247,201,72,.13)";
    context.beginPath();
    context.arc(width * .86, height * .10, Math.min(width, height) * .24, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(width * .09, height * .94, Math.min(width, height) * .27, 0, Math.PI * 2);
    context.fill();
  }

  function drawBrand(context, title) {
    const profile = activeProfile();
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f7c948";
    context.font = "900 30px system-ui,sans-serif";
    context.fillText("SALITA QUEST", 64, 72);
    context.fillStyle = "#fff";
    context.font = "900 53px system-ui,sans-serif";
    context.fillText(title, 64, 132);
    context.fillStyle = "rgba(255,255,255,.76)";
    context.font = "700 23px system-ui,sans-serif";
    context.fillText(`${profile?.name || "A learner"} · ${courseLabel()}`, 66, 172);
  }

  function drawCallToAction(context, campaign) {
    const display = shareRoot(campaign).replace(/^https?:\/\//, "").replace(/\?.*$/, "").replace(/\/$/, "");
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,.72)";
    context.font = "800 17px system-ui,sans-serif";
    context.fillText("CHOOSE TAGALOG OR CEBUANO", 540, 944);
    roundRect(context, 242, 958, 596, 63, 31);
    context.fillStyle = "#f7c948";
    context.fill();
    context.fillStyle = "#10213b";
    context.font = "950 27px system-ui,sans-serif";
    context.fillText("START LEARNING FREE  →", 540, 999);
    context.fillStyle = "rgba(255,255,255,.76)";
    context.font = "700 17px system-ui,sans-serif";
    context.fillText(display, 540, 1048);
  }

  async function drawBadgeVisual(context, badge, x, y, size, avatar) {
    const custom = await loadImage(badge?.image || `badges/${badge?.id || ""}.png`);
    context.save();
    roundRect(context, x, y, size, size, size * .23);
    context.fillStyle = "#f8f2d8";
    context.fill();
    context.strokeStyle = "#f7c948";
    context.lineWidth = Math.max(5, size * .03);
    context.stroke();
    context.clip();
    if (custom) context.drawImage(custom, x, y, size, size);
    else if (avatar) {
      context.imageSmoothingEnabled = false;
      context.drawImage(avatar, x, y, size, size);
      context.fillStyle = "rgba(6,20,42,.76)";
      context.beginPath();
      context.arc(x + size * .76, y + size * .76, size * .19, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#fff";
      context.font = `900 ${Math.round(size * .20)}px system-ui,sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(badge?.icon || "★", x + size * .76, y + size * .76);
    }
    context.restore();
  }

  async function buildBadgeCard(badge) {
    const canvas = makeCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context);
    drawBrand(context, "BADGE EARNED");
    const avatar = await loadImage(avatarPath());
    await drawBadgeVisual(context, badge, 330, 210, 420, avatar);
    context.textAlign = "center";
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f7c948";
    context.font = "900 26px system-ui,sans-serif";
    context.fillText(String(badge.category || "Achievement").toUpperCase(), 540, 678);
    context.fillStyle = "#fff";
    context.font = "900 54px system-ui,sans-serif";
    wrapText(context, badge.name, 540, 748, 860, 60, 2);
    context.fillStyle = "rgba(255,255,255,.80)";
    context.font = "700 25px system-ui,sans-serif";
    wrapText(context, badge.description, 540, 850, 820, 34, 2);
    drawCallToAction(context, "badge-share");
    return canvas;
  }

  async function buildLevelCard(levelData) {
    const canvas = makeCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context);
    drawBrand(context, "LEVEL UP!");
    const avatar = await loadImage(levelData.imageSource || avatarPath());

    context.save();
    roundRect(context, 305, 220, 470, 420, 78);
    const panelGradient = context.createLinearGradient(305, 220, 775, 640);
    panelGradient.addColorStop(0, "#fff7d9");
    panelGradient.addColorStop(1, "#f7c948");
    context.fillStyle = panelGradient;
    context.fill();
    context.strokeStyle = "rgba(255,255,255,.95)";
    context.lineWidth = 10;
    context.stroke();
    context.clip();
    if (avatar) {
      context.imageSmoothingEnabled = false;
      context.drawImage(avatar, 370, 250, 340, 340);
    }
    context.restore();

    context.beginPath();
    context.arc(735, 595, 92, 0, Math.PI * 2);
    context.fillStyle = "#0f766e";
    context.fill();
    context.strokeStyle = "#fff";
    context.lineWidth = 9;
    context.stroke();
    context.fillStyle = "#fff";
    context.font = "950 64px system-ui,sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(String(levelData.level), 735, 597);

    context.textBaseline = "alphabetic";
    context.fillStyle = "#f7c948";
    context.font = "900 28px system-ui,sans-serif";
    context.fillText(`LEVEL ${levelData.level}`, 540, 716);
    context.fillStyle = "#fff";
    context.font = "950 58px system-ui,sans-serif";
    wrapText(context, levelData.title || "Language Explorer", 540, 790, 880, 62, 2);
    context.fillStyle = "rgba(255,255,255,.80)";
    context.font = "700 25px system-ui,sans-serif";
    wrapText(context, levelData.subtitle || "Another milestone on my language-learning journey.", 540, 878, 840, 34, 2);
    drawCallToAction(context, "level-up");
    return canvas;
  }

  function buildOpenGraphCard(square, title, text) {
    const canvas = makeCanvas(1200, 630);
    const context = canvas.getContext("2d");
    drawBackground(context, 1200, 630);
    context.save();
    roundRect(context, 22, 20, 590, 590, 28);
    context.clip();
    context.drawImage(square, 0, 0, 1080, 1080, 22, 20, 590, 590);
    context.restore();
    context.strokeStyle = "rgba(247,201,72,.46)";
    context.lineWidth = 3;
    roundRect(context, 22, 20, 590, 590, 28);
    context.stroke();
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f7c948";
    context.font = "900 24px system-ui,sans-serif";
    context.fillText("SALITA QUEST", 660, 84);
    context.fillStyle = "#fff";
    context.font = "900 48px system-ui,sans-serif";
    wrapText(context, title, 660, 158, 480, 55, 3);
    context.fillStyle = "rgba(255,255,255,.80)";
    context.font = "700 23px system-ui,sans-serif";
    wrapText(context, text, 660, 340, 470, 33, 4);
    context.fillStyle = "rgba(255,255,255,.72)";
    context.font = "800 17px system-ui,sans-serif";
    context.fillText("CHOOSE TAGALOG OR CEBUANO", 660, 500);
    roundRect(context, 660, 520, 454, 64, 32);
    context.fillStyle = "#f7c948";
    context.fill();
    context.fillStyle = "#10213b";
    context.font = "950 24px system-ui,sans-serif";
    context.fillText("START LEARNING FREE  →", 700, 561);
    return canvas;
  }

  function canvasBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Could not create social card"));
    }, "image/png", 1));
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function ensureModal() {
    let modal = document.getElementById("socialPostModal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "socialPostModal";
    modal.className = "social-post-modal";
    modal.hidden = true;
    modal.innerHTML = `<div class="social-post-backdrop" data-social-close></div><section class="social-post-card" role="dialog" aria-modal="true" aria-labelledby="socialPostTitle"><button class="social-post-close" type="button" data-social-close aria-label="Close">×</button><div class="social-post-preview"><img id="socialPostPreview" alt="Generated Salita Quest social card"><small>This complete card is hosted for Facebook, X and LinkedIn previews. Instagram and TikTok receive the square image.</small></div><div class="social-post-content"><p class="eyebrow">SHARE YOUR PROGRESS</p><h2 id="socialPostTitle">Post achievement</h2><p id="socialPostDescription"></p><div id="socialPlatformGrid" class="social-platform-grid"></div><div class="social-post-secondary"><button type="button" data-social-native>Share image to an app</button><button type="button" data-social-download>Download card</button><button type="button" data-social-copy>Copy hosted link</button></div><p id="socialPostStatus" class="social-post-status"></p></div></section>`;
    document.body.appendChild(modal);
    return modal;
  }

  function setStatus(message, error = false) {
    const node = document.getElementById("socialPostStatus");
    if (node) {
      node.textContent = message || "";
      node.style.color = error ? "#ff8c8c" : "#f7c948";
    }
  }

  function connectionApi() {
    return window.SalitaQuestSocialConnections || null;
  }

  function platformButton(provider) {
    const meta = PLATFORM_META[provider];
    return `<button class="social-platform-action" type="button" data-social-platform="${provider}"><span class="social-platform-icon">${meta.icon}</span><span><strong>${meta.label}</strong><small>${meta.publicLabel}</small></span></button>`;
  }

  function renderModal() {
    const grid = document.getElementById("socialPlatformGrid");
    if (grid) grid.innerHTML = Object.keys(PLATFORM_META).map(platformButton).join("");
  }

  async function createHostedShare() {
    if (!activeShare) throw new Error("No achievement card is ready.");
    if (activeShare.hosted) return activeShare.hosted;
    if (activeShare.hostedPromise) return activeShare.hostedPromise;
    const base = connectionApi()?.apiBase?.();
    if (!base) throw new Error("Hosted sharing is temporarily unavailable.");
    activeShare.hostedPromise = (async () => {
      setStatus("Publishing a secure public preview of this exact card…");
      const [squareImageDataUrl, ogImageDataUrl] = await Promise.all([
        blobToDataUrl(activeShare.blob),
        blobToDataUrl(activeShare.ogBlob)
      ]);
      const response = await fetch(`${base}/api/share-cards`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          type: activeShare.type,
          title: activeShare.title,
          description: activeShare.text,
          learnerName: activeProfile()?.name || "",
          course: courseLabel(),
          campaign: activeShare.campaign,
          squareImageDataUrl,
          ogImageDataUrl
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Hosted sharing failed (${response.status}).`);
      activeShare.hosted = data;
      activeShare.url = data.shareUrl;
      activeShare.caption = `${activeShare.text} Start learning a Filipino language free with Salita Quest: ${data.shareUrl}`;
      setStatus("Hosted image preview ready. Choose a platform.");
      return data;
    })().catch(error => {
      if (activeShare) activeShare.hostedPromise = null;
      throw error;
    });
    return activeShare.hostedPromise;
  }

  async function prepareShare({type, title, text, fileName, campaign, canvas}) {
    const modal = ensureModal();
    modal.hidden = false;
    document.body.classList.add("social-post-busy");
    setStatus("Preparing the square card and social preview…");
    try {
      const openGraph = buildOpenGraphCard(canvas, title, text);
      const [blob, ogBlob] = await Promise.all([canvasBlob(canvas), canvasBlob(openGraph)]);
      const fallbackUrl = shareRoot(campaign);
      activeShare = {
        type,
        title,
        text,
        fileName,
        campaign,
        blob,
        ogBlob,
        url: fallbackUrl,
        caption: `${text} Start learning a Filipino language free with Salita Quest: ${fallbackUrl}`,
        hosted: null,
        hostedPromise: null
      };
      const preview = document.getElementById("socialPostPreview");
      if (preview?.src?.startsWith("blob:")) URL.revokeObjectURL(preview.src);
      if (preview) preview.src = URL.createObjectURL(blob);
      document.getElementById("socialPostTitle").textContent = title;
      document.getElementById("socialPostDescription").textContent = text;
      renderModal();
      createHostedShare().catch(error => setStatus(error.message, true));
    } finally {
      document.body.classList.remove("social-post-busy");
    }
  }

  async function openBadge(id, button) {
    const badge = badgeById(id);
    if (!badge || !isEarned(badge)) {
      notify("This badge is not available to share yet.");
      return;
    }
    const original = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = "Preparing…";
    }
    try {
      const canvas = await buildBadgeCard(badge);
      await prepareShare({
        type: "badge",
        title: `My ${badge.name} badge`,
        text: `I earned the ${badge.name} badge while learning ${courseLabel()} with Salita Quest.`,
        fileName: `salita-quest-${badge.id}.png`,
        campaign: "badge-share",
        canvas
      });
    } catch (error) {
      console.error(error);
      notify("This badge could not be prepared for sharing.");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = original || "Share badge";
      }
    }
  }

  async function openLevel(levelData) {
    try {
      const canvas = await buildLevelCard(levelData);
      await prepareShare({
        type: "level",
        title: `I reached Level ${levelData.level} in Salita Quest`,
        text: `I reached Level ${levelData.level} · ${levelData.title} while learning ${courseLabel()} with Salita Quest.`,
        fileName: `salita-quest-level-${levelData.level}.png`,
        campaign: "level-up",
        canvas
      });
    } catch (error) {
      console.error(error);
      notify("This level-up card could not be prepared for sharing.");
    }
  }

  function closeActiveShare() {
    const modal = document.getElementById("socialPostModal");
    if (modal) modal.hidden = true;
    const preview = document.getElementById("socialPostPreview");
    if (preview?.src?.startsWith("blob:")) {
      URL.revokeObjectURL(preview.src);
      preview.removeAttribute("src");
    }
    activeShare = null;
  }

  function blankPopup() {
    return window.open("about:blank", "salitaSocialPost", "popup=yes,width=720,height=760");
  }

  async function publicComposer(provider) {
    if (!activeShare) return;
    const popup = blankPopup();
    if (!popup) {
      setStatus("Allow pop-ups so Salita Quest can open the social composer.", true);
      return;
    }
    try {
      popup.document.write("<title>Preparing Salita Quest post…</title><p style='font:18px system-ui;padding:30px'>Preparing your hosted achievement card…</p>");
      const hosted = await createHostedShare();
      const encodedUrl = encodeURIComponent(hosted.shareUrl);
      const encodedText = encodeURIComponent(activeShare.caption);
      let url = "";
      if (provider === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      else if (provider === "x") url = `https://twitter.com/intent/tweet?text=${encodedText}`;
      else if (provider === "linkedin") url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      else if (provider === "whatsapp") url = `https://wa.me/?text=${encodedText}`;
      popup.location.replace(url);
      setStatus(`${PLATFORM_META[provider].label} opened with the hosted achievement card.`);
    } catch (error) {
      try { popup.close(); } catch {}
      setStatus(error.message || "The hosted post could not be prepared.", true);
    }
  }

  async function nativeShare() {
    if (!activeShare) return;
    if (!navigator.share) throw new Error("This browser does not provide app sharing.");
    const file = typeof File === "function" ? new File([activeShare.blob], activeShare.fileName, {type: "image/png"}) : null;
    const payload = {title: activeShare.title, text: activeShare.text, url: activeShare.hosted?.shareUrl || activeShare.url};
    if (file && navigator.canShare?.({files: [file]})) payload.files = [file];
    await navigator.share(payload);
  }

  async function platformAction(provider) {
    if (["facebook", "x", "linkedin", "whatsapp"].includes(provider)) {
      await publicComposer(provider);
      return;
    }
    if (["instagram", "tiktok"].includes(provider)) {
      try { await nativeShare(); }
      catch { setStatus(`${PLATFORM_META[provider].label} needs mobile image sharing.`, true); }
    }
  }

  function download() {
    if (!activeShare) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(activeShare.blob);
    link.download = activeShare.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1500);
    setStatus("Square social card downloaded.");
  }

  async function copyCaption() {
    if (!activeShare) return;
    try {
      await createHostedShare();
      await navigator.clipboard.writeText(activeShare.caption);
      setStatus("Hosted achievement link and caption copied.");
    } catch (error) {
      setStatus(error.message || "The browser could not copy the hosted link.", true);
    }
  }

  function removeLevelPrompt() {
    const prompt = document.getElementById(PROMPT_ID);
    if (!prompt) return;
    window.clearTimeout(prompt.__dismissTimer);
    prompt.classList.add("leaving");
    window.setTimeout(() => prompt.remove(), 220);
  }

  function showLevelPrompt(levelData) {
    if (!levelData?.level || levelData.level <= lastPromptedLevel) return;
    lastPromptedLevel = levelData.level;
    document.getElementById(PROMPT_ID)?.remove();
    const prompt = document.createElement("aside");
    prompt.id = PROMPT_ID;
    prompt.className = "level-share-prompt-v3";
    prompt.setAttribute("role", "dialog");
    prompt.setAttribute("aria-label", `Share Level ${levelData.level}`);
    prompt.__levelData = levelData;
    prompt.innerHTML = `<img src="${levelData.imageSource || avatarPath()}" alt=""><div class="level-share-prompt-copy"><span>LEVEL UP!</span><strong>Level ${levelData.level} · ${levelData.title}</strong><small>Share this milestone with your achievement card.</small></div><div class="level-share-prompt-actions"><button type="button" data-share-level-v3>Share level up</button><button type="button" data-dismiss-level-v3>Continue</button></div>`;
    document.body.appendChild(prompt);
    requestAnimationFrame(() => prompt.classList.add("show"));
    prompt.__dismissTimer = window.setTimeout(removeLevelPrompt, 20000);
  }

  function captureLevelCelebration(layer) {
    let pending = null;
    try { pending = state?.levelProgressionV2?.pendingLevelUp; } catch {}
    const level = Number(pending?.to || layer.querySelector(".level-up-avatar b")?.textContent || 0);
    if (!level || level <= lastPromptedLevel) return;
    const title = String(layer.querySelector(".level-up-banner small")?.textContent || "Language Explorer").trim();
    const imageSource = layer.querySelector(".level-up-avatar img")?.src || avatarPath();
    const subtitle = `Another milestone on the ${courseLabel()} learning journey.`;
    const levelData = {level, from: Number(pending?.from || Math.max(1, level - 1)), title, subtitle, imageSource};
    window.setTimeout(() => showLevelPrompt(levelData), 3100);
  }

  function observeLevelUps() {
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          const layer = node.matches(".level-up-celebration") ? node : node.querySelector(".level-up-celebration");
          if (layer) captureLevelCelebration(layer);
        }
      }
    });
    observer.observe(document.documentElement, {childList: true, subtree: true});
  }

  function badgeIdFromButton(button) {
    return button?.dataset.shareBadge || button?.closest("[data-badge-id]")?.dataset.badgeId || "";
  }

  function install() {
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    document.addEventListener("click", event => {
      const badgeButton = event.target.closest?.("[data-share-badge]");
      if (badgeButton) {
        const id = badgeIdFromButton(badgeButton);
        if (!id) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        openBadge(id, badgeButton);
        return;
      }

      const levelButton = event.target.closest?.("[data-share-level-v3]");
      if (levelButton) {
        const prompt = levelButton.closest(`#${PROMPT_ID}`);
        const levelData = prompt?.__levelData;
        event.preventDefault();
        event.stopImmediatePropagation();
        removeLevelPrompt();
        if (levelData) openLevel(levelData);
        return;
      }

      if (event.target.closest?.("[data-dismiss-level-v3]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        removeLevelPrompt();
        return;
      }

      if (!activeShare) return;
      if (event.target.closest?.("[data-social-close]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeActiveShare();
        return;
      }
      const platform = event.target.closest?.("[data-social-platform]");
      if (platform) {
        event.preventDefault();
        event.stopImmediatePropagation();
        platformAction(platform.dataset.socialPlatform);
        return;
      }
      if (event.target.closest?.("[data-social-native]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        nativeShare().catch(error => setStatus(error.message, true));
        return;
      }
      if (event.target.closest?.("[data-social-download]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        download();
        return;
      }
      if (event.target.closest?.("[data-social-copy]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        copyCaption();
      }
    }, true);

    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (activeShare) {
        event.stopImmediatePropagation();
        closeActiveShare();
      } else if (document.getElementById(PROMPT_ID)) removeLevelPrompt();
    }, true);

    observeLevelUps();
    window.SalitaQuestAchievementSharingV3 = {openBadge, openLevel};
  }

  install();
})();
