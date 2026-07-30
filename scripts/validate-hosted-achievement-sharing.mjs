import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const fail=message=>{throw new Error(message);};
const requireMarkers=(source,markers,label)=>markers.forEach(marker=>{if(!source.includes(marker))fail(`${label} is missing: ${marker}`);});

for(const file of ["social-posting-v2.js","social-connections-v2.js"])new vm.Script(read(file),{filename:file});
const posting=read("social-posting-v2.js");
requireMarkers(posting,["makeCanvas(1200,630)","buildOpenGraphCard","START LEARNING FREE","CHOOSE TAGALOG OR CEBUANO","createHostedShare","currentShare.hostedPromise","/api/share-cards","squareImageDataUrl","ogImageDataUrl","hosted.shareUrl","popup.document.write","www.facebook.com/sharer/sharer.php?u=","www.linkedin.com/sharing/share-offsite/?url=","navigator.canShare?.({files:[file]})"],"Browser hosted-sharing client");

const connections=read("social-connections-v2.js");
requireMarkers(connections,['fetch(`${base}/health`',"DEFAULT_API","Achievement sharing is ready","Advanced troubleshooting","salitaQuestSocialApiBase"],"Seamless hosted-sharing settings");
if(connections.includes("Share service not configured"))fail("Learners must not see service configuration errors");
if(connections.includes("/healthz"))fail("The browser must not use Cloud Run's reserved /healthz path");

const service=read("services/social-share/index.js");
requireMarkers(service,['app.get("/health"','app.post("/api/share-cards"','decodePngDataUrl(req.body.squareImageDataUrl, "squareImageDataUrl", 1080, 1080)','decodePngDataUrl(req.body.ogImageDataUrl, "ogImageDataUrl", 1200, 630)','crypto.randomBytes(18).toString("base64url")','saveObject(`images/${id}-square.png`','saveObject(`images/${id}-og.png`','app.get("/media/:id/:variant.png"','app.get("/share/:id"','<meta property="og:image" content="${image}">','<meta property="og:image:width" content="1200">','<meta property="og:image:height" content="630">','Start learning a Filipino language free'],"Cloud Run Open Graph service");

for(const file of ["services/social-share/index.js","social-posting-v2.js","social-connections-v2.js"]){const check=spawnSync("node",["--check",file],{encoding:"utf8"});if(check.status!==0)fail(`${file} failed syntax check: ${check.stderr}`);}

for(const htmlFile of ["app.html","bisaya.html"]){const html=read(htmlFile);const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1].trim()).filter(Boolean);inline.forEach((source,index)=>new vm.Script(source,{filename:`${htmlFile}#inline-${index+1}`}));for(const asset of ["badge-layout-v3.css?v=5.4.25","social-connections-v2.css?v=5.4.26","social-posting-v2.css?v=5.4.25","social-connections-v2.js?v=5.4.26","social-posting-v2.js?v=5.4.25"])if(!html.includes(asset))fail(`${htmlFile} does not load ${asset}`);}

const worker=read("service-worker.js");
requireMarkers(worker,['const PREVIOUS_CACHE_NAME = "salita-quest-v5-4-hosted-sharing-r39"','const CACHE_NAME = "salita-quest-v5-4-seamless-social-r40"','"./social-posting-v2.js"','"./social-connections-v2.js"'],"Seamless hosted-sharing offline release");

console.log("Validated seamless hosted badge/chest sharing, exact Open Graph images, CTA artwork, both language loaders and offline cache r40.");