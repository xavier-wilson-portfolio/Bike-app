/* ============ Value & selling: what the bike is worth, what it's cost, and a kit for selling it ============ */
GUIDE.value = { eyebrow: "Money", title: "Value & selling", sub: "What the bike is worth today, what you've put into it, and everything you need to sell it.",
  how: ["Add what you paid and the bike's condition.", "Add a few listings of the same bike you've found for sale. The more you add, the closer the estimate.", "When you're ready to sell, copy the listing Revora writes from your records, and print a bill of sale."] };
const SALE = () => Object.assign({ paid: "", paidDate: "", condition: "Good", comps: [], history: [], asking: "", reason: "", extras: "", issues: "" }, meta().sale || {});
const COND = { Excellent: [.08, "Looks and runs like new. No dents, no leaks."], Good: [0, "Normal wear for its age. Runs right."], Fair: [-.12, "Scuffs, small leaks or jobs that need doing soon."], "Needs work": [-.3, "Doesn't run right, or needs real repairs."] };
const usd0 = v => "$" + Math.round(+v || 0).toLocaleString("en-US");
const median = a => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : 0; };

// what's gone into the bike: what it cost to buy, plus services, mods and project expenses
function saleSpent() {
  const s = SALE(), svc = svcDone().reduce((t, r) => t + svcCost(r), 0), mods = modsInstalled().reduce((t, m) => t + modCost(m), 0);
  const exp = sorted("expenses").filter(x => !x.example && x.status !== "Unpaid").reduce((t, x) => t + n(x.amount), 0);
  return { paid: n(s.paid), svc, mods, exp, total: n(s.paid) + svc + mods + exp };
}
// a rough value: listings of the same bike if there are any, otherwise what was paid, aged
function valueEstimate() {
  const s = SALE(), od = odoNow(), miles = od ? od.miles : 0, yr = +BIKE.year || 0, nowY = new Date().getFullYear(), age = yr ? Math.max(0, nowY - yr) : 0;
  const f = a => a >= 25 ? .82 * Math.pow(.91, 18) : a <= 0 ? 1 : .82 * Math.pow(.91, Math.min(a, 19) - 1);   // 25+ years: classic, holds its value
  const why = []; let base = 0, how = "";
  const comps = (s.comps || []).filter(c => n(c.price) > 0);
  if (comps.length) {
    const adj = comps.map(c => n(c.price) * (1 + (n(c.miles) && miles ? Math.max(-.15, Math.min(.15, (n(c.miles) - miles) / 1000 * .01)) : 0)));
    base = median(adj); how = comps.length === 1 ? "1 listing you added" : comps.length + " listings you added";
    why.push({ t: `Similar bikes for sale: ${usd0(Math.min(...comps.map(c => n(c.price))))} to ${usd0(Math.max(...comps.map(c => n(c.price))))}`, v: 0 });
  }
  if (n(s.paid) && s.paidDate) {
    const pa = yr ? Math.max(0, +String(s.paidDate).slice(0, 4) - yr) : 0, model = n(s.paid) * f(age) / f(pa);
    if (base) base = base * .75 + model * .25; else { base = model; how = "what you paid, aged by the year"; }
    if (!comps.length) why.push({ t: `Paid ${usd0(s.paid)} in ${String(s.paidDate).slice(0, 4)}${age >= 25 ? ". Bikes this old tend to hold their value" : ""}`, v: 0 });
  }
  if (!base) return null;
  let adj = 0;
  const c = COND[s.condition] || COND.Good; if (c[0]) { adj += c[0]; why.push({ t: s.condition + " condition", v: c[0] }); }
  if (yr && miles && !comps.length) { const exp = Math.max(1, age) * 3000, d = Math.max(-.15, Math.min(.1, (exp - miles) / 1000 * .01)); if (Math.abs(d) >= .01) { adj += d; why.push({ t: `${miles.toLocaleString("en-US")} miles, ${d > 0 ? "fewer" : "more"} than most bikes this age`, v: d }); } }
  const sc = typeof reportData === "function" ? reportData({ costs: true, vin: "none", photo: false, mods: false, restoration: false }).strength.score : 0;
  const rec = sc >= 75 ? .06 : sc >= 45 ? .03 : 0; if (rec) { adj += rec; why.push({ t: `Strong service records (score ${sc})`, v: rec }); }
  let out = base * (1 + adj);
  const modsV = Math.min(modsInstalled().reduce((t, m) => t + modCost(m), 0) * .35, base * .15);
  if (modsV >= 25) { out += modsV; why.push({ t: "Mods add about " + usd0(modsV) + " (buyers pay about a third of what mods cost)", v: modsV / base }); }
  const spread = comps.length >= 3 ? .07 : comps.length ? .1 : .15;
  return { mid: out, low: out * (1 - spread), high: out * (1 + spread), how, why, comps: comps.length, score: sc };
}
const roundTo = v => v >= 2000 ? Math.round(v / 50) * 50 : Math.round(v / 10) * 10;

