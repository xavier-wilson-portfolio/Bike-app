/* ============ Revora Shop jobs: the mechanic starts a job in a few taps, the customer follows it in their Revora app ============
   A job is a work order on the shop's bike with a short task list and a ready-by date. Used by the owner's shop (shopcrm_view.js),
   the employee app (shop_lock.js) and the customer's page (client_view.js). Notifications go out from the reminders worker. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const D = () => window.rvDue;
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = { check: '<path d="M5 12l4 4 10-10"/>', wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>', bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>', flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    text: '<path d="M4 5h16v11H8l-4 4z"/>', cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', ask: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.5M12 17h.01"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>' };
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const plusDays = k => { const d = new Date(); d.setDate(d.getDate() + k); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const day = d => d ? new Date(d + "T12:00:00").toLocaleDateString(window.rvLocale ? rvLocale() : "en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
  const first = s => String(s || "").trim().split(/\s+/)[0] || "";
  const ago = t => { if (!t) return ""; const m = Math.round((Date.now() - new Date(t).getTime()) / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " hr ago" : day(String(t).slice(0, 10)); };

  const money = v => v ? "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: Number(v) % 1 ? 2 : 0, maximumFractionDigits: 2 }) : "";
  // photos are shrunk on the phone before they're saved: a small preview and a full picture
  async function shrink(file, max, q) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
      const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL("image/jpeg", q);
    } finally { URL.revokeObjectURL(url); }
  }
  async function photoData(file) {
    let img = await shrink(file, 1400, 0.72); if (img.length > 380000) img = await shrink(file, 1100, 0.6); if (img.length > 380000) img = await shrink(file, 900, 0.5);
    let thumb = await shrink(file, 360, 0.6); if (thumb.length > 58000) thumb = await shrink(file, 260, 0.5);
    return { thumb, img };
  }
  function viewPhoto(getFull, thumb, note) {
    const box = document.createElement("div"); box.className = "jb-lb";
    box.innerHTML = `<button class="jb-lbx" aria-label="Close">${ic(IC.x)}</button><figure><img src="${esc(thumb)}" alt="">${note ? `<figcaption>${esc(note)}</figcaption>` : ""}</figure>`;
    const close = () => { box.remove(); document.removeEventListener("keydown", k); }, k = ev => { if (ev.key === "Escape") close(); };
    box.onclick = ev => { if (ev.target === box || ev.target.closest(".jb-lbx")) close(); };
    document.addEventListener("keydown", k); document.body.appendChild(box);
    Promise.resolve(getFull()).then(full => { const im = box.querySelector("img"); if (full && im) im.src = full; }).catch(() => {});
  }
  const askPill = a => a.status === "yes" ? `<span class="pill green">Approved</span>` : a.status === "no" ? `<span class="pill gray">Said no</span>` : `<span class="pill amber">Waiting on them</span>`;

  // what the mechanic taps, and what the customer reads
  const STATUS = [["Checked in", "Checked in"], ["In progress", "Working on it"], ["Waiting for parts", "Waiting on parts"], ["Done", "Ready"]];
  const CUST = { "Checked in": "Checked in", "Waiting for approval": "Checked in", "Approved": "Checked in", "In progress": "Being worked on", "Waiting for parts": "Waiting on parts", "Done": "Ready for pickup", "Picked up": "Picked up" };
  const stepOf = s => s === "Done" || s === "Picked up" ? 2 : s === "In progress" || s === "Waiting for parts" ? 1 : 0;
  const TASKS = ["Oil and filter change", "Tires", "Brakes", "Chain and sprockets", "Tune-up", "Carb clean", "Battery", "Coolant", "Valve adjustment", "Electrical", "Diagnosis", "Inspection"];
  const tasksOf = w => Array.isArray(w.tasks) ? w.tasks.filter(t => t && t.t) : [];
  const prog = w => { const t = tasksOf(w); return { n: t.length, done: t.filter(x => x.done).length }; };
  const titleOf = tasks => { const t = tasks.map(x => x.t); return t.length <= 3 ? t.join(", ") : t.slice(0, 2).join(", ") + " and " + (t.length - 2) + " more"; };
  const dateOf = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const clock = d => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const tz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { return ""; } };
  // a ready-by time: "in 45 minutes" -> rounded up to the next 5 minutes
  const inMinutes = k => { const d = new Date(Date.now() + k * 60000); d.setSeconds(0, 0); return d; };
  const late = w => !["Done", "Picked up"].includes(w.status) && (w.promisedAt ? Date.now() > new Date(w.promisedAt).getTime() + 5 * 60000 : !!(w.promised && w.promised < today()));
  const pillTone = s => s === "Done" ? "green" : s === "Waiting for parts" ? "amber" : s === "Checked in" ? "gray" : "blue";
  const etaTxt = w => {
    if (w.status === "Done") return "Ready now";
    if (w.promisedAt) {
      const t = new Date(w.promisedAt), d = dateOf(t), mins = Math.round((t - Date.now()) / 60000);
      if (late(w)) return "Running late · was due " + (d === today() ? clock(t) : day(d) + ", " + clock(t));
      if (d === today()) return mins > 0 && mins <= 50 ? `Ready in about ${Math.max(5, Math.round(mins / 5) * 5)} min` : "Ready by " + clock(t) + " today";
      if (d === plusDays(1)) return "Ready tomorrow by " + clock(t);
      return "Ready by " + day(d) + ", " + clock(t);
    }
    return !w.promised ? "No date yet" : w.promised === today() ? "Ready today" : w.promised === plusDays(1) ? "Ready tomorrow" : late(w) ? "Was due " + day(w.promised) : "Ready by " + day(w.promised);
  };

  const API = () => (window.RV_CONFIG && RV_CONFIG.remindersApi) || "https://revora-reminders.xavier-j-wilson101.workers.dev";
  function ping(pid, wid) {
    try { fetch(API() + "/shop-job", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pid, wid }), keepalive: true }).catch(() => {}); } catch (e) {}
  }

  /* ---------- phone notifications for the customer ---------- */
  const standalone = () => !!(window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const u8 = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));
  const push = {
    // "on", "off" (can turn on), "blocked" (they said no in the browser), "install" (iPhone: only works from the home-screen app), "none" (browser can't)
    async state() {
      if (isIOS() && !standalone()) return "install";
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "none";
      if (Notification.permission === "denied") return "blocked";
      try { const r = await navigator.serviceWorker.getRegistration(); const s = r && await r.pushManager.getSubscription(); return s && Notification.permission === "granted" ? "on" : "off"; } catch (e) { return "off"; }
    },
    async enable(sb) {
      if (Notification.permission !== "granted" && (await Notification.requestPermission()) !== "granted") return "blocked";
      const reg = await navigator.serviceWorker.ready;
      let s = await reg.pushManager.getSubscription();
      if (!s) {
        const k = await fetch(API() + "/push-key").then(r => r.json()).catch(() => ({}));
        if (!k.key) return "error";
        s = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: u8(k.key) });
      }
      const j = s.toJSON();
      const { data, error } = await sb.rpc("push_save", { ep: j.endpoint, k: j.keys.p256dh, a: j.keys.auth, agent: navigator.userAgent.slice(0, 300) });
      return error || data !== "ok" ? "error" : "on";
    },
    async disable(sb) { try { const r = await navigator.serviceWorker.getRegistration(); const s = r && await r.pushManager.getSubscription(); if (s) { await sb.rpc("push_drop", { ep: s.endpoint }); await s.unsubscribe(); } } catch (e) {} return "off"; }
  };
  // the "get notified" strip on the customer's page; fills itself in
  function notifyStrip(host, sb, note, hasJob, shop) {
    if (!host) return;
    const draw = async () => {
      const st = await push.state();
      if (st === "none" || (shop && (st === "on" || st === "blocked"))) { host.hidden = true; return; }
      if (shop) {
        host.hidden = false; host.className = "jb-notify";
        host.innerHTML = `${ic(IC.bell)}<div class="grow"><b>Get a notification when a customer answers</b><span>${st === "install" ? "On iPhone, open Revora from your home screen icon, then turn this on." : "When you ask a customer to approve extra work, their yes or no shows up on this phone or computer."}</span></div>${st === "install" ? "" : `<button class="btn pri sm" data-on>Turn on</button><button class="linkbtn" data-later>Not now</button>`}`;
        const lt = host.querySelector("[data-later]"); if (lt) lt.onclick = () => { try { localStorage.setItem("rv.shopNotifyLater", String(Date.now())); } catch (e) {} host.hidden = true; };
        try { if (Date.now() - (+localStorage.getItem("rv.shopNotifyLater") || 0) < 14 * 864e5) { host.hidden = true; return; } } catch (e) {}
        const on = host.querySelector("[data-on]"); if (on) on.onclick = async () => { on.disabled = true; const r = await push.enable(sb).catch(() => "error"); if (r === "on") note("Done. You'll get a notification when a customer answers."); else if (r === "error") note("That didn't work. Try again in a minute.", true); draw(); };
        return;
      }
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
  function trackCard(w, shopName, pid) {
    const s = stepOf(w.status), p = prog(w), t = tasksOf(w), ready = w.status === "Done", asks = Array.isArray(w.asks) ? w.asks : [];
    const open = asks.filter(a => a.status === "asked"), answered = asks.filter(a => a.status !== "asked");
    const steps = [["Checked in", IC.flag], [w.status === "Waiting for parts" ? "Waiting on parts" : "Being worked on", w.status === "Waiting for parts" ? IC.box : IC.wrench], ["Ready for pickup", IC.check]];
    return `<section class="jb-track${ready ? " ready" : ""}${w.status === "Waiting for parts" ? " parts" : ""}" data-wid="${esc(w.id)}">
      <div class="jb-th"><div class="grow"><span class="jb-k">${ready ? "Ready at " : "In the shop at "}${esc(shopName || "your shop")}</span><h3>${esc(w.title || titleOf(t) || "Service")}</h3></div>
        <div class="jb-eta${late(w) ? " late" : ""}">${ic(ready ? IC.check : IC.clock)}<b>${esc(etaTxt(w))}</b></div></div>
      ${open.map(a => `<div class="jb-q"><div class="jb-qh">${ic(IC.ask)}<span>${esc(shopName || "Your shop")} found something</span></div>
        <div class="jb-qb">${a.photo && pid ? `<button class="jb-qph" data-ph="${esc(pid)}|${esc(w.id)}|${esc(a.photo)}" aria-label="See the photo"></button>` : ""}<div class="grow"><b>${esc(a.t)}</b>${a.price ? `<span class="jb-qp">${esc(money(a.price))}</span>` : ""}</div></div>
        <div class="jb-qa"><button class="btn pri" data-ans="${esc(pid)}|${esc(w.id)}|${esc(a.id)}|1">${ic(IC.check)} Approve</button><button class="btn" data-ans="${esc(pid)}|${esc(w.id)}|${esc(a.id)}|0">No thanks</button></div></div>`).join("")}
      <ol class="jb-steps">${steps.map(([l, i], k) => `<li class="${k < s ? "done" : k === s ? "on" : ""}"><span class="jb-dot">${ic(k < s ? IC.check : i)}</span><span>${esc(l)}</span></li>`).join("")}</ol>
      ${t.length ? `<div class="jb-work"><div class="jb-wh"><b>The work</b><span>${p.done} of ${p.n} done</span></div><div class="jb-bar"><i style="width:${p.n ? Math.round(p.done / p.n * 100) : 0}%"></i></div>
        <ul class="jb-tasks">${t.map(x => `<li class="${x.done ? "done" : ""}"><span class="jb-tick">${x.done ? ic(IC.check) : ""}</span>${esc(x.t)}</li>`).join("")}</ul></div>` : ""}
      ${answered.length ? `<ul class="jb-answered">${answered.map(a => `<li>${a.status === "yes" ? ic(IC.check) : ic(IC.x)}<span>You ${a.status === "yes" ? "approved" : "said no to"} <b>${esc(a.t)}</b>${a.price ? " · " + esc(money(a.price)) : ""}</span></li>`).join("")}</ul>` : ""}
      ${w.noteClient ? `<div class="jb-note"><span>From ${esc(shopName || "the shop")}</span><p>${esc(w.noteClient)}</p></div>` : ""}
      ${+w.photos && pid ? `<div class="jb-pics" data-photos="${esc(pid)}|${esc(w.id)}"><b>Photos from the shop</b><div class="jb-strip">${Array.from({ length: Math.min(+w.photos, 8) }, () => `<span class="jb-thumb ph"></span>`).join("")}</div></div>` : ""}
      <div class="jb-foot">${w.mech ? `${esc(w.mech)} is on it · ` : ""}Updated ${esc(ago(w.updatedAt) || "recently")}</div>
    </section>`;
  }

  // after the customer's page is drawn: load the photos, wire up Approve / No thanks
  function bindTrack(root, sb, note, after) {
    root.querySelectorAll("[data-photos]").forEach(async host => {
      const [pid, wid] = host.dataset.photos.split("|");
      const { data } = await sb.rpc("job_photos", { pid, wid }); const L = data || [];
      const strip = host.querySelector(".jb-strip"); if (!strip) return;
      strip.innerHTML = L.map(x => `<button class="jb-thumb" data-full="${esc(x.id)}" style="background-image:url('${esc(x.thumb)}')" aria-label="Open photo"></button>`).join("");
      strip.querySelectorAll("[data-full]").forEach(b => b.onclick = () => { const x = L.find(y => y.id === b.dataset.full); viewPhoto(() => sb.rpc("job_photo", { pid, id: x.id }).then(r => r.data), x.thumb, x.note); });
    });
    root.querySelectorAll("[data-ph]").forEach(async b => {
      const [pid, wid, id] = b.dataset.ph.split("|"); const { data } = await sb.rpc("job_photos", { pid, wid });
      const x = (data || []).find(y => y.id === id); if (x) b.style.backgroundImage = `url('${x.thumb}')`;
      b.onclick = () => viewPhoto(() => sb.rpc("job_photo", { pid, id }).then(r => r.data), x ? x.thumb : "", x ? x.note : "");
    });
    root.querySelectorAll("[data-ans]").forEach(b => b.onclick = async () => {
      const [pid, wid, aid, yes] = b.dataset.ans.split("|"), y = yes === "1";
      b.closest(".jb-qa").querySelectorAll("button").forEach(x => x.disabled = true);
      const { data, error } = await sb.rpc("client_job_answer", { pid, wid, aid, yes: y });
      if (error || !["ok", "done"].includes(data)) { note("That didn't go through. Try again.", true); b.closest(".jb-qa").querySelectorAll("button").forEach(x => x.disabled = false); return; }
      ping(pid, wid); note(y ? "Approved. The shop's been told and it's on the work list." : "Got it. The shop's been told."); if (after) after();
    });
  }

  /* ---------- the mechanic's side ---------- */
  // head: { eb, title, sub, pill } draws the dark Revora header band
  function modal(inner, title, cls, head) {
    const box = document.createElement("div"); box.className = "pk-modal sx-modal";
    const hd = head ? `<div class="jb-hd"><div class="grow"><span class="jb-eb">${esc(head.eb || "")}</span><h2>${esc(head.title || title)}</h2>${head.sub ? `<span class="jb-hs">${head.sub}</span>` : ""}</div>${head.pill || ""}<button class="jb-x" data-close aria-label="Close">${ic(IC.x)}</button></div>`
      : `<div class="sx-mh"><h2>${esc(title)}</h2><button class="sx-x" data-close aria-label="Close">×</button></div>`;
    box.innerHTML = `<div class="pk-card sx-card wide jb-modal ${head ? "jb-brand " : ""}${cls || ""}" role="dialog" aria-modal="true">${hd}${inner}</div>`;
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
      ${(w.asks || []).some(a => a.status === "asked") ? `<span class="jb-flag">Asked customer</span>` : ""}<span class="pill ${pillTone(w.status)}">${esc((STATUS.find(x => x[0] === w.status) || [0, w.status])[1])}</span><span class="sx-when${late(w) ? " late" : ""}">${esc(etaTxt(w))}</span></button>`;
  }

  /* ---------- scroll wheels for picking a ready time ---------- */
  const ROW = 38;
  // one wheel: items [{label}], start index; onPick(i) when the person scrolls, taps or uses the arrow keys on it
  function wheel(items, start, onPick, label) {
    const el = document.createElement("div"); el.className = "jw"; el.tabIndex = 0; el.setAttribute("role", "listbox"); el.setAttribute("aria-label", label || "");
    el.innerHTML = `<div class="jw-pad"></div>${items.map((x, i) => `<div class="jw-i" role="option" data-i="${i}">${esc(x.label)}</div>`).join("")}<div class="jw-pad"></div>`;
    let cur = start, quiet = true, t = null;
    const mark = () => el.querySelectorAll(".jw-i").forEach((x, i) => { x.classList.toggle("on", i === cur); x.setAttribute("aria-selected", i === cur ? "true" : "false"); });
    const go = (i, smooth) => { i = Math.max(0, Math.min(items.length - 1, i)); el.scrollTo({ top: i * ROW, behavior: smooth ? "smooth" : "auto" }); if (i !== cur) { cur = i; mark(); } };
    el.addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(() => { const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ROW))); if (i !== cur) { cur = i; mark(); } if (!quiet) onPick(cur); }, 90); }, { passive: true });
    const touch = () => { quiet = false; onPick(cur); };
    el.addEventListener("pointerdown", touch); el.addEventListener("wheel", () => { quiet = false; }, { passive: true }); el.addEventListener("touchstart", () => { quiet = false; }, { passive: true });
    el.addEventListener("click", ev => { const it = ev.target.closest(".jw-i"); if (it) { quiet = false; go(+it.dataset.i, true); onPick(+it.dataset.i); } });
    el.addEventListener("keydown", ev => { if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); quiet = false; go(cur + (ev.key === "ArrowDown" ? 1 : -1), true); onPick(cur); } });
    requestAnimationFrame(() => { go(start, false); mark(); setTimeout(() => { quiet = true; }, 0); });
    return { el, get: () => cur, set: i => { quiet = true; go(i, false); } };
  }
  // two wheels across the box: "Time in" (from now) or "Date on" (a day). Using one turns the other off; both are optional.
  function readyPicker(host, onChange) {
    const RT = [[15, "15 min"], [30, "30 min"], [45, "45 min"], [60, "1 hour"], [90, "1½ hours"], [120, "2 hours"], [150, "2½ hours"], [180, "3 hours"], [240, "4 hours"], [300, "5 hours"], [360, "6 hours"], [480, "8 hours"]];
    const DAYS = Array.from({ length: 120 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; });
    let mode = null;
    host.innerHTML = `<div class="jp-one"><div class="jp-col" data-k="time"><span class="jp-l">Time in</span><div class="jp-w" data-w="rt"></div></div>
      <div class="jp-col" data-k="date"><span class="jp-l">Date on</span><div class="jp-w" data-w="on"></div></div></div>
      <div class="jp-foot"><span class="jp-st">Scroll either one. Both are optional.</span><button type="button" class="linkbtn jp-clr" hidden>Clear</button></div>`;
    const use = k => () => { mode = k; emit(); };
    const rt = wheel(RT.map(x => ({ label: x[1] })), 3, use("time"), "Ready in");
    const on = wheel(DAYS.map((d, i) => ({ label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString(window.rvLocale ? rvLocale() : "en-US", { weekday: "short", month: "short", day: "numeric" }) })), 1, use("date"), "Ready on");
    host.querySelector('[data-w="rt"]').appendChild(rt.el); host.querySelector('[data-w="on"]').appendChild(on.el);
    host.querySelector(".jp-clr").onclick = () => { mode = null; emit(); };
    function emit() {
      host.querySelectorAll(".jp-col").forEach(c => { c.classList.toggle("on", mode === c.dataset.k); c.classList.toggle("off", !!mode && mode !== c.dataset.k); });
      host.querySelector(".jp-one").classList.toggle("set", !!mode); host.querySelector(".jp-clr").hidden = !mode;
      host.querySelector(".jp-st").textContent = mode === "time" ? "Counts from now." : mode === "date" ? "Ready sometime that day." : "Scroll either one. Both are optional.";
      let promised = "", promisedAt = "";
      if (mode === "time") { const t = inMinutes(RT[rt.get()][0]); promised = dateOf(t); promisedAt = t.toISOString(); }
      else if (mode === "date") promised = dateOf(DAYS[on.get()]);
      onChange({ promised, promisedAt });
    }
    emit();
  }

  // start a job: what's being done, when it'll be ready, tell the customer. opts: { client: {name, email, app}, bikes: [{id, name}], bikeId, save(pid, rec, notify) -> id, done(pid, id) }
  function startBox(opts) {
    const c = opts.client || {}, bikes = opts.bikes || [], reach = reachTxt(c), fn = first(c.name) || "the customer";
    const bikeNm = (bikes.find(b => b.id === opts.bikeId) || bikes[0] || {}).name || "";
    const chip = (attr, l) => `<button type="button" class="jb-chip" ${attr}>${l}</button>`;
    const m = modal(`<form class="jb-form jb-start" id="jbF" novalidate>
      ${bikes.length > 1 ? `<label class="sx-f jb-bikesel"><b>Bike</b><select name="bike">${bikes.map(b => `<option value="${esc(b.id)}"${b.id === opts.bikeId ? " selected" : ""}>${esc(b.name)}</option>`).join("")}</select></label>` : ""}
      <section class="jb-sec"><div class="jb-sh"><span class="jb-n">1</span><h3>What's the work?</h3><small>Tap everything you're doing</small></div>
        <div class="jb-chips" id="jbChips">${TASKS.map(t => chip(`data-t="${esc(t)}"`, esc(t))).join("")}</div>
        <div class="jb-add"><input id="jbOther" maxlength="80" placeholder="Something else? Type it and press Enter"><button type="button" class="btn sm" data-addt>${ic(IC.plus)} Add</button></div>
        <ul class="jb-picked" id="jbPicked"></ul></section>
      <section class="jb-sec"><div class="jb-sh"><span class="jb-n">2</span><h3>When will it be ready?</h3><small>Pick one</small></div>
        <div class="jp" id="jbPick"></div>
        <div class="jb-etaout" id="jbEta">${ic(IC.clock)}<span>No ready time yet</span></div></section>
      <section class="jb-sec"><div class="jb-sh"><span class="jb-n">3</span><h3>Let ${esc(fn)} know</h3></div>
        <label class="sx-f"><b>Note for ${esc(fn)} <span class="faint">(optional)</span></b><input name="noteClient" maxlength="300" placeholder="Parts on order, call us first, and so on"></label>
        ${reach ? `<label class="jb-tell"><input type="checkbox" name="notify" checked><span><b>Tell ${esc(fn)} it's checked in, and when it's ready</b><small>Sent as ${reach}. They can follow the work in Revora any time.</small></span></label>`
          : `<p class="sx-small jb-tellno">${esc(c.name ? fn : "This customer")} has no email or Revora app yet. Send them their client code from their page and they can follow along and get a notification when it's ready.</p>`}</section>
      <p class="sx-err" hidden></p>
      <div class="jb-bar2"><div class="grow jb-sum" id="jbSum">Pick the work and a ready time</div><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn jb-go">${ic(IC.wrench)} Start the job</button></div></form>`,
      "Start a job", "jb-startm", { eb: "New job", title: bikes.length > 1 ? "Start a job" : bikeNm || "Start a job", sub: esc(c.name || "") });
    const f = m.querySelector("#jbF"), er = m.querySelector(".sx-err"), picked = [], list = m.querySelector("#jbPicked"), other = m.querySelector("#jbOther");
    const W = { promised: "", promisedAt: "" };
    const sum = () => {
      const eta = W.promised || W.promisedAt ? etaTxt({ status: "Checked in", promised: W.promised, promisedAt: W.promisedAt }) : "";
      m.querySelector("#jbEta").innerHTML = `${ic(IC.clock)}<span>${eta ? esc(eta) : "No ready time yet"}</span>`; m.querySelector("#jbEta").classList.toggle("on", !!eta);
      m.querySelector("#jbSum").innerHTML = picked.length || eta ? `<b>${picked.length ? picked.length + " task" + (picked.length === 1 ? "" : "s") : "No work picked"}</b>${eta ? " · " + esc(eta) : ""}` : "Pick the work and a ready time";
    };
    const drawPicked = () => {
      list.innerHTML = picked.filter(t => !TASKS.includes(t)).map(t => `<li>${esc(t)}<button type="button" data-rm="${esc(t)}" aria-label="Remove">${ic(IC.x)}</button></li>`).join("");
      list.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { picked.splice(picked.indexOf(b.dataset.rm), 1); drawPicked(); });
      m.querySelectorAll("#jbChips [data-t]").forEach(b => b.classList.toggle("on", picked.includes(b.dataset.t))); sum();
    };
    m.querySelectorAll("#jbChips [data-t]").forEach(b => b.onclick = () => { const t = b.dataset.t, i = picked.indexOf(t); if (i >= 0) picked.splice(i, 1); else picked.push(t); drawPicked(); er.hidden = true; });
    const addOther = () => { const v = other.value.trim(); if (v && !picked.includes(v)) picked.push(v); other.value = ""; drawPicked(); er.hidden = true; };
    m.querySelector("[data-addt]").onclick = addOther;
    other.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); addOther(); } };
    // ready time: scroll wheels for time and date, both optional
    readyPicker(m.querySelector("#jbPick"), v => { W.promised = v.promised; W.promisedAt = v.promisedAt; er.hidden = true; sum(); });
    f.onsubmit = async ev => {
      ev.preventDefault(); if (other.value.trim()) addOther();
      if (!picked.length) { er.textContent = "Pick at least one thing you're doing."; er.hidden = false; return; }
      const pid = f.bike ? f.bike.value : opts.bikeId || (bikes[0] && bikes[0].id), tasks = picked.map(t => ({ t, done: false }));
      const rec = { job: true, title: titleOf(tasks), complaint: picked.join("\n"), status: "Checked in", dateIn: today(), promised: W.promised || "", promisedAt: W.promisedAt || "", tz: tz(), tasks, noteClient: f.noteClient.value.trim() };
      f.querySelectorAll("button").forEach(x => x.disabled = true);
      try {
        const id = await opts.save(pid, rec, !!(f.notify && f.notify.checked));
        m.close(); ping(pid, id); if (opts.done) opts.done(pid, id, rec);
      } catch (e) { er.textContent = (e && e.message) || "That didn't save. Try again."; er.hidden = false; f.querySelectorAll("button").forEach(x => x.disabled = false); }
    };
    return m;
  }

  // run a job: tick tasks, change the status, mark it ready, hand it back. Photos and asking for extra work are there if they want them.
  // opts: { w, pid, client: {name, email, app, phone}, bikeName, save(patch) -> rec, fetch() -> fresh rec, pickedUp(w), openFull?(), refresh(),
  //         photos: { list(), add(thumb, img), del(id), full(id) }, ask(t, price, photoId) -> rec }
  function manageBox(opts) {
    let w = opts.w, pics = [], asking = false; const c = opts.client || {}, reach = reachTxt(c), fn = first(c.name) || "the customer";
    const m = modal(`<div class="jb-man"></div>`, (c.name ? c.name + " · " : "") + (opts.bikeName || "Job"), "jb-manm", { eb: "In the shop", title: opts.bikeName || "Job", sub: esc(c.name || "") });
    const host = m.querySelector(".jb-man");
    let busy = false;
    const fresh = async () => { if (!opts.fetch) return w; try { const f = await opts.fetch(); if (f) w = f; } catch (e) {} return w; };
    // patch can be a function of the latest copy, so a customer's answer or a teammate's tick isn't overwritten
    const save = async (patch, msg) => {
      if (busy) return; busy = true; host.classList.add("busy");
      try { const pt = typeof patch === "function" ? patch(await fresh()) : patch; w = await opts.save(Object.assign({}, pt)); ping(opts.pid, w.id); if (msg) opts.note(msg); if (opts.refresh) opts.refresh(); }
      catch (e) { opts.note((e && e.message) || "That didn't save. Try again.", true); }
      busy = false; host.classList.remove("busy"); draw();
    };
    const loadPics = async () => { if (!opts.photos) return; try { pics = (await opts.photos.list()) || []; } catch (e) { pics = []; } drawPics(); };
    function drawPics() {
      const box = host.querySelector(".jb-mpics"); if (!box) return;
      box.innerHTML = pics.map(x => `<span class="jb-mpic"><button class="jb-thumb" data-full="${esc(x.id)}" style="background-image:url('${esc(x.thumb)}')" aria-label="Open photo"></button><button class="jb-pdel" data-pdel="${esc(x.id)}" aria-label="Delete photo">${ic(IC.x)}</button></span>`).join("")
        + `<label class="jb-addpic">${ic(IC.cam)}<span>${pics.length ? "Add" : "Add a photo"}</span><input type="file" accept="image/*" capture="environment" hidden></label>`;
      box.querySelectorAll("[data-full]").forEach(b => b.onclick = () => { const x = pics.find(y => y.id === b.dataset.full); viewPhoto(() => opts.photos.full(x.id), x.thumb, x.note); });
      box.querySelectorAll("[data-pdel]").forEach(b => b.onclick = async () => { if (!confirm("Delete this photo? The customer won't see it any more.")) return; try { await opts.photos.del(b.dataset.pdel); } catch (e) { opts.note((e && e.message) || "You can only delete photos you took.", true); } loadPics(); });
      const inp = box.querySelector("input[type=file]");
      inp.onchange = async () => {
        const files = [...inp.files].slice(0, 6); if (!files.length) return;
        box.classList.add("busy");
        for (const f of files) { try { const d = await photoData(f); await opts.photos.add(d.thumb, d.img); } catch (e) { opts.note((e && /full/.test(e.message)) ? "That's the most photos one job can have." : "That photo didn't save. Try again.", true); } }
        box.classList.remove("busy"); ping(opts.pid, w.id); opts.note(`Photo added. ${fn} can see it in Revora.`); loadPics(); drawAsk();
      };
    }
    function drawAsk() {
      const box = host.querySelector(".jb-mask"); if (!box) return;
      const asks = Array.isArray(w.asks) ? w.asks : [];
      const list = asks.length ? `<ul class="jb-asks">${asks.map(a => `<li><span class="grow"><b>${esc(a.t)}</b>${a.price ? `<small>${esc(money(a.price))}</small>` : ""}</span>${askPill(a)}</li>`).join("")}</ul>` : "";
      if (!opts.ask) { box.innerHTML = list; return; }
      if (!asking) { box.innerHTML = list + `<button type="button" class="jb-askbtn" data-askopen>${ic(IC.ask)} Found something else? Ask ${esc(fn)} to add it</button>`; box.querySelector("[data-askopen]").onclick = () => { asking = true; drawAsk(); box.querySelector("#jbAskT").focus(); }; return; }
      box.innerHTML = list + `<div class="jb-askf">
          <label class="sx-f"><b>What needs doing?</b><input id="jbAskT" maxlength="160" placeholder="Rear brake pads are at 2mm, replace them"></label>
          <div class="jb-askrow"><label class="sx-f"><b>Price <span class="faint">(optional)</span></b><input id="jbAskP" inputmode="decimal" placeholder="$85"></label>
            ${pics.length ? `<label class="jb-askph"><input type="checkbox" id="jbAskPh" checked><span class="jb-thumb sm" style="background-image:url('${esc(pics[pics.length - 1].thumb)}')"></span><span>Show the last photo</span></label>` : ""}</div>
          ${c.app ? "" : `<p class="sx-small">${esc(fn)} isn't on the Revora app yet, so they'll get it by email${c.email ? "" : " once you add their email. For now, call or text them"}.</p>`}
          <div class="sx-acts left"><button type="button" class="btn pri" data-asksend>${ic(IC.bell)} Send to ${esc(fn)}</button><button type="button" class="btn" data-askx>Cancel</button></div></div>`;
      box.querySelector("[data-askx]").onclick = () => { asking = false; drawAsk(); };
      const t = box.querySelector("#jbAskT");
      t.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); box.querySelector("[data-asksend]").click(); } };
      box.querySelector("[data-asksend]").onclick = async ev => {
        const txt = t.value.trim(); if (txt.length < 2) { t.focus(); return; }
        const pr = +String(box.querySelector("#jbAskP").value).replace(/[$,\s]/g, "") || null, ph = box.querySelector("#jbAskPh");
        ev.target.disabled = true;
        try { w = await opts.ask(txt, pr, ph && ph.checked && pics.length ? pics[pics.length - 1].id : null); ping(opts.pid, w.id); asking = false; opts.note(`Sent. ${fn} can approve it with one tap${c.app ? " and you'll get a notification with the answer" : ""}.`); if (opts.refresh) opts.refresh(); }
        catch (e) { ev.target.disabled = false; opts.note((e && e.message) || "That didn't send. Try again.", true); return; }
        draw();
      };
    }
    function draw() {
      const t = tasksOf(w), p = prog(w), ready = w.status === "Done";
      const at = w.promisedAt ? new Date(w.promisedAt) : null;
      host.innerHTML = `<div class="jb-mh"><div class="grow"><b>${esc(w.title || titleOf(t) || "Job")}</b><span>${w.dateIn ? "In since " + esc(day(w.dateIn)) : ""}</span></div><div class="jb-etab${late(w) ? " late" : ready ? " ready" : ""}">${ic(ready ? IC.check : IC.clock)}<b>${esc(etaTxt(w))}</b></div></div>
        <div class="jb-seg" role="group" aria-label="Status">${STATUS.map(([k, l]) => `<button type="button" class="${w.status === k ? "on" : ""}" data-st="${esc(k)}">${esc(l)}</button>`).join("")}</div>
        <div class="jb-mt"><div class="jb-wh"><b>The work</b><span>${p.done} of ${p.n} done</span></div>
          <ul class="jb-mtasks">${t.map((x, i) => `<li><label class="${x.done ? "done" : ""}"><input type="checkbox" data-i="${i}" ${x.done ? "checked" : ""}><span>${esc(x.t)}${x.ask ? ` <em class="jb-ok">approved</em>` : ""}</span></label><button type="button" class="jb-rm" data-rmi="${i}" aria-label="Remove">${ic(IC.x)}</button></li>`).join("")}</ul>
          <div class="jb-add"><input id="jbMore" maxlength="80" placeholder="Add a task"><button type="button" class="btn sm" data-more>${ic(IC.plus)} Add</button></div></div>
        ${opts.photos ? `<div class="jb-opt"><div class="jb-wh"><b>Photos</b><span>Optional. ${esc(fn)} sees them in Revora.</span></div><div class="jb-mpics"></div></div>` : ""}
        <div class="jb-opt jb-mask"></div>
        <div class="jb-opt"><div class="jb-wh"><b>Ready by</b><span>${ready ? "" : "Running behind? Push it back and they'll see the new time."}</span></div>
          <div class="jb-rb"><span class="jb-in"><input type="date" id="jbProm" value="${esc(w.promised || "")}" aria-label="Date"><input type="time" id="jbTime" step="300" value="${at ? String(at.getHours()).padStart(2, "0") + ":" + String(at.getMinutes()).padStart(2, "0") : ""}" aria-label="Time (optional)"></span>
            ${ready ? "" : `<span class="jb-chips">${[[30, "+30 min"], [60, "+1 hour"], [1440, "+1 day"]].map(([k, l]) => `<button type="button" class="jb-chip sm" data-push="${k}">${l}</button>`).join("")}</span>`}</div></div>
        <label class="sx-f"><b>Note for ${esc(fn)}</b><input id="jbNote" maxlength="300" value="${esc(w.noteClient || "")}" placeholder="They see this in Revora"></label>
        <div class="jb-big">${ready ? `<button type="button" class="btn pri big" data-picked>${ic(IC.check)} Picked up, add it to their history</button>` : `<button type="button" class="btn pri big jb-readybtn" data-ready>${ic(IC.bell)} Ready${reach ? `, tell ${esc(fn)}` : ""}</button>`}</div>
        <p class="sx-small jb-reach">${reach ? (ready ? `${esc(fn)} got ${reach} that it's ready.` : `${esc(fn)} follows this in Revora${c.app ? " and gets a notification" : " and gets an email"} when you tap Ready.`) : `${esc(c.name ? fn : "They")} can't get updates yet: no email or Revora app.`}${c.phone ? ` <a href="sms:${esc(String(c.phone).replace(/[^0-9+]/g, ""))}?&body=${encodeURIComponent(ready ? `Hi ${fn}, your ${opts.bikeName || "bike"} is ready to pick up.` : `Hi ${fn}, quick update on your ${opts.bikeName || "bike"}: `)}">${ic(IC.text)} Text them</a>` : ""}</p>
        ${opts.openFull ? `<div class="sx-acts left"><button type="button" class="linkbtn" data-full>Open the full work order (estimate, parts, invoice)</button></div>` : ""}`;
      host.querySelectorAll("[data-st]").forEach(b => b.onclick = () => { const st = b.dataset.st; if (st === w.status) return; save(st === "Done" ? { status: st, readyAt: new Date().toISOString() } : { status: st }, st === "Done" ? (reach ? `Marked ready. ${fn} is getting ${reach.replace(/^a |^an /, "")}.` : "Marked ready.") : ""); });
      host.querySelectorAll("[data-i]").forEach(b => b.onchange = () => { const i = +b.dataset.i, label = tasksOf(w)[i] && tasksOf(w)[i].t, on = b.checked;
        save(f => { const tt = tasksOf(f).map(x => Object.assign({}, x)), k = tt[i] && tt[i].t === label ? i : tt.findIndex(x => x.t === label); if (k >= 0) tt[k].done = on; return Object.assign({ tasks: tt }, f.status === "Checked in" && on ? { status: "In progress" } : {}); }); });
      host.querySelectorAll("[data-rmi]").forEach(b => b.onclick = () => { const label = (tasksOf(w)[+b.dataset.rmi] || {}).t; save(f => { const tt = tasksOf(f).filter(x => x.t !== label); return { tasks: tt, title: titleOf(tt) || f.title }; }); });
      const more = host.querySelector("#jbMore"), addMore = () => { const v = more.value.trim(); if (!v) return; save(f => { const tt = tasksOf(f).concat([{ t: v, done: false }]); return { tasks: tt, title: titleOf(tt) }; }); };
      host.querySelector("[data-more]").onclick = addMore; more.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); addMore(); } };
      const setWhen = () => { const d = host.querySelector("#jbProm").value, tv = host.querySelector("#jbTime").value;
        if (!d && !tv) return save({ promised: "", promisedAt: "" });
        const day0 = d || today(); let iso = ""; if (tv) { const [h, mi] = tv.split(":").map(Number), x = new Date(day0 + "T00:00:00"); x.setHours(h, mi, 0, 0); iso = x.toISOString(); }
        save({ promised: day0, promisedAt: iso, tz: tz() }, "Ready time changed. They'll see it in Revora."); };
      host.querySelector("#jbProm").onchange = host.querySelector("#jbTime").onchange = setWhen;
      host.querySelectorAll("[data-push]").forEach(b => b.onclick = () => { const k = +b.dataset.push;
        const base = w.promisedAt && new Date(w.promisedAt) > new Date() ? new Date(w.promisedAt) : k >= 1440 && w.promised ? new Date(w.promised + "T17:00:00") : new Date();
        if (k >= 1440 && !w.promisedAt) { const d = new Date((w.promised && w.promised >= today() ? w.promised : today()) + "T12:00:00"); d.setDate(d.getDate() + 1); return save({ promised: dateOf(d), promisedAt: "" }, "Pushed back a day."); }
        const nx = new Date(base.getTime() + k * 60000); nx.setSeconds(0, 0); nx.setMinutes(Math.ceil(nx.getMinutes() / 5) * 5);
        save({ promised: dateOf(nx), promisedAt: nx.toISOString(), tz: tz() }, "Pushed back. They'll see the new time in Revora."); });
      host.querySelector("#jbNote").onchange = ev => save({ noteClient: ev.target.value.trim() }, "Note saved. They'll see it in Revora.");
      const rd = host.querySelector("[data-ready]"); if (rd) rd.onclick = () => save(f => ({ status: "Done", readyAt: new Date().toISOString(), tasks: tasksOf(f).map(x => Object.assign({}, x, { done: true })) }), reach ? `Marked ready. ${fn} is getting ${reach.replace(/^a |^an /, "")}.` : "Marked ready.");
      const pk = host.querySelector("[data-picked]"); if (pk) pk.onclick = async () => { pk.disabled = true; try { await opts.pickedUp(await fresh()); m.close(); opts.note("Done. It's in their service history."); if (opts.refresh) opts.refresh(); } catch (e) { pk.disabled = false; opts.note((e && e.message) || "That didn't save.", true); } };
      const fl = host.querySelector("[data-full]"); if (fl) fl.onclick = () => opts.openFull();
      drawPics(); drawAsk();
    }
    draw(); loadPics(); fresh().then(() => draw());
    return m;
  }
  // what goes into the service history when the bike is picked up
  // which schedule items the finished work covers, so their next due dates reset (an oil change resets "Engine oil and filter", and so on)
  const COVERS = [[/fluid/, /brake fluid|clutch fluid/], [/brake/, /brake pad|brake shoe|brakes?\b(?!.*fluid)/], [/oil/, /engine oil|oil and filter|oil change|oil & filter/], [/tire|tyre/, /tire|tyre/],
    [/chain|sprocket/, /chain|sprocket/], [/tune/, /spark plug|air filter/], [/spark/, /spark plug/], [/air filter/, /air filter/], [/carb|throttle/, /carb|throttle body/],
    [/battery/, /battery/], [/coolant|radiator/, /coolant/], [/valve/, /valve/], [/fork|suspension/, /fork|suspension/], [/clutch/, /clutch/], [/belt/, /belt/], [/fuel filter/, /fuel filter/]];
  function coveredItems(tasks, schedule) {
    const out = new Set();
    tasks.forEach(t => { const txt = String(t.t || "").toLowerCase();
      COVERS.forEach(([tr, ir]) => { if (!tr.test(txt)) return; if (tr.source === "brake" && /fluid/.test(txt)) return;
        (schedule || []).forEach(s => { if (s && s.id && ir.test(String(s.name || "").toLowerCase())) out.add(s.id); }); }); });
    return [...out];
  }
  const historyRec = (w, schedule) => { const t = tasksOf(w), done = t.filter(x => x.done), used = done.length ? done : t;
    return { date: today(), service: used.map(x => x.t).join(", ") || w.title || "Service", kind: schedule && coveredItems(used, schedule).length ? "Scheduled service" : "Repair", items: coveredItems(used, schedule), fromJob: w.id, notes: w.noteClient || "" }; };

  window.rvJobs = { coveredItems, STATUS, CUST, TASKS, tasksOf, prog, titleOf, late, etaTxt, trackCard, bindTrack, boardRow, startBox, manageBox, historyRec, ping, push, notifyStrip, today, viewPhoto };
})();
