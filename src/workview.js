/* ============ Cleaner layouts: To-do, Safety, Problems & decisions, Workshop areas ============
   Same records and the same detail panels as before. Only the page layouts change:
   lists of cards grouped by course part instead of wide tables, one progress strip instead of a row of tiles. */

const wkPhaseName = id => (typeof LESSONS !== "undefined" && LESSONS[id] && LESSONS[id].title) || (S.phases && S.phases[id] && S.phases[id].name) || id;
const wkBar = (done, total, cls = "") => `<span class="wk-bar ${cls}"><i style="width:${total ? Math.round(done / total * 100) : 0}%"></i></span>`;
const wkTabs = (cur, list, attr = "data-tab") => `<div class="wk-seg" role="tablist">${list.map(([k, l, c]) => `<button ${attr}="${k}" role="tab" aria-selected="${cur === k}" class="${cur === k ? "on" : ""}">${esc(l)}${c != null ? `<span class="wk-c">${c}</span>` : ""}</button>`).join("")}</div>`;
const wkOk = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const wkEmpty = (icon, title, text, btn) => `<div class="wk-empty"><span class="wk-ei">${ic(icon)}</span><b>${esc(title)}</b><p>${esc(text)}</p>${btn || ""}</div>`;

/* one task as a row: a round tick, the title, what it waits on, and a safety tag only when it matters */
function wkTaskRow(t) {
  const done = tasksDone(t), wait = !tasksClosed(t) ? openPrereqs(t) : [], ready = !tasksClosed(t) && !wait.length;
  const tick = ME.canWrite ? `<button class="wk-tick ${done ? "on" : ""}" data-wk-tick="${esc(t.id)}" aria-label="${done ? "Mark not done" : "Mark done"}: ${esc(t.title)}">${wkOk}</button>` : `<span class="wk-tick ${done ? "on" : ""}">${wkOk}</span>`;
  const sub = done ? `Done${t.completedAt ? " " + esc(fmtDate(t.completedAt)) : ""}` : t.status === "Cancelled" ? "Skipped" : wait.length === 1 ? `After: ${esc(S.tasks[wait[0]].title)}` : wait.length ? `After ${wait.length} earlier steps` : t.status !== "Not started" ? esc(t.status) : "Ready to start";
  const crit = !done && (t.safety === "Critical" || t.safety === "High") ? `<span class="wk-tag ${t.safety === "Critical" ? "red" : "amber"}">${t.safety === "Critical" ? "Safety critical" : "Safety"}</span>` : "";
  return `<li class="wk-row ${done ? "done" : ""} ${ready && !done ? "ready" : ""}" data-open="tasks|${esc(t.id)}" tabindex="0">${tick}
    <span class="wk-main"><b>${esc(t.title)}</b><small>${sub}${t.assignee && S.team[t.assignee] ? " · " + refName("team", t.assignee) : ""}</small></span>
    <span class="wk-side">${crit}${n(t.estHours) ? `<span class="wk-h">${esc(String(t.estHours))} h</span>` : ""}</span></li>`;
}
function bindWkTicks(root) {
  $$("[data-wk-tick]", root).forEach(b => b.onclick = e => { e.stopPropagation(); const t = S.tasks[b.dataset.wkTick]; if (!t) return; const done = tasksDone(t);
    quickSet("tasks", t.id, done ? { status: "Not started", completedAt: "" } : { status: "Complete" }, done ? "Marked not done" : "Done: " + t.title); });
  $$(".wk-row[data-open]", root).forEach(r => r.onkeydown = e => { if (e.key === "Enter") r.click(); });
}

