(() => {
  "use strict";

  const INSTALL_FLAG = "__salitaQuestSocialConnectionsV2Installed";
  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
  const API_STORAGE = "salitaQuestSocialApiBase";
  const PLATFORMS = [
    {id:"facebook",label:"Facebook",icon:"f",purpose:"Share links and supported connected-account posts"},
    {id:"instagram",label:"Instagram",icon:"◎",purpose:"Professional-account publishing requires Meta approval"},
    {id:"tiktok",label:"TikTok",icon:"♪",purpose:"Photo posting requires TikTok OAuth and approved scopes"},
    {id:"x",label:"X",icon:"𝕏",purpose:"Share composer now; connected posting needs API access"},
    {id:"linkedin",label:"LinkedIn",icon:"in",purpose:"Member posting requires the w_member_social scope"},
    {id:"google",label:"Google",icon:"G",purpose:"Account sign-in only; Google is not a social-post destination"}
  ];
  let connections = {};
  let pendingPopup = null;

  function retry(){ window.setTimeout(install,100); }
  function esc(value){ return String(value ?? "").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
  function readStore(){ try{return JSON.parse(localStorage.getItem(PROFILE_STORE)||"null")||{profiles:[]};}catch{return {profiles:[]};} }
  function activeProfile(){ const store=readStore(); const id=sessionStorage.getItem(ACTIVE_PROFILE); return store.profiles?.find(profile=>profile.id===id)||null; }
  function apiBase(){ return String(window.SALITA_SOCIAL_API_BASE || localStorage.getItem(API_STORAGE) || "").trim().replace(/\/$/,""); }
  function apiOrigin(){ try{return new URL(apiBase()).origin;}catch{return "";} }
  function status(message,error=false){ const node=document.getElementById("socialConnectionsStatus"); if(node){node.textContent=message||"";node.style.color=error?"var(--red)":"var(--green)";} }
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

  function render(){
    const card=ensureCard();
    if(!card) return;
    const base=apiBase();
    card.innerHTML=`<div class="social-connections-heading"><div><p class="eyebrow">SOCIAL ACCOUNTS</p><h3>Connected accounts</h3><p>Connect an account through a secure OAuth service, then use supported providers from the badge sharing panel. Salita Quest never stores provider secrets in the browser.</p></div><span>🔗</span></div>
      <div class="social-connection-grid">${PLATFORMS.map(platform=>{
        const item=connection(platform.id); const connected=Boolean(item?.connected); const setup=!base;
        const detail=connected ? `Connected${item.displayName?` as ${esc(item.displayName)}`:""}` : setup ? "Secure connection service not configured" : platform.purpose;
        return `<article class="social-connection-row ${connected?"connected":setup?"setup-required":""}" data-provider="${platform.id}"><span class="social-connection-logo">${platform.icon}</span><div class="social-connection-copy"><strong>${platform.label}</strong><small>${detail}</small></div><button class="social-connection-action" type="button" data-social-connect="${platform.id}">${connected?"Disconnect":setup?"Setup":"Connect"}</button></article>`;
      }).join("")}</div>
      <details class="social-service-setup" ${base?"":"open"}><summary>Connection service</summary><div class="social-service-fields"><input id="socialApiBaseInput" type="url" inputmode="url" value="${esc(base)}" placeholder="https://your-social-service.run.app"><button class="secondary-btn" type="button" data-save-social-api>Save service URL</button></div><p class="social-service-help">This must be a secure backend that performs provider OAuth and stores encrypted access tokens. Facebook personal-profile auto-posting is not offered by Meta; its public Share Dialog remains user-confirmed. Instagram, TikTok and LinkedIn publishing require provider applications and permissions.</p></details><p id="socialConnectionsStatus" class="social-connections-status"></p>`;
  }

  async function refresh(){
    const base=apiBase(); const profile=activeProfile();
    if(!base || !profile){ connections={}; render(); return; }
    try{
      const response=await fetch(`${base}/api/social/connections?profileId=${encodeURIComponent(profile.id)}`,{credentials:"include",headers:{Accept:"application/json"}});
      if(!response.ok) throw new Error(`Connection service returned ${response.status}`);
      const data=await response.json();
      connections=data.connections && typeof data.connections==="object" ? data.connections : {};
      render();
    }catch(error){ connections={}; render(); status(`Connection service unavailable: ${error.message}`,true); }
  }

  function saveApi(){
    const value=String(document.getElementById("socialApiBaseInput")?.value||"").trim().replace(/\/$/,"");
    if(value && !/^https:\/\//i.test(value)){ status("The connection service must use HTTPS.",true); return; }
    if(value) localStorage.setItem(API_STORAGE,value); else localStorage.removeItem(API_STORAGE);
    connections={}; render(); refresh();
  }

  function openSetup(){
    const details=document.querySelector(".social-service-setup"); if(details) details.open=true;
    document.getElementById("socialApiBaseInput")?.focus();
    status("Deploy the Salita Quest social service, then paste its HTTPS Cloud Run URL here.");
  }

  function connect(provider){
    const base=apiBase(); const profile=activeProfile();
    if(!base || !profile){ openSetup(); return; }
    const width=620,height=760,left=Math.max(0,(screen.width-width)/2),top=Math.max(0,(screen.height-height)/2);
    const url=`${base}/oauth/${encodeURIComponent(provider)}/start?profileId=${encodeURIComponent(profile.id)}&returnOrigin=${encodeURIComponent(location.origin)}`;
    pendingPopup=window.open(url,"salitaSocialConnect",`popup=yes,width=${width},height=${height},left=${left},top=${top}`);
    if(!pendingPopup) status("Allow pop-ups to connect this account.",true); else status(`Complete the ${provider} connection in the new window.`);
  }

  async function disconnect(provider){
    const base=apiBase(); const profile=activeProfile(); if(!base||!profile) return;
    try{
      const response=await fetch(`${base}/api/social/connections/${encodeURIComponent(provider)}`,{method:"DELETE",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({profileId:profile.id})});
      if(!response.ok) throw new Error(`Disconnect failed (${response.status})`);
      await refresh(); status(`${provider} disconnected.`);
    }catch(error){ status(error.message,true); }
  }

  async function post(provider,payload){
    const base=apiBase(); const profile=activeProfile();
    if(!base || !profile || !isConnected(provider)) throw new Error(`${provider} is not connected.`);
    const response=await fetch(`${base}/api/social/posts`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({profileId:profile.id,provider,...payload})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.message||`Posting failed (${response.status})`);
    return data;
  }

  function install(){
    if(window[INSTALL_FLAG]) return;
    if(!document.getElementById("settingsView")){ retry(); return; }
    window[INSTALL_FLAG]=true;
    document.addEventListener("click",event=>{
      const save=event.target.closest("[data-save-social-api]"); if(save){saveApi();return;}
      const button=event.target.closest("[data-social-connect]"); if(!button)return;
      const provider=button.dataset.socialConnect;
      if(isConnected(provider)) disconnect(provider); else connect(provider);
    });
    window.addEventListener("message",event=>{
      const origin=apiOrigin(); if(!origin || event.origin!==origin || event.data?.type!=="salita-social-oauth") return;
      try{pendingPopup?.close();}catch{} pendingPopup=null;
      if(event.data.ok){ status(`${event.data.provider||"Account"} connected.`); refresh(); }
      else status(event.data.message||"The account could not be connected.",true);
    });
    const baseSwitch=typeof switchView==="function"?switchView:null;
    if(baseSwitch){ switchView=function switchViewWithSocialConnections(view){const result=baseSwitch.apply(this,arguments);if(view==="settings")window.setTimeout(refresh,30);return result;}; }
    window.SalitaQuestSocialConnections={apiBase,isConnected,getAll:()=>({...connections}),post,openSettings(){try{switchView("settings");}catch{}window.setTimeout(openSetup,80);},refresh};
    render(); refresh();
  }

  install();
})();
