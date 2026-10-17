/* ============ Plans page in the app ============ */
VIEWS.plans = {
  render() {
    const P = planNow();
    return `<div class="ph" data-own="1"><div class="eyebrow">Your account</div><h1>Plans</h1><p>${P.admin ? "You're the admin, so every feature is on for you." : P.trial ? "You're on the Restorer free trial." : P.paid ? "Thanks for being a paying member." : "Start free with one bike. Upgrade for reminders, recalls, AI receipts, restoration courses and more."}</p></div>
      ${rvPlansHtml({ yearly: !!R.f.plYear, current: P.id, until: P.until, trialUsed: P.trialUsed || !window.RV_CLOUD, paid: P.paid, comp: P.comp })}
      ${P.admin && window.RV_CLOUD ? giftAdminHtml() : ""}`;
  },
  bind(root) {
    rvBindGift(root, () => window.RV_CLOUD && RV_CLOUD.sb, () => location.reload());
    if (planNow().admin && window.RV_CLOUD) giftAdminBind(root);
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
