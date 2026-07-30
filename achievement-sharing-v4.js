(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestAchievementSharingV4Installed";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const MODAL_ID = "achievementShareModalV4";
  const PROMPT_ID = "levelSharePromptV4";

  const PLATFORM_META = {
    facebook: {label: "Facebook", icon: "f", detail: "Post the hosted achievement card"},
    instagram: {label: "Instagram", icon: "◎", detail: "Share the square image to the app"},
    tiktok: {label: "TikTok", icon: "♪", detail: "Share the square image to the app"},
    x: {label: "X", icon: "𝕏", detail: "Post the hosted achievement card"},
    linkedin: {label: "LinkedIn", icon: "in", detail: "Post the hosted achievement card"},
    whatsapp: {label: "WhatsApp", icon: "◉", detail: "Send the hosted card and invitation"}
  };

  let activeShare = null;
  let lastPromptedLevel = 0;

  function notify(message) {
    try {
      if (typeof toast === "function") {
        toast(message);
        return;
      }
    } catch {}
    console.info(message);
  }

  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_STORE) || "null") || {profiles: []};
    } catch {
      return {profiles: []};
    }
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
    try {
      return BADGES.find(badge => badge.id === id) || null;
    } catch {
      return null;
    }
  }

  function isEarned(badge) {
    try {
      return Boolean(badge?.test?.(state));
    } catch {
      return false;
    }
  }

  function chestBadges() {
    const api = window.SalitaQuestBadgeChest;
    if (api?.getBadges) return api.getBadges();
    const ids = Array.isArray(state?.badgeProgress?.chestIds) ? state.badgeProgress.chestIds : [];
    return ids.slice(0, 6).map(badgeById).filter(badge => badge && isEarned(badge));
  }

  function loadImage(src) {
    return new Promise(resolve => {
      if (!src) {
        resolve(null);
        return;
      }
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
      const next = line ? `${line} ${word}` : word;
      if (line && context.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
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
    context.textBaseline = "alphabetic";
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
    if (custom) {
      context.drawImage(custom, x, y, size, size);
    } else if (avatar) {
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
    } else {
      context.fillStyle = "#10213b";
      context.font = `900 ${Math.round(size * .38)}px system-ui,sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(badge?.icon || "★", x + size / 2, y + size / 2);
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

  async function buildChestCard(badges) {
    const canvas = makeCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context);
    drawBrand(context, "MY BADGE CHEST");
    const avatar = await loadImage(avatarPath());
    if (avatar) {
      context.save();
      roundRect(context, 856, 44, 138, 138, 34);
      context.fillStyle = "#e9f6f1";
      context.fill();
      context.clip();
      context.imageSmoothingEnabled = false;
      context.drawImage(avatar, 856, 44, 138, 138);
      context.restore();
    }
    const positions = [[62, 220], [386, 220], [710, 220], [62, 536], [386, 536], [710, 536]];
    for (let index = 0; index < 6; index += 1) {
      const [x, y] = positions[index];
      const badge = badges[index];
      context.save();
      roundRect(context, x, y, 290, 282, 27);
      context.fillStyle = "rgba(7,18,37,.72)";
      context.fill();
      context.strokeStyle = badge ? "rgba(247,201,72,.52)" : "rgba(255,255,255,.14)";
      context.lineWidth = 3;
      context.stroke();
      context.restore();
      if (badge) {
        await drawBadgeVisual(context, badge, x + 69, y + 18, 152, avatar);
        context.textAlign = "center";
        context.textBaseline = "alphabetic";
        context.fillStyle = "#fff";
        context.font = "900 22px system-ui,sans-serif";
        wrapText(context, badge.name, x + 145, y + 212, 248, 26, 2);
      } else {
        context.textAlign = "center";
        context.fillStyle = "rgba(255,255,255,.25)";
        context.font = "900 58px system-ui,sans-serif";
        context.fillText("＋", x + 145, y + 138);
      }
    }
    drawCallToAction(context, "badge-chest");
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
    const panel = context.createLinearGradient(305, 220, 775, 640);
    panel.addColorStop(0, "#fff7d9");
    panel.addColorStop(1, "#f7c948");
    context.fillStyle = panel;
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
    let modal = document.getElementById(MODAL_ID);
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.className = "achievement-share-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="achievement-share-backdrop" data-close-achievement-share></div>
      <section class="achievement-share-card" role="dialog" aria-modal="true" aria-labelledby="achievementShareTitle">
        <button class="achievement-share-close" type="button" data-close-achievement-share aria-label="Close">×</button>
        <div class="achievement-share-preview">
          <img id="achievementSharePreview" alt="Generated Salita Quest achievement card">
          <small>Facebook, X and LinkedIn receive a hosted preview. Instagram and TikTok receive the square image through device sharing.</small>
        </div>
        <div class="achievement-share-content">
          <p class="eyebrow">SHARE YOUR PROGRESS</p>
          <h2 id="achievementShareTitle">Share achievement</h2>
          <p id="achievementShareDescription"></p>
          <div id="achievementSharePlatforms" class="achievement-share-platforms"></div>
          <div class="achievement-share-secondary">
            <button type="button" data-achievement-native>Share image to an app</button>
            <button type="button" data-achievement-download>Download card</button>
            <button type="button" data-achievement-copy>Copy hosted link</button>
          </div>
          <p id="achievementShareStatus" class="achievement-share-status" role="status"></p>
        </div>
      </section>`;
    document.body.appendChild(modal);
    return modal;
  }

  function setStatus(message, error = false) {
    const node = document.getElementById("achievementShareStatus");
    if (!node) return;
    node.textContent = message || "";
    node.classList.toggle("error", Boolean(error));
  }

  function renderPlatforms() {
    const grid = document.getElementById("achievementSharePlatforms");
    if (!grid) return;
    grid.innerHTML = Object.entries(PLATFORM_META).map(([id, meta]) => `
      <button class="achievement-platform-action" type="button" data-achievement-platform="${id}">
        <span class="achievement-platform-icon">${meta.icon}</span>
        <span><strong>${meta.label}</strong><small>${meta.detail}</small></span>
      </button>`).join("");
  }

  function connectionApi() {
    return window.SalitaQuestSocialConnections || null;
  }

  async function createHostedShare() {
    if (!activeShare) throw new Error("No achievement card is ready.");
    if (activeShare.hosted) return activeShare.hosted;
    if (activeShare.hostedPromise) return activeShare.hostedPromise;
    const base = connectionApi()?.apiBase?.();
    if (!base) throw new Error("Progress sharing is temporarily unavailable.");
    activeShare.hostedPromise = (async () => {
      setStatus("Creating the public preview…");
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
      setStatus("Your hosted achievement card is ready.");
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
    document.body.classList.add("achievement-share-open");
    setStatus("Preparing your achievement card…");
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
    const preview = document.getElementById("achievementSharePreview");
    if (preview?.src?.startsWith("blob:")) URL.revokeObjectURL(preview.src);
    if (preview) preview.src = URL.createObjectURL(blob);
    const titleNode = document.getElementById("achievementShareTitle");
    const descriptionNode = document.getElementById("achievementShareDescription");
    if (titleNode) titleNode.textContent = title;
    if (descriptionNode) descriptionNode.textContent = text;
    renderPlatforms();
    createHostedShare().catch(error => setStatus(error.message, true));
  }

  async function openBadge(id, button = null) {
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
      await prepareShare({
        type: "badge",
        title: `My ${badge.name} badge`,
        text: `I earned the ${badge.name} badge while learning ${courseLabel()} with Salita Quest.`,
        fileName: `salita-quest-${badge.id}.png`,
        campaign: "badge-share",
        canvas: await buildBadgeCard(badge)
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

  async function openChest(button = null) {
    const badges = chestBadges();
    if (!badges.length) {
      notify("Choose at least one badge before sharing your Badge Chest.");
      window.SalitaQuestBadgeChest?.openPicker?.();
      return;
    }
    const original = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = "Preparing…";
    }
    try {
      await prepareShare({
        type: "chest",
        title: "My Salita Quest Badge Chest",
        text: `These are my proudest achievements while learning ${courseLabel()} with Salita Quest.`,
        fileName: "salita-quest-badge-chest.png",
        campaign: "badge-chest",
        canvas: await buildChestCard(badges)
      });
    } catch (error) {
      console.error(error);
      notify("Your Badge Chest could not be prepared for sharing.");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = original || "Share Badge Chest";
      }
    }
  }

  async function openLevel(levelData) {
    try {
      await prepareShare({
        type: "level",
        title: `I reached Level ${levelData.level} in Salita Quest`,
        text: `I reached Level ${levelData.level} · ${levelData.title} while learning ${courseLabel()} with Salita Quest.`,
        fileName: `salita-quest-level-${levelData.level}.png`,
        campaign: "level-up",
        canvas: await buildLevelCard(levelData)
      });
    } catch (error) {
      console.error(error);
      notify("This level-up card could not be prepared for sharing.");
    }
  }

  function closeShare() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) modal.hidden = true;
    const preview = document.getElementById("achievementSharePreview");
    if (preview?.src?.startsWith("blob:")) {
      URL.revokeObjectURL(preview.src);
      preview.removeAttribute("src");
    }
    activeShare = null;
    document.body.classList.remove("achievement-share-open");
  }

  function blankPopup() {
    return window.open("about:blank", "salitaAchievementPost", "popup=yes,width=720,height=760");
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
      let destination = "";
      if (provider === "facebook") destination = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      else if (provider === "x") destination = `https://twitter.com/intent/tweet?text=${encodedText}`;
      else if (provider === "linkedin") destination = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      else if (provider === "whatsapp") destination = `https://wa.me/?text=${encodedText}`;
      if (!destination) throw new Error("This platform does not support a public web composer.");
      popup.location.replace(destination);
      setStatus(`${PLATFORM_META[provider].label} opened with your hosted achievement card.`);
    } catch (error) {
      try {
        popup.close();
      } catch {}
      setStatus(error.message || "The hosted post could not be prepared.", true);
    }
  }

  async function nativeShare() {
    if (!activeShare) return;
    if (!navigator.share) throw new Error("This browser does not provide app sharing.");
    const file = typeof File === "function"
      ? new File([activeShare.blob], activeShare.fileName, {type: "image/png"})
      : null;
    const payload = {
      title: activeShare.title,
      text: activeShare.text,
      url: activeShare.hosted?.shareUrl || activeShare.url
    };
    if (file && navigator.canShare?.({files: [file]})) payload.files = [file];
    await navigator.share(payload);
  }

  async function platformAction(provider) {
    if (["facebook", "x", "linkedin", "whatsapp"].includes(provider)) {
      await publicComposer(provider);
      return;
    }
    if (["instagram", "tiktok"].includes(provider)) {
      try {
        await nativeShare();
      } catch {
        setStatus(`${PLATFORM_META[provider].label} needs mobile or device image sharing.`, true);
      }
    }
  }

  function downloadCard() {
    if (!activeShare) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(activeShare.blob);
    link.download = activeShare.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1500);
    setStatus("Square achievement card downloaded.");
  }

  async function copyHostedLink() {
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
    prompt.className = "level-share-prompt-v4";
    prompt.setAttribute("role", "dialog");
    prompt.setAttribute("aria-label", `Share Level ${levelData.level}`);
    prompt.__levelData = levelData;
    prompt.innerHTML = `
      <img src="${levelData.imageSource || avatarPath()}" alt="">
      <div class="level-share-prompt-copy">
        <span>LEVEL UP!</span>
        <strong>Level ${levelData.level} · ${levelData.title}</strong>
        <small>Share this milestone, or continue learning.</small>
      </div>
      <div class="level-share-prompt-actions">
        <button type="button" data-share-level-v4>Share level up</button>
        <button type="button" data-dismiss-level-v4>Continue</button>
      </div>`;
    document.body.appendChild(prompt);
    requestAnimationFrame(() => prompt.classList.add("show"));
    prompt.__dismissTimer = window.setTimeout(removeLevelPrompt, 30000);
  }

  function captureLevelCelebration(layer) {
    let pending = null;
    try {
      pending = state?.levelProgressionV2?.pendingLevelUp;
    } catch {}
    const level = Number(pending?.to || layer.querySelector(".level-up-avatar b")?.textContent || 0);
    if (!level || level <= lastPromptedLevel) return;
    const title = String(layer.querySelector(".level-up-banner small")?.textContent || "Language Explorer").trim();
    const imageSource = layer.querySelector(".level-up-avatar img")?.src || avatarPath();
    const levelData = {
      level,
      from: Number(pending?.from || Math.max(1, level - 1)),
      title,
      subtitle: `Another milestone on the ${courseLabel()} learning journey.`,
      imageSource
    };
    window.setTimeout(() => showLevelPrompt(levelData), 3100);
  }

  function observeLevelUps() {
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          const layer = node.matches(".level-up-celebration")
            ? node
            : node.querySelector(".level-up-celebration");
          if (layer) captureLevelCelebration(layer);
        }
      }
    });
    observer.observe(document.documentElement, {childList: true, subtree: true});
  }

  function badgeIdFromButton(button) {
    return button?.dataset.shareBadge || button?.closest("[data-badge-id]")?.dataset.badgeId || "";
  }

  function handleClick(event) {
    const badgeButton = event.target.closest?.("[data-share-badge]");
    if (badgeButton) {
      const id = badgeIdFromButton(badgeButton);
      if (!id) return;
      event.preventDefault();
      openBadge(id, badgeButton);
      return;
    }

    const chestButton = event.target.closest?.("[data-share-badge-chest]");
    if (chestButton) {
      event.preventDefault();
      openChest(chestButton);
      return;
    }

    const levelButton = event.target.closest?.("[data-share-level-v4]");
    if (levelButton) {
      const prompt = levelButton.closest(`#${PROMPT_ID}`);
      const levelData = prompt?.__levelData;
      event.preventDefault();
      removeLevelPrompt();
      if (levelData) openLevel(levelData);
      return;
    }

    if (event.target.closest?.("[data-dismiss-level-v4]")) {
      event.preventDefault();
      removeLevelPrompt();
      return;
    }

    if (!activeShare) return;

    if (event.target.closest?.("[data-close-achievement-share]")) {
      event.preventDefault();
      closeShare();
      return;
    }

    const platform = event.target.closest?.("[data-achievement-platform]");
    if (platform) {
      event.preventDefault();
      platformAction(platform.dataset.achievementPlatform);
      return;
    }

    if (event.target.closest?.("[data-achievement-native]")) {
      event.preventDefault();
      nativeShare().catch(error => setStatus(error.message, true));
      return;
    }

    if (event.target.closest?.("[data-achievement-download]")) {
      event.preventDefault();
      downloadCard();
      return;
    }

    if (event.target.closest?.("[data-achievement-copy]")) {
      event.preventDefault();
      copyHostedLink();
    }
  }

  function install() {
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;
    ensureModal();
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (activeShare) closeShare();
      else if (document.getElementById(PROMPT_ID)) removeLevelPrompt();
    });
    observeLevelUps();
    window.SalitaQuestAchievementSharing = {openBadge, openChest, openLevel};
  }

  install();
})();