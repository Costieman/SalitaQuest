(() => {
  "use strict";

  if (window.__salitaDailyKeyWeekdayReconciliationV2Installed) return;
  window.__salitaDailyKeyWeekdayReconciliationV2Installed = true;

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

  function activityDateKey() {
    try {
      if (typeof ensureDailyActivity === "function") {
        const activity = ensureDailyActivity();
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(activity?.date || ""))) return activity.date;
      }
    } catch {}
    const stateDate = appState()?.dailyActivity?.date || appState()?.daily?.date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(stateDate || ""))) return stateDate;
    return localDateKey(new Date());
  }

  function weekKey(value) {
    const date = value instanceof Date ? new Date(value) : parseLocalDateKey(value);
    if (!date) return null;
    const offset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - offset);
    return localDateKey(date);
  }

  function currentWeekRecord() {
    const chest = appState()?.weeklyAvatarChest;
    const currentWeek = weekKey(activityDateKey());
    if (!chest || typeof chest !== "object" || !currentWeek) return {count:0, claim:null};

    const liveDates = [...new Set((Array.isArray(chest.keyDates) ? chest.keyDates : [])
      .filter(value => weekKey(value) === currentWeek))];
    const claim = chest.claims?.[currentWeek] || (Array.isArray(chest.keyRunClaims)
      ? chest.keyRunClaims.find(item => weekKey(item?.weekKey || item?.keyDates?.[0]) === currentWeek)
      : null) || null;
    const claimedDates = Array.isArray(claim?.keyDates)
      ? [...new Set(claim.keyDates.filter(value => weekKey(value) === currentWeek))]
      : [];

    return {count:Math.min(KEY_TARGET, Math.max(liveDates.length, claimedDates.length)), claim};
  }

  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function ensureOpenButton(host) {
    const status = host.querySelector("#questChestStatus, .weekly-key-action");
    if (!status || status.querySelector('[data-weekly-chest-action="open"]')) return;
    status.innerHTML = '<button class="weekly-chest-button" type="button" data-weekly-chest-action="open">Open chest</button>';
  }

  function patchDailyKeys() {
    const host = document.getElementById("questChest");
    if (!host) return;
    const {count, claim} = currentWeekRecord();
    const title = host.querySelector("#questChestTitle, .weekly-key-copy strong");
    const text = host.querySelector("#questChestText, .weekly-key-copy small");
    const meter = host.querySelector(".weekly-key-meter");

    if (meter) {
      const label = `${count} of ${KEY_TARGET} weekly keys collected`;
      if (meter.getAttribute("aria-label") !== label) meter.setAttribute("aria-label", label);
      [...meter.children].forEach((slot, index) => {
        const collected = index < count;
        slot.classList.toggle("collected", collected);
        setText(slot, collected ? "🔑" : "");
      });
    }

    if (count >= KEY_TARGET && !claim) {
      host.classList.add("weekly-ready", "unlocked");
      host.classList.remove("locked", "weekly-claimed");
      setText(title, "Weekly chest ready!");
      setText(text, "Six Daily Keys collected. Open the chest to reveal your reward.");
      ensureOpenButton(host);
    } else if (!claim) {
      setText(title, `Daily Keys collected · ${count}/${KEY_TARGET}`);
    }
  }

  function patchMomentumWeekday() {
    const activityDate = parseLocalDateKey(activityDateKey());
    const today = DAY_NAMES[(activityDate || new Date()).getDay()];
    const candidates = [...document.querySelectorAll("section, article, div")].filter(node =>
      /weekly momentum/i.test(node.textContent || "") && node.children.length > 0
    );
    const host = candidates.sort((a,b) => a.textContent.length - b.textContent.length)[0];
    if (!host) return;

    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = String(node.nodeValue || "");
      const next = value.replace(/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/g, today);
      if (next !== value) node.nodeValue = next;
    }
    if (host.dataset.localWeekday !== today) host.dataset.localWeekday = today;
  }

  let scheduled = false;
  function schedule(delay = 0) {
    if (delay) {
      window.setTimeout(() => schedule(), delay);
      return;
    }
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      patchDailyKeys();
      patchMomentumWeekday();
    });
  }

  ["salita:state-changed", "salita:daily-quests-rendered", "salita:weekly-chest-rendered"].forEach(name => {
    document.addEventListener(name, () => schedule());
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });
  window.addEventListener("focus", () => schedule());
  document.addEventListener("DOMContentLoaded", () => schedule(), {once:true});

  schedule();
  schedule(250);
  schedule(900);
})();
