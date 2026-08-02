(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestFacebookFeedLinkShareInstalled";
  const RELEASE = "5.5.11.2-facebook-feed-link";
  const MODAL_ID = "achievementShareModalV4";

  if (window[INSTALL_FLAG]) return;
  window[INSTALL_FLAG] = true;

  function isMobileShareTarget() {
    return Boolean(
      navigator.share &&
      (window.matchMedia?.("(pointer: coarse)")?.matches || window.innerWidth <= 900)
    );
  }

  function setStatus(message, error = false) {
    const node = document.getElementById("achievementShareStatus");
    if (!node) return;
    node.textContent = message || "";
    node.classList.toggle("error", Boolean(error));
  }

  function modalIsOpen() {
    const modal = document.getElementById(MODAL_ID);
    return Boolean(modal && !modal.hidden);
  }

  function title() {
    return document.getElementById("achievementShareTitle")?.textContent?.trim()
      || "Salita Quest achievement";
  }

  function description() {
    return document.getElementById("achievementShareDescription")?.textContent?.trim()
      || "I reached a new milestone with Salita Quest.";
  }

  async function shareFacebookFeed(button) {
    const router = window.SalitaQuestSharingRouter;
    if (!router?.ensureHostedShare) {
      throw new Error("The public achievement link is still loading. Try again in a moment.");
    }

    button.disabled = true;
    button.dataset.busy = "true";
    setStatus("Preparing the clickable Facebook post…");

    try {
      const hosted = await router.ensureHostedShare();
      const shareUrl = String(hosted?.shareUrl || "");
      if (!/^https:\/\//i.test(shareUrl) || !/\/share\//.test(shareUrl)) {
        throw new Error("The public achievement link is not ready.");
      }

      const shareText = `${description()}\n\n${shareUrl}`;
      await navigator.share({
        title:title(),
        text:shareText,
        url:shareUrl
      });
      setStatus("Choose Facebook, then Feed. The post includes the achievement link for Facebook to preview.");
    } catch (error) {
      if (error?.name === "AbortError") setStatus("Sharing cancelled.");
      else {
        setStatus(error?.message || "Facebook Feed sharing could not be opened.", true);
        throw error;
      }
    } finally {
      button.disabled = false;
      delete button.dataset.busy;
    }
  }

  function handleClick(event) {
    const button = event.target.closest?.('[data-sq-share-feed="facebook"]');
    if (!button || !modalIsOpen() || !isMobileShareTarget()) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    shareFacebookFeed(button).catch(() => {});
  }

  document.addEventListener("click", handleClick, true);
  window.SalitaQuestFacebookFeedLinkShare = Object.freeze({
    release:RELEASE,
    mode:"mobile-link-only",
    isMobileShareTarget
  });
  document.documentElement.dataset.facebookFeedLinkShare = RELEASE;
})();
