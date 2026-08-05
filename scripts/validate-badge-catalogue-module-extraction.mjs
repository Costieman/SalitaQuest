import fs from "node:fs";
import vm from "node:vm";

const read = file => fs.readFileSync(file,"utf8");
const fail = message => { throw new Error(message); };
const rootFile = "badge-catalogue-v2.js";
const adapterFile = "src/adapters/badges/badge-catalogue-runtime-v1.js";
const featureFile = "src/features/badges/badge-catalogue-v2.js";
const rootSource = read(rootFile);
const adapterSource = read(adapterFile);
const featureSource = read(featureFile);
const manifestSource = read("src/config/course-manifest.js");
const profileSource = read("profile-emblem-control.js");
const refreshSource = read("mobile-refresh.html");
const workerSource = read("service-worker.js");
for (const [file,source] of [[rootFile,rootSource],[adapterFile,adapterSource],[featureFile,featureSource],["src/config/course-manifest.js",manifestSource]]) new vm.Script(source,{filename:file});

for (const marker of [
  "__salitaQuestBadgeCatalogueV2CoordinatorInstalled",
  "__salitaQuestBadgeCatalogueV2CompatibilityLoading",
  'const ADAPTER_URL = "./src/adapters/badges/badge-catalogue-runtime-v1.js?v=5.6.0"',
  'const FEATURE_URL = "./src/features/badges/badge-catalogue-v2.js?v=5.4.23"',
  "document.currentScript","document.write","script.async = false",'"runtime-v1"','"feature-v2"'
]) if (!rootSource.includes(marker)) fail(`Compatibility coordinator missing ${marker}`);
for (const forbidden of ["ADDITIONAL_BADGES","badgeState","renderCatalogue","recordDailyAnswerWithBadgeMetrics","switchViewWithBadgeCelebrations","salita:badges-rendered","MAX_PENDING","localStorage","sessionStorage"])
  if (rootSource.includes(forbidden)) fail(`Compatibility coordinator owns ${forbidden}`);

for (const marker of [
  'const API = "SalitaBadgeCatalogueRuntimeV1"','const WRAPPABLE = new Set(["recordDailyAnswer","recordDailySession","renderBadges","switchView"])',
  "function catalogueFeatureReady","function sessionValue()","function save()","function badgeArtValue(id)","function bossReadyValue()",
  "function readFunction(name)","function replaceFunction(name, next)","function wrapFunction(name, factory)","function invoke(name, ...args)",
  "ready,","state:stateValue","catalogue:catalogueValue","refresh"
]) if (!adapterSource.includes(marker)) fail(`Badge runtime missing ${marker}`);