// listing text from the records
function listingText(kind, v, links) {
  const s = SALE(), m = meta(), od = odoNow(), done = svcDone().sort((a, b) => String(b.date).localeCompare(String(a.date))), mods = modsInstalled();
  const name = m.bike || BIKE.name, miles = od ? Math.round(od.miles).toLocaleString("en-US") + " miles" : "", price = n(s.asking) || (v ? roundTo(v.high * 1.03) : 0);
  const recent = done.filter(r => daysBetween(r.date, today()) <= 400).slice(0, 5).map(r => `${r.service} (${fmtMonth(r.date)})`);
  const modList = mods.slice(0, 10).map(x => (x.brand ? x.brand + " " : "") + x.name);
  const rcpt = done.filter(r => r.receipt || r.receiptDoc).length, kept = mods.filter(x => x.stockKept === "Kept").map(x => x.replaced).filter(Boolean);
  const dot = t => { t = String(t || "").trim(); return t && !/[.!?]$/.test(t) ? t + "." : t; };
  const lines = [];
  if (kind === "title") return [BIKE.year, BIKE.make, BIKE.model, miles ? "· " + miles : "", mods.length ? "· " + (mods.length === 1 ? modList[0] : mods.length + " upgrades") : "", done.length >= 3 ? "· full service records" : ""].filter(Boolean).join(" ").slice(0, 80);
  const short = kind === "short";
  lines.push(`${name}${miles ? ", " + miles : ""}${price ? ". Asking " + usd0(price) : ""}.`);
  if (s.reason) lines.push(dot(s.reason));
  if (!GENERIC && m.roadReady) lines.push("Fully restored and back on the road.");
  if (s.condition && COND[s.condition]) lines.push(`Condition: ${s.condition.toLowerCase()}. ${COND[s.condition][1]}`);
  if (done.length) lines.push(short ? `${done.length} services logged${rcpt ? `, receipts for ${rcpt}` : ""}.` : `Every service is logged: ${done.length} so far${rcpt ? `, with receipts for ${rcpt} of them` : ""}.`);
  if (recent.length) lines.push(short ? "Recent work: " + recent.slice(0, 3).join(", ") + "." : "Recent work:\n" + recent.map(x => "- " + x).join("\n"));
  if (modList.length) lines.push(short ? "Mods: " + modList.slice(0, 5).join(", ") + (modList.length > 5 ? " and more" : "") + "." : "Mods:\n" + modList.map(x => "- " + x).join("\n"));
  if (kept.length && !short) lines.push("I still have the stock " + kept.join(" and ").toLowerCase() + (kept.length === 1 ? ", and it goes" : ", and they go") + " with the bike.");
  if (s.extras) lines.push((short ? "Comes with: " : "Also comes with: ") + dot(s.extras));
  if (s.issues && !short) lines.push("Things to know: " + dot(s.issues));
  if (links.report) lines.push((short ? "Full history: " : "The full service history, with every receipt and odometer reading, is here: ") + links.report);
  if (links.build && !short) lines.push("Photos and the build story: " + links.build);
  lines.push(short ? "Title in hand. Message me with questions." : "Clean title in hand. Happy to answer questions or send more photos. Serious buyers can come see it and take it for a test ride with cash in hand.");
  return lines.join(short ? " " : "\n\n");
}
const fmtMonth = d => { const x = new Date(String(d).slice(0, 10) + "T12:00:00"); return isNaN(x) ? "" : x.toLocaleDateString("en-US", { month: "short", year: "numeric" }); };

