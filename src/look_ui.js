/* ============ Appearance editor: colors, fonts, layout and speedometer ============
   Every pick shows on the whole site right away. Save keeps it (this browser, and the account when signed in);
   Cancel or closing puts back what was saved. The look itself is drawn by look_head.js in <head>. */
(function () {
  if (!window.rvLook) return;
  const TARGETS = [["main", "Main color"], ["accent", "Accent"], ["soft", "Highlight"], ["bg", "Background"], ["card", "Cards"], ["text", "Text"]];
  const SW = [["Navy", "#2C4253"], ["Deep navy", "#17232C"], ["Slate", "#3A5568"], ["Blue", "#2C5F7C"], ["Light blue", "#B9D9EB"], ["Pale blue", "#E6F1F8"],
    ["Tan", "#D9BF8E"], ["Dark tan", "#B8955A"], ["Gold", "#E8B53A"], ["Pale tan", "#F6EEDD"], ["Cream", "#F8F3EA"], ["White", "#FFFFFF"],
    ["Charcoal", "#121B22"], ["Graphite", "#1C2A34"], ["Gray", "#9AA5AE"], ["Red", "#B83A33"], ["Green", "#3E7A55"], ["Orange", "#C9772E"]];
  const FONT_ORDER = ["michroma", "shoulders", "barlow", "saira", "public", "plex", "classic", "nunito"];
  const LAYOUTS = [["std", "Standard", "Photo on the right, stats under it"], ["photo", "Photo first", "Photo on the left"], ["side", "Stats on the side", "Stats in a column next to the photo"], ["top", "Stats on top", "Stats above the photo"]];
  const GAUGES = [["G", "Hairline"], ["H", "Precision ring"], ["I", "Chronograph"], ["J", "Slim segments"], ["K", "Linear tach"], ["T", "Ring only"]];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let W = null, saved = null, target = "main", fontTarget = "head", lastFocus = null;

  const css = `
.lk-bg{position:fixed;inset:0;z-index:10050;background:rgba(10,18,26,.55);display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;padding:24px 14px}
.lk{text-align:left;width:min(1080px,100%);background:var(--bg);color:var(--fg);border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.35);padding:22px 24px 24px;font-family:var(--f-ui)}
.lk-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.lk-h h2{color:var(--fg);margin:0;font-family:var(--f-display);font-weight:400;font-size:24px}
.lk-h p{margin:4px 0 0;color:var(--muted);font-size:14px}.lk-x{all:unset;cursor:pointer;width:38px;height:38px;display:grid;place-items:center;border-radius:8px;font-size:24px;line-height:1}.lk-x:hover{background:var(--panel-2)}
.lk-prev{margin-top:16px;position:relative;overflow:hidden;border-radius:12px;padding:20px 24px;min-height:200px;box-sizing:border-box;color:#fff;display:flex;align-items:center;gap:14px 28px;flex-wrap:wrap;
  background:linear-gradient(180deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.04) 18%,rgba(255,255,255,0) 40%),linear-gradient(135deg,rgba(255,255,255,.10) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,.28) 55%,rgba(255,255,255,.06) 72%,rgba(0,0,0,.35) 100%),var(--rv-main-17232C,#17232C);box-shadow:0 14px 30px rgba(23,35,44,.25),inset 0 1px 0 rgba(255,255,255,.28)}
.lk-prev-t{position:relative;flex:0 1 260px;min-width:0}.lk-prev-t .k{margin:0;font-size:11px;font-weight:600;color:#C9D4DD}.lk-prev-t .n{margin:5px 0 0;font-family:var(--f-display);font-size:28px;line-height:1.1}
.lk-prev-t .s{margin:4px 0 0;font-size:13px;color:#C9D4DD}.lk-prev-t .nx{margin-top:12px;padding-left:10px;border-left:3px solid var(--rv-accent-D9BF8E,#D9BF8E)}.lk-prev-t .nx span{display:block;font-size:10px;color:#9FB0BE}.lk-prev-t .nx b{font-size:14px}
.lk-prev-b{margin-top:14px;display:flex;gap:6px;flex-wrap:wrap}.lk-prev-b span{font-family:var(--f-display);font-size:11px;padding:9px 13px;border-radius:7px}
.lk-prev-b .a{background:var(--rv-soft-B9D9EB,#B9D9EB);color:var(--rv-on-soft,#17232C)}.lk-prev-b .c{background:var(--rv-accent-D9BF8E,#D9BF8E);color:var(--rv-on-accent,#17232C)}.lk-prev-b .o{border:1px solid rgba(255,255,255,.35)}
.lk-prev-g{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:210px}
.lk-prev-card{position:relative;margin-left:auto;background:var(--surface);color:var(--fg);border-radius:10px;padding:12px 14px;width:200px;box-shadow:0 10px 24px rgba(0,0,0,.25)}
.lk-prev-card b{font-family:var(--f-display);font-size:14px;display:block}.lk-prev-card span{font-size:12.5px;color:var(--muted)}.lk-prev-card i{display:block;margin-top:8px;height:6px;border-radius:3px;background:var(--panel)}
.lk-grid{margin-top:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;align-items:start}
.lk-p{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:18px;box-shadow:0 14px 34px rgba(44,66,83,.12),0 2px 6px rgba(44,66,83,.08)}
.lk-p h3{color:var(--fg);margin:0;font-family:var(--f-display);font-weight:400;font-size:15px}.lk-p .q{margin:14px 0 8px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.lk-tg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.lk-opt{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:8px;padding:9px 11px;font-size:14px;font-weight:600;border:2px solid var(--line);border-radius:8px;transition:transform .15s ease,box-shadow .15s ease}
.lk-opt:hover{transform:translateY(-2px);box-shadow:0 8px 16px rgba(44,66,83,.12)}.lk-opt[aria-pressed="true"]{border-color:var(--fg);background:var(--panel)}
.lk-opt:focus-visible,.lk-sw:focus-visible,.lk-g:focus-visible{outline:2px solid var(--blue-ink);outline-offset:2px}
.lk-dot{width:16px;height:16px;border-radius:4px;border:1px solid rgba(44,66,83,.25);flex:none}
.lk-sws{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}
.lk-sw{all:unset;cursor:pointer;aspect-ratio:1;border-radius:6px;box-sizing:border-box;border:1px solid rgba(44,66,83,.2);transition:transform .15s ease}.lk-sw:hover{transform:scale(1.08)}.lk-sw[aria-pressed="true"]{border:3px solid var(--fg)}
.lk-own{margin-top:10px;display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--muted)}.lk-own input{width:44px;height:30px;border:1px solid var(--line-2);border-radius:6px;padding:0;background:none;cursor:pointer}
.lk-fonts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.lk-fonts .lk-opt{flex-direction:column;align-items:flex-start;gap:2px}.lk-fonts .lk-opt b{font-size:18px;font-weight:700;line-height:1.2}.lk-fonts .lk-opt span{font-size:11.5px;font-weight:500;color:var(--muted)}
.lk-lays{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.lk-lays .lk-opt{flex-direction:column;align-items:stretch;gap:6px}.lk-lays .lk-opt span{font-size:12px;font-weight:500;color:var(--muted)}
.lk-mini{display:grid;gap:3px;height:46px}.lk-mini i{display:block;border-radius:3px;background:var(--panel)}.lk-mini i.h{background:var(--rv-main-17232C,#17232C)}.lk-mini i.p{background:var(--rv-soft-B9D9EB,#B9D9EB)}
.lk-gs{grid-column:1/-1;border-radius:12px;padding:20px 24px;color:#fff;background:linear-gradient(180deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,.03) 18%,rgba(255,255,255,0) 40%),linear-gradient(135deg,rgba(255,255,255,.10) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,.28) 55%,rgba(0,0,0,.35) 100%),var(--rv-main-17232C,#17232C);box-shadow:0 18px 40px rgba(44,66,83,.28),inset 0 1px 0 rgba(255,255,255,.26)}
.lk-gs h3{color:#fff;margin:0;font-family:var(--f-display);font-weight:400;font-size:15px}.lk-gs p{margin:6px 0 14px;font-size:13px;color:#C9D4DD}
.lk-gsr{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:20px}
.lk-g{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;padding:4px;color:#9FB0BE;transition:transform .2s ease,filter .2s ease}
.lk-g:hover{transform:translateY(-6px) scale(1.04);filter:drop-shadow(0 10px 14px rgba(0,0,0,.45))}.lk-g svg{width:100%;max-width:190px}.lk-g span{font-size:13px;font-weight:700}.lk-g i{width:28px;height:2px;background:transparent}
.lk-g[aria-pressed="true"]{color:#fff}.lk-g[aria-pressed="true"] i{background:var(--rv-accent-D9BF8E,#D9BF8E)}
.lk-f{margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}.lk-f .msg{font-size:13px;color:var(--muted)}
@media (max-width:760px){.lk-gsr{grid-template-columns:repeat(3,minmax(0,1fr))}.lk-prev-g{position:relative;left:auto;top:auto;transform:none;margin:0 auto}.lk-prev-card{display:none}.lk{padding:18px 16px}}
/* layouts on the project home page */
html[data-layout="photo"] .mh-hero{grid-template-columns:minmax(0,1.5fr) minmax(0,.9fr)}
html[data-layout="photo"] .mh-hero .mh-stage{order:-1;padding:14px 0 14px 14px}
html[data-layout="top"] .mh-stats{order:-1;margin:0 0 14px}
html[data-layout="side"] .rs-home{display:grid;grid-template-columns:minmax(0,1fr) 260px;column-gap:14px}
html[data-layout="side"] .rs-home>*{grid-column:1/-1}
html[data-layout="side"] .rs-home>.mh-hero{grid-column:1;grid-row:1}
html[data-layout="side"] .rs-home>.mh-stats{grid-column:2;grid-row:1;margin:0;grid-template-columns:1fr;align-content:stretch}
@media (max-width:900px){html[data-layout] .rs-home{display:flex}html[data-layout] .mh-stats{order:0;margin:-36px 8px 12px;grid-template-columns:repeat(2,minmax(0,1fr))}html[data-layout] .mh-hero{grid-template-columns:1fr}html[data-layout] .mh-hero .mh-stage{order:0}}
.rvg{width:100%;max-width:240px;display:block;overflow:visible}`;
  const stEl = document.createElement("style"); stEl.textContent = css; document.head.appendChild(stEl);

  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  function html() {
    const L = W, F = rvLook.FONTS;
    return `<div class="lk" role="dialog" aria-modal="true" aria-labelledby="lkH">
      <div class="lk-h"><div><h2 id="lkH">Appearance</h2><p>Pick a part of the page, then a color or font. It changes everywhere on Revora right away, only for you.</p></div><button type="button" class="lk-x" data-lkx aria-label="Close">×</button></div>
      <section class="lk-prev" aria-label="Preview">
        <div class="lk-prev-t"><p class="k">Last opened</p><p class="n">Filming</p><p class="s">Sport restoration</p>
          <div class="nx"><span>Next step</span><b>Price it and check the budget</b></div>
          <div class="lk-prev-b"><span class="a">Open project</span><span class="c">Continue</span><span class="o">Start another bike</span></div></div>
        <div class="lk-prev-g">${rvGauge(77)}</div>
        <div class="lk-prev-card"><b>Your bikes</b><span>A card on the page</span><i></i></div>
      </section>
      <div class="lk-grid">
        <section class="lk-p" aria-label="Colors"><h3>Colors</h3>
          <p class="q">1. Pick what to change</p>
          <div class="lk-tg">${TARGETS.map(([id, l]) => `<button type="button" class="lk-opt" data-lkt="${id}" aria-pressed="${id === target}"><span class="lk-dot" style="background:${L[id]}"></span>${l}</button>`).join("")}</div>
          <p class="q">2. Pick a color</p>
          <div class="lk-sws">${SW.map(([n, h]) => `<button type="button" class="lk-sw" data-lks="${h}" aria-label="${n}" title="${n}" aria-pressed="${L[target].toUpperCase() === h}" style="background:${h}"></button>`).join("")}</div>
          <label class="lk-own">Or your own<input type="color" data-lkown value="${L[target]}"></label>
        </section>
        <section class="lk-p" aria-label="Fonts"><h3>Fonts</h3>
          <p class="q">1. Pick what to change</p>
          <div class="lk-tg">${[["head", "Headings"], ["body", "Body text"]].map(([id, l]) => `<button type="button" class="lk-opt" data-lkft="${id}" aria-pressed="${id === fontTarget}">${l}</button>`).join("")}</div>
          <p class="q">2. Pick a font</p>
          <div class="lk-fonts">${FONT_ORDER.map(id => `<button type="button" class="lk-opt" data-lkf="${id}" aria-pressed="${L[fontTarget] === id}"><b style="font-family:${esc(F[id][1])}">Aa 123</b><span>${esc(F[id][0])}</span></button>`).join("")}</div>
        </section>
        <section class="lk-p" aria-label="Layout"><h3>Layout</h3>
          <p class="q">Project page</p>
          <div class="lk-lays">${LAYOUTS.map(([id, l, d]) => `<button type="button" class="lk-opt" data-lkl="${id}" aria-pressed="${L.layout === id}">${mini(id)}<b>${l}</b><span>${d}</span></button>`).join("")}</div>
        </section>
        <section class="lk-gs" aria-label="Speedometer"><h3>Speedometer</h3><p>How your course progress shows on the garage page.</p>
          <div class="lk-gsr">${GAUGES.map(([id, l]) => `<button type="button" class="lk-g" data-lkg="${id}" aria-pressed="${L.gauge === id}">${gaugeFor(id)}<span>${l}</span><i aria-hidden="true"></i></button>`).join("")}</div>
        </section>
      </div>
      <div class="lk-f"><button type="button" class="btn" data-lksave style="background:var(--rv-main-17232C,#17232C);color:var(--rv-on-main,#fff)">Save</button>
        <button type="button" class="btn ghost" data-lkdef>Back to default</button><button type="button" class="linkbtn" data-lkx>Cancel</button>
        <span class="msg">${window.RV_DEMO ? "The demo doesn't keep changes." : "Saved on this browser, and to your account when you're signed in so it follows you to other devices."}</span></div>
    </div>`;
  }
  function mini(id) {
    const h = '<i class="h"></i>', p = '<i class="p"></i>', s = '<i></i><i></i><i></i><i></i>';
    if (id === "photo") return `<span class="lk-mini" style="grid-template-columns:1.4fr 1fr;grid-template-rows:1fr 10px">${p}${h}<span style="grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:3px">${s}</span></span>`;
    if (id === "side") return `<span class="lk-mini" style="grid-template-columns:1fr 1.4fr 26px;grid-template-rows:repeat(4,1fr)"><i class="h" style="grid-row:1/-1"></i><i class="p" style="grid-row:1/-1"></i>${s}</span>`;
    if (id === "top") return `<span class="lk-mini" style="grid-template-columns:1fr 1.4fr;grid-template-rows:10px 1fr"><span style="grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:3px">${s}</span>${h}${p}</span>`;
    return `<span class="lk-mini" style="grid-template-columns:1fr 1.4fr;grid-template-rows:1fr 10px">${h}${p}<span style="grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:3px">${s}</span></span>`;
  }
  function gaugeFor(id) {
    const de = document.documentElement, was = de.getAttribute("data-gauge");
    de.setAttribute("data-gauge", id); const s = rvGauge(77).replace('class="rvg"', 'class="rvg-pick"'); de.setAttribute("data-gauge", was);
    return s;
  }
  function live() { rvLook.apply(W); if (window.rvGaugeRefresh) rvGaugeRefresh(); }
  function redraw() { const o = document.getElementById("rvLook"); if (!o) return; const y = o.scrollTop; o.innerHTML = html(); bind(o); o.scrollTop = y; }
  function close(keep) {
    const o = document.getElementById("rvLook"); if (!o) return;
    if (!keep) { rvLook.apply(saved); if (window.rvGaugeRefresh) rvGaugeRefresh(); }
    o.remove(); if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function bind(o) {
    o.onclick = e => { if (e.target === o) close(); };
    o.onkeydown = e => { if (e.key === "Escape") close(); };
    o.querySelectorAll("[data-lkx]").forEach(b => b.onclick = () => close());
    o.querySelectorAll("[data-lkt]").forEach(b => b.onclick = () => { target = b.dataset.lkt; redraw(); });
    o.querySelectorAll("[data-lks]").forEach(b => b.onclick = () => { W[target] = b.dataset.lks; live(); redraw(); });
    const own = o.querySelector("[data-lkown]"); if (own) own.oninput = e => { W[target] = e.target.value.toUpperCase(); live(); }, own.onchange = () => redraw();
    o.querySelectorAll("[data-lkft]").forEach(b => b.onclick = () => { fontTarget = b.dataset.lkft; redraw(); });
    o.querySelectorAll("[data-lkf]").forEach(b => b.onclick = () => { W[fontTarget] = b.dataset.lkf; live(); redraw(); });
    o.querySelectorAll("[data-lkl]").forEach(b => b.onclick = () => { W.layout = b.dataset.lkl; live(); redraw(); });
    o.querySelectorAll("[data-lkg]").forEach(b => b.onclick = () => { W.gauge = b.dataset.lkg; live(); redraw(); });
    o.querySelector("[data-lkdef]").onclick = () => { W = Object.assign({}, rvLook.DEF); live(); redraw(); };
    o.querySelector("[data-lksave]").onclick = () => {
      saved = Object.assign({}, W);
      if (!window.RV_DEMO) { rvLook.save(saved); if (window.rvPrefs) { try { rvPrefs.set({ look: saved }); } catch (e) {} } }
      close(true);
      if (typeof window.toast === "function") toast(window.RV_DEMO ? "Looks good. The demo doesn't keep it, so make an account to save it." : "Appearance saved.");
    };
  }
  window.rvOpenLook = function () {
    close(); lastFocus = document.activeElement;
    saved = rvLook.full(rvLook.read()); W = Object.assign({}, saved); target = "main"; fontTarget = "head";
    const o = document.createElement("div"); o.className = "lk-bg"; o.id = "rvLook"; o.innerHTML = html(); document.body.appendChild(o); bind(o);
    const x = o.querySelector(".lk-x"); x && x.focus();
  };
  // a look saved to the account wins on a new device
  window.rvLookFromAccount = function (prefs) {
    if (!prefs || !prefs.look || window.RV_DEMO) return;
    if (!same(rvLook.full(prefs.look), rvLook.full(rvLook.read()))) { rvLook.save(prefs.look); if (window.rvGaugeRefresh) rvGaugeRefresh(); }
  };
})();
