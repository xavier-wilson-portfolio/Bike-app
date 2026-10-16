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
      const m = meta(), o = odoNow(), W = ME.canWrite;
      const st = sorted("schedule").map(it => svcState(it, o)).sort((a, b) => SVC_RANK[a.status] - SVC_RANK[b.status] || (a.milesLeft ?? 1e9) - (b.milesLeft ?? 1e9) || (a.daysLeft ?? 1e9) - (b.daysLeft ?? 1e9));
      const tracked = st.filter(x => x.status === "ok" || x.status === "soon" || x.status === "over"), ok = tracked.filter(x => x.status === "ok").length;
      const ov = st.filter(x => x.status === "over").length, sn = st.filter(x => x.status === "soon").length;
      const health = tracked.length ? Math.round(ok / tracked.length * 100) : null;
      const next = st.find(x => x.status === "over" || x.status === "soon" || x.status === "ok");
      const mm = maintMoney(), hist = svcDone().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 4);
      const open = sorted("tasks").filter(t => !tasksClosed(t)).slice(0, 5), parts = sorted("parts"), photos = sorted("docs").filter(d => d.file || d.link);
      const eta = m.requestKey ? (() => { const d = new Date(m.requestedAt || Date.now()); d.setDate(d.getDate() + 3); return d < new Date() ? "any day now" : "by " + d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); })() : "";
      const ring = pct => { const r = 26, c = 2 * Math.PI * r, f = pct == null ? 0 : pct / 100; return `<svg class="mh-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="bg"/><circle cx="32" cy="32" r="${r}" class="fg ${ov ? "red" : sn ? "amber" : "green"}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - f)).toFixed(1)}"/></svg>`; };
      const stat = (cls, k, v, s, attrs) => `<button class="mh-stat ${cls}" ${attrs}><span class="mh-k">${k}</span><span class="mh-v">${v}</span><span class="mh-s">${s}</span></button>`;
      return `<section class="mh">
        <div class="mh-top"><div><div class="eyebrow">Maintenance log</div><h1>${esc(BIKE.name)}</h1>
          <p class="muted">${m.requestKey ? `We're building this bike's restoration course, ready ${esc(eta)}. Everything you log here stays when you connect it.` : "Every service, part, job and receipt for this bike, in one place."}</p></div>
          ${W ? `<div class="mh-acts"><button class="btn tan big" data-mh="log">${ic("wrench")} Log a service</button><button class="btn big" data-mh="odo">${ic("gauge")} Update odometer</button></div>` : ""}</div>
        <div class="mh-stage">${heroPhotoHtml()}</div>
        <div class="mh-stats">
          ${stat("", "Odometer", o ? milesFmt(o.miles) + `<small> mi</small>` : "—", o ? "Read " + fmtDate(o.date) : W ? "Tap to add a reading" : "No reading yet", W ? 'data-mh="odo"' : "")}
          ${stat("ring " + (ov ? "red" : sn ? "amber" : ""), "Service health", `${ring(health)}<span>${health == null ? "—" : health + "%"}</span>`, !st.length ? "Add a schedule to start" : ov ? ov + " overdue" + (sn ? ", " + sn + " due soon" : "") : sn ? sn + " due soon" : tracked.length ? "Everything up to date" : "Set when items were last done", 'data-go="maintenance"')}
          ${stat((next && next.status !== "ok" ? next.status : "") + " txt", "Next up", next ? esc(next.item.name) : "—", next ? esc(dueTxt(next)) : "Nothing scheduled yet", next && W && next.status !== "ok" ? `data-logfor="${esc(next.item.id)}"` : 'data-go="maintenance"')}
          ${stat("", "Spent this year", money(mm.year), mm.perMile ? "$" + mm.perMile.toFixed(2) + " per mile overall" : mm.total ? money(mm.total) + " all time" : "Add costs when you log", 'data-mh="hist"')}
        </div>
        <div class="mh-grid">
          <section class="mh-panel mh-due"><div class="mh-ph"><h2>Coming up</h2><button class="linkbtn" data-go="maintenance">Full schedule ${ic("next")}</button></div>
            ${st.length ? `<div class="stack" style="gap:10px">${st.slice(0, 4).map(dueCard).join("")}</div>`
              : `<div class="mh-empty"><b>No service schedule yet</b><span class="muted">Start from a typical motorcycle schedule (oil, chain, brakes, tires and more) and adjust it to your manual, or add your own items.</span>${W ? `<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn tan" data-mh="presets">Add a typical schedule</button><button class="btn" data-new="schedule">Add my own</button></div>` : ""}</div>`}
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2>Recent services</h2><button class="linkbtn" data-mh="hist">All history ${ic("next")}</button></div>
            ${hist.length ? `<ol class="mh-tl">${hist.map(r => `<li><button class="mh-tli" data-open="maintenance|${esc(r.id)}"><span class="mh-tld">${esc(fmtDate(r.date))}${n(r.odometer) ? ` · ${milesFmt(r.odometer)} mi` : ""}</span><b>${esc(r.service)}</b><span class="faint">${svcCost(r) ? money2(svcCost(r)) : ""}${r.doneBy === "A shop" && r.shop ? " · " + esc(r.shop) : ""}</span></button></li>`).join("")}</ol>`
              : `<div class="mh-empty"><b>No services logged yet</b><span class="muted">Log the last oil change or anything else you remember. Even rough dates help the schedule.</span>${W ? `<button class="btn" data-mh="log">Log a service</button>` : ""}</div>`}
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2>Jobs to do</h2><button class="linkbtn" data-go="tasks">All jobs ${ic("next")}</button></div>
            ${open.length ? `<ul class="mh-jobs">${open.map(t => `<li>${W ? `<input type="checkbox" data-done="${esc(t.id)}" aria-label="Mark ${esc(t.title)} done">` : ""}<button class="linkbtn" data-open="tasks|${esc(t.id)}">${esc(t.title)}</button>${t.due ? `<span class="faint">${esc(fmtDate(t.due))}</span>` : ""}</li>`).join("")}</ul>` : `<div class="mh-empty"><span class="muted">Nothing on the list. Add things like "replace grips" or "fix the tail light".</span></div>`}
            ${W ? `<form class="mh-add" data-mh-add><input name="t" placeholder="Add a job and press Enter" aria-label="New job" autocomplete="off"><button class="btn sm" type="submit">Add</button></form>` : ""}
          </section>
          <section class="mh-panel mh-more"><div class="mh-ph"><h2>Your records</h2></div>
            <div class="mh-tiles">
              <button class="mh-tile" data-go="inventory">${ic("box")}<b>${parts.length}</b><span>Parts</span></button>
              <button class="mh-tile" data-go="docs">${ic("camera")}<b>${photos.length}</b><span>Photos & files</span></button>
              <button class="mh-tile" data-go="budget">${ic("dollar")}<b>${money(mm.total)}</b><span>Service spend</span></button>
              <button class="mh-tile" data-go="diagrams">${ic("layers")}<b>${diagramSites().length}</b><span>Diagram sites</span></button>
            </div>
            ${W ? `<button class="linkbtn" data-mh="report">${ic("download")} Print a service report</button>` : ""}
          </section>
        </div></section>`;
    },
    bind(root) {
      $$("[data-mh]", root).forEach(b => b.onclick = () => { const k = b.dataset.mh; if (k === "odo") logMileage(); else if (k === "presets") addPresets(); else if (k === "log") openRecord("maintenance", null, { odometer: odoNow() ? Math.round(odoNow().miles) : 0 }); else if (k === "report" || k === "hist") { R.tab.maintenance = k === "report" ? "report" : "history"; go("maintenance"); } });
      $$("[data-logfor]", root).forEach(b => b.onclick = () => logFor([b.dataset.logfor]));
      $$("[data-done]", root).forEach(c => c.onchange = async () => { const t = clone(S.tasks[c.dataset.done]); if (!t) return; t.status = "Complete"; c.closest("li").classList.add("done"); await store.put("tasks", t, { action: "finished " + t.title }); toast("Nice. " + t.title + " is done."); });
      const f = $("[data-mh-add]", root); if (f) f.onsubmit = async e => { e.preventDefault(); const v = f.t.value.trim(); if (!v) return; await store.put("tasks", blank("tasks", { title: v.slice(0, 120) }), { action: "added a job" }); toast("Added to your jobs."); };
      typeof bindHeroPhoto === "function" && bindHeroPhoto(root);
      bindTables(root);
    }
  };
}

