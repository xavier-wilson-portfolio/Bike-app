/* ============ Bike history report: build it from the records, print it, share a read-only link ============ */
GUIDE.report = { eyebrow: "Records", title: "Bike history report", sub: "A clean report of the bike's history for a buyer, a shop or your own files.",
  how: ["Pick what goes in, like costs or the VIN.", "Print it or save it as a PDF.", "Or make a share link. Anyone with the link sees a read-only copy, and you can update or stop it any time."] };
const REP_OPTS = () => Object.assign({ costs: true, vin: "last6", photo: true, mods: true, restoration: true, name: false }, meta().reportOpts || {});

function reportData(o) {
  const m = meta(), done = svcDone().sort((a, b) => String(b.date).localeCompare(String(a.date)) || n(b.odometer) - n(a.odometer)), od = odoNow();
  const vin = String(m.frameNo || "").trim(), vinOut = !vin || o.vin === "none" ? "" : o.vin === "full" ? vin : vin.length > 6 ? "…" + vin.slice(-6) : vin;
  const by = r => r.doneBy === "A shop" ? (r.shop || "A shop") : r.doneBy === "A friend" ? (r.shop || "A friend") : "Owner";
  const services = done.map(r => ({ date: r.date, miles: n(r.odometer) || 0, service: r.service, kind: r.kind || "", by: by(r), cost: o.costs ? svcCost(r) : 0,
    parts: String(r.partsUsed || "").split(/\n+/).map(x => x.trim()).filter(Boolean).slice(0, 6), receipt: !!(r.receipt || r.receiptDoc) }));
  const states = sorted("schedule").map(it => svcState(it, od)).sort((a, b) => SVC_RANK[a.status] - SVC_RANK[b.status]);
  // odometer: readings plus mileage on services, one point per day (highest)
  const pts = {}; sorted("mileage").map(r => ({ date: r.date, miles: n(r.miles) })).concat(done.filter(r => n(r.odometer)).map(r => ({ date: r.date, miles: n(r.odometer) })))
    .forEach(p => { if (p.date && p.miles && (!pts[p.date] || p.miles > pts[p.date])) pts[p.date] = p.miles; });
  const odometer = Object.entries(pts).map(([date, miles]) => ({ date, miles })).sort((a, b) => a.date.localeCompare(b.date));
  const odoSteady = odometer.every((p, i) => !i || p.miles >= odometer[i - 1].miles);
  const mods = o.mods && typeof modsInstalled === "function" ? modsInstalled().sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).map(x => ({ name: x.name, brand: x.brand, partNo: x.partNo, date: x.date, miles: n(x.odometer), replaced: x.replaced, stockKept: x.stockKept, cost: o.costs ? modCost(x) : 0 })) : [];
  let restoration = null;
  if (o.restoration && !GENERIC && sorted("phases").length && sorted("tasks").length) {
    const ts = sorted("tasks").filter(t => t.status !== "Cancelled"), chk = sorted("checks");
    restoration = { pct: Math.round(overallProgress() * 100), done: ts.filter(tasksDone).length, total: ts.length,
      parts: sorted("phases").map(p => { const st = phaseStats(p); return { title: (LESSONS[p.id] && LESSONS[p.id].title) || p.name, done: st.done, total: st.total }; }),
      checksPassed: chk.filter(c => c.result === "Pass" || c.result === "N/A").length, checksTotal: chk.length, roadReady: !!m.roadReady && !roadReadyBlockers().length, roadReadyDate: m.roadReadyDate || "" };
  }
  // how much a buyer can trust the records
  const span = odometer.length > 1 ? daysBetween(odometer[0].date, odometer[odometer.length - 1].date) : 0;
  const withRcpt = done.filter(r => r.receipt || r.receiptDoc).length, overdue = states.filter(x => x.status === "over").length;
  const lastDate = done[0] ? done[0].date : "", recent = lastDate && daysBetween(lastDate, today()) <= 365;
  const why = [
    { ok: done.length >= 5, pts: Math.min(25, done.length * 5), t: done.length ? `${done.length} service${done.length === 1 ? "" : "s"} logged` : "No services logged yet" },
    { ok: done.length > 0 && withRcpt / done.length >= .5, pts: done.length ? Math.round(20 * withRcpt / done.length) : 0, t: done.length ? `Receipts on ${withRcpt} of ${done.length} services` : "No receipts on file" },
    { ok: odometer.length >= 3 && span >= 180, pts: (odometer.length >= 3 ? 10 : odometer.length * 3) + (span >= 180 ? 10 : 0), t: odometer.length ? `${odometer.length} odometer reading${odometer.length === 1 ? "" : "s"}${span ? " over " + (span >= 60 ? Math.round(span / 30) + " months" : span + " days") : ""}` : "No odometer readings" },
    { ok: odometer.length > 1 && odoSteady, pts: odometer.length > 1 && odoSteady ? 5 : 0, t: odometer.length > 1 ? (odoSteady ? "Odometer readings only go up" : "An odometer reading goes backwards") : "Not enough readings to check the odometer" },
    { ok: states.length > 0 && !overdue, pts: states.length ? (overdue ? Math.max(0, 15 - overdue * 5) : 15) : 0, t: !states.length ? "No service schedule set up" : overdue ? `${overdue} service${overdue === 1 ? " is" : "s are"} overdue` : "Nothing overdue on the schedule" },
    { ok: !!recent, pts: recent ? 15 : lastDate ? 5 : 0, t: lastDate ? `Last service ${fmtDate(lastDate)}` : "No recent service" }];
  const score = Math.min(100, why.reduce((s2, w) => s2 + w.pts, 0));
  const strength = { score, label: score >= 75 ? "Strong" : score >= 45 ? "Good" : score >= 20 ? "Thin" : "Just started", tone: score >= 75 ? "hi" : score >= 45 ? "mid" : "lo", why: why.map(w => ({ ok: w.ok, t: w.t })) };
  const photoDoc = o.photo && typeof heroPhotoDoc === "function" ? heroPhotoDoc() : null;
  const sil = silImg(BIKE.silhouette || "bike-" + (BIKE.style || "standard")) || "";
  const SN = { standard: "Standard", cruiser: "Cruiser", sport: "Sport", adventure: "Adventure", dualsport: "Dual-sport", touring: "Touring", cafe: "Cafe racer", scooter: "Scooter" };
  return { v: 1, made: today(), ownerName: o.name && window.RV_CLOUD ? String((RV_CLOUD.profile && RV_CLOUD.profile.display_name) || "").split(/\s+/)[0] : "",
    bike: { name: m.bike || BIKE.name, styleName: SN[BIKE.style] || BIKE.styleName || "", vin: vinOut, color: m.color || "", sil },
    photo: photoDoc && photoDoc.file.length < 700000 ? photoDoc.file : "",
    stats: { services: done.length, maintSpend: o.costs ? done.reduce((s2, r) => s2 + svcCost(r), 0) : 0, mods: mods.length, modsSpend: mods.reduce((s2, x) => s2 + x.cost, 0), receipts: withRcpt, first: done.length ? done[done.length - 1].date : "", last: lastDate, odo: od ? od.miles : 0 },
    odometer, odoSteady, services, mods, restoration, strength, opts: { costs: !!o.costs },
    schedule: states.map(x => ({ name: x.item.name, status: x.status, last: x.last && x.last.date, lastMiles: x.last && x.last.miles, every: everyTxt(x.item) !== "—" ? everyTxt(x.item) : "" })) };
}

