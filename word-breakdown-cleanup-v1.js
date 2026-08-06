(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestWordBreakdownCleanupV1";
  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  const FALLBACKS = new Set([
    "see phrase translation",
    "translation pending content review",
    "part of the expression",
    "part-of-the-expression",
    "expression part",
    "grammar component",
    "component of the expression",
    "direct component"
  ]);

  function normalise(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim().toLocaleLowerCase();
  }

  function isFallback(value) {
    return FALLBACKS.has(normalise(value));
  }

  function textNodes(root) {
    if (!root || !document.createTreeWalker) return [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function findFeedbackMeaning(root = document) {
    for (const node of textNodes(root)) {
      const text = String(node.nodeValue || "").replace(/\s+/g, " ").trim();
      const match = text.match(/^(.+?)\s+means\s+[“\"](.+?)[”\"]\.?$/i);
      if (!match) continue;
      const source = match[1].trim();
      const meaning = match[2].trim();
      if (source && meaning) return {source, meaning, anchor: node.parentElement};
    }
    return null;
  }

  function findBreakdownPanel(anchor = document.body) {
    const headings = textNodes(document).filter(node => normalise(node.nodeValue) === "word by word");
    for (const heading of headings) {
      let panel = heading.parentElement;
      for (let depth = 0; panel && depth < 7; depth += 1, panel = panel.parentElement) {
        const text = normalise(panel.textContent);
        if (text.includes("direct translation") && [...FALLBACKS].some(value => text.includes(value))) return panel;
      }
    }
    if (!anchor) return null;
    let panel = anchor;
    for (let depth = 0; panel && depth < 8; depth += 1, panel = panel.parentElement) {
      const text = normalise(panel.textContent);
      if (text.includes("word by word") && text.includes("direct translation")) return panel;
    }
    return null;
  }

  function fallbackElements(panel) {
    const elements = [];
    for (const node of textNodes(panel)) {
      if (!isFallback(node.nodeValue)) continue;
      const element = node.parentElement;
      if (element && !elements.includes(element)) elements.push(element);
    }
    return elements;
  }

  function findCard(element, panel) {
    let card = element;
    for (let depth = 0; card && card !== panel && depth < 5; depth += 1, card = card.parentElement) {
      const parent = card.parentElement;
      if (!parent) break;
      const siblingsWithFallback = [...parent.children].filter(child =>
        textNodes(child).some(node => isFallback(node.nodeValue))
      );
      if (siblingsWithFallback.length >= 2) return card;
    }
    return element.parentElement || element;
  }

  function replaceCard(card, fallbackElement, source, meaning) {
    const candidates = [...card.querySelectorAll("strong, b, .token, .word, [data-token], span, div")]
      .filter(element => element !== fallbackElement && !element.contains(fallbackElement))
      .filter(element => element.children.length === 0 && element.textContent.trim());
    const label = candidates[0];
    if (label) label.textContent = source;
    else {
      const sourceNode = document.createElement("strong");
      sourceNode.textContent = source;
      card.insertBefore(sourceNode, card.firstChild);
    }
    fallbackElement.textContent = meaning;
    card.style.gridColumn = "1 / -1";
    card.dataset.sqSingleWordBreakdown = "true";
    card.setAttribute("aria-label", `${source}: ${meaning}`);
  }

  function collapseVocabularyBreakdown(root = document) {
    const result = findFeedbackMeaning(root);
    if (!result) return;
    const sourceWords = result.source.split(/\s+/).filter(Boolean);
    if (sourceWords.length !== 1) return;

    const panel = findBreakdownPanel(result.anchor);
    if (!panel || panel.dataset.sqVocabularyBreakdownCleaned === "true") return;
    const fallbacks = fallbackElements(panel);
    if (!fallbacks.length) return;

    const cards = fallbacks.map(element => findCard(element, panel));
    const uniqueCards = [...new Set(cards)];
    if (!uniqueCards.length) return;

    replaceCard(uniqueCards[0], fallbacks[0], result.source, result.meaning);
    uniqueCards.slice(1).forEach(card => {
      card.hidden = true;
      card.setAttribute("aria-hidden", "true");
    });

    const grid = uniqueCards[0].parentElement;
    if (grid) {
      grid.dataset.sqSingleWordGrid = "true";
      grid.style.gridTemplateColumns = "minmax(0, 1fr)";
    }
    panel.dataset.sqVocabularyBreakdownCleaned = "true";
  }

  let queued = false;
  function schedule(root = document) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      collapseVocabularyBreakdown(root);
    });
  }

  new MutationObserver(records => {
    if (records.some(record => record.addedNodes.length || record.type === "characterData")) schedule(document);
  }).observe(document.documentElement, {subtree: true, childList: true, characterData: true});

  document.addEventListener("DOMContentLoaded", () => schedule(document), {once: true});
  document.addEventListener("salita:exercise-rendered", () => schedule(document));
  document.addEventListener("salita:answer-rendered", () => schedule(document));
  schedule(document);
})();
