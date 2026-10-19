/* ============ Parts: scan a photo, go through the catalogue one card at a time, add your own, manage the list ============
   Data:
   - The catalogue is the bike's parts diagrams (scanDiagrams / scanParts). Every catalogue part has a key "<diagram id>|<part id>".
   - Have / missing marks stay where the scanner and the 3D parts check keep them (S.meta["have-<diagram>"]), so all three agree.
   - Each catalogue part someone decides on gets ONE linked record in S.parts (catKey = the key). Extra physical copies can be
     tracked as more records with the same catKey. Hand-added parts are ordinary S.parts records with no catKey.
   - Skipped parts are kept in S.meta.invdeck.skip (shared with the team). The card you were on is kept per browser.
   Ownership (inv), condition and restoration stage are separate fields. The old status field is kept in step with them so
   the overview, diagrams and reports keep working. */
const PV_INV = ["Owned", "Missing", "Ordered", "Received"];
const PV_COND = [["New", "New"], ["Good", "Good"], ["Fair", "Fair"], ["Poor", "Poor"], ["Damaged", "Damaged"], ["Uninspected", "Unknown"]];
const PV_STAGE = ["Not inspected", "Needs cleaning", "Needs repair", "In restoration", "Restored", "Ready for installation", "Installed"];
const PV_NEEDS = [["needClean", "Cleaning"], ["needRepair", "Repair"], ["needReplace", "Replacement"], ["needInspect", "Inspection"]];
const PV_MARKS = [["Ordered", "Purchased / ordered"], ["Received", "Received"], ["Repaired", "Repaired"], ["Restored", "Restored"], ["Ready for installation", "Ready to install"], ["Installed", "Installed"]];
const PV_SYS_MODULE = { Engine: "engine", Cooling: "engine", Exhaust: "engine", "Fuel & air": "fuel", Electrical: "electrical", Lights: "electrical", Brakes: "chassis", Chassis: "chassis", "Wheels & tires": "chassis", "Suspension & frame": "chassis", "Final drive": "chassis", Controls: "chassis", Body: "general", "Body & seat": "general" };

/* ---- schema: new fields go next to the old ones, nothing is removed ---- */
(function () {
  const fs = SCHEMA.parts.fields, at = k => fs.findIndex(f => f.k === k);
  const cond = fs.find(f => f.k === "condition");
  if (cond) { cond.opts = ["Uninspected", "New", "Good", "Serviceable", "Fair", "Worn", "Poor", "Damaged", "Corroded", "Unusable", "Missing"]; cond.lbl = Object.assign({}, cond.lbl, { Uninspected: "Unknown (not inspected)" }); }
  const st = fs.find(f => f.k === "status"); if (st) st.label = "Work status";
  fs.splice(at("status"), 0, F("inv", "Inventory status", "select", { opts: [""].concat(PV_INV), lbl: { "": "Not set" } }), F("stage", "Restoration stage", "select", { opts: [""].concat(PV_STAGE), lbl: { "": "Not set" } }));
  fs.splice(at("cleaning"), 0, F("needClean", "Needs cleaning", "bool"), F("needRepair", "Needs repair", "bool"), F("needReplace", "Needs replacement", "bool"), F("needInspect", "Needs inspection", "bool"));
  fs.splice(at("category"), 0, F("maker", "Manufacturer", "text"), F("fits", "Fits (make, model, years)", "text"));
  fs.splice(at("estCost") + 1, 0, F("supplier", "Supplier / source", "text"), F("paid", "Purchase cost", "money"), F("boughtOn", "Purchase date", "date"));
  fs.splice(at("workRequired"), 0, F("desc", "Description", "textarea", { full: 1 }));
})();
if (GUIDE.inventory) GUIDE.inventory.how = ["Scan a photo to have the AI spot parts, or go through the catalogue one card at a time: swipe right if you have it, left if it's missing.", "Tap Add details on any card (or any part in the list) for condition, storage spot, photos and what you paid.", "Anything not in the catalogue? Add it yourself. Missing parts go on the Shopping list when you're ready to buy."];

/* ---- helpers ---- */
const PV = { undo: [], busy: false, syncing: false, err: "", cat: null, catB: null, listN: 50, revN: 60, sheet: null };
const pvPos = () => lsGet("rv.pvpos." + BIKE.id, {}) || {};
const pvPosSet = o => lsSet("rv.pvpos." + BIKE.id, Object.assign(pvPos(), o));
const pvPnKey = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const pvNum = v => Number(v || 0).toLocaleString("en-US");
const pvBikeName = () => BIKE.name || [BIKE.year, BIKE.make, BIKE.model].filter(Boolean).join(" ");
function pvCat() {
  if (!HAS_CAT || typeof scanDiagrams !== "function") return [];
  const b = typeof DIAG_ONLY_B === "undefined" ? 1 : DIAG_ONLY_B;
  if (PV.cat && PV.catB === b) return PV.cat;
  const order = typeof DIAG_SYSTEMS !== "undefined" ? DIAG_SYSTEMS : [];
  const ds = scanDiagrams().slice().sort((a, c) => ((order.indexOf(a.system) + 99) % 99 - (order.indexOf(c.system) + 99) % 99) || String(a.fig || "").localeCompare(String(c.fig || ""), undefined, { numeric: true }) || String(a.title).localeCompare(c.title));
  const out = [];
  ds.forEach(d => scanParts(d.id).slice().sort((a, c) => String(a.ref).localeCompare(String(c.ref), undefined, { numeric: true })).forEach(p => out.push({ key: d.id + "|" + p.pid, did: d.id, pid: p.pid, ref: p.ref, name: p.name, pn: p.pn, cat: p.cat, count: p.count || 1, small: p.small, sys: d.system || "Other", area: d.title })));
  out.byKey = {}; out.byPn = {}; out.forEach(x => { out.byKey[x.key] = x; const k = pvPnKey(x.pn); if (k) (out.byPn[k] = out.byPn[k] || []).push(x); });
  PV.cat = out; PV.catB = b; return out;
}
function pvItem(key) {
  key = String(key || "");
  if (key.startsWith("gen|")) { const g = pvGen().byKey[key]; if (g) return g; const row = PV_GEN_LIST.find(x => "gen|" + x[0] === key); return row ? { key, gid: row[0], gen: true, did: "gen-" + row[2], pid: row[0], ref: "", name: row[1], pn: "", cat: "", count: row[4], what: row[5], art: row[3], sys: row[2], area: row[2] } : null; }
  const c = pvCat(); return c.byKey ? c.byKey[key] || null : null;
}
const pvHasOem = () => HAS_CAT && pvCat().length > 0;
function pvSrc() { const f = R.f.pvdeck = R.f.pvdeck || {}; if (!f.src) f.src = pvPos().src || (pvHasOem() ? "oem" : "main"); if (f.src === "oem" && !pvHasOem()) f.src = "main"; return f.src; }
const pvList = () => pvSrc() === "oem" ? pvCat() : pvGen();
function pvIndex() {
  const m = {};
  all("parts").forEach(r => { if (r.catKey && !r.archived) (m[r.catKey] = m[r.catKey] || []).push(r); });
  Object.values(m).forEach(l => l.sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || ""))));
  return m;
}
const pvDeck = () => S.meta.invdeck || { id: "invdeck", skip: {} };
function pvState(it, idx) {
  const rec = ((idx || pvIndex())[it.key] || [])[0], h = it.gen ? undefined : haveGet(it.did, it.pid).have, ri = rec && rec.inv;
  if (h === true) return ri === "Received" ? "Received" : "Owned";
  if (h === false) return ri === "Ordered" ? "Ordered" : "Missing";
  if (ri) return ri;
  if ((pvDeck().na || {})[it.key]) return "N/A";
  return (pvDeck().skip || {})[it.key] ? "Skipped" : "Unreviewed";
}
const pvHas = s => s === "Owned" || s === "Received";
const pvMiss = s => s === "Missing" || s === "Ordered";
function pvRecInv(r) {
  if (r.catKey) { const it = pvItem(r.catKey); if (it) { const s = pvState(it); return s === "Skipped" || s === "Unreviewed" || s === "N/A" ? (r.inv || "Unreviewed") : s; } }
  return r.inv || (r.status === "Missing" || r.condition === "Missing" ? "Missing" : "Owned");
}
function pvRecStage(r) {
  if (r.stage) return r.stage;
  if (pvMiss(pvRecInv(r)) || r.status === "Not applicable") return "";
  return { "In progress": "In restoration", "Awaiting parts": "In restoration", "Work complete": "Restored" }[r.status] || "Not inspected";
}
const pvCondLabel = c => ({ Uninspected: "Unknown", "": "Unknown" }[c || ""] ?? c);
const pvCondGroup = c => ({ Uninspected: "Uninspected", Missing: "Uninspected", Serviceable: "Good", Worn: "Fair", Corroded: "Poor", Unusable: "Damaged" }[c || "Uninspected"] || c);
const PV_INV_COLOR = { Owned: "blue", Received: "blue", Missing: "red", Ordered: "amber", Unreviewed: "gray", Skipped: "gray", "N/A": "gray" };
const PV_STAGE_COLOR = { "Not inspected": "gray", "Needs cleaning": "amber", "Needs repair": "red", "In restoration": "amber", Restored: "green", "Ready for installation": "green", Installed: "green" };
const pvInvLabel = s => ({ Unreviewed: "Not checked", Skipped: "Skipped", "N/A": "Not on this bike" }[s] || s);
const pvInvPill = s => pill(PV_INV_COLOR[s] || "gray", pvInvLabel(s));
const pvStagePill = s => s ? `<span class="pill ${PV_STAGE_COLOR[s] || "gray"} plain">${esc(s)}</span>` : "";
function pvSyncStatus(r) {
  if (pvMiss(r.inv)) { r.status = "Missing"; return r; }
  if (r.inv && r.status === "Missing") r.status = "Not started";
  if (r.inv && r.condition === "Missing") r.condition = "Uninspected";
  const map = { "Not inspected": "Not started", "Needs cleaning": "Not started", "Needs repair": "Not started", "In restoration": "In progress", Restored: "Work complete", "Ready for installation": "Work complete", Installed: "Work complete" };
  if (r.stage && map[r.stage]) r.status = map[r.stage];
  if (r.needClean) r.cleaning = "Required"; if (r.needRepair) r.disposition = "Repair"; if (r.needReplace) r.replacement = "Yes";
  return r;
}
function pvIdMaker() { // unique INV ids for several new records before any is saved
  const used = new Set(Object.keys(S.parts));
  return () => { let id = nextId("parts"); let m = +String(id).match(/(\d+)$/)[1]; const pre = id.replace(/\d+$/, ""), pad = String(id).match(/(\d+)$/)[1].length; while (used.has(id)) { m++; id = pre + String(m).padStart(pad, "0"); } used.add(id); return id; };
}
function pvNewRec(it, mk) {
  const r = blank("parts", { name: it.name, oemPn: it.pn || "", pnVerified: !!it.pn, category: it.sys, subsystem: it.gen ? "" : it.area, module: PV_SYS_MODULE[it.sys] || "general",
    qtyExpected: it.count, qtyFound: 0, catKey: it.key, catRef: it.ref, catName: it.cat || "", fits: pvBikeName(), inv: "", stage: "", desc: it.gen ? it.what || "" : "" });
  if (mk) r.id = mk();
  return r;
}
async function pvDeckSave(d) { S.meta.invdeck = d; try { await store.put("meta", d, { silent: true, noLog: true }); } catch (e) {} }
function pvHavePatch(it, want) { // patch for haveSave that turns the current entry into `want` exactly
  const cur = haveGet(it.did, it.pid), p = Object.assign({}, want);
  Object.keys(cur).forEach(k => { if (!(k in p)) p[k] = null; });
  return p;
}
const pvPhotos = id => sorted("docs").filter(d => d.partId === id && d.file && String(d.file).startsWith("data:image"));

