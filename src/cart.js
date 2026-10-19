/* ============ Shopping list: search for parts, add them to a cart, see the total, then buy on each store's site ============
   eBay listings show up right here (through the revora-shop worker, RV_CONFIG.shopApi). Other stores open in a new tab,
   and anything from anywhere can be added by hand. The cart is saved with the bike (meta.cart). */
GUIDE.purchasing = { eyebrow: "Money", title: "Shopping list", sub: "Find parts, add them to your cart and see what it all costs.",
  how: ["Search for a part. eBay listings show up here with prices; other stores open in a new tab.", "Tap Add on anything you want. Found it somewhere else? Use Add an item.", "Your cart adds it all up. When you're ready, open each item and buy it on the store's site."] };
const CART = () => (meta().cart || []).filter(x => x && x.id);
const cartBike = () => [BIKE.year, BIKE.make, BIKE.model].filter(Boolean).join(" ") || BIKE.name || "";
const CART_STORES = ["eBay", "Amazon", "RevZilla", "Partzilla", "Dennis Kirk", "CMSNL", "Local shop", "Other"];
const cartLine = x => n(x.price) * Math.max(1, n(x.qty) || 1) + n(x.ship);
async function cartSave(list, msg) { const m = clone(meta()); m.cart = list; await store.put("meta", m, { noLog: true }); if (msg) toast(msg); }
async function cartAdd(item) {
  const list = CART(), same = item.url && list.find(x => x.url === item.url && !x.bought);
  if (same) { same.qty = (n(same.qty) || 1) + 1; await cartSave(list, "Added another. You have " + same.qty + "."); return; }
  list.push(Object.assign({ id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), qty: 1, added: today() }, item));
  await cartSave(list, "Added to your cart");
}
const shopApi = () => (window.RV_CONFIG && RV_CONFIG.shopApi) || "";
async function cartSearch(q, bike) {
  const st = R.f.cart = { q, bike, busy: !!shopApi(), items: [], err: "" }; render(false);
  if (!shopApi()) return;
  try {
    const r = await fetch(shopApi().replace(/\/$/, "") + "/search?q=" + encodeURIComponent((bike ? cartBike() + " " : "") + q) + "&limit=24");
    const j = await r.json().catch(() => ({}));
    if (R.f.cart !== st) return;
    st.items = Array.isArray(j.items) ? j.items : []; st.err = r.ok ? "" : (j.error || "Search didn't work. Try again."); st.busy = false;
  } catch (e) { if (R.f.cart === st) { st.busy = false; st.err = "Couldn't reach eBay. Check your internet and try again."; } }
  if (R.sec === "purchasing") render(false);
}

