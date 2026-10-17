/* ============ Parts finder: search the big parts stores for a part name or number in one place ============
   Store links can carry affiliate IDs (RV_CONFIG.aff), set in data/config.json. With none set, they're plain links. */
GUIDE.finder = { eyebrow: "Parts", title: "Parts finder", sub: "Type a part or a part number and search every big parts store at once.",
  how: ["Type a part like \"front brake pads\", or a part number from the diagrams or your records.", "Your bike's year, make and model are added to name searches so the results fit.", "Tap a store to see its results. Check the part number matches before you buy."] };
const FIND_STORES = [
  { id: "partzilla", name: "Partzilla", what: "OEM parts with diagrams", url: q => "https://www.partzilla.com/search?q=" + q },
  { id: "revzilla", name: "RevZilla", what: "Aftermarket parts, tires and gear", url: q => "https://www.revzilla.com/search?query=" + q },
  { id: "ebay", name: "eBay", what: "New and used parts, often cheapest", url: q => "https://www.ebay.com/sch/i.html?_nkw=" + q + "&_sacat=6028" },
  { id: "amazon", name: "Amazon", what: "Filters, plugs, batteries, fluids", url: q => "https://www.amazon.com/s?k=" + q },
  { id: "denniskirk", name: "Dennis Kirk", what: "Aftermarket parts and accessories", url: q => "https://www.denniskirk.com/search?query=" + q },
  { id: "cmsnl", name: "CMSNL", what: "OEM parts, great for older bikes", url: q => "https://www.cmsnl.com/search/?q=" + q }];
const FIND_COMMON = ["Oil filter", "Air filter", "Spark plugs", "Front brake pads", "Rear brake pads", "Chain and sprockets", "Battery", "Front tire", "Rear tire", "Brake fluid", "Clutch cable", "Fork seals", "Mirrors", "Levers", "Headlight bulb", "Coolant"];
const looksLikePn = s => /\d/.test(s) && /^[A-Z0-9][A-Z0-9 .\-\/]{3,24}$/i.test(s.trim()) && !/\s\S+\s/.test(s.trim());
const affLink = (st, url) => {
  const A = (window.RV_CONFIG && RV_CONFIG.aff) || {};
  if (st.id === "amazon" && A.amazonTag) return url + "&tag=" + encodeURIComponent(A.amazonTag);
  if (st.id === "ebay" && A.ebayCampid) return url + "&mkcid=1&mkrid=711-53200-19255-0&siteid=0&toolid=10001&mkevt=1&campid=" + encodeURIComponent(A.ebayCampid);
  const w = A[st.id]; return typeof w === "string" && w.includes("{url}") ? w.replace("{url}", encodeURIComponent(url)) : url;
};
const affOn = () => { const A = (window.RV_CONFIG && RV_CONFIG.aff) || {}; return Object.values(A).some(Boolean); };
const findQuery = (q, withBike) => encodeURIComponent((withBike ? [BIKE.year, BIKE.make, BIKE.model].filter(Boolean).join(" ") + " " : "") + q.trim()).replace(/%20/g, "+");

// part numbers already in the records: parts list, mods and the parts used on services
function knownPartNumbers() {
  const out = new Map(), add = (pn, label, from) => { pn = String(pn || "").trim(); if (pn.length >= 4 && /\d/.test(pn) && !out.has(pn.toUpperCase())) out.set(pn.toUpperCase(), { pn, label, from }); };
  sorted("parts").forEach(p => add(p.oemPn, p.name, "Parts list"));
  sorted("mods").forEach(m => add(m.partNo, (m.brand ? m.brand + " " : "") + m.name, "Mods"));
  svcDone().forEach(r => String(r.partsUsed || "").split(/\n+/).forEach(line => { const m = line.match(/\b([A-Z0-9]{2,6}-[A-Z0-9]{2,6}(?:-[A-Z0-9]{2,6})?)\b/i); if (m && m[1].length >= 8 && !/^\d+W-\d+$/i.test(m[1]) && (m[1].match(/\d/g) || []).length >= 4) add(m[1], line.replace(m[1], "").replace(/^[\s,;:-]+|[\s,;:-]+$/g, "") || r.service, "Services"); }));
  return [...out.values()].slice(0, 30);
}
function findPart(q) { go("finder", { q }); }

