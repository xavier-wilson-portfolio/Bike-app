/* ============ Bike library: real specs for this bike, each with the page it came from ============
   Entries live in Supabase (bike_library). Every number has a source and a page; nothing is guessed.
   Paid members get every number. Free members see one real number and the rest blurred (the real values never reach them).
   A paid member's bike that isn't in the library yet gets built by the library worker while they watch. */
const LIB = { entry: null, full: false, queue: null, tried: false, busy: null, building: false, polls: 0 };
const LIB_API = () => (window.RV_CONFIG && RV_CONFIG.libraryApi) || "https://revora-library.xavier-j-wilson101.workers.dev";
const libSb = () => (window.RV_CLOUD && RV_CLOUD.sb) || window.RV_SB || null;
const libNorm = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const libMeta = () => Object.assign({ year: BIKE.year, make: BIKE.make, model: BIKE.model }, (typeof meta === "function" && meta()) || {});
const libRerender = () => { if (typeof R !== "undefined" && R.sec === "numbers" && typeof render === "function") render(false); };
async function libLookup() {
  const md = libMeta(), sb = libSb(); if (!sb || !md.make || !md.model) return null;
  const { data, error } = await sb.rpc("lib_lookup", { mk: String(md.make), mdl: String(md.model), yr: +md.year || null });
  if (error || !data) return null;
  LIB.full = !!data.full; LIB.queue = data.queue || null; LIB.entry = data.found ? data.entry : null;
  if (LIB.entry) { const y = +md.year; LIB.entry._exact = !y || (y >= LIB.entry.years[0] && y <= LIB.entry.years[1]); }
  return data;
}
// find this bike in the library (once per page load); paid members whose bike is missing get it built now
function libLoad() {
  if (LIB.busy) return LIB.busy;
  LIB.busy = (async () => {
    try { await libLookup(); } catch (e) { LIB.entry = null; }
    LIB.tried = true; libRerender();
    if (!LIB.entry && LIB.full) libBuild();
    return LIB.entry;
  })();
  return LIB.busy;
}
async function libToken() { try { const r = await libSb().auth.getSession(); return r.data.session && r.data.session.access_token; } catch (e) { return null; } }
async function libBuild() {
  if (LIB.building) return; const md = libMeta(), tok = await libToken(); if (!tok) return;
  LIB.building = true; LIB.polls = 0; libRerender();
  fetch(LIB_API() + "/build", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tok }, body: JSON.stringify({ make: md.make, model: md.model, year: +md.year || null }) }).catch(() => {});
  const tick = async () => {
    LIB.polls++;
    try { await libLookup(); } catch (e) {}
    const q = LIB.queue && LIB.queue.status;
    if (LIB.entry || q === "none" || q === "failed" || LIB.polls > 40) { LIB.building = false; libRerender(); if (LIB.entry && typeof toast === "function") toast("Your bike's numbers are in."); return; }
    setTimeout(tick, 6000);
  };
  setTimeout(tick, 8000);
}
// tapped Upgrade: queue the bike now so it's building while they pay
async function libUpgrade() {
  const md = libMeta(), sb = libSb();
  if (sb && !LIB.entry && md.make && md.model) sb.rpc("lib_request", { mk: String(md.make), mdl: String(md.model), yr: +md.year || null }).then(() => {}, () => {});
  if (typeof go === "function") go("plans");
}
const libSrc = (e, s) => (e.sources || {})[s] || { name: "Source", url: "" };
const libFact = k => { const e = LIB.entry; if (!e) return null; const f = (e.specs || []).find(x => x.k === k); return f ? Object.assign({ s: libSrc(e, f.src) }, f) : null; };
const libChip = (s, p) => `<a class="lib-src" href="${esc(s.url)}" target="_blank" rel="noopener">${ic("book")}<span>${esc(s.short || "Owner's manual")}${p ? " p. " + esc(p) : ""}</span></a>`;
function libBanner() {
  const e = LIB.entry;
  if (!LIB.tried) return `<div class="lib-ban loading"><span class="lib-spin"></span><span>Looking up your bike in the Revora library…</span></div>`;
  if (!e && LIB.building) return `<div class="lib-ban loading"><span class="lib-spin"></span><div><b>Pulling your bike's exact numbers.</b><span>Revora is finding the owner's manual for your ${esc([libMeta().year, libMeta().make, libMeta().model].filter(Boolean).join(" "))} and checking every number against it. This usually takes about a minute. You can keep using the page.</span></div></div>`;
  if (!e && LIB.queue && LIB.queue.status === "none") return `<div class="num-note">${ic("alert")}<span>Revora couldn't find an owner's manual for this bike online, so these stay as your own numbers. Copy them from your manual and they're here whenever you need them.</span></div>`;
  if (!e && !LIB.full) return `<div class="lib-up">${ic("lock")}<div><b>Get every spec for your bike.</b><span>Paid plans pull your bike's oil, plugs, chain, tires and torque values straight from its owner's manual, with the page for each one, plus factory parts diagrams for every guide.</span></div><button class="btn tan" data-libup>Upgrade to unlock</button></div>`;
  if (!e) return "";
  const s = Object.values(e.sources || {})[0] || {};
  return `<div class="lib-ban">${ic("check")}<div><b>${esc(e.make)} ${esc(e.model)}${e.code ? ` <span class="faint">(${esc(e.code)})</span>` : ""} is in the Revora library.</b>
    <span>Numbers marked with a page come from the <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>. Tap Use to copy one into your numbers, or type your own.${e._exact ? "" : ` These are from the ${esc(e.years[0] === e.years[1] ? e.years[0] : e.years[0] + "–" + e.years[1])} manual, so check them against yours.`}</span>
    ${e.note ? `<span class="lib-warn">${ic("alert")} ${esc(e.note)}</span>` : ""}</div></div>
    ${e.locked ? `<div class="lib-up">${ic("lock")}<div><b>Your bike's numbers are ready.</b><span>Upgrade to see them all, with torque values and the factory diagram for every guide. Oil is on us.</span></div><button class="btn tan" data-libup>Upgrade to unlock</button></div>` : ""}`;
}
// what the library has for one field on the numbers page
function libHint(k, cur) {
  const f = libFact(k); if (!f) return "";
  if (f.locked) return `<span class="lib-hint"><b class="lib-blur" aria-label="Hidden until you upgrade">${esc(f.v)}</b>${ic("lock")}<button class="linkbtn" data-libup>Unlock</button></span>`;
  const same = cur && String(cur).trim() === f.v;
  return `<span class="lib-hint${same ? " same" : ""}">${same ? ic("check") : ""}<b>${esc(f.v)}</b>${libChip(f.s, f.p)}${same || !ME.canWrite ? "" : `<button class="linkbtn" data-libuse="${esc(k)}">Use</button>`}</span>`;
}
function libTorqueHtml(have) {
  const e = LIB.entry; if (!e || !(e.torque || []).length) return "";
  const has = new Set((have || []).map(t => libNorm(t.what)));
  return `<div class="lib-tq"><div class="lib-tqh">From the library</div>${e.torque.map((t, i) => `<div class="lib-tqr"><span>${esc(t.what)}</span><b class="${t.locked ? "lib-blur" : ""}">${esc(t.v)}</b>${libChip(libSrc(e, t.src), t.p)}${t.locked ? `<button class="linkbtn" data-libup>${ic("lock")} Unlock</button>` : has.has(libNorm(t.what)) ? `<span class="lib-ok">${ic("check")} Added</span>` : ME.canWrite ? `<button class="btn sm" data-libtq="${i}">${ic("plus")} Add</button>` : ""}</div>`).join("")}</div>`;
}

