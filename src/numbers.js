/* ============ My bike's numbers: the specs you look up every time you wrench ============
   The owner types them in from the service manual. Revora never fills in torque values, gaps or capacities itself. */
const NUM_GROUPS = [
  ["Engine", "engine", [["oil", "Engine oil", "e.g. 10W-40 full synthetic"], ["oilCap", "Oil with filter change", "e.g. 3.4 qt"], ["oilCapNo", "Oil without filter", "e.g. 3.2 qt"], ["oilFilter", "Oil filter", "e.g. part number or brand"], ["plug", "Spark plug", "e.g. NGK CR8E"], ["plugGap", "Plug gap", "e.g. 0.7–0.8 mm"], ["valveIn", "Valve clearance, intake", "e.g. 0.10–0.15 mm"], ["valveEx", "Valve clearance, exhaust", "e.g. 0.20–0.25 mm"], ["coolant", "Coolant", "type and capacity"], ["airFilter", "Air filter", "part number or brand"], ["idle", "Idle speed", "e.g. 1,300 rpm"]]],
  ["Chain and drive", "route", [["chain", "Chain", "e.g. 525 x 118 links"], ["slack", "Chain slack", "e.g. 20–30 mm"], ["sprockets", "Sprockets", "e.g. 15 front / 45 rear"], ["finalOil", "Final drive or gear oil", "for shaft-drive bikes"]]],
  ["Brakes and suspension", "shield", [["brakeFluid", "Brake fluid", "e.g. DOT 4"], ["padsF", "Front pads", "brand or part number"], ["padsR", "Rear pads", "brand or part number"], ["forkOil", "Fork oil", "weight and level or amount"], ["shock", "Shock settings", "preload, rebound, your setup"]]],
  ["Tires", "wheel", [["tireF", "Front tire size", "e.g. 110/80R19"], ["tireR", "Rear tire size", "e.g. 150/70R17"], ["psiF", "Front pressure", "e.g. 36 psi solo, 36 two-up"], ["psiR", "Rear pressure", "e.g. 36 psi solo, 42 two-up"]]],
  ["Electrical", "bolt", [["battery", "Battery", "e.g. YTX12-BS"], ["headlight", "Headlight bulb", "e.g. H4"], ["fuses", "Fuses", "sizes and where the box is"]]]];
const numRec = () => (S.meta && S.meta.numbers) || { id: "numbers", f: {}, torque: [], notes: "" };
async function numSave(patch) { const r = Object.assign(clone(numRec()), patch); r.id = "numbers"; await store.put("meta", r, { noLog: true, silent: true }); }
VIEWS.numbers = {
  render() {
    const r = numRec(), f = r.f || {}, W = ME.canWrite, dis = W ? "" : "disabled", filled = NUM_GROUPS.reduce((s, g) => s + g[2].filter(([k]) => (f[k] || "").trim()).length, 0) + (r.torque || []).length;
    return `<div class="ph" data-own="1"><div class="eyebrow">Records</div><h1>My bike's numbers</h1><p>The specs you look up every time you work on the ${esc(BIKE.short || BIKE.name)}: oil, gaps, clearances, pressures and torque values. Fill them in once from your service manual and they're here whenever you need them.</p></div>
      <div class="num-note">${ic("alert")}<span>Copy these from the factory service manual or your owner's manual for your exact bike. Revora doesn't fill them in for you, because a wrong torque value or clearance can do real damage.</span></div>
      <div class="num-grid">${NUM_GROUPS.map(([t, i, rows]) => `<section class="mh-panel num-card"><div class="mh-ph"><h2><span class="mh-hi">${ic(i)}</span>${esc(t)}</h2></div>
        ${rows.map(([k, l, ph]) => `<label class="num-row"><span>${esc(l)}</span><input data-numf="${k}" value="${esc(f[k] || "")}" placeholder="${esc(ph)}" maxlength="120" ${dis}></label>`).join("")}</section>`).join("")}
        <section class="mh-panel num-card num-wide"><div class="mh-ph"><h2><span class="mh-hi">${ic("wrench")}</span>Torque specs</h2>${W ? `<button class="btn sm" id="numAddT">${ic("plus")} Add one</button>` : ""}</div>
          ${(r.torque || []).length ? `<div class="num-tq"><div class="num-tqh"><span>Fastener</span><span>Torque</span><span>Note</span><span></span></div>${r.torque.map((t, i) => `<div class="num-tqr" data-i="${i}"><input data-tq="what" value="${esc(t.what)}" placeholder="e.g. Oil drain bolt" ${dis}><input data-tq="value" value="${esc(t.value)}" placeholder="e.g. 21 N·m (15 ft-lb)" ${dis}><input data-tq="note" value="${esc(t.note)}" placeholder="e.g. new crush washer" ${dis}>${W ? `<button class="btn sm" data-tqdel="${i}" aria-label="Remove">${ic("x")}</button>` : "<span></span>"}</div>`).join("")}</div>`
            : `<p class="muted" style="margin:0">Add the ones you use most: drain bolt, axle nuts, caliper bolts, spark plugs, chain adjusters.</p>`}</section>
        <section class="mh-panel num-card num-wide"><div class="mh-ph"><h2><span class="mh-hi">${ic("book")}</span>Other notes</h2></div>
          <textarea id="numNotes" rows="4" maxlength="3000" placeholder="Anything else you look up: where the fuse box is, which socket fits the axle, the trick for getting the tank off." ${dis}>${esc(r.notes || "")}</textarea></section></div>
      <p class="faint" style="text-align:center;margin-top:14px;font-size:13px">${filled} saved. Everyone on this bike's team sees the same numbers.</p>`;
  },
  bind(root) {
    $$("[data-numf]", root).forEach(i => i.onchange = () => numSave({ f: Object.assign({}, numRec().f, { [i.dataset.numf]: i.value.trim() }) }).then(() => toast("Saved.")));
    $$("[data-tq]", root).forEach(i => i.onchange = () => { const t = clone(numRec().torque || []), k = +i.closest(".num-tqr").dataset.i; t[k] = Object.assign({}, t[k], { [i.dataset.tq]: i.value.trim() }); numSave({ torque: t }).then(() => toast("Saved.")); });
    $$("[data-tqdel]", root).forEach(b => b.onclick = async () => { const t = clone(numRec().torque || []); t.splice(+b.dataset.tqdel, 1); await numSave({ torque: t }); render(false); });
    const a = $("#numAddT", root); if (a) a.onclick = async () => { await numSave({ torque: (numRec().torque || []).concat([{ what: "", value: "", note: "" }]) }); render(false); const l = $$(".num-tqr input", document); if (l.length) l[l.length - 3].focus(); };
    const n2 = $("#numNotes", root); if (n2) n2.onchange = () => numSave({ notes: n2.value }).then(() => toast("Saved."));
  }
};
