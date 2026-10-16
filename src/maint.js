/* ============ Maintenance log: schedule, service history, mileage, printable report ============ */
const MAINT_PRESETS = [
  ["Engine oil and filter", "Engine", 3000, 12], ["Chain clean and lube", "Drivetrain", 500, 0], ["Chain slack and wear check", "Drivetrain", 1000, 0],
  ["Tire pressure and tread check", "Tires & wheels", 0, 1], ["Brake pads and shoes check", "Brakes", 3000, 6], ["Brake fluid replace", "Brakes", 0, 24],
  ["Air filter clean or replace", "Fuel & air", 6000, 12], ["Spark plugs", "Engine", 6000, 0], ["Valve clearance check", "Engine", 6000, 0],
  ["Carburetor or throttle body sync", "Fuel & air", 6000, 0], ["Battery check and charge", "Electrical", 0, 1], ["Coolant replace (liquid-cooled only)", "Cooling", 0, 24],
  ["Fork oil replace", "Suspension & steering", 12000, 24], ["Steering head bearings check", "Suspension & steering", 6000, 12],
  ["Fuel lines and filter check", "Fuel & air", 6000, 12], ["Control cables lube and adjust", "Controls & cables", 3000, 12],
];
const TYPICAL_SRC = "Typical interval, not yet checked against the service manual";

const isoDay = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function addMonths(iso, m) { const d = new Date(iso + "T12:00:00"); const day = d.getDate(); d.setMonth(d.getMonth() + m); if (d.getDate() < day) d.setDate(0); return isoDay(d); }
const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);
const milesFmt = v => Math.round(n(v)).toLocaleString("en-US");
const svcDone = () => sorted("maintenance").filter(r => !r.planned && r.date);
const svcCost = r => n(r.cost) || n(r.partsCost) + n(r.laborCost);

/* current odometer: the highest reading anywhere, with the date it was seen */
function odoNow() {
  const pts = sorted("mileage").map(r => ({ miles: n(r.miles), date: r.date })).concat(svcDone().filter(r => n(r.odometer)).map(r => ({ miles: n(r.odometer), date: r.date })));
  if (!pts.length) return null;
  return pts.reduce((a, b) => (b.miles > a.miles || (b.miles === a.miles && b.date > a.date) ? b : a));
}
function lastFor(item) {
  const recs = svcDone().filter(r => (r.items || []).includes(item.id)).sort((a, b) => String(b.date).localeCompare(String(a.date)) || n(b.odometer) - n(a.odometer));
  if (recs.length) return { date: recs[0].date, miles: n(recs[0].odometer) || null, rec: recs[0].id };
  if (item.lastDate || n(item.lastMiles)) return { date: item.lastDate || null, miles: n(item.lastMiles) || null, rec: null };
  return null;
}
/* where a schedule item stands: overdue, due soon, ok, or no starting point yet */
function svcState(item, odo = odoNow()) {
  const last = lastFor(item), em = n(item.everyMiles), mo = n(item.everyMonths), t = today();
  const st = { item, last, nextMiles: null, nextDate: null, milesLeft: null, daysLeft: null, frac: 0, status: "none" };
  if (!last || (!em && !mo)) { st.status = !em && !mo ? "nointerval" : "none"; return st; }
  if (em && last.miles != null) { st.nextMiles = last.miles + em; if (odo) { st.milesLeft = st.nextMiles - odo.miles; st.frac = Math.max(st.frac, (odo.miles - last.miles) / em); } }
  if (mo && last.date) { st.nextDate = addMonths(last.date, mo); st.daysLeft = daysBetween(t, st.nextDate); st.frac = Math.max(st.frac, daysBetween(last.date, t) / Math.max(1, daysBetween(last.date, st.nextDate))); }
  if (st.nextMiles == null && st.nextDate == null) { st.status = "none"; return st; }
  const over = (st.milesLeft != null && st.milesLeft <= 0) || (st.daysLeft != null && st.daysLeft <= 0);
  const soon = (st.milesLeft != null && st.milesLeft <= Math.max(150, em * 0.1)) || (st.daysLeft != null && st.daysLeft <= 30);
  st.status = over ? "over" : soon ? "soon" : "ok";
  return st;
}
const SVC_PILL = { over: ["red", "Overdue"], soon: ["amber", "Due soon"], ok: ["green", "Up to date"], none: ["gray", "Needs a start point"], nointerval: ["gray", "No interval set"] };
const SVC_RANK = { over: 0, soon: 1, none: 2, nointerval: 3, ok: 4 };
const everyTxt = it => [n(it.everyMiles) ? milesFmt(it.everyMiles) + " mi" : "", n(it.everyMonths) ? it.everyMonths + (n(it.everyMonths) === 1 ? " month" : " months") : ""].filter(Boolean).join(" or ") || "—";
function dueTxt(st) {
  if (st.status === "nointerval") return "Set how often";
  if (st.status === "none") return "Log when it was last done";
  const bits = [];
  if (st.milesLeft != null) bits.push(st.milesLeft <= 0 ? milesFmt(-st.milesLeft) + " mi over" : milesFmt(st.milesLeft) + " mi left");
  else if (st.nextMiles != null) bits.push("at " + milesFmt(st.nextMiles) + " mi");
  if (st.daysLeft != null) bits.push(st.daysLeft <= 0 ? (st.daysLeft === 0 ? "due today" : -st.daysLeft + " days over") : st.daysLeft < 60 ? st.daysLeft + " days left" : "by " + fmtDate(st.nextDate));
  return bits.join(" · ");
}
function maintMoney() {
  const done = svcDone(), y = String(new Date().getFullYear());
  const total = done.reduce((s, r) => s + svcCost(r), 0), year = done.filter(r => String(r.date).startsWith(y)).reduce((s, r) => s + svcCost(r), 0);
  const miles = done.map(r => n(r.odometer)).concat(sorted("mileage").map(r => n(r.miles))).filter(Boolean);
  const span = miles.length > 1 ? Math.max(...miles) - Math.min(...miles) : 0;
  return { total, year, perMile: span > 0 ? total / span : null, span };
}

