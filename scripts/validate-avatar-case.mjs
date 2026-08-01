import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(ROOT,file),"utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source, markers, label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

const runtime = read("avatar-case-v1.js");
const sharing = read("achievement-sharing-v4.js");
const loader = read("profile-emblem-control.js");
const worker = read("service-worker.js");
const css = read("avatar-case-v1.css");
const service = read("services/social-share/index.js");

new vm.Script(runtime,{filename:"avatar-case-v1.js"});
new vm.Script(sharing,{filename:"achievement-sharing-v4.js"});

requireMarkers(runtime,[
  "const MAX_CASE_AVATARS = 4",
  'const MOBILE_COLLAPSE_QUERY = "(max-width: 650px)"',
  "profile.avatarCaseIds = cleaned",
  "cleanIds",
  "ownedIds",
  "result.includes(item.id)",
  "result.length >= MAX_CASE_AVATARS",
  "data-avatar-case-toggle",
  'aria-expanded="${panelExpanded}"',
  "sq-avatar-case-body",
  "function setExpanded",
  "function toggleExpanded",
  "isExpanded:()=>panelExpanded",
  "data-avatar-case-move",
  "data-avatar-case-remove",
  "data-avatar-case-open-picker",
  "data-avatar-case-picker-save",
  "data-share-avatar-case",
  "salita:avatar-case-changed",
  "SalitaQuestAvatarCase"
],"Avatar Case runtime");
if (/profile\.avatarId\s*=/.test(runtime)) fail("Avatar Case must not change the equipped profile avatar");
if (/equippedAvatarId\s*=/.test(runtime)) fail("Avatar Case must not change equippedAvatarId");

requireMarkers(sharing,[
  "buildAvatarCaseCard",
  "openAvatarCase",
  'type:"avatar_case"',
  "data-share-avatar-case",
  "avatarCaseItems",
  "SalitaQuestAvatarCase?.openPicker",
  "openBadge,openChest,openAvatar,openAvatarCase,openLevel"
],"Unified Avatar Case sharing");

const collectionIndex = loader.indexOf('loadScript("collection"');
const caseIndex = loader.indexOf('loadScript("case"');
const weeklyIndex = loader.indexOf('loadScript("weekly"');
if (!(collectionIndex >= 0 && caseIndex > collectionIndex && weeklyIndex > caseIndex)) {
  fail("Avatar Case must load after the collection and before reward modules");
}
requireMarkers(loader,[
  'addStylesheet("case-css"',
  "avatar-case-v1.css",
  "avatar-case-v1.js",
  'const AVATAR_CASE_VERSION = "5.5.9"'
],"Shared avatar loader");

requireMarkers(worker,[
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-5-9-avatar-case-r51"',
  'const CACHE_NAME = "salita-quest-v5-5-10-persistent-navigation-r52"',
  '"./avatar-case-v1.js"',
  '"./avatar-case-v1.css"'
],"Avatar Case carried into persistent-navigation offline release");

requireMarkers(css,[
  ".sq-avatar-case-panel",
  ".sq-avatar-case-toggle",
  '.sq-avatar-case-toggle[aria-expanded="false"]',
  ".sq-avatar-case-body[hidden]",
  "grid-template-columns:repeat(4",
  ".sq-avatar-case-picker",
  "@media(max-width:820px)",
  "@media(max-width:650px)",
  "grid-auto-flow:column",
  "overflow-x:auto",
  "@media(max-width:520px)",
  ".dark-mode .sq-avatar-case-panel"
],"Avatar Case responsive styles");

requireMarkers(service,[
  'avatar_case: {label:"AVATAR CASE"',
  "supportedTypes: Object.keys(SHARE_TYPE_META)"
],"Hosted Avatar Case contract");

for (const htmlFile of ["app.html","bisaya.html"]) {
  const html = read(htmlFile);
  if (!html.includes("profile-emblem-control.js")) fail(`${htmlFile} does not load the shared avatar progression entry point`);
}

