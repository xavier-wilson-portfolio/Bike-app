/* ============ Fuel & costs: fuel log with miles per gallon, and what the bike really costs to own ============ */
GUIDE.costs = { eyebrow: "Money", title: "Fuel & cost of ownership", sub: "Fill-ups and miles per gallon, and everything the bike costs you: fuel, upkeep, mods, insurance and registration.",
  how: ["Add a fill-up at the pump: odometer, gallons and what you paid. It takes ten seconds.", "Miles per gallon is worked out between full tanks.", "Costs pull in services, mods, parts and papers you've already logged, so nothing gets typed twice."] };
const ppgOf = r => n(r.ppg) || (n(r.total) && n(r.gallons) ? n(r.total) / n(r.gallons) : 0);
const fuelCost = r => n(r.total) || n(r.ppg) * n(r.gallons);
// miles per gallon between full tanks; partial fills are added to the next full tank
function mpgRuns() {
  const fs = sorted("fuel").filter(r => n(r.odometer) && n(r.gallons)).sort((a, b) => n(a.odometer) - n(b.odometer) || String(a.date).localeCompare(String(b.date)));
  const runs = []; let start = null, gal = 0;
  fs.forEach(r => {
    if (start === null) { if (r.full !== false) start = r; return; }
    gal += n(r.gallons);
    if (r.full !== false) { const miles = n(r.odometer) - n(start.odometer); if (miles > 0 && gal > 0) runs.push({ id: r.id, date: r.date, miles, gallons: gal, mpg: miles / gal }); start = r; gal = 0; }
  });
  return runs;
}
// what was spent in a date range, by category
function ownCosts(from, to) {
  const inR = d => d && (!from || d >= from) && (!to || d <= to);
  const fuel = sorted("fuel").filter(r => inR(r.date)).reduce((s, r) => s + fuelCost(r), 0);
  const upkeep = svcDone().filter(r => inR(r.date)).reduce((s, r) => s + svcCost(r), 0);
  const mods = typeof modsInstalled === "function" ? modsInstalled().filter(m => inR(m.date)).reduce((s, m) => s + modCost(m), 0) : 0;
  const parts = sorted("expenses").filter(e => e.status === "Paid" && inR(e.date)).reduce((s, e) => s + n(e.amount), 0);
  // papers: a monthly cost counts each month inside the range; a per-term or one-time cost counts on its start date
  let papers = 0; const pf = from || "1900-01-01", pt = to || today();
  sorted("papers").forEach(p => { const c = n(p.cost); if (!c) return;
    if (p.billing === "Monthly") { const s = p.start || pf, e = p.expires && p.expires < pt ? p.expires : pt; let d = s; let k = 0; while (d <= e && k < 600) { if (d >= pf) papers += c; d = addMonths(d, 1); k++; } }
    else if (inR(p.start || p.expires)) papers += c; });
  const cats = [["Fuel", fuel, "#2C5F7C"], ["Upkeep", upkeep, "#B8954F"], ["Insurance & papers", papers, "#17232C"], ["Mods", mods, "#3E7A55"], ["Parts & restoration", parts, "#7A8A96"]];
  return { fuel, upkeep, mods, parts, papers, total: fuel + upkeep + mods + parts + papers, cats };
}
function milesIn(from, to) {
  const pts = sorted("mileage").map(r => ({ d: r.date, m: n(r.miles) })).concat(svcDone().map(r => ({ d: r.date, m: n(r.odometer) })), sorted("fuel").map(r => ({ d: r.date, m: n(r.odometer) })))
    .filter(p => p.d && p.m && (!from || p.d >= from) && (!to || p.d <= to)).map(p => p.m);
  return pts.length > 1 ? Math.max(...pts) - Math.min(...pts) : 0;
}
function addFillUp() {
  const od = odoNow(), last = sorted("fuel").sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  modal(`<h2 style="margin:0">Add a fill-up</h2><p class="hint-text" style="margin:2px 0 12px">Odometer, gallons and what you paid. Price per gallon works itself out.</p>
    <div class="form"><label>Odometer (miles)<input id="fuOdo" type="number" inputmode="numeric" min="0" value="${od ? Math.round(od.miles) : ""}" autofocus></label><label>Gallons<input id="fuGal" type="number" inputmode="decimal" min="0" step="0.001" placeholder="4.2"></label>
      <label>Total paid<input id="fuTot" type="number" inputmode="decimal" min="0" step="0.01" placeholder="16.80"></label><label>Date<input id="fuDate" type="date" value="${today()}"></label>
      <label>Fuel<select id="fuOct">${SCHEMA.fuel.fields.find(f => f.k === "octane").opts.map(o => `<option ${last && last.octane === o ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></label><label>Station (optional)<input id="fuSt" value="${esc(last ? last.station || "" : "")}"></label>
      <label class="chk full"><input type="checkbox" id="fuFull" checked> Filled to full</label></div>
    <div class="fu-calc" id="fuCalc"></div>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>Save fill-up</button></div>`, m => {
    const v = s => m.querySelector(s).value, calc = () => { const g = n(v("#fuGal")), t = n(v("#fuTot")); m.querySelector("#fuCalc").textContent = g && t ? `$${(t / g).toFixed(3)} a gallon` : ""; };
    ["#fuGal", "#fuTot"].forEach(s => m.querySelector(s).addEventListener("input", calc));
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelector("[data-ok]").onclick = async () => {
      const odo = n(v("#fuOdo")), g = n(v("#fuGal")), t = n(v("#fuTot"));
      if (!odo) { toast("Add the odometer reading.", "err"); return; } if (!g) { toast("Add the gallons.", "err"); return; }
      if (od && odo < od.miles - 1 && !confirm(`That's lower than the last reading (${milesFmt(od.miles)} mi). Save anyway?`)) return;
      closeModal();
      await store.put("fuel", blank("fuel", { date: v("#fuDate") || today(), odometer: odo, gallons: g, total: t, ppg: g && t ? Math.round(t / g * 1000) / 1000 : 0, full: m.querySelector("#fuFull").checked, octane: v("#fuOct"), station: v("#fuSt").trim() }), { action: "added a fill-up" });
      const runs = mpgRuns(), lastRun = runs[runs.length - 1];
      toast(lastRun && lastRun.id && S.fuel[lastRun.id] && S.fuel[lastRun.id].odometer === odo ? `Saved. ${lastRun.mpg.toFixed(1)} mpg on that tank.` : "Fill-up saved.");
    };
  });
}