function valueChart(v) {
  const s = SALE(), H = (s.history || []).filter(h => h.date && n(h.value) > 0).sort((a, b) => a.date.localeCompare(b.date));
  const evs = [].concat(s.paidDate && n(s.paid) ? [{ date: s.paidDate, amt: n(s.paid) }] : [], svcDone().map(r => ({ date: r.date, amt: svcCost(r) })), modsInstalled().filter(x => x.date).map(x => ({ date: x.date, amt: modCost(x) })),
    sorted("expenses").filter(x => !x.example && x.date && x.status !== "Unpaid").map(x => ({ date: x.date, amt: n(x.amount) }))).filter(e => e.amt > 0).sort((a, b) => a.date.localeCompare(b.date));
  let run = 0; const spent = evs.map(e => ({ date: e.date, y: run += e.amt }));
  const val = H.map(h => ({ date: h.date, y: n(h.value) })); if (v && (!val.length || val[val.length - 1].date !== today())) val.push({ date: today(), y: v.mid });
  if (spent.length) spent.push({ date: today(), y: run });
  const pts = spent.concat(val); if (pts.length < 2) return "";
  const W = 640, Ht = 190, P = 46, t = d => new Date(d + "T12:00:00").getTime(), t0 = Math.min(...pts.map(p => t(p.date))), t1 = Math.max(t0 + 864e5 * 30, ...pts.map(p => t(p.date)));
  const y1 = Math.max(...pts.map(p => p.y)) * 1.1, X = p => P + (t(p.date) - t0) / (t1 - t0) * (W - P - 16), Y = p => Ht - 26 - p.y / y1 * (Ht - 44);
  const path = (a, step) => a.map((p, i) => i ? (step ? `H${X(p).toFixed(1)}V${Y(p).toFixed(1)}` : `L${X(p).toFixed(1)} ${Y(p).toFixed(1)}`) : `M${X(p).toFixed(1)} ${Y(p).toFixed(1)}`).join("");
  const ticks = [0, .5, 1].map(f => y1 / 1.1 * f);
  return `<svg class="vl-chart" viewBox="0 0 ${W} ${Ht}" role="img" aria-label="Money put into the bike compared with its estimated value">
    ${ticks.map(v2 => `<line x1="${P}" x2="${W - 16}" y1="${Y({ y: v2 }).toFixed(1)}" y2="${Y({ y: v2 }).toFixed(1)}" class="g"/><text x="${P - 6}" y="${(Y({ y: v2 }) + 4).toFixed(1)}" text-anchor="end" class="lb">${v2 >= 1000 ? "$" + (v2 / 1000).toFixed(v2 >= 10000 ? 0 : 1) + "k" : "$" + Math.round(v2)}</text>`).join("")}
    ${spent.length > 1 ? `<path d="${path(spent, true)}" class="sp"/>` : ""}${val.length > 1 ? `<path d="${path(val)}" class="vv"/>` : ""}
    ${val.map(p => `<circle cx="${X(p).toFixed(1)}" cy="${Y(p).toFixed(1)}" r="4" class="vp"/>`).join("")}
    <text x="${P}" y="${Ht - 6}" class="lb">${esc(fmtMonth(new Date(t0).toISOString().slice(0, 10)))}</text><text x="${W - 16}" y="${Ht - 6}" text-anchor="end" class="lb">Today</text></svg>
    <div class="vl-key"><span><i class="sp"></i>Put into the bike</span><span><i class="vv"></i>Estimated value</span></div>`;
}

function compLinks() {
  const q = encodeURIComponent([BIKE.year, BIKE.make, BIKE.model].filter(Boolean).join(" ")), mk = encodeURIComponent(BIKE.make || ""), mdl = encodeURIComponent(BIKE.model || "");
  return [["eBay sold listings", `https://www.ebay.com/sch/i.html?_nkw=${q}&_sacat=6024&LH_Sold=1&LH_Complete=1`, "What bikes like yours actually sold for"],
    ["Cycle Trader", `https://www.cycletrader.com/motorcycles-for-sale?keyword=${q}`, "Dealer and private listings"],
    ["Facebook Marketplace", `https://www.facebook.com/marketplace/search/?query=${q}`, "Local private sales"],
    ["J.D. Power (NADA) values", `https://www.jdpower.com/motorcycles`, "Book values by year and model"],
    ["Kelley Blue Book", `https://www.kbb.com/motorcycles/`, "Trade-in and private-party values"]];
}

