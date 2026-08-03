(() => {
  "use strict";

  if (window.__salitaAvatarCardActionsV1Installed) return;
  window.__salitaAvatarCardActionsV1Installed = true;

  const style = document.createElement("style");
  style.textContent = `
    .avatar-page-card.is-owned .avatar-page-card-actions{grid-template-columns:repeat(2,minmax(0,1fr))}
    .avatar-page-card.is-owned .avatar-page-card-actions button{width:100%}
    .avatar-page-card.is-locked .avatar-page-card-actions{grid-template-columns:1fr}
    @media(max-width:650px){.avatar-page-card.is-owned .avatar-page-card-actions{grid-template-columns:1fr 1fr}.avatar-page-card.is-owned .avatar-page-card-actions button{display:block!important}}
  `;
  document.head.appendChild(style);

  function ensureDailyKeyReconciliation() {
    if (window.__salitaDailyKeyWeekdayReconciliationV1Installed || document.querySelector('script[data-sq-daily-key-reconciliation]')) return;
    const script = document.createElement("script");
    script.src = "./daily-key-weekday-reconciliation-v1.js?v=1.0";
    script.dataset.sqDailyKeyReconciliation = "true";
    script.onerror = () => console.warn("Daily Key reconciliation could not be loaded.");
    document.body.appendChild(script);
  }

  function getItem(id) {
    return window.SalitaAvatarModel?.get?.(id) || null;
  }

  function isOwned(id) {
    try {
      const store = JSON.parse(localStorage.getItem("salitaQuestLocalProfilesV1") || "null");
      const activeId = sessionStorage.getItem("salitaQuestActiveProfileId");
      const profile = store?.profiles?.find(item => item.id === activeId);
      const collection = window.SalitaAvatarModel?.normaliseCollectionState?.(profile?.avatarCollection, profile?.avatarId);
      return Boolean(collection?.ownedAvatarIds?.includes(id));
    } catch {
      return false;
    }
  }

  function isDisplayed(id) {
    return Boolean(window.SalitaQuestAvatarCase?.getIds?.().includes(id));
  }

  function addToDisplay(id) {
    const api = window.SalitaQuestAvatarCase;
    if (!api) return;
    const ids = api.getIds();
    if (ids.includes(id)) return;
    if (ids.length >= api.max) {
      api.openPicker();
      return;
    }
    api.setIds([...ids, id]);
  }

  async function shareAvatar(id) {
    const item = getItem(id);
    if (!item) return;
    const text = `I unlocked ${item.name}, a ${item.rarity} avatar in Salita Quest.`;
    const shareData = {title:`${item.name} — Salita Quest`, text, url:location.origin};
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(`${text} ${location.origin}`);
      const button = document.querySelector(`[data-avatar-page-share="${CSS.escape(id)}"]`);
      if (button) {
        const original = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = original; }, 1200);
      }
    } catch (error) {
      if (error?.name !== "AbortError") console.warn("Avatar sharing was unavailable", error);
    }
  }

  function patchCard(card) {
    const id = card.dataset.avatarPageCard;
    if (!id) return;
    const owned = isOwned(id);
    const actions = card.querySelector(".avatar-page-card-actions");
    if (!actions) return;

    const primary = actions.querySelector("[data-avatar-page-primary]");
    const info = actions.querySelector("[data-avatar-page-detail]");

    if (!owned) {
      if (primary) {
        primary.textContent = "Details";
        primary.dataset.avatarPageDetail = id;
        delete primary.dataset.avatarPagePrimary;
      }
      info?.remove();
      return;
    }

    if (info) info.textContent = "Details";
    if (!actions.querySelector("[data-avatar-page-display]")) {
      const display = document.createElement("button");
      display.type = "button";
      display.dataset.avatarPageDisplay = id;
      actions.appendChild(display);
    }
    if (!actions.querySelector("[data-avatar-page-share]")) {
      const share = document.createElement("button");
      share.type = "button";
      share.dataset.avatarPageShare = id;
      share.textContent = "Share";
      actions.appendChild(share);
    }
    const display = actions.querySelector("[data-avatar-page-display]");
    const displayed = isDisplayed(id);
    display.textContent = displayed ? "Displayed" : "Display";
    display.disabled = displayed;
  }

  function patchAll(root = document) {
    root.querySelectorAll?.("[data-avatar-page-card]").forEach(patchCard);
  }

  document.addEventListener("click", event => {
    const display = event.target.closest("[data-avatar-page-display]");
    if (display) {
      event.preventDefault();
      event.stopImmediatePropagation();
      addToDisplay(display.dataset.avatarPageDisplay);
      patchAll();
      return;
    }
    const share = event.target.closest("[data-avatar-page-share]");
    if (share) {
      event.preventDefault();
      event.stopImmediatePropagation();
      shareAvatar(share.dataset.avatarPageShare);
    }
  }, true);

  const observer = new MutationObserver(records => {
    if (records.some(record => [...record.addedNodes].some(node => node.nodeType === Node.ELEMENT_NODE))) patchAll();
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});

  document.addEventListener("salita:avatar-case-changed", () => patchAll());
  document.addEventListener("salita:avatar-collection-changed", () => window.setTimeout(patchAll, 0));
  ensureDailyKeyReconciliation();
  patchAll();
})();