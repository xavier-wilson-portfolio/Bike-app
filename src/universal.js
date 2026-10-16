/* ============ universal restoration courses: settings for the rider's own bike ============ */
const DRIVE_NAMES = { chain: "Chain", belt: "Belt", shaft: "Shaft", cvt: "Scooter CVT" };
if (UNIVERSAL) {
  // switch the final drive: the course's drive steps, parts, checks and schedule items swap over
  window.switchDrive = async function (to) {
    const from = meta().drive || BIKE.drive; if (!to || to === from) return;
    let data; try { const r = await fetch("packs/" + encodeURIComponent(BIKE.id) + "/baseline.json", { cache: "no-store" }); data = await r.json(); } catch (e) { toast("Couldn't load the course. Check your internet and try again.", "err"); return; }
    const A = data.drives[from] || {}, B = data.drives[to]; if (!B) return;
    const writes = [];
    Object.entries(A).forEach(([c, rows]) => { if (c === "steps") return; const keep = new Set((B[c] || []).map(r => r.id)); rows.forEach(r => { if (!keep.has(r.id) && S[c][r.id]) writes.push(["del", c, r.id]); }); });
    Object.entries(B).forEach(([c, rows]) => rows.forEach(r => writes.push(["put", c, r])));
    (A.steps || []).forEach(r => { if (!(B.steps || []).some(x => x.id === r.id) && S.steps[r.id]) writes.push(["del", "steps", r.id]); });
    setSave("busy");
    for (const [op, c, x] of writes) { if (op === "del") await store.del(c, x, { noLog: true }); }
    await store.bulk(writes.filter(w => w[0] === "put").map(([, c, rec]) => ({ c, rec })));
    const m = clone(meta()); m.drive = to; await store.put("meta", m, { action: "switched the final drive to " + DRIVE_NAMES[to].toLowerCase() });
    toast("Switched to " + DRIVE_NAMES[to].toLowerCase() + " drive. Reloading the course…");
    setTimeout(() => location.reload(), 900);
  };
  window.driveSettingsHtml = () => {
    const cur = meta().drive || BIKE.drive, opts = BIKE.drives || [];
    if (opts.length < 2) return "";
    return `<div class="panel stack"><h2 class="sec">Your bike's final drive</h2>
      <p class="muted" style="margin:0">The course's final drive part follows this: its steps, parts, measurements, safety check and schedule items.</p>
      <div class="row" style="gap:8px;flex-wrap:wrap"><select id="setDrive" aria-label="Final drive" ${ME.canWrite ? "" : "disabled"}>${opts.map(k => `<option value="${k}" ${k === cur ? "selected" : ""}>${DRIVE_NAMES[k]} drive</option>`).join("")}</select>${ME.canWrite ? `<button class="btn" id="setDriveGo" disabled>Switch</button>` : ""}</div>
      <p class="faint" style="margin:0;font-size:12.5px">Switching replaces the Part ${lessonIndex("I") + 1} steps with fresh ones. Anything you ticked off there starts again.</p></div>`;
  };
  const sb = VIEWS.settings.bind;
  VIEWS.settings.bind = function (root) {
    sb.call(this, root);
    const sel = $("#setDrive", root), go = $("#setDriveGo", root);
    if (sel && go) { sel.onchange = () => { go.disabled = sel.value === (meta().drive || BIKE.drive); }; go.onclick = () => confirmBox("Switch to " + DRIVE_NAMES[sel.value].toLowerCase() + " drive?", `<p style="margin:0">The final drive steps, parts and checks are replaced with the ${esc(DRIVE_NAMES[sel.value].toLowerCase())} drive ones. Everything else in the project stays.</p>`, "Switch", () => switchDrive(sel.value), false); }
  };
}
