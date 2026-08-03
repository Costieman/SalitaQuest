(() => {
  "use strict";

  if (window.__salitaDailyKeyWeekdayReconciliationV1Installed) return;
  window.__salitaDailyKeyWeekdayReconciliationV1Installed = true;

  const KEY_TARGET = 6;
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function appState() {
    try { return typeof state !== "undefined" ? state : window.state || null; }
    catch { return window.state || null; }
  }

  function parseLocalDateKey(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
  }

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function weekKey(value = new Date()) {
    const date = value instanceof Date ? new Date(value) : parseLocalDateKey(value);
    if (!date) return null;
    const offset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - offset);
    return localDateKey(date);
  }

  function currentWeeklyState() {
    const chest = appState()?.weeklyAvatarChest;
    return chest && typeof chest === "object" ? chest : null;
  }

  function currentWeekRecord() {
    const chest = currentWeeklyState();
    const currentWeek = weekKey(new Date());
    if (!chest || !currentWeek) return {count:0, claim:null, week:currentWeek};

    const liveDates = [...new Set((Array.isArray(chest.keyDates) ? chest.keyDates : [])
      .filter(value => weekKey(value) === currentWeek))];
    const claim = chest.claims?.[currentWeek] || (Array.isArray(chest.keyRunClaims)
      ? chest.keyRunClaims.find(item => weekKey(item?.weekKey || item?.keyDates?.[0]) === currentWeek)
      : null) || null;
    const claimedDates = Array.isArray(claim?.keyDates)
      ? [...new Set(claim.keyDates.filter(value => weekKey(value) === currentWeek))]
      : [];

    return {
      count:Math.min(KEY_TARGET, Math.max(liveDates.length, claimedDates.length)),
      claim,
      week:currentWeek
    };
  }

  function ensureOpenButton(host) {
    const status = host.querySelector("#questChestStatus, .weekly-key-action");
    if (!status) return;
    let button = status.querySelector('[data-weekly-chest-action="open"]');
    if (!button) {
      status.innerHTML = '<button class="weekly-chest-button" type="button" data-weekly-chest-action="open">Open chest</button>';
      button = status.querySelector('[data-weekly-chest-action="open"]');
    }
    if (button) button.hidden = false;
  }

  function patchDailyKeys() {
    const host = document.getElementById("questChest");
    if (!host) return;
    const {count, claim} = currentWeekRecord();
    const title = host.querySelector("#questChestTitle, .weekly-key-copy strong");
    const text = host.querySelector("#questChestText, .weekly-key-copy small");
    const meter = host.querySelector(".weekly-key-meter");

    if (meter) {
      meter.setAttribute("aria-label", `${count} of ${KEY_TARGET} weekly keys collected`);
      [...meter.children].forEach((slot, index) => {
        slot.classList.toggle("collected", index < count);
        slot.textContent = index < count ? "🔑" : "";
      });
    }

    if (count >= KEY_TARGET && !claim) {
      host.classList.add("weekly-ready", "unlocked");
      host.classList.remove("locked", "weekly-claimed");
      if (title) title.textContent = "Weekly chest ready!";
      if (text) text.textContent = "Six Daily Keys collected. Open the chest to reveal your reward.";
      ensureOpenButton(host);
      return;
    }

    if (!claim) {
      if (title) title.textContent = `Daily Keys collected · ${count}/${KEY_TARGET}`;
    }
  }

  function patchMomentumWeekday(root = document) {
    const today = DAY_NAMES[new Date().getDay()];
    const candidates = [...root.querySelectorAll?.("section, article, div") || []].filter(node => {
      const text = node.textContent || "";
      return /weekly momentum/i.test(text) && node.children.length > 0;
    });
    const host = candidates.sort((a,b) => a.textContent.length - b.textContent.length)[0];
    if (!host) return;

    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = String(node.nodeValue || "");
      if (/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/.test(value)) {
        node.nodeValue = value.replace(/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/g, today);
      }
    }
    host.dataset.localWeekday = today;
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      patchDailyKeys();
      patchMomentumWeekday();
    });
  }

  new MutationObserver(records => {
    if (records.some(record => record.addedNodes.length || record.type === "characterData")) schedule();
  }).observe(document.documentElement, {subtree:true, childList:true, characterData:true});

  ["salita:state-changed", "salita:daily-quests-rendered", "salita:weekly-chest-rendered"].forEach(name => {
    document.addEventListener(name, schedule);
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });
  window.addEventListener("focus", schedule);
  schedule();
})();