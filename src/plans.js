/* ============ Plans page in the app ============ */
VIEWS.plans = {
  render() {
    const P = planNow();
    return `<div class="ph" data-own="1"><div class="eyebrow">Your account</div><h1>Plans</h1><p>${P.admin ? "You're the admin, so every feature is on for you." : P.trial ? "You're on the Restorer free trial." : P.paid ? "Thanks for being a paying member." : "Start free with one bike. Upgrade for reminders, recalls, AI receipts, restoration courses and more."}</p></div>
      ${rvPlansHtml({ yearly: !!R.f.plYear, current: P.id, until: P.until, trialUsed: P.trialUsed || !window.RV_CLOUD, paid: P.paid, comp: P.comp })}
      ${P.admin && window.RV_CLOUD ? peopleAdminHtml() + compAdminHtml() + giftAdminHtml() : ""}`;
  },
  bind(root) {
    rvBindGift(root, () => window.RV_CLOUD && RV_CLOUD.sb, () => location.reload());
    if (planNow().admin && window.RV_CLOUD) { peopleAdminBind(root); compAdminBind(root); giftAdminBind(root); }
    rvBindManage(root, async () => window.RV_CLOUD && (await RV_CLOUD.sb.auth.getSession()).data.session?.access_token);
    $$("[data-pl-bill]", root).forEach(b => b.onclick = () => { R.f.plYear = b.dataset.plBill === "y"; render(false); });
    $$("[data-pl-pick]", root).forEach(b => b.onclick = () => { if (b.dataset.plPick === "trial") startTrial(); else { const u = window.RV_CLOUD && rvCheckoutUrl(b.dataset.plPick, !!R.f.plYear, RV_CLOUD.user); if (u) location.href = u; else toast(window.RV_CLOUD ? "Checkout opens soon." : "Create a free account first.", "err"); } });
  }
};

/* ---- admin: make and track gift codes ---- */
let GIFTS = null, GIFT_USES = [];
async function loadGifts() {
  const sb = RV_CLOUD.sb, [a, b] = await Promise.all([sb.from("gift_codes").select("*").order("created_at", { ascending: false }), sb.from("gift_redemptions").select("code,email,at").order("at", { ascending: false })]);
  GIFTS = a.error ? { err: /does not exist|schema cache/i.test(a.error.message || "") ? "setup" : "load" } : a.data || []; GIFT_USES = b.data || [];
  if (R.sec === "plans") render(false);
}
const giftCode = () => { const a = new Uint8Array(8); crypto.getRandomValues(a); const c = Array.from(a, x => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join(""); return "REV-" + c.slice(0, 4) + "-" + c.slice(4); };
function giftAdminHtml() {
  if (GIFTS === null) { GIFTS = []; loadGifts(); }
  const PN = { rider: "Rider", restorer: "Restorer", shop: "Shop" };
  return `<section class="mh-panel gift-admin"><div class="mh-ph"><h2><span class="mh-hi">${ic("star")}</span>Gift codes <span class="faint" style="font-weight:400;font-size:13px">only you can see this</span></h2></div>
    ${GIFTS.err === "setup" ? `<p class="muted">Gift codes need a one-time setup in the database.</p>` : `
    <form class="gift-new" id="giftNew">
      <label class="bp-f"><b>Code</b><input name="code" value="${giftCode()}" maxlength="32"></label>
      <label class="bp-f"><b>Unlocks</b><select name="plan"><option value="shop">Everything (Shop)</option><option value="restorer">Restorer</option><option value="rider">Rider</option></select></label>
      <label class="bp-f"><b>How many people can use it</b><input name="max" type="number" min="1" value="1"><small class="faint">Leave empty for no limit</small></label>
      <label class="bp-f"><b>Note (for you)</b><input name="note" maxlength="200" placeholder="e.g. For Jake from the shop"></label>
      <button class="btn pri" type="submit">${ic("plus")} Make code</button></form>
    ${(GIFTS || []).length ? `<div class="gift-list">${GIFTS.map(g => { const who = GIFT_USES.filter(u => u.code === g.code); return `<div class="gift-row${g.active ? "" : " off"}"><div class="grow"><code>${esc(g.code)}</code> <span class="pill ${g.active ? "green" : "gray"}">${g.active ? PN[g.plan] : "Off"}</span>
        <small class="faint">${esc(g.uses)}${g.max_uses ? " of " + esc(g.max_uses) : ""} used${g.note ? " · " + esc(g.note) : ""}${who.length ? " · " + who.map(u => esc(u.email || "someone")).join(", ") : ""}</small></div>
        <button class="btn sm" data-gift-copy="${esc(g.code)}">${ic("copy")} Copy</button>${g.active ? `<button class="btn sm" data-gift-off="${esc(g.code)}">Switch off</button>` : ""}</div>`; }).join("")}</div>` : `<p class="muted" style="margin:8px 0 0">No codes yet.</p>`}
    <p class="faint" style="font-size:12.5px;margin:8px 0 0">Switching a code off stops new people using it. Anyone who already used it keeps their plan.</p>`}
  </section>`;
}
function giftAdminBind(root) {
  const f = $("#giftNew", root), sb = RV_CLOUD.sb;
  if (f) f.onsubmit = async ev => {
    ev.preventDefault(); const code = f.code.value.trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,32}$/.test(code)) return toast("Codes can use letters, numbers and dashes, 4 to 32 long.", "err");
    const { error } = await sb.from("gift_codes").insert({ code, plan: f.plan.value, max_uses: f.max.value ? Math.max(1, +f.max.value) : null, note: f.note.value.trim() });
    if (error) return toast(/duplicate|unique/i.test(error.message || "") ? "That code already exists." : "Couldn't make the code.", "err");
    try { await navigator.clipboard.writeText(code); } catch (e) {}
    toast("Code made and copied: " + code); loadGifts();
  };
  $$("[data-gift-copy]", root).forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.giftCopy); toast("Copied."); } catch (e) { prompt("Copy this code:", b.dataset.giftCopy); } });
  $$("[data-gift-off]", root).forEach(b => b.onclick = async () => { const { error } = await sb.from("gift_codes").update({ active: false }).eq("code", b.dataset.giftOff); if (error) return toast("Couldn't switch it off.", "err"); toast("Code switched off."); loadGifts(); });
}

