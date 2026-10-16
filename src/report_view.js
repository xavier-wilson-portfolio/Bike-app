/* ============ bike history report: the page itself ============
   Loaded with the loader, so the same report draws inside the app (preview, print) and on its own
   public share link (?report=<token>) without the app. It only ever receives plain data and escapes
   every value, so a shared report can't carry code. */
(function () {
  const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = v => Math.round(+v || 0).toLocaleString("en-US");
  const usd = v => "$" + (+v || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const usd2 = v => "$" + (+v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const day = s => { if (!s) return ""; const d = new Date(String(s).slice(0, 10) + "T12:00:00"); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  const safeImg = s => typeof s === "string" && (/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/.test(s) || /^img\/sil\/[a-z0-9-]+\.(svg|webp|png)$/.test(s)) ? s : "";
  const ST = { over: ["red", "Overdue"], soon: ["amber", "Due soon"], ok: ["green", "Up to date"], none: ["gray", "No start point"], nointerval: ["gray", "No interval"] };

  function odoChart(pts) {
    pts = (pts || []).filter(p => p && p.date && +p.miles > 0).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    if (pts.length < 2) return "";
    const W = 640, H = 150, P = 34, t = p => new Date(p.date + "T12:00:00").getTime(), t0 = t(pts[0]), t1 = Math.max(t(pts[pts.length - 1]), t0 + 864e5);
    const m0 = Math.min(...pts.map(p => +p.miles)), m1 = Math.max(...pts.map(p => +p.miles), m0 + 1);
    const X = p => P + (t(p) - t0) / (t1 - t0) * (W - P * 2), Y = p => H - 22 - (p.miles - m0) / (m1 - m0) * (H - 44);
    const d = pts.map((p, i) => (i ? "L" : "M") + X(p).toFixed(1) + " " + Y(p).toFixed(1)).join(" ");
    return `<svg class="hr-odo" viewBox="0 0 ${W} ${H}" role="img" aria-label="Odometer from ${num(m0)} to ${num(m1)} miles between ${e(day(pts[0].date))} and ${e(day(pts[pts.length - 1].date))}">
      <line x1="${P}" y1="${H - 22}" x2="${W - P}" y2="${H - 22}" class="ax"/>
      <path d="${d} L${X(pts[pts.length - 1]).toFixed(1)} ${H - 22} L${X(pts[0]).toFixed(1)} ${H - 22} Z" class="fill"/><path d="${d}" class="ln"/>
      ${pts.map(p => `<circle cx="${X(p).toFixed(1)}" cy="${Y(p).toFixed(1)}" r="3.5" class="pt"/>`).join("")}
      <text x="${P}" y="${H - 6}" class="lb">${e(day(pts[0].date))}</text><text x="${W - P}" y="${H - 6}" class="lb" text-anchor="end">${e(day(pts[pts.length - 1].date))}</text>
      <text x="${X(pts[0]) + 6}" y="${Y(pts[0]) - 8}" class="lb">${num(pts[0].miles)} mi</text><text x="${X(pts[pts.length - 1]) - 6}" y="${Y(pts[pts.length - 1]) - 8}" class="lb" text-anchor="end">${num(pts[pts.length - 1].miles)} mi</text></svg>`;
  }

  window.rvReportHtml = function (d, opts = {}) {
    if (!d || !d.bike) return `<div class="hr-doc"><p>This report is empty.</p></div>`;
    const b = d.bike, s = d.stats || {}, costs = d.opts ? d.opts.costs !== false : true, img = safeImg(d.photo) || safeImg(b.sil);
    const sc = d.strength || { score: 0, label: "", why: [] };
    const tile = (k, v, sub) => `<div class="hr-tile"><span>${e(k)}</span><b>${v}</b>${sub ? `<small>${e(sub)}</small>` : ""}</div>`;
    const R = d.restoration;
    return `<article class="hr-doc">
      <header class="hr-head">
        <div class="hr-head-l">
          <div class="hr-brand"><img src="img/revora-icon.svg" alt="" width="30" height="30"><span>Bike history report</span></div>
          <h1>${e(b.name)}</h1>
          <div class="hr-chips">${[b.styleName, s.odo ? num(s.odo) + " mi" : "", b.vin ? "VIN " + b.vin : "", b.color].filter(Boolean).map(x => `<span>${e(x)}</span>`).join("")}</div>
          <p>Made ${e(day(d.made))} from the owner's records${d.ownerName ? " by " + e(d.ownerName) : ""}.</p>
        </div>
        ${img ? `<div class="hr-photo${d.photo ? "" : " sil"}"><img src="${img}" alt="${e(b.name)}"></div>` : ""}
      </header>
      <section class="hr-strength hr-${e(sc.tone || "mid")}">
        <div class="hr-meter" role="img" aria-label="Record strength ${+sc.score || 0} out of 100"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="bg"/><circle cx="32" cy="32" r="26" class="fg" stroke-dasharray="163.4" stroke-dashoffset="${(163.4 * (1 - (+sc.score || 0) / 100)).toFixed(1)}"/></svg><b>${+sc.score || 0}</b></div>
        <div class="hr-sw"><span class="hr-k">Record strength</span><b>${e(sc.label)}</b><ul>${(sc.why || []).map(w => `<li class="${w.ok ? "ok" : "no"}">${w.ok ? "✓" : "–"} ${e(w.t)}</li>`).join("")}</ul></div>
      </section>
      <div class="hr-tiles">
        ${tile("Services logged", num(s.services), s.first ? "since " + day(s.first) : "")}
        ${costs ? tile("Spent on upkeep", usd(s.maintSpend), s.services ? "across every logged service" : "") : tile("Last service", s.last ? day(s.last) : "None", "")}
        ${tile("Mods fitted", num(s.mods), costs && s.modsSpend ? usd(s.modsSpend) + " invested" : "")}
        ${tile("Receipts on file", num(s.receipts), s.services ? `for ${num(s.services)} services` : "")}
      </div>
      ${(d.odometer || []).length > 1 ? `<section class="hr-sec"><h2>Odometer over time</h2>${odoChart(d.odometer)}<p class="hr-note">${d.odoSteady ? "Every reading is higher than the one before it." : "One or more readings are lower than an earlier one. Ask the owner why."}</p></section>` : ""}
      <section class="hr-sec"><h2>Service history</h2>
        ${(d.services || []).length ? `<table class="hr-tbl"><thead><tr><th>Date</th><th class="r">Miles</th><th>Work done</th><th>Done by</th>${costs ? `<th class="r">Cost</th>` : ""}<th>Receipt</th></tr></thead><tbody>
          ${d.services.map(r => `<tr><td data-l="Date">${e(day(r.date))}</td><td class="r" data-l="Miles">${r.miles ? num(r.miles) : "—"}</td><td class="hr-main"><b>${e(r.service)}</b>${r.kind && r.kind !== "Scheduled service" ? ` <span class="hr-dim">(${e(r.kind)})</span>` : ""}${(r.parts || []).length ? `<div class="hr-dim">${r.parts.map(e).join("; ")}</div>` : ""}</td><td data-l="Done by">${e(r.by)}</td>${costs ? `<td class="r" data-l="Cost">${r.cost ? usd2(r.cost) : "—"}</td>` : ""}<td data-l="Receipt">${r.receipt ? `<span class="hr-yes">On file</span>` : `<span class="hr-dim">—</span>`}</td></tr>`).join("")}</tbody></table>`
          : `<p class="hr-dim">No services logged yet.</p>`}
      </section>
      ${(d.schedule || []).length ? `<section class="hr-sec"><h2>Maintenance status</h2><div class="hr-sched">${d.schedule.map(x => { const [c, l] = ST[x.status] || ST.none; return `<div class="hr-si"><span class="hr-pill ${c}">${l}</span><b>${e(x.name)}</b><span class="hr-dim">${e([x.last ? "Last " + day(x.last) + (x.lastMiles ? " at " + num(x.lastMiles) + " mi" : "") : "", x.every ? "every " + x.every : ""].filter(Boolean).join(" · "))}</span></div>`; }).join("")}</div></section>` : ""}
      ${(d.mods || []).length ? `<section class="hr-sec"><h2>Modifications</h2><table class="hr-tbl"><thead><tr><th>Fitted</th><th>Mod</th><th>Part number</th><th>Stock part</th>${costs ? `<th class="r">Cost</th>` : ""}</tr></thead><tbody>
          ${d.mods.map(m => `<tr><td data-l="Fitted">${e(day(m.date)) || "—"}${m.miles ? `<div class="hr-dim">${num(m.miles)} mi</div>` : ""}</td><td class="hr-main"><b>${e(m.name)}</b>${m.brand ? ` <span class="hr-dim">${e(m.brand)}</span>` : ""}</td><td data-l="Part number">${m.partNo ? `<code>${e(m.partNo)}</code>` : "—"}</td><td data-l="Stock part">${m.replaced ? e(m.replaced) + (m.stockKept === "Kept" ? ` <span class="hr-yes">Kept</span>` : m.stockKept && m.stockKept !== "Not applicable" ? ` <span class="hr-dim">(${e(m.stockKept.toLowerCase())})</span>` : "") : `<span class="hr-dim">Add-on</span>`}</td>${costs ? `<td class="r" data-l="Cost">${m.cost ? usd2(m.cost) : "—"}</td>` : ""}</tr>`).join("")}</tbody></table></section>` : ""}
      ${R ? `<section class="hr-sec"><h2>Restoration</h2>
        <div class="hr-rest"><div class="hr-rbar"><i style="width:${Math.max(0, Math.min(100, +R.pct || 0))}%"></i></div><span><b>${+R.pct || 0}%</b> of the course done · ${num(R.done)} of ${num(R.total)} steps</span></div>
        <div class="hr-parts">${(R.parts || []).map(p => `<div class="hr-pt ${p.done >= p.total && p.total ? "ok" : p.done ? "mid" : ""}"><b>${e(p.title)}</b><span>${p.total ? num(p.done) + " / " + num(p.total) : "—"}</span></div>`).join("")}</div>
        <p class="hr-note">${R.roadReady ? `Marked road-ready${R.roadReadyDate ? " on " + e(day(R.roadReadyDate)) : ""}. ` : ""}Safety checks passed: ${num(R.checksPassed)} of ${num(R.checksTotal)}.</p></section>` : ""}
      <footer class="hr-foot"><p>This report is made from records the owner kept in Revora: services, receipts, odometer readings and parts. Revora hasn't inspected the bike. Have it checked by a mechanic before you buy.</p><span>revora · ${e(day(d.made))}</span></footer>
    </article>`;
  };
})();
