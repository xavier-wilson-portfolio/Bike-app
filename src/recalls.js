/* ============ Recall alerts: NHTSA safety recalls for the bike's year, make and model ============
   NHTSA lists recalls by its own model names (often the model code, like DL650 for the V-Strom 650),
   so the owner confirms which NHTSA model is theirs once. Results are cached on the project for a day,
   and any open recall shows as a banner on the home page. */
GUIDE.recalls = { eyebrow: "Safety", title: "Recall alerts", sub: "Safety recalls for this bike from NHTSA, the US government's vehicle safety agency.",
  how: ["Confirm which NHTSA model name is your bike. You only do this once.", "Mark each recall done once a dealer has fixed it. Recall repairs are free at a dealer for your make.", "Revora checks again each day you open the bike and shows new recalls on the home page."] };
const NHTSA = "https://api.nhtsa.gov";
const RC_DAY = 864e5;
const rcNorm = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
function rcMeta() { return meta().recall || {}; }
async function rcSave(patch, quiet) { const m = clone(meta()); m.recall = Object.assign({}, m.recall || {}, patch); await store.put("meta", m, { noLog: true }); if (!quiet) render(false); }
const rcYear = () => String(BIKE.year || meta().year || "").slice(0, 4), rcMake = () => String(BIKE.make || meta().make || "").trim();

async function rcModels() {
  const y = rcYear(), mk = rcMake(); if (!/^\d{4}$/.test(y) || !mk) return [];
  const r = await fetch(`${NHTSA}/products/vehicle/models?modelYear=${y}&make=${encodeURIComponent(mk)}&issueType=r`); if (!r.ok) throw new Error("NHTSA " + r.status);
  const j = await r.json(); return [...new Set((j.results || []).map(x => x.model).filter(Boolean))].sort();
}
// marketing names and the model codes NHTSA usually files them under
const RC_CODES = [[/v-?strom/i, "DL"], [/bandit/i, "GSF"], [/hayabusa|busa/i, "GSX1300"], [/katana/i, "GSX"], [/gsx-?r/i, "GSXR"], [/boulevard|intruder/i, "VZ"], [/burgman/i, "AN"],
  [/ninja/i, "EX"], [/ninja|zx-?\d/i, "ZX"], [/vulcan/i, "VN"], [/versys/i, "KLE"], [/concours/i, "ZG"], [/klr/i, "KL"],
  [/gold ?wing/i, "GL"], [/shadow/i, "VT"], [/rebel/i, "CMX"], [/africa twin/i, "CRF"], [/interceptor/i, "VFR"], [/grom/i, "MSX"],
  [/v-?star/i, "XVS"], [/super tenere/i, "XT1200"], [/tenere/i, "XTZ"], [/\br1\b|\br6\b|\br3\b|\br7\b/i, "YZFR"], [/bolt/i, "XVS950"], [/fz-?\d|mt-?\d/i, "FZ"]];
