(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestBadgeSharingV1Installed";
  const MAX_CHEST_BADGES = 6;
  let shelfObserver = null;

  function retry() {
    window.setTimeout(install, 100);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[character]));
  }

  function badgeProgress() {
    const data = state.badgeProgress || (state.badgeProgress = {});
    data.earnedAt = data.earnedAt && typeof data.earnedAt === "object" ? data.earnedAt : {};
    data.chestIds = Array.isArray(data.chestIds) ? [...new Set(data.chestIds.filter(Boolean))] : [];
    data.chestInitialized = Boolean(data.chestInitialized);
    return data;
  }

  function badgeById(id) {
    return BADGES.find(badge => badge.id === id) || null;
  }

  function isEarned(badge) {
    try { return Boolean(badge?.test?.(state)); }
    catch { return false; }
  }

  function earnedBadgesNewestFirst() {
    const data = badgeProgress();
    return BADGES.filter(isEarned).sort((a, b) => {
      return String(data.earnedAt[b.id] || "").localeCompare(String(data.earnedAt[a.id] || ""));
    });
  }

  function ensureChest() {
    const data = badgeProgress();
    const earnedIds = new Set(earnedBadgesNewestFirst().map(badge => badge.id));
    const cleaned = data.chestIds.filter(id => earnedIds.has(id)).slice(0, MAX_CHEST_BADGES);
    let changed = cleaned.join("|") !== data.chestIds.join("|");
    data.chestIds = cleaned;

    if (!data.chestInitialized) {
      data.chestIds = earnedBadgesNewestFirst().slice(0, MAX_CHEST_BADGES).map(badge => badge.id);
      data.chestInitialized = true;
      changed = true;
    }

    if (changed) saveState();
    return data.chestIds;
  }

  function fallbackArt(badge) {
    try {
      if (typeof badgeArt === "function") return badgeArt(badge.id);
    } catch {}
    return `<span>${escapeHTML(badge.icon || "🏅")}</span>`;
  }

  function visualMarkup(badge, className = "") {
    return `<div class="badge-share-visual ${className}">
      <img src="${escapeHTML(badge.image || `badges/${badge.id}.png`)}" alt="" loading="lazy">
      <span>${fallbackArt(badge)}</span>
    </div>`;
  }

  function shareRoot(campaign) {
    try {
      const url = new URL("./", window.location.href);
      url.hash = "";
      url.search = "";
      if (url.protocol === "http:" || url.protocol === "https:") {
        url.searchParams.set("ref", campaign);
        return url.toString();
      }
    } catch {}
    return "https://costieman.github.io/SalitaQuest/";
  }

  function courseLabel() {
    return document.body.dataset.course === "cebuano" ? "Cebuano / Bisaya" : "Tagalog";
  }

  function ensureChestPanel() {
    let panel = document.getElementById("badgeChestPanel");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "badgeChestPanel";
    panel.className = "badge-chest-panel";
    panel.setAttribute("aria-labelledby", "badgeChestTitle");

    const summary = document.querySelector("#badgesView .badges-page-summary");
    const shelf = document.querySelector("#badgesView .badges-page-shelf");
    const host = summary || shelf;
    if (host?.parentNode) host.parentNode.insertBefore(panel, host);
    else document.getElementById("badgesView")?.appendChild(panel);
    return panel;
  }

  function renderChest() {
    const panel = ensureChestPanel();
    if (!panel) return;
    const ids = ensureChest();
    const badges = ids.map(badgeById).filter(Boolean);
    const slots = Array.from({length:MAX_CHEST_BADGES}, (_, index) => {
      const badge = badges[index];
      if (!badge) {
        return `<div class="badge-chest-slot empty" aria-label="Empty badge chest slot"><span>＋</span><small>Choose an earned badge</small></div>`;
      }
      return `<article class="badge-chest-slot filled" data-chest-badge-id="${escapeHTML(badge.id)}">
        ${visualMarkup(badge, "badge-chest-visual")}
        <div class="badge-chest-slot-copy"><strong>${escapeHTML(badge.name)}</strong><small>${escapeHTML(badge.category || "Achievement")}</small></div>
        <div class="badge-chest-slot-controls" aria-label="Arrange ${escapeHTML(badge.name)}">
          <button type="button" data-chest-move="-1" title="Move earlier" ${index === 0 ? "disabled" : ""}>←</button>
          <button type="button" data-chest-move="1" title="Move later" ${index === badges.length - 1 ? "disabled" : ""}>→</button>
          <button type="button" data-chest-remove title="Remove from chest">×</button>
        </div>
      </article>`;
    }).join("");

    panel.innerHTML = `
      <div class="badge-chest-header">
        <div>
          <p class="eyebrow">YOUR PROUDEST ACHIEVEMENTS</p>
          <h3 id="badgeChestTitle">Badge Chest</h3>
          <p>Pin up to six earned badges. The first badge appears at the top-left of your shared chest.</p>
        </div>
        <button class="primary-btn badge-chest-share" type="button" data-share-badge-chest ${badges.length ? "" : "disabled"}>Share Badge Chest</button>
      </div>
      <div class="badge-chest-grid">${slots}</div>
      <p class="badge-chest-spread-note">Shared posts invite others to <strong>learn Filipino languages for free with Salita Quest</strong>.</p>`;

    panel.querySelectorAll(".badge-share-visual img").forEach(image => {
      image.addEventListener("load", () => image.parentElement?.classList.add("has-custom-art"), {once:true});
      image.addEventListener("error", () => image.remove(), {once:true});
    });
  }

  function decorateBadgeCards() {
    const ids = new Set(ensureChest());
    document.querySelectorAll("#badgeShelf .badge-catalogue-card.earned").forEach(card => {
      const id = card.dataset.badgeId;
      const badge = badgeById(id);
      if (!badge) return;
      let actions = card.querySelector(".badge-card-share-actions");
      if (!actions) {
        actions = document.createElement("div");
        actions.className = "badge-card-share-actions";
        card.querySelector(".badge-catalogue-copy")?.appendChild(actions);
      }
      const pinned = ids.has(id);
      const full = ids.size >= MAX_CHEST_BADGES && !pinned;
      actions.innerHTML = `
        <button type="button" class="secondary-btn" data-badge-chest-toggle="${escapeHTML(id)}" ${full ? "disabled" : ""}>${pinned ? "Remove from chest" : full ? "Chest full" : "Add to chest"}</button>
        <button type="button" class="text-btn" data-share-badge="${escapeHTML(id)}">Share badge</button>`;
    });
  }

  function refresh() {
    renderChest();
    decorateBadgeCards();
  }

  function notify(message) {
    try {
      if (typeof toast === "function") { toast(message); return; }
      if (typeof showRewardBurst === "function") { showRewardBurst("🏅", message, false); return; }
    } catch {}
    console.info(message);
  }

  function toggleChestBadge(id) {
    const badge = badgeById(id);
    if (!badge || !isEarned(badge)) return;
    const data = badgeProgress();
    const index = data.chestIds.indexOf(id);
    if (index >= 0) data.chestIds.splice(index, 1);
    else {
      if (data.chestIds.length >= MAX_CHEST_BADGES) {
        notify("Your Badge Chest already contains six achievements.");
        return;
      }
      data.chestIds.push(id);
    }
    data.chestInitialized = true;
    saveState();
    refresh();
  }

  function removeChestBadge(id) {
    const data = badgeProgress();
    data.chestIds = data.chestIds.filter(item => item !== id);
    data.chestInitialized = true;
    saveState();
    refresh();
  }

  function moveChestBadge(id, delta) {
    const data = badgeProgress();
    const index = data.chestIds.indexOf(id);
    const target = index + Number(delta || 0);
    if (index < 0 || target < 0 || target >= data.chestIds.length) return;
    [data.chestIds[index], data.chestIds[target]] = [data.chestIds[target], data.chestIds[index]];
    data.chestInitialized = true;
    saveState();
    refresh();
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
    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
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

  async function drawBadge(context, badge, x, y, size) {
    const image = await loadImage(badge.image || `badges/${badge.id}.png`);
    context.save();
    roundRect(context, x, y, size, size, size * .24);
    context.fillStyle = "#f8f4e8";
    context.fill();
    context.strokeStyle = "#f4bd3f";
    context.lineWidth = Math.max(5, size * .035);
    context.stroke();
    context.clip();
    if (image) context.drawImage(image, x, y, size, size);
    else {
      context.fillStyle = "#11213d";
      context.font = `900 ${Math.round(size * .42)}px system-ui, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(badge.icon || "🏅", x + size / 2, y + size / 2);
    }
    context.restore();
  }

  function cardCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    return canvas;
  }

  function drawBackground(context) {
    const gradient = context.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#0b1730");
    gradient.addColorStop(.55, "#123c47");
    gradient.addColorStop(1, "#0b6f67");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1080, 1080);
    context.fillStyle = "rgba(247,201,72,.12)";
    context.beginPath();
    context.arc(910, 130, 240, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(120, 940, 270, 0, Math.PI * 2);
    context.fill();
  }

  function drawBranding(context, subtitle) {
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f7c948";
    context.font = "900 31px system-ui, sans-serif";
    context.fillText("SALITA QUEST", 72, 82);
    context.fillStyle = "#ffffff";
    context.font = "900 58px system-ui, sans-serif";
    context.fillText(subtitle, 72, 145);
    context.fillStyle = "rgba(255,255,255,.75)";
    context.font = "700 25px system-ui, sans-serif";
    context.fillText(`Learning ${courseLabel()}`, 74, 188);
  }

  function drawInvitation(context, campaign) {
    const url = shareRoot(campaign);
    const display = url.replace(/^https?:\/\//, "").replace(/\?.*$/, "").replace(/\/$/, "");
    context.textAlign = "center";
    context.fillStyle = "#f7c948";
    context.font = "900 30px system-ui, sans-serif";
    context.fillText("Learn Filipino languages for free with Salita Quest", 540, 995);
    context.fillStyle = "rgba(255,255,255,.86)";
    context.font = "700 22px system-ui, sans-serif";
    context.fillText(display, 540, 1032);
  }

  async function buildBadgeCard(badge) {
    const canvas = cardCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context);
    drawBranding(context, "BADGE EARNED");
    await drawBadge(context, badge, 340, 250, 400);
    context.textAlign = "center";
    context.fillStyle = "#f7c948";
    context.font = "900 27px system-ui, sans-serif";
    context.fillText(String(badge.category || "Achievement").toUpperCase(), 540, 710);
    context.fillStyle = "#ffffff";
    context.font = "900 52px system-ui, sans-serif";
    wrapText(context, badge.name, 540, 780, 850, 58, 2);
    context.fillStyle = "rgba(255,255,255,.78)";
    context.font = "700 25px system-ui, sans-serif";
    wrapText(context, badge.description, 540, 880, 820, 34, 2);
    drawInvitation(context, "badge-share");
    return canvas;
  }

  async function buildChestCard(badges) {
    const canvas = cardCanvas();
    const context = canvas.getContext("2d");
    drawBackground(context);
    drawBranding(context, "MY BADGE CHEST");
    const positions = [
      [82, 250], [388, 250], [694, 250],
      [82, 580], [388, 580], [694, 580]
    ];
    for (let index = 0; index < MAX_CHEST_BADGES; index += 1) {
      const [x, y] = positions[index];
      const badge = badges[index];
      context.save();
      roundRect(context, x, y, 284, 286, 28);
      context.fillStyle = "rgba(7,18,37,.72)";
      context.fill();
      context.strokeStyle = badge ? "rgba(247,201,72,.48)" : "rgba(255,255,255,.14)";
      context.lineWidth = 3;
      context.stroke();
      context.restore();
      if (badge) {
        await drawBadge(context, badge, x + 62, y + 22, 160);
        context.textAlign = "center";
        context.fillStyle = "#ffffff";
        context.font = "900 24px system-ui, sans-serif";
        wrapText(context, badge.name, x + 142, y + 216, 245, 27, 2);
      } else {
        context.textAlign = "center";
        context.fillStyle = "rgba(255,255,255,.28)";
        context.font = "900 58px system-ui, sans-serif";
        context.fillText("＋", x + 142, y + 135);
      }
    }
    drawInvitation(context, "badge-chest");
    return canvas;
  }

  function canvasBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Could not create share image")), "image/png"));
  }

  async function shareCanvas(canvas, {fileName, title, text, campaign}) {
    const blob = await canvasBlob(canvas);
    const url = shareRoot(campaign);
    const caption = `${text} Learn Filipino languages for free with Salita Quest: ${url}`;
    const file = typeof File === "function" ? new File([blob], fileName, {type:"image/png"}) : null;

    if (navigator.share && file && navigator.canShare?.({files:[file]})) {
      await navigator.share({title, text, url, files:[file]});
      return;
    }
    if (navigator.share) {
      await navigator.share({title, text, url});
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1200);
    try { await navigator.clipboard?.writeText(caption); } catch {}
    notify("Social card saved. The invitation caption was copied when supported.");
  }

  async function shareBadge(id, button) {
    const badge = badgeById(id);
    if (!badge || !isEarned(badge)) return;
    const original = button?.textContent;
    if (button) { button.disabled = true; button.textContent = "Preparing…"; }
    try {
      const canvas = await buildBadgeCard(badge);
      await shareCanvas(canvas, {
        fileName:`salita-quest-badge-${badge.id}.png`,
        title:`My ${badge.name} badge`,
        text:`I earned the ${badge.name} badge while learning ${courseLabel()} with Salita Quest.`,
        campaign:"badge-share"
      });
    } catch (error) {
      if (error?.name !== "AbortError") { console.error(error); notify("This badge could not be shared on this device."); }
    } finally {
      if (button) { button.disabled = false; button.textContent = original || "Share badge"; }
    }
  }

  async function shareChest(button) {
    const badges = ensureChest().map(badgeById).filter(Boolean);
    if (!badges.length) return;
    const original = button?.textContent;
    if (button) { button.disabled = true; button.textContent = "Preparing…"; }
    try {
      const canvas = await buildChestCard(badges);
      await shareCanvas(canvas, {
        fileName:"salita-quest-badge-chest.png",
        title:"My Salita Quest Badge Chest",
        text:"These are my proudest Salita Quest achievements.",
        campaign:"badge-chest"
      });
    } catch (error) {
      if (error?.name !== "AbortError") { console.error(error); notify("Your Badge Chest could not be shared on this device."); }
    } finally {
      if (button) { button.disabled = false; button.textContent = original || "Share Badge Chest"; }
    }
  }

  function install() {
    try {
      if (typeof state === "undefined" || typeof BADGES === "undefined" || typeof saveState !== "function") { retry(); return; }
    } catch { retry(); return; }
    if (window[INSTALL_FLAG]) return;
    const shelf = document.getElementById("badgeShelf");
    if (!shelf) { retry(); return; }
    window[INSTALL_FLAG] = true;

    document.addEventListener("click", event => {
      const toggle = event.target.closest("[data-badge-chest-toggle]");
      if (toggle) { toggleChestBadge(toggle.dataset.badgeChestToggle); return; }
      const share = event.target.closest("[data-share-badge]");
      if (share) { shareBadge(share.dataset.shareBadge, share); return; }
      const chestShare = event.target.closest("[data-share-badge-chest]");
      if (chestShare) { shareChest(chestShare); return; }
      const slot = event.target.closest("[data-chest-badge-id]");
      if (!slot) return;
      if (event.target.closest("[data-chest-remove]")) { removeChestBadge(slot.dataset.chestBadgeId); return; }
      const move = event.target.closest("[data-chest-move]");
      if (move) moveChestBadge(slot.dataset.chestBadgeId, move.dataset.chestMove);
    });

    shelfObserver = new MutationObserver(() => window.setTimeout(decorateBadgeCards, 0));
    shelfObserver.observe(shelf, {childList:true, subtree:true});

    const baseSwitchView = typeof switchView === "function" ? switchView : null;
    if (baseSwitchView) {
      switchView = function switchViewWithBadgeChest(view) {
        const result = baseSwitchView.apply(this, arguments);
        if (view === "badges") window.setTimeout(refresh, 30);
        return result;
      };
    }

    refresh();
  }

  install();
})();
