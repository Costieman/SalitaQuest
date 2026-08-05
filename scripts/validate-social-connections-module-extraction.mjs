import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source,markers,label) => markers.forEach(marker => { if(!source.includes(marker)) fail(`${label} is missing: ${marker}`); });

const coordinatorPath = "social-connections-v2.js";
const profilePath = "src/core/learner-profile-runtime-v1.js";
const adapterPath = "src/adapters/sharing/social-connections-runtime-v1.js";
const featurePath = "src/features/sharing/social-connections-v2.js";
for (const file of [coordinatorPath,profilePath,adapterPath,featurePath,"src/config/course-manifest.js","service-worker.js"]) {
  new vm.Script(read(file),{filename:file});
}

const coordinator = read(coordinatorPath);
requireMarkers(coordinator,[
  "__salitaQuestSocialConnectionsV2CoordinatorInstalled",
  "__salitaQuestSocialConnectionsV2CompatibilityLoading",
  "./src/core/learner-profile-runtime-v1.js?v=5.6.1",
  "./src/adapters/sharing/social-connections-runtime-v1.js?v=5.6.0",
  "./src/features/sharing/social-connections-v2.js?v=5.4.27",
  "document.write",
  "loadDependency",
  "runtime-v1",
  "feature-v2"
],"Social connections compatibility coordinator");
for (const forbidden of ["localStorage.","sessionStorage.","fetch(","document.addEventListener","window.addEventListener","window.SalitaQuestSocialConnections=","salita-social-oauth","socialLinksCard","switchView="]) {
  if (coordinator.includes(forbidden)) fail(`Compatibility coordinator still owns feature behavior: ${forbidden}`);
}
if (coordinator.indexOf("social-connections-runtime-v1.js") > coordinator.indexOf("src/features/sharing/social-connections-v2.js")) fail("Compatibility dependency order changed");

const profileRuntime = read(profilePath);
requireMarkers(profileRuntime,["salitaQuestLocalProfilesV1","salitaQuestActiveProfileId","readStore","writeStore","activeProfile","SalitaQuestLearnerProfileRuntimeV1"],"Shared learner profile runtime");
const adapter = read(adapterPath);
requireMarkers(adapter,[
  "__salitaQuestSocialConnectionsRuntimeV1Installed",
  'SalitaQuestLearnerProfileRuntimeV1?.activeProfile()',
  'const API_STORAGE = "salitaQuestSocialApiBase"',
  "function activeProfile()",
  "function explicitApiBase()",
  "function developerApiBase()",
  "function setDeveloperApiBase(value)",
  "function openView(view)",
  "function wrapView(createWrapper)",
  "window.SalitaQuestSocialConnectionsRuntimeV1",
  "version:1",
  "release:RELEASE"
],"Social connections runtime adapter");
for (const forbidden of ["document.","fetch(","addEventListener","socialLinksCard","salita-social-oauth","SalitaQuestSocialConnections=Object.freeze"]) {
  if (adapter.includes(forbidden)) fail(`Runtime adapter owns feature behavior: ${forbidden}`);
}

const feature = read(featurePath);
requireMarkers(feature,[
  'const INSTALL_FLAG = "__salitaQuestSocialConnectionsV3Installed"',
  'const LEGACY_FLAG = "__salitaQuestSocialConnectionsV2Installed"',
  'const RUNTIME_GLOBAL = "SalitaQuestSocialConnectionsRuntimeV1"',
  'const RELEASE = "5.5.8-sharing-foundation"',
  'const DEFAULT_API_BASE = "https://salita-quest-social-share-zvxenj6xcq-as.a.run.app"',
  "runtime().activeProfile()",
  "runtime().explicitApiBase()",
  "runtime().developerApiBase()",
  "runtime().setDeveloperApiBase(value)",
  'runtime().openView("badges")',
  "runtime().wrapView",
  'runtime().openView("settings")',
  'fetch(`${base}/health`',
  "/api/social/connections?profileId=",
  "/oauth/${encodeURIComponent(provider)}/start",
  "/api/social/posts",
  "salita-social-oauth",
  "window.SalitaQuestSocialConnections=Object.freeze",
  "version:3,release:RELEASE",
  "No account setup required.",
  "Progress sharing is ready."
],"Extracted social connections feature");
for (const forbidden of ["localStorage.","sessionStorage.","SALITA_SOCIAL_API_BASE","typeof switchView","switchView=function"]) {
  if (feature.includes(forbidden)) fail(`Feature bypasses runtime adapter: ${forbidden}`);
}
if ((feature.match(/document\.addEventListener/g)||[]).length !== 1) fail("Feature document listener ownership changed");
if ((feature.match(/window\.addEventListener/g)||[]).length !== 1) fail("Feature window listener ownership changed");
if ((feature.match(/setInterval/g)||[]).length !== 0) fail("Feature introduced polling");

