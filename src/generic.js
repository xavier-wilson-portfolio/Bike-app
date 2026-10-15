/* ============ bikes without built-in diagrams, general bikes, and connecting a project to its bike ============ */

/* ---------- where to find factory parts diagrams ----------
   Bike-specific links come from the pack (BIKE.diagramSites, BIKE.links.fiche). The general sites below
   always work: you pick the make, year and model on the site. */
const DIAGRAM_SITES = [
  { k: "revzilla", name: "RevZilla OEM parts", url: "https://www.revzilla.com/oem", what: "Factory diagrams for most Japanese and European bikes from the 1980s on. Pick the make, year and model." },
  { k: "partzilla", name: "Partzilla", url: "https://www.partzilla.com", what: "Factory diagrams and part numbers, shipped from the US. Pick the make, then the year and model." },
  { k: "cmsnl", name: "CMSNL", url: "https://www.cmsnl.com", what: "Factory diagrams going back to the 1960s, strong on older bikes. Ships worldwide from the Netherlands." },
  { k: "bikebandit", name: "BikeBandit", url: "https://www.bikebandit.com", what: "Factory diagrams and aftermarket parts. Use the OEM parts finder for your make, year and model." },
  { k: "msp", name: "MotorcycleSpareParts.eu", url: "https://www.motorcyclespareparts.eu", what: "Factory diagrams by model code for Honda, Kawasaki, Suzuki and Yamaha." },
];
function diagramSites() {
  const own = (BIKE.diagramSites || []).map(s => Object.assign({ own: true }, s));
  const ownKeys = new Set(own.map(s => s.k));
  return own.concat(DIAGRAM_SITES.filter(s => !ownKeys.has(s.k)));
}
function diagramSitesHtml() {
  const q = encodeURIComponent([BIKE.year, BIKE.make, BIKE.model].filter(Boolean).join(" ") + " parts diagram");
  return `<div class="dsites">${diagramSites().map(s => `<a class="dsite" href="${esc(s.url)}" target="_blank" rel="noopener"><span class="dsite-top"><b>${esc(s.name)}</b>${s.own ? `<span class="tag">Opens your ${esc(BIKE.short)}</span>` : `<span class="tag plain">Pick your bike</span>`}</span><span class="muted">${esc(s.what)}</span><span class="linkbtn">Open ${esc(s.name.split(" ")[0])} ${ic("next")}</span></a>`).join("")}
    ${BIKE.make ? `<a class="dsite" href="https://www.google.com/search?q=${q}" target="_blank" rel="noopener"><span class="dsite-top"><b>Search the web</b><span class="tag plain">Any bike</span></span><span class="muted">Search for "${esc([BIKE.year, BIKE.make, BIKE.model].filter(Boolean).join(" "))} parts diagram".</span><span class="linkbtn">Search ${ic("next")}</span></a>` : ""}</div>`;
}
if (!HAS_CAT && !X.handDiagrams) {
  VIEWS.diagrams = {
    render() {
      return `<div class="ph" data-own="1"><div class="eyebrow">Learn</div><h1>Parts diagrams</h1><p>${GENERIC ? "Factory parts diagrams for your bike live on these sites. Pick the one you like and choose your make, year and model." : `Revora doesn't have the factory diagrams for the ${esc(BIKE.name)} built in yet. Pick a site to see them.`}</p></div>
        ${diagramSitesHtml()}
        <div class="panel stack" style="max-width:760px;margin:0 auto"><b>How to use them with your project</b>
          <ol style="margin:0;padding-left:20px;line-height:1.6"><li>Find the diagram for the area you're working on (for example the brakes or the cooling system).</li><li>Note the reference number and the part number for anything you need.</li><li>Open that part in <button class="linkbtn" data-go="inventory">Parts</button> and type the part number in, so it's saved with your project and the whole team sees it.</li><li>Add it to the <button class="linkbtn" data-go="purchasing">Shopping list</button> when you're ready to order.</li></ol></div>`;
    },
    bind(root) { $$("[data-go]", root).forEach(b => b.onclick = () => go(b.dataset.go)); }
  };
}

