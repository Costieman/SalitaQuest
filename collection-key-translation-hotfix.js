(() => {
  "use strict";

  const PLACEHOLDERS = new Set([
    "part of the expression",
    "part-of-the-expression",
    "expression part",
    "grammar component",
    "component of the expression"
  ]);

  function cleanTokenTranslations() {
    try {
      if (typeof ITEMS !== "undefined" && Array.isArray(ITEMS)) {
        ITEMS.forEach(item => {
          const tokens = item?.analysis?.tokens;
          if (!Array.isArray(tokens)) return;
          tokens.forEach(token => {
            if (!Array.isArray(token) || token.length < 2) return;
            const value = String(token[1] ?? "").trim().toLowerCase();
            if (!PLACEHOLDERS.has(value)) return;
            if (tokens.length === 1 && item.meaning) token[1] = item.meaning;
            else if (item.natural) token[1] = item.natural;
            else if (item.meaning) token[1] = item.meaning;
          });
        });
      }
    } catch (error) {
      console.warn("Could not normalise direct translations", error);
    }
  }

  function patchRenderedTranslations(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const matches = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (PLACEHOLDERS.has(String(node.nodeValue || "").trim().toLowerCase())) matches.push(node);
    }
    matches.forEach(node => {
      const row = node.parentElement?.closest("[data-token], .token-row, .breakdown-row, li, tr, .analysis-token");
      const source = row?.querySelector("[data-translation], .translation, .token-meaning, dd, td:last-child");
      const replacement = source && source !== node.parentElement ? source.textContent.trim() : "Meaning unavailable — content review required";
      node.nodeValue = replacement;
      row?.classList.add("sq-translation-review-needed");
    });
  }

  function canonicalKeyCount() {
    try {
      if (typeof state === "undefined") return null;
      const chest = state.weeklyAvatarChest || (state.weeklyAvatarChest = {});
      const dates = Array.isArray(chest.keyDates) ? chest.keyDates.filter(Boolean) : [];
      const consumed = new Set((Array.isArray(chest.keyRunClaims) ? chest.keyRunClaims : [])
        .flatMap(claim => Array.isArray(claim?.keyDates) ? claim.keyDates : []));
      const available = [...new Set(dates)].filter(date => !consumed.has(date));
      return Math.min(6, available.length);
    } catch {
      return null;
    }
  }

  function patchKeyCard() {
    const host = document.getElementById("questChest");
    const count = canonicalKeyCount();
    if (!host || count == null) return;
    const title = host.querySelector("#questChestTitle, strong");
    if (title && count < 6) title.textContent = `Daily Keys collected · ${count}/6`;
    const meter = host.querySelector(".weekly-key-meter");
    if (meter) {
      meter.setAttribute("aria-label", `${count} of 6 Daily Keys collected`);
      [...meter.children].forEach((slot, index) => {
        slot.classList.toggle("collected", index < count);
        slot.textContent = index < count ? "🔑" : "";
      });
    }
  }

  function patchCollectionModal() {
    const modal = document.querySelector(".avatar-collection-modal, [data-avatar-collection-modal], #avatarCollectionModal");
    if (!modal) return;
    modal.classList.add("sq-desktop-collection-safe");
    modal.querySelectorAll("img").forEach(image => {
      image.style.objectFit = "contain";
      image.style.objectPosition = "center";
    });
  }

  cleanTokenTranslations();
  const observer = new MutationObserver(() => {
    patchRenderedTranslations();
    patchKeyCard();
    patchCollectionModal();
  });
  observer.observe(document.documentElement, {subtree:true, childList:true});
  document.addEventListener("DOMContentLoaded", () => {
    patchRenderedTranslations();
    patchKeyCard();
    patchCollectionModal();
  });
  window.setInterval(patchKeyCard, 1000);
})();