VIEWS.finder = {
  render() {
    const f = R.f.finder || {}, q = String(f.q || ""), m = meta(), recent = (m.finderRecent || []).slice(0, 8);
    const isPn = q && looksLikePn(q), withBike = f.bike != null ? !!f.bike : !isPn, Q = q ? findQuery(q, withBike) : "";
    const pns = knownPartNumbers(), sched = sorted("schedule").map(x => x.name).filter(Boolean);
    const picks = [...new Set(FIND_COMMON.concat(sched.filter(s => s.length < 40)))].slice(0, 22);
    const slug = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const oemUrl = BIKE.make && BIKE.year ? `https://www.revzilla.com/oem/${slug(BIKE.make)}/${slug([BIKE.year, BIKE.make, BIKE.model].join(" "))}` : "";
    return `<div class="ph" data-own="1"><div class="eyebrow">Parts</div><h1>Parts finder</h1><p>Type a part or a part number and search every big parts store at once.</p></div>
      <form class="fd-search" id="fdForm" role="search"><span class="fd-ico">${ic("search")}</span><input id="fdQ" type="search" value="${esc(q)}" placeholder="Front brake pads, or a part number like 16510-07J00" aria-label="Part or part number" autocomplete="off"><button class="btn pri" type="submit">Find it</button></form>
      ${q ? `<div class="fd-for"><span>Results for <b>${esc(q)}</b>${withBike ? ` on a <b>${esc(BIKE.name)}</b>` : ""}</span><label class="fd-tog"><input type="checkbox" id="fdBike" ${withBike ? "checked" : ""}> Add my bike to the search</label></div>
        <div class="fd-stores">${FIND_STORES.map(st => `<a class="fd-store" href="${esc(affLink(st, st.url(Q)))}" target="_blank" rel="noopener sponsored" data-fd-go="${st.id}"><b>${esc(st.name)}</b><span>${esc(st.what)}</span><em>Search ${esc(st.name)} →</em></a>`).join("")}</div>
        <p class="faint fd-note">${isPn ? "Searching by part number. Superseded numbers can show up as a newer number for the same part." : "Check the part fits your exact year and model before you buy. A part number from the diagrams is the surest way."}${affOn() ? " Some store links earn Revora a small commission. It doesn't change your price." : ""}</p>`
        : `<div class="fd-picks"><span class="fd-k">Common parts</span>${picks.map(p => `<button class="chip" data-fd-q="${esc(p)}">${esc(p)}</button>`).join("")}</div>`}
      <div class="fd-grid">
        ${pns.length ? `<section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("tag")}</span>Part numbers in your records</h2></div>
          <div class="fd-pns">${pns.map(p => `<button data-fd-q="${esc(p.pn)}"><code>${esc(p.pn)}</code><span>${esc(p.label)}</span><small>${esc(p.from)}</small></button>`).join("")}</div></section>` : ""}
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("layers")}</span>Find the right part number</h2></div>
          <p class="muted" style="margin:0 0 8px">Exploded diagrams show every part on your bike with its OEM number. Find the part there, then search the number here.</p>
          <div class="vl-look">${oemUrl ? `<a href="${esc(oemUrl)}" target="_blank" rel="noopener"><b>RevZilla OEM diagrams</b><span>For your ${esc(BIKE.name)}</span></a>` : ""}
            <a href="${esc("https://www.partzilla.com/search?q=" + findQuery(BIKE.make + " " + BIKE.model, false))}" target="_blank" rel="noopener"><b>Partzilla diagrams</b><span>Pick your model, then the part of the bike</span></a>
            <a href="${esc("https://www.cmsnl.com/search/?q=" + findQuery([BIKE.make, BIKE.model].join(" "), false))}" target="_blank" rel="noopener"><b>CMSNL diagrams</b><span>Best for older and overseas models</span></a>
            ${SEC.diagrams ? `<button class="linkbtn fd-in" data-goto="diagrams">Or open the diagrams in Revora</button>` : ""}</div></section>
        ${recent.length ? `<section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("clock")}</span>Recent searches</h2>${ME.canWrite ? `<button class="linkbtn" id="fdClear">Clear</button>` : ""}</div>
          <div class="fd-picks">${recent.map(r => `<button class="chip" data-fd-q="${esc(r)}">${esc(r)}</button>`).join("")}</div></section>` : ""}
      </div>`;
  },
  bind(root) {
    const run = async q => {
      q = String(q || "").trim().slice(0, 80); R.f.finder = { q }; render(false);
      if (q && ME.canWrite) { const mm = clone(meta()); mm.finderRecent = [q].concat((mm.finderRecent || []).filter(x => x.toLowerCase() !== q.toLowerCase())).slice(0, 8); await store.put("meta", mm, { noLog: true }); }
    };
    $("#fdForm", root).onsubmit = e => { e.preventDefault(); run($("#fdQ", root).value); };
    $$("[data-fd-q]", root).forEach(b => b.onclick = () => run(b.dataset.fdQ));
    const t = $("#fdBike", root); if (t) t.onchange = () => { R.f.finder = Object.assign({}, R.f.finder, { bike: t.checked }); render(false); };
    const c = $("#fdClear", root); if (c) c.onclick = async () => { const mm = clone(meta()); mm.finderRecent = []; await store.put("meta", mm, { noLog: true }); };
    if (!(R.f.finder || {}).q) setTimeout(() => $("#fdQ", root)?.focus({ preventScroll: true }), 50);
  }
};
