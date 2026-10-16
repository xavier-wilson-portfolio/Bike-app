/* ============ Seasonal checklists: spring wake-up, winter storage, before every ride, before a long trip ============ */
GUIDE.checklists = { eyebrow: "Keep it running", title: "Checklists", sub: "Step-by-step lists for the jobs that come round every year, and a quick check before you ride.",
  how: ["Start a checklist and tick items off as you go. You can stop and come back to it.", "Something wrong? Press Problem and it goes on your jobs list.", "When you finish, you can log it as a service so it shows in the bike's history."] };
const hasChain = () => (BIKE.drive ? BIKE.drive === "chain" : !/belt|shaft|cvt/.test(String(meta().drive || ""))) && BIKE.style !== "scooter";
const isLiquid = () => !/air-cooled|air cooled/i.test(String(BIKE.engine || "")) && BIKE.cooling !== "air";
const CL_TPL = {
  spring: { t: "Spring wake-up", i: "bulb", months: [2, 3, 4, 5], when: "After winter storage, before the first ride", items: () => [
    ["battery", "Charge and test the battery", "Fit it back if it was on a charger. Check the terminals are clean and tight."],
    ["fuel", "Check the fuel", "If it wasn't stabilized, drain old fuel. Look for leaks at the lines and petcock or pump."],
    ["oil", "Check the oil level and look", "Milky or very dark oil gets changed now. Look under the engine for leaks."],
    isLiquid() ? ["cool", "Check the coolant level", "Check it cold, at the reserve tank. Top up with the type the manual gives."] : null,
    ["brakes", "Check both brakes", "Fluid level and color, pad thickness, and a firm lever and pedal. Brake fluid over two years old gets changed."],
    ["tires", "Set tire pressures and look over the tires", "Cold pressures from the manual or the label. Look for cracks and flat spots, and read the date code."],
    hasChain() ? ["chain", "Clean, lube and adjust the chain", "Clean it, lube it, then set the slack to the manual's figure."] : ["drive", "Check the final drive", "Belt: tension and condition. Shaft: look for oil leaks at the rear drive."],
    ["cables", "Work the controls", "Throttle snaps shut at both steering locks, clutch frees, and the cables move smoothly."],
    ["lights", "Test every light and the horn", "Headlight high and low, signals, tail and the brake light from the lever and the pedal."],
    ["nests", "Look for mouse nests and blocked pipes", "Check the airbox and the exhaust ends. Mice love a stored bike."],
    ["fasteners", "Check the important bolts", "Axles, levers, mirrors and the side stand."],
    ["ride", "Short shakedown ride", "Ride gently around the block. Test the brakes at walking speed first."]].filter(Boolean) },
  winter: { t: "Winter storage", i: "box", months: [9, 10, 11, 12], when: "Before the bike sits for the winter", items: () => [
    ["wash", "Wash and dry it", "Get the road salt and bugs off. Dry it fully so nothing corrodes."],
    ["oil", "Change the oil and filter", "Old oil has acids in it that sit on the engine all winter. Fresh oil now is better than in spring."],
    ["fuel", "Fill the tank and add stabilizer", "A full tank stops rust inside. Run the engine a few minutes so treated fuel reaches the carbs or injectors."],
    ["battery", "Battery on a maintainer", "Take it out, or leave it in and connect a smart maintainer. A battery that goes flat in the cold can freeze and crack."],
    ["tires", "Pump the tires up and get the weight off them", "Bring them to full pressure. A center stand or paddock stands stop flat spots."],
    hasChain() ? ["chain", "Lube the chain", "A fresh coat keeps rust off over the winter."] : null,
    isLiquid() ? ["cool", "Check the coolant's freeze protection", "Use a coolant tester. Weak coolant can freeze and crack the engine."] : null,
    ["seal", "Plug the exhaust and intake", "A rag or plug in the exhaust and airbox keeps mice out. Put a tag on the bars so you remember to remove them."],
    ["cover", "Cover it with a breathable cover", "Plastic traps moisture. Keep it somewhere dry if you can."],
    ["papers", "Check insurance and registration", "Some insurers let you drop to storage cover over winter."]].filter(Boolean) },
  ride: { t: "Before you ride", i: "check", months: [], when: "A two-minute check before every ride", items: () => [
    ["tires", "Tires and wheels", "Pressure looks right, no cuts or nails, wheels spin freely."],
    ["controls", "Controls", "Levers, cables and throttle work smoothly. Throttle snaps shut."],
    ["lights", "Lights and horn", "Headlight, signals, brake light from both brakes, horn."],
    ["oil", "Oil and fluids", "Oil level, no fresh drips under the bike, brake fluid levels."],
    ["chassis", "Chassis", hasChain() ? "Chain slack and lube, suspension, nothing loose." : "Suspension, nothing loose or rattling."],
    ["stands", "Stands", "Side stand springs up, center stand tucked away."]] },
  trip: { t: "Before a long trip", i: "calendar", months: [], when: "A week before a big ride", items: () => [
    ["service", "Nothing due on the schedule", "Do anything coming due in the next couple of thousand miles before you leave."],
    ["tires", "Enough tread for the whole trip", "Work out the miles. New tires before a trip beat a worn tire halfway."],
    hasChain() ? ["chain", "Chain and sprockets in good shape", "Check wear and slack. Bring lube."] : null,
    ["brakes", "Brake pads have plenty left", "Check both ends."],
    ["luggage", "Load and mounts", "Luggage mounts tight, load balanced and under the bike's limit. Set preload for the weight."],
    ["tools", "Tools and spares", "Tire repair kit and pump, the bike's tool kit, fuses, a bit of wire and zip ties."],
    ["papers", "Papers in date", "Registration, insurance card and roadside assistance number with you."],
    ["phone", "Phone mount and charging", "Test the charger and the mount before you go."]].filter(Boolean) },
};
const CL_ORDER = ["ride", "spring", "winter", "trip"];
const clMeta = () => meta().checklists || {};
const clItems = k => CL_TPL[k].items().concat((clMeta().custom || {})[k] || []);
async function clSave(patch) { const m = clone(meta()); m.checklists = Object.assign({}, m.checklists || {}, patch); await store.put("meta", m, { noLog: true }); }
const clActive = () => (clMeta().runs || []).find(r => !r.finished);
const clLast = k => (clMeta().runs || []).filter(r => r.tpl === k && r.finished).sort((a, b) => String(b.finished).localeCompare(String(a.finished)))[0];
function clSeasonal() {
  const mo = new Date().getMonth() + 1, y = today().slice(0, 4);
  return ["spring", "winter"].find(k => CL_TPL[k].months.includes(mo) && !(clLast(k) && String(clLast(k).finished).startsWith(y)) && !(clMeta().snooze || {})[k + y]);
}
// home page nudge in season, until it's done or dismissed for the year
(function () { const h = VIEWS.home; if (!h) return; const r0 = h.render;
  h.render = function () { const k = clSeasonal(); return (k && !clActive() ? `<div class="cl-nudge"><span class="cl-ni">${ic(CL_TPL[k].i)}</span><span><b>Time for the ${esc(CL_TPL[k].t.toLowerCase())} checklist</b><small>${esc(CL_TPL[k].when)}. ${clItems(k).length} steps.</small></span><button class="btn sm pri" data-cl-start="${k}">Start</button><button class="linkbtn" data-cl-snooze="${k}">Not this year</button></div>` : "") + r0.call(this); }; })();
