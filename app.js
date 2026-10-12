(function(){
"use strict";
// Captured before any DOM mutation happens, so this is a pristine copy of the
// file exactly as authored/last saved — used as the template when Automatic
// Saving writes an updated copy of this whole file back to disk.
var ORIGINAL_HTML_SOURCE = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;


/* ============================================================
   CONFIG
   ============================================================ */
var SERVICE_FIELDS = {
  AIRLINE: {label:"Airline Ticket", fields:[
    {key:"passenger",label:"Passenger"},
    {key:"pnr",label:"PNR"},
    {key:"ticketNo",label:"Ticket No."},
    {key:"airline",label:"Airline"},
    {key:"sector",label:"Sector"},
    {key:"trip",label:"Trip",type:"select",options:["One-way","Return"]},
    {key:"departureDate",label:"Departure Date",type:"date"},
    {key:"mobile",label:"Mobile"}
  ]},
  VISA: {label:"Visa", fields:[
    {key:"passengerName",label:"Passenger Name"},
    {key:"passportNo",label:"Passport No."},
    {key:"visaType",label:"Visa Type"},
    {key:"visaCountry",label:"Visa Country"},
    {key:"duration",label:"Duration (e.g. 30 days)"}
  ]},
  TOUR: {label:"Tour", fields:[
    {key:"passengerName",label:"Passenger Name"},
    {key:"passportNo",label:"Passport No."},
    {key:"tourName",label:"Tour / Package Name"},
    {key:"from",label:"From"},
    {key:"to",label:"To"},
    {key:"duration",label:"Total Duration"},
    {key:"checkIn",label:"Check-in",type:"date"},
    {key:"checkOut",label:"Check-out",type:"date"},
    {key:"noOfPassengers",label:"No. of Passengers",type:"number"}
  ]},
  CARGO: {label:"Cargo", fields:[
    {key:"customerName",label:"Customer Name"},
    {key:"customerQID",label:"Customer QID"},
    {key:"rate",label:"Rate (per unit)",type:"number"},
    {key:"qty",label:"Qty",type:"number"},
    {key:"cost",label:"Cost",type:"number"},
    {key:"receiverAddress",label:"Receiver Address"},
    {key:"receiverPhone",label:"Receiver Phone"},
    {key:"deliverName",label:"Deliver Name"},
    {key:"deliverDate",label:"Deliver Date",type:"date"},
    {key:"deliveryReceiptNo",label:"Delivery Receipt No."},
    {key:"finalDeliveryDate",label:"Final Delivery Date",type:"date"}
  ]},
  HOTEL: {label:"Hotel", fields:[
    {key:"passenger",label:"Passenger"},
    {key:"hotelName",label:"Hotel Name"},
    {key:"roomType",label:"Room Type"},
    {key:"checkIn",label:"Check-in",type:"date"},
    {key:"checkOut",label:"Check-out",type:"date"}
  ]},
  TRANSPORT: {label:"Transport", fields:[
    {key:"passengerName",label:"Passenger Name"},
    {key:"noOfPassengers",label:"No. of Passengers",type:"number"},
    {key:"from",label:"From"},
    {key:"to",label:"To"},
    {key:"country",label:"Country"},
    {key:"travellingDate",label:"Travelling Date",type:"date"}
  ]},
  GENERAL: {label:"General Services", fields:[
    {key:"clientName",label:"Client Name"},
    {key:"description",label:"Service Description",type:"textarea"}
  ]}
};
var SERVICE_FIELDS_LEGACY = {UMRAH:"Umrah", INSURANCE:"Travel Insurance"};
var SERVICE_ORDER = ["AIRLINE","VISA","TOUR","HOTEL","TRANSPORT","CARGO","GENERAL"];
var SERVICE_COLORS = {
  AIRLINE:"#c8480a", VISA:"#0a8a3c", TOUR:"#e8a400", HOTEL:"#2a8fa6",
  TRANSPORT:"#7b3a14", CARGO:"#a8794a", GENERAL:"#b3261e"
};

var NAV = [
  {id:"dashboard", label:"Dashboard", sub:"Overview of your business", icon:'<rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/>'},
  {id:"dataentry", label:"Data Entry", sub:"Add sales for any service in one place", icon:'<path d="M12 5v14M5 12h14"/>'},
  {id:"receipt", label:"Receipt", sub:"Record money received from customers", icon:'<path d="M20 6L9 17l-5-5"/>'},
  {id:"payment", label:"Payment", sub:"Record money paid to vendors", icon:'<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/>'},
  {id:"custledger", label:"Customer Ledger", sub:"Statement per customer", icon:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/>'},
  {id:"suppledger", label:"Supplier Ledger", sub:"Statement per vendor", icon:'<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M14 9h1M14 13h1"/>'},
  {id:"salesledger", label:"Salesperson (Agent)", sub:"Ledger per sales employee — daily, weekly, monthly, yearly", icon:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7"/><path d="M15.5 13a6.5 6.5 0 016 7"/>'},
  {id:"cashbank", label:"Cash / Bank", sub:"Automatic daily, weekly, monthly & yearly summary", icon:'<rect x="3" y="10" width="18" height="9" rx="1"/><path d="M3 10l9-6 9 6"/><path d="M7 14v3M12 14v3M17 14v3"/><path d="M2 22h20"/>'},
  {id:"invoice", label:"Invoice", sub:"Select an invoice number — everything auto-fills", icon:'<path d="M5 21V5a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2z"/><path d="M9 8h6M9 12h6M9 16h6"/>'},
  {id:"currency", label:"Currencies", sub:"Exchange rates and converter — Dirham, Riyal, Dollar & more", icon:'<circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 00-2.5-1.5c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2A2.7 2 0 019.5 15M12 6v1.5M12 16.5V18"/>'},
  {id:"pl", label:"Profit & Loss", sub:"Sales, cost and expenses breakdown", icon:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'},
  {id:"daybook", label:"Day Book Register", sub:"Chronological log of every transaction", icon:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 4v5"/>'}
];

/* ============================================================
   STATE / STORAGE
   ============================================================ */
var LOGO_DATA = "assets/logo.jpg";
var LS_KEY = "alKhanErpData_v1";
var state = null;

function uid(){ return "id" + Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function defaultState(){
  return {
    company:{
      name:"AL KHAN TRAVEL & TOURISM",
      address:"Machni Road Khatm e Naboowat Market,\nShop # 1 Shab e Qadr Bazar, Shabqadar",
      phone:"0345-9006215",
      email:"",
      license:"5831",
      logo:LOGO_DATA,
      invoiceSeed:1,
      banks:["Bank Account"],
      signature:""
    },
    transactions:[],
    receipts:[],
    payments:[],
    expenses:[],
    salespeople:[],
    transfers:[],
    baseCurrency:"PKR",
    displayCurrency:"PKR",
    currencies: JSON.parse(JSON.stringify(DEFAULT_CURRENCIES))
  };
}

function loadEmbeddedState(){
  try{
    var tag = document.getElementById("ahtEmbeddedData");
    if(!tag) return null;
    var txt = (tag.textContent||"").trim();
    if(!txt || txt==="null") return null;
    var parsed = JSON.parse(txt);
    if(parsed && parsed.transactions) return parsed;
  }catch(e){ console.warn("Could not read data embedded in this file", e); }
  return null;
}
function loadState(){
  try{
    var raw = localStorage.getItem(LS_KEY);
    if(raw){ return migrateState(JSON.parse(raw)); }
  }catch(e){ console.warn("Could not read saved data", e); }
  // Nothing in this browser yet (fresh profile/computer, or this exact file
  // opened here for the first time) — fall back to data Automatic Saving
  // previously baked into this file, if any.
  var embedded = loadEmbeddedState();
  if(embedded) return migrateState(embedded);
  return null;
}
/* Backfills fields introduced after a user's data was first saved, so older
   saved / linked files keep working without errors. */
function migrateState(s){
  if(!s) return s;
  s.company = s.company || {};
  if(s.company.signature===undefined) s.company.signature = "";
  if(s.company.license===undefined) s.company.license = "";
  if(!s.baseCurrency) s.baseCurrency = "PKR";
  if(!Array.isArray(s.currencies) || !s.currencies.length) s.currencies = JSON.parse(JSON.stringify(DEFAULT_CURRENCIES));
  if(!s.displayCurrency) s.displayCurrency = s.baseCurrency;
  if(!Array.isArray(s.salespeople)) s.salespeople = [];
  s.transactions = s.transactions || [];
  s.receipts = s.receipts || [];
  s.payments = s.payments || [];
  s.expenses = s.expenses || [];
  if(!Array.isArray(s.transfers)) s.transfers = [];
  s.transactions.forEach(function(t){
    if(t.saleBy===undefined) t.saleBy = "";
    if(t.purchaseBy===undefined) t.purchaseBy = "";
    if(!SERVICE_FIELDS[t.serviceType]){
      var old = SERVICE_FIELDS_LEGACY[t.serviceType] || t.serviceType;
      var dd = t.details||{};
      t.details = {clientName: dd.passengerName||dd.passenger||t.billTo, description: old+" — "+Object.keys(dd).map(function(k){return k+": "+dd[k];}).join(", ")};
      t.serviceType = "GENERAL";
    }
    if(!t.currency){ t.currency = s.baseCurrency; t.fxRate = 1; t.origSale = t.saleRate; t.origPurchase = t.purchaseRate; }
  });
  s.receipts.forEach(function(r){ if(r.receivedBy===undefined) r.receivedBy = ""; });
  s.payments.forEach(function(p){ if(p.paidBy===undefined) p.paidBy = ""; });
  return s;
}
function saveState(){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
  catch(e){ alert("Could not save data locally: " + e.message); }
  // Mirror every save to the cloud database (debounced, fire and forget).
  if(window.CloudSync) window.CloudSync.push(state);
}

function seedSampleData(){
  var today = new Date();
  function d(offsetDays){ var dt=new Date(today); dt.setDate(dt.getDate()-offsetDays); return dt.toISOString().slice(0,10); }
  state.salespeople = [
    {id:uid(), name:"Zahid Khan", phone:"0300-0000001", signature:""},
    {id:uid(), name:"Bilal Shah", phone:"0300-0000002", signature:""}
  ];
  var sp1 = state.salespeople[0].name, sp2 = state.salespeople[1].name;
  function fxOf(code){ for(var i=0;i<DEFAULT_CURRENCIES.length;i++){ if(DEFAULT_CURRENCIES[i].code===code) return DEFAULT_CURRENCIES[i].rate; } return 1; }
  function T(no,type,off,billTo,vendor,saleBy,purchBy,sale,purch,cur,status,details){
    var fx = fxOf(cur);
    return {id:uid(), invoiceNo:no, serviceType:type, date:d(off), billTo:billTo, vendor:vendor, subAgent:"", saleBy:saleBy, purchaseBy:purchBy,
      currency:cur, fxRate:fx, origSale:sale, origPurchase:purch, saleRate:Math.round(sale*fx*100)/100, purchaseRate:Math.round(purch*fx*100)/100,
      paymentStatus:status, details:details};
  }
  state.transactions = [
    T(1,"AIRLINE",9,"Gul Rahman","Sample Air Supplier",sp1,sp2,185000,172000,"PKR","Partial",{passenger:"GUL RAHMAN",pnr:"X7K2LM",ticketNo:"2579912345678",airline:"SV",sector:"PEW-JED-PEW",trip:"Return",departureDate:d(-20),mobile:"0300-1111111"}),
    T(2,"VISA",7,"Sample Customer",  "Sample Visa Agent",sp2,"",1200,950,"AED","Unpaid",{passengerName:"SAMPLE PASSENGER",passportNo:"AB1234567",visaType:"Visit Visa",visaCountry:"UAE",duration:"30 days"}),
    T(3,"TOUR",5,"Sample Family","Sample Tour Operator",sp1,"",4500,3600,"AED","Partial",{passengerName:"SAMPLE FAMILY",passportNo:"CD7654321",tourName:"Dubai 5-Day Package",from:"Peshawar",to:"Dubai",duration:"5 days",checkIn:d(-15),checkOut:d(-10),noOfPassengers:4}),
    T(4,"TRANSPORT",3,"Sample Group","Sample Transporter",sp2,"",2000,1700,"SAR","Unpaid",{passengerName:"SAMPLE GROUP",noOfPassengers:3,from:"Jeddah",to:"Madinah",country:"Saudi Arabia",travellingDate:d(-4)}),
    T(5,"HOTEL",2,"Sample Customer","Sample Hotel",sp1,sp2,350,300,"USD","Paid",{passenger:"SAMPLE CUSTOMER",hotelName:"Sample Hotel Dubai",roomType:"Deluxe Double",checkIn:d(-8),checkOut:d(-5)})
  ];
  state.receipts = [
    {id:uid(), date:d(9), invoiceNo:1, customer:"Gul Rahman", currency:"PKR", fxRate:1, origAmount:100000, amount:100000, account:"Cash", receiptNo:101, receivedBy:sp1},
    {id:uid(), date:d(5), invoiceNo:3, customer:"Sample Family", currency:"AED", fxRate:76, origAmount:2000, amount:152000, account:"Cash", receiptNo:102, receivedBy:sp1},
    {id:uid(), date:d(2), invoiceNo:5, customer:"Sample Customer", currency:"USD", fxRate:279, origAmount:350, amount:97650, account:"Bank Account", receiptNo:103, receivedBy:sp1}
  ];
  state.payments = [
    {id:uid(), date:d(6), vendor:"Sample Visa Agent", invoiceRef:2, currency:"AED", fxRate:76, origAmount:500, amount:38000, account:"Cash", refNo:201, paidBy:sp2}
  ];
  state.expenses = [
    {id:uid(), date:d(10), name:"Shop rent", category:"Rent", currency:"PKR", origAmount:35000, amount:35000},
    {id:uid(), date:d(4), name:"Electricity", category:"Utilities", currency:"PKR", origAmount:6500, amount:6500}
  ];
}

/* ============================================================
   HELPERS
   ============================================================ */
var DEFAULT_CURRENCIES = [
  {code:"PKR", name:"Pakistani Rupee", symbol:"Rs", rate:1},
  {code:"AED", name:"UAE Dirham", symbol:"AED", rate:76},
  {code:"SAR", name:"Saudi Riyal", symbol:"SAR", rate:74.5},
  {code:"USD", name:"US Dollar", symbol:"$", rate:279},
  {code:"GBP", name:"British Pound", symbol:"£", rate:370},
  {code:"EUR", name:"Euro", symbol:"€", rate:325},
  {code:"QAR", name:"Qatari Riyal", symbol:"QAR", rate:76.5}
];
function fmtNum(n){
  n = Number(n)||0;
  return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
}
function baseCode(){ return (state && state.baseCurrency) || "PKR"; }
function rateOf(code){
  if(!state || !state.currencies) return 1;
  for(var i=0;i<state.currencies.length;i++){ if(state.currencies[i].code===code) return Number(state.currencies[i].rate)||1; }
  return 1;
}
function round2(n){ return Math.round((Number(n)||0)*100)/100; }
function toBase(amount, code){ return round2((Number(amount)||0) * rateOf(code)); }
function fromBase(amount, code){ return (Number(amount)||0) / rateOf(code); }
/* money(): every figure in the app is stored in the base currency and shown here in the chosen display currency. */
function money(n){ return fmtNum(fromBase(n, state && state.displayCurrency)); }
function convert(amount, from, to){ return (Number(amount)||0) * rateOf(from) / rateOf(to); }
function curOptions(selected){
  return (state.currencies||[]).map(function(c){ return '<option value="'+esc(c.code)+'"'+(c.code===selected?' selected':'')+'>'+esc(c.code)+' — '+esc(c.name)+'</option>'; }).join("");
}
function fillCurSelects(){
  document.querySelectorAll("select.cur-select").forEach(function(sel){
    var keep = sel.value || (sel.dataset.useBase ? baseCode() : state.displayCurrency);
    sel.innerHTML = curOptions(keep);
  });
}
function coAddr(co){
  return esc(co.address)+(co.phone?"\nTel: "+esc(co.phone):"")+(co.license?"\nLicense # "+esc(co.license):"")+(co.email?"\n"+esc(co.email):"");
}
function todayStr(){ return new Date().toISOString().slice(0,10); }
function monthKey(dateStr){ return (dateStr||"").slice(0,7); }
function monthLabel(key){
  if(!key) return "";
  var parts = key.split("-"); var d = new Date(Number(parts[0]), Number(parts[1])-1, 1);
  return d.toLocaleString(undefined,{month:"long", year:"numeric"});
}
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

/* ---- reusable chart renderers (no external libraries — SVG / CSS only) ---- */
function renderDonut(containerId, data, size, fmt){
  size = size || 150;
  fmt = fmt || money;
  var el = document.getElementById(containerId);
  var total = data.reduce(function(s,d){ return s+d.value; },0);
  if(total<=0){ el.innerHTML = '<div style="color:var(--ink-soft);font-size:12px;padding:20px 0;">No data for this period.</div>'; return; }
  var radius = size/2 - 15;
  var circumference = 2*Math.PI*radius;
  var offset = 0;
  var segments = data.filter(function(d){return d.value>0;}).map(function(d){
    var frac = d.value/total;
    var dash = frac*circumference;
    var seg = '<circle cx="'+(size/2)+'" cy="'+(size/2)+'" r="'+radius+'" fill="none" stroke="'+d.color+'" stroke-width="21" ' +
      'stroke-dasharray="'+dash.toFixed(2)+' '+(circumference-dash).toFixed(2)+'" stroke-dashoffset="'+(-offset).toFixed(2)+'" ' +
      'transform="rotate(-90 '+(size/2)+' '+(size/2)+')"></circle>';
    offset += dash;
    return seg;
  }).join("");
  var svg = '<svg viewBox="0 0 '+size+' '+size+'" width="'+size+'" height="'+size+'">'+segments+
    '<circle cx="'+(size/2)+'" cy="'+(size/2)+'" r="'+(radius-14)+'" fill="#fff"></circle></svg>';
  var legend = data.filter(function(d){return d.value>0;}).sort(function(a,b){return b.value-a.value;}).map(function(d){
    return '<div style="display:flex;align-items:center;gap:7px;font-size:11.5px;margin-top:6px;">'+
      '<span style="width:9px;height:9px;border-radius:2px;background:'+d.color+';display:inline-block;flex-shrink:0;"></span>'+
      '<span style="flex:1;">'+esc(d.label)+'</span>'+
      '<span class="mono" style="color:var(--ink-soft);">'+fmt(d.value)+'</span></div>';
  }).join("");
  el.innerHTML = '<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;"><div style="flex-shrink:0;">'+svg+'</div><div style="flex:1;min-width:150px;">'+legend+'</div></div>';
}

function renderCompareBars(containerId, items){
  var el = document.getElementById(containerId);
  if(!items.length){ el.innerHTML = '<div style="color:var(--ink-soft);font-size:12px;padding:20px 0;">No data available.</div>'; return; }
  var max = Math.max.apply(null, items.map(function(i){return i.value;}).concat([1]));
  el.innerHTML = '<div class="compare-bars">' + items.map(function(i){
    var pct = Math.max(Math.round((i.value/max)*100),1);
    return '<div class="compare-row"><div class="cr-top"><span>'+esc(i.label)+'</span><span class="mono" style="font-weight:700;">'+money(i.value)+'</span></div>'+
      '<div class="cr-track"><div class="cr-fill" style="width:'+pct+'%;background:'+i.color+';"></div></div></div>';
  }).join("") + '</div>';
}

function renderGroupedBars(containerId, groups, colorA, colorB){
  // groups: [{label, a, b}]
  var el = document.getElementById(containerId);
  var max = Math.max.apply(null, groups.reduce(function(acc,g){ acc.push(g.a,g.b); return acc; },[]).concat([1]));
  el.innerHTML = groups.map(function(g){
    var ha = Math.max(Math.round((g.a/max)*100),g.a>0?2:0);
    var hb = Math.max(Math.round((g.b/max)*100),g.b>0?2:0);
    return '<div class="grouped-col"><div class="bars">'+
      '<div class="b" style="height:'+ha+'%;background:'+colorA+';" title="'+money(g.a)+'"></div>'+
      '<div class="b" style="height:'+hb+'%;background:'+colorB+';" title="'+money(g.b)+'"></div>'+
      '</div><div class="glbl">'+esc(g.label)+'</div></div>';
  }).join("") || '<div style="color:var(--ink-soft);font-size:12px;">No data.</div>';
}

function renderLineChart(containerId, labels, values, color, fmt){
  fmt = fmt || money;
  var el = document.getElementById(containerId);
  if(!values.length){ el.innerHTML = '<div style="color:var(--ink-soft);font-size:12px;padding:20px 0;">No data for this range.</div>'; return; }
  var w = 600, h = 130, pad = 10;
  var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  if(min===max){ min -= 1; max += 1; }
  var stepX = values.length>1 ? (w-2*pad)/(values.length-1) : 0;
  var pts = values.map(function(v,idx){
    var x = pad + idx*stepX;
    var y = h - pad - ((v-min)/(max-min))*(h-2*pad);
    return x.toFixed(1)+","+y.toFixed(1);
  });
  var linePts = pts.join(" ");
  var areaPts = pad+","+(h-pad)+" "+linePts+" "+(pad+(values.length-1)*stepX)+","+(h-pad);
  var dots = values.map(function(v,idx){
    var x = pad + idx*stepX;
    var y = h - pad - ((v-min)/(max-min))*(h-2*pad);
    return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.6" fill="'+color+'"><title>'+esc(labels[idx])+": "+fmt(v)+'</title></circle>';
  }).join("");
  var svg = '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none">'+
    '<polygon points="'+areaPts+'" fill="'+color+'" opacity="0.12"></polygon>'+
    '<polyline points="'+linePts+'" fill="none" stroke="'+color+'" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"></polyline>'+
    dots+'</svg>';
  var firstLbl = labels[0], lastLbl = labels[labels.length-1];
  el.innerHTML = svg + '<div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--ink-soft);margin-top:4px;"><span>'+esc(firstLbl)+'</span><span>'+esc(lastLbl)+'</span></div>';
}

function nextInvoiceNo(){
  var max = 0;
  state.transactions.forEach(function(t){ if(t.invoiceNo > max) max = t.invoiceNo; });
  return max > 0 ? max + 1 : (Number(state.company.invoiceSeed) || 1);
}
function nextReceiptNo(){
  var max = 100;
  state.receipts.forEach(function(r){ if(r.receiptNo > max) max = r.receiptNo; });
  return max + 1;
}
function nextPaymentRef(){
  var max = 200;
  state.payments.forEach(function(p){ if(p.refNo > max) max = p.refNo; });
  return max + 1;
}

function receivedForInvoice(invNo){
  var sum = 0;
  state.receipts.forEach(function(r){ if(r.invoiceNo == invNo) sum += Number(r.amount)||0; });
  return sum;
}
function paidForInvoice(invNo){
  var sum = 0;
  state.payments.forEach(function(p){ if(p.invoiceRef == invNo) sum += Number(p.amount)||0; });
  return sum;
}
function accountOptions(){
  var opts = ["Cash"].concat(state.company.banks||[]);
  return opts;
}
function getTx(invNo){
  return state.transactions.find(function(t){ return t.invoiceNo == invNo; });
}

/* ============================================================
   SALESPEOPLE (shared helpers — used by Data Entry, Receipt,
   Payment, Invoice and the Salesperson Ledger page)
   ============================================================ */
function getSalesperson(name){
  if(!name) return null;
  return state.salespeople.find(function(s){ return s.name===name; }) || null;
}
function getSalespersonById(id){
  return state.salespeople.find(function(s){ return s.id===id; }) || null;
}
function salespersonOptionsHtml(selected){
  var opts = state.salespeople.slice().sort(function(a,b){ return a.name.localeCompare(b.name); });
  return '<option value="">— none —</option>' + opts.map(function(s){
    return '<option value="'+esc(s.name)+'"'+(s.name===selected?" selected":"")+'>'+esc(s.name)+'</option>';
  }).join("");
}
/* Populate every salesperson <select> across the app in one go, so the
   list stays in sync wherever a salesperson can be picked from. */
function populateSalespersonSelects(){
  ["de_saleBy","de_purchaseBy","rc_receivedBy","py_paidBy"].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    var prev = el.value;
    el.innerHTML = salespersonOptionsHtml(prev);
    if(state.salespeople.some(function(s){ return s.name===prev; })) el.value = prev;
  });
}

/* ============================================================
   NAV / ROUTING
   ============================================================ */
var currentPage = "dashboard";
function renderNav(){
  var nav = document.getElementById("navList");
  nav.innerHTML = "";
  NAV.forEach(function(item){
    var div = document.createElement("div");
    div.className = "nav-item" + (item.id===currentPage ? " active":"");
    div.dataset.page = item.id;
    div.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+item.icon+'</svg><span>'+item.label+'</span>';
    div.addEventListener("click", function(){ goTo(item.id); if(window.innerWidth<=880){document.getElementById("sidebar").classList.remove("open");} });
    nav.appendChild(div);
  });
}
function goTo(pageId){
  currentPage = pageId;
  document.querySelectorAll(".page").forEach(function(p){ p.classList.remove("active"); });
  document.getElementById("page-"+pageId).classList.add("active");
  var item = NAV.find(function(n){ return n.id===pageId; });
  document.getElementById("pageTitle").textContent = item.label;
  document.getElementById("pageSub").textContent = item.sub;
  renderNav();
  renderPage(pageId);
}
function renderPage(pageId){
  fillCurSelects();
  updateDispCurrency();
  if(pageId==="dashboard") renderDashboard();
  else if(pageId==="dataentry") renderDataEntry();
  else if(pageId==="invoice") renderInvoicePage();
  else if(pageId==="receipt") renderReceiptPage();
  else if(pageId==="payment") renderPaymentPage();
  else if(pageId==="custledger") renderCustomerLedger();
  else if(pageId==="suppledger") renderSupplierLedger();
  else if(pageId==="salesledger") renderSalespersonLedger();
  else if(pageId==="cashbank") renderCashBank();
  else if(pageId==="currency") renderCurrencyPage();
  else if(pageId==="pl") renderPL();
  else if(pageId==="daybook") renderDayBook();
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function allMonths(){
  var set = {};
  state.transactions.forEach(function(t){ set[monthKey(t.date)] = true; });
  state.expenses.forEach(function(e){ set[monthKey(e.date)] = true; });
  set[monthKey(todayStr())] = true;
  return Object.keys(set).sort().reverse();
}
function renderDashboard(){
  var sel = document.getElementById("dashMonth");
  var months = allMonths();
  var prev = sel.value;
  sel.innerHTML = months.map(function(m){ return '<option value="'+m+'">'+monthLabel(m)+'</option>'; }).join("");
  sel.value = months.indexOf(prev)>-1 ? prev : months[0];
  var mk = sel.value;

  var txM = state.transactions.filter(function(t){ return monthKey(t.date)===mk; });
  var totalSale = txM.reduce(function(s,t){ return s+Number(t.saleRate||0); },0);
  var totalPurchase = txM.reduce(function(s,t){ return s+Number(t.purchaseRate||0); },0);
  var expM = state.expenses.filter(function(e){ return monthKey(e.date)===mk; });
  var totalExpense = expM.reduce(function(s,e){ return s+Number(e.amount||0); },0);

  var totalReceivable = 0, totalPayable = 0;
  state.transactions.forEach(function(t){
    var rec = receivedForInvoice(t.invoiceNo);
    var bal = Number(t.saleRate||0) - rec;
    if(bal>0.004) totalReceivable += bal;
    var pur = Number(t.purchaseRate||0);
    var paid = paidForInvoice(t.invoiceNo);
    var pbal = pur - paid;
    if(pbal>0.004) totalPayable += pbal;
  });

  var kpis = [
    {lbl:"Total Sale", val:money(totalSale), cls:"gold"},
    {lbl:"Total Purchase", val:money(totalPurchase), cls:"navy"},
    {lbl:"Total Expense", val:money(totalExpense), cls:"red"},
    {lbl:"Total Receivable", val:money(totalReceivable), cls:"teal"},
    {lbl:"Total Payable", val:money(totalPayable), cls:"red"},
    {lbl:"Net Profit (month)", val:money(totalSale-totalPurchase-totalExpense), cls:"gold"}
  ];
  document.getElementById("dashKpis").innerHTML = kpis.map(function(k){
    return '<div class="kpi '+k.cls+'"><div class="bar"></div><div class="lbl">'+k.lbl+'</div><div class="val">'+k.val+'</div></div>';
  }).join("");

  // chart: sales by service type (selected month)
  var byService = {};
  SERVICE_ORDER.forEach(function(s){ byService[s]=0; });
  txM.forEach(function(t){ byService[t.serviceType] = (byService[t.serviceType]||0) + Number(t.saleRate||0); });
  var maxV = Math.max.apply(null, Object.values(byService).concat([1]));
  document.getElementById("dashChartService").innerHTML = SERVICE_ORDER.map(function(s){
    var v = byService[s]||0;
    var h = Math.round((v/maxV)*100);
    return '<div class="bar-col"><div class="bar-val">'+(v?money(v):"")+'</div><div class="bar-el" style="height:'+Math.max(h,2)+'%;"></div><div class="bar-lbl">'+SERVICE_FIELDS[s].label+'</div></div>';
  }).join("");

  // chart: monthly trend last 6 months
  var last6 = [];
  var base = mk.split("-");
  var bd = new Date(Number(base[0]), Number(base[1])-1, 1);
  for(var i=5;i>=0;i--){
    var dd = new Date(bd.getFullYear(), bd.getMonth()-i, 1);
    var k = dd.getFullYear()+"-"+String(dd.getMonth()+1).padStart(2,"0");
    last6.push(k);
  }
  var trendVals = last6.map(function(k){
    return state.transactions.filter(function(t){ return monthKey(t.date)===k; }).reduce(function(s,t){ return s+Number(t.saleRate||0); },0);
  });
  var maxT = Math.max.apply(null, trendVals.concat([1]));
  document.getElementById("dashChartTrend").innerHTML = last6.map(function(k,idx){
    var v = trendVals[idx];
    var h = Math.round((v/maxT)*100);
    var lbl = new Date(Number(k.split("-")[0]),Number(k.split("-")[1])-1,1).toLocaleString(undefined,{month:"short"});
    return '<div class="bar-col"><div class="bar-val">'+(v?money(v):"")+'</div><div class="bar-el" style="height:'+Math.max(h,2)+'%;"></div><div class="bar-lbl">'+lbl+'</div></div>';
  }).join("");

  // bank balances
  var accounts = accountOptions();
  var rows = accounts.map(function(acc){
    var received = state.receipts.filter(function(r){return r.account===acc;}).reduce(function(s,r){return s+Number(r.amount||0);},0);
    var paid = state.payments.filter(function(p){return p.account===acc;}).reduce(function(s,p){return s+Number(p.amount||0);},0);
    return '<tr><td>'+esc(acc)+'</td><td class="mono">'+money(received)+'</td><td class="mono">'+money(paid)+'</td><td class="mono">'+money(received-paid)+'</td></tr>';
  }).join("");
  document.getElementById("dashBankTable").innerHTML = rows || '<tr class="empty-row"><td colspan="4">No account activity yet</td></tr>';

  renderDonut("dashDonutService", SERVICE_ORDER.map(function(s){
    return {label:SERVICE_FIELDS[s].label, value:byService[s]||0, color:SERVICE_COLORS[s]};
  }));
  renderCompareBars("dashCompare", [
    {label:"Total receivable", value:totalReceivable, color:"var(--teal)"},
    {label:"Total payable", value:totalPayable, color:"var(--red)"}
  ]);

  // top customers by sales (selected month)
  var custTotals = {};
  txM.forEach(function(t){ if(t.billTo) custTotals[t.billTo] = (custTotals[t.billTo]||0) + Number(t.saleRate||0); });
  var topCust = Object.keys(custTotals).map(function(c){ return {label:c, value:custTotals[c]}; })
    .sort(function(a,b){ return b.value-a.value; }).slice(0,5);
  var custPalette = ["var(--purple)","var(--orange)","var(--teal)","var(--gold)","var(--magenta)"];
  renderCompareBars("dashTopCustomers", topCust.map(function(c,idx){ return {label:c.label, value:c.value, color:custPalette[idx%custPalette.length]}; }));

  // payment status breakdown (selected month, by invoice count)
  var statusCounts = {Paid:0, Partial:0, Unpaid:0};
  txM.forEach(function(t){ statusCounts[t.paymentStatus] = (statusCounts[t.paymentStatus]||0)+1; });
  renderDonut("dashPaymentStatus", [
    {label:"Paid", value:statusCounts.Paid, color:"#0a8a3c"},
    {label:"Partial", value:statusCounts.Partial, color:"#e8a400"},
    {label:"Unpaid", value:statusCounts.Unpaid, color:"#b3261e"}
  ], 140, function(v){ return v + (v===1?" invoice":" invoices"); });

  sel.onchange = renderDashboard;
}

/* ============================================================
   DATA ENTRY
   ============================================================ */
var editingTxId = null;
function initDataEntryForm(){
  var stSel = document.getElementById("de_serviceType");
  stSel.innerHTML = SERVICE_ORDER.map(function(s){ return '<option value="'+s+'">'+SERVICE_FIELDS[s].label+'</option>'; }).join("");
  stSel.addEventListener("change", renderDynamicFields);
  document.getElementById("de_date").value = todayStr();
  document.getElementById("de_invoiceNo").value = nextInvoiceNo();
  renderDynamicFields();
  populateSalespersonSelects();

  document.getElementById("de_cancelEdit").addEventListener("click", function(){
    editingTxId = null;
    resetDataEntryForm();
  });

  document.getElementById("deForm").addEventListener("submit", function(ev){
    ev.preventDefault();
    saveDataEntry();
  });
  document.getElementById("deSearch").addEventListener("input", renderDataEntryTable);
  document.getElementById("deFilterType").addEventListener("change", renderDataEntryTable);

  var filterSel = document.getElementById("deFilterType");
  filterSel.innerHTML = '<option value="">All service types</option>' + SERVICE_ORDER.map(function(s){ return '<option value="'+s+'">'+SERVICE_FIELDS[s].label+'</option>'; }).join("");
}
function renderDynamicFields(){
  var type = document.getElementById("de_serviceType").value;
  var conf = SERVICE_FIELDS[type];
  var wrap = document.getElementById("de_dynamicFields");
  wrap.innerHTML = "";
  conf.fields.forEach(function(f){
    var d = document.createElement("div");
    d.className = "field";
    var inputHtml;
    if(f.type==="select"){
      inputHtml = '<select id="df_'+f.key+'">' + f.options.map(function(o){return '<option value="'+o+'">'+o+'</option>';}).join("") + '</select>';
    } else if(f.type==="textarea"){
      inputHtml = '<textarea id="df_'+f.key+'"></textarea>';
    } else {
      inputHtml = '<input type="'+(f.type||"text")+'" id="df_'+f.key+'">';
    }
    d.innerHTML = '<label>'+f.label+'</label>'+inputHtml;
    wrap.appendChild(d);
  });

  // labels + cargo auto-calc behaviour
  var saleLbl = document.getElementById("de_saleLbl");
  var purchLbl = document.getElementById("de_purchLbl");
  var saleInput = document.getElementById("de_saleRate");
  var purchInput = document.getElementById("de_purchaseRate");
  if(type==="CARGO"){
    saleLbl.textContent = "Sale rate (Total bill — auto)";
    purchLbl.textContent = "Purchase rate (Cost)";
    saleInput.readOnly = true;
    var rateEl = document.getElementById("df_rate"), qtyEl = document.getElementById("df_qty"), costEl = document.getElementById("df_cost");
    function recalc(){
      var r = Number(rateEl.value)||0, q = Number(qtyEl.value)||0;
      saleInput.value = (r*q).toFixed(2); updateConvHint();
      purchInput.value = costEl.value || 0;
    }
    [rateEl,qtyEl,costEl].forEach(function(el){ el.addEventListener("input", recalc); });
  } else {
    saleLbl.textContent = "Sale rate";
    purchLbl.textContent = "Purchase rate";
    saleInput.readOnly = false;
  }
}
function updateConvHint(){
  var el = document.getElementById("de_convHint"); if(!el) return;
  var cur = document.getElementById("de_currency").value || baseCode();
  var s = Number(document.getElementById("de_saleRate").value)||0, p = Number(document.getElementById("de_purchaseRate").value)||0;
  if(cur===baseCode()){ el.innerHTML = "Entering in the base currency (<b>"+baseCode()+"</b>)."; return; }
  el.innerHTML = "1 "+esc(cur)+" = <b>"+fmtNum(rateOf(cur))+" "+baseCode()+"</b> &nbsp;·&nbsp; Sale ≈ <b>"+fmtNum(toBase(s,cur))+" "+baseCode()+"</b> &nbsp;·&nbsp; Purchase ≈ <b>"+fmtNum(toBase(p,cur))+" "+baseCode()+"</b> &nbsp;·&nbsp; Profit ≈ <b>"+fmtNum(toBase(s-p,cur))+" "+baseCode()+"</b>";
}
function resetDataEntryForm(){
  document.getElementById("deForm").reset();
  document.getElementById("de_currency").value = state.displayCurrency || baseCode();
  document.getElementById("de_date").value = todayStr();
  document.getElementById("de_invoiceNo").value = nextInvoiceNo();
  document.getElementById("deFormTitle").textContent = "New entry";
  document.getElementById("de_submitBtn").textContent = "Save entry";
  document.getElementById("de_cancelEdit").style.display = "none";
  renderDynamicFields();
  updateConvHint();
}
function saveDataEntry(){
  var type = document.getElementById("de_serviceType").value;
  var conf = SERVICE_FIELDS[type];
  var details = {};
  conf.fields.forEach(function(f){
    var el = document.getElementById("df_"+f.key);
    details[f.key] = el.value;
  });
  var cur = document.getElementById("de_currency").value || baseCode();
  var billTo = document.getElementById("de_billTo").value.trim();
  if(type==="CARGO" && !billTo){ billTo = details.customerName; document.getElementById("de_billTo").value = billTo; }
  if(type==="GENERAL" && !billTo){ billTo = details.clientName; document.getElementById("de_billTo").value = billTo; }

  var record = {
    id: editingTxId || uid(),
    invoiceNo: editingTxId ? getTxById(editingTxId).invoiceNo : nextInvoiceNo(),
    serviceType: type,
    date: document.getElementById("de_date").value,
    billTo: billTo,
    vendor: document.getElementById("de_vendor").value.trim(),
    subAgent: document.getElementById("de_subAgent").value.trim(),
    saleBy: document.getElementById("de_saleBy").value,
    purchaseBy: document.getElementById("de_purchaseBy").value,
    currency: cur,
    fxRate: rateOf(cur),
    origSale: Number(document.getElementById("de_saleRate").value)||0,
    origPurchase: Number(document.getElementById("de_purchaseRate").value)||0,
    saleRate: toBase(Number(document.getElementById("de_saleRate").value)||0, cur),
    purchaseRate: toBase(Number(document.getElementById("de_purchaseRate").value)||0, cur),
    paymentStatus: document.getElementById("de_status").value,
    details: details
  };

  if(editingTxId){
    var idx = state.transactions.findIndex(function(t){ return t.id===editingTxId; });
    state.transactions[idx] = record;
    editingTxId = null;
  } else {
    state.transactions.push(record);
  }
  saveState();
  resetDataEntryForm();
  renderDataEntryTable();
  document.getElementById("de_invoiceNo").value = nextInvoiceNo();
}
function getTxById(id){ return state.transactions.find(function(t){ return t.id===id; }); }

function editTransaction(id){
  var t = getTxById(id);
  if(!t) return;
  editingTxId = id;
  document.getElementById("de_serviceType").value = t.serviceType;
  renderDynamicFields();
  document.getElementById("de_date").value = t.date;
  document.getElementById("de_invoiceNo").value = t.invoiceNo;
  document.getElementById("de_billTo").value = t.billTo;
  document.getElementById("de_vendor").value = t.vendor;
  document.getElementById("de_subAgent").value = t.subAgent;
  populateSalespersonSelects();
  document.getElementById("de_saleBy").value = t.saleBy||"";
  document.getElementById("de_purchaseBy").value = t.purchaseBy||"";
  document.getElementById("de_currency").value = t.currency || baseCode();
  document.getElementById("de_saleRate").value = t.origSale!=null ? t.origSale : t.saleRate;
  document.getElementById("de_purchaseRate").value = t.origPurchase!=null ? t.origPurchase : t.purchaseRate;
  updateConvHint();
  document.getElementById("de_status").value = t.paymentStatus;
  Object.keys(t.details||{}).forEach(function(k){
    var el = document.getElementById("df_"+k);
    if(el) el.value = t.details[k];
  });
  document.getElementById("deFormTitle").textContent = "Editing invoice #" + t.invoiceNo;
  document.getElementById("de_submitBtn").textContent = "Update entry";
  document.getElementById("de_cancelEdit").style.display = "inline-flex";
  window.scrollTo({top:0, behavior:"smooth"});
}
function deleteTransaction(id){
  if(!confirm("Delete this entry? This cannot be undone.")) return;
  state.transactions = state.transactions.filter(function(t){ return t.id!==id; });
  saveState();
  renderDataEntryTable();
}
function renderDataEntryTable(){
  var q = (document.getElementById("deSearch").value||"").toLowerCase();
  var typeFilter = document.getElementById("deFilterType").value;
  var rows = state.transactions.filter(function(t){
    if(typeFilter && t.serviceType!==typeFilter) return false;
    if(!q) return true;
    var hay = (t.invoiceNo+" "+t.billTo+" "+t.vendor+" "+JSON.stringify(t.details)).toLowerCase();
    return hay.indexOf(q) > -1;
  }).sort(function(a,b){ return b.invoiceNo-a.invoiceNo; });

  document.getElementById("deCount").textContent = "(" + rows.length + ")";
  document.getElementById("deTable").innerHTML = rows.length ? rows.map(function(t){
    var profit = Number(t.saleRate||0) - Number(t.purchaseRate||0);
    var tagCls = t.paymentStatus==="Paid"?"paid":(t.paymentStatus==="Partial"?"partial":"unpaid");
    return '<tr>'+
      '<td class="mono">'+t.invoiceNo+'</td>'+
      '<td>'+t.date+'</td>'+
      '<td>'+SERVICE_FIELDS[t.serviceType].label+'</td>'+
      '<td>'+esc(t.billTo)+'</td>'+
      '<td>'+esc(t.saleBy||"—")+'</td>'+
      '<td class="mono" style="white-space:nowrap;">'+esc(t.currency||baseCode())+' '+fmtNum(t.origSale!=null?t.origSale:t.saleRate)+'</td>'+
      '<td class="mono">'+money(t.saleRate)+'</td>'+
      '<td class="mono">'+money(t.purchaseRate)+'</td>'+
      '<td class="mono">'+money(profit)+'</td>'+
      '<td><span class="tag '+tagCls+'">'+t.paymentStatus+'</span></td>'+
      '<td><button class="btn sm ghost" onclick="AHT.editTx(\''+t.id+'\')">Edit</button> <button class="btn sm danger" onclick="AHT.delTx(\''+t.id+'\')">Delete</button></td>'+
    '</tr>';
  }).join("") : '<tr class="empty-row"><td colspan="11">No entries yet — add your first one above.</td></tr>';
}
function renderDataEntry(){
  renderDataEntryTable();
}

/* ============================================================
   INVOICE
   ============================================================ */
function renderInvoicePage(){
  var sel = document.getElementById("invSelect");
  var sorted = state.transactions.slice().sort(function(a,b){ return b.invoiceNo-a.invoiceNo; });
  sel.innerHTML = '<option value="">— choose invoice —</option>' + sorted.map(function(t){
    return '<option value="'+t.invoiceNo+'">#'+t.invoiceNo+' — '+esc(t.billTo)+' ('+SERVICE_FIELDS[t.serviceType].label+')</option>';
  }).join("");
  sel.onchange = function(){ showInvoice(sel.value); };
  document.getElementById("invCurrency").onchange = function(){ showInvoice(sel.value, true); };

  document.getElementById("invSearch").oninput = function(){
    var q = this.value.toLowerCase();
    var box = document.getElementById("invSearchResults");
    if(!q){ box.innerHTML=""; return; }
    var matches = sorted.filter(function(t){
      var hay = (t.billTo+" "+JSON.stringify(t.details)).toLowerCase();
      return hay.indexOf(q)>-1;
    }).slice(0,8);
    box.innerHTML = matches.map(function(t){
      return '<div class="nav-item" style="color:var(--ink);border:1px solid var(--line);margin-bottom:4px;" onclick="AHT.pickInvoice('+t.invoiceNo+')">#'+t.invoiceNo+' — '+esc(t.billTo)+'</div>';
    }).join("") || '<div style="font-size:12px;color:var(--ink-soft);padding:6px;">No matches</div>';
  };

  document.getElementById("invPrintBtn").onclick = function(){ window.print(); };
}
window.AHT = window.AHT || {};
AHT.pickInvoice = function(invNo){
  document.getElementById("invSelect").value = invNo;
  showInvoice(invNo);
};
AHT.editTx = editTransaction;
AHT.delTx = deleteTransaction;

function showInvoice(invNo, keepCur){
  var t = getTx(invNo);
  var invCurEl = document.getElementById("invCurrency");
  if(t && !keepCur) invCurEl.value = t.currency || baseCode();
  var cur = (invCurEl.value || (t && t.currency) || baseCode());
  var fx = (t && cur===t.currency && t.fxRate) ? t.fxRate : rateOf(cur);
  function A(b){ return fmtNum((Number(b)||0)/fx); }
  var area = document.getElementById("invoicePrintArea");
  var placeholder = document.getElementById("invoicePlaceholder");
  if(!t){ area.style.display="none"; placeholder.style.display="block"; return; }
  placeholder.style.display="none";
  area.style.display="block";

  var received = receivedForInvoice(t.invoiceNo);
  var balance = Number(t.saleRate||0) - received;
  var rateNote = cur!==baseCode() ? '<div style="font-size:10.5px;color:var(--ink-soft);margin-top:6px;text-align:right;">1 '+esc(cur)+' = '+fmtNum(fx)+' '+baseCode()+'</div>' : '';
  var conf = SERVICE_FIELDS[t.serviceType];
  var passengerLike = t.details.passenger || t.details.passengerName || t.details.clientName || t.billTo;

  var descRows = conf.fields.map(function(f){
    var v = t.details[f.key];
    if(!v) return "";
    return '<tr><td style="font-weight:600;width:38%;">'+f.label+'</td><td>'+esc(v)+'</td></tr>';
  }).join("");

  var co = state.company;
  var logoHtml = co.logo ? '<img class="co-logo" src="'+co.logo+'">' : '';
  var sp = getSalesperson(t.saleBy);
  var sigImg = (sp && sp.signature) ? sp.signature : (co.signature || "");
  var sigHtml =
    '<div class="inv-signature">'+
      (sigImg ? '<img class="sig-img" src="'+sigImg+'">' : '') +
      '<div class="sig-line">Authorized signature</div>'+
      '<div class="sig-name">'+esc(t.saleBy||co.name)+'</div>'+
    '</div>';

  // Airline tickets use a dedicated ticket-strip table layout
  // (PNR / Ticket No / Pax Name / Sector / Travel Date / Mobile / Amount),
  // matching the classic airline-ticket invoice format.
  var bodyHtml;
  if(t.serviceType === "AIRLINE"){
    var d = t.details;
    bodyHtml =
      '<div class="inv-ticket-consultant">'+
        '<div><span class="k">Consultant:</span>'+esc(t.vendor || t.subAgent || "—")+'</div>'+
        '<div><span class="k">Airline:</span>'+esc(d.airline||"—")+'</div>'+
        '<div><span class="k">Trip:</span>'+esc(d.trip||"—")+'</div>'+
        '<div><span class="k">Sales by:</span>'+esc(t.saleBy||"—")+'</div>'+
      '</div>'+
      '<table class="inv-ticket-table">'+
        '<colgroup>'+
          '<col style="width:11%"><col style="width:15%"><col style="width:22%"><col style="width:17%"><col style="width:12%"><col style="width:10%"><col style="width:13%">'+
        '</colgroup>'+
        '<thead><tr>'+
          '<th>PNR</th><th>Ticket No.</th><th>Pax Name</th><th>Sector</th><th>Travel Date</th><th>Mobile</th><th class="num">Amount ('+cur+')</th>'+
        '</tr></thead>'+
        '<tbody><tr>'+
          '<td>'+esc(d.pnr||"—")+'</td>'+
          '<td class="mono">'+esc(d.ticketNo||"—")+'</td>'+
          '<td>'+esc(d.passenger||passengerLike||"—")+'</td>'+
          '<td>'+esc(d.sector||"—")+'</td>'+
          '<td>'+esc(d.departureDate||"—")+'</td>'+
          '<td>'+esc(d.mobile||"—")+'</td>'+
          '<td class="mono num">'+A(t.saleRate)+'</td>'+
        '</tr></tbody>'+
        '<tfoot><tr><td colspan="6" style="text-align:right;">TOTAL ('+cur+')</td><td class="mono num">'+A(t.saleRate)+'</td></tr></tfoot>'+
      '</table>';
  } else {
    bodyHtml =
      '<div class="inv-meta">'+
        '<div class="blk"><div class="k">Bill to</div><div class="v">'+esc(t.billTo)+'</div></div>'+
        '<div class="blk"><div class="k">Date</div><div class="v">'+esc(t.date)+'</div></div>'+
        '<div class="blk"><div class="k">Passenger / client</div><div class="v">'+esc(passengerLike||"—")+'</div></div>'+
        '<div class="blk"><div class="k">Status</div><div class="v">'+esc(t.paymentStatus)+'</div></div>'+
        '<div class="blk salesby"><div class="k">Sales by</div><div class="v">'+esc(t.saleBy||"—")+'</div></div>'+
      '</div>'+
      '<table class="inv-table"><thead><tr><th colspan="2">Service details</th></tr></thead><tbody>'+
        descRows +
        (t.vendor? '<tr><td style="font-weight:600;">Vendor</td><td>'+esc(t.vendor)+'</td></tr>':'') +
        (t.subAgent? '<tr><td style="font-weight:600;">Sub agent</td><td>'+esc(t.subAgent)+'</td></tr>':'') +
      '</tbody></table>';
  }

  area.innerHTML =
    '<div class="ticket-strip"></div>'+
    '<div class="inv-head">'+
      '<div>'+
        '<div class="co-name">'+esc(co.name)+'</div>'+
        logoHtml +
        '<div class="co-addr">'+coAddr(co)+'</div>'+
      '</div>'+
      '<div class="inv-badge">'+
        '<div class="tt">'+conf.label+' Invoice</div>'+
        '<div class="num">#'+t.invoiceNo+'</div>'+
        '<div style="font-size:11px;color:var(--ink-soft);margin-top:4px;">'+esc(t.date)+'</div>'+
      '</div>'+
    '</div>'+
    bodyHtml +
    '<div class="inv-totals">'+
      '<div class="row"><span>Sale amount ('+cur+')</span><span class="mono">'+A(t.saleRate)+'</span></div>'+
      '<div class="row"><span>Received ('+cur+')</span><span class="mono">'+A(received)+'</span></div>'+
      '<div class="row grand"><span>Balance due ('+cur+')</span><span class="mono">'+A(balance)+'</span></div>'+
      rateNote+
    '</div>'+
    '<div class="inv-foot-row">'+
      '<div class="inv-terms">'+
        '<div class="terms-title">Special Note</div>'+
        '<div class="terms-sub">Terms &amp; Conditions -</div>'+
        '<ul>'+
          '<li>Tickets and bookings are subject to airline / supplier rules and regulations.</li>'+
          '<li>Visa approval is at the sole discretion of the embassy / consulate.</li>'+
          '<li>Cancellation/refund charges may apply. * Service fee is non-refundable.</li>'+
        '</ul>'+
      '</div>'+
      '<div>'+
        sigHtml +
        '<div style="font-size:11px;color:var(--ink-soft);text-align:right;margin-top:10px;">'+
          '<div>Thank you for choosing '+esc(co.name)+'.</div>'+
          '<div style="margin-top:4px;">Generated offline · '+todayStr()+'</div>'+
        '</div>'+
      '</div>'+
    '</div>';
}

/* ============================================================
   RECEIPT
   ============================================================ */
function renderReceiptPage(){
  var invSel = document.getElementById("rc_invoiceNo");
  var sorted = state.transactions.slice().sort(function(a,b){ return b.invoiceNo-a.invoiceNo; });
  invSel.innerHTML = '<option value="">— select —</option>' + sorted.map(function(t){
    return '<option value="'+t.invoiceNo+'">#'+t.invoiceNo+' — '+esc(t.billTo)+'</option>';
  }).join("");
  function updateRcBalance(){
    var t = getTx(invSel.value); if(!t) return;
    var c = document.getElementById("rc_currency").value || baseCode();
    document.getElementById("rc_balanceDue").value = c+" "+fmtNum(fromBase(Number(t.saleRate||0) - receivedForInvoice(t.invoiceNo), c));
  }
  document.getElementById("rc_currency").onchange = updateRcBalance;
  invSel.onchange = function(){
    var t = getTx(invSel.value);
    if(t){
      if(t.currency) document.getElementById("rc_currency").value = t.currency;
      document.getElementById("rc_customer").value = t.billTo;
      updateRcBalance();
    } else {
      document.getElementById("rc_customer").value = "";
      document.getElementById("rc_balanceDue").value = "";
    }
  };
  document.getElementById("rc_account").innerHTML = accountOptions().map(function(a){ return '<option>'+esc(a)+'</option>'; }).join("");
  document.getElementById("rc_date").value = todayStr();
  document.getElementById("rc_receiptNo").value = nextReceiptNo();
  populateSalespersonSelects();

  document.getElementById("rcForm").onsubmit = function(ev){
    ev.preventDefault();
    var invNo = Number(invSel.value);
    if(!invNo){ alert("Please choose an invoice."); return; }
    state.receipts.push({
      id:uid(), date:document.getElementById("rc_date").value, invoiceNo:invNo,
      customer:document.getElementById("rc_customer").value,
      currency:document.getElementById("rc_currency").value||baseCode(),
      fxRate:rateOf(document.getElementById("rc_currency").value||baseCode()),
      origAmount:Number(document.getElementById("rc_amount").value)||0,
      amount:toBase(Number(document.getElementById("rc_amount").value)||0, document.getElementById("rc_currency").value||baseCode()),
      account:document.getElementById("rc_account").value,
      receivedBy: document.getElementById("rc_receivedBy").value,
      receiptNo: nextReceiptNo()
    });
    saveState();
    document.getElementById("rcForm").reset();
    document.getElementById("rc_date").value = todayStr();
    document.getElementById("rc_receiptNo").value = nextReceiptNo();
    document.getElementById("rc_customer").value="";
    document.getElementById("rc_balanceDue").value="";
    populateSalespersonSelects();
    renderReceiptTable();
  };
  renderReceiptTable();
}
function deleteReceipt(id){
  if(!confirm("Delete this receipt?")) return;
  state.receipts = state.receipts.filter(function(r){ return r.id!==id; });
  saveState(); renderReceiptTable();
}
AHT.delReceipt = deleteReceipt;
function renderReceiptTable(){
  var rows = state.receipts.slice().sort(function(a,b){ return b.receiptNo-a.receiptNo; });
  document.getElementById("rcTable").innerHTML = rows.length ? rows.map(function(r){
    return '<tr><td class="mono">'+r.receiptNo+'</td><td>'+r.date+'</td><td class="mono">#'+r.invoiceNo+'</td><td>'+esc(r.customer)+'</td><td class="mono">'+money(r.amount)+'</td><td>'+esc(r.account)+'</td><td>'+esc(r.receivedBy||"—")+'</td><td><button class="btn sm danger" onclick="AHT.delReceipt(\''+r.id+'\')">Delete</button></td></tr>';
  }).join("") : '<tr class="empty-row"><td colspan="8">No receipts recorded yet.</td></tr>';
}

/* ============================================================
   PAYMENT
   ============================================================ */
function renderPaymentPage(){
  var invSel = document.getElementById("py_invoiceRef");
  var sorted = state.transactions.slice().sort(function(a,b){ return b.invoiceNo-a.invoiceNo; });
  invSel.innerHTML = '<option value="">— none / general —</option>' + sorted.map(function(t){
    return '<option value="'+t.invoiceNo+'">#'+t.invoiceNo+' — '+esc(t.vendor||t.billTo)+'</option>';
  }).join("");
  invSel.onchange = function(){
    var t = getTx(invSel.value);
    if(t && t.vendor) document.getElementById("py_vendor").value = t.vendor;
  };
  var vendors = {};
  state.transactions.forEach(function(t){ if(t.vendor) vendors[t.vendor]=true; });
  document.getElementById("vendorList").innerHTML = Object.keys(vendors).map(function(v){ return '<option value="'+esc(v)+'">'; }).join("");

  document.getElementById("py_account").innerHTML = accountOptions().map(function(a){ return '<option>'+esc(a)+'</option>'; }).join("");
  document.getElementById("py_date").value = todayStr();
  document.getElementById("py_refNo").value = nextPaymentRef();
  populateSalespersonSelects();

  document.getElementById("pyForm").onsubmit = function(ev){
    ev.preventDefault();
    state.payments.push({
      id:uid(), date:document.getElementById("py_date").value,
      vendor:document.getElementById("py_vendor").value.trim(),
      invoiceRef: invSel.value ? Number(invSel.value) : null,
      currency:document.getElementById("py_currency").value||baseCode(),
      fxRate:rateOf(document.getElementById("py_currency").value||baseCode()),
      origAmount:Number(document.getElementById("py_amount").value)||0,
      amount:toBase(Number(document.getElementById("py_amount").value)||0, document.getElementById("py_currency").value||baseCode()),
      account:document.getElementById("py_account").value,
      paidBy: document.getElementById("py_paidBy").value,
      refNo: nextPaymentRef()
    });
    saveState();
    document.getElementById("pyForm").reset();
    document.getElementById("py_date").value = todayStr();
    document.getElementById("py_refNo").value = nextPaymentRef();
    populateSalespersonSelects();
    renderPaymentTable();
  };
  renderPaymentTable();
}
function deletePayment(id){
  if(!confirm("Delete this payment?")) return;
  state.payments = state.payments.filter(function(p){ return p.id!==id; });
  saveState(); renderPaymentTable();
}
AHT.delPayment = deletePayment;
function renderPaymentTable(){
  var rows = state.payments.slice().sort(function(a,b){ return b.refNo-a.refNo; });
  document.getElementById("pyTable").innerHTML = rows.length ? rows.map(function(p){
    return '<tr><td class="mono">'+p.refNo+'</td><td>'+p.date+'</td><td>'+esc(p.vendor)+'</td><td class="mono">'+(p.invoiceRef?"#"+p.invoiceRef:"—")+'</td><td class="mono">'+money(p.amount)+'</td><td>'+esc(p.account)+'</td><td>'+esc(p.paidBy||"—")+'</td><td><button class="btn sm danger" onclick="AHT.delPayment(\''+p.id+'\')">Delete</button></td></tr>';
  }).join("") : '<tr class="empty-row"><td colspan="8">No payments recorded yet.</td></tr>';
}

/* ============================================================
   CUSTOMER LEDGER
   ============================================================ */
/* ============================================================
   PERIOD PICKER (daily / weekly / monthly / yearly / date range / all time)
   Shared by Customer Ledger, Supplier Ledger and Profit & Loss.
   ============================================================ */
function mountPeriod(prefix, hostId, onChange){
  var host = document.getElementById(hostId);
  host.innerHTML =
    '<div class="period-bar">'+
      '<label style="margin:0;">View</label>'+
      '<select id="'+prefix+'Type">'+
        '<option value="all">All time</option><option value="daily">Daily</option><option value="weekly">Weekly</option>'+
        '<option value="monthly">Monthly</option><option value="yearly">Yearly</option><option value="custom">Between two dates</option>'+
      '</select>'+
      '<input type="date" id="'+prefix+'Day"><input type="week" id="'+prefix+'Week"><input type="month" id="'+prefix+'Month">'+
      '<input type="number" id="'+prefix+'Year" style="width:100px;" placeholder="Year">'+
      '<input type="date" id="'+prefix+'From" title="From"><span id="'+prefix+'ToLbl" style="font-size:12px;color:var(--ink-soft);">to</span><input type="date" id="'+prefix+'To" title="To">'+
      '<span class="plabel" id="'+prefix+'Label"></span>'+
    '</div>';
  var g = function(s){ return document.getElementById(prefix+s); };
  g("Day").value = todayStr(); g("Week").value = isoWeekStrFromDate(new Date()); g("Month").value = todayStr().slice(0,7);
  g("Year").value = new Date().getFullYear();
  var d = new Date(); d.setDate(d.getDate()-30); g("From").value = d.toISOString().slice(0,10); g("To").value = todayStr();
  function vis(){
    var t = g("Type").value;
    g("Day").style.display = t==="daily"?"inline-block":"none";
    g("Week").style.display = t==="weekly"?"inline-block":"none";
    g("Month").style.display = t==="monthly"?"inline-block":"none";
    g("Year").style.display = t==="yearly"?"inline-block":"none";
    g("From").style.display = g("To").style.display = t==="custom"?"inline-block":"none";
    g("ToLbl").style.display = t==="custom"?"inline":"none";
  }
  vis();
  g("Type").onchange = function(){ vis(); onChange(); };
  ["Day","Week","Month","Year","From","To"].forEach(function(s){ g(s).onchange = onChange; });
}
function getPeriod(prefix){
  var g = function(s){ return document.getElementById(prefix+s); };
  var t = g("Type").value, r;
  if(t==="daily"){ var v = g("Day").value || todayStr(); r = {from:v, to:v, label:"Day: "+v}; }
  else if(t==="weekly"){ var w = isoWeekToRange(g("Week").value || isoWeekStrFromDate(new Date())); r = {from:w.from, to:w.to, label:"Week: "+w.from+" – "+w.to}; }
  else if(t==="monthly"){
    var m = g("Month").value || todayStr().slice(0,7), mp = m.split("-"), last = new Date(Number(mp[0]),Number(mp[1]),0).getDate();
    r = {from:m+"-01", to:m+"-"+String(last).padStart(2,"0"), label:"Month: "+monthLabel(m)};
  }
  else if(t==="yearly"){ var y = Number(g("Year").value) || new Date().getFullYear(); r = {from:y+"-01-01", to:y+"-12-31", label:"Year: "+y}; }
  else if(t==="custom"){ var f = g("From").value, to = g("To").value; r = {from:f, to:to, label:(f||to)?((f||"…")+" – "+(to||"…")):"All dates"}; }
  else r = {from:"", to:"", label:"All time"};
  g("Label").textContent = r.label;
  return r;
}
function inRange(date, r){ return (!r.from || date>=r.from) && (!r.to || date<=r.to); }

/* Generic running-balance ledger: entries {date, ref, desc, inc, dec, sortKey}; balance = inc - dec. */
function buildLedger(entries, range){
  entries.sort(function(a,b){ return a.sortKey.localeCompare(b.sortKey); });
  var opening = 0;
  if(range.from){ entries.forEach(function(e){ if(e.date<range.from) opening += e.inc - e.dec; }); }
  var run = opening, sInc = 0, sDec = 0;
  var rows = entries.filter(function(e){ return inRange(e.date, range); }).map(function(e){
    run += e.inc - e.dec; sInc += e.inc; sDec += e.dec;
    return {date:e.date, ref:e.ref, desc:e.desc, inc:e.inc, dec:e.dec, bal:run};
  });
  return {opening:opening, hasOpening:!!range.from, rows:rows, sumInc:sInc, sumDec:sDec, closing:run};
}
function ledgerRowsHtml(L, emptyMsg){
  var out = "";
  if(L.hasOpening) out += '<tr class="opening-row"><td colspan="5">Opening balance</td><td class="mono">'+money(L.opening)+'</td></tr>';
  out += L.rows.map(function(r){
    return '<tr><td>'+r.date+'</td><td class="mono">'+esc(r.ref)+'</td><td>'+esc(r.desc)+'</td><td class="mono">'+(r.inc?money(r.inc):"")+'</td><td class="mono">'+(r.dec?money(r.dec):"")+'</td><td class="mono">'+money(r.bal)+'</td></tr>';
  }).join("");
  if(!L.rows.length) out += '<tr class="empty-row"><td colspan="6">'+emptyMsg+'</td></tr>';
  return out;
}
function txDesc(t){
  var d = t.details||{};
  var who = d.passenger||d.passengerName||d.clientName||d.customerName||"";
  return SERVICE_FIELDS[t.serviceType].label+(who?" — "+who:"");
}
var lastCL = null, lastSV = null, lastPL = null;

function renderCustomerLedger(){
  var custs = {};
  state.transactions.forEach(function(t){ if(t.billTo) custs[t.billTo]=true; });
  var sel = document.getElementById("clCustomer");
  var prev = sel.value;
  sel.innerHTML = Object.keys(custs).sort().map(function(c){ return '<option>'+esc(c)+'</option>'; }).join("");
  if(Object.keys(custs).indexOf(prev)>-1) sel.value = prev;
  sel.onchange = drawCustomerLedger;
  drawCustomerLedger();
}
function drawCustomerLedger(){
  var cust = document.getElementById("clCustomer").value;
  var range = getPeriod("clp");
  var entries = [];
  state.transactions.forEach(function(t){
    if(t.billTo!==cust) return;
    entries.push({date:t.date, ref:"#"+t.invoiceNo, desc:txDesc(t), inc:Number(t.saleRate||0), dec:0, sortKey:t.date+"-1-"+String(t.invoiceNo).padStart(6,"0")});
  });
  state.receipts.forEach(function(r){
    var t = getTx(r.invoiceNo);
    if(!(t ? t.billTo===cust : r.customer===cust)) return;
    entries.push({date:r.date, ref:"RC"+r.receiptNo, desc:"Receipt against #"+r.invoiceNo+" ("+(r.account||"")+")", inc:0, dec:Number(r.amount||0), sortKey:r.date+"-2-"+String(r.receiptNo).padStart(6,"0")});
  });
  var L = buildLedger(entries, range);
  lastCL = {party:cust, range:range, L:L};
  document.getElementById("clTable").innerHTML = ledgerRowsHtml(L, "No transactions for this customer in this period.");
  document.getElementById("clSummary").innerHTML = [
    {lbl:"Opening balance", val:money(L.opening), cls:"navy"},
    {lbl:"Sales in period", val:money(L.sumInc), cls:"gold"},
    {lbl:"Received in period", val:money(L.sumDec), cls:"teal"},
    {lbl:"Balance receivable", val:money(L.closing), cls:"red"}
  ].map(kpiHtml).join("");
}

/* ============================================================
   SUPPLIER LEDGER
   ============================================================ */
function renderSupplierLedger(){
  var vends = {};
  state.transactions.forEach(function(t){ if(t.vendor) vends[t.vendor]=true; });
  var sel = document.getElementById("slVendor");
  var prev = sel.value;
  sel.innerHTML = Object.keys(vends).sort().map(function(v){ return '<option>'+esc(v)+'</option>'; }).join("");
  if(Object.keys(vends).indexOf(prev)>-1) sel.value = prev;
  sel.onchange = drawSupplierLedger;
  drawSupplierLedger();
}
function drawSupplierLedger(){
  var vend = document.getElementById("slVendor").value;
  var range = getPeriod("svp");
  var entries = [];
  state.transactions.forEach(function(t){
    if(t.vendor!==vend) return;
    entries.push({date:t.date, ref:"#"+t.invoiceNo, desc:txDesc(t), inc:Number(t.purchaseRate||0), dec:0, sortKey:t.date+"-1-"+String(t.invoiceNo).padStart(6,"0")});
  });
  state.payments.forEach(function(p){
    var t = p.invoiceRef ? getTx(p.invoiceRef) : null;
    if(!(p.vendor===vend || (t && t.vendor===vend))) return;
    entries.push({date:p.date, ref:"PY"+p.refNo, desc:"Payment"+(p.invoiceRef?" against #"+p.invoiceRef:"")+" ("+(p.account||"")+")", inc:0, dec:Number(p.amount||0), sortKey:p.date+"-2-"+String(p.refNo).padStart(6,"0")});
  });
  var L = buildLedger(entries, range);
  lastSV = {party:vend, range:range, L:L};
  document.getElementById("slTable").innerHTML = ledgerRowsHtml(L, "No transactions for this vendor in this period.");
  document.getElementById("slSummary").innerHTML = [
    {lbl:"Opening balance", val:money(L.opening), cls:"navy"},
    {lbl:"Purchases in period", val:money(L.sumInc), cls:"gold"},
    {lbl:"Paid in period", val:money(L.sumDec), cls:"teal"},
    {lbl:"Balance payable", val:money(L.closing), cls:"red"}
  ].map(kpiHtml).join("");
}

/* ============================================================
   PROFIT & LOSS
   ============================================================ */
function renderPL(){
  var plR = getPeriod("plp");
  var txF = state.transactions.filter(function(t){ return inRange(t.date, plR); });
  var byService = {};
  SERVICE_ORDER.forEach(function(s){ byService[s]={sale:0,cost:0}; });
  txF.forEach(function(t){ byService[t.serviceType].sale += Number(t.saleRate||0); byService[t.serviceType].cost += Number(t.purchaseRate||0); });
  var totalSale=0,totalCost=0;
  document.getElementById("plTable").innerHTML = SERVICE_ORDER.map(function(s){
    var b = byService[s]; totalSale+=b.sale; totalCost+=b.cost;
    return '<tr><td>'+SERVICE_FIELDS[s].label+'</td><td class="mono">'+money(b.sale)+'</td><td class="mono">'+money(b.cost)+'</td><td class="mono">'+money(b.sale-b.cost)+'</td></tr>';
  }).join("") + '<tr style="font-weight:700;background:#fbf6ee;"><td>Total</td><td class="mono">'+money(totalSale)+'</td><td class="mono">'+money(totalCost)+'</td><td class="mono">'+money(totalSale-totalCost)+'</td></tr>';

  renderGroupedBars("plGroupedChart", SERVICE_ORDER.map(function(s){
    return {label:SERVICE_FIELDS[s].label, a:byService[s].sale, b:byService[s].cost};
  }), "var(--purple)", "var(--orange)");

  var expF = state.expenses.filter(function(e){ return inRange(e.date, plR); }).sort(function(a,b){ return b.date.localeCompare(a.date); });
  var totalExp = expF.reduce(function(s,e){ return s+Number(e.amount||0); },0);
  document.getElementById("plExpTotal").textContent = "(" + money(totalExp) + ")";
  var expByCat = {};
  expF.forEach(function(e){ var c = e.category||"Uncategorized"; expByCat[c]=(expByCat[c]||0)+Number(e.amount||0); });
  var expDonutPalette = ["#a83000","#f0a800","#e07a1f","#0a8a3c","#f7d04a","#2a8fa6","#b3261e","#e8a400"];
  var expDonutData = Object.keys(expByCat).map(function(c,idx){ return {label:c, value:expByCat[c], color:expDonutPalette[idx%expDonutPalette.length]}; });
  renderDonut("plExpDonut", expDonutData, 140);
  document.getElementById("expTable").innerHTML = expF.length ? expF.map(function(e){
    return '<tr><td>'+e.date+'</td><td>'+esc(e.name)+'</td><td>'+esc(e.category||"—")+'</td><td class="mono">'+money(e.amount)+'</td><td><button class="btn sm danger" onclick="AHT.delExpense(\''+e.id+'\')">Delete</button></td></tr>';
  }).join("") : '<tr class="empty-row"><td colspan="5">No expenses logged.</td></tr>';

  var net = totalSale-totalCost-totalExp;
  lastPL = {range:plR, byService:byService, totalSale:totalSale, totalCost:totalCost, expF:expF, totalExp:totalExp, net:net};
  document.getElementById("plNet").innerHTML = [
    {lbl:"Gross profit", val:money(totalSale-totalCost), cls:"gold"},
    {lbl:"Total expenses", val:money(totalExp), cls:"red"},
    {lbl:"Net profit", val:money(net), cls: net>=0?"teal":"red"}
  ].map(function(k){ return '<div class="kpi '+k.cls+'"><div class="bar"></div><div class="lbl">'+k.lbl+'</div><div class="val">'+k.val+'</div></div>'; }).join("");

  // last-6-month trend anchor: selected month if set, else current month
  var tmKey = plR.to ? plR.to.slice(0,7) : "", cmKey = monthKey(todayStr());
  var anchorKey = (tmKey && tmKey<cmKey) ? tmKey : cmKey;
  var aparts = anchorKey.split("-");
  var adate = new Date(Number(aparts[0]), Number(aparts[1])-1, 1);
  var last6PL = [];
  for(var i=5;i>=0;i--){
    var dd = new Date(adate.getFullYear(), adate.getMonth()-i, 1);
    last6PL.push(dd.getFullYear()+"-"+String(dd.getMonth()+1).padStart(2,"0"));
  }
  var trendLabels = last6PL.map(function(k){
    return new Date(Number(k.split("-")[0]),Number(k.split("-")[1])-1,1).toLocaleString(undefined,{month:"short"});
  });

  // expense trend (last 6 months)
  var expTrendVals = last6PL.map(function(k){
    return state.expenses.filter(function(e){ return monthKey(e.date)===k; }).reduce(function(s,e){ return s+Number(e.amount||0); },0);
  });
  renderLineChart("plExpenseTrend", trendLabels, expTrendVals, "#b3261e");

  // profit margin trend (last 6 months, %)
  var marginVals = last6PL.map(function(k){
    var txK = state.transactions.filter(function(t){ return monthKey(t.date)===k; });
    var s = txK.reduce(function(a,t){ return a+Number(t.saleRate||0); },0);
    var c = txK.reduce(function(a,t){ return a+Number(t.purchaseRate||0); },0);
    return s>0 ? ((s-c)/s*100) : 0;
  });
  renderLineChart("plMarginTrend", trendLabels, marginVals, "#0a8a3c", function(v){ return v.toFixed(1)+"%"; });
}
function deleteExpense(id){
  if(!confirm("Delete this expense?")) return;
  state.expenses = state.expenses.filter(function(e){ return e.id!==id; });
  saveState(); renderPL();
}
AHT.delExpense = deleteExpense;

function initExpenseForm(){
  document.getElementById("exp_date").value = todayStr();
  document.getElementById("expForm").addEventListener("submit", function(ev){
    ev.preventDefault();
    state.expenses.push({
      id:uid(), date:document.getElementById("exp_date").value,
      name:document.getElementById("exp_name").value.trim(),
      category:document.getElementById("exp_category").value.trim(),
      currency:document.getElementById("exp_currency").value||baseCode(),
      origAmount:Number(document.getElementById("exp_amount").value)||0,
      amount:toBase(Number(document.getElementById("exp_amount").value)||0, document.getElementById("exp_currency").value||baseCode())
    });
    saveState();
    document.getElementById("expForm").reset();
    document.getElementById("exp_date").value = todayStr();
    renderPL();
  });
}

/* ============================================================
   DAY BOOK
   ============================================================ */
function renderDayBook(){
  var from = document.getElementById("dbFrom");
  var to = document.getElementById("dbTo");
  var typeSel = document.getElementById("dbType");
  if(!from.value){
    var d = new Date(); d.setDate(d.getDate()-30);
    from.value = d.toISOString().slice(0,10);
    to.value = todayStr();
  }
  from.onchange = drawDayBook; to.onchange = drawDayBook; typeSel.onchange = drawDayBook;
  drawDayBook();
}
var lastDB = null;
function drawDayBook(){
  var from = document.getElementById("dbFrom").value;
  var to = document.getElementById("dbTo").value;
  var typeFilter = document.getElementById("dbType").value;
  var entries = [];
  state.transactions.forEach(function(t){
    entries.push({date:t.date, ref:"#"+t.invoiceNo, type:"Sale", party:t.billTo, desc:SERVICE_FIELDS[t.serviceType].label+" sale", debit:Number(t.saleRate||0), credit:0, sortKey:t.date+"-1-"+t.invoiceNo});
  });
  state.receipts.forEach(function(r){
    entries.push({date:r.date, ref:"RC"+r.receiptNo, type:"Receipt", party:r.customer, desc:"Receipt against #"+r.invoiceNo, debit:0, credit:Number(r.amount||0), sortKey:r.date+"-2-"+r.receiptNo});
  });
  state.payments.forEach(function(p){
    entries.push({date:p.date, ref:"PY"+p.refNo, type:"Payment", party:p.vendor, desc:"Payment"+(p.invoiceRef?" against #"+p.invoiceRef:""), debit:Number(p.amount||0), credit:0, sortKey:p.date+"-3-"+p.refNo});
  });
  entries = entries.filter(function(e){
    if(from && e.date<from) return false;
    if(to && e.date>to) return false;
    if(typeFilter && e.type!==typeFilter) return false;
    return true;
  }).sort(function(a,b){ return a.sortKey.localeCompare(b.sortKey); });
  lastDB = {entries:entries, from:from, to:to, type:typeFilter};

  var running = 0;
  var runningLabels = [], runningValues = [];
  var rows = entries.map(function(e){
    running += e.debit - e.credit;
    runningLabels.push(e.date); runningValues.push(running);
    return '<tr><td>'+e.date+'</td><td class="mono">'+e.ref+'</td><td>'+e.type+'</td><td>'+esc(e.party||"—")+'</td><td>'+esc(e.desc)+'</td><td class="mono">'+(e.debit?money(e.debit):"")+'</td><td class="mono">'+(e.credit?money(e.credit):"")+'</td><td class="mono">'+money(running)+'</td></tr>';
  }).join("");
  document.getElementById("dbTable").innerHTML = rows || '<tr class="empty-row"><td colspan="8">No transactions in this range.</td></tr>';
  document.getElementById("dbBalance").textContent = "Net: " + money(running);

  // daily debit/credit grouped bars (aggregate by date, cap to most recent 20 days with activity)
  var byDate = {};
  entries.forEach(function(e){
    if(!byDate[e.date]) byDate[e.date] = {debit:0, credit:0};
    byDate[e.date].debit += e.debit; byDate[e.date].credit += e.credit;
  });
  var dateKeys = Object.keys(byDate).sort();
  var last20 = dateKeys.slice(-20);
  renderGroupedBars("dbGroupedChart", last20.map(function(k){
    return {label:k.slice(5), a:byDate[k].debit, b:byDate[k].credit};
  }), "var(--purple)", "var(--orange)");

  renderLineChart("dbLineChart", runningLabels, runningValues, "#a83000");

  // transaction mix by amount (Sale / Receipt / Payment)
  var typeTotals = {Sale:0, Receipt:0, Payment:0};
  entries.forEach(function(e){ typeTotals[e.type] = (typeTotals[e.type]||0) + e.debit + e.credit; });
  renderDonut("dbTypeBreakdown", [
    {label:"Sale", value:typeTotals.Sale, color:"#a83000"},
    {label:"Receipt", value:typeTotals.Receipt, color:"#0a8a3c"},
    {label:"Payment", value:typeTotals.Payment, color:"#b3261e"}
  ], 140);

  // top parties by activity
  var partyTotals = {};
  entries.forEach(function(e){ if(e.party){ partyTotals[e.party] = (partyTotals[e.party]||0) + e.debit + e.credit; } });
  var topParties = Object.keys(partyTotals).map(function(p){ return {label:p, value:partyTotals[p]}; })
    .sort(function(a,b){ return b.value-a.value; }).slice(0,5);
  var partyPalette = ["#a83000","#f0a800","#0a8a3c","#e8a400","#e07a1f"];
  renderCompareBars("dbTopParties", topParties.map(function(p,idx){ return {label:p.label, value:p.value, color:partyPalette[idx%partyPalette.length]}; }));
}

/* ============================================================
   SHARED DATE-RANGE HELPERS
   (used by the Salesperson Ledger and Cash/Bank pages)
   ============================================================ */
function kpiHtml(k){ return '<div class="kpi '+k.cls+'"><div class="bar"></div><div class="lbl">'+k.lbl+'</div><div class="val">'+k.val+'</div></div>'; }
function isoWeekStrFromDate(date){
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  var dayNum = (d.getUTCDay()+6)%7;
  d.setUTCDate(d.getUTCDate()-dayNum+3);
  var firstThursday = new Date(Date.UTC(d.getUTCFullYear(),0,4));
  var week = 1 + Math.round(((d-firstThursday)/86400000 - 3 + ((firstThursday.getUTCDay()+6)%7))/7);
  return d.getUTCFullYear()+"-W"+String(week).padStart(2,"0");
}
function isoWeekToRange(weekStr){
  var parts = weekStr.split("-W");
  var year = Number(parts[0]), week = Number(parts[1]);
  var jan4 = new Date(year,0,4);
  var jan4Day = (jan4.getDay()+6)%7;
  var week1Monday = new Date(jan4); week1Monday.setDate(jan4.getDate()-jan4Day);
  var monday = new Date(week1Monday); monday.setDate(week1Monday.getDate() + (week-1)*7);
  var sunday = new Date(monday); sunday.setDate(monday.getDate()+6);
  function iso(d){ return d.toISOString().slice(0,10); }
  return {from: iso(monday), to: iso(sunday)};
}
function rangeToday(){ var t=todayStr(); return {from:t,to:t}; }
function rangeThisWeek(){ return isoWeekToRange(isoWeekStrFromDate(new Date())); }
function rangeThisMonth(){
  var m = todayStr().slice(0,7); var parts=m.split("-");
  var last = new Date(Number(parts[0]),Number(parts[1]),0).getDate();
  return {from:m+"-01", to:m+"-"+String(last).padStart(2,"0")};
}
function rangeThisYear(){ var y=new Date().getFullYear(); return {from:y+"-01-01", to:y+"-12-31"}; }

/* ============================================================
   SALESPEOPLE — management (add / delete / signature)
   ============================================================ */
function renderSalespeopleList(){
  var list = document.getElementById("spList");
  if(!state.salespeople.length){
    list.innerHTML = '<div class="muted" style="font-size:12.5px;padding:6px 2px;">No salespeople added yet — add one above to unlock the Sale by / Purchase by / Received by / Paid by fields, and the ledger below.</div>';
    return;
  }
  list.innerHTML = state.salespeople.slice().sort(function(a,b){ return a.name.localeCompare(b.name); }).map(function(s){
    var initials = s.name.trim().split(/\s+/).slice(0,2).map(function(w){ return w[0]||""; }).join("").toUpperCase();
    var avatar = s.signature ? '<img src="'+s.signature+'">' : initials;
    return '<div class="sp-row">'+
      '<div class="sp-avatar">'+avatar+'</div>'+
      '<div class="sp-name"><span class="n">'+esc(s.name)+'</span><span class="s">'+(s.phone?esc(s.phone)+" · ":"")+(s.signature?"Signature on file":"No signature")+'</span></div>'+
      '<button type="button" class="btn sm ghost" onclick="AHT.uploadSpSig(\''+s.id+'\')">'+(s.signature?"Change signature":"Add signature")+'</button>'+
      '<button type="button" class="btn sm danger" onclick="AHT.delSalesperson(\''+s.id+'\')">Delete</button>'+
    '</div>';
  }).join("");
}
function addSalesperson(){
  var name = document.getElementById("sp_name").value.trim();
  if(!name){ alert("Please enter a name."); return; }
  if(state.salespeople.some(function(s){ return s.name.toLowerCase()===name.toLowerCase(); })){ alert("A salesperson with this name already exists."); return; }
  state.salespeople.push({id:uid(), name:name, phone:document.getElementById("sp_phone").value.trim(), signature:""});
  saveState();
  document.getElementById("spForm").reset();
  populateSalespersonSelects();
  renderSalespersonLedger();
}
function deleteSalesperson(id){
  var sp = getSalespersonById(id);
  if(!sp) return;
  if(!confirm('Delete "'+sp.name+'"? Past entries that reference this name will keep showing it, but it will no longer appear in the pick-lists.')) return;
  state.salespeople = state.salespeople.filter(function(s){ return s.id!==id; });
  saveState();
  populateSalespersonSelects();
  renderSalespersonLedger();
}
AHT.delSalesperson = deleteSalesperson;
var spSigTargetId = null;
var lastSlReport = null; // snapshot of the currently-shown ledger, used to build the printable report
function uploadSalespersonSignature(id){
  spSigTargetId = id;
  document.getElementById("spSigFile").click();
}
AHT.uploadSpSig = uploadSalespersonSignature;

/* ============================================================
   INTERNAL TRANSFERS  (Business ↔ Salesperson cash movements)
   e.g. daily commission/salary paid to an employee, or cash an
   employee hands back to the business after collecting it.
   ============================================================ */
function addTransfer(){
  var sp = document.getElementById("xf_salesperson").value;
  var xfCur = document.getElementById("xf_currency").value || baseCode();
  var amount = toBase(Number(document.getElementById("xf_amount").value)||0, xfCur);
  if(!sp){ alert("Please add a salesperson first, then choose them here."); return; }
  if(amount<=0){ alert("Please enter an amount greater than zero."); return; }
  state.transfers.push({
    id:uid(),
    date: document.getElementById("xf_date").value || todayStr(),
    salesperson: sp,
    direction: document.getElementById("xf_direction").value,
    amount: amount,
    account: document.getElementById("xf_account").value,
    note: document.getElementById("xf_note").value.trim()
  });
  saveState();
  document.getElementById("xf_amount").value = "";
  document.getElementById("xf_note").value = "";
  drawSalespersonLedger();
}
function deleteTransfer(id){
  if(!confirm("Delete this transfer?")) return;
  state.transfers = state.transfers.filter(function(x){ return x.id!==id; });
  saveState();
  drawSalespersonLedger();
}
AHT.delTransfer = deleteTransfer;

/* ============================================================
   SALESPERSON (AGENT) LEDGER
   Debit = Sale (value they generated) and Payment (cash they paid out)
   Credit = Purchase (cost they processed) and Receipt (cash they collected)
   ============================================================ */
function computeSalesLedgerRange(){
  var t = document.getElementById("slRangeType").value;
  if(t==="daily"){
    var v = document.getElementById("slDay").value || todayStr();
    return {from:v, to:v, label:"Day: "+v};
  }
  if(t==="weekly"){
    var v = document.getElementById("slWeek").value || isoWeekStrFromDate(new Date());
    var r = isoWeekToRange(v);
    return {from:r.from, to:r.to, label:"Week: "+r.from+" – "+r.to};
  }
  if(t==="monthly"){
    var v = document.getElementById("slMonth").value || todayStr().slice(0,7);
    var parts = v.split("-"); var last = new Date(Number(parts[0]),Number(parts[1]),0).getDate();
    return {from:v+"-01", to:v+"-"+String(last).padStart(2,"0"), label:"Month: "+monthLabel(v)};
  }
  if(t==="yearly"){
    var v = Number(document.getElementById("slYear").value) || new Date().getFullYear();
    return {from:v+"-01-01", to:v+"-12-31", label:"Year: "+v};
  }
  var from = document.getElementById("slFrom").value, to = document.getElementById("slTo").value;
  return {from:from, to:to, label: (from&&to) ? (from+" – "+to) : "All dates"};
}
function renderSalespersonLedger(){
  renderSalespeopleList();

  document.getElementById("slPrintBtn").onclick = printSalespersonReport;
  document.getElementById("spForm").onsubmit = function(ev){ ev.preventDefault(); addSalesperson(); };
  document.getElementById("spSigFile").onchange = function(){
    var file = this.files[0];
    if(!file || !spSigTargetId) return;
    var reader = new FileReader();
    reader.onload = function(e){
      var sp = getSalespersonById(spSigTargetId);
      if(sp){ sp.signature = e.target.result; saveState(); renderSalespeopleList(); }
      spSigTargetId = null;
    };
    reader.readAsDataURL(file);
    this.value = "";
  };

  var agentSel = document.getElementById("slAgent");
  var prevAgent = agentSel.value;
  agentSel.innerHTML = state.salespeople.length
    ? state.salespeople.slice().sort(function(a,b){ return a.name.localeCompare(b.name); }).map(function(s){ return '<option value="'+esc(s.name)+'">'+esc(s.name)+'</option>'; }).join("")
    : '<option value="">— add a salesperson above —</option>';
  if(state.salespeople.some(function(s){ return s.name===prevAgent; })) agentSel.value = prevAgent;
  agentSel.onchange = function(){ syncTransferAgent(); drawSalespersonLedger(); };

  // Internal transfer form
  document.getElementById("xf_date").value = document.getElementById("xf_date").value || todayStr();
  document.getElementById("xf_account").innerHTML = accountOptions().map(function(a){ return '<option>'+esc(a)+'</option>'; }).join("");
  var xfSpSel = document.getElementById("xf_salesperson");
  var prevXfSp = xfSpSel.value;
  xfSpSel.innerHTML = state.salespeople.length
    ? state.salespeople.slice().sort(function(a,b){ return a.name.localeCompare(b.name); }).map(function(s){ return '<option value="'+esc(s.name)+'">'+esc(s.name)+'</option>'; }).join("")
    : '<option value="">— add a salesperson above —</option>';
  function syncTransferAgent(){
    if(state.salespeople.some(function(s){ return s.name===prevXfSp; })){ xfSpSel.value = prevXfSp; return; }
    if(agentSel.value) xfSpSel.value = agentSel.value;
  }
  syncTransferAgent();
  document.getElementById("xfForm").onsubmit = function(ev){ ev.preventDefault(); addTransfer(); };

  document.getElementById("slChartGran").onchange = drawSalespersonLedger;

  var typeSel = document.getElementById("slRangeType");
  var dayI=document.getElementById("slDay"), weekI=document.getElementById("slWeek"), monthI=document.getElementById("slMonth"),
      yearI=document.getElementById("slYear"), fromI=document.getElementById("slFrom"), toI=document.getElementById("slTo"), toLbl=document.getElementById("slToLbl");
  function syncVisibility(){
    var t = typeSel.value;
    dayI.style.display = t==="daily" ? "inline-block" : "none";
    weekI.style.display = t==="weekly" ? "inline-block" : "none";
    monthI.style.display = t==="monthly" ? "inline-block" : "none";
    yearI.style.display = t==="yearly" ? "inline-block" : "none";
    fromI.style.display = t==="custom" ? "inline-block" : "none";
    toI.style.display = t==="custom" ? "inline-block" : "none";
    toLbl.style.display = t==="custom" ? "inline" : "none";
  }
  if(!dayI.value) dayI.value = todayStr();
  if(!weekI.value) weekI.value = isoWeekStrFromDate(new Date());
  if(!monthI.value) monthI.value = todayStr().slice(0,7);
  if(!yearI.value) yearI.value = new Date().getFullYear();
  if(!fromI.value){ var d=new Date(); d.setDate(d.getDate()-30); fromI.value = d.toISOString().slice(0,10); }
  if(!toI.value) toI.value = todayStr();
  syncVisibility();
  typeSel.onchange = function(){ syncVisibility(); drawSalespersonLedger(); };
  [dayI,weekI,monthI,yearI,fromI,toI].forEach(function(el){ el.onchange = drawSalespersonLedger; });

  drawSalespersonLedger();
}
function drawSalespersonLedger(){
  var sp = document.getElementById("slAgent").value;
  var range = computeSalesLedgerRange();
  document.getElementById("slRangeLabel").textContent = range.label;

  var entries = [];
  if(sp){
    state.transactions.forEach(function(t){
      if(t.saleBy===sp) entries.push({date:t.date, ref:"#"+t.invoiceNo, type:"Sale", desc:"Sale — "+SERVICE_FIELDS[t.serviceType].label+" to "+(t.billTo||"—"), sale:Number(t.saleRate||0), purchase:0, debit:0, credit:0, id:null, sortKey:t.date+"-1-"+t.invoiceNo});
      if(t.purchaseBy===sp) entries.push({date:t.date, ref:"#"+t.invoiceNo, type:"Purchase", desc:"Purchase — "+SERVICE_FIELDS[t.serviceType].label+(t.vendor?" from "+t.vendor:""), sale:0, purchase:Number(t.purchaseRate||0), debit:0, credit:0, id:null, sortKey:t.date+"-2-"+t.invoiceNo});
    });
    state.receipts.forEach(function(r){
      if(r.receivedBy===sp) entries.push({date:r.date, ref:"RC"+r.receiptNo, type:"Receipt", desc:"Amount received against #"+r.invoiceNo+(r.customer?" from "+r.customer:""), sale:0, purchase:0, debit:Number(r.amount||0), credit:0, id:null, sortKey:r.date+"-3-"+r.receiptNo});
    });
    state.payments.forEach(function(p){
      if(p.paidBy===sp) entries.push({date:p.date, ref:"PY"+p.refNo, type:"Payment", desc:"Amount paid"+(p.invoiceRef?" against #"+p.invoiceRef:"")+(p.vendor?" to "+p.vendor:""), sale:0, purchase:0, debit:0, credit:Number(p.amount||0), id:null, sortKey:p.date+"-4-"+p.refNo});
    });
    state.transfers.forEach(function(x){
      if(x.salesperson!==sp) return;
      var toSp = x.direction==="toSalesperson";
      entries.push({
        date:x.date, ref:"TR", type: toSp ? "Paid to employee" : "Received from employee",
        desc: (toSp ? "Business paid " + sp : sp + " handed over cash to business") + " (" + x.account + ")" + (x.note ? " — " + x.note : ""),
        sale:0, purchase:0,
        debit: toSp ? Number(x.amount||0) : 0,
        credit: toSp ? 0 : Number(x.amount||0),
        id:x.id, sortKey:x.date+"-5-"+x.id
      });
    });
  }
  entries = entries.filter(function(e){
    if(range.from && e.date<range.from) return false;
    if(range.to && e.date>range.to) return false;
    return true;
  }).sort(function(a,b){ return a.sortKey.localeCompare(b.sortKey); });

  // Balance is purely cash-based: Debit (amounts received, including cash paid
  // TO the salesperson) minus Credit (amounts paid, including cash the
  // salesperson hands back to the business). Sale / Purchase are shown as
  // their own reference columns and don't move the balance.
  var running=0, sumSale=0, sumPurch=0, sumDebit=0, sumCredit=0;
  var rows = entries.map(function(e){
    running += e.debit - e.credit;
    sumSale += e.sale; sumPurch += e.purchase; sumDebit += e.debit; sumCredit += e.credit;
    var action = e.id ? '<button type="button" class="btn sm danger" onclick="AHT.delTransfer(\''+e.id+'\')">Delete</button>' : '';
    return '<tr><td>'+e.date+'</td><td class="mono">'+e.ref+'</td><td>'+e.type+'</td><td>'+esc(e.desc)+'</td>'+
      '<td class="mono">'+(e.sale?money(e.sale):"")+'</td>'+
      '<td class="mono">'+(e.purchase?money(e.purchase):"")+'</td>'+
      '<td class="mono">'+(e.debit?money(e.debit):"")+'</td>'+
      '<td class="mono">'+(e.credit?money(e.credit):"")+'</td>'+
      '<td class="mono">'+money(running)+'</td>'+
      '<td>'+action+'</td></tr>';
  }).join("");
  document.getElementById("slAgentTable").innerHTML = rows || '<tr class="empty-row"><td colspan="10">'+(sp?"No activity for this salesperson in this period.":"Add or select a salesperson above to view their ledger.")+'</td></tr>';

  document.getElementById("slSummary2").innerHTML = [
    {lbl:"Sales generated", val:money(sumSale), cls:"purple"},
    {lbl:"Purchases processed", val:money(sumPurch), cls:"orange"},
    {lbl:"Amount received (Debit)", val:money(sumDebit), cls:"teal"},
    {lbl:"Amount paid (Credit)", val:money(sumCredit), cls:"red"}
  ].map(kpiHtml).join("");

  lastSlReport = {sp:sp, range:range, entries:entries, sumSale:sumSale, sumPurch:sumPurch, sumDebit:sumDebit, sumCredit:sumCredit, closingBalance:running};

  drawSalespersonChart(entries);
}
function periodChartLabel(key, gran){
  if(gran==="monthly") return monthLabel(key).replace(" 20", " '").slice(0,8);
  if(gran==="weekly") return key.replace(/^\d{4}-/,"");
  return key.slice(5); // MM-DD
}
function drawSalespersonChart(entries){
  var gran = document.getElementById("slChartGran").value;
  var byPeriod = {};
  var keysInOrder = [];
  entries.forEach(function(e){
    if(!e.debit && !e.credit) return; // Sale/Purchase-only rows don't affect cash flow
    var key = periodKeyFor(e.date, gran);
    if(!byPeriod[key]){ byPeriod[key] = {debit:0, credit:0}; keysInOrder.push(key); }
    byPeriod[key].debit += e.debit; byPeriod[key].credit += e.credit;
  });
  var keys = keysInOrder.slice().sort();
  var shown = keys.slice(-14);

  var groups = shown.map(function(k){ return {label: periodChartLabel(k, gran), a: byPeriod[k].debit, b: byPeriod[k].credit}; });
  renderGroupedBars("slChartBars", groups, "var(--teal)", "var(--red)");

  var running = 0, balByKey = {};
  keys.forEach(function(k){ running += byPeriod[k].debit - byPeriod[k].credit; balByKey[k] = running; });
  renderLineChart("slChartBalance", shown.map(function(k){ return periodChartLabel(k, gran); }), shown.map(function(k){ return balByKey[k]; }), "var(--gold)");
}

/* ============================================================
   SALESPERSON LEDGER — Print / Save as PDF
   Builds a letterhead-style statement from the currently-shown
   ledger (same salesperson, date range and rows the user sees on
   screen) and hands it to the browser's print dialog, where "Save
   as PDF" is one of the destination options.
   ============================================================ */
function buildSalespersonReportHtml(){
  var r = lastSlReport;
  if(!r || !r.sp) return "";
  var co = state.company;
  var sp = getSalesperson(r.sp);
  var logoHtml = co.logo ? '<img class="co-logo" src="'+co.logo+'">' : '';

  var running = 0;
  var rowsHtml = r.entries.map(function(e){
    running += e.debit - e.credit;
    return '<tr><td>'+e.date+'</td><td class="mono">'+e.ref+'</td><td>'+e.type+'</td><td>'+esc(e.desc)+'</td>'+
      '<td class="mono">'+(e.sale?money(e.sale):"")+'</td>'+
      '<td class="mono">'+(e.purchase?money(e.purchase):"")+'</td>'+
      '<td class="mono">'+(e.debit?money(e.debit):"")+'</td>'+
      '<td class="mono">'+(e.credit?money(e.credit):"")+'</td>'+
      '<td class="mono">'+money(running)+'</td></tr>';
  }).join("");
  if(!rowsHtml){
    rowsHtml = '<tr><td colspan="9" style="text-align:center;color:var(--ink-soft);padding:22px;">No activity for this salesperson in the selected period.</td></tr>';
  }

  return (
    '<div class="inv-head">'+
      '<div>'+
        '<div class="co-name">'+esc(co.name)+'</div>'+
        logoHtml+
        '<div class="co-addr">'+coAddr(co)+'</div>'+
      '</div>'+
      '<div class="inv-badge">'+
        '<div class="tt">Salesperson Ledger Statement</div>'+
        '<div class="num" style="font-size:17px;">'+esc(r.sp)+'</div>'+
        '<div style="font-size:11px;color:var(--ink-soft);margin-top:4px;">Printed '+todayStr()+'</div>'+
      '</div>'+
    '</div>'+
    '<div class="inv-meta">'+
      '<div class="blk"><div class="k">Period</div><div class="v">'+esc(r.range.label)+'</div></div>'+
      (sp && sp.phone ? '<div class="blk"><div class="k">Phone</div><div class="v">'+esc(sp.phone)+'</div></div>' : '')+
      '<div class="blk"><div class="k">Entries</div><div class="v">'+r.entries.length+'</div></div>'+
      '<div class="blk"><div class="k">Closing balance</div><div class="v">'+money(r.closingBalance)+'</div></div>'+
    '</div>'+
    '<div class="rpt-summary">'+
      '<div class="c"><div class="lbl">Sales generated</div><div class="val">'+money(r.sumSale)+'</div></div>'+
      '<div class="c"><div class="lbl">Purchases processed</div><div class="val">'+money(r.sumPurch)+'</div></div>'+
      '<div class="c"><div class="lbl">Received (Debit)</div><div class="val">'+money(r.sumDebit)+'</div></div>'+
      '<div class="c"><div class="lbl">Paid (Credit)</div><div class="val">'+money(r.sumCredit)+'</div></div>'+
    '</div>'+
    '<table class="rpt-table">'+
      '<thead><tr><th>Date</th><th>Ref#</th><th>Type</th><th>Description</th><th>Sale</th><th>Purchase</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody>'+
      '<tfoot><tr>'+
        '<td colspan="4" style="text-align:right;">Totals</td>'+
        '<td class="mono">'+money(r.sumSale)+'</td>'+
        '<td class="mono">'+money(r.sumPurch)+'</td>'+
        '<td class="mono">'+money(r.sumDebit)+'</td>'+
        '<td class="mono">'+money(r.sumCredit)+'</td>'+
        '<td class="mono">'+money(r.closingBalance)+'</td>'+
      '</tr></tfoot>'+
    '</table>'+
    '<div style="font-size:10.5px;color:var(--ink-soft);text-align:right;">Generated by '+esc(co.name)+' · '+todayStr()+'</div>'
  );
}
function printSalespersonReport(){
  if(!lastSlReport || !lastSlReport.sp){
    alert("Please add or choose a salesperson first.");
    return;
  }
  var area = document.getElementById("slPrintArea");
  area.innerHTML = buildSalespersonReportHtml();
  area.style.display = "block";
  window.print();
}
window.addEventListener("afterprint", function(){
  var area = document.getElementById("slPrintArea");
  if(area) area.style.display = "none";
  var rp = document.getElementById("rptPrintArea");
  if(rp) rp.style.display = "none";
  document.body.classList.remove("rpt-mode");
});

/* ============================================================
   CASH / BANK  — automatic daily / weekly / monthly / yearly summary
   ============================================================ */
function cashFlowEntries(account){
  var entries = [];
  state.receipts.forEach(function(r){
    if(account && r.account!==account) return;
    entries.push({date:r.date, receipt:Number(r.amount||0), payment:0});
  });
  state.payments.forEach(function(p){
    if(account && p.account!==account) return;
    entries.push({date:p.date, receipt:0, payment:Number(p.amount||0)});
  });
  // Business → Salesperson transfers leave the business account (payment);
  // Salesperson → Business transfers arrive into it (receipt).
  state.transfers.forEach(function(x){
    if(account && x.account!==account) return;
    if(x.direction==="toSalesperson") entries.push({date:x.date, receipt:0, payment:Number(x.amount||0)});
    else entries.push({date:x.date, receipt:Number(x.amount||0), payment:0});
  });
  return entries;
}
function periodKeyFor(dateStr, gran){
  if(gran==="weekly") return isoWeekStrFromDate(new Date(dateStr+"T00:00:00"));
  if(gran==="monthly") return dateStr.slice(0,7);
  if(gran==="yearly") return dateStr.slice(0,4);
  return dateStr;
}
function periodLabelFor(key, gran){
  if(gran==="monthly") return monthLabel(key);
  if(gran==="weekly"){ var r = isoWeekToRange(key); return key+" ("+r.from+" – "+r.to+")"; }
  return key;
}
function renderCashBank(){
  var sel = document.getElementById("cbAccount");
  var prev = sel.value;
  sel.innerHTML = '<option value="">All accounts</option>' + accountOptions().map(function(a){ return '<option value="'+esc(a)+'">'+esc(a)+'</option>'; }).join("");
  sel.value = (accountOptions().indexOf(prev)>-1) ? prev : "";
  sel.onchange = drawCashBank;
  document.getElementById("cbGranularity").onchange = drawCashBank;
  drawCashBank();
}
function drawCashBank(){
  var account = document.getElementById("cbAccount").value;
  var entries = cashFlowEntries(account);

  var allTimeRecv = entries.reduce(function(s,e){ return s+e.receipt; },0);
  var allTimePaid = entries.reduce(function(s,e){ return s+e.payment; },0);
  document.getElementById("cbSummary").innerHTML = [
    {lbl:"Total receipts (all time)", val:money(allTimeRecv), cls:"teal"},
    {lbl:"Total payments (all time)", val:money(allTimePaid), cls:"red"},
    {lbl:"Balance", val:money(allTimeRecv-allTimePaid), cls:(allTimeRecv-allTimePaid)>=0?"gold":"red"}
  ].map(kpiHtml).join("");

  function sumInRange(r){
    var recv=0, paid=0;
    entries.forEach(function(e){ if(e.date>=r.from && e.date<=r.to){ recv+=e.receipt; paid+=e.payment; } });
    return {recv:recv, paid:paid};
  }
  function miniHtml(r){
    var s = sumInRange(r);
    return '<div style="font-size:12px;line-height:1.9;">'+
      '<div>Receipts: <b class="mono">'+money(s.recv)+'</b></div>'+
      '<div>Payments: <b class="mono">'+money(s.paid)+'</b></div>'+
      '<div style="border-top:1px dashed var(--line);margin-top:5px;padding-top:5px;">Balance: <b class="mono">'+money(s.recv-s.paid)+'</b></div>'+
    '</div>';
  }
  document.getElementById("cbToday").innerHTML = miniHtml(rangeToday());
  document.getElementById("cbWeek").innerHTML = miniHtml(rangeThisWeek());
  document.getElementById("cbMonth").innerHTML = miniHtml(rangeThisMonth());
  document.getElementById("cbYear").innerHTML = miniHtml(rangeThisYear());

  var gran = document.getElementById("cbGranularity").value;
  var byPeriod = {};
  entries.forEach(function(e){
    var key = periodKeyFor(e.date, gran);
    if(!byPeriod[key]) byPeriod[key] = {recv:0, paid:0};
    byPeriod[key].recv += e.receipt; byPeriod[key].paid += e.payment;
  });
  var keys = Object.keys(byPeriod).sort().reverse();
  var running = allTimeRecv - allTimePaid;
  var rows = keys.map(function(k){
    var b = byPeriod[k];
    var net = b.recv - b.paid;
    var rowBalance = running;
    running -= net;
    return '<tr><td>'+periodLabelFor(k, gran)+'</td><td class="mono">'+money(b.recv)+'</td><td class="mono">'+money(b.paid)+'</td><td class="mono">'+money(net)+'</td><td class="mono">'+money(rowBalance)+'</td></tr>';
  }).join("");
  document.getElementById("cbTable").innerHTML = rows || '<tr class="empty-row"><td colspan="5">No receipts or payments recorded yet.</td></tr>';
}

/* ============================================================
   AUTOMATIC SAVING  (File System Access API)
   Writes this app's data straight back into THIS SAME .html file,
   so the file is a single, portable, self-contained copy of the
   books — no separate data file to manage. Falls back to manual
   Export/Import backup in browsers that don't support this.
   ============================================================ */
var LINK_DB_NAME = "ahtErpLinkDB";
var LINK_STORE = "handles";
var LINK_REC_KEY = "linkedFile";
var linkedFileHandle = null;
var linkedFileName = "";
var autoSavePromptDismissedThisSession = false;

function idbOpen(){
  return new Promise(function(resolve,reject){
    if(!window.indexedDB){ reject(new Error("IndexedDB not available")); return; }
    var req = indexedDB.open(LINK_DB_NAME, 1);
    req.onupgradeneeded = function(){ req.result.createObjectStore(LINK_STORE); };
    req.onsuccess = function(){ resolve(req.result); };
    req.onerror = function(){ reject(req.error); };
  });
}
function idbGet(key){
  return idbOpen().then(function(db){
    return new Promise(function(resolve,reject){
      var tx = db.transaction(LINK_STORE, "readonly");
      var req = tx.objectStore(LINK_STORE).get(key);
      req.onsuccess = function(){ resolve(req.result); };
      req.onerror = function(){ reject(req.error); };
    });
  });
}
function idbSet(key,val){
  return idbOpen().then(function(db){
    return new Promise(function(resolve,reject){
      var tx = db.transaction(LINK_STORE, "readwrite");
      tx.objectStore(LINK_STORE).put(val, key);
      tx.oncomplete = function(){ resolve(); };
      tx.onerror = function(){ reject(tx.error); };
    });
  });
}
function idbDel(key){
  return idbOpen().then(function(db){
    return new Promise(function(resolve,reject){
      var tx = db.transaction(LINK_STORE, "readwrite");
      tx.objectStore(LINK_STORE).delete(key);
      tx.oncomplete = function(){ resolve(); };
      tx.onerror = function(){ reject(tx.error); };
    });
  });
}
function fsApiSupported(){
  return typeof window.showSaveFilePicker === "function" && typeof window.showOpenFilePicker === "function";
}

/* Builds the full, updated HTML document text for this file: the pristine
   template captured at load time, with the embedded-data placeholder swapped
   for the current state. */
function buildSelfContainedHtml(){
  var json = JSON.stringify(state);
  // Escape "</script" inside the JSON so it can't prematurely close the tag.
  json = json.replace(/<\/script/gi, "<\\/script");
  return ORIGINAL_HTML_SOURCE.replace(
    /(<script type="application\/json" id="ahtEmbeddedData">)[\s\S]*?(<\/script>)/,
    "$1" + json + "$2"
  );
}

function updateLinkBadges(){
  var mini = document.getElementById("linkStatusMini");
  var topbarBtn = document.getElementById("topbarLinkBtn");
  if(!mini) return;
  if(linkedFileHandle){
    mini.className = "link-status-badge linked";
    mini.textContent = "💾 Automatic saving: ON";
    if(topbarBtn) topbarBtn.title = "Automatic saving is on — click to manage";
  } else if(!fsApiSupported()){
    mini.className = "link-status-badge";
    mini.textContent = "Automatic saving not supported here";
    if(topbarBtn) topbarBtn.title = "Automatic saving isn't supported in this browser";
  } else {
    mini.className = "link-status-badge warn";
    mini.textContent = "Automatic saving: off";
    if(topbarBtn) topbarBtn.title = "Turn on Automatic Saving — Data & Settings";
  }
}

function writeStateToLinkedFile(){
  if(!linkedFileHandle) return Promise.resolve();
  return linkedFileHandle.createWritable().then(function(writable){
    return writable.write(buildSelfContainedHtml()).then(function(){ return writable.close(); });
  }).catch(function(err){
    console.warn("Could not save into the linked file", err);
    linkedFileHandle = null;
    updateLinkBadges();
    maybeShowAutoSavePrompt("reconnect");
  });
}

function renderLinkModalBody(mode){
  // mode: "new" | "reconnect" | "manage" (manage = opened manually, already on or off)
  var title = document.getElementById("linkModalTitle");
  var sub = document.getElementById("linkModalSub");
  var status = document.getElementById("linkModalStatus");
  var body = document.getElementById("linkModalBody");
  var actions = document.getElementById("linkModalActions");
  status.innerHTML = "";
  body.innerHTML = "";
  actions.innerHTML = "";

  if(!fsApiSupported()){
    title.textContent = "Automatic Saving";
    sub.textContent = "Automatic saving isn't available in this browser.";
    status.innerHTML = '<div class="link-status-badge">Not supported here</div>';
    body.innerHTML = '<p style="font-size:12.5px;color:var(--ink-soft);line-height:1.6;">Chrome or Edge on desktop can save straight back into this file. In this browser, please use <b>Export backup</b> (bottom of the sidebar) regularly instead, and <b>Import backup</b> to restore it.</p>';
    actions.innerHTML = '<span></span><button class="btn ghost" id="lmClose2">Close</button>';
    document.getElementById("lmClose2").onclick = closeLinkModal;
    return;
  }

  if(linkedFileHandle){
    title.textContent = "Automatic Saving is on";
    sub.textContent = "";
    status.innerHTML = '<div class="link-status-badge linked">💾 Saving into: '+esc(linkedFileName)+'</div>';
    body.innerHTML = '<p style="font-size:12.5px;color:var(--ink-soft);line-height:1.6;">Every sale, purchase, receipt and payment now writes straight back into this file, in addition to being saved in this browser.</p>';
    actions.innerHTML =
      '<button class="btn danger" id="lmUnlink">Turn off automatic saving</button>'+
      '<button class="btn gold" id="lmSyncNow">Save now</button>';
    document.getElementById("lmSyncNow").onclick = function(){ writeStateToLinkedFile().then(function(){ alert("Saved into " + linkedFileName + "."); }); };
    document.getElementById("lmUnlink").onclick = function(){ unlinkFile(); renderLinkModalBody("manage"); };
    return;
  }

  if(mode==="reconnect"){
    title.textContent = "Reconnect Automatic Saving";
    sub.textContent = 'This app was saving into "'+linkedFileName+'" before. Your browser needs one click to reconnect before it can keep saving to it.';
    status.innerHTML = '<div class="link-status-badge warn">Needs reconnecting</div>';
    actions.innerHTML =
      '<button class="btn ghost" id="lmForget">Keep Off (Manual Backup)</button>'+
      '<button class="btn gold" id="lmReconnect">Reconnect</button>';
    document.getElementById("lmReconnect").onclick = reconnectLinkedFile;
    document.getElementById("lmForget").onclick = function(){ unlinkFile(); closeLinkModal(); };
    return;
  }

  // "new" / "manage" — automatic saving has never been turned on
  title.textContent = "Automatic Saving";
  sub.innerHTML = 'This app saves your data <b>inside this very .html file</b> — no separate data file to manage. Turn on automatic saving so every sale, purchase, receipt and payment writes straight back into it as you work.';
  status.innerHTML = '<div style="font-size:11.5px;color:var(--ink-soft);line-height:1.6;">You\'ll be asked to pick a file — choose <b>this exact .html file</b> (the one you just opened). You can do this anytime later from Data &amp; Settings instead.</div>';
  actions.innerHTML =
    '<button class="btn ghost" id="lmKeepOff">Keep Off (Manual Backup)</button>'+
    '<button class="btn gold" id="lmEnable">Enable Automatic Saving</button>';
  document.getElementById("lmEnable").onclick = enableAutomaticSaving;
  document.getElementById("lmKeepOff").onclick = function(){ autoSavePromptDismissedThisSession = true; closeLinkModal(); };
}

function enableAutomaticSaving(){
  if(!fsApiSupported()){ alert("Your browser doesn't support automatic saving. Please use Export/Import instead."); return; }
  var pickedHandle;
  window.showOpenFilePicker({
    types: [{description:"This ERP file", accept:{"text/html":[".html",".htm"]}}]
  }).then(function(handles){
    pickedHandle = handles[0];
    return pickedHandle.requestPermission({mode:"readwrite"});
  }).then(function(perm){
    if(perm!=="granted") throw new Error("Permission not granted");
    return pickedHandle.getFile();
  }).then(function(file){
    return file.text();
  }).then(function(text){
    var loaded = null;
    var m = text.match(/<script type="application\/json" id="ahtEmbeddedData">([\s\S]*?)<\/script>/);
    if(m && m[1] && m[1].trim() && m[1].trim()!=="null"){
      try{ var parsed = JSON.parse(m[1]); if(parsed && parsed.transactions) loaded = parsed; }catch(e){ /* ignore */ }
    }
    var proceed = true;
    if(loaded && JSON.stringify(loaded)!==JSON.stringify(state)){
      proceed = confirm("This file already has different saved data in it. Click OK to LOAD it into the app now (replacing what's currently shown), or Cancel to keep your current data and overwrite the file with it.");
    }
    linkedFileHandle = pickedHandle;
    linkedFileName = pickedHandle.name;
    return idbSet(LINK_REC_KEY, pickedHandle).then(function(){
      if(loaded && proceed){
        state = migrateState(loaded);
        saveState();
        updateBrand();
        goTo(currentPage);
      } else {
        return writeStateToLinkedFile();
      }
    });
  }).then(function(){
    autoSavePromptDismissedThisSession = true;
    updateLinkBadges();
    renderLinkModalBody("manage");
  }).catch(function(err){
    if(err && err.name==="AbortError") return;
    console.warn(err);
    alert("Could not turn on automatic saving: " + (err && err.message ? err.message : err));
  });
}
function reconnectLinkedFile(){
  idbGet(LINK_REC_KEY).then(function(h){
    if(!h) return;
    return h.requestPermission({mode:"readwrite"}).then(function(perm){
      if(perm==="granted"){
        linkedFileHandle = h;
        linkedFileName = h.name;
        updateLinkBadges();
        writeStateToLinkedFile().then(function(){ renderLinkModalBody("manage"); });
      }
    });
  }).catch(function(err){ console.warn(err); });
}
function unlinkFile(){
  linkedFileHandle = null;
  linkedFileName = "";
  idbDel(LINK_REC_KEY).catch(function(){});
  updateLinkBadges();
}
function openLinkModal(){
  renderLinkModalBody(linkedFileHandle ? "manage" : "new");
  document.getElementById("linkModal").classList.add("active");
}
function closeLinkModal(){ document.getElementById("linkModal").classList.remove("active"); }
function maybeShowAutoSavePrompt(mode){
  if(autoSavePromptDismissedThisSession) return;
  renderLinkModalBody(mode);
  document.getElementById("linkModal").classList.add("active");
}
function initLinkFile(){
  // GitHub/cloud edition: the old "save into this .html file" feature is replaced by cloud sync.
  var mini=document.getElementById("linkStatusMini"), btn=document.getElementById("linkFileBtn"), top=document.getElementById("topbarLinkBtn");
  function refresh(){
    var C=window.CloudSync;
    if(C && C.enabled){
      mini.className="link-status-badge linked"; mini.textContent="☁ Cloud sync: "+(C.status||"on");
      btn.textContent="⏻ Log out ("+(C.email||"")+")";
    } else {
      mini.className="link-status-badge warn"; mini.textContent="Local mode (this browser only)";
      btn.textContent="☁ Cloud not configured";
    }
  }
  btn.onclick=function(){ if(window.CloudSync && CloudSync.enabled){ if(confirm("Log out?")) CloudSync.logout(); } else alert("Cloud sync is off. Fill in config.js (see README) to turn it on."); };
  top.onclick=btn.onclick;
  window.addEventListener("cloudstatus", refresh);
  refresh();
}

/* ============================================================
   SETTINGS MODAL
   ============================================================ */
function openSettings(){
  var co = state.company;
  document.getElementById("co_name").value = co.name;
  document.getElementById("co_address").value = co.address;
  document.getElementById("co_phone").value = co.phone;
  document.getElementById("co_license").value = co.license||"";
  document.getElementById("co_email").value = co.email;
  document.getElementById("co_seed").value = co.invoiceSeed;
  document.getElementById("co_banks").value = (co.banks||[]).join(", ");
  var img = document.getElementById("logoPreview");
  var txt = document.getElementById("logoPlaceholderText");
  if(co.logo){ img.src = co.logo; img.style.display="block"; txt.style.display="none"; }
  else { img.style.display="none"; txt.style.display="block"; }
  var simg = document.getElementById("sigPreview");
  var stxt = document.getElementById("sigPlaceholderText");
  if(co.signature){ simg.src = co.signature; simg.style.display="block"; stxt.style.display="none"; }
  else { simg.style.display="none"; stxt.style.display="block"; }
  document.getElementById("settingsModal").classList.add("active");
}
function closeSettings(){ document.getElementById("settingsModal").classList.remove("active"); }
function updateBrand(){
  document.getElementById("brandName").textContent = state.company.name;
  var img = document.getElementById("brandLogoImg");
  var fallback = document.getElementById("brandFallbackIcon");
  if(state.company.logo){ img.src = state.company.logo; img.style.display="block"; fallback.style.display="none"; }
  else { img.style.display="none"; fallback.style.display="block"; }
}

function initSettings(){
  document.getElementById("settingsBtn").addEventListener("click", openSettings);
  document.getElementById("settingsClose").addEventListener("click", closeSettings);
  document.getElementById("settingsModal").addEventListener("click", function(e){ if(e.target===this) closeSettings(); });

  document.getElementById("logoUpload").addEventListener("click", function(){ document.getElementById("logoFile").click(); });
  document.getElementById("logoFile").addEventListener("change", function(){
    var file = this.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(e){
      state.company.logo = e.target.result;
      var img = document.getElementById("logoPreview");
      img.src = e.target.result; img.style.display="block";
      document.getElementById("logoPlaceholderText").style.display="none";
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("sigUpload").addEventListener("click", function(){ document.getElementById("sigFile").click(); });
  document.getElementById("sigFile").addEventListener("change", function(){
    var file = this.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(e){
      state.company.signature = e.target.result;
      var img = document.getElementById("sigPreview");
      img.src = e.target.result; img.style.display="block";
      document.getElementById("sigPlaceholderText").style.display="none";
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("co_save").addEventListener("click", function(){
    state.company.name = document.getElementById("co_name").value.trim() || "Company";
    state.company.address = document.getElementById("co_address").value.trim();
    state.company.phone = document.getElementById("co_phone").value.trim();
    state.company.license = document.getElementById("co_license").value.trim();
    state.company.email = document.getElementById("co_email").value.trim();
    state.company.invoiceSeed = Number(document.getElementById("co_seed").value)||1;
    state.company.banks = document.getElementById("co_banks").value.split(",").map(function(s){return s.trim();}).filter(Boolean);
    saveState();
    updateBrand();
    closeSettings();
    renderPage(currentPage);
  });
}

/* ============================================================
   BACKUP / RESTORE
   ============================================================ */
function initBackup(){
  document.getElementById("exportBtn").addEventListener("click", function(){
    var blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "AlKhanTravel_ERP_backup_" + todayStr() + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
  document.getElementById("importBtn").addEventListener("click", function(){
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", function(){
    var file = this.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(e){
      try{
        var data = JSON.parse(e.target.result);
        if(!data.transactions) throw new Error("Not a valid backup file");
        if(!confirm("This will replace all current data with the backup file. Continue?")) return;
        state = data;
        saveState();
        updateBrand();
        goTo(currentPage);
      }catch(err){
        alert("Could not import file: " + err.message);
      }
    };
    reader.readAsText(file);
  });
}


/* ============================================================
   CURRENCIES
   ============================================================ */
function updateDispCurrency(){
  var sel = document.getElementById("dispCurrency");
  if(!sel) return;
  sel.innerHTML = curOptions(state.displayCurrency).replace(/ — [^<]*/g,"");
  sel.value = state.displayCurrency;
}
function renderCurrencyPage(){
  document.getElementById("cv_baseName").textContent = baseCode();
  var fromEl = document.getElementById("cv_from"), toEl = document.getElementById("cv_to");
  if(!fromEl.dataset.init){ fromEl.value = "AED"; toEl.value = baseCode(); fromEl.dataset.init = "1"; }
  function calc(){
    var a = Number(document.getElementById("cv_amount").value)||0;
    var f = fromEl.value, t = toEl.value;
    document.getElementById("cv_result").textContent = fmtNum(convert(a,f,t))+" "+t;
    document.getElementById("cv_rate").textContent = "1 "+f+" = "+fmtNum(convert(1,f,t))+" "+t+"   ·   1 "+t+" = "+fmtNum(convert(1,t,f))+" "+f;
  }
  document.getElementById("cv_amount").oninput = calc;
  fromEl.onchange = calc; toEl.onchange = calc;
  document.getElementById("cv_swap").onclick = function(){ var x = fromEl.value; fromEl.value = toEl.value; toEl.value = x; calc(); };
  calc();

  var base = baseCode();
  document.getElementById("rateTable").innerHTML = state.currencies.map(function(c,i){
    var isBase = c.code===base;
    return '<tr><td class="mono"><b>'+esc(c.code)+'</b></td>'+
      '<td><input type="text" value="'+esc(c.name)+'" onchange="AHT.curEdit('+i+',\'name\',this.value)"></td>'+
      '<td><input type="text" value="'+esc(c.symbol)+'" onchange="AHT.curEdit('+i+',\'symbol\',this.value)"></td>'+
      '<td>'+(isBase?'<span class="mono">1.0000 (base)</span>':'<input type="number" step="0.0001" min="0" value="'+c.rate+'" onchange="AHT.curEdit('+i+',\'rate\',this.value)">')+'</td>'+
      '<td>'+(isBase?'':'<button class="btn sm danger" type="button" onclick="AHT.curDel('+i+')">Delete</button>')+'</td></tr>';
  }).join("");
  document.getElementById("curAddForm").onsubmit = function(ev){
    ev.preventDefault();
    var code = document.getElementById("ca_code").value.trim().toUpperCase();
    if(state.currencies.some(function(c){ return c.code===code; })){ alert(code+" already exists — edit its rate in the table."); return; }
    state.currencies.push({code:code, name:document.getElementById("ca_name").value.trim(), symbol:document.getElementById("ca_symbol").value.trim()||code, rate:Number(document.getElementById("ca_rate").value)||1});
    saveState(); this.reset(); renderPage("currency");
  };
}
AHT.curEdit = function(i,key,val){
  if(key==="rate"){ val = Number(val); if(!(val>0)){ alert("Rate must be greater than zero."); renderCurrencyPage(); return; } }
  state.currencies[i][key] = val; saveState(); renderCurrencyPage(); updateConvHint();
};
AHT.curDel = function(i){
  var c = state.currencies[i];
  if(!confirm("Delete "+c.code+"? Saved entries keep their amounts.")) return;
  state.currencies.splice(i,1);
  if(state.displayCurrency===c.code) state.displayCurrency = baseCode();
  saveState(); renderPage("currency");
};
function initCurrency(){
  document.getElementById("dispCurrency").addEventListener("change", function(){
    state.displayCurrency = this.value; saveState(); renderPage(currentPage);
  });
  ["de_currency"].forEach(function(id){ document.getElementById(id).addEventListener("change", updateConvHint); });
  ["de_saleRate","de_purchaseRate"].forEach(function(id){ document.getElementById(id).addEventListener("input", updateConvHint); });
  document.getElementById("clearBtn").addEventListener("click", function(){
    if(!confirm("Remove ALL entries, receipts, payments and expenses (including the sample data) and start fresh? Company profile and currency rates are kept.")) return;
    var keep = {company:state.company, currencies:state.currencies, baseCurrency:state.baseCurrency, displayCurrency:state.displayCurrency};
    state = defaultState(); state.company = keep.company; state.currencies = keep.currencies; state.baseCurrency = keep.baseCurrency; state.displayCurrency = keep.displayCurrency;
    saveState(); goTo("dashboard");
  });
}


/* ============================================================
   PRINT / PDF REPORTS  (tables only — no charts or chart data)
   ============================================================ */
function printReport(title, subtitle, metaPairs, bodyHtml){
  var co = state.company;
  var logoHtml = co.logo ? '<img class="co-logo" src="'+co.logo+'">' : '';
  var meta = '<div class="inv-meta">'+metaPairs.map(function(m){ return '<div class="blk"><div class="k">'+esc(m[0])+'</div><div class="v">'+esc(m[1])+'</div></div>'; }).join("")+'</div>';
  var area = document.getElementById("rptPrintArea");
  area.innerHTML =
    '<div class="inv-head">'+
      '<div><div class="co-name">'+esc(co.name)+'</div>'+logoHtml+'<div class="co-addr">'+coAddr(co)+'</div></div>'+
      '<div class="inv-badge"><div class="tt">'+esc(title)+'</div><div class="num" style="font-size:17px;">'+esc(subtitle||"")+'</div>'+
      '<div style="font-size:11px;color:var(--ink-soft);margin-top:4px;">Printed '+todayStr()+' · Amounts in '+esc(state.displayCurrency)+'</div></div>'+
    '</div>'+meta+bodyHtml+
    '<div style="margin-top:18px;font-size:10.5px;color:var(--ink-soft);text-align:center;">'+esc(co.name)+' — computer-generated statement</div>';
  area.style.display = "block";
  document.body.classList.add("rpt-mode");
  window.print();
}
function summaryHtml(items){
  return '<div class="rpt-summary" style="grid-template-columns:repeat('+items.length+',1fr);">'+items.map(function(i){ return '<div class="c"><div class="lbl">'+i[0]+'</div><div class="val">'+i[1]+'</div></div>'; }).join("")+'</div>';
}
function ledgerPrintTable(L, heads){
  var rows = "";
  if(L.hasOpening) rows += '<tr><td colspan="5"><b>Opening balance</b></td><td class="mono num"><b>'+money(L.opening)+'</b></td></tr>';
  rows += L.rows.map(function(r){
    return '<tr><td>'+r.date+'</td><td>'+esc(r.ref)+'</td><td>'+esc(r.desc)+'</td><td class="mono num">'+(r.inc?money(r.inc):"")+'</td><td class="mono num">'+(r.dec?money(r.dec):"")+'</td><td class="mono num">'+money(r.bal)+'</td></tr>';
  }).join("") || '<tr><td colspan="6" style="text-align:center;color:var(--ink-soft);">No transactions in this period.</td></tr>';
  return '<table class="rpt-table"><thead><tr><th>Date</th><th>Ref</th><th>Details</th><th class="num">'+heads[0]+'</th><th class="num">'+heads[1]+'</th><th class="num">'+heads[2]+'</th></tr></thead><tbody>'+rows+'</tbody>'+
    '<tfoot><tr><td colspan="3">Totals</td><td class="mono num">'+money(L.sumInc)+'</td><td class="mono num">'+money(L.sumDec)+'</td><td class="mono num">'+money(L.closing)+'</td></tr></tfoot></table>';
}
function printCustomerLedger(){
  if(!lastCL || !lastCL.party){ alert("Please choose a customer first."); return; }
  var L = lastCL.L;
  printReport("Customer Ledger Statement", lastCL.party, [["Customer",lastCL.party],["Period",lastCL.range.label],["Entries",String(L.rows.length)],["Balance receivable",money(L.closing)]],
    summaryHtml([["Opening balance",money(L.opening)],["Sales in period",money(L.sumInc)],["Received in period",money(L.sumDec)],["Balance receivable",money(L.closing)]])+
    ledgerPrintTable(L, ["Sale (Debit)","Received (Credit)","Balance"]));
}
function printSupplierLedger(){
  if(!lastSV || !lastSV.party){ alert("Please choose a vendor first."); return; }
  var L = lastSV.L;
  printReport("Vendor Ledger Statement", lastSV.party, [["Vendor",lastSV.party],["Period",lastSV.range.label],["Entries",String(L.rows.length)],["Balance payable",money(L.closing)]],
    summaryHtml([["Opening balance",money(L.opening)],["Purchases in period",money(L.sumInc)],["Paid in period",money(L.sumDec)],["Balance payable",money(L.closing)]])+
    ledgerPrintTable(L, ["Purchase","Paid","Balance payable"]));
}
function printPL(){
  if(!lastPL){ return; }
  var p = lastPL;
  var svc = SERVICE_ORDER.map(function(s){ var b = p.byService[s]; return '<tr><td>'+SERVICE_FIELDS[s].label+'</td><td class="mono num">'+money(b.sale)+'</td><td class="mono num">'+money(b.cost)+'</td><td class="mono num">'+money(b.sale-b.cost)+'</td></tr>'; }).join("");
  var exp = p.expF.length ? p.expF.slice().sort(function(a,b){ return a.date.localeCompare(b.date); }).map(function(e){ return '<tr><td>'+e.date+'</td><td>'+esc(e.name)+'</td><td>'+esc(e.category||"—")+'</td><td class="mono num">'+money(e.amount)+'</td></tr>'; }).join("")
    : '<tr><td colspan="4" style="text-align:center;color:var(--ink-soft);">No expenses in this period.</td></tr>';
  printReport("Profit & Loss Statement", p.range.label, [["Period",p.range.label],["Gross profit",money(p.totalSale-p.totalCost)],["Total expenses",money(p.totalExp)],["Net profit",money(p.net)]],
    summaryHtml([["Total sales",money(p.totalSale)],["Total cost",money(p.totalCost)],["Gross profit",money(p.totalSale-p.totalCost)],["Expenses",money(p.totalExp)],["Net profit",money(p.net)]])+
    '<h3 style="font-size:13px;margin:6px 0 8px;">Profit &amp; loss by service type</h3>'+
    '<table class="rpt-table"><thead><tr><th>Service</th><th class="num">Sales</th><th class="num">Cost</th><th class="num">Gross profit</th></tr></thead><tbody>'+svc+'</tbody>'+
    '<tfoot><tr><td>Total</td><td class="mono num">'+money(p.totalSale)+'</td><td class="mono num">'+money(p.totalCost)+'</td><td class="mono num">'+money(p.totalSale-p.totalCost)+'</td></tr></tfoot></table>'+
    '<h3 style="font-size:13px;margin:6px 0 8px;">Expenses</h3>'+
    '<table class="rpt-table"><thead><tr><th>Date</th><th>Name</th><th>Category</th><th class="num">Amount</th></tr></thead><tbody>'+exp+'</tbody>'+
    '<tfoot><tr><td colspan="3">Total expenses</td><td class="mono num">'+money(p.totalExp)+'</td></tr></tfoot></table>'+
    '<table class="rpt-table" style="width:55%;margin-left:auto;"><tbody>'+
      '<tr><td>Gross profit</td><td class="mono num">'+money(p.totalSale-p.totalCost)+'</td></tr>'+
      '<tr><td>Less: total expenses</td><td class="mono num">'+money(p.totalExp)+'</td></tr>'+
    '</tbody><tfoot><tr><td>Net profit</td><td class="mono num">'+money(p.net)+'</td></tr></tfoot></table>');
}
function printDayBook(){
  if(!lastDB){ return; }
  var run = 0, sd = 0, sc = 0;
  var rows = lastDB.entries.map(function(e){
    run += e.debit - e.credit; sd += e.debit; sc += e.credit;
    return '<tr><td>'+e.date+'</td><td>'+esc(e.ref)+'</td><td>'+e.type+'</td><td>'+esc(e.party||"—")+'</td><td>'+esc(e.desc)+'</td><td class="mono num">'+(e.debit?money(e.debit):"")+'</td><td class="mono num">'+(e.credit?money(e.credit):"")+'</td><td class="mono num">'+money(run)+'</td></tr>';
  }).join("") || '<tr><td colspan="8" style="text-align:center;color:var(--ink-soft);">No transactions in this range.</td></tr>';
  var per = (lastDB.from||lastDB.to) ? ((lastDB.from||"…")+" – "+(lastDB.to||"…")) : "All dates";
  printReport("Day Book Register", per, [["Period",per],["Type",lastDB.type||"All types"],["Entries",String(lastDB.entries.length)],["Net (debit − credit)",money(run)]],
    '<table class="rpt-table"><thead><tr><th>Date</th><th>Ref#</th><th>Type</th><th>Party</th><th>Description</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead><tbody>'+rows+'</tbody>'+
    '<tfoot><tr><td colspan="5">Totals</td><td class="mono num">'+money(sd)+'</td><td class="mono num">'+money(sc)+'</td><td class="mono num">'+money(run)+'</td></tr></tfoot></table>');
}
function initPeriodsAndPrint(){
  mountPeriod("clp","clpBar",drawCustomerLedger);
  mountPeriod("svp","svpBar",drawSupplierLedger);
  mountPeriod("plp","plpBar",renderPL);
  document.getElementById("clPrintBtn").onclick = printCustomerLedger;
  document.getElementById("svPrintBtn").onclick = printSupplierLedger;
  document.getElementById("plPrintBtn").onclick = printPL;
  document.getElementById("dbPrintBtn").onclick = printDayBook;
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  state = window.__cloudState ? migrateState(window.__cloudState) : loadState();
  var isFirstRun = !state;
  if(!state){ state = defaultState(); seedSampleData(); }
  saveState(); // persists first-run seed data, and any schema migration applied to existing data

  updateBrand();
  document.getElementById("menuToggle").addEventListener("click", function(){
    document.getElementById("sidebar").classList.toggle("open");
  });

  renderNav();
  fillCurSelects();
  updateDispCurrency();
  initDataEntryForm();
  initCurrency();
  initPeriodsAndPrint();
  initExpenseForm();
  initSettings();
  initBackup();
  initLinkFile();
  goTo("dashboard");
}

document.addEventListener("DOMContentLoaded", function(){
  (window.ERP_READY || Promise.resolve()).then(init);
});
})();
