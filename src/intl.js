/* ============ Settings gear: language, units and currency ============
   One gear sits at the far right of every top bar. Its panel sets:
   - language (English plus six hand-translated languages, files in /i18n/<code>.json)
   - units (distance, liquids, pressure, torque, temperature, small lengths, weight)
   - currency (symbol and number format only; amounts stay as typed)
   - appearance (light, dark, match device)
   Everything is stored in US units like before. Text on screen is converted as it's drawn,
   and number inputs for distance and fuel convert on the way in and out (rvIn / rvOut).
   The choice lives in this browser (rv.intl) and in the account's prefs when signed in. */
(function () {
  const LS = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const LANGS = [["en", "English", "en-US"], ["es", "Español", "es-ES"], ["fr", "Français", "fr-FR"], ["de", "Deutsch", "de-DE"], ["pt", "Português", "pt-BR"], ["it", "Italiano", "it-IT"], ["ja", "日本語", "ja-JP"]];
  const CURS = [["USD", "US dollar"], ["CAD", "Canadian dollar"], ["MXN", "Mexican peso"], ["BRL", "Brazilian real"], ["EUR", "Euro"], ["GBP", "British pound"], ["CHF", "Swiss franc"], ["SEK", "Swedish krona"], ["NOK", "Norwegian krone"], ["DKK", "Danish krone"], ["PLN", "Polish złoty"],
    ["AUD", "Australian dollar"], ["NZD", "New Zealand dollar"], ["JPY", "Japanese yen"], ["CNY", "Chinese yuan"], ["KRW", "South Korean won"], ["INR", "Indian rupee"], ["PHP", "Philippine peso"], ["THB", "Thai baht"], ["IDR", "Indonesian rupiah"], ["MYR", "Malaysian ringgit"], ["SGD", "Singapore dollar"], ["ZAR", "South African rand"], ["AED", "UAE dirham"], ["TRY", "Turkish lira"], ["CLP", "Chilean peso"], ["COP", "Colombian peso"], ["ARS", "Argentine peso"]];
  const PRESETS = {
    us: { dist: "mi", vol: "qt", press: "psi", torque: "lbft", temp: "F", len: "in", wt: "lb" },
    uk: { dist: "mi", vol: "L", press: "psi", torque: "Nm", temp: "C", len: "mm", wt: "kg" },
    metric: { dist: "km", vol: "L", press: "bar", torque: "Nm", temp: "C", len: "mm", wt: "kg" }
  };
  const UNIT_ROWS = [
    ["dist", "Distance", [["mi", "Miles"], ["km", "Kilometers"]]],
    ["vol", "Oil and fuel", [["qt", "US quarts and gallons"], ["L", "Liters"]]],
    ["press", "Tire pressure", [["psi", "psi"], ["kPa", "kPa"], ["bar", "bar"]]],
    ["torque", "Torque", [["lbft", "lb·ft"], ["Nm", "N·m"]]],
    ["temp", "Temperature", [["F", "°F"], ["C", "°C"]]],
    ["len", "Small measurements", [["in", "Inches"], ["mm", "Millimeters"]]],
    ["wt", "Weight", [["lb", "Pounds"], ["kg", "Kilograms"]]]
  ];

  // ---- first visit: guess from the browser, US stays the default for US English ----
  function guess() {
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en-US";
    const [lc, rg0] = nav.split("-"), rg = (rg0 || "").toUpperCase();
    const lang = LANGS.some(l => l[0] === lc) ? lc : "en";
    const units = !rg || ["US", "LR", "MM"].includes(rg) ? (lang === "en" || !rg ? "us" : "metric") : rg === "GB" ? "uk" : "metric";
    const curBy = { US: "USD", CA: "CAD", MX: "MXN", BR: "BRL", GB: "GBP", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", AU: "AUD", NZ: "NZD", JP: "JPY", CN: "CNY", KR: "KRW", IN: "INR", PH: "PHP", TH: "THB", ID: "IDR", MY: "MYR", SG: "SGD", ZA: "ZAR", AE: "AED", TR: "TRY", CL: "CLP", CO: "COP", AR: "ARS",
      DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", PT: "EUR", NL: "EUR", BE: "EUR", AT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR", LU: "EUR", SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", HR: "EUR", MT: "EUR", CY: "EUR" };
    const cur = curBy[rg] || (lang === "en" ? "USD" : { es: "EUR", fr: "EUR", de: "EUR", it: "EUR", pt: "BRL", ja: "JPY" }[lang]);
    return Object.assign({ lang, cur, auto: true }, PRESETS[units]);
  }
  let ST = (() => { try { const s = JSON.parse(LS.get("rv.intl") || "null"); if (s && s.dist) return Object.assign(guess(), s); } catch (e) {} return guess(); })();
  let touched = false;
  const save = patch => {
    Object.assign(ST, patch); delete ST.auto; touched = true;
    LS.set("rv.intl", JSON.stringify(ST));
    if (window.rvPrefs && !window.RV_DEMO) { try { rvPrefs.set({ intl: ST }); } catch (e) {} }
  };
  // a choice saved to the account wins on a new device (prefs load a moment after the page)
  function adoptAccount() {
    if (touched || !window.rvPrefs) return;
    let p; try { p = rvPrefs.get().intl; } catch (e) { return; }
    if (!p || !p.dist || JSON.stringify(p) === JSON.stringify(ST)) return;
    const langChanged = p.lang !== ST.lang;
    ST = Object.assign(guess(), p); delete ST.auto; LS.set("rv.intl", JSON.stringify(ST));
    if (langChanged) loadLang(ST.lang, refreshAll); else refreshAll();
  }
  [800, 2500, 6000].forEach(t => setTimeout(adoptAccount, t));

  const locale = () => (LANGS.find(l => l[0] === ST.lang) || LANGS[0])[2];

  // ---- number helpers ----
  const NUM = "\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?|\\.\\d+";
  const pnum = s => parseFloat(String(s).replace(/,/g, ""));
  const decs = s => { const m = String(s).match(/\.(\d+)/); return m ? m[1].length : 0; };
  const fmt = (v, d) => { d = Math.max(0, Math.min(3, d)); return (Math.round(v * 10 ** d) / 10 ** d).toLocaleString(locale(), { minimumFractionDigits: d, maximumFractionDigits: d }); };

  // unit table: quantity, system key, factor to the base unit (or a function pair for temperature)
  const U = {
    mi: ["dist", "mi", 1], miles: ["dist", "mi", 1], mile: ["dist", "mi", 1], km: ["dist", "km", 0.621371],
    "US qt": ["vol", "qt", 1], qt: ["vol", "qt", 1], quarts: ["vol", "qt", 1], quart: ["vol", "qt", 1], gal: ["vol", "gal", 4], gallons: ["vol", "gal", 4], gallon: ["vol", "gal", 4],
    L: ["vol", "L", 1.05669], liters: ["vol", "L", 1.05669], litres: ["vol", "L", 1.05669], ml: ["vol", "mL", 0.00105669], mL: ["vol", "mL", 0.00105669], "fl oz": ["vol", "floz", 0.03125],
    psi: ["press", "psi", 1], kPa: ["press", "kPa", 0.145038], bar: ["press", "bar", 14.5038],
    "lb·ft": ["torque", "lbft", 1], "lbf·ft": ["torque", "lbft", 1], "ft-lb": ["torque", "lbft", 1], "lb-ft": ["torque", "lbft", 1], "ft-lbs": ["torque", "lbft", 1], "ft·lb": ["torque", "lbft", 1], "ft lb": ["torque", "lbft", 1],
    "in·lb": ["torque", "inlb", 1 / 12], "in-lb": ["torque", "inlb", 1 / 12], "in-lbs": ["torque", "inlb", 1 / 12], "N·m": ["torque", "Nm", 0.737562], "Nm": ["torque", "Nm", 0.737562], "N m": ["torque", "Nm", 0.737562], "kgf·m": ["torque", "kgfm", 7.23301],
    "°F": ["temp", "F"], "°C": ["temp", "C"],
    in: ["len", "in", 1], "in.": ["len", "in", 1], inch: ["len", "in", 1], inches: ["len", "in", 1], mm: ["len", "mm", 1 / 25.4],
    lb: ["wt", "lb", 1], lbs: ["wt", "lb", 1], kg: ["wt", "kg", 2.20462],
    mph: ["speed", "mph", 1], "km/h": ["speed", "kmh", 0.621371], mpg: ["econ", "mpg"]
  };
  // what to show for each quantity, given the settings: [label, factor from base, decimals for this size]
  const TARGET = {
    dist: () => ST.dist === "km" ? ["km", 1.609344] : ["mi", 1],
    vol: (base, from) => ST.vol === "L" ? (from === "mL" || base < 0.25 ? ["ml", 946.353] : ["L", 0.946353]) : (from === "gal" || base >= 8 ? ["gal", 0.25] : from === "floz" ? ["fl oz", 32] : ["US qt", 1]),
    press: () => ST.press === "kPa" ? ["kPa", 6.89476] : ST.press === "bar" ? ["bar", 0.0689476] : ["psi", 1],
    torque: (base, from) => ST.torque === "Nm" ? ["N·m", 1.35582] : (from === "inlb" || base < 3 ? ["in·lb", 12] : ["lb·ft", 1]),
    len: () => ST.len === "mm" ? ["mm", 25.4] : ["in", 1],
    wt: () => ST.wt === "kg" ? ["kg", 0.453592] : ["lb", 1],
    speed: () => ST.dist === "km" ? ["km/h", 1.609344] : ["mph", 1]
  };
  const DEC = { km: v => v < 100 ? 1 : 0, mi: v => v < 100 ? 1 : 0, L: v => v < 10 ? 1 : 0, ml: () => 0, "US qt": v => v < 10 ? 1 : 0, gal: () => 1, "fl oz": () => 1, kPa: () => 0, bar: v => v < 10 ? 1 : 0, psi: () => 0,
    "N·m": v => v < 10 ? 1 : 0, "lb·ft": v => v < 10 ? 1 : 0, "in·lb": () => 0, mm: v => v < 1 ? 2 : v < 10 ? 1 : 0, in: v => v < 0.1 ? 3 : v < 10 ? 2 : 1, kg: v => v < 10 ? 1 : 0, lb: () => 0, "km/h": () => 0, mph: () => 0 };
  const sameUnit = (q, from) => {
    const want = { dist: ST.dist, press: ST.press, torque: ST.torque, len: ST.len, wt: ST.wt, temp: ST.temp, speed: ST.dist === "km" ? "kmh" : "mph" }[q];
    if (q === "vol") return ST.vol === "L" ? from === "L" || from === "mL" : ["qt", "gal", "floz"].includes(from);
    if (q === "torque" && ST.torque === "lbft") return from === "lbft" || from === "inlb";
    return want === from;
  };
  // convert one number (as text) from a unit; returns [numberText, unitLabel] or null to leave it alone
  function conv(numTxt, unit) {
    const u = U[unit]; if (!u) return null;
    const [q, sys, f] = u, v = pnum(numTxt);
    if (!isFinite(v)) return null;
    if (q === "temp") { if (ST.temp === sys) return null; return ST.temp === "C" ? [fmt((v - 32) * 5 / 9, 0), "°C"] : [fmt(v * 9 / 5 + 32, 0), "°F"]; }
    if (q === "econ") { if (ST.dist !== "km" || !v) return null; return ST.vol === "L" ? [fmt(235.215 / v, 1), "L/100 km"] : [fmt(v * 0.425144, 1), "km/L"]; }
    if (sameUnit(q, sys)) return null;
    const base = v * f, [lab, k] = TARGET[q](base, sys), out = base * k;
    return [fmt(out, Math.max(DEC[lab] ? DEC[lab](out) : 1, q === "dist" ? Math.min(decs(numTxt), 1) : 0)), lab];
  }
  const UNIT_RX = Object.keys(U).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&").replace(/ /g, "\\s?")).join("|");
  const RANGE = `(${NUM})(?:\\s?[–-]\\s?(${NUM}))?`;
  const PAIR = new RegExp(`${RANGE}\\s?(${UNIT_RX})\\s?\\(\\s?${RANGE}\\s?(${UNIT_RX})\\s?\\)`, "g");
  const SINGLE = new RegExp(`(^|[^\\w.,])${RANGE}(\\s?)(${UNIT_RX})(?![\\w·/])`, "g");
  const normUnit = s => Object.keys(U).find(k => k === s || k === s.replace(/\s/g, " ")) || Object.keys(U).find(k => k.replace(/\s/g, "") === s.replace(/\s/g, ""));
  const pick = (a, b, u) => { const r1 = conv(a, u); if (!r1) return null; const r2 = b != null ? conv(b, u) : null; return [r1[0] + (r2 ? "–" + r2[0] : ""), r1[1]]; };
  function units(s) {
    if (!/\d/.test(s)) return unitWords(s);
    // "3.0 US qt (2.8 L)": keep the side that matches, or convert the first side
    s = s.replace(PAIR, (m, a1, a2, u1, b1, b2, u2) => {
      const k1 = normUnit(u1), k2 = normUnit(u2); if (!k1 || !k2 || U[k1][0] !== U[k2][0]) return m;
      if (sameUnit(U[k1][0], U[k1][1])) return `${a1}${a2 ? "–" + a2 : ""} ${u1}`;
      if (sameUnit(U[k2][0], U[k2][1])) return `${b1}${b2 ? "–" + b2 : ""} ${u2}`;
      const r = pick(a1, a2, k1); return r ? `${r[0]} ${r[1]}` : m;
    });
    s = s.replace(SINGLE, (m, pre, a, b, sp, u) => {
      const k = normUnit(u); if (!k) return m;
      if (k === "in") return m;                       // a bare "in" is usually the word "in"; only "in." and "inches" are lengths
      if ((k === "L" || k === "bar" || k === "lb" || k === "kg") && /[A-Za-z]/.test(pre)) return m;
      // US units are how Revora always showed things: a lone "320 mm" stays as written unless metric is picked
      const q = U[k][0], usTarget = { dist: ST.dist === "mi", vol: ST.vol === "qt", press: ST.press === "psi", torque: ST.torque === "lbft", temp: ST.temp === "F", len: ST.len === "in", wt: ST.wt === "lb", speed: ST.dist === "mi", econ: ST.dist === "mi" }[q];
      if (usTarget) return m;
      {
        const r = pick(a, b, k); return r ? pre + r[0] + (sp || (r[1].length > 2 || /^[a-z]/i.test(r[1]) ? " " : "")) + r[1] : m;
      }
      return m;
    });
    return unitWords(s);
  }
  // unit words without a number: "Odometer (miles)", "Per mile", "Gallons"
  function unitWords(s) {
    if (ST.dist === "km" && /mile/i.test(s)) s = s.replace(/\b(M|m)iles\b(?! per)/g, (m, c) => c === "M" ? "Kilometers" : "km").replace(/\b(P|p)er mile\b/g, "$1er km").replace(/\b(M|m)ile\b/g, (m, c) => c === "M" ? "Kilometer" : "km");
    if (ST.vol === "L" && /gallon|quart/i.test(s)) s = s.replace(/\b(G|g)allons\b/g, (m, c) => c === "G" ? "Liters" : "liters").replace(/\b(G|g)allon\b/g, (m, c) => c === "G" ? "Liter" : "liter").replace(/\b(Q|q)uarts\b/g, (m, c) => c === "Q" ? "Liters" : "liters");
    if (ST.dist === "km" && /\bMPG\b|miles per gallon/i.test(s)) s = s.replace(/\bMPG\b/g, ST.vol === "L" ? "L/100 km" : "km/L").replace(/\b(M|m)iles per gallon\b/g, (m, c) => (c === "M" ? "F" : "f") + "uel use" + (ST.vol === "L" ? " (L/100 km)" : " (km/L)"));
    return s;
  }
  // the same words once translated
  const WORDS = {
    dist: { es: [[/\bmillas\b/g, "km"], [/\bmilla\b/g, "km"]], fr: [[/\bmiles\b/g, "km"], [/\bmile\b/g, "km"]], de: [[/\bMeilen\b/g, "Kilometer"], [/\bMeile\b/g, "Kilometer"]], pt: [[/\bmilhas\b/g, "km"], [/\bmilha\b/g, "km"], [/\bMilhagem\b/g, "Quilometragem"]], it: [[/\bmiglia\b/g, "km"], [/\bmiglio\b/g, "km"]], ja: [[/マイル/g, "km"]] },
    vol: { es: [[/\bgalones\b/g, "litros"], [/\bgalón\b/g, "litro"], [/\bGalones\b/g, "Litros"]], fr: [[/\bgallons\b/g, "litres"], [/\bgallon\b/g, "litre"], [/\bGallons\b/g, "Litres"]], de: [[/\bGallonen\b/g, "Liter"], [/\bGallone\b/g, "Liter"]], pt: [[/\bgalões\b/g, "litros"], [/\bgalão\b/g, "litro"], [/\bGalões\b/g, "Litros"]], it: [[/\bgalloni\b/g, "litri"], [/\bgallone\b/g, "litro"], [/\bGalloni\b/g, "Litri"]], ja: [[/ガロン/g, "リットル"]] }
  };
  function langWords(s) {
    if (ST.lang === "en") return s;
    if (ST.dist === "km" && WORDS.dist[ST.lang]) WORDS.dist[ST.lang].forEach(([r, t]) => { s = s.replace(r, t); });
    if (ST.vol === "L" && WORDS.vol[ST.lang]) WORDS.vol[ST.lang].forEach(([r, t]) => { s = s.replace(r, t); });
    return s;
  }
  // number inputs: what to show in the box (rvIn) and what to save (rvOut), by field key
  const DIST_KEYS = new Set(["odometer", "miles", "nextMiles", "everyMiles", "lastMiles", "odo", "dueMiles", "startMiles", "endMiles", "intervalMiles"]);
  const VOL_KEYS = new Set(["gallons"]), PER_VOL_KEYS = new Set(["ppg"]);
  const fac = k => DIST_KEYS.has(k) && ST.dist === "km" ? 1.609344 : VOL_KEYS.has(k) && ST.vol === "L" ? 3.78541 : PER_VOL_KEYS.has(k) && ST.vol === "L" ? 1 / 3.78541 : 1;
  window.rvIn = (k, v) => { const f = fac(k); if (f === 1 || v === "" || v == null || !isFinite(+v) || +v === 0) return v; const x = +v * f; return Math.round(x * (PER_VOL_KEYS.has(k) ? 1000 : 100)) / (PER_VOL_KEYS.has(k) ? 1000 : 100); };
  window.rvOut = (k, v) => { const f = fac(k); if (f === 1 || v === "" || v == null || !isFinite(+v)) return v; return Math.round(+v / f * 1000) / 1000; };
  window.rvDist = v => { v = +v || 0; return Math.round(ST.dist === "km" ? v * 1.609344 : v).toLocaleString(locale()); };
  // forms read by name (shop check-in, odometer boxes): typed in km, saved in miles
  document.addEventListener("submit", e => {
    if (ST.dist !== "km" || !e.target || !e.target.querySelectorAll) return;
    e.target.querySelectorAll('input[name="miles"],input[name="odometer"],input[name="odo"]').forEach(i => { if (i.value !== "" && isFinite(+i.value)) i.value = rvOut("odometer", +i.value); });
  }, true);
  window.rvUnitOf = q => ({ dist: ST.dist === "km" ? "km" : "mi", vol: ST.vol === "L" ? "L" : "gal" })[q];

  // ---- currency: "$1,234.50" shows in the chosen currency's symbol and number style ----
  const CUR_RX = /(-)?\$\s?(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)/g, PRICE_AFTER = /^\s?(?:\/\s?(?:mo|month|yr|year|wk)\b|a month|per month|a year|per year)/;
  function money(s) {
    if (ST.cur === "USD" && ST.lang === "en") return s;
    if (s.indexOf("$") < 0) return s;
    return s.replace(CUR_RX, (m, neg, a, off, all) => {
      const after = all.slice(off + m.length); if (/^[\d,.]\d/.test(after) || PRICE_AFTER.test(after)) return m;   // Revora plan prices stay in dollars
      const d = ST.cur === "JPY" || ST.cur === "KRW" || ST.cur === "CLP" || ST.cur === "IDR" ? 0 : decs(a);
      try { return new Intl.NumberFormat(locale(), { style: "currency", currency: ST.cur, currencyDisplay: "narrowSymbol", minimumFractionDigits: d, maximumFractionDigits: d }).format((neg ? -1 : 1) * pnum(a)); } catch (e) { return m; }
    });
  }
  window.rvMoneyFmt = (v, d) => money((v < 0 ? "-" : "") + "$" + Math.abs(+v || 0).toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }));

  // ---- language ----
  let DICT = null, PAT = null;
  const norm = s => s.replace(/\s+/g, " ").trim();
  function setDict(d) {
    DICT = d || null; PAT = null;
    if (!d) return;
    PAT = {}; for (const k in d) if (k.indexOf("{n}") >= 0 || k.indexOf("{d}") >= 0) PAT[k] = d[k];
  }
  function loadLang(code, done) {
    if (code === "en") { setDict(null); done && done(); return; }
    const key = "rv.i18n." + code, ver = window.RV_BUILD || "";
    try { const c = JSON.parse(LS.get(key) || "null"); if (c && c.v === ver && c.d) { setDict(c.d); done && done(); return; } } catch (e) {}
    fetch("i18n/" + code + ".json?v=" + ver).then(r => r.ok ? r.json() : null).then(d => {
      if (!d) return; LS.set(key, JSON.stringify({ v: ver, d })); if (ST.lang === code) { setDict(d); done && done(); }
    }).catch(() => {});
  }
  const NUMS = /\d[\d,.]*/g;
  // dates on the page ("3 oct 2026", "Oct 3, 2026") stand in as {d} so "last {d}" still matches
  let DATE_RX = null, DATE_FOR = "";
  function dateRx() {
    if (DATE_FOR === locale()) return DATE_RX;
    DATE_FOR = locale(); const alts = new Set();
    const esc2 = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (let m = 0; m < 12; m++) {
      const d = new Date(2026, m, 15, 12);
      [{ month: "short", day: "numeric", year: "numeric" }, { month: "short", day: "numeric" }, { month: "long", year: "numeric" }, { month: "long", day: "numeric", year: "numeric" }].forEach(o => {
        try { const f = d.toLocaleDateString(locale(), o); alts.add(esc2(f).replace("2026", "\\d{4}").replace(/15/, "\\d{1,2}")); } catch (e) {}
      });
    }
    DATE_RX = new RegExp("(" + [...alts].sort((a, b) => b.length - a.length).join("|") + ")", "g");
    return DATE_RX;
  }
  // one piece of text: exact, then with numbers as {n}, then "Label:" / "Label…"
  function look(core) {
    let out = DICT[core];
    if (out == null && /\d/.test(core) && PAT) {
      const dates = [], c2 = core.replace(dateRx(), x => { dates.push(x); return "\u0001"; });
      const nums = c2.match(NUMS), t = PAT[c2.replace(NUMS, "{n}").replace(/\u0001/g, "{d}")];
      if (t) { let i = 0, j = 0; out = t.replace(/\{(\d+)\}/g, (x, k) => (nums || [])[k - 1] || "").replace(/\{n\}/g, () => (nums || [])[i++] || "").replace(/\{d\}/g, () => dates[j++] || ""); }   // {2} picks a number by position when a language orders them differently
    }
    if (out == null) { const m = core.match(/^(.*?)([:…?.!]+)$/); if (m && m[1] && DICT[m[1]] != null) out = DICT[m[1]] + m[2]; }
    return out;
  }
  const PREFIX = ["Builds on Part", "Status of", "Waits on"];
  function tr(s) {
    if (!DICT) return s;
    const core = norm(s); if (!core || core.length > 600) return s;
    let out = look(core);
    if (out == null) {   // "Status of B-3", "Waits on F-1 F-2"
      const pf = PREFIX.find(x => core.startsWith(x + " ") && DICT[x] != null);
      if (pf) out = DICT[pf] + core.slice(pf.length);
    }
    if (out == null && core.indexOf(" · ") >= 0 || out == null && core.startsWith("· ")) {   // "Part 3 · Engine service"
      const parts = core.split(/( · |^· )/); let hit = false;
      const res = parts.map(x => { if (!x || x === " · " || x === "· ") return x; const t = look(x); if (t != null) { hit = true; return t; } return x; }).join("");
      if (hit) out = res;
    }
    if (out == null && core.indexOf(": ") > 0) {   // "Fuel & air: 2/4 tasks"
      const i = core.indexOf(": "), a = core.slice(0, i), b = core.slice(i + 2), ta = look(a), tb = look(b);
      if (ta != null || tb != null) out = (ta != null ? ta : a) + (ST.lang === "fr" ? " : " : ": ") + (tb != null ? tb : b);
    }
    if (out == null) {   // screen-reader labels: "Mark Frame as", "Frame, Owned"
      let m = core.match(/^Mark (.+) as$/);
      if (m && DICT["Mark {x} as"] != null) { const t = look(m[1]); out = DICT["Mark {x} as"].replace("{x}", t != null ? t : m[1]); }
      else if ((m = core.match(/^(.+), ([^,]+)$/))) { const ta = look(m[1]), tb = look(m[2]); if (ta != null && tb != null) out = ta + ", " + tb; }
    }
    if (out == null) return s;
    const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
    return lead + out + trail;
  }
  window.rvT = s => langWords(units(money(tr(String(s)))));   // for code that builds text outside the page (alerts, file names)
  window.rvLang = () => ST.lang;
  window.rvLocale = () => locale();

  // ---- applying it to the page ----
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE", "NOSCRIPT", "SELECT"]);
  const memo = new WeakMap();
  const quiet = () => ST.lang === "en" && ST.cur === "USD" && ST.dist === "mi" && ST.vol === "qt" && ST.press === "psi" && ST.torque === "lbft" && ST.temp === "F" && ST.len === "in" && ST.wt === "lb";
  function skipEl(el) {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (SKIP.has(e.tagName) && e.tagName !== "SELECT") return true;
      if (e.isContentEditable || e.getAttribute("translate") === "no" || e.hasAttribute("data-noconv")) return true;
    }
    return false;
  }
  function fixText(node) {
    const p = node.parentElement; if (!p) return;
    let m = memo.get(node);
    if (m && node.data === m.out) { if (m.st === stamp) return; }
    else m = { orig: node.data };
    if (!/\S/.test(m.orig) || skipEl(p)) { memo.set(node, { orig: m.orig, out: node.data, st: stamp }); return; }
    const out = quiet() ? m.orig : langWords(units(money(tr(m.orig))));
    m.out = out; m.st = stamp; memo.set(node, m);
    if (node.data !== out) node.data = out;
  }
  const ATTRS = ["placeholder", "title", "aria-label"];
  function fixAttrs(el) {
    if (el.nodeType !== 1 || el.hasAttribute("data-noconv")) return;
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a), key = "data-o-" + a;
      let orig = el.getAttribute(key);
      if (orig == null || (cur !== el._rvA?.[a])) { orig = cur; el.setAttribute(key, orig); }
      let out = quiet() ? orig : langWords(units(money(tr(orig))));
      if (a === "placeholder" && ST.dist === "km" && /^(miles|odometer|odo)$/.test(el.name || "") && /^[\d,]+$/.test(orig)) out = rvDist(pnum(orig));
      el._rvA = el._rvA || {}; el._rvA[a] = out;
      if (cur !== out) el.setAttribute(a, out);
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { fixText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (SKIP.has(root.tagName) && root.tagName !== "SELECT") { if (root.tagName === "INPUT" || root.tagName === "TEXTAREA") fixAttrs(root); return; } fixAttrs(root); }
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => n.nodeType === 1 && (n.tagName === "SCRIPT" || n.tagName === "STYLE" || n.tagName === "TEXTAREA" || n.tagName === "CODE" || n.tagName === "PRE" || n.getAttribute("translate") === "no" || n.hasAttribute("data-noconv")) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while ((n = tw.nextNode())) { if (n.nodeType === 3) fixText(n); else fixAttrs(n); }
  }
  let stamp = 1, titleOrig = null;
  function fixTitle() {
    if (titleOrig == null || document.title !== fixTitle.last) titleOrig = document.title;
    const out = quiet() ? titleOrig : tr(titleOrig); fixTitle.last = out; if (document.title !== out) document.title = out;
  }
  function refreshAll() {
    stamp++;
    document.documentElement.lang = ST.lang;
    walk(document.body); fixTitle(); addGears();
    if (typeof scheduleRender === "function") { try { scheduleRender(); } catch (e) {} }
  }
  const mo = new MutationObserver(list => {
    for (const r of list) {
      if (r.type === "characterData") fixText(r.target);
      else if (r.type === "attributes") { if (ATTRS.includes(r.attributeName) && r.target._rvA && r.target.getAttribute(r.attributeName) !== r.target._rvA[r.attributeName]) fixAttrs(r.target); }
      else r.addedNodes.forEach(walk);
    }
    addGears();
  });

  // ---- the gear and its panel ----
  const GEAR = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/></svg>';
  function addGears() {
    document.querySelectorAll(".top-r, .pk-top, .ld-top").forEach(bar => {
      if (bar.querySelector(":scope > .rv-gear")) { if (bar.lastElementChild.classList.contains("rv-gear")) return; bar.appendChild(bar.querySelector(":scope > .rv-gear")); return; }
      const b = document.createElement("button");
      b.type = "button"; b.className = "rv-gear"; b.setAttribute("aria-label", "Settings"); b.title = "Settings"; b.innerHTML = GEAR;
      b.onclick = e => { e.stopPropagation(); openPanel(); };
      bar.appendChild(b);
    });
  }
  const css = `.rv-gear{all:unset;box-sizing:border-box;cursor:pointer;width:38px;height:38px;border-radius:10px;display:grid;place-items:center;border:1px solid var(--line-2,#D6DDE1);color:inherit;flex:none}
.rv-gear:hover{background:var(--panel,#EEF6FA)}.rv-gear:focus-visible{outline:2px solid var(--blue-ink,#2C5F7C);outline-offset:2px}
.pk-top,.ld-top{justify-content:flex-start!important}.pk-top>.pk-logo,.ld-top>.pk-logo{margin-right:auto}
.rv-set-bg{position:fixed;inset:0;background:rgba(10,16,20,.45);z-index:10000;display:flex;justify-content:flex-end}
.rv-set{background:var(--surface,#fff);color:var(--fg,#0E1114);width:min(420px,100%);height:100%;overflow:auto;box-shadow:var(--shadow-lg);padding:20px 20px 32px;box-sizing:border-box;display:flex;flex-direction:column;gap:18px;font-size:14.5px}
.rv-set h2{margin:0;font-size:20px}.rv-set h3{margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#4A545C)}
.rv-set-h{display:flex;align-items:center;justify-content:space-between;gap:10px}.rv-set-x{all:unset;cursor:pointer;width:34px;height:34px;display:grid;place-items:center;border-radius:8px;font-size:22px;line-height:1}.rv-set-x:hover{background:var(--panel)}
.rv-set section{border-top:1px solid var(--line,#E9EDEF);padding-top:16px}
.rv-set select{width:100%;box-sizing:border-box;padding:9px 10px;border:1px solid var(--line-2,#D6DDE1);border-radius:9px;background:var(--surface,#fff);color:inherit;font:inherit}
.rv-set .rv-row{display:grid;grid-template-columns:1fr 1.25fr;gap:10px;align-items:center;margin-top:8px}.rv-set .rv-row label{color:var(--muted)}
.rv-seg{display:flex;gap:6px;flex-wrap:wrap}.rv-seg button{all:unset;cursor:pointer;padding:8px 13px;border:1px solid var(--line-2,#D6DDE1);border-radius:999px;font-size:13.5px}
.rv-seg button.on{background:var(--navy,#111418);color:#fff;border-color:var(--navy,#111418)}:root[data-theme="dark"] .rv-seg button.on{background:var(--blue-ink);color:#12191F;border-color:var(--blue-ink)}
.rv-set .rv-note{margin:8px 0 0;color:var(--faint,#7D878E);font-size:12.5px;line-height:1.45}
.rv-set .rv-more{all:unset;cursor:pointer;color:var(--blue-ink,#2C5F7C);text-decoration:underline;font-size:13.5px}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const sel = (id, opts, cur, noTr) => `<select id="${id}"${noTr ? ' translate="no"' : ""}>${opts.map(([v, l]) => `<option value="${esc(v)}"${v === cur ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  const themeNow = () => LS.get("rv.theme") || "light";
  function setTheme(t) {
    if (typeof themeSet === "function") { themeSet(t); return; }
    LS.set("rv.theme", t); if (window.rvPrefs && !window.RV_DEMO) { try { rvPrefs.set({ theme: t }); } catch (e) {} }
    const dark = t === "dark" || (t === "system" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }
  function presetOf() { for (const k in PRESETS) if (UNIT_ROWS.every(([q]) => PRESETS[k][q] === ST[q])) return k; return ""; }
  function panelHtml() {
    const pr = presetOf(), th = themeNow(), inApp = typeof VIEWS === "object" && VIEWS && VIEWS.settings && typeof go === "function";
    return `<div class="rv-set" role="dialog" aria-modal="true" aria-labelledby="rvSetH">
      <div class="rv-set-h"><h2 id="rvSetH">Settings</h2><button type="button" class="rv-set-x" data-rvx aria-label="Close">×</button></div>
      <section><h3>Language</h3>${sel("rvLang", LANGS.map(l => [l[0], l[1]]), ST.lang, true)}</section>
      <section><h3>Units</h3>
        <div class="rv-seg" role="radiogroup" aria-label="Unit system">${[["us", "US"], ["uk", "UK"], ["metric", "Metric"]].map(([k, l]) => `<button type="button" role="radio" aria-checked="${pr === k}" class="${pr === k ? "on" : ""}" data-rvpreset="${k}">${l}</button>`).join("")}</div>
        ${UNIT_ROWS.map(([q, l, opts]) => `<div class="rv-row"><label for="rvU-${q}">${l}</label>${sel("rvU-" + q, opts, ST[q])}</div>`).join("")}
        <p class="rv-note">Everything you've logged stays the same. It's shown in these units, and new numbers you type are read in them too.</p></section>
      <section><h3>Currency</h3>${sel("rvCur", CURS.map(([c, n]) => [c, c + " · " + curName(c, n)]), ST.cur, true)}
        <p class="rv-note">Changes the symbol and number style. Amounts aren't converted, so prices you typed stay as you typed them. Revora plan prices stay in US dollars.</p></section>
      <section><h3>Appearance</h3><div class="rv-seg" role="radiogroup" aria-label="Theme">${[["light", "Light"], ["dark", "Dark"], ["system", "Match my device"]].map(([v, l]) => `<button type="button" role="radio" aria-checked="${th === v}" class="${th === v ? "on" : ""}" data-rvtheme="${v}">${l}</button>`).join("")}</div></section>
      ${inApp ? `<section><button type="button" class="rv-more" data-rvmore>Bike settings, budget and backups</button></section>` : ""}
    </div>`;
  }
  const curName = (c, n) => { try { return ST.lang === "en" ? n : new Intl.DisplayNames([locale()], { type: "currency" }).of(c); } catch (e) { return n; } };
  let lastFocus = null;
  function openPanel() {
    closePanel(); lastFocus = document.activeElement;
    const bg = document.createElement("div"); bg.className = "rv-set-bg"; bg.id = "rvSettings"; bg.innerHTML = panelHtml();
    document.body.appendChild(bg); bindPanel(bg);
    const x = bg.querySelector("[data-rvx]"); x && x.focus();
  }
  function closePanel() { const o = document.getElementById("rvSettings"); if (o) { o.remove(); if (lastFocus && lastFocus.focus) lastFocus.focus(); } }
  function redraw() { const o = document.getElementById("rvSettings"); if (!o) return; const sc = o.querySelector(".rv-set").scrollTop; o.innerHTML = panelHtml(); bindPanel(o); o.querySelector(".rv-set").scrollTop = sc; }
  function bindPanel(bg) {
    bg.onclick = e => { if (e.target === bg) closePanel(); };
    bg.onkeydown = e => { if (e.key === "Escape") closePanel(); };
    bg.querySelector("[data-rvx]").onclick = closePanel;
    bg.querySelector("#rvLang").onchange = e => { const v = e.target.value; save({ lang: v }); loadLang(v, () => { refreshAll(); redraw(); }); };
    bg.querySelectorAll("[data-rvpreset]").forEach(b => b.onclick = () => { save(Object.assign({}, PRESETS[b.dataset.rvpreset])); refreshAll(); redraw(); });
    UNIT_ROWS.forEach(([q]) => { bg.querySelector("#rvU-" + q).onchange = e => { save({ [q]: e.target.value }); refreshAll(); redraw(); }; });
    bg.querySelector("#rvCur").onchange = e => { save({ cur: e.target.value }); refreshAll(); };
    bg.querySelectorAll("[data-rvtheme]").forEach(b => b.onclick = () => { setTheme(b.dataset.rvtheme); redraw(); });
    const more = bg.querySelector("[data-rvmore]"); if (more) more.onclick = () => { closePanel(); go("settings"); };
  }
  window.rvOpenSettings = openPanel;
  // for checking coverage: text on the page that has no translation yet
  window.__rvMissing = () => { const out = new Set(); const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())) { const m = memo.get(n); if (!m || skipEl(n.parentElement)) continue; const o = norm(m.orig); if (/[A-Za-z]{3}/.test(o) && tr(m.orig) === m.orig) out.add(o); }
    document.querySelectorAll("[data-o-placeholder],[data-o-title],[data-o-aria-label]").forEach(el => ATTRS.forEach(a => { const o = el.getAttribute("data-o-" + a); if (o && /[A-Za-z]{3}/.test(o) && tr(o) === o) out.add(norm(o)); }));
    return [...out]; };

  // ---- start ----
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  function start() {
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    new MutationObserver(fixTitle).observe(document.querySelector("title") || document.head, { childList: true, characterData: true, subtree: true });
    refreshAll();
  }
  loadLang(ST.lang, () => { if (document.body) refreshAll(); });
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
