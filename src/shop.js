/* ============ Shopping inside the app: "Buy" buttons on parts and mods open store links for that item ============ */
const shopBike = () => [BIKE.year, BIKE.make, BIKE.model].filter(Boolean).join(" ") || BIKE.name || "";
// "Shop for this" opens the Shopping list with that search already run
document.addEventListener("click", e => {
  const c = e.target.closest && e.target.closest("[data-cartfind]"); if (!c) return;
  e.preventDefault(); e.stopPropagation(); if (typeof closeDrawer === "function" && drawerState.c) closeDrawer();
  const q = String(c.dataset.cartfind || "").trim(); R.tab.purchasing = ""; go("purchasing"); if (q && typeof cartSearch === "function") cartSearch(q, !/\d{3,}-/.test(q));
}, true);
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-buy]"); if (!b || !window.rvShop) return;
  e.preventDefault(); e.stopPropagation();
  const q = String(b.dataset.q || "").trim(); if (!q) { toast("Add a name or part number first.", "err"); return; }
  const alt = String(b.dataset.alt || "").trim();
  const box = rvShop.popup(q, b.dataset.buy, shopBike(), alt && alt !== q ? `<p class="pk-small" style="margin:10px 0 0"><button class="linkbtn" data-alt>Search by "${esc(alt)}" instead</button></p>` : "");
  const a = box.querySelector("[data-alt]"); if (a) a.onclick = () => { box.remove(); rvShop.popup(alt, b.dataset.buy, shopBike()); };
}, true);
// parts: a Buy button at the top of each part's record (by part number when there is one)
(function () {
  const base = DRAWER_EXTRA.parts;
  DRAWER_EXTRA.parts = (p, isNew) => {
    const x = base ? base(p, isNew) : {}; if (isNew || !p.name) return x;
    const pn = String(p.oemPn || "").trim(), q = pn || p.name;
    return Object.assign({}, x, { top: `<div class="row" style="gap:8px;margin-bottom:4px"><button type="button" class="btn sm" data-cartfind="${esc(q)}">${ic("cart")} Shop for this part</button><span class="faint" style="font-size:12.5px">${pn ? "Searches by part number " + esc(pn) : "Add the OEM part number for an exact match"}</span></div>` + (x.top || "") });
  };
})();
