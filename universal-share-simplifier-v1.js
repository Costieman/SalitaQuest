(() => {
  "use strict";

  if (window.__salitaUniversalShareSimplifierV3Installed) return;
  window.__salitaUniversalShareSimplifierV3Installed = true;

  const MODAL_ID = "achievementShareModalV4";
  const QR_SRC = "https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js";
  let qrPromise = null;
  let decoratedDataUrl = "";
  let scanQueued = false;

  function loadQr() {
    if (window.QRCode) return Promise.resolve(window.QRCode);
    if (qrPromise) return qrPromise;
    qrPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-sq-qrcode]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.QRCode), {once:true});
        existing.addEventListener("error", reject, {once:true});
        return;
      }
      const script = document.createElement("script");
      script.src = QR_SRC;
      script.async = true;
      script.dataset.sqQrcode = "true";
      script.onload = () => resolve(window.QRCode);
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return qrPromise;
  }

  function shareUrl() {
    try {
      const url = new URL("./", location.href);
      url.hash = "";
      url.search = "";
      return url.toString();
    } catch {
      return location.href;
    }
  }

  async function addQrToPreview(modal) {
    const preview = modal?.querySelector("#achievementSharePreview, .achievement-share-preview img");
    if (!preview?.src || preview.dataset.qrDecorating === "true" || preview.dataset.qrDecorated === "true") return;
    preview.dataset.qrDecorating = "true";
    try {
      await loadQr();
      const source = new Image();
      source.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = source.naturalWidth || 1080;
        canvas.height = source.naturalHeight || 1080;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

        const holder = document.createElement("div");
        holder.style.cssText = "position:fixed;left:-9999px;top:-9999px";
        document.body.appendChild(holder);
        new window.QRCode(holder, {
          text:shareUrl(), width:180, height:180,
          colorDark:"#10213b", colorLight:"#ffffff",
          correctLevel:window.QRCode.CorrectLevel.H
        });
        requestAnimationFrame(() => {
          const qr = holder.querySelector("canvas, img");
          if (!qr) { holder.remove(); delete preview.dataset.qrDecorating; return; }
          const size = Math.round(canvas.width * .16);
          const pad = Math.round(canvas.width * .025);
          const x = canvas.width - size - pad;
          const y = canvas.height - size - pad;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") ctx.roundRect(x - 12, y - 12, size + 24, size + 24, 18);
          else ctx.rect(x - 12, y - 12, size + 24, size + 24);
          ctx.fill();
          ctx.drawImage(qr, x, y, size, size);
          decoratedDataUrl = canvas.toDataURL("image/png", 1);
          preview.src = decoratedDataUrl;
          preview.dataset.qrDecorated = "true";
          delete preview.dataset.qrDecorating;
          holder.remove();
        });
      };
      source.onerror = () => { delete preview.dataset.qrDecorating; };
      source.src = preview.src;
    } catch (error) {
      delete preview.dataset.qrDecorating;
      console.warn("QR code could not be added to the share card", error);
    }
  }

  function findAction(root, pattern) {
    const candidates = [...root.querySelectorAll("button, a, [role='button']")];
    return candidates.find(node => pattern.test((node.textContent || "").trim())) || null;
  }

  function makeControls(root, sendAction, saveAction) {
    let controls = root.querySelector(":scope > .sq-share-two-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "sq-share-two-controls";
      controls.innerHTML = `
        <button type="button" class="sq-share-primary" data-sq-share-proxy>Share</button>
        <button type="button" class="sq-share-secondary" data-sq-save-proxy>Save</button>`;
      root.appendChild(controls);
    }
    controls.hidden = false;
    controls.querySelector("[data-sq-share-proxy]").onclick = event => {
      event.preventDefault();
      sendAction?.click();
    };
    controls.querySelector("[data-sq-save-proxy]").onclick = event => {
      event.preventDefault();
      saveAction?.click();
    };
    return controls;
  }

  function simplifyLegacy(dialog) {
    if (!dialog || dialog.id === MODAL_ID) return false;
    const text = dialog.textContent || "";
    if (!/Send in a messaging app/i.test(text) || !/Download image/i.test(text)) return false;

    const send = findAction(dialog, /Send in a messaging app/i);
    const save = findAction(dialog, /Download image/i);
    if (!send || !save) return false;

    let actionArea = dialog.querySelector(".sq-share-clean-action-area");
    if (!actionArea) {
      actionArea = document.createElement("div");
      actionArea.className = "sq-share-clean-action-area";
      const preview = dialog.querySelector("img, canvas")?.closest("section, article, div");
      const candidate = [...dialog.children].find(child => child !== preview && child.querySelector?.("button, a, [role='button']"));
      (candidate || dialog).appendChild(actionArea);
    }

    dialog.querySelectorAll("button, a, [role='button']").forEach(node => {
      if (node.closest(".sq-share-two-controls") || node.matches("[data-close-achievement-share], [aria-label='Close']")) return;
      node.classList.add("sq-share-original-action");
    });
    dialog.querySelectorAll("section, article").forEach(node => {
      if (node.contains(send) || node.contains(save)) node.classList.add("sq-share-original-panel");
    });

    makeControls(actionArea, send, save);
    dialog.classList.add("sq-global-share-clean");
    return true;
  }

  function simplifyAchievement(modal) {
    if (!modal) return;
    const actions = modal.querySelector(".achievement-share-secondary");
    if (!actions) return;

    let native = actions.querySelector("[data-achievement-native]");
    let download = actions.querySelector("[data-achievement-download]");
    if (!native || !download) {
      actions.innerHTML = `
        <button type="button" hidden data-achievement-native>Share</button>
        <button type="button" hidden data-achievement-download>Save</button>`;
      native = actions.querySelector("[data-achievement-native]");
      download = actions.querySelector("[data-achievement-download]");
    }

    modal.querySelector("#achievementSharePlatforms")?.setAttribute("hidden", "");
    modal.querySelectorAll(".achievement-share-content > :not(.achievement-share-secondary)").forEach(node => node.hidden = true);
    modal.querySelector(".achievement-share-preview small")?.setAttribute("hidden", "");
    actions.classList.add("sq-share-clean-action-area");
    makeControls(actions, native, download);
    modal.classList.add("sq-global-share-clean");
    addQrToPreview(modal);
  }

  function scan() {
    scanQueued = false;
    const achievement = document.getElementById(MODAL_ID);
    if (achievement) simplifyAchievement(achievement);
    document.querySelectorAll("[role='dialog'], .modal, .share-modal, .share-sheet").forEach(simplifyLegacy);
  }

  function scheduleScan() {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(scan);
  }

  document.addEventListener("click", event => {
    const save = event.target.closest?.("[data-achievement-download]");
    if (!save || !decoratedDataUrl) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const link = document.createElement("a");
    link.href = decoratedDataUrl;
    link.download = "salita-quest-achievement-card.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, true);

  new MutationObserver(records => {
    if (records.some(record => record.addedNodes.length || record.removedNodes.length)) scheduleScan();
  }).observe(document.documentElement, {childList:true, subtree:true});

  document.addEventListener("salita:achievement-share-prepared", () => {
    decoratedDataUrl = "";
    scheduleScan();
    window.setTimeout(scheduleScan, 60);
    window.setTimeout(scheduleScan, 220);
  });

  scheduleScan();
})();