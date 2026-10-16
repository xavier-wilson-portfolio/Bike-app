/* ============ Send feedback (from the menu) and page-tip settings ============ */
const FB_KINDS = [["idea", "Idea", "bulb"], ["problem", "Something's wrong", "alert"], ["question", "Question", "help"], ["praise", "I like this", "star"]];
function openFeedback(kind) {
  const who = window.RV_CLOUD ? (RV_CLOUD.user && RV_CLOUD.user.email) || "" : "";
  let k = kind || "idea", rate = 0;
  modal(`<div class="fb"><h2 style="margin:0">Send feedback</h2><p class="hint-text" style="margin:2px 0 12px">It goes straight to the people building Revora. We read every one.</p>
    <div class="fb-kinds" role="radiogroup" aria-label="Kind of feedback">${FB_KINDS.map(([v, t, i]) => `<button type="button" class="fb-k${v === k ? " on" : ""}" role="radio" aria-checked="${v === k}" data-k="${v}">${ic(i)}<span>${t}</span></button>`).join("")}</div>
    <label class="fb-l">What's on your mind?<textarea id="fbMsg" rows="5" maxlength="3000" placeholder="For example: I'd like to log tire pressures, or: the Parts page is slow on my phone."></textarea></label>
    <div class="fb-row"><span class="fb-q">How's Revora so far?</span><div class="fb-rate" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="false" aria-label="${i} out of 5" data-r="${i}">${ic("star")}</button>`).join("")}</div></div>
    <label class="fb-l">Email for a reply (optional)<input id="fbMail" type="email" value="${esc(who)}" placeholder="you@example.com" autocomplete="email"></label>
    <p class="faint" style="font-size:12.5px;margin:6px 0 0">We include the page you're on (${esc(SEC[R.sec]?.t || R.sec)}) and the bike, so we can find the problem. No passwords or project data.</p>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><button class="btn" data-x>Cancel</button><button class="btn pri" data-ok>${ic("send")} Send</button></div></div>`, m => {
    const msg = m.querySelector("#fbMsg"); setTimeout(() => msg.focus(), 40);
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { k = b.dataset.k; m.querySelectorAll("[data-k]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); }); });
    const stars = [...m.querySelectorAll("[data-r]")];
    stars.forEach(b => b.onclick = () => { rate = +b.dataset.r; stars.forEach(x => { const on = +x.dataset.r <= rate; x.classList.toggle("on", on); x.setAttribute("aria-checked", +x.dataset.r === rate); }); });
    m.querySelector("[data-ok]").onclick = async () => {
      const text = msg.value.trim(); if (text.length < 3) { toast("Write a few words first.", "err"); msg.focus(); return; }
      const mail = m.querySelector("#fbMail").value.trim(); if (mail && !/^\S+@\S+\.\S+$/.test(mail)) { toast("That email doesn't look right.", "err"); return; }
      const btn = m.querySelector("[data-ok]"); btn.disabled = true; btn.textContent = "Sending…";
      const row = { kind: k, message: text.slice(0, 3000), rating: rate || null, email: mail || null, page: R.sec, bike: BIKE.name || "", app_build: window.RV_BUILD || "", device: (innerWidth < 700 ? "phone" : "desktop") + " · " + navigator.userAgent.slice(0, 160) };
      let res = { queued: true }; try { res = window.rvFeedback ? await rvFeedback(row) : res; } catch (e) {}
      closeModal(); toast(res.ok ? "Thanks. Your feedback was sent." : "Thanks. We'll send it as soon as you're back online.");
    };
  });
}
document.addEventListener("click", e => { const b = e.target.closest("[data-feedback]"); if (!b) return; e.preventDefault(); closeMenus(); openFeedback(b.dataset.feedback || ""); });

window.tipsSettingsHtml = () => {
  const P = tipPrefs();
  return `<div class="panel stack"><h2 class="sec">Page tips</h2><p class="muted" style="margin:0">The "How this page works" box shows the first time you open each page.</p>
    <div class="row" style="gap:8px;flex-wrap:wrap">${P.tipsOff ? `<button class="btn" id="tipsOn">Turn page tips back on</button>` : `<button class="btn" id="tipsOffBtn">Turn off page tips</button>`}<button class="btn" id="tipsReset">Show them again on every page</button></div></div>`;
};
(function () {
  const sb = VIEWS.settings.bind;
  VIEWS.settings.bind = function (root) {
    sb.call(this, root);
    const on = $("#tipsOn", root), off = $("#tipsOffBtn", root), rs = $("#tipsReset", root);
    if (on) on.onclick = () => { setTipPrefs({ tipsOff: false }); toast("Page tips are back on for pages you haven't seen."); render(false); };
    if (off) off.onclick = () => { setTipPrefs({ tipsOff: true, tipsAsked: true }); toast("Page tips are off."); render(false); };
    if (rs) rs.onclick = () => { setTipPrefs({ tipsOff: false, seen: [] }); Object.keys(guideHidden).forEach(k => delete guideHidden[k]); lsSet("rv.guides", guideHidden); toast("Each page will show its tips once more."); render(false); };
  };
})();
