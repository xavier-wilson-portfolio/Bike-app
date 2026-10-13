/* ============ loader ============
   Runs before the app. Works out which bike to open (?bike=<id>, else the last one you opened),
   fetches that bike's pack, then loads app.js. With no bike chosen it shows the bike search. */
(function () {
  const qs = new URLSearchParams(location.search);
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const app = document.getElementById("app");
  const fail = msg => { app.innerHTML = `<div class="pick"><div class="pick-in"><h1 class="disp">Something went wrong</h1><p class="muted">${esc(msg)}</p><button class="btn pri" onclick="location.reload()">Try again</button></div></div>`; };

  async function getJson(url) { const r = await fetch(url, { cache: "no-cache" }); if (!r.ok) throw new Error(url + " " + r.status); return r.json(); }

  function openBike(id) { ls.set("rv.bike", id); const u = new URL(location.href); u.searchParams.set("bike", id); u.searchParams.delete("pick"); u.hash = ""; location.href = u.toString(); }
  window.rvOpenBike = openBike;
  window.rvPickBike = () => { const u = new URL(location.href); u.search = "?pick=1"; u.hash = ""; location.href = u.toString(); };

  function match(b, q) {
    const words = String(q || "").toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return true;
    const hay = norm([b.year, b.make, b.model, b.variant, b.name, ...(b.match || [])].join(" "));
    return words.every(w => hay.includes(norm(w)) || (/^\d{2}$/.test(w) && String(b.year).endsWith(w)));
  }
  function card(b) {
    const x = b.extras || {};
    return `<button class="pick-card" data-bike="${esc(b.id)}"><span class="pick-yr">${esc(b.year)}</span><b>${esc(b.make)} ${esc(b.model)}</b><span class="muted">${esc(b.variant || "")}</span>
      <span class="pick-tags"><span class="tag">${b.diagrams} parts diagrams</span><span class="tag">Parts list</span><span class="tag">Course</span>${x.diagrams3d ? `<span class="tag pro">3D</span>` : ""}</span></button>`;
  }
  function showPicker(index) {
    document.title = "Find your bike · Revora";
    const makes = [...new Set(index.map(b => b.make))].sort();
    app.innerHTML = `<div class="pick"><div class="pick-in">
      <div class="pick-brand"><b>Revora</b></div>
      <div class="eyebrow">Motorcycle restoration</div>
      <h1 class="disp">Find your bike</h1>
      <p class="muted">Pick your bike to get its parts diagrams, part numbers, a step-by-step restoration course and a tracker for every part.</p>
      <div class="pick-search"><input type="search" id="pickQ" placeholder="Year, make, model, e.g. 1977 Suzuki GS750" autocomplete="off" autofocus aria-label="Search for your bike"></div>
      <div class="pick-makes">${makes.map(m => `<button class="chip" data-make="${esc(m)}">${esc(m)}</button>`).join("")}</div>
      <div class="pick-list" id="pickList"></div>
    </div></div>`;
    const q = document.getElementById("pickQ"), list = document.getElementById("pickList");
    const draw = () => {
      const hits = index.filter(b => match(b, q.value)).sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model) || a.year - b.year);
      list.innerHTML = hits.length ? hits.map(card).join("") : `<div class="pick-none"><b>We don't have that bike yet.</b><span class="muted">The library is growing. Check back soon, or try a nearby year or model.</span></div>`;
    };
    q.oninput = draw; draw();
    app.addEventListener("click", e => {
      const b = e.target.closest("[data-bike]"); if (b) { openBike(b.dataset.bike); return; }
      const m = e.target.closest("[data-make]"); if (m) { q.value = m.dataset.make; draw(); q.focus(); }
    });
  }

  async function start() {
    app.innerHTML = `<div class="pick"><div class="pick-in"><div class="spinner"></div></div></div>`;
    let index;
    try { index = await getJson("packs/index.json"); } catch (e) { fail("Couldn't load the bike library. Check your internet and try again."); return; }
    window.PACK_INDEX = index;
    let id = qs.get("bike") || (qs.has("pick") ? null : ls.get("rv.bike"));
    if (id && !index.some(b => b.id === id)) id = null;
    if (!id) { showPicker(index); return; }
    ls.set("rv.bike", id);
    try { window.PACK = await getJson("packs/" + encodeURIComponent(id) + "/pack.json"); }
    catch (e) { fail("Couldn't load the data for this bike. Check your internet and try again."); return; }
    const s = document.createElement("script"); s.src = "app.js"; s.onerror = () => fail("Couldn't load the app. Check your internet and try again.");
    document.body.appendChild(s);
  }
  start();
})();
