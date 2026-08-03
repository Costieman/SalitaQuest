(() => {
  "use strict";

  if (window.__salitaUniversalShareSimplifierV3Installed) return;
  window.__salitaUniversalShareSimplifierV3Installed = true;

  const MODAL_ID = "achievementShareModalV4";
  const QR_SRC = "https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js";
  let qrPromise = null;
  let decoratedDataUrl = "";
  let legacySendAction = null;
  let legacySaveAction = null;

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
    if (!preview?.src || preview.dataset.qrDecorated === "true") return;
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
        new window.QRCode(holder, {text:shareUrl(),width:180,height:180,colorDark:"#10213b",colorLight:"#ffffff",correctLevel:window.QRCode.CorrectLevel.H});
        requestAnimationFrame(() => {
          const qr = holder.querySelector("canvas, img");
          if (!qr) { holder.remove(); return; }
          const size = Math.round(canvas.width * .16);
          const pad = Math.round(canvas.width * .025);
          const x = canvas.width - size - pad;
          const y = canvas.height - size - pad;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(x - 12, y - 12, size + 24, size + 24, 18);
          ctx.fill();
          ctx.drawImage(qr, x, y, size, size);
          decoratedDataUrl = canvas.toDataURL("image/png", 1);
          preview.src = decoratedDataUrl;
          preview.dataset.qrDecorated = "true";
          holder.remove();
        });
      };
      source.src = preview.src;
    } catch (error) {
      console.warn("QR code could not be added to the share card", error);
    }
  }

  function actionable(node) {
    return node?.closest?.("button, a, [role='button']") || null;
  }

  function findLegacyAction(root, pattern) {
    return [...root.querySelectorAll("button, a, [role='button']")]
      .find(node => pattern.test(node.textContent || "")) || null;
  }

  function ensureProxyActions(root) {
    legacySendAction = findLegacyAction(root, /Send in a messaging app/i) || legacySendAction;
    legacySaveAction = findLegacyAction(root, /Download image/i) || legacySaveAction;
    if (!legacySendAction || !legacySaveAction) return false;

    let proxy = root.querySelector(".sq-global-share-proxy-actions");
    if (!proxy) {
      proxy = document.createElement("div");
      proxy.className = "sq-global-share-proxy-actions";
      proxy.innerHTML = `
        <button type="button" class="sq-global-share-share" data-sq-global-share>Share</button>
        <button type="button" class="sq-global-share-save" data-sq-global-save>Save</button>`;
      root.appendChild(proxy);
    }

    [...root.querySelectorAll("button, a, [role='button'], article, section")].forEach(node => {
      if (proxy.contains(node)) return;
      const text = node.textContent || "";
      if (/Post to social media|Send in a messaging app|Copy caption and link|Download image/i.test(text)) {
        const action = actionable(node);
        if (action && !proxy.contains(action)) action.hidden = true;
      }
    });
    root.classList.add("sq-global-share-two-actions");
    return true;
  }

  function simplifyAchievement(modal) {
    if (!modal) return;
    const platforms = modal.querySelector("#achievementSharePlatforms");
    const actions = modal.querySelector(".achievement-share-secondary");
    if (!actions) return;
    if (platforms) platforms.hidden = true;
    actions.classList.add("achievement-share-universal-actions");
    actions.innerHTML = `
      <button class="achievement-share-main-action" type="button" data-achievement-platform="whatsapp">Share</button>
      <button class="achievement-share-download-action" type="button" data-achievement-download>Save</button>`;
    modal.querySelectorAll(".achievement-share-content > :not(.achievement-share-secondary)").forEach(node => node.hidden = true);
    modal.querySelector(".achievement-share-preview small")?.setAttribute("hidden", "");
    addQrToPreview(modal);
  }

  function scan(root = document) {
    const modal = document.getElementById(MODAL_ID);
    if (modal) simplifyAchievement(modal);
    [...root.querySelectorAll?.("[role='dialog'], .modal, .share-modal, .share-sheet") || []].forEach(ensureProxyActions);
  }

  function activateLegacy(action) {
    if (!action || !action.isConnected) return false;
    action.hidden = false;
    action.dispatchEvent(new MouseEvent("click", {bubbles:true,cancelable:true,view:window}));
    action.hidden = true;
    return true;
  }

  document.addEventListener("click", event => {
    const share = event.target.closest?.("[data-sq-global-share]");
    if (share) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!activateLegacy(legacySendAction)) {
        scan(document);
        activateLegacy(legacySendAction);
      }
      return;
    }
    const saveProxy = event.target.closest?.("[data-sq-global-save]");
    if (saveProxy) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!activateLegacy(legacySaveAction)) {
        scan(document);
        activateLegacy(legacySaveAction);
      }
      return;
    }
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
    if (records.some(record => record.addedNodes.length)) requestAnimationFrame(() => scan(document));
  }).observe(document.documentElement, {childList:true, subtree:true});

  document.addEventListener("salita:achievement-share-prepared", () => requestAnimationFrame(() => scan(document)));
  scan(document);
})();