/* ---- deciding on a catalogue part ---- */
async function pvDecide(it, v, opts = {}) {
  if (!ME.canWrite) { toast("You have view-only access, so marks can't be saved. Ask the owner for Contributor access.", "err"); return false; }
  const idx = pvIndex(), rec = (idx[it.key] || [])[0], prevH = it.gen ? {} : clone(haveGet(it.did, it.pid)), deck = clone(pvDeck()); deck.skip = deck.skip || {}; deck.na = deck.na || {};
  const u = { key: it.key, prevH, prevRec: rec ? clone(rec) : null, prevSkip: !!deck.skip[it.key], prevNa: !!deck.na[it.key], created: null, v };
  try {
    if (v === "Skipped" || v === null || v === "N/A") {
      delete deck.skip[it.key]; delete deck.na[it.key];
      if (v === "Skipped") deck.skip[it.key] = 1; if (v === "N/A") deck.na[it.key] = 1;
      if (!it.gen && (prevH.have === true || prevH.have === false)) await haveSave(it.did, { [it.pid]: { have: null, got: null } }, "cleared a parts mark");
      if (rec && rec.inv) { const r = clone(rec); r.inv = ""; if (r.status === "Missing") r.status = "Not started"; await store.put("parts", r, { silent: true, noLog: true }); }
      await pvDeckSave(deck);
    } else {
      const have = v === "Owned" || v === "Received";
      const r = rec ? clone(rec) : pvNewRec(it);
      r.inv = v === "Owned" && rec && rec.inv === "Received" ? "Received" : v;
      if (have) { if (!n(r.qtyFound)) r.qtyFound = n(r.qtyExpected) || it.count; if (!r.stage) r.stage = "Not inspected"; }
      else r.qtyFound = 0;
      r.qtyMissing = Math.max(0, (n(r.qtyExpected) || it.count) - n(r.qtyFound));
      pvSyncStatus(r);
      await store.put("parts", r, { silent: true, action: (have ? "has " : "is missing ") + it.name });
      if (!rec) u.created = r.id;
      if (!it.gen) await haveSave(it.did, { [it.pid]: { have, got: have && it.count > 1 ? n(r.qtyFound) : null } }, "checked off " + it.name);
      if (u.prevSkip || u.prevNa) { delete deck.skip[it.key]; delete deck.na[it.key]; await pvDeckSave(deck); }
    }
  } catch (e) { PV.err = "That mark couldn't be saved, so it was put back. Check your connection and try again."; return false; }
  PV.err = ""; if (!opts.noUndo) { PV.undo.push(u); if (PV.undo.length > 30) PV.undo.shift(); }
  return true;
}
async function pvUndo() {
  const u = PV.undo.pop(); if (!u) return;
  const it = pvItem(u.key); if (!it) return;
  try {
    if (!it.gen) await haveSave(it.did, { [it.pid]: pvHavePatch(it, u.prevH) }, "undid a parts mark");
    if (u.created) { const r = S.parts[u.created]; if (r && !pvPhotos(r.id).length) await store.del("parts", u.created, { noLog: true }); }
    else if (u.prevRec) await store.put("parts", u.prevRec, { silent: true, noLog: true });
    const deck = clone(pvDeck()); deck.skip = deck.skip || {}; deck.na = deck.na || {};
    if (u.prevSkip !== !!deck.skip[u.key] || u.prevNa !== !!deck.na[u.key]) { if (u.prevSkip) deck.skip[u.key] = 1; else delete deck.skip[u.key]; if (u.prevNa) deck.na[u.key] = 1; else delete deck.na[u.key]; await pvDeckSave(deck); }
    PV.forceKey = u.key; toast("Undone: " + it.name);
  } catch (e) { toast("Couldn't undo that. Try again.", "err"); }
  pvPaint();
}

/* ---- keep scanner and diagram marks in the parts list (adds records, never removes any) ---- */
async function pvSync() {
  if (PV.syncing || !ME.canWrite || !HAS_CAT || !store.ready) return;
  const idx = pvIndex(), mk = pvIdMaker(), writes = [];
  pvCat().forEach(it => {
    const h = haveGet(it.did, it.pid); if (h.have !== true && h.have !== false) return;
    const rec = (idx[it.key] || [])[0];
    if (!rec) { const r = pvNewRec(it, mk); r.inv = h.have ? "Owned" : "Missing"; r.qtyFound = h.have ? (h.got != null ? n(h.got) : it.count) : 0; r.qtyMissing = Math.max(0, it.count - r.qtyFound); if (h.have) r.stage = "Not inspected"; if (h.note) r.notes = h.note; pvSyncStatus(r); writes.push({ c: "parts", rec: r }); }
    else { const want = h.have ? (rec.inv === "Received" ? "Received" : "Owned") : (rec.inv === "Ordered" ? "Ordered" : "Missing"); if (rec.inv !== want) { const r = clone(rec); r.inv = want; if (h.have && !r.stage) r.stage = "Not inspected"; pvSyncStatus(r); writes.push({ c: "parts", rec: r }); } }
  });
  if (!writes.length) return;
  PV.syncing = true; try { await store.bulk(writes); } catch (e) {} PV.syncing = false;
}

/* ---- counts ---- */
function pvAreaItems(area) {
  const cat = pvList(); if (!area) return cat;
  if (area.startsWith("sys:")) { const s = area.slice(4); return cat.filter(x => x.sys === s); }
  if (area.startsWith("d:")) { const d = area.slice(2); return cat.filter(x => x.did === d); }
  return cat;
}
function pvCounts(items, idx) {
  idx = idx || pvIndex(); const c = { total: items.length, Owned: 0, Missing: 0, Skipped: 0, Unreviewed: 0, na: 0 };
  items.forEach(it => { const s = pvState(it, idx); if (pvHas(s)) c.Owned++; else if (pvMiss(s)) c.Missing++; else if (s === "Skipped") c.Skipped++; else if (s === "N/A") c.na++; else c.Unreviewed++; });
  c.total -= c.na;
  c.done = c.Owned + c.Missing; return c;
}
function pvAreaLabel(area) {
  if (!area) return "Whole bike";
  if (area.startsWith("sys:")) return area.slice(4);
  const d = typeof diagById === "function" && diagById(area.slice(2)); return d ? d.title : "This area";
}
function pvAreaOptions(sel) {
  const cat = pvList(), sys = [...new Set(cat.map(x => x.sys))], idx = pvIndex();
  if (pvSrc() === "main") { const lab = items => { const c = pvCounts(items, idx); return c.Unreviewed ? `${pvNum(c.Unreviewed)} left` : "done"; };
    return `<option value="">All main parts (${lab(cat)})</option>` + sys.map(s => `<option value="sys:${esc(s)}" ${sel === "sys:" + s ? "selected" : ""}>${esc(s)} (${lab(cat.filter(x => x.sys === s))})</option>`).join(""); }
  const lab = items => { const c = pvCounts(items, idx); return c.Unreviewed ? `${pvNum(c.Unreviewed)} left` : "done"; };
  return `<option value="">Whole bike (${lab(cat)})</option>` + sys.map(s => { const its = cat.filter(x => x.sys === s), ds = [...new Set(its.map(x => x.did))];
    return `<optgroup label="${esc(s)}"><option value="sys:${esc(s)}" ${sel === "sys:" + s ? "selected" : ""}>All ${esc(s.toLowerCase())} (${lab(its)})</option>${ds.map(d => { const di = its.filter(x => x.did === d); return `<option value="d:${esc(d)}" ${sel === "d:" + d ? "selected" : ""}>${esc(di[0].area)} (${lab(di)})</option>`; }).join("")}</optgroup>`; }).join("");
}

