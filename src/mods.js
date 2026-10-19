/* ============ Mods & upgrades: every non-stock part on the bike, what it cost, and where the stock part went ============ */
GUIDE.mods = { eyebrow: "Make it yours", title: "Mods & upgrades", sub: "Every aftermarket part on the bike: what it is, its part number, what it cost, when it went on, and where the stock part is.",
  how: ["Add each mod with its brand and part number so you can buy it again or prove what's fitted.", "Keep the stock part's number and where it's stored. Buyers and inspections often ask for it.", "Put things you want on the Wish list with a price and link, then mark them fitted when they go on."] };

const modCost = m => n(m.price) + n(m.labor);
const MOD_ICON = { Performance: "engine", Exhaust: "engine", "Intake & fuel": "fuel", Suspension: "wrench", Brakes: "shield", "Wheels & tires": "wheel", Lighting: "bulb", "Electrical & electronics": "bolt",
  "Controls & ergonomics": "gauge", Protection: "shield", Luggage: "box", Comfort: "users", Appearance: "spray", Other: "tune" };
const MOD_IDEAS = [["Exhaust", "Slip-on exhaust"], ["Lighting", "LED headlight"], ["Comfort", "Heated grips"], ["Protection", "Frame sliders"], ["Luggage", "Rear rack"], ["Suspension", "Rear shock"], ["Controls & ergonomics", "Handlebar risers"], ["Electrical & electronics", "USB charger"]];

function modsInstalled() { return sorted("mods").filter(m => m.status === "Installed"); }
function modsTotals() {
  const inst = modsInstalled(), wish = sorted("mods").filter(m => m.status === "Planned" || m.status === "Ordered");
  const y = String(new Date().getFullYear());
  return { inst, wish, total: inst.reduce((s, m) => s + modCost(m), 0), parts: inst.reduce((s, m) => s + n(m.price), 0), labor: inst.reduce((s, m) => s + n(m.labor), 0),
    year: inst.filter(m => String(m.date).startsWith(y)).reduce((s, m) => s + modCost(m), 0), wishCost: wish.reduce((s, m) => s + modCost(m), 0),
    kept: sorted("mods").filter(m => m.replaced && m.stockKept === "Kept" && m.status !== "Planned" && m.status !== "Ordered") };
}
const modSort = (a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));

function modCard(m) {
  const W = ME.canWrite, wish = m.status === "Planned" || m.status === "Ordered", c = modCost(m);
  const by = m.installedBy === "A shop" ? (m.shop || "A shop") : m.installedBy === "A friend" ? (m.shop || "A friend") : "Fitted myself";
  return `<article class="md-card ${wish ? "wish" : m.status === "Removed" ? "gone" : ""}">
    <span class="md-ico c${(MOD_CATS.indexOf(m.category) + 3) % 3}">${ic(MOD_ICON[m.category] || "tune")}</span>
    <div class="md-main">
      <div class="md-top"><button class="linkbtn md-name" data-open="mods|${esc(m.id)}">${esc(m.name)}</button>${m.status !== "Installed" ? `<span class="tag ${m.status === "Ordered" ? "md-ord" : ""}">${esc(m.status)}</span>` : ""}</div>
      <div class="md-meta">${[m.category ? `<span>${esc(m.category)}</span>` : "", m.brand ? `<span>${esc(m.brand)}</span>` : "", m.partNo ? `<span class="md-pn"><code>${esc(m.partNo)}</code><button class="md-copy" data-copy="${esc(m.partNo)}" aria-label="Copy part number ${esc(m.partNo)}" title="Copy">${ic("copy")}</button><button class="md-copy" data-buy="mods" data-q="${esc(m.partNo)}" aria-label="Shop for part ${esc(m.partNo)}" title="Shop for it">${ic("search")}</button></span>` : ""].filter(Boolean).join("")}</div>
      ${wish ? `<div class="md-sub">${[m.vendor ? "From " + esc(m.vendor) : "", m.notes ? esc(String(m.notes).slice(0, 90)) : ""].filter(Boolean).join(" · ") || `<span class="faint">Add where to buy it and a link</span>`}</div>`
        : `<div class="md-sub">${[m.date ? esc(fmtDate(m.date)) : "", n(m.odometer) ? milesFmt(m.odometer) + " mi" : "", esc(by)].filter(Boolean).join(" · ")}</div>`}
      ${m.replaced ? `<div class="md-stock">${ic("box")}<span>Replaced the stock ${esc(m.replaced)}${m.stockPartNo ? ` <code>${esc(m.stockPartNo)}</code>` : ""}${m.stockKept && m.stockKept !== "Not applicable" ? ` · ${esc(m.stockKept.toLowerCase())}${m.stockKept === "Kept" && m.stockLocation ? ", " + esc(m.stockLocation) : ""}` : ""}</span></div>` : ""}
    </div>
    <div class="md-side"><b class="md-price">${c ? money2(c) : `<span class="faint">—</span>`}</b>${n(m.labor) && n(m.price) ? `<span class="faint">${money(m.price)} part · ${money(m.labor)} labor</span>` : ""}
      <span class="md-links">${m.url ? `<a href="${esc(m.url)}" target="_blank" rel="noopener">Product</a>` : ""}${typeof rcptLinkHtml === "function" ? rcptLinkHtml(m) : ""}</span>
      ${wish ? `<button class="btn sm" data-cartfind="${esc([m.brand, m.name].filter(Boolean).join(" "))}">Shop for it</button>` : ""}${wish && W ? `<button class="btn sm pri" data-fit="${esc(m.id)}">${ic("check")} Mark fitted</button>` : ""}</div>
  </article>`;
}

