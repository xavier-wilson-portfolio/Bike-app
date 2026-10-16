/* ============ Papers & renewals: insurance, registration, inspection, title, warranties, with reminders before they run out ============ */
GUIDE.papers = { eyebrow: "Records", title: "Papers & renewals", sub: "Insurance, registration, inspection, title and warranties in one place, with a heads-up before anything runs out.",
  how: ["Add each paper with its renewal date and cost. Take a photo of the card or document so it's always on your phone.", "Revora warns you on the home page before anything expires, and Add to my calendar on the Reminders page includes renewals.", "When you renew, press Renewed. It moves the date forward and keeps the cost history."] };
const PAPER_ICON = { Insurance: "shield", Registration: "tag", Inspection: "check", Title: "book", License: "users", Warranty: "star", "Roadside assistance": "wrench", Loan: "dollar", Storage: "box", Other: "image" };
const PAPER_QUICK = [["Insurance", "Insurance policy"], ["Registration", "Registration"], ["Inspection", "Safety inspection"], ["Title", "Title"], ["Warranty", "Warranty"]];
function paperState(p) {
  if (!p.expires) return { k: "none", days: null, label: p.kind === "Title" ? "Kept on file" : "No end date" };
  const d = daysBetween(today(), p.expires), warn = n(p.remindDays) || 30;
  return d < 0 ? { k: "over", days: d, label: "Expired " + (-d === 1 ? "yesterday" : -d + " days ago") } : d <= warn ? { k: "soon", days: d, label: d === 0 ? "Expires today" : "Expires in " + d + " day" + (d === 1 ? "" : "s") } : { k: "ok", days: d, label: "Good until " + fmtDate(p.expires) };
}
const papersDue = () => sorted("papers").filter(p => !p.archived && ["over", "soon"].includes(paperState(p).k) && !p.autoRenew).sort((a, b) => String(a.expires).localeCompare(String(b.expires)));
function paperBannerHtml() {
  const due = papersDue(); if (!due.length) return "";
  const over = due.filter(p => paperState(p).k === "over");
  return `<button class="rcl-banner pap${over.length ? " park" : ""}" data-go="papers">${ic("calendar")}<span><b>${over.length ? over.length + " paper" + (over.length === 1 ? " has" : "s have") + " expired" : due.length + " renewal" + (due.length === 1 ? "" : "s") + " coming up"}</b><small>${due.slice(0, 3).map(p => esc(p.name) + ": " + esc(paperState(p).label.toLowerCase())).join(" · ")}</small></span>${ic("next")}</button>`;
}
(function () { const h = VIEWS.home; if (!h) return; const r0 = h.render; h.render = function () { return paperBannerHtml() + r0.call(this); }; })();
// renewals go into the calendar file from the Reminders page
(function () {
  if (typeof remindersIcs !== "function") return; const base = remindersIcs;
  remindersIcs = function () {
    const ics = base(), stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""), e2 = s => String(s || "").replace(/[\\,;]/g, m => "\\" + m).replace(/\n/g, "\\n");
    const ev = sorted("papers").filter(p => p.expires && p.expires >= today() && !p.autoRenew).map(p => { const d = p.expires.replace(/-/g, ""), d2 = addDays(p.expires, 1).replace(/-/g, "");
      return ["BEGIN:VEVENT", `UID:${p.id}-${d}@revora`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d2}`, `SUMMARY:${e2(BIKE.short + ": " + p.name + " expires")}`,
        `DESCRIPTION:${e2(`${p.kind} for your ${BIKE.name}${p.provider ? " with " + p.provider : ""}. Renew it before this date.`)}`, "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${e2(p.name + " expires soon")}`, `TRIGGER:-P${Math.max(1, n(p.remindDays) || 30)}D`, "END:VALARM", "END:VEVENT"].join("\r\n"); });
    return ev.length ? ics.replace("END:VCALENDAR", ev.join("\r\n") + "\r\nEND:VCALENDAR") : ics;
  };
})();
function paperPhoto(p) {
  const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*,application/pdf";
  inp.onchange = async () => { const f = inp.files && inp.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) { toast("Use a photo of the document. For a PDF, add it under Photos & files as a link.", "err"); return; }
    let data; try { data = await compressImage(f, 320000); } catch (e) { toast("Couldn't read that photo.", "err"); return; }
    const d = blank("docs", { title: p.name + " (" + p.kind.toLowerCase() + ")", kind: "Supplier document", date: today(), file: data, fileName: f.name, folder: "Papers", tags: "papers " + p.kind.toLowerCase() });
    await store.put("docs", d, { action: "added a photo of " + p.name }); const q = clone(S.papers[p.id]); q.docId = d.id; await store.put("papers", q, { noLog: true }); toast("Photo saved with " + p.name + ".");
  };
  inp.click();
}
function paperRenew(p) {
  const term = p.start && p.expires ? Math.max(1, Math.round(daysBetween(p.start, p.expires) / 30.4)) : 12, from = p.expires && p.expires > today() ? p.expires : today();
  modal(`<h3>Renew ${esc(p.name)}</h3><p class="hint-text" style="margin:0 0 10px">The new term starts when the old one ends.</p>
    <div class="form"><label>New start<input type="date" id="pnS" value="${esc(from)}"></label><label>New end<input type="date" id="pnE" value="${esc(addMonths(from, term))}"></label>
      <label>Cost for the new term<input type="number" id="pnC" min="0" step="0.01" value="${n(p.cost) || ""}"></label><label>Policy or number (if it changed)<input id="pnN" value="${esc(p.number || "")}"></label></div>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>Save renewal</button></div>`, m => {
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelector("[data-ok]").onclick = async () => {
      const q = clone(S.papers[p.id]); q.history = (q.history || []).concat([{ start: q.start, expires: q.expires, cost: n(q.cost), number: q.number }]).slice(-20);
      Object.assign(q, { start: m.querySelector("#pnS").value, expires: m.querySelector("#pnE").value, cost: n(m.querySelector("#pnC").value), number: m.querySelector("#pnN").value.trim() });
      if (!q.expires) { toast("Add the new end date.", "err"); return; }
      closeModal(); await store.put("papers", q, { action: "renewed " + q.name }); toast(q.name + " renewed until " + fmtDate(q.expires) + ".");
    };
  });
}
VIEWS.papers = {
  render() {
    const W = ME.canWrite, all = sorted("papers").filter(p => !p.archived), due = all.filter(p => ["over", "soon"].includes(paperState(p).k));
    const rest = all.filter(p => !due.includes(p)).sort((a, b) => String(a.expires || "9999").localeCompare(String(b.expires || "9999")));
    const yearCost = all.reduce((s, p) => s + (p.billing === "Monthly" ? n(p.cost) * 12 : p.billing === "One time" ? 0 : p.start && p.expires ? n(p.cost) * 365 / Math.max(30, daysBetween(p.start, p.expires)) : n(p.cost)), 0);
    const next = all.filter(p => p.expires && p.expires >= today()).sort((a, b) => a.expires.localeCompare(b.expires))[0];
    const card = p => { const st = paperState(p), doc = p.docId && S.docs[p.docId], pct = st.days == null ? 0 : Math.max(0, Math.min(1, st.days / Math.max(30, p.start && p.expires ? daysBetween(p.start, p.expires) : 365)));
      return `<article class="pp-card ${st.k}"><span class="pp-ico">${ic(PAPER_ICON[p.kind] || "image")}</span>
        <div class="pp-main"><div class="md-top"><button class="linkbtn md-name" data-open="papers|${esc(p.id)}">${esc(p.name)}</button><span class="tag">${esc(p.kind)}</span>${p.autoRenew ? `<span class="tag">Renews itself</span>` : ""}</div>
          <div class="md-meta">${[p.provider ? `<span>${esc(p.provider)}</span>` : "", p.number ? `<span><code>${esc(p.number)}</code></span>` : "", n(p.cost) ? `<span>${money2(p.cost)}${p.billing === "Monthly" ? " a month" : p.billing === "One time" ? "" : " a term"}</span>` : ""].filter(Boolean).join("")}</div>
          <div class="pp-st"><span class="pp-pill ${st.k}">${esc(st.label)}</span>${p.expires && st.k !== "over" ? `<span class="pp-bar"><i style="width:${(pct * 100).toFixed(0)}%"></i></span>` : ""}</div>
          ${(p.history || []).length ? `<div class="faint" style="font-size:12.5px">${p.history.length} earlier term${p.history.length === 1 ? "" : "s"} on file</div>` : ""}</div>
        <div class="pp-side">${doc && doc.file ? `<button class="pp-thumb" data-pp-doc="${esc(doc.id)}" aria-label="See the photo of ${esc(p.name)}"><img src="${doc.file}" alt=""></button>` : W ? `<button class="btn sm" data-pp-photo="${esc(p.id)}">${ic("camera")} Add photo</button>` : ""}
          ${W && p.expires ? `<button class="btn sm ${st.k === "ok" ? "" : "pri"}" data-pp-renew="${esc(p.id)}">Renewed</button>` : ""}</div></article>`; };
    return `<div class="ph" data-own="1"><div class="eyebrow">Records</div><h1>Papers & renewals</h1><p>Insurance, registration, inspection, title and warranties, with a heads-up before anything runs out.</p>
        <div class="act">${W ? `<button class="btn pri" data-new="papers">${ic("plus")} Add a paper</button>` : ""}</div></div>
      <div class="mh-stats md-stats">
        <div class="mh-stat ${due.length ? (due.some(p => paperState(p).k === "over") ? "c-red" : "c-amber") : "c-green"}"><span class="mh-k">${ic("bell")}Needs attention</span><span class="mh-v">${due.length}</span><span class="mh-s">${due.length ? "expired or expiring soon" : "Nothing due"}</span></div>
        <div class="mh-stat c-navy"><span class="mh-k">${ic("calendar")}Next renewal</span><span class="mh-v rcl-sm">${next ? esc(fmtDate(next.expires)) : "—"}</span><span class="mh-s">${next ? esc(next.name) : "Add renewal dates"}</span></div>
        <div class="mh-stat c-tan"><span class="mh-k">${ic("dollar")}A year in papers</span><span class="mh-v">${money(yearCost)}</span><span class="mh-s">insurance, registration and the rest</span></div>
        <div class="mh-stat c-blue"><span class="mh-k">${ic("image")}On file</span><span class="mh-v">${all.length}</span><span class="mh-s">${all.filter(p => p.docId).length} with a photo</span></div>
      </div>
      ${all.length ? `${due.length ? `<h2 class="sec">Needs attention</h2><div class="pp-list">${due.map(card).join("")}</div>` : ""}${rest.length ? `<h2 class="sec">${due.length ? "Everything else" : "Your papers"}</h2><div class="pp-list">${rest.map(card).join("")}</div>` : ""}`
        : `<div class="md-empty"><b>No papers yet</b><span class="muted">Start with insurance and registration. Add the renewal date and Revora tells you before they run out.</span>${W ? `<div class="md-ideas">${PAPER_QUICK.map(([k, nm], i) => `<button class="chip" data-pp-quick="${i}">${ic("plus")} ${esc(nm)}</button>`).join("")}</div>` : ""}</div>`}
      ${all.length && W ? `<div class="md-ideas" style="margin-top:14px">${PAPER_QUICK.filter(([k]) => !all.some(p => p.kind === k)).map(([k, nm]) => `<button class="chip" data-pp-quick="${PAPER_QUICK.findIndex(q => q[0] === k)}">${ic("plus")} ${esc(nm)}</button>`).join("")}</div>` : ""}`;
  },
  bind(root) {
    bindTables(root);
    $$("[data-pp-quick]", root).forEach(b => b.onclick = () => { const [k, nm] = PAPER_QUICK[+b.dataset.ppQuick]; openRecord("papers", null, { kind: k, name: nm, start: today(), expires: k === "Title" ? "" : addMonths(today(), k === "Inspection" ? 12 : k === "Warranty" ? 24 : 12) }); });
    $$("[data-pp-photo]", root).forEach(b => b.onclick = () => paperPhoto(S.papers[b.dataset.ppPhoto]));
    $$("[data-pp-renew]", root).forEach(b => b.onclick = () => paperRenew(S.papers[b.dataset.ppRenew]));
    $$("[data-pp-doc]", root).forEach(b => b.onclick = () => { const d = S.docs[b.dataset.ppDoc]; modal(`<div class="pp-view"><img src="${d.file}" alt="${esc(d.title)}"></div><div class="row" style="justify-content:flex-end;gap:8px;margin-top:10px"><button class="btn" data-ed>Details</button><button class="btn pri" data-x>Done</button></div>`, m => { m.querySelector("[data-x]").onclick = closeModal; m.querySelector("[data-ed]").onclick = () => { closeModal(); openRecord("docs", d.id); }; }); });
    $$("[data-open]", root).forEach(b => { if (!b.onclick) b.onclick = () => { const [c, id] = b.dataset.open.split("|"); openRecord(c, id); }; });
  }
};
