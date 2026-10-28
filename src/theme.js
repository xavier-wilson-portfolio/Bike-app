/* ============ Appearance: light, dark, or match the device ============
   The choice lives in this browser (rv.theme) and, when signed in, in the account's prefs so it follows them to other devices.
   index.html sets data-theme before the page draws, so there's no white flash on load. */
const THEMES = [["light", "Light"], ["dark", "Dark"], ["system", "Match my device"]];
const themeMq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
const themeGet = () => { try { return localStorage.getItem("rv.theme") || "light"; } catch (e) { return "light"; } };
function themeApply(t) {
  const dark = t === "dark" || (t === "system" && themeMq && themeMq.matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  const mc = document.querySelector('meta[name="theme-color"]'); if (mc) mc.content = dark ? "#12191F" : "#17232C";
}
function themeSet(t) {
  try { localStorage.setItem("rv.theme", t); } catch (e) {}
  if (window.rvPrefs && !window.RV_DEMO) rvPrefs.set({ theme: t });
  themeApply(t);
  if (typeof scheduleRender === "function") scheduleRender();   // charts and the 3D view pick up the new colors
}
if (themeMq && themeMq.addEventListener) themeMq.addEventListener("change", () => { if (themeGet() === "system") themeApply("system"); });
// a choice saved to the account wins on a new device
(function () { const p = window.rvPrefs && rvPrefs.get(); if (p && p.theme && p.theme !== themeGet()) { try { localStorage.setItem("rv.theme", p.theme); } catch (e) {} } themeApply(themeGet()); })();

window.themeSettingsHtml = () => {
  const cur = themeGet();
  return `<div class="panel stack"><h2 class="sec">Appearance</h2>
    <div class="seg" role="radiogroup" aria-label="Theme">${THEMES.map(([v, l]) => `<button type="button" role="radio" aria-checked="${cur === v}" class="${cur === v ? "on" : ""}" data-theme-pick="${v}">${l}</button>`).join("")}</div>
    <p class="muted" style="margin:0;font-size:12.5px">Dark is easier on the eyes in the garage at night. Match my device follows your phone or computer's setting.</p></div>`;
};
(function () {
  const r0 = VIEWS.settings.render, b0 = VIEWS.settings.bind;
  VIEWS.settings.render = function () {
    const html = r0.apply(this, arguments), at = html.indexOf('<div class="stack">');
    return at > 0 ? html.slice(0, at + 19) + themeSettingsHtml() + html.slice(at + 19) : html + themeSettingsHtml();
  };
  VIEWS.settings.bind = function (root) {
    b0.apply(this, arguments);
    $$("[data-theme-pick]", root).forEach(b => b.onclick = () => {
      themeSet(b.dataset.themePick);
      $$("[data-theme-pick]", root).forEach(x => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); });
    });
  };
})();
