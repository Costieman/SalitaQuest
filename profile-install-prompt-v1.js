(() => {
  "use strict";

  if (window.__salitaProfileInstallPromptV1) return;
  window.__salitaProfileInstallPromptV1 = true;

  let deferredPrompt = null;
  const isStandalone = () => window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || "");

  function showMessage(message) {
    const toast = document.getElementById("profileToast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => { toast.hidden = true; }, 5000);
  }

  function installButton() {
    const gate = document.getElementById("profileGate");
    if (!gate || document.querySelector("[data-install-salita]")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "profile-install-app";
    button.dataset.installSalita = "true";
    button.innerHTML = '<span class="profile-install-app-icon" aria-hidden="true">⬇</span><span><strong>Download the app</strong><small>Install Salita Quest on this device</small></span>';
    button.addEventListener("click", async () => {
      if (isStandalone()) {
        showMessage("Salita Quest is already installed on this device.");
        return;
      }
      if (deferredPrompt) {
        const prompt = deferredPrompt;
        deferredPrompt = null;
        await prompt.prompt();
        const choice = await prompt.userChoice.catch(() => null);
        if (choice?.outcome === "accepted") button.hidden = true;
        return;
      }
      if (isIOS()) showMessage("In Safari, tap Share, then choose Add to Home Screen.");
      else showMessage("Open this page in Chrome, then choose Install app or Add to Home screen from the browser menu.");
    });
    gate.appendChild(button);
    if (isStandalone()) button.hidden = true;
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    installButton();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    document.querySelector("[data-install-salita]")?.setAttribute("hidden", "");
    showMessage("Salita Quest was installed successfully.");
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installButton, {once:true});
  else installButton();
})();
