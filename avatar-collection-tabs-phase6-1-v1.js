(() => {
  "use strict";

  if (window.__salitaAvatarCollectionTabsPhase61V1Installed) return;
  window.__salitaAvatarCollectionTabsPhase61V1Installed = true;

  const RELEASE = "phase6.1-collection-statistics-tabs";
  let activeTab = "collection";

  function directChildren(dialog) {
    return [...dialog.children];
  }

  function ensureTabs() {
    const dialog = document.querySelector(".sq-avatar-collection-dialog");
    if (!dialog) return null;

    let tabs = dialog.querySelector(":scope > .sq-avatar-collection-tabs");
    if (!tabs) {
      tabs = document.createElement("nav");
      tabs.className = "sq-avatar-collection-tabs";
      tabs.setAttribute("role", "tablist");
      tabs.setAttribute("aria-label", "Avatar Collection views");
      tabs.innerHTML = `
        <button type="button" role="tab" data-avatar-collection-tab="collection" aria-selected="true">Collection</button>
        <button type="button" role="tab" data-avatar-collection-tab="statistics" aria-selected="false">Statistics</button>`;

      const header = dialog.querySelector(":scope > .sq-avatar-collection-header");
      if (header?.nextSibling) dialog.insertBefore(tabs, header.nextSibling);
      else dialog.prepend(tabs);

      tabs.addEventListener("click", event => {
        const button = event.target.closest("[data-avatar-collection-tab]");
        if (!button) return;
        setActive(button.dataset.avatarCollectionTab);
      });
    }

    const economy = dialog.querySelector(":scope > .sq-economy-tracking-panel");
    if (economy) {
      economy.classList.add("sq-avatar-statistics-pane");
      economy.setAttribute("role", "tabpanel");
      economy.dataset.avatarCollectionPane = "statistics";
    }

    directChildren(dialog).forEach(child => {
      if (
        child === tabs ||
        child.matches(".sq-avatar-collection-header") ||
        child.matches(".sq-avatar-collection-close") ||
        child.matches(".sq-avatar-statistics-pane")
      ) return;
      child.dataset.avatarCollectionPane = "collection";
    });

    applyActive(dialog, tabs);
    return tabs;
  }

  function applyActive(dialog, tabs) {
    tabs.querySelectorAll("[data-avatar-collection-tab]").forEach(button => {
      const selected = button.dataset.avatarCollectionTab === activeTab;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    dialog.querySelectorAll(":scope > [data-avatar-collection-pane]").forEach(node => {
      node.hidden = node.dataset.avatarCollectionPane !== activeTab;
    });

    dialog.dataset.activeCollectionTab = activeTab;
    if (activeTab === "statistics") window.SalitaEconomyTrackingPhase6?.render?.();
  }

  function setActive(tab) {
    activeTab = tab === "statistics" ? "statistics" : "collection";
    const dialog = document.querySelector(".sq-avatar-collection-dialog");
    const tabs = dialog?.querySelector(":scope > .sq-avatar-collection-tabs");
    if (dialog && tabs) applyActive(dialog, tabs);
    return activeTab;
  }

  function schedule() {
    window.setTimeout(ensureTabs, 0);
  }

  [
    "salita:open-avatar-collection",
    "salita:economy-tracking-ready",
    "salita:avatar-collection-changed"
  ].forEach(name => document.addEventListener(name, schedule));

  new MutationObserver(records => {
    if (records.some(record => [...record.addedNodes].some(node =>
      node instanceof Element && (
        node.matches?.(".sq-avatar-collection-dialog, .sq-economy-tracking-panel") ||
        node.querySelector?.(".sq-avatar-collection-dialog, .sq-economy-tracking-panel")
      )
    ))) schedule();
  }).observe(document.documentElement, {childList:true, subtree:true});

  ensureTabs();
  window.SalitaAvatarCollectionTabsPhase61 = Object.freeze({release:RELEASE,setActive,getActive:()=>activeTab,render:ensureTabs});
  document.dispatchEvent(new CustomEvent("salita:avatar-collection-tabs-ready", {detail:{release:RELEASE}}));
})();
