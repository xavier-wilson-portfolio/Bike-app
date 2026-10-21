/* ============ Plans page in the app ============ */
VIEWS.plans = {
  render() {
    const P = planNow();
    return `<div class="ph" data-own="1"><div class="eyebrow">Your account</div><h1>Plans</h1><p>${P.admin ? "You're the admin, so every feature is on for you." : P.trial ? "You're on the Restorer free trial." : P.paid ? "Thanks for being a paying member." : "Start free with one bike. Upgrade for reminders, recalls, AI receipts, restoration courses and more."}</p></div>
      ${rvPlansHtml({ yearly: !!R.f.plYear, current: P.id, until: P.until, trialUsed: P.trialUsed || !window.RV_CLOUD, paid: P.paid, comp: P.comp })}
      ${P.admin && window.RV_CLOUD ? compAdminHtml() + giftAdminHtml() : ""}`;
  },
  bind(root) {
    rvBindGift(root, () => window.RV_CLOUD && RV_CLOUD.sb, () => location.reload());
    if (planNow().admin && window.RV_CLOUD) { compAdminBind(root); giftAdminBind(root); }
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
