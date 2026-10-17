/* ============ Work order estimate / invoice: the document itself ============
   Used in the app (preview and print) and on the customer's approval link (?wo=<token>). Plain data only, every value escaped. */
(function () {
  const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const m2 = v => "$" + (+v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const day = s => { if (!s) return ""; const d = /T\d/.test(String(s)) ? new Date(s) : new Date(String(s).slice(0, 10) + "T12:00:00"); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  // totals from the lines: labor = hours x rate, parts = qty x price; supplies on labor, tax on parts (and labor if the shop taxes it)
  window.rvWoTotals = function (lines, set) {
    set = set || {}; let labor = 0, parts = 0;
    (lines || []).forEach(l => { if (l.t === "labor") labor += (+l.hours || 0) * (+l.rate || 0); else parts += (+l.qty || 0) * (+l.price || 0); });
    const supplies = labor * (+set.suppliesPct || 0) / 100, tax = (parts + (set.taxLabor ? labor : 0)) * (+set.taxPct || 0) / 100;
    const r = v => Math.round(v * 100) / 100;
    return { labor: r(labor), parts: r(parts), supplies: r(supplies), tax: r(tax), total: r(labor + parts + supplies + tax), suppliesPct: +set.suppliesPct || 0, taxPct: +set.taxPct || 0 };
  };
  window.rvWoHtml = function (d, opts = {}) {
    if (!d) return "";
    const kind = opts.kind || (d.invoice ? "invoice" : "estimate"), T = d.totals || rvWoTotals(d.lines, d.set), sh = d.shop || {}, c = d.customer || {};
    const labor = (d.lines || []).filter(l => l.t === "labor"), parts = (d.lines || []).filter(l => l.t !== "labor");
    return `<article class="wo-doc">
      <header class="wo-head"><div><b class="wo-shop">${e(sh.name || "Your shop")}</b>${[sh.address, sh.phone, sh.email].filter(Boolean).map(x => `<span>${e(x)}</span>`).join("")}</div>
        <div class="wo-num"><span>${kind === "invoice" ? "Invoice" : "Estimate"}</span><b>${e(d.number)}</b><small>${e(day(kind === "invoice" && d.invoice ? d.invoice.date : d.made))}</small></div></header>
      <div class="wo-who"><div><span>Customer</span><b>${e(c.name || "—")}</b>${[c.phone, c.email].filter(Boolean).map(x => `<small>${e(x)}</small>`).join("")}</div>
        <div><span>Bike</span><b>${e(d.bike || "")}</b>${[d.vin ? "VIN " + d.vin : "", d.odometer ? (+d.odometer).toLocaleString("en-US") + " mi in" : ""].filter(Boolean).map(x => `<small>${e(x)}</small>`).join("")}</div>
        <div><span>Dates</span>${d.dateIn ? `<small>In ${e(day(d.dateIn))}</small>` : ""}${d.promised ? `<small>Ready by ${e(day(d.promised))}</small>` : ""}</div></div>
      ${d.title || d.complaint ? `<section class="wo-sec"><h3>${e(d.title || "Work requested")}</h3>${d.complaint ? `<p>${e(d.complaint)}</p>` : ""}</section>` : ""}
      <table class="wo-tbl"><thead><tr><th>Description</th><th class="r">Qty / hrs</th><th class="r">Price</th><th class="r">Amount</th></tr></thead><tbody>
        ${labor.length ? `<tr class="wo-grp"><td colspan="4">Labor</td></tr>` + labor.map(l => `<tr><td>${e(l.desc || "Labor")}</td><td class="r">${e(+l.hours || 0)}</td><td class="r">${m2(l.rate)}/hr</td><td class="r">${m2((+l.hours || 0) * (+l.rate || 0))}</td></tr>`).join("") : ""}
        ${parts.length ? `<tr class="wo-grp"><td colspan="4">Parts</td></tr>` + parts.map(l => `<tr><td>${e(l.desc || "Part")}${l.partNo ? ` <code>${e(l.partNo)}</code>` : ""}</td><td class="r">${e(+l.qty || 0)}</td><td class="r">${m2(l.price)}</td><td class="r">${m2((+l.qty || 0) * (+l.price || 0))}</td></tr>`).join("") : ""}
        ${!labor.length && !parts.length ? `<tr><td colspan="4" class="wo-empty">No work or parts added yet.</td></tr>` : ""}
      </tbody></table>
      <div class="wo-tot"><div><span>Labor</span><b>${m2(T.labor)}</b></div><div><span>Parts</span><b>${m2(T.parts)}</b></div>
        ${T.supplies ? `<div><span>Shop supplies (${e(T.suppliesPct)}% of labor)</span><b>${m2(T.supplies)}</b></div>` : ""}${T.tax ? `<div><span>Tax (${e(T.taxPct)}%)</span><b>${m2(T.tax)}</b></div>` : ""}
        <div class="big"><span>${kind === "invoice" ? "Total" : "Estimated total"}</span><b>${m2(T.total)}</b></div>
        ${kind === "invoice" && d.invoice && d.invoice.paid ? `<div class="paid"><span>Paid ${e(day(d.invoice.paidDate))}${d.invoice.method ? " · " + e(d.invoice.method) : ""}</span><b>${m2(T.total)}</b></div><div class="big"><span>Balance due</span><b>${m2(0)}</b></div>` : ""}</div>
      ${d.approval && d.approval.name ? `<p class="wo-appr ${d.approval.decision === "declined" ? "no" : ""}">${d.approval.decision === "declined" ? "Declined" : "Approved"} by ${e(d.approval.name)}${d.approval.at ? " on " + e(day(d.approval.at)) : ""}.</p>` : ""}
      ${sh.terms ? `<p class="wo-terms">${e(sh.terms)}</p>` : `<p class="wo-terms">${kind === "invoice" ? "Thanks for your business." : "This is an estimate. If the work needs more than this, we'll ask before going ahead."}</p>`}
    </article>`;
  };
})();
