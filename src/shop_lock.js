/* ============ Revora Shop: who's working, PINs, owner mode and the employee app ============
   On a computer signed in as the shop owner, Revora opens to "Who's working?". The owner's master PIN opens the full shop
   (owner mode, locks after 30 idle minutes). An employee's PIN opens the employee app: find clients, log work, check bikes in,
   and see only the bikes they're assigned or have worked on. Employees can also use their own phone: the link from the owner
   signs that phone in as them (no Revora account). Every PIN is checked by the database, never here. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n = v => +v || 0, D = () => window.rvDue, digits = s => String(s || "").replace(/\D/g, "");
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} } };
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };
  const OWNER_IDLE = 30 * 60e3, EMP_IDLE = 10 * 60e3;
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = { lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>', gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/>', back: '<path d="M15 5l-7 7 7 7"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>', key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>', check: '<path d="M5 12l4 4 10-10"/>' };
  const initials = nm => String(nm || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
  let X = null;

  /* ---------- owner mode ---------- */
  const ownerOpen = () => n(ss.get("rv.ownerUntil")) > Date.now();
  const ownerTouch = () => { if (ownerOpen()) ss.set("rv.ownerUntil", String(Date.now() + OWNER_IDLE)); };
  function lockAll(go) {
    const t = ss.get("rv.empSess"); if (t && X && X.sb) X.sb.rpc("emp_lock", { tok: t }).then(() => {}, () => {});
    ss.set("rv.ownerUntil", null); ss.set("rv.empSess", null);
    if (go !== false) location.href = location.pathname + (ls.get("rv.empdev") && !(X && X.session) ? "" : "?crm");
  }
  let idleT = null;
  function watchIdle(kind) {
    clearInterval(idleT); let last = Date.now();
    const bump = () => { last = Date.now(); if (kind === "owner") ownerTouch(); };
    ["pointerdown", "keydown", "touchstart", "wheel"].forEach(ev => window.addEventListener(ev, bump, { passive: true }));
    idleT = setInterval(() => { if (Date.now() - last > (kind === "owner" ? OWNER_IDLE : EMP_IDLE)) { clearInterval(idleT); lockAll(); } }, 30e3);
  }

  /* ---------- the PIN pad ---------- */
  function pinPad(host, opts) {   // opts: { title, sub, avatar, onPin(pin) -> Promise<string|null error>, back }
    host.innerHTML = `<div class="lk-pad">${opts.back ? `<button class="lk-back" data-back>${ic(IC.back)} ${esc(opts.back)}</button>` : ""}
      <span class="lk-av big">${esc(opts.avatar || "")}</span><h2>${esc(opts.title)}</h2>${opts.sub ? `<p>${opts.sub}</p>` : ""}
      <div class="lk-dots" aria-live="polite"><i></i><i></i><i></i><i></i></div><p class="lk-err" role="alert"></p>
      <div class="lk-keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button data-k="${k}">${k}</button>`).join("")}<span></span><button data-k="0">0</button><button data-k="del" aria-label="Delete">⌫</button></div>
      <input class="lk-hidden" inputmode="numeric" autocomplete="one-time-code" maxlength="4" aria-label="PIN"></div>`;
    let pin = "", busy = false;
    const dots = host.querySelectorAll(".lk-dots i"), er = host.querySelector(".lk-err"), inp = host.querySelector(".lk-hidden");
    const paint = () => dots.forEach((d, i) => d.classList.toggle("on", i < pin.length));
    const push = async k => {
      if (busy) return; er.textContent = "";
      if (k === "del") pin = pin.slice(0, -1); else if (pin.length < 4) pin += k;
      paint(); if (pin.length < 4) return;
      busy = true; host.querySelector(".lk-pad").classList.add("busy");
      const msg = await opts.onPin(pin).catch(() => "That didn't go through. Check your internet.");
      busy = false; host.querySelector(".lk-pad")?.classList.remove("busy");
      if (msg) { er.textContent = msg; pin = ""; paint(); host.querySelector(".lk-dots")?.classList.add("shake"); setTimeout(() => host.querySelector(".lk-dots")?.classList.remove("shake"), 400); }
    };
    host.querySelectorAll("[data-k]").forEach(b => b.onclick = () => push(b.dataset.k));
    const kd = ev => { if (!host.isConnected) return document.removeEventListener("keydown", kd); if (/^[0-9]$/.test(ev.key)) push(ev.key); else if (ev.key === "Backspace") push("del"); else if (ev.key === "Escape" && opts.back) host.querySelector("[data-back]")?.click(); };
    document.addEventListener("keydown", kd);
    const bk = host.querySelector("[data-back]"); if (bk) bk.onclick = () => { document.removeEventListener("keydown", kd); opts.onBack(); };
    if (matchMedia && matchMedia("(pointer:coarse)").matches) { /* phones use the on-screen keys */ }
  }
  const PINMSG = { wrong: "Wrong PIN. Try again.", locked: "Too many wrong tries. Wait 10 minutes and try again.", denied: "That login isn't available on this computer.", device: "This phone was signed out. Open the link from your shop again.", link: "This link doesn't work any more. Ask the owner for a new one." };

  function frame(inner, shopName) {
    X.app.innerHTML = `<div class="lk"><header class="lk-top"><span class="sx-brand"><img src="img/revora-icon.svg" alt=""><img class="sx-word" src="img/revora-word-white.svg" alt="Revora"></span>${shopName ? `<span class="sx-shopname">${esc(shopName)}</span>` : ""}</header><main class="lk-main">${inner}</main></div>`;
    return X.app.querySelector(".lk-main");
  }

  /* ---------- the owner's computer: who's working? ---------- */
  async function gate(ctx, shop, next) {
    X = ctx; document.title = (shop.name || "Shop") + " · Revora";
    // an employee who's already clocked in on this computer
    if (ss.get("rv.empSess")) return empApp(ctx);
    const hasPin = await ctx.sb.rpc("shop_has_master_pin").then(r => r.data, () => true);
    if (!hasPin) return setMasterPin(ctx, shop, next, true);
    const { data: emps } = await ctx.sb.from("shop_employees").select("id,name,email,status").eq("shop_id", shop.id).neq("status", "removed").order("name");
    const list = emps || [], me = (ctx.profile && ctx.profile.display_name) || "Owner";
    const who = () => {
      const m = frame(`<section class="lk-who"><h1>Who's working?</h1><p>Tap your name and enter your PIN.</p>
        <div class="lk-tiles"><button class="lk-tile own" data-own><span class="lk-av">${esc(initials(me))}</span><b>${esc(me)}</b><small>Owner</small></button>
          ${list.map(e => `<button class="lk-tile" data-emp="${esc(e.id)}"><span class="lk-av">${esc(initials(e.name || e.email))}</span><b>${esc(e.name || e.email || "New employee")}</b><small>${e.status === "invited" ? "First time? Use the starting PIN" : "Employee"}</small></button>`).join("")}</div>
        ${list.length ? "" : `<p class="lk-hint">Add your employees in the shop's Team page, then they log in here with their own PIN.</p>`}</section>`, shop.name);
      m.querySelector("[data-own]").onclick = () => pinPad(m, { title: me, sub: "Owner PIN", avatar: initials(me), back: "Back", onBack: who,
        onPin: async p => { const { data: r, error } = await ctx.sb.rpc("shop_master_unlock", { p }); if (error) throw error; if (r !== "ok") return PINMSG[r] || "Wrong PIN.";
          ss.set("rv.ownerUntil", String(Date.now() + OWNER_IDLE)); next(); return null; } });
      m.querySelectorAll("[data-emp]").forEach(b => b.onclick = () => { const e = list.find(x => x.id === b.dataset.emp);
        pinPad(m, { title: e.name || e.email || "Employee", sub: e.status === "invited" ? "Enter the starting PIN from the owner" : "Your PIN", avatar: initials(e.name || e.email), back: "Back", onBack: who,
          onPin: async p => { const { data: r, error } = await ctx.sb.rpc("shop_owner_emp_unlock", { eid: e.id, p }); if (error) throw error; if (r.error) return PINMSG[r.error] || "Wrong PIN.";
            ss.set("rv.empSess", r.session); empApp(ctx); return null; } }); });
    };
    who();
  }
  // the owner picks the master PIN (first time) or changes it
  function setMasterPin(ctx, shop, next, first) {
    X = ctx; let p1 = "";
    const m = frame(`<div id="lkHost"></div>`, shop.name), host = m.querySelector("#lkHost");
    const ask = () => pinPad(host, { title: first ? "Pick your owner PIN" : "New owner PIN", sub: "4 numbers. It opens the full shop on this computer. Employees get their own PINs.", avatar: "", onPin: async p => { p1 = p; confirmIt(); return null; } });
    const confirmIt = () => pinPad(host, { title: "Type it again", sub: "", avatar: "", back: "Start over", onBack: ask,
      onPin: async p => { if (p !== p1) return "Those didn't match. Try again.";
        let old = null; if (!first) old = prompt("Your current owner PIN:"); const { data: r, error } = await ctx.sb.rpc("shop_set_master_pin", { old, p });
        if (error) throw error; if (r === "wrong") return "Your current PIN was wrong."; if (r !== "ok") return "That PIN didn't save.";
        ss.set("rv.ownerUntil", String(Date.now() + OWNER_IDLE)); next(); return null; } });
    ask();
  }

  /* ---------- an employee's own phone ---------- */
  async function phoneStart(ctx) {
    X = ctx; const dev = ls.get("rv.empdev");
    if (ss.get("rv.empSess")) return empApp(ctx);
    const { data: d } = await ctx.sb.rpc("emp_device", { dev });
    if (!d) { ls.set("rv.empdev", null); const m = frame(`<section class="lk-who"><h1>Signed out</h1><p>This phone isn't signed in to a shop any more. Ask the owner for a new link.</p><a class="btn" href="${esc(location.pathname)}">Open Revora</a></section>`); return; }
    const m = frame(`<div id="lkHost"></div><p class="lk-foot"><button class="linkbtn" data-forget>Not ${esc(String(d.name).split(" ")[0] || "you")}? Sign this phone out of ${esc(d.shop)}</button> · <button class="linkbtn" data-own>Use my own Revora</button></p>`, d.shop);
    pinPad(m.querySelector("#lkHost"), { title: d.name || "Employee", sub: "Your PIN", avatar: initials(d.name), onPin: async p => {
      const { data: r, error } = await ctx.sb.rpc("emp_unlock", { dev, p }); if (error) throw error; if (r.error) return PINMSG[r.error] || "Wrong PIN.";
      ss.set("rv.empSess", r.session); empApp(ctx); return null; } });
    m.querySelector("[data-forget]").onclick = async () => { if (!confirm("Sign this phone out of " + d.shop + "? You'll need a new link from the owner.")) return; await ctx.sb.rpc("emp_forget_device", { dev }); ls.set("rv.empdev", null); location.href = location.pathname; };
    m.querySelector("[data-own]").onclick = () => { ss.set("rv.ownRevora", "1"); location.href = location.pathname; };
  }
  // the link from the owner
  async function inviteLink(ctx, inv) {
    X = ctx; try { history.replaceState(null, "", location.pathname); } catch (e) {}
    const { data: info } = await ctx.sb.rpc("emp_invite_info", { inv });
    if (!info) { frame(`<section class="lk-who"><h1>This link doesn't work</h1><p>It may have been replaced with a new one. Ask the shop owner to send it again.</p></section>`); return; }
    const m = frame(`<section class="lk-who"><div class="eyebrow">Revora Shop</div><h1>${esc(info.shop)}</h1><p>${info.setup ? "Enter the 4-number starting PIN the owner sent you. Then you'll pick your own." : "Enter your PIN to sign this phone in."}</p></section><div id="lkHost"></div>`, info.shop);
    pinPad(m.querySelector("#lkHost"), { title: info.name || "Welcome", sub: info.setup ? "Starting PIN" : "Your PIN", avatar: initials(info.name), onPin: async p => {
      const { data: r, error } = await ctx.sb.rpc("emp_claim", { inv, p }); if (error) throw error; if (r.error) return PINMSG[r.error] || "Wrong PIN.";
      // a computer signed in as the shop owner keeps using "Who's working?" instead of remembering one employee
      if (!ctx.session) ls.set("rv.empdev", r.device);
      ss.set("rv.empSess", r.session); empApp(ctx); return null; } });
  }

  /* ---------- the employee app ---------- */
  let E = null;   // { tok, emp, shop, home }
  const rpc = async (name, args) => { const { data, error } = await X.sb.rpc(name, Object.assign({ tok: E.tok }, args || {})); if (error) { if (/locked/i.test(error.message || "")) { lockAll(); throw new Error("locked"); } throw error; } return data; };
  const note = (m, bad) => X.note(m, bad);
  const err = e => (e && e.message) || "That didn't go through. Check your internet and try again.";
  async function empApp(ctx) {
    X = ctx; E = { tok: ss.get("rv.empSess") };
    let c; try { c = await rpc("emp_ctx"); } catch (e) { return; }
    if (!c) return lockAll();
    E.emp = c.employee; E.shop = c.shop;
    if (c.setup) return setupPage();
    if (!c.plan_ok) { frame(`<section class="lk-who"><h1>The shop's plan isn't active</h1><p>Ask the owner to renew Revora Shop. Nothing is lost.</p><button class="btn" data-lock>Lock</button></section>`, E.shop.name).querySelector("[data-lock]").onclick = () => lockAll(); return; }
    watchIdle("emp"); home();
  }
  function setupPage() {
    const m = frame(`<section class="lk-setup"><div class="eyebrow">First time</div><h1>Set up your login</h1><p>Your name goes on the work you log. Your email gets things the shop sends you.</p>
      <form class="sx-form" id="suF" novalidate><label class="sx-f"><b>Your name</b><input name="name" required maxlength="80" value="${esc(E.emp.name || "")}" autocomplete="name"></label>
        <label class="sx-f"><b>Email</b><input name="email" type="email" maxlength="200" value="${esc(E.emp.email || "")}" autocomplete="email"></label>
        <div class="sx-f2"><label class="sx-f"><b>Your own PIN</b><input name="p1" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" type="password" autocomplete="new-password" placeholder="4 numbers"></label><label class="sx-f"><b>Type it again</b><input name="p2" inputmode="numeric" maxlength="4" type="password" autocomplete="new-password"></label></div>
        <p class="sx-small">Only you should know it. You'll use it every time you log in, on the shop's computer or your phone.</p><p class="sx-err" hidden></p>
        <div class="sx-acts left"><button class="btn tan big" type="submit">Save and start</button></div></form></section>`, E.shop && E.shop.name);
    const f = m.querySelector("#suF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); const d = Object.fromEntries(new FormData(f)); const bad = t => { er.textContent = t; er.hidden = false; };
      if (!d.name.trim()) return bad("Add your name."); if (d.email && !/^\S+@\S+\.\S+$/.test(d.email.trim())) return bad("That email doesn't look right.");
      if (!/^[0-9]{4}$/.test(d.p1)) return bad("Your PIN needs to be 4 numbers."); if (d.p1 !== d.p2) return bad("The two PINs don't match.");
      try { const r = await rpc("emp_setup", { nm: d.name, em: d.email, p: d.p1 }); if (r !== "ok") return bad("That didn't save. Try again."); } catch (e) { return bad(err(e)); }
      empApp(X); setTimeout(() => note("You're set. Use your own PIN from now on."), 300); };
  }
  function shell(inner) {
    X.app.innerHTML = `<div class="sx emp"><header class="sx-top"><div class="sx-top-in"><a class="sx-brand" href="#" data-home><img src="img/revora-icon.svg" alt=""><img class="sx-word" src="img/revora-word-white.svg" alt="Revora"><span class="sx-shopname">${esc(E.shop.name || "Shop")}</span></a>
      <div class="sx-me"><span class="lk-me"><span class="lk-av sm">${esc(initials(E.emp.name))}</span>${esc(E.emp.name)}</span><button class="btn sm lk-lock" data-lock>${ic(IC.lock)} Lock</button></div></div></header><main class="sx-main">${inner}</main></div>`;
    X.app.querySelector("[data-home]").onclick = ev => { ev.preventDefault(); home(); };
    X.app.querySelector("[data-lock]").onclick = () => lockAll();
    window.scrollTo(0, 0);
  }
  async function home() {
    shell(`<div class="spinner" style="margin:60px auto"></div>`);
    let h; try { h = await rpc("emp_home"); } catch (e) { return; }
    E.home = h || { bikes: [], recent: [] };
    const assigned = E.home.bikes.filter(b => b.assigned), worked = E.home.bikes.filter(b => !b.assigned);
    const card = b => `<button class="sx-row" data-client="${esc(b.client_id)}"><span class="grow"><b>${esc(b.client)}</b><small>${esc(b.name)}${b.last ? " · you last logged " + esc(D().fmtDate(b.last)) : ""}</small></span>${b.assigned ? `<span class="pill blue plain">Assigned</span>` : ""}</button>`;
    shell(`<section class="sx-hero"><div class="sx-hero-t"><h1>Hi, ${esc(String(E.emp.name).split(" ")[0])}.</h1><p>Find a client to log work, or check a new one in.</p></div>
        <div class="sx-find"><div class="sx-qwrap">${ic(IC.search)}<input id="eQ" type="search" placeholder="Find a client by name, phone or bike" autocomplete="off" aria-label="Find a client"><div class="sx-hits" id="eHits" hidden></div></div>
          <button class="btn tan big" data-new>${ic(IC.plus)} New client</button></div></section>
      <div class="sx-grid2"><section class="sx-panel"><div class="sx-ph"><h2>Assigned to you</h2><span>${assigned.length}</span></div>${assigned.length ? `<div class="sx-rows">${assigned.map(card).join("")}</div>` : `<div class="sx-empty sm"><span>Nothing assigned right now. The owner can assign clients to you.</span></div>`}</section>
        <section class="sx-panel"><div class="sx-ph"><h2>Bikes you've worked on</h2><span>${worked.length}</span></div>${worked.length ? `<div class="sx-rows">${worked.map(card).join("")}</div>` : `<div class="sx-empty sm"><span>Bikes you log work on show up here.</span></div>`}</section></div>
      <section class="sx-panel"><div class="sx-ph"><h2>Your recent work</h2></div>${E.home.recent.length ? `<div class="sx-rows">${E.home.recent.map(r => `<button class="sx-row" data-client="${esc(r.client_id)}"><span class="sx-date">${esc(D().fmtDate(r.date))}</span><span class="grow"><b>${esc(r.service || "Service")}</b><small>${esc(r.client)} · ${esc(r.bike)}</small></span></button>`).join("")}</div>` : `<div class="sx-empty sm"><span>Nothing logged yet.</span></div>`}</section>`);
    X.app.querySelectorAll("[data-client]").forEach(b => b.onclick = () => client(b.dataset.client));
    X.app.querySelector("[data-new]").onclick = () => newClient("");
    const q = X.app.querySelector("#eQ"), out = X.app.querySelector("#eHits"); let t = null, seq = 0;
    q.oninput = () => { clearTimeout(t); const v = q.value.trim(); if (v.length < 2) { out.hidden = true; return; }
      t = setTimeout(async () => { const my = ++seq; let r = []; try { r = await rpc("emp_search", { q: v }); } catch (e) {} if (my !== seq) return;
        out.hidden = false;
        out.innerHTML = r.length ? r.map(c => `<button class="sx-hit" data-client="${esc(c.id)}"><span class="sx-av">${esc(initials(c.name))}</span><span class="grow"><b>${esc(c.name)}</b><small>${esc([c.phone, (c.bikes || []).join(", ")].filter(Boolean).join(" · "))}</small></span></button>`).join("")
          : `<div class="sx-nohit"><span>No client called "${esc(v)}".</span><button class="btn sm pri" data-newname>${ic(IC.plus)} Check them in as new</button></div>`;
        out.querySelectorAll("[data-client]").forEach(b => b.onclick = () => client(b.dataset.client));
        const nb = out.querySelector("[data-newname]"); if (nb) nb.onclick = () => newClient(v); }, 220); };
    q.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); const f = out.querySelector("[data-client],[data-newname]"); if (f) f.click(); } };
    if (!(matchMedia && matchMedia("(pointer:coarse)").matches)) q.focus();
  }
  async function client(cid) {
    shell(`<div class="spinner" style="margin:60px auto"></div>`);
    let c; try { c = await rpc("emp_client", { cid }); } catch (e) { return; }
    if (!c) return home();
    c.bikes.forEach(b => { b.c = D().compute(b); });
    const by = r => r.byEmp ? (r.byEmp.id === E.emp.id ? "you" : r.byEmp.name) : r.byOwner || r.shop || "";
    shell(`<button class="sx-back" data-home2>${ic(IC.back)} Back</button>
      <section class="sx-cmain"><span class="sx-av big">${esc(initials(c.name))}</span><div><h1>${esc(c.name)}</h1>
        <div class="sx-cts">${c.phone ? `<a href="tel:${esc(digits(c.phone))}" class="sx-ct">${ic(IC.phone)}${esc(c.phone)}</a>` : ""}${c.email ? `<span class="sx-ct">${esc(c.email)}</span>` : ""}</div>${c.notes ? `<p class="sx-cnote">${esc(c.notes)}</p>` : ""}</div></section>
      ${c.bikes.map(b => { const items = b.c.ranked.filter(i => i.status !== "nointerval"), wos = (b.workorders || []).filter(w => !["Picked up", "Declined"].includes(w.status));
        return `<section class="sx-bike" data-bike="${esc(b.id)}"><div class="sx-bh"><div class="grow"><h3>${esc((b.meta && b.meta.bike) || b.name)}</h3><div class="sx-bmeta">${b.c.odo ? `<span>${D().milesFmt(b.c.odo.miles)} mi</span>` : `<span class="faint">No odometer reading yet</span>`}${b.assigned ? `<span class="pill blue plain">Assigned to you</span>` : ""}</div></div>
          <div class="sx-bacts"><button class="btn tan" data-log>${ic(IC.wrench)} Log work</button><button class="btn" data-odo>${ic(IC.gauge)} Odometer</button></div></div>
          ${wos.length ? `<div class="sx-wos">${wos.map(w => `<span class="sx-wo"><b>${esc(w.title || "Work order")}</b><span class="pill ${w.status === "Done" ? "green" : /Waiting/.test(w.status) ? "amber" : "blue"}">${esc(w.status)}</span></span>`).join("")}</div>` : ""}
          <div class="sx-bbody"><div class="sx-due"><h4>What's due</h4>${items.length ? `<div class="sx-dl">${items.slice(0, 10).map(i => `<div class="sx-di ${i.status}"><span class="grow"><b>${esc(i.name)}</b><small>${esc(i.every ? "Every " + i.every : "")}</small></span><span class="sx-when">${esc(D().whenTxt(i))}</span><span class="pill ${D().PILL[i.status][0]}">${D().PILL[i.status][1]}</span></div>`).join("")}</div>` : `<p class="sx-small">No service schedule yet.</p>`}</div>
            <div class="sx-mods"><h4>History</h4>${b.c.done.length ? b.c.done.slice(0, 10).map(r => `<div class="sx-mi"><span class="grow"><b>${esc(r.service || "Service")}</b><small>${esc([D().fmtDate(r.date), n(r.odometer) ? D().milesFmt(r.odometer) + " mi" : "", by(r) ? "by " + by(r) : ""].filter(Boolean).join(" · "))}</small></span>${r.byEmp && r.byEmp.id === E.emp.id ? `<button class="linkbtn" data-edit="${esc(r.id)}">Edit</button>` : ""}</div>`).join("") : `<p class="sx-small">Nothing logged yet.</p>`}</div></div></section>`; }).join("")}
      ${c.bikes.length ? "" : `<div class="sx-panel sx-empty"><b>No bike on file.</b><span>Add their bike to log work on it.</span></div>`}
      <div class="sx-acts left"><button class="btn" data-addbike>${ic(IC.plus)} Add a bike</button></div>`);
    X.app.querySelector("[data-home2]").onclick = () => home();
    X.app.querySelector("[data-addbike]").onclick = () => bikeBox(c);
    X.app.querySelectorAll(".sx-bike").forEach(card => { const b = c.bikes.find(x => x.id === card.dataset.bike);
      card.querySelector("[data-log]").onclick = () => logBox(c, b, null);
      card.querySelector("[data-odo]").onclick = () => odoBox(c, b);
      card.querySelectorAll("[data-edit]").forEach(x => x.onclick = () => logBox(c, b, b.maintenance.find(r => r.id === x.dataset.edit))); });
  }
  function modal(inner, title) {
    const box = document.createElement("div"); box.className = "pk-modal sx-modal";
    box.innerHTML = `<div class="pk-card sx-card wide" role="dialog" aria-modal="true"><div class="sx-mh"><h2>${esc(title)}</h2><button class="sx-x" data-close aria-label="Close">×</button></div>${inner}</div>`;
    box.addEventListener("click", ev => { if (ev.target.closest("[data-close]")) box.remove(); });
    document.body.appendChild(box); box.close = () => box.remove(); return box;
  }
  const nextId = (list, pre, pad) => { let mx = 0; (list || []).forEach(r => { const m = String(r.id).match(/(\d+)$/); if (m) mx = Math.max(mx, +m[1]); }); return pre + String(mx + 1).padStart(pad, "0"); };
  async function syncRem(b, name) { try { const c = D().compute(b); await rpc("emp_sync_reminders", { pid: b.id, rows: D().reminderRows(c, name) }); } catch (e) {} }
  function logBox(c, b, rec) {
    const r = rec || {}, sched = (b.schedule || []).slice().sort((x, y) => n(x.order) - n(y.order)), st = new Map(b.c.items.map(i => [i.id, i.status]));
    const m = modal(`<form class="sx-form" id="elF" novalidate>
      <div class="sx-f2"><label class="sx-f"><b>Date</b><input name="date" type="date" value="${esc(r.date || D().today())}" max="${D().today()}"></label><label class="sx-f"><b>Odometer (mi)</b><input name="odometer" inputmode="numeric" value="${r.odometer ? n(r.odometer) : ""}" placeholder="${b.c.odo ? "Last: " + D().milesFmt(b.c.odo.miles) : ""}"></label></div>
      <label class="sx-f"><b>What you did</b><input name="service" maxlength="200" value="${esc(r.service || "")}" placeholder="Oil and filter change, new rear tire…"></label>
      <div class="sx-f"><b>Tick what this covers, so the next due dates reset</b><div class="sx-ticks">${sched.map(s => `<label class="sx-tick ${st.get(s.id) || ""}"><input type="checkbox" name="items" value="${esc(s.id)}" ${(r.items || []).includes(s.id) ? "checked" : ""}><span>${esc(s.name)}</span></label>`).join("") || `<span class="sx-small">No schedule yet.</span>`}</div></div>
      <label class="sx-f"><b>Parts and fluids used</b><textarea name="partsUsed" rows="2" maxlength="2000">${esc(r.partsUsed || "")}</textarea></label>
      <div class="sx-f3"><label class="sx-f"><b>Labor (hrs)</b><input name="laborHours" inputmode="decimal" value="${n(r.laborHours) || ""}"></label><label class="sx-f"><b>Parts $</b><input name="partsCost" inputmode="decimal"></label><label class="sx-f"><b>Labor $</b><input name="laborCost" inputmode="decimal"></label></div>
      <label class="sx-f"><b>Notes for the shop</b><textarea name="notes" rows="2" maxlength="2000">${esc(r.notes || "")}</textarea></label><p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">${ic(IC.check)} ${rec ? "Save" : "Log work"}</button></div></form>`, (rec ? "Edit work · " : "Log work · ") + ((b.meta && b.meta.bike) || b.name));
    const f = m.querySelector("#elF"), er = m.querySelector(".sx-err");
    f.querySelector(".sx-ticks").onchange = () => { if (f.service.dataset.typed) return; f.service.value = [...f.querySelectorAll("[name=items]:checked")].map(x => x.nextElementSibling.textContent).join(", "); };
    f.service.oninput = () => { f.service.dataset.typed = f.service.value ? "1" : ""; };
    f.onsubmit = async ev => { ev.preventDefault(); const d = new FormData(f), num = k => n(String(d.get(k) || "").replace(/[$,]/g, ""));
      const service = String(d.get("service") || "").trim(); if (!service) { er.textContent = "Say what you did."; er.hidden = false; return; }
      const items = d.getAll("items"), out = Object.assign({}, r, { service, date: d.get("date") || D().today(), odometer: num("odometer"), items, kind: r.kind || (items.length ? "Scheduled service" : "Repair"), shop: E.shop.name,
        partsUsed: String(d.get("partsUsed") || "").trim(), laborHours: num("laborHours"), notes: String(d.get("notes") || "").trim(), planned: false, archived: false });
      if (num("partsCost") || !rec) out.partsCost = num("partsCost"); if (num("laborCost") || !rec) out.laborCost = num("laborCost");
      const id = r.id || nextId(b.maintenance, "MAINT-U", 3);
      f.querySelector("[type=submit]").disabled = true;
      let res; try { res = await rpc("emp_put", { pid: b.id, k: "maintenance", rid: id, d: out }); } catch (e) { res = err(e); }
      if (res !== "ok") { er.textContent = res === "notyours" ? "Only the person who logged it can change it." : res === "plan" ? "The shop's plan isn't active." : typeof res === "string" && res.length > 12 ? res : "That didn't save. Try again."; er.hidden = false; f.querySelector("[type=submit]").disabled = false; return; }
      b.maintenance = b.maintenance.filter(x => x.id !== id).concat([Object.assign({}, out, { id, byEmp: { id: E.emp.id, name: E.emp.name } })]);
      syncRem(b, (b.meta && b.meta.bike) || b.name); m.close(); note("Logged."); client(c.id); };
  }
  function odoBox(c, b) {
    const m = modal(`<form class="sx-form" id="eoF"><div class="sx-f2"><label class="sx-f"><b>Odometer (mi)</b><input name="miles" inputmode="numeric"></label><label class="sx-f"><b>Date</b><input name="date" type="date" value="${D().today()}" max="${D().today()}"></label></div><div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">Save reading</button></div></form>`, "Odometer reading");
    const f = m.querySelector("#eoF"); f.onsubmit = async ev => { ev.preventDefault(); const mi = n(String(f.miles.value).replace(/,/g, "")); if (!mi) return;
      const id = nextId(b.mileage, "ODO-U", 4); let res; try { res = await rpc("emp_put", { pid: b.id, k: "mileage", rid: id, d: { date: f.date.value || D().today(), miles: mi, note: "At the shop" } }); } catch (e) { res = ""; }
      if (res !== "ok") return note("That didn't save. Try again.", true);
      b.mileage = (b.mileage || []).concat([{ id, date: f.date.value, miles: mi }]); syncRem(b, (b.meta && b.meta.bike) || b.name); m.close(); client(c.id); };
  }
  const STYLES = [["standard", "Standard / naked"], ["cruiser", "Cruiser"], ["sport", "Sport"], ["adventure", "Adventure"], ["dualsport", "Dual-sport / dirt"], ["touring", "Touring"], ["cafe", "Cafe racer / classic"], ["scooter", "Scooter"]];
  const DRIVES = [["chain", "Chain"], ["shaft", "Shaft"], ["belt", "Belt"], ["cvt", "Scooter (CVT)"]];
  const bikeFields = `<div class="sx-f3"><label class="sx-f"><b>Year</b><input name="year" inputmode="numeric" maxlength="4"></label><label class="sx-f"><b>Make</b><input name="make" maxlength="40"></label><label class="sx-f"><b>Model</b><input name="model" maxlength="60"></label></div>
    <div class="sx-f3"><label class="sx-f"><b>Kind of bike</b><select name="style">${STYLES.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select></label><label class="sx-f"><b>Drive</b><select name="drive">${DRIVES.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select></label><label class="sx-f"><b>Odometer (mi)</b><input name="odo" inputmode="numeric"></label></div>`;
  async function addBike(cid, cname, d) {
    const label = [d.year, d.make, d.model].map(x => String(x || "").trim()).filter(Boolean).join(" "); if (!label) return null;
    const meta = { id: "project", projectName: label, bike: label, year: String(d.year || "").trim(), make: String(d.make || "").trim(), model: String(d.model || "").trim(), style: d.style || "standard", drive: d.drive || "chain", goal: "maintain",
      units: "in", currency: "USD", baseBudget: 0, contingencyPct: 10, budgetChanges: [], meshMap: {}, archived: false, customer: { name: cname }, shop: { id: E.shop.id, name: E.shop.name } };
    const recs = [{ coll: "meta", rec_id: "project", data: meta }].concat(D().presets(meta.drive).map((p, i) => { const id = "SVC-U" + String(i + 1).padStart(3, "0"); return { coll: "schedule", rec_id: id, data: { id, name: p[0], category: p[1], everyMiles: p[2], everyMonths: p[3], source: D().TYPICAL_SRC, order: i + 1, lastDate: "", lastMiles: 0, notes: "", archived: false } }; }));
    const odo = n(String(d.odo || "").replace(/,/g, "")); if (odo) recs.push({ coll: "mileage", rec_id: "ODO-U0001", data: { id: "ODO-U0001", date: D().today(), miles: odo, note: "At the shop", archived: false } });
    return rpc("emp_new_bike", { cid, nm: label, recs });
  }
  function newClient(name) {
    const m = modal(`<form class="sx-form" id="ecF" novalidate><div class="sx-f2"><label class="sx-f"><b>Name</b><input name="name" maxlength="120" value="${esc(name)}"></label><label class="sx-f"><b>Phone <span class="faint">(optional)</span></b><input name="phone" type="tel" maxlength="40"></label></div>
      <label class="sx-f"><b>Email <span class="faint">(optional)</span></b><input name="email" type="email" maxlength="200"></label>
      <label class="sx-chk"><input type="checkbox" name="remind"><span>They agreed to get service reminder emails</span></label>
      <h3 class="sx-h3">Their bike <span class="faint" style="font-weight:400">(optional)</span></h3>${bikeFields}<p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">${ic(IC.plus)} Check them in</button></div></form>`, "New client");
    const f = m.querySelector("#ecF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); const d = Object.fromEntries(new FormData(f)); const bad = t => { er.textContent = t; er.hidden = false; f.querySelector("[type=submit]").disabled = false; };
      if (!d.name.trim()) return bad("Add their name."); if (d.email && !/^\S+@\S+\.\S+$/.test(d.email.trim())) return bad("That email doesn't look right."); if (d.remind && !d.email.trim()) return bad("Add their email to send reminders.");
      f.querySelector("[type=submit]").disabled = true;
      let cid; try { cid = await rpc("emp_new_client", { nm: d.name, ph: d.phone, em: d.email, nt: "", rem: !!d.remind }); } catch (e) { return bad(err(e)); }
      if (!cid) return bad("That didn't save. Try again.");
      try { await addBike(cid, d.name.trim(), d); } catch (e) {}
      m.close(); client(cid); };
  }
  function bikeBox(c) {
    const m = modal(`<form class="sx-form" id="ebF" novalidate>${bikeFields}<p class="sx-err" hidden></p><div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">Add bike</button></div></form>`, "Add a bike for " + c.name.split(" ")[0]);
    const f = m.querySelector("#ebF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); const d = Object.fromEntries(new FormData(f)); if (!(d.year || d.make || d.model)) { er.textContent = "Add the bike's make and model."; er.hidden = false; return; }
      let pid; try { pid = await addBike(c.id, c.name, d); } catch (e) { pid = null; } if (!pid) { er.textContent = "That didn't save. Try again."; er.hidden = false; return; } m.close(); client(c.id); };
  }

  /* ---------- big changes need the account password ---------- */
  function needPassword(ctx, what, fn) {
    const email = ctx.session.user.email;
    const box = document.createElement("div"); box.className = "pk-modal sx-modal";
    box.innerHTML = `<div class="pk-card sx-card" role="dialog" aria-modal="true"><div class="sx-mh"><h2>Owner password</h2><button class="sx-x" data-close aria-label="Close">×</button></div>
      <p class="sx-p">${esc(what)} needs the password for ${esc(email)}.</p><form class="sx-form" id="pwF"><label class="sx-f"><b>Password</b><input name="pw" type="password" autocomplete="current-password"></label><p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="linkbtn" data-setpw>Signed up with Google? Set a password</button><span class="grow"></span><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">Continue</button></div></form></div>`;
    box.addEventListener("click", ev => { if (ev.target.closest("[data-close]")) box.remove(); });
    document.body.appendChild(box); setTimeout(() => box.querySelector("input").focus(), 30);
    const f = box.querySelector("#pwF"), er = box.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); f.querySelector("[type=submit]").disabled = true;
      const { error } = await ctx.sb.auth.signInWithPassword({ email, password: f.pw.value });
      if (error) { er.textContent = "That password isn't right. If you sign in with Google, set a password first."; er.hidden = false; f.querySelector("[type=submit]").disabled = false; return; }
      box.remove(); fn(); };
    box.querySelector("[data-setpw]").onclick = () => {
      f.innerHTML = `<p class="sx-p">Set a password for ${esc(email)}. You'll keep signing in with Google; this is just for big changes in the shop.</p>
        <label class="sx-f"><b>Owner PIN</b><input name="pin" type="password" inputmode="numeric" maxlength="4"></label><label class="sx-f"><b>New password</b><input name="pw1" type="password" autocomplete="new-password" minlength="8"></label><label class="sx-f"><b>Type it again</b><input name="pw2" type="password" autocomplete="new-password"></label><p class="sx-err" hidden></p>
        <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">Save password</button></div>`;
      const er2 = f.querySelector(".sx-err");
      f.onsubmit = async ev => { ev.preventDefault(); const bad = t => { er2.textContent = t; er2.hidden = false; };
        if (f.pw1.value.length < 8) return bad("At least 8 characters."); if (f.pw1.value !== f.pw2.value) return bad("The two passwords don't match.");
        const { data: r } = await ctx.sb.rpc("shop_master_unlock", { p: f.pin.value }); if (r !== "ok") return bad(PINMSG[r] || "Wrong owner PIN.");
        const { error } = await ctx.sb.auth.updateUser({ password: f.pw1.value }); if (error) return bad(error.message || "That didn't save.");
        box.remove(); ctx.note("Password saved."); fn(); };
    };
  }

  window.rvShopLock = { gate, phoneStart, inviteLink, empApp, ownerOpen, ownerTouch, lockAll, watchIdle, setMasterPin, needPassword, hasDevice: () => !!ls.get("rv.empdev") && !ss.get("rv.ownRevora"), empActive: () => !!ss.get("rv.empSess") };
})();
