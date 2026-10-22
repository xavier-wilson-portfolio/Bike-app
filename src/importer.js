/* ============ Bring in old records: pasted notes, a spreadsheet, or photos of a paper logbook ============
   Everything lands on a review table first. Nothing is saved until the owner presses Add. */
Object.assign(ICON, {
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
  qr: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2"/>',
  swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>', ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>' });
const IMP = { rows: [], src: "" };
const impNum = v => { const x = parseFloat(String(v ?? "").replace(/[^0-9.]/g, "")); return isFinite(x) ? x : 0; };
function impDate(v) {
  const s = String(v || "").trim(); if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  let m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/); if (m) { let y = +m[3]; if (y < 100) y += y > 50 ? 1900 : 2000; return `${y}-${String(m[1]).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`; }
  m = s.match(/^(\d{1,2})[\/.-](\d{4})$/); if (m) return `${m[2]}-${String(m[1]).padStart(2, "0")}-01`;
  const d = new Date(s); return isNaN(d) ? "" : d.toISOString().slice(0, 10);
}
const IMP_KINDS = ["Scheduled service", "Repair", "Inspection", "Tires", "Upgrade", "Other"];
function impKind(t, k) { if (IMP_KINDS.includes(k)) return k; t = String(t || "").toLowerCase();
  return /tire|tyre/.test(t) ? "Tires" : /inspect|check/.test(t) ? "Inspection" : /repair|fix|replace.*(broken|leak)|rebuild/.test(t) ? "Repair" : /install|upgrade|exhaust|mod\b/.test(t) ? "Upgrade" : "Scheduled service"; }
function impClean(list) {
  return (Array.isArray(list) ? list : []).slice(0, 300).map(r => ({ on: true, date: impDate(r.date), odometer: Math.round(impNum(r.odometer || r.miles || r.mileage)), service: String(r.service || r.work || r.description || "").trim().slice(0, 160),
    kind: impKind(r.service || r.work, r.kind), cost: Math.round(impNum(r.cost || r.price || r.total) * 100) / 100, shop: String(r.shop || "").trim().slice(0, 80), notes: String(r.notes || "").trim().slice(0, 600) })).filter(r => r.service);
}
// spreadsheets: find the date, miles, work, cost and notes columns by their headings
function impCsv(text) {
  const rows = []; let cur = [""], q = false, row = [];
  const pushRow = () => { row.push(cur.join("")); rows.push(row); row = []; cur = [""]; };
  const delim = (text.split("\n")[0].match(/\t/g) || []).length > (text.split("\n")[0].match(/,/g) || []).length ? "\t" : (text.split("\n")[0].match(/;/g) || []).length > (text.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
  for (let i = 0; i < text.length; i++) { const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur.push('"'); i++; } else if (c === '"') q = false; else cur.push(c); }
    else if (c === '"') q = true; else if (c === delim) { row.push(cur.join("")); cur = [""]; } else if (c === "\n") pushRow(); else if (c !== "\r") cur.push(c); }
  if (cur.join("") || row.length) pushRow();
  const data = rows.filter(r => r.some(x => x.trim())); if (data.length < 2) return [];
  const H = data[0].map(h => h.toLowerCase().trim()), find = re => H.findIndex(h => re.test(h));
  const ci = { date: find(/date|when|day/), odometer: find(/odo|mile|km|mileage/), service: find(/service|work|what|job|desc|item|task|done/), cost: find(/cost|price|total|\$|amount/), shop: find(/shop|who|by|dealer|mechanic/), notes: find(/note|comment|detail/) };
  if (ci.service < 0) ci.service = H.findIndex((h, i) => !Object.values(ci).includes(i));
  return impClean(data.slice(1).map(r => Object.fromEntries(Object.entries(ci).map(([k, i]) => [k, i >= 0 ? r[i] : ""]))));
}
async function impAI(body) {
  if (typeof CHAT_API === "undefined" || !CHAT_API) throw new Error("the AI isn't set up on this site yet");
  if (!window.RV_CLOUD) throw new Error("create a free account to use the AI");
  let res; try { res = await fetch(CHAT_API, { method: "POST", headers: await aiHeaders(), body: JSON.stringify(body) }); } catch (e) { throw new Error("couldn't reach the AI. Check your internet"); }
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(res.status === 401 ? "you need to be signed in" : res.status === 429 && /daily limit/.test(j.error || "") ? "you've used today's imports. Try again tomorrow, or upload a spreadsheet instead" : res.status === 429 ? "the AI is busy. Try again in a minute" : res.status === 400 ? "the AI isn't updated for imports yet" : "the AI couldn't read it");
  const t = String(j.text || ""), a = t.indexOf("{"), b = t.lastIndexOf("}");
  let o = null; try { o = JSON.parse(t.slice(a, b + 1)); } catch (e) { try { o = JSON.parse(t.slice(a, b + 1).replace(/,\s*([}\]])/g, "$1")); } catch (e2) {} }
  return impClean(o && o.records);
}
const IMP_PHOTO_PROMPT = `This is a page from a motorcycle service logbook, a receipt pile or a handwritten list. List every service written on it.
Return JSON only: {"records":[{"date":"YYYY-MM-DD or empty","odometer":0,"service":"what was done","cost":0,"shop":"","notes":""}]}. Copy exactly what is written. Leave out anything you can't read.`;

