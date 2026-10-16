/* ============ Public build page: the page itself ============
   Loaded with the loader, so the same page draws as a preview inside the app and on its public link
   (?build=<token>) without the app. It only ever receives plain data and escapes every value. */
(function () {
  const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = v => Math.round(+v || 0).toLocaleString("en-US");
  const usd = v => "$" + Math.round(+v || 0).toLocaleString("en-US");
  const day = s => { if (!s) return ""; const d = new Date(String(s).slice(0, 10) + "T12:00:00"); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  const mon = s => { if (!s) return ""; const d = new Date(String(s).slice(0, 10) + "T12:00:00"); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "long", year: "numeric" }); };
  const img = s => typeof s === "string" && (/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/.test(s) || /^img\/sil\/[a-z0-9-]+\.(svg|webp|png)$/.test(s)) ? s : "";
  const TL = { service: ["wrench", "Service"], mod: ["bolt", "Mod"], photo: ["cam", "Photo"], mile: ["flag", "Milestone"], start: ["flag", "Started"] };
  const ICO = {
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.4 2.4-2.3-.6-.6-2.3z"/>',
    bolt: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>', cam: '<path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/>' };
  const ic = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICO[k] || ""}</svg>`;
  const paras = t => String(t || "").split(/\n{2,}|\r\n\r\n/).map(p => p.trim()).filter(Boolean).slice(0, 12).map(p => `<p>${e(p).replace(/\n/g, "<br>")}</p>`).join("");

  window.rvBuildHtml = function (d, opts = {}) {
    if (!d || !d.bike) return `<div class="bp-doc"><p>This build page is empty.</p></div>`;
    const b = d.bike, s = d.stats || {}, photos = (d.photos || []).filter(p => img(p.src)), cover = photos[0] || null, sil = img(b.sil);
    const money = !!(d.opts && d.opts.money), ba = d.beforeAfter && img(d.beforeAfter.before) && img(d.beforeAfter.after) ? d.beforeAfter : null;
    const tiles = [
      s.started ? ["Started", mon(s.started)] : null,
      s.pct != null ? ["Restoration", (+s.pct || 0) + "%"] : null,
      s.odo ? ["Odometer", num(s.odo) + " mi"] : null,
      s.mods ? ["Mods fitted", num(s.mods)] : null,
      s.services ? ["Services logged", num(s.services)] : null,
      money && s.invested ? ["Invested", usd(s.invested)] : null,
      s.photos ? ["Photos", num(s.photos)] : null].filter(Boolean).slice(0, 5);
    return `<article class="bp-doc">
      <header class="bp-hero${cover ? "" : " nophoto"}">
        ${cover ? `<img class="bp-cover" src="${cover.src}" alt="${e(cover.cap || b.name)}">` : sil ? `<img class="bp-sil" src="${sil}" alt="">` : ""}
        <div class="bp-hero-in">
          <span class="bp-kick">${e([b.styleName, d.status].filter(Boolean).join(" · ") || "Build page")}</span>
          <h1>${e(d.title || b.name)}</h1>
          ${d.title && d.title !== b.name ? `<p class="bp-bike">${e(b.name)}</p>` : ""}
          ${d.ownerName ? `<p class="bp-by">Built by ${e(d.ownerName)}</p>` : ""}
        </div>
      </header>
      ${tiles.length ? `<div class="bp-tiles">${tiles.map(([k, v]) => `<div><span>${e(k)}</span><b>${e(v)}</b></div>`).join("")}</div>` : ""}
      ${d.story ? `<section class="bp-sec bp-story"><h2>The story</h2>${paras(d.story)}</section>` : ""}
      ${ba ? `<section class="bp-sec"><h2>Before and after</h2>
        <div class="bp-ba" data-bp-ba style="--x:50%"><img src="${ba.after}" alt="After"><div class="bp-ba-b"><img src="${ba.before}" alt="Before"></div>
          <span class="bp-ba-l">Before</span><span class="bp-ba-r">After</span><i class="bp-ba-h" aria-hidden="true"></i>
          <input type="range" min="0" max="100" value="50" aria-label="Slide between before and after"></div></section>` : ""}
      ${d.restoration ? `<section class="bp-sec"><h2>Restoration progress</h2>
        <div class="bp-rbar"><i style="width:${Math.max(0, Math.min(100, +d.restoration.pct || 0))}%"></i></div>
        <div class="bp-parts">${(d.restoration.parts || []).map(p => `<span class="${p.total && p.done >= p.total ? "ok" : p.done ? "mid" : ""}">${e(p.title)}</span>`).join("")}</div></section>` : ""}
      ${photos.length > 1 || (photos.length && !cover) ? `<section class="bp-sec"><h2>Photos</h2><div class="bp-gal">${photos.map((p, i) => `<figure data-bp-ph="${i}"><img src="${p.src}" alt="${e(p.cap || "Build photo " + (i + 1))}" loading="lazy">${p.cap || p.date ? `<figcaption>${e(p.cap)}${p.date ? `<small>${e(day(p.date))}</small>` : ""}</figcaption>` : ""}</figure>`).join("")}</div></section>` : ""}
      ${(d.mods || []).length ? `<section class="bp-sec"><h2>Mods and upgrades</h2><div class="bp-mods">${d.mods.map(m => `<div class="bp-mod"><b>${e(m.name)}</b>${m.brand ? `<span>${e(m.brand)}</span>` : ""}${m.replaced ? `<small>Replaced the ${e(String(m.replaced).toLowerCase())}</small>` : ""}${money && m.cost ? `<em>${usd(m.cost)}</em>` : ""}</div>`).join("")}</div></section>` : ""}
      ${(d.timeline || []).length ? `<section class="bp-sec"><h2>Build timeline</h2><ol class="bp-tl">${d.timeline.map(t => { const [k, l] = TL[t.kind] || TL.mile; return `<li class="k-${e(t.kind)}"><span class="bp-tl-i">${ic(k)}</span><div><small>${e(day(t.date))} · ${l}</small><b>${e(t.t)}</b></div></li>`; }).join("")}</ol></section>` : ""}
      <footer class="bp-foot">
        <div class="bp-react">${opts.preview ? `<span class="bp-like" aria-disabled="true">${ic("heart")} ${num(d.likes)}</span>` : `<button class="bp-like" data-bp-like>${ic("heart")} <span>${num(d.likes)}</span></button>`}
          ${opts.preview ? "" : `<button class="bp-copy" data-bp-copy>${ic("link")} Share</button>`}${d.views ? `<span class="bp-views">${num(d.views)} view${+d.views === 1 ? "" : "s"}</span>` : ""}</div>
        <p>Made with Revora${d.made ? " · updated " + e(day(d.made)) : ""}.</p>
      </footer>
    </article>`;
  };

  // slider, photo viewer, like and share on the live page
  window.rvBuildBind = function (root, d, opts = {}) {
    root.querySelectorAll("[data-bp-ba]").forEach(w => { const r = w.querySelector("input"); r.oninput = () => w.style.setProperty("--x", r.value + "%"); });
    const photos = (d.photos || []).filter(p => img(p.src));
    root.querySelectorAll("[data-bp-ph]").forEach(f => f.onclick = () => {
      let i = +f.dataset.bpPh; const box = document.createElement("div"); box.className = "bp-lb"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Photo");
      const draw = () => { const p = photos[i]; box.innerHTML = `<button class="bp-lb-x" aria-label="Close">×</button>${photos.length > 1 ? `<button class="bp-lb-p" aria-label="Previous photo">‹</button><button class="bp-lb-n" aria-label="Next photo">›</button>` : ""}<figure><img src="${p.src}" alt="${e(p.cap || "")}">${p.cap ? `<figcaption>${e(p.cap)}</figcaption>` : ""}</figure>`; };
      const close = () => { box.remove(); document.removeEventListener("keydown", key); };
      const step = k => { i = (i + k + photos.length) % photos.length; draw(); };
      const key = ev => { if (ev.key === "Escape") close(); else if (ev.key === "ArrowRight") step(1); else if (ev.key === "ArrowLeft") step(-1); };
      box.onclick = ev => { const t = ev.target; if (t === box || t.classList.contains("bp-lb-x")) close(); else if (t.classList.contains("bp-lb-n")) step(1); else if (t.classList.contains("bp-lb-p")) step(-1); };
      draw(); document.body.appendChild(box); document.addEventListener("keydown", key);
    });
    const like = root.querySelector("[data-bp-like]");
    if (like) {
      const k = "rv.liked." + (opts.token || ""); let done = false; try { done = !!localStorage.getItem(k); } catch (er) {}
      if (done) like.classList.add("on");
      like.onclick = async () => {
        if (like.classList.contains("on") || !opts.onLike) return;
        like.classList.add("on"); const n = await opts.onLike(); if (n != null) like.querySelector("span").textContent = num(n);
        try { localStorage.setItem(k, "1"); } catch (er) {}
      };
    }
    const cp = root.querySelector("[data-bp-copy]");
    if (cp) cp.onclick = async () => {
      const u = location.href, t = (d.title || d.bike.name) + " on Revora";
      if (navigator.share) { try { await navigator.share({ title: t, url: u }); return; } catch (er) { if (er && er.name === "AbortError") return; } }
      try { await navigator.clipboard.writeText(u); cp.lastChild.textContent = " Link copied"; } catch (er) { prompt("Copy this link:", u); }
    };
  };
})();