VIEWS.costs = {
  render() {
    const W = ME.canWrite, per = R.f.costPer || "12m", t = today(), y = t.slice(0, 4);
    const from = per === "year" ? y + "-01-01" : per === "12m" ? addMonths(t, -12) : "", label = { year: "This year", "12m": "Last 12 months", all: "All time" }[per];
    const c = ownCosts(from, t), miles = milesIn(from, t), runs = mpgRuns(), fs = sorted("fuel").sort((a, b) => String(b.date).localeCompare(String(a.date)) || n(b.odometer) - n(a.odometer));
    const avg = runs.length ? runs.reduce((s, r) => s + r.miles, 0) / runs.reduce((s, r) => s + r.gallons, 0) : 0, lastR = runs[runs.length - 1];
    const months = per === "all" ? Math.max(1, (() => { const ds = fs.map(f => f.date).concat(svcDone().map(r => r.date)).filter(Boolean).sort(); return ds.length ? Math.ceil(daysBetween(ds[0], t) / 30.4) : 1; })()) : per === "year" ? Math.max(1, +t.slice(5, 7)) : 12;
    const ppgs = fs.slice(0, 10).map(ppgOf).filter(Boolean), ppgAvg = ppgs.length ? ppgs.reduce((a, b) => a + b, 0) / ppgs.length : 0;
    // monthly bars for the last 12 months
    const ms = Array.from({ length: 12 }, (_, i) => addMonths(t.slice(0, 7) + "-01", i - 11).slice(0, 7));
    const mv = ms.map(mo => { const end = addMonths(mo + "-01", 1); const x = ownCosts(mo + "-01", addDays(end, -1)); return { mo, x }; }), mmax = Math.max(1, ...mv.map(v => v.x.total));
    const bars = `<div class="co-bars" role="img" aria-label="Spending per month, last 12 months">${mv.map(({ mo, x }) => `<div class="co-col" title="${esc(mo)}: ${money(x.total)}"><div class="co-stack" style="height:${(x.total / mmax * 100).toFixed(1)}%">${x.cats.filter(k => k[1] > 0).map(k => `<i style="flex:${k[1]};background:${k[2]}"></i>`).join("")}</div><span>${new Date(mo + "-15T12:00:00").toLocaleDateString("en-US", { month: "short" }).slice(0, 3)}</span></div>`).join("")}</div>`;
    const spark = runs.length > 1 ? (() => { const r = runs.slice(-12), lo = Math.min(...r.map(x => x.mpg)), hi = Math.max(...r.map(x => x.mpg), lo + 1), W2 = 260, H = 60;
      const pts = r.map((x, i) => `${(i / (r.length - 1) * W2).toFixed(1)},${(H - 6 - (x.mpg - lo) / (hi - lo) * (H - 14)).toFixed(1)}`).join(" ");
      return `<svg class="co-spark" viewBox="0 0 ${W2} ${H}" role="img" aria-label="Miles per gallon on the last ${r.length} tanks, from ${lo.toFixed(1)} to ${hi.toFixed(1)}"><polyline points="${pts}"/></svg>`; })() : "";
    const stat = (cls, k, v, s) => `<div class="mh-stat ${cls}"><span class="mh-k">${k}</span><span class="mh-v">${v}</span><span class="mh-s">${s}</span></div>`;
    return `<div class="ph" data-own="1"><div class="eyebrow">Money</div><h1>Fuel & cost of ownership</h1><p>Fill-ups and miles per gallon, and everything the bike costs you to own.</p>
        <div class="act">${W ? `<button class="btn pri" id="coFill">${ic("fuel")} Add a fill-up</button>` : ""}</div></div>
      <div class="co-per seg">${[["year", "This year"], ["12m", "Last 12 months"], ["all", "All time"]].map(([k, l]) => `<button class="${per === k ? "on" : ""}" data-per="${k}">${l}</button>`).join("")}</div>
      <div class="mh-stats md-stats">
        ${stat("c-navy", ic("dollar") + "Cost to own", money(c.total), label.toLowerCase())}
        ${stat("c-tan", ic("gauge") + "Per mile", miles ? "$" + (c.total / miles).toFixed(2) : "—", miles ? milesFmt(miles) + " mi ridden" : "Log the odometer to see this")}
        ${stat("c-blue", ic("calendar") + "Per month", money(c.total / months), "averaged over " + months + " month" + (months === 1 ? "" : "s"))}
        ${stat("c-green", ic("fuel") + "Miles per gallon", avg ? avg.toFixed(1) : "—", lastR ? "last tank " + lastR.mpg.toFixed(1) : "needs two full tanks")}
      </div>
      <div class="co-grid">
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("dollar")}</span>Where the money goes</h2><span class="faint">${esc(label)}</span></div>
          ${c.total ? hbars(c.cats.filter(k => k[1] > 0).sort((a, b) => b[1] - a[1]).map(([l, v, col]) => ({ label: l, segs: [{ v, color: col, name: l }], right: money(v) + " · " + Math.round(v / c.total * 100) + "%" })), { money: true, lw: 150, aria: "Cost of ownership by category" })
            : `<p class="muted" style="margin:0">Nothing spent in this period yet. Fill-ups, services, mods, parts and papers all count here.</p>`}
          <div class="co-links"><button class="linkbtn" data-go="maintenance">Upkeep</button><button class="linkbtn" data-go="mods">Mods</button><button class="linkbtn" data-go="papers">Insurance & papers</button><button class="linkbtn" data-go="budget">Parts</button></div>
        </section>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("calendar")}</span>Month by month</h2><span class="faint">last 12 months</span></div>${bars}
          ${legend(c.cats.map(k => [k[2], k[0]]))}</section>
      </div>
      <section class="mh-panel co-fuel"><div class="mh-ph"><h2><span class="mh-hi">${ic("fuel")}</span>Fuel log</h2>${fs.length ? `<button class="linkbtn" id="coCsv">${ic("download")} CSV</button>` : ""}</div>
        ${fs.length ? `<div class="co-fstats"><div><b>${avg ? avg.toFixed(1) : "—"}</b><span>average mpg</span></div><div><b>${runs.length ? Math.max(...runs.map(r => r.mpg)).toFixed(1) : "—"}</b><span>best tank</span></div><div><b>${ppgAvg ? "$" + ppgAvg.toFixed(2) : "—"}</b><span>average a gallon</span></div><div><b>${money(c.fuel)}</b><span>on fuel, ${esc(label.toLowerCase())}</span></div>${spark ? `<div class="co-sp">${spark}<span>mpg, last ${Math.min(12, runs.length)} tanks</span></div>` : ""}</div>` + table("fuel-log", fs.map(f => ({ ...f, _mpg: (runs.find(r => r.id === f.id) || {}).mpg })), [
          { k: "date", label: "Date", get: r => fmtDate(r.date), sort: r => r.date }, { k: "odometer", label: "Odometer", get: r => milesFmt(r.odometer), cls: "r", sort: r => n(r.odometer) },
          { k: "gallons", label: "Gallons", get: r => n(r.gallons).toFixed(2), cls: "r", sort: r => n(r.gallons) }, { k: "total", label: "Paid", get: r => fuelCost(r) ? money2(fuelCost(r)) : "—", cls: "r", sort: r => fuelCost(r) },
          { k: "ppg", label: "Per gallon", get: r => ppgOf(r) ? "$" + ppgOf(r).toFixed(3) : "—", cls: "r", sort: r => ppgOf(r) },
          { k: "mpg", label: "MPG", get: r => r._mpg ? `<b>${r._mpg.toFixed(1)}</b>` : r.full === false ? `<span class="faint">partial</span>` : `<span class="faint">—</span>`, cls: "r", sort: r => r._mpg || 0 },
          { k: "station", label: "Station", cls: "wrap" }], { coll: "fuel" })
          : `<div class="mh-empty"><b>No fill-ups yet</b><span class="muted">Add one next time you're at the pump. Two full tanks and you'll see your miles per gallon.</span>${W ? `<button class="btn pri" id="coFill2">${ic("fuel")} Add a fill-up</button>` : ""}</div>`}
      </section>`;
  },
  bind(root) {
    bindTables(root);
    $$("[data-per]", root).forEach(b => b.onclick = () => { R.f.costPer = b.dataset.per; render(false); });
    ["#coFill", "#coFill2"].forEach(s => { const b = $(s, root); if (b) b.onclick = addFillUp; });
    const csv = $("#coCsv", root); if (csv) csv.onclick = () => { const runs = mpgRuns(); saveFile("revora-fuel-" + today() + ".csv", csvOf(sorted("fuel").map(f => ({ ...f, total: fuelCost(f), ppg: ppgOf(f).toFixed(3), mpg: ((runs.find(r => r.id === f.id) || {}).mpg || 0).toFixed(1) })), ["date", "odometer", "gallons", "total", "ppg", "mpg", "full", "octane", "station", "notes"].map(k => ({ k, label: k }))), "text/csv"); };
  }
};
