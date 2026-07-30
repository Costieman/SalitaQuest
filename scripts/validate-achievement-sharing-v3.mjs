import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const fail=message=>{throw new Error(message);};
const requireMarkers=(source,markers,label)=>markers.forEach(marker=>{if(!source.includes(marker))fail(`${label} is missing: ${marker}`);});

const runtime=read("achievement-sharing-v3.js");
new vm.Script(runtime,{filename:"achievement-sharing-v3.js"});
requireMarkers(runtime,[
  "__salitaQuestAchievementSharingV3Installed",
  "badgeIdFromButton",
  "button?.closest(\"[data-badge-id]\")?.dataset.badgeId",
  "event.stopImmediatePropagation()",
  "buildBadgeCard",
  "buildLevelCard",
  'type: "level"',
  'campaign: "level-up"',
  "state?.levelProgressionV2?.pendingLevelUp",
  "MutationObserver",
  "showLevelPrompt",
  "Share level up",
  "data-dismiss-level-v3",
  "START LEARNING FREE",
  "/api/share-cards",
  "www.facebook.com/sharer/sharer.php",
  "navigator.canShare?.({files: [file]})"
],"Achievement sharing runtime");

const css=read("achievement-sharing-v3.css");
requireMarkers(css,[
  ".level-share-prompt-v3",
  ".level-share-prompt-actions",
  "data-share-level-v3",
  "@media(max-width:700px)",
  "@media(prefers-reduced-motion:reduce)"
],"Level-up share prompt styling");

for(const htmlFile of ["app.html","bisaya.html"]){
  const html=read(htmlFile);
  const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1].trim()).filter(Boolean);
  inline.forEach((source,index)=>new vm.Script(source,{filename:`${htmlFile}#inline-${index+1}`}));
  requireMarkers(html,[
    "achievement-sharing-v3.css?v=5.4.28",
    "achievement-sharing-v3.js?v=5.4.28",
    "social-posting-v2.js?v=5.4.25"
  ],`${htmlFile} achievement-sharing assets`);
  const compatibility=html.indexOf("achievement-sharing-v3.js?v=5.4.28");
  const legacy=html.indexOf("social-posting-v2.js?v=5.4.25");
  if(!(compatibility>=0&&legacy>compatibility))fail(`${htmlFile} must load the individual-badge interceptor before the legacy hosted-sharing listener`);
}

const worker=read("service-worker.js");
requireMarkers(worker,[
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-4-seamless-sharing-r40"',
  'const CACHE_NAME = "salita-quest-v5-4-achievement-sharing-r41"',
  '"./achievement-sharing-v3.js"',
  '"./achievement-sharing-v3.css"'
],"Achievement-sharing offline release");

const index=read("index.html");
if(!index.includes('service-worker.js?v=5.4.28'))fail("The profile gate does not request the achievement-sharing service worker");

console.log("Validated authoritative individual badge sharing, post-celebration level-up sharing, hosted cards, both course loaders and offline release 5.4.28.");
