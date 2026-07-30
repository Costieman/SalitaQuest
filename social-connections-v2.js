(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestSocialConnectionsV2Installed";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const API_STORAGE = "salitaQuestSocialApiBase";
  const DEFAULT_API = "https://salita-quest-social-share-zvxenj6xcq-as.a.run.app";
  const PLATFORMS = [
    {id:"facebook",label:"Facebook",icon:"f",mode:"hosted",ready:"Badge and chest posts include the full image preview"},
    {id:"instagram",label:"Instagram",icon:"◎",mode:"device",ready:"Share the square image through the Instagram app"},
    {id:"tiktok",label:"TikTok",icon:"♪",mode:"device",ready:"Share the square image through the TikTok app"},
    {id:"x",label:"X",icon:"𝕏",mode:"hosted",ready:"Posts include the full achievement-card preview"},
    {id:"linkedin",label:"LinkedIn",icon:"in",mode:"hosted",ready:"Posts include the full achievement-card preview"}
  ];
  let connections = {};
  let pendingPopup = null;
  let hostedSharingAvailable = false;
  let checking = false;

  function retry(){ window.setTimeout(install,100); }
  function esc(value){ return String(value ?? "").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
  function readStore(){ try{return JSON.parse(localStorage.getItem(PROFILE_STORE)||"null")||{profiles:[]};}catch{return {profiles:[]};} }
  function activeProfile(){ const store=readStore(); const id=sessionStorage.getItem(ACTIVE_PROFILE); return store.profiles?.find(profile=>profile.id===id)||null; }
  function configuredApi(){ return String(window.SALITA_SOCIAL_API_BASE || localStorage.getItem(API_STORAGE) || DEFAULT_API).trim().replace(/\/$/,""); }
  function apiBase(){ return configuredApi(); }
  function apiOrigin(){ try{return new URL(apiBase()).origin;}catch{return "";} }
  function status(message,error=false){ const node=document.getElementById("socialConnectionsStatus"); if(node){node.textContent=message||"";node.classList.toggle("error",error);} }
  function connection(provider){ return connections[provider] || null; }
  function isConnected(provider){ return Boolean(connection(provider)?.connected); }

  function ensureCard(){
    const settings=document.getElementById("settingsView");
    if(!settings) return null;
    let card=document.getElementById("socialLinksCard");
    if(!card){ card=document.createElement("article"); card.id="socialLinksCard"; card.className="panel"; settings.appendChild(card); }
    card.className="panel social-connections-card";
    return card;
  }

  function platformRow(platform){
    const item=connection(platform.id);
    const connected=Boolean(item?.connected);
    const available=hostedSharingAvailable || platform.mode==="device";
    const state=connected?"connected":available?"ready":"checking";
    const detail=connected?`Connected${item.displayName?` as ${esc(item.displayName)}`:""}`:available?platform.ready:"Checking sharing availability…";
    const action=connected?`<button class="social-connection-action subtle" type="button" data-social-connect="${platform.id}">Disconnect</button>`:"";
    return `<article class="social-connection-row ${state}" data-provider="${platform.id}"><span class="social-connection-logo">${platform.icon}</span><div class="social-connection-copy"><strong>${platform.label}</strong><small>${detail}</small></div><span class="social-platform-state">${connected?"Connected":available?"Ready":"Checking"}</span>${action}</article>`;
  }

  function render(){
    const card=ensureCard();
    if(!card) return;
    const ready=hostedSharingAvailable;
    card.innerHTML=`<div class="social-connections-heading"><div><p class="eyebrow">SHARING</p><h3>Share your achievements</h3><p>Your badges and Badge Chest are prepared automatically as polished social cards. Choose a platform when you press Share—there is nothing else to configure.</p></div><span class="social-ready-mark ${ready?"ready":""}" aria-hidden="true">${ready?"✓":"↻"}</span></div>
      <div class="social-sharing-summary ${ready?"ready":"checking"}"><div><strong>${ready?"Achievement sharing is ready":"Checking achievement sharing…"}</strong><small>${ready?"Facebook, X and LinkedIn will receive a hosted image preview. Instagram and TikTok receive the square card through your device.":"Salita Quest is confirming the secure image service."}</small></div>${ready?`<button type="button" class="secondary-btn" data-social-open-badges>View badges</button>`:""}</div>
      <div class="social-connection-grid">${PLATFORMS.map(platformRow).join("")}</div>
      <details class="social-service-setup"><summary>Advanced troubleshooting</summary><div class="social-service-fields"><input id="socialApiBaseInput" type="url" inputmode="url" value="${esc(apiBase())}" aria-label="Social sharing service URL"><button class="secondary-btn" type="button" data-save-social-api>Update</button></div><p class="social-service-help">This address is managed by Salita Quest. Change it only while diagnosing a service problem.</p></details><p id="socialConnectionsStatus" class="social-connections-status"></p>`;
  }

  async function refresh(){
    const base=apiBase(); const profile=activeProfile();
    if(checking) return;
    checking=true; render();
    try{
      const health=await fetch(`${base}/health`,{headers:{Accept:"application/json"},cache:"no-store"});
      hostedSharingAvailable=health.ok;
      if(!profile){connections={};render();status(hostedSharingAvailable?"Sharing is ready.":"Achievement sharing is temporarily unavailable.",!hostedSharingAvailable);return;}
      const response=await fetch(`${base}/api/social/connections?profileId=${encodeURIComponent(profile.id)}`,{credentials:"include",headers:{Accept:"application/json"}});
      if(response.status===404 || response.status===501){connections={};render();status(hostedSharingAvailable?"Sharing is ready. Direct account connections will appear here when supported.":"Achievement sharing is temporarily unavailable.",!hostedSharingAvailable);return;}
      if(!response.ok) throw new Error(`Connection service returned ${response.status}`);
      const data=await response.json();
      connections=data.connections && typeof data.connections==="object" ? data.connections : {};
      render(); status(hostedSharingAvailable?"Sharing is ready.":"");
    }catch(error){connections={};hostedSharingAvailable=false;render();status("Achievement sharing is temporarily unavailable. You can still download the card.",true);console.warn(error);}finally{checking=false;}
  }

  function saveApi(){
    const value=String(document.getElementById("socialApiBaseInput")?.value||"").trim().replace(/\/$/,"");
    if(value && !/^https:\/\//i.test(value)){status("The service address must use HTTPS.",true);return;}
    if(value && value!==DEFAULT_API)localStorage.setItem(API_STORAGE,value);else localStorage.removeItem(API_STORAGE);
    connections={};hostedSharingAvailable=false;render();refresh();
  }

  function connect(provider){
    const base=apiBase(); const profile=activeProfile();
    if(!base || !profile) return;
    const width=620,height=760,left=Math.max(0,(screen.width-width)/2),top=Math.max(0,(screen.height-height)/2);
    const url=`${base}/oauth/${encodeURIComponent(provider)}/start?profileId=${encodeURIComponent(profile.id)}&returnOrigin=${encodeURIComponent(location.origin)}`;
    pendingPopup=window.open(url,"salitaSocialConnect",`popup=yes,width=${width},height=${height},left=${left},top=${top}`);
    if(!pendingPopup)status("Allow pop-ups to connect this account.",true);
  }

  async function disconnect(provider){
    const base=apiBase(); const profile=activeProfile(); if(!base||!profile)return;
    try{const response=await fetch(`${base}/api/social/connections/${encodeURIComponent(provider)}`,{method:"DELETE",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({profileId:profile.id})});if(!response.ok)throw new Error(`Disconnect failed (${response.status})`);await refresh();status(`${provider} disconnected.`);}catch(error){status(error.message,true);}
  }

  async function post(provider,payload){
    const base=apiBase(); const profile=activeProfile();
    if(!base||!profile||!isConnected(provider))throw new Error(`${provider} is not connected.`);
    const response=await fetch(`${base}/api/social/posts`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({profileId:profile.id,provider,...payload})});
    const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.message||`Posting failed (${response.status})`);return data;
  }

  function install(){
    if(window[INSTALL_FLAG])return;
    if(!document.getElementById("settingsView")){retry();return;}
    window[INSTALL_FLAG]=true;
    document.addEventListener("click",event=>{
      if(event.target.closest("[data-save-social-api]")){saveApi();return;}
      if(event.target.closest("[data-social-open-badges]")){try{switchView("badges");}catch{}return;}
      const button=event.target.closest("[data-social-connect]");if(!button)return;
      const provider=button.dataset.socialConnect;if(isConnected(provider))disconnect(provider);else connect(provider);
    });
    window.addEventListener("message",event=>{const origin=apiOrigin();if(!origin||event.origin!==origin||event.data?.type!=="salita-social-oauth")return;try{pendingPopup?.close();}catch{}pendingPopup=null;if(event.data.ok){status(`${event.data.provider||"Account"} connected.`);refresh();}else status(event.data.message||"The account could not be connected.",true);});
    const baseSwitch=typeof switchView==="function"?switchView:null;
    if(baseSwitch){switchView=function switchViewWithSocialConnections(view){const result=baseSwitch.apply(this,arguments);if(view==="settings")window.setTimeout(refresh,30);return result;};}
    window.SalitaQuestSocialConnections={apiBase,isConnected,getAll:()=>({...connections}),post,openSettings(){try{switchView("settings");}catch{}window.setTimeout(refresh,80);},refresh};
    render();refresh();
  }

  install();
})();