function logMileage() {
  const o = odoNow();
  modal(`<h2>Update odometer</h2><p class="hint-text" style="margin-top:0">Log the current reading so the schedule knows what's coming due.</p>
    <div class="form"><label>Odometer (miles)<input id="odoMi" type="number" inputmode="numeric" min="0" step="1" value="${o ? Math.round(o.miles) : ""}" autofocus></label><label>Date<input id="odoDate" type="date" value="${today()}"></label><label class="full">Note (optional)<input id="odoNote" type="text" placeholder="For example: after the spring ride"></label></div>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>Save reading</button></div>`, m => {
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelector("[data-ok]").onclick = async () => {
      const mi = n(m.querySelector("#odoMi").value), d = m.querySelector("#odoDate").value || today();
      if (!mi) { toast("Enter the odometer reading.", "err"); return; }
      closeModal(); await store.put("mileage", blank("mileage", { date: d, miles: mi, note: m.querySelector("#odoNote").value.trim() })); toast(o && mi < o.miles ? "Saved, but it's lower than the last reading (" + milesFmt(o.miles) + " mi), so the odometer still shows that." : "Odometer updated to " + milesFmt(mi) + " mi", o && mi < o.miles ? "err" : "");
    };
  });
}
function addPresets() {
  const have = new Set(sorted("schedule").map(s => s.name.toLowerCase()));
  const rows = MAINT_PRESETS.map((p, i) => `<label class="chk" style="display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--line)"><input type="checkbox" data-p="${i}" ${have.has(p[0].toLowerCase()) ? "disabled" : p[0].startsWith("Coolant") ? "" : "checked"}><span class="grow"><b style="font-weight:600">${esc(p[0])}</b>${have.has(p[0].toLowerCase()) ? ' <span class="tag">Already added</span>' : ""}<br><span class="faint" style="font-size:12.5px">${esc(p[1])} · every ${everyTxt({ everyMiles: p[2], everyMonths: p[3] })}</span></span></label>`).join("");
  modal(`<h2>Start from a typical schedule</h2><p class="hint-text" style="margin-top:0">These are common starting intervals for motorcycles, not the numbers for your bike. Check each one against your service manual and edit it. Items stay marked "not yet checked" until you change where the interval comes from.</p>
    <div style="max-height:52vh;overflow:auto;margin:8px 0">${rows}</div>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:10px"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>Add selected</button></div>`, m => {
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelector("[data-ok]").onclick = async () => {
      const pick = [...m.querySelectorAll("[data-p]:checked:not(:disabled)")].map(x => MAINT_PRESETS[+x.dataset.p]);
      if (!pick.length) { closeModal(); return; }
      closeModal(); const writes = []; let ord = sorted("schedule").length;
      for (const [name, category, everyMiles, everyMonths] of pick) { const r = blank("schedule", { name, category, everyMiles, everyMonths, source: TYPICAL_SRC, order: ++ord }); S.schedule[r.id] = r; writes.push({ c: "schedule", rec: r }); }
      await store.bulk(writes); toast("Added " + pick.length + " schedule items. Set when each was last done to start tracking.");
    };
  });
}
function plannedToSchedule() {
  const planned = sorted("maintenance").filter(r => r.planned);
  confirmBox("Move planned items into the schedule?", `<p style="margin:0">${planned.length} planned items become schedule items. Their notes and sources come along; you'll set the intervals.</p>`, "Move them", async () => {
    let ord = sorted("schedule").length;
    for (const r of planned) { await store.put("schedule", blank("schedule", { name: r.service, category: "General", source: r.source && !/VERIFY/i.test(r.source) ? r.source : "", notes: r.notes || "", order: ++ord })); await store.del("maintenance", r.id); }
    toast("Moved " + planned.length + " items into the schedule");
  }, false);
}
function logFor(itemIds) { const o = odoNow(); const it = itemIds.map(id => S.schedule[id]).filter(Boolean); openRecord("maintenance", null, { items: itemIds, service: it.map(x => x.name).join(", "), odometer: o ? Math.round(o.miles) : 0, kind: "Scheduled service" }); }