/* ---------- home page for a bike that isn't in the library yet ---------- */
if (GENERIC) {
  document.documentElement.classList.add("is-generic");
  GUIDE.home = { how: ["Log every service in the Maintenance log, with the odometer, parts and cost.", "Add the jobs your bike needs to the to-do list and tick them off.", "Track parts and receipts so your costs add up on their own."] };
  VIEWS.home = {
    render() {
      const m = meta(), o = typeof odoNow === "function" ? odoNow() : null, st = sorted("schedule").map(it => svcState(it, o));
      const ov = st.filter(x => x.status === "over").length, sn = st.filter(x => x.status === "soon").length;
      const open = sorted("tasks").filter(t => !tasksClosed(t)), f = finance(), parts = sorted("parts"), photos = sorted("docs").filter(d => d.file || d.link);
      const eta = m.requestedAt ? (() => { const d = new Date(m.requestedAt); d.setDate(d.getDate() + 3); return d < new Date() ? "any day now" : "by " + d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); })() : "";
      const tile = (sec, i, t, v, s, cls = "") => `<button class="gtile2 ${cls}" data-go="${sec}"><span class="gt2-ic">${ic(i)}</span><span class="gt2-t">${t}</span><span class="gt2-v">${v}</span><span class="gt2-s">${s}</span></button>`;
      return `<section class="ghero"><div class="eyebrow">Your bike</div><h1>${esc(BIKE.name)}</h1>
          <p class="muted">${m.requestKey ? `We're building this bike's page, with its course, parts list and service schedule. Estimated ready ${esc(eta)}. Until then, keep your maintenance, parts, jobs and receipts here. When it's ready you can connect this project to it from My garage and nothing here is lost.` : "Keep your maintenance, parts, jobs and receipts in one place."}</p>
          <div class="act">${ME.canWrite ? `<button class="btn tan big" data-go="maintenance">${ic("wrench")} Log a service</button><button class="btn big" data-go="tasks">${ic("check")} Add a job</button><button class="btn big" data-go="docs">${ic("camera")} Add photos</button>` : ""}</div>
          ${heroPhotoHtml()}</section>
        ${guideHtml("home")}
        <div class="gtiles">
          ${tile("maintenance", "gauge", "Maintenance", !st.length ? "Set up" : ov ? ov + " overdue" : sn ? sn + " due soon" : st.every(x => x.status === "none" || x.status === "nointerval") ? "Set up" : "Up to date", o ? milesFmt(o.miles) + " mi on the clock" : "Add your schedule and odometer", ov ? "red" : "")}
          ${tile("tasks", "check", "Jobs to do", open.length, open.length ? "open jobs" : "Add the jobs your bike needs")}
          ${tile("inventory", "box", "Parts", parts.length, parts.length ? "parts tracked" : "Track parts you buy or replace")}
          ${tile("budget", "dollar", "Money spent", money(f.paid), f.total ? "of " + money(f.total) + " budget" : "Log receipts as you go")}
          ${tile("docs", "camera", "Photos & files", photos.length, "Receipts, before and after")}
          ${tile("diagrams", "layers", "Parts diagrams", diagramSites().length + " sites", "Factory diagrams by make and model")}
        </div>`;
    },
    bind(root) {
      $$("[data-go]", root).forEach(b => b.onclick = () => go(b.dataset.go));
      typeof bindHeroPhoto === "function" && bindHeroPhoto(root);
    }
  };
}

/* ---------- after connecting a project to its bike: bring in that bike's course, parts and schedule ---------- */
(function () {
  const base = onData;
  let merging = false;
  onData = function (first, coll) {
    base(first, coll);
    const m = S.meta.project;
    if (!merging && store.ready && m && m.mergePack === BIKE.id && ME.canWrite) {
      merging = true;
      (async () => {
        try { await loadBaseline(false, true); const r = clone(S.meta.project); delete r.mergePack; r.bike = BIKE.name; delete r.requestKey; await store.put("meta", r, { action: "connected the project to the " + BIKE.name }); toast("Connected to the " + BIKE.name + ". Its course, parts list and service schedule are added, and your records are all still here."); }
        catch (e) { merging = false; }
      })();
    }
  };
})();
