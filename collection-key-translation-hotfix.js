(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestCollectionKeyTranslationHotfixV2";
  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  const KEY_TARGET = 6;
  const PLACEHOLDERS = new Set([
    "part of the expression",
    "part-of-the-expression",
    "expression part",
    "grammar component",
    "component of the expression"
  ]);

  function ensureAvatarCaseStyles() {
    if (document.querySelector('link[data-sq-avatar-case-desktop-safety]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./avatar-case-desktop-safety.css?v=5.5.11";
    link.dataset.sqAvatarCaseDesktopSafety = "true";
    document.head.appendChild(link);
  }

  function dateKeyToNumber(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  function todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function isPlaceholder(value) {
    return PLACEHOLDERS.has(String(value ?? "").trim().toLowerCase());
  }

  function cleanTokenTranslations() {
    try {
      if (typeof ITEMS === "undefined" || !Array.isArray(ITEMS)) return;
      ITEMS.forEach(item => {
        const tokens = item?.analysis?.tokens;
        if (!Array.isArray(tokens)) return;
        tokens.forEach(token => {
          if (!Array.isArray(token) || token.length < 2 || !isPlaceholder(token[1])) return;
          token[1] = tokens.length === 1 && item.meaning
            ? item.meaning
            : "Translation pending content review";
        });
      });
    } catch (error) {
      console.warn("Could not validate direct translations", error);
    }
  }

  function patchRenderedTranslations(root = document) {
    if (!root || !document.createTreeWalker) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const matches = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (isPlaceholder(node.nodeValue)) matches.push(node);
    }
    matches.forEach(node => {
      const row = node.parentElement?.closest("[data-token], .token-row, .breakdown-row, li, tr, .analysis-token");
      node.nodeValue = "Translation pending content review";
      row?.classList.add("sq-translation-review-needed");
    });
  }

  function canonicalRunDates() {
    try {
      if (typeof state === "undefined") return null;
      const chest = state.weeklyAvatarChest;
      if (!chest || typeof chest !== "object") return [];
      const consumed = new Set((Array.isArray(chest.keyRunClaims) ? chest.keyRunClaims : [])
        .flatMap(claim => Array.isArray(claim?.keyDates) ? claim.keyDates : []));
      const available = [...new Set((Array.isArray(chest.keyDates) ? chest.keyDates : [])
        .filter(date => date && !consumed.has(date)))]
        .filter(date => dateKeyToNumber(date) != null)
        .sort();
      if (!available.length) return [];

      const latest = available[available.length - 1];
      const latestNumber = dateKeyToNumber(latest);
      const todayNumber = dateKeyToNumber(todayKey());
      if (latestNumber == null || todayNumber == null || (todayNumber - latestNumber) / 86400000 > 1) return [];

      const run = [latest];
      for (let index = available.length - 2; index >= 0; index -= 1) {
        const candidate = available[index];
        const candidateNumber = dateKeyToNumber(candidate);
        const firstNumber = dateKeyToNumber(run[0]);
        if (candidateNumber == null || firstNumber == null || (firstNumber - candidateNumber) / 86400000 !== 1) break;
        run.unshift(candidate);
      }
      return run.slice(-KEY_TARGET);
    } catch {
      return null;
    }
  }

  function patchKeyCard() {
    const host = document.getElementById("questChest");
    const dates = canonicalRunDates();
    if (!host || dates == null) return;
    const count = Math.min(KEY_TARGET, dates.length);
    const title = host.querySelector("#questChestTitle, strong");
    if (title && count < KEY_TARGET) title.textContent = `Daily Keys collected · ${count}/${KEY_TARGET}`;
    const meter = host.querySelector(".weekly-key-meter");
    if (!meter) return;
    meter.setAttribute("aria-label", `${count} of ${KEY_TARGET} consecutive Daily Keys collected`);
    [...meter.children].forEach((slot, index) => {
      slot.classList.toggle("collected", index < count);
      slot.textContent = index < count ? "🔑" : "";
    });
  }

  function patchCollectionModal(root = document) {
    const selector = ".sq-avatar-case-picker, .avatar-collection-modal, [data-avatar-collection-modal], #avatarCollectionModal";
    const modals = [];
    if (root instanceof Element && root.matches(selector)) modals.push(root);
    root.querySelectorAll?.(selector).forEach(modal => modals.push(modal));

    modals.forEach(modal => {
      modal.classList.add("sq-desktop-collection-safe");
      modal.querySelectorAll("img").forEach(image => {
        image.style.objectFit = "contain";
        image.style.objectPosition = "center";
        image.style.transform = "none";
      });
    });
  }

  let queued = false;
  function schedulePatch(root = document) {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      patchRenderedTranslations(root);
      patchKeyCard();
      patchCollectionModal(root);
    });
  }

  ensureAvatarCaseStyles();
  cleanTokenTranslations();
  const observer = new MutationObserver(records => {
    const relevant = records.some(record => [...record.addedNodes].some(node => node.nodeType === Node.ELEMENT_NODE));
    if (relevant) schedulePatch(document);
  });
  observer.observe(document.documentElement, {subtree:true, childList:true});

  document.addEventListener("DOMContentLoaded", () => schedulePatch(document), {once:true});
  document.addEventListener("salita:state-changed", patchKeyCard);
  document.addEventListener("salita:daily-quests-rendered", patchKeyCard);
  schedulePatch(document);
})();
