/* ============ Revora Shop jobs: the mechanic starts a job in a few taps, the customer follows it in their Revora app ============
   A job is a work order on the shop's bike with a short task list and a ready-by date. Used by the owner's shop (shopcrm_view.js),
   the employee app (shop_lock.js) and the customer's page (client_view.js). Notifications go out from the reminders worker. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const D = () => window.rvDue;
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = { check: '<path d="M5 12l4 4 10-10"/>', wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>', bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>', flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    text: '<path d="M4 5h16v11H8l-4 4z"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>' };
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const plusDays = k => { const d = new Date(); d.setDate(d.getDate() + k); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const day = d => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
  const first = s => String(s || "").trim().split(/\s+/)[0] || "";
  const ago = t => { if (!t) return ""; const m = Math.round((Date.now() - new Date(t).getTime()) / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " hr ago" : day(String(t).slice(0, 10)); };

  // what the mechanic taps, and what the customer reads
  const STATUS = [["Checked in", "Checked in"], ["In progress", "Working on it"], ["Waiting for parts", "Waiting on parts"], ["Done", "Ready"]];
  const CUST = { "Checked in": "Checked in", "Waiting for approval": "Checked in", "Approved": "Checked in", "In progress": "Being worked on", "Waiting for parts": "Waiting on parts", "Done": "Ready for pickup", "Picked up": "Picked up" };
  const stepOf = s => s === "Done" || s === "Picked up" ? 2 : s === "In progress" || s === "Waiting for parts" ? 1 : 0;
  const TASKS = ["Oil and filter change", "Tires", "Brakes", "Chain and sprockets", "Tune-up", "Carb clean", "Battery", "Coolant", "Valve adjustment", "Electrical", "Diagnosis", "Inspection"];
  const tasksOf = w => Array.isArray(w.tasks) ? w.tasks.filter(t => t && t.t) : [];
  const prog = w => { const t = tasksOf(w); return { n: t.length, done: t.filter(x => x.done).length }; };
  const titleOf = tasks => { const t = tasks.map(x => x.t); return t.length <= 3 ? t.join(", ") : t.slice(0, 2).join(", ") + " and " + (t.length - 2) + " more"; };
  const late = w => w.promised && w.promised < today() && !["Done", "Picked up"].includes(w.status);
  const pillTone = s => s === "Done" ? "green" : s === "Waiting for parts" ? "amber" : s === "Checked in" ? "gray" : "blue";
  const etaTxt = w => w.status === "Done" ? "Ready now" : !w.promised ? "No date yet" : w.promised === today() ? "Ready today" : w.promised === plusDays(1) ? "Ready tomorrow" : late(w) ? "Was due " + day(w.promised) : "Ready by " + day(w.promised);

  function ping(pid, wid) {
    try { fetch((window.RV_CONFIG && RV_CONFIG.remindersApi || "https://revora-reminders.xavier-j-wilson101.workers.dev") + "/shop-job", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pid, wid }), keepalive: true }).catch(() => {}); } catch (e) {}
  }

  /* ---------- phone notifications for the customer ---------- */
  const standalone = () => !!(window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const u8 = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));
  const push = {
    // "on", "off" (can turn on), "blocked" (they said no in the browser), "install" (iPhone: only works from the home-screen app), "none" (browser can't)
    async state() {
      if (isIOS() && !standalone()) return "install";
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window) || !(window.RV_CONFIG && RV_CONFIG.vapidPublic)) return "none";
      if (Notification.permission === "denied") return "blocked";
      try { const r = await navigator.serviceWorker.getRegistration(); const s = r && await r.pushManager.getSubscription(); return s && Notification.permission === "granted" ? "on" : "off"; } catch (e) { return "off"; }
    },
    async enable(sb) {
      if (Notification.permission !== "granted" && (await Notification.requestPermission()) !== "granted") return "blocked";
      const reg = await navigator.serviceWorker.ready;
      let s = await reg.pushManager.getSubscription();
      if (!s) s = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: u8(RV_CONFIG.vapidPublic) });
      const j = s.toJSON();
      const { data, error } = await sb.rpc("push_save", { ep: j.endpoint, k: j.keys.p256dh, a: j.keys.auth, agent: navigator.userAgent.slice(0, 300) });
      return error || data !== "ok" ? "error" : "on";
    },
    async disable(sb) { try { const r = await navigator.serviceWorker.getRegistration(); const s = r && await r.pushManager.getSubscription(); if (s) { await sb.rpc("push_drop", { ep: s.endpoint }); await s.unsubscribe(); } } catch (e) {} return "off"; }
  };
  // the "get notified" strip on the customer's page; fills itself in
  function notifyStrip(host, sb, note, hasJob) {
    if (!host) return;
    const draw = async () => {
      const st = await push.state();
      if (st === "none") { host.hidden = true; return; }
      host.hidden = false; host.className = "jb-notify" + (st === "on" ? " on" : "");
      host.innerHTML = st === "on" ? `${ic(IC.bell)}<div class="grow"><b>Notifications are on</b><span>You'll get one when your shop checks your bike in and when it's ready.</span></div><button class="linkbtn" data-off>Turn off</button>`
        : st === "install" ? `${ic(IC.bell)}<div class="grow"><b>${hasJob ? "Want a notification when it's ready?" : "Get a notification when your bike is ready"}</b><span>On iPhone, open Revora from your home screen icon, then turn notifications on here.</span></div>`
        : st === "blocked" ? `${ic(IC.bell)}<div class="grow"><b>Notifications are blocked</b><span>Allow notifications for Revora in your ${isIOS() ? "iPhone Settings" : "browser or phone settings"}, then come back here.</span></div>`
        : `${ic(IC.bell)}<div class="grow"><b>${hasJob ? "Get a notification when it's ready" : "Get a notification when your bike is ready"}</b><span>Your shop can tell you the moment it's checked in and done. No texts, no emails to dig through.</span></div><button class="btn pri sm" data-on>Turn on</button>`;
      const on = host.querySelector("[data-on]"); if (on) on.onclick = async () => { on.disabled = true; const r = await push.enable(sb).catch(() => "error"); if (r === "on") note("Done. You'll get a notification when your bike is ready."); else if (r === "error") note("That didn't work. Try again in a minute.", true); draw(); };
      const off = host.querySelector("[data-off]"); if (off) off.onclick = async () => { await push.disable(sb); draw(); };
    };
    draw();
  }

  /* ---------- the customer's view of a job ---------- */
  function trackCard(w, shopName) {
    const s = stepOf(w.status), p = prog(w), t = tasksOf(w), ready = w.status === "Done";
    const steps = [["Checked in", IC.flag], [w.status === "Waiting for parts" ? "Waiting on parts" : "Being worked on", w.status === "Waiting for parts" ? IC.box : IC.wrench], ["Ready for pickup", IC.check]];
    return `<section class="jb-track${ready ? " ready" : ""}${w.status === "Waiting for parts" ? " parts" : ""}">
      <div class="jb-th"><div class="grow"><span class="jb-k">${ready ? "Ready at " : "In the shop at "}${esc(shopName || "your shop")}</span><h3>${esc(w.title || titleOf(t) || "Service")}</h3></div>
        <div class="jb-eta${late(w) ? " late" : ""}">${ic(ready ? IC.check : IC.clock)}<b>${esc(etaTxt(w))}</b></div></div>
      <ol class="jb-steps">${steps.map(([l, i], k) => `<li class="${k < s ? "done" : k === s ? "on" : ""}"><span class="jb-dot">${ic(k < s ? IC.check : i)}</span><span>${esc(l)}</span></li>`).join("")}</ol>
      ${t.length ? `<div class="jb-work"><div class="jb-wh"><b>The work</b><span>${p.done} of ${p.n} done</span></div><div class="jb-bar"><i style="width:${p.n ? Math.round(p.done / p.n * 100) : 0}%"></i></div>
        <ul class="jb-tasks">${t.map(x => `<li class="${x.done ? "done" : ""}"><span class="jb-tick">${x.done ? ic(IC.check) : ""}</span>${esc(x.t)}</li>`).join("")}</ul></div>` : ""}
      ${w.noteClient ? `<div class="jb-note"><span>From ${esc(shopName || "the shop")}</span><p>${esc(w.noteClient)}</p></div>` : ""}
      <div class="jb-foot">${w.mech ? `${esc(w.mech)} is on it · ` : ""}Updated ${esc(ago(w.updatedAt) || "recently")}</div>
    </section>`;
  }

  /* ---------- the mechanic's side ---------- */
  function modal(inner, title, cls) {
    const box = document.createElement("div"); box.className = "pk-modal sx-modal";
    box.innerHTML = `<div class="pk-card sx-card wide jb-modal ${cls || ""}" role="dialog" aria-modal="true"><div class="sx-mh"><h2>${esc(title)}</h2><button class="sx-x" data-close aria-label="Close">×</button></div>${inner}</div>`;
    const esc2 = ev => { if (ev.key === "Escape") close(); };
    function close() { box.remove(); document.removeEventListener("keydown", esc2); }
    box.addEventListener("click", ev => { if (ev.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", esc2); document.body.appendChild(box); box.close = close; return box;
  }
  const reachTxt = c => c.app ? `a notification on ${esc(first(c.name))}'s phone` : c.email ? `an email to ${esc(first(c.name))}` : "";
  // a row for the shop's board
  function boardRow(w, extra) {
    const p = prog(w);
    return `<button class="sx-row jb-row" data-job="${esc(w.pid)}|${esc(w.id)}"><span class="grow"><b>${esc(extra.client || "")}</b><small>${esc([extra.bike, w.title || titleOf(tasksOf(w))].filter(Boolean).join(" · "))}</small></span>
      ${p.n ? `<span class="jb-mini" title="${p.done} of ${p.n} done"><i style="width:${Math.round(p.done / p.n * 100)}%"></i></span>` : ""}
      <span class="pill ${pillTone(w.status)}">${esc((STATUS.find(x => x[0] === w.status) || [0, w.status])[1])}</span><span class="sx-when${late(w) ? " late" : ""}">${esc(etaTxt(w))}</span></button>`;
  }

  // start a job: what's being done, when it'll be ready, tell the customer. opts: { client: {name, email, app}, bikes: [{id, name}], bikeId, save(pid, rec, notify) -> id, done(pid, id) }
  function startBox(opts) {
    const c = opts.client || {}, bikes = opts.bikes || [], reach = reachTxt(c);
    const m = modal(`<form class="sx-form jb-form" id="jbF" novalidate>
      ${bikes.length > 1 ? `<label class="sx-f"><b>Bike</b><select name="bike">${bikes.map(b => `<option value="${esc(b.id)}"${b.id === opts.bikeId ? " selected" : ""}>${esc(b.name)}</option>`).join("")}</select></label>` : ""}
      <div class="sx-f"><b>What are you doing?</b><div class="jb-chips" id="jbChips">${TASKS.map(t => `<button type="button" class="jb-chip" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>
        <div class="jb-add"><input id="jbOther" maxlength="80" placeholder="Something else? Type it and press Enter"><button type="button" class="btn sm" data-addt>${ic(IC.plus)} Add</button></div>
        <ul class="jb-picked" id="jbPicked"></ul></div>
      <div class="sx-f"><b>Ready by</b><div class="jb-chips" id="jbWhen">${[["Today", 0], ["Tomorrow", 1], ["In 3 days", 3], ["In a week", 7]].map(([l, k]) => `<button type="button" class="jb-chip" data-d="${plusDays(k)}">${l}</button>`).join("")}
        <input type="date" name="promised" class="jb-date" min="${today()}" aria-label="Pick a date"></div></div>
      <label class="sx-f"><b>Note for ${esc(first(c.name) || "the customer")} <span class="faint">(optional)</span></b><input name="noteClient" maxlength="300" placeholder="Anything they should know: parts on order, call us first, and so on"></label>
      ${reach ? `<label class="jb-tell"><input type="checkbox" name="notify" checked><span><b>Tell ${esc(first(c.name))} it's checked in, and when it's ready</b><small>Sent as ${reach}. They can follow the work in Revora any time.</small></span></label>`
        : `<p class="sx-small jb-tellno">${esc(first(c.name) || "This customer")} has no email or Revora app yet. Send them their client code from their page and they can follow along and get a notification when it's ready.</p>`}
      <p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn pri">${ic(IC.wrench)} Start the job</button></div></form>`, "Start a job" + (opts.bikeName ? " · " + opts.bikeName : ""));
    const f = m.querySelector("#jbF"), er = m.querySelector(".sx-err"), picked = [], list = m.querySelector("#jbPicked"), other = m.querySelector("#jbOther");
    const drawPicked = () => {
      list.innerHTML = picked.filter(t => !TASKS.includes(t)).map(t => `<li>${esc(t)}<button type="button" data-rm="${esc(t)}" aria-label="Remove">${ic(IC.x)}</button></li>`).join("");
      list.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { picked.splice(picked.indexOf(b.dataset.rm), 1); drawPicked(); });
      m.querySelectorAll("#jbChips [data-t]").forEach(b => b.classList.toggle("on", picked.includes(b.dataset.t)));
    };
    m.querySelectorAll("#jbChips [data-t]").forEach(b => b.onclick = () => { const t = b.dataset.t, i = picked.indexOf(t); if (i >= 0) picked.splice(i, 1); else picked.push(t); drawPicked(); er.hidden = true; });
    const addOther = () => { const v = other.value.trim(); if (v && !picked.includes(v)) picked.push(v); other.value = ""; drawPicked(); er.hidden = true; };
    m.querySelector("[data-addt]").onclick = addOther;
    other.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); addOther(); } };
    const when = m.querySelectorAll("#jbWhen [data-d]");
    when.forEach(b => b.onclick = () => { f.promised.value = b.dataset.d; when.forEach(x => x.classList.toggle("on", x === b)); });
    f.promised.onchange = () => when.forEach(x => x.classList.toggle("on", x.dataset.d === f.promised.value));
    f.onsubmit = async ev => {
      ev.preventDefault(); if (other.value.trim()) addOther();
      if (!picked.length) { er.textContent = "Pick at least one thing you're doing."; er.hidden = false; return; }
      const pid = f.bike ? f.bike.value : opts.bikeId || (bikes[0] && bikes[0].id), tasks = picked.map(t => ({ t, done: false }));
      const rec = { job: true, title: titleOf(tasks), complaint: picked.join("\n"), status: "Checked in", dateIn: today(), promised: f.promised.value || "", tasks, noteClient: f.noteClient.value.trim() };
      f.querySelectorAll("button").forEach(x => x.disabled = true);
      try {
        const id = await opts.save(pid, rec, !!(f.notify && f.notify.checked));
        m.close(); ping(pid, id); if (opts.done) opts.done(pid, id, rec);
      } catch (e) { er.textContent = (e && e.message) || "That didn't save. Try again."; er.hidden = false; f.querySelectorAll("button").forEach(x => x.disabled = false); }
    };
    return m;
  }

  // run a job: tick tasks, change the status, mark it ready, hand it back.
  // opts: { w, pid, client: {name, email, app, phone}, bikeName, save(patch) -> rec, pickedUp(w) -> void, openFull?(), refresh() }
  function manageBox(opts) {
    let w = opts.w; const c = opts.client || {}, reach = reachTxt(c);
    const m = modal(`<div class="jb-man"></div>`, (c.name ? c.name + " · " : "") + (opts.bikeName || "Job"));
    const host = m.querySelector(".jb-man");
    let busy = false;
    const save = async (patch, msg) => {
      if (busy) return; busy = true; host.classList.add("busy");
      try { w = await opts.save(Object.assign({}, patch)); ping(opts.pid, w.id); if (msg) opts.note(msg); if (opts.refresh) opts.refresh(); }
      catch (e) { opts.note((e && e.message) || "That didn't save. Try again.", true); }
      busy = false; host.classList.remove("busy"); draw();
    };
    function draw() {
      const t = tasksOf(w), p = prog(w), ready = w.status === "Done";
      host.innerHTML = `<div class="jb-mh"><div class="grow"><b>${esc(w.title || titleOf(t) || "Job")}</b><span class="${late(w) ? "jb-late" : ""}">${esc(etaTxt(w))}${w.dateIn ? " · in since " + esc(day(w.dateIn)) : ""}</span></div><span class="pill ${pillTone(w.status)}">${esc((STATUS.find(x => x[0] === w.status) || [0, w.status])[1])}</span></div>
        <div class="jb-seg" role="group" aria-label="Status">${STATUS.map(([k, l]) => `<button type="button" class="${w.status === k ? "on" : ""}" data-st="${esc(k)}">${esc(l)}</button>`).join("")}</div>
        <div class="jb-mt"><div class="jb-wh"><b>The work</b><span>${p.done} of ${p.n} done</span></div>
          <ul class="jb-mtasks">${t.map((x, i) => `<li><label class="${x.done ? "done" : ""}"><input type="checkbox" data-i="${i}" ${x.done ? "checked" : ""}><span>${esc(x.t)}</span></label><button type="button" class="jb-rm" data-rmi="${i}" aria-label="Remove">${ic(IC.x)}</button></li>`).join("")}</ul>
          <div class="jb-add"><input id="jbMore" maxlength="80" placeholder="Add a task"><button type="button" class="btn sm" data-more>${ic(IC.plus)} Add</button></div></div>
        <div class="sx-f2"><label class="sx-f"><b>Ready by</b><input type="date" id="jbProm" value="${esc(w.promised || "")}"></label>
          <label class="sx-f"><b>Note for ${esc(first(c.name) || "the customer")}</b><input id="jbNote" maxlength="300" value="${esc(w.noteClient || "")}" placeholder="They see this in Revora"></label></div>
        <div class="jb-big">${ready ? `<button type="button" class="btn pri big" data-picked>${ic(IC.check)} Picked up, add it to their history</button>` : `<button type="button" class="btn pri big jb-readybtn" data-ready>${ic(IC.bell)} Ready${reach ? `, tell ${esc(first(c.name))}` : ""}</button>`}</div>
        <p class="sx-small jb-reach">${reach ? (ready ? `${esc(first(c.name))} got ${reach} that it's ready.` : `${esc(first(c.name))} follows this in Revora${c.app ? " and gets a notification" : " and gets an email"} when you tap Ready.`) : `${esc(first(c.name) || "They")} can't get updates yet: no email or Revora app.`}${c.phone ? ` <a href="sms:${esc(String(c.phone).replace(/[^0-9+]/g, ""))}?&body=${encodeURIComponent(ready ? `Hi ${first(c.name)}, your ${opts.bikeName || "bike"} is ready to pick up.` : `Hi ${first(c.name)}, quick update on your ${opts.bikeName || "bike"}: `)}">${ic(IC.text)} Text them</a>` : ""}</p>
        ${opts.openFull ? `<div class="sx-acts left"><button type="button" class="linkbtn" data-full>Open the full work order (estimate, parts, invoice)</button></div>` : ""}`;
      host.querySelectorAll("[data-st]").forEach(b => b.onclick = () => { const st = b.dataset.st; if (st === w.status) return; save(st === "Done" ? { status: st, readyAt: new Date().toISOString() } : { status: st }, st === "Done" ? (reach ? `Marked ready. ${first(c.name)} is getting ${reach.replace(/^a |^an /, "")}.` : "Marked ready.") : ""); });
      host.querySelectorAll("[data-i]").forEach(b => b.onchange = () => { const tt = tasksOf(w).map(x => Object.assign({}, x)); tt[+b.dataset.i].done = b.checked; const auto = w.status === "Checked in" && b.checked ? { status: "In progress" } : {}; save(Object.assign({ tasks: tt }, auto)); });
      host.querySelectorAll("[data-rmi]").forEach(b => b.onclick = () => { const tt = tasksOf(w).filter((x, i) => i !== +b.dataset.rmi); save({ tasks: tt, title: titleOf(tt) || w.title }); });
      const more = host.querySelector("#jbMore"), addMore = () => { const v = more.value.trim(); if (!v) return; const tt = tasksOf(w).concat([{ t: v, done: false }]); save({ tasks: tt, title: titleOf(tt) }); };
      host.querySelector("[data-more]").onclick = addMore; more.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); addMore(); } };
      host.querySelector("#jbProm").onchange = ev => save({ promised: ev.target.value }, "Ready-by date changed.");
      host.querySelector("#jbNote").onchange = ev => save({ noteClient: ev.target.value.trim() }, "Note saved. They'll see it in Revora.");
      const rd = host.querySelector("[data-ready]"); if (rd) rd.onclick = () => { const tt = tasksOf(w).map(x => Object.assign({}, x, { done: true })); save({ status: "Done", readyAt: new Date().toISOString(), tasks: tt }, reach ? `Marked ready. ${first(c.name)} is getting ${reach.replace(/^a |^an /, "")}.` : "Marked ready."); };
      const pk = host.querySelector("[data-picked]"); if (pk) pk.onclick = async () => { pk.disabled = true; try { await opts.pickedUp(w); m.close(); opts.note("Done. It's in their service history."); if (opts.refresh) opts.refresh(); } catch (e) { pk.disabled = false; opts.note((e && e.message) || "That didn't save.", true); } };
      const fl = host.querySelector("[data-full]"); if (fl) fl.onclick = () => opts.openFull();
    }
    draw();
    return m;
  }
  // what goes into the service history when the bike is picked up
  const historyRec = w => { const t = tasksOf(w), done = t.filter(x => x.done); return { date: today(), service: (done.length ? done : t).map(x => x.t).join(", ") || w.title || "Service", kind: "Repair", items: [], fromJob: w.id, notes: w.noteClient || "" }; };

  window.rvJobs = { STATUS, CUST, TASKS, tasksOf, prog, titleOf, late, etaTxt, trackCard, boardRow, startBox, manageBox, historyRec, ping, push, notifyStrip, today };
})();
