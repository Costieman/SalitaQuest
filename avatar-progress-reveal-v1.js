(() => {
  "use strict";

  if (window.__salitaAvatarProgressRevealV1Installed) return;
  window.__salitaAvatarProgressRevealV1Installed = true;

  function progressPercent(card) {
    const fill = card.querySelector(".avatar-page-progress span");
    const inline = fill?.style?.width || "";
    const numeric = Number.parseFloat(inline);
    if (Number.isFinite(numeric)) return Math.max(0, Math.min(100, numeric));
    const label = card.querySelector(".avatar-page-progress-label span:last-child")?.textContent || "0";
    return Math.max(0, Math.min(100, Number.parseFloat(label) || 0));
  }

  function patchCard(card) {
    const art = card.querySelector(".avatar-page-card-art");
    const source = art?.querySelector(":scope > img:not(.avatar-page-reveal-base):not(.avatar-page-reveal-colour)");
    if (!art || !source) return;

    let base = art.querySelector(".avatar-page-reveal-base");
    let colour = art.querySelector(".avatar-page-reveal-colour");
    if (!base) {
      base = source.cloneNode(true);
      base.className = "avatar-page-reveal-base";
      base.removeAttribute("loading");
      base.alt = "";
      base.setAttribute("aria-hidden", "true");
      art.appendChild(base);
    }
    if (!colour) {
      colour = source.cloneNode(true);
      colour.className = "avatar-page-reveal-colour";
      colour.removeAttribute("loading");
      colour.alt = source.alt;
      art.appendChild(colour);
    }

    source.hidden = true;
    art.style.setProperty("--avatar-reveal", `${progressPercent(card)}%`);
  }

  function patchAll(root = document) {
    root.querySelectorAll?.("[data-avatar-page-card]").forEach(patchCard);
  }

  document.addEventListener("salita:avatar-collection-changed", () => requestAnimationFrame(() => patchAll()));
  document.addEventListener("salita:view-changed", event => {
    if (event.detail?.view === "avatars") requestAnimationFrame(() => patchAll());
  });

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.("[data-avatar-page-card]") || node.querySelector?.("[data-avatar-page-card]")) {
          requestAnimationFrame(() => patchAll(document.getElementById("avatarsView") || document));
          return;
        }
      }
    }
  });

  const start = () => {
    const view = document.getElementById("avatarsView");
    if (view) {
      observer.observe(view, {childList:true, subtree:true});
      patchAll(view);
    } else {
      window.setTimeout(start, 120);
    }
  };
  start();
})();