/* ---- admin: give someone a free plan by email, no code ---- */
let COMPS = null;
async function loadComps() {
  const { data, error } = await RV_CLOUD.sb.from("comp_grants").select("*").order("created_at", { ascending: false });
  COMPS = error ? { err: /does not exist|schema cache/i.test(error.message || "") ? "setup" : "load" } : data || [];
  if (R.sec === "plans") render(false);
}
function compAdminHtml() {
  if (COMPS === null) { COMPS = []; loadComps(); }
  const PN = { rider: "Rider", restorer: "Restorer", shop: "Shop" }, day = d => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  return `<section class="mh-panel gift-admin"><div class="mh-ph"><h2><span class="mh-hi">${ic("star")}</span>Give a free membership <span class="faint" style="font-weight:400;font-size:13px">only you can see this</span></h2></div>
    ${COMPS.err === "setup" ? `<p class="muted">This needs a one-time setup in the database (supabase/comp_grants.sql).</p>` : `
    <p class="muted" style="margin:0 0 10px">Type their email and pick a plan. If they already have an account it's on right away. If not, it switches on when they sign up with that email.</p>
    <form class="gift-new" id="compNew">
      <label class="bp-f"><b>Their email</b><input name="email" type="email" required maxlength="200" placeholder="name@example.com" autocomplete="off"></label>
      <label class="bp-f"><b>Plan</b><select name="plan"><option value="shop">Everything (Shop)</option><option value="restorer">Restorer</option><option value="rider">Rider</option></select></label>
      <label class="bp-f"><b>Ends on</b><input name="until" type="date"><small class="faint">Leave empty for no end date</small></label>
      <label class="bp-f"><b>Note (for you)</b><input name="note" maxlength="200" placeholder="e.g. Beta tester"></label>
      <button class="btn pri" type="submit">${ic("check")} Approve</button></form>
    ${COMPS.length ? `<div class="gift-list">${COMPS.map(g => { const over = g.until && new Date(g.until) < new Date();
      return `<div class="gift-row${over ? " off" : ""}"><div class="grow"><b>${esc(g.email)}</b> <span class="pill ${over ? "gray" : g.applied_at ? "green" : "amber"}">${over ? "Ended" : PN[g.plan] + (g.applied_at ? "" : " · waiting for sign-up")}</span>
        <small class="faint">${g.until ? (over ? "Ended " : "Until ") + esc(day(g.until)) : "No end date"}${g.note ? " · " + esc(g.note) : ""}</small></div>
        <button class="btn sm" data-comp-off="${esc(g.email)}">Remove</button></div>`; }).join("")}</div>` : `<p class="muted" style="margin:8px 0 0">Nobody yet.</p>`}
    <p class="faint" style="font-size:12.5px;margin:8px 0 0">Remove takes them back to Free. Approving the same email again changes their plan or end date.</p>`}
  </section>`;
}
function compAdminBind(root) {
  const f = $("#compNew", root), sb = RV_CLOUD.sb;
  if (f) f.onsubmit = async ev => {
    ev.preventDefault(); const email = f.email.value.trim().toLowerCase(), b = f.querySelector("button");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast("That email doesn't look right.", "err");
    const till = f.until.value ? new Date(f.until.value + "T23:59:59").toISOString() : null;
    b.disabled = true; const { data, error } = await sb.rpc("grant_plan", { em: email, pl: f.plan.value, till, nt: f.note.value.trim() || null }); b.disabled = false;
    if (error || !/^(applied|waiting)$/.test(data || "")) return toast(data === "denied" ? "Only the admin can do this." : "Couldn't save that. Try again.", "err");
    toast(data === "applied" ? "Done. " + email + " has it now." : "Saved. It switches on when " + email + " signs up."); loadComps();
  };
  $$("[data-comp-off]", root).forEach(b => b.onclick = async () => {
    if (!confirm("Take the free plan back from " + b.dataset.compOff + "?")) return;
    const { data, error } = await sb.rpc("revoke_plan", { em: b.dataset.compOff });
    if (error || data !== "ok") return toast("Couldn't remove it.", "err"); toast("Removed."); loadComps();
  });
}

