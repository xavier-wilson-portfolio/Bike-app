/* ============ Revora Shop: bring clients over from another system ============
   Reads the spreadsheets a shop exports from its old software (one file, or customers / vehicles / repair orders as separate files),
   works out which column is which, joins the files, merges duplicates and groups everything into client > bike > visits.
   Nothing here saves anything: shopcrm_view.js shows the review and does the import. */
(function () {
  const norm = s => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const digits = s => String(s == null ? "" : s).replace(/\D/g, "");
  const clean = s => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

  /* ---------- reading files ---------- */
  function parseDelimited(text) {
    text = String(text || "").replace(/^﻿/, "");
    const first = text.split(/\r?\n/).find(l => l.trim()) || "";
    const count = ch => (first.match(new RegExp(ch === "|" ? "\\|" : ch, "g")) || []).length;
    const delim = [",", "\t", ";", "|"].sort((a, b) => count(b) - count(a))[0] || ",";
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; continue; }
      if (c === '"' && cell === "") { q = true; continue; }
      if (c === delim) { row.push(cell); cell = ""; continue; }
      if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; continue; }
      cell += c;
    }
    if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(x => String(x).trim()));
  }
  let xlsxLoading = null;
  function loadXlsx() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (!xlsxLoading) xlsxLoading = new Promise((ok, no) => { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"; s.onload = () => ok(window.XLSX); s.onerror = () => { xlsxLoading = null; no(new Error("Couldn't open Excel files right now. Save it as CSV and try again.")); }; document.head.appendChild(s); });
    return xlsxLoading;
  }
  // a File -> [{ name, rows }] (an Excel file can have more than one sheet)
  async function readFile(file) {
    const nm = file.name || "file";
    if (/\.(xlsx|xlsm|xls|ods)$/i.test(nm)) {
      const X = await loadXlsx(), wb = X.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      return wb.SheetNames.map(sn => ({ name: wb.SheetNames.length > 1 ? `${nm} · ${sn}` : nm, rows: X.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: false, dateNF: "yyyy-mm-dd", defval: "" }).filter(r => r.some(x => String(x).trim())) }))
        .filter(s => s.rows.length > 1);
    }
    return [{ name: nm, rows: parseDelimited(await file.text()) }];
  }

  /* ---------- photos: index cards, a notebook page, a printed list ---------- */
  const AI_API = () => (window.RV_CONFIG && RV_CONFIG.aiApi) || "https://revora-mechanic.xavier-j-wilson101.workers.dev";
  const PHOTO_HEAD = ["Name", "Phone", "Email", "Year", "Make", "Model", "VIN", "Date", "Mileage", "Work done", "Cost", "Notes"];
  const PHOTO_MAP = ["name", "phone", "email", "year", "make", "model", "vin", "date", "miles", "work", "cost", "notes"];
  const PHOTO_PROMPT = `This is a photo of a motorcycle shop's customer records: index cards, a notebook page, a printed customer list or old work orders. Read every customer on it.
Return JSON only: {"rows":[{"name":"","phone":"","email":"","year":"","make":"","model":"","vin":"","date":"","miles":0,"work":"","cost":0,"notes":""}]}
One row per service visit. Repeat the customer's name, phone, email and bike on every one of their rows. A customer or bike with no service written gets one row with work empty.
date: as written (for example 10/19/24). miles and cost: numbers only. notes: anything else written about the customer.
Copy exactly what is written. Leave a field empty if you can't read it. Never guess.`;
  function shrinkPhoto(file, max, q) {
    return new Promise((ok, no) => { const u = URL.createObjectURL(file), im = new Image();
      im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); ok(c.toDataURL("image/jpeg", q)); };
      im.onerror = () => { URL.revokeObjectURL(u); no(new Error("That photo couldn't be opened. Try a JPG or PNG.")); }; im.src = u; });
  }
  // a photo -> a sheet with fixed columns, ready for the owner to check against the picture
  async function readPhoto(file, token) {
    let img = await shrinkPhoto(file, 1800, 0.82); if (img.length > 1500000) img = await shrinkPhoto(file, 1500, 0.7); if (img.length > 1500000) img = await shrinkPhoto(file, 1200, 0.6);
    const thumb = await shrinkPhoto(file, 1100, 0.7);
    let res; try { res = await fetch(AI_API(), { method: "POST", headers: Object.assign({ "content-type": "application/json" }, token ? { Authorization: "Bearer " + token } : {}), body: JSON.stringify({ scan: { image: img, prompt: PHOTO_PROMPT, kind: "logbook" } }) }); }
    catch (e) { throw new Error("Couldn't reach the photo reader. Check your internet."); }
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(res.status === 401 ? "Sign in again to read photos." : res.status === 402 ? "Reading photos needs an active Shop plan." : res.status === 429 && /daily/.test(j.error || "") ? "You've read today's limit of photos. Try again tomorrow, or upload a spreadsheet." : res.status === 429 ? "The photo reader is busy. Try again in a minute." : res.status === 413 ? "That photo is too big. Try again a little further back." : "The photo couldn't be read. Try a clearer, flatter photo.");
    const t = String(j.text || ""), a = t.indexOf("{"), b = t.lastIndexOf("}");
    let o = null; try { o = JSON.parse(t.slice(a, b + 1)); } catch (e) { try { o = JSON.parse(t.slice(a, b + 1).replace(/,\s*([}\]])/g, "$1")); } catch (e2) {} }
    const list = o && (Array.isArray(o.rows) ? o.rows : Array.isArray(o.records) ? o.records : Array.isArray(o) ? o : null);
    const rows = (list || []).filter(r => r && typeof r === "object").map(r => PHOTO_MAP.map(k => { const x = r[k == "miles" ? "miles" : k] ?? (k === "miles" ? r.odometer : k === "work" ? r.service : ""); return x == null || x === 0 ? "" : String(x).trim(); }))
      .filter(r => r.some(Boolean));
    if (!rows.length) throw new Error("No customers could be read in that photo. Try a closer, flatter photo with good light.");
    return { name: file.name && !/^image\.(jpe?g|png|heic)$/i.test(file.name) ? file.name : "Photo", head: PHOTO_HEAD.slice(), rows, map: PHOTO_MAP.slice(), kind: kindOf(PHOTO_MAP), photo: thumb };
  }
  const isImage = f => /^image\//.test(f.type || "") || /\.(jpe?g|png|heic|heif|webp)$/i.test(f.name || "");

  /* ---------- which column is which ---------- */
  const FIELDS = [["skip", "Skip this column"], ["cid", "Customer ID / number"], ["name", "Customer name"], ["first", "First name"], ["last", "Last name"], ["phone", "Phone"], ["email", "Email"], ["notes", "Customer notes"],
    ["vid", "Vehicle ID / number"], ["year", "Year"], ["make", "Make"], ["model", "Model"], ["bike", "Bike (year make model in one)"], ["vin", "VIN / frame number"], ["miles", "Mileage"],
    ["date", "Service date"], ["work", "Work done"], ["cost", "Total cost"]];
  const LABEL = Object.fromEntries(FIELDS);
  // the heading first; the values decide when the heading doesn't
  const BY_HEAD = [
    ["cid", /^(customer|cust|client|account|acct)\s*(id|#|no|num|number|code)$|^(cust|customer|client)\s*#$/],
    ["vid", /^(vehicle|unit|bike|veh)\s*(id|#|no|num|number)$|^(veh|unit)\s*#$/],
    ["email", /e\s*-?\s*mail/],
    // columns no shop needs here: address, plate, balances, the old system's order numbers
    ["skip", /zip|postal|address|street|\bcity\b|\bstate\b|province|country|plate|\btag\b|company|balance|\btax|^(ro|order|invoice|ticket|wo|work order|repair order|estimate|job)\s*(#|no|num|number|id)?$/],
["phone", /phone|cell|mobile|^tel|telephone|^ph\b|ph #|contact number/],
    ["first", /^first|first\s*name|given/], ["last", /^last|last\s*name|surname|family name/],
    ["name", /^(customer|cust|client|owner)?\s*(full\s*)?name$|^customer$|^client$|^owner$|^bill to$/],
    ["vin", /\bvin\b|serial|frame|chassis/], ["year", /^year$|^yr$|model year|^yr\.?$/], ["make", /^make$|manufacturer|^brand$|^mfr$/], ["model", /^model$|model name/],
    ["miles", /mile|odo|odometer|^km$|kilomet|mileage in|^miles?$/],
    ["date", /date|^in$|completed|closed|^when$/],
    ["bike", /^vehicle$|^unit$|^bike$|motorcycle|^vehicle description$|^vehicle desc$|^year make model$|^y\/?m\/?m$|^ymm$/],
    ["work", /work|service|repair|job|labor|complaint|description|^desc|line items?|^items?$|performed/],
    ["cost", /total|amount|cost|price|charge|paid|\$/],
    ["notes", /note|comment|remark/]];
  const looks = {
    email: v => /^\S+@\S+\.\S+$/.test(v), phone: v => { const d = digits(v); return d.length >= 7 && d.length <= 11 && !/[a-z]{3}/i.test(v); },
    vin: v => /^[A-HJ-NPR-Z0-9]{17}$/i.test(String(v).trim()), year: v => /^(19[5-9]\d|20[0-4]\d)$/.test(String(v).trim()),
    date: v => !/^\d+(\.\d+)?$/.test(String(v).trim()) && !!toDate(v), money: v => /^\$?\s*-?[\d,]+(\.\d{1,2})?$/.test(String(v).trim()) && /[.$]/.test(String(v))
  };
  function guessField(head, samples) {
    const h = String(head == null ? "" : head).toLowerCase().replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
    for (const [k, re] of BY_HEAD) if (re.test(h)) return k;
    const vals = samples.map(v => String(v || "").trim()).filter(Boolean), share = f => vals.length ? vals.filter(f).length / vals.length : 0;
    if (share(looks.email) > .6) return "email"; if (share(looks.vin) > .6) return "vin"; if (share(looks.year) > .8) return "year";
    if (share(looks.date) > .7) return "date"; if (share(looks.money) > .6) return "cost"; if (share(looks.phone) > .7) return "phone";
    return "skip";
  }
  // the heading row is the first one that looks like headings (mostly words, no emails or long numbers)
  function headerIndex(rows) {
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const filled = rows[i].map(x => String(x == null ? "" : x).trim()).filter(Boolean);
      if (filled.length >= 2 && filled.every(x => !looks.email(x) && !/^[\d\s()+.-]{6,}$/.test(x) && !toDate(x) && x.length < 40)) return i;
    }
    return 0;
  }
  // a sheet -> { name, head, rows, map: [field per column], kind }
  function prepare(sheet) {
    const hi = headerIndex(sheet.rows), head = (sheet.rows[hi] || []).map(x => clean(x)), body = sheet.rows.slice(hi + 1);
    const map = head.map((h, ci) => guessField(h, body.slice(0, 40).map(r => r[ci])));
    // one column per field (work and notes can have several): keep the one with the most filled cells, e.g. Cell Phone over an empty Home Phone
    const filled = ci => body.filter(r => String(r[ci] == null ? "" : r[ci]).trim()).length;
    [...new Set(map)].filter(f => f !== "skip" && f !== "work" && f !== "notes").forEach(f => {
      const cols = map.map((x, i) => x === f ? i : -1).filter(i => i >= 0); if (cols.length < 2) return;
      const keep = cols.reduce((a, b) => filled(b) > filled(a) ? b : a); cols.forEach(i => { if (i !== keep) map[i] = "skip"; });
    });
    return { name: sheet.name, head, rows: body, map, kind: kindOf(map) };
  }
  function kindOf(map) {
    const has = k => map.includes(k), person = has("name") || has("first") || has("last") || has("email") || has("phone"), bike = has("year") || has("make") || has("model") || has("bike") || has("vin"), visit = has("date") || has("work");
    return visit && (person || bike) ? "everything" : visit ? "history" : bike && person ? "clients and bikes" : bike ? "bikes" : person ? "clients" : "unknown";
  }

  /* ---------- values ---------- */
  function toDate(v) {
    if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
    const s = String(v || "").trim(); if (!s) return "";
    let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); if (m) return ok(+m[1], +m[2], +m[3]);
    m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/); if (m) { let y = +m[3]; if (y < 100) y += y > 50 ? 1900 : 2000; return ok(y, +m[1], +m[2]) || ok(y, +m[2], +m[1]); }
    if (/^\d{5}(\.\d+)?$/.test(s) && +s > 20000 && +s < 60000) { const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(+s) * 864e5); return d.toISOString().slice(0, 10); }   // Excel day number
    if (/[a-z]{3}/i.test(s) && /\d{4}/.test(s)) { const d = new Date(s); if (!isNaN(d)) return ok(d.getFullYear(), d.getMonth() + 1, d.getDate()); }
    return "";
    function ok(y, mo, d) { if (y < 1950 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return ""; return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
  }
  const toNum = v => { const s = String(v == null ? "" : v).replace(/[$,\s]/g, ""); const n = parseFloat(s); return isFinite(n) ? n : 0; };
  const fixName = s => { s = clean(s); const m = s.match(/^([^,]+),\s*([^,]+)$/); return m ? `${m[2]} ${m[1]}` : s; };   // "Torres, Mike" -> "Mike Torres"
  const title = s => s && s === s.toUpperCase() && /[A-Z]{2}/.test(s) ? s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()) : s;
  const capsModel = s => s && s === s.toUpperCase() && /[A-Z]{4}/.test(s) ? s.split(/(\s+|-)/).map(w => /\d/.test(w) || w.length <= 3 ? w : w[0] + w.slice(1).toLowerCase()).join("") : s;
  const capsText = s => s && s === s.toUpperCase() && /[A-Z]{4}/.test(s) ? s.toLowerCase().replace(/^\s*[a-z]/, c => c.toUpperCase()).replace(/\b(lof|vin|abs|ecu|atv|utv|a\/f)\b/g, m => m.toUpperCase()) : s;
  const fmtPhone = s => { const d = digits(s).replace(/^1(?=\d{10}$)/, ""); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : clean(s); };
  const MAKES = ["Harley-Davidson", "Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Ducati", "KTM", "Triumph", "Indian", "Royal Enfield", "Aprilia", "Moto Guzzi", "Husqvarna", "Victory", "Buell", "Can-Am", "Zero", "MV Agusta", "Benelli", "Kymco", "Vespa", "Piaggio", "GasGas", "Beta", "Sherco", "CFMoto", "Polaris", "Norton", "BSA"];
  const makeName = s => { s = clean(s); if (!s) return ""; const k = MAKES.find(x => norm(x) === norm(s)) || (/^h[- ]?d$/i.test(s) ? "Harley-Davidson" : ""); return k || (s.length > 3 ? title(s) : s); };
  // "2015 Honda CB500X" -> { year, make, model }
  function splitBike(s) {
    s = clean(s); const out = { year: "", make: "", model: "" }; if (!s) return out;
    const y = s.match(/\b(19[5-9]\d|20[0-4]\d)\b/); if (y) { out.year = y[1]; s = clean(s.replace(y[0], "")); }
    const mk = MAKES.find(k => new RegExp("^" + k.replace(/-/g, "[- ]?") + "\\b", "i").test(s)) || (/^h[- ]?d\b/i.test(s) ? "Harley-Davidson" : "");
    if (mk) { out.make = mk; s = clean(s.replace(new RegExp("^" + (mk === "Harley-Davidson" && /^h[- ]?d\b/i.test(s) ? "h[- ]?d" : mk.replace(/-/g, "[- ]?")) + "\\b", "i"), "")); }
    out.model = s; return out;
  }

  /* ---------- grouping: client > bike > visits ---------- */
  // sheets: prepared sheets; existing: the shop's clients [{id, name, phone, email}] and bikes by client {cid: [{id, label}]}
  function build(sheets, existing, existingBikes) {
    const P = {}; const find = k => { while (P[k] && P[k] !== k) k = P[k] = P[P[k]] || P[k]; return k; }, join = (a, b) => { a = find(a); b = find(b); if (a !== b) P[b] = a; };
    const recs = [], skipped = [];
    sheets.forEach(sh => sh.rows.forEach((r, ri) => {
      const v = {}; sh.map.forEach((f, ci) => { if (f === "skip") return; const x = clean(r[ci]); if (!x) return; v[f] = (f === "work" || f === "notes") && v[f] ? v[f] + "; " + x : x; });
      if (!Object.keys(v).length) return;
      const name = fixName(title(v.name || [v.first, v.last].filter(Boolean).join(" "))), email = (v.email || "").toLowerCase(), phone = digits(v.phone).replace(/^1(?=\d{10}$)/, "");
      const keys = [];
      if (v.cid) keys.push("c:" + norm(v.cid)); if (email && looks.email(email)) keys.push("e:" + email); if (phone.length >= 7) keys.push("p:" + phone.slice(-10));
      if (name && !keys.length) keys.push("n:" + norm(name));
      // a customer list with the bikes written in the notes ("2019 Ducati Scrambler; prefers texts")
      let extra = [];
      if (!v.bike && !v.year && !v.make && !v.model && !v.vin && v.notes) {
        const parts = v.notes.split(/\s*[;\n|]\s*|\s*,\s*(?=(?:19|20)\d\d\b)/), rest = [];
        parts.forEach(t => { const b = splitBike(t); if (b.year && b.make) extra.push(b); else if (t) rest.push(t); });
        if (extra.length) v.notes = rest.join("; ");
      }
      const bk = splitBike(v.bike || ""), bike = { year: v.year || bk.year, make: makeName(v.make || bk.make), model: capsModel(v.model || bk.model), vin: (v.vin || "").toUpperCase() };
      if (v.work) v.work = capsText(v.work);
      recs.push({ file: sh.name, row: ri + 1, v, name, email, phone, keys, bike, vid: v.vid ? "v:" + norm(v.vid) : "" });
      extra.slice(1).forEach(b => recs.push({ file: sh.name, row: ri + 1, v: {}, name, email, phone, keys, bike: { year: b.year, make: makeName(b.make), model: capsModel(b.model), vin: "" }, vid: "" }));
      if (extra.length && !bk.make) Object.assign(bike, { year: extra[0].year, make: makeName(extra[0].make), model: capsModel(extra[0].model) });
    }));
    // a vehicle file ties vehicle IDs to customers; a history file may only have the vehicle ID
    const vidOwner = {};
    recs.forEach(x => { if (x.keys.length) { x.keys.forEach(k => { P[k] = P[k] || k; }); for (let i = 1; i < x.keys.length; i++) join(x.keys[0], x.keys[i]); if (x.vid) { if (vidOwner[x.vid]) join(vidOwner[x.vid], x.keys[0]); else vidOwner[x.vid] = x.keys[0]; } } });
    recs.forEach(x => { if (!x.keys.length && x.vid && vidOwner[x.vid]) x.keys = [vidOwner[x.vid]]; });
    // a phone shared by two different names is a household or a shop line: don't merge on it
    const C = {};
    recs.forEach(x => {
      if (!x.keys.length) { skipped.push({ file: x.file, row: x.row, why: "No customer name, phone, email or ID" }); return; }
      const k = find(x.keys[0]), c = C[k] = C[k] || { key: k, name: "", phone: "", email: "", notes: "", bikes: {}, rows: 0, names: new Set() };
      c.rows++; if (x.name) { c.names.add(norm(x.name)); if (!c.name || x.name.length > c.name.length) c.name = x.name; }
      if (x.phone && !c.phone) c.phone = fmtPhone(x.v.phone); if (x.email && !c.email) c.email = x.email; if (x.v.notes && !c.notes.includes(x.v.notes)) c.notes = clean((c.notes + " " + x.v.notes).slice(0, 2000));
      const label = [x.bike.year, x.bike.make, x.bike.model].filter(Boolean).join(" ");
      const bkey = x.vid || (x.bike.vin ? "vin:" + x.bike.vin : label ? "l:" + norm(label) : "");
      const visit = x.v.date || x.v.work ? { date: toDate(x.v.date), work: clean(x.v.work || ""), miles: Math.round(toNum(x.v.miles)), cost: Math.round(toNum(x.v.cost) * 100) / 100 } : null;
      if (bkey) {
        const b = c.bikes[bkey] = c.bikes[bkey] || { key: bkey, year: "", make: "", model: "", vin: "", miles: 0, visits: [] };
        ["year", "make", "model", "vin"].forEach(f => { if (x.bike[f] && !b[f]) b[f] = x.bike[f]; });
        if (!visit && toNum(x.v.miles) > b.miles) b.miles = toNum(x.v.miles);
        if (visit) b.visits.push(visit);
      } else if (visit) (c.loose = c.loose || []).push(visit);
    });
    // visits with no bike named: onto the client's only bike, or a bike called "Their bike"
    const clients = Object.values(C).map(c => {
      let bikes = Object.values(c.bikes);
      // a vehicle-ID bike and a VIN/label bike that are the same: merge by VIN, then by label
      const seen = {}; bikes = bikes.filter(b => { const lab = norm([b.year, b.make, b.model].join(" ")), id = b.vin ? "vin:" + b.vin : lab ? "l:" + lab : "";
        if (id && seen[id]) { const o = seen[id]; o.visits.push(...b.visits); ["year", "make", "model", "vin"].forEach(f => { if (!o[f]) o[f] = b[f]; }); o.miles = Math.max(o.miles, b.miles); return false; } if (id) seen[id] = b; return true; });
      if (c.loose && c.loose.length) { if (bikes.length) bikes[0].visits.push(...c.loose); else bikes.push({ key: "x", year: "", make: "", model: "", vin: "", miles: 0, visits: c.loose, unnamed: true }); }
      bikes.forEach(b => {
        b.label = [b.year, b.make, b.model].filter(Boolean).join(" ") || (b.vin ? "Bike " + b.vin.slice(-6) : "Their bike");
        // same date and same work twice (a repair order split over lines): keep one, join the work
        const byDay = {}; b.visits.forEach(v => { const k = v.date || "?" + Math.random(); if (!byDay[k]) byDay[k] = Object.assign({}, v); else { const o = byDay[k]; if (v.work && !o.work.toLowerCase().includes(v.work.toLowerCase())) o.work = clean(o.work + (o.work ? ", " : "") + v.work); o.miles = Math.max(o.miles, v.miles); o.cost += v.cost; } });
        b.visits = Object.values(byDay).filter(v => v.date || v.work).sort((a, z) => String(z.date).localeCompare(String(a.date)));
        b.miles = Math.max(b.miles, ...b.visits.map(v => v.miles), 0);
      });
      const out = { key: c.key, name: c.name || (c.email ? c.email.split("@")[0] : c.phone ? "Customer " + c.phone.slice(-4) : "Customer"), phone: c.phone, email: c.email, notes: c.notes, bikes, rows: c.rows, flags: [] };
      if (!c.name) out.flags.push("No name in the file");
      if (c.names.size > 1) out.flags.push("Merged " + c.names.size + " spellings of the name");
      return out;
    });
    // already in Revora: match by email, then phone, then exact name
    const ex = existing || [], byE = {}, byP = {}, byN = {};
    ex.forEach(c => { if (c.email) byE[c.email.toLowerCase()] = c; const d = digits(c.phone).slice(-10); if (d.length >= 7) byP[d] = c; byN[norm(c.name)] = c; });
    clients.forEach(c => { const m = (c.email && byE[c.email]) || (digits(c.phone).slice(-10).length >= 7 && byP[digits(c.phone).slice(-10)]) || byN[norm(c.name)];
      if (m) { c.existing = m.id; c.flags.push("Already in Revora: adds to " + m.name);
        const eb = (existingBikes && existingBikes[m.id]) || []; c.bikes.forEach(b => { const hit = eb.find(x => norm(x.label) === norm(b.label)); if (hit) b.existing = hit.id; }); } });
    clients.sort((a, z) => a.name.localeCompare(z.name));
    const stats = { clients: clients.length, matched: clients.filter(c => c.existing).length, bikes: clients.reduce((s, c) => s + c.bikes.length, 0), visits: clients.reduce((s, c) => s + c.bikes.reduce((t, b) => t + b.visits.length, 0), 0),
      rows: recs.length, skipped: skipped.length, merged: recs.length ? Object.values(C).filter(c => c.rows > 1).length : 0 };
    return { clients, skipped, stats };
  }

  // shop shorthand in a work description, spelled out so the schedule matching can read it
  const SHORT = [[/\blof\b|\bo\/c\b|oil chg|oil chng|oil & filter|oil\+filter|\boil\b/gi, " oil change "], [/\bc&s\b|\bc\/s\b|chain adj|adj chain|chain & sprocket/gi, " chain and sprockets "],
    [/\bplugs?\b|\bspk\b/gi, " spark plug "], [/\bpads?\b/gi, " brake pads "], [/\bbf\b|brake flush|bleed brakes/gi, " brake fluid "], [/\b(f|r|rr|frt|fr|rear|front)\s*tire\b|\btires?\b|\btyres?\b/gi, " tire "],
    [/\bbatt\b/gi, " battery "], [/\bcoolant\b|\bantifreeze\b/gi, " coolant "], [/\bvalve adj\b|\bvalves\b/gi, " valve "], [/\bcarb\b|\bcarbs\b|\bsync\b/gi, " carb "], [/\ba\/f\b|\bair filter\b/gi, " air filter "], [/\btune\b|\btuneup\b|\btune-up\b/gi, " tune "]];
  const expand = s => SHORT.reduce((t, [re, w]) => t.replace(re, m => m + w), " " + String(s || "") + " ");

  window.rvImport = { readPhoto, isImage, PHOTO_HEAD, readFile, parseDelimited, prepare, kindOf, build, FIELDS, LABEL, toDate, splitBike, expand };
})();
