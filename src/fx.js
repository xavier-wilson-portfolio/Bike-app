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
    if (reduce) { requestAnimationFrame(() => document.querySelectorAll("[data-win]").length && tick()); return; }
    if (!bound) { bound = true; addEventListener("scroll", on, { passive: true }); addEventListener("resize", on); }
    on();
  };
})();
