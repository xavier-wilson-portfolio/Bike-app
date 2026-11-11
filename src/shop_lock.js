/* ============ Revora Shop: shop login, owner mode and the employee app ============
   On a computer signed in as the shop owner, Revora opens to the shop login. The owner unlocks the full shop with their
   account password. Employees type their name and their 6-digit PIN and get the employee app: find clients, log work,
   check bikes in, and see only the bikes they're assigned or have worked on. Employees can also use their own phone:
   the owner's link signs that phone in as them (no Revora account). Logins stay open until 6 hours with nothing touched.
   The Revora admin account skips all of this unless customer mode is on. PINs are checked by the database. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n = v => +v || 0, D = () => window.rvDue, digits = s => String(s || "").replace(/\D/g, "");
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };
  const ss = ls;   // logins survive closing the browser; the 6-hour idle rule ends them
  const IDLE = 6 * 3600e3, PIN_LEN = 6, ADMIN = "xavier.j.wilson101@gmail.com";
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = { bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>', gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/>', back: '<path d="M15 5l-7 7 7 7"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>', key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>', check: '<path d="M5 12l4 4 10-10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>', clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>' };
  const initials = nm => String(nm || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
  let X = null;

  /* ---------- staying logged in: 6 hours with nothing touched ends it ---------- */
  const idleOk = () => Date.now() - n(ls.get("rv.lastActive")) < IDLE;
  const touch = () => ls.set("rv.lastActive", String(Date.now()));
  const customerMode = () => ls.get("rv.customerMode") === "1";
  const isAdmin = ctx => !!(ctx && ctx.session && String(ctx.session.user.email || "").toLowerCase() === ADMIN);
  const adminBypass = ctx => isAdmin(ctx) && !customerMode();
  const ownerOpen = () => { if (ls.get("rv.ownerOk") && idleOk()) return true; ls.set("rv.ownerOk", null); return false; };
  const empActive = () => { if (ls.get("rv.empSess") && idleOk()) return true; if (ls.get("rv.empSess")) ls.set("rv.empSess", null); return false; };
  const ownerTouch = touch;
  function lockAll(go) {
    const t = ls.get("rv.empSess"); if (t && X && X.sb) X.sb.rpc("emp_lock", { tok: t }).then(() => {}, () => {});
    ls.set("rv.ownerOk", null); ls.set("rv.empSess", null);
    if (go !== false) location.href = location.pathname + (ls.get("rv.empdev") && !(X && X.session) ? "" : "?crm");
  }
  let idleT = null, watching = false;
  function watchIdle() {
    touch(); if (watching) return; watching = true; let lastWrite = Date.now();
    const bump = () => { if (Date.now() - lastWrite > 30e3) { lastWrite = Date.now(); touch(); } };
    ["pointerdown", "keydown", "touchstart", "wheel"].forEach(ev => window.addEventListener(ev, bump, { passive: true }));
    idleT = setInterval(() => { if (!idleOk()) { clearInterval(idleT); lockAll(); } }, 60e3);
  }
  const PINMSG = { wrong: "That PIN isn't right.", locked: "Too many wrong tries. Wait 10 minutes and try again.", denied: "Employee logins aren't available on this computer.", device: "This phone was signed out. Open the link from your shop again.",
    link: "This link doesn't work any more. Ask the admin for a new one.", name: "No one by that name works here. Check the spelling.", twins: "Two people have that first name. Type your full name." };

  /* ---------- the login screen ---------- */
  function shopSide(sh) {
    const d = (sh && sh.details) || {}, sil = "img/sil/bike-" + ((d.services || []).includes("Scooters") && (d.services || []).length === 1 ? "scooter" : "standard") + ".svg";
    return `<aside class="lg-side"><div class="lg-brand"><img src="img/revora-icon.svg" alt=""><img class="lg-word" src="img/revora-word-white.svg" alt="Revora"></div>
      <svg class="lg-ring" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 7"/><path d="M28 140 A86 86 0 1 1 172 140" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg>
      <img class="lg-sil" src="${esc(sil)}" alt="">
      <div class="lg-shop"><span class="lg-k">Shop login</span><h1>${esc((sh && sh.name) || "Your shop")}</h1>
        ${sh && sh.address ? `<span class="lg-li">${ic(IC.pin)}${esc(sh.address)}</span>` : ""}${d.hours ? `<span class="lg-li">${ic(IC.clock)}${esc(d.hours)}</span>` : ""}</div>
      <div class="lg-time"><b id="lgClock"></b><span id="lgDate"></span></div><span class="lg-foot">Revora Shop</span></aside>`;
  }
  // a plain dark page for one-off screens (first-time setup, plan not active)
  function frame(inner, shopName) {
    X.app.innerHTML = `<div class="lk"><header class="lk-top"><span class="sx-brand"><img src="img/revora-icon.svg" alt=""><img class="sx-word" src="img/revora-word-white.svg" alt="Revora"></span>${shopName ? `<span class="sx-shopname">${esc(shopName)}</span>` : ""}</header><main class="lk-main">${inner}</main></div>`;
    return X.app.querySelector(".lk-main");
  }
  function tickClock() { const c = document.getElementById("lgClock"); if (!c) return; const d = new Date(); c.textContent = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); const t = document.getElementById("lgDate"); if (t) t.textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); setTimeout(tickClock, 15e3); }
  function loginFrame(sh, card) {
    X.app.innerHTML = `<div class="lg">${shopSide(sh)}<main class="lg-main"><div class="lg-card">${card}</div></main></div>`;
    tickClock(); return X.app.querySelector(".lg-card");
  }
  // the 6-digit PIN boxes, typed or tapped. On touch screens the keypad below is used, so the phone keyboard stays down.
  function pinField(host, onDone, onChange) {
    const touch = !!(window.matchMedia && matchMedia("(pointer:coarse)").matches);
    const back = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>';
    host.innerHTML = `<div class="lg-pin" role="group" aria-label="PIN">${Array.from({ length: PIN_LEN }, () => "<i></i>").join("")}</div><input class="lg-pinin" type="password" inputmode="${touch ? "none" : "numeric"}" autocomplete="one-time-code" maxlength="${PIN_LEN}" aria-label="${PIN_LEN}-digit PIN">
      <div class="lg-keys" role="group" aria-label="Number pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button type="button" data-k="${k}">${k}</button>`).join("")}<button type="button" class="lg-kx" data-k="clr">Clear</button><button type="button" data-k="0">0</button><button type="button" class="lg-kx" data-k="del" aria-label="Delete">${back}</button></div>`;
    const inp = host.querySelector(".lg-pinin"), boxes = host.querySelectorAll(".lg-pin i"), row = host.querySelector(".lg-pin");
    let last = "";
    const paint = () => { boxes.forEach((b, i) => b.classList.toggle("on", i < inp.value.length)); row.classList.toggle("focus", document.activeElement === inp); };
    inp.oninput = () => { inp.value = digits(inp.value).slice(0, PIN_LEN); paint(); if (inp.value === last) return; last = inp.value; if (onChange) onChange(inp.value); if (inp.value.length === PIN_LEN) onDone(inp.value); };
    inp.onfocus = inp.onblur = paint;
    row.onclick = () => { if (!touch) inp.focus(); };
    host.querySelectorAll("[data-k]").forEach(b => b.onclick = ev => { ev.preventDefault(); const k = b.dataset.k;
      inp.value = k === "del" ? inp.value.slice(0, -1) : k === "clr" ? "" : (inp.value + k).slice(0, PIN_LEN); inp.dispatchEvent(new Event("input")); });
    return { clear(shake) { inp.value = ""; last = ""; paint(); if (onChange) onChange(""); if (shake !== false) { row.classList.add("shake"); setTimeout(() => row.classList.remove("shake"), 400); } },
      focus() { if (!touch) inp.focus(); }, value: () => inp.value };
  }
  // employee: name and PIN, in either order. ask(name, pin) -> error text or null
  function employeeForm(card, opts) {
    card.innerHTML = `${opts.tabs || ""}<div class="lg-pane"><h2>${esc(opts.title || "Clock in")}</h2><p class="lg-sub">${opts.sub || "Type your name and your 6-digit PIN."}</p>
      <label class="lg-f"><span>${ic(IC.user)} Your name</span><input id="lgName" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="go" placeholder="First name"></label>
      <div class="lg-f"><span>${ic(IC.lock)} ${esc(opts.pinLabel || "PIN")}</span><div id="lgPin"></div></div><p class="lg-err" role="alert"></p>
      <button class="lg-go" type="button" data-go disabled>${esc(opts.go || "Clock in")}</button>${opts.foot || ""}</div>`;
    const nm = card.querySelector("#lgName"), er = card.querySelector(".lg-err"), go = card.querySelector("[data-go]");
    let busy = false, p = "";
    const ready = () => !!nm.value.trim() && p.length === PIN_LEN;
    const say = (t, hint) => { er.textContent = t; er.classList.toggle("hint", !!hint); };
    const upd = () => { go.disabled = !ready(); if (ready() && er.classList.contains("hint")) say(""); };
    const submit = async () => {
      if (busy) return;
      if (!nm.value.trim()) { say("Now type your name.", 1); nm.focus(); return; }
      if (p.length !== PIN_LEN) { say(`Enter your ${PIN_LEN}-digit PIN.`, 1); pin.focus(); return; }
      busy = true; card.classList.add("busy"); say("");
      const msg = await opts.ask(nm.value.trim(), p).catch(() => "That didn't go through. Check your internet.");
      busy = false; card.classList.remove("busy");
      if (msg) { say(msg); if (/name/i.test(msg)) { nm.focus(); nm.select(); } else { pin.clear(); pin.focus(); } go.disabled = !ready(); }
    };
    const pin = pinField(card.querySelector("#lgPin"), v => { p = v; upd(); if (nm.value.trim()) submit(); else { say("Now type your name.", 1); nm.focus(); } }, v => { p = v; upd(); });
    nm.oninput = upd;
    nm.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); if (ready()) submit(); else pin.focus(); } };
    go.onclick = submit;
    if (!(matchMedia && matchMedia("(pointer:coarse)").matches)) setTimeout(() => nm.focus(), 50);
    return card;
  }

  /* ---------- get the app first: shop owners and employees put Revora on their device when they sign up ---------- */
  // calls next() when they're done (or can't install). route = the page the installed app should open to.
  function installStep(sh, route, next) {
    const A = window.rvApp;
    if (!A || A.standalone()) return next();
    A.keep(route);
    const dev = A.mobile() ? "phone" : "computer", where = A.mobile() ? "home screen" : (/Mac/i.test(navigator.userAgent) ? "Dock or Applications" : "desktop or Start menu");
    const card = loginFrame(sh, "");
    const done = () => { A.drop(); next(); };
    const skip = `<button class="lg-link" data-skip>${A.bookmarkOnly() ? "Skip for now" : "Can't install it? Keep going in the browser"}</button>`;
    const bindSkip = () => { const b = card.querySelector("[data-skip]"); if (b) b.onclick = done; };
    const opened = (title, text) => { card.innerHTML = `<div class="lg-pane lg-inst"><div class="lg-instic ok">${ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>')}</div><h2>${title}</h2><p class="lg-sub">${text}</p>
      <div class="lg-links"><button class="lg-link" data-skip>Keep going in the browser instead</button></div></div>`; bindSkip(); };
    const finish = () => A.isIOS() ? opened("Now open it from your home screen", `Close this tab and tap the Revora icon. It opens right to this step, so you never have to look Revora up again.`)
      : opened("Revora is installed", `Open Revora from your ${where}. It picks up right here, and from now on that's where you sign in.`);
    A.onInstalled(finish);
    if (A.seen()) {
      card.innerHTML = `<div class="lg-pane lg-inst"><div class="lg-instic">${ic('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>')}</div><h2>Open the Revora app</h2>
        <p class="lg-sub">Revora is already on this ${dev}. Open it from your ${where} and it'll bring you right to this step.</p><div class="lg-links">${skip}</div></div>`;
      return bindSkip();
    }
    const head = `<div class="lg-instic">${ic(A.mobile() ? '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>' : '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>')}</div>
      <div class="eyebrow lg-step">Step 1 of 2</div><h2>${A.bookmarkOnly() ? "Save Revora first" : "Get the Revora app first"}</h2>
      <p class="lg-sub">${A.bookmarkOnly() ? "Bookmark Revora so you can open it in one click instead of searching for it." : `Put Revora on this ${dev} so you open it from an icon instead of searching for it. It brings you straight back here to finish.`}</p>`;
    if (A.canPrompt() && !A.inApp()) {
      card.innerHTML = `<div class="lg-pane lg-inst">${head}<button class="lg-go" data-inst>Install Revora</button><div class="lg-links">${skip}</div></div>`;
      card.querySelector("[data-inst]").onclick = async () => { const r = await A.prompt(); if (r === "accepted") finish(); else if (!A.canPrompt()) manual(); };
      return bindSkip();
    }
    manual();
    function manual() {
      const g = A.guide(), inApp = g.kind === "inapp";
      card.innerHTML = `<div class="lg-pane lg-inst">${inApp ? `<div class="lg-instic">${ic('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>')}</div><div class="eyebrow lg-step">Step 1 of 2</div><h2>Open this in your browser</h2>
          <p class="lg-sub">You're in ${esc(g.name)}, which can't add apps. Open this page in ${A.isIOS() ? "Safari" : "Chrome"} first, then add Revora from there.</p>` : head}
        <div class="lg-for">${inApp ? "From " + esc(g.name) : "In " + esc(g.name)}</div><ol class="lg-steps">${g.steps.map(t => `<li><span>${t}</span></li>`).join("")}</ol>
        ${inApp ? `<button class="lg-go" data-copy>Copy link</button>` : `<button class="lg-go" data-did>${g.kind === "bookmark" ? "Done, it's bookmarked" : A.isIOS() ? "I added it" : "Done, it's installed"}</button>`}<div class="lg-links">${skip}</div></div>`;
      const did = card.querySelector("[data-did]"); if (did) did.onclick = () => g.kind === "bookmark" ? done() : finish();
      const cp = card.querySelector("[data-copy]"); if (cp) cp.onclick = async () => { const u = new URL(route, location.href).href;
        try { await navigator.clipboard.writeText(u); cp.textContent = "Copied. Paste it into " + (A.isIOS() ? "Safari" : "Chrome"); } catch (e) { cp.outerHTML = `<input class="lg-copy" readonly value="${esc(u)}" onclick="this.select()">`; } };
      bindSkip();
    }
  }
  function installFirst(ctx, sh, route, next) { X = ctx; installStep(sh, route, next); }

  /* ---------- the owner's computer ---------- */
  async function gate(ctx, shop, next) {
    X = ctx; document.title = (shop.name || "Shop") + " · Revora";
    if (empActive()) return empApp(ctx);
    const email = ctx.session.user.email, me = (ctx.profile && ctx.profile.display_name) || email;
    const tabs = which => `<div class="lg-tabs" role="tablist"><button role="tab" data-tab="emp" aria-selected="${which === "emp"}">${ic(IC.user)} Employee</button><button role="tab" data-tab="own" aria-selected="${which === "own"}">${ic(IC.key)} Admin</button></div>`;
    const card = loginFrame(shop, "");
    const bindTabs = () => card.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => b.dataset.tab === "own" ? owner() : emp());
    const emp = () => { employeeForm(card, { tabs: tabs("emp"), title: "Clock in", ask: async (nm, p) => {
      const { data: r, error } = await ctx.sb.rpc("shop_emp_login", { nm, p }); if (error) throw error; if (r.error) return PINMSG[r.error] || "That didn't work.";
      ls.set("rv.empSess", r.session); watchIdle(); empApp(ctx); return null; } }); bindTabs(); };
    const owner = () => {
      card.innerHTML = `${tabs("own")}<div class="lg-pane"><h2>Admin</h2><p class="lg-sub">Opens the whole shop: clients, money, team and settings.</p>
        <div class="lg-who"><span class="lg-av">${esc(initials(me))}</span><div><b>${esc(me)}</b><small>${esc(email)}</small></div></div>
        <form id="lgOwn" class="lg-form"><label class="lg-f"><span>${ic(IC.lock)} Password</span><input name="pw" type="password" autocomplete="current-password"></label><p class="lg-err" role="alert"></p>
          <button class="lg-go" type="submit">Unlock the shop</button></form>
        <button class="lg-link" data-google>Signed up with Google? Set a password</button></div>`;
      bindTabs(); const f = card.querySelector("#lgOwn"), er = card.querySelector(".lg-err");
      setTimeout(() => f.pw.focus(), 50);
      f.onsubmit = async ev => { ev.preventDefault(); if (!f.pw.value) return; card.classList.add("busy");
        const { error } = await ctx.sb.auth.signInWithPassword({ email, password: f.pw.value }); card.classList.remove("busy");
        if (error) { er.textContent = "That password isn't right. If you sign in with Google, set a password first."; f.pw.select(); return; }
        ls.set("rv.ownerOk", "1"); watchIdle(); next(); };
      card.querySelector("[data-google]").onclick = () => googleForPassword(ctx);
    };
    emp();
  }
  /* Google accounts have no password. Signing in with Google again proves it's the owner, then they pick one. */
  function googleForPassword(ctx) {
    ls.set("rv.setPw", String(Date.now()));
    ctx.sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname + "?crm&setpw=1", queryParams: { prompt: "login" } } });
  }
  function setPasswordPage(ctx, shop, next) {
    X = ctx; const fresh = Date.now() - n(ls.get("rv.setPw")) < 10 * 60e3; ls.set("rv.setPw", null);
    try { history.replaceState(null, "", location.pathname + "?crm"); } catch (e) {}
    if (!fresh) return gate(ctx, shop, next);
    const card = loginFrame(shop, `<div class="lg-pane"><h2>Pick a password</h2><p class="lg-sub">For ${esc(ctx.session.user.email)}. You'll use it to unlock the shop and confirm big changes. You can keep signing in to Revora with Google.</p>
      <form class="lg-form" id="lgSp"><label class="lg-f"><span>New password</span><input name="p1" type="password" autocomplete="new-password" minlength="8"></label><label class="lg-f"><span>Type it again</span><input name="p2" type="password" autocomplete="new-password"></label><p class="lg-err" role="alert"></p>
        <button class="lg-go" type="submit">Save and unlock</button></form></div>`);
    const f = card.querySelector("#lgSp"), er = card.querySelector(".lg-err");
    f.onsubmit = async ev => { ev.preventDefault();
      if (f.p1.value.length < 8) { er.textContent = "At least 8 characters."; return; } if (f.p1.value !== f.p2.value) { er.textContent = "The two passwords don't match."; return; }
      const { error } = await ctx.sb.auth.updateUser({ password: f.p1.value }); if (error) { er.textContent = error.message || "That didn't save."; return; }
      ls.set("rv.ownerOk", "1"); watchIdle(); next(); };
  }

  /* ---------- an employee's own phone ---------- */
  async function phoneStart(ctx) {
    X = ctx; const dev = ls.get("rv.empdev");
    if (empActive()) return empApp(ctx);
    const { data: d } = await ctx.sb.rpc("emp_device", { dev });
    if (!d) { ls.set("rv.empdev", null); loginFrame(null, `<div class="lg-pane"><h2>Signed out</h2><p class="lg-sub">This phone isn't signed in to a shop any more. Ask the admin for a new link.</p><a class="lg-go" href="${esc(location.pathname)}">Open Revora</a></div>`); return; }
    const card = loginFrame({ name: d.shop, address: d.address, details: d.details }, "");
    employeeForm(card, { title: "Clock in", foot: `<div class="lg-links"><button class="lg-link" data-own>Use my own Revora</button><button class="lg-link" data-forget>Sign this phone out of ${esc(d.shop)}</button></div>`, ask: async (nm, p) => {
      const { data: r, error } = await ctx.sb.rpc("emp_unlock_named", { dev, nm, p }); if (error) throw error; if (r.error) return PINMSG[r.error] || "That didn't work.";
      ls.set("rv.empSess", r.session); watchIdle(); empApp(ctx); return null; } });
    card.querySelector("[data-forget]").onclick = async () => { if (!confirm("Sign this phone out of " + d.shop + "? You'll need a new link from the admin.")) return; await ctx.sb.rpc("emp_forget_device", { dev }); ls.set("rv.empdev", null); location.href = location.pathname; };
    card.querySelector("[data-own]").onclick = () => { sessionStorage.setItem("rv.ownRevora", "1"); location.href = location.pathname + "?garage=1"; };
  }
  // the link from the owner: the starting PIN signs this phone in
  async function inviteLink(ctx, inv) {
    X = ctx;
    const { data: info } = await ctx.sb.rpc("emp_invite_info", { inv });
    if (info && !ctx.session && window.rvApp && !rvApp.standalone() && !sessionStorage.getItem("rv.instDone")) return installStep({ name: info.shop }, location.pathname + "?emp=" + encodeURIComponent(inv), () => { try { sessionStorage.setItem("rv.instDone", "1"); } catch (e) {} inviteLink(ctx, inv); });
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    if (!info) { loginFrame(null, `<div class="lg-pane"><h2>This link doesn't work</h2><p class="lg-sub">It may have been replaced with a new one. Ask the shop admin to send it again.</p></div>`); return; }
    const card = loginFrame({ name: info.shop }, "");
    employeeForm(card, { go: info.setup ? "Continue" : "Sign in", title: info.setup ? (window.rvApp && rvApp.standalone() ? "Step 2 of 2: sign in" : "Welcome") : "Sign this phone in", sub: info.setup ? "Type your name and the 6-digit starting PIN from the admin. Then you'll pick your own." : "Type your name and your PIN.", pinLabel: info.setup ? "Starting PIN" : "PIN",
      ask: async (nm, p) => {
        const { data: r, error } = await ctx.sb.rpc("emp_claim", { inv, p }); if (error) throw error; if (r.error) return PINMSG[r.error] || "That didn't work.";
        if (!ctx.session) ls.set("rv.empdev", r.device);
        ls.set("rv.empSess", r.session); watchIdle(); empApp(ctx); return null; } });
    const nm = card.querySelector("#lgName"); if (info.name) nm.placeholder = info.name.split(" ")[0];
  }

  /* ---------- the employee app ---------- */
  let E = null;   // { tok, emp, shop, home }
  const rpc = async (name, args) => { const { data, error } = await X.sb.rpc(name, Object.assign({ tok: E.tok }, args || {})); if (error) { if (/locked/i.test(error.message || "")) { lockAll(); throw new Error("locked"); } throw error; } return data; };
  const note = (m, bad) => X.note(m, bad);
  const err = e => (e && e.message) || "That didn't go through. Check your internet and try again.";
  async function empApp(ctx) {
    X = ctx; E = { tok: ls.get("rv.empSess") }; watchIdle();
    let c; try { c = await rpc("emp_ctx"); } catch (e) { return; }
    if (!c) return lockAll();
    E.emp = c.employee; E.shop = c.shop;
    if (c.setup) return setupPage();
    if (!c.plan_ok) { frame(`<section class="lk-who"><h1>The shop's plan isn't active</h1><p>Ask the admin to renew Revora Shop. Nothing is lost.</p><button class="btn" data-lock>Lock</button></section>`, E.shop.name).querySelector("[data-lock]").onclick = () => lockAll(); return; }
    home();
  }
  function setupPage() {
    const m = frame(`<section class="lk-setup"><div class="eyebrow">First time</div><h1>Set up your login</h1><p>Your name goes on the work you log. Your email gets things the shop sends you.</p>
      <form class="sx-form" id="suF" novalidate><label class="sx-f"><b>Your name</b><input name="name" required maxlength="80" value="${esc(E.emp.name || "")}" autocomplete="name"></label>
        <label class="sx-f"><b>Email</b><input name="email" type="email" maxlength="200" value="${esc(E.emp.email || "")}" autocomplete="email"></label>
        <div class="sx-f2"><label class="sx-f"><b>Your own PIN</b><input name="p1" inputmode="numeric" maxlength="6" type="password" autocomplete="new-password" placeholder="6 numbers"></label><label class="sx-f"><b>Type it again</b><input name="p2" inputmode="numeric" maxlength="6" type="password" autocomplete="new-password"></label></div>
        <p class="sx-small">Only you should know it. You'll type your name and this PIN to clock in, on the shop's computer or your phone.</p><p class="sx-err" hidden></p>
        <div class="sx-acts left"><button class="btn tan big" type="submit">Save and start</button></div></form></section>`, E.shop && E.shop.name);
    const f = m.querySelector("#suF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); const d = Object.fromEntries(new FormData(f)); const bad = t => { er.textContent = t; er.hidden = false; };
      if (!d.name.trim()) return bad("Add your name."); if (d.email && !/^\S+@\S+\.\S+$/.test(d.email.trim())) return bad("That email doesn't look right.");
      if (!/^[0-9]{6}$/.test(d.p1)) return bad("Your PIN needs to be 6 numbers."); if (d.p1 !== d.p2) return bad("The two PINs don't match.");
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
    let h, jobs = []; try { [h, jobs] = await Promise.all([rpc("emp_home"), rpc("emp_jobs").catch(() => [])]); } catch (e) { return; }
    E.home = h || { bikes: [], recent: [] }; E.jobs = jobs || []; E.view = () => home();
    const assigned = E.home.bikes.filter(b => b.assigned), worked = E.home.bikes.filter(b => !b.assigned);
    const card = b => `<button class="sx-row" data-client="${esc(b.client_id)}"><span class="grow"><b>${esc(b.client)}</b><small>${esc(b.name)}${b.last ? " · you last logged " + esc(D().fmtDate(b.last)) : ""}</small></span>${b.assigned ? `<span class="pill blue plain">Assigned</span>` : ""}</button>`;
    shell(`<section class="sx-hero"><div class="sx-hero-t"><h1>Hi, ${esc(String(E.emp.name).split(" ")[0])}.</h1><p>Find a client to log work, or check a new one in.</p></div>
        <div class="sx-find"><div class="sx-qwrap">${ic(IC.search)}<input id="eQ" type="search" placeholder="Find a client by name, phone or bike" autocomplete="off" aria-label="Find a client"><div class="sx-hits" id="eHits" hidden></div></div>
          <button class="btn tan big" data-new>${ic(IC.plus)} New client</button></div></section>
      ${E.jobs.length ? `<section class="sx-panel jb-board"><div class="sx-ph"><h2>In the shop</h2><span>Tap a job to tick off work or mark it ready</span></div><div class="sx-rows">${E.jobs.map(j => rvJobs.boardRow(j, { client: j.client, bike: j.bike })).join("")}</div></section>` : ""}
      <div class="sx-grid2"><section class="sx-panel"><div class="sx-ph"><h2>Assigned to you</h2><span>${assigned.length}</span></div>${assigned.length ? `<div class="sx-rows">${assigned.map(card).join("")}</div>` : `<div class="sx-empty sm"><span>Nothing assigned right now. The admin can assign clients to you.</span></div>`}</section>
        <section class="sx-panel"><div class="sx-ph"><h2>Bikes you've worked on</h2><span>${worked.length}</span></div>${worked.length ? `<div class="sx-rows">${worked.map(card).join("")}</div>` : `<div class="sx-empty sm"><span>Bikes you log work on show up here.</span></div>`}</section></div>
      <section class="sx-panel"><div class="sx-ph"><h2>Your recent work</h2></div>${E.home.recent.length ? `<div class="sx-rows">${E.home.recent.map(r => `<button class="sx-row" data-client="${esc(r.client_id)}"><span class="sx-date">${esc(D().fmtDate(r.date))}</span><span class="grow"><b>${esc(r.service || "Service")}</b><small>${esc(r.client)} · ${esc(r.bike)}</small></span></button>`).join("")}</div>` : `<div class="sx-empty sm"><span>Nothing logged yet.</span></div>`}</section>`);
    X.app.querySelectorAll("[data-client]").forEach(b => b.onclick = () => client(b.dataset.client));
    X.app.querySelectorAll("[data-job]").forEach(b => b.onclick = () => openJob(E.jobs.find(j => j.pid + "|" + j.id === b.dataset.job)));
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
    let c, jobs = []; try { [c, jobs] = await Promise.all([rpc("emp_client", { cid }), rpc("emp_jobs").catch(() => [])]); } catch (e) { return; }
    if (!c) return home();
    E.jobs = jobs || []; E.view = () => client(cid);
    c.bikes.forEach(b => { b.c = D().compute(b); });
    const by = r => r.byEmp ? (r.byEmp.id === E.emp.id ? "you" : r.byEmp.name) : r.byOwner || r.shop || "";
    shell(`<button class="sx-back" data-home2>${ic(IC.back)} Back</button>
      <section class="sx-cmain"><span class="sx-av big">${esc(initials(c.name))}</span><div><h1>${esc(c.name)}</h1>
        <div class="sx-cts">${c.phone ? `<a href="tel:${esc(digits(c.phone))}" class="sx-ct">${ic(IC.phone)}${esc(c.phone)}</a>` : ""}${c.email ? `<span class="sx-ct">${esc(c.email)}</span>` : ""}</div>${c.notes ? `<p class="sx-cnote">${esc(c.notes)}</p>` : ""}</div></section>
      ${c.bikes.map(b => { const items = b.c.ranked.filter(i => i.status !== "nointerval"), wos = (b.workorders || []).filter(w => !["Picked up", "Declined"].includes(w.status));
        return `<section class="sx-bike" data-bike="${esc(b.id)}"><div class="sx-bh"><div class="grow"><h3>${esc((b.meta && b.meta.bike) || b.name)}</h3><div class="sx-bmeta">${b.c.odo ? `<span>${D().milesFmt(b.c.odo.miles)} mi</span>` : `<span class="faint">No odometer reading yet</span>`}${b.assigned ? `<span class="pill blue plain">Assigned to you</span>` : ""}</div></div>
          <div class="sx-bacts"><button class="btn tan" data-jobstart>${ic(IC.bolt || IC.wrench)} Start a job</button><button class="btn" data-log>${ic(IC.wrench)} Log work</button><button class="btn" data-odo>${ic(IC.gauge)} Odometer</button></div></div>
          ${(() => { const mine = E.jobs.filter(j => j.pid === b.id), other = wos.filter(w => !mine.some(j => j.id === w.id));
            return (mine.length ? `<div class="sx-rows jb-bikejobs">${mine.map(j => rvJobs.boardRow(j, { client: "In the shop", bike: "" })).join("")}</div>` : "")
              + (other.length ? `<div class="sx-wos">${other.map(w => `<span class="sx-wo"><b>${esc(w.title || "Work order")}</b><span class="pill ${w.status === "Done" ? "green" : /Waiting/.test(w.status) ? "amber" : "blue"}">${esc(w.status)}</span></span>`).join("")}</div>` : ""); })()}
          <div class="sx-bbody"><div class="sx-due"><h4>What's due</h4>${items.length ? `<div class="sx-dl">${items.slice(0, 10).map(i => `<div class="sx-di ${i.status}"><span class="grow"><b>${esc(i.name)}</b><small>${esc(i.every ? "Every " + i.every : "")}</small></span><span class="sx-when">${esc(D().whenTxt(i))}</span><span class="pill ${D().PILL[i.status][0]}">${D().PILL[i.status][1]}</span></div>`).join("")}</div>` : `<p class="sx-small">No service schedule yet.</p>`}</div>
            <div class="sx-mods"><h4>History</h4>${b.c.done.length ? b.c.done.slice(0, 10).map(r => `<div class="sx-mi"><span class="grow"><b>${esc(r.service || "Service")}</b><small>${esc([D().fmtDate(r.date), n(r.odometer) ? D().milesFmt(r.odometer) + " mi" : "", by(r) ? "by " + by(r) : ""].filter(Boolean).join(" · "))}</small></span>${r.byEmp && r.byEmp.id === E.emp.id ? `<button class="linkbtn" data-edit="${esc(r.id)}">Edit</button>` : ""}</div>`).join("") : `<p class="sx-small">Nothing logged yet.</p>`}</div></div></section>`; }).join("")}
      ${c.bikes.length ? "" : `<div class="sx-panel sx-empty"><b>No bike on file.</b><span>Add their bike to log work on it.</span></div>`}
      <div class="sx-acts left"><button class="btn" data-addbike>${ic(IC.plus)} Add a bike</button></div>`);
    X.app.querySelector("[data-home2]").onclick = () => home();
    X.app.querySelector("[data-addbike]").onclick = () => bikeBox(c);
    X.app.querySelectorAll(".sx-bike").forEach(card => { const b = c.bikes.find(x => x.id === card.dataset.bike);
      card.querySelector("[data-log]").onclick = () => logBox(c, b, null);
      card.querySelector("[data-jobstart]").onclick = () => startJob(c, b);
      card.querySelectorAll("[data-job]").forEach(x => x.onclick = () => openJob(E.jobs.find(j => j.pid + "|" + j.id === x.dataset.job)));
      card.querySelector("[data-odo]").onclick = () => odoBox(c, b);
      card.querySelectorAll("[data-edit]").forEach(x => x.onclick = () => logBox(c, b, b.maintenance.find(r => r.id === x.dataset.edit))); });
  }
  // jobs: start one, update it as you go; the customer follows along in Revora
  const JOBERR = { notyours: "Only the admin or whoever started this job can change it.", plan: "The shop's plan isn't active.", denied: "That bike isn't in this shop.", gone: "That job was deleted." };
  async function jobSave(pid, wid, d, ntf) {
    const r = await rpc("emp_job_save", { pid, wid: wid || null, d, ntf: ntf === undefined ? null : ntf });
    if (!r || r.error) throw new Error(JOBERR[r && r.error] || "That didn't save. Try again.");
    return r.id;
  }
  function startJob(c, b) {
    rvJobs.startBox({ client: { name: c.name, email: c.email, phone: c.phone, app: !!c.app }, bikes: c.bikes.map(x => ({ id: x.id, name: (x.meta && x.meta.bike) || x.name })), bikeId: b.id, bikeName: c.bikes.length === 1 ? ((b.meta && b.meta.bike) || b.name) : "",
      save: (pid, rec, ntf) => jobSave(pid, null, rec, ntf),
      done: async (pid, id) => { note("Job started. They can follow it in Revora."); await client(c.id); const j = E.jobs.find(x => x.pid === pid && x.id === id); if (j) openJob(j); } });
  }
  function openJob(j) {
    if (!j) return;
    rvJobs.manageBox({ w: j, pid: j.pid, client: { name: j.client, email: j.email ? "yes" : "", app: j.app, phone: j.phone }, bikeName: j.bike, note,
      save: async patch => { await jobSave(j.pid, j.id, patch); Object.assign(j, patch, { updatedAt: new Date().toISOString() }); return j; },
      pickedUp: async ww => {
        const cl = await rpc("emp_client", { cid: j.client_id }), b = cl && cl.bikes.find(x => x.id === j.pid); if (!b) throw new Error("That bike isn't here any more.");
        const id = nextId(b.maintenance, "MAINT-U", 3), odo = D().compute(b).odo;
        const res = await rpc("emp_put", { pid: j.pid, k: "maintenance", rid: id, d: Object.assign(rvJobs.historyRec(ww), { odometer: odo ? odo.miles : 0, doneBy: "A shop", shop: E.shop.name || "Shop", planned: false }) });
        if (res !== "ok") throw new Error(JOBERR[res] || "That didn't save. Try again.");
        await jobSave(j.pid, j.id, { status: "Picked up", pickedAt: new Date().toISOString() });
        b.maintenance = (b.maintenance || []).concat([{ id, date: D().today(), service: rvJobs.historyRec(ww).service }]); syncRem(b, (b.meta && b.meta.bike) || b.name);
      },
      refresh: () => E.view && E.view() });
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
    if (adminBypass(ctx)) return fn();
    const email = ctx.session.user.email;
    const box = document.createElement("div"); box.className = "pk-modal sx-modal";
    box.innerHTML = `<div class="pk-card sx-card" role="dialog" aria-modal="true"><div class="sx-mh"><h2>Admin password</h2><button class="sx-x" data-close aria-label="Close">×</button></div>
      <p class="sx-p">${esc(what)} needs the password for ${esc(email)}.</p><form class="sx-form" id="pwF"><label class="sx-f"><b>Password</b><input name="pw" type="password" autocomplete="current-password"></label><p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="linkbtn" data-setpw>Signed up with Google? Set a password</button><span class="grow"></span><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">Continue</button></div></form></div>`;
    box.addEventListener("click", ev => { if (ev.target.closest("[data-close]")) box.remove(); });
    document.body.appendChild(box); setTimeout(() => box.querySelector("input").focus(), 30);
    const f = box.querySelector("#pwF"), er = box.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); f.querySelector("[type=submit]").disabled = true;
      const { error } = await ctx.sb.auth.signInWithPassword({ email, password: f.pw.value });
      if (error) { er.textContent = "That password isn't right. If you sign in with Google, set a password first."; er.hidden = false; f.querySelector("[type=submit]").disabled = false; return; }
      box.remove(); fn(); };
    box.querySelector("[data-setpw]").onclick = () => googleForPassword(ctx);
  }

  window.rvShopLock = { gate, phoneStart, installFirst, inviteLink, empApp, ownerOpen, ownerTouch, lockAll, watchIdle, needPassword, setPasswordPage, isAdmin, adminBypass, customerMode,
    setCustomerMode(on) { ls.set("rv.customerMode", on ? "1" : null); ls.set("rv.ownerOk", null); ls.set("rv.empSess", null); },
    markOwnerOpen() { ls.set("rv.ownerOk", "1"); watchIdle(); },
    hasDevice: () => !!ls.get("rv.empdev") && !sessionStorage.getItem("rv.ownRevora"), empActive };
})();