async function clStart(k) {
  if (!ME.canWrite) return; const runs = (clMeta().runs || []).filter(r => r.finished || r.tpl !== k);
  const od = odoNow(); const run = { id: "CL" + Date.now().toString(36), tpl: k, started: new Date().toISOString(), odo: od ? Math.round(od.miles) : 0, done: {}, problems: {} };
  await clSave({ runs: runs.concat([run]).slice(-40) }); R.f.clOpen = run.id; go("checklists");
}
document.addEventListener("click", async e => {
  const s = e.target.closest("[data-cl-start]"); if (s) { e.preventDefault(); clStart(s.dataset.clStart); return; }
  const z = e.target.closest("[data-cl-snooze]"); if (z) { e.preventDefault(); const sn = Object.assign({}, clMeta().snooze || {}); sn[z.dataset.clSnooze + today().slice(0, 4)] = 1; await clSave({ snooze: sn }); }
});

VIEWS.checklists = {
  render() {
    const W = ME.canWrite, runs = clMeta().runs || [], act = runs.find(r => r.id === R.f.clOpen && !r.finished) || clActive(), season = clSeasonal();
    if (act) {
      const tp = CL_TPL[act.tpl], items = clItems(act.tpl), dn = items.filter(([k]) => act.done[k]).length, pct = items.length ? dn / items.length : 0;
      const r = 26, c = 2 * Math.PI * r;
      return `<div class="ph" data-own="1"><div class="eyebrow">Checklist</div><h1>${esc(tp.t)}</h1><p>${esc(tp.when)}. Started ${esc(fmtTime(act.started))}.</p></div>
        <div class="cl-run"><div class="cl-head"><svg class="mh-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="bg"/><circle cx="32" cy="32" r="${r}" class="fg green" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct)).toFixed(1)}"/></svg>
          <div><b>${dn} of ${items.length} done</b><span class="muted">${dn === items.length ? "All done. Finish it to save it to the history." : "Tick each one as you go. It saves as you tick."}</span></div></div>
          <ol class="cl-items">${items.map(([k, t, how], i) => { const ok = act.done[k], pr = act.problems[k]; return `<li class="${ok ? "ok" : ""}${pr ? " pr" : ""}"><label><input type="checkbox" data-cl-tick="${esc(k)}" ${ok ? "checked" : ""} ${W ? "" : "disabled"}><span class="cl-n">${i + 1}</span><span class="cl-t"><b>${esc(t)}</b><small>${esc(how || "")}</small>${pr ? `<em>${ic("alert")} Added to your jobs</em>` : ""}</span></label>${W && !pr ? `<button class="linkbtn cl-pr" data-cl-prob="${esc(k)}">Problem</button>` : ""}</li>`; }).join("")}</ol>
          ${W ? `<form class="cl-add" data-cl-add><input name="t" placeholder="Add your own step to this checklist" aria-label="Add a step" autocomplete="off"><button class="btn sm" type="submit">Add</button></form>
          <div class="row" style="gap:8px;justify-content:space-between;flex-wrap:wrap;margin-top:12px"><button class="btn" data-cl-cancel>Stop and delete it</button><div class="row" style="gap:8px">${act.tpl !== "ride" ? `<label class="chk"><input type="checkbox" id="clLog" checked> Log it as a service</label>` : ""}<button class="btn pri" data-cl-finish ${dn ? "" : "disabled"}>${ic("check")} Finish</button></div></div>` : ""}</div>`;
    }
    const card = k => { const tp = CL_TPL[k], last = clLast(k); return `<button class="cl-card${season === k ? " hot" : ""}" data-cl-start="${k}" ${W ? "" : "disabled"}><span class="cl-ni">${ic(tp.i)}</span><b>${esc(tp.t)}</b><small>${esc(tp.when)}</small><span class="cl-meta">${clItems(k).length} steps${last ? " · last done " + esc(fmtDate(String(last.finished).slice(0, 10))) : ""}</span>${season === k ? `<span class="cl-due">Due now</span>` : ""}</button>`; };
    const hist = runs.filter(r => r.finished).sort((a, b) => String(b.finished).localeCompare(String(a.finished))).slice(0, 12);
    return `<div class="ph" data-own="1"><div class="eyebrow">Keep it running</div><h1>Checklists</h1><p>Step-by-step lists for the jobs that come round every year, and a quick check before you ride.</p></div>
      <div class="cl-grid">${CL_ORDER.map(card).join("")}</div>
      <section class="mh-panel" style="margin-top:16px"><div class="mh-ph"><h2><span class="mh-hi">${ic("clock")}</span>Done before</h2></div>
        ${hist.length ? `<ol class="mh-tl">${hist.map(r => { const items = clItems(r.tpl), d = items.filter(([k]) => r.done[k]).length, pb = Object.keys(r.problems || {}).length; return `<li><div class="mh-tli"><span class="mh-tld">${esc(fmtDate(String(r.finished).slice(0, 10)))}${r.odo ? " · " + milesFmt(r.odo) + " mi" : ""}</span><b>${esc(CL_TPL[r.tpl].t)}</b><span class="faint">${d} of ${items.length} done${pb ? " · " + pb + " problem" + (pb === 1 ? "" : "s") + " found" : ""}</span></div></li>`; }).join("")}</ol>` : `<p class="muted" style="margin:0">Finished checklists show here with the date and mileage.</p>`}</section>`;
  },
  bind(root) {
    bindTables(root);
    const act = () => (clMeta().runs || []).find(r => r.id === R.f.clOpen && !r.finished) || clActive();
    const up = async fn => { const runs = clone(clMeta().runs || []), r = runs.find(x => x.id === act().id); fn(r, runs); await clSave({ runs }); };
    $$("[data-cl-tick]", root).forEach(c => c.onchange = () => up(r => { if (c.checked) r.done[c.dataset.clTick] = new Date().toISOString(); else delete r.done[c.dataset.clTick]; }));
    $$("[data-cl-prob]", root).forEach(b => b.onclick = async () => { const a = act(), it = clItems(a.tpl).find(x => x[0] === b.dataset.clProb);
      const t = blank("tasks", { title: (it ? it[1] : "Checklist item") + ": problem found", notes: "Found during the " + CL_TPL[a.tpl].t.toLowerCase() + " checklist on " + fmtDate(today()) + "." });
      await store.put("tasks", t, { action: "added a job from a checklist" }); await up(r => { r.problems[b.dataset.clProb] = t.id; }); toast("Added to your jobs list."); });
    const f = $("[data-cl-add]", root); if (f) f.onsubmit = async e => { e.preventDefault(); const v = f.t.value.trim(); if (!v) return; const a = act(), cu = clone(clMeta().custom || {}); cu[a.tpl] = (cu[a.tpl] || []).concat([["u" + Date.now().toString(36), v.slice(0, 100), "Your own step"]]); await clSave({ custom: cu }); };
    const cn = $("[data-cl-cancel]", root); if (cn) cn.onclick = () => confirmBox("Stop this checklist?", "<p style='margin:0'>It's deleted, and nothing goes in the history.</p>", "Stop it", async () => { const id = act().id; await clSave({ runs: (clMeta().runs || []).filter(r => r.id !== id) }); R.f.clOpen = null; });
    const fin = $("[data-cl-finish]", root); if (fin) fin.onclick = async () => { const a = act(), log = $("#clLog", root) && $("#clLog", root).checked, items = clItems(a.tpl);
      await up(r => { r.finished = new Date().toISOString(); }); R.f.clOpen = null;
      if (log) { const od = odoNow(), done = items.filter(([k]) => a.done[k]).map(x => x[1]);
        await store.put("maintenance", blank("maintenance", { service: CL_TPL[a.tpl].t, date: today(), odometer: od ? Math.round(od.miles) : 0, kind: "Inspection", partsUsed: "", notes: "Checklist: " + done.join("; ") }), { action: "finished the " + CL_TPL[a.tpl].t.toLowerCase() + " checklist" }); }
      toast(CL_TPL[a.tpl].t + " done." + (log ? " Logged in the Maintenance log." : "")); };
  }
};