// rank NHTSA model names against the rider's model, model code and short name
function rcRank(models) {
  const raw = [BIKE.model, BIKE.short, BIKE.variantShort, meta().model, ...(BIKE.match || [])].filter(Boolean).join(" ");
  const want = [BIKE.model, BIKE.short, BIKE.variantShort, meta().model, ...(BIKE.match || [])].map(rcNorm).filter(Boolean);
  const nums = [...new Set(raw.match(/\d{2,4}/g) || [])], codes = RC_CODES.filter(([rx]) => rx.test(raw)).map(([, c]) => c);
  return models.map(m => { const nm = rcNorm(m); let s = 0;
    want.forEach(w => { if (nm === w) s += 10; else if (nm.length > 2 && (w.includes(nm) || nm.includes(w))) s += 6; });
    nums.forEach(n2 => { if (nm.includes(n2)) s += 3; });
    codes.forEach(c => { if (nm.startsWith(c)) s += 5; });
    return { m, s }; }).sort((a, b) => b.s - a.s || a.m.localeCompare(b.m));
}
async function rcFetch(models) {
  const y = rcYear(), mk = rcMake(), out = [];
  for (const md of models) {
    const r = await fetch(`${NHTSA}/recalls/recallsByVehicle?make=${encodeURIComponent(mk)}&model=${encodeURIComponent(md)}&modelYear=${y}`); if (!r.ok) throw new Error("NHTSA " + r.status);
    const j = await r.json();
    (j.results || []).forEach(x => out.push({ id: x.NHTSACampaignNumber, model: md, date: x.ReportReceivedDate, component: x.Component, summary: x.Summary, consequence: x.Consequence, remedy: x.Remedy, notes: x.Notes, parkIt: !!x.parkIt, maker: x.Manufacturer }));
  }
  const seen = new Set(); return out.filter(x => x.id && !seen.has(x.id) && seen.add(x.id));
}
let RC_BUSY = false, RC_ERR = "";
async function rcRefresh(force) {
  const M = rcMeta(); if (RC_BUSY || !(M.models || []).length) return;
  if (!force && M.checkedAt && Date.now() - new Date(M.checkedAt).getTime() < RC_DAY) return;
  RC_BUSY = true; RC_ERR = "";
  try {
    const list = await rcFetch(M.models), known = new Set((M.list || []).map(x => x.id));
    const fresh = list.filter(x => !known.has(x.id)).map(x => x.id);
    if (ME.canWrite) await rcSave({ list, checkedAt: new Date().toISOString(), newIds: (M.list ? fresh : []).concat(M.newIds || []).filter((v, i, a) => a.indexOf(v) === i) }, true);
    else { M.list = list; }
  } catch (e) { RC_ERR = "Couldn't reach NHTSA just now. Check your internet and try again."; }
  RC_BUSY = false; if (["recalls", "home"].includes(R.sec)) render(false);
}
const rcState = id => (rcMeta().status || {})[id] || {};
const rcOpen = () => (rcMeta().list || []).filter(x => !["done", "na"].includes(rcState(x.id).s));

/* home page banner when a recall is open */
function recallBannerHtml() {
  const open = rcOpen(); if (!open.length) return "";
  const park = open.some(x => x.parkIt), nw = (rcMeta().newIds || []).length;
  return `<button class="rcl-banner${park ? " park" : ""}" data-go="recalls">${ic("alert")}<span><b>${open.length} open safety recall${open.length === 1 ? "" : "s"} for this bike${nw ? ` · ${nw} new` : ""}</b><small>${park ? "NHTSA says don't ride it until it's fixed. " : ""}Recall repairs are free at a dealer. Tap to see ${open.length === 1 ? "it" : "them"}.</small></span>${ic("next")}</button>`;
}
(function () {
  const h = VIEWS.home; if (!h) return; const r0 = h.render;
  h.render = function () { setTimeout(() => rcRefresh(false), 1200); return recallBannerHtml() + r0.call(this); };
})();