function dueCard(st) {
  const [col, lbl] = SVC_PILL[st.status], pct = Math.max(0, Math.min(1, st.frac)) * 100, it = st.item;
  return `<div class="mtcard ${st.status}"><div class="row" style="gap:8px;align-items:flex-start"><div class="grow"><button class="linkbtn mtname" data-open="schedule|${esc(it.id)}">${esc(it.name)}</button><div class="faint" style="font-size:12.5px">${esc(it.category || "")} · every ${everyTxt(it)}</div></div>${pill(col, lbl)}</div>
    ${st.status === "none" || st.status === "nointerval" ? "" : `<div class="mtbar" role="img" aria-label="${Math.round(pct)}% of the interval used"><span style="width:${pct.toFixed(1)}%"></span></div>`}
    <div class="row" style="gap:8px;align-items:center"><span class="grow" style="font-size:13px">${esc(dueTxt(st))}${st.last && st.last.date ? `<span class="faint"> · last ${fmtDate(st.last.date)}${st.last.miles ? " at " + milesFmt(st.last.miles) + " mi" : ""}</span>` : ""}</span>
    ${ME.canWrite ? (st.status === "none" ? `<button class="btn sm" data-open="schedule|${esc(it.id)}">Set last done</button>` : st.status === "nointerval" ? `<button class="btn sm" data-open="schedule|${esc(it.id)}">Set interval</button>` : `<button class="btn sm pri" data-logfor="${esc(it.id)}">${ic("check")} Log it</button>`) : ""}</div></div>`;
}
function svcHistoryCard(r) {
  const items = (r.items || []).map(id => S.schedule[id]).filter(Boolean), parts = String(r.partsUsed || "").split(/\n+/).map(x => x.trim()).filter(Boolean), cost = svcCost(r);
  return `<div class="mthist"><div class="mtdate"><b>${esc(fmtDate(r.date) || "No date")}</b>${n(r.odometer) ? `<span>${milesFmt(r.odometer)} mi</span>` : ""}</div>
    <div class="grow stack" style="gap:4px"><div class="row" style="gap:8px;align-items:center"><button class="linkbtn mtname" data-open="maintenance|${esc(r.id)}">${esc(r.service)}</button><span class="tag">${esc(r.kind || "Service")}</span></div>
    <div class="faint" style="font-size:13px">${[r.doneBy === "A shop" ? (r.shop ? esc(r.shop) : "Shop") : r.doneBy === "A friend" ? (r.shop ? esc(r.shop) : "A friend") : r.technician && S.team[r.technician] ? esc(S.team[r.technician].name) : "Done myself", n(r.laborHours) ? r.laborHours + " h labor" : "", items.length ? "Covers: " + items.map(i => esc(i.name)).join(", ") : ""].filter(Boolean).join(" · ")}</div>
    ${parts.length ? `<ul class="mtparts">${parts.slice(0, 6).map(p => `<li>${esc(p)}</li>`).join("")}${parts.length > 6 ? `<li class="faint">+${parts.length - 6} more</li>` : ""}</ul>` : ""}
    ${r.notes ? `<div style="font-size:13px">${esc(r.notes)}</div>` : ""}</div>
    <div class="mtcost">${cost ? money2(cost) : `<span class="faint">—</span>`}${r.receipt ? `<a href="${esc(r.receipt)}" target="_blank" rel="noopener" class="faint" style="font-size:12px">Receipt</a>` : ""}</div></div>`;
}
function maintReport() {
  const done = svcDone().sort((a, b) => String(a.date).localeCompare(String(b.date))), o = odoNow(), mm = maintMoney(), name = (meta().name || BIKE.name);
  const states = sorted("schedule").map(it => svcState(it, o));
  return `<div id="mntReport" class="mtreport"><div class="row" style="align-items:flex-start;gap:16px"><img src="img/revora-icon.svg" alt="" style="width:46px;height:46px;border-radius:10px"><div class="grow"><div class="eyebrow">Service history</div><h2 style="margin:2px 0 0">${esc(name)}</h2>${[name !== BIKE.name ? BIKE.name : "", meta().vin ? "VIN " + meta().vin : ""].filter(Boolean).length ? `<div class="faint">${esc([name !== BIKE.name ? BIKE.name : "", meta().vin ? "VIN " + meta().vin : ""].filter(Boolean).join(" · "))}</div>` : ""}</div>
    <div style="text-align:right;font-size:13px"><div>Report date: <b>${fmtDate(today())}</b></div><div>Odometer: <b>${o ? milesFmt(o.miles) + " mi" : "not logged"}</b></div><div>${done.length} services · ${money2(mm.total)}</div></div></div>
    <table class="mtrep"><thead><tr><th>Date</th><th class="r">Miles</th><th>Service</th><th>Done by</th><th>Parts and fluids</th><th class="r">Cost</th></tr></thead><tbody>
    ${done.length ? done.map(r => `<tr><td>${esc(fmtDate(r.date))}</td><td class="r">${n(r.odometer) ? milesFmt(r.odometer) : "—"}</td><td><b>${esc(r.service)}</b>${r.kind && r.kind !== "Scheduled service" ? ` <span class="faint">(${esc(r.kind)})</span>` : ""}${r.notes ? `<div class="faint">${esc(r.notes)}</div>` : ""}</td><td>${esc(r.doneBy === "Myself" || !r.doneBy ? "Owner" : r.shop || r.doneBy)}</td><td>${esc(String(r.partsUsed || "").split(/\n+/).filter(Boolean).join("; ")) || "—"}</td><td class="r">${svcCost(r) ? money2(svcCost(r)) : "—"}</td></tr>`).join("") : `<tr><td colspan="6" class="faint">No services logged yet.</td></tr>`}</tbody>
    <tfoot><tr><td colspan="5"><b>Total maintenance spend</b></td><td class="r"><b>${money2(mm.total)}</b></td></tr></tfoot></table>
    ${states.length ? `<h3 style="margin:18px 0 6px">Schedule status</h3><table class="mtrep"><thead><tr><th>Service</th><th>Interval</th><th>Last done</th><th>Next due</th><th>Status</th></tr></thead><tbody>${states.sort((a, b) => SVC_RANK[a.status] - SVC_RANK[b.status]).map(st => `<tr><td>${esc(st.item.name)}</td><td>${everyTxt(st.item)}</td><td>${st.last ? [fmtDate(st.last.date), st.last.miles ? milesFmt(st.last.miles) + " mi" : ""].filter(Boolean).join(", ") : "—"}</td><td>${[st.nextDate ? fmtDate(st.nextDate) : "", st.nextMiles ? milesFmt(st.nextMiles) + " mi" : ""].filter(Boolean).join(" or ") || "—"}</td><td>${SVC_PILL[st.status][1]}</td></tr>`).join("")}</tbody></table>` : ""}
    <p class="faint" style="font-size:12px;margin-top:14px">Generated by Revora from the owner's records.</p></div>`;
}

