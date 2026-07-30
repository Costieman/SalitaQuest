(() => {
  "use strict";
  const ids = ["eagle","tamaraw","anahaw","peacock","orchid","jade","rafflesia","tarsier","narra","nipa_palm","buri_palm","almaciga","pandan","bakawan_mangrove","kawayang_tinik","pili","katmon","medinilla","philippine_teak","banaba","mangkono","attenborough_pitcher","slipper_orchid","philippine_hoya","parol","vinta","kulintang","bangka","jeepney","bahay_kubo","sarimanok","golden_salita_crest","philippine_pangolin","visayan_spotted_deer","visayan_warty_pig","philippine_crocodile","philippine_forest_turtle","philippine_sailfin_lizard","golden_crowned_flying_fox","philippine_colugo","philippine_cockatoo","rufous_hornbill","luzon_bleeding_heart","cebu_flowerpecker","philippine_eagle_owl","whale_shark","dugong","hawksbill_turtle"];
  const chunks = window.__SalitaAvatarSpriteChunks || [];
  if (chunks.length !== 13 || chunks.some(chunk => !chunk) || typeof Blob !== "function" || !URL?.createObjectURL) {
    console.error("Salita Quest avatar sprite chunks are incomplete.");
    window.__SalitaAvatarAssetRecords = [];
    return;
  }
  try {
    const binary = atob(chunks.join(""));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const spriteUrl = URL.createObjectURL(new Blob([bytes], {type:"image/webp"}));
    window.__SalitaAvatarAssetRecords = ids.map((id, index) => {
      const column = index % 8;
      const row = Math.floor(index / 8);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><image href="${spriteUrl}" x="${-column * 128}" y="${-row * 128}" width="1024" height="768"/></svg>`;
      return {id, src:URL.createObjectURL(new Blob([svg], {type:"image/svg+xml"}))};
    });
  } catch (error) {
    console.error("Salita Quest avatar sprite could not be prepared.", error);
    window.__SalitaAvatarAssetRecords = [];
  }
})();
