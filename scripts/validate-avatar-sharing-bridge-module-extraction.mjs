import fs from "node:fs";
import vm from "node:vm";

const read = file => fs.readFileSync(file, "utf8");
const fail = message => { throw new Error(message); };
const rootFile = "achievement-sharing-avatar-bridge-v1.js";
const featureFile = "src/features/sharing/achievement-sharing-avatar-bridge-v1.js";
const profileFile = "src/core/learner-profile-runtime-v1.js";
const adapterFile = "src/adapters/avatar/avatar-collection-profile-runtime-v1.js";
const rootSource = read(rootFile);
const featureSource = read(featureFile);
const profileSource = read(profileFile);
const adapterSource = read(adapterFile);
const loader = read("profile-emblem-control.js");
const refresh = read("mobile-refresh.html");
const worker = read("service-worker.js");

for (const [file, source] of [[rootFile,rootSource],[featureFile,featureSource],[profileFile,profileSource],[adapterFile,adapterSource]]) {
  new vm.Script(source, {filename:file});
}

for (const marker of [
  "__salitaQuestAchievementSharingAvatarBridgeCoordinatorInstalled",
  "__salitaQuestAchievementSharingAvatarBridgeCompatibilityLoading",
  'const PROFILE_URL = "./src/core/learner-profile-runtime-v1.js?v=5.6.1"',
  'const ADAPTER_URL = "./src/adapters/avatar/avatar-collection-profile-runtime-v1.js?v=5.5.6"',
  'const FEATURE_URL = "./src/features/sharing/achievement-sharing-avatar-bridge-v1.js?v=5.5.20.1"',
  "document.currentScript",
  "document.write",
  "script.async = false",
  '"learner-profile-runtime"',
  '"profile-runtime"',
  '"feature"'
]) if (!rootSource.includes(marker)) fail(`Compatibility coordinator missing ${marker}`);
for (const forbidden of [
  "localStorage", "sessionStorage", "MutationObserver", "SalitaAchievementAvatarBridge =",
  "decorateAvatarDetails", "avatar-sharing-bridge-ready", 'document.addEventListener("salita:avatar-collection-changed"'
]) if (rootSource.includes(forbidden)) fail(`Compatibility coordinator owns ${forbidden}`);

