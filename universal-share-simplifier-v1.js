(() => {
  "use strict";

  if (window.__salitaUniversalShareSimplifierV1Installed) return;
  window.__salitaUniversalShareSimplifierV1Installed = true;

  const MODAL_ID = "achievementShareModalV4";

  function simplify(modal) {
    if (!modal) return;

    const platforms = modal.querySelector("#achievementSharePlatforms");
    const actions = modal.querySelector(".achievement-share-secondary");
    const previewNote = modal.querySelector(".achievement-share-preview small");
    if (!actions) return;

    if (platforms) {
      platforms.hidden = true;
      platforms.setAttribute("aria-hidden", "true");
    }

    actions.classList.add("achievement-share-universal-actions");
    actions.innerHTML = `
      <button class="achievement-share-main-action" type="button" data-achievement-platform="whatsapp">Send</button>
      <button class="achievement-share-download-action" type="button" data-achievement-download>Save</button>`;

    if (previewNote) previewNote.hidden = true;
    modal.classList.add("achievement-share-two-action-only");
    modal.dataset.universalShareSimplified = "true";
  }

  function install() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) simplify(modal);
  }

  install();

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.id === MODAL_ID) {
          simplify(node);
          return;
        }
        const modal = node.querySelector?.(`#${MODAL_ID}`);
        if (modal) {
          simplify(modal);
          return;
        }
      }
    }
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});

  document.addEventListener("salita:achievement-share-prepared", install);
})();