/* ---------- guides: dark traced art, numbered steps, this bike's numbers, and the factory diagram ---------- */
const LIB_GUIDES = {
  chain: {
    title: "Adjust the drive chain", meta: "20 min · Easy",
    art: "img/sil/wheels.svg", credit: "wheels.svg",
    pins: [[42, 45, 1], [59, 67.5, 2], [84, 46, 3]],
    rings: [["c", 50.6, 55, 8.7], ["r", 58.8, 59.6, 7, 4.6], ["a", 77.8, 54.4]],
    steps: [["Loosen the axle nut", "Just enough that the wheel can slide. Bike level and in neutral, on a stand if you have one."],
      ["Turn both adjusters the same", "Count the turns on each side so the wheel stays lined up with the marks on the swingarm."],
      ["Check the slack", "Push the lower run up and down halfway between the sprockets. Check a few spots and use the tightest one."],
      ["Torque the axle nut", "Tighten to spec, then check the slack again. It can move as the nut tightens."]],
    facts: [["slack", "Chain slack"], ["@Rear axle nut", "Axle nut torque"], ["chain", "Chain"]]
  },
  oil: { title: "Change the oil and filter", meta: "45 min · Easy", art: "img/sil/engine.svg", credit: "engine.svg", pins: [], rings: [],
    steps: [["Warm it up, then shut it off", "A few minutes of idling lets the oil drain fully. Let it sit a minute so you don't grab a hot exhaust."],
      ["Drain the oil", "Bike level, pan under the drain bolt. Remove the bolt and let it drain. Use a new sealing washer."],
      ["Swap the filter", "Spin off the old filter, wipe the seat, oil the new filter's seal and tighten it to spec."],
      ["Refill and check", "Add the amount below, run it for a minute, shut it off and check the level on the sight glass or dipstick."]],
    facts: [["oilCap", "Oil with filter change"], ["oil", "Oil type"], ["@Oil drain bolt", "Drain bolt torque"]] },
  brakes: { title: "Check and replace brake pads", meta: "40 min · Medium", art: "img/sil/brakes.svg", credit: "brakes.svg", pins: [], rings: [],
    steps: [["Look at the pad thickness", "Through the caliper, check the friction material. Replace them at the wear grooves or about 1 mm."],
      ["Remove the old pads", "Pull the pad pin and slide the pads out. Don't squeeze the lever with the pads out."],
      ["Push the pistons back", "Clean the pistons and push them back gently. Watch the fluid level in the reservoir as you do."],
      ["Fit the new pads and pump the lever", "Install the pads and pin, then pump the lever until it's firm before you ride."]],
    facts: [["brakeFluid", "Brake fluid"], ["padsF", "Front pads"], ["padsR", "Rear pads"]] },
  coolant: { title: "Check and change the coolant", meta: "1 hr · Medium", art: "img/sil/cooling.svg", credit: "cooling.svg", pins: [], rings: [],
    steps: [["Only with the engine cold", "Never open the radiator cap on a warm engine. Hot coolant is under pressure."],
      ["Check the reservoir", "With the bike level, the coolant should sit between the lower and upper marks."],
      ["Drain and refill", "Open the drain bolt, flush, then refill with the right mix to the amount below."],
      ["Bleed the air out", "Run it with the cap off until the bubbles stop, top it off, then fill the reservoir to the line."]],
    facts: [["coolant", "Coolant"], ["@Coolant drain bolt", "Drain bolt torque"], ["oil", "Engine oil"]] },
  tires: { title: "Check tire pressure and wear", meta: "10 min · Easy", art: "img/sil/wheels.svg", credit: "wheels.svg", pins: [], rings: [],
    steps: [["Check them cold", "Before you ride, or after the bike has sat for a few hours. Warm tires read high."],
      ["Set the pressure", "Use a real gauge, not the one on the air pump. Set both to the numbers below."],
      ["Look at the tread", "Check the wear bars and look for cuts, nails, cracks or flat spots."],
      ["Check the date code", "Tires get hard with age. Most riders replace them around 5 to 6 years old even with tread left."]],
    facts: [["psiF", "Front pressure"], ["psiR", "Rear pressure"], ["tireR", "Rear tire"]] },
  battery: { title: "Look after the battery", meta: "15 min · Easy", art: "img/sil/electrical.svg", credit: "electrical.svg", pins: [], rings: [],
    steps: [["Check the voltage", "A healthy battery reads about 12.6 volts or more with the bike off."],
      ["Clean the terminals", "Disconnect the negative first, clean any corrosion, then reconnect positive first."],
      ["Keep it charged", "If the bike sits more than a couple of weeks, use a battery tender made for motorcycles."],
      ["Replace with the same type", "Match the battery below, and check the fuse sizes if anything electrical stops working."]],
    facts: [["battery", "Battery"], ["fuses", "Fuses"], ["headlight", "Headlight bulb"]] },
  plugs: { title: "Check and replace the spark plugs", meta: "30 min · Medium", art: "img/sil/engine.svg", credit: "engine.svg", pins: [], rings: [],
    steps: [["Engine cold", "Plugs thread into aluminum. Pulling them hot can damage the threads."],
      ["Blow out the wells", "Clear dirt from around each plug before you remove it so nothing falls into the cylinder."],
      ["Check the gap", "Set the new plug's gap to the spec below with a gap tool."],
      ["Thread in by hand first", "Start each plug by hand so it can't cross-thread, then tighten to spec."]],
    facts: [["plug", "Spark plug"], ["plugGap", "Gap"], ["@Spark plug", "Plug torque"]] }
};
function libGuidesHtml() {
  if (!LIB.entry && LIB.building) { const md = libMeta(), d = md.drive || "chain"; return [d === "chain" ? "chain" : null, "oil", "brakes", "tires"].filter(Boolean).map(g => libGuideHtml(g, { make: md.make, model: md.model, drive: d, guides: [g], specs: [], torque: [], diagrams: {}, pending: true })).join(""); }
  const e = LIB.entry; if (!e) return ""; return (e.guides || []).filter(g => LIB_GUIDES[g]).map(libGuideHtml).join(""); }