for (const marker of [
  'const RELEASE = "5.5.11-explicit-sharing-router"',
  "SalitaAvatarCollectionProfileRuntimeV1",
  "peekContext",
  "context?.collection?.equippedAvatarId",
  "canonicalAvatarPath",
  "decorateAvatarDetails",
  "dataset.shareAvatar",
  'button.textContent = "Share avatar"',
  "window.SalitaAchievementAvatarBridge = compatibilityApi",
  "openBadge(...args)", "openChest(...args)", "openAvatar(...args)",
  "openAvatarCase(...args)", "openLevel(...args)",
  "new MutationObserver",
  'document.addEventListener("salita:avatar-collection-changed"',
  'script.src = "./src/features/sharing/facebook-share-link-v1.js?v=1.0.0"',
  'new CustomEvent("salita:avatar-sharing-bridge-ready"',
  "compatibilityOnly:true", "transportOwner:false"
]) if (!featureSource.includes(marker)) fail(`Extracted feature missing ${marker}`);
if (/localStorage|sessionStorage/.test(featureSource)) fail("Extracted feature owns learner storage");
if ((featureSource.match(/new MutationObserver/g) || []).length !== 1) fail("Feature must own exactly one observer");
if ((featureSource.match(/document\.addEventListener\("salita:avatar-collection-changed"/g) || []).length !== 1) fail("Feature must own exactly one collection listener");

for (const marker of ["SalitaQuestLearnerProfileRuntimeV1", "function buildContext", "persistNormalisation = false", "function peekContext", "return buildContext();", "return buildContext({persistNormalisation:true});", "peekContext,"]) {
  if (!adapterSource.includes(marker)) fail(`Profile adapter missing ${marker}`);
}

const directPath = '`./src/features/sharing/achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`';
if (!loader.includes(directPath)) fail("Profile loader does not use the direct feature path");
if (loader.includes('`./achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`')) fail("Profile loader still executes the historical root path");
const routerIndex = loader.indexOf('"achievement-sharing-router"');
const bridgeIndex = loader.indexOf('"sharing"', routerIndex + 1);
if (routerIndex < 0 || bridgeIndex <= routerIndex) fail("Sharing router no longer loads before the avatar bridge");

for (const marker of [
  `./${profileFile}?v=\${RELEASE}`,
  `./${rootFile}?v=\${RELEASE}`,
  `./${featureFile}?v=\${RELEASE}`
]) if (!refresh.includes(marker)) fail(`Mobile refresh missing ${marker}`);

for (const marker of [
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-23-badge-catalogue-extraction-r76"',
  'const CACHE_NAME = "salita-quest-v5-6-24-social-connections-extraction-r77"',
  `"./${profileFile}"`, `"./${rootFile}"`, `"./${featureFile}"`, `"./${adapterFile}"`
]) if (!worker.includes(marker)) fail(`Offline delivery missing ${marker}`);

const store = {schemaVersion:1,profiles:[{id:"p1",avatarId:"anahaw",avatarCollection:{equippedAvatarId:"narra",ownedAvatarIds:["anahaw","narra"],shards:{}}}]};
let writes = 0;
const localStorage = {
  getItem(key){ return key === "salitaQuestLocalProfilesV1" ? JSON.stringify(store) : null; },
  setItem(){ writes += 1; }
};
const sessionStorage = {getItem(key){ return key === "salitaQuestActiveProfileId" ? "p1" : null; }};
const model = {
  normaliseCollectionState(value, fallback){ return {equippedAvatarId:value?.equippedAvatarId || fallback,ownedAvatarIds:[...(value?.ownedAvatarIds || [])],shards:{...(value?.shards || {})}}; },
  get(id){ return id ? {id,name:id,image:`avatars/canonical/${id}.png`} : null; }
};
const adapterContext = {console,Object,Array,Set,Map,Date,Math,Number,String,Boolean,JSON,localStorage,sessionStorage,SalitaAvatarModel:model,window:null,globalThis:null};
adapterContext.window = adapterContext;
adapterContext.globalThis = adapterContext;
vm.createContext(adapterContext);
vm.runInContext(profileSource, adapterContext, {filename:profileFile});
vm.runInContext(adapterSource, adapterContext, {filename:adapterFile});
const adapter = adapterContext.SalitaAvatarCollectionProfileRuntimeV1;
const snapshot = adapter.peekContext();
if (!snapshot || snapshot.collection.equippedAvatarId !== "narra") fail("Read-only profile snapshot changed");
if (writes !== 0) fail("Read-only profile snapshot unexpectedly writes storage");
adapter.readContext();
if (writes !== 1) fail("Collection readContext no longer persists normalization exactly once");

class Element {}
function makeCard(id) {
  const actions = {children:[],lastElementChild:null,insertBefore(node){this.children.push(node);}};
  const image = {dataset:{sqAvatarId:id}};
  return Object.assign(new Element(), {
    matches(selector){ return selector === ".sq-avatar-detail-card"; },
    querySelector(selector){
      if (selector === "[data-share-avatar]") return actions.children.find(child => child.dataset?.shareAvatar) || null;
      if (selector === "[data-sq-avatar-id]") return image;
      if (selector === ".sq-avatar-detail-actions") return actions;
      return null;
    },
    querySelectorAll(){ return []; },
    actions
  });
}
const ownedCard = makeCard("narra");
const lockedCard = makeCard("eagle");
const listeners = new Map();
const events = [];
const appended = [];
let observers = 0;
class MutationObserver {
  constructor(handler){ this.handler = handler; observers += 1; }
  observe(target, options){ this.target = target; this.options = options; }
}
class CustomEvent { constructor(type,init={}){this.type=type;this.detail=init.detail;} }
const document = {
  baseURI:"https://example.test/",
  documentElement:{dataset:{}},
  body:{appendChild(node){appended.push(node);}},
  querySelector(selector){ return selector === 'script[data-facebook-share-link]' ? null : null; },
  querySelectorAll(selector){ return selector === ".sq-avatar-detail-card" ? [ownedCard,lockedCard] : []; },
  createElement(tag){ return {tagName:tag.toUpperCase(),dataset:{},addEventListener(){}}; },
  addEventListener(name,handler){ const values=listeners.get(name)||[]; values.push(handler); listeners.set(name,values); },
  dispatchEvent(event){ events.push(event); return true; }
};
const calls = [];
const controller = {
  openBadge(...args){calls.push(["badge",...args]);return "badge";},
  openChest(...args){calls.push(["chest",...args]);return "chest";},
  openAvatar(...args){calls.push(["avatar",...args]);return "avatar";},
  openAvatarCase(...args){calls.push(["case",...args]);return "case";},
  openLevel(...args){calls.push(["level",...args]);return "level";}
};
const featureContext = {
  console,Object,Array,Set,Map,Date,Math,Number,String,Boolean,JSON,Promise,URL,
  Element,MutationObserver,CustomEvent,document,
  SalitaAvatarModel:model,
  SalitaAvatarCollectionProfileRuntimeV1:{peekContext(){return snapshot;}},
  SalitaQuestAchievementSharing:controller,
  SalitaAvatarArtwork:{getAvatarImagePath(id){return `canonical:${id}`;}},
  setTimeout(handler){handler();return 1;},clearTimeout(){},
  window:null,globalThis:null
};
featureContext.window = featureContext;
featureContext.globalThis = featureContext;
vm.createContext(featureContext);
vm.runInContext(featureSource, featureContext, {filename:featureFile});
const api = featureContext.SalitaAchievementAvatarBridge;
if (!api || api.release !== "5.5.11-explicit-sharing-router") fail("Bridge public API changed");
if (api.equippedAvatar()?.id !== "narra" || api.canonicalAvatarPath() !== "canonical:narra") fail("Equipped avatar resolution changed");
if (api.openAvatar("narra") !== "avatar" || calls.at(-1)?.[1] !== "narra") fail("Controller delegation changed");
if (ownedCard.actions.children.length !== 1 || ownedCard.actions.children[0].dataset.shareAvatar !== "narra") fail("Owned avatar share decoration changed");
if (lockedCard.actions.children.length !== 0) fail("Locked avatar received a share action");
if (observers !== 1 || (listeners.get("salita:avatar-collection-changed") || []).length !== 1) fail("Observer/listener ownership changed");
if (appended.length !== 1 || !appended[0].src.includes("src/features/sharing/facebook-share-link-v1.js")) fail("Facebook formatter dependency changed");
const ready = events.find(event => event.type === "salita:avatar-sharing-bridge-ready");
if (!ready || ready.detail.release !== api.release || ready.detail.compatibilityOnly !== true || ready.detail.transportOwner !== false) fail("Bridge-ready event contract changed");
vm.runInContext(featureSource, featureContext, {filename:featureFile});
if (observers !== 1 || (listeners.get("salita:avatar-collection-changed") || []).length !== 1 || appended.length !== 1) fail("Duplicate installation was not prevented");

const writesFromRoot = [];
const rootContext = {
  console,Object,Array,Set,Map,Date,Math,Number,String,Boolean,JSON,Promise,URL,
  document:{readyState:"loading",currentScript:{src:"https://example.test/achievement-sharing-avatar-bridge-v1.js"},baseURI:"https://example.test/",write(value){writesFromRoot.push(value);},querySelector(){return null;},createElement(){return{};},head:{appendChild(){}},documentElement:{appendChild(){}}},
  window:null,globalThis:null
};
rootContext.window = rootContext;
rootContext.globalThis = rootContext;
vm.createContext(rootContext);
vm.runInContext(rootSource, rootContext, {filename:rootFile});
if (writesFromRoot.length !== 3 || !writesFromRoot[0].includes(profileFile) || !writesFromRoot[1].includes(adapterFile) || !writesFromRoot[2].includes(featureFile)) fail("Historical parser-time load order changed");

console.log("Avatar sharing bridge extraction validation passed: read-only adapter snapshot, storage-free feature, stable decoration/API/events, ordered historical loading and r75 offline delivery.");
