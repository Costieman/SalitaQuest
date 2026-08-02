(() => {
  "use strict";

  if (window.__salitaCoinAvatarRevealV1Installed) return;
  window.__salitaCoinAvatarRevealV1Installed = true;

  const GRANT_ID = "coinShopAnimation10000V1";
  const GRANT_AMOUNT = 10000;
  const PROGRESS_PREFIX = "salitaQuestProgress";
  const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

  function globalValue(name) {
    try { return eval(`typeof ${name} !== "undefined" ? ${name} : undefined`); }
    catch { return undefined; }
  }

  function grantPayload(payload) {
    if (!payload || typeof payload !== "object") return false;
    payload.testingGrants = payload.testingGrants && typeof payload.testingGrants === "object" ? payload.testingGrants : {};
    if (payload.testingGrants[GRANT_ID]) return false;
    payload.coins = Math.max(0, Math.floor(Number(payload.coins || 0))) + GRANT_AMOUNT;
    payload.testingGrants[GRANT_ID] = {amount:GRANT_AMOUNT,grantedAt:new Date().toISOString()};
    return true;
  }

  function awardTestingCoins() {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith(PROGRESS_PREFIX)) continue;
      try {
        const payload = JSON.parse(localStorage.getItem(key) || "null");
        if (grantPayload(payload)) localStorage.setItem(key, JSON.stringify(payload));
      } catch {}
    }

    const state = globalValue("state") || window.state;
    if (grantPayload(state)) {
      try { (globalValue("saveState") || window.saveState)?.(); }
      catch { localStorage.setItem(PROGRESS_PREFIX, JSON.stringify(state)); }
      try { (globalValue("updateGlobalUI") || window.updateGlobalUI)?.(); } catch {}
      document.dispatchEvent(new CustomEvent("salita:coin-balance-changed", {detail:{coins:state.coins,source:GRANT_ID}}));
    }
  }

  function imagePath(item) {
    return window.SalitaAvatarArtwork?.getAvatarImagePath?.(item.id) || item.image || `avatars/canonical/${item.id}.png`;
  }

  function ensureReveal() {
    let host = document.querySelector(".sq-coin-reveal-backdrop");
    if (host) return host;
    host = document.createElement("div");
    host.className = "sq-coin-reveal-backdrop";
    host.hidden = true;
    host.innerHTML = `<section class="sq-coin-reveal" role="dialog" aria-modal="true" aria-live="polite">
      <p class="sq-coin-reveal-kicker">RANDOM AVATAR</p>
      <h2 class="sq-coin-reveal-title">Choosing your avatar…</h2>
      <div class="sq-coin-reveal-art">
        <img class="sq-coin-reveal-base" alt="">
        <div class="sq-coin-reveal-colour"><img alt=""></div>
        <div class="sq-coin-reveal-shine" aria-hidden="true"></div>
      </div>
      <strong class="sq-coin-reveal-name"></strong>
      <div class="sq-coin-reveal-track"><span></span></div>
      <p class="sq-coin-reveal-progress"></p>
      <div class="sq-coin-reveal-burst" aria-hidden="true">★</div>
      <button class="sq-coin-reveal-done" type="button" hidden>Continue</button>
    </section>`;
    document.body.appendChild(host);
    host.querySelector(".sq-coin-reveal-done").addEventListener("click", () => { host.hidden = true; });
    return host;
  }

  function showCandidate(host, item) {
    const src = imagePath(item);
    const base = host.querySelector(".sq-coin-reveal-base");
    const colour = host.querySelector(".sq-coin-reveal-colour img");
    base.src = src;
    base.alt = item.name || "Random avatar";
    colour.src = src;
    colour.alt = "";
    host.querySelector(".sq-coin-reveal-name").textContent = item.name || item.id;
  }

  async function runReveal(detail) {
    const host = ensureReveal();
    const model = window.SalitaAvatarModel;
    if (!model || !detail?.avatar) return;
    const candidates = model.list({rarity:detail.rarity});
    const finalItem = detail.avatar;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    host.hidden = false;
    host.classList.remove("complete");
    host.querySelector(".sq-coin-reveal-title").textContent = "Choosing your avatar…";
    host.querySelector(".sq-coin-reveal-done").hidden = true;
    host.querySelector(".sq-coin-reveal-progress").textContent = "Searching the collection";
    host.querySelector(".sq-coin-reveal-track span").style.width = "0%";
    host.querySelector(".sq-coin-reveal-colour").style.clipPath = "inset(100% 0 0 0)";

    const cycles = reduced ? 1 : 12;
    for (let index = 0; index < cycles; index += 1) {
      showCandidate(host, candidates[Math.floor(Math.random() * candidates.length)] || finalItem);
      await sleep(reduced ? 10 : 85 + index * 12);
    }

    showCandidate(host, finalItem);
    host.querySelector(".sq-coin-reveal-title").textContent = `${finalItem.name} selected!`;
    host.querySelector(".sq-coin-reveal-progress").textContent = `${detail.before}% → ${detail.after}% complete`;
    host.querySelector(".sq-coin-reveal-track span").style.width = `${detail.before}%`;
    host.querySelector(".sq-coin-reveal-colour").style.clipPath = `inset(${100 - detail.before}% 0 0 0)`;
    await sleep(reduced ? 10 : 350);
    host.querySelector(".sq-coin-reveal-track span").style.width = `${detail.after}%`;
    host.querySelector(".sq-coin-reveal-colour").style.clipPath = `inset(${100 - detail.after}% 0 0 0)`;
    await sleep(reduced ? 10 : 1100);

    if (detail.unlocked) {
      host.classList.add("complete");
      host.querySelector(".sq-coin-reveal-title").textContent = "Avatar complete!";
      host.querySelector(".sq-coin-reveal-progress").textContent = `${finalItem.name} is now unlocked.`;
    } else {
      host.querySelector(".sq-coin-reveal-title").textContent = "+25 avatar shards!";
      host.querySelector(".sq-coin-reveal-progress").textContent = `${detail.after}% of ${finalItem.name} is now in colour.`;
    }
    host.querySelector(".sq-coin-reveal-done").hidden = false;
    host.querySelector(".sq-coin-reveal-done").focus();
  }

  document.addEventListener("salita:coin-shard-pack-purchased", event => runReveal(event.detail));

  function install() {
    if (!window.SalitaAvatarModel || !(globalValue("state") || window.state)) {
      window.setTimeout(install, 120);
      return;
    }
    awardTestingCoins();
    ensureReveal();
  }

  install();
})();