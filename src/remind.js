/* ============ Service reminders: riding pace, predicted due dates, how and when you're reminded ============ */
const REM_DEFAULT = { email: false, to: "", daysAhead: 14, milesAhead: 250, odoNudge: true, monthlyMiles: 0 };
const remSettings = () => Object.assign({}, REM_DEFAULT, (meta().reminders) || {});
const DAY = 864e5;

/* how far the bike goes per day: from the odometer readings and service mileages over the last year, or what the rider told us */
function ridePace() {
  const set = remSettings();
  const pts = sorted("mileage").map(r => ({ miles: n(r.miles), date: r.date })).concat(svcDone().filter(r => n(r.odometer)).map(r => ({ miles: n(r.odometer), date: r.date })), sorted("fuel").map(r => ({ miles: n(r.odometer), date: r.date })))
    .filter(p => p.miles && p.date).sort((a, b) => a.date.localeCompare(b.date));
  const cut = addDays(today(), -400), recent = pts.filter(p => p.date >= cut);
  let fromReadings = null;
  if (recent.length >= 2) {
    const a = recent[0], b = recent.reduce((x, y) => (y.miles >= x.miles ? y : x)), days = daysBetween(a.date, b.date);
    if (days >= 14 && b.miles > a.miles) fromReadings = { perDay: (b.miles - a.miles) / days, days, count: recent.length };
  }
  if (n(set.monthlyMiles) > 0) return { perDay: n(set.monthlyMiles) / 30.44, source: "you", readings: fromReadings };
  if (fromReadings) return { perDay: fromReadings.perDay, source: "readings", days: fromReadings.days, count: fromReadings.count, readings: fromReadings };
  return { perDay: 0, source: null, readings: null };
}
const perMonth = p => Math.round(p.perDay * 30.44);

/* when each schedule item will come due: by the calendar, or by mileage at the rider's pace, whichever is first */
function forecastAll() {
  const o = odoNow(), pace = ridePace(), set = remSettings(), t = today();
  return sorted("schedule").map(it => {
    const st = svcState(it, o); let byMiles = null, byTime = st.nextDate || null;
    if (st.milesLeft != null && pace.perDay > 0) {
      const sinceRead = o ? Math.max(0, daysBetween(o.date, t)) : 0;
      const left = st.milesLeft - pace.perDay * sinceRead;
      byMiles = addDays(t, Math.round(left / pace.perDay));
    }
    const due = [byMiles, byTime].filter(Boolean).sort()[0] || null;
    const basis = !due ? null : due === byTime && byTime !== byMiles ? "time" : "miles";
    let remind = null;
    if (due) {
      const byDays = addDays(due, -n(set.daysAhead));
      const byMi = basis === "miles" && pace.perDay > 0 ? addDays(due, -Math.round(n(set.milesAhead) / pace.perDay)) : null;
      remind = [byDays, byMi].filter(Boolean).sort()[0];
      if (remind < t) remind = t;
    }
    return { it, st, due, basis, byMiles, byTime, remind };
  });
}
const fmtShort = iso => { if (!iso) return ""; const d = new Date(iso + "T12:00:00"); return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined }); };