VIEWS.maintenance = {
  render() {
    const tab = R.tab.maintenance || "overview", o = odoNow(), mm = maintMoney();
    const states = sorted("schedule").map(it => svcState(it, o)).sort((a, b) => SVC_RANK[a.status] - SVC_RANK[b.status] || (a.milesLeft ?? 1e9) - (b.milesLeft ?? 1e9) || (a.daysLeft ?? 1e9) - (b.daysLeft ?? 1e9));
    const over = states.filter(s => s.status === "over").length, soon = states.filter(s => s.status === "soon").length;
    const done = svcDone().sort((a, b) => String(b.date).localeCompare(String(a.date)) || n(b.odometer) - n(a.odometer));
    const planned = sorted("maintenance").filter(r => r.planned);
    const reminders = sorted("maintenance").filter(r => !r.planned && (r.nextDate || n(r.nextMiles))).filter(r => !done.some(d => d !== r && d.date > r.date && d.service === r.service));
    const act = `<button class="btn" data-go="mods">${ic("tune")} Mods${sorted("mods").length ? " (" + sorted("mods").filter(m => m.status === "Installed").length + ")" : ""}</button>` + (ME.canWrite ? `<button class="btn" id="mntOdo">${ic("gauge")} Update odometer</button><button class="btn pri" data-new="maintenance|${esc(JSON.stringify({ odometer: o ? Math.round(o.miles) : 0 }))}">${ic("plus")} Log service</button>` : "");
    const tabs = [["overview", "Overview"], ["schedule", "Schedule" + (over ? ` (${over} overdue)` : "")], ["history", "Service history"], ["report", "Report"]];
    let body = "";
    if (tab === "overview") {
      const hot = states.filter(s => s.status === "over" || s.status === "soon"), cold = states.filter(s => s.status === "none" || s.status === "nointerval");
      body = `${!states.length ? `<div class="panel blue row center" style="gap:16px;flex-wrap:wrap"><div class="grow" style="min-width:240px"><b>Set up your service schedule</b><div class="hint-text">Add what needs doing and how often. Then log the odometer now and then, and this page tells you what's due.</div></div>${ME.canWrite ? `<button class="btn pri" data-presets>${ic("plus")} Start from a typical schedule</button><button class="btn" data-new="schedule">Add one item</button>` : ""}</div>` : ""}
        ${planned.length ? `<div class="banner warn"><div class="grow"><b>${planned.length} planned services from the old log.</b> Move them into the schedule so they get due dates.</div>${ME.canWrite ? `<button class="btn sm" id="mntMove">Move them</button>` : ""}</div>` : ""}
        ${states.length ? `<h2 class="sec">What's due</h2>${hot.length ? `<div class="mtgrid">${hot.map(dueCard).join("")}</div>` : `<div class="empty"><b>Nothing is due right now</b>Nothing is within 30 days or 10% of its interval.</div>`}` : ""}
        ${cold.length ? `<div class="panel mtstart"><div class="row" style="gap:10px;align-items:center"><b class="grow">Needs a start point (${cold.length})</b><span class="faint" style="font-size:13px">Tell it when each was last done and it starts counting.</span></div>${cold.map(st => `<div class="mtsrow"><button class="linkbtn mtname" data-open="schedule|${esc(st.item.id)}">${esc(st.item.name)}</button><span class="faint grow">every ${everyTxt(st.item)}</span>${ME.canWrite ? `<button class="btn sm" data-open="schedule|${esc(st.item.id)}">${st.status === "nointerval" ? "Set interval" : "Set last done"}</button>` : ""}</div>`).join("")}</div>` : ""}
        ${reminders.length ? `<h2 class="sec">Reminders</h2><div class="stack" style="gap:6px">${reminders.map(r => `<div class="panel row" style="gap:10px;padding:10px 14px"><span class="grow"><button class="linkbtn mtname" data-open="maintenance|${esc(r.id)}">${esc(r.service)}</button></span><span class="faint">${[r.nextDate ? fmtDate(r.nextDate) : "", n(r.nextMiles) ? milesFmt(r.nextMiles) + " mi" : ""].filter(Boolean).join(" or ")}</span></div>`).join("")}</div>` : ""}
        <h2 class="sec">Recent services</h2>${done.length ? `<div class="mthistlist">${done.slice(0, 5).map(svcHistoryCard).join("")}</div>${done.length > 5 ? `<button class="btn sm" data-mtab="history" style="margin-top:8px">See all ${done.length}</button>` : ""}` : `<div class="empty"><b>No services logged yet</b>Use Log service after each oil change, repair or inspection. Add parts, cost and a receipt link so the history holds up when you sell the bike.</div>`}`;
    }
    if (tab === "schedule") {
      body = `<div class="row" style="gap:8px;margin-bottom:10px;flex-wrap:wrap"><span class="grow hint-text">Each item tracks miles, months or both, whichever comes first. Logging a service that covers an item resets it.</span>${ME.canWrite ? `<button class="btn sm" data-presets>Add typical items</button><button class="btn sm pri" data-new="schedule">${ic("plus")} Add item</button>` : ""}</div>` +
        `<div class="mtgrid mt-narrow">${states.map(dueCard).join("") || `<div class="empty"><b>No schedule items yet</b>Add items one at a time, or start from a typical schedule.</div>`}</div><div class="mt-wide">` + table("mnt-sched", states.map(s => ({ ...s.item, _st: s })), [
          { k: "name", label: "Service", get: r => `<b style="font-weight:600">${esc(r.name)}</b>${/not yet checked/i.test(r.source || "") ? `<div class="faint" style="font-size:12px">Typical interval, check your manual</div>` : r.source ? `<div class="faint" style="font-size:12px">${esc(r.source)}</div>` : ""}`, cls: "wrap" },
          { k: "category", label: "System" }, { k: "every", label: "Every", get: r => everyTxt(r), sort: r => n(r.everyMiles) || n(r.everyMonths) * 1000 },
          { k: "last", label: "Last done", get: r => r._st.last ? [fmtDate(r._st.last.date), r._st.last.miles ? milesFmt(r._st.last.miles) + " mi" : ""].filter(Boolean).join(" · ") : `<span class="faint">—</span>`, sort: r => r._st.last?.date || "" },
          { k: "next", label: "Next due", get: r => esc(dueTxt(r._st)), sort: r => SVC_RANK[r._st.status] * 1e7 + (r._st.milesLeft ?? r._st.daysLeft ?? 1e6) },
          { k: "status", label: "Status", get: r => pill(...SVC_PILL[r._st.status]), sort: r => SVC_RANK[r._st.status] },
          { k: "act", label: "", get: r => ME.canWrite && r._st.status !== "none" && r._st.status !== "nointerval" ? `<button class="btn sm" data-logfor="${esc(r.id)}">Log it</button>` : "" }], { coll: "schedule", emptyTitle: "No schedule items yet", empty: "Add items one at a time, or start from a typical schedule and edit it." }) + "</div>";
    }
    if (tab === "history") {
      const f = fstate("maintenance"), years = [...new Set(done.map(r => String(r.date).slice(0, 4)))];
      const list = done.filter(r => (!f.year || String(r.date).startsWith(f.year)) && (!f.kind || r.kind === f.kind));
      body = `<div class="row" style="gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center"><select id="mtYear" aria-label="Year"><option value="">All years</option>${years.map(y => `<option ${f.year === y ? "selected" : ""}>${y}</option>`).join("")}</select><select id="mtKind" aria-label="Type"><option value="">All types</option>${MAINT_KINDS.map(k => `<option ${f.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select><span class="grow faint">${list.length} services · ${money2(list.reduce((s, r) => s + svcCost(r), 0))}</span><button class="btn sm" id="mntCsv">${ic("download")} Export CSV</button></div>
        ${list.length ? `<div class="mthistlist">${list.map(svcHistoryCard).join("")}</div>` : `<div class="empty"><b>No services match</b>Change the filters or log a service.</div>`}
        ${sorted("mileage").length ? `<h2 class="sec">Odometer readings</h2>${table("mnt-odo", sorted("mileage").sort((a, b) => String(b.date).localeCompare(String(a.date))), [{ k: "date", label: "Date", get: r => fmtDate(r.date) }, { k: "miles", label: "Odometer", get: r => milesFmt(r.miles) + " mi", cls: "r", sort: r => n(r.miles) }, { k: "note", label: "Note", cls: "wrap" }], { coll: "mileage" })}` : ""}`;
    }
    if (tab === "report") body = `<div class="row" style="gap:8px;margin-bottom:10px"><span class="grow hint-text">A plain service history to print. For buyers, the <button class="linkbtn" data-go="report">bike history report</button> adds mods, odometer history and a share link.</span><button class="btn pri" id="mntPrint">${ic("download")} Print or save as PDF</button></div>${maintReport()}`;
    return `<div class="ph" data-own="1"><div class="eyebrow">Keep it running</div><h1>Maintenance log</h1><p>Every service, what's coming due, and a history you can hand to a buyer.</p><div class="act">${act}</div></div>
      <div class="kpis">
        <button class="kpi" id="mntOdoK"><span class="l">Odometer</span><span class="v">${o ? milesFmt(o.miles) : "—"}</span><span class="s">${o ? "miles · " + fmtDate(o.date) : "not logged yet"}</span></button>
        <button class="kpi ${over ? "red" : ""}" data-mtab="schedule"><span class="l">Overdue</span><span class="v">${over}</span><span class="s">${soon} due soon</span></button>
        <button class="kpi" data-mtab="history"><span class="l">Services logged</span><span class="v">${done.length}</span><span class="s">${done[0] ? "last " + fmtDate(done[0].date) : "none yet"}</span></button>
        <button class="kpi" data-mtab="history"><span class="l">Spent this year</span><span class="v">${money(mm.year)}</span><span class="s">${money(mm.total)} all time</span></button>
        <div class="kpi" style="cursor:default"><span class="l">Cost per mile</span><span class="v">${mm.perMile != null ? "$" + mm.perMile.toFixed(2) : "—"}</span><span class="s">${mm.span ? "over " + milesFmt(mm.span) + " mi" : "needs two readings"}</span></div>
      </div>
      <div class="tabs">${tabs.map(([k, l]) => `<button data-tab="${k}" class="${tab === k ? "on" : ""}">${l}</button>`).join("")}</div>${body}`;
  },
  bind(root) {
    bindTables(root);
    $$("[data-tab],[data-mtab]", root).forEach(b => b.onclick = () => { R.tab.maintenance = b.dataset.tab || b.dataset.mtab; render(false); });
    [$("#mntOdo", root), $("#mntOdoK", root)].forEach(b => b && (b.onclick = () => ME.canWrite ? logMileage() : null));
    $$("[data-presets]", root).forEach(b => b.onclick = addPresets);
    $$("[data-logfor]", root).forEach(b => b.onclick = () => logFor([b.dataset.logfor]));
    $$("[data-open]", root).forEach(b => { if (!b.onclick) b.onclick = () => { const [c, id] = b.dataset.open.split("|"); openRecord(c, id); }; });
    $("#mntMove", root) && ($("#mntMove", root).onclick = plannedToSchedule);
    const f = fstate("maintenance");
    $("#mtYear", root) && ($("#mtYear", root).onchange = e => { f.year = e.target.value; render(false); });
    $("#mtKind", root) && ($("#mtKind", root).onchange = e => { f.kind = e.target.value; render(false); });
    $("#mntCsv", root) && ($("#mntCsv", root).onclick = () => saveFile("revora-service-history-" + today() + ".csv", csvOf(svcDone().map(r => ({ ...r, items: (r.items || []).map(id => S.schedule[id]?.name || id).join("; "), total: svcCost(r) })), ["date", "odometer", "service", "kind", "items", "doneBy", "shop", "laborHours", "partsUsed", "partsCost", "laborCost", "total", "receipt", "notes"].map(k => ({ k, label: k }))), "text/csv"));
    $("#mntPrint", root) && ($("#mntPrint", root).onclick = () => { document.body.classList.add("printing-report"); window.print(); setTimeout(() => document.body.classList.remove("printing-report"), 500); });
  }
};