/* ---------- To-do ---------- */
(function () {
  const old = VIEWS.tasks;
  VIEWS.tasks = {
    render() {
      let tab = R.tab.tasks || "list"; if (tab === "phase") tab = "list";
      if (tab !== "list") { const html = old.render(); return html.replace(/<button data-tab="phase"[^>]*>By phase<\/button>/, ""); }
      const f = fstate("tasks"), all = sorted("tasks").filter(t => t.status !== "Cancelled");
      const done = all.filter(tasksDone).length, ready = all.filter(t => !tasksClosed(t) && !openPrereqs(t).length).length, crit = all.filter(t => !tasksClosed(t) && t.safety === "Critical").length;
      let rows = filteredTasks(); if (f.flag === "done") rows = rows.filter(tasksDone);
      const extra = ["phase", "module", "status", "assignee", "safety"].filter(k => f[k]).length;
      const quick = [["", "All"], ["open", "Open"], ["ready", "Ready to start"], ["done", "Done"]];
      const groups = sorted("phases").map(ph => ({ ph, ts: rows.filter(t => t.phase === ph.id) })).filter(g => g.ts.length);
      const loose = rows.filter(t => !S.phases[t.phase]);
      if (loose.length) groups.push({ ph: { id: "", name: "Other jobs" }, ts: loose });
      return `<div class="ph"><div><h1>To-do list</h1><p></p></div><div class="act"><button class="btn" id="taskCsv">${ic("download")} Export CSV</button><button class="btn pri" data-new="tasks">${ic("plus")} Add task</button></div></div>
      <section class="wk-sum"><div class="wk-sum-l"><span class="wk-big">${done}<small> of ${all.length}</small></span><span class="muted">steps done</span></div>
        <div class="wk-sum-r">${wkBar(done, all.length, "wk-lg")}<div class="wk-chips"><span><i class="dot blue"></i>${ready} ready to start</span><span><i class="dot gray"></i>${all.length - done - ready} waiting on earlier steps</span>${crit ? `<span><i class="dot red"></i>${crit} safety critical open</span>` : ""}</div></div></section>
      <div class="wk-tools">${wkTabs("list", [["list", "List"], ["board", "Board"], ["tools", "Tools & supplies"]])}
        <div class="wk-find"><input type="search" id="f-tasks-q" data-f="q" placeholder="Search steps" value="${esc(f.q || "")}" aria-label="Search steps">
          <div class="wk-quick">${quick.map(([k, l]) => `<button data-wk-flag="${k}" class="${(f.flag || "") === k ? "on" : ""}">${l}</button>`).join("")}</div>
          <details class="wk-more" ${extra ? "open" : ""}><summary>${ic("tune")} More filters${extra ? ` (${extra})` : ""}</summary>${filterBar("tasks", [{ k: "phase", label: "Course part", opts: sorted("phases").map(p => [p.id, p.id + " · " + wkPhaseName(p.id)]) }, { k: "module", label: "Area", opts: optsOf(Object.keys(MODULES), MODULES) }, { k: "status", label: "Status", opts: optsOf(TASK_STATUS) }, { k: "assignee", label: "Assigned", opts: teamOpts() }, { k: "safety", label: "Safety", opts: optsOf(SEV) }])}</details></div></div>
      ${groups.length ? groups.map(({ ph, ts }) => { const tot = all.filter(t => t.phase === ph.id), d = tot.filter(tasksDone).length;
        return `<section class="wk-group"><header>${ph.id ? `<span class="wk-letter">${esc(ph.id)}</span>` : ""}<div class="grow"><h3>${esc(ph.id ? wkPhaseName(ph.id) : ph.name)}</h3>${ph.id ? `<div class="wk-gp">${wkBar(d, tot.length)}<span class="faint">${d} of ${tot.length}</span></div>` : ""}</div>${ph.id ? `<button class="linkbtn" data-lesson="${esc(ph.id)}">Open in course ${ic("next")}</button>` : ""}</header>
        <ol class="wk-list">${ts.map(wkTaskRow).join("")}</ol></section>`; }).join("")
        : wkEmpty("check", f.flag === "done" ? "Nothing done yet" : "No steps match", f.flag === "done" ? "Steps you tick off show up here." : "Try a different search or clear the filters.", `<button class="btn" data-clearf="tasks">Clear filters</button>`)}`;
    },
    bind(root) {
      old.bind(root); bindWkTicks(root);
      $$("[data-wk-flag]", root).forEach(b => b.onclick = () => { fstate("tasks").flag = b.dataset.wkFlag; render(false); });
      $$("[data-lesson]", root).forEach(b => b.onclick = e => { e.stopPropagation(); go("lesson-" + b.dataset.lesson); });
    }
  };
})();

