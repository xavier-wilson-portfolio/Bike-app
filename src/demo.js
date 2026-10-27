/* ============ Demo mode (?demo) ============
   An example V-Strom anyone can look through without an account. It loads from demo.json, keeps nothing (a reload starts over),
   and never reaches the AI, the parts search or a file download. Anything that would save, change, export or add a bike opens
   a box that sends them to create a free account. After a good look around (DEMO_SOFT pages) a box suggests signing up;
   after DEMO_HARD pages or DEMO_MS of browsing the demo stops and only sign up or sign in are left. */
const DEMO = !!window.RV_DEMO;
const DEMO_SOFT = 10, DEMO_HARD = 25, DEMO_MS = 8 * 60 * 1000;
// pages seen and start time are kept for a day, so reloading doesn't restart the tour
const demoMem = (() => { try { const m = JSON.parse(localStorage.getItem("rv.demo") || "null"); if (m && Date.now() - m.t0 < 864e5) return m; } catch (e) {} return { t0: Date.now(), views: 0 }; })();
const demoKeep = () => { try { localStorage.setItem("rv.demo", JSON.stringify({ t0: DEMO_T0, views: demoViews })); } catch (e) {} };
const DEMO_T0 = demoMem.t0;
let demoViews = demoMem.views, demoSoftShown = demoMem.views >= DEMO_SOFT, demoHardShown = false, demoGesture = 0;

const demoSignup = () => { location.href = location.pathname + "?auth=signup"; };
const demoSignin = () => { location.href = location.pathname + "?auth=signin"; };

// a box that says what they tried and sends them to sign up
function demoWall(what) {
  if (!DEMO || demoHardShown) return;
  modal(`<div class="demo-box"><span class="demo-k">Demo bike</span><h2>Create a free account to ${esc(what || "do that")}</h2>
    <p>This is an example bike so you can see how Revora works. Nothing here is saved. Make a free account to add your own bike and keep its records.</p>
    <div class="demo-acts"><button class="btn tan" data-demo-signup>Create free account</button><button class="btn" data-demo-close>Keep looking</button></div>
    <p class="faint demo-small">Already have an account? <button class="linkbtn" data-demo-signin>Sign in</button></p></div>`, m => {
    $$("[data-demo-signup]", m).forEach(b => b.onclick = demoSignup);
    $$("[data-demo-signin]", m).forEach(b => b.onclick = demoSignin);
    $$("[data-demo-close]", m).forEach(b => b.onclick = () => closeModal());
  });
}

// the end of the demo: covers the page, only sign up or sign in are left
function demoHardWall() {
  if (!DEMO || demoHardShown) return; demoHardShown = true;
  try { closeModal(); } catch (e) {}
  const d = document.createElement("div"); d.className = "demo-wall"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
  d.innerHTML = `<div class="demo-wall-card"><img class="brand-icon" src="img/revora-icon.svg" alt=""><h2>That's the tour</h2>
    <p>You've seen how Revora works on an example bike. Create a free account to add your own bike, log its services and keep every record.</p>
    <button class="btn tan big" data-demo-signup>Create free account</button><button class="linkbtn" data-demo-signin>I already have an account</button>
    <span class="faint demo-small">Free for one bike. No card needed.</span></div>`;
  d.querySelector("[data-demo-signup]").onclick = demoSignup;
  d.querySelector("[data-demo-signin]").onclick = demoSignin;
  document.body.appendChild(d); document.documentElement.classList.add("demo-ended");
}

function demoSoftWall() {
  if (demoSoftShown || demoHardShown) return; demoSoftShown = true;
  modal(`<div class="demo-box"><span class="demo-k">Like what you see?</span><h2>Add your own bike</h2>
    <p>Everything you've looked at works the same on your bike: the service log, reminders, parts, the course and the mechanic. It's free for one bike.</p>
    <div class="demo-acts"><button class="btn tan" data-demo-signup>Create free account</button><button class="btn" data-demo-close>Keep looking</button></div></div>`, m => {
    $$("[data-demo-signup]", m).forEach(b => b.onclick = demoSignup);
    $$("[data-demo-close]", m).forEach(b => b.onclick = () => closeModal());
  });
}

const demoTooLong = () => Date.now() - DEMO_T0 > DEMO_MS;
function demoCount() {
  demoViews++; demoKeep();
  if (demoViews >= DEMO_HARD || demoTooLong()) { demoHardWall(); return false; }
  if (demoViews >= DEMO_SOFT) setTimeout(demoSoftWall, 600);
  return true;
}