VIEWS.mods = {
  render() {
    const t = modsTotals(), all = sorted("mods"), tab = R.tab.mods || "installed", W = ME.canWrite;
    const stockRows = all.filter(m => m.replaced && m.status !== "Planned" && m.status !== "Ordered");
    const removed = all.filter(m => m.status === "Removed");
    const stat = (cls, k, v, s, attrs) => `<button class="mh-stat ${cls}" ${attrs || ""}><span class="mh-k">${k}</span><span class="mh-v">${v}</span><span class="mh-s">${s}</span></button>`;
    const latest = t.inst.slice().sort(modSort)[0];
    const byCat = MOD_CATS.map(c => ({ c, v: t.inst.filter(m => m.category === c).reduce((s, m) => s + modCost(m), 0), k: t.inst.filter(m => m.category === c).length })).filter(x => x.k).sort((a, b) => b.v - a.v);
    const tabs = [["installed", `On the bike (${t.inst.length})`], ["wish", `Wish list (${t.wish.length})`], ["stock", `Stock parts (${stockRows.length})`]].concat(removed.length ? [["removed", `Removed (${removed.length})`]] : []);
    const empty = `<div class="md-empty"><b>No mods logged yet</b><span class="muted">Add anything that isn't stock: exhaust, lights, grips, suspension, luggage, protection. Keep the part number and price so you always know what's on the bike and what it cost.</span>
      ${W ? `<div class="md-ideas">${MOD_IDEAS.map(([c, nm], i) => `<button class="chip" data-idea="${i}">${ic("plus")} ${esc(nm)}</button>`).join("")}</div>` : ""}</div>`;
    let body = "";
    if (tab === "installed") {
      const list = t.inst.slice().sort(modSort);
      body = `<div class="md-grid"><div class="md-list">${list.length ? list.map(modCard).join("") : empty}</div>
        <aside class="stack md-aside">
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("dollar")}</span>Where the money went</h2></div>
            ${byCat.length ? hbars(byCat.map(x => ({ label: x.c, segs: [{ v: x.v, color: "var(--navy-2)", name: x.c }], right: money(x.v) })), { money: true, lw: 140, aria: "Money spent on mods by category" }) : `<p class="muted" style="margin:0">Spending by category shows here once you add mods with prices.</p>`}
            ${t.total ? `<div class="md-split"><div><b>${money(t.parts)}</b><span>parts</span></div><div><b>${money(t.labor)}</b><span>labor</span></div><div><b>${money(t.year)}</b><span>this year</span></div></div>` : ""}
          </section>
          <section class="mh-panel md-tip"><div class="mh-ph"><h2><span class="mh-hi">${ic("bulb")}</span>Selling it one day?</h2></div>
            <p style="margin:0">A list of mods with part numbers and receipts, plus the stock parts in a box, is worth real money to the next owner. It's all in the bike history report, which you can print or share as a link.</p>
            <button class="linkbtn" data-go-report style="align-self:flex-start">Open the report ${ic("next")}</button></section>
        </aside></div>`;
    }
    if (tab === "wish") {
      const list = t.wish.slice().sort((a, b) => (a.status === "Ordered" ? 0 : 1) - (b.status === "Ordered" ? 0 : 1) || modCost(b) - modCost(a));
      body = `${list.length ? `<div class="md-wishhead"><span>${list.length} on the list · <b>${money(t.wishCost)}</b> to buy them all</span>${W ? `<button class="btn sm" data-add="Planned">${ic("plus")} Add to wish list</button>` : ""}</div><div class="md-list">${list.map(modCard).join("")}</div>`
        : `<div class="md-empty"><b>Your wish list is empty</b><span class="muted">Add upgrades you're thinking about with a price and a link. When one goes on, press Mark fitted and it moves onto the bike with today's date and mileage.</span>${W ? `<button class="btn pri" data-add="Planned">${ic("plus")} Add to wish list</button>` : ""}</div>`}`;
    }
    if (tab === "stock") {
      body = `<p class="hint-text" style="margin:0 0 10px">The original parts that came off the bike. Keep their part numbers and where they are, so you can go back to stock or sell them with the bike.</p>` + table("mods-stock", stockRows, [
        { k: "replaced", label: "Stock part", get: r => `<b style="font-weight:600">${esc(r.replaced)}</b>`, cls: "wrap" },
        { k: "stockPartNo", label: "Part number", get: r => r.stockPartNo ? `<code>${esc(r.stockPartNo)}</code>` : `<span class="faint">—</span>` },
        { k: "name", label: "Replaced by", get: r => `<button class="linkbtn" data-open="mods|${esc(r.id)}">${esc(r.name)}</button>`, cls: "wrap" },
        { k: "stockKept", label: "Status", get: r => pill(r.stockKept === "Kept" ? "green" : r.stockKept === "Sold" ? "blue" : "gray", r.stockKept || "—") },
        { k: "stockLocation", label: "Stored at", cls: "wrap" }], { coll: "mods", emptyTitle: "No stock parts recorded", empty: "When you add a mod that replaced a stock part, fill in the stock part and where it's kept." });
    }
    if (tab === "removed") body = `<div class="md-list">${removed.sort(modSort).map(modCard).join("")}</div>`;
    return `<div class="ph" data-own="1"><div class="eyebrow">Make it yours</div><h1>Mods & upgrades</h1><p>Every aftermarket part on the bike: what it is, its part number, what it cost, when it went on, and where the stock part is.</p>
      <div class="act">${all.length ? `<button class="btn" id="mdCsv">${ic("download")} Export CSV</button>` : ""}${W ? `<button class="btn pri" data-add="Installed">${ic("plus")} Add a mod</button>` : ""}</div></div>
      <div class="mh-stats md-stats">
        ${stat("c-navy", ic("dollar") + "Invested", money(t.total), t.inst.length ? `in ${t.inst.length} mod${t.inst.length === 1 ? "" : "s"} on the bike` : "Add prices as you go", 'data-mtab="installed"')}
        ${stat("c-blue", ic("tune") + "On the bike", String(t.inst.length), latest ? "Latest: " + esc(latest.name) : "Nothing logged yet", 'data-mtab="installed"')}
        ${stat("c-tan", ic("star") + "Wish list", String(t.wish.length), t.wish.length ? money(t.wishCost) + " to buy them all" : "Plan your next upgrade", 'data-mtab="wish"')}
        ${stat("c-green", ic("box") + "Stock parts kept", String(t.kept.length), t.kept.length ? "Ready to go back to stock" : "Record them as you swap", 'data-mtab="stock"')}
      </div>
      <form class="ct-search md-shop" id="mdShop" role="search"><span class="fd-ico">${ic("search")}</span><input id="mdShopQ" type="search" placeholder="Shop for upgrades: slip-on exhaust, heated grips, LED headlight…" aria-label="Shop for an upgrade" autocomplete="off"><button class="btn pri" type="submit">Shop</button></form>
      <div class="tabs">${tabs.map(([k, l]) => `<button data-mtab="${k}" class="${tab === k ? "on" : ""}">${l}</button>`).join("")}</div>${body}`;
  },
  bind(root) {
    bindTables(root);
    $$("[data-mtab]", root).forEach(b => b.onclick = () => { R.tab.mods = b.dataset.mtab; render(false); });
    $$("[data-open]", root).forEach(b => { if (!b.onclick) b.onclick = () => { const [c, id] = b.dataset.open.split("|"); openRecord(c, id); }; });
    const od = () => { const o = odoNow(); return o ? Math.round(o.miles) : 0; };
    $$("[data-add]", root).forEach(b => b.onclick = () => openRecord("mods", null, b.dataset.add === "Installed" ? { status: "Installed", date: today(), odometer: od() } : { status: "Planned", stockKept: "Not applicable" }));
    $$("[data-idea]", root).forEach(b => b.onclick = () => { const [c, nm] = MOD_IDEAS[+b.dataset.idea]; openRecord("mods", null, { name: nm, category: c, status: "Installed", date: today(), odometer: od() }); });
    $$("[data-fit]", root).forEach(b => b.onclick = async () => { const m = clone(S.mods[b.dataset.fit]); if (!m) return; m.status = "Installed"; m.date = m.date || today(); m.odometer = n(m.odometer) || od(); if (m.stockKept === "Not applicable" && m.replaced) m.stockKept = "Kept";
      await store.put("mods", m, { action: "fitted " + m.name }); toast(m.name + " is on the bike."); openRecord("mods", m.id); });
    $$("[data-find]", root).forEach(b => b.onclick = e => { e.stopPropagation(); findPart(b.dataset.find); });
    const ms = $("#mdShop", root); if (ms) ms.onsubmit = e => { e.preventDefault(); const q = $("#mdShopQ", root).value.trim(); if (!q) return; R.tab.purchasing = ""; go("purchasing"); cartSearch(q, true); };
    $$("[data-copy]", root).forEach(b => b.onclick = e => { e.stopPropagation(); const v = b.dataset.copy; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast("Copied " + v), () => toast(v)); });
    const rp = $("[data-go-report]", root); if (rp) rp.onclick = () => go("report");
    const csv = $("#mdCsv", root); if (csv) csv.onclick = () => saveFile("revora-mods-" + today() + ".csv", csvOf(sorted("mods").map(m => ({ ...m, total: modCost(m) })),
      ["name", "status", "category", "brand", "partNo", "price", "labor", "total", "date", "odometer", "installedBy", "shop", "vendor", "url", "receipt", "warranty", "replaced", "stockPartNo", "stockKept", "stockLocation", "notes"].map(k => ({ k, label: k }))), "text/csv");
  }
};