/* ---------- Safety ---------- */
(function () {
  const old = VIEWS.gates;
  VIEWS.gates = {
    render() {
      const m = meta(), bl = roadReadyBlockers(), ready = m.roadReady && !bl.length, gates = sorted("gates"), checks = sorted("checks");
      const tab = R.tab.gates || "gates";
      const gp = gates.filter(g => g.status === "Passed").length, cp = checks.filter(c => c.result === "Pass").length, tot = gates.length + checks.length;
      const state = ready ? "good" : m.roadReady && bl.length ? "bad" : "warn";
      const gateCard = (g, i) => { const req = expandIds(g.prereqs).filter(id => S.tasks[id]), out = gateOutstanding(g), dn = req.length - out.length;
        return `<button class="wk-gate ${g.status === "Passed" ? "pass" : g.status === "Failed" ? "fail" : ""}" data-open="gates|${esc(g.id)}"><span class="wk-gn">${g.status === "Passed" ? wkOk : i + 1}</span>
          <span class="wk-main"><b>${esc(g.name)}</b><span class="wk-gp">${wkBar(dn, req.length)}<span class="faint">${req.length ? (out.length ? `${dn} of ${req.length} steps done` : "All steps done") : "No steps linked"}</span></span>${g.reviewer && S.team[g.reviewer] ? `<small>Checked by ${refName("team", g.reviewer)}</small>` : ""}</span>${g.status !== "Not started" ? resPill(g.status) : ""}</button>`; };
      const bySys = {}; checks.forEach(c => (bySys[c.system || "Other"] = bySys[c.system || "Other"] || []).push(c));
      return `<div class="ph"><div><h1>Safety checks</h1><p></p></div></div>
      <section class="wk-safe ${state}"><div class="wk-ring" style="--p:${tot ? Math.round((gp + cp) / tot * 100) : 0}"><span><b>${gp + cp}</b><small>of ${tot}</small></span></div>
        <div class="grow"><span class="wk-k">${ready ? "Road-ready" : m.roadReady && bl.length ? "Road-ready on hold" : "Not road-ready yet"}</span>
          <p>${ready ? `Approved by ${esc(m.roadReadyBy)} on ${esc(fmtDate(m.roadReadyDate))}.` : m.roadReady && bl.length ? "A check failed or reopened after it was approved." : bl.length ? `${bl.length} item${bl.length === 1 ? "" : "s"} still need to pass before the bike goes on the road.` : "Everything has passed. Mark it road-ready when you're happy."}</p>
          ${bl.length ? `<details class="wk-block"><summary>See what's left</summary><div class="linklist">${bl.map(b => `<button data-open="${b.c}|${esc(b.id)}"><span class="grow">${esc(b.t)}</span></button>`).join("")}</div></details>` : ""}</div>
        ${ME.canWrite ? (m.roadReady ? `<button class="btn" id="rrRevoke">Withdraw road-ready</button>` : `<button class="btn pri" id="rrMark" ${bl.length ? "disabled" : ""}>Mark road-ready</button>`) : ""}</section>
      ${wkTabs(tab, [["gates", "Checkpoints", `${gp}/${gates.length}`], ["checks", "Before the first ride", `${cp}/${checks.length}`]])}
      ${tab === "gates" ? (gates.length ? `<div class="wk-gates">${gates.map(gateCard).join("")}</div>` : wkEmpty("shield", "No checkpoints yet", "Checkpoints come with the restoration course."))
        : checks.length ? Object.entries(bySys).map(([sys, cs]) => `<section class="wk-group"><header><div class="grow"><h3>${esc(sys)}</h3></div><span class="faint">${cs.filter(c => c.result === "Pass").length} of ${cs.length} passed</span></header>
          <ol class="wk-list">${cs.map(c => `<li class="wk-row ${c.result === "Pass" ? "done" : ""}" data-open="checks|${esc(c.id)}" tabindex="0"><span class="wk-tick ${c.result === "Pass" ? "on" : c.result === "Fail" ? "bad" : ""}">${c.result === "Fail" ? ic("x") : wkOk}</span>
            <span class="wk-main"><b>${esc(c.check)}</b>${c.criteria ? `<small>${esc(c.criteria)}</small>` : ""}</span><span class="wk-side">${c.criticality === "Critical" && c.result !== "Pass" ? `<span class="wk-tag red">Critical</span>` : ""}${resPill(c.result)}</span></li>`).join("")}</ol></section>`).join("")
        : wkEmpty("shield", "No ride checks yet", "Pre-start and road checks come with the restoration course.")}`;
    },
    bind(root) { old.bind(root); $$(".wk-row[data-open]", root).forEach(r => r.onkeydown = e => { if (e.key === "Enter") r.click(); }); }
  };
})();

/* ---------- Problems & decisions ---------- */
(function () {
  const OPEN = i => !["Resolved", "Closed"].includes(i.status);
  VIEWS.problems = {
    render() {
      const tab = R.tab.problems || "issues", iss = sorted("issues"), dec = sorted("decisions"), f = fstate("problems");
      const rows = iss.filter(i => (!f.status || i.status === f.status) && (!f.sev || i.severity === f.sev) && (!f.type || i.type === f.type))
        .sort((a, b) => (OPEN(b) - OPEN(a)) || (SEV.indexOf(b.severity) - SEV.indexOf(a.severity)));
      const card = i => `<button class="wk-rec sev-${esc((i.severity || "low").toLowerCase())} ${OPEN(i) ? "" : "closed"}" data-open="issues|${esc(i.id)}">
        <span class="wk-main"><b>${esc(i.description || "Untitled problem")}</b><small>${[esc(i.type || ""), i.partId && S.parts[i.partId] ? refName("parts", i.partId) : "", i.owner && S.team[i.owner] ? refName("team", i.owner) : esc(i.ownerRole || ""), i.target ? "fix by " + esc(fmtDate(i.target)) : "", n(i.costImpact) ? esc(money(i.costImpact)) : ""].filter(Boolean).join(" · ")}</small></span>
        <span class="wk-side">${OPEN(i) && i.severity ? `<span class="wk-tag ${["High", "Critical"].includes(i.severity) ? "red" : i.severity === "Medium" ? "amber" : "gray"}">${esc(i.severity)}</span>` : ""}${resPill(i.status)}</span></button>`;
      const dcard = d => `<button class="wk-rec ${d.status === "Decided" ? "closed decided" : "sev-medium"}" data-open="decisions|${esc(d.id)}">
        <span class="wk-main"><b>${esc(d.topic || "Untitled decision")}</b><small>${d.choice ? "Went with: " + esc(d.choice) : d.options ? "Options: " + esc(String(d.options).slice(0, 140)) : "Not decided yet"}</small></span>
        <span class="wk-side">${resPill(d.status)}</span></button>`;
      const openI = iss.filter(OPEN).length, openD = dec.filter(d => d.status !== "Decided").length;
      return `<div class="ph"><div><h1>Problems & decisions</h1><p></p></div><div class="act"><button class="btn" data-new="decisions">${ic("plus")} Decision</button><button class="btn pri" data-new="issues">${ic("plus")} Problem</button></div></div>
      ${wkTabs(tab, [["issues", "Problems", openI ? openI + " open" : null], ["decisions", "Decisions", openD ? openD + " open" : null]])}
      ${tab === "issues" ? (iss.length ? `${iss.length > 4 ? `<div class="wk-filt">${filterBar("problems", [{ k: "status", label: "Status", opts: optsOf(["Open", "In progress", "Resolved", "Closed"]) }, { k: "sev", label: "Severity", opts: optsOf(SEV) }, { k: "type", label: "Type", opts: optsOf(SCHEMA.issues.fields.find(x => x.k === "type").opts) }])}</div>` : ""}
          ${rows.length ? `<div class="wk-recs">${rows.map(card).join("")}</div>` : wkEmpty("alert", "Nothing matches", "Try clearing the filters.", `<button class="btn" data-clearf="problems">Clear filters</button>`)}`
        : wkEmpty("alert", "No problems logged", "When you find something damaged, missing, worn or just confusing, log it here so it doesn't get forgotten. The serious ones stay at the top until they're fixed.", ME.canWrite ? `<button class="btn pri" data-new="issues">${ic("plus")} Log a problem</button>` : ""))
      : dec.length ? `<div class="wk-recs">${dec.map(dcard).join("")}</div>`
        : wkEmpty("book", "No decisions yet", "Write down the big choices once, like original or aftermarket parts, or paint versus powder coat, so nobody has to argue them again.", ME.canWrite ? `<button class="btn pri" data-new="decisions">${ic("plus")} Record a decision</button>` : "")}`;
    },
    bind(root) { bindTables(root); bindFilters(root, "problems"); $$("[data-tab]", root).forEach(b => b.onclick = () => { R.tab.problems = b.dataset.tab; render(false); }); }
  };
})();

/* ---------- Workshop areas (engine, fuel, electrical, chassis, finish) ---------- */
["engine", "fuel", "electrical", "chassis", "finish"].forEach(mod => {
  const old = VIEWS[mod]; if (!old) return;
  VIEWS[mod] = {
    render() {
      const sec = R.sec; let tab = R.tab[sec] || (mod === "finish" ? "finishes" : "steps"); if (tab === "inspections") tab = mod === "finish" ? "finishes" : "steps";
      if (mod === "finish" && tab === "steps") tab = "finishes";
      const parts = sorted("parts").filter(p => p.module === mod), tasks = sorted("tasks").filter(t => t.module === mod && t.status !== "Cancelled"), steps = sorted("steps").filter(s => s.module === mod).sort((a, b) => n(a.seq) - n(b.seq));
      const sd = steps.filter(s => s.status === "Complete").length, td = tasks.filter(tasksDone).length, pd = parts.filter(p => partColor(p) === "green").length;
      const est = tasks.reduce((s, t) => s + n(t.estCost), 0) + parts.reduce((s, p) => s + n(p.estCost), 0), act = parts.reduce((s, p) => s + partActualCost(p.id), 0);
      let body = "";
      if (tab === "steps") {
        if (!steps.length) body = wkEmpty("wrench", "No steps here yet", "Add the first step for this area with the button above.");
        else { let wp = null; body = `<div class="wk-steps">` + steps.map((s, i) => { const head = s.workPackage && s.workPackage !== wp ? `<h4 class="wk-wp">${esc(s.workPackage)}</h4>` : ""; wp = s.workPackage || wp; const dn = s.status === "Complete", fail = s.result === "Fail";
          const verify = !s.manualRef || s.manualRef === VERIFY;
          return head + `<div class="wk-step ${dn ? "done" : ""} ${fail ? "fail" : ""}" data-open="steps|${esc(s.id)}" tabindex="0"><span class="wk-sn">${dn ? wkOk : i + 1}</span>
            <div class="wk-main"><b>${esc(s.title)}</b>${s.procedure ? `<p>${esc(s.procedure)}</p>` : ""}<div class="wk-meta">${verify ? "" : `<span class="wk-tag gray">${ic("book")} Manual ${esc(s.manualRef)}</span>`}${s.taskId && S.tasks[s.taskId] ? `<button class="wk-link" data-open="tasks|${esc(s.taskId)}">To-do ${esc(s.taskId)}</button>` : ""}</div></div>
            <div class="wk-ctl">${ME.canWrite ? `<label><span>Status</span><select data-inline="steps|${esc(s.id)}|status">${TASK_STATUS.map(x => `<option ${x === s.status ? "selected" : ""}>${x}</option>`).join("")}</select></label><label><span>Result</span><select data-inline="steps|${esc(s.id)}|result" class="r-${esc((s.result || "Pending").replace("/", "").toLowerCase())}">${RESULT.map(x => `<option ${x === s.result ? "selected" : ""}>${x}</option>`).join("")}</select></label>` : taskPill(s) + resPill(s.result)}</div></div>`; }).join("") + `</div>`; }
      }
      if (tab === "finishes" || tab === "photos") { R.tab[sec] = tab; const h = old.render(), k = h.indexOf('<div class="tabs">'); body = k < 0 ? "" : h.slice(h.indexOf("</div>", k) + 6); }
      if (tab === "tasks") body = tasks.length ? `<ol class="wk-list wk-card">${tasks.map(wkTaskRow).join("")}</ol>` : wkEmpty("check", "No to-do steps for this area", "Steps from the course land here when they belong to this area.");
      if (tab === "parts") body = table("mp-" + mod, parts, PART_COLS(), { coll: "parts" });
      const fins = mod === "finish" ? sorted("finishes") : [], fd = fins.filter(x => x.qc === "Pass").length;
      const tabs = (mod === "finish" ? [["finishes", "Finish records", `${fd}/${fins.length}`], ["photos", "Before & after"]] : [["steps", "Procedure", `${sd}/${steps.length}`]]).concat([["tasks", "To-do", `${td}/${tasks.length}`], ["parts", "Parts", `${pd}/${parts.length}`]]);
      return `<div class="ph"><div><h1>${esc(SEC[sec].t)}</h1><p>${MODULE_INTRO[mod]}</p></div><div class="act">${mod === "finish" ? `<button class="btn pri" data-new="finishes">${ic("plus")} Finish record</button>` : `<button class="btn pri" data-new="steps|${esc(JSON.stringify({ module: mod, seq: steps.length + 1 }))}">${ic("plus")} Add a step</button>`}</div></div>
      ${X.garage3d ? `<div class="wk-3d"><img src="img/${MODULE_IMG[mod]}.svg" alt=""><div class="grow"><b>See it in 3D</b><span class="muted">Pull this area out of the bike, spin it and spread the pieces apart.</span></div><div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn pri" data-3d="${MODULE_GROUP[mod]}">${ic("cube")} Open in 3D</button>${scanBtn(GROUP_DIAG[MODULE_GROUP[mod]], "Scan these parts", "btn")}</div></div>` : ""}
      <section class="wk-sum"><div class="wk-sum-l"><span class="wk-big">${(() => { const a = mod === "finish" ? fd : sd, b = mod === "finish" ? fins.length : steps.length; return b ? Math.round(a / b * 100) : 0; })()}<small>%</small></span><span class="muted">of this area done</span></div>
        <div class="wk-sum-r">${mod === "finish" ? wkBar(fd, fins.length, "wk-lg") : wkBar(sd, steps.length, "wk-lg")}<div class="wk-chips"><span><i class="dot blue"></i>${mod === "finish" ? `${fd} of ${fins.length} finishes passed` : `${sd} of ${steps.length} steps`}</span><span><i class="dot green"></i>${pd} of ${parts.length} parts ready</span><span><i class="dot gray"></i>${money(act)} spent${est ? " of " + money(est) + " planned" : ""}</span>${steps.some(s => s.result === "Fail") ? `<span><i class="dot red"></i>${steps.filter(s => s.result === "Fail").length} failed</span>` : ""}</div></div></section>
      ${wkTabs(tab, tabs)}${body}`;
    },
    bind(root) {
      bindTables(root); bindInline(root); bindWkTicks(root);
      $$("[data-tab]", root).forEach(b => b.onclick = () => { R.tab[R.sec] = b.dataset.tab; render(false); });
      $$("[data-3d]", root).forEach(b => b.onclick = () => openIn3D(b.dataset["3d"]));
      $$(".wk-step", root).forEach(r => r.onkeydown = e => { if (e.key === "Enter" && e.target === r) r.click(); });
      $$(".wk-ctl select, .wk-ctl label", root).forEach(el => el.addEventListener("click", e => e.stopPropagation()));
      $$("[data-up]", root).forEach(b => b.onclick = () => { const [pid, kind] = b.dataset.up.split("|"); uploadPhotos({ partId: pid === "—" ? "" : pid, kind }); });
    }
  };
});