function importOld() {
  if (!ME.canWrite) { toast("You have view-only access to this project.", "err"); return; }
  IMP.rows = []; IMP.src = "";
  modal(`<div class="imp"><h2 style="margin:0">Bring in your old records</h2>
    <p class="muted" style="margin:4px 0 12px">Got a notebook, a spreadsheet or receipts in a drawer? Bring them in and your history starts complete. You'll check everything before it's saved.</p>
    <div class="imp-ways">
      <button type="button" class="imp-way on" data-imp-way="paste">${ic("edit")}<b>Paste or type notes</b><small>From a notebook, an email, your notes app</small></button>
      <button type="button" class="imp-way" data-imp-way="csv">${ic("doc")}<b>Spreadsheet</b><small>A .csv saved from Excel, Google Sheets or Numbers</small></button>
      <button type="button" class="imp-way" data-imp-way="photo">${ic("camera")}<b>Photos of a logbook</b><small>Paper service book or a handwritten list</small></button></div>
    <div id="impIn"></div><div id="impOut"></div></div>`, m => {
    const inBox = m.querySelector("#impIn");
    const way = w => { m.querySelectorAll("[data-imp-way]").forEach(b => b.classList.toggle("on", b.dataset.impWay === w));
      inBox.innerHTML = w === "paste" ? `<label class="bp-f"><b>Your notes</b><textarea id="impText" rows="7" placeholder="3/2021  12,400 mi  oil and filter, Motul 10w40  $48&#10;June 2022 new rear tire at Cycle Gear $210&#10;Sept 22 chain and sprockets 15,980 mi"></textarea></label>
          <div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn pri" id="impGo">${ic("spark")} Read my notes</button></div>`
        : w === "csv" ? `<label class="imp-drop">${ic("doc")}<b>Choose a .csv file</b><small>The first row should be headings, like Date, Miles, Work done, Cost, Notes</small><input type="file" accept=".csv,.tsv,.txt,text/csv" id="impCsv" hidden></label>`
        : `<label class="imp-drop">${ic("camera")}<b>Take or choose photos</b><small>One page per photo, flat and in good light. Up to 6 at a time.</small><input type="file" accept="image/*" multiple id="impPh" hidden></label>`;
      const go = inBox.querySelector("#impGo"); if (go) go.onclick = async () => { const t = inBox.querySelector("#impText").value.trim(); if (t.length < 8) return toast("Paste or type a few services first.", "err");
        go.disabled = true; go.textContent = "Reading…"; try { IMP.rows = await impAI({ task: { kind: "import", text: `Bike: ${BIKE.name}. Today is ${today()}.\n\nNotes:\n${t}` } }); IMP.src = "notes"; } catch (e) { toast("Couldn't read the notes: " + e.message + ".", "err"); }
        go.disabled = false; go.innerHTML = ic("spark") + " Read my notes"; review(); };
      const cs = inBox.querySelector("#impCsv"); if (cs) cs.onchange = async () => { const f = cs.files[0]; if (!f) return; const t = await f.text(); IMP.rows = impCsv(t); IMP.src = "spreadsheet"; if (!IMP.rows.length) toast("Couldn't find services in that file. Make sure the first row has headings.", "err"); review(); };
      const ph = inBox.querySelector("#impPh"); if (ph) ph.onchange = async () => { const files = [...ph.files].slice(0, 6); if (!files.length) return; const out = [];
        inBox.querySelector(".imp-drop b").textContent = "Reading " + files.length + " photo" + (files.length === 1 ? "" : "s") + "…";
        for (const f of files) { try { const img = await (window.compressImageRaw || compressImage)(f, 520000); out.push(...await impAI({ scan: { image: img, prompt: IMP_PHOTO_PROMPT, kind: "logbook" } })); } catch (e) { toast("Couldn't read " + f.name + ": " + e.message + ".", "err"); } }
        IMP.rows = out; IMP.src = "logbook photos"; way("photo"); review(); };
    };
    const review = () => { const o = m.querySelector("#impOut"), R0 = IMP.rows;
      if (!R0.length) { o.innerHTML = ""; return; }
      o.innerHTML = `<div class="imp-rev"><div class="row" style="justify-content:space-between;align-items:baseline"><h3 style="margin:0">${R0.length} service${R0.length === 1 ? "" : "s"} found</h3><span class="faint" style="font-size:13px">Check each one. Untick anything that's wrong.</span></div>
        <div class="imp-tbl"><div class="imp-h"><span></span><span>Date</span><span>Miles</span><span>What was done</span><span>Cost</span></div>
        ${R0.map((r, i) => `<div class="imp-r" data-i="${i}"><input type="checkbox" data-f="on" ${r.on ? "checked" : ""} aria-label="Include"><input type="date" data-f="date" value="${esc(r.date)}"><input type="number" min="0" data-f="odometer" value="${r.odometer || ""}" placeholder="—"><input data-f="service" value="${esc(r.service)}"><input type="number" min="0" step="0.01" data-f="cost" value="${r.cost || ""}" placeholder="0"></div>`).join("")}</div>
        <p class="faint" style="font-size:12.5px;margin:6px 0 0">Records without a date get today's date. Notes and the shop name are kept with each record.</p>
        <div class="row" style="justify-content:flex-end;gap:8px;margin-top:10px"><button class="btn" data-x>Cancel</button><button class="btn pri" id="impSave">${ic("check")} Add ${R0.filter(r => r.on).length} to my history</button></div></div>`;
      o.querySelectorAll(".imp-r input").forEach(inp => inp.onchange = () => { const r = IMP.rows[+inp.closest(".imp-r").dataset.i], f = inp.dataset.f; r[f] = f === "on" ? inp.checked : f === "odometer" || f === "cost" ? impNum(inp.value) : inp.value;
        o.querySelector("#impSave").innerHTML = ic("check") + " Add " + IMP.rows.filter(x => x.on).length + " to my history"; });
      o.querySelector("[data-x]").onclick = closeModal;
      o.querySelector("#impSave").onclick = async () => { const keep = IMP.rows.filter(r => r.on && r.service); if (!keep.length) return toast("Nothing ticked to add.", "err");
        const b = o.querySelector("#impSave"); b.disabled = true; b.textContent = "Adding…"; let n2 = 0;
        for (const r of keep) { try { await store.put("maintenance", blank("maintenance", { service: r.service, date: r.date || today(), odometer: r.odometer || 0, kind: r.kind, cost: r.cost || 0, doneBy: r.shop ? "A shop" : "Myself", shop: r.shop, notes: [r.notes, "Imported from " + IMP.src + "."].filter(Boolean).join(" "), planned: false, items: [] }), { silent: true, noLog: true }); n2++; } catch (e) {} }
        if (n2) { const top = keep.filter(r => r.odometer).sort((a, b2) => b2.odometer - a.odometer)[0]; if (top && (!odoNow() || top.odometer > odoNow().miles)) { try { await store.put("mileage", blank("mileage", { date: top.date || today(), miles: top.odometer }), { silent: true, noLog: true }); } catch (e) {} } }
        closeModal(); render(); toast(n2 ? `Added ${n2} service${n2 === 1 ? "" : "s"} to your history.` : "Couldn't add those. Try again.", n2 ? null : "err"); };
    };
    m.querySelectorAll("[data-imp-way]").forEach(b => b.onclick = () => { IMP.rows = []; review(); way(b.dataset.impWay); });
    way("paste");
  });
}
document.addEventListener("click", e => { const b = e.target.closest("[data-import-old]"); if (!b) return; e.preventDefault(); importOld(); });
