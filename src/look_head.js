/* ============ Look: the account's colors and fonts, applied before the page draws ============
   build.py puts this in <head> together with RV_LOOK_VARS, the list of every brand color in the stylesheet
   ([variable, family, original color]). Picking a new color for a family moves all of that family's colors,
   keeping each one's offset from the family's base, so tints stay tints and dark text stays dark. */
(function () {
  var BASE = { main: "#17232C", soft: "#B9D9EB", accent: "#D9BF8E", text: "#17232C", card: "#FFFFFF", bg: "#FFFFFF" };
  var DEF = { main: "#17232C", soft: "#B9D9EB", accent: "#D9BF8E", text: "#17232C", card: "#FFFFFF", bg: "#F8F3EA", head: "michroma", body: "public", gauge: "G", layout: "std" };
  var FONTS = {
    michroma: ["Michroma", "'Michroma',sans-serif", "Michroma"],
    shoulders: ["Big Shoulders", "'Big Shoulders Display',sans-serif", "Big+Shoulders+Display:wght@800;900"],
    barlow: ["Barlow", "'Barlow',sans-serif", "Barlow:wght@400;600;700;800"],
    saira: ["Saira", "'Saira',sans-serif", "Saira:wght@400;600;700;800"],
    public: ["Public Sans", "'Public Sans',system-ui,sans-serif", "Public+Sans:ital,wght@0,400..800;1,400..800"],
    plex: ["IBM Plex Sans", "'IBM Plex Sans',system-ui,sans-serif", "IBM+Plex+Sans:wght@400;600;700"],
    classic: ["Revora classic", "\"Barlow Semi Condensed\",\"Barlow\",\"Arial Narrow\",system-ui,sans-serif", "Barlow+Semi+Condensed:wght@600;700"],
    nunito: ["Nunito Sans", "\"Nunito Sans\",system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif", "Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400"]
  };
  function hsl(hx) {
    var n = parseInt(hx.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return [h, s, l];
  }
  function hex(h, s, l) {
    function f(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }
    var r, g, b; if (!s) r = g = b = l; else { var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; r = f(p, q, h + 1 / 3); g = f(p, q, h); b = f(p, q, h - 1 / 3); }
    return "#" + [r, g, b].map(function (x) { return ("0" + Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16)).slice(-2); }).join("").toUpperCase();
  }
  function clamp(x) { return Math.max(0, Math.min(1, x)); }
  // the color that sits in the same place next to `pick` as `orig` sits next to `base`
  function shade(base, orig, pick) {
    if (pick.toUpperCase() === base.toUpperCase()) return orig;
    var B = hsl(base), O = hsl(orig), P = hsl(pick);
    var h = B[1] < .05 ? P[0] : (P[0] + O[0] - B[0] + 1) % 1;
    var s = B[1] < .05 ? P[1] : (P[1] < .05 ? 0 : clamp(O[1] * P[1] / B[1]));
    var l = O[2] >= B[2] ? P[2] + (O[2] - B[2]) * (1 - P[2]) / (1 - B[2] || 1) : P[2] * O[2] / (B[2] || 1);
    if (B[2] > .98) l = P[2];
    return hex(h, s, clamp(l));
  }
  function read() { try { var v = JSON.parse(localStorage.getItem("rv.look") || "null"); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } }
  function full(look) { var o = {}, k; for (k in DEF) o[k] = DEF[k]; for (k in look || {}) if (look[k] != null) o[k] = look[k]; return o; }
  function css(look) {
    var L = full(look), out = [], vars = window.RV_LOOK_VARS || [];
    for (var i = 0; i < vars.length; i++) { var v = vars[i], pick = L[v[1]]; if (pick && pick.toUpperCase() !== BASE[v[1]]) out.push(v[0] + ":" + shade(BASE[v[1]], v[2], pick)); }
    var hf = FONTS[L.head] || FONTS[DEF.head], bf = FONTS[L.body] || FONTS[DEF.body];
    out.push("--rv-f-display:" + hf[1], "--rv-f-ui:" + bf[1]);
    // text on the main color and on the accent picks black or white so it stays readable
    function light(c) { var n = parseInt(c.slice(1), 16); return (.299 * (n >> 16) + .587 * (n >> 8 & 255) + .114 * (n & 255)) > 150; }
    ["main", "soft", "accent"].forEach(function (f) { if (L[f].toUpperCase() !== BASE[f]) out.push("--rv-on-" + f + ":" + (light(L[f]) ? "#17232C" : "#FFFFFF")); });
    return ":root{" + out.join(";") + "}";
  }
  function fontsUrl(look) {
    var L = full(look), fams = {}; fams[L.head] = 1; fams[L.body] = 1;
    return "https://fonts.googleapis.com/css2?" + Object.keys(fams).filter(function (k) { return FONTS[k]; }).map(function (k) { return "family=" + FONTS[k][2]; }).join("&") + "&display=swap";
  }
  function apply(look) {
    var st = document.getElementById("rv-look");
    if (!st) { st = document.createElement("style"); st.id = "rv-look"; document.head.appendChild(st); }
    st.textContent = css(look);
    var ln = document.getElementById("rv-look-fonts"), u = fontsUrl(look);
    if (!ln) { ln = document.createElement("link"); ln.id = "rv-look-fonts"; ln.rel = "stylesheet"; document.head.appendChild(ln); }
    if (ln.href !== u) ln.href = u;
    document.documentElement.setAttribute("data-layout", full(look).layout);
    document.documentElement.setAttribute("data-gauge", full(look).gauge);
  }
  window.rvLook = { BASE: BASE, DEF: DEF, FONTS: FONTS, read: read, full: full, css: css, apply: apply, shade: shade,
    save: function (look) { try { localStorage.setItem("rv.look", JSON.stringify(look || {})); } catch (e) {} apply(look); } };
  apply(read());
})();
