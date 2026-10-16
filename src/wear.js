/* ============ Tire & chain wear: readings over time, a photo of each, and when it'll need replacing ============ */
GUIDE.wear = { eyebrow: "Keep it running", title: "Tire & chain wear", sub: "Track tread depth and chain wear over time, with photos, and see roughly when each needs replacing.",
  how: ["When a new tire or chain goes on, press New one fitted so Revora knows where it started.", "Every few weeks, add a reading: tread depth from a gauge, or chain wear from a chain wear gauge. Add a photo if you like.", "From your readings and riding pace, Revora estimates the miles and the date left. Always go by the wear bars and the manual."] };
const WEAR_ITEMS = () => [["Front tire", "wheel", "tire"], ["Rear tire", "wheel", "tire"]].concat(typeof hasChain === "function" && hasChain() ? [["Chain", "wrench", "chain"]] : []);
const wSet = () => Object.assign({ unit: "32nds" }, meta().wear || {});
const wCfg = item => Object.assign(item === "Chain" ? { newVal: 0, limit: 1.5 } : wSet().unit === "mm" ? { newVal: 6, limit: 1.6 } : { newVal: 8, limit: 2 }, (wSet().items || {})[item] || {});
const wUnit = item => item === "Chain" ? "%" : wSet().unit === "mm" ? "mm" : "/32\"";
const wFmt = (item, v) => v == null || v === "" ? "—" : item === "Chain" ? (+v).toFixed(1) + "%" : wSet().unit === "mm" ? (+v).toFixed(1) + " mm" : (+v).toFixed(1).replace(/\.0$/, "") + "/32\"";
async function wSave(patch) { const m = clone(meta()); m.wear = Object.assign({}, m.wear || {}, patch); await store.put("meta", m, { noLog: true }); }
// readings since the last "new one fitted", oldest first
function wRuns(item) {
  const all = sorted("wear").filter(r => r.item === item).sort((a, b) => String(a.date).localeCompare(String(b.date)) || n(a.odometer) - n(b.odometer));
  const lastNew = all.map(r => r.kind).lastIndexOf("New one fitted"); return { since: lastNew >= 0 ? all[lastNew] : null, reads: lastNew >= 0 ? all.slice(lastNew) : all };
}
function wForecast(item) {
  const cfg = wCfg(item), { since, reads } = wRuns(item), pts = reads.filter(r => r.value !== "" && r.value != null && n(r.odometer));
  const cur = pts.length ? n(pts[pts.length - 1].value) : since ? n(since.value) : null, chain = item === "Chain";
  if (cur == null) return { cur: null, left: null };
  const span = chain ? cfg.limit : (n(since && since.value) || cfg.newVal) - cfg.limit, used = chain ? cur : (n(since && since.value) || cfg.newVal) - cur;
  const frac = span > 0 ? Math.max(0, Math.min(1, used / span)) : 0;
  let perMile = null;
  if (pts.length >= 2) { const a = pts[0], b = pts[pts.length - 1], dm = n(b.odometer) - n(a.odometer), dv = chain ? n(b.value) - n(a.value) : n(a.value) - n(b.value); if (dm > 50 && dv > 0) perMile = dv / dm; }
  const remain = chain ? cfg.limit - cur : cur - cfg.limit, milesLeft = perMile ? Math.max(0, remain / perMile) : null;
  let date = null; const pace = typeof ridePace === "function" ? ridePace() : null;
  if (milesLeft != null && pace && pace.perDay) date = addDays(today(), Math.round(milesLeft / pace.perDay));
  const status = remain <= 0 ? "over" : frac >= .8 ? "soon" : "ok";
  return { cur, frac, milesLeft, date, status, last: pts[pts.length - 1] || since, since, perMile, cfg };
}
function wPhotoPick(cb) { const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.setAttribute("capture", "environment"); inp.onchange = async () => { const f = inp.files && inp.files[0]; if (!f) return; try { cb(await compressImage(f, 240000), f.name); } catch (e) { toast("Couldn't read that photo.", "err"); } }; inp.click(); }
function wReading(item, fitted) {
  const od = odoNow(), cfg = wCfg(item), chain = item === "Chain"; let photo = null, pname = "";
  modal(`<h2 style="margin:0">${fitted ? "New " + esc(item.toLowerCase()) + " fitted" : esc(item) + " reading"}</h2>
    <p class="hint-text" style="margin:2px 0 12px">${fitted ? (chain ? "A new chain starts at 0% worn." : "Measure the new tire's tread depth, or use the depth the maker lists.") : chain ? "Use a chain wear gauge, or measure over the length the manual gives and work out the percent." : "Measure in the main grooves near the center, where it wears fastest."}</p>
    <div class="form"><label>${chain ? "Wear (%)" : "Tread depth (" + (wSet().unit === "mm" ? "mm" : "32nds of an inch") + ")"}<input id="wV" type="number" inputmode="decimal" min="0" step="${chain ? 0.1 : wSet().unit === "mm" ? 0.1 : 0.5}" value="${fitted ? (chain ? 0 : cfg.newVal) : ""}" autofocus></label>
      <label>Odometer (miles)<input id="wO" type="number" min="0" value="${od ? Math.round(od.miles) : ""}"></label><label>Date<input id="wD" type="date" value="${today()}"></label>
      ${fitted ? `<label>${chain ? "Replace at (%)" : "Replace at"}<input id="wL" type="number" min="0" step="0.1" value="${cfg.limit}"></label>` : ""}
      <label class="full">Notes (optional)<input id="wN" placeholder="${fitted ? "Brand and model, where you bought it" : "Anything you noticed"}"></label></div>
    <div class="row" style="gap:10px;align-items:center;margin-top:10px"><button class="btn sm" id="wP">${ic("camera")} Add a photo</button><span class="faint" id="wPs"></span></div>
    ${fitted ? `<label class="chk" style="margin-top:8px"><input type="checkbox" id="wLog" checked> Also log it in the Maintenance log</label>` : ""}
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>Save</button></div>`, m => {
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelector("#wP").onclick = () => wPhotoPick((d, nm) => { photo = d; pname = nm; m.querySelector("#wPs").innerHTML = `<img src="${d}" alt="" style="height:38px;border-radius:6px;vertical-align:middle"> Photo added`; });
    m.querySelector("[data-ok]").onclick = async () => {
      const v = m.querySelector("#wV").value; if (v === "") { toast("Add the reading.", "err"); return; }
      const odo = n(m.querySelector("#wO").value), date = m.querySelector("#wD").value || today(), notes = m.querySelector("#wN").value.trim();
      closeModal();
      let docId = ""; if (photo) { const d = blank("docs", { title: item + (fitted ? " fitted" : " wear") + " " + fmtDate(date), kind: "Inspection evidence", date, file: photo, fileName: pname || "wear.jpg", folder: "Wear", tags: "wear " + item.toLowerCase() }); await store.put("docs", d, { noLog: true }); docId = d.id; }
      await store.put("wear", blank("wear", { item, date, odometer: odo, value: n(v), kind: fitted ? "New one fitted" : "Reading", docId, notes }), { action: (fitted ? "fitted a new " : "added a wear reading for the ") + item.toLowerCase() });
      if (fitted) { const its = Object.assign({}, wSet().items || {}); its[item] = Object.assign({}, its[item] || {}, { newVal: chain ? 0 : n(v), limit: n(m.querySelector("#wL").value) || wCfg(item).limit }); await wSave({ items: its });
        if (m.querySelector("#wLog") && m.querySelector("#wLog").checked) await store.put("maintenance", blank("maintenance", { service: "New " + item.toLowerCase(), date, odometer: odo, kind: item === "Chain" ? "Repair" : "Tires", notes }), { noLog: true }); }
      const fc = wForecast(item); toast(fc.milesLeft != null ? `Saved. About ${milesFmt(fc.milesLeft)} miles left on it.` : "Saved.");
    };
  });
}
VIEWS.wear = {
  render() {
    const W = ME.canWrite, items = WEAR_ITEMS();
    const card = ([item, icn]) => { const f = wForecast(item), { reads, since } = wRuns(item), pts = reads.filter(r => r.value !== "" && n(r.odometer) >= 0);
      const col = f.status === "over" ? "red" : f.status === "soon" ? "amber" : "green";
      const spark = pts.length > 1 ? (() => { const vs = pts.map(r => n(r.value)), lo = Math.min(...vs, item === "Chain" ? 0 : f.cfg.limit), hi = Math.max(...vs, item === "Chain" ? f.cfg.limit : 0, lo + .1), W2 = 240, H = 54;
        const P = pts.map((r, i) => `${(i / (pts.length - 1) * W2).toFixed(1)},${(H - 4 - (n(r.value) - lo) / (hi - lo) * (H - 10)).toFixed(1)}`).join(" "), ly = (H - 4 - (f.cfg.limit - lo) / (hi - lo) * (H - 10)).toFixed(1);
        return `<svg class="wr-spark" viewBox="0 0 ${W2} ${H}" role="img" aria-label="${esc(item)} readings over time"><line x1="0" x2="${W2}" y1="${ly}" y2="${ly}" class="lim"/><polyline points="${P}"/></svg>`; })() : "";
      return `<section class="mh-panel wr-card ${f.cur == null ? "" : col}"><div class="mh-ph"><h2><span class="mh-hi">${ic(icn)}</span>${esc(item)}</h2>${f.cur != null ? pill(col, f.status === "over" ? "Replace it" : f.status === "soon" ? "Getting close" : "Good") : ""}</div>
        ${f.cur == null ? `<p class="muted" style="margin:0">No readings yet. Start with ${since ? "a reading" : "New one fitted if it's new, or add today's reading"}.</p>`
          : `<div class="wr-now"><b>${wFmt(item, f.cur)}</b><span>${item === "Chain" ? "worn" : "tread left"} · replace at ${wFmt(item, f.cfg.limit)}</span></div>
            <div class="wr-bar" role="img" aria-label="${Math.round(f.frac * 100)}% of its life used"><i style="width:${(f.frac * 100).toFixed(0)}%"></i></div>
            <div class="wr-est">${f.milesLeft != null ? `<div><b>${milesFmt(f.milesLeft)}</b><span>miles left, roughly</span></div>${f.date ? `<div><b>${esc(fmtDate(f.date))}</b><span>at your riding pace</span></div>` : ""}` : `<div><span class="muted">Add another reading a few hundred miles from now to see miles left.</span></div>`}</div>
            ${spark}`}
        ${since ? `<div class="faint" style="font-size:12.5px">Fitted ${esc(fmtDate(since.date))}${n(since.odometer) ? " at " + milesFmt(since.odometer) + " mi" : ""}${since.notes ? " · " + esc(since.notes) : ""}</div>` : ""}
        ${reads.length ? `<div class="wr-reads">${reads.slice(-5).reverse().map(r => `<div class="wr-r"><span>${esc(fmtDate(r.date))}${n(r.odometer) ? " · " + milesFmt(r.odometer) + " mi" : ""}</span><b>${r.kind === "New one fitted" ? "New, " : ""}${wFmt(item, r.value)}</b>${r.docId && S.docs[r.docId] ? `<button class="wr-ph" data-wr-doc="${esc(r.docId)}" aria-label="See photo"><img src="${S.docs[r.docId].file}" alt=""></button>` : ""}</div>`).join("")}</div>` : ""}
        ${W ? `<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:auto"><button class="btn sm pri" data-wr-read="${esc(item)}">${ic("plus")} Add a reading</button><button class="btn sm" data-wr-new="${esc(item)}">New one fitted</button></div>` : ""}</section>`; };
    return `<div class="ph" data-own="1"><div class="eyebrow">Keep it running</div><h1>Tire & chain wear</h1><p>Tread depth and chain wear over time, with photos, and roughly when each needs replacing.</p></div>
      <div class="wr-grid">${items.map(card).join("")}</div>
      <div class="wr-foot"><label>Tread depth in <select id="wrUnit" ${ME.canWrite ? "" : "disabled"}><option value="32nds" ${wSet().unit !== "mm" ? "selected" : ""}>32nds of an inch</option><option value="mm" ${wSet().unit === "mm" ? "selected" : ""}>millimeters</option></select></label>
        <span class="faint">Estimates assume you keep wearing at the same rate. Replace any tire at its wear bars, with cracks or damage, or when it's old, whatever the numbers say.</span></div>`;
  },
  bind(root) {
    bindTables(root);
    $$("[data-wr-read]", root).forEach(b => b.onclick = () => wReading(b.dataset.wrRead, false));
    $$("[data-wr-new]", root).forEach(b => b.onclick = () => wReading(b.dataset.wrNew, true));
    $$("[data-wr-doc]", root).forEach(b => b.onclick = () => { const d = S.docs[b.dataset.wrDoc]; modal(`<div class="pp-view"><img src="${d.file}" alt="${esc(d.title)}"></div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn pri" data-x>Done</button></div>`, m => m.querySelector("[data-x]").onclick = closeModal); });
    const u = $("#wrUnit", root); if (u) u.onchange = () => wSave({ unit: u.value });
  }
};