/* a calendar file with every predicted due date, each with an alert before it */
function remindersIcs() {
  const set = remSettings(), stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const esc2 = s => String(s || "").replace(/[\\,;]/g, m => "\\" + m).replace(/\n/g, "\\n");
  const ev = forecastAll().filter(f => f.due).map(f => {
    const d = f.due.replace(/-/g, ""), d2 = addDays(f.due, 1).replace(/-/g, "");
    const how = f.basis === "miles" ? `Estimated from your riding pace (${perMonth(ridePace())} mi a month).` : "Due by the calendar.";
    return ["BEGIN:VEVENT", `UID:${f.it.id}-${d}@revora`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d2}`,
      `SUMMARY:${esc2(BIKE.short + ": " + f.it.name)}`, `DESCRIPTION:${esc2(`${f.it.name} for your ${BIKE.name}. Every ${everyTxt(f.it)}. ${how} Log it in Revora when it's done.`)}`,
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc2(f.it.name + " is coming due")}`, `TRIGGER:-P${Math.max(0, n(set.daysAhead))}D`, "END:VALARM", "END:VEVENT"].join("\r\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Revora//Service reminders//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${esc2(BIKE.name + " service")}`, ...ev, "END:VCALENDAR"].join("\r\n");
}

async function saveRem(patch, quiet) {
  const m = clone(meta()); m.reminders = Object.assign(remSettings(), patch);
  await store.put("meta", m, { action: "updated service reminders", noLog: true });
  if (!quiet) toast("Reminder settings saved");
}

VIEWS.reminders = {
  render() {
    const set = remSettings(), pace = ridePace(), o = odoNow(), W = ME.canWrite, t = today();
    const fc = forecastAll(), dated = fc.filter(f => f.due).sort((a, b) => a.due.localeCompare(b.due)), undated = fc.filter(f => !f.due);
    const soon = dated.filter(f => daysBetween(t, f.due) <= 30).length, lastRead = o ? daysBetween(o.date, t) : null;
    const reads = sorted("mileage").map(r => ({ miles: n(r.miles), date: r.date, src: r.note || "" })).concat(svcDone().filter(r => n(r.odometer)).map(r => ({ miles: n(r.odometer), date: r.date, src: r.service }))).filter(r => r.date).sort((a, b) => b.date.localeCompare(a.date) || b.miles - a.miles).slice(0, 5);
    const months = {}; dated.forEach(f => { const k = f.due.slice(0, 7); (months[k] = months[k] || []).push(f); });
    const monthName = k => new Date(k + "-15T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const emailTo = (window.RV_CLOUD && RV_CLOUD.user && RV_CLOUD.user.email) || "";   // reminders only ever go to the signed-in account's own email
    const row = f => { const [col, lbl] = SVC_PILL[f.st.status]; const days = daysBetween(t, f.due);
      return `<div class="rm-item ${f.st.status}"><div class="rm-date"><b>${new Date(f.due + "T12:00:00").getDate()}</b><span>${new Date(f.due + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}</span></div>
        <div class="rm-body"><button class="linkbtn rm-name" data-open="schedule|${esc(f.it.id)}">${esc(f.it.name)}</button>
          <span class="faint">${days < 0 ? Math.abs(days) + " days overdue" : days === 0 ? "Due today" : "In " + days + " days"} · ${f.basis === "miles" ? `by mileage, at about ${milesFmt(f.st.nextMiles)} mi` : "by the calendar"}${f.remind && f.remind > t ? ` · reminder ${fmtShort(f.remind)}` : ""}</span></div>
        ${pill(col, lbl)}${W ? `<button class="btn sm${f.st.status === "over" || f.st.status === "soon" ? " pri" : ""}" data-logfor="${esc(f.it.id)}">${ic("check")} Log it</button>` : ""}</div>`; };
    return `<div class="ph" data-own="1"><div class="eyebrow">Reminders</div><h1>Service reminders</h1><p>When each service on your ${esc(BIKE.short)} comes due, worked out from your schedule and how much you ride.</p></div>
      <section class="rm">
        <div class="rm-top">
          <div class="rm-card rm-pace"><div class="rm-k">${ic("gauge")} Your riding pace</div>
            <div class="rm-big">${pace.perDay ? milesFmt(perMonth(pace)) + "<small> mi / month</small>" : "Not known yet"}</div>
            <p class="muted">${pace.source === "you" ? "Using the number you set." + (pace.readings ? ` Your readings say about ${milesFmt(Math.round(pace.readings.perDay * 30.44))} mi a month.` : "") : pace.source === "readings" ? `From ${pace.count} readings over ${pace.days} days. It updates every time you log a reading or a service.` : "Log two odometer readings at least two weeks apart, or tell us roughly how much you ride."}</p>
            ${W ? `<div class="rm-pace-in"><label>About how many miles a month?<input type="number" inputmode="numeric" min="0" step="50" id="rmMonthly" value="${n(set.monthlyMiles) || ""}" placeholder="${pace.readings ? Math.round(pace.readings.perDay * 30.44) : "e.g. 400"}"></label><button class="btn sm" id="rmPaceSave">Use this</button></div>
            <button class="btn sm mh-sec2" data-rm="odo">${ic("gauge")} Update odometer${lastRead != null ? ` <span class="faint">(last ${lastRead === 0 ? "today" : lastRead + " days ago"})</span>` : ""}</button>` : ""}
          </div>
          <div class="rm-card rm-how"><div class="rm-k">${ic("bell")} How you're reminded</div>
            <div class="rm-opt"><div><b>Email</b><span class="muted">An email ${n(set.daysAhead)} days before anything is due, or ${milesFmt(set.milesAhead)} miles before at your pace.</span></div>
              <label class="rm-sw"><input type="checkbox" id="rmEmail" ${set.email ? "checked" : ""} ${W ? "" : "disabled"}><span></span></label></div>
            ${set.email ? `<div class="rm-email"><span class="rm-to">Sent to <b>${esc(emailTo || "your account email")}</b></span><span class="tag">Emails go out in the morning when something comes due</span></div>` : ""}
            <div class="rm-grid"><label>Remind me<select id="rmDays" ${W ? "" : "disabled"}>${[3, 7, 14, 21, 30].map(d => `<option value="${d}" ${n(set.daysAhead) === d ? "selected" : ""}>${d} days before</option>`).join("")}</select></label>
              <label>or<select id="rmMiles" ${W ? "" : "disabled"}>${[100, 250, 500, 1000].map(d => `<option value="${d}" ${n(set.milesAhead) === d ? "selected" : ""}>${milesFmt(d)} mi before</option>`).join("")}</select></label></div>
            <label class="rm-check"><input type="checkbox" id="rmNudge" ${set.odoNudge ? "checked" : ""} ${W ? "" : "disabled"}> Nudge me to update the odometer if it's been a month</label>
            <div class="rm-cal"><div><b>Your calendar</b><span class="muted">Put every due date in Google, Apple or Outlook calendar, each with an alert ${n(set.daysAhead)} days ahead.</span></div><button class="btn mh-pri" id="rmIcs" ${dated.length ? "" : "disabled"}>${ic("calendar")} Add to my calendar</button></div>
          </div>
        </div>
        ${set.odoNudge && (lastRead == null || lastRead > 30) && W ? `<div class="rm-nudge">${ic("gauge")}<span><b>${lastRead == null ? "No odometer reading yet." : "It's been " + lastRead + " days since the last odometer reading."}</b> A quick reading keeps the mileage-based due dates accurate.</span><button class="btn sm" data-rm="odo">Update now</button></div>` : ""}
        <div class="rm-stats"><div><b>${dated.length}</b><span>items with a due date</span></div><div class="${soon ? "hot" : ""}"><b>${soon}</b><span>due in the next 30 days</span></div><div><b>${dated[0] ? fmtShort(dated[0].due) : "—"}</b><span>next due</span></div><div><b>${undated.length}</b><span>need a start point</span></div></div>
        <div class="rm-cols">
          <section class="mh-panel p-due"><div class="mh-ph"><h2><span class="mh-hi">${ic("calendar")}</span>What's coming</h2><button class="linkbtn" data-go="maintenance">Edit schedule ${ic("next")}</button></div>
            ${dated.length ? Object.entries(months).map(([k, fs]) => `<div class="rm-month"><div class="rm-mh">${esc(monthName(k))}</div>${fs.map(row).join("")}</div>`).join("")
              : `<div class="mh-empty"><b>Nothing to predict yet</b><span class="muted">Add a service schedule and when each item was last done. Revora works out the rest.</span>${W ? `<div class="row" style="gap:8px;flex-wrap:wrap">${sorted("schedule").length ? "" : `<button class="btn mh-pri" data-rm="presets">Add a typical schedule</button>`}<button class="btn" data-go="maintenance">Open the schedule</button></div>` : ""}</div>`}
          </section>
          <div class="rm-side">${undated.length ? `<section class="mh-panel p-hist"><div class="mh-ph"><h2><span class="mh-hi">${ic("alert")}</span>Can't predict yet</h2></div>
            <p class="muted" style="margin:0">These need to know when they were last done${pace.perDay ? "" : ", or your riding pace"}.</p>
            ${undated.map(f => `<div class="rm-und"><button class="linkbtn rm-name" data-open="schedule|${esc(f.it.id)}">${esc(f.it.name)}</button><span class="faint">every ${everyTxt(f.it)}</span>${W ? `<button class="btn sm" data-open="schedule|${esc(f.it.id)}">Set last done</button>` : ""}</div>`).join("")}</section>` : ""}
          <section class="mh-panel p-jobs"><div class="mh-ph"><h2><span class="mh-hi">${ic("gauge")}</span>Odometer readings</h2>${W ? `<button class="linkbtn" data-rm="odo">${ic("plus")} Add</button>` : ""}</div>
            ${reads.length ? `<ol class="rm-reads">${reads.map(r => `<li><b>${milesFmt(r.miles)} mi</b><span class="faint">${esc(fmtShort(r.date))}${r.src ? " · " + esc(r.src) : ""}</span></li>`).join("")}</ol>` : `<p class="muted" style="margin:0">No readings yet. Each one sharpens the dates on the left.</p>`}
            <p class="faint" style="margin:0;font-size:12.5px">Dates by mileage use your pace from these readings. Dates by the calendar come from each item's months interval. Whichever comes first wins.</p>
          </section></div>
        </div>
      </section>`;
  },
  bind(root) {
    $$("[data-logfor]", root).forEach(b => b.onclick = () => logFor([b.dataset.logfor]));
    $$("[data-rm]", root).forEach(b => b.onclick = () => b.dataset.rm === "odo" ? logMileage() : addPresets());
    const v = id => $("#" + id, root);
    if (v("rmPaceSave")) v("rmPaceSave").onclick = () => saveRem({ monthlyMiles: Math.max(0, n(v("rmMonthly").value)) });
    if (v("rmEmail")) v("rmEmail").onchange = () => saveRem({ email: v("rmEmail").checked, owner: window.RV_CLOUD && RV_CLOUD.user ? RV_CLOUD.user.id : "", to: remSettings().to || (window.RV_CLOUD && RV_CLOUD.user && RV_CLOUD.user.email) || "" }, true).then(() => toast(v("rmEmail")?.checked === false ? "Email reminders off" : "Email reminders on. You'll get an email when something comes due."));
    if (v("rmDays")) v("rmDays").onchange = () => saveRem({ daysAhead: n(v("rmDays").value) });
    if (v("rmMiles")) v("rmMiles").onchange = () => saveRem({ milesAhead: n(v("rmMiles").value) });
    if (v("rmNudge")) v("rmNudge").onchange = () => saveRem({ odoNudge: v("rmNudge").checked });
    if (v("rmIcs")) v("rmIcs").onclick = () => saveFile(BIKE.short.replace(/[^\w-]+/g, "-") + "-service.ics", remindersIcs(), "text/calendar");
    bindTables(root);
  }
};

/* the due text everywhere also says roughly when, once Revora knows the riding pace */
(function () {
  const base = dueTxt;
  dueTxt = function (st) {
    const s = base(st);
    if (st.milesLeft == null || st.milesLeft <= 0 || st.status === "none" || st.status === "nointerval") return s;
    const p = ridePace(); if (!p.perDay) return s;
    const when = addDays(today(), Math.round(st.milesLeft / p.perDay));
    if (st.nextDate && st.nextDate < when) return s;
    return s + " · about " + fmtShort(when);
  };
})();

/* ---------- email delivery: keep this bike's upcoming reminders in the reminder_queue table; a daily worker sends them ---------- */
function remRows() {
  const set = remSettings(), t = today(), rows = [];
  if (!set.email || !(window.RV_CLOUD && RV_CLOUD.user && RV_CLOUD.user.email)) return rows;
  forecastAll().filter(f => f.due && f.remind).forEach(f => {
    const days = daysBetween(t, f.due);
    rows.push({ send_on: f.remind, due_on: f.due, kind: "service", item_key: f.it.id, title: `${BIKE.short}: ${f.it.name} ${days < 0 ? "is overdue" : "is coming due"}`,
      body: `${f.it.name} (every ${everyTxt(f.it)}) is due ${days < 0 ? "since " : "around "}${fmtShort(f.due)}${f.basis === "miles" && f.st.nextMiles ? `, at about ${milesFmt(f.st.nextMiles)} mi` : ""}.` });
  });
  if (set.odoNudge) { const o = odoNow(), next = o ? addDays(o.date, 30) : t; rows.push({ send_on: next < t ? t : next, due_on: null, kind: "odometer", item_key: "odometer", title: `${BIKE.short}: time for an odometer reading`, body: "A quick reading keeps your mileage-based due dates accurate. Open Revora and tap Update odometer." }); }
  return rows;
}
let remSyncT = null, remSyncLast = "", remSyncOff = false;
async function syncReminders() {
  const C = window.RV_CLOUD; if (!C || !C.sb || remSyncOff || !store.ready) return;
  const set = remSettings(); if (set.owner && set.owner !== C.user.id) return;          // only the person who switched email on sends them
  const rows = remRows().map(r => Object.assign(r, { project_id: C.projectId, email: RV_CLOUD.user.email, bike: BIKE.name }));
  const sig = JSON.stringify(rows); if (sig === remSyncLast) return;
  const del = await C.sb.from("reminder_queue").delete().eq("project_id", C.projectId).eq("user_id", C.user.id).is("sent_at", null);
  if (del.error) { if (/reminder_queue|relation|schema cache|404/i.test(del.error.message || "")) remSyncOff = true; return; }
  // never send the same reminder twice: skip anything already emailed for that item and due date
  const sent = await C.sb.from("reminder_queue").select("item_key,due_on,send_on").eq("project_id", C.projectId).eq("user_id", C.user.id).not("sent_at", "is", null);
  const done = new Set((sent.data || []).map(r => r.item_key + "|" + (r.item_key === "odometer" ? r.send_on : r.due_on)));
  const fresh = rows.filter(r => !done.has(r.item_key + "|" + (r.kind === "odometer" ? r.send_on : r.due_on)));
  if (fresh.length) { const ins = await C.sb.from("reminder_queue").insert(fresh); if (ins.error) return; }
  remSyncLast = sig;
}
(function () { const base = render; render = function (full) { base(full); clearTimeout(remSyncT); remSyncT = setTimeout(() => syncReminders().catch(() => {}), 2500); }; })();
