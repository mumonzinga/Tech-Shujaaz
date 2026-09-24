// Sample data: replace with your real sessions. Online sessions need no county/subcounty/constituency/venue.
const S=[
{id:1,t:"Group Support Circle",who:"Wanjiru Kamau, Counsellor",d:"2026-10-05T10:00",mode:"Physical",price:0,county:"Nairobi",sub:"Westlands",con:"Westlands",venue:"Community Health Centre"},
{id:2,t:"1:1 Counselling Session",who:"Dr. Otieno, Psychologist",d:"2026-10-06T14:00",mode:"Online",price:2500},
{id:3,t:"Stress & Mindfulness Workshop",who:"Amina Yusuf, Therapist",d:"2026-10-08T11:00",mode:"Physical",price:0,county:"Nairobi",sub:"Starehe",con:"Starehe",venue:"Youth Centre"},
{id:4,t:"Family Therapy",who:"Dr. Mwangi, Family Therapist",d:"2026-10-10T09:30",mode:"Physical",price:3000,county:"Mombasa",sub:"Nyali",con:"Nyali",venue:"Wellness Clinic"},
{id:5,t:"Grief Support Group",who:"Faith Achieng, Counsellor",d:"2026-10-12T17:00",mode:"Online",price:0},
{id:6,t:"Couples Counselling",who:"Dr. Kiprop, Therapist",d:"2026-10-14T15:00",mode:"Physical",price:3500,county:"Kisumu",sub:"Kisumu Central",con:"Kisumu Central",venue:"Lakeside Clinic"},
{id:7,t:"Youth Peer Circle",who:"Brian Mutiso, Peer Facilitator",d:"2026-10-16T16:00",mode:"Physical",price:0,county:"Nakuru",sub:"Nakuru Town East",con:"Nakuru Town East",venue:"Town Hall"},
{id:8,t:"CBT Session",who:"Dr. Njeri, Psychologist",d:"2026-10-18T13:00",mode:"Online",price:2000},
{id:9,t:"Trauma-Informed Yoga",who:"Grace Wambui, Instructor",d:"2026-10-20T08:00",mode:"Physical",price:1500,county:"Nairobi",sub:"Langata",con:"Langata",venue:"Studio 5"},
{id:10,t:"Free Wellness Clinic Day",who:"Volunteer Counsellors",d:"2026-10-24T10:00",mode:"Physical",price:0,county:"Mombasa",sub:"Mvita",con:"Mvita",venue:"Public Library"}
];
const $=id=>document.getElementById(id);
const st={mode:"all",price:"all"},booked=new Set();let cur=null;
const uniq=a=>[...new Set(a)].sort();
function opts(el,vals,label){const v=el.value;el.innerHTML="";const o=new Option(label,"");el.add(o);vals.forEach(x=>el.add(new Option(x,x)));el.value=vals.includes(v)?v:"";}
function syncLoc(){
const P=S.filter(s=>s.county);
opts($("county"),uniq(P.map(s=>s.county)),"All counties");
const c=$("county").value,P2=P.filter(s=>!c||s.county===c);
opts($("sub"),uniq(P2.map(s=>s.sub)),"All subcounties");
const sb=$("sub").value;
opts($("con"),uniq(P2.filter(s=>!sb||s.sub===sb).map(s=>s.con)),"All constituencies");
}
const fmt=d=>{const x=new Date(d);return x.toLocaleDateString("en-KE",{weekday:"short",day:"numeric",month:"short"})+" · "+x.toLocaleTimeString("en-KE",{hour:"numeric",minute:"2-digit"});};
const cost=s=>s.price?"KSh "+s.price.toLocaleString():"Free";
function render(){
const c=$("county").value,sb=$("sub").value,cn=$("con").value,q=$("q").value.trim().toLowerCase();
const r=S.filter(s=>{
if(st.mode!=="all"&&s.mode.toLowerCase()!==st.mode)return false;
if(st.price==="free"&&s.price>0)return false;
if(st.price==="paid"&&!s.price)return false;
if(s.mode==="Physical"){if(c&&s.county!==c)return false;if(sb&&s.sub!==sb)return false;if(cn&&s.con!==cn)return false;}
if(q&&![s.t,s.who,s.venue,s.county,s.sub,s.con].join(" ").toLowerCase().includes(q))return false;
return true;}).sort((a,b)=>a.d.localeCompare(b.d));
$("count").textContent="Showing "+r.length+" session"+(r.length===1?"":"s");
$("list").innerHTML=r.length?r.map(s=>{
const loc=s.mode==="Online"?"Join from anywhere":s.venue+", "+s.sub+", "+s.county+" County";
const b=booked.has(s.id);
return `<article class="card"><div class="tags"><span class="b">${s.mode}</span><span class="b ${s.price?"paid":"free"}">${cost(s)}</span></div>
<h3>${s.t}</h3><p>${s.who}</p><p>${fmt(s.d)}</p><p>${loc}</p>
<button class="btn" data-id="${s.id}" ${b?"disabled":""}>${b?"Booked ✓":"Book"}</button></article>`;}).join(""):`<div class="empty">No sessions match your filters. Try resetting them.</div>`;
}
function openBook(id){cur=S.find(s=>s.id===id);$("mt").textContent="Book session";
$("mi").textContent=cur.t+" · "+fmt(cur.d)+" · "+cost(cur);
$("form").style.display="grid";$("ok").style.display="";$("cancel").textContent="Cancel";$("err").textContent="";
$("nm").value=$("ph").value=$("em").value="";$("ov").classList.add("on");$("nm").focus();}
function closeBook(){$("ov").classList.remove("on");}
$("ok").onclick=()=>{
const n=$("nm").value.trim(),p=$("ph").value.trim();
if(!n||!/^[+\d\s()-]{7,}$/.test(p)){$("err").textContent="Please enter your name and a valid phone number.";return;}
booked.add(cur.id);$("mt").textContent="Booking confirmed";
$("mi").textContent=n+", you're booked for "+cur.t+" on "+fmt(cur.d)+"."+(cur.price?" Payment details will be sent to you.":"");
$("form").style.display="none";$("ok").style.display="none";$("cancel").textContent="Close";render();};
$("cancel").onclick=closeBook;
$("ov").onclick=e=>{if(e.target===$("ov"))closeBook();};
$("list").onclick=e=>{const b=e.target.closest("button[data-id]");if(b&&!b.disabled)openBook(+b.dataset.id);};
["county","sub","con"].forEach(id=>$(id).onchange=()=>{syncLoc();render();});
$("q").oninput=render;
document.querySelectorAll(".chips").forEach(g=>g.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;
st[g.dataset.g]=b.dataset.v;g.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===b));render();});
$("reset").onclick=()=>{$("q").value="";st.mode=st.price="all";
document.querySelectorAll(".chips").forEach(g=>g.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v==="all")));
["county","sub","con"].forEach(id=>$(id).value="");syncLoc();render();};
syncLoc();render();
