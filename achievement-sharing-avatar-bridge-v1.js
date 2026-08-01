(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestCanonicalAchievementSharingV556Installed";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const MODAL_ID = "achievementShareModalV4";
  const RELEASE = "5.5.6";

  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  function activeProfile() {
    try {
      const store = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
      const id = sessionStorage.getItem(ACTIVE_PROFILE);
      return store?.profiles?.find(profile => profile.id === id) || null;
    } catch {
      return null;
    }
  }

  function equippedAvatar() {
    const profile = activeProfile();
    const id = profile?.avatarCollection?.equippedAvatarId || profile?.avatarId || "anahaw";
    return window.SalitaAvatarModel?.get(id) || window.SalitaAvatarModel?.get("anahaw") || null;
  }

  function canonicalAvatarPath() {
    const avatar = equippedAvatar();
    return avatar?.image || window.SalitaAvatarArtwork?.getAvatarImagePath?.(avatar?.id || "anahaw") || "avatars/canonical/anahaw.png";
  }

  function courseLabel() {
    return document.body.dataset.course === "cebuano" ? "Cebuano / Bisaya" : "Tagalog";
  }

  function badgeById(id) {
    try {
      return window.BADGES?.find?.(badge => badge.id === id) || BADGES?.find?.(badge => badge.id === id) || null;
    } catch {
      return null;
    }
  }

  function loadImage(source) {
    return new Promise(resolve => {
      if (!source) return resolve(null);
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = source;
    });
  }

  function makeCanvas(width = 1080, height = 1080) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function roundRect(context, x, y, width, height, radius) {
    const safe = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safe, y);
    context.arcTo(x + width, y, x + width, y + height, safe);
    context.arcTo(x + width, y + height, x, y + height, safe);
    context.arcTo(x, y + height, x, y, safe);
    context.arcTo(x, y, x + width, y, safe);
    context.closePath();
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 2) {
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

  function drawBackground(context, width, height) {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#08152d");
    gradient.addColorStop(.55, "#123e49");
    gradient.addColorStop(1, "#087166");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(247,201,72,.13)";
    context.beginPath();
    context.arc(width * .88, height * .10, Math.min(width, height) * .25, 0, Math.PI * 2);
    context.fill();
  }

  function drawBrand(context, title, width) {
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
    context.textAlign = "right";
    context.fillStyle = "rgba(255,255,255,.44)";
    context.font = "700 15px system-ui,sans-serif";
    context.fillText(`v${RELEASE}`, width - 52, 72);
  }

  function drawAvatar(context, image, x, y, size) {
    roundRect(context, x, y, size, size, size * .22);
    context.fillStyle = "#e9f6f1";
    context.fill();
    context.strokeStyle = "#f7c948";
    context.lineWidth = Math.max(5, size * .035);
    context.stroke();
    if (!image) return;
    context.save();
    roundRect(context, x, y, size, size, size * .22);
    context.clip();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, x, y, size, size);
    context.restore();
  }

  async function buildBadgeCard(badge) {
    const canvas = makeCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context, canvas.width, canvas.height);
    drawBrand(context, "BADGE EARNED", canvas.width);
    const avatar = await loadImage(canonicalAvatarPath());
    const badgeImage = await loadImage(badge?.image || `badges/${badge?.id || ""}.png`);
    roundRect(context, 300, 208, 480, 480, 72);
    context.fillStyle = "#f8f2d8";
    context.fill();
    context.strokeStyle = "#f7c948";
    context.lineWidth = 10;
    context.stroke();
    context.save();
    roundRect(context, 300, 208, 480, 480, 72);
    context.clip();
    if (badgeImage) context.drawImage(badgeImage, 300, 208, 480, 480);
    else if (avatar) context.drawImage(avatar, 300, 208, 480, 480);
    context.restore();
    drawAvatar(context, avatar, 806, 64, 170);
    context.textAlign = "center";
    context.fillStyle = "#f7c948";
    context.font = "900 26px system-ui,sans-serif";
    context.fillText(String(badge?.category || "Achievement").toUpperCase(), 540, 746);
    context.fillStyle = "#fff";
    context.font = "900 53px system-ui,sans-serif";
    wrapText(context, badge?.name || "Achievement", 540, 820, 850, 58, 2);
    context.fillStyle = "rgba(255,255,255,.78)";
    context.font = "700 24px system-ui,sans-serif";
    wrapText(context, badge?.description || "A Salita Quest milestone.", 540, 930, 830, 32, 2);
    return canvas;
  }

  async function buildChestCard() {
    const canvas = makeCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context, canvas.width, canvas.height);
    drawBrand(context, "MY BADGE CHEST", canvas.width);
    const avatar = await loadImage(canonicalAvatarPath());
    drawAvatar(context, avatar, 842, 48, 154);
    const badges = window.SalitaQuestBadgeChest?.getBadges?.() || [];
    const positions = [[62,238],[386,238],[710,238],[62,554],[386,554],[710,554]];
    for (let index = 0; index < positions.length; index += 1) {
      const [x, y] = positions[index];
      const badge = badges[index];
      roundRect(context, x, y, 290, 278, 28);
      context.fillStyle = "rgba(7,18,37,.72)";
      context.fill();
      context.strokeStyle = badge ? "rgba(247,201,72,.55)" : "rgba(255,255,255,.14)";
      context.lineWidth = 3;
      context.stroke();
      if (!badge) continue;
      const image = await loadImage(badge.image || `badges/${badge.id}.png`);
      if (image) context.drawImage(image, x + 70, y + 18, 150, 150);
      context.textAlign = "center";
      context.fillStyle = "#fff";
      context.font = "900 21px system-ui,sans-serif";
      wrapText(context, badge.name, x + 145, y + 214, 246, 25, 2);
    }
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,.78)";
    context.font = "750 24px system-ui,sans-serif";
    context.fillText("My Salita Quest achievements", 540, 1014);
    return canvas;
  }

  async function buildLevelCard(levelData = {}) {
    const canvas = makeCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context, canvas.width, canvas.height);
    drawBrand(context, "LEVEL UP!", canvas.width);
    const avatar = await loadImage(levelData.imageSource || canonicalAvatarPath());
    drawAvatar(context, avatar, 320, 220, 440);
    context.beginPath();
    context.arc(740, 622, 88, 0, Math.PI * 2);
    context.fillStyle = "#0f766e";
    context.fill();
    context.strokeStyle = "#fff";
    context.lineWidth = 9;
    context.stroke();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#fff";
    context.font = "950 62px system-ui,sans-serif";
    context.fillText(String(levelData.level || "★"), 740, 624);
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f7c948";
    context.font = "900 28px system-ui,sans-serif";
    context.fillText(`LEVEL ${levelData.level || ""}`.trim(), 540, 748);
    context.fillStyle = "#fff";
    context.font = "950 56px system-ui,sans-serif";
    wrapText(context, levelData.title || "Language Explorer", 540, 824, 850, 60, 2);
    context.fillStyle = "rgba(255,255,255,.80)";
    context.font = "700 24px system-ui,sans-serif";
    wrapText(context, levelData.subtitle || "Another milestone on my language-learning journey.", 540, 934, 830, 32, 2);
    return canvas;
  }

  function canvasBlob(canvas) {
    return new Promise(resolve => canvas.toBlob(resolve, "image/png", .96));
  }

  function closeModal() {
    document.getElementById(MODAL_ID)?.remove();
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function shareNative(blob, title, text, filename) {
    const file = new File([blob], filename, {type:"image/png"});
    if (navigator.canShare?.({files:[file]}) && navigator.share) {
      await navigator.share({title, text, files:[file]});
      return true;
    }
    return false;
  }

  async function showCard(canvas, title, text, filename) {
    closeModal();
    const blob = await canvasBlob(canvas);
    if (!blob) throw new Error("The achievement image could not be generated.");
    const preview = canvas.toDataURL("image/png");
    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.className = "achievement-share-modal-v4";
    modal.innerHTML = `<div class="achievement-share-backdrop" data-close-share></div>
      <section class="achievement-share-dialog" role="dialog" aria-modal="true" aria-label="Share achievement">
        <button type="button" class="achievement-share-close" data-close-share aria-label="Close">×</button>
        <img class="achievement-share-preview" src="${preview}" alt="${title.replace(/[&<>\"]/g, "")}">
        <div class="achievement-share-actions">
          <button type="button" class="primary" data-native-share>Share image</button>
          <button type="button" data-download-share>Download image</button>
        </div>
      </section>`;
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-close-share]").forEach(button => button.addEventListener("click", closeModal));
    modal.querySelector("[data-download-share]")?.addEventListener("click", () => download(blob, filename));
    modal.querySelector("[data-native-share]")?.addEventListener("click", async () => {
      try {
        const shared = await shareNative(blob, title, text, filename);
        if (!shared) download(blob, filename);
      } catch (error) {
        if (error?.name !== "AbortError") download(blob, filename);
      }
    });
  }

  async function openBadge(id) {
    const badge = badgeById(id);
    if (!badge) return;
    return showCard(await buildBadgeCard(badge), `${badge.name} — Salita Quest`, badge.description || "I earned a Salita Quest badge.", `salita-quest-${badge.id}.png`);
  }

  async function openChest() {
    return showCard(await buildChestCard(), "My Salita Quest Badge Chest", "My Salita Quest achievements.", "salita-quest-badge-chest.png");
  }

  async function openLevel(levelData = {}) {
    return showCard(await buildLevelCard(levelData), `Level ${levelData.level || ""} — Salita Quest`, levelData.subtitle || "I reached a new Salita Quest level.", `salita-quest-level-${levelData.level || "up"}.png`);
  }

  const api = Object.freeze({release:RELEASE, openBadge, openChest, openLevel, equippedAvatar, canonicalAvatarPath});
  window.SalitaQuestAchievementSharing = api;
  window.SalitaAchievementAvatarBridge = api;

  document.addEventListener("click", event => {
    const badgeButton = event.target.closest?.("[data-share-badge]");
    if (badgeButton) {
      const id = badgeButton.dataset.shareBadge || badgeButton.closest("[data-badge-id]")?.dataset.badgeId;
      if (!id) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openBadge(id);
      return;
    }
    const chestButton = event.target.closest?.("[data-share-badge-chest]");
    if (chestButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openChest();
      return;
    }
    const levelButton = event.target.closest?.("[data-share-level-v4]");
    if (!levelButton) return;
    const prompt = levelButton.closest("#levelSharePromptV4");
    const levelData = prompt?.__levelData;
    if (!levelData) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    prompt.remove();
    openLevel(levelData);
  }, true);
})();