/* ---------- restore this bike (menu): from a maintenance log to a restoration course ---------- */
if (GENERIC) {
  VIEWS.restore = {
    render() {
      const m = meta(), pack = window.rvRestoreFor ? rvRestoreFor(m) : null, name = BIKE.name;
      const gets = `<ul class="rs-list"><li><b>A step-by-step course</b> for the ${esc(name)}, from first inspection to the road test, with how-to for every step.</li><li><b>A parts list</b> with part numbers, so you know what to check, order or replace.</li><li><b>Factory parts diagrams</b> and the right shops for your bike.</li><li><b>Safety checks</b> before it goes back on the road, and a restoration budget.</li></ul>
        <p class="muted">Your maintenance log, parts, jobs, photos and receipts all stay where they are.</p>`;
      let act;
      if (pack) act = `<div class="rs-act"><b>The ${esc(rvBikeName(pack))} course is ready.</b>${ME.canWrite ? `<button class="btn tan big" id="rsGo">${ic("play")} Start restoring</button>` : `<span class="muted">Ask the project owner to start it.</span>`}</div>`;
      else if (m.requestKey) act = `<div class="rs-act"><b>Course requested.</b><span class="muted">${esc(rvEta(m.requestedAt))}. When it's ready, a Start restoring button shows up here and in your garage. Keep logging in the meantime.</span></div>`;
      else act = `<div class="rs-act"><b>We don't have a course for the ${esc(name)} yet.</b><span class="muted">Request it and we'll build it in about 3 days. Keep logging in the meantime.</span>${ME.canWrite ? `<button class="btn tan big" id="rsReq">Request the course</button>` : ""}</div>`;
      return `<div class="ph" data-own="1"><div class="eyebrow">Restore</div><h1>Restore your ${esc(BIKE.short || "bike")}</h1><p>Turn this maintenance log into a full restoration project.</p></div>
        <div class="panel stack rs">${(() => { const src = silImg(BIKE.silhouette || "bike-" + (BIKE.style || "standard")) || silImg("bike-standard"); return src ? `<img class="rs-sil" src="${src}" alt="">` : ""; })()}${act}<h2 class="sec">What you get</h2>${gets}</div>`;
    },
    bind(root) {
      const goBtn = $("#rsGo", root), rq = $("#rsReq", root);
      if (goBtn) goBtn.onclick = () => rvStartRestoring(rvRestoreFor(meta()));
      if (rq) rq.onclick = async () => {
        rq.disabled = true;
        let res; try { res = await rvRequestCourse(meta()); } catch (e) { rq.disabled = false; toast("Couldn't send the request. Check your internet and try again.", "err"); return; }
        if (res.needAccount) { toast("Create a free account and we'll send in your request."); location.href = location.pathname + "?auth=signup"; return; }
        const r = clone(meta()); r.requestKey = res.key; r.requestedAt = res.row && res.row.created_at || new Date().toISOString(); r.goal = "restore";
        await store.put("meta", r, { action: "requested a restoration course for the " + BIKE.name });
        toast("Requested. We'll have the course ready in about 3 days."); go("restore");
      };
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
