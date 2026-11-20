/* ============ Speedometers: the six course gauges people can pick in Appearance ============
   rvGauge(pct, {light}) draws the one picked (html[data-gauge]); light = drawn on a white card instead of a dark box. */
(function () {
  const RED = "#B83A33";
  const st = (o) => Object.entries(o).map(([k, v]) => `${k}:${v}`).join(";");
  function make(pct, light) {
    const V = Math.max(0, Math.min(1, (+pct || 0) / 100)), P100 = Math.round(V * 100);
    const C = light ? { ink: "var(--fg)", mid: "#9AA5AE", dim: "rgba(44,66,83,.14)", lab: "var(--muted)", hl: "var(--muted)", line: "#C9D1D8", face: "rgba(44,66,83,.05)" }
                    : { ink: "#FFFFFF", mid: "#7D90A0", dim: "rgba(255,255,255,.12)", lab: "#9FB0BE", hl: "#C9D4DD", line: "#4A6072", face: "rgba(0,0,0,.22)" };
    const TAN = "var(--rv-accent-D9BF8E,#D9BF8E)";
    let CX = 120, CY = 118;
    const P = (r, a) => { const t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; };
    const ang = (f, s0 = 135, sw = 270) => s0 + f * sw;
    const f1 = n => n.toFixed(1);
    const arc = (r, a0, a1, style) => { const [x0, y0] = P(r, a0), [x1, y1] = P(r, a1); return `<path d="M ${f1(x0)} ${f1(y0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f1(x1)} ${f1(y1)}" style="fill:none;${st(style)}"/>`; };
    const line = (r0, r1, a, color, w) => { const [x0, y0] = P(r0, a), [x1, y1] = P(r1, a); return `<line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(x1)}" y2="${f1(y1)}" style="stroke:${color};stroke-width:${w}"/>`; };
    const text = (x, y, s, size, fill, fam, extra) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" style="font-family:${fam === "ui" ? "var(--f-ui)" : "var(--f-display)"};font-size:${size}px;fill:${fill};${extra || ""}">${s}</text>`;
    const readout = (y, size) => `<text x="120" y="${y}" text-anchor="middle" style="font-family:var(--f-display);font-size:${size}px;fill:${C.ink}">${P100}<tspan style="font-size:${Math.round(size * .4)}px;fill:${C.lab}" dx="3">%</tspan></text>`;
    const label = (y, s = "COURSE DONE") => text(120, y, s, 9, C.lab, "ui", "font-weight:600;letter-spacing:2.4px");
    const g = document.documentElement.getAttribute("data-gauge") || "G";
    let out = "", vb = "0 0 240 220";
    if (g === "H") {
      out += arc(96, ang(0), ang(1), { stroke: C.dim, "stroke-width": 3 }) + (V > 0 ? arc(96, ang(0), ang(V), { stroke: TAN, "stroke-width": 3 }) : "");
      for (let i = 0; i <= 10; i++) out += line(102, 107, ang(i / 10), C.mid, 1);
      out += line(86, 106, ang(V), C.ink, 1.6) + readout(128, 40) + label(150);
    } else if (g === "I") {
      CY = 112; vb = "0 0 240 224";
      out += `<circle cx="120" cy="112" r="104" style="fill:none;stroke:${C.line};stroke-width:1"/><circle cx="120" cy="112" r="100" style="fill:${C.face}"/>`;
      for (let i = 0; i < 100; i++) { const mj = i % 10 === 0, md = i % 5 === 0; out += line(mj ? 91 : md ? 95 : 97, 100, -90 + i * 3.6, i >= 80 && !mj ? RED : mj ? C.ink : C.mid, mj ? 1.4 : md ? .9 : .5); }
      for (let n = 0; n < 100; n += 10) { const [x, y] = P(80, -90 + n * 3.6); out += text(x, y + 3.5, n, 8.5, C.hl, "ui", "font-weight:600"); }
      out += arc(86, -90 + 288, 270, { stroke: RED, "stroke-width": 1.5 });
      CY = 146; out += `<circle cx="120" cy="146" r="20" style="fill:none;stroke:${C.line};stroke-width:1"/>`;
      for (let i = 0; i < 8; i++) out += line(16, 20, -90 + i * 45, C.mid, .8);
      out += line(-3, 16, -90 + V * 360, TAN, 1.2) + text(120, 176, "STEPS", 6.5, C.lab, "ui", "font-weight:600;letter-spacing:1.5px");
      CY = 112; out += text(120, 78, P100 + "%", 14, C.ink) + text(120, 92, "COURSE", 6.5, C.lab, "ui", "font-weight:600;letter-spacing:2px") + line(-18, 96, -90 + V * 360, TAN, 1.6) + `<circle cx="120" cy="112" r="3.5" style="fill:${TAN}"/>`;
    } else if (g === "J") {
      const N = 60;
      for (let i = 0; i < N; i++) { const f0 = i / N, lit = (i + 1) / N <= V + 1e-9, col = lit ? (f0 >= .8 ? RED : TAN) : (f0 >= .8 ? "rgba(184,58,51,.35)" : C.dim); out += line(98 - (10 + 10 * f0), 98, ang(f0 + .5 / N, 150, 240), col, 2); }
      for (const n of [0, 20, 40, 60, 80, 100]) { const [x, y] = P(66 - 4 * (n / 100), ang(n / 100, 150, 240)); out += text(x, y + 3, n, 8, n >= 80 ? RED : C.lab, "ui", "font-weight:600"); }
      out += `<line x1="78" y1="104" x2="162" y2="104" style="stroke:${C.line}"/>` + readout(140, 32) + `<line x1="78" y1="152" x2="162" y2="152" style="stroke:${C.line}"/>` + label(170);
    } else if (g === "K") {
      out += readout(84, 40) + label(106);
      const x0 = 14, x1 = 226;
      for (let i = 0; i <= 100; i++) { const x = x0 + (x1 - x0) * i / 100, h = i % 10 === 0 ? 18 : i % 5 === 0 ? 11 : 6, col = i > 80 ? RED : i % 10 === 0 ? C.ink : C.mid;
        out += `<line x1="${f1(x)}" y1="${150 - h}" x2="${f1(x)}" y2="150" style="stroke:${col};stroke-width:${i % 10 === 0 ? 1.2 : .6}"/>`; if (i % 20 === 0) out += text(x, 166, i, 8, i > 80 ? RED : C.lab, "ui", "font-weight:600"); }
      const xv = x0 + (x1 - x0) * V;
      out += `<line x1="${x0}" y1="154" x2="${f1(xv)}" y2="154" style="stroke:${TAN};stroke-width:2"/><polygon points="${f1(xv - 5)},122 ${f1(xv + 5)},122 ${f1(xv)},130" style="fill:${TAN}"/><line x1="${f1(xv)}" y1="130" x2="${f1(xv)}" y2="156" style="stroke:${TAN};stroke-width:1.4"/>`;
    } else if (g === "T") {
      out += arc(96, ang(0), ang(1), { stroke: C.dim, "stroke-width": 4 }) + (V > 0 ? arc(96, ang(0), ang(V), { stroke: TAN, "stroke-width": 4 }) : "") + line(86, 106, ang(V), C.ink, 2) + readout(130, 42) + label(154);
    } else {   // G: hairline instrument
      out += arc(104, ang(0), ang(1), { stroke: C.line, "stroke-width": 1 });
      for (let i = 0; i <= 100; i++) { const f = i / 100, r0 = i % 10 === 0 ? 90 : i % 5 === 0 ? 96 : 99, w = i % 10 === 0 ? 1.6 : i % 5 === 0 ? 1 : .6; out += line(r0, 104, ang(f), f > .8 ? RED : i % 10 === 0 ? C.ink : C.mid, w); }
      for (let n = 0; n <= 10; n += 2) { const [x, y] = P(78, ang(n / 10)); out += text(x, y + 3.5, n * 10, 9, n >= 9 ? RED : C.hl, "ui", "font-weight:600"); }
      out += arc(108, ang(.8), ang(1), { stroke: RED, "stroke-width": 2 }) + line(-16, 100, ang(V), TAN, 1.6) + `<circle cx="120" cy="118" r="4" style="fill:${light ? "var(--surface)" : "#17232C"};stroke:${TAN};stroke-width:1.5"/>` + readout(176, 26) + label(196);
    }
    return `<svg class="rvg${light ? " light" : ""}" data-pct="${P100}" viewBox="${vb}" role="img" aria-label="${P100}% of the course done">${out}</svg>`;
  }
  window.rvGauge = (pct, o) => make(pct, o && o.light);
  // redraw every gauge on the page (after the speedometer choice changes)
  window.rvGaugeRefresh = () => document.querySelectorAll("svg.rvg[data-pct]").forEach(el => { el.outerHTML = make(+el.dataset.pct, el.classList.contains("light")); });
})();
