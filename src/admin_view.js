/* ============ Admin dashboard on the garage page (admin account only) ============
   Sign-ups and emails, free memberships, gift codes, feedback inbox, sign-up emails and quick links.
   Everything here is also locked down in the database: only the admin account can read or change it. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const day = d => d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "never";
  const ago = d => { if (!d) return "never"; const m = (Date.now() - new Date(d)) / 6e4; return m < 60 ? Math.max(1, Math.round(m)) + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : m < 2880 ? "yesterday" : Math.round(m / 1440) + " days ago"; };
  const PN = { rider: "Rider", restorer: "Restorer", shop: "Shop" };
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  let sb, root, toast, D = { people: null, comps: null, gifts: null, uses: [], fb: null, fbDone: true, welcome: null }, S = { tab: lsGet("rv.adm.tab") || "overview", open: lsGet("rv.adm.open") !== "0", q: "", show: "", fbShow: "new", fbKind: "" };
  const setupMsg = f => `<p class="muted">This needs a one-time setup in the database (supabase/${f}).</p>`;
  const isSetup = e => /does not exist|schema cache|function/i.test((e && e.message) || "");
  const code = () => { const a = new Uint8Array(8); crypto.getRandomValues(a); const c = Array.from(a, x => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join(""); return "REV-" + c.slice(0, 4) + "-" + c.slice(4); };
  const planOf = g => { const over = g.plan_until && new Date(g.plan_until) < new Date(), id = g.plan === "pro" ? "rider" : g.plan;
    if (!id || id === "free" || over) return { k: "free", t: "Free", c: "gray" }; const n = PN[id] || id;
    return g.paid ? { k: "paid", t: n + " · paid", c: "green" } : g.comp ? { k: "gift", t: n + " · gifted", c: "amber" } : g.trial ? { k: "trial", t: n + " · trial", c: "amber" } : { k: "paid", t: n, c: "green" }; };

  async function load(what) {
    const all = !what;
    const jobs = [];
    if (all || what === "people") jobs.push(sb.rpc("admin_people").then(r => D.people = r.error ? { err: isSetup(r.error) ? "setup" : "load" } : r.data || []));
    if (all || what === "welcome") jobs.push(sb.rpc("welcome_state").then(r => D.welcome = r.error ? { err: 1 } : (r.data || [])[0] || { err: 1 }));
    if (all || what === "comps") jobs.push(sb.from("comp_grants").select("*").order("created_at", { ascending: false }).then(r => D.comps = r.error ? { err: isSetup(r.error) ? "setup" : "load" } : r.data || []));
    if (all || what === "gifts") jobs.push(Promise.all([sb.from("gift_codes").select("*").order("created_at", { ascending: false }), sb.from("gift_redemptions").select("code,email,at").order("at", { ascending: false })]).then(([a, b]) => { D.gifts = a.error ? { err: isSetup(a.error) ? "setup" : "load" } : a.data || []; D.uses = b.data || []; }));
    if (all || what === "fb") jobs.push(sb.from("feedback").select("*").order("created_at", { ascending: false }).limit(500).then(r => { D.fb = r.error ? { err: "load" } : r.data || []; D.fbDone = !r.error && (!(r.data || []).length || "done_at" in r.data[0]); }));
    await Promise.all(jobs); draw();
  }
  const arr = v => Array.isArray(v) ? v : [];
  const newFb = () => arr(D.fb).filter(f => !f.done_at);

  // ---------- overview ----------
  function chart(people) {
    const days = 30, now = new Date(); now.setHours(0, 0, 0, 0); const b = Array(days).fill(0);
    people.forEach(g => { const d = new Date(g.joined); d.setHours(0, 0, 0, 0); const i = days - 1 - Math.round((now - d) / 864e5); if (i >= 0 && i < days) b[i]++; });
    const mx = Math.max(1, ...b);
    return `<div class="adm-bars" role="img" aria-label="Sign-ups per day, last 30 days">${b.map(v => `<i class="${v ? "on" : ""}" style="height:${v ? Math.max(6, v / mx * 100).toFixed(0) : 2}%" title="${v} sign-up${v === 1 ? "" : "s"}"></i>`).join("")}</div><div class="adm-axis"><span>30 days ago</span><span>Today</span></div>`;
  }
  function overview() {
    const P = arr(D.people), wk = Date.now() - 7 * 864e5, td = new Date(); td.setHours(0, 0, 0, 0);
    const n = k => P.filter(g => planOf(g).k === k).length;
    const tiles = [[P.length, "Signed up"], [P.filter(g => new Date(g.joined) >= td).length, "Today"], [P.filter(g => new Date(g.joined) > wk).length, "This week"], [n("paid"), "Paying"], [n("gift") + n("trial"), "Gifted or trial"], [P.filter(g => g.last_seen && new Date(g.last_seen) > wk).length, "Active this week"], [P.filter(g => !g.bikes).length, "No bike yet"], [newFb().length, "New feedback", "fb"]];
    const W = D.welcome;
    return `<div class="adm-tiles">${tiles.map(([v, t, go]) => `<${go ? `button type="button" data-adm-tab="${go}"` : "div"} class="adm-tile${go && v ? " hot" : ""}"><b>${D.people === null ? "…" : esc(v)}</b><span>${esc(t)}</span></${go ? "button" : "div"}>`).join("")}</div>
      ${D.people && D.people.err ? `<p class="muted">${D.people.err === "setup" ? "People need a one-time setup in the database (supabase/admin_people.sql)." : "Couldn't load people. Refresh to try again."}</p>` : `<div class="adm-card"><div class="adm-ch"><b>Sign-ups, last 30 days</b></div>${chart(P)}</div>`}
      <div class="adm-two">
        <div class="adm-card"><div class="adm-ch"><b>Newest sign-ups</b><button class="linkbtn" data-adm-tab="people">See everyone</button></div>
          ${P.slice().sort((a, b) => new Date(b.joined) - new Date(a.joined)).slice(0, 6).map(g => { const pl = planOf(g); return `<div class="adm-mini"><div class="grow"><b>${esc(g.name || (g.email || "").split("@")[0])}</b> <span class="pill ${pl.c}">${esc(pl.t)}</span><small class="faint">${esc(g.email)} · ${esc(ago(g.joined))}</small></div><a class="btn sm" href="mailto:${esc(g.email)}?subject=${encodeURIComponent("Revora Garage")}">Email</a></div>`; }).join("") || `<p class="muted">Nobody yet.</p>`}</div>
        <div class="adm-card"><div class="adm-ch"><b>Latest feedback</b><button class="linkbtn" data-adm-tab="fb">Open inbox</button></div>
          ${arr(D.fb).slice(0, 4).map(f => `<div class="adm-mini"><div class="grow"><span class="pill ${f.done_at ? "gray" : kindC(f.kind)}">${esc(kindT(f.kind))}</span> <small class="faint">${esc(f.email || "No email")} · ${esc(ago(f.created_at))}</small><span class="adm-msg">${esc(String(f.message).slice(0, 160))}${String(f.message).length > 160 ? "…" : ""}</span></div></div>`).join("") || `<p class="muted">${D.fb === null ? "Loading…" : "No feedback yet."}</p>`}</div></div>
      ${W && !W.err ? `<div class="adm-card adm-row"><div class="grow"><b>Emails to new sign-ups</b> <span class="pill ${W.enabled ? "green" : "gray"}">${W.enabled ? "On" : "Off"}</span><small class="faint">Thank-you right away, deals on day 3 (Free only), features on day 7, a check-in on day 14, then every two weeks. Sent from info@revoragarage.com once a day. ${esc(W.sent)} sent so far${W.last_sent ? ", last " + esc(ago(W.last_sent)) : ""}.</small></div><button class="btn sm${W.enabled ? "" : " pri"}" data-adm-welcome>${W.enabled ? "Turn off" : "Turn on"}</button></div>` : ""}
      <div class="adm-card"><div class="adm-ch"><b>Quick links</b></div><div class="adm-links">${[["Supabase", "https://supabase.com/dashboard/project/fhuksccqsyaomnouxxtb"], ["Stripe", "https://dashboard.stripe.com/"], ["Resend emails", "https://resend.com/emails"], ["Cloudflare", "https://dash.cloudflare.com/"], ["Meta Business Suite", "https://business.facebook.com/latest/home"], ["TikTok Studio", "https://www.tiktok.com/tiktokstudio/content"], ["Email inbox", "https://mail.google.com/"]].map(([t, u]) => `<a class="btn sm" href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join("")}</div></div>`;
  }
  // ---------- people ----------
  function pplRows() {
    const q = S.q.toLowerCase(), wk = Date.now() - 7 * 864e5;
    return arr(D.people).slice().sort((a, b) => new Date(b.joined) - new Date(a.joined)).filter(g => {
      if (q && !((g.email || "") + " " + (g.name || "")).toLowerCase().includes(q)) return false; const k = planOf(g).k;
      if (S.show === "free") return k === "free"; if (S.show === "paid") return k === "paid"; if (S.show === "gift") return k === "gift" || k === "trial";
      if (S.show === "nobike") return !g.bikes; if (S.show === "new") return new Date(g.joined) > wk; if (S.show === "idle") return !g.last_seen || new Date(g.last_seen) < Date.now() - 14 * 864e5; return true; });
  }
  function people() {
    if (D.people === null) return `<p class="muted">Loading…</p>`; if (D.people.err) return D.people.err === "setup" ? setupMsg("admin_people.sql") : `<p class="muted">Couldn't load the list.</p>`;
    const rows = pplRows();
    return `<div class="ppl-tools"><input data-adm-q type="search" placeholder="Search name or email" value="${esc(S.q)}" aria-label="Search people">
        <select data-adm-show aria-label="Show">${[["", "Everyone"], ["new", "Joined this week"], ["free", "Free"], ["paid", "Paying"], ["gift", "Gifted or trial"], ["nobike", "No bike added yet"], ["idle", "Not back in 2 weeks"]].map(([v, t]) => `<option value="${v}"${S.show === v ? " selected" : ""}>${t}</option>`).join("")}</select>
        <button class="btn sm" data-adm-copy>Copy ${rows.length} emails</button><button class="btn sm" data-adm-csv>Download list</button></div>
      <div class="ppl-list">${rows.map(g => { const pl = planOf(g); return `<div class="ppl-row"><div class="grow"><b>${esc(g.name || (g.email || "").split("@")[0])}</b> <span class="pill ${pl.c}">${esc(pl.t)}</span>
        <small class="faint">${esc(g.email)} · joined ${esc(day(g.joined))} · last in ${esc(day(g.last_seen))} · ${esc(g.bikes)} bike${g.bikes === 1 ? "" : "s"}</small></div>
        <button class="btn sm" data-adm-give="${esc(g.email)}">Give plan</button><a class="btn sm" href="mailto:${esc(g.email)}?subject=${encodeURIComponent("Revora Garage")}">Email</a></div>`; }).join("") || `<p class="muted">Nobody matches.</p>`}</div>
      <p class="faint adm-foot">For a group email, paste the copied emails into BCC so people don't see each other's addresses.</p>`;
  }
  // ---------- free memberships ----------
  function comps() {
    if (D.comps && D.comps.err === "setup") return setupMsg("comp_grants.sql");
    return `<p class="muted" style="margin:0 0 10px">Type their email and pick a plan. If they have an account it's on right away. If not, it switches on when they sign up with that email.</p>
      <form class="gift-new" data-adm-comp>
        <label class="bp-f"><b>Their email</b><input name="email" type="email" required maxlength="200" placeholder="name@example.com" autocomplete="off" value="${esc(S.giveTo || "")}"></label>
        <label class="bp-f"><b>Plan</b><select name="plan"><option value="shop">Everything (Shop)</option><option value="restorer">Restorer</option><option value="rider">Rider</option></select></label>
        <label class="bp-f"><b>Ends on</b><input name="until" type="date"><small class="faint">Leave empty for no end date</small></label>
        <label class="bp-f"><b>Note (for you)</b><input name="note" maxlength="200" placeholder="e.g. Beta tester"></label>
        <button class="btn pri" type="submit">Approve</button></form>
      ${arr(D.comps).length ? `<div class="gift-list">${arr(D.comps).map(g => { const over = g.until && new Date(g.until) < new Date();
        return `<div class="gift-row${over ? " off" : ""}"><div class="grow"><b>${esc(g.email)}</b> <span class="pill ${over ? "gray" : g.applied_at ? "green" : "amber"}">${over ? "Ended" : (PN[g.plan] || g.plan) + (g.applied_at ? "" : " · waiting for sign-up")}</span>
          <small class="faint">${g.until ? (over ? "Ended " : "Until ") + esc(day(g.until)) : "No end date"}${g.note ? " · " + esc(g.note) : ""}</small></div><button class="btn sm" data-adm-revoke="${esc(g.email)}">Remove</button></div>`; }).join("")}</div>` : `<p class="muted">${D.comps === null ? "Loading…" : "Nobody yet."}</p>`}
      <p class="faint adm-foot">Remove takes them back to Free. Approving the same email again changes their plan or end date.</p>`;
  }
  // ---------- gift codes ----------
  function gifts() {
    if (D.gifts && D.gifts.err === "setup") return `<p class="muted">Gift codes need a one-time setup in the database.</p>`;
    return `<form class="gift-new" data-adm-gift>
        <label class="bp-f"><b>Code</b><input name="code" value="${code()}" maxlength="32"></label>
        <label class="bp-f"><b>Unlocks</b><select name="plan"><option value="shop">Everything (Shop)</option><option value="restorer">Restorer</option><option value="rider">Rider</option></select></label>
        <label class="bp-f"><b>How many people can use it</b><input name="max" type="number" min="1" value="1"><small class="faint">Leave empty for no limit</small></label>
        <label class="bp-f"><b>Note (for you)</b><input name="note" maxlength="200" placeholder="e.g. For Jake from the shop"></label>
        <button class="btn pri" type="submit">Make code</button></form>
      ${arr(D.gifts).length ? `<div class="gift-list">${arr(D.gifts).map(g => { const who = D.uses.filter(u => u.code === g.code); return `<div class="gift-row${g.active ? "" : " off"}"><div class="grow"><code>${esc(g.code)}</code> <span class="pill ${g.active ? "green" : "gray"}">${g.active ? PN[g.plan] || g.plan : "Off"}</span>
        <small class="faint">${esc(g.uses)}${g.max_uses ? " of " + esc(g.max_uses) : ""} used${g.note ? " · " + esc(g.note) : ""}${who.length ? " · " + who.map(u => esc(u.email || "someone")).join(", ") : ""}</small></div>
        <button class="btn sm" data-adm-gcopy="${esc(g.code)}">Copy</button>${g.active ? `<button class="btn sm" data-adm-goff="${esc(g.code)}">Switch off</button>` : ""}</div>`; }).join("")}</div>` : `<p class="muted">${D.gifts === null ? "Loading…" : "No codes yet."}</p>`}
      <p class="faint adm-foot">Switching a code off stops new people using it. Anyone who already used it keeps their plan.</p>`;
  }
  // ---------- feedback ----------
  const KINDS = { idea: ["Idea", "blue"], problem: ["Problem", "red"], question: ["Question", "amber"], praise: ["Praise", "green"] };
  const kindT = k => (KINDS[k] || ["Note"])[0], kindC = k => (KINDS[k] || [0, "gray"])[1];
  function feedback() {
    if (D.fb === null) return `<p class="muted">Loading…</p>`; if (D.fb.err) return `<p class="muted">Couldn't load feedback. Refresh to try again.</p>`;
    const list = arr(D.fb).filter(f => (S.fbShow === "new" ? !f.done_at : S.fbShow === "done" ? f.done_at : true) && (!S.fbKind || f.kind === S.fbKind));
    const cnt = k => arr(D.fb).filter(f => !f.done_at && f.kind === k).length;
    return `${D.fbDone ? "" : `<p class="faint adm-foot" style="margin:0 0 8px">To mark feedback as done, run supabase/admin_hq.sql once in the database.</p>`}
      <div class="adm-seg">${[["new", "New (" + newFb().length + ")"], ["done", "Done"], ["all", "All (" + arr(D.fb).length + ")"]].map(([v, t]) => `<button type="button" class="${S.fbShow === v ? "on" : ""}" data-adm-fbshow="${v}">${t}</button>`).join("")}
        <span class="adm-gap"></span>${[["", "Every kind"], ...Object.entries(KINDS).map(([k, v]) => [k, v[0] + (cnt(k) ? " (" + cnt(k) + ")" : "")])].map(([v, t]) => `<button type="button" class="${S.fbKind === v ? "on" : ""}" data-adm-fbkind="${v}">${t}</button>`).join("")}</div>
      <div class="adm-fbs">${list.map(f => `<article class="adm-fb${f.done_at ? " done" : ""}"><div class="adm-fbh"><span class="pill ${kindC(f.kind)}">${esc(kindT(f.kind))}</span>${f.rating ? `<span class="adm-stars" aria-label="${f.rating} of 5">${"★".repeat(f.rating)}<i>${"★".repeat(5 - f.rating)}</i></span>` : ""}<small class="faint">${esc(day(f.created_at))} · ${esc(ago(f.created_at))}</small></div>
        <p class="adm-fbm">${esc(f.message)}</p>
        <small class="faint">${esc(f.email || "No email left")}${f.page ? " · on " + esc(f.page) : ""}${f.bike ? " · " + esc(f.bike) : ""}${f.device ? " · " + esc(String(f.device).slice(0, 60)) : ""}</small>
        <div class="adm-fba">${f.email ? `<a class="btn sm" href="mailto:${esc(f.email)}?subject=${encodeURIComponent("Re: your Revora feedback")}&body=${encodeURIComponent("\n\n> " + String(f.message).slice(0, 500))}">Reply</a>` : ""}${D.fbDone ? `<button class="btn sm" data-adm-fbdone="${esc(f.id)}" data-v="${f.done_at ? "" : "1"}">${f.done_at ? "Move back to new" : "Mark done"}</button>` : ""}</div></article>`).join("") || `<p class="muted">Nothing here.</p>`}</div>`;
  }

  const TABS = [["overview", "Overview"], ["people", "People"], ["comps", "Free memberships"], ["gifts", "Gift codes"], ["fb", "Feedback"]];
  function draw() {
    if (!root) return; const nf = newFb().length;
    root.innerHTML = `<section class="adm"><div class="adm-h"><button type="button" class="adm-tog" data-adm-tog aria-expanded="${S.open}"><span class="adm-badge">Admin</span><b>Revora HQ</b><small>Only you see this</small><span class="adm-car">${S.open ? "Hide" : "Show"}</span></button>
        ${S.open ? `<button class="btn sm" data-adm-refresh>Refresh</button>` : nf ? `<span class="pill red">${nf} new feedback</span>` : ""}</div>
      ${S.open ? `<nav class="adm-tabs" role="tablist">${TABS.map(([k, t]) => `<button type="button" role="tab" aria-selected="${S.tab === k}" class="${S.tab === k ? "on" : ""}" data-adm-tab="${k}">${t}${k === "fb" && nf ? ` <i>${nf}</i>` : k === "people" && Array.isArray(D.people) ? ` <i class="g">${D.people.length}</i>` : ""}</button>`).join("")}</nav>
      <div class="adm-body">${({ overview, people, comps, gifts, fb: feedback })[S.tab]()}</div>` : ""}</section>`;
    bind();
  }
  function bind() {
    const $ = s => root.querySelector(s), $$ = s => root.querySelectorAll(s);
    $("[data-adm-tog]").onclick = () => { S.open = !S.open; lsSet("rv.adm.open", S.open ? "1" : "0"); draw(); };
    const rf = $("[data-adm-refresh]"); if (rf) rf.onclick = () => { rf.disabled = true; load(); };
    $$("[data-adm-tab]").forEach(b => b.onclick = () => { S.tab = b.dataset.admTab; lsSet("rv.adm.tab", S.tab); S.open = true; draw(); });
    const w = $("[data-adm-welcome]"); if (w) w.onclick = async () => { const on = !D.welcome.enabled; if (on && !confirm("Start emailing new sign-ups?")) return;
      const { error } = await sb.rpc("welcome_switch", { turn_on: on }); if (error) return toast("Couldn't change that.", true); D.welcome.enabled = on; toast(on ? "On. The next batch goes out with the daily run." : "Off. No more sign-up emails."); draw(); };
    const q = $("[data-adm-q]"); if (q) q.oninput = () => { S.q = q.value; clearTimeout(q._t); q._t = setTimeout(() => { draw(); const n = root.querySelector("[data-adm-q]"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
    const sh = $("[data-adm-show]"); if (sh) sh.onchange = () => { S.show = sh.value; draw(); };
    const cp = $("[data-adm-copy]"); if (cp) cp.onclick = async () => { const t = pplRows().map(g => g.email).join(", "); try { await navigator.clipboard.writeText(t); toast("Copied " + pplRows().length + " emails."); } catch (e) { prompt("Copy these emails:", t); } };
    const cv = $("[data-adm-csv]"); if (cv) cv.onclick = () => { const c = v => '"' + String(v ?? "").replace(/"/g, '""') + '"', d = v => v ? new Date(v).toISOString().slice(0, 10) : "";
      const csv = ["Name,Email,Joined,Last sign-in,Plan,Bikes"].concat(pplRows().map(g => [g.name, g.email, d(g.joined), d(g.last_seen), planOf(g).t, g.bikes].map(c).join(","))).join("\n");
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "revora-people.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
    $$("[data-adm-give]").forEach(b => b.onclick = () => { S.giveTo = b.dataset.admGive; S.tab = "comps"; draw(); const i = root.querySelector('[data-adm-comp] select'); if (i) i.focus(); });
    const cf = $("[data-adm-comp]"); if (cf) cf.onsubmit = async ev => { ev.preventDefault(); const email = cf.email.value.trim().toLowerCase(), b = cf.querySelector("button");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast("That email doesn't look right.", true);
      const till = cf.until.value ? new Date(cf.until.value + "T23:59:59").toISOString() : null;
      b.disabled = true; const { data, error } = await sb.rpc("grant_plan", { em: email, pl: cf.plan.value, till, nt: cf.note.value.trim() || null }); b.disabled = false;
      if (error || !/^(applied|waiting)$/.test(data || "")) return toast(data === "denied" ? "Only the admin can do this." : "Couldn't save that. Try again.", true);
      S.giveTo = ""; toast(data === "applied" ? "Done. " + email + " has it now." : "Saved. It switches on when " + email + " signs up."); load("comps"); load("people"); };
    $$("[data-adm-revoke]").forEach(b => b.onclick = async () => { if (!confirm("Take the free plan back from " + b.dataset.admRevoke + "?")) return;
      const { data, error } = await sb.rpc("revoke_plan", { em: b.dataset.admRevoke }); if (error || data !== "ok") return toast("Couldn't remove it.", true); toast("Removed."); load("comps"); load("people"); });
    const gf = $("[data-adm-gift]"); if (gf) gf.onsubmit = async ev => { ev.preventDefault(); const c = gf.code.value.trim().toUpperCase();
      if (!/^[A-Z0-9-]{4,32}$/.test(c)) return toast("Codes can use letters, numbers and dashes, 4 to 32 long.", true);
      const { error } = await sb.from("gift_codes").insert({ code: c, plan: gf.plan.value, max_uses: gf.max.value ? Math.max(1, +gf.max.value) : null, note: gf.note.value.trim() });
      if (error) return toast(/duplicate|unique/i.test(error.message || "") ? "That code already exists." : "Couldn't make the code.", true);
      try { await navigator.clipboard.writeText(c); } catch (e) {} toast("Code made and copied: " + c); load("gifts"); };
    $$("[data-adm-gcopy]").forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.admGcopy); toast("Copied."); } catch (e) { prompt("Copy this code:", b.dataset.admGcopy); } });
    $$("[data-adm-goff]").forEach(b => b.onclick = async () => { const { error } = await sb.from("gift_codes").update({ active: false }).eq("code", b.dataset.admGoff); if (error) return toast("Couldn't switch it off.", true); toast("Code switched off."); load("gifts"); });
    $$("[data-adm-fbshow]").forEach(b => b.onclick = () => { S.fbShow = b.dataset.admFbshow; draw(); });
    $$("[data-adm-fbkind]").forEach(b => b.onclick = () => { S.fbKind = b.dataset.admFbkind; draw(); });
    $$("[data-adm-fbdone]").forEach(b => b.onclick = async () => { const v = b.dataset.v ? new Date().toISOString() : null; b.disabled = true;
      const { error } = await sb.from("feedback").update({ done_at: v }).eq("id", b.dataset.admFbdone); if (error) { b.disabled = false; return toast("Couldn't update that.", true); }
      const f = arr(D.fb).find(x => String(x.id) === b.dataset.admFbdone); if (f) f.done_at = v; draw(); });
  }
  window.rvAdmin = { mount(el, client, note) { root = el; sb = client; toast = note || ((m) => alert(m)); draw(); load(); } };
})();