// writes from the store. A write right after a tap or key press is the person trying to change something: show the box.
// Other writes (the app tidying its own records while drawing a page) only change what's in memory, and a reload drops them.
function demoWrite(kind, c, rec) {
  if (Date.now() - demoGesture < 1500) { demoWall(kind === "del" ? "delete or change records" : "save changes"); throw new Error("demo"); }
  if (kind === "put" && rec && rec.id) S[c][rec.id] = clone(rec);
  if (kind === "del" && S[c]) delete S[c][rec];
  return Promise.resolve();
}

// load the example bike, with its dates moved up so the history looks recent
async function demoLoad() {
  const r = await fetch("demo.json?v=" + (window.RV_BUILD || ""), { cache: "no-cache" });
  let txt = await r.text();
  const made = new Date((JSON.parse(txt).made || today()) + "T12:00:00"), shift = Math.round((new Date(today() + "T12:00:00") - made) / 864e5);
  if (shift > 0) txt = txt.replace(/"(\d{4}-\d{2}-\d{2})(T[^"]*)?"/g, (all, d, rest) => { const x = new Date(d + "T12:00:00"); if (isNaN(x)) return all; x.setDate(x.getDate() + shift); return `"${isoDay(x)}${rest || ""}"`; });
  return JSON.parse(txt);
}

if (DEMO) {
  document.documentElement.classList.add("is-demo");
  ["pointerdown", "keydown"].forEach(ev => document.addEventListener(ev, e => { if (!e.target.closest || !e.target.closest(".demo-box,.demo-wall,.demo-bar")) demoGesture = Date.now(); }, true));

  // the AI, parts search and reminder emails need an account: stop them here (the worker also refuses calls without a sign-in)
  const realFetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const url = String(u && u.url || u || "");
    if (/workers\.dev/.test(url) || (window.RV_CONFIG && RV_CONFIG.shopApi && url.startsWith(RV_CONFIG.shopApi))) { demoWall("use the AI tools"); return Promise.reject(new Error("demo")); }
    return realFetch(u, o);
  };
  const block = (name, what) => { if (typeof window[name] === "function") window[name] = () => demoWall(what); };
  sendChat = () => demoWall("ask the mechanic"); window.sendChat = sendChat;
  snapReceipt = () => demoWall("scan receipts"); window.snapReceipt = snapReceipt;
  pvScan = () => demoWall("scan your parts from a photo"); window.pvScan = pvScan;
  scanStart = () => demoWall("scan your parts from a photo"); window.scanStart = scanStart;
  saveFile = async () => { demoWall("export your records"); }; window.saveFile = saveFile;
  window.print = () => demoWall("print or save a PDF");
  printHtml = () => demoWall("print or save a PDF"); window.printHtml = printHtml;
  window.rvFeedback = async () => ({ queued: true });
  window.rvDeleteProject = () => demoWall("delete a bike");
  // no uploads of any kind (photos, receipts, backups)
  document.addEventListener("click", e => { const f = e.target.closest && e.target.closest('input[type="file"],label[for]'); if (!f) return;
    const inp = f.matches('input[type="file"]') ? f : document.getElementById(f.getAttribute("for")); if (!inp || inp.type !== "file") return;
    e.preventDefault(); e.stopPropagation(); demoWall("add photos or files"); }, true);
  document.addEventListener("change", e => { if (e.target.type === "file") { e.stopImmediatePropagation(); e.target.value = ""; demoWall("add photos or files"); } }, true);
  // the delete button in Settings would clear this browser's saved bike: point it at sign-up instead
  const sb0 = VIEWS.settings.bind;
  VIEWS.settings.bind = function (root) { sb0.apply(this, arguments); const b = $("#delBike"); if (b) b.onclick = () => demoWall("delete a bike"); };
  // no other bikes in the demo
  ["rvPickBike", "rvOpenBike", "rvStartRestoring", "rvRequestCourse"].forEach(n => block(n, "add your own bike"));
  window.rvAccount = demoSignup;

  // count pages; stop after a long look around
  const realGo = go;
  go = function (sec, f) { if (!demoCount()) return; return realGo(sec, f); }; window.go = go;
  setInterval(() => { if (demoTooLong()) demoHardWall(); }, 15000);
  if (demoViews >= DEMO_HARD || demoTooLong()) setTimeout(demoHardWall, 300);

  // the strip across the top
  const bar = () => { if (document.querySelector(".demo-bar")) return;
    const d = document.createElement("div"); d.className = "demo-bar";
    d.innerHTML = `<span><b>Demo bike.</b><span class="demo-more"> Look around. Nothing you do here is saved.</span><span class="demo-less"> Nothing is saved.</span></span><button class="btn sm tan" type="button"><span class="demo-more">Create free account</span><span class="demo-less">Sign up free</span></button>`;
    d.querySelector("button").onclick = demoSignup; document.body.prepend(d); };
  if (document.body) bar(); else document.addEventListener("DOMContentLoaded", bar);
}
