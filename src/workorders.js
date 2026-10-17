/* ============ Work orders (Shop plan): check-in, estimate, customer approval by link, invoice, into the service log ============ */
GUIDE.workorders = { eyebrow: "Shop", title: "Work orders", sub: "Check a customer's bike in, write the estimate, get it approved by text, and hand back an invoice.",
  how: ["Add the customer, then start a work order with what they asked for.", "Take check-in photos and add labor and parts. The totals work themselves out.", "Send the estimate for approval by text or email. When it's done, print the invoice and it goes into the bike's service log."] };
const WO_STEPS = ["Checked in", "Waiting for approval", "Approved", "In progress", "Waiting for parts", "Done", "Picked up"];
const WO_ALL = WO_STEPS.concat(["Declined"]);
const SHOP = () => Object.assign({ name: "", address: "", phone: "", email: "", rate: 95, taxPct: 0, taxLabor: false, suppliesPct: 0, terms: "" }, (window.rvPrefs ? rvPrefs.get().shop : lsGet("rv.shop", {})) || {});
const setShop = patch => { const s = Object.assign(SHOP(), patch); if (window.rvPrefs) rvPrefs.set({ shop: s }); else lsSet("rv.shop", s); };
const CUST = () => Object.assign({ name: "", phone: "", email: "" }, meta().customer || {});
const woList = () => sorted("workorders").sort((a, b) => String(b.dateIn || "").localeCompare(String(a.dateIn || "")) || String(b.id).localeCompare(String(a.id)));
const woTot = w => rvWoTotals(w.lines, w.set || SHOP());
const woPill = s => { const c = s === "Done" || s === "Picked up" ? "green" : s === "Declined" ? "red" : s === "Waiting for approval" || s === "Waiting for parts" ? "amber" : s === "Approved" || s === "In progress" ? "blue" : "gray"; return `<span class="pill ${c}">${esc(s)}</span>`; };
const woUrl = id => location.origin + location.pathname + "?wo=" + id;
const m2 = v => "$" + (+v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function woDoc(w, kind) {
  const m = meta(), sh = SHOP(), tx = w.set || sh;
  return { v: 1, made: today(), number: w.id, title: w.title, complaint: w.complaint, bike: m.bike || BIKE.name, vin: m.frameNo || "", odometer: w.odometer || 0, dateIn: w.dateIn, promised: w.promised,
    customer: CUST(), shop: { name: sh.name, address: sh.address, phone: sh.phone, email: sh.email, terms: sh.terms }, set: { taxPct: tx.taxPct, taxLabor: tx.taxLabor, suppliesPct: tx.suppliesPct },
    lines: (w.lines || []).map(l => ({ t: l.t, desc: l.desc, hours: l.hours, rate: l.rate, qty: l.qty, price: l.price, partNo: l.partNo })), totals: woTot(w),
    approval: w.approval && w.approval.name ? { decision: w.approval.decision, name: w.approval.name, at: w.approval.at } : null, invoice: kind === "invoice" ? (w.invoice || { date: today() }) : null };
}
function printHtml(html) {
  let host = $("#bosHost"); if (!host) { host = document.createElement("div"); host.id = "bosHost"; document.body.appendChild(host); }
  host.innerHTML = html; document.body.classList.add("printing-bos"); window.print(); setTimeout(() => { document.body.classList.remove("printing-bos"); host.innerHTML = ""; }, 800);
}
async function saveWo(w, patch, msg) { const r = Object.assign(clone(w), patch); await store.put("workorders", r, { action: msg || "updated work order " + w.id }); return r; }

// approval links: look up any decisions the customer made and bring them into the work order
let WO_LINKS = null;
// opened from the Shop board in the garage: start on that work order instead of the home page
try { const o = sessionStorage.getItem("rv.woOpen"); if (o && SEC.workorders) { sessionStorage.removeItem("rv.woOpen"); R.sec = "workorders"; R.f.workorders = { id: o }; } } catch (e) {}
async function loadWoLinks() {
  if (!window.RV_CLOUD) { WO_LINKS = []; return; }
  const { data, error } = await RV_CLOUD.sb.from("wo_links").select("id,wo_id,decision,decided_name,decided_note,decided_at,views,created_at").eq("project_id", RV_CLOUD.projectId);
  WO_LINKS = error ? [] : data || []; WO_LINKS.err = error ? (/does not exist|schema cache/i.test(error.message || "") ? "setup" : "load") : "";
  for (const l of WO_LINKS) {
    const w = S.workorders[l.wo_id]; if (!w || !l.decision || !ME.canWrite) continue;
    if (w.approval && w.approval.link === l.id && w.approval.name) continue;
    const ok = l.decision === "approved";
    await saveWo(w, { status: ok ? "Approved" : "Declined", approval: { link: l.id, decision: l.decision, name: l.decided_name, note: l.decided_note || "", at: l.decided_at } }, (ok ? "customer approved " : "customer declined ") + w.id);
    toast(`${l.decided_name} ${ok ? "approved" : "declined"} ${w.id}.`);
  }
  if (R.sec === "workorders") render(false);
}

VIEWS.workorders = {
  render() {
    const f = R.f.workorders || {}, W = ME.canWrite, dis = W ? "" : "disabled";
    if (WO_LINKS === null) { WO_LINKS = []; loadWoLinks(); }
    const w = f.id && S.workorders[f.id];
    if (w) return woDetail(w, W, dis);
    const c = CUST(), sh = SHOP(), list = woList(), open = list.filter(x => !["Picked up", "Declined"].includes(x.status));
    return `<div class="ph" data-own="1"><div class="eyebrow">Shop</div><h1>Work orders</h1><p>Check a customer's bike in, write the estimate, get it approved by text, and hand back an invoice.</p>
        <div class="act">${W ? `<button class="btn pri" id="woNew">${ic("plus")} New work order</button>` : ""}</div></div>
      ${WO_LINKS && WO_LINKS.err === "setup" ? `<div class="callout" style="max-width:1100px;margin:0 auto 14px">Approval links need a one-time setup in the database. Everything else works now.</div>` : ""}
      <div class="wo-grid">
        <div class="stack">
          ${list.length ? `<div class="wo-list">${list.map(x => { const t = woTot(x); return `<button class="wo-card" data-wo="${esc(x.id)}"><div class="wo-card-t"><code>${esc(x.id)}</code>${woPill(x.status)}</div>
              <b>${esc(x.title || "Work order")}</b><span class="faint">${esc([x.dateIn ? "In " + fmtDate(x.dateIn) : "", x.promised ? "ready by " + fmtDate(x.promised) : ""].filter(Boolean).join(", "))}</span>
              <div class="wo-card-b"><span>${(x.lines || []).length} line${(x.lines || []).length === 1 ? "" : "s"}</span><b>${m2(t.total)}</b></div></button>`; }).join("")}</div>`
            : `<div class="empty-card"><b>No work orders yet</b><p class="muted">Start one when the customer drops the bike off. It keeps the check-in photos, the estimate, their approval and the invoice together.</p>${W ? `<button class="btn pri" id="woNew2">${ic("plus")} New work order</button>` : ""}</div>`}
        </div>
        <aside class="stack">
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("users")}</span>Customer</h2></div>
            <label class="bp-f"><b>Name</b><input id="cuN" value="${esc(c.name)}" placeholder="Who owns the bike" ${dis}></label>
            <div class="vl-two"><label class="bp-f"><b>Phone</b><input id="cuP" type="tel" value="${esc(c.phone)}" ${dis}></label><label class="bp-f"><b>Email</b><input id="cuE" type="email" value="${esc(c.email)}" ${dis}></label></div>
            ${open.length ? `<p class="faint" style="margin:0;font-size:13px">${open.length} open work order${open.length === 1 ? "" : "s"} on this bike.</p>` : ""}
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("store")}</span>Your shop</h2></div>
            <p class="faint" style="margin:-4px 0 8px;font-size:13px">Shown on every estimate and invoice, on every bike.</p>
            <label class="bp-f"><b>Shop name</b><input data-sh="name" value="${esc(sh.name)}"></label>
            <label class="bp-f"><b>Address</b><input data-sh="address" value="${esc(sh.address)}"></label>
            <div class="vl-two"><label class="bp-f"><b>Phone</b><input data-sh="phone" value="${esc(sh.phone)}"></label><label class="bp-f"><b>Email</b><input data-sh="email" value="${esc(sh.email)}"></label></div>
            <div class="vl-two"><label class="bp-f"><b>Labor rate ($/hr)</b><input data-sh="rate" type="number" min="0" step="1" value="${esc(sh.rate)}"></label><label class="bp-f"><b>Sales tax %</b><input data-sh="taxPct" type="number" min="0" step="0.01" value="${esc(sh.taxPct)}"></label></div>
            <div class="vl-two"><label class="bp-f"><b>Shop supplies %</b><input data-sh="suppliesPct" type="number" min="0" step="0.5" value="${esc(sh.suppliesPct)}"><small class="faint">Of labor</small></label><label class="rp-opt" style="border:0"><input type="checkbox" data-sh-b="taxLabor" ${sh.taxLabor ? "checked" : ""}><span><b>Tax labor too</b><small>Some states tax it</small></span></label></div>
            <label class="bp-f"><b>Fine print</b><textarea data-sh="terms" rows="2" placeholder="e.g. Storage is $10 a day after 3 days of being ready.">${esc(sh.terms)}</textarea></label>
          </section>
        </aside>
      </div>`;
  },
  bind(root) {
    const f = R.f.workorders || {}, w = f.id && S.workorders[f.id];
    if (w) return woBind(root, w);
    const nw = () => { const sh = SHOP(), od = odoNow(); const r = blank("workorders", { title: "", status: "Checked in", dateIn: today(), odometer: od ? Math.round(od.miles) : 0 });
      r.lines = [{ t: "labor", desc: "", hours: 1, rate: +sh.rate || 0 }]; r.set = { taxPct: sh.taxPct, taxLabor: sh.taxLabor, suppliesPct: sh.suppliesPct };
      store.put("workorders", r, { action: "started work order " + r.id }).then(() => go("workorders", { id: r.id })); };
    [$("#woNew", root), $("#woNew2", root)].forEach(b => b && (b.onclick = nw));
    $$("[data-wo]", root).forEach(b => b.onclick = () => go("workorders", { id: b.dataset.wo }));
    const cu = async (k, v) => { const mm = clone(meta()); mm.customer = Object.assign(CUST(), { [k]: v.trim() }); await store.put("meta", mm, { noLog: true }); };
    [["#cuN", "name"], ["#cuP", "phone"], ["#cuE", "email"]].forEach(([id, k]) => { const el = $(id, root); if (el) el.onchange = () => cu(k, el.value); });
    $$("[data-sh]", root).forEach(el => el.onchange = () => { const k = el.dataset.sh; setShop({ [k]: el.type === "number" ? Math.max(0, +el.value || 0) : el.value.trim() }); toast("Shop details saved."); });
    $$("[data-sh-b]", root).forEach(el => el.onchange = () => setShop({ [el.dataset.shB]: el.checked }));
  }
};

function woDetail(w, W, dis) {
  const t = woTot(w), c = CUST(), photos = sorted("docs").filter(d => d.woId === w.id && d.file && /^data:image/.test(d.file));
  const link = (WO_LINKS || []).filter(l => l.wo_id === w.id).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
  const ap = w.approval || {}, stepI = WO_STEPS.indexOf(w.status);
  const line = (l, i) => l.t === "labor"
    ? `<div class="wo-line"><span class="wo-lt">Labor</span><input data-ln="${i}" data-k="desc" value="${esc(l.desc)}" placeholder="What the job is" ${dis}><label><input data-ln="${i}" data-k="hours" type="number" min="0" step="0.1" value="${esc(l.hours)}" ${dis}><small>hrs</small></label><label><input data-ln="${i}" data-k="rate" type="number" min="0" step="1" value="${esc(l.rate)}" ${dis}><small>$/hr</small></label><b>${m2((+l.hours || 0) * (+l.rate || 0))}</b>${W ? `<button class="linkbtn" data-lndel="${i}" aria-label="Remove line">×</button>` : ""}</div>`
    : `<div class="wo-line"><span class="wo-lt p">Part</span><input data-ln="${i}" data-k="desc" value="${esc(l.desc)}" placeholder="Part" ${dis}><input class="wo-pn" data-ln="${i}" data-k="partNo" value="${esc(l.partNo || "")}" placeholder="Part #" ${dis}><label><input data-ln="${i}" data-k="qty" type="number" min="0" step="1" value="${esc(l.qty)}" ${dis}><small>qty</small></label><label><input data-ln="${i}" data-k="price" type="number" min="0" step="0.01" value="${esc(l.price)}" ${dis}><small>each</small></label><b>${m2((+l.qty || 0) * (+l.price || 0))}</b>${W ? `<button class="linkbtn" data-lndel="${i}" aria-label="Remove line">×</button>` : ""}</div>`;
  const msg = link ? `Hi${c.name ? " " + c.name.split(" ")[0] : ""}, it's ${SHOP().name || "the shop"}. The estimate for your ${meta().bike || BIKE.name} is ${m2(t.total)}. You can see it and approve it here: ${woUrl(link.id)}` : "";
  return `<div class="ph" data-own="1"><div class="eyebrow"><button class="linkbtn" data-wo-back>← All work orders</button></div><h1>${esc(w.title || "Work order")} <code class="wo-id">${esc(w.id)}</code></h1><p>${woPill(w.status)} ${c.name ? "for " + esc(c.name) : ""}</p></div>
    <ol class="wo-steps">${WO_STEPS.map((s, i) => `<li class="${w.status === "Declined" ? "" : i < stepI ? "done" : i === stepI ? "on" : ""}"><button data-wost="${esc(s)}" ${dis}>${esc(s)}</button></li>`).join("")}</ol>
    <div class="wo-grid">
      <div class="stack">
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("book")}</span>What the customer asked for</h2></div>
          <label class="bp-f"><b>Job</b><input id="woT" value="${esc(w.title)}" placeholder="e.g. 12k service and new rear tire" ${dis}></label>
          <label class="bp-f"><b>In their words</b><textarea id="woC" rows="3" placeholder="What they said is wrong or what they want done" ${dis}>${esc(w.complaint)}</textarea></label>
          <div class="vl-two"><label class="bp-f"><b>Checked in</b><input id="woIn" type="date" value="${esc(w.dateIn)}" ${dis}></label><label class="bp-f"><b>Ready by</b><input id="woPr" type="date" value="${esc(w.promised)}" ${dis}></label></div>
          <label class="bp-f"><b>Odometer at check-in</b><input id="woO" type="number" min="0" value="${esc(w.odometer || "")}" ${dis}></label>
        </section>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("camera")}</span>Check-in photos</h2>${W ? `<button class="btn sm" id="woPh">${ic("plus")} Add photos</button>` : ""}</div>
          ${photos.length ? `<div class="wo-ph">${photos.map(d => `<img src="${d.file}" alt="${esc(d.title)}" data-open="docs|${esc(d.id)}">`).join("")}</div>` : `<p class="muted" style="margin:0 0 8px">Photos of scratches, dents and anything already broken, so there's no argument at pickup.</p>`}
          <label class="bp-f"><b>Condition at check-in</b><textarea id="woCo" rows="2" placeholder="e.g. Scratch on left tank, cracked right mirror, low on fuel" ${dis}>${esc(w.conditionIn || "")}</textarea></label>
        </section>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("wrench")}</span>Labor and parts</h2>${W ? `<div class="row" style="gap:6px"><button class="btn sm" data-add="labor">${ic("plus")} Labor</button><button class="btn sm" data-add="part">${ic("plus")} Part</button></div>` : ""}</div>
          <div class="wo-lines">${(w.lines || []).map(line).join("") || `<p class="muted" style="margin:0">Add the labor and parts for the job.</p>`}</div>
          <div class="wo-tsum"><span>Labor ${m2(t.labor)}</span><span>Parts ${m2(t.parts)}</span>${t.supplies ? `<span>Supplies ${m2(t.supplies)}</span>` : ""}${t.tax ? `<span>Tax ${m2(t.tax)}</span>` : ""}<b>Total ${m2(t.total)}</b></div>
        </section>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("book")}</span>Shop notes</h2></div><textarea id="woN" rows="3" class="wo-notes" placeholder="Only your team sees these." ${dis}>${esc(w.notes || "")}</textarea></section>
      </div>
      <aside class="stack">
        <section class="mh-panel wo-appr-p"><div class="mh-ph"><h2><span class="mh-hi">${ic("send")}</span>Customer approval</h2></div>
          ${ap.name ? `<div class="wo-ok ${ap.decision === "declined" ? "no" : ""}"><b>${ap.decision === "declined" ? "Declined" : "Approved"} by ${esc(ap.name)}</b><span>${esc(ap.at ? new Date(ap.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "")}</span>${ap.note ? `<p>"${esc(ap.note)}"</p>` : ""}</div>` : ""}
          ${link && !link.decision ? `<p class="muted" style="margin:0 0 8px">Sent. ${n(link.views) ? `They've opened it ${n(link.views)} time${n(link.views) === 1 ? "" : "s"}.` : "Not opened yet."} <button class="linkbtn" id="woChk">Check for an answer</button></p>
            <div class="wo-send">${c.phone ? `<a class="btn sm" href="sms:${esc(c.phone.replace(/[^\d+]/g, ""))}?&body=${encodeURIComponent(msg)}">Text it</a>` : ""}${c.email ? `<a class="btn sm" href="mailto:${esc(c.email)}?subject=${encodeURIComponent("Estimate for your " + (meta().bike || BIKE.name))}&body=${encodeURIComponent(msg)}">Email it</a>` : ""}<button class="btn sm" id="woCopy">${ic("copy")} Copy link</button></div>` : ""}
          ${W && window.RV_CLOUD ? `<button class="btn ${link && !link.decision ? "" : "pri"}" id="woSend" style="margin-top:8px">${link ? (link.decision ? "Send a new estimate" : "Update the estimate") : "Send estimate for approval"}</button>` : !window.RV_CLOUD ? `<p class="muted" style="margin:0">Approval links need an account.</p>` : ""}
          <p class="faint" style="font-size:12.5px;margin:8px 0 0">They open the link on their phone, see every line and total, and tap Approve or Decline. No account needed.</p>
        </section>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("download")}</span>Paperwork</h2></div>
          <div class="wo-send"><button class="btn sm" id="woPE">Print estimate</button><button class="btn sm" id="woPI">Print invoice</button></div>
          <div class="wo-paid">${w.invoice && w.invoice.paid ? `<span class="pill green">Paid ${esc(fmtDate(w.invoice.paidDate))}${w.invoice.method ? " · " + esc(w.invoice.method) : ""}</span>${W ? ` <button class="linkbtn" id="woUnpaid">Undo</button>` : ""}`
            : W ? `<select id="woMeth" aria-label="How they paid">${["Card", "Cash", "Check", "Other"].map(x => `<option>${x}</option>`).join("")}</select><button class="btn sm tan" id="woPay">Mark paid</button>` : ""}</div>
        </section>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("wrench")}</span>Service log</h2></div>
          ${w.maintId && S.maintenance[w.maintId] ? `<p class="muted" style="margin:0">In the bike's service log as <button class="linkbtn" data-open="maintenance|${esc(w.maintId)}">${esc(w.maintId)}</button>, so it shows on the history report.</p>`
            : `<p class="muted" style="margin:0">When you mark it Done, the job goes into the bike's service log and history report.</p>`}
        </section>
        ${W ? `<button class="linkbtn wo-del" id="woDel">Delete this work order</button>` : ""}
      </aside>
    </div>`;
}

function woBind(root, w) {
  const cur = () => S.workorders[w.id];
  $("[data-wo-back]", root).onclick = () => go("workorders", {});
  const put = (patch, msg) => saveWo(cur(), patch, msg);
  [["#woT", "title"], ["#woC", "complaint"], ["#woIn", "dateIn"], ["#woPr", "promised"], ["#woCo", "conditionIn"], ["#woN", "notes"]].forEach(([id, k]) => { const el = $(id, root); if (el) el.onchange = () => put({ [k]: el.value.trim() }); });
  const od = $("#woO", root); if (od) od.onchange = () => put({ odometer: Math.max(0, +od.value || 0) });
  $$("[data-ln]", root).forEach(el => el.onchange = () => { const L = clone(cur().lines || []), i = +el.dataset.ln, k = el.dataset.k; L[i][k] = el.type === "number" ? Math.max(0, +el.value || 0) : el.value.trim(); put({ lines: L }); });
  $$("[data-lndel]", root).forEach(b => b.onclick = () => { const L = clone(cur().lines || []); L.splice(+b.dataset.lndel, 1); put({ lines: L }); });
  $$("[data-add]", root).forEach(b => b.onclick = () => { const L = clone(cur().lines || []); L.push(b.dataset.add === "labor" ? { t: "labor", desc: "", hours: 1, rate: +SHOP().rate || 0 } : { t: "part", desc: "", partNo: "", qty: 1, price: 0 }); put({ lines: L }).then(() => { const ins = $$("[data-k=desc]"); ins[ins.length - 1]?.focus(); }); });
  const ph = $("#woPh", root); if (ph) ph.onclick = () => uploadPhotos({ kind: "Before photo", woId: w.id, title: "Check-in " + w.id });
  $$("[data-wost]", root).forEach(b => b.onclick = async () => {
    const s = b.dataset.wost, x = cur(); if (s === x.status) return;
    let patch = { status: s };
    if ((s === "Done" || s === "Picked up") && !(x.maintId && S.maintenance[x.maintId])) {
      const t = woTot(x), sh = SHOP(), parts = (x.lines || []).filter(l => l.t !== "labor" && l.desc);
      const rec = blank("maintenance", { date: today(), odometer: x.odometer || 0, service: x.title || "Shop work " + x.id, kind: "Repair", doneBy: "A shop", shop: sh.name || "Shop", cost: t.total,
        partsUsed: parts.map(l => [l.partNo, l.desc, l.qty > 1 ? l.qty : ""].filter(Boolean).join(", ")).join("\n"), notes: [x.complaint, "Work order " + x.id].filter(Boolean).join("\n") });
      try { await store.put("maintenance", rec, { action: "logged shop work from " + x.id }); patch.maintId = rec.id; toast("Added to the bike's service log."); } catch (e) {}
    }
    await put(patch, "moved " + x.id + " to " + s);
  });
  const send = $("#woSend", root);
  if (send) send.onclick = async () => {
    const x = cur(), sb = RV_CLOUD.sb, data = woDoc(x, "estimate"); data.approval = null;
    if (!(x.lines || []).length) return toast("Add the labor and parts first.", "err");
    const link = (WO_LINKS || []).filter(l => l.wo_id === x.id).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
    send.disabled = true; let error, id;
    if (link && !link.decision) { id = link.id; ({ error } = await sb.from("wo_links").update({ data, updated_at: new Date().toISOString() }).eq("id", id)); }
    else { id = repToken(); ({ error } = await sb.from("wo_links").insert({ id, project_id: RV_CLOUD.projectId, wo_id: x.id, data })); }
    send.disabled = false;
    if (error) return toast(/does not exist|schema cache/i.test(error.message || "") ? "Approval links aren't set up in the database yet." : "Couldn't make the link. Check your internet and try again.", "err");
    await put({ status: "Waiting for approval", approval: null }, "sent " + x.id + " for approval");
    try { await navigator.clipboard.writeText(woUrl(id)); } catch (e) {}
    toast(link && !link.decision ? "Estimate updated. The same link shows the new total." : "Link made and copied. Text or email it to the customer.");
    loadWoLinks();
  };
  const chk = $("#woChk", root); if (chk) chk.onclick = () => { toast("Checking…"); loadWoLinks(); };
  const cp = $("#woCopy", root); if (cp) cp.onclick = async () => { const l = (WO_LINKS || []).find(l2 => l2.wo_id === w.id && !l2.decision); if (!l) return; try { await navigator.clipboard.writeText(woUrl(l.id)); toast("Link copied."); } catch (e) { prompt("Copy this link:", woUrl(l.id)); } };
  $("#woPE", root).onclick = () => printHtml(rvWoHtml(woDoc(cur(), "estimate"), { kind: "estimate" }));
  $("#woPI", root).onclick = async () => { let x = cur(); if (!x.invoice && ME.canWrite) x = await put({ invoice: { date: today(), paid: false } }); printHtml(rvWoHtml(woDoc(x, "invoice"), { kind: "invoice" })); };
  const pay = $("#woPay", root); if (pay) pay.onclick = () => put({ invoice: Object.assign({ date: today() }, cur().invoice || {}, { paid: true, paidDate: today(), method: $("#woMeth", root).value }) }, "marked " + w.id + " paid");
  const up = $("#woUnpaid", root); if (up) up.onclick = () => put({ invoice: Object.assign({}, cur().invoice, { paid: false, paidDate: "", method: "" }) });
  const del = $("#woDel", root); if (del) del.onclick = () => confirmBox("Delete " + w.id + "?", "<p style='margin:0'>The work order goes in the archive. Anything already in the service log stays there.</p>", "Delete", async () => { await saveWo(cur(), { archived: true }, "deleted " + w.id); go("workorders", {}); });
}