const manifestContext={window:{}};
vm.createContext(manifestContext);
vm.runInContext(read("src/config/course-manifest.js"),manifestContext,{filename:"src/config/course-manifest.js"});
for (const courseId of ["tagalog","cebuano"]) {
  const scripts=manifestContext.window.SalitaQuestCourseManifest?.courses?.[courseId]?.scripts || [];
  const profiles=scripts.indexOf("src/core/learner-profile-runtime-v1.js?v=5.6.1");
  const placement=scripts.indexOf("placement-onboarding-v1.js?v=5.4.23");
  const runtime=scripts.indexOf("src/adapters/sharing/social-connections-runtime-v1.js?v=5.6.0");
  const featureIndex=scripts.indexOf("src/features/sharing/social-connections-v2.js?v=5.4.27");
  const sharing=scripts.indexOf("achievement-sharing-v4.js?v=5.4.29");
  if (!(profiles >= 0 && placement > profiles && runtime > placement && featureIndex > runtime && sharing > featureIndex)) fail(`${courseId} social connections order changed`);
  if (scripts.some(asset => asset.includes("social-connections-v2.js?v=5.4.27") && !asset.startsWith("src/features/"))) fail(`${courseId} still loads the historical root URL`);
}

const refresh=read("mobile-refresh.html");
requireMarkers(refresh,[
  "./src/core/learner-profile-runtime-v1.js?v=${RELEASE}",
  "./social-connections-v2.js?v=${RELEASE}",
  "./src/adapters/sharing/social-connections-runtime-v1.js?v=${RELEASE}",
  "./src/features/sharing/social-connections-v2.js?v=${RELEASE}"
],"Mobile refresh social boundary");

const worker=read("service-worker.js");
requireMarkers(worker,[
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-23-badge-catalogue-extraction-r76"',
  'const CACHE_NAME = "salita-quest-v5-6-24-social-connections-extraction-r77"',
  '"./src/core/learner-profile-runtime-v1.js"',
  '"./social-connections-v2.js"',
  '"./src/adapters/sharing/social-connections-runtime-v1.js"',
  '"./src/features/sharing/social-connections-v2.js"'
],"Social connections offline delivery");

const storage = new Map([
  ["salitaQuestLocalProfilesV1",JSON.stringify({profiles:[{id:"p1",name:"Learner"}]})],
  ["salitaQuestSocialApiBase","https://developer.example/"]
]);
const session = new Map([["salitaQuestActiveProfileId","p1"]]);
const viewCalls=[];
const runtimeContext={
  console,
  JSON,
  Object,
  String,
  TypeError,
  localStorage:{getItem:key=>storage.has(key)?storage.get(key):null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},
  sessionStorage:{getItem:key=>session.has(key)?session.get(key):null},
  switchView(view){viewCalls.push(view);return `view:${view}`;}
};
runtimeContext.window=runtimeContext;
vm.createContext(runtimeContext);
vm.runInContext(profileRuntime,runtimeContext,{filename:profilePath});
vm.runInContext(adapter,runtimeContext,{filename:adapterPath});
const runtimeApi=runtimeContext.SalitaQuestSocialConnectionsRuntimeV1;
if (!runtimeApi || runtimeApi.version!==1 || runtimeApi.release!=="5.6.0") fail("Runtime API version changed");
if (runtimeApi.activeProfile()?.id!=="p1") fail("Active profile lookup changed");
if (runtimeApi.developerApiBase()!=="https://developer.example/") fail("Developer override read changed");
runtimeApi.setDeveloperApiBase("https://next.example/");
if (storage.get("salitaQuestSocialApiBase")!=="https://next.example") fail("Developer override normalization changed");
runtimeApi.setDeveloperApiBase("");
if (storage.has("salitaQuestSocialApiBase")) fail("Developer override removal changed");
runtimeContext.SALITA_SOCIAL_API_BASE="https://explicit.example/";
if (runtimeApi.explicitApiBase()!=="https://explicit.example/") fail("Explicit API base lookup changed");
if (runtimeApi.openView("badges")!=="view:badges" || viewCalls.at(-1)!=="badges") fail("Runtime navigation invocation changed");
let wrappedCalls=0;
if (!runtimeApi.wrapView(base=>function(view){wrappedCalls++;return base.apply(this,arguments);})) fail("Runtime view wrapping failed");
runtimeContext.switchView("settings");
if (wrappedCalls!==1 || viewCalls.at(-1)!=="settings") fail("Runtime view wrapper changed");
const runtimeBefore=runtimeContext.SalitaQuestSocialConnectionsRuntimeV1;
vm.runInContext(adapter,runtimeContext,{filename:`${adapterPath}#duplicate`});
if (runtimeContext.SalitaQuestSocialConnectionsRuntimeV1!==runtimeBefore) fail("Runtime duplicate installation changed the API");

