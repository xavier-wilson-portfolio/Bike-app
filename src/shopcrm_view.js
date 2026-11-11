/* ============ Revora Shop: the client book for shops (?crm) ============
   Clients, their bikes, service logs, what's due, reminder emails, upgrades, budgets, history reports and bike values,
   requests from clients, staff logins, client links and handing a bike over to the client's own account.
   Client bikes are normal Revora projects owned by the shop owner (projects.shop_id), so the full bike page still works for them. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n = v => +v || 0;
  const D = () => window.rvDue, DOC = () => window.rvShopDoc;
  const usd = v => "$" + (Math.round(n(v) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: n(v) % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const usd0 = v => "$" + Math.round(n(v)).toLocaleString("en-US");
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9@.]/g, "");
  const digits = s => String(s || "").replace(/\D/g, "");
  const I = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', plus: '<path d="M12 5v14M5 12h14"/>', wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/>', doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>', money: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>', home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    back: '<path d="M15 5l-7 7 7 7"/>', bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>', check: '<path d="M5 12l4 4 10-10"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', send: '<path d="M4 12l16-8-6 16-3-7z"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>', move: '<path d="M4 12h12M12 6l6 6-6 6"/><path d="M20 4v16"/>', tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>' };
  const ic = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k] || ""}</svg>`;
  const STYLES = [["standard", "Standard / naked"], ["cruiser", "Cruiser"], ["sport", "Sport"], ["adventure", "Adventure"], ["dualsport", "Dual-sport / dirt"], ["touring", "Touring"], ["cafe", "Cafe racer / classic"], ["scooter", "Scooter"]];
  const DRIVES = [["chain", "Chain"], ["shaft", "Shaft"], ["belt", "Belt"], ["cvt", "Scooter (CVT)"]];
  const MOD_LABEL = { Planned: "Wanted", Ordered: "Ordered", Installed: "Installed", Removed: "Removed" };
  const WO_DONE = ["Picked up", "Declined"];
  const PREFIX = { workorders: ["WO-U", 4], maintenance: ["MAINT-U", 3], mileage: ["ODO-U", 4], mods: ["MOD-U", 3], schedule: ["SVC-U", 3] };

  let X = null;          // { sb, session, profile, app, note, url, goUrl, silFile, plansOk, showPlans, guessStyle, guessDrive }
  let S = null;          // shop data in memory

  /* ---------- small UI helpers ---------- */
  const note = (m, bad) => X.note(m, bad);
  function modal(inner, opts = {}) {
    const box = document.createElement("div"); box.className = "pk-modal sx-modal";
    box.innerHTML = `<div class="pk-card sx-card${opts.wide ? " wide" : ""}${opts.doc ? " doc" : ""}" role="dialog" aria-modal="true">${opts.title ? `<div class="sx-mh"><h2>${esc(opts.title)}</h2><button class="sx-x" data-close aria-label="Close">×</button></div>` : ""}${inner}</div>`;
    box.addEventListener("click", ev => { if (ev.target === box && !opts.sticky || ev.target.closest("[data-close]")) close(); });
    const esc2 = ev => { if (ev.key === "Escape") close(); }; document.addEventListener("keydown", esc2);
    function close() { box.remove(); document.removeEventListener("keydown", esc2); if (opts.onClose) opts.onClose(); }
    document.body.appendChild(box); box.close = close;
    const f = box.querySelector("input:not([type=checkbox]):not([type=hidden]),textarea"); if (f && !(matchMedia && matchMedia("(pointer:coarse)").matches)) setTimeout(() => { if (!box.contains(document.activeElement)) f.focus(); }, 30);
    return box;
  }
  function confirmBox(title, text, yes, fn, danger) {
    const m = modal(`<p class="sx-p">${text}</p><div class="sx-acts"><button class="btn" data-close>Cancel</button><button class="btn ${danger ? "danger" : "pri"}" data-yes>${esc(yes)}</button></div>`, { title });
    m.querySelector("[data-yes]").onclick = async ev => { ev.target.disabled = true; try { await fn(); } finally { m.close(); } };
  }
  async function copy(txt, label) { try { await navigator.clipboard.writeText(txt); note((label || "Copied") + "."); } catch (e) { prompt("Copy this:", txt); } }
  const pill = st => { const p = D().PILL[st] || D().PILL.none; return `<span class="pill ${p[0]}">${p[1]}</span>`; };
  const fmt = iso => D().fmtDate(iso);
  const telLink = p => p ? `<a href="tel:${esc(digits(p))}" class="sx-ct">${ic("phone")}${esc(p)}</a>` : "";
  const mailLink = m => m ? `<a href="mailto:${esc(m)}" class="sx-ct">${ic("mail")}${esc(m)}</a>` : "";
  const silFor = m => { const f = X.silFile((m && m.silhouette) || "") || X.silFile("bike-" + ((m && m.style) || "standard")) || X.silFile("bike-standard"); return f ? `img/sil/${f}` : ""; };
  const joinUrl = c => location.origin + location.pathname + "?join=" + encodeURIComponent(c.code);
  const isOwner = () => S && S.role === "owner";
  // big changes ask for the account password (on the owner's computers anyone can be standing at the keyboard)
  const withPw = (what, fn) => window.rvShopLock && X.session ? rvShopLock.needPassword(X, what, fn) : fn();
  const today = () => D().today();
  const err = e => (e && e.message) || "Something went wrong. Check your internet and try again.";

  /* ---------- loading ---------- */
  async function loadAll() {
    const sb = X.sb, sid = S.shop.id;
    const [cl, pr, rq] = await Promise.all([
      sb.from("shop_clients").select("*").eq("shop_id", sid).order("name"),
      sb.from("my_projects").select("id,name,bike_id,shop_client,created_at,role").eq("shop_id", sid),
      sb.from("shop_requests").select("id,client_id,project_id,kind,status,asked_by_client,token,created_at,decided_at,emailed_at").eq("shop_id", sid).order("created_at", { ascending: false }).limit(300)]);
    if (cl.error) throw cl.error; if (pr.error) throw pr.error;
    S.clients = new Map((cl.data || []).map(c => [c.id, c]));
    S.requests = rq.error ? [] : rq.data || [];
    S.bikes = new Map((pr.data || []).map(p => [p.id, { p, meta: {}, recs: { schedule: [], maintenance: [], mileage: [], mods: [], workorders: [], fuel: [] }, c: null }]));
    S.money = new Map();
    S.emps = []; S.assign = [];
    if (isOwner()) {
      const [mo, em, as] = await Promise.all([sb.from("shop_client_money").select("*").eq("shop_id", sid), sb.from("shop_employees").select("id,name,email,status,created_at,setup_at,last_seen").eq("shop_id", sid).order("name"), sb.from("shop_assignments").select("*").eq("shop_id", sid)]);
      (mo.data || []).forEach(m => S.money.set(m.client_id, m)); S.emps = (em.data || []).filter(e => e.status !== "removed"); S.assign = as.data || [];
    }
    const ids = [...S.bikes.keys()], colls = ["meta", "schedule", "maintenance", "mileage", "mods", "workorders", "fuel"];
    for (let i = 0; i < ids.length; i += 80) {
      const chunk = ids.slice(i, i + 80);
      for (let from = 0; ; from += 1000) {
        const { data, error } = await sb.from("records").select("project_id,coll,rec_id,data").in("project_id", chunk).in("coll", colls).order("project_id").order("coll").order("rec_id").range(from, from + 999);
        if (error) throw error;
        (data || []).forEach(r => { const b = S.bikes.get(r.project_id); if (!b) return; if (r.coll === "meta") { if (r.rec_id === "project") b.meta = r.data || {}; return; } b.recs[r.coll].push(Object.assign({}, r.data, { id: r.rec_id })); });
        if (!data || data.length < 1000) break;
      }
    }
    S.bikes.forEach(b => recalc(b));
  }
  function recalc(b) { b.c = D().compute({ schedule: b.recs.schedule, maintenance: b.recs.maintenance, mileage: b.recs.mileage, fuel: b.recs.fuel, monthlyMiles: b.meta.reminders && b.meta.reminders.monthlyMiles }); return b; }
  const bikesOf = cid => [...S.bikes.values()].filter(b => b.p.shop_client === cid).sort((a, z) => String(a.p.created_at).localeCompare(String(z.p.created_at)));
  const bikeName = b => (b.meta && b.meta.bike) || b.p.name || "Bike";
  const clientOf = b => S.clients.get(b.p.shop_client) || null;
  const pendingReq = () => S.requests.filter(q => q.status === "pending");
  const byTxt = r => r.byEmp ? r.byEmp.name : r.byOwner ? r.byOwner : "";

  /* ---------- writing records ---------- */
  function nextId(b, coll) {
    const [pre, pad] = PREFIX[coll], base = pre.replace(/U$/, ""); let max = 0;
    b.recs[coll].forEach(r => { const m = String(r.id).match(/(\d+)$/); if (String(r.id).startsWith(base) && m) max = Math.max(max, +m[1]); });
    return pre + String(max + 1).padStart(pad, "0");
  }
  const who = () => (X.profile && X.profile.display_name) || (X.session.user.email || "").split("@")[0];
  async function putRecs(b, items) {   // items: [{ coll, rec }]
    const now = new Date().toISOString();
    const rows = items.map(({ coll, rec }) => { const d = Object.assign({ archived: false, createdAt: now }, rec, { updatedAt: now, updatedBy: who(), updatedById: X.session.user.id }); return { coll, d, row: { project_id: b.p.id, coll, rec_id: d.id, data: d, updated_at: now } }; });
    const { error } = await X.sb.from("records").upsert(rows.map(x => x.row));
    if (error) throw error;
    rows.forEach(({ coll, d }) => { if (coll === "meta") { b.meta = d; return; } const L = b.recs[coll], i = L.findIndex(r => r.id === d.id); if (i >= 0) L[i] = d; else L.push(d); });
    recalc(b); syncReminders(b).catch(() => {});
  }
  async function putMeta(b, patch) { const m = Object.assign({}, b.meta, patch, { id: "project" }); await putRecs(b, [{ coll: "meta", rec: m }]); }
  async function delRec(b, coll, id) {
    const { error } = await X.sb.from("records").delete().match({ project_id: b.p.id, coll, rec_id: id }); if (error) throw error;
    b.recs[coll] = b.recs[coll].filter(r => r.id !== id); recalc(b); syncReminders(b).catch(() => {});
  }
  // keep this bike's upcoming reminder emails in shop_reminders; the worker only sends them when the client said yes
  async function syncReminders(b) {
    const c = clientOf(b); if (!c) return;
    const sb = X.sb, rows = c.email ? D().reminderRows(b.c, bikeName(b)) : [];
    const del = await sb.from("shop_reminders").delete().eq("project_id", b.p.id).is("sent_at", null); if (del.error) return;
    if (!rows.length) return;
    const { data: sent } = await sb.from("shop_reminders").select("item_key,due_on").eq("project_id", b.p.id).not("sent_at", "is", null);
    const done = new Set((sent || []).map(r => r.item_key + "|" + r.due_on));
    const fresh = rows.filter(r => !done.has(r.item_key + "|" + r.due_on)).map(r => Object.assign(r, { shop_id: S.shop.id, client_id: c.id, project_id: b.p.id }));
    if (fresh.length) await sb.from("shop_reminders").insert(fresh);
  }

  /* ---------- page frame and routing ---------- */
  const TABS = [["today", "Today", "home"], ["clients", "Clients", "users"], ["requests", "Requests", "inbox"], ["team", "Team", "users"], ["money", "Money", "money"], ["settings", "Shop", "gear"]];
  const route = () => { const q = new URLSearchParams(location.search); return { t: q.get("t") || "today", id: q.get("id") || "" }; };
  function nav(t, id, replace) {
    const u = new URL(location.href); u.search = "?crm"; if (t && t !== "today") u.searchParams.set("t", t); if (id) u.searchParams.set("id", id);
    history[replace ? "replaceState" : "pushState"](null, "", u.toString()); draw(); window.scrollTo(0, 0);
  }
  function shell(inner, active) {
    const pend = pendingReq().length;
    X.app.innerHTML = `<div class="sx"><header class="sx-top"><div class="sx-top-in">
        <a class="sx-brand" href="?crm" data-t="today" aria-label="Revora Shop home"><img src="img/revora-icon.svg" alt=""><img class="sx-word" src="img/revora-word-white.svg" alt="Revora"><span class="sx-shopname">${esc(S.shop.name || "Your shop")}</span></a>
        <nav class="sx-tabs" aria-label="Shop">${TABS.filter(t => !["money", "team"].includes(t[0]) || isOwner()).map(([k, l, i]) => `<a href="?crm${k === "today" ? "" : "&t=" + k}" data-t="${k}" class="${active === k ? "on" : ""}">${ic(i)}<span>${l}</span>${k === "requests" && pend ? `<em>${pend}</em>` : ""}</a>`).join("")}</nav>
        <div class="sx-me"><a class="sx-garage" href="${esc(X.url({ garage: 1 }))}">Your garage</a>${isOwner() && window.rvShopLock && rvShopLock.isAdmin(X) && rvShopLock.customerMode() ? `<button class="btn sm lk-lock" data-cmexit title="Back to the admin view">Customer mode · Exit</button>` : ""}${isOwner() && window.rvShopLock && !rvShopLock.adminBypass(X) ? `<button class="btn sm lk-lock" data-lockall title="Back to the shop login">${ic("lock")} Lock</button>` : ""}</div></div></header>
      <main class="sx-main">${inner}</main></div>`;
    X.app.querySelectorAll("[data-t]").forEach(a => a.onclick = ev => { ev.preventDefault(); nav(a.dataset.t); });
    const lk = X.app.querySelector("[data-lockall]"); if (lk) lk.onclick = () => rvShopLock.lockAll();
    const cx = X.app.querySelector("[data-cmexit]"); if (cx) cx.onclick = () => { rvShopLock.setCustomerMode(false); location.href = X.url({ garage: 1 }); };
  }
  function draw() {
    const r = route();
    document.title = (S.shop.name || "Shop") + " · Revora Shop";
    if (r.t === "client" && S.clients.get(r.id)) return viewClient(S.clients.get(r.id));
    if (r.t === "clients") return viewClients();
    if (r.t === "requests") return viewRequests();
    if (r.t === "money" && isOwner()) return viewMoney();
    if (r.t === "team" && isOwner()) return viewTeam();
    if (r.t === "settings") return viewSettings();
    if (r.t === "import" && isOwner()) return viewImport();
    if (r.t === "due") return viewDue(r.id);
    if (r.t === "inshop") return viewInShop();
    if (r.t === "visits") return viewVisits();
    return viewToday();
  }

  /* ---------- search ---------- */
  function searchHits(q) {
    const t = norm(q), d = digits(q); if (!t) return [];
    return [...S.clients.values()].map(c => {
      const bikes = bikesOf(c.id).map(bikeName), hay = [c.name, c.email, c.code, ...bikes].map(norm).join(" ");
      let score = 0; if (norm(c.name).startsWith(t)) score += 5; else if (norm(c.name).includes(t)) score += 3;
      if (hay.includes(t)) score += 1; if (d.length >= 3 && digits(c.phone).includes(d)) score += 4; if (norm(c.code) === t) score += 10;
      return { c, bikes, score };
    }).filter(x => x.score > 0).sort((a, z) => z.score - a.score || a.c.name.localeCompare(z.c.name)).slice(0, 8);
  }
  function bindSearch(root) {
    const q = root.querySelector("#sxQ"), out = root.querySelector("#sxHits"); if (!q) return;
    let sel = 0;
    const paint = () => {
      const hits = searchHits(q.value); sel = Math.min(sel, Math.max(0, hits.length - 1));
      out.hidden = !q.value.trim();
      out.innerHTML = hits.length ? hits.map((h, i) => { const nx = nextDueOf(h.c.id); return `<button class="sx-hit${i === sel ? " on" : ""}" data-open="${esc(h.c.id)}"><span class="sx-av">${esc(initials(h.c.name))}</span><span class="grow"><b>${esc(h.c.name)}</b><small>${esc([h.c.phone, h.bikes.join(", ")].filter(Boolean).join(" · ") || h.c.email || "")}</small></span>${nx ? pill(nx.status) : ""}</button>`; }).join("")
        : `<div class="sx-nohit"><span>No client called "${esc(q.value.trim())}".</span><button class="btn sm pri" data-newname="${esc(q.value.trim())}">${ic("plus")} Add them as a new client</button></div>`;
      out.querySelectorAll("[data-open]").forEach(b => b.onclick = () => nav("client", b.dataset.open));
      const nb = out.querySelector("[data-newname]"); if (nb) nb.onclick = () => newClientBox(nb.dataset.newname);
    };
    q.oninput = () => { sel = 0; paint(); };
    q.onkeydown = ev => { const hits = out.querySelectorAll("[data-open]");
      if (ev.key === "ArrowDown") { ev.preventDefault(); sel = Math.min(hits.length - 1, sel + 1); paint(); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); sel = Math.max(0, sel - 1); paint(); }
      else if (ev.key === "Enter") { ev.preventDefault(); if (hits[sel]) hits[sel].click(); else { const nb = out.querySelector("[data-newname]"); if (nb) nb.click(); } }
      else if (ev.key === "Escape") { q.value = ""; paint(); } };
  }
  const initials = nm => String(nm || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
  function nextDueOf(cid) { let best = null; bikesOf(cid).forEach(b => { const it = b.c.ranked.find(i => i.status === "over" || i.status === "soon" || i.status === "ok"); if (it && (!best || ({ over: 0, soon: 1, ok: 2 })[it.status] < ({ over: 0, soon: 1, ok: 2 })[best.status] || (it.status === best.status && String(it.due || it.nextDate || "9") < String(best.due || best.nextDate || "9")))) best = Object.assign({ bike: b }, it); }); return best; }
  const lastVisitOf = cid => bikesOf(cid).map(b => b.c.last && b.c.last.date).filter(Boolean).sort().pop() || "";

  /* ---------- what's due ---------- */
  const dueKey = i => String(i.nextDate || i.due || "");   // the date the "days overdue" is counted from
  function allDue() {
    const due = [];
    S.bikes.forEach(b => b.c.items.filter(i => i.status === "over" || i.status === "soon").forEach(i => due.push({ b, i, c: clientOf(b) })));
    // most important first: overdue before due soon, and the longest overdue at the top
    return due.sort((a, z) => (a.i.status === "over" ? 0 : 1) - (z.i.status === "over" ? 0 : 1) || (dueKey(a.i) || "9").localeCompare(dueKey(z.i) || "9"));
  }
  const dueRow = ({ b, i, c }) => `<button class="sx-row" data-open="${esc(c ? c.id : "")}"><span class="grow"><b>${esc(c ? c.name : "No client")}</b><small>${esc(bikeName(b))} · ${esc(i.name)}</small></span><span class="sx-when">${esc(D().whenTxt(i))}</span>${pill(i.status)}</button>`;
  const DUE_SORTS = [["urgent", "Most urgent"], ["newest", "Newest first"], ["oldest", "Oldest first"], ["name", "Client A to Z"], ["visit", "Last visit"]];
  function viewDue(which) {
    const f = which === "over" || which === "soon" ? which : "all", all = allDue(), overC = all.filter(x => x.i.status === "over").length;
    let sort = "urgent"; try { sort = sessionStorage.getItem("rv.dueSort") || "urgent"; } catch (e) {}
    const tab = (k, label, nn, cls) => `<button class="sx-dtab${f === k ? " on" : ""}${cls ? " " + cls : ""}" data-dtab="${k}"><span>${label}</span><b>${nn}</b></button>`;
    shell(`<button class="sx-back" data-go="today">${ic("back")} Today</button>
      <div class="sx-pageh"><div><h1>What's due</h1><p>Services that are overdue or due in the next 30 days. Tap a client to call them or book them in.</p></div></div>
      <div class="sx-dtabs">${tab("all", "All", all.length)}${tab("over", "Overdue", overC, "red")}${tab("soon", "Due soon", all.length - overC, "amber")}</div>
      <div class="sx-filter">${ic("search")}<input id="sxDF" type="search" placeholder="Find a client, bike or service" autocomplete="off" aria-label="Find in what's due">
        <select id="sxDS" aria-label="Sort">${DUE_SORTS.map(([k, l]) => `<option value="${k}"${k === sort ? " selected" : ""}>${l}</option>`).join("")}</select></div>
      <section class="sx-panel"><div class="sx-rows" id="sxDL"></div></section>`, "today");
    bindCommon();
    const q = X.app.querySelector("#sxDF"), so = X.app.querySelector("#sxDS"), out = X.app.querySelector("#sxDL");
    X.app.querySelectorAll("[data-dtab]").forEach(b => b.onclick = () => nav("due", b.dataset.dtab === "all" ? "" : b.dataset.dtab, true));
    const paint = () => {
      const t = norm(q.value), d = digits(q.value);
      let L = all.filter(x => f === "all" || x.i.status === f)
        .filter(x => !t || norm([x.c && x.c.name, bikeName(x.b), x.i.name, x.c && x.c.email].join(" ")).includes(t) || (d.length >= 3 && x.c && digits(x.c.phone).includes(d)));
      if (so.value === "newest") L.sort((a, z) => dueKey(z.i).localeCompare(dueKey(a.i)));
      if (so.value === "oldest") L.sort((a, z) => (dueKey(a.i) || "9").localeCompare(dueKey(z.i) || "9"));
      if (so.value === "name") L.sort((a, z) => String(a.c && a.c.name || "").localeCompare(String(z.c && z.c.name || "")) || (dueKey(a.i) || "9").localeCompare(dueKey(z.i) || "9"));
      if (so.value === "visit") L.sort((a, z) => lastVisitOf(z.c && z.c.id).localeCompare(lastVisitOf(a.c && a.c.id)));
      out.innerHTML = L.length ? L.map(dueRow).join("") + `<p class="sx-more">${L.length} service${L.length === 1 ? "" : "s"}${L.length !== all.length ? ` of ${all.length}` : ""}</p>`
        : `<div class="sx-empty">${ic("check")}<b>${all.length ? (q.value.trim() ? "Nothing matches." : f === "over" ? "Nothing overdue." : "Nothing due soon.") : "Nothing coming due."}</b><span>${all.length && q.value.trim() ? "Try part of their name, bike or phone." : "Services that come due show up here, so you know who to call."}</span></div>`;
      out.querySelectorAll("[data-open]").forEach(b => b.onclick = () => b.dataset.open && nav("client", b.dataset.open));
    };
    q.oninput = paint; so.onchange = () => { try { sessionStorage.setItem("rv.dueSort", so.value); } catch (e) {} paint(); }; paint();
  }

  function allJobs() {
    const wos = []; S.bikes.forEach(b => b.recs.workorders.filter(w => !w.archived && !WO_DONE.includes(w.status)).forEach(w => wos.push({ b, w })));
    const when = w => w.promisedAt ? new Date(w.promisedAt).toISOString() : w.promised ? w.promised + "T23:59" : "9999";   // ready-by time first, then the date
    return wos.sort((a, z) => when(a.w).localeCompare(when(z.w)));
  }
  function allVisits(per) {
    const v = []; S.bikes.forEach(b => (per ? b.c.done.slice(0, per) : b.c.done).forEach(r => v.push({ b, r })));
    return v.sort((a, z) => String(z.r.date).localeCompare(String(a.r.date)));
  }
  const jobRow = ({ b, w }) => { const c = clientOf(b); return rvJobs.boardRow(Object.assign({ pid: b.p.id }, w), { client: c ? c.name : "", bike: bikeName(b) }); };
  const visitRow = ({ b, r }) => { const c = clientOf(b); return `<button class="sx-row" data-open="${esc(c ? c.id : "")}"><span class="sx-date">${esc(fmt(r.date))}</span><span class="grow"><b>${esc(r.service || "Service")}</b><small>${esc(c ? c.name : "")} · ${esc(bikeName(b))}${byTxt(r) ? " · by " + esc(byTxt(r)) : ""}</small></span></button>`; };
  const seeAll = (go, nn) => `<button class="sx-seeall" data-go="${go}">See all ${nn} ${ic("arrow")}</button>`;
  const seeAllTop = (go, nn) => `<button class="btn sm" data-go="${go}">See all ${nn}</button>`;
  // a full list page: back to Today, a search box, every row
  function listPage(title, sub, rows, hay, row, empty, after) {
    shell(`<button class="sx-back" data-go="today">${ic("back")} Today</button>
      <div class="sx-pageh"><div><h1>${title}</h1><p>${sub}</p></div></div>
      <div class="sx-filter">${ic("search")}<input id="sxLF" type="search" placeholder="Find a client, bike or job" autocomplete="off" aria-label="Search"></div>
      <section class="sx-panel"><div class="sx-rows" id="sxLL"></div></section>`, "today");
    bindCommon();
    const q = X.app.querySelector("#sxLF"), out = X.app.querySelector("#sxLL");
    const paint = () => { const t = norm(q.value), L = rows.filter(x => !t || norm(hay(x)).includes(t));
      out.innerHTML = L.length ? L.map(row).join("") + `<p class="sx-more">${L.length}${L.length !== rows.length ? ` of ${rows.length}` : ""}</p>` : `<div class="sx-empty">${ic("check")}<b>${rows.length ? "Nothing matches." : empty}</b></div>`;
      bindCommon(); if (after) after(); };
    q.oninput = () => { const pos = q.selectionStart; paint(); q.focus(); q.setSelectionRange(pos, pos); }; paint();
  }
  function viewInShop() {
    listPage("In the shop", "Every bike being worked on, soonest ready first. Tap one to update it.", allJobs(),
      ({ b, w }) => { const c = clientOf(b); return [c && c.name, bikeName(b), w.job, w.title, w.status].join(" "); }, jobRow, "Nothing in the shop.");
  }
  function viewVisits() {
    listPage("Recent visits", "Every service logged, newest first.", allVisits(0),
      ({ b, r }) => { const c = clientOf(b); return [c && c.name, bikeName(b), r.service, byTxt(r)].join(" "); }, visitRow, "No services logged yet.");
  }

  /* ---------- Today ---------- */
  function viewToday() {
    const all = [...S.bikes.values()], due = allDue();
    const wos = allJobs(), visits = allVisits(0);
    const pend = pendingReq(), overC = due.filter(x => x.i.status === "over").length;
    const h = new Date().getHours(), hi = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    shell(`<div class="jb-notify" id="sxNotify" hidden></div><section class="sx-hero"><div class="sx-hero-t"><h1>${hi}${S.shop.name ? ", " + esc(S.shop.name) : ""}.</h1><p>${S.clients.size ? `${S.clients.size} client${S.clients.size === 1 ? "" : "s"}, ${S.bikes.size} bike${S.bikes.size === 1 ? "" : "s"}.` : "Add your first client to get started."}${S.clients.size < 10 && isOwner() ? ` <button class="linkbtn sx-implink" data-go="import">Coming from another system? Bring your clients over.</button>` : ""}</p></div>
        <div class="sx-find"><div class="sx-qwrap">${ic("search")}<input id="sxQ" type="search" placeholder="Find a client by name, phone, email or bike" autocomplete="off" aria-label="Find a client"><div class="sx-hits" id="sxHits" hidden></div></div>
          <button class="btn tan big" data-newc>${ic("plus")} New client</button></div></section>
      <div class="sx-kpis">
        <button class="sx-kpi" data-go="clients"><span>Clients</span><b>${S.clients.size}</b></button>
        <button class="sx-kpi${overC ? " red" : ""}" data-due="over"><span>Overdue</span><b>${overC}</b></button>
        <button class="sx-kpi${due.length - overC ? " amber" : ""}" data-due="soon"><span>Due soon</span><b>${due.length - overC}</b></button>
        <button class="sx-kpi" data-go="inshop"><span>In the shop</span><b>${wos.length}</b></button>
        <button class="sx-kpi${pend.length ? " blue" : ""}" data-go="requests"><span>Requests</span><b>${pend.length}</b></button></div>
      <div class="sx-grid2">
        <section class="sx-panel" id="sxDue"><div class="sx-ph"><h2>Coming due</h2><span>${due.length > 5 ? "The 5 most urgent" : "Overdue or due in the next 30 days"}</span>${due.length > 5 ? `<button class="btn sm" data-due="">See all ${due.length}</button>` : ""}</div>
          ${due.length ? `<div class="sx-rows">${due.slice(0, 5).map(dueRow).join("")}</div>${due.length > 5 ? `<button class="sx-seeall" data-due="">See all ${due.length} ${ic("arrow")}</button>` : ""}`
            : `<div class="sx-empty">${ic("check")}<b>Nothing coming due.</b><span>Services due in the next 30 days show up here, so you know who to call.</span></div>`}</section>
        <section class="sx-panel" id="sxWo"><div class="sx-ph"><h2>In the shop</h2><span>${wos.length > 5 ? "The 5 due back soonest" : "Tap one to update it. Customers follow along in Revora."}</span>${wos.length > 5 ? seeAllTop("inshop", wos.length) : ""}</div>
          ${wos.length ? `<div class="sx-rows">${wos.slice(0, 5).map(jobRow).join("")}</div>${wos.length > 5 ? seeAll("inshop", wos.length) : ""}`
            : `<div class="sx-empty">${ic("wrench")}<b>Nothing in the shop.</b><span>When a bike comes in, open the client and tap Start a job. They'll see the work and when it'll be ready.</span></div>`}</section>
        <section class="sx-panel"><div class="sx-ph"><h2>Requests</h2><span>Clients asking for a report, value or budget</span>${pend.length > 5 ? seeAllTop("requests", pend.length) : ""}</div>
          ${pend.length ? `<div class="sx-rows">${pend.slice(0, 5).map(reqRow).join("")}</div>${pend.length > 5 ? seeAll("requests", pend.length) : ""}` : `<div class="sx-empty">${ic("inbox")}<b>No requests waiting.</b><span>When a client asks for their history report, bike value or budget, it shows up here for you to approve.</span></div>`}</section>
        <section class="sx-panel"><div class="sx-ph"><h2>Recent visits</h2><span>Last services logged</span>${visits.length > 5 ? seeAllTop("visits", visits.length) : ""}</div>
          ${visits.length ? `<div class="sx-rows">${visits.slice(0, 5).map(visitRow).join("")}</div>${visits.length > 5 ? seeAll("visits", visits.length) : ""}` : `<div class="sx-empty">${ic("doc")}<b>No services logged yet.</b><span>Open a client and tap Log service when their bike comes in.</span></div>`}</section>
      </div>`, "today");
    bindCommon();
    rvJobs.notifyStrip(X.app.querySelector("#sxNotify"), X.sb, note, false, true);
  }
  function reqRow(q) {
    const c = S.clients.get(q.client_id), b = S.bikes.get(q.project_id);
    return `<div class="sx-row sx-req"><span class="grow"><b>${esc(c ? c.name : "Client")} wants the ${esc((DOC().KIND[q.kind] || q.kind).toLowerCase())}</b><small>${esc(b ? bikeName(b) : "")} · asked ${esc(fmt(q.created_at))}</small></span>
      ${q.kind === "budget" && !isOwner() ? `<span class="sx-when">Owner approves budgets</span>` : `<button class="btn sm" data-decline="${esc(q.id)}">Decline</button><button class="btn sm pri" data-approve="${esc(q.id)}">${ic("check")} Approve and send</button>`}</div>`;
  }
  function bindCommon() {
    const root = X.app;
    bindSearch(root);
    root.querySelectorAll("[data-newc]").forEach(b => b.onclick = () => newClientBox(""));
    root.querySelectorAll("[data-go]").forEach(b => b.onclick = () => nav(b.dataset.go));
    root.querySelectorAll("[data-due]").forEach(b => b.onclick = () => nav("due", b.dataset.due));
    root.querySelectorAll("[data-scroll]").forEach(b => b.onclick = () => document.getElementById(b.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    root.querySelectorAll("[data-open]").forEach(b => b.onclick = () => b.dataset.open && nav("client", b.dataset.open));
    root.querySelectorAll("[data-wo]").forEach(b => b.onclick = () => { const [pid, wid] = b.dataset.wo.split("|"); openBikePage(pid, "workorders", wid); });
    root.querySelectorAll("[data-job]").forEach(b => b.onclick = () => { const [pid, wid] = b.dataset.job.split("|"); openJob(pid, wid); });
    root.querySelectorAll("[data-approve]").forEach(b => b.onclick = () => approveReq(S.requests.find(q => q.id === b.dataset.approve)));
    root.querySelectorAll("[data-decline]").forEach(b => b.onclick = () => declineReq(S.requests.find(q => q.id === b.dataset.decline)));
  }
  // the full bike page (work orders, photos, papers...) in the normal app
  function openBikePage(pid, sec, woId) {
    try { if (woId) sessionStorage.setItem("rv.woOpen", woId); else if (sec) sessionStorage.setItem("rv.secOpen", sec); sessionStorage.setItem("rv.fromShop", "1"); } catch (e) {}
    location.href = X.url({ project: pid });
  }

  /* ---------- Clients ---------- */
  function viewClients() {
    const list = [...S.clients.values()].sort((a, z) => a.name.localeCompare(z.name));
    shell(`<div class="sx-pageh"><div><h1>Clients</h1><p>${list.length} client${list.length === 1 ? "" : "s"}. Search by name, phone, email, bike or client code.</p></div><div class="sx-pha">${isOwner() ? `<button class="btn" data-go="import">${ic("doc")} Import clients</button>` : ""}<button class="btn tan" data-newc>${ic("plus")} New client</button></div></div>
      <div class="sx-filter">${ic("search")}<input id="sxF" type="search" placeholder="Filter clients" autocomplete="off" aria-label="Filter clients"><select id="sxSort" aria-label="Sort"><option value="name">Name</option><option value="due">Next due</option><option value="visit">Last visit</option><option value="new">Newest</option></select></div>
      <div class="sx-table" id="sxList"></div>`, "clients");
    bindCommon();
    const f = X.app.querySelector("#sxF"), so = X.app.querySelector("#sxSort"), out = X.app.querySelector("#sxList");
    const paint = () => {
      const t = norm(f.value), d = digits(f.value);
      let L = list.filter(c => !t || [c.name, c.email, c.code, ...bikesOf(c.id).map(bikeName)].map(norm).join(" ").includes(t) || (d.length >= 3 && digits(c.phone).includes(d)));
      const R = { over: 0, soon: 1, ok: 2 };
      if (so.value === "due") L.sort((a, z) => { const x = nextDueOf(a.id), y = nextDueOf(z.id); return (x ? R[x.status] : 9) - (y ? R[y.status] : 9) || String(x && (x.due || x.nextDate) || "9").localeCompare(String(y && (y.due || y.nextDate) || "9")); });
      if (so.value === "visit") L.sort((a, z) => lastVisitOf(z.id).localeCompare(lastVisitOf(a.id)));
      if (so.value === "new") L.sort((a, z) => String(z.created_at).localeCompare(String(a.created_at)));
      out.innerHTML = L.length ? `<div class="sx-tr sx-th"><span>Client</span><span>Bikes</span><span>Next due</span><span>Last visit</span><span>Reminders</span></div>` + L.map(c => { const nx = nextDueOf(c.id), bs = bikesOf(c.id); return `<button class="sx-tr" data-open="${esc(c.id)}">
          <span class="sx-who"><span class="sx-av">${esc(initials(c.name))}</span><span><b>${esc(c.name)}</b><small>${esc(c.phone || c.email || "No contact yet")}${c.client_user ? " · on Revora" : ""}</small></span></span>
          <span>${bs.length ? esc(bs.map(bikeName).join(", ")) : `<span class="faint">No bike</span>`}</span>
          <span>${nx ? `${pill(nx.status)}<small>${esc(nx.name)}</small>` : `<span class="faint">—</span>`}</span>
          <span>${esc(fmt(lastVisitOf(c.id)) || "—")}</span>
          <span>${c.remind_ok && c.email ? `<span class="pill green plain">On</span>` : `<span class="pill gray plain">Off</span>`}</span></button>`; }).join("")
        : `<div class="sx-empty">${ic("users")}<b>${list.length ? "No clients match." : "No clients yet."}</b><span>${list.length ? "Try part of their name or phone number." : "Add the next person who brings a bike in."}</span>${list.length ? "" : `<button class="btn tan" data-newc2>${ic("plus")} New client</button>`}</div>`;
      out.querySelectorAll("[data-open]").forEach(b => b.onclick = () => nav("client", b.dataset.open));
      const nb = out.querySelector("[data-newc2]"); if (nb) nb.onclick = () => newClientBox("");
    };
    f.oninput = paint; so.onchange = paint; paint();
  }

  /* ---------- one client ---------- */
  function viewClient(c) {
    const bikes = bikesOf(c.id), money = S.money.get(c.id), reqs = S.requests.filter(q => q.client_id === c.id);
    const pend = reqs.filter(q => q.status === "pending"), sent = reqs.filter(q => q.status === "approved").slice(0, 6);
    const visits = []; bikes.forEach(b => b.c.done.forEach(r => visits.push({ b, r }))); visits.sort((a, z) => String(z.r.date).localeCompare(String(a.r.date)) || n(z.r.odometer) - n(a.r.odometer));
    const spentSince = money ? spendOf(bikes, money.since) : 0;
    shell(`<button class="sx-back" data-go="clients">${ic("back")} All clients</button>
      <section class="sx-chead">
        <div class="sx-cmain"><span class="sx-av big">${esc(initials(c.name))}</span><div><h1>${esc(c.name)}</h1>
          <div class="sx-cts">${telLink(c.phone)}${mailLink(c.email)}${!c.phone && !c.email ? `<span class="faint">No phone or email yet</span>` : ""}</div>
          ${c.notes ? `<p class="sx-cnote">${esc(c.notes)}</p>` : ""}
          ${isOwner() ? `<div class="sx-asg"><span>Assigned to</span>${assignChips(c)}<button class="linkbtn" data-assign>${S.emps.length ? "Change" : "Add employees"}</button></div>` : ""}</div>
          <button class="btn sm sx-edit" data-editc>Edit</button></div>
        <div class="sx-cside">
          <div class="sx-code"><span>Client code</span><b class="mono">${esc(c.code)}</b><div class="sx-code-b"><button class="btn sm" data-copycode>${ic("copy")} Copy</button><button class="btn sm pri" data-share>${ic("link")} Share link</button></div>
            <small>${c.client_user ? `${ic("check")} Joined Revora ${esc(fmt(c.joined_at))}. They can see their bike's history and what's due.` : "Not on Revora yet. Send the link and they can follow their bike for free."}</small></div>
          <label class="sx-remind${!c.email ? " off" : ""}"><input type="checkbox" data-remind ${c.remind_ok && c.email ? "checked" : ""} ${!c.email ? "disabled" : ""}><span><b>Email service reminders</b><small>${c.email ? (c.remind_ok ? `On since ${esc(fmt(c.remind_ok_at) || "today")}. Sent from Revora with your shop's name, 2 weeks before each service is due.` : "Only turn this on if they agreed to get reminder emails.") : "Add their email first."}</small></span></label>
        </div></section>
      ${pend.length ? `<section class="sx-panel sx-alert"><div class="sx-ph"><h2>Waiting on you</h2></div><div class="sx-rows">${pend.map(reqRow).join("")}</div></section>` : ""}
      ${isOwner() ? `<section class="sx-panel sx-budget"><div class="sx-ph"><h2>Budget</h2><span>${money && n(money.budget) ? `Since ${esc(fmt(money.since))}` : "What they want to spend on their bikes"}</span><button class="btn sm" data-budget>${money && n(money.budget) ? "Change" : "Set a budget"}</button></div>
          ${money && n(money.budget) ? `<div class="sx-bud"><div><span>Budget</span><b>${usd0(money.budget)}</b></div><div><span>Spent</span><b>${usd0(spentSince)}</b></div><div><span>Left</span><b class="${n(money.budget) - spentSince < 0 ? "neg" : ""}">${usd0(n(money.budget) - spentSince)}</b></div><div><span>Planned upgrades</span><b>${usd0(plannedOf(bikes))}</b></div></div>
            <div class="sd-bar${n(money.budget) - spentSince < 0 ? " over" : ""}"><i style="width:${Math.min(100, Math.round(spentSince / n(money.budget) * 100))}%"></i></div>${money.notes ? `<p class="sx-small">${esc(money.notes)}</p>` : ""}
            <div class="sx-acts left"><button class="btn sm" data-doc="budget|${esc(bikes[0] ? bikes[0].p.id : "")}" ${bikes.length ? "" : "disabled"}>${ic("doc")} Budget report</button></div>`
          : `<p class="sx-small">Set a budget and Revora tracks every service and upgrade against it, across all of ${esc(c.name.split(" ")[0])}'s bikes.</p>`}</section>` : ""}
      <div class="sx-sech"><h2>Bikes</h2><button class="btn sm" data-addbike>${ic("plus")} Add a bike</button></div>
      ${bikes.length ? bikes.map(bikeCard).join("") : `<div class="sx-panel sx-empty">${ic("gauge")}<b>No bike on file.</b><span>Add their bike to start logging services.</span><button class="btn tan" data-addbike>${ic("plus")} Add a bike</button></div>`}
      <div class="sx-grid2">
        <section class="sx-panel"><div class="sx-ph"><h2>Visit history</h2><span>${visits.length} service${visits.length === 1 ? "" : "s"}</span></div>
          ${visits.length ? `<div class="sx-tl">${visits.slice(0, 30).map(({ b, r }) => `<div class="sx-tli"><span class="sx-date">${esc(fmt(r.date))}</span><div><b>${esc(r.service || "Service")}</b><small>${esc([bikes.length > 1 ? bikeName(b) : "", n(r.odometer) ? D().milesFmt(r.odometer) + " mi" : "", D().svcCost(r) ? usd(D().svcCost(r)) : "", byTxt(r) ? "by " + byTxt(r) : r.doneBy === "Myself" ? "by the bike's owner" : ""].filter(Boolean).join(" · "))}</small>${r.partsUsed ? `<small class="faint">${esc(String(r.partsUsed).split(/\n+/).slice(0, 3).join(" · "))}</small>` : ""}</div><button class="linkbtn" data-editsvc="${esc(b.p.id)}|${esc(r.id)}">Edit</button></div>`).join("")}</div>` : `<div class="sx-empty sm"><span>Nothing logged yet.</span></div>`}</section>
        <section class="sx-panel"><div class="sx-ph"><h2>Sent to ${esc(c.name.split(" ")[0])}</h2><span>Reports, values and budgets</span></div>
          ${sent.length ? `<div class="sx-rows">${sent.map(q => { const b = S.bikes.get(q.project_id); return `<a class="sx-row" href="?shopdoc=${esc(q.token)}" target="_blank" rel="noopener"><span class="grow"><b>${esc(DOC().KIND[q.kind])}</b><small>${esc(b ? bikeName(b) : "")} · ${esc(fmt(q.decided_at))}${q.asked_by_client ? " · they asked" : ""}</small></span><span class="sx-when">${q.emailed_at ? "Emailed" : c.client_user ? "In their account" : ""}</span></a>`; }).join("")}</div>` : `<div class="sx-empty sm"><span>Nothing sent yet. Use History report, Value or Budget report to send one.</span></div>`}</section>
      </div>`, "clients");
    bindCommon();
    const root = X.app;
    root.querySelector("[data-editc]").onclick = () => editClientBox(c);
    const asb = root.querySelector("[data-assign]"); if (asb) asb.onclick = () => S.emps.length ? assignBox(c) : nav("team");
    root.querySelector("[data-copycode]").onclick = () => copy(c.code, "Client code copied");
    root.querySelector("[data-share]").onclick = () => shareBox(c);
    const rm = root.querySelector("[data-remind]"); if (rm) rm.onchange = async () => {
      const on = rm.checked;
      if (on && !confirm(`Turn on reminder emails for ${c.name}?\n\nOnly do this if they agreed to get them. Every email has a link to stop them.`)) { rm.checked = false; return; }
      const patch = { remind_ok: on, remind_ok_at: on ? new Date().toISOString() : c.remind_ok_at, updated_at: new Date().toISOString() };
      const { error } = await X.sb.from("shop_clients").update(patch).eq("id", c.id);
      if (error) { rm.checked = !on; return note(err(error), true); }
      Object.assign(c, patch); note(on ? "Reminders are on. They'll get an email 2 weeks before each service is due." : "Reminders are off."); bikes.forEach(b => syncReminders(b).catch(() => {})); draw();
    };
    root.querySelectorAll("[data-budget]").forEach(b => b.onclick = () => budgetBox(c));
    root.querySelectorAll("[data-addbike]").forEach(b => b.onclick = () => bikeBox(c, null));
    bindBikeCards(root, c);
    root.querySelectorAll("[data-editsvc]").forEach(b => b.onclick = () => { const [pid, rid] = b.dataset.editsvc.split("|"), bk = S.bikes.get(pid); logBox(c, bk, bk.recs.maintenance.find(r => r.id === rid)); });
  }
  const spendOf = (bikes, since) => bikes.reduce((s, b) => s + b.c.done.filter(r => !since || r.date >= since).reduce((t, r) => t + D().svcCost(r), 0) + D().live(b.recs.mods).filter(x => x.status === "Installed" && (!since || !x.date || x.date >= since)).reduce((t, x) => t + D().modCost(x), 0), 0);
  const plannedOf = bikes => bikes.reduce((s, b) => s + D().live(b.recs.mods).filter(x => x.status === "Planned" || x.status === "Ordered").reduce((t, x) => t + D().modCost(x), 0), 0);

  function bikeCard(b) {
    const c = b.c, items = c.ranked.filter(i => i.status !== "nointerval" && i.status !== "none"), hasSched = c.ranked.length > 0, m = b.meta, mods = D().live(b.recs.mods).filter(x => x.status !== "Removed");
    const wos = b.recs.workorders.filter(w => !w.archived && !WO_DONE.includes(w.status)), sil = silFor(m);
    return `<section class="sx-bike" data-bike="${esc(b.p.id)}">
      <div class="sx-bh">${sil ? `<img class="sx-sil" src="${esc(sil)}" alt="">` : ""}<div class="grow"><h3>${esc(bikeName(b))}</h3>
          <div class="sx-bmeta">${c.odo ? `<span>${ic("gauge")}${D().milesFmt(c.odo.miles)} mi <small>on ${esc(fmt(c.odo.date))}</small></span>` : `<span class="faint">No odometer reading yet</span>`}${c.last ? `<span>Last in ${esc(fmt(c.last.date))}</span>` : ""}${m.frameNo ? `<span class="mono">VIN …${esc(String(m.frameNo).slice(-6))}</span>` : ""}</div></div>
        <div class="sx-bacts"><button class="btn jb-go" data-jobstart>${ic("bolt")} Start a job</button><button class="btn" data-log>${ic("wrench")} Log service</button><button class="btn" data-odo>${ic("gauge")} Odometer</button>
          <div class="sx-dd"><button class="btn" data-menu aria-haspopup="true" aria-label="More for this bike">More</button><div class="sx-menu" hidden>
            <button data-doc="report|${esc(b.p.id)}">${ic("doc")} History report</button><button data-value>${ic("tag")} Bike value</button>${isOwner() ? `<button data-doc="budget|${esc(b.p.id)}">${ic("money")} Budget report</button>` : ""}
            <button data-wo>${ic("doc")} Work order with estimate</button><button data-sched>${ic("gear")} Service schedule</button><button data-editbike>${ic("gear")} Bike details</button><button data-full>${ic("arrow")} Full bike page</button>
            ${isOwner() ? `<button data-transfer>${ic("move")} Hand bike to client</button><button data-delbike class="red">Delete bike</button>` : ""}</div></div></div></div>
      ${wos.length ? `<div class="sx-rows jb-bikejobs">${wos.map(w => rvJobs.boardRow(Object.assign({ pid: b.p.id }, w), { client: "In the shop", bike: "" })).join("")}</div>` : ""}
      <div class="sx-bbody">
        <div class="sx-due"><h4>What's due</h4>${items.length ? `<div class="sx-dl">${items.slice(0, 8).map(i => `<div class="sx-di ${i.status}"><span class="grow"><b>${esc(i.name)}</b><small>${esc(i.every ? "Every " + i.every : "")}</small></span><span class="sx-when">${esc(D().whenTxt(i))}</span>${pill(i.status)}</div>`).join("")}</div>${items.length > 8 ? `<button class="linkbtn" data-sched>All ${items.length} items</button>` : ""}`
          : hasSched ? `<p class="sx-small">Nothing due yet. Once a service is logged, it shows up here when it's due again.</p>` : `<div class="sx-empty sm"><span>No service schedule yet.</span><button class="btn sm" data-preset>Add typical intervals</button></div>`}</div>
        <div class="sx-mods"><h4>Upgrades <button class="linkbtn" data-mods>${mods.length ? "Manage" : "Add"}</button></h4>${mods.length ? mods.slice(0, 6).map(x => `<div class="sx-mi"><span class="grow"><b>${esc(x.name)}</b><small>${esc([x.brand, D().modCost(x) ? usd(D().modCost(x)) : ""].filter(Boolean).join(" · "))}</small></span><span class="pill ${x.status === "Installed" ? "green" : x.status === "Ordered" ? "blue" : "amber"} plain">${esc(MOD_LABEL[x.status] || x.status)}</span></div>`).join("")
          : `<p class="sx-small">Track what ${esc((clientOf(b) || { name: "they" }).name.split(" ")[0])} wants fitted, with prices, and what's on the bike.</p>`}</div>
      </div></section>`;
  }
  function bindBikeCards(root, c) {
    root.querySelectorAll(".sx-bike").forEach(card => {
      const b = S.bikes.get(card.dataset.bike); if (!b) return;
      const on = (sel, fn) => card.querySelectorAll(sel).forEach(x => x.onclick = ev => { ev.stopPropagation(); card.querySelector(".sx-menu").hidden = true; fn(x); });
      on("[data-log]", () => logBox(c, b, null));
      on("[data-jobstart]", () => startJob(c, b));
      on("[data-job]", x => { const [pid, wid] = x.dataset.job.split("|"); openJob(pid, wid); });
      on("[data-odo]", () => odoBox(b));
      on("[data-wo]:not(.sx-wo)", () => openBikePage(b.p.id, "workorders"));
      on(".sx-wo", x => { const [, wid] = x.dataset.wo.split("|"); openBikePage(b.p.id, "workorders", wid); });
      on("[data-menu]", () => { const mm = card.querySelector(".sx-menu"); mm.hidden = !mm.hidden; if (!mm.hidden) setTimeout(() => document.addEventListener("click", () => { mm.hidden = true; }, { once: true }), 0); });
      on("[data-doc]", x => { const [k] = x.dataset.doc.split("|"); docBox(k, b); });
      on("[data-value]", () => valueBox(b));
      on("[data-sched]", () => schedBox(b));
      on("[data-preset]", () => addPresets(b).then(draw));
      on("[data-editbike]", () => bikeBox(c, b));
      on("[data-full]", () => openBikePage(b.p.id));
      on("[data-mods]", () => modsBox(b));
      on("[data-transfer]", () => withPw("Handing a bike over", () => transferBox(c, b)));
      on("[data-delbike]", () => withPw("Deleting a bike", () => confirmBox("Delete this bike?", `${esc(bikeName(b))} and its whole service history will be deleted for good. If ${esc(c.name.split(" ")[0])} wants to keep the history, use Hand bike to client instead.`, "Delete bike", async () => {
        const { error } = await X.sb.from("projects").delete().eq("id", b.p.id); if (error) return note(err(error), true);
        S.bikes.delete(b.p.id); note("Bike deleted."); draw(); }, true)));
    });
  }

  /* ---------- jobs: start one in a few taps, update it as you go, the customer follows along ---------- */
  const jobClient = c => c ? { name: c.name, email: c.email, phone: c.phone, app: !!c.client_user } : {};
  // the latest copy from the database, so a customer's answer or a teammate's change isn't lost
  async function freshJob(b, wid) {
    const { data, error } = await X.sb.from("records").select("data").match({ project_id: b.p.id, coll: "workorders", rec_id: wid }).maybeSingle();
    if (error || !data) return b.recs.workorders.find(w => w.id === wid) || null;
    const d = Object.assign({}, data.data, { id: wid }), L = b.recs.workorders, i = L.findIndex(w => w.id === wid); if (i >= 0) L[i] = d; else L.push(d);
    return d;
  }
  async function saveJob(b, rec, ntf) {
    const old = rec.id ? (await freshJob(b, rec.id)) : null;
    const out = Object.assign({ lines: [], byOwner: who() }, old || {}, rec, { id: (old && old.id) || rec.id || nextId(b, "workorders") });
    delete out.pid;
    await putRecs(b, [{ coll: "workorders", rec: out }]);
    const { data, error } = await X.sb.rpc("job_touch", { pid: b.p.id, wid: out.id, ntf: ntf === undefined ? null : ntf });
    if (error || data !== "ok") console.warn("job_touch", error || data);
    return b.recs.workorders.find(w => w.id === out.id) || out;
  }
  function startJob(c, b) {
    const bikes = bikesOf(c.id); if (!bikes.length) return bikeBox(c, null);
    rvJobs.startBox({ client: jobClient(c), bikes: bikes.map(x => ({ id: x.p.id, name: bikeName(x) })), bikeId: (b || bikes[0]).p.id, bikeName: bikes.length === 1 ? bikeName(bikes[0]) : "",
      save: async (pid, rec, ntf) => (await saveJob(S.bikes.get(pid), rec, ntf)).id,
      done: (pid, id) => { draw(); const cl = jobClient(c); note(cl.app ? `Job started. ${c.name.split(" ")[0]} gets a notification and can follow it in Revora.` : cl.email ? `Job started. ${c.name.split(" ")[0]} gets an email with a link to follow it.` : "Job started."); openJob(pid, id); } });
  }
  function openJob(pid, wid) {
    const b = S.bikes.get(pid), w = b && b.recs.workorders.find(x => x.id === wid); if (!w) return;
    const c = clientOf(b);
    const rpcOk = async (fn, args) => { const { data, error } = await X.sb.rpc(fn, args); if (error) throw new Error(/full/.test(error.message || "") ? "full" : "That didn't save. Try again."); return data; };
    rvJobs.manageBox({ w, pid, client: jobClient(c), bikeName: bikeName(b), note,
      save: patch => saveJob(b, Object.assign({ id: w.id }, patch)),
      fetch: () => freshJob(b, wid),
      photos: { list: () => rpcOk("job_photos", { pid, wid }), add: (th, im) => rpcOk("job_photo_add", { pid, wid, th, im, nt: "" }), del: id => rpcOk("job_photo_del", { id }), full: id => rpcOk("job_photo", { pid, id }) },
      ask: async (t, price, ph) => { await rpcOk("job_ask", { pid, wid, t, price, ph }); return freshJob(b, wid); },
      pickedUp: async ww => {
        const h = Object.assign(rvJobs.historyRec(ww, D().live(b.recs.schedule)), { id: nextId(b, "maintenance"), odometer: b.c.odo ? b.c.odo.miles : 0, doneBy: "A shop", shop: S.shop.name || "Shop", byOwner: who(), planned: false });
        await putRecs(b, [{ coll: "maintenance", rec: h }, { coll: "workorders", rec: Object.assign({}, ww, { status: "Picked up", pickedAt: new Date().toISOString() }) }]);
      },
      openFull: () => openBikePage(pid, "workorders", wid), refresh: draw });
  }

  /* ---------- import clients from another system ---------- */
  let IMP = null;   // { step, sheets, result, skip: Set of client keys, presets, done }
  const IMP_STEPS = ["Add files or photos", "Check it", "Review", "Import"];
  function viewImport() {
    if (!IMP) IMP = { step: 1, sheets: [], result: null, skip: new Set(), presets: true, q: "", more: 0 };
    const I = window.rvImport, st = IMP.step;
    const steps = `<ol class="im-steps">${IMP_STEPS.map((t, i) => `<li class="${i + 1 < st ? "done" : i + 1 === st ? "on" : ""}"><span>${i + 1 < st ? ic("check") : i + 1}</span>${esc(t)}</li>`).join("")}</ol>`;
    const head = `<button class="sx-back" data-imback>${ic("back")} ${st === 1 || st >= 4 ? "All clients" : "Back"}</button>
      <section class="im-hero"><span class="jb-eb">Bring your clients over</span><h1>Import clients</h1><p>Export your customers from your old system as a CSV or Excel file, or take photos of your paper cards and notebooks. Revora sorts it into clients, bikes and past work. Nothing is saved until you check it and tap Import.</p></section>${steps}`;
    let body = "";
    if (st === 1) {
      const busy = IMP.busy || [];
      body = `<div class="im-ways"><label class="im-way im-cam">${ic("camera")}<span><b>Take a photo</b><small>Index cards, a notebook page, old work orders. One page per photo.</small></span><input type="file" id="imCam" accept="image/*" capture="environment" hidden></label>
          <label class="im-way" id="imDrop">${ic("doc")}<span><b>Upload a file or photos</b><small>CSV or Excel export from your old system, or photos you already took. Drop them here too.</small></span><input type="file" id="imFile" multiple accept=".csv,.tsv,.txt,.xlsx,.xlsm,.xls,.ods,image/*" hidden></label></div>
        ${IMP.sheets.length || busy.length ? `<div class="im-files">${IMP.sheets.map((sh, i) => `<div class="im-file">${sh.photo ? `<img src="${sh.photo}" alt="">` : ic("doc")}<div class="grow"><b>${esc(sh.name)}</b><small>${sh.photo ? `${sh.rows.length} line${sh.rows.length === 1 ? "" : "s"} read. You'll check them next.` : `${sh.rows.length} row${sh.rows.length === 1 ? "" : "s"} · looks like ${esc(sh.kind)}`}</small></div><button class="sx-x" data-rmfile="${i}" aria-label="Remove">×</button></div>`).join("")}
          ${busy.map(b => `<div class="im-file busy"><span class="im-spin"></span><div class="grow"><b>${esc(b)}</b><small>Reading the handwriting… about 10 seconds</small></div></div>`).join("")}</div>` : ""}
        ${IMP.sheets.length || busy.length ? `<label class="linkbtn im-more">${ic("camera")} Take another photo<input type="file" id="imCam2" accept="image/*" capture="environment" hidden></label>` : ""}
        <p class="sx-err" id="imErr" hidden></p>
        <div class="sx-acts left"><button class="btn jb-go" data-imnext ${IMP.sheets.length && !busy.length ? "" : "disabled"}>Next: check ${IMP.sheets.length && IMP.sheets.every(x => x.photo) ? "what was read" : "the columns"} ${ic("arrow")}</button></div>`;
    } else if (st === 2) {
      const cell = (sh, si, ri, ci, ph, wide) => `<input class="c-${wide}" data-cell="${si}|${ri}|${ci}" value="${esc(sh.rows[ri][ci] || "")}" placeholder="${esc(ph)}" aria-label="${esc(sh.head[ci])}" autocomplete="off">`;
      const photoSheet = (sh, si) => `<section class="sx-panel im-map im-ph"><div class="sx-ph"><h2>${esc(sh.name)}</h2><span class="pill blue">photo</span><span>${sh.rows.length} line${sh.rows.length === 1 ? "" : "s"}</span></div>
          <p class="sx-small">Check what was read against the photo and fix anything that's wrong. Tap the photo to see it bigger.</p>
          <div class="im-phwrap"><button class="im-phimg" data-zoom="${si}"><img src="${sh.photo}" alt="The photo"></button>
          <div class="im-rows">${sh.rows.map((r, ri) => `<div class="im-row"><div class="im-rg">${cell(sh, si, ri, 0, "Name", "a")}${cell(sh, si, ri, 1, "Phone", "b")}${cell(sh, si, ri, 2, "Email", "c")}${cell(sh, si, ri, 3, "Year", "d")}${cell(sh, si, ri, 4, "Make", "e")}${cell(sh, si, ri, 5, "Model", "f")}${cell(sh, si, ri, 7, "Date", "g")}${cell(sh, si, ri, 8, "Miles", "h")}${cell(sh, si, ri, 10, "Cost $", "i")}${cell(sh, si, ri, 9, "Work done", "j")}${cell(sh, si, ri, 11, "Notes", "k")}</div><button class="sx-x" data-rmrow="${si}|${ri}" aria-label="Remove this line">×</button></div>`).join("")}
            <button class="linkbtn" data-addrow="${si}">${ic("plus")} Add a line</button></div></div></section>`;
      body = IMP.sheets.map((sh, si) => sh.photo ? photoSheet(sh, si) : `<section class="sx-panel im-map"><div class="sx-ph"><h2>${esc(sh.name)}</h2><span class="pill blue">${esc(sh.kind)}</span><span>${sh.rows.length} rows</span></div>
          <div class="im-cols">${sh.head.map((h, ci) => { const ex = sh.rows.map(r => String(r[ci] == null ? "" : r[ci]).trim()).filter(Boolean).slice(0, 2);
            return `<div class="im-col${sh.map[ci] === "skip" ? " skip" : ""}"><div class="grow"><b>${esc(h || "Column " + (ci + 1))}</b><small>${ex.length ? esc(ex.join(" · ")).slice(0, 80) : "empty"}</small></div>
              <select data-map="${si}|${ci}" aria-label="What is ${esc(h)}">${I.FIELDS.map(([k, l]) => `<option value="${k}"${sh.map[ci] === k ? " selected" : ""}>${esc(l)}</option>`).join("")}</select></div>`; }).join("")}</div></section>`).join("")
        + (IMP.sheets.some(x => !x.photo) ? `<p class="sx-small">Revora guessed these from your headings. Fix any that are wrong, and set columns you don't need to Skip.</p>` : "") + `
        <div class="sx-acts left"><button class="btn jb-go" data-imnext>Next: review ${ic("arrow")}</button></div>`;
    } else if (st === 3) {
      const R = IMP.result, s0 = R.stats, sel = R.clients.filter(c => !IMP.skip.has(c.key)), q = norm(IMP.q);
      const shown = R.clients.filter(c => !q || norm([c.name, c.phone, c.email, ...c.bikes.map(b => b.label)].join(" ")).includes(q));
      const lim = 150 + IMP.more;
      body = `<div class="im-tiles"><div><b>${s0.clients - s0.matched}</b><span>new clients</span></div><div><b>${s0.matched}</b><span>already in Revora</span></div><div><b>${s0.bikes}</b><span>bikes</span></div><div><b>${s0.visits}</b><span>past visits</span></div>${s0.skipped ? `<div class="warn"><b>${s0.skipped}</b><span>rows skipped</span></div>` : ""}</div>
        <section class="sx-panel"><div class="sx-ph"><h2>Clients</h2><span>Untick anyone you don't want to bring over</span></div>
          <div class="sx-filter">${ic("search")}<input id="imQ" type="search" placeholder="Find a client in the import" value="${esc(IMP.q)}" autocomplete="off"><button class="linkbtn" data-imall>${sel.length === R.clients.length ? "Untick all" : "Tick all"}</button></div>
          <div class="im-list">${shown.slice(0, lim).map(c => `<label class="im-c${IMP.skip.has(c.key) ? " off" : ""}"><input type="checkbox" data-ck="${esc(c.key)}" ${IMP.skip.has(c.key) ? "" : "checked"}>
              <div class="grow"><b>${esc(c.name)}</b><small>${esc([c.phone, c.email].filter(Boolean).join(" · ") || "No phone or email")}</small>
                <div class="im-bk">${c.bikes.map(b => `<span>${esc(b.label)}${b.visits.length ? ` · ${b.visits.length} visit${b.visits.length === 1 ? "" : "s"}` : ""}</span>`).join("") || `<span class="faint">No bike</span>`}</div>
                ${c.flags.length ? `<div class="im-fl">${c.flags.map(f => `<em>${esc(f)}</em>`).join("")}</div>` : ""}</div></label>`).join("")}
            ${shown.length > lim ? `<button class="btn sm" data-immore>Show ${Math.min(200, shown.length - lim)} more</button>` : ""}</div></section>
        ${R.skipped.length ? `<details class="sx-panel im-skip"><summary>${R.skipped.length} row${R.skipped.length === 1 ? "" : "s"} couldn't be used</summary><ul>${R.skipped.slice(0, 100).map(x => `<li>${esc(x.file)}, row ${x.row}: ${esc(x.why)}</li>`).join("")}</ul></details>` : ""}
        <label class="jb-tell"><input type="checkbox" id="imPre" ${IMP.presets ? "checked" : ""}><span><b>Give each new bike the typical service schedule</b><small>Oil, chain, brakes, tires and more. Past visits tick off what was done, so Revora knows what's due next.</small></span></label>
        <p class="sx-small">Reminder emails stay off for everyone. Turn them on per client once they've agreed.</p>
        <div class="sx-acts left"><button class="btn jb-go big" data-imgo ${sel.length ? "" : "disabled"}>${ic("check")} Import ${sel.length} client${sel.length === 1 ? "" : "s"}</button></div>`;
    } else if (st === 4) {
      body = `<section class="sx-panel im-run"><h2 id="imRunT">Bringing your clients over…</h2><div class="jb-bar"><i id="imBar" style="width:0%"></i></div><p class="sx-small" id="imRunS">Starting</p></section>`;
    } else {
      const d = IMP.done || {};
      body = `<section class="sx-panel im-done"><div class="lg-instic ok">${ic("check")}</div><h2>${d.clients} client${d.clients === 1 ? "" : "s"} ${d.clients === 1 ? "is" : "are"} in Revora</h2>
        <p>${d.bikes} bike${d.bikes === 1 ? "" : "s"} and ${d.visits} past visit${d.visits === 1 ? "" : "s"} came over.${d.over || d.soon ? ` <b>${d.over} ${d.over === 1 ? "is" : "are"} overdue</b> and ${d.soon} ${d.soon === 1 ? "is" : "are"} due in the next 30 days. That's your call list.` : ""}</p>
        ${d.errors && d.errors.length ? `<details class="im-skip"><summary>${d.errors.length} didn't come over</summary><ul>${d.errors.slice(0, 50).map(e => `<li>${esc(e)}</li>`).join("")}</ul></details>` : ""}
        <div class="sx-acts left"><button class="btn jb-go" data-imtoday>See who's due</button><button class="btn" data-imagain>Import another file</button></div></section>`;
    }
    shell(`<div class="im">${head}${body}</div>`, "clients");
    bindCommon();
    const app = X.app, $1 = s2 => app.querySelector(s2);
    $1("[data-imback]").onclick = () => { if (st === 1 || st >= 4) { if (st >= 4) IMP = null; nav("clients"); } else { IMP.step--; draw(); } };
    if (st === 1) {
      const inp = $1("#imFile"), drop = $1("#imDrop"), er = $1("#imErr");
      if (IMP.err) { er.textContent = IMP.err; er.hidden = false; }
      const add = async files => { IMP.err = "";
        const pics = files.filter(I.isImage), docs = files.filter(f => !I.isImage(f));
        for (const f of docs) { try { (await I.readFile(f)).forEach(sh => IMP.sheets.push(I.prepare(sh))); } catch (e) { IMP.err = (e && e.message) || `Couldn't read ${f.name}.`; } }
        if (pics.length) {
          const token = await X.sb.auth.getSession().then(r => r.data.session && r.data.session.access_token).catch(() => "");
          let n = IMP.sheets.filter(x => x.photo).length;
          IMP.busy = (IMP.busy || []).concat(pics.map(() => "Photo " + (++n))); draw();
          await Promise.all(pics.map(async (f, k) => { const label = IMP.busy[IMP.busy.length - pics.length + k];
            try { const sh = await I.readPhoto(f, token); sh.name = label; IMP.sheets.push(sh); } catch (e) { IMP.err = `${label}: ${(e && e.message) || "couldn't be read."}`; }
            IMP.busy = IMP.busy.filter(x => x !== label); if (IMP.step === 1) draw(); }));
        }
        if (IMP.step === 1) draw(); };
      inp.onchange = () => add([...inp.files]);
      ["#imCam", "#imCam2"].forEach(sel => { const c = $1(sel); if (c) c.onchange = () => add([...c.files]); });
      drop.ondragover = ev => { ev.preventDefault(); drop.classList.add("over"); }; drop.ondragleave = () => drop.classList.remove("over");
      drop.ondrop = ev => { ev.preventDefault(); drop.classList.remove("over"); add([...ev.dataTransfer.files]); };
      app.querySelectorAll("[data-rmfile]").forEach(b => b.onclick = ev => { ev.preventDefault(); IMP.sheets.splice(+b.dataset.rmfile, 1); draw(); });
      const nx = $1("[data-imnext]"); if (nx) nx.onclick = () => { IMP.step = 2; draw(); };
    }
    if (st === 2) {
      app.querySelectorAll("[data-cell]").forEach(inp2 => inp2.oninput = () => { const [si, ri, ci] = inp2.dataset.cell.split("|").map(Number); IMP.sheets[si].rows[ri][ci] = inp2.value; });
      app.querySelectorAll("[data-rmrow]").forEach(b => b.onclick = () => { const [si, ri] = b.dataset.rmrow.split("|").map(Number); IMP.sheets[si].rows.splice(ri, 1); draw(); });
      app.querySelectorAll("[data-addrow]").forEach(b => b.onclick = () => { const sh = IMP.sheets[+b.dataset.addrow], last = sh.rows[sh.rows.length - 1] || [];
        sh.rows.push(sh.head.map((h, ci) => ci <= 6 ? (last[ci] || "") : "")); draw(); const ins = X.app.querySelectorAll(`[data-cell^="${b.dataset.addrow}|${sh.rows.length - 1}|"]`); if (ins[7]) ins[7].focus(); });
      app.querySelectorAll("[data-zoom]").forEach(b => b.onclick = () => { const ov = document.createElement("div"); ov.className = "im-zoom"; ov.innerHTML = `<img src="${IMP.sheets[+b.dataset.zoom].photo}" alt=""><button class="sx-x" aria-label="Close">×</button>`; ov.onclick = () => ov.remove(); document.body.appendChild(ov); });
      app.querySelectorAll("[data-map]").forEach(sl => sl.onchange = () => { const [si, ci] = sl.dataset.map.split("|").map(Number), sh = IMP.sheets[si]; sh.map[ci] = sl.value; sh.kind = I.kindOf(sh.map); draw(); });
      $1("[data-imnext]").onclick = () => {
        const ex = [...S.clients.values()].map(c => ({ id: c.id, name: c.name, phone: c.phone, email: c.email })), eb = {};
        [...S.bikes.values()].forEach(b => { (eb[b.p.shop_client] = eb[b.p.shop_client] || []).push({ id: b.p.id, label: bikeName(b) }); });
        IMP.result = I.build(IMP.sheets, ex, eb); IMP.skip = new Set(); IMP.step = 3; draw();
      };
    }
    if (st === 3) {
      const q = $1("#imQ"); q.oninput = () => { IMP.q = q.value; clearTimeout(q._t); q._t = setTimeout(() => { const pos = q.selectionStart; draw(); const n2 = X.app.querySelector("#imQ"); n2.focus(); n2.setSelectionRange(pos, pos); }, 250); };
      app.querySelectorAll("[data-ck]").forEach(b => b.onchange = () => { if (b.checked) IMP.skip.delete(b.dataset.ck); else IMP.skip.add(b.dataset.ck); draw(); });
      $1("[data-imall]").onclick = () => { const all = IMP.skip.size === 0; IMP.skip = new Set(all ? IMP.result.clients.map(c => c.key) : []); draw(); };
      const mo = $1("[data-immore]"); if (mo) mo.onclick = () => { IMP.more += 200; draw(); };
      $1("#imPre").onchange = ev => { IMP.presets = ev.target.checked; };
      const go = $1("[data-imgo]"); if (go) go.onclick = () => { IMP.step = 4; draw(); runImport(); };
    }
    if (st === 5) { const d0 = IMP.done || {}; $1("[data-imtoday]").onclick = () => { IMP = null; nav("due", d0.over ? "over" : ""); }; $1("[data-imagain]").onclick = () => { IMP = null; draw(); }; }
  }
  // one bike with its history: the bike, a typical schedule, past visits (ticking what they covered) and odometer readings, in one save
  async function importBike(c, ib, presets) {
    let b = ib.existing ? S.bikes.get(ib.existing) : null;
    const items = [];
    if (!b) {
      const label = ib.label, style = (X.guessStyle && X.guessStyle(ib.make, ib.model)) || "standard", drive = (X.guessDrive && X.guessDrive(ib.make, ib.model, style)) || "chain";
      const { data: pid, error } = await X.sb.rpc("shop_new_bike", { cid: c.id, nm: label }); if (error) throw error;
      const p = { id: pid, name: label, bike_id: "custom-bike", shop_client: c.id, created_at: new Date().toISOString(), role: "owner" };
      b = { p, meta: {}, recs: { schedule: [], maintenance: [], mileage: [], mods: [], workorders: [], fuel: [] }, c: null }; recalc(b); S.bikes.set(pid, b);
      items.push({ coll: "meta", rec: { id: "project", projectName: label, bike: label, year: String(ib.year || ""), make: ib.make || "", model: ib.model || "", frameNo: ib.vin || "", style, drive, goal: "maintain",
        units: "in", currency: "USD", baseBudget: 0, contingencyPct: 10, budgetChanges: [], meshMap: {}, archived: false, customer: { name: c.name, phone: c.phone, email: c.email }, shop: { id: S.shop.id, name: S.shop.name }, imported: true } });
      if (presets) D().presets(drive).forEach((p2, i) => items.push({ coll: "schedule", rec: { id: "SVC-U" + String(i + 1).padStart(3, "0"), name: p2[0], category: p2[1], everyMiles: p2[2], everyMonths: p2[3], source: D().TYPICAL_SRC, order: i + 1, lastDate: "", lastMiles: 0, notes: "" } }));
    }
    const sched = items.filter(x => x.coll === "schedule").map(x => x.rec).concat(D().live(b.recs.schedule));
    let mi = +(nextId(b, "maintenance").match(/(\d+)$/) || [0, 1])[1], oi = +(nextId(b, "mileage").match(/(\d+)$/) || [0, 1])[1];
    const odo = {}, had = new Set(D().live(b.recs.maintenance).map(r => r.date).filter(Boolean));   // the same visit brought in twice: keep one
    const fresh = ib.visits.slice().reverse().filter(v => !(v.date && had.has(v.date))); ib.added = fresh.length;
    fresh.forEach(v => {
      const covers = window.rvJobs ? rvJobs.coveredItems([{ t: rvImport.expand(v.work) }], sched) : [];
      items.push({ coll: "maintenance", rec: { id: "MAINT-U" + String(mi++).padStart(3, "0"), date: v.date || today(), service: v.work || "Service", odometer: v.miles || 0, cost: v.cost || 0, kind: covers.length ? "Scheduled service" : "Repair", items: covers,
        doneBy: "A shop", shop: S.shop.name || "Shop", byOwner: who(), notes: "Brought over from your old system", imported: true, planned: false } });
      if (v.miles && v.date && !(odo[v.date] >= v.miles)) odo[v.date] = v.miles;
    });
    const lastDate = (ib.visits[0] && ib.visits[0].date) || today();
    if (ib.miles && !Object.values(odo).some(m => m >= ib.miles)) odo[lastDate] = Math.max(odo[lastDate] || 0, ib.miles);
    Object.entries(odo).forEach(([date, miles]) => items.push({ coll: "mileage", rec: { id: "ODO-U" + String(oi++).padStart(4, "0"), date, miles, note: "Brought over from your old system" } }));
    if (items.length) await putRecs(b, items);
    return b;
  }
  async function runImport() {
    const R = IMP.result, todo = R.clients.filter(c => !IMP.skip.has(c.key)), errors = [], made = new Set();
    let done = 0, bikes = 0, visits = 0;
    const T = X.app.querySelector("#imRunT"), bar = X.app.querySelector("#imBar"), sub = X.app.querySelector("#imRunS");
    const tick = () => { if (bar) bar.style.width = Math.round(done / todo.length * 100) + "%"; if (sub) sub.textContent = `${done} of ${todo.length} clients`; };
    const one = async ic2 => {
      try {
        let c = ic2.existing ? S.clients.get(ic2.existing) : null;
        if (!c) {
          const row = { shop_id: S.shop.id, name: ic2.name.slice(0, 120), phone: String(ic2.phone || "").slice(0, 40), email: /^\S+@\S+\.\S+$/.test(ic2.email || "") ? ic2.email.slice(0, 200) : "", notes: String(ic2.notes || "").slice(0, 2000), remind_ok: false, remind_ok_at: null };
          const { data, error } = await X.sb.from("shop_clients").insert(row).select("*").single(); if (error) throw error;
          c = data; S.clients.set(c.id, c);
        }
        for (const ib of ic2.bikes) { const b = await importBike(c, ib, IMP.presets); made.add(b.p.id); bikes++; visits += ib.added || 0; }
      } catch (e) { errors.push(`${ic2.name}: ${/plan/i.test((e && e.message) || "") || (e && e.code) === "42501" ? "your Shop plan isn't active" : err(e)}`); }
      done++; tick();
    };
    tick();
    const q = todo.slice(); await Promise.all(Array.from({ length: Math.min(4, q.length) }, async () => { while (q.length) await one(q.shift()); }));
    let over = 0, soon = 0; made.forEach(pid => { const b = S.bikes.get(pid); if (!b) return; recalc(b); if (b.c.items.some(i => i.status === "over")) over++; else if (b.c.items.some(i => i.status === "soon")) soon++; });
    IMP.done = { clients: todo.length - errors.length, bikes, visits, over, soon, errors }; IMP.step = 5;
    if (T) draw();
  }

  /* ---------- new client, edit client, share ---------- */
  const bikeFields = (m, odo) => `<div class="sx-f3"><label class="sx-f"><b>Year</b><input name="year" inputmode="numeric" maxlength="4" value="${esc(m.year || "")}" placeholder="2015"></label><label class="sx-f"><b>Make</b><input name="make" maxlength="40" value="${esc(m.make || "")}" placeholder="Honda"></label><label class="sx-f"><b>Model</b><input name="model" maxlength="60" value="${esc(m.model || "")}" placeholder="CB500X"></label></div>
    <div class="sx-f3"><label class="sx-f"><b>Kind of bike</b><select name="style">${STYLES.map(([k, l]) => `<option value="${k}"${(m.style || "standard") === k ? " selected" : ""}>${l}</option>`).join("")}</select></label><label class="sx-f"><b>Drive</b><select name="drive">${DRIVES.map(([k, l]) => `<option value="${k}"${(m.drive || "chain") === k ? " selected" : ""}>${l}</option>`).join("")}</select></label>${odo !== false ? `<label class="sx-f"><b>Odometer now (mi)</b><input name="odo" inputmode="numeric" placeholder="12,400"></label>` : `<label class="sx-f"><b>VIN</b><input name="vin" maxlength="20" value="${esc(m.frameNo || "")}"></label>`}</div>`;
  const bikeLabel = d => [String(d.year || "").trim(), String(d.make || "").trim(), String(d.model || "").trim()].filter(Boolean).join(" ");
  function newClientBox(name) {
    const m = modal(`<form class="sx-form" id="ncF" novalidate>
        <div class="sx-f2"><label class="sx-f"><b>Name</b><input name="name" required maxlength="120" value="${esc(name)}" autocomplete="off"></label><label class="sx-f"><b>Phone <span class="faint">(optional)</span></b><input name="phone" type="tel" maxlength="40" autocomplete="off"></label></div>
        <label class="sx-f"><b>Email <span class="faint">(optional)</span></b><input name="email" type="email" maxlength="200" autocomplete="off"><small>Needed only for reminder emails and reports. You can add it later.</small></label>
        <label class="sx-chk"><input type="checkbox" name="remind"><span>They agreed to get service reminder emails</span></label>
        <h3 class="sx-h3">Their bike <span class="faint" style="font-weight:400">(optional)</span></h3>${bikeFields({}, true)}
        <label class="sx-chk"><input type="checkbox" name="preset" checked><span>Start with typical service intervals (oil, chain, brakes, tires and more). Check them against the manual later.</span></label>
        <label class="sx-f"><b>Notes for the shop</b><textarea name="notes" rows="2" maxlength="2000" placeholder="Only your shop sees these."></textarea></label>
        <p class="sx-err" hidden></p>
        <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn" data-then="open">Save client</button><button type="submit" class="btn pri" data-then="log">${ic("wrench")} Save and log a service</button></div></form>`, { title: "New client", wide: true });
    const f = m.querySelector("#ncF"), er = m.querySelector(".sx-err"); let then = "log";
    f.querySelectorAll("[data-then]").forEach(b => b.onclick = () => { then = b.dataset.then; });
    f.make.oninput = f.model.oninput = () => { if (!f.style.dataset.touched && X.guessStyle) f.style.value = X.guessStyle(f.make.value, f.model.value) || "standard"; if (!f.drive.dataset.touched && X.guessDrive) { const g = X.guessDrive(f.make.value, f.model.value, f.style.value); f.drive.value = DRIVES.some(d => d[0] === g) ? g : "chain"; } };
    f.style.onchange = () => { f.style.dataset.touched = 1; if (f.style.value === "scooter" && !f.drive.dataset.touched) f.drive.value = "cvt"; }; f.drive.onchange = () => { f.drive.dataset.touched = 1; };
    f.onsubmit = async ev => {
      ev.preventDefault(); const d = Object.fromEntries(new FormData(f)); er.hidden = true;
      const bad = t => { er.textContent = t; er.hidden = false; f.querySelectorAll("button").forEach(x => x.disabled = false); };
      if (!String(d.name || "").trim()) return bad("Add their name.");
      if (d.email && !/^\S+@\S+\.\S+$/.test(d.email.trim())) return bad("That email doesn't look right.");
      if (d.remind && !d.email.trim()) return bad("Add their email to send reminders.");
      const label = bikeLabel(d);
      f.querySelectorAll("button").forEach(x => x.disabled = true);
      const row = { shop_id: S.shop.id, name: d.name.trim(), phone: String(d.phone || "").trim(), email: String(d.email || "").trim(), notes: String(d.notes || "").trim(), remind_ok: !!d.remind, remind_ok_at: d.remind ? new Date().toISOString() : null };
      const { data: c, error } = await X.sb.from("shop_clients").insert(row).select("*").single();
      if (error) return bad(/plan/i.test(error.message || "") || error.code === "42501" ? "Your Shop plan isn't active. Check your plan to add clients." : err(error));
      S.clients.set(c.id, c);
      let b = null;
      if (label) { try { b = await createBike(c, d); } catch (e) { m.close(); nav("client", c.id); return note("Client saved, but the bike didn't save: " + err(e), true); } }
      m.close(); nav("client", c.id);
      if (then === "log" && b) logBox(c, b, null); else note(`${c.name} is saved. Their client code is ${c.code}.`);
    };
  }
  async function createBike(c, d) {
    const label = bikeLabel(d);
    const { data: pid, error } = await X.sb.rpc("shop_new_bike", { cid: c.id, nm: label }); if (error) throw error;
    const p = { id: pid, name: label, bike_id: "custom-bike", shop_client: c.id, created_at: new Date().toISOString(), role: "owner" };
    const b = { p, meta: {}, recs: { schedule: [], maintenance: [], mileage: [], mods: [], workorders: [], fuel: [] }, c: null }; recalc(b); S.bikes.set(pid, b);
    const meta = { id: "project", projectName: label, bike: label, year: String(d.year || "").trim(), make: String(d.make || "").trim(), model: String(d.model || "").trim(), style: d.style || "standard", drive: d.drive || "chain", goal: "maintain",
      units: "in", currency: "USD", baseBudget: 0, contingencyPct: 10, budgetChanges: [], meshMap: {}, archived: false, customer: { name: c.name, phone: c.phone, email: c.email }, shop: { id: S.shop.id, name: S.shop.name } };
    const items = [{ coll: "meta", rec: meta }];
    if (d.preset) D().presets(meta.drive).forEach((p2, i) => items.push({ coll: "schedule", rec: { id: "SVC-U" + String(i + 1).padStart(3, "0"), name: p2[0], category: p2[1], everyMiles: p2[2], everyMonths: p2[3], source: D().TYPICAL_SRC, order: i + 1, lastDate: "", lastMiles: 0, notes: "" } }));
    if (n(String(d.odo || "").replace(/,/g, ""))) items.push({ coll: "mileage", rec: { id: "ODO-U0001", date: today(), miles: n(String(d.odo).replace(/,/g, "")), note: "At the shop" } });
    await putRecs(b, items);
    return b;
  }
  async function addPresets(b) {
    const have = new Set(b.recs.schedule.map(s => String(s.name).toLowerCase())), items = [];
    let k = 0; D().presets(b.meta.drive || "chain").forEach(p2 => { if (have.has(p2[0].toLowerCase())) return; const id = nextIdAfter(b, "schedule", k++); items.push({ coll: "schedule", rec: { id, name: p2[0], category: p2[1], everyMiles: p2[2], everyMonths: p2[3], source: D().TYPICAL_SRC, order: b.recs.schedule.length + k, lastDate: "", lastMiles: 0, notes: "" } }); });
    if (items.length) { await putRecs(b, items); note(`Added ${items.length} typical intervals. Check them against the bike's manual.`); }
  }
  function nextIdAfter(b, coll, k) { const [pre, pad] = PREFIX[coll], first = nextId(b, coll), num = +first.match(/(\d+)$/)[1] + k; return pre + String(num).padStart(pad, "0"); }

  function editClientBox(c) {
    const m = modal(`<form class="sx-form" id="ecF" novalidate>
        <div class="sx-f2"><label class="sx-f"><b>Name</b><input name="name" required maxlength="120" value="${esc(c.name)}"></label><label class="sx-f"><b>Phone</b><input name="phone" type="tel" maxlength="40" value="${esc(c.phone)}"></label></div>
        <label class="sx-f"><b>Email</b><input name="email" type="email" maxlength="200" value="${esc(c.email)}"></label>
        <label class="sx-f"><b>Notes for the shop</b><textarea name="notes" rows="3" maxlength="2000">${esc(c.notes)}</textarea></label>
        <div class="sx-codebox"><span>Client code <b class="mono">${esc(c.code)}</b></span><button type="button" class="linkbtn" data-reset>Make a new code</button></div>
        ${c.client_user ? `<div class="sx-codebox"><span>Linked to their Revora account</span><button type="button" class="linkbtn" data-unlink>Unlink</button></div>` : ""}
        <p class="sx-err" hidden></p>
        <div class="sx-acts">${isOwner() ? `<button type="button" class="btn danger" data-delc>Delete client</button><span class="grow"></span>` : ""}<button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn pri">Save</button></div></form>`, { title: "Edit client", wide: true });
    const f = m.querySelector("#ecF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => {
      ev.preventDefault(); const d = Object.fromEntries(new FormData(f));
      if (!d.name.trim()) { er.textContent = "Add their name."; er.hidden = false; return; }
      if (d.email && !/^\S+@\S+\.\S+$/.test(d.email.trim())) { er.textContent = "That email doesn't look right."; er.hidden = false; return; }
      const patch = { name: d.name.trim(), phone: d.phone.trim(), email: d.email.trim(), notes: d.notes.trim(), updated_at: new Date().toISOString() };
      if (!patch.email && c.remind_ok) patch.remind_ok = false;
      const { error } = await X.sb.from("shop_clients").update(patch).eq("id", c.id); if (error) { er.textContent = err(error); er.hidden = false; return; }
      Object.assign(c, patch); m.close();
      // work orders print the customer from the bike, so keep it in step
      for (const b of bikesOf(c.id)) { try { await putMeta(b, { customer: { name: c.name, phone: c.phone, email: c.email } }); } catch (e) {} }
      note("Saved."); draw();
    };
    m.querySelector("[data-reset]").onclick = () => confirmBox("Make a new client code?", "The old code and link stop working. If they've already linked their Revora account, they stay linked.", "Make a new code", async () => {
      const { data, error } = await X.sb.rpc("shop_reset_code", { cid: c.id }); if (error || !data) return note(err(error), true); c.code = data; m.close(); note("New code: " + data); draw(); });
    const ul = m.querySelector("[data-unlink]"); if (ul) ul.onclick = () => confirmBox("Unlink their account?", `${esc(c.name)} won't see this bike in their Revora account any more. You can send the link again later.`, "Unlink", async () => {
      const { error } = await X.sb.rpc("shop_unlink_client", { cid: c.id }); if (error) return note(err(error), true); c.client_user = null; c.joined_at = null; m.close(); draw(); });
    const dl = m.querySelector("[data-delc]"); if (dl) dl.onclick = () => withPw("Deleting a client", () => { const bs = bikesOf(c.id);
      confirmBox("Delete this client?", `${esc(c.name)}${bs.length ? ` and ${bs.length === 1 ? "their bike" : "their " + bs.length + " bikes"}, with every service logged,` : ""} will be deleted for good.${bs.length ? " To let them keep the history, hand the bikes over first." : ""}`, "Delete client", async () => {
        for (const b of bs) { const { error } = await X.sb.from("projects").delete().eq("id", b.p.id); if (error) return note(err(error), true); S.bikes.delete(b.p.id); }
        const { error } = await X.sb.from("shop_clients").delete().eq("id", c.id); if (error) return note(err(error), true);
        S.clients.delete(c.id); m.close(); note("Client deleted."); nav("clients"); }, true); });
  }
  function shareBox(c) {
    const link = joinUrl(c), first = c.name.split(" ")[0], shop = S.shop.name || "our shop";
    const msg = `Hi ${first}, this is ${shop}. You can follow your bike's service history and see what's due next on Revora, free. Open this link and create an account: ${link}\nYour client code is ${c.code}.`;
    const m = modal(`<p class="sx-p">${esc(first)} opens the link, makes a free Revora account, and sees their bike: every service you've logged, what's due next, and any work order in progress. They don't see prices or your notes. They can ask you for a history report, value or budget, and you approve it.</p>
      <div class="sx-linkbox"><input readonly value="${esc(link)}" aria-label="Client link"><button class="btn sm" data-cl>${ic("copy")} Copy</button></div>
      <div class="sx-linkbox"><span>Or they pick <b>My bike is with a shop</b> on sign-up and type <b class="mono">${esc(c.code)}</b></span></div>
      <label class="sx-f"><b>Message</b><textarea rows="4" readonly>${esc(msg)}</textarea></label>
      <div class="sx-acts">${c.phone ? `<a class="btn" href="sms:${esc(digits(c.phone))}?&body=${encodeURIComponent(msg)}">${ic("phone")} Text it</a>` : ""}${c.email ? `<a class="btn" href="mailto:${esc(c.email)}?subject=${encodeURIComponent("Your bike on Revora")}&body=${encodeURIComponent(msg)}">${ic("mail")} Email it</a>` : ""}<button class="btn pri" data-cm>${ic("copy")} Copy message</button></div>`, { title: `Share with ${first}`, wide: true });
    m.querySelector("[data-cl]").onclick = () => copy(link, "Link copied");
    m.querySelector("[data-cm]").onclick = () => copy(msg, "Message copied");
  }

  /* ---------- bike details, odometer, schedule ---------- */
  function bikeBox(c, b) {
    const m0 = b ? b.meta : {};
    const m = modal(`<form class="sx-form" id="bkF" novalidate>${bikeFields(m0, b ? false : true)}${b ? "" : `<label class="sx-chk"><input type="checkbox" name="preset" checked><span>Start with typical service intervals</span></label>`}
      <label class="sx-f"><b>Color or nickname (optional)</b><input name="color" maxlength="60" value="${esc(m0.color || "")}"></label><p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">${b ? "Save" : "Add bike"}</button></div></form>`, { title: b ? "Bike details" : "Add a bike for " + c.name.split(" ")[0], wide: true });
    const f = m.querySelector("#bkF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => {
      ev.preventDefault(); const d = Object.fromEntries(new FormData(f)), label = bikeLabel(d);
      if (!bikeLabel(d)) { er.textContent = "Add the bike's make or model."; er.hidden = false; return; }
      f.querySelectorAll("button").forEach(x => x.disabled = true);
      try {
        if (b) { await putMeta(b, { bike: label, projectName: label, year: d.year.trim(), make: d.make.trim(), model: d.model.trim(), style: d.style, drive: d.drive, frameNo: String(d.vin || "").trim(), color: d.color.trim() }); await X.sb.from("projects").update({ name: label }).eq("id", b.p.id); b.p.name = label; }
        else { const nb = await createBike(c, d); if (d.color) await putMeta(nb, { color: d.color.trim() }); }
        m.close(); draw(); note(b ? "Saved." : "Bike added.");
      } catch (e) { er.textContent = err(e); er.hidden = false; f.querySelectorAll("button").forEach(x => x.disabled = false); }
    };
  }
  function odoBox(b) {
    const m = modal(`<form class="sx-form" id="odF"><div class="sx-f2"><label class="sx-f"><b>Odometer (mi)</b><input name="miles" inputmode="numeric" required placeholder="${b.c.odo ? D().milesFmt(b.c.odo.miles) : ""}"></label><label class="sx-f"><b>Date</b><input name="date" type="date" value="${today()}" max="${today()}"></label></div>
      ${b.c.odo ? `<p class="sx-small">Last reading ${D().milesFmt(b.c.odo.miles)} mi on ${esc(fmt(b.c.odo.date))}.</p>` : ""}<p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">Save reading</button></div></form>`, { title: "Odometer reading" });
    const f = m.querySelector("#odF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); const mi = n(String(f.miles.value).replace(/,/g, "")); if (!mi) { er.textContent = "Type the miles."; er.hidden = false; return; }
      if (b.c.odo && mi < b.c.odo.miles && !confirm(`That's lower than the last reading (${D().milesFmt(b.c.odo.miles)} mi). Save it anyway?`)) return;
      try { await putRecs(b, [{ coll: "mileage", rec: { id: nextId(b, "mileage"), date: f.date.value || today(), miles: mi, note: "At the shop" } }]); m.close(); draw(); note("Reading saved."); } catch (e) { er.textContent = err(e); er.hidden = false; } };
  }
  function schedBox(b) {
    const items = D().live(b.recs.schedule).sort((a, z) => n(a.order) - n(z.order));
    const row = it => `<div class="sx-sr" data-id="${esc(it ? it.id : "")}"><input name="name" value="${esc(it ? it.name : "")}" placeholder="Service" maxlength="80" aria-label="Service"><input name="em" inputmode="numeric" value="${it && n(it.everyMiles) ? n(it.everyMiles) : ""}" placeholder="miles" aria-label="Every miles"><input name="mo" inputmode="numeric" value="${it && n(it.everyMonths) ? n(it.everyMonths) : ""}" placeholder="months" aria-label="Every months"><input name="ld" type="date" value="${esc(it ? it.lastDate || "" : "")}" aria-label="Last done date"><input name="lm" inputmode="numeric" value="${it && n(it.lastMiles) ? n(it.lastMiles) : ""}" placeholder="miles" aria-label="Last done miles"><button type="button" class="sx-x" data-rm aria-label="Remove">×</button></div>`;
    const m = modal(`<p class="sx-p">Every X miles or Y months, whichever comes first. "Last done" is only needed until you log that service here.</p>
      <div class="sx-sr sx-srh"><span>Service</span><span>Every mi</span><span>Every mo</span><span>Last done</span><span>At mi</span><span></span></div><div id="srL">${items.map(row).join("")}</div>
      <div class="sx-acts left"><button class="btn sm" data-add>${ic("plus")} Add a service</button>${items.length ? "" : `<button class="btn sm" data-pre>Add typical intervals</button>`}</div>
      <div class="sx-acts"><button class="btn" data-close>Cancel</button><button class="btn pri" data-save>Save schedule</button></div>`, { title: "Service schedule · " + bikeName(b), wide: true });
    const L = m.querySelector("#srL"), removed = [];
    L.onclick = ev => { const x = ev.target.closest("[data-rm]"); if (!x) return; const r = x.closest(".sx-sr"); if (r.dataset.id) removed.push(r.dataset.id); r.remove(); };
    m.querySelector("[data-add]").onclick = () => { L.insertAdjacentHTML("beforeend", row(null)); L.lastElementChild.querySelector("input").focus(); };
    const pr = m.querySelector("[data-pre]"); if (pr) pr.onclick = async () => { await addPresets(b); m.close(); schedBox(b); };
    m.querySelector("[data-save]").onclick = async ev => {
      ev.target.disabled = true; const out = []; let k = 0;
      L.querySelectorAll(".sx-sr").forEach((r, i) => { const v = s => r.querySelector(`[name=${s}]`).value.trim(); if (!v("name")) return;
        const old = r.dataset.id ? b.recs.schedule.find(s => s.id === r.dataset.id) : null;
        out.push({ coll: "schedule", rec: Object.assign({}, old || { id: nextIdAfter(b, "schedule", k++), category: "General", source: "Set by the shop", notes: "" }, { name: v("name"), everyMiles: n(v("em").replace(/,/g, "")), everyMonths: n(v("mo")), lastDate: v("ld"), lastMiles: n(v("lm").replace(/,/g, "")), order: i + 1 }) }); });
      try { if (out.length) await putRecs(b, out); for (const id of removed) await delRec(b, "schedule", id); m.close(); draw(); note("Schedule saved."); } catch (e) { ev.target.disabled = false; note(err(e), true); }
    };
  }

  /* ---------- log a service ---------- */
  function logBox(c, b, rec) {
    const bikes = bikesOf(c.id); if (!b) b = bikes[0]; if (!b) return bikeBox(c, null);
    const edit = !!rec, r = rec || {};
    const sched = bk => D().live(bk.recs.schedule).sort((a, z) => n(a.order) - n(z.order));
    const chips = bk => { const st = new Map(bk.c.items.map(i => [i.id, i.status])); return sched(bk).map(s => `<label class="sx-tick ${st.get(s.id) || ""}"><input type="checkbox" name="items" value="${esc(s.id)}" ${(r.items || []).includes(s.id) ? "checked" : ""}><span>${esc(s.name)}</span></label>`).join("") || `<span class="sx-small">No schedule yet. What you type above is still saved.</span>`; };
    const m = modal(`<form class="sx-form" id="lgF" novalidate>
        ${bikes.length > 1 && !edit ? `<label class="sx-f"><b>Bike</b><select name="bike">${bikes.map(x => `<option value="${esc(x.p.id)}"${x === b ? " selected" : ""}>${esc(bikeName(x))}</option>`).join("")}</select></label>` : ""}
        <div class="sx-f2"><label class="sx-f"><b>Date</b><input name="date" type="date" value="${esc(r.date || today())}" max="${today()}" required></label><label class="sx-f"><b>Odometer (mi)</b><input name="odometer" inputmode="numeric" value="${r.odometer ? n(r.odometer) : ""}" placeholder="${b.c.odo ? "Last: " + D().milesFmt(b.c.odo.miles) : ""}"></label></div>
        <label class="sx-f"><b>What was done</b><input name="service" maxlength="200" required value="${esc(r.service || "")}" placeholder="Oil and filter change, new rear tire, chain adjust…"></label>
        <div class="sx-f"><b>Tick what this covers, so the next due dates reset</b><div class="sx-ticks" id="lgTicks">${chips(b)}</div></div>
        <label class="sx-f"><b>Parts and fluids used</b><textarea name="partsUsed" rows="2" maxlength="2000" placeholder="One per line: part number, name, quantity">${esc(r.partsUsed || "")}</textarea></label>
        <div class="sx-f4"><label class="sx-f"><b>Labor (hrs)</b><input name="laborHours" inputmode="decimal" value="${n(r.laborHours) || ""}"></label><label class="sx-f"><b>Parts $</b><input name="partsCost" inputmode="decimal" value="${n(r.partsCost) || ""}"></label><label class="sx-f"><b>Labor $</b><input name="laborCost" inputmode="decimal" value="${n(r.laborCost) || ""}"></label><label class="sx-f"><b>Total $</b><input name="cost" inputmode="decimal" value="${n(r.cost) || ""}" placeholder="adds up"></label></div>
        <label class="sx-f"><b>Shop notes</b><textarea name="notes" rows="2" maxlength="2000" placeholder="Only your shop sees these.">${esc(r.notes || "")}</textarea></label>
        <p class="sx-err" hidden></p>
        <div class="sx-acts">${edit ? `<button type="button" class="btn danger" data-del>Delete</button><span class="grow"></span>` : ""}<button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn pri">${ic("check")} ${edit ? "Save" : "Log service"}</button></div></form>`, { title: (edit ? "Edit service · " : "Log a service · ") + c.name, wide: true });
    const f = m.querySelector("#lgF"), er = m.querySelector(".sx-err");
    const curBike = () => f.bike ? S.bikes.get(f.bike.value) : b;
    if (f.bike) f.bike.onchange = () => { m.querySelector("#lgTicks").innerHTML = chips(curBike()); };
    // ticking an item fills in "what was done" if it's still empty
    m.querySelector("#lgTicks").onchange = () => { if (f.service.dataset.typed) return; const names = [...f.querySelectorAll("[name=items]:checked")].map(x => x.nextElementSibling.textContent); f.service.value = names.join(", "); };
    f.service.oninput = () => { f.service.dataset.typed = f.service.value ? "1" : ""; };
    const cst = () => { if (f.cost.dataset.typed) return; const t = n(f.partsCost.value) + n(f.laborCost.value); f.cost.placeholder = t ? usd(t) : "adds up"; };
    f.partsCost.oninput = f.laborCost.oninput = cst; f.cost.oninput = () => { f.cost.dataset.typed = f.cost.value ? "1" : ""; };
    f.onsubmit = async ev => {
      ev.preventDefault(); const bk = curBike(), d = new FormData(f), num = k => n(String(d.get(k) || "").replace(/[$,]/g, ""));
      const items = d.getAll("items"), service = String(d.get("service") || "").trim();
      if (!service) { er.textContent = "Say what was done."; er.hidden = false; return; }
      const odo = num("odometer");
      if (odo && bk.c.odo && odo < bk.c.odo.miles && !edit && !confirm(`${D().milesFmt(odo)} mi is lower than the last reading (${D().milesFmt(bk.c.odo.miles)} mi). Save it anyway?`)) return;
      f.querySelectorAll("button").forEach(x => x.disabled = true);
      const out = Object.assign({}, r, { id: r.id || nextId(bk, "maintenance"), service, date: d.get("date") || today(), odometer: odo, kind: r.kind || (items.length ? "Scheduled service" : "Repair"), items, doneBy: "A shop", shop: S.shop.name || "Shop", byOwner: r.byEmp ? r.byOwner : who(),
        laborHours: num("laborHours"), partsUsed: String(d.get("partsUsed") || "").trim(), partsCost: num("partsCost"), laborCost: num("laborCost"), cost: num("cost"), notes: String(d.get("notes") || "").trim(), planned: false });
      try {
        await putRecs(bk, [{ coll: "maintenance", rec: out }]);
        m.close(); draw();
        const nx = bk.c.ranked.find(i => i.status !== "nointerval" && i.status !== "none"), cl = clientOf(bk);
        note(`Logged.${nx ? ` Next up: ${nx.name}, ${D().whenTxt(nx)}.` : ""}${cl && cl.remind_ok && cl.email ? " They'll get a reminder before it's due." : ""}`);
      } catch (e) { er.textContent = err(e); er.hidden = false; f.querySelectorAll("button").forEach(x => x.disabled = false); }
    };
    const dl = m.querySelector("[data-del]"); if (dl) dl.onclick = () => { if (!confirm("Delete this service record?")) return; delRec(b, "maintenance", r.id).then(() => { m.close(); draw(); note("Deleted."); }, e => note(err(e), true)); };
  }

  /* ---------- upgrades ---------- */
  function modsBox(b) {
    const draw2 = () => {
      const L = D().live(b.recs.mods).sort((a, z) => ({ Planned: 0, Ordered: 1, Installed: 2, Removed: 3 })[a.status] - ({ Planned: 0, Ordered: 1, Installed: 2, Removed: 3 })[z.status] || String(z.date || "").localeCompare(String(a.date || "")));
      body.innerHTML = `${L.length ? `<div class="sx-ml">${L.map(x => `<div class="sx-mrow"><span class="grow"><b>${esc(x.name)}</b><small>${esc([x.brand, x.partNo, n(x.price) ? "part " + usd(x.price) : "", n(x.labor) ? "labor " + usd(x.labor) : "", x.status === "Installed" && x.date ? "fitted " + fmt(x.date) : ""].filter(Boolean).join(" · "))}</small></span>
          <select data-st="${esc(x.id)}" aria-label="Status">${["Planned", "Ordered", "Installed", "Removed"].map(s => `<option value="${s}"${x.status === s ? " selected" : ""}>${MOD_LABEL[s]}</option>`).join("")}</select><button class="linkbtn" data-ed="${esc(x.id)}">Edit</button></div>`).join("")}</div>
          <p class="sx-small">Wanted and ordered: ${usd(L.filter(x => x.status === "Planned" || x.status === "Ordered").reduce((s, x) => s + D().modCost(x), 0))} · Fitted: ${usd(L.filter(x => x.status === "Installed").reduce((s, x) => s + D().modCost(x), 0))}</p>` : `<p class="sx-p">Nothing yet. Add what the client wants fitted, with a price, so it shows on their budget.</p>`}
        <form class="sx-form sx-mform" id="mdF"><h3 class="sx-h3">${edId ? "Edit upgrade" : "Add an upgrade"}</h3>
          <div class="sx-f2"><label class="sx-f"><b>What</b><input name="name" required maxlength="120" placeholder="Slip-on exhaust, heated grips…"></label><label class="sx-f"><b>Status</b><select name="status">${["Planned", "Ordered", "Installed"].map(s => `<option value="${s}">${MOD_LABEL[s]}</option>`).join("")}</select></label></div>
          <div class="sx-f4"><label class="sx-f"><b>Brand</b><input name="brand" maxlength="60"></label><label class="sx-f"><b>Part number</b><input name="partNo" maxlength="60"></label><label class="sx-f"><b>Part $</b><input name="price" inputmode="decimal"></label><label class="sx-f"><b>Labor $</b><input name="labor" inputmode="decimal"></label></div>
          <div class="sx-f2"><label class="sx-f"><b>Fitted on</b><input name="date" type="date"></label><label class="sx-f"><b>Odometer when fitted</b><input name="odometer" inputmode="numeric"></label></div>
          <div class="sx-acts">${edId ? `<button type="button" class="btn" data-cancel>Cancel edit</button>` : ""}<button class="btn pri" type="submit">${edId ? "Save upgrade" : ic("plus") + " Add upgrade"}</button></div></form>`;
      const f = body.querySelector("#mdF");
      if (edId) { const x = b.recs.mods.find(z => z.id === edId); ["name", "status", "brand", "partNo", "date"].forEach(k => f[k].value = x[k] || (k === "status" ? "Planned" : "")); f.price.value = n(x.price) || ""; f.labor.value = n(x.labor) || ""; f.odometer.value = n(x.odometer) || ""; }
      body.querySelectorAll("[data-st]").forEach(s => s.onchange = async () => { const x = b.recs.mods.find(z => z.id === s.dataset.st); const p = { status: s.value }; if (s.value === "Installed" && !x.date) p.date = today(); try { await putRecs(b, [{ coll: "mods", rec: Object.assign({}, x, p) }]); draw2(); } catch (e) { note(err(e), true); } });
      body.querySelectorAll("[data-ed]").forEach(x => x.onclick = () => { edId = x.dataset.ed; draw2(); body.querySelector("#mdF").scrollIntoView({ block: "nearest" }); });
      const cn = body.querySelector("[data-cancel]"); if (cn) cn.onclick = () => { edId = ""; draw2(); };
      f.status.onchange = () => { if (f.status.value === "Installed" && !f.date.value) f.date.value = today(); };
      f.onsubmit = async ev => { ev.preventDefault(); const d = Object.fromEntries(new FormData(f)), num = k => n(String(d[k] || "").replace(/[$,]/g, ""));
        if (!d.name.trim()) return; const old = edId ? b.recs.mods.find(z => z.id === edId) : {};
        const rec = Object.assign({}, old, { id: old.id || nextId(b, "mods"), name: d.name.trim(), status: d.status, brand: d.brand.trim(), partNo: d.partNo.trim(), price: num("price"), labor: num("labor"), date: d.date, odometer: num("odometer"), installedBy: "A shop", shop: S.shop.name || "Shop", category: old.category || "Other" });
        try { await putRecs(b, [{ coll: "mods", rec }]); edId = ""; draw2(); } catch (e) { note(err(e), true); } };
    };
    let edId = "";
    const m = modal(`<div id="mdB"></div>`, { title: "Upgrades · " + bikeName(b), wide: true, onClose: () => draw() });
    const body = m.querySelector("#mdB"); draw2();
  }

  /* ---------- budgets ---------- */
  function budgetBox(c) {
    const mo = S.money.get(c.id) || { budget: 0, since: today(), notes: "" };
    const m = modal(`<form class="sx-form" id="bdF"><div class="sx-f2"><label class="sx-f"><b>Budget ($)</b><input name="budget" inputmode="decimal" value="${n(mo.budget) || ""}" placeholder="1500"></label><label class="sx-f"><b>Counting from</b><input name="since" type="date" value="${esc(mo.since || today())}"></label></div>
      <label class="sx-f"><b>Notes</b><textarea name="notes" rows="2" maxlength="1000" placeholder="e.g. Wants the bike touring-ready by spring">${esc(mo.notes || "")}</textarea></label>
      <p class="sx-small">Services and fitted upgrades on all of ${esc(c.name.split(" ")[0])}'s bikes from that date count against it. Only you, the shop owner, see budgets. The client sees it only when you send it.</p>
      <div class="sx-acts">${n(mo.budget) ? `<button type="button" class="btn danger" data-clear>Remove budget</button><span class="grow"></span>` : ""}<button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">Save budget</button></div></form>`, { title: "Budget for " + c.name });
    const f = m.querySelector("#bdF");
    const save = async row => { const { data, error } = await X.sb.from("shop_client_money").upsert(Object.assign({ client_id: c.id, shop_id: S.shop.id, updated_at: new Date().toISOString() }, row)).select("*").single(); if (error) return note(err(error), true); S.money.set(c.id, data); m.close(); draw(); };
    f.onsubmit = ev => { ev.preventDefault(); save({ budget: n(String(f.budget.value).replace(/[$,]/g, "")), since: f.since.value || today(), notes: f.notes.value.trim() }); };
    const cl = m.querySelector("[data-clear]"); if (cl) cl.onclick = () => save({ budget: 0, since: mo.since || today(), notes: "" });
  }

  /* ---------- value ---------- */
  function valueBox(b, then) {
    const v = b.meta.shopValue || {}, spent = b.c.done.reduce((s, r) => s + D().svcCost(r), 0) + D().live(b.recs.mods).filter(x => x.status === "Installed").reduce((s, x) => s + D().modCost(x), 0);
    const m = modal(`<form class="sx-form" id="vlF"><p class="sx-p">Your estimate of what ${esc(bikeName(b))} would sell for today. ${spent ? `Services and upgrades on record: ${usd0(spent)}.` : ""}</p>
      <div class="sx-f3"><label class="sx-f"><b>Estimated value ($)</b><input name="amount" inputmode="decimal" required value="${n(v.amount) || ""}"></label><label class="sx-f"><b>Low ($)</b><input name="low" inputmode="decimal" value="${n(v.low) || ""}"></label><label class="sx-f"><b>High ($)</b><input name="high" inputmode="decimal" value="${n(v.high) || ""}"></label></div>
      <label class="sx-f"><b>Condition</b><select name="condition">${["Excellent", "Good", "Fair", "Needs work"].map(k => `<option${(v.condition || "Good") === k ? " selected" : ""}>${k}</option>`).join("")}</select></label>
      <label class="sx-f"><b>Notes for the client</b><textarea name="note" rows="3" maxlength="1200" placeholder="What helps or hurts the value: tires, recent service, cosmetic marks, comparable bikes for sale nearby.">${esc(v.note || "")}</textarea></label>
      <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn" type="submit" data-k="save">Save</button><button class="btn pri" type="submit" data-k="send">${ic("doc")} Save and preview</button></div></form>`, { title: "Bike value", wide: true });
    const f = m.querySelector("#vlF"); let k = "send"; f.querySelectorAll("[data-k]").forEach(x => x.onclick = () => { k = x.dataset.k; });
    f.onsubmit = async ev => { ev.preventDefault(); const num = s => n(String(f[s].value).replace(/[$,]/g, ""));
      if (!num("amount")) return note("Add the estimated value.", true);
      try { await putMeta(b, { shopValue: { amount: num("amount"), low: num("low"), high: num("high"), condition: f.condition.value, note: f.note.value.trim(), date: today(), by: who() } }); } catch (e) { return note(err(e), true); }
      m.close(); if (then) return then(); if (k === "send") docBox("value", b); else { draw(); note("Value saved."); } };
  }

  /* ---------- documents: build, preview, print, send ---------- */
  function docFor(kind, b) {
    const c = clientOf(b) || { name: "" };
    return DOC().build(kind, { shop: S.shop, client: c, bike: Object.assign({ name: bikeName(b), meta: b.meta }, b.recs), value: b.meta.shopValue, money: S.money.get(c.id), spendAll: kind === "budget" ? bikesOf(c.id).map(x => Object.assign({ name: bikeName(x), meta: x.meta }, x.recs)) : null });
  }
  function docBox(kind, b, req) {
    if (kind === "value" && !(b.meta.shopValue && n(b.meta.shopValue.amount))) return valueBox(b, () => docBox(kind, b, req));
    if (kind === "budget" && !isOwner()) return note("Only the shop owner can send budgets.", true);
    const c = clientOf(b), d = docFor(kind, b), can = c && (c.email || c.client_user);
    const m = modal(`<div class="sx-docwrap">${DOC().html(d)}</div>
      <div class="sx-acts sx-docacts"><span class="sx-small grow">${!c ? "" : can ? `Sends ${esc(c.name.split(" ")[0])} a link${c.email ? " by email" : ""}${c.client_user ? " and puts it in their Revora account" : ""}.` : "Add their email to send it, or print it for them."}</span>
        <button class="btn" data-print>${ic("print")} Print</button>${req ? `<button class="btn" data-decline>Decline request</button>` : ""}<button class="btn pri" data-send ${can ? "" : "disabled"}>${ic("send")} ${req ? "Approve and send" : "Send to client"}</button></div>`, { title: DOC().KIND[kind] + " · " + bikeName(b), wide: true, doc: true });
    m.querySelector("[data-print]").onclick = () => printDoc(DOC().html(d));
    const dc = m.querySelector("[data-decline]"); if (dc) dc.onclick = () => { m.close(); declineReq(req); };
    m.querySelector("[data-send]").onclick = async ev => {
      ev.target.disabled = true; let id = null, token = null;
      if (req) { const { data: r, error } = await X.sb.rpc("shop_decide_request", { rid: req.id, ok: true, doc: d }); if (error || r !== "ok") { ev.target.disabled = false; return note(r === "done" ? "That request was already handled." : err(error), true); } id = req.id; }
      else { const { data: r, error } = await X.sb.rpc("shop_send_doc", { pid: b.p.id, k: kind, doc: d }); if (error || !r) { ev.target.disabled = false; return note(err(error), true); } id = r.id; token = r.token; }
      mailDoc(id);
      const { data: fresh } = await X.sb.from("shop_requests").select("id,client_id,project_id,kind,status,asked_by_client,token,created_at,decided_at,emailed_at").eq("id", id).maybeSingle();
      S.requests = S.requests.filter(q => q.id !== id); if (fresh) S.requests.unshift(fresh); else if (token) S.requests.unshift({ id, client_id: c.id, project_id: b.p.id, kind, status: "approved", token, decided_at: new Date().toISOString(), created_at: new Date().toISOString() });
      m.close(); draw(); note(`Sent to ${c.name.split(" ")[0]}.`);
    };
  }
  // the reminders worker emails the client a link right away (and again on its hourly run if this one is missed)
  function mailDoc(id) { try { fetch((window.RV_CONFIG && RV_CONFIG.remindersApi || "https://revora-reminders.xavier-j-wilson101.workers.dev") + "/shop-doc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }), keepalive: true }).catch(() => {}); } catch (e) {} }
  function printDoc(html) {
    let host = document.getElementById("sxPrint"); if (!host) { host = document.createElement("div"); host.id = "sxPrint"; document.body.appendChild(host); }
    host.innerHTML = html; document.body.classList.add("sx-printing"); window.print(); setTimeout(() => { document.body.classList.remove("sx-printing"); host.innerHTML = ""; }, 800);
  }
  function approveReq(q) {
    if (!q) return; const b = S.bikes.get(q.project_id); if (!b) return note("That bike isn't in the shop any more.", true);
    if (q.kind === "budget" && !isOwner()) return note("Only the shop owner can approve budgets.", true);
    if (q.kind === "budget" && !(S.money.get(q.client_id) && n(S.money.get(q.client_id).budget))) return note("Set a budget for this client first, then approve.", true), budgetBox(S.clients.get(q.client_id));
    docBox(q.kind, b, q);
  }
  function declineReq(q) {
    if (!q) return; const c = S.clients.get(q.client_id);
    confirmBox("Decline this request?", `${esc(c ? c.name : "The client")} will see that it was declined. You can still send it later.`, "Decline", async () => {
      const { data: r, error } = await X.sb.rpc("shop_decide_request", { rid: q.id, ok: false, doc: null }); if (error || r !== "ok") return note(err(error), true);
      q.status = "declined"; q.decided_at = new Date().toISOString(); draw(); });
  }

  /* ---------- hand a bike to the client ---------- */
  function transferBox(c, b) {
    const linked = !!c.client_user;
    const m = modal(`<p class="sx-p">${esc(bikeName(b))} moves into ${esc(c.name)}'s own Revora garage with its whole history: every service, upgrade, photo and work order. It leaves your shop for good, and their reminders from your shop stop.</p>
      <p class="sx-p">${linked ? `${esc(c.name.split(" ")[0])} is already on Revora, so it moves right away.` : c.email ? `${esc(c.name.split(" ")[0])} isn't on Revora yet. It moves when they create an account with <b>${esc(c.email)}</b>.` : `Add ${esc(c.name.split(" ")[0])}'s email first, or send them the client link so they can join.`}</p>
      <p class="sx-small">Only do this when they're taking the bike's records with them. To let them follow along while you keep working on it, send the client link instead.</p>
      <div class="sx-acts"><button class="btn" data-close>Cancel</button>${linked || c.email ? `<button class="btn pri" data-go>${ic("move")} Hand it over</button>` : `<button class="btn pri" data-sh>${ic("link")} Share the client link</button>`}</div>`, { title: "Hand bike to client" });
    const sh = m.querySelector("[data-sh]"); if (sh) sh.onclick = () => { m.close(); shareBox(c); };
    const go = m.querySelector("[data-go]"); if (go) go.onclick = async () => {
      go.disabled = true; const { data: r, error } = await X.sb.rpc("shop_transfer_bike", { pid: b.p.id });
      if (error || !r || r === "denied") { go.disabled = false; return note(err(error), true); }
      m.close();
      if (r === "moved") { S.bikes.delete(b.p.id); note(`${bikeName(b)} is in ${c.name.split(" ")[0]}'s garage now.`); }
      else if (r === "waiting") note(`Ready. It moves when ${c.name.split(" ")[0]} signs up with ${c.email}.`);
      else note("Add their email first.", true);
      draw();
    };
  }

  /* ---------- Requests ---------- */
  function viewRequests() {
    const pend = pendingReq(), done = S.requests.filter(q => q.status !== "pending").slice(0, 40);
    shell(`<div class="sx-pageh"><div><h1>Requests</h1><p>Clients on Revora can ask for their history report, bike value or budget. Approve and Revora emails it to them.</p></div></div>
      <section class="sx-panel"><div class="sx-ph"><h2>Waiting on you</h2><span>${pend.length}</span></div>${pend.length ? `<div class="sx-rows">${pend.map(reqRow).join("")}</div>` : `<div class="sx-empty">${ic("check")}<b>All caught up.</b></div>`}</section>
      <section class="sx-panel"><div class="sx-ph"><h2>Sent and declined</h2></div>${done.length ? `<div class="sx-rows">${done.map(q => { const c = S.clients.get(q.client_id), b = S.bikes.get(q.project_id);
        return `<div class="sx-row"><span class="grow"><b>${esc(DOC().KIND[q.kind])} · ${esc(c ? c.name : "")}</b><small>${esc(b ? bikeName(b) : "Bike no longer in the shop")} · ${esc(fmt(q.decided_at))}${q.asked_by_client ? "" : " · you sent it"}</small></span>${q.status === "approved" ? `<a class="btn sm" href="?shopdoc=${esc(q.token)}" target="_blank" rel="noopener">Open</a>` : `<span class="pill gray plain">Declined</span>`}</div>`; }).join("")}</div>` : `<div class="sx-empty sm"><span>Nothing yet.</span></div>`}</section>`, "requests");
    bindCommon();
  }

  /* ---------- Money (owner only) ---------- */
  function viewMoney() {
    const t = today(), mStart = t.slice(0, 8) + "01", yStart = t.slice(0, 5) + "01-01", lyStart = (+t.slice(0, 4) - 1) + "-01-01";
    const lines = []; S.bikes.forEach(b => { b.c.done.forEach(r => { const a = D().svcCost(r); if (a) lines.push({ date: r.date, a, kind: "svc", cid: b.p.shop_client }); }); D().live(b.recs.mods).filter(x => x.status === "Installed").forEach(x => { const a = D().modCost(x); if (a) lines.push({ date: x.date || "", a, kind: "mod", cid: b.p.shop_client }); }); });
    const sum = (from, to) => lines.filter(l => l.date >= from && (!to || l.date < to)).reduce((s, l) => s + l.a, 0);
    const months = []; for (let i = 11; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); const k = d.toISOString().slice(0, 7); months.push({ k, lbl: d.toLocaleDateString("en-US", { month: "short" }), v: lines.filter(l => l.date.slice(0, 7) === k).reduce((s, l) => s + l.a, 0) }); }
    const mx = Math.max(1, ...months.map(x => x.v));
    const buds = [...S.clients.values()].map(c => ({ c, mo: S.money.get(c.id) })).filter(x => x.mo && n(x.mo.budget)).map(x => { const sp = spendOf(bikesOf(x.c.id), x.mo.since); return Object.assign(x, { sp, left: n(x.mo.budget) - sp, pl: plannedOf(bikesOf(x.c.id)) }); }).sort((a, z) => a.left - z.left);
    const top = [...S.clients.values()].map(c => ({ c, v: lines.filter(l => l.cid === c.id && l.date >= yStart).reduce((s, l) => s + l.a, 0) })).filter(x => x.v).sort((a, z) => z.v - a.v).slice(0, 8);
    const plannedAll = [...S.bikes.values()].reduce((s, b) => s + D().live(b.recs.mods).filter(x => x.status === "Planned" || x.status === "Ordered").reduce((t2, x) => t2 + D().modCost(x), 0), 0);
    shell(`<div class="sx-pageh"><div><h1>Money</h1><p>Services and fitted upgrades logged in Revora. Only you see this page.</p></div></div>
      <div class="sx-kpis"><div class="sx-kpi"><span>This month</span><b>${usd0(sum(mStart))}</b></div><div class="sx-kpi"><span>This year</span><b>${usd0(sum(yStart))}</b></div><div class="sx-kpi"><span>Last year</span><b>${usd0(sum(lyStart, yStart))}</b></div><div class="sx-kpi"><span>Upgrades wanted</span><b>${usd0(plannedAll)}</b></div><div class="sx-kpi"><span>Client budgets</span><b>${usd0(buds.reduce((s, x) => s + n(x.mo.budget), 0))}</b></div></div>
      <section class="sx-panel"><div class="sx-ph"><h2>Last 12 months</h2></div><div class="sx-bars">${months.map(x => `<div class="sx-barc" title="${esc(x.lbl)}: ${usd0(x.v)}"><span class="sx-barv">${x.v ? usd0(x.v) : ""}</span><i style="height:${Math.max(2, Math.round(x.v / mx * 100))}%"></i><small>${esc(x.lbl)}</small></div>`).join("")}</div></section>
      <div class="sx-grid2">
        <section class="sx-panel"><div class="sx-ph"><h2>Client budgets</h2><span>${buds.length} with a budget</span></div>${buds.length ? `<div class="sx-rows">${buds.map(x => `<button class="sx-row" data-open="${esc(x.c.id)}"><span class="grow"><b>${esc(x.c.name)}</b><small>${usd0(x.sp)} of ${usd0(x.mo.budget)} spent${x.pl ? ` · ${usd0(x.pl)} in wanted upgrades` : ""}</small><span class="sd-bar sm${x.left < 0 ? " over" : ""}"><i style="width:${Math.min(100, Math.round(x.sp / n(x.mo.budget) * 100))}%"></i></span></span><span class="sx-when${x.left < 0 ? " late" : ""}">${x.left < 0 ? usd0(-x.left) + " over" : usd0(x.left) + " left"}</span></button>`).join("")}</div>` : `<div class="sx-empty sm"><span>Set a budget on a client's page to track it here.</span></div>`}</section>
        <section class="sx-panel"><div class="sx-ph"><h2>Top clients this year</h2></div>${top.length ? `<div class="sx-rows">${top.map(x => `<button class="sx-row" data-open="${esc(x.c.id)}"><span class="grow"><b>${esc(x.c.name)}</b><small>${esc(bikesOf(x.c.id).map(bikeName).join(", "))}</small></span><span class="sx-when">${usd0(x.v)}</span></button>`).join("")}</div>` : `<div class="sx-empty sm"><span>Add prices when you log services to see this.</span></div>`}</section></div>`, "money");
    bindCommon();
  }

  /* ---------- shop details (setup and settings share the form) ---------- */
  const SERVICES = ["Motorcycles", "Scooters", "Dirt bikes", "ATVs and UTVs", "Snowmobiles", "Watercraft", "Small engines"];
  function detailsForm(sh, opts) {
    const d = Object.assign({}, sh.details || {}), dis = opts.readonly ? "disabled" : "";
    const f = (k, label, extra, val) => `<label class="sx-f"><b>${label}</b><input name="${k}" ${extra || ""} value="${esc(val != null ? val : d[k] || "")}" ${dis}></label>`;
    return `<h3 class="sx-h3">Shop</h3>
      <div class="sx-f2">${f("name", "Shop name", 'maxlength="80" required placeholder="Pete\'s Moto Service"', sh.name || "")}${f("legal", "Legal or business name <span class=\"faint\">(optional)</span>", 'maxlength="120"')}</div>
      <div class="sx-f2">${f("phone", "Phone", 'type="tel" maxlength="40"', sh.phone || "")}${f("email", "Email <small class=\"faint\">(replies to reminders go here)</small>", 'type="email" maxlength="200"', sh.email || (opts.email || ""))}</div>
      <h3 class="sx-h3">Address</h3>${f("street", "Street", 'maxlength="120"')}
      <div class="sx-f3">${f("city", "City", 'maxlength="60"')}${f("state", "State", 'maxlength="30"')}${f("zip", "ZIP", 'maxlength="12" inputmode="numeric"')}</div>
      <h3 class="sx-h3">Online and hours</h3><div class="sx-f2">${f("website", "Website", 'maxlength="120" placeholder="petesmoto.com"')}${f("hours", "Hours", 'maxlength="120" placeholder="Tue to Sat, 9 to 6"')}</div>
      <h3 class="sx-h3">Pricing <span class="faint" style="font-weight:400">(used on work orders and estimates)</span></h3>
      <div class="sx-f4">${f("rate", "Labor rate ($/hr)", 'inputmode="decimal"')}${f("taxPct", "Sales tax %", 'inputmode="decimal"')}${f("suppliesPct", "Shop supplies %", 'inputmode="decimal"')}${f("deposit", "Deposit ($)", 'inputmode="decimal"')}</div>
      <div class="sx-f"><b>What you work on</b><div class="sx-ticks">${SERVICES.map(x => `<label class="sx-tick"><input type="checkbox" name="services" value="${esc(x)}" ${(d.services || ["Motorcycles"]).includes(x) ? "checked" : ""} ${dis}><span>${esc(x)}</span></label>`).join("")}</div></div>
      <div class="sx-f2">${f("brands", "Brands or specialties <span class=\"faint\">(optional)</span>", 'maxlength="200" placeholder="Harley, metric cruisers, vintage Japanese"')}${f("license", "Dealer or repair license # <span class=\"faint\">(optional)</span>", 'maxlength="60"')}</div>
      <label class="sx-f"><b>Fine print on estimates and invoices <span class="faint">(optional)</span></b><textarea name="terms" rows="2" maxlength="600" ${dis} placeholder="e.g. Storage is $10 a day after 3 days of being ready.">${esc(d.terms || "")}</textarea></label>`;
  }
  function readDetails(f) {
    const fd = new FormData(f), g = k => String(fd.get(k) || "").trim(), num = k => n(g(k).replace(/[$,%]/g, ""));
    const details = { legal: g("legal"), street: g("street"), city: g("city"), state: g("state"), zip: g("zip"), website: g("website"), hours: g("hours"), rate: num("rate"), taxPct: num("taxPct"), suppliesPct: num("suppliesPct"), deposit: num("deposit"),
      services: fd.getAll("services"), brands: g("brands"), license: g("license"), terms: g("terms") };
    const address = [details.street, [details.city, [details.state, details.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")].filter(Boolean).join(", ");
    return { name: g("name"), phone: g("phone"), email: g("email"), address, details };
  }
  async function saveDetails(v) {
    const { error } = await X.sb.rpc("shop_setup", { nm: v.name, ph: v.phone, em: v.email, ad: v.address }); if (error) throw error;
    const { error: e2 } = await X.sb.from("shops").update({ details: v.details }).eq("owner", X.session.user.id); if (e2 && !/details/.test(e2.message || "")) throw e2;
  }

  /* ---------- Shop settings ---------- */
  async function viewSettings() {
    const sh = S.shop;
    shell(`<div class="sx-pageh"><div><h1>Shop</h1><p>${isOwner() ? "Your details go on reminder emails, reports, estimates and invoices." : `You work at ${esc(sh.name)}.`}</p></div></div>
      <div class="sx-grid2 wide-left"><section class="sx-panel"><form class="sx-form" id="shF" novalidate>${detailsForm(sh, { readonly: !isOwner() })}<p class="sx-err" hidden></p>
          ${isOwner() ? `<div class="sx-acts left"><button class="btn pri" type="submit">Save details</button></div>` : ""}</form></section>
        <div class="sx-col">${isOwner() ? `<section class="sx-panel"><div class="sx-ph"><h2>Employees</h2></div><p class="sx-small" style="margin:0 0 10px">${S.emps.length ? `${S.emps.length} employee${S.emps.length === 1 ? "" : "s"}.` : "No employees yet."} Add them, assign clients and see their work on the Team page.</p><button class="btn" data-go="team">${ic("users")} Open Team</button></section>` : ""}
          <section class="sx-panel"><div class="sx-ph"><h2>How clients join</h2></div><div class="sx-how one">
            <div><b>1. Add them</b><span>Each client gets a code, like <span class="mono">${esc(([...S.clients.values()][0] || { code: "K7M2Q9XA" }).code)}</span>.</span></div>
            <div><b>2. Share the link</b><span>They make a free account and follow their bike: history and what's due. No prices, no shop notes.</span></div>
            <div><b>3. They ask, you approve</b><span>History report, bike value or budget, emailed when you approve.</span></div>
            <div><b>4. Hand it over</b><span>Moves the bike and its history into their own garage.</span></div></div></section></div></div>`, "settings");
    bindCommon();
    const f = X.app.querySelector("#shF"), er = f.querySelector(".sx-err");
    if (isOwner()) f.onsubmit = async ev => { ev.preventDefault(); const v = readDetails(f); if (!v.name) { er.textContent = "Add the shop's name."; er.hidden = false; return; }
      try { await saveDetails(v); } catch (e) { er.textContent = err(e); er.hidden = false; return; }
      Object.assign(S.shop, { name: v.name, phone: v.phone, email: v.email, address: v.address, details: v.details }); note("Saved."); draw(); };
  }

  /* ---------- Team: employees, PINs, who has who ---------- */
  const empName = id => (S.emps.find(e => e.id === id) || {}).name || "Employee";
  function assignChips(c) {
    const L = S.assign.filter(a => a.client_id === c.id); if (!L.length) return `<span class="faint">Nobody</span>`;
    return L.map(a => `<span class="sx-chip">${esc(empName(a.employee_id))}${a.project_id && S.bikes.get(a.project_id) ? ` · ${esc(bikeName(S.bikes.get(a.project_id)))}` : ""}</span>`).join("");
  }
  function assignBox(c) {
    const bikes = bikesOf(c.id), cur = S.assign.filter(a => a.client_id === c.id);
    const val = e => { const a = cur.find(x => x.employee_id === e.id); return !a ? "" : a.project_id || "all"; };
    const m = modal(`<p class="sx-p">Assigned clients show up on the employee's home screen. Anyone can still find and log any client.</p>
      <div class="sx-rows">${S.emps.map(e => `<div class="sx-row"><span class="sx-av">${esc(initials(e.name || e.email))}</span><span class="grow"><b>${esc(e.name || e.email)}</b></span>
        <select data-e="${esc(e.id)}" aria-label="Assignment for ${esc(e.name)}"><option value="">Not assigned</option><option value="all"${val(e) === "all" ? " selected" : ""}>All ${esc(c.name.split(" ")[0])}'s bikes</option>${bikes.map(b => `<option value="${esc(b.p.id)}"${val(e) === b.p.id ? " selected" : ""}>${esc(bikeName(b))} only</option>`).join("")}</select></div>`).join("")}</div>
      <div class="sx-acts"><button class="btn" data-close>Cancel</button><button class="btn pri" data-save>Save</button></div>`, { title: "Who has " + c.name });
    m.querySelector("[data-save]").onclick = async ev => { ev.target.disabled = true;
      const { error: e1 } = await X.sb.from("shop_assignments").delete().eq("client_id", c.id); if (e1) { ev.target.disabled = false; return note(err(e1), true); }
      const rows = [...m.querySelectorAll("[data-e]")].filter(s2 => s2.value).map(s2 => ({ shop_id: S.shop.id, employee_id: s2.dataset.e, client_id: c.id, project_id: s2.value === "all" ? null : s2.value }));
      if (rows.length) { const { error: e2 } = await X.sb.from("shop_assignments").insert(rows); if (e2) { ev.target.disabled = false; return note(err(e2), true); } }
      const { data } = await X.sb.from("shop_assignments").select("*").eq("shop_id", S.shop.id); S.assign = data || [];
      m.close(); draw(); note("Saved."); };
  }
  function empStats(e) {
    const logs = []; S.bikes.forEach(b => b.recs.maintenance.forEach(r => { if (r.byEmp && r.byEmp.id === e.id && !r.archived) logs.push({ b, r }); }));
    logs.sort((a, z) => String(z.r.date).localeCompare(String(a.r.date)));
    const since = d => logs.filter(x => x.r.date >= D().addDays(today(), -d)).length;
    return { logs, week: since(7), month: since(30) };
  }
  function viewTeam() {
    shell(`<div class="sx-pageh"><div><h1>Team</h1><p>Employees clock in with their name and their own 6-digit PIN, on your computers or their phone. They see only the bikes they're assigned or have worked on. You see everything.</p></div><button class="btn tan" data-addemp>${ic("plus")} Add employee</button></div>
      ${S.emps.length ? S.emps.map(e => { const st = empStats(e), asg = S.assign.filter(a => a.employee_id === e.id);
        return `<section class="sx-panel sx-emp"><div class="sx-emph"><span class="sx-av big">${esc(initials(e.name || e.email))}</span><div class="grow"><h2>${esc(e.name || e.email || "New employee")}</h2>
            <small>${e.status === "invited" ? `<span class="pill amber plain">Hasn't set up yet</span>` : `<span class="pill green plain">Active</span>`} ${esc(e.email || "")}${e.last_seen ? " · last in " + esc(fmt(e.last_seen)) : ""}</small></div>
            <div class="sx-emps"><div><b>${st.week}</b><span>this week</span></div><div><b>${st.month}</b><span>30 days</span></div><div><b>${st.logs.length}</b><span>all time</span></div></div>
            <div class="sx-dd"><button class="btn sm" data-menu>More</button><div class="sx-menu" hidden><button data-rename="${esc(e.id)}">Rename</button><button data-reset="${esc(e.id)}">${ic("key")} New link and starting PIN</button><button class="red" data-rmemp="${esc(e.id)}">Remove</button></div></div></div>
          <div class="sx-grid2 tight"><div><h4>Assigned</h4>${asg.length ? asg.map(a => { const c = S.clients.get(a.client_id); return c ? `<button class="sx-chip link" data-open="${esc(c.id)}">${esc(c.name)}${a.project_id && S.bikes.get(a.project_id) ? " · " + esc(bikeName(S.bikes.get(a.project_id))) : ""}</button>` : ""; }).join("") : `<span class="faint">Nobody yet. Assign from a client's page.</span>`}</div>
            <div><h4>Recent work</h4>${st.logs.length ? st.logs.slice(0, 5).map(({ b, r }) => { const c = clientOf(b); return `<button class="sx-row" data-open="${esc(c ? c.id : "")}"><span class="sx-date">${esc(fmt(r.date))}</span><span class="grow"><b>${esc(r.service || "Service")}</b><small>${esc(c ? c.name : "")} · ${esc(bikeName(b))}</small></span></button>`; }).join("") : `<span class="faint">Nothing logged yet.</span>`}</div></div></section>`; }).join("")
        : `<section class="sx-panel sx-empty">${ic("users")}<b>No employees yet.</b><span>Add someone with their name and email. They get a link and a starting PIN, then pick their own PIN.</span><button class="btn tan" data-addemp>${ic("plus")} Add employee</button></section>`}`, "team");
    bindCommon();
    X.app.querySelectorAll("[data-addemp]").forEach(b => b.onclick = addEmpBox);
    X.app.querySelectorAll(".sx-emp").forEach(card => { const mb = card.querySelector("[data-menu]"), mm = card.querySelector(".sx-menu"); mb.onclick = ev => { ev.stopPropagation(); mm.hidden = !mm.hidden; if (!mm.hidden) setTimeout(() => document.addEventListener("click", () => { mm.hidden = true; }, { once: true }), 0); }; });
    X.app.querySelectorAll("[data-rename]").forEach(b => b.onclick = async () => { const e = S.emps.find(x => x.id === b.dataset.rename), nm = prompt("Name", e.name || ""); if (!nm) return;
      const { data: r } = await X.sb.rpc("shop_rename_employee", { eid: e.id, nm }); if (r === "ok") { e.name = nm.trim(); draw(); } });
    X.app.querySelectorAll("[data-reset]").forEach(b => b.onclick = () => { const e = S.emps.find(x => x.id === b.dataset.reset);
      confirmBox("New link and starting PIN?", `${esc(e.name || e.email)}'s current PIN and any phone they're signed in on stop working. They set up again with the new link.`, "Make new ones", async () => {
        const { data: r, error } = await X.sb.rpc("shop_reset_employee", { eid: e.id }); if (error || !r) return note(err(error), true); e.status = "invited"; inviteBox(e, r); }); });
    X.app.querySelectorAll("[data-rmemp]").forEach(b => b.onclick = () => { const e = S.emps.find(x => x.id === b.dataset.rmemp);
      withPw("Removing an employee", () => confirmBox("Remove " + (e.name || e.email) + "?", "They can't log in any more, on any computer or phone. The work they logged stays on the bikes.", "Remove", async () => {
        const { data: r, error } = await X.sb.rpc("shop_remove_employee", { eid: e.id }); if (error || r !== "ok") return note(err(error), true);
        S.emps = S.emps.filter(x => x.id !== e.id); S.assign = S.assign.filter(a => a.employee_id !== e.id); draw(); note("Removed."); }, true)); });
  }
  function addEmpBox() {
    const m = modal(`<form class="sx-form" id="aeF" novalidate><div class="sx-f2"><label class="sx-f"><b>Name</b><input name="name" maxlength="80"></label><label class="sx-f"><b>Email <span class="faint">(to send the link)</span></b><input name="email" type="email" maxlength="200"></label></div>
      <p class="sx-small">They get a link and a 6-digit starting PIN. The first time in, they type their name and that PIN, then pick their own 6-digit PIN. They don't need a Revora account.</p><p class="sx-err" hidden></p>
      <div class="sx-acts"><button type="button" class="btn" data-close>Cancel</button><button class="btn pri" type="submit">${ic("plus")} Add employee</button></div></form>`, { title: "Add employee" });
    const f = m.querySelector("#aeF"), er = m.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); const nm = f.name.value.trim(), em = f.email.value.trim();
      if (!nm && !em) { er.textContent = "Add their name or email."; er.hidden = false; return; } if (em && !/^\S+@\S+\.\S+$/.test(em)) { er.textContent = "That email doesn't look right."; er.hidden = false; return; }
      const { data: r, error } = await X.sb.rpc("shop_add_employee", { nm, em }); if (error || !r || r.error) { er.textContent = r && r.error === "full" ? "You have 25 employees already." : err(error); er.hidden = false; return; }
      const e = { id: r.id, name: nm, email: em.toLowerCase(), status: "invited", created_at: new Date().toISOString() }; S.emps.push(e); S.emps.sort((a, z) => String(a.name).localeCompare(String(z.name)));
      m.close(); draw(); inviteBox(e, r); };
  }
  function inviteBox(e, r) {
    const link = location.origin + location.pathname + "?emp=" + encodeURIComponent(r.invite), first = String(e.name || "").split(" ")[0] || "there";
    const msg = `Hi ${first}, here's your login for ${S.shop.name} on Revora: ${link}\nYour starting PIN is ${r.pin}. Open the link, type your name and this PIN, then pick your own 6-digit PIN.`;
    const m = modal(`<p class="sx-p">${e.email ? `Revora emails this to <b>${esc(e.email)}</b> now. ` : ""}You can also give it to them yourself. The starting PIN only works until they pick their own.</p>
      <div class="sx-pinshow"><span>Starting PIN</span><b class="mono">${esc(r.pin)}</b></div>
      <div class="sx-linkbox"><input readonly value="${esc(link)}" aria-label="Employee link"><button class="btn sm" data-cl>${ic("copy")} Copy link</button></div>
      <p class="sx-small">On your shop's computers they don't need the link: on the shop login they type their name and the starting PIN.</p>
      <div class="sx-acts">${e.email ? `<a class="btn" href="mailto:${esc(e.email)}?subject=${encodeURIComponent("Your " + S.shop.name + " login")}&body=${encodeURIComponent(msg)}">${ic("mail")} Email it myself</a>` : ""}<button class="btn" data-cm>${ic("copy")} Copy message</button><button class="btn pri" data-close>Done</button></div>`, { title: "Login for " + (e.name || e.email) });
    m.querySelector("[data-cl]").onclick = () => copy(link, "Link copied"); m.querySelector("[data-cm]").onclick = () => copy(msg, "Message copied");
    if (e.email) try { fetch((window.RV_CONFIG && RV_CONFIG.remindersApi || "https://revora-reminders.xavier-j-wilson101.workers.dev") + "/shop-invite", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: e.id }), keepalive: true }).catch(() => {}); } catch (x) {}
  }

  /* ---------- first time: set up the shop ---------- */
  function setupPage() {
    X.app.innerHTML = `<div class="sx sx-setup"><header class="sx-top"><div class="sx-top-in"><a class="sx-brand" href="${esc(X.url({ garage: 1 }))}"><img src="img/revora-icon.svg" alt=""><img class="sx-word" src="img/revora-word-white.svg" alt="Revora"><span class="sx-shopname">Shop</span></a><div class="sx-me"><a class="sx-garage" href="${esc(X.url({ garage: 1 }))}">Your garage</a></div></div></header>
      <main class="sx-main narrow"><div class="sx-pageh"><div><div class="eyebrow">Revora Shop</div><h1>Set up your shop</h1><p>These go on reminder emails, reports, estimates and invoices. Only the shop name is required, and you can change any of it later.</p></div></div>
      <section class="sx-panel"><form class="sx-form" id="suF" novalidate>${detailsForm({}, { email: X.session.user.email })}<p class="sx-err" hidden></p>
        <div class="sx-acts left"><button class="btn tan big" type="submit">Open my shop</button></div></form></section></main></div>`;
    const f = X.app.querySelector("#suF"), er = X.app.querySelector(".sx-err");
    f.onsubmit = async ev => { ev.preventDefault(); const v = readDetails(f); if (!v.name) { er.textContent = "Add the shop's name."; er.hidden = false; return; }
      f.querySelector("[type=submit]").disabled = true;
      try { await saveDetails(v); } catch (error) { f.querySelector("[type=submit]").disabled = false; er.textContent = /does not exist|schema cache/i.test(error.message || "") ? "The shop database isn't set up yet. Run the shop SQL in Supabase first." : err(error); er.hidden = false; return; }
      if (window.rvShopLock) rvShopLock.markOwnerOpen();
      const go = () => { location.href = location.pathname + "?crm"; };
      if (window.rvShopLock && rvShopLock.installFirst) rvShopLock.installFirst(X, { name: v.name, address: v.address, details: v.details }, location.pathname + "?crm", go); else go(); };
  }
  function gatePage(title, text, plans) {
    X.app.innerHTML = `<div class="sx sx-setup"><header class="sx-top"><div class="sx-top-in"><a class="sx-brand" href="${esc(X.url({}))}"><img src="img/revora-icon.svg" alt=""><img class="sx-word" src="img/revora-word-white.svg" alt="Revora"><span class="sx-shopname">Shop</span></a><div class="sx-me"><a class="sx-garage" href="${esc(X.url({}))}">Your garage</a></div></div></header>
      <main class="sx-main narrow"><section class="sx-panel sx-gate"><div class="eyebrow">Revora Shop</div><h1>${esc(title)}</h1><p>${text}</p>
        <ul class="sx-feats"><li>Find any client in a second by name, phone or bike</li><li>Log services at the counter and see what's due next</li><li>Reminder emails go out with your shop's name</li><li>Budgets, upgrades, history reports and bike values</li><li>Clients follow their bike for free, and ask you for reports</li><li>Staff logins for your mechanics</li></ul>
        <div class="sx-acts left">${plans ? `<button class="btn tan big" data-pl>See the Shop plan</button>` : ""}<a class="btn" href="${esc(X.url({}))}">Back to your garage</a></div></section></main></div>`;
    const b = X.app.querySelector("[data-pl]"); if (b) b.onclick = () => X.showPlans();
  }

  /* ---------- open ---------- */
  async function show(ctx) {
    X = ctx; X.app.innerHTML = `<div class="sx"><main class="sx-main"><div class="spinner" style="margin:80px auto"></div></main></div>`;
    const { data: shop, error } = await X.sb.rpc("my_shop");
    if (error) return gatePage("Shop isn't set up yet", /does not exist|schema cache|could not find/i.test(error.message || "") ? "The shop database hasn't been added. Run <b>supabase/shop_crm.sql</b> once in the Supabase SQL editor." : esc(err(error)), false);
    if (!shop) return X.plansOk() ? setupPage() : gatePage("Run your shop on Revora", "Revora Shop is part of the Shop plan.", true);
    if (shop.role === "owner" && window.rvShopLock && !rvShopLock.adminBypass(X) && !rvShopLock.ownerOpen()) return rvShopLock.gate(X, shop, () => location.reload());
    S = { shop, role: shop.role };
    if (!shop.plan_ok) return gatePage(shop.role === "owner" ? "Your Shop plan isn't active" : "This shop's plan isn't active", shop.role === "owner" ? "Renew the Shop plan to get back to your clients. Nothing you've logged is lost." : `Ask ${esc(shop.owner_name || "the shop owner")} to renew the Shop plan. Nothing is lost.`, shop.role === "owner");
    try { await loadAll(); } catch (e) { return gatePage("Couldn't load your shop", esc(err(e)) + " Reload the page to try again.", false); }
    window.onpopstate = () => { if (new URLSearchParams(location.search).has("crm")) draw(); };
    draw();
  }
  window.rvCRM = { show, async mine(sb) { try { const { data } = await sb.rpc("my_shop"); return data || null; } catch (e) { return null; } } };
})();