function libGuideFact(e, key) {
  if (key[0] === "@") { const t = (e.torque || []).find(x => libNorm(x.what) === libNorm(key.slice(1))); return t ? { v: t.v, s: libSrc(e, t.src), p: t.p, locked: t.locked } : null; }
  const f = (e.specs || []).find(x => x.k === key); return f ? { v: f.v, s: libSrc(e, f.src), p: f.p, locked: f.locked } : null;
}
function libGuideHtml(id, pe) {
  const e = pe || LIB.entry, g = LIB_GUIDES[id]; if (!e || !g || !(e.guides || []).includes(id)) return "";
  const cred = (X.silCredit || (window.RV_CONFIG && RV_CONFIG.silCredit) || {})[g.credit], dg = (e.diagrams || {})[id];
  return `<section class="lib-guide"><div class="lib-gh"><div><span class="lib-eb">How-to · ${esc(g.meta)}</span><h2>${esc(g.title)}</h2></div><div class="lib-gb"><b>${esc(e.make)} ${esc(e.model)}</b><span>${esc(e.drive === "chain" ? "Chain drive" : e.drive || "")}</span></div></div>
    <div class="lib-gbody"><figure class="lib-art"><div class="lib-artin"><img src="${esc(g.art)}" alt="">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${g.rings.map(r => r[0] === "c" ? `<ellipse cx="${r[1]}" cy="${r[2]}" rx="${r[3] * .9}" ry="${r[3]}" />` : r[0] === "r" ? `<rect x="${r[1] - r[3] / 2}" y="${r[2] - r[4] / 2}" width="${r[3]}" height="${r[4]}" rx="1.2"/>` : `<path d="M${r[1]},${r[2] - 4.6} V${r[2] + 4.6} M${r[1] - 1.6},${r[2] - 2.6} L${r[1]},${r[2] - 4.8} L${r[1] + 1.6},${r[2] - 2.6} M${r[1] - 1.6},${r[2] + 2.6} L${r[1]},${r[2] + 4.8} L${r[1] + 1.6},${r[2] + 2.6}"/>`).join("")}</svg>
        ${g.pins.map(([x, y, n]) => `<span class="lib-pin" style="left:${x}%;top:${y}%">${n}</span>`).join("")}</div>
      <figcaption>${e.locked ? `<span>Simplified Revora drawing. <button class="linkbtn" data-libup>Upgrade to open the factory diagram for your bike</button></span>` : dg ? `<span>Simplified Revora drawing, not the official factory diagram.</span><a href="${esc(dg.url)}" target="_blank" rel="noopener">See the factory diagram for this bike on ${esc(dg.site)} ${ic("next")}</a>` : `<span>Simplified Revora drawing, not the official factory diagram.</span>`}
        ${cred ? `<small>Art traced from "${esc(cred.title)}" by ${esc(cred.artist)}, <a href="${esc(cred.licUrl)}" target="_blank" rel="noopener">${esc(cred.lic)}</a></small>` : ""}</figcaption></figure>
      <ol class="lib-steps">${g.steps.map(([t, d], i) => `<li><span class="lib-n">${i + 1}</span><div><b>${esc(t)}</b><span>${esc(d)}</span></div></li>`).join("")}</ol></div>
    <div class="lib-facts">${g.facts.map(([k, l]) => { const f = libGuideFact(e, k); return `<div class="lib-fact"><small>${esc(l)}</small>${e.pending ? `<b class="faint"><span class="lib-spin"></span> Pulling…</b>` : f ? `<b class="${f.locked ? "lib-blur" : ""}">${esc(f.v)}</b>${f.locked ? `<button class="linkbtn" data-libup>${ic("lock")} Unlock</button>` : libChip(f.s, f.p)}` : `<b class="faint">Not in the owner's manual</b><span class="lib-none">Check the service manual</span>`}</div>`; }).join("")}</div></section>`;
}
