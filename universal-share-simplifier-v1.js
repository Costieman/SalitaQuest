(() => {
  "use strict";

  if (window.__salitaUniversalShareSimplifierV2Installed) return;
  window.__salitaUniversalShareSimplifierV2Installed = true;

  const MODAL_ID = "achievementShareModalV4";
  const QR_SRC = "https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js";
  let qrPromise = null;
  let decoratedDataUrl = "";

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
        new window.QRCode(holder, {
          text: shareUrl(), width: 180, height: 180,
          colorDark: "#10213b", colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.H
        });
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

  function clickable(node) {
    return node?.closest?.("button, a, [role='button']") || node;
  }

  function simplifyLegacy(root) {
    const text = root?.textContent || "";
    if (!/Send in a messaging app/i.test(text) || !/Download image/i.test(text)) return false;

    const all = [...root.querySelectorAll("button, a, [role='button'], article, section, div")];
    const sendNode = all.find(node => /Send in a messaging app/i.test(node.textContent || ""));
    const saveNode = all.find(node => /Download image/i.test(node.textContent || ""));
    const send = clickable(sendNode);
    const save = clickable(saveNode);
    if (!send || !save) return false;

    const keep = new Set([send, save]);
    all.forEach(node => {
      const value = node.textContent || "";
      const isOption = /Post to social media|Send in a messaging app|Copy caption and link|Download image/i.test(value);
      if (isOption && !keep.has(clickable(node)) && !node.contains(send) && !node.contains(save)) node.hidden = true;
    });

    [send, save].forEach(node => {
      node.hidden = false;
      node.classList.add("sq-global-share-choice");
    });
    send.textContent = "Share";
    save.textContent = "Save";
    root.classList.add("sq-global-share-two-actions");
    root.dataset.shareSimplified = "true";
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
    modal.dataset.universalShareSimplified = "true";
    addQrToPreview(modal);
  }

  function scan(root = document) {
    const modal = document.getElementById(MODAL_ID);
    if (modal) simplifyAchievement(modal);
    const dialogs = [...root.querySelectorAll?.("[role='dialog'], .modal, .share-modal, .share-sheet") || []];
    dialogs.forEach(simplifyLegacy);
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
    if (records.some(record => record.addedNodes.length)) requestAnimationFrame(() => scan(document));
  }).observe(document.documentElement, {childList:true, subtree:true});

  document.addEventListener("salita:achievement-share-prepared", () => requestAnimationFrame(() => scan(document)));
  scan(document);
})();