/* ============ Bike library: real specs for this bike, each with the page it came from ============
   Entries live in data/library/<id>.json (one per bike generation), built into library/. Every number has a source
   and a page. Nothing here is guessed: if a number isn't in a source, it isn't in the library. */
const LIB = { idx: null, entry: null, tried: false, busy: null };
const libNorm = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
function libPick(idx, md) {
  const y = +md.year || 0, mk = libNorm(md.make), mdl = libNorm(md.model);
  if (!mk || !mdl) return null;
  const hits = idx.filter(e => libNorm(e.make) === mk && (e.match || []).concat([e.model]).some(m => { const n = libNorm(m); return n && (mdl === n || mdl.startsWith(n) || mdl.includes(n)); }));
  const inYears = (e, r) => !y || (r && y >= r[0] && y <= r[1]);
  return hits.find(e => inYears(e, e.years)) || hits.find(e => inYears(e, e.near)) || null;
}
// find and load this bike's library entry (once per page load)
function libLoad() {
  if (LIB.busy) return LIB.busy;
  const md = Object.assign({ year: BIKE.year, make: BIKE.make, model: BIKE.model }, (typeof meta === "function" && meta()) || {});
  LIB.busy = (async () => {
    try {
      LIB.idx = LIB.idx || await fetch("library/index.json", { cache: "no-cache" }).then(r => r.ok ? r.json() : []);
      const hit = libPick(LIB.idx || [], md);
      LIB.entry = hit ? await fetch("library/" + hit.id + ".json").then(r => r.ok ? r.json() : null) : null;
      if (LIB.entry) LIB.entry._exact = !(+md.year) || (+md.year >= LIB.entry.years[0] && +md.year <= LIB.entry.years[1]);
    } catch (e) { LIB.entry = null; }
    LIB.tried = true;
    if (typeof R !== "undefined" && R.sec === "numbers" && typeof render === "function") render(false);
    return LIB.entry;
  })();
  return LIB.busy;
}
const libSrc = (e, s) => (e.sources || {})[s] || { name: "Source", url: "" };
const libFact = k => { const e = LIB.entry; if (!e) return null; const f = (e.specs || []).find(x => x.k === k); return f ? Object.assign({ s: libSrc(e, f.src) }, f) : null; };
const libChip = (s, p) => `<a class="lib-src" href="${esc(s.url)}" target="_blank" rel="noopener">${ic("book")}<span>${esc(s.short || "Owner's manual")}${p ? " p. " + esc(p) : ""}</span></a>`;
function libBanner() {
  const e = LIB.entry; if (!e) return LIB.tried ? "" : `<div class="lib-ban loading"><span class="lib-spin"></span><span>Looking up your bike in the Revora library…</span></div>`;
  const s = Object.values(e.sources || {})[0] || {};
  return `<div class="lib-ban">${ic("check")}<div><b>${esc(e.make)} ${esc(e.model)}${e.code ? ` <span class="faint">(${esc(e.code)})</span>` : ""} is in the Revora library.</b>
    <span>Numbers marked with a page come from the <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>. Tap Use to copy one into your numbers, or type your own.${e._exact ? "" : ` These are from the ${esc(e.years[0] === e.years[1] ? e.years[0] : e.years[0] + "–" + e.years[1])} manual, so check them against yours.`}</span>
    ${e.note ? `<span class="lib-warn">${ic("alert")} ${esc(e.note)}</span>` : ""}</div></div>`;
}
// what the library has for one field on the numbers page
function libHint(k, cur) {
  const f = libFact(k); if (!f) return "";
  const same = cur && String(cur).trim() === f.v;
  return `<span class="lib-hint${same ? " same" : ""}">${same ? ic("check") : ""}<b>${esc(f.v)}</b>${libChip(f.s, f.p)}${same || !ME.canWrite ? "" : `<button class="linkbtn" data-libuse="${esc(k)}">Use</button>`}</span>`;
}
function libTorqueHtml(have) {
  const e = LIB.entry; if (!e || !(e.torque || []).length) return "";
  const has = new Set((have || []).map(t => libNorm(t.what)));
  return `<div class="lib-tq"><div class="lib-tqh">From the library</div>${e.torque.map((t, i) => `<div class="lib-tqr"><span>${esc(t.what)}</span><b>${esc(t.v)}</b>${libChip(libSrc(e, t.src), t.p)}${has.has(libNorm(t.what)) ? `<span class="lib-ok">${ic("check")} Added</span>` : ME.canWrite ? `<button class="btn sm" data-libtq="${i}">${ic("plus")} Add</button>` : ""}</div>`).join("")}</div>`;
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
  }
};
function libGuideFact(e, key) {
  if (key[0] === "@") { const t = (e.torque || []).find(x => x.what === key.slice(1)); return t ? { v: t.v, s: libSrc(e, t.src), p: t.p } : null; }
  const f = (e.specs || []).find(x => x.k === key); return f ? { v: f.v, s: libSrc(e, f.src), p: f.p } : null;
}
function libGuideHtml(id) {
  const e = LIB.entry, g = LIB_GUIDES[id]; if (!e || !g || !(e.guides || []).includes(id)) return "";
  const cred = (X.silCredit || (window.RV_CONFIG && RV_CONFIG.silCredit) || {})[g.credit], dg = (e.diagrams || {})[id];
  return `<section class="lib-guide"><div class="lib-gh"><div><span class="lib-eb">How-to · ${esc(g.meta)}</span><h2>${esc(g.title)}</h2></div><div class="lib-gb"><b>${esc(e.make)} ${esc(e.model)}</b><span>${esc(e.drive === "chain" ? "Chain drive" : e.drive || "")}</span></div></div>
    <div class="lib-gbody"><figure class="lib-art"><div class="lib-artin"><img src="${esc(g.art)}" alt="">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${g.rings.map(r => r[0] === "c" ? `<ellipse cx="${r[1]}" cy="${r[2]}" rx="${r[3] * .9}" ry="${r[3]}" />` : r[0] === "r" ? `<rect x="${r[1] - r[3] / 2}" y="${r[2] - r[4] / 2}" width="${r[3]}" height="${r[4]}" rx="1.2"/>` : `<path d="M${r[1]},${r[2] - 4.6} V${r[2] + 4.6} M${r[1] - 1.6},${r[2] - 2.6} L${r[1]},${r[2] - 4.8} L${r[1] + 1.6},${r[2] - 2.6} M${r[1] - 1.6},${r[2] + 2.6} L${r[1]},${r[2] + 4.8} L${r[1] + 1.6},${r[2] + 2.6}"/>`).join("")}</svg>
        ${g.pins.map(([x, y, n]) => `<span class="lib-pin" style="left:${x}%;top:${y}%">${n}</span>`).join("")}</div>
      <figcaption>${dg ? `<span>Simplified Revora drawing, not the official factory diagram.</span><a href="${esc(dg.url)}" target="_blank" rel="noopener">See the factory diagram for this bike on ${esc(dg.site)} ${ic("next")}</a>` : `<span>Simplified Revora drawing, not the official factory diagram.</span>`}
        ${cred ? `<small>Art traced from "${esc(cred.title)}" by ${esc(cred.artist)}, <a href="${esc(cred.licUrl)}" target="_blank" rel="noopener">${esc(cred.lic)}</a></small>` : ""}</figcaption></figure>
      <ol class="lib-steps">${g.steps.map(([t, d], i) => `<li><span class="lib-n">${i + 1}</span><div><b>${esc(t)}</b><span>${esc(d)}</span></div></li>`).join("")}</ol></div>
    <div class="lib-facts">${g.facts.map(([k, l]) => { const f = libGuideFact(e, k); return `<div class="lib-fact"><small>${esc(l)}</small>${f ? `<b>${esc(f.v)}</b>${libChip(f.s, f.p)}` : `<b class="faint">Not in the owner's manual</b><span class="lib-none">Check the service manual</span>`}</div>`; }).join("")}</div></section>`;
}
