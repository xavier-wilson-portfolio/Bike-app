/* ============ Shop for parts: one search box that sends you to the big parts stores, used in the garage, Parts and Mods ============
   Links carry affiliate IDs from RV_CONFIG.aff when they're set (amazonTag, ebayCampid, or a per-store "{url}" template). */
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const S = {
    partzilla: { name: "Partzilla", what: "OEM parts with diagrams", url: q => "https://www.partzilla.com/search?q=" + q },
    ebay: { name: "eBay", what: "New and used, often cheapest", url: q => "https://www.ebay.com/sch/i.html?_nkw=" + q + "&_sacat=6028" },
    amazon: { name: "Amazon", what: "Filters, plugs, batteries, fluids", url: q => "https://www.amazon.com/s?k=" + q },
    revzilla: { name: "RevZilla", what: "Aftermarket parts, tires and gear", url: q => "https://www.revzilla.com/search?query=" + q },
    denniskirk: { name: "Dennis Kirk", what: "Aftermarket parts and accessories", url: q => "https://www.denniskirk.com/search?query=" + q },
    cmsnl: { name: "CMSNL", what: "OEM parts, great for older bikes", url: q => "https://www.cmsnl.com/search/?q=" + q },
  };
  const ORDER = { parts: ["partzilla", "ebay", "amazon", "revzilla", "denniskirk", "cmsnl"], mods: ["revzilla", "ebay", "amazon", "denniskirk", "partzilla"] };
  const COMMON = {
    parts: ["Oil filter", "Air filter", "Spark plugs", "Brake pads", "Chain and sprockets", "Battery", "Tires", "Clutch cable", "Fork seals", "Gaskets"],
    mods: ["Slip-on exhaust", "LED headlight", "Heated grips", "Frame sliders", "Rear rack", "Windscreen", "Handlebar risers", "USB charger", "Phone mount", "Rear shock"],
  };
  const aff = (id, u) => {
    const A = (window.RV_CONFIG && RV_CONFIG.aff) || {};
    if (id === "amazon" && A.amazonTag) return u + "&tag=" + encodeURIComponent(A.amazonTag);
    if (id === "ebay" && A.ebayCampid) return u + "&mkcid=1&mkrid=711-53200-19255-0&siteid=0&toolid=10001&mkevt=1&campid=" + encodeURIComponent(A.ebayCampid);
    const w = A[id]; return typeof w === "string" && w.includes("{url}") ? w.replace("{url}", encodeURIComponent(u)) : u;
  };
  const affOn = () => Object.values((window.RV_CONFIG && RV_CONFIG.aff) || {}).some(Boolean);
  const isPn = s => /\d/.test(s) && /^[A-Z0-9][A-Z0-9.\-\/]{3,24}$/i.test(String(s).trim());
  const enc = s => encodeURIComponent(String(s).trim().replace(/\s+/g, " ")).replace(/%20/g, "+");
  const query = (q, bike) => enc((bike && !isPn(q) ? bike + " " : "") + q);
  const link = (id, q, bike) => aff(id, S[id].url(query(q, bike)));
  const storesHtml = (kind, q, bike) => (ORDER[kind] || ORDER.parts).map(id => `<a class="shop-st" data-st="${id}" href="${esc(q ? link(id, q, bike) : "#")}" target="_blank" rel="noopener sponsored"><b>${esc(S[id].name)}</b><span>${esc(S[id].what)}</span><em>Shop ${esc(S[id].name)} →</em></a>`).join("");

  /* opts: { kind: "parts"|"mods", title, sub, bike: "2012 Suzuki V-Strom 650", bikes: [labels] (garage picker), wish: true (mods: add to wish list) } */
  function html(o) {
    const kind = o.kind || "parts", bikes = (o.bikes || []).filter(Boolean);
    return `<section class="shop" data-shop-kind="${kind}">
      <div class="shop-h"><span class="shop-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.6L5 3H2"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg></span>
        <div><h2>${esc(o.title || (kind === "mods" ? "Shop for upgrades" : "Shop for parts"))}</h2><p>${esc(o.sub || "Search the big parts stores at once. You buy on the store's own site.")}</p></div></div>
      <form class="shop-f" role="search"><input type="search" class="shop-q" placeholder="${esc(kind === "mods" ? "Slip-on exhaust, heated grips, LED headlight…" : "Front brake pads, or a part number like 16510-07J00")}" aria-label="${kind === "mods" ? "Upgrade to shop for" : "Part or part number to shop for"}" autocomplete="off" value="${esc(o.q || "")}">
        ${bikes.length ? `<select class="shop-bike" aria-label="Fits which bike">${bikes.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join("")}<option value="">Any bike</option></select>`
          : o.bike ? `<label class="shop-tog"><input type="checkbox" class="shop-addbike" checked> For my ${esc(o.bike)}</label>` : ""}
        <button class="btn pri" type="submit">Search</button></form>
      <div class="shop-chips">${(COMMON[kind] || COMMON.parts).map(c => `<button type="button" class="chip" data-shop-q="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div class="shop-res"${o.q ? "" : " hidden"}><div class="shop-for"></div><div class="shop-stores">${storesHtml(kind, o.q || "", o.bike || bikes[0] || "")}</div>
        <div class="shop-foot"><span class="faint">${kind === "mods" ? "Check it fits your exact year and model before you buy." : "A part number from your diagrams or records is the surest way to get the right part."}${affOn() ? " Some links earn Revora a small commission at no cost to you." : ""}</span>${o.wish ? `<button type="button" class="btn sm shop-wish">+ Add to wish list</button>` : ""}</div></div>
    </section>`;
  }
  /* cb: { onWish(q), onSearch(q) } */
  function bind(root, o, cb) {
    cb = cb || {}; const el = root.querySelector ? (root.matches && root.matches(".shop") ? root : root.querySelector(".shop")) : null; if (!el) return;
    const kind = el.dataset.shopKind, qi = el.querySelector(".shop-q"), res = el.querySelector(".shop-res"), sel = el.querySelector(".shop-bike"), tog = el.querySelector(".shop-addbike");
    const bike = () => sel ? sel.value : tog ? (tog.checked ? o.bike : "") : (o.bike || "");
    const upd = () => {
      const q = qi.value.trim(); res.hidden = !q; if (!q) return;
      el.querySelectorAll(".shop-st").forEach(a => a.href = link(a.dataset.st, q, bike()));
      const b = bike(); el.querySelector(".shop-for").innerHTML = `Results for <b>${esc(q)}</b>${b && !isPn(q) ? ` on a <b>${esc(b)}</b>` : isPn(q) ? " (part number)" : ""}. Pick a store:`;
    };
    let t; qi.oninput = () => { clearTimeout(t); t = setTimeout(upd, 150); };
    if (sel) sel.onchange = upd; if (tog) tog.onchange = upd;
    el.querySelector(".shop-f").onsubmit = e => { e.preventDefault(); upd(); if (qi.value.trim()) { el.querySelector(".shop-st")?.focus({ preventScroll: true }); cb.onSearch && cb.onSearch(qi.value.trim()); } };
    el.querySelectorAll("[data-shop-q]").forEach(b => b.onclick = () => { qi.value = b.dataset.shopQ; upd(); cb.onSearch && cb.onSearch(qi.value); });
    const w = el.querySelector(".shop-wish"); if (w) w.onclick = () => { const q = qi.value.trim(); if (q && cb.onWish) cb.onWish(q); };
    upd();
  }
  // a small popup with store links for one item (a part on the list, a mod on the wish list)
  function popup(q, kind, bike, extra) {
    const box = document.createElement("div"); box.className = "pk-modal shop-pop";
    box.innerHTML = `<div class="pk-card" role="dialog" aria-modal="true" aria-label="Shop for ${esc(q)}"><h2 class="disp-s">Buy ${esc(q)}</h2>
      <p class="muted pk-small">${bike && !isPn(q) ? "Searching for a " + esc(bike) + ". " : ""}Opens the store's own site, where you check out.</p>
      <div class="shop-stores">${storesHtml(kind || "parts", q, bike)}</div>${extra || ""}
      <div class="pk-links"><button class="btn" data-x>Close</button></div></div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    box.querySelector("[data-x]").onclick = close; box.onclick = e => { if (e.target === box) close(); };
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", k); } });
    box.querySelector(".shop-st")?.focus();
    return box;
  }
  window.rvShop = { html, bind, popup, link, stores: kind => (ORDER[kind] || ORDER.parts).map(id => Object.assign({ id }, S[id])) };
})();
