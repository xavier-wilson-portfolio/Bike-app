/* ============ loader ============
   Runs before the app. Decides what to show:
     ?project=<id>  open a saved project (needs sign-in)
     ?bike=<id>     try a bike without an account (saved in this browser only)
     nothing        signed in: My projects. Signed out: the last bike you opened, or the bike search.
   Accounts only switch on when window.RV_CONFIG has the Supabase URL and key. */
(function () {
  const CFG = window.RV_CONFIG || {};
  const qs = new URLSearchParams(location.search);
  // the old address sends people to the real domain (unless this browser has projects saved only on the old address)
  if (CFG.primaryHost && /\.pages\.dev$/.test(location.hostname) && location.hostname.split(".").length === 3) {
    let local = false; try { local = Object.keys(localStorage).some(k => k.startsWith("rv.data.")); } catch (e) {}
    if (!local) { location.replace("https://" + CFG.primaryHost + location.pathname + location.search + location.hash); return; }
    const bar = () => { if (document.getElementById("rvMoved")) return; const d = document.createElement("div"); d.id = "rvMoved";
      d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#17232C;color:#fff;padding:10px 16px;font:14px/1.4 system-ui,sans-serif;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap";
      d.innerHTML = 'Revora has moved to <b>' + CFG.primaryHost + '</b>. Projects saved to your account show up there after you sign in. Projects saved only in this browser stay here.' +
        ' <a href="https://' + CFG.primaryHost + '/" style="background:#D9BF8E;color:#17232C;padding:6px 12px;border-radius:6px;text-decoration:none;font-weight:600">Go to ' + CFG.primaryHost + '</a>' +
        ' <button type="button" aria-label="Hide" style="background:none;border:0;color:#B9D9EB;font-size:18px;cursor:pointer">×</button>';
      d.querySelector("button").onclick = () => d.remove(); document.body.appendChild(d); };
    if (document.body) bar(); else document.addEventListener("DOMContentLoaded", bar);
  }
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
      ? `<div class="pk-acct"><button class="linkbtn" data-nav="projects">Your garage</button>${window.rvPlanOf ? `<button class="pk-plan" data-plans>${esc((planInfo(myPlan().id).name || "Free") + (myPlan().trial ? " trial" : ""))}</button>` : ""}<span class="muted">${esc(profile?.display_name || session.user.email)}</span><button class="btn sm" data-act="signout">Sign out</button></div>`
      : `<div class="pk-acct"><button class="btn sm" data-nav="signin">Sign in</button><button class="btn sm pri" data-nav="signup">Create account</button></div>`;
    app.innerHTML = `<div class="pick${opts.garage ? " is-garage" : ""}"><div class="pk-top"><button class="pk-logo" data-nav="home" aria-label="Revora home"><img class="brand-icon" src="img/revora-icon.svg" alt=""><img class="wordmark" src="img/revora-word.svg" alt="Revora"></button>${right}</div><div class="pick-in ${opts.wide ? "wide" : ""}">${inner}</div></div>`;
  }
  const fail = msg => !navigator.onLine ? frame(`<h1 class="disp">You're offline</h1><p class="muted">Revora needs a connection to load your bikes. Check your Wi-Fi or data, then try again.</p><button class="btn pri" data-act="reload">Try again</button>`) : frame(`<h1 class="disp">Something went wrong</h1><p class="muted">${esc(msg)}</p><button class="btn pri" data-act="reload">Try again</button>`);
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
  const STYLE_NAME = { standard: "Standard", cruiser: "Cruiser", sport: "Sport", adventure: "Adventure", dualsport: "Dual-sport", touring: "Touring", cafe: "Cafe racer", scooter: "Scooter" };
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
      if (!(await roomForBike())) return;
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
    if (!restoreAllowed()) return;
    if (!(await roomForBike())) return;
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
    if (!restoreAllowed()) return;
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
    if (!restoreAllowed()) return;
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
      : `${sb && !hasPlanL("restorer") ? `<div class="pk-uprest"><b>Restoration courses are in Restorer.</b><span>${session && !myPlan().trialUsed ? "Try it free for 30 days. Cancel any time before day 31." : !session ? "Create a free account to start the 30-day free trial." : "Upgrade to start a restoration."}</span><button class="btn tan sm" data-plans>See plans</button></div>` : ""}<div class="eyebrow">${mode === "new" ? "New project" : "Motorcycle restoration"}</div><h1 class="disp">Which bike are you restoring?</h1><p class="muted">Any bike works. Search for it, or add it with the year, make and model, and you get a step-by-step restoration course built for its kind of bike.</p>`;
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
        ${kind === "signup" ? `<label>Mobile number <span class="muted">(optional)</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(555) 123-4567"></label>
        <label class="pk-check"><input type="checkbox" name="sms"><span>Text me service reminders and news about new features. About 4 texts a month. Msg and data rates may apply. Reply STOP to stop.</span></label>` : ""}
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
      const ph = kind === "signup" && String(d.phone || "").trim() ? normPhone(d.phone) : "";
      if (ph === null) return show("That mobile number doesn't look right. Include the area code.");
      if (kind === "signup" && d.sms && !ph) return show("Add your mobile number to get texts, or untick the box.");
      const back = url({});
      let r;
      if (kind === "signin") r = await sb.auth.signInWithPassword({ email: d.email, password: d.password });
      else if (kind === "signup") r = await sb.auth.signUp({ email: d.email, password: d.password, options: { data: Object.assign({ name: d.name.trim() }, ph ? { phone: ph, sms_ok: !!d.sms } : {}), emailRedirectTo: back } });
      else if (kind === "forgot") r = await sb.auth.resetPasswordForEmail(d.email, { redirectTo: back });
      else r = await sb.auth.updateUser({ password: d.password });
      if (r.error) return show(friendly(r.error));
      if (kind === "forgot") { frame(`<h1 class="disp">Check your email</h1><p class="muted">If there's an account for ${esc(d.email)}, a reset link is on its way.</p><button class="btn" data-nav="signin">Back to sign in</button>`); return; }
      if (kind === "signup" && !r.data.session) { frame(`<h1 class="disp">Check your email</h1><p class="muted">We sent a link to ${esc(d.email)}. Click it to finish creating your account.</p>`); return; }
      if (kind === "newpass") note("Password saved.");
      goUrl({});
    };
  }
  /* ---------- mobile number and text consent (contact_prefs, own row only) ---------- */
  // US numbers by default: 10 digits gets +1. Returns +E.164, "" for empty, or null if it doesn't look like a number
  function normPhone(v) {
    const raw = String(v || "").trim(); if (!raw) return ""; let dg = raw.replace(/\D/g, "");
    if (raw.startsWith("+")) return /^[1-9]\d{7,14}$/.test(dg) ? "+" + dg : null;
    if (dg.length === 11 && dg[0] === "1") dg = dg.slice(1);
    return dg.length === 10 && /^[2-9]/.test(dg) ? "+1" + dg : null;
  }
  const fmtPhone = p => /^\+1\d{10}$/.test(p || "") ? `(${p.slice(2, 5)}) ${p.slice(5, 8)}-${p.slice(8)}` : p || "";
  let CONTACT;   // undefined: not loaded, null: no row yet
  async function loadContact() {
    const { data, error } = await sb.from("contact_prefs").select("phone,sms_ok,asked_at").eq("user_id", session.user.id).maybeSingle();
    if (error) { CONTACT = { err: 1 }; return CONTACT; }
    CONTACT = data || null;
    // a number given at sign-up waits in the account's details until the first sign-in
    const m = session.user.user_metadata || {};
    if (!CONTACT && m.phone && normPhone(m.phone)) await saveContact(normPhone(m.phone), !!m.sms_ok, true);
    return CONTACT;
  }
  async function saveContact(phone, smsOk, quiet) {
    const now = new Date().toISOString(), row = { user_id: session.user.id, phone: phone || null, sms_ok: !!(smsOk && phone), asked_at: now, updated_at: now };
    if (row.sms_ok && !(CONTACT && CONTACT.sms_ok)) row.sms_ok_at = now;
    const { error } = await sb.from("contact_prefs").upsert(row, { onConflict: "user_id" });
    if (error) { if (!quiet) note("Couldn't save that. Try again.", true); return false; }
    CONTACT = Object.assign({}, CONTACT || {}, row); return true;
  }
  function phoneBox(first) {
    const c = CONTACT && !CONTACT.err ? CONTACT : {};
    const box = document.createElement("div"); box.className = "pk-modal";
    box.innerHTML = `<div class="pk-card up ph-card"><span class="up-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg></span>
      <span class="up-k">${first ? "New" : "Text alerts"}</span><h2>${first ? "Get your reminders by text" : "Texts from Revora"}</h2>
      <p>${first ? "Add your mobile number and we'll text you when service is coming due, plus a heads-up when something new comes out. Emails keep coming too." : "Service reminders and news about new features, by text as well as email."}</p>
      <form class="pk-form ph-form" novalidate><label>Mobile number<input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(555) 123-4567" value="${esc(fmtPhone(c.phone))}"></label>
        <label class="pk-check"><input type="checkbox" name="sms"${c.sms_ok ? " checked" : ""}><span>Text me service reminders and news about new features. About 4 texts a month. Msg and data rates may apply. Reply STOP to stop.</span></label>
        <div class="pk-err" hidden></div>
        <div class="pk-links" style="justify-content:center"><button class="btn tan" type="submit">Save</button><button class="btn" type="button" data-ph="later">${first ? "Not now" : "Close"}</button>${c.phone ? `<button class="linkbtn" type="button" data-ph="remove">Remove my number</button>` : ""}</div></form></div>`;
    const f = box.querySelector("form"), err = box.querySelector(".pk-err"), close = () => box.remove();
    f.onsubmit = async e => { e.preventDefault(); const ph = normPhone(f.phone.value);
      if (!ph) { err.textContent = ph === null ? "That number doesn't look right. Include the area code." : "Enter your mobile number."; err.hidden = false; return; }
      if (await saveContact(ph, f.sms.checked)) { close(); note(f.sms.checked ? "Saved. You'll get texts at " + fmtPhone(ph) + "." : "Number saved. Texts are off until you tick the box."); } };
    box.querySelector('[data-ph="later"]').onclick = async () => { close(); if (first) await saveContact(c.phone || "", c.sms_ok, true); };
    const rm = box.querySelector('[data-ph="remove"]'); if (rm) rm.onclick = async () => { if (await saveContact("", false)) { close(); note("Your number is removed. No more texts."); } };
    box.onclick = e => { if (e.target === box) box.querySelector('[data-ph="later"]').click(); };
    document.body.appendChild(box); setTimeout(() => f.phone.focus(), 50);
  }
  // signed-in people without a number get asked once (and again 60 days after a "Not now")
  async function maybeAskPhone() {
    if (!sb || !session || sessionStorage.getItem("rv.phAsked")) return;
    const c = CONTACT === undefined ? await loadContact() : CONTACT;
    if (c && (c.err || c.phone)) return;
    if (c && c.asked_at && Date.now() - new Date(c.asked_at) < 60 * 864e5) return;
    try { sessionStorage.setItem("rv.phAsked", "1"); } catch (e) {}
    setTimeout(() => { if (!document.querySelector(".pk-modal")) phoneBox(true); }, 1200);
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
    const gen = data.filter(p => bikeOf(p.bike_id)?.generic || bikeOf(p.bike_id)?.universal), genKey = {}, genStyle = {}, genSil = {}, genLabel = {};
    if (gen.length) { const { data: ms } = await sb.from("records").select("project_id,key:data->>requestKey,style:data->>style,sil:data->>silhouette,yr:data->>year,mk:data->>make,md:data->>model").eq("coll", "meta").in("project_id", gen.map(p => p.id)); (ms || []).forEach(m => { genKey[m.project_id] = m.key; genStyle[m.project_id] = m.style; genSil[m.project_id] = m.sil; genLabel[m.project_id] = [m.yr, m.mk, m.md].filter(Boolean).join(" "); }); }
    const isLog = p => bikeOf(p.bike_id)?.generic && !genKey[p.id];
    const isUni = p => !!bikeOf(p.bike_id)?.universal, uniTxt = p => (bikeOf(p.bike_id)?.styleName || "") + " restoration";
    const readyFor = p => bikeOf(p.bike_id)?.generic ? packForKey(genKey[p.id]) : null;
    const first = String(profile?.display_name || session.user.email || "").split(/[\s@]/)[0];
    const pins = (PREFS.pinned || []).filter(id => data.some(p => p.id === id)), isPin = p => pins.includes(p.id);
    data.sort((a, b) => (isPin(a) ? pins.indexOf(a.id) : 1e6) - (isPin(b) ? pins.indexOf(b.id) : 1e6));
    const styleOf = p => { const b = bikeOf(p.bike_id); return genStyle[p.id] || (b && b.style) || "standard"; };
    const theme = p => "th-" + styleOf(p);
    const lastId = ls.get("rv.project"), feat = data.find(p => p.id === lastId) || data[0];
    const pctOf = p => { const g = prog[p.id]; return g && g.total ? g.done / g.total * 100 : 0; };
    const who = p => p.role === "owner" ? (p.members > 1 ? `You and ${p.members - 1} other${p.members > 2 ? "s" : ""}` : "Just you") : p.role === "viewer" ? "Shared with you, view only" : "Shared with you";
    const tag = p => { const b = bikeOf(p.bike_id), g = prog[p.id], pc = pctOf(p); return `<article class="gt ${theme(p)}${isPin(p) ? " pinned" : ""}">
        <button class="gt-pin" data-pin="${esc(p.id)}" aria-pressed="${isPin(p)}" aria-label="${isPin(p) ? "Unpin" : "Pin"} ${esc(p.name || bikeName(b))}" title="${isPin(p) ? "Unpin" : "Pin to the top"}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg></button>
        <button class="gt-open" data-project="${esc(p.id)}" aria-label="Open ${esc(p.name || bikeName(b))}">
          <span class="gt-bike">${isPin(p) ? `<span class="gt-pintag">Pinned</span>` : ""}${isLog(p) ? "Maintenance log · " + esc(STYLE_NAME[styleOf(p)] || "Standard") : isUni(p) ? esc(uniTxt(p)) : b && b.generic ? (readyFor(p) ? "Bike page ready" : "Maintenance log · " + esc(STYLE_NAME[styleOf(p)] || "Standard")) : esc((p.name && p.name !== bikeName(b)) ? bikeName(b) : (b && b.variant) || "")}</span><b class="gt-name">${esc(p.name || bikeName(b))}</b>
          ${isLog(p) ? "" : `<span class="gt-bar" aria-hidden="true"><i style="width:${pc.toFixed(1)}%"></i></span>`}
          <span class="gt-meta">${b && b.generic ? "Maintenance and records" : g && g.total ? `${g.done} of ${g.total} steps` : "Not started"}<span>${esc(who(p))}</span></span></button>
        ${p.role === "owner" && readyFor(p) ? `<div class="gt-ready"><span>The ${esc(bikeName(readyFor(p)))} page is ready.</span><button class="btn tan sm" data-connect="${esc(p.id)}">Connect</button></div>` : ""}${p.role === "owner" ? `<div class="gt-acts"><button class="linkbtn" data-share="${esc(p.id)}">Share</button><button class="linkbtn" data-rename="${esc(p.id)}">Rename</button><button class="linkbtn" data-transfer="${esc(p.id)}">Sold it?</button><button class="linkbtn gt-del" data-del="${esc(p.id)}">Delete</button></div>` : `<div class="gt-acts"><button class="linkbtn gt-del" data-leave="${esc(p.id)}">Remove from my garage</button></div>`}</article>`; };
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
      ${dealBand()}
      ${window.rvAdmin && window.rvPlanOf && myPlan().admin ? `<div id="admHQ"></div>` : ""}
      <div id="woBoard"></div>
      ${data.length ? `<section class="garage"><div class="garage-h"><h2>Your garage</h2><button class="btn sm" data-nav="new">+ New project</button></div>
        <div class="gts">${data.map(tag).join("")}<button class="gt gt-new" data-nav="new"><b>Add a bike</b><span>Start a new project for another bike</span></button></div></section>` : ""}
      ${window.rvShop ? rvShop.html({ kind: "parts", title: "Shop for parts", sub: "Search the big parts stores for any of your bikes. You buy on the store's own site.", bikes: [...new Set(data.map(p => { const b = bikeOf(p.bike_id); return genLabel[p.id] || (b && !b.generic && !b.universal ? bikeName(b) : p.name); }).filter(Boolean))] }) : ""}
      ${!(matchMedia("(display-mode: standalone)").matches || navigator.standalone) ? `<section class="ins-band"><img src="img/app-192.png" alt="" width="44" height="44"><div><b>Put Revora on your home screen</b><span>It opens like an app, full screen, one tap from your phone's home screen.</span></div><button class="btn tan" data-act="install">Install the app</button></section>` : ""}
      <section class="gfoot"><div><b>Working with a team?</b><span>Share a project and everyone sees the same parts, steps and photos, live. Owners can give edit or view access.</span></div>
        <div><b>Builds gallery</b><span>See what other riders are restoring and building, and put yours in it from your bike's Build page.</span><a class="linkbtn" href="?builds">Browse builds</a></div>
        <div><b>Text alerts</b><span>Get service reminders and news about new features by text as well as email.</span><button class="linkbtn" data-texts>Set up texts</button></div>
        <div><b>Plans</b><span>One bike is free for good. Paid plans add AI receipts, email reminders, share links and teams.</span><button class="linkbtn" data-plans>See plans</button></div>
        <div><b>Any bike works</b><span>Restoring or maintaining a bike we don't list? Add it with its year, make and model. Restorations get a course built for its kind of bike.</span><button class="linkbtn" data-nav="browse">Add a bike</button></div></section>`, { wide: true, garage: true });
    const adm = document.getElementById("admHQ"); if (adm) window.rvAdmin.mount(adm, sb, note);
    maybeAskPhone();
    app.querySelectorAll("[data-texts]").forEach(b => b.onclick = async () => { if (CONTACT === undefined) await loadContact(); phoneBox(false); });
    if (hasPlanL("shop") && data.length) woBoard(data);
    if (window.rvShop) rvShop.bind(app, {});
    app.querySelectorAll("[data-connect]").forEach(b => b.onclick = e => { e.stopPropagation(); const p = data.find(x => x.id === b.dataset.connect); connectProject(p, readyFor(p)); });
    app.querySelectorAll("[data-pin]").forEach(b => b.onclick = e => { e.stopPropagation(); const id = b.dataset.pin, cur = (PREFS.pinned || []).filter(x => x !== id); window.rvPrefs.set({ pinned: b.getAttribute("aria-pressed") === "true" ? cur : [id].concat(cur) }); showProjects(); });
    app.querySelectorAll("[data-rename]").forEach(b => b.onclick = async () => {
      const p = data.find(x => x.id === b.dataset.rename); const name = prompt("Project name", p.name || ""); if (name === null) return;
      const { error } = await sb.from("projects").update({ name: name.trim().slice(0, 80) }).eq("id", p.id); if (error) note(friendly(error), true); else showProjects();
    });
    app.querySelectorAll("[data-del],[data-leave]").forEach(b => b.onclick = e => { e.stopPropagation(); const p = data.find(x => x.id === (b.dataset.del || b.dataset.leave)); deleteProjectBox(Object.assign({}, p, { label: p.name || bikeName(bikeOf(p.bike_id)) }), () => { if (ls.get("rv.project") === p.id) ls.set("rv.project", ""); window.rvPrefs.set({ pinned: (PREFS.pinned || []).filter(x => x !== p.id) }); showProjects(); }); });
    app.querySelectorAll("[data-transfer]").forEach(b => b.onclick = () => transferBox(data.find(x => x.id === b.dataset.transfer)));
    app.querySelectorAll("[data-share]").forEach(b => b.onclick = () => hasPlanL("restorer") ? shareBox(data.find(x => x.id === b.dataset.share)) : upsellBox("restorer", "Sharing projects is in Restorer", "Share a bike with friends or a shop so everyone sees the same parts, jobs and photos live."));
  }
  // Shop plan: every open work order across the garage, soonest due first
  async function woBoard(projects) {
    const host = document.getElementById("woBoard"); if (!host) return;
    const { data: rows, error } = await sb.from("records").select("project_id,rec_id,data").eq("coll", "workorders").in("project_id", projects.map(p => p.id));
    if (error || !rows) return;
    const done = ["Picked up", "Declined"], open = rows.map(r => Object.assign({ pid: r.project_id, id: r.rec_id }, r.data)).filter(w => w && !w.archived && !done.includes(w.status))
      .sort((a, b) => String(a.promised || "9999").localeCompare(String(b.promised || "9999")) || String(a.dateIn || "").localeCompare(String(b.dateIn || "")));
    if (!open.length) return;
    const pname = id => { const p = projects.find(x => x.id === id); return p ? p.name || bikeName(bikeOf(p.bike_id)) : ""; };
    const today = new Date().toISOString().slice(0, 10), fmt = d => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
    const cols = [["Waiting on the customer", ["Checked in", "Waiting for approval"]], ["In the shop", ["Approved", "In progress", "Waiting for parts"]], ["Ready for pickup", ["Done"]]];
    host.innerHTML = `<section class="wob"><div class="garage-h"><h2>Open work orders</h2><span class="muted">${open.length} open</span></div>
      <div class="wob-cols">${cols.map(([t, ss]) => { const L = open.filter(w => ss.includes(w.status)); return `<div class="wob-col"><h3>${esc(t)} <span>${L.length}</span></h3>${L.map(w => `<button class="wob-card${w.promised && w.promised < today && w.status !== "Done" ? " late" : ""}" data-wob="${esc(w.pid)}|${esc(w.id)}"><b>${esc(w.title || "Work order")}</b><span>${esc(pname(w.pid))}</span><small>${esc(w.id)} · ${esc(w.status)}${w.promised ? " · ready by " + esc(fmt(w.promised)) : ""}</small></button>`).join("") || `<p class="faint">Nothing here.</p>`}</div>`; }).join("")}</div></section>`;
    host.querySelectorAll("[data-wob]").forEach(b => b.onclick = () => { const [pid, wid] = b.dataset.wob.split("|"); try { sessionStorage.setItem("rv.woOpen", wid); } catch (e) {} location.href = url({ project: pid }); });
  }
  async function createProject(bikeId) {
    if (!(await roomForBike())) return;
    const b = bikeOf(bikeId); if (!b.generic && !restoreAllowed()) return; spin();
    const { data, error } = await sb.from("projects").insert({ bike_id: bikeId, name: bikeName(b) }).select("id").single();
    if (error) return fail(friendly(error));
    goUrl({ project: data.id });
  }
  // delete a bike for good (owner), or take a shared bike out of your garage (everyone else)
  function deleteProjectBox(p, done) {
    const own = p.role === "owner", box = document.createElement("div"); box.className = "pk-modal";
    box.innerHTML = `<div class="pk-card" role="dialog" aria-modal="true" aria-labelledby="dlH"><h2 class="disp-s" id="dlH">Are you sure you want to ${own ? "delete" : "remove"} "${esc(p.label)}"?</h2>
      ${own ? `<p class="muted">This deletes the bike and everything in it: services, parts, mods, receipts, photos, reminders and work orders.${p.members > 1 ? " Everyone you shared it with loses it too." : ""} It can't be undone.</p>
`
      : `<p class="muted">It leaves your garage. The owner keeps the bike and everything in it, and can share it with you again.</p>`}
      <div class="pk-err" id="dlE" hidden></div>
      <div class="pk-links"><button class="btn" data-x>Cancel</button><button class="btn danger" data-ok>${own ? "Delete" : "Remove"}</button></div></div>`;
    document.body.appendChild(box);
    const ok = box.querySelector("[data-ok]"), err = box.querySelector("#dlE");
    box.querySelector("[data-x]").onclick = () => box.remove(); box.onclick = e => { if (e.target === box) box.remove(); };
    setTimeout(() => ok.focus(), 30);
    ok.onclick = async () => {
      ok.disabled = true; ok.textContent = own ? "Deleting…" : "Removing…";
      const { error } = own ? await sb.from("projects").delete().eq("id", p.id) : await sb.from("project_members").delete().match({ project_id: p.id, user_id: session.user.id });
      if (error) { err.textContent = friendly(error); err.hidden = false; ok.disabled = false; ok.textContent = own ? "Delete" : "Remove"; return; }
      box.remove(); note(own ? `Deleted "${p.label}".` : `Removed "${p.label}" from your garage.`); done && done();
    };
  }
  window.rvDeleteProject = (p, done) => deleteProjectBox(p, done);
  window.rvGoGarage = () => goUrl({});
  // selling the bike: the project and its whole history move to the buyer's account
  function transferBox(p) {
    const label = p.name || bikeName(bikeOf(p.bike_id));
    const box = document.createElement("div"); box.className = "pk-modal";
    box.innerHTML = `<div class="pk-card up ph-card"><span class="up-k">Sold it?</span><h2>Hand ${esc(label)} to the new owner</h2>
      <p>Its full history goes with it: every service, mod, photo, receipt and the build page. A buyer pays more for a bike with records, and the history stays with the bike for good.</p>
      <form class="pk-form" novalidate><label>New owner's email<input name="email" type="email" required placeholder="buyer@example.com" autocomplete="off"></label>
        <p class="muted pk-small" style="text-align:left">If they already have a Revora account it moves right away. If not, it moves the moment they sign up with that email (free). After it moves it leaves your garage, so print or save the history report first if you want a copy.</p>
        <div class="pk-err" hidden></div>
        <div class="pk-links" style="justify-content:center"><button class="btn tan" type="submit">Hand it over</button><button class="btn" type="button" data-tx="x">Cancel</button></div></form></div>`;
    const f = box.querySelector("form"), err = box.querySelector(".pk-err"), close = () => box.remove();
    box.querySelector('[data-tx="x"]').onclick = close; box.onclick = e => { if (e.target === box) close(); };
    f.onsubmit = async e => { e.preventDefault(); const em = f.email.value.trim().toLowerCase(); err.hidden = true;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { err.textContent = "That email doesn't look right."; err.hidden = false; return; }
      if (!confirm(`Hand ${label} to ${em}? Once it moves you can't undo it from here.`)) return;
      const b = f.querySelector("button[type=submit]"); b.disabled = true;
      const { data, error } = await sb.rpc("transfer_project", { pid: p.id, em }); b.disabled = false;
      if (error || !["moved", "waiting"].includes(data)) { err.textContent = data === "self" ? "That's your own email." : data === "denied" ? "Only the owner can hand a bike over." : "Couldn't do that. Try again."; err.hidden = false; return; }
      close(); if (data === "moved") { if (ls.get("rv.project") === p.id) ls.set("rv.project", ""); note(label + " is now in " + em + "'s garage."); showProjects(); }
      else note("Saved. " + label + " moves to " + em + " as soon as they sign up with that email. Send them to revoragarage.com."); };
    document.body.appendChild(box); setTimeout(() => f.email.focus(), 50);
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

  /* ---------- plans and limits ---------- */
  async function loadProfile() {
    let r = await sb.from("profiles").select("display_name,plan,plan_until,trial_used,plan_chosen,paid,comp").eq("id", session.user.id).maybeSingle();
    if (r.error) r = await sb.from("profiles").select("display_name,plan,plan_until,trial_used,plan_chosen,paid").eq("id", session.user.id).maybeSingle();
    if (r.error) r = await sb.from("profiles").select("display_name,plan,plan_until,trial_used,plan_chosen").eq("id", session.user.id).maybeSingle();
    if (r.error) r = await sb.from("profiles").select("display_name,plan").eq("id", session.user.id).maybeSingle();
    profile = r.data;
  }
  const myPlan = () => window.rvPlanOf ? rvPlanOf(profile, session && session.user.email) : { id: "shop", admin: true };
  const planInfo = id => (window.RV_PLANS || []).find(p => p.id === id) || {};
  const rankOf = id => (window.RV_PLAN_RANK || {})[id] || 0;
  const hasPlanL = need => rankOf(myPlan().id) >= rankOf(need);
  function upsellBox(need, title, text) {
    const P = planInfo(need), trial = session && !myPlan().trialUsed && myPlan().id === "free";
    const box = document.createElement("div"); box.className = "pk-modal";
    box.innerHTML = `<div class="pk-card up"><span class="up-ico">🔒</span><span class="up-k">Included in ${esc(P.name || need)}${window.rvPriceLine ? rvPriceLine(P) : ""}</span><h2>${esc(title)}</h2><p>${esc(text)}</p>
      <div class="pk-links" style="justify-content:center">${trial ? `<button class="btn tan" data-up="trial">${need === "restorer" ? "Start 30-day free trial" : "Try Restorer free for 30 days"}</button>` : ""}${!session && sb ? `<button class="btn tan" data-up="signup">Create a free account</button>` : ""}<button class="btn pri" data-up="plans">See plans</button><button class="btn" data-up="close">Not now</button></div></div>`;
    box.querySelector(".up-ico").innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
    box.onclick = async e => { const b = e.target.closest("[data-up]"); if (!b && e.target !== box) return; const k = b ? b.dataset.up : "close"; box.remove();
      if (k === "plans") showPlans(); if (k === "signup") showAuth("signup"); if (k === "trial") { if (await startTrialL()) showProjects(); } };
    document.body.appendChild(box);
  }
  async function startTrialL() {
    const u = window.rvTrialUrl && rvTrialUrl(session && session.user);
    if (!u) { note("The free trial isn't open right now. See plans to pick one.", true); return false; }
    location.href = u; return false;   // Stripe takes the card and starts the 30 free days
  }
  // how many bikes the plan allows; returns false (and shows the upgrade box) when the garage is full
  async function roomForBike() {
    if (!sb || !session) return true;
    const P = myPlan(); if (P.admin) return true;
    const lim = planInfo(P.id).bikes || 1, { data } = await sb.from("my_projects").select("id,role");
    const owned = (data || []).filter(p => p.role === "owner").length;
    if (owned < lim) return true;
    const next = (window.RV_PLANS || []).find(p => p.bikes > lim);
    upsellBox(next ? next.id : "shop", `Your ${planInfo(P.id).name || "Free"} plan has room for ${lim} bike${lim === 1 ? "" : "s"}`, `You have ${owned} in your garage. Upgrade to add more. Nothing you've logged is ever removed.`);
    return false;
  }
  function restoreAllowed() {
    if (sb && !session) { upsellBox("restorer", "Restoration courses are in Restorer", "Create a free account and start the 30-day Restorer trial to get a step-by-step course for your bike."); return false; }
    if (hasPlanL("restorer")) return true;
    upsellBox("restorer", "Restoration courses are in Restorer", "A step-by-step course tailored to your bike, with a parts list, safety checks and a budget. Try it free for 30 days.");
    return false;
  }
  // the welcome deal on the garage page: only for people on Free while their 24 (or 48) hours are running
  function dealBand() {
    const d = window.rvDeal && rvDeal(), P = myPlan();
    if (!d || d.visitor || P.id !== "free" || P.admin || !window.rvPlansLive || !rvPlansLive()) return "";
    const pr = id => rvMoney((planInfo(id) || {}).deal || 0);
    return `<section class="deal-band">${rvDealClock(d)}<div>
      <b class="deal-t">Rider ${pr("rider")}, Restorer ${pr("restorer")}, Shop ${pr("shop")} a month for your first ${window.RV_DEAL_MONTHS || 3} months</b>
      <span class="deal-s">After that it's the regular price. You can still try Restorer free for 30 days instead.</span></div>
      <button class="btn tan" data-plans>See the deal</button></section>`;
  }
  // send a signed-in person to Stripe checkout for a plan
  function checkout(plan, yearly) {
    if (!session) return showAuth("signup");
    const u = window.rvCheckoutUrl && rvCheckoutUrl(plan, yearly, session.user);
    if (!u) return note("Checkout opens soon. Start free or take the Restorer trial for now.", true);
    location.href = u;
  }
  // back from Stripe: wait for the payment to switch the plan on
  async function afterPaid() {
    frame(`<h1 class="disp">Thanks! Setting up your plan…</h1><p class="muted">This takes a few seconds.</p><div class="spin" aria-hidden="true"></div>`);
    for (let i = 0; i < 20; i++) { await loadProfile(); if (profile && profile.paid) break; await new Promise(r => setTimeout(r, 1500)); }
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    if (profile && profile.paid) { showProjects(); setTimeout(() => note("You're on " + ((planInfo(myPlan().id).name) || "your new plan") + ". Thanks for supporting Revora."), 600); }
    else frame(`<h1 class="disp">Payment received</h1><p class="muted">Your plan is still switching on. Refresh in a minute. If it hasn't changed in a few minutes, use Give feedback in the menu and we'll sort it out.</p><button class="btn pri" data-nav="projects">Go to your garage</button>`);
  }
  function showChoosePlan(yearly) {
    document.title = "Pick your plan · Revora";
    frame(`<div class="eyebrow">Welcome${profile && profile.display_name ? ", " + esc(String(profile.display_name).split(" ")[0]) : ""}</div><h1 class="disp">Pick your plan</h1><p class="muted">Start free with one bike, or try Restorer free for 30 days. You can change plans any time.</p>${window.rvPlansHtml({ yearly, mode: "choose", trialUsed: profile && profile.trial_used })}`, { wide: true });
    app.querySelectorAll("[data-pl-bill]").forEach(b => b.onclick = () => showChoosePlan(b.dataset.plBill === "y"));
    window.rvBindGift(app, () => session && sb, async () => { await loadProfile(); showProjects(); });
    app.querySelectorAll("[data-pl-pick]").forEach(b => b.onclick = async () => {
      const k = b.dataset.plPick; b.disabled = true;
      if (k === "trial") { if (await startTrialL()) return showProjects(); b.disabled = false; return; }
      if (k === "free") { await sb.from("profiles").update({ plan_chosen: true }).eq("id", session.user.id); if (profile) profile.plan_chosen = true; return showProjects(); }
      b.disabled = false; checkout(k, !!yearly);
    });
  }

  /* ---------- landing page for people who aren't signed in ---------- */
  function showLanding(yearly) {
    document.title = "Revora · Restore it, ride it, keep the records";
    const I = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const ICO = { wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L12 19l-3-3 7.7-7.7z M4 20l3-3"/>', bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 20a2 2 0 0 0 4 0"/>', camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
      shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M8 7h7"/>', doc: '<path d="M6 3h9l4 4v14H6z M14 3v5h5 M9 13h6 M9 17h6"/>',
      tune: '<path d="M4 6h9 M17 6h3 M4 12h3 M11 12h9 M4 18h11 M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>', fuel: '<path d="M5 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15 M4 20h12 M15 9h2l2 2v6a1.5 1.5 0 0 1-3 0v-3"/>',
      cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16 M9 3v4 M15 3v4"/>', check: '<path d="M5 12l4 4 10-10"/>', dollar: '<path d="M12 3v18 M16.5 7.5c-.8-1.3-2.4-2-4.5-2-2.6 0-4.3 1.3-4.3 3.2 0 4.6 9 2.4 9 7 0 1.9-1.9 3.3-4.7 3.3-2.2 0-4-.8-4.9-2.3"/>', wheel: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v5.5 M12 14.5V20 M4 12h5.5 M14.5 12H20"/>', phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>' };
    const F = [["wrench", "Maintenance log", "Every service with mileage, parts and cost. See what's due next at a glance.", "Free"],
      ["bell", "Service reminders", "Revora learns how much you ride and tells you before oil, chain, brakes or tires come due.", "Rider"],
      ["shield", "Recall alerts", "Safety recalls for your exact bike from NHTSA, with a heads-up when a new one appears.", "Rider"],
      ["book", "Restoration courses", "A step-by-step course for any bike, tailored to its kind: cruiser, sport, cafe racer, scooter and more.", "Restorer"],
      ["camera", "Snap a receipt", "Take a photo. The AI reads the store, parts and total and files it with the right service.", "Restorer"],
      ["doc", "Bike history report", "A clean history with an odometer chart and a record score to hand a buyer, or share as a link.", "Free"],
      ["tune", "Mods and upgrades", "Every aftermarket part with its part number, price and where the stock part is.", "Rider"],
      ["dollar", "Value and selling", "What the bike is worth next to what you've put in, and a listing written from your records when you sell.", "Rider"],
      ["cal", "Papers and renewals", "Insurance, registration and warranties with a reminder before anything runs out.", "Free"],
      ["check", "Checklists", "Spring wake-up, winter storage, before every ride and before a big trip.", "Free"],
      ["wheel", "Tire and chain wear", "Readings and photos over time, and roughly how many miles are left.", "Free"],
      ["camera", "Build page", "A public page for your bike with photos, the story, mods and a before-and-after slider. Post the link anywhere.", "Free"]];
    const sil = n => { const f = (CFG.sil || []).find(x => x.replace(/\.\w+$/, "") === n); return f ? "img/sil/" + f : ""; };
    app.innerHTML = `<div class="ld">
      <header class="ld-top"><a class="pk-logo" href="${esc(url({}))}" aria-label="Revora"><img class="brand-icon" src="img/revora-icon.svg" alt=""><img class="wordmark" src="img/revora-word.svg" alt="Revora"></a>
        <nav class="ld-nav"><a href="#ld-features">Features</a><a href="?builds">Builds</a><a href="#ld-plans">Plans</a><button class="btn sm" data-nav="signin">Sign in</button><button class="btn sm tan" data-nav="signup">Get started</button></nav></header>
      <section class="ld-hero"><div class="ld-hero-t"><span class="ld-k">For riders, restorers and shops</span>
          <h1>Restore it. Ride it. Keep every record.</h1>
          <p>Revora keeps your bike's whole life in one place: services and reminders, receipts read by AI, recalls, mods, papers, and a step-by-step restoration course for any bike.</p>
          <div class="ld-cta"><button class="btn tan big" data-nav="signup">Get started free</button><button class="btn ghost-l big" data-nav="signin">Sign in</button></div>
          <span class="ld-small">Free for one bike. Restorer free for 30 days, cancel any time.</span></div>
        <div class="ld-art">${["bike-cafe", "bike-adventure", "bike-cruiser"].map((n, i) => sil(n) ? `<img class="ld-s s${i}" src="${sil(n)}" alt="">` : "").join("")}</div></section>
      <section class="ld-strip"><div><b>Any bike</b><span>Search the library or add yours by year, make and model</span></div><div><b>8 kinds of bike</b><span>Courses tailored to cruisers, sport bikes, scooters and more</span></div><div><b>Your records stay yours</b><span>Export or print them any time</span></div></section>
      <section class="ld-sec" id="ld-features"><h2>Everything your bike needs, in one place</h2><p class="ld-sub">Start with the free maintenance log. Add more when you want it.</p>
        <div class="ld-grid">${F.map(([i, t, d, p]) => `<article class="ld-f"><span class="ld-fi">${I(ICO[i])}</span><b>${t}</b><span>${d}</span><em class="ld-p ${p.toLowerCase()}">${p}</em></article>`).join("")}</div></section>
      <section class="ld-sec ld-how"><h2>How it works</h2><div class="ld-steps">
        <div><span>1</span><b>Add your bike</b><p>Search for it or type the year, make and model. Pick whether you're restoring it or keeping it running.</p></div>
        <div><span>2</span><b>Log as you go</b><p>Snap receipts, log services and fill-ups, and tick off checklists. It takes seconds.</p></div>
        <div><span>3</span><b>Know what's next</b><p>Reminders, recall alerts and renewal dates come to you, and the history report builds itself.</p></div></div></section>
      <section class="ld-sec" id="ld-plans"><h2>Plans</h2><p class="ld-sub">Start free. New members get 24 hours to lock in a lower price for their first 3 months.</p>${window.rvPlansHtml({ yearly, mode: "choose" })}</section>
      <section class="ld-end"><h2>Your bike's whole story, kept right.</h2><button class="btn tan big" data-nav="signup">Get started free</button><button class="linkbtn" data-nav-pick>Look around first</button></section>
      <footer class="ld-foot"><span>Revora</span><span>Made for people who work on their own bikes.</span><a href="mailto:info@revoragarage.com">info@revoragarage.com</a></footer></div>`;
    app.querySelectorAll("[data-pl-bill]").forEach(b => b.onclick = () => { showLanding(b.dataset.plBill === "y"); document.getElementById("ld-plans").scrollIntoView(); });
    app.querySelectorAll("[data-pl-pick]").forEach(b => b.onclick = () => showAuth("signup"));
    app.querySelector("[data-nav-pick]").onclick = () => goUrl({ pick: 1 });
  }

  /* ---------- plans (public) ---------- */
  function showPlans(yearly) {
    document.title = "Plans · Revora";
    frame(`<div class="eyebrow">Plans</div><h1 class="disp">Start free. Upgrade when you need more.</h1><p class="muted">One bike is free for good. Paid plans add AI receipts, email reminders, share links, restoration courses and teams.</p>${window.rvPlansHtml({ yearly, current: session ? myPlan().id : "", until: session ? myPlan().until : null, trialUsed: !session || myPlan().trialUsed, paid: !!session && myPlan().paid, comp: !!session && myPlan().comp })}
      <div class="pk-links">${session ? `<button class="btn pri" data-nav="projects">Back to your garage</button>` : `<button class="btn pri" data-nav="signup">Create a free account</button>`}</div>`, { wide: true });
    app.querySelectorAll("[data-pl-bill]").forEach(b => b.onclick = () => showPlans(b.dataset.plBill === "y"));
    window.rvBindManage(app, async () => session && (await sb.auth.getSession()).data.session?.access_token);
    window.rvBindGift(app, () => session && sb, async () => { await loadProfile(); showPlans(yearly); });
    app.querySelectorAll("[data-pl-pick]").forEach(b => b.onclick = async () => { if (b.dataset.plPick === "trial") { if (!session) return showAuth("signup"); if (await startTrialL()) showProjects(); } else checkout(b.dataset.plPick, !!yearly); });
  }

  /* ---------- a shared bike history report (read-only, no account needed) ---------- */
  async function showReport(token) {
    spin(); document.title = "Bike history report · Revora";
    if (!sb) return fail("Reports can't be opened on this copy of Revora.");
    const ok = /^[A-Za-z0-9]{16,40}$/.test(token);
    const { data, error } = ok ? await sb.rpc("get_report", { t: token }) : { data: null };
    if (error || !data) return frame(`<h1 class="disp">This report isn't available</h1><p class="muted">The owner may have stopped sharing it, or the link is incomplete.</p><button class="btn pri" data-nav="home">Go to Revora</button>`);
    document.title = (data.bike && data.bike.name ? data.bike.name + " · " : "") + "Bike history report";
    app.innerHTML = `<div class="hr-page"><div class="hr-bar"><a class="pk-logo" href="${esc(url({}))}" aria-label="Revora"><img class="brand-icon" src="img/revora-icon.svg" alt=""><img class="wordmark" src="img/revora-word.svg" alt="Revora"></a>
        <div class="hr-bar-r"><button class="btn sm" id="hrPrint">Print or save as PDF</button><a class="btn sm tan" href="${esc(url(session ? {} : { auth: "signup" }))}">Keep a log for your bike</a></div></div>
      ${window.rvReportHtml(data)}</div>`;
    document.getElementById("hrPrint").onclick = () => { document.body.classList.add("printing-hr"); window.print(); setTimeout(() => document.body.classList.remove("printing-hr"), 600); };
  }

  /* ---------- a public build page (no account needed) ---------- */
  async function showBuild(token) {
    spin(); document.title = "Build page · Revora";
    if (!sb) return fail("Build pages can't be opened on this copy of Revora.");
    const ok = /^[A-Za-z0-9]{16,40}$/.test(token);
    const { data, error } = ok ? await sb.rpc("get_build", { t: token }) : { data: null };
    if (error || !data) return frame(`<h1 class="disp">This build page isn't available</h1><p class="muted">The owner may have stopped sharing it, or the link is incomplete.</p><button class="btn pri" data-nav="home">Go to Revora</button>`);
    document.title = (data.title || (data.bike && data.bike.name) || "Build") + " · Revora";
    app.innerHTML = `<div class="bp-page"><div class="hr-bar"><a class="pk-logo" href="${esc(url({}))}" aria-label="Revora"><img class="brand-icon" src="img/revora-icon.svg" alt=""><img class="wordmark" src="img/revora-word.svg" alt="Revora"></a>
        <div class="hr-bar-r"><a class="btn sm tan" href="${esc(url(session ? {} : { auth: "signup" }))}">${session ? "Your garage" : "Make a page for your bike"}</a></div></div>
      ${window.rvBuildHtml(data)}
      <section class="bp-com" id="bpCom"></section>
      <p class="gal-more"><a class="btn" href="?builds">See more builds</a></p>
      ${session ? "" : `<section class="bp-cta"><h2>Got a bike of your own?</h2><p>Revora keeps your service log, mods, receipts and photos in one place, and makes a page like this one for free.</p><a class="btn pri" href="${esc(url({ auth: "signup" }))}">Start free</a></section>`}</div>`;
    window.rvBuildBind(app, data, { token, onLike: async () => { const r = await sb.rpc("like_build", { t: token }); return r.error ? null : r.data; } });
    bindComments(token);
  }

  /* ---------- builds gallery: pages their owners chose to list (no account needed) ---------- */
  async function showGallery() {
    spin(); document.title = "Builds · Revora";
    if (!sb) return fail("The builds gallery can't be opened on this copy of Revora.");
    const sort = qs.get("sort") === "liked" ? "liked" : "new";
    const { data, error } = await sb.rpc("list_gallery", { sort, lim: 48, off: 0 });
    const list = error ? [] : data || [], okImg = v => typeof v === "string" && (/^data:image\/(png|jpe?g|webp);base64,/.test(v) || /^img\/sil\/[a-z0-9-]+\.(svg|webp|png)$/.test(v));
    app.innerHTML = `<div class="bp-page gal-page"><div class="hr-bar"><a class="pk-logo" href="${esc(url({}))}" aria-label="Revora"><img class="brand-icon" src="img/revora-icon.svg" alt=""><img class="wordmark" src="img/revora-word.svg" alt="Revora"></a>
        <div class="hr-bar-r"><a class="btn sm tan" href="${esc(url(session ? {} : { auth: "signup" }))}">${session ? "Your garage" : "Share your build"}</a></div></div>
      <header class="gal-h"><span class="eyebrow">Builds</span><h1>Bikes riders are building on Revora</h1><p class="muted">Restorations, rebuilds and daily riders. Tap one to see the story, the photos and the mods.</p>
        <div class="gal-sort"><a class="${sort === "new" ? "on" : ""}" href="?builds">Newest</a><a class="${sort === "liked" ? "on" : ""}" href="?builds&sort=liked">Most liked</a></div></header>
      ${list.length ? `<div class="gal-grid">${list.map(b => `<a class="gal-card" href="?build=${esc(b.id)}"><div class="gal-img${okImg(b.cover) && b.cover.startsWith("img/") ? " sil" : ""}">${okImg(b.cover) ? `<img src="${esc(b.cover)}" alt="" loading="lazy">` : ""}</div>
          <div class="gal-b"><span class="gal-k">${esc([b.style, b.status].filter(Boolean).join(" · ") || "Build")}</span><b>${esc(b.title || b.bike || "A build")}</b>${b.title && b.bike && b.title !== b.bike ? `<small>${esc(b.bike)}</small>` : ""}
          <span class="gal-n"><span>♥ ${+b.likes || 0}</span><span>${+b.comments || 0} comment${+b.comments === 1 ? "" : "s"}</span><span>${+b.views || 0} views</span></span></div></a>`).join("")}</div>`
        : `<div class="bench empty" style="margin-top:20px"><div class="bench-txt"><h2>${error ? "The gallery isn't open yet" : "No builds in the gallery yet"}</h2><p>Publish your bike's build page and tick "Show in the builds gallery" to be one of the first.</p><div class="bench-go"><a class="btn tan big" href="${esc(url(session ? {} : { auth: "signup" }))}">${session ? "Go to your garage" : "Start free"}</a></div></div></div>`}
      </div>`;
  }
  async function bindComments(token) {
    const box = document.getElementById("bpCom"); if (!box) return;
    const load = async () => { const { data, error } = await sb.rpc("get_build_comments", { t: token }); if (error) { box.hidden = true; return; }
      const list = data || [];
      box.innerHTML = `<h2>Comments${list.length ? " (" + list.length + ")" : ""}</h2>
        ${list.map(c => `<div class="bpc"><div><b>${esc(c.name)}</b><small>${esc(new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }))}</small></div><p>${esc(c.body)}</p>${c.can_delete ? `<button class="linkbtn" data-bpc-del="${esc(c.id)}">Delete</button>` : ""}</div>`).join("") || `<p class="muted">No comments yet. Say something nice about the bike.</p>`}
        ${session ? `<form class="bpc-f"><textarea name="body" rows="3" maxlength="600" placeholder="Nice work on the tank. What paint did you use?" required></textarea><button class="btn pri" type="submit">Post comment</button></form>`
          : `<p class="muted"><a href="${esc(url({ auth: "signin" }))}">Sign in</a> or <a href="${esc(url({ auth: "signup" }))}">create a free account</a> to comment.</p>`}`;
      const f = box.querySelector("form"); if (f) f.onsubmit = async e => { e.preventDefault(); const body = f.body.value.trim(); if (!body) return; const b = f.querySelector("button"); b.disabled = true;
        const name = String(profile?.display_name || session.user.email.split("@")[0]).trim().slice(0, 60);
        const { error: er } = await sb.from("build_comments").insert({ build_id: token, name, body }); b.disabled = false; if (er) return note("Couldn't post that. Try again.", true); load(); };
      box.querySelectorAll("[data-bpc-del]").forEach(b => b.onclick = async () => { if (!confirm("Delete this comment?")) return; const { error: er } = await sb.from("build_comments").delete().eq("id", b.dataset.bpcDel); if (er) return note("Couldn't delete it.", true); load(); });
    };
    load();
  }

  /* ---------- a work order estimate the shop sent the customer (no account needed) ---------- */
  async function showWo(token) {
    spin(); document.title = "Estimate · Revora";
    if (!sb) return fail("Estimates can't be opened on this copy of Revora.");
    const ok = /^[A-Za-z0-9]{16,40}$/.test(token);
    const { data, error } = ok ? await sb.rpc("get_wo", { t: token }) : { data: null };
    if (error || !data) return frame(`<h1 class="disp">This estimate isn't available</h1><p class="muted">The shop may have replaced it with a newer one, or the link is incomplete. Ask them to send it again.</p>`);
    document.title = "Estimate from " + ((data.shop && data.shop.name) || "your shop");
    const decided = data.decision ? { decision: data.decision, name: data.decided_name, at: data.decided_at } : null;
    const draw = (d2, note) => {
      app.innerHTML = `<div class="bp-page wo-page"><div class="hr-bar"><span class="wo-from">Estimate from <b>${esc((data.shop && data.shop.name) || "your shop")}</b></span><button class="btn sm" id="woPrint">Print</button></div>
        ${d2 ? `<div class="wo-done ${d2.decision === "declined" ? "no" : ""}"><b>${d2.decision === "declined" ? "You declined this estimate." : "Approved. Thanks!"}</b><span>${d2.decision === "declined" ? "The shop has been told. Give them a call if you want to talk it over." : "The shop can see your approval and will get started."}${note ? " " + esc(note) : ""}</span></div>` : ""}
        ${window.rvWoHtml(Object.assign({}, data, { approval: d2 }), { kind: "estimate" })}
        ${d2 ? "" : `<form class="wo-decide" id="woDec"><h2>Approve this work?</h2><label class="bp-f"><b>Your name</b><input id="wdN" required maxlength="80" autocomplete="name" value="${esc((data.customer && data.customer.name) || "")}"></label>
          <label class="bp-f"><b>Note for the shop (optional)</b><textarea id="wdT" rows="2" maxlength="500" placeholder="e.g. Go ahead, but call me before anything over $100 more."></textarea></label>
          <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn pri" type="submit" data-d="approved">Approve the work</button><button class="btn" type="button" data-d="declined">Decline</button></div>
          <p class="faint" style="font-size:12.5px;margin:6px 0 0">Typing your name and tapping Approve tells the shop to go ahead at this price.</p></form>`}
        <p class="faint wo-pw">Sent with Revora</p></div>`;
      document.getElementById("woPrint").onclick = () => window.print();
      const f = document.getElementById("woDec"); if (!f) return;
      const go2 = async d => {
        const nm = document.getElementById("wdN").value.trim(); if (!nm) { document.getElementById("wdN").focus(); return note2("Type your name first.", true); }
        f.querySelectorAll("button").forEach(b => b.disabled = true);
        const { data: r, error: er } = await sb.rpc("decide_wo", { t: token, d, nm, note: document.getElementById("wdT").value.trim() });
        if (er || r === "bad" || r === "name") { f.querySelectorAll("button").forEach(b => b.disabled = false); return note2("That didn't go through. Check your internet and try again.", true); }
        draw({ decision: r === "done" ? (data.decision || d) : d, name: nm, at: new Date().toISOString() }, r === "done" ? "An answer was already recorded for this estimate." : "");
        window.scrollTo(0, 0);
      };
      f.onsubmit = ev => { ev.preventDefault(); go2("approved"); };
      f.querySelector('[data-d="declined"]').onclick = () => go2("declined");
    };
    const note2 = (t, bad) => { let n2 = document.querySelector(".wo-decide .wo-msg"); if (!n2) { n2 = document.createElement("p"); n2.className = "wo-msg"; document.querySelector(".wo-decide").appendChild(n2); } n2.textContent = t; n2.style.color = bad ? "var(--red)" : ""; };
    draw(decided);
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
    ls.set("rv.feedbackQueue", "[]");
    // also email it to info@revoragarage.com (the reminders worker sends it); the saved copy above is the record
    try { fetch("https://revora-reminders.xavier-j-wilson101.workers.dev/notify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ rows: rows.slice(-5).map(x => ({ kind: x.kind, message: x.message, rating: x.rating, email: x.email, page: x.page, bike: x.bike, device: x.device, user: session ? session.user.email : "" })) }), keepalive: true }).catch(() => {}); } catch (e) {}
    return { ok: true };
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
    if (a) { if (a.dataset.act === "signout") window.rvSignOut(); if (a.dataset.act === "reload") location.reload(); if (a.dataset.act === "install") window.rvInstall().then(o => { if (o === "accepted") showProjects(); }); return; }
    if (e.target.closest("[data-plans]")) { showPlans(); return; }
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
        session = (await sb.auth.getSession()).data.session; window.RV_EMAIL = session && session.user.email; window.RV_JOINED = session && (session.user.email_confirmed_at || session.user.created_at);
        if (session) await loadProfile();
        if (session) await flushPendingReq();
        await loadPrefs();
        if (recovering) return;
      }
    }
    if (qs.get("report")) return showReport(qs.get("report"));
    if (qs.get("build")) return showBuild(qs.get("build"));
    if (qs.has("builds")) return showGallery();
    if (qs.get("wo")) return showWo(qs.get("wo"));
    if (qs.has("paid") && session) return afterPaid();
    if (qs.has("plans")) return showPlans();
    const auth = qs.get("auth"); if (sb && !session && ["signin", "signup"].includes(auth)) return showAuth(auth);
    const pid = qs.get("project"), bid = qs.get("bike");
    if (pid) { if (!sb) return fail("Accounts aren't set up on this site yet."); if (!session) return showAuth("signin"); return openProject(pid); }
    if (bid && bikeOf(bid)) { ls.set("rv.bike", bid); return openApp(bid, null); }
    if (session && profile && profile.plan_chosen === false && !myPlan().admin) return showChoosePlan();
    if (session) return showProjects();
    // signed out: the plain link lands on the page that explains Revora, with sign-up one click away
    if (sb && !qs.has("pick")) return showLanding();
    const last = ls.get("rv.bike");
    if (!sb && !qs.has("pick") && last && bikeOf(last)) return openApp(last, null);
    showPicker("try");
  }
  /* ---------- install as an app ---------- */
  let installEv = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEv = e; document.documentElement.classList.add("can-install"); });
  window.addEventListener("appinstalled", () => { installEv = null; document.documentElement.classList.remove("can-install"); note("Revora is installed. Open it from your home screen."); });
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS() && !standalone()) document.documentElement.classList.add("ios-install");
  window.rvCanInstall = () => !standalone() && (!!installEv || isIOS());
  window.rvInstall = async () => {
    if (installEv) { installEv.prompt(); const r = await installEv.userChoice.catch(() => null); installEv = null; document.documentElement.classList.remove("can-install"); return r && r.outcome; }
    const box = document.createElement("div"); box.className = "pk-modal";
    box.innerHTML = `<div class="pk-card"><h2 class="disp-s">Add Revora to your home screen</h2><ol class="ins-steps"><li>Tap the <b>Share</b> button at the bottom of Safari (the square with an arrow).</li><li>Scroll down and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. Revora opens like an app from then on.</li></ol><div class="pk-links"><button class="btn pri" data-close>Got it</button></div></div>`;
    box.querySelector("[data-close]").onclick = () => box.remove(); document.body.appendChild(box); return "shown";
  };
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

  start();
})();
