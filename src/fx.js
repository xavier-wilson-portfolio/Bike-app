/* ============ Scroll effects for the redesign ============
   [data-shine]  light sweeps across a metal box as it scrolls through the screen (reverses when you scroll back)
   [data-glint]  one shine across the headline as you start scrolling
   [data-sep]    a feature card lifts off its colored block, then settles, as it passes
   [data-strip]  the bikes in the strip ride off to the right, far right first
   Call rvFx(root) after drawing a page; it keeps one scroll listener. */
(function () {
  const clamp = x => Math.max(0, Math.min(1, x));
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  function tick() {
    raf = 0;
    const vh = innerHeight;
    document.querySelectorAll("[data-shine]").forEach(el => {
      const r = (el.parentElement || el).getBoundingClientRect();
      const p = clamp((vh - r.bottom) / Math.max(120, vh - r.height));
      el.style.setProperty("--sh", (100 - p * 100).toFixed(1) + "%");
    });
    document.querySelectorAll("[data-glint] .glint").forEach(el => el.style.setProperty("--sh", (100 - clamp(scrollY / 320) * 100).toFixed(1) + "%"));
    document.querySelectorAll("[data-sep]").forEach(el => {
      const r = el.getBoundingClientRect(), q = clamp((vh - (r.top + r.height / 2)) / (vh * .7));
      el.style.setProperty("--lift", (30 * Math.sin(Math.PI * q)).toFixed(1));
    });
    document.querySelectorAll("[data-win]").forEach(w => {
      const c = document.querySelector(".rd-circle"), cur = parseFloat(w.style.getPropertyValue("--win")) || 0;
      if (!c || innerWidth <= 1100) { w.style.setProperty("--win", "0px"); return; }
      const cr = c.getBoundingClientRect(), wr = w.getBoundingClientRect();
      if (wr.left < innerWidth * .35) { w.style.setProperty("--win", "0px"); return; }   // stacked under the text: leave it
      w.style.setProperty("--win", ((cr.top + cr.height / 2) - (wr.top - cur + wr.height / 2)).toFixed(0) + "px");
    });
    document.querySelectorAll("[data-strip]").forEach(el => {
      const r = el.getBoundingClientRect(), t = clamp((vh - r.bottom) / 320), imgs = el.querySelectorAll(".bk img,.bk i"), n = imgs.length;
      imgs.forEach((im, i) => {
        const o = clamp(t * 1.8 - (n - 1 - i) * .14);
        im.style.setProperty("--bx", (o * 900).toFixed(0) + "px"); im.style.setProperty("--bsk", (t > 0 && o < 1 ? -12 : 0) + "deg");
        im.style.opacity = (1 - o).toFixed(2);
      });
    });
  }
  const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
  let bound = false;
  window.rvFx = function () {
    if (reduce) { const c = () => document.querySelectorAll("[data-win]").length && tick(); requestAnimationFrame(c); addEventListener("load", c); if (document.fonts && document.fonts.ready) document.fonts.ready.then(c); return; }
    if (!bound) { bound = true; addEventListener("scroll", on, { passive: true }); addEventListener("resize", on); addEventListener("load", on); if (document.fonts && document.fonts.ready) document.fonts.ready.then(on); document.querySelectorAll("[data-win] img").forEach(i => i.complete || i.addEventListener("load", on)); }
    on();
  };
})();

