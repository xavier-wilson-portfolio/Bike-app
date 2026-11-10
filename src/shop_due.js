/* ============ Shop and client shared pieces (loaded with the loader, so the shop page, the client page and the app all use them) ============
   rvDue: what's due on a bike, worked out from its records the same way the app's maintenance log does it.
   rvShopDoc: the documents a shop sends a client (history report, bike value, budget), built from records and shown as a page. */
(function () {
  const n = v => +v || 0;
  const pad = v => String(v).padStart(2, "0");
  const isoDay = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = () => isoDay(new Date());
  const addDays = (iso, k) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + k); return isoDay(d); };
  function addMonths(iso, m) { const d = new Date(iso + "T12:00:00"); const day = d.getDate(); d.setMonth(d.getMonth() + m); if (d.getDate() < day) d.setDate(0); return isoDay(d); }
  const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);
  const milesFmt = v => Math.round(n(v)).toLocaleString("en-US");
  // dates ("2026-11-09") read as that day; timestamps ("2026-11-10T02:00:00Z") read in the viewer's own time zone
  const fmtDate = iso => { if (!iso) return ""; const d = /T\d/.test(String(iso)) ? new Date(iso) : new Date(String(iso).slice(0, 10) + "T12:00:00"); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  const live = a => (a || []).filter(r => r && !r.archived && !r.example);
  const everyTxt = it => [n(it.everyMiles) ? milesFmt(it.everyMiles) + " mi" : "", n(it.everyMonths) ? it.everyMonths + (n(it.everyMonths) === 1 ? " month" : " months") : ""].filter(Boolean).join(" or ") || "";
  const svcCost = r => n(r.cost) || n(r.partsCost) + n(r.laborCost);
  const modCost = m => n(m.price) + n(m.labor);

  // the same typical intervals the app's maintenance log offers, fitted to the drive
  const PRESETS = [
    ["Engine oil and filter", "Engine", 3000, 12], ["Chain clean and lube", "Drivetrain", 500, 0], ["Chain slack and wear check", "Drivetrain", 1000, 0],
    ["Tire pressure and tread check", "Tires & wheels", 0, 1], ["Brake pads and shoes check", "Brakes", 3000, 6], ["Brake fluid replace", "Brakes", 0, 24],
    ["Air filter clean or replace", "Fuel & air", 6000, 12], ["Spark plugs", "Engine", 6000, 0], ["Valve clearance check", "Engine", 6000, 0],
    ["Carburetor or throttle body sync", "Fuel & air", 6000, 0], ["Battery check and charge", "Electrical", 0, 1], ["Coolant replace (liquid-cooled only)", "Cooling", 0, 24],
    ["Fork oil replace", "Suspension & steering", 12000, 24], ["Steering head bearings check", "Suspension & steering", 6000, 12],
    ["Fuel lines and filter check", "Fuel & air", 6000, 12], ["Control cables lube and adjust", "Controls & cables", 3000, 12]];
  function presets(drive) {
    const out = PRESETS.filter(p => drive === "chain" || p[1] !== "Drivetrain");
    if (drive === "shaft") out.splice(1, 0, ["Final drive (shaft) oil change", "Drivetrain", 12000, 24], ["Drive shaft splines lube", "Drivetrain", 24000, 0]);
    if (drive === "belt") out.splice(1, 0, ["Drive belt tension and wear check", "Drivetrain", 5000, 12]);
    if (drive === "cvt") out.splice(1, 0, ["CVT belt check", "Drivetrain", 6000, 12], ["CVT belt and rollers replace", "Drivetrain", 12000, 0], ["Final gear (transmission) oil change", "Drivetrain", 6000, 24]);
    return out;
  }
  const TYPICAL_SRC = "Typical interval, not yet checked against the service manual";

  /* where every schedule item stands, plus the forecast date it comes due at the rider's pace.
     b = { schedule, maintenance, mileage, fuel } as arrays of records */
  function compute(b) {
    const t = today(), done = live(b.maintenance).filter(r => !r.planned && r.date).sort((x, y) => String(y.date).localeCompare(String(x.date)) || n(y.odometer) - n(x.odometer));
    const pts = live(b.mileage).map(r => ({ miles: n(r.miles), date: r.date })).concat(done.filter(r => n(r.odometer)).map(r => ({ miles: n(r.odometer), date: r.date })), live(b.fuel).filter(r => n(r.odometer)).map(r => ({ miles: n(r.odometer), date: r.date })))
      .filter(p => p.miles && p.date);
    const odo = pts.length ? pts.reduce((a, c) => (c.miles > a.miles || (c.miles === a.miles && c.date > a.date) ? c : a)) : null;
    // riding pace from the last year of readings
    const sortedPts = pts.slice().sort((a, c) => a.date.localeCompare(c.date)), recent = sortedPts.filter(p => p.date >= addDays(t, -400));
    let perDay = 0;
    if (recent.length >= 2) { const a = recent[0], z = recent.reduce((x, y) => (y.miles >= x.miles ? y : x)), d = daysBetween(a.date, z.date); if (d >= 14 && z.miles > a.miles) perDay = (z.miles - a.miles) / d; }
    if (n(b.monthlyMiles) > 0) perDay = n(b.monthlyMiles) / 30.44;
    const items = live(b.schedule).sort((x, y) => n(x.order) - n(y.order) || String(x.name).localeCompare(String(y.name))).map(it => {
      const recs = done.filter(r => (r.items || []).includes(it.id));
      const last = recs.length ? { date: recs[0].date, miles: n(recs[0].odometer) || null } : (it.lastDate || n(it.lastMiles)) ? { date: it.lastDate || null, miles: n(it.lastMiles) || null } : null;
      const em = n(it.everyMiles), mo = n(it.everyMonths);
      const st = { id: it.id, name: it.name, category: it.category || "", every: everyTxt(it), everyMiles: em, everyMonths: mo, last, nextMiles: null, nextDate: null, milesLeft: null, daysLeft: null, status: "none", due: null, basis: null };
      if (!em && !mo) { st.status = "nointerval"; return st; }
      if (!last) return st;
      if (em && last.miles != null) { st.nextMiles = last.miles + em; if (odo) st.milesLeft = st.nextMiles - odo.miles; }
      if (mo && last.date) { st.nextDate = addMonths(last.date, mo); st.daysLeft = daysBetween(t, st.nextDate); }
      if (st.nextMiles == null && st.nextDate == null) return st;
      const over = (st.milesLeft != null && st.milesLeft <= 0) || (st.daysLeft != null && st.daysLeft <= 0);
      const soon = (st.milesLeft != null && st.milesLeft <= Math.max(150, em * 0.1)) || (st.daysLeft != null && st.daysLeft <= 30);
      st.status = over ? "over" : soon ? "soon" : "ok";
      let byMiles = null;
      if (st.milesLeft != null && perDay > 0) byMiles = addDays(t, Math.round((st.milesLeft - perDay * (odo ? Math.max(0, daysBetween(odo.date, t)) : 0)) / perDay));
      st.due = [byMiles, st.nextDate].filter(Boolean).sort()[0] || null;
      st.basis = !st.due ? null : st.due === st.nextDate && st.nextDate !== byMiles ? "time" : "miles";
      return st;
    });
    const RANK = { over: 0, soon: 1, ok: 2, none: 3, nointerval: 4 };
    const ranked = items.slice().sort((a, c) => RANK[a.status] - RANK[c.status] || String(a.due || a.nextDate || "9999").localeCompare(String(c.due || c.nextDate || "9999")) || n(a.milesLeft) - n(c.milesLeft));
    const counts = { over: items.filter(i => i.status === "over").length, soon: items.filter(i => i.status === "soon").length };
    return { odo, perDay, items, ranked, counts, done, last: done[0] || null, status: counts.over ? "over" : counts.soon ? "soon" : items.some(i => i.status === "ok") ? "ok" : "none" };
  }
  const PILL = { over: ["red", "Overdue"], soon: ["amber", "Due soon"], ok: ["green", "Up to date"], none: ["gray", "Needs a start point"], nointerval: ["gray", "No interval"] };
  // "in 2 weeks", "3 days overdue", "at 15,000 mi"
  function whenTxt(st) {
    const bits = [];
    if (st.daysLeft != null) bits.push(st.daysLeft < 0 ? `${-st.daysLeft} day${st.daysLeft === -1 ? "" : "s"} overdue` : st.daysLeft === 0 ? "due today" : st.daysLeft <= 45 ? `in ${st.daysLeft} day${st.daysLeft === 1 ? "" : "s"}` : "by " + fmtDate(st.nextDate));
    if (st.milesLeft != null) bits.push(st.milesLeft <= 0 ? `${milesFmt(-st.milesLeft)} mi over` : `at ${milesFmt(st.nextMiles)} mi`);
    if (!bits.length && st.status === "none") return "Log it once to start counting";
    return bits.join(" or ");
  }
  // reminder emails for a shop's client: one per item, sent 14 days (or about 250 miles) before it's due
  function reminderRows(c, bikeName) {
    const t = today(), out = [];
    c.items.filter(i => i.due || i.nextDate).forEach(i => {
      const due = i.due || i.nextDate; let send = addDays(due, -14);
      if (i.basis === "miles" && c.perDay > 0) { const m = addDays(due, -Math.round(250 / c.perDay)); if (m < send) send = m; }
      if (send < t) send = t;
      const days = daysBetween(t, due);
      out.push({ item_key: i.id, kind: "service", send_on: send, due_on: due, bike: String(bikeName || "").slice(0, 120),
        title: `${bikeName}: ${i.name} ${days < 0 ? "is overdue" : "is coming due"}`.slice(0, 200),
        body: `${i.name} (every ${i.every}) is due ${days < 0 ? "since " : "around "}${fmtDate(due)}${i.basis === "miles" && i.nextMiles ? `, at about ${milesFmt(i.nextMiles)} mi` : ""}.`.slice(0, 600) });
    });
    return out;
  }
  window.rvDue = { compute, whenTxt, reminderRows, presets, PILL, TYPICAL_SRC, today, addDays, addMonths, daysBetween, fmtDate, milesFmt, everyTxt, svcCost, modCost, live };

  /* ---------- documents a shop sends a client ---------- */
  const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const usd = v => "$" + (Math.round(n(v) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: n(v) % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const KIND = { report: "Service history report", value: "Bike value", budget: "Budget" };

  // build: ctx = { shop, client, bike: { name, meta, schedule, maintenance, mileage, mods }, money: { budget, since }, value: {...}, spendAll: [...] }
  function build(kind, ctx) {
    const b = ctx.bike, m = b.meta || {}, c = compute(b);
    const base = { v: 1, kind, made: today(), shop: { name: ctx.shop.name || "", phone: ctx.shop.phone || "", email: ctx.shop.email || "", address: ctx.shop.address || "" },
      client: { name: ctx.client.name || "" }, bike: { name: m.bike || b.name || "Bike", year: m.year || "", make: m.make || "", model: m.model || "", style: m.style || "", vin: String(m.frameNo || "").trim() }, odo: c.odo ? c.odo.miles : 0 };
    const mods = live(b.mods);
    if (kind === "report") return Object.assign(base, {
      services: c.done.slice(0, 200).map(r => ({ date: r.date, miles: n(r.odometer), service: r.service || "", kind: r.kind || "", by: r.doneBy === "A shop" ? (r.shop || ctx.shop.name || "Shop") : r.doneBy === "Myself" ? "Owner" : (r.shop || r.doneBy || ""), parts: String(r.partsUsed || "").split(/\n+/).map(x => x.trim()).filter(Boolean).slice(0, 8) })),
      schedule: c.ranked.filter(i => i.status !== "nointerval").map(i => ({ name: i.name, status: i.status, every: i.every, last: i.last && i.last.date, lastMiles: i.last && i.last.miles, when: whenTxt(i) })),
      mods: mods.filter(x => x.status === "Installed").map(x => ({ name: x.name, brand: x.brand || "", partNo: x.partNo || "", date: x.date || "", miles: n(x.odometer) })),
      stats: { services: c.done.length, first: c.done.length ? c.done[c.done.length - 1].date : "", last: c.last ? c.last.date : "" } });
    const svc = c.done.reduce((s, r) => s + svcCost(r), 0), modsIn = mods.filter(x => x.status === "Installed").reduce((s, x) => s + modCost(x), 0);
    if (kind === "value") { const v = ctx.value || {};
      return Object.assign(base, { estimate: n(v.amount), low: n(v.low), high: n(v.high), condition: v.condition || "", note: String(v.note || "").slice(0, 1200), valued: v.date || today(),
        invested: { services: svc, mods: modsIn, total: svc + modsIn }, servicesCount: c.done.length,
        mods: mods.filter(x => x.status === "Installed").map(x => ({ name: x.name, brand: x.brand || "" })) }); }
    // budget: every bike of the client, spend since the budget started
    const since = (ctx.money && ctx.money.since) || "", rows = [];
    (ctx.spendAll || [b]).forEach(bk => {
      const nm = (bk.meta && bk.meta.bike) || bk.name || "Bike";
      live(bk.maintenance).filter(r => !r.planned && r.date && svcCost(r) && (!since || r.date >= since)).forEach(r => rows.push({ date: r.date, what: r.service || "Service", bike: nm, amount: svcCost(r) }));
      live(bk.mods).filter(x => x.status === "Installed" && modCost(x) && (!since || !x.date || x.date >= since)).forEach(x => rows.push({ date: x.date || "", what: x.name, bike: nm, amount: modCost(x), mod: true }));
    });
    rows.sort((a, z) => String(z.date).localeCompare(String(a.date)));
    const planned = []; (ctx.spendAll || [b]).forEach(bk => live(bk.mods).filter(x => x.status === "Planned" || x.status === "Ordered").forEach(x => planned.push({ name: x.name, status: x.status, bike: (bk.meta && bk.meta.bike) || bk.name || "", amount: modCost(x) })));
    const spent = rows.reduce((s, r) => s + r.amount, 0), plannedTot = planned.reduce((s, x) => s + x.amount, 0), budget = n(ctx.money && ctx.money.budget);
    return Object.assign(base, { budget, since, spent, left: budget - spent, planned, plannedTotal: plannedTot, afterPlanned: budget - spent - plannedTot, rows: rows.slice(0, 300) });
  }

  function head(d) {
    const s = d.shop || {};
    return `<header class="sd-head"><div><b class="sd-shop">${e(s.name || "Your shop")}</b>${[s.address, s.phone, s.email].filter(Boolean).map(x => `<span>${e(x)}</span>`).join("")}</div>
      <div class="sd-kind"><span>${e(KIND[d.kind] || "Document")}</span><b>${e(d.bike && d.bike.name)}</b><small>${e(fmtDate(d.made))}${d.client && d.client.name ? " · for " + e(d.client.name) : ""}</small></div></header>`;
  }
  const stat = (k, v) => `<div class="sd-stat"><span>${e(k)}</span><b>${v}</b></div>`;
  function html(d) {
    if (!d || !d.kind) return "";
    const foot = `<p class="sd-foot">Prepared by ${e((d.shop && d.shop.name) || "your shop")} with Revora · revoragarage.com</p>`;
    if (d.kind === "report") return `<article class="sd-doc">${head(d)}
      <div class="sd-stats">${stat("Odometer", d.odo ? milesFmt(d.odo) + " mi" : "—")}${stat("Services on record", e(d.stats.services))}${stat("First on record", e(fmtDate(d.stats.first) || "—"))}${stat("Last service", e(fmtDate(d.stats.last) || "—"))}</div>
      ${d.schedule && d.schedule.length ? `<h3>Service schedule</h3><table class="sd-tbl"><thead><tr><th>Service</th><th>Every</th><th>Last done</th><th>Next</th><th>Status</th></tr></thead><tbody>${d.schedule.map(i => `<tr><td>${e(i.name)}</td><td>${e(i.every || "—")}</td><td>${e([fmtDate(i.last), i.lastMiles ? milesFmt(i.lastMiles) + " mi" : ""].filter(Boolean).join(", ") || "—")}</td><td>${e(i.when || "—")}</td><td><span class="pill ${PILL[i.status][0]}">${PILL[i.status][1]}</span></td></tr>`).join("")}</tbody></table>` : ""}
      <h3>Service history</h3>${d.services.length ? `<table class="sd-tbl"><thead><tr><th>Date</th><th>Miles</th><th>Work done</th><th>By</th></tr></thead><tbody>${d.services.map(r => `<tr><td>${e(fmtDate(r.date))}</td><td class="r">${r.miles ? milesFmt(r.miles) : "—"}</td><td>${e(r.service)}${r.parts.length ? `<small>${r.parts.map(e).join(" · ")}</small>` : ""}</td><td>${e(r.by)}</td></tr>`).join("")}</tbody></table>` : `<p class="sd-empty">No services logged yet.</p>`}
      ${d.mods && d.mods.length ? `<h3>Upgrades fitted</h3><table class="sd-tbl"><thead><tr><th>Part</th><th>Part number</th><th>Fitted</th></tr></thead><tbody>${d.mods.map(x => `<tr><td>${e([x.brand, x.name].filter(Boolean).join(" "))}</td><td>${e(x.partNo || "—")}</td><td>${e([fmtDate(x.date), x.miles ? milesFmt(x.miles) + " mi" : ""].filter(Boolean).join(", ") || "—")}</td></tr>`).join("")}</tbody></table>` : ""}
      ${foot}</article>`;
    if (d.kind === "value") return `<article class="sd-doc">${head(d)}
      <div class="sd-big"><span>Estimated value</span><b>${d.estimate ? usd(d.estimate) : "—"}</b>${d.low && d.high ? `<small>Range ${usd(d.low)} to ${usd(d.high)}</small>` : ""}<small>Valued ${e(fmtDate(d.valued))}${d.condition ? " · Condition: " + e(d.condition) : ""}</small></div>
      <div class="sd-stats">${stat("Odometer", d.odo ? milesFmt(d.odo) + " mi" : "—")}${stat("Services on record", e(d.servicesCount))}${stat("Spent on service", usd(d.invested.services))}${stat("Spent on upgrades", usd(d.invested.mods))}</div>
      ${d.note ? `<h3>Notes from the shop</h3><p class="sd-note">${e(d.note)}</p>` : ""}
      ${d.mods && d.mods.length ? `<h3>Upgrades fitted</h3><ul class="sd-list">${d.mods.map(x => `<li>${e([x.brand, x.name].filter(Boolean).join(" "))}</li>`).join("")}</ul>` : ""}
      <p class="sd-fine">This is the shop's estimate of what the bike would sell for today, based on its condition, mileage and records. It isn't a formal appraisal.</p>${foot}</article>`;
    if (d.kind === "budget") { const pct = d.budget ? Math.min(100, Math.round(d.spent / d.budget * 100)) : 0;
      return `<article class="sd-doc">${head(d)}
      <div class="sd-stats">${stat("Budget", d.budget ? usd(d.budget) : "Not set")}${stat("Spent" + (d.since ? " since " + fmtDate(d.since) : ""), usd(d.spent))}${stat("Left", d.budget ? usd(d.left) : "—")}${stat("Planned upgrades", usd(d.plannedTotal))}</div>
      ${d.budget ? `<div class="sd-bar${d.left < 0 ? " over" : ""}"><i style="width:${pct}%"></i></div><p class="sd-fine">${d.left < 0 ? usd(-d.left) + " over budget." : pct + "% of the budget used."}${d.plannedTotal ? ` After the planned upgrades: ${d.afterPlanned < 0 ? usd(-d.afterPlanned) + " over" : usd(d.afterPlanned) + " left"}.` : ""}</p>` : ""}
      ${d.planned.length ? `<h3>Planned upgrades</h3><table class="sd-tbl"><thead><tr><th>Upgrade</th><th>Bike</th><th>Status</th><th class="r">Estimate</th></tr></thead><tbody>${d.planned.map(x => `<tr><td>${e(x.name)}</td><td>${e(x.bike)}</td><td>${e(x.status === "Planned" ? "Wanted" : x.status)}</td><td class="r">${x.amount ? usd(x.amount) : "—"}</td></tr>`).join("")}</tbody></table>` : ""}
      <h3>Spending</h3>${d.rows.length ? `<table class="sd-tbl"><thead><tr><th>Date</th><th>What</th><th>Bike</th><th class="r">Amount</th></tr></thead><tbody>${d.rows.map(r => `<tr><td>${e(fmtDate(r.date) || "—")}</td><td>${e(r.what)}${r.mod ? " <small>upgrade</small>" : ""}</td><td>${e(r.bike)}</td><td class="r">${usd(r.amount)}</td></tr>`).join("")}<tr class="sd-tot"><td colspan="3">Total</td><td class="r">${usd(d.spent)}</td></tr></tbody></table>` : `<p class="sd-empty">Nothing spent yet.</p>`}
      ${foot}</article>`; }
    return "";
  }
  window.rvShopDoc = { build, html, KIND, usd };
})();
