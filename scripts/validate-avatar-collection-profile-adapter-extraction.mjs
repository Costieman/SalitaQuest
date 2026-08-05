import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };
const adapter = read("src/adapters/avatar/avatar-collection-profile-runtime-v1.js");
const feature = read("src/features/avatar/avatar-collection-screen-v1.js");
const compatibility = read("avatar-collection-screen-v1.js");
const page = read("avatar-collection-page-v2.js");
const loader = read("profile-emblem-control.js");
const hotfix = read("src/features/interface/collection-key-translation-hotfix.js");
const worker = read("service-worker.js");
const refresh = read("mobile-refresh.html");

for (const [name,source] of Object.entries({adapter,feature,compatibility,page,loader,hotfix})) new vm.Script(source,{filename:name});
for (const marker of ['const PROFILE_STORE = "salitaQuestLocalProfilesV1"','const ACTIVE_PROFILE = "salitaQuestActiveProfileId"','readContext','saveContext','equip','SalitaAvatarCollectionProfileRuntimeV1']) if (!adapter.includes(marker)) fail(`Adapter missing ${marker}`);
for (const forbidden of ["document.","addEventListener","dispatchEvent","MutationObserver"]) if (adapter.includes(forbidden)) fail(`Adapter owns UI/event behavior: ${forbidden}`);
for (const [name,source] of Object.entries({feature,page})) {
  if (/localStorage|sessionStorage|salitaQuestLocalProfilesV1|salitaQuestActiveProfileId/.test(source)) fail(`${name} still owns profile storage`);
  if (!source.includes("SalitaAvatarCollectionProfileRuntimeV1")) fail(`${name} does not consume the adapter`);
}
for (const marker of ['document.write','script.async = false','avatar-collection-profile-runtime-v1.js','src/features/avatar/avatar-collection-screen-v1.js']) if (!compatibility.includes(marker)) fail(`Compatibility coordinator missing ${marker}`);
for (const forbidden of ["PROFILE_STORE","ACTIVE_PROFILE","ownedAvatarIds","salita:avatar-equipped","MutationObserver","sq-avatar-card"]) if (compatibility.includes(forbidden)) fail(`Compatibility coordinator owns ${forbidden}`);

const storage = new Map();
let writes = 0;
const localStorage = {getItem:key=>storage.get(key)??null,setItem(key,value){writes += 1; storage.set(key,String(value));}};
const sessionStorage = {getItem:key=>key === "salitaQuestActiveProfileId" ? "learner-1" : null};
const model = {
  normaliseCollectionState(value,fallback){return {ownedAvatarIds:["anahaw","eagle"],equippedAvatarId:value?.equippedAvatarId || fallback || "anahaw",shards:{}};},
  get(id){return ["anahaw","eagle"].includes(id) ? {id,name:id,image:`avatars/canonical/${id}.png`} : null;}
};
storage.set("salitaQuestLocalProfilesV1",JSON.stringify({schemaVersion:1,profiles:[{id:"learner-1",avatarId:"anahaw",avatarCollection:{ownedAvatarIds:["anahaw","eagle"],equippedAvatarId:"anahaw"}}]}));
const context = {window:null,localStorage,sessionStorage,JSON,Date,Object,Array,Set,Map,String,Number,Math};
context.window = context;
context.SalitaAvatarModel = model;
vm.createContext(context);
vm.runInContext(adapter,context,{filename:"adapter"});
if (context.SalitaAvatarCollectionProfileRuntimeV1?.version !== 1) fail("Adapter API/version missing");
writes = 0;
const first = context.SalitaAvatarCollectionProfileRuntimeV1.readContext();
if (!first || writes !== 1 || first.collection.equippedAvatarId !== "anahaw") fail("readContext normalization/write contract changed");
writes = 0;
const equipped = context.SalitaAvatarCollectionProfileRuntimeV1.equip("eagle");
if (!equipped || equipped.item.id !== "eagle" || writes !== 2) fail("Equip must preserve read-plus-save write count");
const persisted = JSON.parse(storage.get("salitaQuestLocalProfilesV1"));
if (persisted.profiles[0].avatarId !== "eagle" || persisted.profiles[0].avatarCollection.equippedAvatarId !== "eagle") fail("Equipped avatar persistence changed");
writes = 0;
if (context.SalitaAvatarCollectionProfileRuntimeV1.equip("locked") !== null || writes !== 1) fail("Locked-avatar rejection/write contract changed");
const api = context.SalitaAvatarCollectionProfileRuntimeV1;
vm.runInContext(adapter,context,{filename:"adapter-duplicate"});
if (context.SalitaAvatarCollectionProfileRuntimeV1 !== api) fail("Duplicate install replaced adapter API");

const adapterIndex = loader.indexOf('loadScript("collection-profile-runtime"');
const featureIndex = loader.indexOf('loadScript("collection-feature"');
const rootIndex = loader.indexOf('loadScript("collection"');
if (!(adapterIndex >= 0 && featureIndex > adapterIndex && rootIndex > featureIndex)) fail("Profile loader order changed");
if (!hotfix.includes('avatar-collection-profile-runtime-v1.js?v=5.5.12') || !hotfix.includes('ordered:true')) fail("Full-page compatibility delivery is not ordered behind the adapter");
for (const marker of [
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-21-avatar-collection-profile-adapter-extraction-r74"',
  'const CACHE_NAME = "salita-quest-v5-6-22-avatar-sharing-bridge-extraction-r75"',
  '"./avatar-collection-screen-v1.js"',
  '"./src/adapters/avatar/avatar-collection-profile-runtime-v1.js"',
  '"./src/features/avatar/avatar-collection-screen-v1.js"',
  '"./avatar-collection-page-v2.js"'
]) if (!worker.includes(marker)) fail(`Offline delivery missing ${marker}`);
for (const marker of ['src/adapters/avatar/avatar-collection-profile-runtime-v1.js','src/features/avatar/avatar-collection-screen-v1.js','avatar-collection-page-v2.js']) if (!refresh.includes(marker)) fail(`Mobile refresh missing ${marker}`);

console.log("Avatar Collection profile adapter validation passed: one persistence owner, stable write counts, two UI consumers, compatibility loading and r74 offline delivery.");