/* project top box: size the photo column so a 16:9 photo is exactly as tall as the box. Nothing gets cut and there's no gap. */
(function () {
  function fit(h) {
    if (!h || innerWidth < 1021) { if (h) h.style.removeProperty("--phw"); return; }
    const l = h.querySelector(".mh-hero-l"), W = h.clientWidth; if (!l || !W) return;
    // the smallest photo width whose height reaches the text's height, so the gap above it matches the gap on the right
    let pick = 0, best = 1e9;
    for (let f = 0.40; f <= 0.7001; f += 0.01) {
      h.style.setProperty("--phw", (f * 100).toFixed(2) + "%");
      const short = l.scrollHeight - ((f * W - 18) * 9 / 16 + 18);
      if (short <= 0) { pick = f; break; }
      if (short < best) { best = short; pick = f; }
    }
    h.style.setProperty("--phw", (pick * 100).toFixed(2) + "%");
    // the photo credit: 8px above where the stat boxes start
    const st = h.parentElement && h.parentElement.querySelector(".mh-stats");
    if (st) { const over = Math.max(0, h.getBoundingClientRect().bottom - st.getBoundingClientRect().top); h.style.setProperty("--capb", Math.round(over + 8) + "px"); }
  }
  let busy = false;
  // the house icon on the side: its top lines up with the top of the first box on the page
  function rail() {
    const r = document.querySelector(".rv-rail"), c = document.querySelector("#content"), f = c && [...c.children].find(x => x.offsetHeight > 0);
    if (!r || !f) return;
    const ic = r.querySelector(".rl svg"), rl = r.querySelector(".rl"), inner = ic && rl ? ic.getBoundingClientRect().top - r.getBoundingClientRect().top : 0;
    r.style.top = Math.round(f.getBoundingClientRect().top + scrollY - inner) + "px";
  }
  function all() { if (busy) return; busy = true; document.querySelectorAll(".mh-hero").forEach(fit); try { rail(); } catch (e) {} busy = false; }
  addEventListener("resize", all);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all);
  addEventListener("load", all);
  // refit whenever the hero's width changes or new content is drawn (fonts, images, text)
  let raf = 0; const soon = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(all); };
  const ro = window.ResizeObserver ? new ResizeObserver(() => { let w = 0; document.querySelectorAll(".mh-hero").forEach(h => w += h.clientWidth); if (w !== ro.w) { ro.w = w; soon(); } }) : null;
  // runs before the browser paints the new page, so the photo and the house icon land in place without a visible jump
  new MutationObserver(() => {
    const fresh = document.querySelectorAll(".mh-hero:not([data-fit])");
    fresh.forEach(h => { h.setAttribute("data-fit", "1"); if (ro) ro.observe(h); fit(h); });
    try { rail(); } catch (e) {}
  }).observe(document.documentElement, { childList: true, subtree: true });
  window.rvFitHero = all;
})();

/* hover lift without the bounce: when a box rises, the mouse near its bottom edge would fall out of it, drop it, and catch it again.
   Keep it up while the mouse is still inside where the box was. */
(function () {
  if (!window.matchMedia || !matchMedia("(hover:hover)").matches) return;
  const LIFT = ".panel,.mh-panel,.mh-stat,.card,.kpi,.lesson,.gcard,.gtile,.gtile2,.cl-card,.cl-run,.contcard,.cv-card,.cv-shop,.dcard,.gal-card,.lib-guide,.md-card,.mtcard,.ph-card,.pl-card,.planrow,.pp-card,.pv-card,.pv-opt,.rc-card,.rcl-card,.rm-how,.shop,.st,.step3,.sx-bike,.sx-kpi,.sx-panel,.sx-remind,.tcard,.tip,.vcard,.wk-safe,.wk-sum,.wo-decide,.fin,.focus-banner,.rs-cur,.rs-nx,.guide,.process li,.gx-bike,.gx-more,.gx-add,.gx-sc,.gx-info,.rd-pop,.bench,.gfoot>div,.shop-band,.gx-t,.rd-btn,.rd-hop,.gt,.mob-in .moblist .mlink";
  let held = [];
  const drop = keep => { held = held.filter(e => { if (keep.includes(e)) return true; e.classList.remove("rv-hold"); return false; }); };
  document.addEventListener("pointermove", e => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const over = []; let n = e.target && e.target.closest ? e.target.closest(LIFT) : null;
    while (n) { over.push(n); n = n.parentElement && n.parentElement.closest(LIFT); }
    over.forEach(x => { if (!held.includes(x)) { x.classList.add("rv-hold"); held.push(x); } });
    // a held box the mouse just slipped out of: keep it if the mouse is within 8px below its lifted edge
    const keep = held.filter(x => { if (over.includes(x)) return true; if (!x.isConnected) return false; const r = x.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom + 8; });
    drop(keep);
  }, { passive: true });
  document.addEventListener("pointerleave", () => drop([]));
  addEventListener("blur", () => drop([]));
  addEventListener("scroll", () => { if (held.length) drop([]); }, { passive: true });
})();