/* ---- the deck ---- */
function pvDeckF() { pvSrc(); const f = R.f.pvdeck; const p = pvPos(); if (f.area === undefined) f.area = p.area || ""; if (!f.show) f.show = p.show || "new"; return f; }
function pvQueue() {
  const f = pvDeckF(), idx = pvIndex(), items = pvAreaItems(f.area);
  if (f.show === "all") return { items: items.filter(it => pvState(it, idx) !== "N/A"), idx, all: true };
  return { items: items.filter(it => { const s = pvState(it, idx); return f.show === "skipped" ? s === "Skipped" : s === "Unreviewed"; }), idx };
}
function pvCurrent(q) {
  const f = pvDeckF();
  if (PV.forceKey) { const k = PV.forceKey; PV.forceKey = null; const it = pvItem(k); if (it) { const i = q.items.indexOf(it); if (i >= 0) { f.i = i; return it; } if (pvDeckF().show !== "all") return it; } }
  if (q.all) { const p = pvPos(); if (f.i == null) { const i = q.items.findIndex(x => x.key === p.key); f.i = i >= 0 ? i : 0; } f.i = Math.max(0, Math.min(q.items.length - 1, f.i)); return q.items[f.i] || null; }
  if (PV.holdKey) { const it = q.items.find(x => x.key === PV.holdKey); if (it) return it; }
  return q.items[0] || null;
}
function pvArt(it) {
  if (it.gen) return `<figure class="pv-art pv-silart">${pvSil(it.art, it.name)}<figcaption>A typical ${esc(it.name.toLowerCase())}. Yours may look different.</figcaption></figure>`;
  const d = diagById(it.did), q = d && (d.parts || []).find(x => String(x.ref) === String(it.ref) && typeof x.draw === "function");
  if (q) { try { return `<figure class="pv-art"><svg class="pv-artsvg" viewBox="-60 -60 120 120" role="img" aria-label="Drawing of the ${esc(it.name)}">${dkDefs()}<g class="pv-artg">${q.draw("exploded")}</g></svg><figcaption>Drawing from the ${esc(it.area)} diagram, ref ${esc(it.ref)}</figcaption></figure>`; } catch (e) {} }
  if (typeof D3_THUMBS !== "undefined" && D3_THUMBS[it.did]) return `<figure class="pv-art"><img src="${D3_THUMBS[it.did]}" alt="The ${esc(it.area)} assembly" loading="lazy"><figcaption>The whole ${esc(it.area)} assembly. This part is ref ${esc(it.ref)}.</figcaption></figure>`;
  return `<figure class="pv-art pv-noart">${ic("box")}<figcaption>No drawing for this part</figcaption></figure>`;
}
function pvFitArt(root) {
  $$(".pv-artsvg", root).forEach(svg => { const g = svg.querySelector(".pv-artg"); if (!g) return; try { const b = g.getBBox(); if (!b.width || !b.height) return; const pad = Math.max(b.width, b.height) * .12, w = b.width + pad * 2, h = b.height + pad * 2; svg.setAttribute("viewBox", `${b.x - pad} ${b.y - pad} ${w} ${h}`); } catch (e) {} });
}
function pvCardHtml(it, idx, cls) {
  const s = pvState(it, idx), rec = (idx[it.key] || [])[0], details = rec && (rec.location || rec.bin || rec.notes || (rec.condition && rec.condition !== "Uninspected") || pvPhotos(rec.id).length);
  return `<article class="pv-card ${cls || ""}" data-key="${esc(it.key)}" aria-label="${esc(it.name)}">
    <div class="pv-stamp pv-yes" aria-hidden="true">${ic("tick")} Have it</div><div class="pv-stamp pv-no" aria-hidden="true">✕ Missing</div>
    <div class="pv-ctop"><span class="pv-where">${it.gen ? "Main parts" : esc(it.sys)} <span aria-hidden="true">›</span> ${esc(it.area)}</span>${s !== "Unreviewed" ? pvInvPill(s) : ""}</div>
    ${pvArt(it)}
    <h2 class="pv-name">${esc(it.name)}</h2>
    ${it.gen ? `<div class="pv-pn"><span class="faint">General part, no OEM number. ${rec && rec.oemPn ? `Yours: <span class="mono">${esc(rec.oemPn)}</span>` : "Add yours in details if you know it."}</span></div>
    <dl class="pv-facts"><div><dt>Category</dt><dd>${esc(it.sys)}</dd></div><div><dt>Usually</dt><dd>${it.count}</dd></div><div><dt>Bike type</dt><dd>${esc(PV_STYLES[pvGen().profile.style])}</dd></div>${it.what ? `<div class="pv-wide pv-plain"><dt>Covers</dt><dd>${esc(it.what)}${it.cool ? ". Only if your bike is liquid-cooled." : ""}</dd></div>` : it.cool ? `<div class="pv-wide pv-plain"><dt>Note</dt><dd>Only if your bike is liquid-cooled.</dd></div>` : ""}</dl>`
    : `<div class="pv-pn">${it.pn ? `<span class="pv-pnl">OEM no.</span> <span class="mono">${esc(it.pn)}</span>` : `<span class="faint">No OEM number in the catalogue</span>`}</div>
    <dl class="pv-facts"><div><dt>Ref</dt><dd>${esc(it.ref)}</dd></div><div><dt>Bike uses</dt><dd>${it.count}</dd></div><div><dt>Category</dt><dd>${esc(it.sys)}</dd></div>${it.cat ? `<div class="pv-wide"><dt>Catalogue name</dt><dd>${esc(it.cat)}</dd></div>` : ""}</dl>`}
    <div class="pv-cfoot"><button class="btn sm" data-pvdet="${esc(it.key)}">${details ? "Edit details" : "Add details"}</button>${it.gen && cls === "pv-top" ? `<button class="linkbtn pv-na" data-pvgo="N/A" title="Leave it off the list for this bike (N)">Not on my bike</button>` : ""}${details ? `<span class="faint pv-dnote">${esc([pvCondLabel(rec.condition) !== "Unknown" ? pvCondLabel(rec.condition) : "", rec.location, n(rec.qtyFound) && it.count > 1 ? n(rec.qtyFound) + " of " + it.count : ""].filter(Boolean).join(" · ") || "Details saved")}</span>` : ""}</div>
  </article>`;
}
function pvSrcCtl() {
  const oem = pvHasOem(), src = pvSrc(), pr = pvGen().profile;
  return `<div class="pv-dctl pv-src">${oem ? `<div class="tabs" role="tablist" aria-label="Which parts list">${[["main", "Main parts", pvGen().length], ["oem", "Full catalogue", pvCat().length]].map(([k, l, nn]) => `<button role="tab" aria-selected="${src === k}" class="${src === k ? "on" : ""}" data-pvsrc="${k}">${l} <span class="faint">${pvNum(nn)}</span></button>`).join("")}</div>` : ""}
    ${src === "main" ? `<label class="pv-sel"><span>Bike type</span><select id="pvStyle" aria-label="Bike type" ${ME.canWrite ? "" : "disabled"}>${Object.entries(PV_STYLES).map(([k, l]) => `<option value="${k}" ${pr.style === k ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>` : ""}</div>`;
}
function pvDeckHtml() {
  const f = pvDeckF(), q = pvQueue(), it = pvCurrent(q), area = pvAreaItems(f.area), c = pvCounts(area, q.idx);
  const pc = v => c.total ? (v / c.total * 100).toFixed(2) + "%" : "0%";
  const last = PV.undo[PV.undo.length - 1], lastIt = last && pvItem(last.key);
  const head = `<div class="pv-dhead">
      <button class="btn sm" data-pvexit>${ic("back")} Parts</button>
      <div class="pv-dtitle"><b>${pvSrc() === "main" ? "Main parts" : "Go through parts"}</b><span class="faint">${esc(pvBikeName())}</span></div>
      <button class="btn sm" data-pvreview ${c.done + c.Skipped ? "" : "disabled"}>Review answers</button></div>
    ${pvSrcCtl()}<div class="pv-dctl"><label class="pv-sel"><span>Area</span><select id="pvArea" aria-label="Which part of the bike">${pvAreaOptions(f.area)}</select></label>
      <div class="seg pv-show" role="group" aria-label="Which parts to show">${[["new", "Not checked"], ["skipped", "Skipped" + (c.Skipped ? " (" + c.Skipped + ")" : "")], ["all", "All"]].map(([k, l]) => `<button class="${f.show === k ? "on" : ""}" data-pvshow="${k}" aria-pressed="${f.show === k}">${l}</button>`).join("")}</div></div>
    <div class="pv-prog" aria-label="Progress"><div class="pv-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${c.total}" aria-valuenow="${c.done}" aria-valuetext="${c.done} of ${c.total} checked"><i class="g" style="width:${pc(c.Owned)}"></i><i class="r" style="width:${pc(c.Missing)}"></i><i class="a" style="width:${pc(c.Skipped)}"></i></div>
      <div class="pv-counts"><span><b class="num">${pvNum(c.done)}</b> of ${pvNum(c.total)} checked</span><span><i class="g"></i>${pvNum(c.Owned)} have</span><span><i class="r"></i>${pvNum(c.Missing)} missing</span><span><i class="a"></i>${pvNum(c.Skipped)} skipped</span></div></div>`;
  const err = PV.err ? `<div class="banner bad" role="alert"><div class="grow">${esc(PV.err)}</div></div>` : "";
  const undo = `<div class="pv-undo" aria-live="polite">${lastIt ? `<span>${last.v === "Skipped" ? "Skipped" : last.v === "Owned" ? "Have it" : last.v === "Missing" ? "Missing" : last.v === "N/A" ? "Not on this bike" : "Cleared"}: <b>${esc(lastIt.name)}</b></span><button class="linkbtn" data-pvundo>Undo</button>${last.v === "Owned" ? `<button class="linkbtn" data-pvdet="${esc(last.key)}">Add details</button>` : ""}` : `<span class="faint pv-keys">Keys: <kbd>→</kbd> have it · <kbd>←</kbd> missing · <kbd>↓</kbd> skip · <kbd>U</kbd> undo</span>`}</div>`;
  if (!it) {
    const left = pvCounts(area, q.idx), need = sorted("parts").filter(r => r.catKey && pvAreaItems(f.area).some(x => x.key === r.catKey) && pvHas(pvRecInv(r)) && (r.needRepair || pvRecStage(r) === "Needs repair" || r.needInspect || pvRecStage(r) === "Not inspected")).length;
    const msg = f.show === "skipped" ? "No skipped parts here." : f.show === "all" ? "This area has no catalogue parts." : left.Unreviewed ? "" : "You've checked every part in " + (f.area ? "this area" : "the catalogue") + ".";
    return `<div class="pv-deck" id="pvDeck">${head}${err}<section class="pv-done panel"><div class="pv-ring" style="--p:${left.total ? Math.round(left.done / left.total * 100) : 0}"><b class="num">${left.total ? Math.round(left.done / left.total * 100) : 0}%</b><span>checked</span></div>
        <div class="stack" style="gap:8px"><h2 class="vtitle">${esc(pvAreaLabel(f.area))}: ${esc(msg || "All caught up")}</h2>
        <p class="muted" style="margin:0">${pvNum(left.Owned)} you have, ${pvNum(left.Missing)} missing, ${pvNum(left.Skipped)} skipped${left.Unreviewed ? `, ${pvNum(left.Unreviewed)} not checked` : ""}.</p>
        ${left.Missing || left.Skipped || need ? `<p style="margin:0"><b>Still needs attention:</b> ${[left.Missing ? `${pvNum(left.Missing)} missing to source` : "", left.Skipped ? `${pvNum(left.Skipped)} skipped to identify` : "", need ? `${pvNum(need)} owned parts to inspect or repair` : ""].filter(Boolean).join(", ")}.</p>` : ""}
        <div class="row" style="gap:8px;flex-wrap:wrap">${left.Skipped && f.show !== "skipped" ? `<button class="btn pri" data-pvshow="skipped">Go through skipped (${left.Skipped})</button>` : ""}${left.Unreviewed && f.show !== "new" ? `<button class="btn pri" data-pvshow="new">Go through the ${pvNum(left.Unreviewed)} not checked</button>` : ""}
          ${left.done + left.Skipped ? `<button class="btn" data-pvreview>Review answers</button>` : ""}${left.Missing ? `<button class="btn" data-pvlist="Missing">See what's missing</button>` : ""}<button class="btn" data-pvexit>Back to Parts</button></div></div></section>${undo}</div>`;
  }
  const nx = q.all ? q.items[(f.i || 0) + 1] : q.items[q.items.indexOf(it) + 1] || (q.items[0] !== it ? q.items[0] : null);
  const pos = q.all ? `Part ${pvNum((f.i || 0) + 1)} of ${pvNum(q.items.length)}` : `${pvNum(q.items.length)} to go${f.show === "skipped" ? " (skipped)" : ""}`;
  return `<div class="pv-deck" id="pvDeck">${head}${err}
    <div class="pv-stage">${q.all ? `<div class="pv-pos faint">${pos}</div>` : ""}
      <div class="pv-stack">${nx ? pvCardHtml(nx, q.idx, "pv-next") : ""}${pvCardHtml(it, q.idx, "pv-top")}</div>
      <div class="pv-acts" role="group" aria-label="Do you have this part?">
        <button class="pv-act pv-miss" data-pvgo="Missing" title="Missing (left arrow)"><span class="pv-ai">✕</span><span>Don't have it</span></button>
        <button class="pv-act pv-skip" data-pvgo="Skipped" title="Skip, decide later (down arrow)"><span class="pv-ai">${ic("next")}</span><span>Skip</span></button>
        <button class="pv-act pv-have" data-pvgo="Owned" title="Have it (right arrow)"><span class="pv-ai">${ic("tick")}</span><span>Have it</span></button></div>
      ${q.all ? `<div class="row pv-step"><button class="btn sm" data-pvstep="-1" ${f.i ? "" : "disabled"}>${ic("back")} Previous</button><button class="btn sm" data-pvstep="1" ${(f.i || 0) < q.items.length - 1 ? "" : "disabled"}>Next ${ic("next")}</button></div>` : ""}
    </div>${undo}</div>`;
}
function pvPaint() {
  const host = $("#pvDeck"); if (!host) return;
  const tab = R.tab.inventory;
  const tmp = document.createElement("div"); tmp.innerHTML = tab === "review" ? pvReviewHtml() : pvDeckHtml();
  host.replaceWith(tmp.firstElementChild); pvBindDeck($("#content"));
}
async function pvGo(v, dir) {
  if (PV.busy) return;
  const card = $("#pvDeck .pv-top"); if (!card) return;
  const it = pvItem(card.dataset.key); if (!it) return;
  PV.busy = true; PV.holdKey = null;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.classList.add("pv-out-" + (dir || (v === "Owned" ? "r" : v === "Missing" ? "l" : "d")));
  const wait = new Promise(r => setTimeout(r, reduce ? 0 : 190));
  const ok = pvDecide(it, v);
  await wait; const f = pvDeckF();
  if (await ok && pvDeckF().show === "all") f.i = (f.i || 0) + 1;
  const q = pvQueue(), nx = pvCurrent(q); pvPosSet({ area: f.area, show: f.show, key: nx ? nx.key : "" });
  PV.busy = false; pvPaint();
}
function pvBindSwipe(card) {
  let sx = 0, sy = 0, dx = 0, on = false, locked = null;
  const set = x => { card.style.transform = x ? `translateX(${x}px) rotate(${Math.max(-7, Math.min(7, x / 34))}deg)` : ""; card.style.setProperty("--pv-y", Math.max(0, Math.min(1, x / 110))); card.style.setProperty("--pv-n", Math.max(0, Math.min(1, -x / 110))); };
  card.addEventListener("pointerdown", e => { if (e.button > 0 || e.target.closest("button,a,input,select,textarea,label")) return; on = true; locked = null; sx = e.clientX; sy = e.clientY; dx = 0; });
  card.addEventListener("pointermove", e => {
    if (!on) return; const x = e.clientX - sx, y = e.clientY - sy;
    if (locked === null && (Math.abs(x) > 8 || Math.abs(y) > 8)) { locked = Math.abs(x) > Math.abs(y) ? "x" : "y"; if (locked === "x") { try { card.setPointerCapture(e.pointerId); } catch (er) {} card.classList.add("pv-drag"); } }
    if (locked !== "x") return; e.preventDefault(); dx = x; set(dx);
  });
  const end = () => { if (!on) return; on = false; card.classList.remove("pv-drag"); if (locked !== "x") return; const w = card.offsetWidth || 300;
    if (dx > w * .28) pvGo("Owned", "r"); else if (dx < -w * .28) pvGo("Missing", "l"); else set(0); };
  card.addEventListener("pointerup", end); card.addEventListener("pointercancel", () => { on = false; card.classList.remove("pv-drag"); set(0); });
}
function pvBindDeck(root) {
  const host = $("#pvDeck", root); if (!host) return;
  pvFitArt(host);
  const top = $(".pv-top", host); if (top) pvBindSwipe(top);
  $$("[data-pvgo]", host).forEach(b => b.onclick = () => pvGo(b.dataset.pvgo));
  $$("[data-pvexit]", host).forEach(b => b.onclick = () => { R.tab.inventory = ""; PV.holdKey = null; lsSet("rv.route", { sec: R.sec, tab: R.tab, view: R.view }); render(false); window.scrollTo(0, 0); });
  $$("[data-pvreview]", host).forEach(b => b.onclick = () => { R.tab.inventory = "review"; PV.revN = 60; render(false); window.scrollTo(0, 0); });
  $$("[data-pvundo]", host).forEach(b => b.onclick = pvUndo);
  $$("[data-pvdet]", host).forEach(b => b.onclick = () => { const it = pvItem(b.dataset.pvdet); if (it) { PV.holdKey = $(".pv-top", host) ? $(".pv-top", host).dataset.key : null; pvSheet({ it }); } });
  $$("[data-pvshow]", host).forEach(b => b.onclick = () => { const f = pvDeckF(); f.show = b.dataset.pvshow; f.i = null; PV.holdKey = null; pvPosSet({ show: f.show }); pvPaint(); });
  $$("[data-pvstep]", host).forEach(b => b.onclick = () => { const f = pvDeckF(); f.i = (f.i || 0) + +b.dataset.pvstep; const q = pvQueue(), it = pvCurrent(q); pvPosSet({ key: it ? it.key : "" }); pvPaint(); });
  $$("[data-pvlist]", host).forEach(b => b.onclick = () => { R.tab.inventory = ""; R.f.inventory = { own: b.dataset.pvlist }; R.partsFocus = "list"; render(false); });
  $$("[data-pvsrc]", host).forEach(b => b.onclick = () => { const f = pvDeckF(); f.src = b.dataset.pvsrc; f.area = ""; f.i = null; PV.holdKey = null; pvPosSet({ src: f.src, area: "", key: "" }); pvPaint(); });
  const sy = $("#pvStyle", host); if (sy) sy.onchange = async () => { const d = clone(pvDeck()); d.style = sy.value; d.skip = d.skip || {}; await pvDeckSave(d); PV_GEN_CACHE = null; const f = pvDeckF(); f.area = ""; f.i = null; pvPaint(); toast("Showing the main parts of a typical " + PV_STYLE_NOUN[sy.value]); };
  const ar = $("#pvArea", host); if (ar) ar.onchange = () => { const f = pvDeckF(); f.area = ar.value; f.i = null; PV.holdKey = null; pvPosSet({ area: f.area, key: "" }); pvPaint(); };
  // review list
  $$("[data-pvrv]", host).forEach(b => b.onclick = async () => { const [k, v] = b.dataset.pvrv.split("~"); const it = pvItem(k); if (!it) return; b.disabled = true; await pvDecide(it, v === "clear" ? null : v); pvPaint(); });
  $$("[data-pvrvtab]", host).forEach(b => b.onclick = () => { R.f.pvrev = b.dataset.pvrvtab; PV.revN = 60; pvPaint(); });
  const more = $("[data-pvrvmore]", host); if (more) more.onclick = () => { PV.revN += 60; pvPaint(); };
  const back = $("[data-pvdeckback]", host); if (back) back.onclick = () => { R.tab.inventory = "deck"; render(false); window.scrollTo(0, 0); };
}
document.addEventListener("keydown", e => {
  if (R.sec !== "inventory" || R.tab.inventory !== "deck" || !$("#pvDeck .pv-top")) return;
  if ($("#modalHost .modal") || $(".pv-sheetbg") || $(".shop-pop") || drawerState.c) return;
  if (e.target.closest && e.target.closest("input,select,textarea,[contenteditable]")) return;
  if (e.metaKey || e.ctrlKey || e.altKey) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") { e.preventDefault(); pvUndo(); } return; }
  const k = e.key;
  if (k === "ArrowRight") { e.preventDefault(); pvGo("Owned", "r"); }
  else if (k === "ArrowLeft") { e.preventDefault(); pvGo("Missing", "l"); }
  else if (k === "ArrowDown" || k === "s") { e.preventDefault(); pvGo("Skipped", "d"); }
  else if (k === "u" || k === "U") { e.preventDefault(); pvUndo(); }
  else if ((k === "n" || k === "N") && $("#pvDeck .pv-top .pv-na")) { e.preventDefault(); pvGo("N/A", "d"); }
  else if (k === "d" || k === "D") { const b = $("#pvDeck .pv-top [data-pvdet]"); if (b) { e.preventDefault(); b.click(); } }
});

/* ---- review answers ---- */
function pvReviewHtml() {
  const f = pvDeckF(), idx = pvIndex(), items = pvAreaItems(f.area), tab = R.f.pvrev || "Owned";
  const groups = { Owned: [], Missing: [], Skipped: [], "N/A": [] }; items.forEach(it => { const s = pvState(it, idx); if (pvHas(s)) groups.Owned.push([it, s]); else if (pvMiss(s)) groups.Missing.push([it, s]); else if (s === "Skipped") groups.Skipped.push([it, s]); else if (s === "N/A") groups["N/A"].push([it, s]); });
  const rows = groups[tab] || [];
  return `<div class="pv-deck pv-review" id="pvDeck"><div class="pv-dhead"><button class="btn sm" data-pvdeckback>${ic("back")} Back to the cards</button><div class="pv-dtitle"><b>Review answers</b><span class="faint">${esc(pvAreaLabel(f.area))}</span></div><button class="btn sm" data-pvexit>Parts</button></div>
    <div class="pv-dctl"><label class="pv-sel"><span>Area</span><select id="pvArea" aria-label="Which part of the bike">${pvAreaOptions(f.area)}</select></label>
      <div class="tabs" role="tablist">${[["Owned", "Have it"], ["Missing", "Missing"], ["Skipped", "Skipped"]].concat(groups["N/A"].length ? [["N/A", "Not on this bike"]] : []).map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? "on" : ""}" data-pvrvtab="${k}">${l} <span class="faint">${pvNum(groups[k].length)}</span></button>`).join("")}</div></div>
    ${rows.length ? `<div class="pv-rvlist">${rows.slice(0, PV.revN).map(([it, s]) => `<div class="pv-rvrow"><div class="grow pv-rvm"><b>${esc(it.name)}</b><span><span class="mono">${esc(it.pn || "")}</span> <span class="faint">${esc(it.area)}${it.ref ? " · ref " + esc(it.ref) : ""}</span></span></div>${pvInvPill(s)}
        <div class="seg pv-rvseg" role="group" aria-label="Change answer for ${esc(it.name)}"><button class="${pvHas(s) ? "on" : ""}" data-pvrv="${esc(it.key)}~Owned">Have</button><button class="${pvMiss(s) ? "on" : ""}" data-pvrv="${esc(it.key)}~Missing">Missing</button><button class="${s === "Skipped" ? "on" : ""}" data-pvrv="${esc(it.key)}~Skipped">Skip</button><button data-pvrv="${esc(it.key)}~clear" title="Clear the answer">Clear</button></div>
        <button class="btn sm" data-pvdet="${esc(it.key)}">Details</button></div>`).join("")}</div>${rows.length > PV.revN ? `<div class="row center"><button class="btn" data-pvrvmore>Show ${pvNum(Math.min(60, rows.length - PV.revN))} more</button></div>` : ""}`
      : `<div class="empty"><b>Nothing here yet</b>${tab === "Skipped" ? "Parts you skip show up here so you can come back to them." : "Parts you mark show up here."}</div>`}</div>`;
}

/* ---- details sheet (before or after deciding, or for any part in the list) ---- */
function pvSheet(t) {
  const it = t.it || null; let rec = t.rid ? S.parts[t.rid] : it ? (pvIndex()[it.key] || [])[0] : null;
  if (!it && !rec) return;
  const W = ME.canWrite, r = rec ? clone(rec) : pvNewRec(it), state = it ? pvState(it) : pvRecInv(r), cnt = it ? it.count : n(r.qtyExpected) || 1;
  const needs0 = { needClean: !!r.needClean, needRepair: r.needRepair ?? r.disposition === "Repair", needReplace: r.needReplace ?? r.replacement === "Yes", needInspect: !!r.needInspect };
  const stage0 = pvRecStage(r), locs = [...new Set(all("parts").map(x => x.location).filter(Boolean))].slice(0, 40);
  const photos = rec ? pvPhotos(rec.id) : [];
  const bg = document.createElement("div"); bg.className = "pv-sheetbg";
  bg.innerHTML = `<aside class="pv-sheet" role="dialog" aria-modal="true" aria-labelledby="pvShT">
    <header class="pv-shh"><div class="grow"><span class="eyebrow">${esc(it ? (it.gen ? "Main parts · " + it.sys : it.sys + " · " + it.area) : r.category || "Part")}</span><h3 id="pvShT">${esc(r.name)}</h3><span class="mono faint">${esc(r.oemPn || "")}</span></div><button class="linkbtn" data-shx aria-label="Close">✕</button></header>
    <div class="pv-shb">
      <div class="pv-shstate">${pvInvPill(state)}${it ? `<span class="faint">${it.gen ? "Usually " + cnt : "The bike uses " + cnt}</span>` : ""}${rec ? `<button class="linkbtn" data-shfull>Open full record</button>` : ""}</div>
      ${!W ? `<div class="banner warn"><div class="grow">You have view-only access, so you can look but not change anything.</div></div>` : ""}
      <fieldset class="pv-fs"><legend>Condition</legend><div class="seg pv-cond" role="radiogroup">${PV_COND.map(([v, l]) => `<button type="button" role="radio" aria-checked="${pvCondGroup(r.condition) === v}" class="${pvCondGroup(r.condition) === v ? "on" : ""}" data-shc="${v}">${l}</button>`).join("")}</div>${r.condition && !PV_COND.some(([v]) => v === r.condition) && r.condition !== "Missing" ? `<span class="hint-text">Currently recorded as ${esc(r.condition)}.</span>` : ""}</fieldset>
      <div class="form">
        <div class="fld"><label for="shQty">Quantity you have</label><div class="pv-qty"><button type="button" class="btn sm" data-shq="-1" aria-label="One fewer">−</button><input id="shQty" type="number" min="0" max="999" inputmode="numeric" value="${rec ? n(r.qtyFound) : pvHas(state) ? cnt : ""}" placeholder="${cnt}"><button type="button" class="btn sm" data-shq="1" aria-label="One more">+</button></div><span class="hint">${it ? (it.gen ? "Most bikes of this type have " + cnt : "The catalogue lists " + cnt) : "Expected: " + cnt}</span></div>
        <div class="fld"><label for="shStage">Restoration stage</label><select id="shStage">${PV_STAGE.map(s => `<option ${s === stage0 ? "selected" : ""}>${esc(s)}</option>`).join("")}</select></div>
        <fieldset class="pv-fs fld full"><legend>Needs</legend><div class="pv-checks">${PV_NEEDS.map(([k, l]) => `<label class="pv-ck"><input type="checkbox" data-shn="${k}" ${needs0[k] ? "checked" : ""}> ${l}</label>`).join("")}</div></fieldset>
        ${(it && it.gen) || (!it && !r.catKey) || (r.catKey && String(r.catKey).startsWith("gen|")) ? `<div class="fld full"><label for="shPn">Your part number</label><input id="shPn" class="mono" value="${esc(r.oemPn || "")}" placeholder="From the part, its box or your parts book"></div>` : ""}
        <div class="fld"><label for="shLoc">Storage location</label><input id="shLoc" list="shLocs" value="${esc(r.location || "")}" placeholder="e.g. Shelf B, engine box"><datalist id="shLocs">${locs.map(l => `<option value="${esc(l)}">`).join("")}</datalist></div>
        <div class="fld"><label for="shBin">Box or label</label><input id="shBin" value="${esc(r.bin || "")}" placeholder="e.g. Bag 14"></div>
        <div class="fld full"><label for="shNotes">Notes</label><textarea id="shNotes" rows="3" placeholder="e.g. cracked ear, threads need chasing">${esc(r.notes || "")}</textarea></div>
        <div class="fld full"><label>Photos of your part</label><div class="pv-ph">${photos.map(d => `<img src="${d.file}" alt="${esc(d.title || "Part photo")}">`).join("")}${W ? `<label class="pv-phadd">${ic("camera")}<span>Add photo</span><input type="file" accept="image/*" multiple data-shph hidden></label>` : ""}</div><span class="hint" data-shphmsg></span></div>
        <details class="fld full pv-more"${r.paid || r.boughtOn || r.supplier ? " open" : ""}><summary>Purchase info</summary><div class="form" style="margin-top:8px">
          <div class="fld"><label for="shPaid">What you paid</label><input id="shPaid" type="number" min="0" step="0.01" inputmode="decimal" value="${n(r.paid) || ""}" placeholder="$0.00"></div>
          <div class="fld"><label for="shDate">Purchase date</label><input id="shDate" type="date" value="${esc(r.boughtOn || "")}"></div>
          <div class="fld"><label for="shSup">Supplier or source</label><input id="shSup" value="${esc(r.supplier || "")}" placeholder="e.g. CMSNL, eBay seller, swap meet"></div>
          <div class="fld"><label for="shEst">Replacement cost (estimate)</label><input id="shEst" type="number" min="0" step="0.01" inputmode="decimal" value="${n(r.estCost) || ""}" placeholder="$0.00"></div></div></details>
      </div>
    </div>
    <footer class="pv-shf"><span class="pv-shmsg" role="status"></span>${pvMiss(state) && (r.oemPn || r.name) ? `<button class="btn sm" data-cartfind="${esc(r.oemPn || r.name)}">${ic("cart")} Shop for it</button>` : ""}<button class="btn" data-shx>Cancel</button>${W ? `<button class="btn pri" data-shsave>Save details</button>` : ""}</footer></aside>`;
  document.body.appendChild(bg); PV.sheet = bg;
  const sh = bg.querySelector(".pv-sheet"), msg = bg.querySelector(".pv-shmsg");
  let cond = r.condition || "Uninspected", dirty = false, stageTouched = false;
  const close = () => { if (dirty && W && !confirm("Close without saving these details?")) return; bg.remove(); PV.sheet = null; document.removeEventListener("keydown", onKey); if (R.sec === "inventory" && R.tab.inventory) pvPaint(); };
  const onKey = e => { if (e.key === "Escape") { e.preventDefault(); close(); } };
  document.addEventListener("keydown", onKey);
  bg.addEventListener("mousedown", e => { if (e.target === bg) close(); });
  bg.addEventListener("input", () => { dirty = true; }); bg.addEventListener("change", e => { dirty = true; if (e.target.id === "shStage") stageTouched = true; });
  $$("[data-shx]", bg).forEach(b => b.onclick = close);
  const full = bg.querySelector("[data-shfull]"); if (full) full.onclick = () => { if (dirty && !confirm("Leave without saving these details?")) return; dirty = false; close(); openRecord("parts", rec.id); };
  $$("[data-shc]", bg).forEach(b => b.onclick = () => { cond = b.dataset.shc; dirty = true; $$("[data-shc]", bg).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); }); });
  $$("[data-shq]", bg).forEach(b => b.onclick = () => { const q = $("#shQty", bg); q.value = Math.max(0, n(q.value || (q.placeholder || 0)) + +b.dataset.shq); dirty = true; });
  const collect = base => {
    const x = clone(base); x.condition = cond; const qv = $("#shQty", bg).value;
    if (qv !== "") { x.qtyFound = Math.max(0, n(qv)); x.qtyMissing = Math.max(0, (n(x.qtyExpected) || cnt) - x.qtyFound); }
    if (stageTouched || base.stage) x.stage = $("#shStage", bg).value;
    $$("[data-shn]", bg).forEach(c => x[c.dataset.shn] = c.checked);
    if ($("#shPn", bg)) x.oemPn = $("#shPn", bg).value.trim();
    x.location = $("#shLoc", bg).value.trim(); x.bin = $("#shBin", bg).value.trim(); x.notes = $("#shNotes", bg).value;
    x.paid = n($("#shPaid", bg).value); x.boughtOn = $("#shDate", bg).value; x.supplier = $("#shSup", bg).value.trim(); x.estCost = n($("#shEst", bg).value);
    return pvSyncStatus(x);
  };
  const ensure = async () => { // the record has to exist before photos can hang off it
    if (rec && S.parts[rec.id]) return rec;
    const x = collect(r); await store.put("parts", x, { silent: true, action: "added details for " + x.name }); rec = S.parts[x.id]; Object.assign(r, { id: x.id }); return rec;
  };
  const ph = bg.querySelector("[data-shph]");
  if (ph) ph.onchange = async () => {
    const files = Array.from(ph.files || []); if (!files.length) return; const pm = bg.querySelector("[data-shphmsg]"); pm.textContent = "Saving photo…";
    let ok = 0; try { await ensure(); } catch (e) { pm.textContent = "Couldn't save the part, so the photo wasn't added. Try again."; return; }
    for (const f of files) { try { const data = await compressImage(f); const d = blank("docs", { title: r.name + " photo", fileName: f.name, file: data, kind: "Part ID photo", partId: rec.id }); await store.put("docs", d, { silent: true, action: "added a photo of " + r.name }); ok++;
      bg.querySelector(".pv-ph").insertAdjacentHTML("afterbegin", `<img src="${data}" alt="${esc(r.name)} photo">`); } catch (e) { pm.textContent = "Couldn't add " + f.name + ". Try a JPG or PNG."; } }
    if (ok) pm.textContent = ok + " photo" + (ok > 1 ? "s" : "") + " saved"; ph.value = "";
  };
  const save = bg.querySelector("[data-shsave]");
  if (save) save.onclick = async () => {
    save.disabled = true; msg.textContent = "Saving…";
    try {
      const base = rec && S.parts[rec.id] ? S.parts[rec.id] : r, x = collect(base);
      await store.put("parts", x, { silent: true, action: "updated details for " + x.name });
      if (it && !it.gen && pvHas(pvState(it)) && it.count > 1) await haveSave(it.did, { [it.pid]: { got: n(x.qtyFound) } }, "updated a count");
      dirty = false; bg.remove(); PV.sheet = null; document.removeEventListener("keydown", onKey); toast("Details saved for " + x.name);
      if (R.sec === "inventory") { if (R.tab.inventory) pvPaint(); else render(false); }
    } catch (e) { save.disabled = false; msg.textContent = "Couldn't save. Check your connection and try again."; }
  };
  setTimeout(() => (sh.querySelector(".pv-cond button.on") || sh.querySelector("[data-shc]"))?.focus(), 30);
}

/* ---- add a part by hand ---- */
function pvAdd(init) {
  if (!ME.canWrite) { toast("You have view-only access. Ask the owner for Contributor access to add parts.", "err"); return; }
  const cats = [...new Set((typeof DIAG_SYSTEMS !== "undefined" ? DIAG_SYSTEMS : []).concat(all("parts").map(p => p.category)).filter(Boolean))];
  const areas = [...new Set(pvCat().map(x => x.area).concat(all("parts").map(p => p.subsystem)).filter(Boolean))].sort();
  const i0 = init || {};
  modal(`<div class="pv-add stack"><div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0">${ic("plus")} Add a part</h3><button class="linkbtn" data-x aria-label="Close">✕</button></div>
    <p class="hint-text" style="margin:0">For anything not in the catalogue: hardware, fabricated or modified pieces, aftermarket parts. Only the name is required.</p>
    <form class="form" id="pvAddF" novalidate>
      <div class="fld full" data-fld="name"><label for="pvaName">Part name *</label><input id="pvaName" required maxlength="140" value="${esc(i0.name || "")}" placeholder="e.g. Rear brake torque arm" autocomplete="off"><span class="err" hidden>Give the part a name.</span></div>
      <div class="fld"><label for="pvaPn">OEM part number</label><input id="pvaPn" class="mono" value="${esc(i0.oemPn || "")}" placeholder="Leave blank if it doesn't have one" autocomplete="off"></div>
      <div class="fld"><label for="pvaMaker">Manufacturer</label><input id="pvaMaker" placeholder="e.g. Suzuki, All Balls, homemade"></div>
      <div class="fld full" id="pvaDup" hidden></div>
      <div class="fld"><label for="pvaCat">Category</label><input id="pvaCat" list="pvaCats" placeholder="e.g. Brakes"><datalist id="pvaCats">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist></div>
      <div class="fld"><label for="pvaArea">Assembly</label><input id="pvaArea" list="pvaAreas" placeholder="e.g. Rear brake"><datalist id="pvaAreas">${areas.map(c => `<option value="${esc(c)}">`).join("")}</datalist></div>
      <div class="fld"><label for="pvaInv">Inventory status</label><select id="pvaInv">${PV_INV.map(s => `<option ${s === "Owned" ? "selected" : ""}>${s}</option>`).join("")}</select></div>
      <div class="fld"><label for="pvaQty">Quantity</label><input id="pvaQty" type="number" min="1" max="999" value="1" inputmode="numeric"></div>
      <div class="fld"><label for="pvaCond">Condition</label><select id="pvaCond">${PV_COND.map(([v, l]) => `<option value="${v}" ${v === "Uninspected" ? "selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="fld"><label for="pvaFits">Fits</label><input id="pvaFits" placeholder="${esc(pvBikeName())}"></div>
      <details class="fld full pv-more"><summary>More details</summary><div class="form" style="margin-top:8px">
        <div class="fld full"><label for="pvaDesc">Description</label><textarea id="pvaDesc" rows="2" placeholder="What it is, what it does"></textarea></div>
        <div class="fld full"><label for="pvaNotes">Notes</label><textarea id="pvaNotes" rows="2"></textarea></div>
        <div class="fld"><label for="pvaLoc">Storage location</label><input id="pvaLoc" placeholder="e.g. Shelf B2"></div>
        <div class="fld"><label for="pvaSup">Supplier or source</label><input id="pvaSup"></div>
        <div class="fld"><label for="pvaPaid">What you paid</label><input id="pvaPaid" type="number" min="0" step="0.01" inputmode="decimal" placeholder="$0.00"></div>
        <div class="fld"><label for="pvaDate">Purchase date</label><input id="pvaDate" type="date"></div>
        <div class="fld"><label for="pvaEst">Replacement cost (estimate)</label><input id="pvaEst" type="number" min="0" step="0.01" inputmode="decimal" placeholder="$0.00"></div>
        <div class="fld"><label for="pvaPh">Photos</label><input id="pvaPh" type="file" accept="image/*" multiple></div></div></details>
    </form>
    <div class="row" style="justify-content:space-between;align-items:center"><button class="linkbtn" data-new="parts">Use the full form instead</button><span class="row" style="gap:8px"><button class="btn" data-x>Cancel</button><button class="btn pri" id="pvaSave">Add part</button></span></div></div>`, m => {
    m.classList.add("pv-addm");
    $$("[data-x]", m).forEach(b => b.onclick = closeModal);
    $("[data-new]", m).onclick = () => { const nm = $("#pvaName", m).value.trim(); closeModal(); openRecord("parts", null, nm ? { name: nm } : {}); };
    let dupOk = false;
    const dup = () => {
      const k = pvPnKey($("#pvaPn", m).value), box = $("#pvaDup", m); dupOk = false;
      if (k.length < 4) { box.hidden = true; return; }
      const recs = all("parts").filter(p => !p.archived && pvPnKey(p.oemPn) === k), cat = ((pvCat().byPn || {})[k] || []).filter(x => !recs.some(p => p.catKey === x.key));
      if (!recs.length && !cat.length) { box.hidden = true; return; }
      box.hidden = false;
      box.innerHTML = `<div class="banner warn"><div class="grow"><b>This part number is already here.</b> ${recs.length ? `You have it as ${recs.slice(0, 2).map(p => `<b>${esc(p.name)}</b> (${esc(p.id)})`).join(", ")}.` : ""} ${cat.length ? `It's in the catalogue as <b>${esc(cat[0].name)}</b> (${esc(cat[0].area)}).` : ""}
        <div class="row" style="gap:6px;margin-top:8px;justify-content:flex-start">${recs.length ? `<button type="button" class="btn sm" data-dupopen="${esc(recs[0].id)}">Open the existing part</button>` : `<button type="button" class="btn sm" data-dupcat="${esc(cat[0].key)}">Open it from the catalogue</button>`}<button type="button" class="btn sm" data-dupok>Add a separate one anyway</button></div></div></div>`;
      const o = box.querySelector("[data-dupopen]"); if (o) o.onclick = () => { closeModal(); pvSheet({ rid: o.dataset.dupopen }); };
      const c = box.querySelector("[data-dupcat]"); if (c) c.onclick = () => { closeModal(); pvSheet({ it: pvItem(c.dataset.dupcat) }); };
      box.querySelector("[data-dupok]").onclick = () => { dupOk = true; box.innerHTML = `<span class="hint">Adding it as a separate part.</span>`; };
    };
    $("#pvaPn", m).addEventListener("input", debounce(dup, 250)); if (i0.oemPn) dup();
    $("#pvaSave", m).onclick = async () => {
      const name = $("#pvaName", m).value.trim(), nf = m.querySelector('[data-fld="name"]');
      nf.classList.toggle("bad", !name); nf.querySelector(".err").hidden = !!name; if (!name) { $("#pvaName", m).focus(); return; }
      if (!$("#pvaDup", m).hidden && !dupOk) { $("#pvaDup", m).scrollIntoView({ block: "center" }); toast("That part number is already here. Open it, or choose Add a separate one anyway.", "err"); return; }
      const inv = $("#pvaInv", m).value, qty = Math.max(1, n($("#pvaQty", m).value) || 1), has = pvHas(inv);
      const r = pvSyncStatus(blank("parts", { name, oemPn: $("#pvaPn", m).value.trim(), pnVerified: false, maker: $("#pvaMaker", m).value.trim(), category: $("#pvaCat", m).value.trim() || "Miscellaneous", subsystem: $("#pvaArea", m).value.trim(),
        inv, qtyExpected: qty, qtyFound: has ? qty : 0, qtyMissing: has ? 0 : qty, condition: $("#pvaCond", m).value, stage: has ? "Not inspected" : "", fits: $("#pvaFits", m).value.trim(),
        desc: $("#pvaDesc", m).value, notes: $("#pvaNotes", m).value, location: $("#pvaLoc", m).value.trim(), supplier: $("#pvaSup", m).value.trim(), paid: n($("#pvaPaid", m).value), boughtOn: $("#pvaDate", m).value, estCost: n($("#pvaEst", m).value), custom: true }));
      const btn = $("#pvaSave", m); btn.disabled = true; btn.textContent = "Adding…";
      try { await store.put("parts", r, { silent: true, action: "added " + name }); }
      catch (e) { btn.disabled = false; btn.textContent = "Add part"; return; }
      const files = Array.from($("#pvaPh", m).files || []);
      for (const f of files) { try { const data = await compressImage(f); await store.put("docs", blank("docs", { title: name + " photo", fileName: f.name, file: data, kind: "Part ID photo", partId: r.id }), { silent: true }); } catch (e) { toast("Couldn't add the photo " + f.name + ".", "err"); } }
      closeModal(); R.f.inventory = {}; render(false); toast("Added " + name, null, { label: "Details", fn: () => pvSheet({ rid: r.id }) });
    };
  });
}

/* ---- Parts home: three ways in, a short summary, the list ---- */
function pvOptsHtml() {
  const src = pvSrc(), cat = pvList(), c = cat.length ? pvCounts(cat) : null, started = c && (c.done + c.Skipped + c.na);
  const off = msg => `<span class="pv-off">${esc(msg)}</span>`, st = PV_STYLE_NOUN[pvGen().profile.style];
  const what = src === "oem" ? `Every part in the ${esc(BIKE.short || "bike")} catalogue, one card at a time. Swipe right if you have it, left if it's missing. Or just the main parts.`
    : `The main parts a typical ${esc(st)} has, one card at a time: engine, carbs, lights, wiring, tires and more. No bolts or washers.`;
  return `<section class="pv-opts" aria-label="Ways to add parts">
    <div class="pv-opt"><span class="pv-oic">${ic("camera")}</span><div class="pv-ot"><h2>Scan parts</h2><p>Lay out a tray of parts and take a photo. The AI spots them, then you confirm each one.</p></div>
      ${HAS_CAT && pvSrc() === "oem" ? scanPickBtn("Scan a photo", "btn") : `<button type="button" class="btn" data-pvscan>${ic("camera")} Scan a photo</button>`}</div>
    <div class="pv-opt pv-main"><span class="pv-oic">${ic("check")}</span><div class="pv-ot"><h2>Go through parts</h2><p>${what}</p>
      ${c && started ? `<div class="pv-mini"><div class="pv-bar"><i class="g" style="width:${c.Owned / c.total * 100}%"></i><i class="r" style="width:${c.Missing / c.total * 100}%"></i><i class="a" style="width:${c.Skipped / c.total * 100}%"></i></div><span>${pvNum(c.done)} of ${pvNum(c.total)} checked</span></div>`
        : c ? `<div class="pv-mini"><span>${src === "oem" ? `${pvNum(c.total)} parts in ${pvNum(new Set(cat.map(x => x.did)).size)} assemblies` : `${pvNum(c.total)} main parts`}. Stop any time, it saves as you go.</span></div>` : ""}</div>
      ${c ? `<button class="btn pri" data-pvstart>${started ? (c.Unreviewed ? "Continue" : "Review") : "Start"}</button>` : off("No parts list for this bike yet")}</div>
    <div class="pv-opt"><span class="pv-oic">${ic("plus")}</span><div class="pv-ot"><h2>Add a part</h2><p>Hardware, fabricated or aftermarket pieces, or anything the list doesn't have.</p></div>
      ${ME.canWrite ? `<button class="btn" data-pvadd>Add a part</button>` : off("View-only access")}</div>
  </section>`;
}
function pvSummaryHtml() {
  const cat = pvList(), idx = pvIndex(), recs = sorted("parts"), c = cat.length ? pvCounts(cat, idx) : null, srcName = pvSrc() === "oem" ? "Catalogue" : "Main parts";
  const own = recs.filter(r => pvHas(pvRecInv(r))), miss = recs.filter(r => pvMiss(pvRecInv(r)));
  if (!recs.length && !(c && c.done + c.Skipped)) return `<section id="partsCheck" hidden></section>`;
  const ownX = own.filter(r => !r.catKey).length;
  const insp = own.filter(r => r.needInspect || pvRecStage(r) === "Not inspected").length, rep = own.filter(r => r.needRepair || pvRecStage(r) === "Needs repair").length;
  const ready = own.filter(r => pvRecStage(r) === "Ready for installation").length, inst = own.filter(r => pvRecStage(r) === "Installed").length;
  const priced = miss.filter(r => n(r.estCost) > 0), cost = priced.reduce((s, r) => s + n(r.estCost) * Math.max(1, n(r.qtyMissing) || 1), 0);
  const tile = (l, v, sub, f, cls) => `<button class="kpi pv-k ${cls || ""}" data-pvf="${esc(JSON.stringify(f))}"><span class="l">${esc(l)}</span><span class="v">${v}</span>${sub ? `<span class="s">${sub}</span>` : ""}</button>`;
  return `<section class="pv-sum stack" id="partsCheck" aria-label="Inventory summary">
    ${c ? `<div class="pv-cov"><div class="pv-covt"><b>${srcName} checked</b><span class="faint">${pvNum(c.done)} of ${pvNum(c.total)} parts checked${c.Skipped ? ` · ${pvNum(c.Skipped)} skipped` : ""}</span></div><div class="pv-bar"><i class="g" style="width:${c.Owned / c.total * 100}%"></i><i class="r" style="width:${c.Missing / c.total * 100}%"></i><i class="a" style="width:${c.Skipped / c.total * 100}%"></i></div></div>` : ""}
    <div class="pv-kpis">
      ${c ? tile(pvSrc() === "oem" ? "Catalogue parts" : "Main parts", pvNum(c.total), `${pvNum(c.Unreviewed + c.Skipped)} not checked yet`, { pvdeck: 1 }) : ""}
      ${tile("Owned", pvNum(own.length), ownX ? `incl. ${pvNum(ownX)} added by hand` : "in your inventory", { own: "Owned" })}
      ${tile("Missing", pvNum(miss.length), "to buy or find", { own: "Missing" }, miss.length ? "red" : "")}
      ${tile("Needs inspection", pvNum(insp), "owned, not inspected", { stage: "Not inspected" }, insp ? "amber" : "")}
      ${tile("Needs repair", pvNum(rep), "owned", { need: "needRepair" }, rep ? "red" : "")}
      ${tile("Ready to install", pvNum(ready), inst ? pvNum(inst) + " installed" : "restored and ready", { stage: "Ready for installation" }, ready ? "green" : "")}
      ${miss.length ? tile("Missing parts cost", priced.length ? money(cost) : "Not priced", priced.length ? `${priced.length} of ${miss.length} priced` : "add replacement costs", { own: "Missing" }) : ""}
    </div></section>`;
}
function pvFiltered() {
  const f = fstate("inventory"), q = (f.q || "").toLowerCase().trim(), qk = pvPnKey(q);
  let rows = sorted("parts").concat(f.arch ? all("parts").filter(p => p.archived) : []).filter(p => {
    if (q && ![p.id, p.name, p.oemPn, p.location, p.bin, p.subsystem, p.category, p.maker, p.notes].join(" ").toLowerCase().includes(q) && !(qk.length > 3 && pvPnKey(p.oemPn).includes(qk))) return false;
    if (f.own) { const s = pvRecInv(p); if (f.own === "Owned" ? !pvHas(s) : f.own === "Missing" ? !pvMiss(s) : s !== f.own) return false; }
    if (f.cond && pvCondGroup(p.condition) !== f.cond) return false;
    if (f.cat && p.category !== f.cat) return false;
    if (f.stage && pvRecStage(p) !== f.stage) return false;
    if (f.need && !(p[f.need] || (f.need === "needRepair" && pvRecStage(p) === "Needs repair"))) return false;
    if (f.stage === "Not inspected" && !pvHas(pvRecInv(p))) return false;
    if (f.module && p.module !== f.module) return false; if (f.subsystem && p.subsystem !== f.subsystem) return false;
    if (f.status && p.status !== f.status) return false; if (f.condition && p.condition !== f.condition) return false;
    if (f.assignee && p.assignee !== f.assignee) return false; if (f.color && partColor(p) !== f.color) return false;
    if (f.flag === "inwork" && !(partColor(p) === "amber" && p.status !== "Work complete")) return false;
    if (f.flag === "awaiting" && !(partColor(p) === "amber" && p.status === "Work complete")) return false;
    if (f.flag === "missdam" && !(n(p.qtyMissing) > 0 || n(p.qtyDamaged) > 0 || p.status === "Missing" || ["Damaged", "Unusable", "Missing"].includes(p.condition))) return false;
    return true;
  });
  const sort = f.sort || "updated", CR = { New: 0, Good: 1, Fair: 2, Poor: 3, Damaged: 4, Uninspected: 5 };
  const by = { name: (a, b) => String(a.name).localeCompare(b.name), pn: (a, b) => (a.oemPn ? 0 : 1) - (b.oemPn ? 0 : 1) || String(a.oemPn).localeCompare(String(b.oemPn), undefined, { numeric: true }),
    cond: (a, b) => (CR[pvCondGroup(a.condition)] ?? 9) - (CR[pvCondGroup(b.condition)] ?? 9) || String(a.name).localeCompare(b.name), updated: (a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")) };
  return rows.sort(by[sort] || by.updated);
}
filteredParts = pvFiltered; // CSV export, select-all and the printable list use the same filters
function pvRowHtml(p) {
  const s = pvRecInv(p), st = pvRecStage(p), ph = pvPhotos(p.id)[0], W = ME.canWrite;
  const needs = PV_NEEDS.filter(([k]) => p[k]).map(([, l]) => l.toLowerCase());
  return `<div class="pv-row" data-pvrec="${esc(p.id)}" tabindex="0" role="button" aria-label="${esc(p.name)}, ${esc(pvInvLabel(s))}">
    <span class="pv-th">${ph ? `<img src="${ph.file}" alt="" loading="lazy">` : partImg(p)}</span>
    <div class="pv-rm"><b>${esc(p.name)}</b><span>${p.oemPn ? `<span class="mono">${esc(p.oemPn)}</span>` : `<span class="faint">No part number</span>`}${p.subsystem ? ` <span class="faint">· ${esc(p.subsystem)}</span>` : ""}</span>
      <span class="pv-rtags">${pvInvPill(s)}${st ? pvStagePill(st) : ""}<span class="tag">${esc(pvCondLabel(p.condition))}</span>${needs.length ? `<span class="faint">Needs ${esc(needs.join(", "))}</span>` : ""}${p.location || p.bin ? `<span class="faint">${ic("box")} ${esc([p.location, p.bin].filter(Boolean).join(" · "))}</span>` : ""}</span></div>
    <div class="pv-ra">${W ? `<select data-pvmark="${esc(p.id)}" aria-label="Mark ${esc(p.name)} as"><option value="">Mark as…</option>${PV_MARKS.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join("")}${pvHas(s) ? `<option value="Missing">Missing</option>` : `<option value="Owned">Have it</option>`}</select>` : ""}
      ${pvMiss(s) ? `<button class="btn sm" data-cartfind="${esc(p.oemPn || p.name)}" title="Search stores for this part">${ic("cart")} Shop</button>` : ""}<button class="btn sm" data-pvedit="${esc(p.id)}">Edit</button></div></div>`;
}
async function pvMark(id, v) {
  const p = S.parts[id]; if (!p) return; const r = clone(p), it = r.catKey && pvItem(r.catKey);
  const was = pvRecInv(r); let label = v;
  if (v === "Ordered") { r.inv = "Ordered"; if (!r.boughtOn) r.boughtOn = today(); label = "purchased"; }
  else if (v === "Received") { r.inv = "Received"; r.qtyFound = Math.max(n(r.qtyFound), n(r.qtyExpected) || 1); r.qtyMissing = 0; if (!r.stage) r.stage = "Not inspected"; }
  else if (v === "Owned") { r.inv = "Owned"; if (!n(r.qtyFound)) r.qtyFound = n(r.qtyExpected) || 1; r.qtyMissing = 0; if (!r.stage) r.stage = "Not inspected"; }
  else if (v === "Missing") { r.inv = "Missing"; r.qtyFound = 0; r.qtyMissing = n(r.qtyExpected) || 1; }
  else if (v === "Repaired") { r.needRepair = false; if (r.disposition === "Repair") r.disposition = "Reuse"; r.stage = "Restored"; label = "repaired"; }
  else { r.stage = v; if (!r.inv) r.inv = pvMiss(was) ? "Received" : was === "Unreviewed" ? "Owned" : was; }
  if (["Repaired", "Restored", "Ready for installation", "Installed"].includes(v) && pvMiss(was)) { r.inv = "Received"; r.qtyFound = Math.max(n(r.qtyFound), n(r.qtyExpected) || 1); r.qtyMissing = 0; }
  pvSyncStatus(r);
  try {
    const prev = await store.put("parts", r, { silent: true, action: "marked " + r.name + " as " + label.toLowerCase() });
    if (it && !it.gen) { const have = pvHas(r.inv); if (have !== (haveGet(it.did, it.pid).have === true) || haveGet(it.did, it.pid).have === undefined) await haveSave(it.did, { [it.pid]: { have } }, "updated " + r.name); }
    toast(r.name + ": " + (PV_MARKS.find(x => x[0] === v) || [, v])[1].toLowerCase(), null, { label: "Undo", fn: async () => { if (prev) { await store.put("parts", prev, { silent: true, action: "reverted" }); if (it && !it.gen) await haveSave(it.did, { [it.pid]: { have: pvHas(pvRecInv(prev)) ? true : pvMiss(pvRecInv(prev)) ? false : null } }); render(false); } } });
  } catch (e) {}
  render(false);
}
function pvListHtml() {
  const f = fstate("inventory"), view = R.view.inventory || "list", total = sorted("parts").length, rows = pvFiltered();
  const cats = [...new Set(all("parts").map(p => p.category).filter(Boolean))].sort(), subs = [...new Set(all("parts").map(p => p.subsystem).filter(Boolean))].sort();
  const more = R.f.invMore || ["module", "subsystem", "assignee", "arch", "status", "flag", "color", "condition"].some(k => f[k]);
  const extra = [{ k: "status", label: "Work status", opts: optsOf(PART_STATUS) }, { k: "flag", label: "Show", opts: [["inwork", "Being worked on"], ["awaiting", "Awaiting inspection"], ["missdam", "Missing or damaged"]] },
    { k: "module", label: "Module", opts: optsOf(Object.keys(MODULES), MODULES) }, { k: "subsystem", label: "Assembly", opts: optsOf(subs) }, { k: "color", label: "Color status", opts: Object.entries(COLOR_LABEL) },
    { k: "assignee", label: "Assigned", opts: teamOpts() }, { k: "arch", label: "Archived", opts: [["1", "Include archived"]] }];
  const bar = filterBar("inventory", [{ k: "q", type: "search", label: "Search name, part number or location" }, { k: "own", label: "Ownership", opts: [["Owned", "Have it"], ["Missing", "Missing"], ["Ordered", "Ordered"], ["Received", "Received"], ["Unreviewed", "Not checked"]] },
    { k: "cond", label: "Condition", opts: PV_COND }, { k: "cat", label: "Category", opts: optsOf(cats) }, { k: "stage", label: "Restoration", opts: optsOf(PV_STAGE) }].concat(more ? extra : []));
  const sortSel = `<label class="pv-sort"><span>Sort</span><select id="pvSort" aria-label="Sort parts">${[["updated", "Recently updated"], ["name", "Name"], ["pn", "Part number"], ["cond", "Condition"]].map(([v, l]) => `<option value="${v}" ${(f.sort || "updated") === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>`;
  const head = `<div class="inv-head" id="pvList"><h2 class="sec left" style="margin:0">Your parts</h2><button class="linkbtn" data-go="purchasing">${ic("cart")} Need to buy something? Shopping list</button></div>`;
  if (!total) return head + `<div class="empty"><b>No parts in your inventory yet</b>${HAS_CAT ? "Go through the catalogue above, scan a photo, or add a part yourself." : "Add the parts you're tracking: what you have, what needs fixing and what you still need to buy."}${ME.canWrite ? `<div style="margin-top:10px"><button class="btn pri" data-pvadd>${ic("plus")} Add a part</button></div>` : ""}</div>`;
  const list = view === "table" ? table("inv", rows, [PART_COLS()[0], PART_COLS()[1], { k: "inv", label: "Inventory", get: p => pvInvPill(pvRecInv(p)), sort: p => pvRecInv(p) }, { k: "stage", label: "Restoration", get: p => pvStagePill(pvRecStage(p)) || `<span class="faint">—</span>`, sort: p => PV_STAGE.indexOf(pvRecStage(p)) }].concat(PART_COLS().slice(2)), { coll: "parts", select: invSel, emptyTitle: "No parts match these filters", defSort: { k: "id", dir: "asc" } })
    : !rows.length ? `<div class="empty"><b>No parts match</b>Try a different search or <button class="linkbtn" data-clearf="inventory">clear the filters</button>.</div>`
    : view === "cards" ? `<div class="cards">${rows.slice(0, PV.listN).map(p => `<button class="card" data-open="parts|${p.id}"><div class="pimg">${pvPhotos(p.id)[0] ? `<img src="${pvPhotos(p.id)[0].file}" alt="" loading="lazy">` : partImg(p)}</div><b style="font-size:15px">${esc(p.name)}</b><div class="row">${pvInvPill(pvRecInv(p))}${pvStagePill(pvRecStage(p))}</div>${p.oemPn ? `<div class="mono faint">${esc(p.oemPn)}</div>` : ""}<div class="row muted" style="font-size:12px"><span>${esc(pvCondLabel(p.condition))}</span><span>·</span><span>${n(p.qtyFound)}/${n(p.qtyExpected)}</span></div></button>`).join("")}</div>`
    : `<div class="pv-list">${rows.slice(0, PV.listN).map(pvRowHtml).join("")}</div>`;
  return head + bar + (more ? "" : `<button class="linkbtn inv-more" data-invmore>More filters</button>`) +
    `<div class="row pv-lbar"><span class="muted">${pvNum(rows.length)} shown${rows.length !== total ? " of " + pvNum(total) : ""}</span><span class="spacer"></span>
      ${invSel.size ? `<span class="pill blue plain">${invSel.size} selected</span><select id="bulkField" aria-label="Field to bulk update"><option value="status">Set work status</option><option value="assignee">Set assignee</option><option value="location">Set location</option><option value="module">Set module</option><option value="cleaning">Set cleaning</option><option value="priority">Set priority</option></select><span id="bulkValHost"></span><button class="btn sm pri" id="bulkApply">Apply</button><button class="btn sm" id="bulkClear">Clear selection</button>` : (view === "table" ? `<span class="faint" style="font-size:12.5px">Tick rows to update many at once.</span>` : "")}
      ${sortSel}<div class="tabs"><button class="${view === "list" ? "on" : ""}" data-iv="list">List</button><button class="${view === "cards" ? "on" : ""}" data-iv="cards">Pictures</button><button class="${view === "table" ? "on" : ""}" data-iv="table">Table</button></div></div>
    ${list}${view !== "table" && rows.length > PV.listN ? `<div class="row center"><button class="btn" data-pvmore>Show ${pvNum(Math.min(50, rows.length - PV.listN))} more</button></div>` : ""}
    <div class="inv-foot"><button class="linkbtn" id="invCsv">${ic("download")} Export CSV</button><button class="linkbtn" id="invPrint">Printable list</button></div>`;
}

/* ---- the parts book: factory catalogue, service manual, repair manual ---- */
function pvBookHtml() {
  const m = meta() || {}, mk = BIKE.make || m.make || "", md = BIKE.model || m.model || "", yr = BIKE.year || m.year || "", bike = [yr, mk, md].filter(Boolean).join(" ");
  const books = [["fiche", "Factory parts catalogue", "Exploded diagrams with the OEM part number for every piece. Also called a parts list or microfiche.", "ebay", "parts catalogue", "eBay"],
    ["fsm", "Factory service manual", "The maker's own workshop manual: specs, torque values, wiring diagrams and procedures.", "ebay", "factory service manual", "eBay"],
    ["repair", "Clymer or Haynes repair manual", "Step-by-step repair manual written for home mechanics.", "amazon", "Clymer Haynes manual", "Amazon"]];
  const link = (st, q) => window.rvShop ? rvShop.link(st, q, "") : "#";
  const inCart = t => (meta().cart || []).some(x => x && !x.bought && x.title === t);
  return `<section class="pv-books stack" id="pvBooks" aria-labelledby="pvBooksH"><div><h2 class="sec left" id="pvBooksH" style="margin:0">Get the parts book for your bike</h2>
      <p class="sec-sub" style="text-align:left;margin:4px 0 0">${mk && md ? `The surest way to get part numbers and specs for the ${esc(bike)}.` : `Add your bike's year, make and model in Settings to search for its exact books.`}</p></div>
    ${mk && md ? `<div class="pv-bgrid">${books.map(([k, t, d, st, q, sn]) => { const title = `${t} for the ${bike}`, url = link(st, bike + " " + q);
      return `<div class="pv-book"><span class="pv-bic">${ic("book")}</span><div class="pv-ot"><b>${esc(t)}</b><p>${esc(d)}</p></div>
        <div class="row pv-bact"><a class="btn sm" href="${esc(url)}" target="_blank" rel="noopener sponsored">Find on ${sn} ↗</a>${ME.canWrite ? (inCart(title) ? `<span class="pill green plain">On your list</span>` : `<button class="btn sm pri" data-pvbook="${esc(JSON.stringify({ title, url, store: sn }))}">${ic("cart")} Add to shopping list</button>`) : ""}</div></div>`; }).join("")}</div>
      <p class="hint-text">Prices vary a lot, especially for older bikes, so the list item has no price until you add one. Free online parts diagrams: <a href="${esc(link("partzilla", bike))}" target="_blank" rel="noopener sponsored">Partzilla</a> · <a href="${esc(link("cmsnl", bike))}" target="_blank" rel="noopener sponsored">CMSNL</a></p>` : ""}
  </section>`;
}

(function () {
  const OLD = VIEWS.inventory;
  VIEWS.inventory = {
    render() {
      const tab = R.tab.inventory;
      if ((tab === "deck" || tab === "review") && pvList().length) return tab === "review" ? pvReviewHtml() : pvDeckHtml();
      const total = sorted("parts").length;
      return `<div class="ph" data-own="1"><div class="eyebrow">Everything on the bench</div><h1>Parts</h1><p>${total ? `${pvNum(total)} part${total === 1 ? "" : "s"} in your inventory for the ${esc(pvBikeName())}.` : "What you have, what's missing and what shape it's in."}</p></div>
        ${pvOptsHtml()}${pvSummaryHtml()}${pvListHtml()}${pvBookHtml()}`;
    },
    live() { // while going through cards, refresh in place instead of rebuilding the page
      if (!(R.tab.inventory === "deck" || R.tab.inventory === "review") || !$("#pvDeck") || PV.busy) return !!PV.busy && !!$("#pvDeck");
      if (PV.sheet) return true;
      pvPaint(); return true;
    },
    bind(root) {
      if ((R.tab.inventory === "deck" || R.tab.inventory === "review") && $("#pvDeck", root)) { pvBindDeck(root); setTimeout(pvSync, 400); return; }
      const focus = R.partsFocus; R.partsFocus = null;
      OLD.bind(root);
      $$("[data-pvstart]", root).forEach(b => b.onclick = () => { R.tab.inventory = "deck"; PV.err = ""; lsSet("rv.route", { sec: R.sec, tab: R.tab, view: R.view }); render(false); window.scrollTo(0, 0); });
      $$("[data-pvadd]", root).forEach(b => b.onclick = () => pvAdd());
      $$("[data-pvbook]", root).forEach(b => b.onclick = async () => { const d = JSON.parse(b.dataset.pvbook); b.disabled = true; try { await cartAdd({ title: d.title, price: 0, ship: 0, store: d.store, url: d.url, img: "" }); } catch (e) { b.disabled = false; return; } render(false); });
      $$("[data-pvf]", root).forEach(b => b.onclick = () => { const f = JSON.parse(b.dataset.pvf); if (f.pvdeck) { R.tab.inventory = "deck"; render(false); window.scrollTo(0, 0); return; } R.f.inventory = f; PV.listN = 50; render(false); setTimeout(() => $("#pvList")?.scrollIntoView({ block: "start", behavior: "smooth" }), 30); });
      $$("[data-pvrec]", root).forEach(row => { row.onclick = e => { if (e.target.closest("button,select,a,input")) return; pvSheet({ rid: row.dataset.pvrec }); }; row.onkeydown = e => { if (e.key === "Enter" && e.target === row) pvSheet({ rid: row.dataset.pvrec }); }; });
      $$("[data-pvedit]", root).forEach(b => b.onclick = () => pvSheet({ rid: b.dataset.pvedit }));
      $$("[data-pvmark]", root).forEach(s => { s.onclick = e => e.stopPropagation(); s.onchange = () => { if (s.value) pvMark(s.dataset.pvmark, s.value); }; });
      const ps = $("#pvSort", root); if (ps) ps.onchange = () => { fstate("inventory").sort = ps.value; render(false); };
      const pm = $("[data-pvmore]", root); if (pm) pm.onclick = () => { PV.listN += 50; render(false); };
      if (focus) { if (focus === "missing") { R.f.inventory = { own: "Missing" }; R.partsFocus = "list"; render(false); return; } setTimeout(() => $("#pvList")?.scrollIntoView({ block: "start" }), 60); }
      setTimeout(pvSync, 400);
    },
    onDrawerClose() { if (R.tab.inventory) pvPaint(); }
  };
})();

/* ---- scan a photo against the main parts list (any bike, no catalogue needed) ----
   Same AI call as the catalogue scanner (scanAI). The AI gets this bike type's main parts for the chosen area and says which
   are in the photo; it can also name things that aren't on the list. You confirm every one before anything is saved. */
function pvScanPrompt(items, sys) {
  return `This photo shows motorcycle parts from a ${pvBikeName()} (${/^[aeiou]/.test(PV_STYLE_NOUN[pvGen().profile.style]) ? "an" : "a"} ${PV_STYLE_NOUN[pvGen().profile.style]}).${sys ? ` They should be from the "${sys}" area.` : ""}
These are the main parts that could be in the photo (number. name: what it covers):
${items.map((it, i) => `${i + 1}. ${it.name}${it.what ? ": " + it.what : ""}`).join("\n")}

For EVERY numbered part decide whether it is visible in the photo.
Then list any other clearly visible motorcycle parts that are NOT on the list (main parts only, ignore bolts, nuts, washers and other small hardware).
Reply with only a JSON array:
{"n": <number>, "seen": "yes" | "maybe" | "no", "count": <how many you can see>, "note": "<a few words about condition or what you saw, or empty>"} for each numbered part, in order, then
{"n": 0, "name": "<plain name of an extra part>", "seen": "yes" | "maybe", "count": <how many>, "note": "<a few words>"} for each extra part.
Use "maybe" when you are not sure. Never guess part numbers.`;
}
function pvScan() {
  if (typeof gate === "function" && !gate("restorer", "scan", "the parts scan")) return;
  if (!ME.canWrite) { toast("You have view-only access, so scans can't be saved. Ask the owner for Contributor access.", "err"); return; }
  const sys = [...new Set(pvGen().map(x => x.sys))], idx = pvIndex();
  const sc = { step: "pick", sys: "", items: [], ai: {}, extra: [], dec: {}, add: {}, photo: null, err: "" };
  const show = () => {
    const head = `<div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0">${ic("camera")} Scan parts</h3><button class="linkbtn" data-ps="close" aria-label="Close">✕</button></div>`;
    let body = "";
    if (sc.step === "pick") body = `<p class="hint-text" style="text-align:left;margin:0">Pick the area the parts are from. The scan checks your photo against the main parts of a typical ${esc(PV_STYLE_NOUN[pvGen().profile.style])}, and also names anything else it spots.</p>
      <div class="scpick">${sys.map(s => { const its = pvGen().filter(x => x.sys === s), c = pvCounts(its, idx); return `<button type="button" class="scrow" data-psys="${esc(s)}"><b>${esc(s)}</b><span>${its.length} parts${c.done ? ` · ${c.done} checked` : ""}</span></button>`; }).join("")}
        <button type="button" class="scrow" data-psys=""><b>Not sure, or a mix</b><span>Check against every main part</span></button></div>`;
    else if (sc.step === "photo") body = `<p style="margin:0">Lay out the ${sc.sys ? esc(sc.sys.toLowerCase()) + " " : ""}parts and take one photo. You'll confirm each one before anything is saved.</p>
      <ul class="tips scTips"><li>${ic("bulb")}<span>Plain, light surface. Parts spread out, not stacked.</span></li><li>${ic("bulb")}<span>Good light, shot from straight above.</span></li><li>${ic("bulb")}<span>Big parts work best. Bolts and washers are ignored.</span></li></ul>
      <div class="row" style="gap:8px;flex-wrap:wrap"><label class="btn pri">${ic("camera")} Take a photo<input type="file" accept="image/*" capture="environment" data-psfile hidden></label><label class="btn">${ic("image")} Upload a photo<input type="file" accept="image/*" data-psfile hidden></label><button class="btn" data-ps="back">Back</button></div>`;
    else if (sc.step === "busy") body = `<img class="scphoto" src="${sc.photo.dataUrl}" alt="Your parts photo"><div class="row center" style="gap:10px"><span class="spinner"></span><b>Looking at your photo…</b></div><p class="hint-text" style="margin:0">This usually takes 5 to 30 seconds.</p>`;
    else if (sc.step === "error") body = `<img class="scphoto" src="${sc.photo.dataUrl}" alt="Your parts photo"><div class="banner warn"><div class="grow">The scan couldn't run: ${esc(sc.err)}. You can still go through the parts on the cards.</div></div>
      <div class="row" style="gap:8px"><button class="btn pri" data-ps="retry">Try again</button><button class="btn" data-ps="cards">Go through the cards instead</button></div>`;
    else if (sc.step === "review") {
      const seen = sc.items.filter(it => (sc.ai[it.key] || {}).seen && sc.ai[it.key].seen !== "no");
      const chip = a => a.seen === "yes" ? `<span class="scchip g">Looks like it's here${a.count > 1 ? ` (×${a.count})` : ""}</span>` : `<span class="scchip a">Not sure</span>`;
      body = `<details class="scphwrap"><summary>Your photo</summary><img class="scphoto" src="${sc.photo.dataUrl}" alt="Your parts photo"></details>
        <p style="margin:0"><b>Check each one.</b> Only what you mark gets saved.</p>
        ${seen.length ? `<div class="sclist">${seen.map(it => { const a = sc.ai[it.key], d = sc.dec[it.key]; return `<div class="scli"><div class="grow"><b>${esc(it.name)}</b><div>${chip(a)}${a.note ? ` <span class="hint-text">“${esc(a.note)}”</span>` : ""}</div></div>
          <div class="row" style="gap:4px"><button class="btn sm ${d === "Owned" ? "have-on" : ""}" data-psd="${esc(it.key)}~Owned">✓ Have it</button><button class="btn sm ${d === "Missing" ? "miss-on" : ""}" data-psd="${esc(it.key)}~Missing">✕ Missing</button><button class="btn sm ${!d ? "on" : ""}" data-psd="${esc(it.key)}~">Skip</button></div></div>`; }).join("")}</div>` : `<p class="hint-text" style="margin:0">None of the main ${sc.sys ? esc(sc.sys.toLowerCase()) + " " : ""}parts were spotted.</p>`}
        ${sc.extra.length ? `<h4 class="vh" style="margin:6px 0 0">Also spotted</h4><p class="hint-text" style="margin:0">Not on the main parts list. Tick the ones you want to add to your parts.</p>
          <div class="sclist">${sc.extra.map((x, i) => `<label class="scli pv-psx"><input type="checkbox" data-psx="${i}" ${sc.add[i] ? "checked" : ""}><div class="grow"><b>${esc(x.name)}</b>${x.count > 1 ? ` <span class="faint">×${x.count}</span>` : ""}<div>${chip(x)}${x.note ? ` <span class="hint-text">“${esc(x.note)}”</span>` : ""}</div></div></label>`).join("")}</div>` : ""}
        <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn" data-ps="close">Cancel</button><button class="btn pri" data-ps="save">Save</button></div>`;
    } else if (sc.step === "done") body = `<div class="banner good"><div class="grow"><b>Saved.</b> ${sc.saved.have} have it, ${sc.saved.miss} missing${sc.saved.added ? `, ${sc.saved.added} added to your parts` : ""}. The photo is in Photos &amp; files.</div></div>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn pri" data-ps="again">Scan another photo</button><button class="btn" data-ps="cards">Go through the rest on the cards</button><button class="btn" data-ps="close">Close</button></div>`;
    let m = $("#modalHost .modal.scmodal");
    if (m) { m.innerHTML = `<div class="scan stack">${head}${body}</div>`; m.scrollTop = 0; } else m = modal(`<div class="scan stack">${head}${body}</div>`, () => {});
    m.classList.add("scmodal");
    $$("[data-psys]", m).forEach(b => b.onclick = () => { sc.sys = b.dataset.psys; sc.items = pvGen().filter(x => !sc.sys || x.sys === sc.sys); sc.step = "photo"; show(); });
    $$("[data-psfile]", m).forEach(inp => inp.onchange = async () => { const f = inp.files && inp.files[0]; if (!f) return;
      let dataUrl; try { dataUrl = await compressImage(f, 520000); } catch (e) { toast("Couldn't read that photo. Try a JPG or PNG.", "err"); return; }
      sc.photo = { dataUrl, blob: await (await fetch(dataUrl)).blob(), name: f.name }; run(); });
    $$("[data-psd]", m).forEach(b => b.onclick = () => { const [k, v] = b.dataset.psd.split("~"); if (v) sc.dec[k] = v; else delete sc.dec[k]; show(); });
    $$("[data-psx]", m).forEach(c => c.onchange = () => { sc.add[+c.dataset.psx] = c.checked; });
    $$("[data-ps]", m).forEach(b => b.onclick = () => { const a = b.dataset.ps;
      if (a === "close") { if (sc.step === "review" && (Object.keys(sc.dec).length || Object.values(sc.add).some(Boolean)) && !confirm("Close without saving these marks?")) return; closeModal(); if (R.sec === "inventory") render(false); return; }
      if (a === "back") { sc.step = "pick"; show(); return; }
      if (a === "retry") { run(); return; }
      if (a === "again") { sc.step = "photo"; sc.ai = {}; sc.extra = []; sc.dec = {}; sc.add = {}; sc.photo = null; show(); return; }
      if (a === "cards") { closeModal(); const f = pvDeckF(); f.src = "main"; f.area = sc.sys ? "sys:" + sc.sys : ""; f.show = "new"; f.i = null; pvPosSet({ src: "main", area: f.area }); R.tab.inventory = "deck"; go("inventory"); return; }
      if (a === "save") save(); });
  };
  const run = async () => {
    sc.step = "busy"; show();
    try {
      const res = await scanAI(sc.photo.dataUrl, sc.photo.blob, pvScanPrompt(sc.items, sc.sys)); sc.ai = {}; sc.extra = []; sc.dec = {}; sc.add = {};
      res.forEach((r, k) => { const seen = /^(yes|maybe|no)$/i.test(r.seen) ? String(r.seen).toLowerCase() : r.seen === true ? "yes" : "no", note = String(r.note || "").slice(0, 120), count = Math.max(0, parseInt(r.count) || 0);
        if (+r.n >= 1 && sc.items[+r.n - 1]) { const it = sc.items[+r.n - 1]; sc.ai[it.key] = { seen, count, note }; if (seen === "yes" && !pvHas(pvState(it))) sc.dec[it.key] = "Owned"; }
        else if ((+r.n === 0 || r.name) && r.name && seen !== "no") { const nm = String(r.name).trim().slice(0, 80); if (nm && !sc.extra.some(x => x.name.toLowerCase() === nm.toLowerCase())) { sc.extra.push({ name: nm.charAt(0).toUpperCase() + nm.slice(1), seen, count: Math.max(1, count), note }); sc.add[sc.extra.length - 1] = seen === "yes"; } } });
      if (!Object.keys(sc.ai).length && !sc.extra.length) throw new Error("the AI's answer couldn't be read");
      sc.step = "review";
    } catch (e) { sc.err = String(e && e.message || e).replace(/^Error:\s*/, ""); sc.step = "error"; }
    if ($("#modalHost .scan")) show();
  };
  const save = async () => {
    const btn = $('#modalHost [data-ps="save"]'); if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }
    let have = 0, miss = 0, added = 0, docId = "";
    try { const d = blank("docs", { title: "Parts scan: " + (sc.sys || "main parts"), kind: "During photo", file: sc.photo.dataUrl, fileName: sc.photo.name || "parts-scan.jpg", folder: "Parts scans", tags: "parts scan",
        notes: sc.items.filter(it => sc.dec[it.key]).map(it => it.name + ": " + (sc.dec[it.key] === "Owned" ? "have" : "missing")).concat(sc.extra.filter((x, i) => sc.add[i]).map(x => x.name + ": added")).join("\n") });
      await store.put("docs", d, { silent: true, action: "saved a parts scan photo" }); docId = d.id; } catch (e) { toast("The photo couldn't be saved (storage may be full). Your marks are still saved.", "err"); }
    for (const it of sc.items) { const v = sc.dec[it.key]; if (!v) continue;
      if (await pvDecide(it, v, { noUndo: true })) { v === "Owned" ? have++ : miss++;
        const a = sc.ai[it.key], r = (pvIndex()[it.key] || [])[0];
        if (r && (a.note || (a.count > 1 && v === "Owned"))) { const x = clone(r); if (a.note && !String(x.notes || "").includes(a.note)) x.notes = [x.notes, "Scan: " + a.note].filter(Boolean).join("\n"); if (v === "Owned" && a.count > 1) { x.qtyFound = a.count; x.qtyMissing = Math.max(0, n(x.qtyExpected) - a.count); } try { await store.put("parts", x, { silent: true, noLog: true }); } catch (e) {} } } }
    for (let i = 0; i < sc.extra.length; i++) { if (!sc.add[i]) continue; const x = sc.extra[i];
      const r = pvSyncStatus(blank("parts", { name: x.name, category: sc.sys || "Miscellaneous", inv: "Owned", stage: "Not inspected", qtyExpected: x.count, qtyFound: x.count, condition: "Uninspected", notes: x.note ? "Scan: " + x.note : "", custom: true, fits: pvBikeName() }));
      try { await store.put("parts", r, { silent: true, action: "added " + x.name + " from a photo scan" }); added++; } catch (e) {} }
    sc.saved = { have, miss, added }; sc.step = "done"; show();
  };
  show();
}
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-pvscan]"); if (!b) return; e.preventDefault(); pvScan(); });
