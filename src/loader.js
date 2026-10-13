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
    app.innerHTML = `<div class="pick${opts.garage ? " is-garage" : ""}"><div class="pk-top"><button class="pk-logo" data-nav="home"><b>Revora</b></button>${right}</div><div class="pick-in ${opts.wide ? "wide" : ""}">${inner}</div></div>`;
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
  function card(b) {
    const x = b.extras || {};
    return `<button class="pick-card" data-bike="${esc(b.id)}"><span class="pick-yr">${esc(b.year)}</span><b>${esc(b.make)} ${esc(b.model)}</b><span class="muted">${esc(b.variant || "")}</span>
      <span class="pick-tags"><span class="tag">${b.diagrams} parts diagrams</span><span class="tag">Parts list</span><span class="tag">Course</span>${x.diagrams3d ? `<span class="tag pro">3D</span>` : ""}</span></button>`;
  }
  function showPicker(mode) { // mode "try" (no account) or "new" (start a project)
    document.title = mode === "new" ? "New project · Revora" : "Find your bike · Revora";
    const makes = [...new Set(INDEX.map(b => b.make))].sort();
    frame(`${mode === "new" ? `<div class="eyebrow">New project</div><h1 class="disp">Which bike are you restoring?</h1>` : `<div class="eyebrow">Motorcycle restoration</div><h1 class="disp">Find your bike</h1>
      <p class="muted">Pick your bike to get its parts diagrams, part numbers, a step-by-step restoration course and a tracker for every part.</p>`}
      <div class="pick-search"><input type="search" id="pickQ" placeholder="Year, make, model, e.g. 1977 Suzuki GS750" autocomplete="off" autofocus aria-label="Search for your bike"></div>
      <div class="pick-makes">${makes.map(m => `<button class="chip" data-make="${esc(m)}">${esc(m)}</button>`).join("")}</div>
      <div class="pick-list" id="pickList"></div>
      ${mode === "try" && sb && !session ? `<p class="muted pk-small">Trying it without an account saves to this browser only. <button class="linkbtn" data-nav="signup">Create a free account</button> to keep your project and share it with your team.</p>` : ""}`, { wide: true });
    const q = document.getElementById("pickQ"), list = document.getElementById("pickList");
    const draw = () => {
      const hits = INDEX.filter(b => match(b, q.value)).sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model) || a.year - b.year);
      list.innerHTML = hits.length ? hits.map(card).join("") : `<div class="pick-none"><b>We don't have that bike yet.</b><span class="muted">The library is growing. Check back soon, or try a nearby year or model.</span></div>`;
    };
    q.oninput = draw; draw();
    list.onclick = async e => { const b = e.target.closest("[data-bike]"); if (!b) return; if (mode === "new") await createProject(b.dataset.bike); else { ls.set("rv.bike", b.dataset.bike); goUrl({ bike: b.dataset.bike }); } };
    app.querySelector(".pick-makes").onclick = e => { const m = e.target.closest("[data-make]"); if (m) { q.value = m.dataset.make; draw(); q.focus(); } };
  }

  /* ---------- accounts ---------- */
  function showAuth(kind) {
    const T = { signin: ["Sign in", "Sign in"], signup: ["Create your account", "Create account"], forgot: ["Reset your password", "Email me a reset link"], newpass: ["Choose a new password", "Save password"] }[kind];
    document.title = T[0] + " · Revora";
    frame(`<h1 class="disp">${T[0]}</h1>
      <form class="pk-form" id="authF" novalidate>
        ${kind === "signup" ? `<label>Your name<input name="name" autocomplete="name" required></label>` : ""}
        ${kind !== "newpass" ? `<label>Email<input name="email" type="email" autocomplete="email" required></label>` : ""}
        ${kind !== "forgot" ? `<label>Password<input name="password" type="password" autocomplete="${kind === "signin" ? "current-password" : "new-password"}" minlength="8" required></label>` : ""}
        ${kind === "signup" || kind === "newpass" ? `<span class="muted pk-small">At least 8 characters.</span>` : ""}
        <div class="pk-err" id="authErr" hidden></div>
        <button class="btn pri big" type="submit">${T[1]}</button>
      </form>
      <div class="pk-links">${kind === "signin" ? `<button class="linkbtn" data-nav="forgot">Forgot your password?</button><span>No account? <button class="linkbtn" data-nav="signup">Create one</button></span>` : kind === "signup" ? `<span>Already have an account? <button class="linkbtn" data-nav="signin">Sign in</button></span>` : `<button class="linkbtn" data-nav="signin">Back to sign in</button>`}</div>`);
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
  function greeting() { const h = new Date().getHours(); return h < 5 ? "Late night in the garage" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }

  async function showProjects() {
    document.title = "Your garage · Revora"; spin();
    const { data, error } = await sb.from("my_projects").select("*").order("created_at", { ascending: false });
    if (error) return fail(friendly(error));
    const prog = await projectProgress(data.map(p => p.id));
    const first = String(profile?.display_name || session.user.email || "").split(/[\s@]/)[0];
    const lastId = ls.get("rv.project"), feat = data.find(p => p.id === lastId) || data[0];
    const pctOf = p => { const g = prog[p.id]; return g && g.total ? g.done / g.total * 100 : 0; };
    const who = p => p.role === "owner" ? (p.members > 1 ? `You and ${p.members - 1} other${p.members > 2 ? "s" : ""}` : "Just you") : p.role === "viewer" ? "Shared with you, view only" : "Shared with you";
    const tag = p => { const b = bikeOf(p.bike_id), g = prog[p.id], pc = pctOf(p); return `<article class="gt">
        <button class="gt-open" data-project="${esc(p.id)}" aria-label="Open ${esc(p.name || bikeName(b))}">
          <span class="gt-bike">${esc((p.name && p.name !== bikeName(b)) ? bikeName(b) : (b && b.variant) || "")}</span><b class="gt-name">${esc(p.name || bikeName(b))}</b>
          <span class="gt-bar" aria-hidden="true"><i style="width:${pc.toFixed(1)}%"></i></span>
          <span class="gt-meta">${g && g.total ? `${g.done} of ${g.total} steps` : "Not started"}<span>${esc(who(p))}</span></span></button>
        ${p.role === "owner" ? `<div class="gt-acts"><button class="linkbtn" data-share="${esc(p.id)}">Share</button><button class="linkbtn" data-rename="${esc(p.id)}">Rename</button></div>` : ""}</article>`; };
    const fb = feat && bikeOf(feat.bike_id), fg = feat && prog[feat.id];
    frame(`<section class="gh">
        <div class="gh-hi"><h1 class="gh-title">${esc(greeting())}${first ? `, ${esc(first)}` : ""}.</h1>
          <p class="muted">${data.length ? (data.length === 1 ? "One bike in your garage." : `${data.length} bikes in your garage.`) : "Your garage is empty. Add the bike you're working on to get started."}</p></div>
        ${feat ? `<div class="bench">
          <div class="bench-dial">${tach(pctOf(feat))}</div>
          <div class="bench-txt"><span class="bench-k">${lastId === feat.id ? "Last opened" : "Newest project"}</span>
            <h2>${esc(feat.name || bikeName(fb))}</h2><span class="bench-bike">${esc([feat.name && feat.name !== bikeName(fb) ? bikeName(fb) : "", fb && fb.variant].filter(Boolean).join(", "))}</span>
            ${fg && fg.next ? `<div class="bench-next"><span>Next step</span><b>${esc(fg.next)}</b></div>` : fg && fg.total ? `<div class="bench-next"><span>Course</span><b>Every step is done. Time to ride.</b></div>` : ""}
            <div class="bench-go"><button class="btn tan big" data-project="${esc(feat.id)}">Open project</button><button class="btn ghost-l" data-nav="new">Start another bike</button></div></div>
          <img class="bench-art" src="img/bike.svg" alt=""></div>`
        : `<div class="bench empty"><div class="bench-txt"><h2>What are you restoring?</h2><p>Pick your bike and you get its parts diagrams, part numbers, a step-by-step course and a tracker for every piece.</p>
            <div class="bench-go"><button class="btn tan big" data-nav="new">Add your bike</button></div></div><img class="bench-art" src="img/bike.svg" alt=""></div>`}
      </section>
      ${data.length ? `<section class="garage"><div class="garage-h"><h2>Your garage</h2><button class="btn sm" data-nav="new">+ New project</button></div>
        <div class="gts">${data.map(tag).join("")}<button class="gt gt-new" data-nav="new"><b>Add a bike</b><span>Start a new project for another bike</span></button></div></section>` : ""}
      <section class="gfoot"><div><b>Working with a team?</b><span>Share a project and everyone sees the same parts, steps and photos, live. Owners can give edit or view access.</span></div>
        <div><b>Bike not listed?</b><span>The library is growing. Browse what's there now.</span><button class="linkbtn" data-nav="browse">Browse bikes</button></div></section>`, { wide: true, garage: true });
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

  /* ---------- for the app ---------- */
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
        if (recovering) return;
      }
    }
    const auth = qs.get("auth"); if (sb && !session && ["signin", "signup"].includes(auth)) return showAuth(auth);
    const pid = qs.get("project"), bid = qs.get("bike");
    if (pid) { if (!sb) return fail("Accounts aren't set up on this site yet."); if (!session) return showAuth("signin"); return openProject(pid); }
    if (bid && bikeOf(bid)) { ls.set("rv.bike", bid); return openApp(bid, null); }
    if (session) return showProjects();
    const last = ls.get("rv.bike");
    if (!qs.has("pick") && last && bikeOf(last)) return openApp(last, null);
    showPicker("try");
  }
  start();
})();