let SALE_LINKS = null;
async function loadSaleLinks() {
  SALE_LINKS = {};
  if (!window.RV_CLOUD) return;
  const [r, b] = await Promise.all([RV_CLOUD.sb.from("shared_reports").select("id,created_at").eq("project_id", RV_CLOUD.projectId).order("created_at", { ascending: false }),
    RV_CLOUD.sb.from("shared_builds").select("id").eq("project_id", RV_CLOUD.projectId).maybeSingle()]);
  if (r.data && r.data[0]) SALE_LINKS.report = repUrl(r.data[0].id);
  if (b.data && b.data.id) SALE_LINKS.build = bpUrl(b.data.id);
  if (R.sec === "value") render(false);
}

VIEWS.value = {
  render() {
    const s = SALE(), W = ME.canWrite, v = valueEstimate(), sp = saleSpent(), tab = R.tab.value || "worth";
    if (SALE_LINKS === null) loadSaleLinks();
    const links = SALE_LINKS || {}, dis = W ? "" : "disabled";
    const tabs = `<div class="seg vl-tabs" role="tablist">${[["worth", "What it's worth"], ["sell", "Selling kit"]].map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? "on" : ""}" data-vt="${k}">${l}</button>`).join("")}</div>`;
    const head = `<div class="ph" data-own="1"><div class="eyebrow">Money</div><h1>Value & selling</h1><p>What the bike is worth today, what you've put into it, and everything you need to sell it.</p></div>${tabs}`;
    if (tab === "sell") {
      const asking = n(s.asking) || (v ? roundTo(v.high * 1.03) : 0);
      const L = { title: listingText("title", v, links), short: listingText("short", v, links), long: listingText("long", v, links) };
      const box = (k, t, sub) => `<section class="mh-panel vl-list"><div class="mh-ph"><h2>${t}</h2><button class="btn sm" data-vcopy="${k}">${ic("copy")} Copy</button></div><p class="faint vl-sub">${sub}</p><pre class="vl-text" id="vl-${k}">${esc(L[k])}</pre></section>`;
      return head + `<div class="vl-grid">
        <div class="stack">${box("title", "Listing title", "For eBay, Cycle Trader and forums. Up to 80 characters.")}${box("short", "Short listing", "For Facebook Marketplace and texts.")}${box("long", "Full listing", "For Craigslist, forums and eBay.")}</div>
        <aside class="stack">
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("dollar")}</span>Your asking price</h2></div>
            <label class="bp-f"><b>Asking price</b><input type="number" min="0" step="50" id="vlAsk" value="${esc(s.asking)}" placeholder="${asking ? roundTo(asking) : "e.g. 4500"}" ${dis}></label>
            ${v ? `<p class="faint" style="margin:0;font-size:13px">Estimated value ${usd0(roundTo(v.low))} to ${usd0(roundTo(v.high))}. Most sellers ask a little over the top of the range to leave room to haggle${asking && !n(s.asking) ? `, so the listing uses ${usd0(asking)} until you set your own` : ""}.</p>` : `<p class="faint" style="margin:0;font-size:13px">Add what you paid or a few listings on the "What it's worth" tab to get a suggested price.</p>`}
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("book")}</span>Add to the listing</h2></div>
            <label class="bp-f"><b>Why you're selling</b><input id="vlReason" maxlength="200" value="${esc(s.reason)}" placeholder="e.g. Moving up to a bigger bike." ${dis}></label>
            <label class="bp-f"><b>What comes with it</b><input id="vlExtras" maxlength="300" value="${esc(s.extras)}" placeholder="e.g. Cover, tank bag, both keys, owner's manual" ${dis}></label>
            <label class="bp-f"><b>Anything a buyer should know</b><textarea id="vlIssues" rows="2" maxlength="400" placeholder="Being upfront saves time with buyers." ${dis}>${esc(s.issues)}</textarea></label>
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("send")}</span>Links buyers trust</h2></div>
            <div class="vl-links">
              <div class="${links.report ? "ok" : ""}"><b>History report</b><span>${links.report ? "In the listing" : "Not shared yet"}</span><button class="btn sm" data-goto="report">${links.report ? "Open" : "Make a link"}</button></div>
              <div class="${links.build ? "ok" : ""}"><b>Build page</b><span>${links.build ? "In the long listing" : "Not published yet"}</span><button class="btn sm" data-goto="build">${links.build ? "Open" : "Make one"}</button></div>
            </div>
            <p class="faint" style="margin:8px 0 0;font-size:13px">A bike with its full history on a link gets more messages from serious buyers.</p>
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("check")}</span>Before you sell</h2></div>
            <ul class="vl-check">${["Find the title and make sure it's in your name", "If there's a loan, get the lien release from the lender", "Wash it and take photos in daylight from both sides", "Have both keys and the owner's manual ready", "Meet buyers somewhere public, and only take cash or a cleared payment", "Print two copies of the bill of sale, one for each of you", "After the sale, cancel the insurance and tell the DMV it's sold"].map(t => `<li>${esc(t)}</li>`).join("")}</ul>
            <button class="btn tan" id="vlBos" style="margin-top:10px">${ic("download")} Make a bill of sale</button>
          </section>
        </aside>
      </div>`;
    }
    const gain = v ? v.mid - sp.total : 0, comps = s.comps || [];
    return head + `<div class="vl-grid">
      <div class="stack">
        <section class="vl-hero">
          ${v ? `<span class="vl-k">Estimated value today</span><b class="vl-big">${usd0(roundTo(v.low))} <span>to</span> ${usd0(roundTo(v.high))}</b>
            <span class="faint">Based on ${esc(v.how)}. ${v.comps >= 3 ? "" : "Add more listings to narrow it down."}</span>
            <ul class="vl-why">${v.why.map(w => `<li class="${w.v > 0 ? "vw-up" : w.v < 0 ? "vw-dn" : ""}">${w.v > 0 ? "+" : w.v < 0 ? "−" : "·"} ${esc(w.t)}${w.v ? ` <em>${w.v > 0 ? "+" : "−"}${Math.round(Math.abs(w.v) * 100)}%</em>` : ""}</li>`).join("")}</ul>`
            : `<span class="vl-k">Estimated value today</span><b class="vl-big vl-none">Not enough to go on yet</b><span class="faint">Add what you paid, or a couple of listings of the same bike you've seen for sale.</span>`}
        </section>
        <div class="vl-tiles">
          <div><span>Paid for the bike</span><b>${sp.paid ? usd0(sp.paid) : "—"}</b></div>
          <div><span>Services</span><b>${usd0(sp.svc)}</b></div>
          <div><span>Mods</span><b>${usd0(sp.mods)}</b></div>
          ${sp.exp ? `<div><span>Restoration costs</span><b>${usd0(sp.exp)}</b></div>` : ""}
          <div class="tot"><span>Total put in</span><b>${usd0(sp.total)}</b></div>
          ${v && sp.paid ? `<div class="${gain >= 0 ? "pos" : "neg"}"><span>${gain >= 0 ? "Worth more than you've put in" : "Cost of owning so far"}</span><b>${usd0(Math.abs(gain))}</b></div>` : ""}
        </div>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("dollar")}</span>Value over time</h2>${v && W ? `<button class="btn sm" id="vlSnap">Save today's value</button>` : ""}</div>
          ${valueChart(v) || `<p class="muted" style="margin:0">Once there's a value and a few costs, a chart shows what you've put in next to what the bike is worth.</p>`}</section>
      </div>
      <aside class="stack">
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("tag")}</span>The bike</h2></div>
          <div class="vl-two"><label class="bp-f"><b>What you paid</b><input type="number" min="0" step="50" id="vlPaid" value="${esc(s.paid)}" placeholder="e.g. 3800" ${dis}></label>
          <label class="bp-f"><b>When</b><input type="date" id="vlPaidD" value="${esc(s.paidDate)}" ${dis}></label></div>
          <div class="bp-f"><b>Condition</b><div class="vl-cond">${Object.entries(COND).map(([k, [, d]]) => `<button class="${s.condition === k ? "on" : ""}" data-vcond="${esc(k)}" title="${esc(d)}" ${dis}>${esc(k)}</button>`).join("")}</div><small class="faint">${esc((COND[s.condition] || COND.Good)[1])}</small></div>
        </section>
        <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("search")}</span>Bikes like yours for sale</h2>${W ? `<button class="btn sm" id="vlComp">${ic("plus")} Add</button>` : ""}</div>
          ${comps.length ? `<div class="vl-comps">${comps.map((c, i) => `<div><b>${usd0(c.price)}</b><span>${esc([c.year, c.miles ? n(c.miles).toLocaleString("en-US") + " mi" : "", c.where].filter(Boolean).join(" · "))}</span>${c.url && /^https?:\/\//.test(c.url) ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">View</a>` : ""}${W ? `<button class="linkbtn" data-vcdel="${i}" aria-label="Remove">Remove</button>` : ""}</div>`).join("")}</div>` : `<p class="muted" style="margin:0 0 8px">Look up a few bikes like yours and add their prices here. Sold prices are the best guide.</p>`}
          <div class="vl-look">${compLinks().map(([t, u, d]) => `<a href="${esc(u)}" target="_blank" rel="noopener"><b>${esc(t)}</b><span>${esc(d)}</span></a>`).join("")}</div>
        </section>
        <p class="faint" style="font-size:12.5px;margin:0">This is an estimate from what you've entered, not an appraisal. Prices vary a lot by area and season.</p>
      </aside>
    </div>`;
  },
  bind(root) {
    const save = async patch => { const mm = clone(meta()); mm.sale = Object.assign(SALE(), patch); await store.put("meta", mm, { noLog: true }); };
    $$("[data-vt]", root).forEach(b => b.onclick = () => { R.tab.value = b.dataset.vt; render(false); });
    const on = (id, k, f = x => x) => { const el = $(id, root); if (el) el.onchange = () => save({ [k]: f(el.value) }); };
    on("#vlPaid", "paid", x => x === "" ? "" : Math.max(0, +x)); on("#vlPaidD", "paidDate"); on("#vlAsk", "asking", x => x === "" ? "" : Math.max(0, +x));
    on("#vlReason", "reason", x => x.trim()); on("#vlExtras", "extras", x => x.trim()); on("#vlIssues", "issues", x => x.trim());
    $$("[data-vcond]", root).forEach(b => b.onclick = () => save({ condition: b.dataset.vcond }));
    $$("[data-vcdel]", root).forEach(b => b.onclick = () => { const c = SALE().comps.slice(); c.splice(+b.dataset.vcdel, 1); save({ comps: c }); });
    $$("[data-vcopy]", root).forEach(b => b.onclick = async () => { const t = $("#vl-" + b.dataset.vcopy, root).textContent; try { await navigator.clipboard.writeText(t); toast("Copied. Paste it into your listing."); } catch (e) { prompt("Copy this:", t); } });
    const snap = $("#vlSnap", root); if (snap) snap.onclick = () => { const v = valueEstimate(); if (!v) return; const h = (SALE().history || []).filter(x => x.date !== today()); h.push({ date: today(), value: Math.round(v.mid) }); save({ history: h.slice(-60) }).then(() => toast("Saved today's value. It shows on the chart.")); };
    const cb = $("#vlComp", root);
    if (cb) cb.onclick = () => modal(`<h3>Add a bike you found for sale</h3><p class="muted" style="margin-top:0">The same model, close to your year. Sold prices are the most accurate.</p>
      <div class="vl-two"><label class="bp-f"><b>Price</b><input type="number" min="1" id="cpP" required autofocus></label><label class="bp-f"><b>Miles</b><input type="number" min="0" id="cpM"></label></div>
      <div class="vl-two"><label class="bp-f"><b>Year</b><input type="number" min="1900" max="2100" id="cpY" value="${esc(BIKE.year || "")}"></label><label class="bp-f"><b>Where</b><input id="cpW" maxlength="40" placeholder="eBay sold, Marketplace…"></label></div>
      <label class="bp-f"><b>Link (optional)</b><input type="url" id="cpU" placeholder="https://"></label>
      <div class="row"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>Add</button></div>`, m => {
      m.querySelector("[data-x]").onclick = closeModal;
      m.querySelector("[data-ok]").onclick = () => { const p = +m.querySelector("#cpP").value; if (!(p > 0)) return toast("Enter the price.", "err");
        const u = m.querySelector("#cpU").value.trim();
        const c = { price: p, miles: +m.querySelector("#cpM").value || 0, year: +m.querySelector("#cpY").value || "", where: m.querySelector("#cpW").value.trim(), url: /^https?:\/\//.test(u) ? u : "", date: today() };
        closeModal(); save({ comps: SALE().comps.concat([c]).slice(-20) }); };
    });
    const bos = $("#vlBos", root); if (bos) bos.onclick = billOfSale;
  }
};

function billOfSale() {
  const s = SALE(), m = meta(), od = odoNow(), me = window.RV_CLOUD && RV_CLOUD.profile ? RV_CLOUD.profile.display_name || "" : "";
  modal(`<h3>Bill of sale</h3><p class="muted" style="margin-top:0">Fill in what you know. Blank lines print empty so you can write them in by hand.</p>
    <div class="vl-two"><label class="bp-f"><b>Seller</b><input id="bsS" value="${esc(me)}"></label><label class="bp-f"><b>Buyer</b><input id="bsB"></label></div>
    <div class="vl-two"><label class="bp-f"><b>Price</b><input type="number" id="bsP" value="${esc(s.asking || "")}"></label><label class="bp-f"><b>Date</b><input type="date" id="bsD" value="${today()}"></label></div>
    <div class="vl-two"><label class="bp-f"><b>VIN</b><input id="bsV" value="${esc(m.frameNo || "")}"></label><label class="bp-f"><b>Odometer</b><input type="number" id="bsO" value="${od ? Math.round(od.miles) : ""}"></label></div>
    <div class="vl-two"><label class="bp-f"><b>Color</b><input id="bsC" value="${esc(m.color || "")}"></label><label class="bp-f"><b>Plate (optional)</b><input id="bsL"></label></div>
    <p class="faint" style="font-size:12.5px">Some states want their own form. Check your state's DMV site too.</p>
    <div class="row"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>${ic("download")} Print</button></div>`, mm => {
    mm.querySelector("[data-x]").onclick = closeModal;
    mm.querySelector("[data-ok]").onclick = () => {
      const g = id => mm.querySelector(id).value.trim(), line = v => v ? esc(v) : "&nbsp;";
      const price = g("#bsP") ? usd0(+g("#bsP")) : "", d = g("#bsD") ? new Date(g("#bsD") + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
      const html = `<div class="bos"><h1>Motorcycle bill of sale</h1>
        <p>On <u>${line(d)}</u>, the seller named below sold the motorcycle described below to the buyer named below for <u>${line(price)}</u>, paid in full.</p>
        <table><tr><th>Year</th><td>${line(String(BIKE.year || ""))}</td><th>Make</th><td>${line(BIKE.make)}</td></tr><tr><th>Model</th><td>${line(BIKE.model)}</td><th>Color</th><td>${line(g("#bsC"))}</td></tr>
          <tr><th>VIN</th><td colspan="3">${line(g("#bsV"))}</td></tr><tr><th>Odometer</th><td>${g("#bsO") ? esc((+g("#bsO")).toLocaleString("en-US")) + " miles" : "&nbsp;"}</td><th>Plate</th><td>${line(g("#bsL"))}</td></tr></table>
        <p>The seller says they own the motorcycle, have the right to sell it, and that it is free of any loans or liens. The odometer reading above is correct to the best of the seller's knowledge.</p>
        <p>The motorcycle is sold as-is, with no warranty of any kind.</p>
        <div class="bos-sig"><div><span>${line(g("#bsS"))}</span><small>Seller's name</small></div><div><span>&nbsp;</span><small>Seller's signature and date</small></div></div>
        <div class="bos-sig"><div><span>${line(g("#bsB"))}</span><small>Buyer's name</small></div><div><span>&nbsp;</span><small>Buyer's signature and date</small></div></div>
        <div class="bos-sig"><div><span>&nbsp;</span><small>Buyer's address</small></div><div><span>&nbsp;</span><small>Buyer's phone</small></div></div></div>`;
      closeModal(); let host = $("#bosHost"); if (!host) { host = document.createElement("div"); host.id = "bosHost"; document.body.appendChild(host); }
      host.innerHTML = html; document.body.classList.add("printing-bos"); window.print(); setTimeout(() => { document.body.classList.remove("printing-bos"); host.innerHTML = ""; }, 800);
    };
  });
}