/* ---- admin: everyone who signed up, to reach out ---- */
let PEOPLE = null;
let WELCOME = null;
async function loadPeople() {
  RV_CLOUD.sb.rpc("welcome_state").then(r => { WELCOME = r.error ? { err: 1 } : (r.data || [])[0] || { err: 1 }; if (R.sec === "plans") render(false); });
  const { data, error } = await RV_CLOUD.sb.rpc("admin_people");
  PEOPLE = error ? { err: /does not exist|schema cache|function/i.test(error.message || "") ? "setup" : "load" } : data || [];
  if (R.sec === "plans") render(false);
}
const pplPlan = g => { const over = g.plan_until && new Date(g.plan_until) < new Date(), id = g.plan === "pro" ? "rider" : g.plan;
  if (id === "free" || over) return { k: "free", t: "Free", c: "gray" };
  const n = { rider: "Rider", restorer: "Restorer", shop: "Shop" }[id] || id;
  return g.paid ? { k: "paid", t: n + " · paid", c: "green" } : g.comp ? { k: "gift", t: n + " · gifted", c: "amber" } : g.trial ? { k: "trial", t: n + " · trial", c: "amber" } : { k: "paid", t: n, c: "green" }; };
function pplRows() {
  const f = R.f.ppl || {}, q = (f.q || "").toLowerCase(), wk = Date.now() - 7 * 864e5;
  return (Array.isArray(PEOPLE) ? PEOPLE : []).filter(g => {
    if (q && !((g.email || "") + " " + (g.name || "")).toLowerCase().includes(q)) return false;
    const k = pplPlan(g).k;
    if (f.show === "free") return k === "free"; if (f.show === "paid") return k === "paid"; if (f.show === "gift") return k === "gift" || k === "trial";
    if (f.show === "nobike") return !g.bikes; if (f.show === "new") return new Date(g.joined) > wk; return true; });
}
function peopleAdminHtml() {
  if (PEOPLE === null) { PEOPLE = []; loadPeople(); }
  if (PEOPLE.err) return `<section class="mh-panel gift-admin"><div class="mh-ph"><h2><span class="mh-hi">${ic("users")}</span>People</h2></div><p class="muted">${PEOPLE.err === "setup" ? "This needs a one-time setup in the database (supabase/admin_people.sql)." : "Couldn't load the list. Refresh to try again."}</p></section>`;
  const all = PEOPLE, f = R.f.ppl || {}, wk = Date.now() - 7 * 864e5, rows = pplRows(), day = d => d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "never";
  const n = k => all.filter(g => pplPlan(g).k === k).length;
  return `<section class="mh-panel gift-admin ppl"><div class="mh-ph"><h2><span class="mh-hi">${ic("users")}</span>People <span class="faint" style="font-weight:400;font-size:13px">only you can see this</span></h2></div>
    <div class="ppl-stats"><div><b>${all.length}</b><span>signed up</span></div><div><b>${all.filter(g => new Date(g.joined) > wk).length}</b><span>this week</span></div><div><b>${n("paid")}</b><span>paying</span></div><div><b>${n("gift") + n("trial")}</b><span>gifted or trial</span></div><div><b>${all.filter(g => !g.bikes).length}</b><span>no bike yet</span></div></div>
    ${WELCOME && !WELCOME.err ? `<div class="ppl-welcome"><div class="grow"><b>Emails to new sign-ups</b> <span class="pill ${WELCOME.enabled ? "green" : "gray"}">${WELCOME.enabled ? "On" : "Off"}</span><small class="faint">A thank-you to everyone, then a free-trial offer on day 3 and a plans note on day 8 to anyone still on Free. Sent from info@revoragarage.com once a day. ${WELCOME.sent} sent so far.</small></div><button class="btn sm${WELCOME.enabled ? "" : " pri"}" id="pplWelcome">${WELCOME.enabled ? "Turn off" : "Turn on"}</button></div>` : ""}
    <div class="ppl-tools"><input id="pplQ" type="search" placeholder="Search name or email" value="${esc(f.q || "")}" aria-label="Search people">
      <select id="pplShow" aria-label="Show"><option value="">Everyone</option><option value="new">Joined this week</option><option value="free">Free</option><option value="paid">Paying</option><option value="gift">Gifted or trial</option><option value="nobike">No bike added yet</option></select>
      <button class="btn sm" id="pplCopy">${ic("copy")} Copy ${rows.length} emails</button><button class="btn sm" id="pplCsv">Download list</button></div>
    <div class="ppl-list">${rows.map(g => { const pl = pplPlan(g); return `<div class="ppl-row"><div class="grow"><b>${esc(g.name || (g.email || "").split("@")[0])}</b> <span class="pill ${pl.c}">${esc(pl.t)}</span>
      <small class="faint">${esc(g.email)} · joined ${esc(day(g.joined))} · last in ${esc(day(g.last_seen))} · ${g.bikes} bike${g.bikes === 1 ? "" : "s"}</small></div>
      <a class="btn sm" href="mailto:${esc(g.email)}?subject=${encodeURIComponent("Revora Garage")}">Email</a></div>`; }).join("") || `<p class="muted" style="margin:8px 0 0">Nobody matches.</p>`}</div>
    <p class="faint" style="font-size:12.5px;margin:8px 0 0">For a group email, copy the emails and paste them into BCC so people don't see each other's addresses.</p></section>`;
}
function peopleAdminBind(root) {
  const w = $("#pplWelcome", root); if (w) w.onclick = async () => { const on = !WELCOME.enabled; if (on && !confirm("Start emailing new sign-ups? Everyone who joined in the last 2 weeks gets the thank-you email first.")) return;
    const { error } = await RV_CLOUD.sb.rpc("welcome_switch", { turn_on: on }); if (error) return toast("Couldn't change that.", "err"); WELCOME.enabled = on; toast(on ? "On. The next batch goes out with the daily run." : "Off. No more sign-up emails."); render(false); };
  const q = $("#pplQ", root), sh = $("#pplShow", root);
  if (sh) sh.value = (R.f.ppl || {}).show || "";
  if (q) q.oninput = () => { R.f.ppl = { ...(R.f.ppl || {}), q: q.value }; clearTimeout(q._t); q._t = setTimeout(() => { render(false); const n = $("#pplQ"); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 250); };
  if (sh) sh.onchange = () => { R.f.ppl = { ...(R.f.ppl || {}), show: sh.value }; render(false); };
  const cp = $("#pplCopy", root); if (cp) cp.onclick = async () => { const t = pplRows().map(g => g.email).join(", "); try { await navigator.clipboard.writeText(t); toast("Copied " + pplRows().length + " emails."); } catch (e) { prompt("Copy these emails:", t); } };
  const cv = $("#pplCsv", root); if (cv) cv.onclick = () => {
    const c = v => '"' + String(v ?? "").replace(/"/g, '""') + '"', d = v => v ? new Date(v).toISOString().slice(0, 10) : "";
    const csv = ["Name,Email,Joined,Last sign-in,Plan,Bikes"].concat(pplRows().map(g => [g.name, g.email, d(g.joined), d(g.last_seen), pplPlan(g).t, g.bikes].map(c).join(","))).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "revora-people.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
}
