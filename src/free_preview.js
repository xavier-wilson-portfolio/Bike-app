/* ============ Free preview (admin only) ============
   Xavier can switch one bike to look exactly like a free account sees it, for filming.
   It's a setting on that bike only: every lock, blur, upgrade prompt and free limit shows as it would for a free user.
   Nothing about the account changes, and turning it off brings everything back. */
(function () {
  const ADMIN = "xavier.j.wilson101@gmail.com";
  const isAdmin = () => !!(window.RV_CLOUD && RV_CLOUD.user && String(RV_CLOUD.user.email || "").toLowerCase() === ADMIN);
  window.rvFreePreview = () => isAdmin() && !!(typeof meta === "function" && meta() || {}).freePreview;

  // the library: the server hands admin every number, so hide them here the same way it hides them for free accounts
  const mask = v => String(v == null ? "" : v).replace(/[0-9]/g, "8");
  const look0 = libLookup;
  libLookup = async function () {
    const d = await look0.apply(this, arguments);
    if (!rvFreePreview()) return d;
    LIB.full = false;
    if (LIB.entry) {
      const e = Object.assign({}, LIB.entry);
      e.specs = (e.specs || []).map(s => s.k === "oilCap" ? s : Object.assign({}, s, { v: mask(s.v), locked: true }));
      e.torque = (e.torque || []).map(t => Object.assign({}, t, { v: mask(t.v), locked: true }));
      e.diagrams = {}; e.locked = true; LIB.entry = e;
    }
    return d;
  };
  // free accounts never start a build; and the trial button shouldn't start a real trial on the admin account
  const build0 = libBuild; libBuild = function () { if (rvFreePreview()) return; return build0.apply(this, arguments); };
  const trial0 = startTrial; startTrial = async function () { if (rvFreePreview()) { toast("Free preview: on a free account this starts the 30-day Restorer trial."); return; } return trial0.apply(this, arguments); };
  // the 3 free mechanic questions count for this preview session only, not on the admin account
  const chat0 = chatAllowed;
  chatAllowed = function () {
    if (!rvFreePreview()) return chat0.apply(this, arguments);
    const used = +(sessionStorage.getItem("rv.previewChats") || 0);
    if (used >= FREE_CHATS) { modal(upsellBody("rider", { title: "That's your 3 free questions", text: LOCK_TXT.chat }), m => bindUpsell(m)); return false; }
    sessionStorage.setItem("rv.previewChats", String(used + 1));
    if (used + 1 === FREE_CHATS) setTimeout(() => toast("That was your last free question. Rider includes 10 a day."), 1500);
    return true;
  };

  // the switch, on this bike's Settings page (admin only)
  const r0 = VIEWS.settings.render, b0 = VIEWS.settings.bind;
  const panel = () => isAdmin() ? `<div class="panel stack"><h2 class="sec">Free preview (admin only)</h2>
    <label class="chk"><input type="checkbox" id="fpOn" ${meta().freePreview ? "checked" : ""}> Show this bike exactly like a free account sees it</label>
    <p class="muted" style="margin:0;font-size:12.5px">For filming. Locks, blurred numbers, upgrade prompts and free limits all show on this bike only. Your account stays the same. Untick to see everything again.</p></div>` : "";
  VIEWS.settings.render = function () {
    const html = r0.apply(this, arguments), p = panel(); if (!p) return html;
    const at = html.indexOf('<div class="stack">');
    return at > 0 ? html.slice(0, at + 19) + p + html.slice(at + 19) : html + p;
  };
  VIEWS.settings.bind = function (root) {
    b0.apply(this, arguments);
    const c = $("#fpOn", root); if (!c) return;
    c.onchange = async () => {
      const m = clone(meta()); if (c.checked) m.freePreview = true; else delete m.freePreview;
      await store.put("meta", m, { action: c.checked ? "turned on free preview" : "turned off free preview" });
      Object.assign(LIB, { entry: null, full: false, queue: null, tried: false, busy: null, building: false });
      sessionStorage.removeItem("rv.previewChats");
      toast(c.checked ? "Free preview on. This bike now looks like a free account." : "Free preview off.");
    };
  };
})();
