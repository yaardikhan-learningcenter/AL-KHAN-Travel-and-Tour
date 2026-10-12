/* Cloud sync layer (Supabase). Loads before app.js.
   - Shows a login screen, loads the company books from the cloud,
     and saves every change back (debounced).
   - If config.js is empty, the app simply runs in local mode. */
(function(){
"use strict";
var cfg = window.ERP_CONFIG || {};
var LS_KEY = "alKhanErpData_v1";
var ROW_ID = "main";
var sb = null, lastKnownUpdate = null, timer = null, pushing = false, pending = null;

var C = window.CloudSync = {
  enabled: false, status: "off", email: "",
  push: function(){}, logout: function(){}
};
function setStatus(s){ C.status = s; window.dispatchEvent(new Event("cloudstatus")); }

if(!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY){
  window.ERP_READY = Promise.resolve();
  return;
}

function loadScript(src){
  return new Promise(function(res, rej){
    var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
}
function showLogin(msg){
  return new Promise(function(resolve){
    var ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:999;background:linear-gradient(180deg,#3b1505,#270d03);display:flex;align-items:center;justify-content:center;padding:20px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;";
    ov.innerHTML =
      '<form id="cloudLogin" style="background:#fff;border-radius:14px;padding:28px;width:100%;max-width:360px;">'+
      '<div style="text-align:center;margin-bottom:16px;"><img src="assets/logo.jpg" style="width:70px;height:70px;border-radius:50%;border:2px solid #e8a400;object-fit:cover;"></div>'+
      '<h3 style="margin:0 0 4px;text-align:center;color:#3b1505;">AL KHAN TRAVEL &amp; TOURISM</h3>'+
      '<div style="font-size:12px;color:#7a6552;text-align:center;margin-bottom:16px;">Sign in to open your books</div>'+
      '<div id="cloudErr" style="color:#b3261e;font-size:12px;margin-bottom:8px;min-height:14px;">'+(msg||"")+'</div>'+
      '<label style="font-size:12px;font-weight:600;color:#7a6552;">Email</label>'+
      '<input id="cloudEmail" type="email" required style="width:100%;padding:9px 10px;border:1px solid #e6d9c6;border-radius:7px;margin:4px 0 12px;box-sizing:border-box;">'+
      '<label style="font-size:12px;font-weight:600;color:#7a6552;">Password</label>'+
      '<input id="cloudPass" type="password" required style="width:100%;padding:9px 10px;border:1px solid #e6d9c6;border-radius:7px;margin:4px 0 16px;box-sizing:border-box;">'+
      '<button type="submit" style="width:100%;padding:11px;border:none;border-radius:8px;background:#e8a400;color:#fff;font-weight:700;cursor:pointer;">Sign in</button>'+
      '</form>';
    document.body.appendChild(ov);
    ov.querySelector("form").onsubmit = function(e){
      e.preventDefault();
      sb.auth.signInWithPassword({
        email: document.getElementById("cloudEmail").value.trim(),
        password: document.getElementById("cloudPass").value
      }).then(function(r){
        if(r.error){ document.getElementById("cloudErr").textContent = r.error.message; return; }
        ov.remove(); resolve(r.data.session);
      });
    };
  });
}

function localState(){
  try{ var raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null; }catch(e){ return null; }
}

function doPush(data){
  if(pushing){ pending = data; return; }
  pushing = true; setStatus("saving…");
  // Guard against overwriting newer changes made from another device.
  sb.from("erp_state").select("updated_at").eq("id", ROW_ID).maybeSingle().then(function(r){
    if(r.data && lastKnownUpdate && r.data.updated_at > lastKnownUpdate){
      if(!confirm("Newer data was saved from another device or user.\nOK = overwrite it with this screen's data.\nCancel = reload the latest cloud data.")){
        location.reload(); return Promise.reject("reload");
      }
    }
    return sb.from("erp_state").upsert({id: ROW_ID, data: data, updated_at: new Date().toISOString()}).select("updated_at").single();
  }).then(function(r){
    if(r && r.error) throw r.error;
    if(r && r.data) lastKnownUpdate = r.data.updated_at;
    setStatus("saved");
  }).catch(function(e){
    if(e==="reload") return;
    console.warn("Cloud save failed", e); setStatus("SAVE FAILED — check internet");
  }).then(function(){
    pushing = false;
    if(pending){ var p = pending; pending = null; doPush(p); }
  });
}

window.ERP_READY = loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js").then(function(){
  sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  return sb.auth.getSession();
}).then(function(r){
  return r.data.session || showLogin();
}).then(function(session){
  C.enabled = true; C.email = session.user.email;
  return sb.from("erp_state").select("data,updated_at").eq("id", ROW_ID).maybeSingle();
}).then(function(r){
  if(r.error) throw r.error;
  if(r.data){
    window.__cloudState = r.data.data;           // cloud is the source of truth
    lastKnownUpdate = r.data.updated_at;
  } else {
    var local = localState();                    // first ever login: upload existing browser data
    if(local) window.__cloudState = local;
  }
  C.push = function(data){
    clearTimeout(timer);
    timer = setTimeout(function(){ doPush(data); }, 1500);
  };
  C.logout = function(){
    sb.auth.signOut().then(function(){ try{ localStorage.removeItem(LS_KEY); }catch(e){} location.reload(); });
  };
  setStatus("connected");
  window.addEventListener("beforeunload", function(){ /* pending debounce is flushed by next save */ });
}).catch(function(e){
  console.error(e);
  document.body.innerHTML = '<div style="padding:40px;font-family:sans-serif;max-width:520px;margin:auto;"><h3>Could not connect to the cloud database</h3><p>'+(e && e.message ? e.message : e)+'</p><p>Check config.js and that you ran supabase-setup.sql. <a href="">Retry</a></p></div>';
  return new Promise(function(){}); // halt app start
});
})();