const records = ["a","b","c","d","e"].map((id,index) => ({
  id,name:`Avatar ${id.toUpperCase()}`,rarity:index < 2 ? "common" : "rare",category:"animal",image:`avatars/canonical/${id}.png`
}));
const byId = Object.fromEntries(records.map(item => [item.id,item]));
const store = {
  schemaVersion:1,
  profiles:[{
    id:"profile-1",
    avatarId:"a",
    avatarCollection:{equippedAvatarId:"a",ownedAvatarIds:["a","b","c","d","e"],shards:{}},
    avatarCaseIds:["a","a","locked","b","c","d","e"]
  }]
};
let stored = JSON.stringify(store);
const listeners = {};
const documentStub = {
  body:{classList:{add(){},remove(){}}},
  documentElement:{dataset:{}},
  querySelector(){return null;},
  addEventListener(type,handler){listeners[type]=handler;},
  dispatchEvent(){},
  createElement(){return {hidden:true,classList:{},setAttribute(){},addEventListener(){},querySelector(){return null;},querySelectorAll(){return[];}};}
};
const context = {
  window:null,
  document:documentStub,
  localStorage:{getItem:key => key === "salitaQuestLocalProfilesV1" ? stored : null,setItem:(key,value)=>{if(key === "salitaQuestLocalProfilesV1")stored=value;}},
  sessionStorage:{getItem:key => key === "salitaQuestActiveProfileId" ? "profile-1" : null},
  matchMedia:query=>({matches:query==="(max-width: 650px)",media:query}),
  MutationObserver:class MutationObserver{observe(){} disconnect(){}},
  Element:class Element{},
  CustomEvent:class CustomEvent{constructor(type,options){this.type=type;this.detail=options?.detail;}},
  setTimeout:handler=>{handler();return 1;},
  clearTimeout(){},
  console,
  Object,Array,Set,Map,Date,Math,Number,String,Boolean,JSON,Promise
};
context.window=context;
context.SalitaAvatarModel={
  get:id=>byId[String(id||"").toLowerCase()]||null,
  normaliseCollectionState:(input,fallback)=>({
    equippedAvatarId:input?.equippedAvatarId||fallback||null,
    ownedAvatarIds:[...(input?.ownedAvatarIds||[])],
    shards:{...(input?.shards||{})}
  })
};
vm.createContext(context);
vm.runInContext(runtime,context,{filename:"avatar-case-v1.behavior.js"});
const api=context.SalitaQuestAvatarCase;
if(!api)fail("Avatar Case API was not installed in the deterministic harness");
if(api.max!==4)fail(`Avatar Case maximum is ${api.max}, expected 4`);
if(api.isExpanded()!==false)fail("Avatar Case must start collapsed at the phone breakpoint");
api.toggleExpanded();
if(api.isExpanded()!==true)fail("Avatar Case did not expand through its public toggle");
api.setExpanded(false,{render:false});
if(api.isExpanded()!==false)fail("Avatar Case did not collapse through its public state control");
if(api.getIds().join("|")!=="a|b|c|d")fail(`Initial case cleaning failed: ${api.getIds().join("|")}`);
const cleaned=api.setIds(["e","e","locked","d","c","b","a"],{announce:false});
if(cleaned.join("|")!=="e|d|c|b")fail(`Owned/unique/four-slot enforcement failed: ${cleaned.join("|")}`);
api.move("c",-1);
if(api.getIds().join("|")!=="e|c|d|b")fail(`Reordering failed: ${api.getIds().join("|")}`);
api.remove("d");
if(api.getIds().join("|")!=="e|c|b")fail(`Removal failed: ${api.getIds().join("|")}`);
const finalProfile=JSON.parse(stored).profiles[0];
if(finalProfile.avatarId!=="a"||finalProfile.avatarCollection.equippedAvatarId!=="a")fail("Avatar Case changed the equipped avatar");
if(finalProfile.avatarCaseIds.join("|")!=="e|c|b")fail("Avatar Case state was not persisted on the profile");

console.log("Validated four-slot owned-only Avatar Case state, phone-default collapse, accessible expansion, compact mobile shelf, duplicate rejection, reordering, equipped-avatar independence, unified sharing and persistent-navigation offline delivery.");
