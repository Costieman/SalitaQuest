(() => {
  "use strict";

  if (window.__salitaAvatarCollectionTabsPhase61V2Installed) return;
  window.__salitaAvatarCollectionTabsPhase61V2Installed = true;

  const RELEASE = "phase6.2-collection-pane-flow";
  let activeTab = "collection";

  function ensureTabs(dialog) {
    let tabs = dialog.querySelector(":scope > .sq-avatar-collection-tabs");
    if (tabs) return tabs;

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
      if (button) setActive(button.dataset.avatarCollectionTab);
    });
    return tabs;
  }

  function ensurePane(dialog, tab) {
    let pane = dialog.querySelector(`:scope > .sq-avatar-${tab}-pane`);
    if (pane) return pane;
    pane = document.createElement("section");
    pane.className = `sq-avatar-${tab}-pane`;
    pane.dataset.avatarCollectionPane = tab;
    pane.setAttribute("role", "tabpanel");
    const tabs = dialog.querySelector(":scope > .sq-avatar-collection-tabs");
    if (tabs?.nextSibling) dialog.insertBefore(pane, tabs.nextSibling);
    else dialog.appendChild(pane);
    return pane;
  }

  function moveCollectionContent(dialog, collectionPane, statisticsPane, tabs) {
    const protectedNodes = new Set([
      tabs,
      collectionPane,
      statisticsPane,
      dialog.querySelector(":scope > .sq-avatar-collection-header"),
      dialog.querySelector(":scope > .sq-avatar-collection-close")
    ]);

    [...dialog.children].forEach(child => {
      if (protectedNodes.has(child)) return;
      if (child.matches?.(".sq-economy-tracking-panel, .sq-avatar-statistics-pane")) {
        statisticsPane.appendChild(child);
      } else {
        collectionPane.appendChild(child);
      }
    });

    collectionPane.querySelectorAll(":scope > *").forEach(node => {
      node.style.position = "relative";
      node.style.inset = "auto";
      node.style.transform = "none";
    });
  }

  function applyActive(dialog, tabs, collectionPane, statisticsPane) {
    tabs.querySelectorAll("[data-avatar-collection-tab]").forEach(button => {
      const selected = button.dataset.avatarCollectionTab === activeTab;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    collectionPane.hidden = activeTab !== "collection";
    statisticsPane.hidden = activeTab !== "statistics";
    dialog.dataset.activeCollectionTab = activeTab;
    if (activeTab === "statistics") window.SalitaEconomyTrackingPhase6?.render?.();
  }

  function ensureLayout() {
    const dialog = document.querySelector(".sq-avatar-collection-dialog");
    if (!dialog) return null;
    const tabs = ensureTabs(dialog);
    const collectionPane = ensurePane(dialog, "collection");
    const statisticsPane = ensurePane(dialog, "statistics");
    moveCollectionContent(dialog, collectionPane, statisticsPane, tabs);
    applyActive(dialog, tabs, collectionPane, statisticsPane);
    return {dialog, tabs, collectionPane, statisticsPane};
  }

  function setActive(tab) {
    activeTab = tab === "statistics" ? "statistics" : "collection";
    const layout = ensureLayout();
    if (layout) applyActive(layout.dialog, layout.tabs, layout.collectionPane, layout.statisticsPane);
    return activeTab;
  }

  function schedule() {
    window.setTimeout(ensureLayout, 0);
  }

  [
    "salita:open-avatar-collection",
    "salita:economy-tracking-ready",
    "salita:avatar-collection-changed",
    "salita:avatar-case-changed",
    "salita:avatar-case-ready"
  ].forEach(name => document.addEventListener(name, schedule));

  new MutationObserver(records => {
    if (records.some(record => [...record.addedNodes].some(node =>
      node instanceof Element && (
        node.matches?.(".sq-avatar-collection-dialog, .sq-economy-tracking-panel, .sq-avatar-case-panel") ||
        node.querySelector?.(".sq-avatar-collection-dialog, .sq-economy-tracking-panel, .sq-avatar-case-panel")
      )
    ))) schedule();
  }).observe(document.documentElement, {childList:true, subtree:true});

  ensureLayout();
  window.SalitaAvatarCollectionTabsPhase61 = Object.freeze({release:RELEASE,setActive,getActive:()=>activeTab,render:ensureLayout});
  document.dispatchEvent(new CustomEvent("salita:avatar-collection-tabs-ready", {detail:{release:RELEASE}}));
})();