/* the printable service report lists the mods too */
(function () {
  const base = maintReport;
  maintReport = function () {
    const html = base(), inst = modsInstalled().sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
    if (!inst.length) return html;
    const t = modsTotals();
    const tbl = `<h3 style="margin:18px 0 6px">Modifications</h3><table class="mtrep"><thead><tr><th>Date</th><th>Mod</th><th>Part number</th><th>Replaced</th><th class="r">Cost</th></tr></thead><tbody>
      ${inst.map(m => `<tr><td>${esc(fmtDate(m.date) || "—")}</td><td><b>${esc(m.name)}</b>${m.brand ? ` <span class="faint">(${esc(m.brand)})</span>` : ""}</td><td>${esc(m.partNo || "—")}</td><td>${esc(m.replaced ? m.replaced + (m.stockKept === "Kept" ? ", stock part kept" : "") : "Add-on")}</td><td class="r">${modCost(m) ? money2(modCost(m)) : "—"}</td></tr>`).join("")}</tbody>
      <tfoot><tr><td colspan="4"><b>Total invested in mods</b></td><td class="r"><b>${money2(t.total)}</b></td></tr></tfoot></table>`;
    return html.replace(/<p class="faint" style="font-size:12px;margin-top:14px">Generated by Revora/, tbl + '<p class="faint" style="font-size:12px;margin-top:14px">Generated by Revora');
  };
})();