const nodes=new Map();
const classList=()=>({add(){},remove(){},toggle(){}});
function makeNode(initialId="") {
  let nodeId=initialId;
  const node={className:"",textContent:"",hidden:false,value:"",dataset:{},classList:classList(),children:[],parentNode:null,
    appendChild(child){child.parentNode=this;this.children.push(child);if(child.id)nodes.set(child.id,child);return child;},
    scrollIntoView(){this.scrolled=true;},
    querySelector(selector){if(selector==="#badgePickerCount")return null;return null;},
    querySelectorAll(){return [];},
    setAttribute(){},
    addEventListener(){},
    remove(){if(nodeId)nodes.delete(nodeId);}
  };
  Object.defineProperty(node,"id",{get(){return nodeId;},set(value){if(nodeId)nodes.delete(nodeId);nodeId=value;if(value)nodes.set(value,node);}});
  let html="";
  Object.defineProperty(node,"innerHTML",{get(){return html;},set(value){html=String(value);}});
  if(initialId)nodes.set(initialId,node);
  return node;
}
const settings=makeNode("settingsView");
const statusNode=makeNode("socialConnectionsStatus");
const inputNode=makeNode("socialApiBaseInput");
const badgesView=makeNode("badgesView");
const documentListeners=new Map();
const windowListeners=new Map();
const document={
  getElementById:id=>nodes.get(id)||null,
  createElement:()=>makeNode(),
  addEventListener:(type,handler)=>{const list=documentListeners.get(type)||[];list.push(handler);documentListeners.set(type,list);}
};
const fetchCalls=[];
const fetchStub=async (url,options={})=>{
  fetchCalls.push({url:String(url),options});
  if(String(url).endsWith("/health")) return {ok:true,status:200,json:async()=>({ok:true,bucketConfigured:true})};
  if(String(url).includes("/api/social/connections?")) return {ok:true,status:200,json:async()=>({connections:{facebook:{connected:true,displayName:"Learner"}}})};
  if(String(url).includes("/api/social/posts")) return {ok:true,status:200,json:async()=>({ok:true,id:"post1"})};
  if(options.method==="DELETE") return {ok:true,status:200,json:async()=>({ok:true})};
  return {ok:false,status:404,json:async()=>({})};
};
let openedPopup=null;
Object.assign(runtimeContext,{
  document,
  fetch:fetchStub,
  URL,
  encodeURIComponent,
  location:{search:"",hostname:"example.com",origin:"https://app.example.com"},
  screen:{width:1200,height:900},
  setTimeout:handler=>{handler();return 1;},
  open(){openedPopup={closed:false,close(){this.closed=true;}};return openedPopup;},
  addEventListener:(type,handler)=>{const list=windowListeners.get(type)||[];list.push(handler);windowListeners.set(type,list);}
});
runtimeContext.window=runtimeContext;
runtimeContext.SALITA_SOCIAL_API_BASE="";
vm.runInContext(feature,runtimeContext,{filename:featurePath});
await new Promise(resolve=>setImmediate(resolve));
await new Promise(resolve=>setImmediate(resolve));
const api=runtimeContext.SalitaQuestSocialConnections;
if (!api || api.version!==3 || api.release!=="5.5.8-sharing-foundation") fail("Public social API changed");
for (const method of ["apiBase","isConnected","getAll","post","refresh","ensureHosted","hostedStatus","openSettings"]) if(typeof api[method]!=="function") fail(`Public social API is missing ${method}`);
if (!runtimeContext.__salitaQuestSocialConnectionsV3Installed || !runtimeContext.__salitaQuestSocialConnectionsV2Installed) fail("Install flags changed");
if ((documentListeners.get("click")||[]).length!==1 || (windowListeners.get("message")||[]).length!==1) fail("Feature listener ownership changed");
if (!nodes.get("socialLinksCard")) fail("Settings card was not installed");
await api.refresh();
if (api.hostedStatus()!==true || !api.isConnected("facebook")) fail("Hosted readiness or connection refresh changed");
const copy=api.getAll();copy.facebook={connected:false};
if (!api.isConnected("facebook")) fail("Connection map snapshot changed");
const posted=await api.post("facebook",{caption:"Hello"});
if (!posted.ok || !fetchCalls.some(call=>call.url.includes("/api/social/posts") && String(call.options.body).includes('"profileId":"p1"'))) fail("Connected posting contract changed");
api.openSettings();
if (viewCalls.at(-1)!=="settings" || !nodes.get("socialLinksCard").scrolled) fail("Open settings behavior changed");
runtimeContext.SALITA_SOCIAL_API_BASE="https://explicit.example/";
if (api.apiBase()!=="https://explicit.example") fail("Public API base normalization changed");