for (const marker of [
  'const API = "SalitaBadgeCatalogueFeatureV2"','const INSTALL_FLAG = "__salitaQuestBadgeCatalogueV2Installed"','const RELEASE = "5.4.23"',
  "const MAX_PENDING = 40","const appState = () => runtime?.state?.() || null","const catalogue = () => runtime?.catalogue?.() || []",
  "const ADDITIONAL_BADGES = [","recordDailyAnswerWithBadgeMetrics","recordDailySessionWithBadgeMetrics","renderBadgesAsCatalogue","switchViewWithBadgeCelebrations",
  'runtime.wrapFunction("recordDailyAnswer"','runtime.wrapFunction("recordDailySession"','runtime.wrapFunction("renderBadges"','runtime.wrapFunction("switchView"',
  'new CustomEvent("salita:badges-rendered"',"pendingCelebrations","celebratedIds","earnedAt","New badge earned!","window[API] = Object.freeze"
]) if (!featureSource.includes(marker)) fail(`Extracted badge feature missing ${marker}`);
for (const pattern of [/\bBADGES\b/,/(?<!\.)\bsaveState\s*\(/,/(?<!\.)\bbadgeArt\s*\(/,/(?<!\.)\bbossReady\s*\(/,/typeof state/,/localStorage|sessionStorage/,/eval\(/])
  if (pattern.test(featureSource)) fail(`Extracted badge feature retains engine/storage access: ${pattern}`);
for (const name of ["recordDailyAnswer","recordDailySession","renderBadges","switchView"]) {
  const count = (featureSource.match(new RegExp(`runtime\\.wrapFunction\\("${name}"`,'g')) || []).length;
  if (count !== 1) fail(`${name} must be wrapped exactly once, found ${count}`);
}
if ((featureSource.match(/new CustomEvent\("salita:badges-rendered"/g)||[]).length !== 1) fail("Badge render event ownership changed");
if ((featureSource.match(/setInterval/g)||[]).length) fail("Badge catalogue introduced polling");

const manifestContext={window:{}}; vm.createContext(manifestContext); vm.runInContext(manifestSource,manifestContext);
for (const [id,course] of Object.entries(manifestContext.window.SalitaQuestCourseManifest.courses)) {
  const reward=course.scripts.indexOf("src/features/progression/home-reward-coordinator.js?v=5.4.22");
  const adapter=course.scripts.indexOf("src/adapters/badges/badge-catalogue-runtime-v1.js?v=5.6.0");
  const feature=course.scripts.indexOf("src/features/badges/badge-catalogue-v2.js?v=5.4.23");
  const chest=course.scripts.indexOf("badge-chest-v2.js?v=5.4.29");
  if (!(reward>=0 && adapter>reward && feature>adapter && chest>feature)) fail(`${id} badge runtime order changed`);
  if (course.scripts.includes("badge-catalogue-v2.js?v=5.4.23")) fail(`${id} still executes historical badge root`);
}
if (!profileSource.includes("if (!window.SalitaBadgeCatalogueRuntimeV1)")) fail("Profile loader can duplicate the manifest adapter");
for (const marker of [
  `./${rootFile}?v=\${RELEASE}`,`./${adapterFile}?v=\${RELEASE}`,`./${featureFile}?v=\${RELEASE}`
]) if (!refreshSource.includes(marker)) fail(`Mobile refresh missing ${marker}`);
for (const marker of [
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-22-avatar-sharing-bridge-extraction-r75"',
  'const CACHE_NAME = "salita-quest-v5-6-23-badge-catalogue-extraction-r76"',
  `"./${rootFile}"`,`"./${adapterFile}"`,`"./${featureFile}"`
]) if (!workerSource.includes(marker)) fail(`Offline delivery missing ${marker}`);

const events=[]; const timers=[]; let saves=0; let baseAnswers=0; let baseSessions=0; let baseRenders=0; const views=[];
const state={totalAnswers:30,correctAnswers:20,bestStreak:4,itemState:{a:{mastery:5,longTermMastery:1}},settings:{reducedMotion:true},badgeProgress:{},badgeMetrics:{}};
const badges=[{id:"first_step",icon:"🌱",name:"First",description:"First",test:s=>s.totalAnswers>=1}];
const shelf={classList:{add(){}},innerHTML:"",children:[],appendChild(node){this.children.push(node);}};
const countEl={textContent:""}; const summary={textContent:""};
const document={
  hidden:false,documentElement:{dataset:{}},body:{dataset:{currentView:"learn"},appendChild(){}},
  getElementById(id){if(id==="badgeShelf")return shelf;if(id==="achievementCount")return countEl;if(id==="homeView")return {classList:{contains(){return false;}}};return null;},
  querySelector(selector){if(selector==="#badgesView .badges-page-summary h3")return summary;return null;},querySelectorAll(){return[];},
  createElement(tag){return {tagName:tag.toUpperCase(),className:"",dataset:{},innerHTML:"",classList:{add(){},remove(){}},setAttribute(){},appendChild(){},querySelector(selector){if(selector===".badge-custom-image"||selector==="img")return {addEventListener(){},remove(){}};return null;}};}
};
class CustomEvent{constructor(type,init={}){this.type=type;this.detail=init.detail;}}
const context={console,Object,Array,Set,Map,Date,Math,Number,String,Boolean,JSON,Promise,URL,CustomEvent,document,
  state,BADGES:badges,session:{mode:"quick"},localStorage:{getItem(){return null;}},sessionStorage:{getItem(){return null;}},
  saveState(){saves+=1;},levelInfo(){return{level:12};},totalLearningPoints(){return 345;},badgeArt(id){return`art:${id}`;},bossReady(){return true;},
  recordDailyAnswer(){baseAnswers+=1;return"answer";},recordDailySession(){baseSessions+=1;return"session";},renderBadges(){baseRenders+=1;},switchView(view){views.push(view);return`view:${view}`;},
  matchMedia(){return{matches:true};},requestAnimationFrame(fn){fn();return 1;},setTimeout(fn,delay){timers.push({fn,delay});return timers.length;},clearTimeout(){},window:null,globalThis:null};
context.window=context;context.globalThis=context;context.dispatchEvent=e=>{events.push(e);return true;};
vm.createContext(context);vm.runInContext(adapterSource,context,{filename:adapterFile});vm.runInContext(featureSource,context,{filename:featureFile});
const runtime=context.SalitaBadgeCatalogueRuntimeV1; const api=context.SalitaBadgeCatalogueFeatureV2;
if (!runtime||!api||!context.__salitaQuestBadgeCatalogueV2Installed) fail("Badge APIs/install flag missing");
if (!runtime.catalogueFeatureReady()) fail("Badge runtime readiness changed");
if (badges.length<22||new Set(badges.map(b=>b.id)).size!==badges.length) fail(`Badge definitions changed: ${badges.length}`);
if (baseRenders!==1||shelf.children.length!==badges.length) fail("Initial catalogue render changed");
const renderEvent=events.find(e=>e.type==="salita:badges-rendered");
if (!renderEvent||renderEvent.detail.total!==badges.length) fail("Badge render event changed");
const savesAfterInstall=saves;
if (context.recordDailyAnswer(true,false)!=="answer"||baseAnswers!==1||state.badgeMetrics.quickReviewItems!==1||saves!==savesAfterInstall+1) fail("Quick-answer wrapper changed");
context.session={mode:"daily"};
if (context.recordDailySession()!=="session"||baseSessions!==1||state.badgeMetrics.dailySessions!==1||saves!==savesAfterInstall+2) fail("Daily-session wrapper changed");
if (context.switchView("badges")!=="view:badges"||views.at(-1)!=="badges") fail("Badge view wrapper changed");
const wrapped=[context.recordDailyAnswer,context.recordDailySession,context.renderBadges,context.switchView];
vm.runInContext(featureSource,context,{filename:featureFile});
if (wrapped.some((fn,index)=>fn!==[context.recordDailyAnswer,context.recordDailySession,context.renderBadges,context.switchView][index])) fail("Duplicate feature installation rewrapped engine functions");

const writes=[];const rootContext={console,Object,Array,Set,Map,Date,Math,Number,String,Boolean,JSON,Promise,URL,document:{readyState:"loading",currentScript:{src:"https://example.test/badge-catalogue-v2.js"},baseURI:"https://example.test/",write(value){writes.push(value);},querySelector(){return null;},createElement(){return{};},head:{appendChild(){}},documentElement:{appendChild(){}}},window:null,globalThis:null};rootContext.window=rootContext;rootContext.globalThis=rootContext;vm.createContext(rootContext);vm.runInContext(rootSource,rootContext);
if (writes.length!==2||!writes[0].includes(adapterFile)||!writes[1].includes(featureFile)) fail("Historical parser-time dependency order changed");
console.log("Badge catalogue extraction validation passed: adapter-owned engine wrapping, preserved badge state/render/event contracts, ordered compatibility loading and r76 offline delivery.");