VIEWS.recalls = {
  render() {
    const M = rcMeta(), W = ME.canWrite, y = rcYear(), mk = rcMake(), old = +y && +y < 1981;
    if (!(M.models || []).length) {
      if (!this.cand && !this.loading && !this.err) { this.loading = true; rcModels().then(ms => { this.cand = rcRank(ms); this.loading = false; render(false); }, () => { this.err = 1; this.loading = false; render(false); }); }
      const top = (this.cand || []).filter(x => x.s > 0);
      return `${pageHead("recalls")}<div class="rcl-wrap"><section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("shield")}</span>Which model is your bike?</h2></div>
        ${!y || !mk ? `<p class="muted" style="margin:0">Add the bike's year and make in Settings first.</p>`
          : this.loading ? `<p class="muted" style="margin:0">Looking up ${esc(y + " " + mk)} models at NHTSA…</p>`
          : this.err ? `<p class="muted" style="margin:0">Couldn't reach NHTSA. Check your internet and reload the page.</p>`
          : !(this.cand || []).length ? `<p style="margin:0">NHTSA has no ${esc(y + " " + mk)} models with recalls on file.${old ? " Bikes from before 1981 usually aren't in NHTSA's online records." : ""} You can still check by VIN on <a href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener">nhtsa.gov/recalls</a>.</p>`
          : `<p class="muted" style="margin:0 0 10px">NHTSA files recalls under its own model names, often the model code. Tick the ones that are your ${esc(BIKE.name)}. ${top.length ? "The best matches are first." : ""}</p>
            <div class="rcl-cands">${this.cand.map((x, i) => `<label class="chip-chk"><input type="checkbox" value="${esc(x.m)}" ${x.s > 0 && x.s >= (this.cand[0] || {}).s && x.s > ((this.cand[1] || {}).s || 0) ? "checked" : ""} ${W ? "" : "disabled"}><span>${esc(x.m)}</span></label>`).join("")}</div>
            ${W ? `<div class="row" style="gap:8px;margin-top:12px"><button class="btn pri" id="rclGo">${ic("search")} Check for recalls</button></div>` : ""}`}
        </section>${this.vinHtml()}</div>`;
    }
    const list = M.list || [], open = rcOpen(), done = list.filter(x => rcState(x.id).s === "done"), na = list.filter(x => rcState(x.id).s === "na"), nw = new Set(M.newIds || []);
    const card = x => { const st = rcState(x.id); return `<article class="rcl-card ${st.s || "open"}${x.parkIt ? " park" : ""}">
      <div class="rcl-top"><span class="rcl-id">${esc(x.id)}</span>${nw.has(x.id) ? `<span class="rcl-new">New</span>` : ""}${x.parkIt ? `<span class="rcl-park">Don't ride until fixed</span>` : ""}<span class="grow"></span><span class="faint">${esc(x.date || "")}${(M.models || []).length > 1 ? " · " + esc(x.model) : ""}</span></div>
      <b class="rcl-comp">${esc(String(x.component || "").replace(/:/g, " · ").toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()))}</b>
      <p>${esc(x.summary || "")}</p>
      ${x.consequence ? `<p class="rcl-risk"><b>Risk:</b> ${esc(x.consequence)}</p>` : ""}${x.remedy ? `<p><b>Fix:</b> ${esc(x.remedy)}</p>` : ""}
      <div class="rcl-acts">${st.s === "done" ? `<span class="hr-yes">${ic("check")} Fixed${st.date ? " " + esc(fmtDate(st.date)) : ""}${st.by ? " by " + esc(st.by) : ""}</span>` : st.s === "na" ? `<span class="tag">Doesn't apply to this bike</span>` : `<span class="rcl-openl">Open</span>`}
        ${W ? (st.s ? `<button class="btn sm" data-rcl-reopen="${esc(x.id)}">Mark open again</button>` : `<button class="btn sm pri" data-rcl-done="${esc(x.id)}">${ic("check")} It's been fixed</button><button class="btn sm" data-rcl-na="${esc(x.id)}">Doesn't apply</button>`) : ""}</div></article>`; };
    return `${pageHead("recalls")}
      <div class="mh-stats md-stats">
        <div class="mh-stat ${open.length ? "c-red" : "c-green"}"><span class="mh-k">${ic("alert")}Open recalls</span><span class="mh-v">${open.length}</span><span class="mh-s">${open.length ? "Free repair at a dealer" : "Nothing open"}</span></div>
        <div class="mh-stat c-green"><span class="mh-k">${ic("check")}Fixed</span><span class="mh-v">${done.length}</span><span class="mh-s">marked done by you</span></div>
        <div class="mh-stat c-navy"><span class="mh-k">${ic("shield")}On file at NHTSA</span><span class="mh-v">${list.length}</span><span class="mh-s">for ${esc((M.models || []).join(", "))}</span></div>
        <div class="mh-stat c-tan"><span class="mh-k">${ic("clock")}Last checked</span><span class="mh-v rcl-sm">${M.checkedAt ? esc(fmtTime(M.checkedAt)) : "Checking…"}</span><span class="mh-s">checks again daily</span></div>
      </div>
      ${RC_ERR ? `<div class="banner warn">${esc(RC_ERR)}</div>` : ""}
      <div class="rcl-bar"><span class="faint">Recalls for ${esc(y + " " + mk)} ${esc((M.models || []).join(", "))} from NHTSA.</span><span class="grow"></span><button class="btn sm" id="rclAgain" ${RC_BUSY ? "disabled" : ""}>${RC_BUSY ? "Checking…" : "Check now"}</button>${W ? `<button class="btn sm" id="rclModel">Change model</button>` : ""}</div>
      ${list.length ? `<div class="rcl-list">${open.concat(done, na).map(card).join("")}</div>` : `<div class="md-empty"><b>No recalls on file</b><span class="muted">NHTSA has no recalls for this year, make and model. Revora checks again each day you open the bike.</span></div>`}
      ${this.vinHtml()}`;
  },
  vinHtml() { const vin = meta().frameNo; return `<section class="mh-panel rcl-vin"><div class="mh-ph"><h2><span class="mh-hi">${ic("search")}</span>Check by VIN too</h2></div><p style="margin:0">NHTSA's VIN lookup also shows whether a recall was already fixed on this exact bike. ${vin ? `Your VIN from Settings is ready to copy.` : `Add the VIN in Settings to keep it handy.`}</p>
    <div class="row" style="gap:8px;flex-wrap:wrap">${vin ? `<button class="btn sm" data-copyvin>${ic("copy")} Copy VIN</button>` : ""}<a class="btn sm" href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener">Open nhtsa.gov/recalls ${ic("next")}</a></div></section>`; },
  bind(root) {
    bindTables(root);
    const go = $("#rclGo", root); if (go) go.onclick = async () => { const ms = [...root.querySelectorAll(".rcl-cands input:checked")].map(x => x.value); if (!ms.length) { toast("Tick at least one model.", "err"); return; } go.disabled = true; this.cand = null; await rcSave({ models: ms, list: null, checkedAt: "", newIds: [] }, true); await rcRefresh(true); render(false); };
    const ag = $("#rclAgain", root); if (ag) ag.onclick = () => { rcRefresh(true); render(false); };
    const mo = $("#rclModel", root); if (mo) mo.onclick = () => { this.cand = null; this.err = 0; rcSave({ models: [] }); };
    const now = () => new Date().toISOString().slice(0, 10);
    $$("[data-rcl-done]", root).forEach(b => b.onclick = () => modal(`<h3>Recall ${esc(b.dataset.rclDone)} fixed</h3><div class="form"><label>Date fixed<input type="date" id="rclD" value="${now()}"></label><label>Dealer (optional)<input id="rclBy" placeholder="e.g. Cycle World of Lakewood"></label></div><div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>Save</button></div>`, m => {
      m.querySelector("[data-x]").onclick = closeModal;
      m.querySelector("[data-ok]").onclick = async () => { const st = Object.assign({}, rcMeta().status || {}); st[b.dataset.rclDone] = { s: "done", date: m.querySelector("#rclD").value, by: m.querySelector("#rclBy").value.trim().slice(0, 80) }; closeModal(); await rcSave({ status: st, newIds: (rcMeta().newIds || []).filter(x => x !== b.dataset.rclDone) }); toast("Marked fixed."); };
    }));
    $$("[data-rcl-na]", root).forEach(b => b.onclick = async () => { const st = Object.assign({}, rcMeta().status || {}); st[b.dataset.rclNa] = { s: "na" }; await rcSave({ status: st, newIds: (rcMeta().newIds || []).filter(x => x !== b.dataset.rclNa) }); });
    $$("[data-rcl-reopen]", root).forEach(b => b.onclick = async () => { const st = Object.assign({}, rcMeta().status || {}); delete st[b.dataset.rclReopen]; await rcSave({ status: st }); });
    const cv = $("[data-copyvin]", root); if (cv) cv.onclick = async () => { try { await navigator.clipboard.writeText(meta().frameNo); toast("VIN copied."); } catch (e) { toast(meta().frameNo); } };
    if ((rcMeta().models || []).length && !rcMeta().checkedAt) rcRefresh(true);
    if (R.sec === "recalls" && (rcMeta().newIds || []).length && ME.canWrite) setTimeout(() => rcSave({ newIds: [] }, true), 4000);
  }
};
