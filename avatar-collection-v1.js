(() => {
  "use strict";
  const chunks = window.__SalitaAvatarRuntimeChunks || [];
  if (chunks.length !== 5 || chunks.some(chunk => !chunk)) { console.error("Salita Quest avatar runtime chunks are incomplete."); return; }
  const source = atob(chunks.join(""));
  const bytes = Uint8Array.from(source, character => character.charCodeAt(0));
  const blob = new Blob([bytes], {type:"text/javascript"});
  const script = document.createElement("script");
  script.src = URL.createObjectURL(blob);
  script.onload = script.onerror = () => URL.revokeObjectURL(script.src);
  document.body.appendChild(script);
})();