const clickHandler=(documentListeners.get("click")||[])[0];
const connectTarget={dataset:{socialConnect:"linkedin"},closest(selector){return selector==="[data-social-connect]"?this:null;}};
clickHandler({target:connectTarget});
if (!openedPopup) fail("OAuth popup behavior changed");
const messageHandler=(windowListeners.get("message")||[])[0];
messageHandler({origin:"https://wrong.example",data:{type:"salita-social-oauth",ok:true}});
if (openedPopup.closed) fail("OAuth origin guard changed");
const expectedOrigin=new URL(api.apiBase()).origin;
messageHandler({origin:expectedOrigin,data:{type:"salita-social-oauth",ok:true,provider:"linkedin"}});
if (!openedPopup.closed) fail("OAuth completion behavior changed");

const listenersBefore=[(documentListeners.get("click")||[]).length,(windowListeners.get("message")||[]).length];
const viewHandlerBefore=runtimeContext.switchView;
vm.runInContext(feature,runtimeContext,{filename:`${featurePath}#duplicate`});
if ((documentListeners.get("click")||[]).length!==listenersBefore[0] || (windowListeners.get("message")||[]).length!==listenersBefore[1] || runtimeContext.switchView!==viewHandlerBefore) fail("Feature duplicate installation is not idempotent");

const writes=[];
const coordinatorContext={console,URL,Promise,window:{},document:{readyState:"loading",currentScript:{src:"https://app.example.com/social-connections-v2.js?v=5.4.27"},baseURI:"https://app.example.com/",write:value=>writes.push(value),querySelector:()=>null}};
vm.createContext(coordinatorContext);
vm.runInContext(coordinator,coordinatorContext,{filename:coordinatorPath});
if (writes.length!==3 || !writes[0].includes("learner-profile-runtime-v1.js") || !writes[1].includes("social-connections-runtime-v1.js") || !writes[2].includes("src/features/sharing/social-connections-v2.js")) fail("Parser-time compatibility order changed");
vm.runInContext(coordinator,coordinatorContext,{filename:`${coordinatorPath}#duplicate`});
if (writes.length!==3) fail("Compatibility coordinator duplicate installation changed");

for (const file of [coordinatorPath,profilePath,adapterPath,featurePath,"src/config/course-manifest.js","service-worker.js"]) {
  const check=spawnSync("node",["--check",file],{encoding:"utf8"});
  if(check.status!==0) fail(`${file} failed syntax check: ${check.stderr}`);
}
console.log("Social connections extraction validation passed: adapter-owned profile/API storage and navigation, preserved hosted health, OAuth, settings UI, public API, ordered compatibility loading and r77 offline delivery.");
