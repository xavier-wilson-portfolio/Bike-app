/* ============ Snap a receipt: photo -> AI reads it -> you check it -> saved as a service, mod or expense with the photo ============ */
GUIDE.receipts = { eyebrow: "Records", title: "Receipts", sub: "Every receipt for the bike, photographed and filed with the work it paid for.",
  how: ["Press Snap a receipt and take a photo, or pick one you already have.", "The AI reads the store, date, items and total. Check every number before you save.", "Save it as a service, a mod or parts. The photo is kept with that record and shows up in the history report."] };

const RCPT_FOR = [["service", "Service or repair", "wrench", "Logs it in the Maintenance log"], ["mod", "Mod or upgrade", "tune", "Adds it to Mods & upgrades"], ["parts", "Parts or supplies", "box", "Adds it to Money as an expense"], ["keep", "Just keep it", "image", "Files the photo, nothing else"]];
const RCPT_PROMPT = `Read this receipt or invoice photo for a motorcycle owner. Reply with JSON only, no other words, in exactly this shape:
{"vendor":"store or shop name","date":"YYYY-MM-DD","items":[{"description":"what it is","partNumber":"","qty":1,"price":0}],"labor":0,"tax":0,"total":0,"kind":"service"}
Rules:
- Copy names and numbers exactly as printed. price is the line total for that item.
- partNumber is a part number or SKU printed on the receipt. Leave it empty if there isn't one. Never make one up.
- labor is any shop labor charge, 0 if none. tax is the sales tax, 0 if none. total is the amount paid.
- If you can't read something, leave it empty or 0.
- kind is "service" for a repair, oil change or maintenance parts like oil, filters, brake pads, tires, chains or batteries; "mod" for an aftermarket upgrade like an exhaust, lights, grips, luggage or protection; "parts" for other parts or supplies; "other" if it isn't for a vehicle.`;

const rcNum = v => { const x = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, "")); return isFinite(x) ? Math.round(x * 100) / 100 : 0; };
function rcDate(v) {
  const s = String(v || "").trim(); let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/);
  if (m) { const y = m[3].length === 2 ? "20" + m[3] : m[3]; return `${y}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`; }
  return "";
}
function rcParse(t) {
  if (t && typeof t === "object") return t;
  t = String(t || ""); const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { try { return JSON.parse(t.slice(a, b + 1).replace(/,\s*([}\]])/g, "$1")); } catch (e2) { return null; } }
}
function rcClean(j) {
  if (!j) return null;
  const items = (Array.isArray(j.items) ? j.items : []).slice(0, 30).map(x => ({ description: String(x && (x.description || x.name) || "").slice(0, 120).trim(), partNumber: String(x && (x.partNumber || x.sku) || "").slice(0, 40).trim(), qty: rcNum(x && x.qty) || 1, price: rcNum(x && (x.price || x.total)) })).filter(x => x.description || x.price);
  const out = { vendor: String(j.vendor || "").slice(0, 80).trim(), date: rcDate(j.date), items, labor: rcNum(j.labor), tax: rcNum(j.tax), total: rcNum(j.total), kind: ["service", "mod", "parts", "other"].includes(j.kind) ? j.kind : "" };
  if (!out.total) out.total = Math.round((items.reduce((s, x) => s + x.price, 0) + out.labor + out.tax) * 100) / 100;
  return out;
}
async function rcAI(dataUrl) {
  if (typeof CHAT_API === "undefined" || !CHAT_API) throw new Error("the photo AI isn't set up on this site yet");
  let res; try { res = await fetch(CHAT_API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scan: { image: dataUrl, prompt: RCPT_PROMPT, kind: "receipt" } }) }); }
  catch (e) { throw new Error("couldn't reach the photo AI. Check your internet"); }
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(res.status === 429 ? "the free AI is busy or out of today's allowance" : res.status === 413 ? "the photo is too large" : "the photo AI had a problem");
  const r = rcClean(rcParse(j.text));
  if (!r || (!r.vendor && !r.items.length && !r.total)) throw new Error("it couldn't make out the receipt");
  return r;
}

