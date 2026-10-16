/* ============ HOME (car-site layout), PAINT STUDIO, GUIDES ============ */
function heroPhotoDoc() { const id = meta().heroPhoto, d = id && S.docs[id]; return d && !d.archived && d.file && d.file.startsWith("data:image") ? d : null; }
const HERO_STOCK = BIKE.hero;
function silHero() {
  const src = silImg(BIKE.silhouette || "bike-" + BIKE.style) || silImg("bike-standard"), c = silCredit(src);
  return c ? { src, alt: "Silhouette of a " + (c.what || "motorcycle"), cap: "Silhouette traced from a photo.", credit: c.artist || "Wikimedia Commons", page: c.page, lic: c.lic, licUrl: c.licUrl, sil: true } : { src, alt: "Motorcycle silhouette", cap: "", none: true, sil: true };
}
function heroPhotoHtml() {
  const d = heroPhotoDoc(), bike = meta().bike || BIKE.name, H = HERO_STOCK || (LEGACY ? { src: "img/bike.svg", alt: "Motorcycle illustration", cap: "", none: true } : silImg(BIKE.silhouette || (BIKE.style ? "bike-" + BIKE.style : "") || (GENERIC ? "bike-standard" : "")) || (GENERIC && silImg("bike-standard")) ? silHero() : null);
  if (!H && !d) return `<figure class="herophoto nophoto"><div class="np-in">${ic("camera")}<b>Add a photo of your ${esc(BIKE.short || "bike")}</b><span class="muted">It shows here and on your garage card.</span>${ME.canWrite ? `<button class="btn tan" id="hpAdd">${ic("image")} Add my photo</button>` : ""}</div></figure>`;
  return `<figure class="herophoto has${d ? "" : " cutout"}${!d && H.sil ? " sil" : ""}">${d ? `<img src="${d.file}" alt="${esc(d.title || "Photo of the " + bike)}">` : `<img class="hp-cut" src="${H.src}" alt="${esc(H.alt)}" width="1097" height="633">${H.none ? "" : `<figcaption class="hp-cap">${esc(H.cap)} Photo: <a href="${H.page}" target="_blank" rel="noopener">${esc(H.credit)}</a>, <a href="${H.licUrl}" target="_blank" rel="noopener">${esc(H.lic)}</a></figcaption>`}`}
    ${ME.canWrite ? `<div class="hp-tools">${d ? `<button class="btn sm" id="hpChange">${ic("image")} Change photo</button><button class="btn sm" id="hpRemove">Use the stock photo</button>` : `<button class="btn sm" id="hpAdd">${ic("image")} Use my own photo</button>`}</div>` : ""}</figure>`;
}
function heroPhotoPick() {
  const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
  inp.onchange = async () => { const f = inp.files && inp.files[0]; if (!f) return;
    let data; try { data = await compressImage(f, 420000); } catch (e) { toast("Couldn't read that image.", "err"); return; }
    const rec = blank("docs", { title: "Home page photo", fileName: f.name, file: data, kind: "During photo" });
    try { await store.put("docs", rec, { action: "added the home page photo" }); const m = clone(meta()); m.heroPhoto = rec.id; await store.put("meta", m, { action: "set the home page photo" }); toast("Photo added to the home page."); } catch (e) {} };
  inp.click();
}
function bindHeroPhoto(root) {
  const a = $("#hpAdd", root), c = $("#hpChange", root), r = $("#hpRemove", root);
  if (a) a.onclick = heroPhotoPick; if (c) c.onclick = heroPhotoPick;
  if (r) r.onclick = async () => { const m = clone(meta()); delete m.heroPhoto; await store.put("meta", m, { action: "removed the home page photo" }); toast("Photo removed from the home page. It's still in Photos & files."); };
}
VIEWS.home = {
  render() {
    const m = meta(), prog = overallProgress(), nx = nextLesson(), nxi = lessonIndex(nx.id), L = LESSONS[nx.id] || {}, ns = phaseStats(nx), pc = partCounts(), f = finance();
    const ts = sorted("tasks").filter(t => t.status !== "Cancelled"), done = ts.filter(tasksDone).length, W = ME.canWrite;
    const rec = recommendedTasks(4), recIds = new Set(rec.map(t => t.id)), waiting = rec.length < 4 ? ts.filter(t => !tasksClosed(t) && !recIds.has(t.id)).sort((a, b) => lessonIndex(a.phase) - lessonIndex(b.phase) || a.id.localeCompare(b.id, undefined, { numeric: true })).slice(0, 4 - rec.length) : [], act = sorted("activity").sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 5);
    const phases = sorted("phases"), upcoming = phases.slice(nxi + 1, nxi + 4), pct = Math.round(prog * 100), fresh = lessonState(nx) === "todo" && nxi === 0;
    const r = 26, c = 2 * Math.PI * r, ring = `<svg class="mh-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="bg"/><circle cx="32" cy="32" r="${r}" class="fg green" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - prog)).toFixed(1)}"/></svg>`;
    const stat = (cls, k, v, sub, attrs) => `<button class="mh-stat ${cls}" ${attrs}><span class="mh-k">${k}</span><span class="mh-v">${v}</span><span class="mh-s">${sub}</span></button>`;
    const diagLbl = X.diagrams3d ? "3D diagrams" : "Parts diagrams";
    return `${exampleBanner()}<section class="mh rs-home">
      <div class="mh-hero">
        <div class="mh-hero-l">
          <div class="mh-eyebrow">${ic("book")} Restoration course</div>
          <h1>${esc(m.bike || BIKE.name)}</h1>
          <div class="mh-chips">${UNIVERSAL && BIKE.styleName ? `<span>${esc(BIKE.styleName)}</span>` : ""}<span>Part ${nxi + 1} of ${phases.length}</span><span>${pct}% done</span>${SPECS.slice(0, 2).map(([v]) => `<span>${esc(v)}</span>`).join("")}</div>
          <p>${phases.length} parts, one step at a time. Every step says what to do and why, and the mechanic is a click away if you get stuck.</p>
          <div class="mh-acts"><button class="btn mh-pri" data-lesson="${nx.id}">${ic("play")} ${fresh ? "Start Part 1" : "Continue Part " + (nxi + 1)}</button><button class="btn mh-sec" data-go="${X.diagrams3d ? "viewer" : "diagrams"}">${ic(X.diagrams3d ? "cube" : "layers")} ${diagLbl}</button></div>
        </div>
        <div class="mh-stage">${heroPhotoHtml()}</div>
      </div>
      <div class="mh-stats">
        ${stat("ring c-green", ic("book") + "Course", `${ring}<span>${pct}%</span>`, `${done} of ${ts.length} steps done`, 'data-go="course"')}
        ${stat("c-tan txt", ic("play") + "Up next", esc(L.title || nx.name), `Part ${nxi + 1} · ${ns.done} of ${ns.total} steps`, `data-lesson="${nx.id}"`)}
        ${stat("c-blue", ic("box") + "Parts finished", `${pc.green}<small> / ${pc.total}</small>`, "restored and checked", 'data-go="inventory"')}
        ${stat(f.forecast > f.total && f.total ? "c-red" : "c-navy", ic("dollar") + "Money spent", money(f.paid), f.total ? "of " + money(f.total) + " budget" : "Set a budget in Money", 'data-go="budget"')}
      </div>
      <div class="mh-row">
        <section class="mh-panel p-due"><div class="mh-ph"><h2><span class="mh-hi">${ic("book")}</span>Your course</h2><button class="linkbtn" data-go="course">All ${phases.length} parts ${ic("next")}</button></div>
          <button class="rs-cur" data-lesson="${nx.id}"><span class="rs-art">${lessonArt(L, "card")}</span><span class="rs-cur-t"><span class="rs-k">${fresh ? "Start here" : "Up next"} · Part ${nxi + 1}</span><b>${esc(L.title || nx.name)}</b><span class="muted">${esc(L.short || "")}</span><span class="rs-prog"><i style="width:${(ns.pct * 100).toFixed(1)}%"></i></span><span class="rs-n">${ns.done} of ${ns.total} steps</span></span></button>
          ${upcoming.length ? `<div class="rs-next">${upcoming.map((p, k) => { const LL = LESSONS[p.id] || {}, sp = phaseStats(p); return `<button class="rs-nx" data-lesson="${p.id}"><span class="rs-num">${nxi + 2 + k}</span><span><b>${esc(LL.title || p.name)}</b><span class="faint">${sp.total} steps</span></span>${ic("next")}</button>`; }).join("")}</div>` : ""}
        </section>
        <section class="mh-panel p-jobs"><div class="mh-ph"><h2><span class="mh-hi">${ic("check")}</span>Ready to do next</h2><button class="linkbtn" data-go="tasks">To-do list ${ic("next")}</button></div>
          ${rec.length || waiting.length ? `<div class="stepl">${rec.map(t => `<div class="st"><div class="st-h" data-open="tasks|${t.id}">${stepCheck(t)}<div class="st-t"><b>${esc(t.title)}</b><span>Part ${lessonIndex(t.phase) + 1} · ${esc(LESSONS[t.phase]?.title || "")}${t.safety === "Critical" ? " · safety-critical" : ""}</span></div>${ic("next")}</div></div>`).join("")}${waiting.map(t => `<div class="st rs-wait"><div class="st-h" data-open="tasks|${t.id}"><span class="rs-lock">${ic("clock")}</span><div class="st-t"><b>${esc(t.title)}</b><span>Part ${lessonIndex(t.phase) + 1} · after the steps before it</span></div>${ic("next")}</div></div>`).join("")}</div>` : `<div class="mh-empty"><b>Nothing is ready right now</b><span class="muted">Steps are waiting on earlier ones. Check the To-do list to see what's blocking them.</span></div>`}
          <p class="faint" style="margin:auto 0 0;font-size:13px">Everything these steps depend on is done. Tick one off when it's finished.</p>
        </section>
      </div>
      <div class="mh-row">
        ${UNIVERSAL ? `<section class="mh-panel p-parts"><div class="mh-ph"><h2><span class="mh-hi">${ic("gauge")}</span>Tailored for a ${esc(String(BIKE.styleName || "bike").toLowerCase())}</h2><button class="linkbtn" data-go="guides">Guide ${ic("next")}</button></div>
          <div class="rs-specs">${(BIKE.styleFocus || []).map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>
          <p class="faint" style="margin:auto 0 0;font-size:12.5px">${esc(BIKE.styleIntro || "")} Mark any step that doesn't fit your bike as Cancelled, and take every number from its factory manual.</p>
        </section>` : `<section class="mh-panel p-parts"><div class="mh-ph"><h2><span class="mh-hi">${ic("gauge")}</span>Bike specs</h2><a class="linkbtn" href="${SPEC_SOURCE.url}" target="_blank" rel="noopener">Source ${ic("next")}</a></div>
          <div class="rs-specs">${SPECS.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>
          <p class="faint" style="margin:auto 0 0;font-size:12.5px">${esc(BIKE.specNote || "Published specs for the " + BIKE.name + ".")} Always check against your bike and its factory manual.</p>
        </section>`}
        <section class="mh-panel p-hist"><div class="mh-ph"><h2><span class="mh-hi">${ic("clock")}</span>Recent activity</h2><button class="linkbtn" data-go="team">Work log ${ic("next")}</button></div>
          ${act.length ? `<ol class="mh-tl">${act.map(a => `<li><div class="mh-tli"><span class="mh-tld">${esc(fmtTime(a.ts))}</span><b>${esc(a.by)} ${esc(a.summary)}</b>${a.title && SCHEMA[a.coll] ? `<span class="faint">${esc(String(a.title).slice(0, 60))}</span>` : ""}</div></li>`).join("")}</ol>` : `<div class="mh-empty"><b>Nothing yet</b><span class="muted">Steps you finish, parts you update and photos you add show up here for the whole team.</span></div>`}
          ${act.length < 3 ? `<div class="rs-jump">${[["docs", "camera", "Photos"], ["purchasing", "cart", "Shopping list"], ["gates", "shield", "Safety checks"], ["shops", "store", "Where to buy"]].filter(([k]) => SEC[k]).map(([k, i, t]) => `<button data-go="${k}">${ic(i)}<span>${t}</span></button>`).join("")}</div>` : ""}
        </section>
      </div>
    </section>`;
  },
  bind(root) { bindHeroPhoto(root); bindSetup(root); bindTables(root); bindLessonLinks(root); bindStepChecks(root); }
};

/* ---------- Paint studio ---------- */
const STRIPE_HEX = { gold: "#C9A13A", white: "#F4F4F2", black: "#15181B", none: "#000000" };
function bikeArt(hex, frame, stripe, cls = "") {
  const h = "#" + ((+hex || 0) >>> 0).toString(16).padStart(6, "0"), fv = FRAMES[frame], fh = fv == null ? h : "#" + fv.toString(16).padStart(6, "0");
  const st = `--paint:${h};--frame:${fh};--stripe:${STRIPE_HEX[stripe] || STRIPE_HEX.gold};--stripe-o:${stripe === "none" ? 0 : 1}`;
  return BIKE_SVG.replace("<svg ", `<svg role="img" aria-label="${BIKE.short} illustration in the chosen colors" style="${st}" `).replace('class="gsb', `class="gsb bikeart ${cls}`);
}
const PAINT_STATUS = ["Not started", "Stripped", "Primed", "Color on", "Done"];
VIEWS.paint = {
  draft: null,
  render() {
    const m = meta(); const d = this.draft = this.draft || { name: m.paintName || "Candy blue", hex: n(m.paintHex) || PAINTS[m.paintName || "Candy blue"] || PAINTS["Candy blue"], frame: m.frameFinish || "Gloss black", stripe: m.stripe || "gold" };
    const isPreset = PAINTS[d.name] !== undefined, hexStr = "#" + d.hex.toString(16).padStart(6, "0"), plan = m.paintPlan || {};
    const saved = m.paintName === d.name && n(m.paintHex) === d.hex && (m.frameFinish || "Gloss black") === d.frame && (m.stripe || "gold") === d.stripe;
    return `${pageHead("paint")}
    <section class="config">
      <div class="cfg-img">${bikeArt(d.hex, d.frame, d.stripe)}
        <div class="cfg-cap"><span class="swatch" style="--c:${hexStr}"></span><b>${esc(d.name)}</b><span class="muted">· ${esc(d.frame)} frame · ${esc(STRIPES[d.stripe])}</span></div></div>
      <div class="cfg-panel stack">
        <div><div class="cfg-l">1. Tank & side cover color</div><div class="swatches">${Object.entries(PAINTS).map(([nm, hex]) => `<button class="swatch big ${d.name === nm ? "on" : ""}" data-paint="${esc(nm)}" style="--c:#${hex.toString(16).padStart(6, "0")}" aria-label="${esc(nm)}" title="${esc(nm)}"></button>`).join("")}<label class="swatch big custom ${!isPreset ? "on" : ""}" title="Custom color" style="--c:${!isPreset ? hexStr : "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)"}"><input type="color" id="pCustom" value="${hexStr}" aria-label="Custom color"></label></div><div class="cfg-v">${esc(d.name)}</div></div>
        <div><div class="cfg-l">2. Frame finish</div><div class="seg">${Object.keys(FRAMES).map(k => `<button class="${d.frame === k ? "on" : ""}" data-frame="${esc(k)}">${esc(k)}</button>`).join("")}</div></div>
        <div><div class="cfg-l">3. Pinstripe</div><div class="seg">${Object.entries(STRIPES).map(([k, l]) => `<button class="${d.stripe === k ? "on" : ""}" data-stripe="${k}">${esc(l.replace(" pinstripe", ""))}</button>`).join("")}</div></div>
        <div class="row center" style="margin-top:4px">${ME.canWrite ? `<button class="btn pri" id="pSave" ${saved ? "disabled" : ""}>${saved ? ic("tick") + " Saved as your scheme" : "Save this scheme"}</button>` : ""}<button class="btn" id="p3d">${ic("cube")} See it in 3D</button></div>
        <div class="row center">${askBtn(`Help me choose a paint scheme for my ${BIKE.year + " " + BIKE.short}. I'm thinking ${d.name} with a ${d.frame} frame and ${STRIPES[d.stripe]}. What looks period-correct and what's practical?`, "this color scheme", "btn sm ask")}</div>
        <p class="hint-text" style="text-align:center">These are paint looks, not factory color codes. If you want the original 1977 color, match it to a clean, hidden area of the original paint with a paint supplier.</p>
      </div>
    </section>
    <section class="stack"><div class="sechead"><div class="eyebrow">Choose the right finish</div><h2 class="disp">Which finish goes where</h2><p>Most restorations mix several finishes. Here's what each one is good for.</p></div>
      <div class="finishes">${FINISH_TYPES.map(([t, d2, w]) => `<div class="fin"><b>${esc(t)}</b><p>${esc(d2)}</p><span class="tag">Best for: ${esc(w)}</span></div>`).join("")}</div></section>
    <section class="stack"><div class="sechead"><div class="eyebrow">Your repaint plan</div><h2 class="disp">Parts to refinish</h2><p>Pick a finish for each part and track it as you go. Saved for the whole team.</p></div>
      <div class="planlist">${PAINT_PARTS.map(([k, label, pid]) => { const pl = plan[k] || {}; const p = S.parts[pid];
        return `<div class="planrow"><img src="img/g-${k}.svg" alt="" loading="lazy"><div class="pl-t"><b>${esc(label)}</b>${p ? `<span>${partPill(p)}</span>` : ""}</div>
        <label class="pl-f"><span>Finish</span><select data-plan="${k}" data-pf="finish" ${ME.canWrite ? "" : "disabled"}><option value="">Undecided</option><option ${pl.finish === "Leave as is" ? "selected" : ""}>Leave as is</option>${FINISH_TYPES.map(([t]) => `<option ${pl.finish === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
        <label class="pl-f"><span>Progress</span><select data-plan="${k}" data-pf="status" ${ME.canWrite ? "" : "disabled"}>${PAINT_STATUS.map(st => `<option ${(pl.status || "Not started") === st ? "selected" : ""}>${st}</option>`).join("")}</select></label></div>`; }).join("")}</div>
      <div class="row center"><span class="hint-text">${Object.values(plan).filter(x => x.status === "Done").length} of ${PAINT_PARTS.length} parts finished</span><button class="btn sm" data-go="finish">Open finish records & photos</button></div></section>
    <section class="band full"><div class="band-in stack"><div class="sechead"><div class="eyebrow">Step by step</div><h2 class="disp">How to paint the fuel tank</h2><p>The tank is the part everyone looks at first. Do it in this order and don't skip the boring steps.</p></div>
      <img class="guide-img" src="img/d-tank.svg" alt="Painted ${BIKE.short} fuel tank">
      <ol class="process">${TANK_STEPS.map(([t, d2, i], k) => `<li><span class="pn">${String(k + 1).padStart(2, "0")}</span><div class="stack" style="gap:4px"><b>${esc(t)}</b><p>${esc(d2)}</p><div>${askBtn(`Explain step ${k + 1} of painting my ${BIKE.short} tank ("${t}") in more detail: ${d2}`, t, "linkbtn ask")}</div></div></li>`).join("")}</ol></div></section>
    <section class="stack"><div class="sechead"><div class="eyebrow">Everything else</div><h2 class="disp">Painting the other parts</h2></div>
      <div class="grid g3">${PARTS_PROCESS.map(([t, d2]) => `<div class="panel stack" style="gap:6px"><h3 class="disp-s">${esc(t)}</h3><p style="margin:0;font-size:14.5px">${esc(d2)}</p><div>${askBtn(`How should I refinish the ${t.toLowerCase()} on my ${BIKE.short}? ${d2}`, t, "linkbtn ask")}</div></div>`).join("")}</div></section>
    <section class="panel stack safetybox"><h2 class="sec left" style="display:flex;gap:8px;align-items:center">${ic("warn")} Paint safety</h2><ul class="tips">${PAINT_SAFETY.map(x => `<li>${ic("shield")}<span>${esc(x)}</span></li>`).join("")}</ul></section>
    <section class="stack"><div class="sechead"><div class="eyebrow">Supplies</div><h2 class="disp">Where to get paint supplies</h2><p>Automotive paint suppliers can mix any color into base coat, single stage or aerosol cans. These shops cover tank sealers and coatings.</p></div><div class="shops">${["caswell", "por15", "gsr"].map(shopCard).join("")}</div></section>`;
  },
  bind(root) {
    const self = this, d = this.draft;
    const upd = () => render(false);
    $$("[data-paint]", root).forEach(b => b.onclick = () => { d.name = b.dataset.paint; d.hex = PAINTS[d.name]; upd(); });
    $("#pCustom", root).oninput = debounce(e => { d.hex = parseInt(e.target.value.slice(1), 16); d.name = "Custom " + e.target.value.toUpperCase(); upd(); }, 150);
    $$("[data-frame]", root).forEach(b => b.onclick = () => { d.frame = b.dataset.frame; upd(); });
    $$("[data-stripe]", root).forEach(b => b.onclick = () => { d.stripe = b.dataset.stripe; upd(); });
    $("#pSave", root) && ($("#pSave", root).onclick = async () => { const m = clone(meta()); Object.assign(m, { paintName: d.name, paintHex: d.hex, frameFinish: d.frame, stripe: d.stripe }); await store.put("meta", m, { action: `chose the paint scheme: ${d.name}, ${d.frame} frame` }); toast("Paint scheme saved. The 3D bike now uses it."); });
    $("#p3d", root).onclick = async () => { const m = clone(meta()); if (ME.canWrite && !(m.paintName === d.name && n(m.paintHex) === d.hex && m.frameFinish === d.frame && m.stripe === d.stripe)) { Object.assign(m, { paintName: d.name, paintHex: d.hex, frameFinish: d.frame, stripe: d.stripe }); await store.put("meta", m, { action: `previewed the paint scheme: ${d.name}` }); } openIn3D("tank"); };
    $$("[data-plan]", root).forEach(sel => sel.onchange = async () => { const m = clone(meta()); m.paintPlan = Object.assign({}, m.paintPlan || {}); const k = sel.dataset.plan; m.paintPlan[k] = Object.assign({}, m.paintPlan[k] || {}, { [sel.dataset.pf]: sel.value }); await store.put("meta", m, { action: `repaint plan: ${k} ${sel.dataset.pf} → ${sel.value}` }); toast("Repaint plan updated"); });
    bindTables(root);
  }
};

/* ---------- Guides library ---------- */
VIEWS.guides = {
  render() {
    const g = R.guide && GUIDES[R.guide];
    if (!g || g.sec) return `${pageHead("guides")}<div class="guidegrid">${Object.entries(GUIDES).map(([k, x]) => `<button class="gcard" data-guide="${k}">${x.img ? `<img src="img/${x.img}.svg" alt="" loading="lazy">` : silImg(x.cover) ? `<img class="silcover" src="${silImg(x.cover)}" alt="" loading="lazy">` : `<span class="gc-ico">${ic(x.icon || "book")}</span>`}<span><b>${esc(x.title)}</b><small>${esc(x.sum)}</small><em>Read the guide ${ic("next")}</em></span></button>`).join("")}</div>
      <div class="row center">${askBtn("", "", "btn ask")}</div>`;
    const others = Object.entries(GUIDES).filter(([k]) => k !== R.guide).slice(0, 4);
    return `<div class="ph" data-own="1"><div class="eyebrow">Guide</div><h1>${esc(g.title)}</h1><p>${esc(g.sum)}</p></div>
      ${g.img ? `<img class="guide-img" src="img/${g.img}.svg" alt="">` : silImg(g.cover) ? `<img class="guide-img silcover" src="${silImg(g.cover)}" alt="">` : ""}
      <article class="article">${g.body.map(([h, t]) => `<section><h2>${esc(h)}</h2><p>${esc(t)}</p></section>`).join("")}
        <div class="panel blue row center" style="gap:12px"><span>Still have a question about ${esc(g.title.toLowerCase())}?</span>${askBtn("", g.title, "btn pri ask")}</div></article>
      <div class="stack"><h2 class="sec">More guides</h2><div class="guidegrid">${others.map(([k, x]) => `<button class="gcard" data-guide="${k}">${x.img ? `<img src="img/${x.img}.svg" alt="" loading="lazy">` : silImg(x.cover) ? `<img class="silcover" src="${silImg(x.cover)}" alt="" loading="lazy">` : `<span class="gc-ico">${ic(x.icon || "book")}</span>`}<span><b>${esc(x.title)}</b><small>${esc(x.sum)}</small></span></button>`).join("")}</div></div>
      <div class="row center"><button class="btn" data-goto="guides">${ic("back")} All guides</button></div>`;
  },
  bind(root) { $$("[data-guide]", root).forEach(b => b.onclick = () => { const k = b.dataset.guide; if (GUIDES[k].sec) go(GUIDES[k].sec); else go("guide-" + k); }); }
};

/* ---------- Video series ---------- */
const PLAYLIST = { id: "PLUaEfmk4az31IJOwqyEBSCbxIwF1XJAga", title: "" + BIKE.short + " Restoration", by: "plaxsax" };
const VIDEOS = [["hZuJuWPuTsw", "9:29"], ["iUQD9i3cs0A", "9:02"], ["pT_gBdtKqt4", "10:16"], ["1PxYAUK-CvE", "11:51"], ["UuWMwMd2HYc", "10:49"], ["ShK1PRcjk-0", "11:09"], ["IKp8lTOAGho", "15:25"], ["4AK7pzgj3KA", "8:29"], ["5ZzxJ1Q0mro", "11:09"], ["9oyMwQYIaI4", "9:46"],
  ["7En5k7KkK-s", "12:11"], ["P_2j-3ZiFOE", "12:31"], ["6met71BS51M", "10:54"], ["TgstfUs6hRo", "12:40"], ["rbcg_pCPcaY", "13:06"], ["WE6BmX6fgMg", "13:44"], ["PbSLDo14zys", "18:47"], ["siM5wDtoNEA", "24:22"], ["AUKyA4Y_KRE", "14:04"], ["2SHZwb73vYs", "25:04"]];
const vidUrl = (id, i) => `https://www.youtube.com/watch?v=${id}&list=${PLAYLIST.id}&index=${i + 1}`;
const vidEmbed = (id, i) => `https://www.youtube-nocookie.com/embed/${id}?list=${PLAYLIST.id}&index=${i + 1}&rel=0&modestbranding=1`;
/* thumbnails come from one sprite published with the page (5 across, 4 down); videos can't be embedded in the page, so every play button opens YouTube */
const vidThumb = (i, cls = "") => `<span class="vthumb ${cls}" style="background-position:${(i % 5) * 25}% ${Math.floor(i / 5) * 100 / 3}%" aria-hidden="true"></span>`;
const totalRuntime = () => { const s = VIDEOS.reduce((a, [, d]) => { const [m, x] = d.split(":").map(Number); return a + m * 60 + x; }, 0); return `${Math.floor(s / 3600)} h ${Math.round(s % 3600 / 60)} min`; };
VIEWS.videos = {
  cur: 0,
  render() {
    const w = meta().videosWatched || {}, seen = VIDEOS.filter(([id]) => w[id]).length, cur = this.cur, [cid, cdur] = VIDEOS[cur];
    return `${pageHead("videos")}
    <section class="vplayer">
      <div class="vframe" id="vFrame"><a class="vposter" id="vPlay" href="${vidUrl(cid, cur)}" target="_blank" rel="noopener" aria-label="Watch part ${cur + 1} on YouTube (opens a new tab)">
        ${vidThumb(cur, "big")}
        <span class="vp-btn">${ic("play")}</span><span class="vp-cap"><b>Part ${cur + 1}</b> · ${cdur}${window.claude && window.claude.use ? " · plays on YouTube" : ""}</span></a></div>
      <div class="vside stack">
        <div class="eyebrow">Now showing</div><h2 class="disp" style="margin:0">Part ${cur + 1} of ${VIDEOS.length}</h2>
        <p class="muted" style="margin:0">${esc(PLAYLIST.title)} by ${esc(PLAYLIST.by)} · ${cdur}</p><p class="hint-text" style="text-align:left;margin:0">${window.claude && window.claude.use ? "Press play and the video opens on YouTube in a new tab. YouTube videos can't play inside this page." : "Press play to watch it here."}</p>
        <div class="row">${ME.canWrite ? `<button class="btn ${w[cid] ? "" : "pri"}" data-watch="${cid}">${w[cid] ? ic("tick") + " Watched" : "Mark as watched"}</button>` : ""}<a class="btn" href="${vidUrl(cid, cur)}" target="_blank" rel="noopener">Open on YouTube ${ic("ext")}</a></div>
        <div class="row"><button class="btn sm" data-vnav="-1" ${cur === 0 ? "disabled" : ""}>${ic("back")} Previous</button><button class="btn sm" data-vnav="1" ${cur === VIDEOS.length - 1 ? "disabled" : ""}>Next ${ic("next")}</button></div>
        <div class="vstat"><div><b>${VIDEOS.length}</b><span>videos</span></div><div><b>${totalRuntime()}</b><span>total</span></div><div><b>${seen}/${VIDEOS.length}</b><span>watched</span></div></div>
        <div class="progress"><i style="width:${seen / VIDEOS.length * 100}%"></i></div>
        <div>${askBtn(`I'm watching a YouTube series where someone restores a ${BIKE.make + " " + BIKE.short} (part ${cur + 1} of 20). What should I watch for, and what should I double-check in my factory manual before copying anything they do?`, "this video", "btn sm ask")}</div>
      </div>
    </section>
    <section class="stack"><div class="sechead"><div class="eyebrow">All episodes</div><h2 class="disp">The full series</h2><p>Click a part to pick it, or the arrow to watch it on YouTube.</p></div>
      <div class="vgrid">${VIDEOS.map(([id, d], i) => `<div class="vcard ${i === cur ? "on" : ""} ${w[id] ? "seen" : ""}"><button class="vc-main" data-vid="${i}">${vidThumb(i, "sm")}<span class="vc-t"><b>Part ${i + 1}</b><small>${d}${w[id] ? " · watched" : ""}</small></span><span class="vc-p">${ic(w[id] ? "tick" : "play")}</span></button><a class="vc-yt" data-i="${i}" href="${vidUrl(id, i)}" target="_blank" rel="noopener" aria-label="Open part ${i + 1} on YouTube">${ic("ext")}</a></div>`).join("")}</div>
      <p class="hint-text" style="text-align:center">Videos by ${esc(PLAYLIST.by)} on YouTube. <a href="https://www.youtube.com/playlist?list=${PLAYLIST.id}" target="_blank" rel="noopener">Open the whole playlist</a>.</p></section>`;
  },
  bind(root) {
    const self = this;
    const markSeen = async id => { if (!ME.canWrite || (meta().videosWatched || {})[id]) return; const m = clone(meta()); m.videosWatched = Object.assign({}, m.videosWatched || {}, { [id]: today() }); try { await store.put("meta", m, { action: `watched video part ${VIDEOS.findIndex(v => v[0] === id) + 1}` }); } catch (e) {} };
    // On the standalone website YouTube can play right here; inside a Claude artifact the link opens YouTube instead.
    const canEmbed = !(window.claude && window.claude.use);
    $("#vPlay", root) && ($("#vPlay", root).onclick = e => { const [id] = VIDEOS[self.cur]; markSeen(id);
      if (!canEmbed) return; e.preventDefault();
      $("#vFrame", root).innerHTML = `<iframe src="${vidEmbed(id, self.cur)}&autoplay=1" title="${BIKE.short} restoration part ${self.cur + 1}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`; });
    $$(".vc-yt", root).forEach(a => a.addEventListener("click", () => { const i = +a.dataset.i; if (VIDEOS[i]) markSeen(VIDEOS[i][0]); }));
    $$("[data-vid]", root).forEach(b => b.onclick = () => { self.cur = +b.dataset.vid; render(false); window.scrollTo({ top: 0, behavior: "smooth" }); });
    $$("[data-vnav]", root).forEach(b => b.onclick = () => { self.cur = Math.max(0, Math.min(VIDEOS.length - 1, self.cur + +b.dataset.vnav)); render(false); });
    $$("[data-watch]", root).forEach(b => b.onclick = async () => { const m = clone(meta()); m.videosWatched = Object.assign({}, m.videosWatched || {}); const id = b.dataset.watch; if (m.videosWatched[id]) delete m.videosWatched[id]; else m.videosWatched[id] = today(); await store.put("meta", m, { action: `${m.videosWatched[id] ? "watched" : "unmarked"} video part ${VIDEOS.findIndex(v => v[0] === id) + 1}` }); });
  }
};

/* "Know every piece": which 3D diagrams belong to each picture on the home page */
const GALLERY_DIAG = {
  engine: /^(Camshaft|Crankshaft|Clutch|Cam Chain|Clutch Release|Crankcase|Cylinder|Cylinder Head|Cylinder Head Cover|Gear Shifting|Kick Starter|Oil Pan|Oil Pump|Starter Clutch|Transmission)\b/,
  brakeF: /^(Front fork leg|Front brake caliper|Front wheel|Front Brake Hose|Front Calipers|Front Fork|Front Master Cylinder|Front Wheel|Steering Stem|Handlebar)/,
  gauges: /^(Speedometer|Headlamp|Left Handle Switch|Right Handle Switch|Handlebar)/,
  tank: /^(Fuel Tank|Fuel Cock)/,
  exhaust: /^Muffler/,
  shocks: /^(Rear Wheel|Rear Swinging Arm|Rear Calipers|Rear Brake Hose|Rear Master Cylinder|Chain Case|Rear Fender|Rear Combination Lamp)/,
};
function galleryDiags(g) { const rx = GALLERY_DIAG[g]; return rx && typeof D3_MODELS !== "undefined" ? DIAGRAMS.filter(d => D3_MODELS[d.id] && rx.test(d.title)) : []; }
function galleryOpen(g) {
  const list = galleryDiags(g), G = GALLERY.find(x => x[3] === g) || [];
  const open = id => { closeModal(); DV.ret = "home"; DV.id = null; go("diagram-" + id); };
  if (!list.length) return; if (list.length === 1) { open(list[0].id); return; }
  modal(`<div class="galpick stack"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h3 style="margin:0">${esc(G[1] || "Diagrams")}: pick a 3D diagram</h3><button class="linkbtn" data-galx aria-label="Close">✕</button></div>
    <div class="galgrid">${list.map(d => `<button class="galitem" data-galgo="${d.id}">${D3_THUMBS[d.id] ? `<img src="${D3_THUMBS[d.id]}" alt="" loading="lazy">` : `<span class="galph">${ic("cube")}</span>`}<b>${esc(d.title)}</b>${d.models && list.filter(x => x.title === d.title).length > 1 ? `<small>${esc(d.models)}</small>` : ""}</button>`).join("")}</div></div>`, m => {
    m.classList.add("galmodal");
    $$("[data-galgo]", m).forEach(b => b.onclick = () => open(b.dataset.galgo));
    $("[data-galx]", m).onclick = closeModal;
  });
}