/* share links: a snapshot saved under a long random token; anyone with the link can read that one snapshot */
const repToken = () => { const a = new Uint8Array(18); crypto.getRandomValues(a); return Array.from(a, x => "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 56]).join(""); };
const repUrl = id => location.origin + location.pathname + "?report=" + id;
let REP_LINKS = null, REP_LINKS_ERR = "";
async function loadRepLinks() {
  if (!window.RV_CLOUD) return;
  const { data, error } = await RV_CLOUD.sb.from("shared_reports").select("id,created_at,updated_at,views,owner").eq("project_id", RV_CLOUD.projectId).order("created_at", { ascending: false });
  REP_LINKS = error ? [] : data || []; REP_LINKS_ERR = error ? (/does not exist|schema cache/i.test(error.message || "") ? "setup" : "load") : "";
  if (R.sec === "report") render(false);
}

VIEWS.report = {
  render() {
    const o = REP_OPTS(), W = ME.canWrite, d = reportData(o), cloud = !!window.RV_CLOUD;
    if (cloud && REP_LINKS === null) { REP_LINKS = []; loadRepLinks(); }
    const tog = (k, label, sub) => `<label class="rp-opt"><input type="checkbox" data-ro="${k}" ${o[k] ? "checked" : ""} ${W ? "" : "disabled"}><span><b>${label}</b>${sub ? `<small>${sub}</small>` : ""}</span></label>`;
    const mine = cloud && RV_CLOUD.user ? RV_CLOUD.user.id : "";
    return `<div class="ph" data-own="1"><div class="eyebrow">Records</div><h1>Bike history report</h1><p>A clean report of the bike's history for a buyer, a shop or your own files.</p>
        <div class="act"><button class="btn" id="rpPrint">${ic("download")} Print or save as PDF</button>${cloud && W ? `<button class="btn pri" id="rpShare">${ic("send")} Make a share link</button>` : ""}</div></div>
      <div class="rp-grid">
        <aside class="rp-side stack">
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("gear")}</span>What goes in</h2></div>
            ${tog("costs", "Costs", "What each service and mod cost")}${tog("photo", "Photo", "Your home page photo, if you've added one")}${tog("mods", "Mods", "Aftermarket parts and stock parts kept")}${!GENERIC ? tog("restoration", "Restoration progress", "Course progress and safety checks") : ""}${cloud ? tog("name", "Your first name", "Shown as who made the report") : ""}
            <label class="rp-sel"><b>VIN</b><select data-ro-vin ${W ? "" : "disabled"}>${[["none", "Leave it out"], ["last6", "Last 6 characters"], ["full", "Full VIN"]].map(([k, l]) => `<option value="${k}" ${o.vin === k ? "selected" : ""}>${l}</option>`).join("")}</select><small>${meta().frameNo ? "From Settings." : "Add the VIN in Settings to include it."}</small></label>
          </section>
          ${cloud ? `<section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("send")}</span>Share links</h2></div>
            ${REP_LINKS_ERR === "setup" ? `<p class="muted" style="margin:0">Share links need a one-time setup in the database. Print or save as a PDF for now.</p>`
              : (REP_LINKS || []).length ? `<div class="rp-links">${REP_LINKS.map(l => `<div class="rp-link"><div class="grow"><b>Made ${esc(fmtDate(String(l.created_at).slice(0, 10)))}</b><span class="faint">${l.updated_at && l.updated_at !== l.created_at ? "Updated " + esc(fmtDate(String(l.updated_at).slice(0, 10))) + " · " : ""}${n(l.views)} view${n(l.views) === 1 ? "" : "s"}</span></div>
                  <div class="rp-la"><button class="btn sm" data-rl-copy="${esc(l.id)}">${ic("copy")} Copy</button>${l.owner === mine ? `<button class="btn sm" data-rl-up="${esc(l.id)}" title="Update it to match the report as it is now">Update</button><button class="btn sm" data-rl-del="${esc(l.id)}">Stop</button>` : ""}</div></div>`).join("")}</div>`
              : `<p class="muted" style="margin:0">No links yet. A link shows a read-only copy of this report. Update it after new services, or stop it any time.</p>`}
          </section>` : `<section class="mh-panel"><p class="muted" style="margin:0">Create a free account to share this report as a link. You can still print it or save it as a PDF.</p></section>`}
        </aside>
        <div class="rp-prev" id="rpDoc">${rvReportHtml(d)}</div>
      </div>`;
  },
  bind(root) {
    const save = async patch => { const m = clone(meta()); m.reportOpts = Object.assign(REP_OPTS(), patch); await store.put("meta", m, { noLog: true }); };
    $$("[data-ro]", root).forEach(c => c.onchange = () => save({ [c.dataset.ro]: c.checked }));
    const vs = $("[data-ro-vin]", root); if (vs) vs.onchange = () => save({ vin: vs.value });
    $("#rpPrint", root).onclick = () => { document.body.classList.add("printing-hr"); window.print(); setTimeout(() => document.body.classList.remove("printing-hr"), 600); };
    const sb = window.RV_CLOUD && RV_CLOUD.sb, fail = err => toast(/does not exist|schema cache/i.test(err && err.message || "") ? "Share links aren't set up in the database yet." : "Couldn't save the link. Check your internet and try again.", "err");
    const share = $("#rpShare", root);
    if (share) share.onclick = async () => {
      if (typeof gate === "function" && !gate("rider", "share", "share links")) return;
      share.disabled = true; const id = repToken();
      const { error } = await sb.from("shared_reports").insert({ id, project_id: RV_CLOUD.projectId, title: BIKE.name, data: reportData(REP_OPTS()) });
      share.disabled = false; if (error) return fail(error);
      try { await navigator.clipboard.writeText(repUrl(id)); toast("Link made and copied. Anyone with it can see this report."); } catch (e) { toast("Link made. Use Copy to copy it."); }
      loadRepLinks();
    };
    $$("[data-rl-copy]", root).forEach(b => b.onclick = async () => { const u = repUrl(b.dataset.rlCopy); try { await navigator.clipboard.writeText(u); toast("Link copied."); } catch (e) { prompt("Copy this link:", u); } });
    $$("[data-rl-up]", root).forEach(b => b.onclick = async () => { const { error } = await sb.from("shared_reports").update({ data: reportData(REP_OPTS()), updated_at: new Date().toISOString() }).eq("id", b.dataset.rlUp); if (error) return fail(error); toast("Link updated. It now shows the report as it is today."); loadRepLinks(); });
    $$("[data-rl-del]", root).forEach(b => b.onclick = () => confirmBox("Stop this link?", "<p style='margin:0'>Anyone who opens it will see that the report isn't available.</p>", "Stop sharing", async () => { const { error } = await sb.from("shared_reports").delete().eq("id", b.dataset.rlDel); if (error) return fail(error); toast("Link stopped."); loadRepLinks(); }));
  }
};