/* ---- 1. take or pick the photo ---- */
function snapReceipt(preset) {
  if (typeof gate === "function" && !gate("restorer", "receipts", "Snap a receipt")) return;
  if (!ME.canWrite) { toast("You have view-only access to this project.", "err"); return; }
  const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.setAttribute("capture", "environment");
  inp.onchange = () => { const f = inp.files && inp.files[0]; if (f) rcFlow(f, preset); };
  inp.click();
}
async function rcFlow(file, preset) {
  let photo; try { photo = await compressImage(file, 340000); } catch (e) { toast("Couldn't open that photo.", "err"); return; }
  let cancelled = false;
  modal(`<div class="rc-load"><img src="${photo}" alt="Your receipt"><div><b>Reading the receipt…</b><span class="muted">The AI is picking out the store, date, items and total. This takes a few seconds.</span><div class="rc-spin" aria-hidden="true"></div>
    <button class="btn sm" data-type-it>Skip, I'll type it in</button></div></div>`, m => { m.querySelector("[data-type-it]").onclick = () => { cancelled = true; rcReview(photo, file.name, null, "", preset); }; });
  let parsed = null, err = "";
  try { parsed = await rcAI(photo); } catch (e) { err = e.message || "it couldn't read the receipt"; }
  if (!cancelled) rcReview(photo, file.name, parsed, err, preset);
}

