/* ============ loader ============
   Runs before the app. Decides what to show:
     ?project=<id>  open a saved project (needs sign-in)
     ?bike=<id>     try a bike without an account (saved in this browser only)
     nothing        signed in: My projects. Signed out: the last bike you opened, or the bike search.
   Accounts only switch on when window.RV_CONFIG has the Supabase URL and key. */
(function () {
  const CFG = window.RV_CONFIG || {};
  const qs = new URLSearchParams(location.search);
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const app = document.getElementById("app");
  let sb = null, session = null, profile = null, INDEX = [];

  const url = params => { const u = new URL(location.href); u.search = ""; u.hash = ""; Object.entries(params || {}).forEach(([k, v]) => u.searchParams.set(k, v)); return u.toString(); };
  const goUrl = params => { location.href = url(params); };
  async function getJson(u) { const r = await fetch(u, { cache: "no-cache" }); if (!r.ok) throw new Error(u + " " + r.status); return r.json(); }
  function loadScript(src) { return new Promise((ok, bad) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = bad; document.head.appendChild(s); }); }
  const bikeOf = id => INDEX.find(b => b.id === id);
  const bikeName = b => b ? `${b.year} ${b.make} ${b.model}` : "Unknown bike";

  /* ---------- page frame ---------- */
  function frame(inner, opts = {}) {
    const right = !sb ? "" : session
      ? `<div class="pk-acct"><button class="linkbtn" data-nav="projects">Your garage</button><span class="muted">${esc(profile?.display_name || session.user.email)}</span><button class="btn sm" data-act="signout">Sign out</button></div>`
      : `<div class="pk-acct"><button class="btn sm" data-nav="signin">Sign in</button><button class="btn sm pri" data-nav="signup">Create account</button></div>`;
    app.innerHTML = `<div class="pick${opts.garage ? " is-garage" : ""}"><div class="pk-top"><button class="pk-logo" data-nav="home" aria-label="Revora home"><img class="brand-icon" src="img/revora-icon.svg" alt=""><img class="wordmark" src="img/revora-word.svg" alt="Revora"></button>${right}</div><div class="pick-in ${opts.wide ? "wide" : ""}">${inner}</div></div>`;
  }
  const fail = msg => frame(`<h1 class="disp">Something went wrong</h1><p class="muted">${esc(msg)}</p><button class="btn pri" data-act="reload">Try again</button>`);
  const spin = () => frame(`<div class="spinner"></div>`);
  let toastT; function note(msg, bad) { let t = document.getElementById("pkNote"); if (!t) { t = document.createElement("div"); t.id = "pkNote"; document.body.appendChild(t); } t.className = "pk-note" + (bad ? " bad" : ""); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 5000); }

  /* ---------- bike search ---------- */
  function match(b, q) {
    const words = String(q || "").toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return true;
    const hay = norm([b.year, b.make, b.model, b.variant, b.name, ...(b.match || [])].join(" "));
    return words.every(w => hay.includes(norm(w)) || (/^\d{2}$/.test(w) && String(b.year).endsWith(w)));
  }
  function card(b, goal) {
    const x = b.extras || {};
    const tags = goal === "maintain" ? `<span class="tag">Maintenance log</span><span class="tag">Parts & jobs</span><span class="tag">Receipts</span>`
      : `${b.diagrams ? `<span class="tag">${b.diagrams} parts diagrams</span>` : ""}<span class="tag">Course</span><span class="tag">Parts list</span><span class="tag">Maintenance log</span>${x.diagrams3d ? `<span class="tag pro">3D</span>` : ""}`;
    return `<button class="pick-card" data-bike="${esc(b.id)}"><span class="pick-yr">${esc(b.year)}</span><b>${esc(b.make)} ${esc(b.model)}</b><span class="muted">${esc(b.variant || "")}</span>
      <span class="pick-tags">${tags}</span></button>`;
  }
  /* ---------- bike requests ---------- */
  const REQ_DAYS = 3;
  const reqKey = (y, mk, md) => [y, mk, md].map(norm).join("-");
  const etaDate = created => { const d = new Date(created || Date.now()); d.setDate(d.getDate() + REQ_DAYS); return d; };
  const etaTxt = (created, status) => status === "Added" ? "Ready now" : etaDate(created) < new Date() ? "Ready any day now" : "Estimated ready by " + etaDate(created).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  function guessBike(q) {
    const w = String(q || "").trim().split(/\s+/).filter(Boolean); let year = ""; const rest = [];
    w.forEach(x => { if (!year && /^(19|20)\d{2}$/.test(x)) year = x; else if (!year && /^\d{2}$/.test(x)) year = (+x > 30 ? "19" : "20") + x; else rest.push(x); });
    const make = rest[0] ? rest[0][0].toUpperCase() + rest[0].slice(1) : "";
    return { year, make, model: rest.slice(1).map(x => /\d/.test(x) ? x.toUpperCase() : x[0].toUpperCase() + x.slice(1)).join(" ") };
  }
  const BIKE_STYLES = [["standard", "Standard / naked"], ["cruiser", "Cruiser"], ["sport", "Sport"], ["adventure", "Adventure"], ["dualsport", "Dual-sport / dirt"], ["touring", "Touring"], ["cafe", "Cafe racer / classic"], ["scooter", "Scooter"]];
  // a sensible first guess at the kind of bike from the model name; the user can change it
  function guessStyle(make, model) {
    const s = (make + " " + model).toLowerCase();
    if (/strom|africa|gs\s?\d{3,4}\s?(adv|gs)|tenere|tiger|ktm.*adv|versys|tracer|adv|multistrada|transalp|klr|nc750x|crf1100/.test(s)) return /klr|drz|xr|crf|wr|exc|klx|dr\d/.test(s) ? "dualsport" : "adventure";
    if (/drz|xr\d|crf|wr\d|exc|klx|dr\d{3}|xt\d|ttr|yz|rm\d|kx\d|cr\d/.test(s)) return "dualsport";
    if (/harley|softail|sportster|dyna|shadow|vulcan|boulevard|intruder|virago|v-?star|rebel|indian|bolt|fat|road king|vt\d|vn\d/.test(s)) return /road king|glide|gold ?wing|electra/.test(s) ? "touring" : "cruiser";
    if (/glide|gold ?wing|fjr|concours|k1600|rt\b|st1300|voyager/.test(s)) return "touring";
    if (/cbr|gsx-?r|ninja|zx-?\d|yzf|r1\b|r6\b|panigale|rsv|daytona|sv650s|hayabusa|busa/.test(s)) return "sport";
    if (/cafe|thruxton|bonneville|w650|w800|sr400|xsr|scrambler|gs\d{3}|cb\d{3}|kz\d|xs\d{3}|rd\d{3}/.test(s)) return "cafe";
    if (/vespa|scooter|burgman|pcx|ruckus|metropolitan|grom/.test(s)) return "scooter";
    return "standard";
  }
  function reqFormHtml(goal) {
    const keep = goal === "maintain";
    return `<form class="pk-req" id="reqF" data-goal="${keep ? "maintain" : "restore"}" novalidate><div class="pk-req-h"><b>Add your bike</b><span class="muted">${keep ? "Year, make and model is all it takes. You get a maintenance log, a parts and jobs tracker and a place for receipts. Pick the kind of bike so its picture matches." : "Year, make and model is all it takes. You get a full restoration course, parts list, safety checks and maintenance log, tailored to the kind of bike you pick."}</span></div>
      <div class="pk-req-row"><label>Year<input name="year" inputmode="numeric" maxlength="4" placeholder="${keep ? "2012" : "1981"}" autocomplete="off"></label><label>Make<input name="make" placeholder="${keep ? "Suzuki" : "Honda"}" autocomplete="off"></label><label class="wide">Model<input name="model" placeholder="${keep ? "V-Strom 650" : "CB750F"}" autocomplete="off"></label></div>
      <div class="pk-req-row two"><label>Kind of bike<select name="style">${BIKE_STYLES.map(([k, t]) => `<option value="${k}">${t}</option>`).join("")}</select></label>
        ${keep ? "" : `<label id="pkDrive">Final drive<select name="drive">${DRIVES.map(([k, t]) => `<option value="${k}">${t}</option>`).join("")}</select></label>`}</div>
      ${keep ? "" : `<div class="pk-style" id="pkStyle"></div>`}
      <div class="pk-req-go"><button class="btn pri" type="submit">${keep ? "Start my maintenance log" : "Start my restoration"}</button></div></form>`;
  }
  const DRIVES = [["chain", "Chain"], ["belt", "Belt"], ["shaft", "Shaft"]];
  // a first guess at how power gets to the back wheel; the rider can change it
  function guessDrive(make, model, style) {
    const s = (make + " " + model).toLowerCase();
    if (style === "scooter") return "cvt";
    if (/harley|h-?d\b|buell|indian|victory|vulcan ?(900|1700|2000)|\bbolt\b|stryker|roadliner|stratoliner|raider|v-?rod/.test(s)) return "belt";
    if (/bmw.*\b[rk] ?\d|moto ?guzzi|guzzi|gold ?wing|gl ?\d{3,4}|st ?1[13]00|pan.?european|fjr|venture|royal star|v-?star ?1[13]00|xs ?(750|850|1100)|xj ?(650|750|900)|concours|1400 ?gtr|voyager|nomad|vulcan ?(1500|1600)|shadow|vt ?1100|vtx|fury|sabre|valkyrie|intruder|vs ?(800|1400)|boulevard|m109|c50|m50|c90|cx ?\d{3}|gs ?(850|1000g|1100g|1150)|rocket|trophy|super ?tenere|xt1200z|tiger explorer/.test(s)) return "shaft";
    return style === "touring" ? "shaft" : style === "cruiser" && /honda|yamaha|suzuki|kawasaki/.test(s) ? "shaft" : style === "cruiser" ? "belt" : "chain";
  }
  // what the restoration course covers for each kind of bike, shown under the form
  const STYLE_TXT = { standard: "Simple bodywork, exposed engine, tank and side cover paint.", cruiser: "Big twin and primary drive, saddlebags and accessories, chrome and tins.", sport: "Fairings and crash damage, liquid cooling, adjustable suspension.", adventure: "Crash bars and skid plate, luggage, long-travel suspension, spokes.", dualsport: "Foam air filter, spokes and tubes, bearings, plastics and graphics.", touring: "Fairing and luggage, accessories, linked or ABS brakes.", cafe: "Carbs and points, old wiring, spoked wheels, paint, chrome and period details.", scooter: "CVT belt and rollers, body panels and clips, vacuum petcock." };
  async function submitReq(r) {
    const key = reqKey(r.year, r.make, r.model), label = `${r.year} ${r.make} ${r.model}`.replace(/\s+/g, " ").trim();
    const { error } = await sb.rpc("vote_bike", { k: key, l: label });
    if (error) throw error;
    const { data } = await sb.from("bike_requests").select("*").eq("key", key).maybeSingle();
    return data || { key, label, status: "Queued", created_at: new Date().toISOString() };
  }
  async function flushPendingReq() {
    let r = null; try { r = JSON.parse(ls.get("rv.pendingReq") || "null"); } catch (e) {}
    if (!r || !session) return;
    try { const row = await submitReq(r); ls.set("rv.pendingReq", ""); note(`Requested the ${row.label}. ${etaTxt(row.created_at, row.status)}.`); } catch (e) {}
  }
  const labelOf = r => `${r.year} ${r.make} ${r.model}`.replace(/\s+/g, " ").trim();
  // the library bike that answers a request, if it's been added
  function packForKey(key) {
    if (!key) return null;
    const [y, mk, ...rest] = key.split("-"), mdl = rest.join("");
    return INDEX.find(b => !b.generic && !b.universal && ((b.reqKeys || []).includes(key) || (String(b.year) === y && norm(b.make) === mk && [b.model, b.short, ...(b.match || [])].some(m => norm(m) === mdl)))) || null;
  }
  // a project for a bike that isn't in the library yet: request it, then open the general bike with the user's year, make and model
  // goal "maintain": just a maintenance log for the bike, nothing to request. Otherwise the bike is requested so its course can be built.
  async function startGeneric(r, goal) {
    const keep = goal === "maintain", key = reqKey(r.year, r.make, r.model), label = labelOf(r);
    const m = { id: "project", projectName: label, bike: label, year: r.year, make: r.make, model: r.model, style: r.style || guessStyle(r.make, r.model), goal: keep ? "maintain" : "restore", units: "in", currency: "USD", baseBudget: 0, contingencyPct: 10, budgetChanges: [], meshMap: {}, archived: false };
    if (r.silhouette) m.silhouette = r.silhouette;
    if (!keep) { m.requestKey = key; m.requestedAt = new Date().toISOString(); }
    if (sb && session) {
      spin();
      if (!keep) try { await submitReq(r); } catch (e) {}
      const { data, error } = await sb.from("projects").insert({ bike_id: "custom-bike", name: label }).select("id").single();
      if (error) return fail(friendly(error));
      await sb.from("records").upsert({ project_id: data.id, coll: "meta", rec_id: "project", data: m });
      return goUrl({ project: data.id });
    }
    // no account: keep it in this browser (one general bike at a time)
    let cur = null; try { cur = JSON.parse(ls.get("rv.data.custom-bike") || "null"); } catch (e) {}
    const curName = cur && cur.meta && cur.meta.project && cur.meta.project.bike;
    if (curName && curName !== label && !confirm(`This browser already has a ${cur.meta.project.goal === "maintain" ? "maintenance log" : "project"} for the ${curName}. Replace it with the ${label}? Create a free account to keep more than one.`)) return;
    if (sb && !keep) ls.set("rv.pendingReq", JSON.stringify(r));
    ls.set("rv.data.custom-bike", JSON.stringify(curName === label ? cur : { meta: { project: m } }));
    ls.set("rv.bike", "custom-bike"); goUrl({ bike: "custom-bike" });
  }
  const universalFor = style => bikeOf("restore-" + (style || "standard")) || bikeOf("restore-standard");
  async function startRestore(r) {
    const label = labelOf(r), style = r.style || guessStyle(r.make, r.model), pack = universalFor(style), drive = (pack && pack.style === "scooter") ? "cvt" : r.drive || guessDrive(r.make, r.model, style);
    if (!pack) return fail("Couldn't find the restoration course. Reload the page and try again.");
    const m = { id: "project", projectName: label, bike: label, year: r.year, make: r.make, model: r.model, style: pack.style, drive, goal: "restore", units: "in", currency: "USD", baseBudget: 0, contingencyPct: 20, budgetChanges: [], meshMap: {}, archived: false,
      expenseCategories: ["Parts", "Kits and gaskets", "Fluids", "Tires", "Brake parts", "Electrical parts", "Paint and finish", "Tools", "Shop labor", "Other"] };
    if (r.silhouette) m.silhouette = r.silhouette;
    if (sb && session) {
      spin();
      const { data, error } = await sb.from("projects").insert({ bike_id: pack.id, name: label }).select("id").single();
      if (error) return fail(friendly(error));
      await sb.from("records").upsert({ project_id: data.id, coll: "meta", rec_id: "project", data: m });
      return goUrl({ project: data.id });
    }
    // no account: keep it in this browser (one restoration per kind of bike)
    const cur = localMeta(pack.id), curName = cur && cur.bike;
    if (curName && curName !== label && !confirm(`This browser already has a restoration for the ${curName}. Replace it with the ${label}? Create a free account to keep more than one.`)) return;
    if (curName !== label) ls.set("rv.data." + pack.id, JSON.stringify({ meta: { project: m } }));
    ls.set("rv.bike", pack.id); goUrl({ bike: pack.id });
  }
  async function connectProject(p, pack) {
    if (!confirm(pack.universal ? `Start the restoration course for "${p.name}"? Its steps, parts list and safety checks get added, and everything you've logged stays.` : `Connect "${p.name}" to the ${bikeName(pack)} page? Its course, parts list and service schedule get added, and everything you've logged stays.`)) return;
    spin();
    const { error } = await sb.from("projects").update({ bike_id: pack.id }).eq("id", p.id);
    if (error) return fail(friendly(error));
    const { data: rec } = await sb.from("records").select("data").eq("project_id", p.id).eq("coll", "meta").eq("rec_id", "project").maybeSingle();
    const md = rec && rec.data || {};
    await sb.from("records").upsert({ project_id: p.id, coll: "meta", rec_id: "project", data: Object.assign({}, md, { mergePack: pack.id }, pack.universal ? { drive: md.drive || guessDrive(md.make || "", md.model || "", pack.style), style: pack.style } : {}) });
    goUrl({ project: p.id });
  }
  // no account: move this browser's general bike onto the real bike's page
  function connectLocal(pack) {
    let cur = null; try { cur = JSON.parse(ls.get("rv.data.custom-bike") || "null"); } catch (e) {}
    if (!cur) return;
    if (ls.get("rv.data." + pack.id) && !confirm(`This browser already has a ${bikeName(pack)} project. Replace it with your records?`)) return;
    cur.meta.project.mergePack = pack.id; if (pack.universal) { const md = cur.meta.project; md.drive = md.drive || guessDrive(md.make || "", md.model || "", pack.style); md.style = pack.style; } ls.set("rv.data." + pack.id, JSON.stringify(cur)); ls.set("rv.data.custom-bike", "");
    ls.set("rv.bike", pack.id); goUrl({ bike: pack.id });
  }
  function localMeta(id) { try { const d = JSON.parse(ls.get("rv.data." + id) || "null"); return d && d.meta && d.meta.project; } catch (e) { return null; } }
  const localGeneric = () => localMeta("custom-bike");
  async function myRequests() {
    if (!sb || !session) return [];
    const { data } = await sb.from("bike_requests").select("*").contains("votes", [session.user.id]).order("created_at", { ascending: false });
    return data || [];
  }
  const reqListHtml = rows => rows.length ? `<section class="pk-reqs"><h2>Bikes you requested</h2>${rows.map(r => `<div class="pk-reqi"><b>${esc(r.label)}</b>${(() => { const ok = r.status === "Added" || !!packForKey(r.key); return `<span class="pk-reqs-st ${ok ? "ok" : ""}">${ok ? "Ready" : "In progress"}</span><span class="muted">${esc(ok ? "Search for it to start a project, or connect your project from the garage" : etaTxt(r.created_at, r.status))}</span>`; })()}</div>`).join("")}</section>` : "";
  function bindReqForm(form, onDone) {
    form.addEventListener("input", e => { if (e.target.name) e.target.dataset.touched = "1"; });
    form.querySelector("[data-startnow]")?.addEventListener("click", () => { form.dataset.now = "1"; form.requestSubmit(); });
    form.onsubmit = async e => {
      e.preventDefault();
      const now = form.dataset.now === "1"; form.dataset.now = "";
      const r = { year: form.year.value.trim(), make: form.make.value.trim(), model: form.model.value.trim(), style: form.style.value, drive: form.drive ? form.drive.value : "" };
      if (!/^(19|20)\d{2}$/.test(r.year)) { note("Enter the 4-digit year, like 1981.", true); form.year.focus(); return; }
      if (!r.make) { note("Enter the make, like Honda.", true); form.make.focus(); return; }
      if (!r.model) { note("Enter the model, like CB750F.", true); form.model.focus(); return; }
      if (form.dataset.goal === "maintain") return startGeneric(r, "maintain");
      if (form.dataset.goal === "restore") return startRestore(r);
      if (now) return startGeneric(r);
      if (!sb || !session) { ls.set("rv.pendingReq", JSON.stringify(r)); if (!sb) { note("Requests need an account, and accounts aren't set up on this site yet.", true); return; } showAuth("signup"); note("Create a free account and we'll send in your request for the " + r.year + " " + r.make + " " + r.model + "."); return; }
      const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Sending…";
      try { const row = await submitReq(r); onDone(row); }
      catch (err) { btn.disabled = false; btn.textContent = "Request it"; note(friendly(err), true); }
    };
  }

  const GOALS = { restore: ["I'm restoring it", "A step-by-step restoration course, parts list and safety checks, tailored to your kind of bike. Works for any bike."], maintain: ["I'm keeping it running", "Log services, see what's due, and keep parts, jobs and receipts in one place. Works for any bike."] };
  function showPicker(mode, goalIn) { // mode "try" (no account) or "new" (start a project)
    let goal = goalIn || (qs.get("goal") in GOALS ? qs.get("goal") : "");
    document.title = mode === "new" ? "New project · Revora" : "Find your bike · Revora";
    const makes = [...new Set(INDEX.filter(b => !b.generic && !b.universal).map(b => b.make))].sort();
    const head = !goal ? `<div class="eyebrow">${mode === "new" ? "New project" : "Add your bike"}</div><h1 class="disp">What are you doing with your bike?</h1><p class="muted">This sets up your bike's page. You can start restoring later from the menu.</p>`
      : goal === "maintain" ? `<div class="eyebrow">Maintenance and records</div><h1 class="disp">Which bike is it?</h1><p class="muted">Search for it, or add it with the year, make and model. Any bike works.</p>`
      : `<div class="eyebrow">${mode === "new" ? "New project" : "Motorcycle restoration"}</div><h1 class="disp">Which bike are you restoring?</h1><p class="muted">Any bike works. Search for it, or add it with the year, make and model, and you get a step-by-step restoration course built for its kind of bike.</p>`;
    frame(`${head}
      <div class="pk-goal" role="radiogroup" aria-label="What are you doing with your bike?">${Object.entries(GOALS).map(([k, [t, d]]) => `<button type="button" class="pk-goal-o${goal === k ? " on" : ""}" role="radio" aria-checked="${goal === k}" data-goal="${k}"><span class="pk-goal-dot" aria-hidden="true"></span><b>${t}</b><span class="muted">${d}</span></button>`).join("")}</div>
      ${goal ? `<div class="pick-search"><input type="search" id="pickQ" placeholder="Year, make, model, e.g. ${goal === "maintain" ? "2012 Suzuki V-Strom 650" : "1977 Suzuki GS750"}" autocomplete="off" aria-label="Search for your bike"></div>
      <div class="pick-makes">${makes.map(m => `<button class="chip" data-make="${esc(m)}">${esc(m)}</button>`).join("")}</div>
      <div class="pick-list" id="pickList"></div>
      <div class="pk-reqwrap" id="pickReq"></div>` : ""}
      ${mode === "try" && sb && !session ? `<p class="muted pk-small">Trying it without an account saves to this browser only. <button class="linkbtn" data-nav="signup">Create a free account</button> to keep your project and share it with your team.</p>` : ""}`, { wide: true });
    app.querySelector(".pk-goal").onclick = e => { const o = e.target.closest("[data-goal]"); if (!o || o.dataset.goal === goal) return; ls.set("rv.goal", o.dataset.goal); showPicker(mode, o.dataset.goal); setTimeout(() => document.getElementById("pickQ")?.focus(), 30); };
    const lg = !session && localGeneric(), lgPack = lg && packForKey(lg.requestKey);
    if (lg) app.querySelector(".pick-in").insertAdjacentHTML("afterbegin", lgPack ? `<div class="pk-ready"><b>The ${esc(bikeName(lgPack))} page is ready.</b><span>Move your ${esc(lg.bike)} records onto it to get its course, parts list and service schedule.</span><button class="btn tan" data-connect-local>Connect my project</button></div>` : `<div class="pk-ready plain"><b>Your ${esc(lg.bike)} ${lg.goal === "maintain" ? "maintenance log" : "project"}</b><span>${lg.goal === "maintain" ? "Saved in this browser." : "Saved in this browser while we build the bike's page."}</span><button class="btn" data-open-local>Open it</button></div>`);
    app.querySelector("[data-connect-local]")?.addEventListener("click", () => connectLocal(lgPack));
    app.querySelector("[data-open-local]")?.addEventListener("click", () => { ls.set("rv.bike", "custom-bike"); goUrl({ bike: "custom-bike" }); });
    if (!goal) return;
    const keep = goal === "maintain";
    const q = document.getElementById("pickQ"), list = document.getElementById("pickList");
    const reqBox = document.getElementById("pickReq"); let reqOpen = false;
    const styleNote = () => { const f = document.getElementById("reqF"), box = document.getElementById("pkStyle"), dv = document.getElementById("pkDrive"); if (f && dv) { dv.hidden = f.style.value === "scooter"; if (!f.drive.dataset.touched) f.drive.value = guessDrive(f.make.value, f.model.value, f.style.value) === "cvt" ? "chain" : guessDrive(f.make.value, f.model.value, f.style.value); } if (f && box) box.innerHTML = `<b>Tailored for a ${esc((BIKE_STYLES.find(x => x[0] === f.style.value) || [, ""])[1].toLowerCase())}</b><span class="muted">${esc(STYLE_TXT[f.style.value] || "")}${f.style.value === "scooter" ? "" : " " + esc((DRIVES.find(x => x[0] === f.drive.value) || [, "Chain"])[1]) + " drive steps."} Plus the full core restoration: inspection, electrical, fuel, engine, wheels, brakes, suspension and a road test.</span>`; };
    const fillReq = () => { const f = document.getElementById("reqF"); if (!f) return; const g = guessBike(q.value); ["year", "make", "model"].forEach(k => { if (!f[k].dataset.touched) f[k].value = g[k]; }); if (!f.style.dataset.touched) f.style.value = guessStyle(f.make.value, f.model.value); styleNote(); };
    const done = row => { reqBox.innerHTML = `<div class="pk-req done"><b>Request sent: ${esc(row.label)}</b><span>${esc(etaTxt(row.created_at, row.status))}. When it's ready it shows up in this search${mode === "new" ? " and you can start a project on it" : ""}.</span><button class="btn tan sm" data-startrow>Start my project now</button></div>`; reqBox.querySelector("[data-startrow]").onclick = () => { const [y, mk, ...md] = row.label.split(" "); startGeneric({ year: y, make: mk, model: md.join(" ") }); }; drawMine(); };
    const openReq = () => { reqOpen = true; reqBox.innerHTML = reqFormHtml(goal); fillReq(); const f = document.getElementById("reqF"); bindReqForm(f, done); f.addEventListener("change", e => { if (["style", "make", "model", "year"].includes(e.target.name)) { if (e.target.name !== "style" && !f.style.dataset.touched) f.style.value = guessStyle(f.make.value, f.model.value); styleNote(); } }); };
    const drawMine = () => {};
    const draw = () => {
      const hits = INDEX.filter(b => !b.generic && !b.universal && match(b, q.value)).sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model) || a.year - b.year);
      list.innerHTML = hits.length ? hits.map(b => card(b, goal)).join("") : keep ? "" : `<div class="pick-none"><b>No problem, any bike works.</b><span class="muted">Add it below and pick the kind of bike. The restoration course is tailored to it.</span></div>`;
      if (!hits.length) { if (!reqOpen) openReq(); else fillReq(); }
      else if (!reqOpen) reqBox.innerHTML = `<button class="linkbtn pk-reqlink" type="button">Don't see your bike? Add it</button>`;
      else fillReq();
    };
    reqBox.addEventListener("click", e => { if (e.target.closest(".pk-reqlink")) { openReq(); document.querySelector("#reqF input[name=year]")?.focus(); } });
    q.oninput = draw; draw(); drawMine();
    list.onclick = async e => {
      const el = e.target.closest("[data-bike]"); if (!el) return;
      if (keep) { const b = bikeOf(el.dataset.bike); return startGeneric({ year: String(b.year), make: b.make, model: b.model, style: b.style, silhouette: b.silhouette }, "maintain"); }
      if (mode === "new") await createProject(el.dataset.bike); else { ls.set("rv.bike", el.dataset.bike); goUrl({ bike: el.dataset.bike }); }
    };
    app.querySelector(".pick-makes").onclick = e => { const m = e.target.closest("[data-make]"); if (m) { q.value = m.dataset.make; draw(); q.focus(); } };
  }

  /* ---------- accounts ---------- */
  // on the sign-up page: a way back to a project kept in this browser, and a way to look around first
  const guestLinks = () => { const last = ls.get("rv.bike"), b = last && bikeOf(last);
    return (b ? `<span>Started without an account? <button class="linkbtn" data-open-guest="${esc(last)}">Open the ${esc(b.generic || b.universal ? "project" : bikeName(b))} saved on this browser</button></span>` : "")
      + `<span>Just looking? <button class="linkbtn" data-nav="projects">Browse the bikes first</button></span>`; };
  function showAuth(kind) {
    const T = { signin: ["Sign in", "Sign in"], signup: ["Create your account", "Create account"], forgot: ["Reset your password", "Email me a reset link"], newpass: ["Choose a new password", "Save password"] }[kind];
    document.title = T[0] + " · Revora";
    frame(`<h1 class="disp">${T[0]}</h1>${kind === "signup" ? `<p class="muted">Free. Your bike's restoration course, parts, jobs and maintenance log in one place, saved to your account and shareable with your team.</p>` : ""}
      <form class="pk-form" id="authF" novalidate>
        ${kind === "signup" ? `<label>Your name<input name="name" autocomplete="name" required></label>` : ""}
        ${kind !== "newpass" ? `<label>Email<input name="email" type="email" autocomplete="email" required></label>` : ""}
        ${kind !== "forgot" ? `<label>Password<input name="password" type="password" autocomplete="${kind === "signin" ? "current-password" : "new-password"}" minlength="8" required></label>` : ""}
        ${kind === "signup" || kind === "newpass" ? `<span class="muted pk-small">At least 8 characters.</span>` : ""}
        <div class="pk-err" id="authErr" hidden></div>
        <button class="btn pri big" type="submit">${T[1]}</button>
      </form>
      <div class="pk-links">${kind === "signin" ? `<button class="linkbtn" data-nav="forgot">Forgot your password?</button><span>No account? <button class="linkbtn" data-nav="signup">Create one</button></span>` : kind === "signup" ? `<span>Already have an account? <button class="linkbtn" data-nav="signin">Sign in</button></span>${guestLinks()}` : `<button class="linkbtn" data-nav="signin">Back to sign in</button>`}</div>`);
    const f = document.getElementById("authF"), err = document.getElementById("authErr");
    f.querySelector("input").focus();
    f.onsubmit = async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(f)); err.hidden = true;
      const btn = f.querySelector("button[type=submit]"); btn.disabled = true;
      const show = m => { err.textContent = m; err.hidden = false; btn.disabled = false; };
      if (d.email !== undefined && !/^\S+@\S+\.\S+$/.test(d.email)) return show("Enter a valid email address.");
      if (d.password !== undefined && d.password.length < 8) return show("Your password needs at least 8 characters.");
      if (kind === "signup" && !String(d.name || "").trim()) return show("Enter your name.");
      const back = url({});
      let r;
      if (kind === "signin") r = await sb.auth.signInWithPassword({ email: d.email, password: d.password });
      else if (kind === "signup") r = await sb.auth.signUp({ email: d.email, password: d.password, options: { data: { name: d.name.trim() }, emailRedirectTo: back } });
      else if (kind === "forgot") r = await sb.auth.resetPasswordForEmail(d.email, { redirectTo: back });
      else r = await sb.auth.updateUser({ password: d.password });
      if (r.error) return show(friendly(r.error));
      if (kind === "forgot") { frame(`<h1 class="disp">Check your email</h1><p class="muted">If there's an account for ${esc(d.email)}, a reset link is on its way.</p><button class="btn" data-nav="signin">Back to sign in</button>`); return; }
      if (kind === "signup" && !r.data.session) { frame(`<h1 class="disp">Check your email</h1><p class="muted">We sent a link to ${esc(d.email)}. Click it to finish creating your account.</p>`); return; }
      if (kind === "newpass") note("Password saved.");
      goUrl({});
    };
  }
  function friendly(e) {
    const m = String(e && e.message || e);
    if (/invalid login/i.test(m)) return "That email and password don't match. Check them, or reset your password.";
    if (/already registered/i.test(m)) return "There's already an account with that email. Try signing in.";
    if (/email not confirmed/i.test(m)) return "Confirm your email first. Check your inbox for the link.";
    if (/rate limit/i.test(m)) return "Too many tries. Wait a minute and try again.";
    if (/fetch|network/i.test(m)) return "Couldn't reach the server. Check your internet.";
    return m;
  }

  /* ---------- projects ---------- */
  /* ---------- the garage (signed-in home) ---------- */
  // progress for each project: how many course steps are done, and the next one to do
  async function projectProgress(ids) {
    const out = {}; ids.forEach(id => out[id] = { done: 0, total: 0, next: null });
    if (!ids.length) return out;
    const { data } = await sb.from("records").select("project_id,rec_id,status:data->>status,title:data->>title,phase:data->>phase,ord:data->>order,archived:data->>archived").eq("coll", "tasks").in("project_id", ids);
    const byP = {}; (data || []).forEach(t => { if (t.archived === "true" || t.status === "Cancelled") return; (byP[t.project_id] = byP[t.project_id] || []).push(t); });
    Object.entries(byP).forEach(([pid, ts]) => {
      ts.sort((a, b) => String(a.phase).localeCompare(String(b.phase)) || (+a.ord || 0) - (+b.ord || 0) || String(a.rec_id).localeCompare(String(b.rec_id), undefined, { numeric: true }));
      const o = out[pid]; o.total = ts.length; o.done = ts.filter(t => t.status === "Complete").length; o.next = (ts.find(t => t.status !== "Complete") || {}).title || null;
    });
    return out;
  }
  // a tachometer: the needle shows how much of the course is done, 0 to 100
  function tach(pct) {
    const R = 92, cx = 110, cy = 110, a0 = 240, sweep = 240, rad = d => (d - 90) * Math.PI / 180;
    const pt = (deg, r) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))].map(v => v.toFixed(2));
    const arc = (from, to, r) => { const [x1, y1] = pt(from, r), [x2, y2] = pt(to, r); return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`; };
    let ticks = "";
    for (let i = 0; i <= 50; i++) { const d = a0 + sweep * i / 50, big = i % 5 === 0, [x1, y1] = pt(d, R - (big ? 14 : 7)), [x2, y2] = pt(d, R); ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${big ? "tk big" : "tk"}${i >= 40 ? " red" : ""}"/>`; }
    let nums = ""; for (let i = 0; i <= 10; i++) { const [x, y] = pt(a0 + sweep * i / 10, R - 27); nums += `<text x="${x}" y="${y}" class="${i >= 8 ? "red" : ""}">${i}</text>`; }
    const deg = a0 + sweep * Math.max(0, Math.min(1, pct / 100));
    return `<svg class="tach" viewBox="0 0 220 196" role="img" aria-label="${Math.round(pct)}% of the course done">
      <path d="${arc(a0, a0 + sweep, R + 6)}" class="rim"/><path d="${arc(a0 + sweep * .8, a0 + sweep, R - 3)}" class="redzone"/>${ticks}${nums}
      <text x="110" y="160" class="pc">${Math.round(pct)}<tspan>%</tspan></text><text x="110" y="184" class="unit">course done</text>
      <g class="needle" style="--deg:${deg}deg"><line x1="110" y1="110" x2="110" y2="34"/><circle cx="110" cy="110" r="7"/></g></svg>`;
  }
  const silFile = n => n && ((CFG.sil) || []).find(x => x.replace(/\.\w+$/, "") === n);
  const benchArt = (b, style, sil) => { const f = silFile(sil) || b && !b.generic && silFile(b.silhouette) || silFile("bike-" + (style || (b && b.style) || "standard")) || silFile("bike-standard"); return f ? `<img class="bench-art" src="img/sil/${f}" alt="">` : ""; };
  function greeting() { const h = new Date().getHours(); return h < 5 ? "Late night in the garage" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }

  async function showProjects() {
    document.title = "Your garage · Revora"; spin();
    const { data, error } = await sb.from("my_projects").select("*").order("created_at", { ascending: false });
    if (error) return fail(friendly(error));
    const prog = await projectProgress(data.map(p => p.id));
    // projects on the general bike: which request they're waiting on, and whether that bike's page is ready
    const gen = data.filter(p => bikeOf(p.bike_id)?.generic || bikeOf(p.bike_id)?.universal), genKey = {}, genStyle = {}, genSil = {};
    if (gen.length) { const { data: ms } = await sb.from("records").select("project_id,key:data->>requestKey,style:data->>style,sil:data->>silhouette").eq("coll", "meta").in("project_id", gen.map(p => p.id)); (ms || []).forEach(m => { genKey[m.project_id] = m.key; genStyle[m.project_id] = m.style; genSil[m.project_id] = m.sil; }); }
    const isLog = p => bikeOf(p.bike_id)?.generic && !genKey[p.id];
    const isUni = p => !!bikeOf(p.bike_id)?.universal, uniTxt = p => (bikeOf(p.bike_id)?.styleName || "") + " restoration";
    const readyFor = p => bikeOf(p.bike_id)?.generic ? packForKey(genKey[p.id]) : null;
    const first = String(profile?.display_name || session.user.email || "").split(/[\s@]/)[0];
    const pins = (PREFS.pinned || []).filter(id => data.some(p => p.id === id)), isPin = p => pins.includes(p.id);
    data.sort((a, b) => (isPin(a) ? pins.indexOf(a.id) : 1e6) - (isPin(b) ? pins.indexOf(b.id) : 1e6));
    const theme = p => { let h = 0; for (const c of String(p.id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return isLog(p) ? ["th-blue", "th-sky", "th-sage"][h % 3] : ["th-tan", "th-ink", "th-tan", "th-sage"][h % 4]; };
    const lastId = ls.get("rv.project"), feat = data.find(p => p.id === lastId) || data[0];
    const pctOf = p => { const g = prog[p.id]; return g && g.total ? g.done / g.total * 100 : 0; };
    const who = p => p.role === "owner" ? (p.members > 1 ? `You and ${p.members - 1} other${p.members > 2 ? "s" : ""}` : "Just you") : p.role === "viewer" ? "Shared with you, view only" : "Shared with you";
    const tag = p => { const b = bikeOf(p.bike_id), g = prog[p.id], pc = pctOf(p); return `<article class="gt ${theme(p)}${isPin(p) ? " pinned" : ""}">
        <button class="gt-pin" data-pin="${esc(p.id)}" aria-pressed="${isPin(p)}" aria-label="${isPin(p) ? "Unpin" : "Pin"} ${esc(p.name || bikeName(b))}" title="${isPin(p) ? "Unpin" : "Pin to the top"}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg></button>
        <button class="gt-open" data-project="${esc(p.id)}" aria-label="Open ${esc(p.name || bikeName(b))}">
          <span class="gt-bike">${isPin(p) ? `<span class="gt-pintag">Pinned</span>` : ""}${isLog(p) ? "Maintenance log" : isUni(p) ? esc(uniTxt(p)) : b && b.generic ? (readyFor(p) ? "Bike page ready" : "Bike page coming soon") : esc((p.name && p.name !== bikeName(b)) ? bikeName(b) : (b && b.variant) || "")}</span><b class="gt-name">${esc(p.name || bikeName(b))}</b>
          ${isLog(p) ? "" : `<span class="gt-bar" aria-hidden="true"><i style="width:${pc.toFixed(1)}%"></i></span>`}
          <span class="gt-meta">${b && b.generic ? "Maintenance and records" : g && g.total ? `${g.done} of ${g.total} steps` : "Not started"}<span>${esc(who(p))}</span></span></button>
        ${p.role === "owner" && readyFor(p) ? `<div class="gt-ready"><span>The ${esc(bikeName(readyFor(p)))} page is ready.</span><button class="btn tan sm" data-connect="${esc(p.id)}">Connect</button></div>` : ""}${p.role === "owner" ? `<div class="gt-acts"><button class="linkbtn" data-share="${esc(p.id)}">Share</button><button class="linkbtn" data-rename="${esc(p.id)}">Rename</button></div>` : ""}</article>`; };
    const fb = feat && bikeOf(feat.bike_id), fg = feat && prog[feat.id];
    frame(`<section class="gh">
        <div class="gh-hi"><h1 class="gh-title">${esc(greeting())}${first ? `, ${esc(first)}` : ""}.</h1>
          <p class="muted">${data.length ? (data.length === 1 ? "One bike in your garage." : `${data.length} bikes in your garage.`) : "Your garage is empty. Add the bike you're working on to get started."}</p></div>
        ${feat ? `<div class="bench${isLog(feat) ? " nodial" : ""}">
          ${isLog(feat) ? "" : `<div class="bench-dial">${tach(pctOf(feat))}</div>`}
          <div class="bench-txt"><span class="bench-k">${lastId === feat.id ? "Last opened" : "Newest project"}</span>
            <h2>${esc(feat.name || bikeName(fb))}</h2><span class="bench-bike">${isLog(feat) ? "Maintenance log" : isUni(feat) ? esc(uniTxt(feat)) : fb && fb.generic ? (readyFor(feat) ? "The " + esc(bikeName(readyFor(feat))) + " page is ready to connect" : "We're building this bike's page") : esc([feat.name && feat.name !== bikeName(fb) ? bikeName(fb) : "", fb && fb.variant].filter(Boolean).join(", "))}</span>
            ${fg && fg.next ? `<div class="bench-next"><span>Next step</span><b>${esc(fg.next)}</b></div>` : fg && fg.total ? `<div class="bench-next"><span>Course</span><b>Every step is done. Time to ride.</b></div>` : ""}
            <div class="bench-go">${fb && fb.generic && readyFor(feat) && feat.role === "owner" ? `<button class="btn tan big" data-connect="${esc(feat.id)}">Connect to its page</button><button class="btn ghost-l" data-project="${esc(feat.id)}">Open project</button>` : `<button class="btn tan big" data-project="${esc(feat.id)}">Open project</button>`}<button class="btn ghost-l" data-nav="new">Start another bike</button></div></div>
          ${benchArt(fb, genStyle[feat.id], genSil[feat.id])}</div>`
        : `<div class="bench empty"><div class="bench-txt"><h2>Add your bike</h2><p>Restoring it? Get its parts diagrams, part numbers and a step-by-step course. Just keeping it running? Get a maintenance log with parts, jobs and receipts.</p>
            <div class="bench-go"><button class="btn tan big" data-nav="new">Add your bike</button></div></div>${benchArt()}</div>`}
      </section>
      ${data.length ? `<section class="garage"><div class="garage-h"><h2>Your garage</h2><button class="btn sm" data-nav="new">+ New project</button></div>
        <div class="gts">${data.map(tag).join("")}<button class="gt gt-new" data-nav="new"><b>Add a bike</b><span>Start a new project for another bike</span></button></div></section>` : ""}
      <section class="gfoot"><div><b>Working with a team?</b><span>Share a project and everyone sees the same parts, steps and photos, live. Owners can give edit or view access.</span></div>
        <div><b>Any bike works</b><span>Restoring or maintaining a bike we don't list? Add it with its year, make and model. Restorations get a course built for its kind of bike.</span><button class="linkbtn" data-nav="browse">Add a bike</button></div></section>`, { wide: true, garage: true });
    app.querySelectorAll("[data-connect]").forEach(b => b.onclick = e => { e.stopPropagation(); const p = data.find(x => x.id === b.dataset.connect); connectProject(p, readyFor(p)); });
    app.querySelectorAll("[data-pin]").forEach(b => b.onclick = e => { e.stopPropagation(); const id = b.dataset.pin, cur = (PREFS.pinned || []).filter(x => x !== id); window.rvPrefs.set({ pinned: b.getAttribute("aria-pressed") === "true" ? cur : [id].concat(cur) }); showProjects(); });
    app.querySelectorAll("[data-rename]").forEach(b => b.onclick = async () => {
      const p = data.find(x => x.id === b.dataset.rename); const name = prompt("Project name", p.name || ""); if (name === null) return;
      const { error } = await sb.from("projects").update({ name: name.trim().slice(0, 80) }).eq("id", p.id); if (error) note(friendly(error), true); else showProjects();
    });
    app.querySelectorAll("[data-share]").forEach(b => b.onclick = () => shareBox(data.find(x => x.id === b.dataset.share)));
  }
  async function createProject(bikeId) {
    const b = bikeOf(bikeId); spin();
    const { data, error } = await sb.from("projects").insert({ bike_id: bikeId, name: bikeName(b) }).select("id").single();
    if (error) return fail(friendly(error));
    goUrl({ project: data.id });
  }
  async function shareBox(p) {
    const box = document.createElement("div"); box.className = "pk-modal";
    const draw = async () => {
      const { data: mem } = await sb.from("project_members").select("user_id,role").eq("project_id", p.id);
      const ids = (mem || []).map(m => m.user_id); const { data: names } = await sb.from("profiles").select("id,display_name").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const nm = id => (names || []).find(n => n.id === id)?.display_name || "Someone";
      box.innerHTML = `<div class="pk-card"><h2 class="disp-s">Share "${esc(p.name)}"</h2>
        <p class="muted pk-small">They need a Revora account first. Then add them with the email they signed up with.</p>
        <ul class="pk-mem">${(mem || []).map(m => `<li><span>${esc(nm(m.user_id))}</span><span class="muted">${m.role === "owner" ? "Owner" : m.role === "viewer" ? "Can view" : "Can edit"}</span>${m.role !== "owner" ? `<button class="linkbtn" data-rm="${esc(m.user_id)}">Remove</button>` : ""}</li>`).join("")}</ul>
        <form class="pk-form row" id="shF"><input name="email" type="email" placeholder="Their email" required aria-label="Email of the person to add"><select name="role" aria-label="Access"><option value="editor">Can edit</option><option value="viewer">Can view</option></select><button class="btn pri" type="submit">Add</button></form>
        <div class="pk-err" id="shErr" hidden></div><div class="pk-links"><button class="btn" data-close>Done</button></div></div>`;
      box.querySelector("[data-close]").onclick = () => { box.remove(); showProjects(); };
      box.querySelectorAll("[data-rm]").forEach(b => b.onclick = async () => { const { error } = await sb.from("project_members").delete().match({ project_id: p.id, user_id: b.dataset.rm }); if (error) note(friendly(error), true); draw(); });
      const f = box.querySelector("#shF"), err = box.querySelector("#shErr");
      f.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f));
        const { data: res, error } = await sb.rpc("add_member", { p: p.id, member_email: d.email, member_role: d.role });
        const msg = error ? friendly(error) : res === "no_account" ? "No account with that email yet. Ask them to create one, then add them." : res === "ok" ? "" : "Couldn't add them.";
        if (msg) { err.textContent = msg; err.hidden = false; } else draw(); };
    };
    document.body.appendChild(box); draw();
  }

  /* ---------- open a bike ---------- */
  async function openApp(bikeId, cloud) {
    spin();
    try { window.PACK = await getJson("packs/" + encodeURIComponent(bikeId) + "/pack.json?v=" + (window.RV_BUILD || "")); }
    catch (e) { return fail("Couldn't load the data for this bike. Check your internet and try again."); }
    window.RV_CLOUD = cloud || null;
    if (bikeOf(bikeId)?.generic || bikeOf(bikeId)?.universal) {
      let m = null;
      if (cloud) { const { data } = await sb.from("records").select("data").eq("project_id", cloud.projectId).eq("coll", "meta").eq("rec_id", "project").maybeSingle(); m = data && data.data; }
      else m = localMeta(bikeId);
      window.RV_BIKE_LABEL = m ? { year: m.year, make: m.make, model: m.model, style: m.style || guessStyle(m.make || "", m.model || ""), silhouette: m.silhouette || "", goal: m.goal || (m.requestKey ? "restore" : "maintain"), drive: m.drive || (bikeOf(bikeId)?.universal ? guessDrive(m.make || "", m.model || "", bikeOf(bikeId).style) : "") } : null;
    }
    try { await loadScript("app.js?v=" + (window.RV_BUILD || Date.now())); } catch (e) { fail("Couldn't load the app. Check your internet and try again."); }
  }
  async function openProject(pid) {
    spin();
    const { data: p, error } = await sb.from("my_projects").select("*").eq("id", pid).maybeSingle();
    if (error) return fail(friendly(error));
    if (!p) return frame(`<h1 class="disp">Project not found</h1><p class="muted">It may have been deleted, or it hasn't been shared with this account.</p><button class="btn pri" data-nav="projects">My projects</button>`);
    if (!bikeOf(p.bike_id)) return fail("This project's bike isn't in the library any more.");
    ls.set("rv.project", pid);
    await openApp(p.bike_id, { sb, db: rvCloudDb(sb, pid), user: session.user, profile: profile || {}, role: p.role, projectId: pid, projectName: p.name, plan: profile?.plan || "free" });
  }

  /* ---------- per-person settings (pinned projects, page tips), saved to the account when there is one ---------- */
  let PREFS = {}, prefT = null;
  const prefKey = () => "rv.prefs." + (session ? session.user.id : "guest");
  async function loadPrefs() {
    try { PREFS = JSON.parse(ls.get(prefKey()) || "{}") || {}; } catch (e) { PREFS = {}; }
    if (!sb || !session) return;
    const { data, error } = await sb.from("profiles").select("prefs").eq("id", session.user.id).maybeSingle();
    if (error || !data || !data.prefs) return;
    const local = PREFS; PREFS = Object.assign({}, local, data.prefs);
    PREFS.seen = [...new Set([...(local.seen || []), ...(data.prefs.seen || [])])];
    ls.set(prefKey(), JSON.stringify(PREFS));
  }
  window.rvPrefs = {
    get: () => PREFS,
    set(patch) {
      Object.assign(PREFS, patch); ls.set(prefKey(), JSON.stringify(PREFS));
      clearTimeout(prefT); if (sb && session) prefT = setTimeout(() => sb.from("profiles").update({ prefs: PREFS }).eq("id", session.user.id).then(() => {}, () => {}), 700);
    }
  };
  // feedback goes to the feedback table; if it can't be sent it waits in this browser and goes with the next one
  window.rvFeedback = async row => {
    const r = Object.assign({ created_at: new Date().toISOString() }, row);
    let queue = []; try { queue = JSON.parse(ls.get("rv.feedbackQueue") || "[]"); } catch (e) {}
    queue.push(r);
    if (!sb) { ls.set("rv.feedbackQueue", JSON.stringify(queue)); return { queued: true }; }
    const rows = queue.map(x => Object.assign({}, x, { user_id: session ? session.user.id : null, email: x.email || (session ? session.user.email : null) }));
    const { error } = await sb.from("feedback").insert(rows);
    if (error) { ls.set("rv.feedbackQueue", JSON.stringify(queue.slice(-20))); return { queued: true }; }
    ls.set("rv.feedbackQueue", "[]"); return { ok: true };
  };

  /* ---------- for the app ---------- */
  // the library bike for this year, make and model, if Revora has its course
  window.rvRestoreFor = m => m ? packForKey(m.requestKey) || packForKey(reqKey(m.year, m.make, m.model)) : null;
  window.rvUniversalFor = style => universalFor(style);
  window.rvEta = (created, status) => etaTxt(created, status);
  window.rvBikeName = bikeName;
  // move this project onto its bike's restoration course; everything logged stays
  window.rvStartRestoring = pack => window.RV_CLOUD ? connectProject({ id: RV_CLOUD.projectId, name: RV_CLOUD.projectName }, pack) : connectLocal(pack);
  // ask for a bike's course; needs an account so we can tell them when it's ready
  window.rvRequestCourse = async m => {
    const r = { year: m.year, make: m.make, model: m.model, style: m.style };
    if (!sb || !session) { ls.set("rv.pendingReq", JSON.stringify(r)); return { needAccount: true }; }
    const row = await submitReq(r); return { row, key: reqKey(r.year, r.make, r.model) };
  };
  window.rvPickBike = () => goUrl(session ? {} : { pick: 1 });
  window.rvOpenBike = id => { if (session) goUrl({}); else { ls.set("rv.bike", id); goUrl({ bike: id }); } };
  window.rvAccount = () => goUrl(session ? {} : { auth: "signin" });
  window.rvHasAccounts = () => !!sb;
  window.rvSignedIn = () => !!session;
  window.rvSignOut = async () => { if (sb) await sb.auth.signOut(); goUrl({}); };

  /* ---------- clicks on loader pages ---------- */
  app.addEventListener("click", async e => {
    const n = e.target.closest("[data-nav]"), a = e.target.closest("[data-act]"), pr = e.target.closest("[data-project]");
    if (pr) { goUrl({ project: pr.dataset.project }); return; }
    if (a) { if (a.dataset.act === "signout") window.rvSignOut(); if (a.dataset.act === "reload") location.reload(); return; }
    const og = e.target.closest("[data-open-guest]"); if (og) { goUrl({ bike: og.dataset.openGuest }); return; }
    if (!n) return; const v = n.dataset.nav;
    if (v === "home" || v === "projects") goUrl(session ? {} : { pick: 1 });
    else if (v === "new") showPicker("new");
    else if (v === "browse") showPicker("new");
    else showAuth(v);
  });

  async function start() {
    spin();
    try { INDEX = await getJson("packs/index.json?v=" + (window.RV_BUILD || "")); } catch (e) { return fail("Couldn't load the bike library. Check your internet and try again."); }
    window.PACK_INDEX = INDEX;
    if (CFG.supabaseUrl && CFG.supabaseKey) {
      try { await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"); sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey); }
      catch (e) { sb = null; }
      if (sb) {
        const recovering = /type=recovery/.test(location.hash);
        sb.auth.onAuthStateChange(ev => { if (ev === "PASSWORD_RECOVERY") showAuth("newpass"); });
        session = (await sb.auth.getSession()).data.session;
        if (session) { const r = await sb.from("profiles").select("display_name,plan").eq("id", session.user.id).maybeSingle(); profile = r.data; }
        if (session) await flushPendingReq();
        await loadPrefs();
        if (recovering) return;
      }
    }
    const auth = qs.get("auth"); if (sb && !session && ["signin", "signup"].includes(auth)) return showAuth(auth);
    const pid = qs.get("project"), bid = qs.get("bike");
    if (pid) { if (!sb) return fail("Accounts aren't set up on this site yet."); if (!session) return showAuth("signin"); return openProject(pid); }
    if (bid && bikeOf(bid)) { ls.set("rv.bike", bid); return openApp(bid, null); }
    if (session) return showProjects();
    // signed out: the plain link always lands on sign-up (browsing and guest projects stay one click away)
    if (sb && !qs.has("pick")) return showAuth("signup");
    const last = ls.get("rv.bike");
    if (!sb && !qs.has("pick") && last && bikeOf(last)) return openApp(last, null);
    showPicker("try");
  }
  start();
})();