(function () {
  const OLD = VIEWS.purchasing;
  VIEWS.purchasing = {
    render() {
      if (R.tab.purchasing === "old") return `<div class="row" style="margin-bottom:8px"><button class="linkbtn" data-cart-back>${ic("back")} Back to the shopping list</button></div>` + OLD.render.apply(this, arguments);
      const W = ME.canWrite, f = R.f.cart || {}, list = CART(), open = list.filter(x => !x.bought), got = list.filter(x => x.bought);
      const total = open.reduce((s, x) => s + cartLine(x), 0), count = open.reduce((s, x) => s + (Math.max(1, n(x.qty) || 1)), 0);
      const byStore = {}; open.forEach(x => (byStore[x.store || "Other"] = byStore[x.store || "Other"] || []).push(x));
      const old = sorted("purchases").length;
      const withBike = f.bike != null ? f.bike : true;
      const stores = window.rvShop ? rvShop.stores("parts").filter(s => s.id !== "ebay" || !shopApi()) : [];
      const res = !f.q ? "" : `<div class="ct-res">
          ${shopApi() ? `<div class="ct-res-h"><b>eBay</b><span class="faint">${f.busy ? "Searching…" : f.err ? "" : f.items.length ? f.items.length + " listings" : "No listings found"}</span></div>
            ${f.err ? `<div class="banner warn"><div class="grow">${esc(f.err)}</div></div>` : ""}
            ${f.busy ? `<div class="ct-grid">${Array.from({ length: 6 }, () => `<div class="ct-item sk"><i></i><b></b><span></span></div>`).join("")}</div>`
              : f.items.length ? `<div class="ct-grid">${f.items.map((it, i) => `<div class="ct-item">
                  <a class="ct-img" href="${esc(it.url)}" target="_blank" rel="noopener sponsored">${it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy">` : ic("box")}</a>
                  <a class="ct-t" href="${esc(it.url)}" target="_blank" rel="noopener sponsored">${esc(it.title)}</a>
                  <div class="ct-p"><b>${money2(it.price)}</b><span>${it.ship == null ? "" : n(it.ship) ? "+ " + money2(it.ship) + " shipping" : "Free shipping"}</span></div>
                  <span class="faint ct-c">${esc(it.condition || "")}</span>
                  ${W ? `<button class="btn sm pri" data-cart-add="${i}">${ic("plus")} Add</button>` : ""}</div>`).join("")}</div>` : ""}` : ""}
          <div class="ct-more"><span>${shopApi() ? "Also search" : "Search"} <b>${esc(f.q)}</b> on</span>${stores.map(s => `<a class="chip" href="${esc(rvShop.link(s.id, f.q, withBike ? cartBike() : ""))}" target="_blank" rel="noopener sponsored">${esc(s.name)} ↗</a>`).join("")}</div></div>`;
      const row = x => `<div class="ct-row${x.bought ? " got" : ""}">
          <span class="ct-th">${x.img ? `<img src="${esc(x.img)}" alt="" loading="lazy">` : ic("box")}</span>
          <div class="grow ct-rm"><a href="${esc(x.url || "#")}" ${x.url ? 'target="_blank" rel="noopener sponsored"' : ""} class="ct-rt">${esc(x.title)}</a><span class="faint">${esc(x.store || "Other")}${n(x.ship) ? " · " + money2(x.ship) + " shipping" : ""}</span></div>
          ${x.bought ? `<span class="tag">Bought</span>` : W ? `<div class="ct-qty" role="group" aria-label="Quantity"><button data-cq="${esc(x.id)}|-1" aria-label="One less">−</button><span>${Math.max(1, n(x.qty) || 1)}</span><button data-cq="${esc(x.id)}|1" aria-label="One more">+</button></div>` : `<span>×${Math.max(1, n(x.qty) || 1)}</span>`}
          <b class="ct-lp">${money2(cartLine(x))}</b>
          ${W ? `<div class="ct-acts">${x.bought ? `<button class="linkbtn" data-cb="${esc(x.id)}">Undo</button>` : `<button class="linkbtn" data-cb="${esc(x.id)}">Bought</button>`}<button class="linkbtn ct-x" data-cx="${esc(x.id)}" aria-label="Remove ${esc(x.title)}">Remove</button></div>` : ""}</div>`;
      return `<div class="ph" data-own="1"><div class="eyebrow">Money</div><h1>Shopping list</h1><p>Find parts, add them to your cart and see what it all costs. You buy on each store's own site.</p></div>
        <form class="ct-search" id="ctForm" role="search"><span class="fd-ico">${ic("search")}</span><input id="ctQ" type="search" value="${esc(f.q || "")}" placeholder="What do you need? e.g. front brake pads, 16510-07J00" aria-label="Search for a part" autocomplete="off">
          <label class="shop-tog"><input type="checkbox" id="ctBike" ${withBike ? "checked" : ""}> For my ${esc(cartBike())}</label><button class="btn pri" type="submit">Search</button></form>
        ${res}
        <section class="ct-cart" aria-label="Your cart">
          <div class="ct-cart-h"><h2>${ic("cart")} Your cart</h2>${open.length ? `<span class="ct-tot"><span>${count} item${count === 1 ? "" : "s"}</span><b>${money2(total)}</b></span>` : ""}</div>
          ${open.length ? Object.entries(byStore).map(([st, xs]) => `<div class="ct-store"><div class="ct-store-h"><b>${esc(st)}</b><span>${money2(xs.reduce((s, x) => s + cartLine(x), 0))}</span></div>${xs.map(row).join("")}</div>`).join("")
            + `<p class="faint ct-note">Prices are what the store showed when you added them. Tax and some shipping get added at checkout. Open each item to buy it.</p>`
            : `<div class="ct-empty"><b>Your cart is empty</b><span class="muted">Search above and tap Add, or add something you found yourself.</span></div>`}
          ${W ? `<details class="ct-own"${f.own ? " open" : ""}><summary>${ic("plus")} Add an item yourself</summary>
            <form id="ctOwn" class="ct-ownf"><input name="title" required maxlength="140" placeholder="What is it?" aria-label="Item"><input name="price" type="number" step="0.01" min="0" inputmode="decimal" placeholder="Price" aria-label="Price">
              <select name="store" aria-label="Store">${CART_STORES.map(s => `<option>${s}</option>`).join("")}</select><input name="url" type="text" inputmode="url" placeholder="Link (optional)" aria-label="Link"><button class="btn" type="submit">Add to cart</button></form></details>` : ""}
          ${got.length ? `<details class="ct-got"><summary>Bought (${got.length})</summary>${got.map(row).join("")}${W ? `<button class="linkbtn" data-cart-clear>Clear bought items</button>` : ""}</details>` : ""}
        </section>
        ${old ? `<p class="faint" style="margin-top:14px"><button class="linkbtn" data-cart-old>Older orders and quotes (${old})</button></p>` : ""}`;
    },
    bind(root) {
      if (R.tab.purchasing === "old") { OLD.bind.apply(this, arguments); const b = $("[data-cart-back]", root); if (b) b.onclick = () => { R.tab.purchasing = ""; render(false); }; return; }
      const f = R.f.cart || {};
      $("#ctForm", root).onsubmit = e => { e.preventDefault(); const q = $("#ctQ", root).value.trim(); if (q) cartSearch(q.slice(0, 100), $("#ctBike", root).checked); };
      $("#ctBike", root).onchange = e => { if (f.q) cartSearch(f.q, e.target.checked); else R.f.cart = Object.assign({}, f, { bike: e.target.checked }); };
      $$("[data-cart-add]", root).forEach(b => b.onclick = () => { const it = f.items[+b.dataset.cartAdd]; if (!it) return; b.disabled = true;
        cartAdd({ title: it.title, price: n(it.price), ship: it.ship == null ? 0 : n(it.ship), store: "eBay", url: it.url, img: it.image || "" }); });
      $$("[data-cq]", root).forEach(b => b.onclick = () => { const [id, d] = b.dataset.cq.split("|"), list = CART(), x = list.find(y => y.id === id); if (!x) return;
        const q = Math.max(1, n(x.qty) || 1) + +d; if (q < 1) return; x.qty = Math.min(99, q); cartSave(list); });
      $$("[data-cb]", root).forEach(b => b.onclick = () => { const list = CART(), x = list.find(y => y.id === b.dataset.cb); if (!x) return; x.bought = !x.bought; x.boughtOn = x.bought ? today() : ""; cartSave(list, x.bought ? "Marked bought" : ""); });
      $$("[data-cx]", root).forEach(b => b.onclick = () => cartSave(CART().filter(y => y.id !== b.dataset.cx), "Removed"));
      const cl = $("[data-cart-clear]", root); if (cl) cl.onclick = () => cartSave(CART().filter(y => !y.bought), "Cleared");
      const ol = $("[data-cart-old]", root); if (ol) ol.onclick = () => { R.tab.purchasing = "old"; render(false); };
      const own = $("#ctOwn", root); if (own) own.onsubmit = e => { e.preventDefault(); const d = Object.fromEntries(new FormData(own));
        let url = String(d.url || "").trim(); if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
        R.f.cart = Object.assign({}, R.f.cart, { own: true });
        cartAdd({ title: String(d.title).trim(), price: n(d.price), ship: 0, store: d.store || "Other", url, img: "" }); };
      if (!f.q) setTimeout(() => $("#ctQ", root)?.focus({ preventScroll: true }), 50);
    }
  };
})();