/* ---- 2. check what it read, pick what it's for ---- */
function rcSchedMatch(text) {
  const stop = new Set(["check", "replace", "clean", "lube", "adjust", "inspect", "and", "with", "only", "liquid", "cooled", "change", "service"]);
  const t = text.toLowerCase();
  return sorted("schedule").filter(it => it.name.toLowerCase().split(/[^a-z]+/).filter(w => w.length >= 4 && !stop.has(w)).some(w => t.includes(w.replace(/s$/, "")))).map(it => it.id);
}
function rcReview(photo, fileName, r, err, preset) {
  const d = r || { vendor: "", date: today(), items: [], labor: 0, tax: 0, total: 0, kind: "" };
  if (!d.items.length) d.items.push({ description: "", partNumber: "", qty: 1, price: 0 });
  let forK = preset || (d.kind === "mod" ? "mod" : d.kind === "parts" ? "parts" : d.kind === "other" ? "keep" : "service");
  if (GENERIC && forK === "parts") forK = "parts";
  const od = odoNow(), txt = d.items.map(x => x.description).join(" ");
  const sched = rcSchedMatch(txt), cats = meta().expenseCategories || [];
  const itemRow = (x, i) => `<div class="rc-item" data-i="${i}"><input data-f="description" value="${esc(x.description)}" placeholder="Item" aria-label="Item ${i + 1}"><input data-f="partNumber" value="${esc(x.partNumber)}" placeholder="Part #" aria-label="Part number ${i + 1}" class="mono"><input data-f="qty" type="number" min="0" step="any" value="${x.qty}" aria-label="Quantity ${i + 1}"><input data-f="price" type="number" min="0" step="0.01" value="${x.price || ""}" placeholder="0.00" aria-label="Price ${i + 1}"><button type="button" class="iconbtn" data-rm="${i}" aria-label="Remove item ${i + 1}">${ic("x")}</button></div>`;
  modal(`<div class="rc"><div class="rc-pic"><img src="${photo}" alt="Your receipt"></div>
    <div class="rc-form"><h2 style="margin:0">Check the receipt</h2>
      ${r ? `<div class="rc-note ok">${ic("check")} Read by AI. Check every number against the photo before you save.</div>` : err ? `<div class="rc-note warn">${ic("alert")} The AI couldn't read it (${esc(err)}). Fill it in below. The photo is saved either way.</div>` : ""}
      <div class="rc-row3"><label>Store or shop<input id="rcVendor" value="${esc(d.vendor)}" placeholder="e.g. RevZilla"></label><label>Date<input id="rcDate" type="date" value="${esc(d.date || today())}"></label><label>Total paid<input id="rcTotal" type="number" min="0" step="0.01" value="${d.total || ""}" placeholder="0.00"></label></div>
      <div class="rc-items"><div class="rc-ih"><span>Item</span><span>Part #</span><span>Qty</span><span>Price</span><span></span></div><div id="rcItems">${d.items.map(itemRow).join("")}</div>
        <div class="row" style="gap:8px;justify-content:space-between;flex-wrap:wrap"><button type="button" class="linkbtn" id="rcAdd">${ic("plus")} Add a line</button><span class="faint" id="rcSum"></span></div></div>
      <div class="rc-row3"><label>Labor<input id="rcLabor" type="number" min="0" step="0.01" value="${d.labor || ""}" placeholder="0.00"></label><label>Tax<input id="rcTax" type="number" min="0" step="0.01" value="${d.tax || ""}" placeholder="0.00"></label><span></span></div>
      <div class="rc-for" role="radiogroup" aria-label="What is this receipt for?">${RCPT_FOR.map(([k, t, i, s]) => `<button type="button" role="radio" aria-checked="${k === forK}" class="${k === forK ? "on" : ""}" data-for="${k}">${ic(i)}<b>${t}</b><small>${s}</small></button>`).join("")}</div>
      <div id="rcMore"></div>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:6px"><button class="btn" data-x>Cancel</button><button class="btn pri" id="rcSave">${ic("check")} Save</button></div>
    </div></div>`, m => {
    const $m = s => m.querySelector(s);
    const items = () => [...m.querySelectorAll(".rc-item")].map(row => { const o = {}; row.querySelectorAll("[data-f]").forEach(inp => o[inp.dataset.f] = inp.dataset.f === "qty" || inp.dataset.f === "price" ? rcNum(inp.value) : inp.value.trim()); return o; }).filter(x => x.description || x.price || x.partNumber);
    const sum = () => { const it = items(), s = it.reduce((a, x) => a + x.price, 0) + rcNum($m("#rcLabor").value) + rcNum($m("#rcTax").value), tot = rcNum($m("#rcTotal").value);
      $m("#rcSum").innerHTML = it.length ? `Items + labor + tax = ${money2(s)}${tot && Math.abs(s - tot) > 0.02 ? ` <span class="rc-off">${money2(tot)} on the receipt. Check the lines.</span>` : ""}` : ""; };
    const more = () => {
      const it = items(), first = it[0] || {};
      const box = $m("#rcMore");
      if (forK === "service") box.innerHTML = `<div class="rc-row2"><label>What was done<input id="rcSvc" value="${esc(it.map(x => x.description).filter(Boolean).slice(0, 4).join(", ").slice(0, 120))}" placeholder="e.g. Oil and filter change"></label><label>Odometer (miles)<input id="rcOdo" type="number" min="0" value="${od ? Math.round(od.miles) : ""}"></label></div>
        ${sorted("schedule").length ? `<div class="rc-sched"><span>Schedule items this covers</span><div>${sorted("schedule").map(s => `<label class="chip-chk"><input type="checkbox" value="${esc(s.id)}" ${sched.includes(s.id) ? "checked" : ""}><span>${esc(s.name)}</span></label>`).join("")}</div></div>` : ""}`;
      else if (forK === "mod") box.innerHTML = `<div class="rc-row2"><label>Mod name<input id="rcMod" value="${esc(first.description || "")}" placeholder="e.g. Slip-on exhaust"></label><label>Category<select id="rcCat">${MOD_CATS.map(c => `<option>${esc(c)}</option>`).join("")}</select></label></div>
        <div class="rc-row2"><label>Stock part it replaced (optional)<input id="rcRepl" placeholder="e.g. muffler"></label><label>Odometer (miles)<input id="rcOdo" type="number" min="0" value="${od ? Math.round(od.miles) : ""}"></label></div>`;
      else if (forK === "parts") box.innerHTML = `<div class="rc-row2"><label>Description<input id="rcDesc" value="${esc(it.map(x => x.description).filter(Boolean).slice(0, 3).join(", ").slice(0, 120))}"></label><label>Category<input id="rcExpCat" list="rcCats" value="${esc(cats[0] || "")}"><datalist id="rcCats">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist></label></div>`;
      else box.innerHTML = `<p class="faint" style="margin:0">The photo is filed under Receipts with the store, date and total.</p>`;
    };
    m.querySelector("#rcItems").addEventListener("input", sum); ["#rcLabor", "#rcTax", "#rcTotal"].forEach(s => $m(s).addEventListener("input", sum));
    m.querySelector("#rcItems").addEventListener("click", e => { const b = e.target.closest("[data-rm]"); if (b) { b.closest(".rc-item").remove(); sum(); } });
    $m("#rcAdd").onclick = () => { const n = m.querySelectorAll(".rc-item").length; $m("#rcItems").insertAdjacentHTML("beforeend", itemRow({ description: "", partNumber: "", qty: 1, price: 0 }, n)); m.querySelector(".rc-item:last-child input").focus(); };
    m.querySelectorAll("[data-for]").forEach(b => b.onclick = () => { forK = b.dataset.for; m.querySelectorAll("[data-for]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); }); more(); });
    $m("[data-x]").onclick = closeModal; more(); sum();
    $m("#rcSave").onclick = async () => {
      const it = items(), vendor = $m("#rcVendor").value.trim(), date = $m("#rcDate").value || today(), labor = rcNum($m("#rcLabor").value), tax = rcNum($m("#rcTax").value);
      const total = rcNum($m("#rcTotal").value) || Math.round((it.reduce((a, x) => a + x.price, 0) + labor + tax) * 100) / 100;
      if (forK !== "keep" && !total) { toast("Add the total paid.", "err"); $m("#rcTotal").focus(); return; }
      const v = s => { const el = $m(s); return el ? el.value.trim() : ""; };
      if (forK === "service" && !v("#rcSvc")) { toast("Say what was done.", "err"); $m("#rcSvc").focus(); return; }
      if (forK === "mod" && !v("#rcMod")) { toast("Name the mod.", "err"); $m("#rcMod").focus(); return; }
      $m("#rcSave").disabled = true;
      const doc = blank("docs", { title: "Receipt: " + (vendor || "receipt") + " " + fmtDate(date), kind: "Receipt", date, file: photo, fileName: fileName || "receipt.jpg", folder: "Receipts", tags: "receipt",
        caption: [vendor, money2(total)].filter(Boolean).join(" · ") });
      Object.assign(doc, { vendor, total, items: it, labor, tax, rcptFor: forK });
      const lines = it.map(x => [x.partNumber, x.description, x.qty !== 1 ? x.qty : ""].filter(v2 => v2 !== "" && v2 != null).join(", ")).join("\n");
      let rec = null, c = "";
      if (forK === "service") { c = "maintenance"; const ids = [...m.querySelectorAll(".rc-sched input:checked")].map(x => x.value);
        rec = blank("maintenance", { service: v("#rcSvc").slice(0, 160), date, odometer: rcNum(v("#rcOdo")), kind: ids.length ? "Scheduled service" : "Repair", items: ids, doneBy: labor ? "A shop" : "Myself", shop: labor ? vendor : "", partsUsed: lines, partsCost: Math.max(0, Math.round((total - labor) * 100) / 100), laborCost: labor, cost: total }); }
      if (forK === "mod") { c = "mods"; const pn = (it.find(x => x.partNumber) || {}).partNumber || "";
        rec = blank("mods", { name: v("#rcMod").slice(0, 120), category: v("#rcCat"), partNo: pn, price: Math.max(0, Math.round((total - labor) * 100) / 100), labor, date, odometer: rcNum(v("#rcOdo")), status: "Installed", installedBy: labor ? "A shop" : "Myself", shop: labor ? vendor : "", vendor, replaced: v("#rcRepl"), stockKept: v("#rcRepl") ? "Kept" : "Not applicable", notes: lines }); }
      if (forK === "parts") { c = "expenses"; rec = blank("expenses", { description: (v("#rcDesc") || "Parts from " + (vendor || "store")).slice(0, 160), date, amount: total, status: "Paid", category: v("#rcExpCat"), vendor, receipt: "Photo " + doc.id, notes: lines }); }
      if (rec) { rec.receiptDoc = doc.id; doc.linked = { c, id: rec.id }; doc.title = "Receipt: " + (rec.service || rec.name || rec.description || vendor); }
      try {
        await store.put("docs", doc, { action: "added a receipt" + (vendor ? " from " + vendor : "") });
        if (rec) await store.put(c, rec, { action: forK === "service" ? "logged " + rec.service + " from a receipt" : forK === "mod" ? "added the mod " + rec.name + " from a receipt" : "added an expense from a receipt" });
      } catch (e) { $m("#rcSave").disabled = false; toast("Couldn't save. Check your internet and try again.", "err"); return; }
      closeModal(); toast(forK === "service" ? "Saved to the Maintenance log with the receipt." : forK === "mod" ? "Saved to Mods & upgrades with the receipt." : forK === "parts" ? "Saved as an expense with the receipt." : "Receipt filed.");
      if (R.sec === "receipts") render(false);
    };
  });
}

/* ---- viewing a receipt ---- */
function rcView(id) {
  const d = S.docs[id]; if (!d) { toast("That receipt isn't here any more.", "err"); return; }
  const L = d.linked && S[d.linked.c] && S[d.linked.c][d.linked.id], lbl = { maintenance: "Open the service", mods: "Open the mod", expenses: "Open the expense" };
  modal(`<div class="rc rc-viewer"><div class="rc-pic"><img src="${d.file}" alt="${esc(d.title)}"></div><div class="rc-form"><h2 style="margin:0">${esc(d.vendor || d.title)}</h2>
    <div class="faint">${esc([fmtDate(d.date), d.total ? money2(d.total) : ""].filter(Boolean).join(" · "))}</div>
    ${(d.items || []).length ? `<table class="rc-vt"><tbody>${d.items.map(x => `<tr><td>${esc(x.description)}${x.partNumber ? `<div><code>${esc(x.partNumber)}</code></div>` : ""}</td><td class="r">${x.qty !== 1 ? esc(String(x.qty)) + " × " : ""}${x.price ? money2(x.price) : ""}</td></tr>`).join("")}${n(d.labor) ? `<tr><td>Labor</td><td class="r">${money2(d.labor)}</td></tr>` : ""}${n(d.tax) ? `<tr><td>Tax</td><td class="r">${money2(d.tax)}</td></tr>` : ""}</tbody></table>` : ""}
    <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:auto">${L ? `<button class="btn" data-rc-open="${esc(d.linked.c)}|${esc(d.linked.id)}">${lbl[d.linked.c] || "Open the record"}</button>` : ""}<button class="btn" data-rc-doc="${esc(d.id)}">Edit details</button><button class="btn pri" data-x>Done</button></div></div></div>`, m => {
    m.querySelector("[data-x]").onclick = closeModal;
    const o = m.querySelector("[data-rc-open]"); if (o) o.onclick = () => { closeModal(); const [c, rid] = o.dataset.rcOpen.split("|"); openRecord(c, rid); };
    m.querySelector("[data-rc-doc]").onclick = () => { closeModal(); openRecord("docs", d.id); };
  });
}
document.addEventListener("click", e => {
  const v = e.target.closest("[data-rcpt]"); if (v) { e.preventDefault(); e.stopPropagation(); rcView(v.dataset.rcpt); return; }
  const s = e.target.closest("[data-snap]"); if (s) { e.preventDefault(); closeMenus(); snapReceipt(s.dataset.snap || ""); }
});
// a receipt link for any record: the saved photo if there is one, otherwise the pasted link
const rcptLinkHtml = (r, cls = "") => r.receiptDoc && S.docs[r.receiptDoc] ? `<button class="linkbtn ${cls}" data-rcpt="${esc(r.receiptDoc)}">${ic("image")} Receipt</button>` : r.receipt && /^https?:/i.test(r.receipt) ? `<a class="${cls}" href="${esc(r.receipt)}" target="_blank" rel="noopener">Receipt</a>` : "";

/* ---- the Receipts page ---- */
VIEWS.receipts = {
  render() {
    const W = ME.canWrite, all = sorted("docs").filter(d => d.kind === "Receipt" && d.file).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    const yr = R.f.rcYear || "", years = [...new Set(all.map(d => String(d.date || "").slice(0, 4)).filter(Boolean))], list = all.filter(d => !yr || String(d.date).startsWith(yr));
    const y = String(new Date().getFullYear()), tot = a => a.reduce((s, d) => s + n(d.total), 0);
    const svcs = svcDone(), withR = svcs.filter(r => r.receipt || r.receiptDoc).length;
    const tagOf = d => ({ service: ["Service", "c-blue"], mod: ["Mod", "c-tan"], parts: ["Parts", "c-green"] }[d.rcptFor] || ["Filed", "c-gray"]);
    const stat = (cls, k, v, s, a) => `<button class="mh-stat ${cls}" ${a || ""}><span class="mh-k">${k}</span><span class="mh-v">${v}</span><span class="mh-s">${s}</span></button>`;
    return `<div class="ph" data-own="1"><div class="eyebrow">Records</div><h1>Receipts</h1><p>Every receipt for the bike, photographed and filed with the work it paid for.</p>
        <div class="act">${W ? `<button class="btn pri big" data-snap>${ic("camera")} Snap a receipt</button>` : ""}</div></div>
      <div class="mh-stats md-stats">
        ${stat("c-navy", ic("image") + "Receipts", String(all.length), all[0] ? "Latest " + fmtDate(all[0].date) : "None yet")}
        ${stat("c-tan", ic("dollar") + "This year", money(tot(all.filter(d => String(d.date).startsWith(y)))), (n2 => "on " + n2 + " receipt" + (n2 === 1 ? "" : "s"))(all.filter(d => String(d.date).startsWith(y)).length))}
        ${stat("c-blue", ic("dollar") + "All time", money(tot(all)), "from receipts on file")}
        ${stat(svcs.length && withR === svcs.length ? "c-green" : "c-amber", ic("wrench") + "Services with receipts", `${withR}<small> / ${svcs.length}</small>`, svcs.length ? "Buyers trust services with receipts" : "Log services to track this", 'data-go="maintenance"')}
      </div>
      ${all.length ? `<div class="rc-bar">${years.length > 1 ? `<select id="rcYear" aria-label="Year"><option value="">All years</option>${years.map(v => `<option ${yr === v ? "selected" : ""}>${v}</option>`).join("")}</select>` : ""}<span class="faint">${list.length} receipt${list.length === 1 ? "" : "s"} · ${money2(tot(list))}</span></div>
        <div class="rc-grid">${list.map(d => { const [t, c] = tagOf(d), L = d.linked && S[d.linked.c] && S[d.linked.c][d.linked.id]; return `<button class="rc-card" data-rcpt="${esc(d.id)}"><span class="rc-thumb"><img src="${d.file}" alt="" loading="lazy"></span>
          <span class="rc-ct"><span class="rc-tag ${c}">${t}</span><b>${esc(d.vendor || d.title)}</b><span class="faint">${esc(fmtDate(d.date))}</span>${L ? `<span class="rc-for-l">${esc(L.service || L.name || L.description || "")}</span>` : ""}<b class="rc-amt">${n(d.total) ? money2(d.total) : ""}</b></span></button>`; }).join("")}</div>`
      : `<div class="md-empty rc-empty"><b>No receipts yet</b><span class="muted">Take a photo of a receipt from the parts store or the shop. The AI reads it, you check it, and it's saved with the service or mod it paid for. On a phone it opens the camera.</span>${W ? `<button class="btn pri" data-snap>${ic("camera")} Snap your first receipt</button>` : ""}</div>`}`;
  },
  bind(root) { bindTables(root); const ys = $("#rcYear", root); if (ys) ys.onchange = () => { R.f.rcYear = ys.value; render(false); }; }
};
