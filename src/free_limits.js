/* ============ What Free gets a taste of ============
   Course: Parts 1 and 2 open, the rest is Restorer.  Ask the mechanic: 3 questions to try it.
   History report: free to view, printing or saving the PDF is Rider.  Value page: shown blurred with the way to unlock it.
   Photos: 5 per bike on Free, unlimited on Rider and up. */
const FREE_PARTS = 2, FREE_CHATS = 3, FREE_PHOTOS = 5;
Object.assign(LOCK_TXT, {
  lesson: "Parts 1 and 2 of the course are free. Restorer opens every part, with the steps, tools, parts and how-to for each one.",
  pdf: "Print the history report or save it as a PDF to hand to a buyer or a shop. Viewing it stays free.",
  photos: "Free includes 5 photos per bike. Rider and up add as many as you like: parts, receipts, before and after.",
  chat: "You've used your 3 free questions. Rider includes 10 a day, and Restorer as many as you like." });
delete SEC_PLAN.value;   // the value page shows on Free, blurred
needFor = function (sec) {
  if (!GENERIC && !RESTORE_OPEN.has(sec) && sec !== "plans") {
    if (sec === "course" || sec === "home") return null;
    if (sec === "lesson") { const i = lessonIndex(R.lesson); return i >= 0 && i < FREE_PARTS ? null : "restorer"; }
    return "restorer";
  }
  return SEC_PLAN[sec] || null;
};
// locked course parts get a badge on the course page
(function () { const v = VIEWS.course; if (!v) return; const b0 = v.bind;
  v.bind = function (root) { b0.call(this, root); if (hasPlan("restorer")) return;
    $$(".tl", root).forEach((t, i) => { if (i < FREE_PARTS) { const r = t.querySelector(".tb .row"); if (r && !r.querySelector(".pill.green.fr")) r.insertAdjacentHTML("beforeend", `<span class="pill green fr">Free</span>`); return; }
      t.classList.add("tl-lock"); const r = t.querySelector(".tb .row"); if (r) r.insertAdjacentHTML("beforeend", `<span class="lockb">${ic("lock")}Restorer</span>`); }); };
})();
// Ask the mechanic: 3 to try on Free, counted on the account
chatAllowed = function () {
  if (!hasPlan("rider")) {
    const P = window.rvPrefs ? rvPrefs.get() : {}, used = +P.freeChats || 0;
    if (used >= FREE_CHATS) { modal(upsellBody("rider", { title: "That's your 3 free questions", text: LOCK_TXT.chat }), m => bindUpsell(m)); return false; }
    if (window.rvPrefs) rvPrefs.set({ freeChats: used + 1 });
    if (used + 1 === FREE_CHATS) setTimeout(() => toast("That was your last free question. Rider includes 10 a day."), 1500);
    return true;
  }
  if (hasPlan("restorer")) return true;
  const P = window.rvPrefs ? rvPrefs.get() : {}, d = today(), used = P.chatDay && P.chatDay.d === d ? P.chatDay.n : 0;
  if (used >= 10) { modal(upsellBody("restorer", { title: "That's your 10 questions for today", text: "Rider includes 10 questions a day. Restorer lets you ask as many as you like. Your questions reset tomorrow." }), m => bindUpsell(m)); return false; }
  if (window.rvPrefs) rvPrefs.set({ chatDay: { d, n: used + 1 } });
  return true;
};
// history report: printing and the PDF are Rider
(function () { const v = VIEWS.report; if (!v) return; const b0 = v.bind;
  v.bind = function (root) { b0.call(this, root); const p = $("#rpPrint", root); if (!p || hasPlan("rider")) return;
    const go0 = p.onclick; p.innerHTML = ic("lock") + " " + p.textContent.trim(); p.onclick = e => { if (gate("rider", "pdf", "the printable history report")) go0 && go0(e); }; };
})();
// value page: the numbers show blurred until Rider
(function () { const v = VIEWS.value; if (!v) return; const b0 = v.bind;
  v.bind = function (root) { b0.call(this, root); if (hasPlan("rider")) return;
    const tabs = root.querySelector(".vl-tabs"); if (!tabs || root.querySelector(".lock-peek")) return;
    const wrap = document.createElement("div"); wrap.className = "lock-peek"; const inner = document.createElement("div"); inner.className = "lock-peek-in"; inner.setAttribute("inert", ""); inner.setAttribute("aria-hidden", "true");
    let n = tabs.nextSibling; while (n) { const nx = n.nextSibling; inner.appendChild(n); n = nx; }
    wrap.appendChild(inner); wrap.insertAdjacentHTML("beforeend", `<div class="lock-peek-card">${upsellBody("rider", { title: "See what your bike is worth", text: LOCK_TXT.value })}</div>`);
    tabs.after(wrap); bindUpsell(wrap); };
})();
// photos: 5 per bike on Free
function photoCount() {
  let n = 0; const isImg = v => typeof v === "string" && v.startsWith("data:image");
  const walk = (v, d) => { if (isImg(v)) n++; else if (v && typeof v === "object" && d < 3) Object.values(v).forEach(x => walk(x, d + 1)); };
  Object.keys(S).forEach(c => { const coll = S[c]; if (coll && typeof coll === "object") Object.values(coll).forEach(r => walk(r, 0)); });
  return n;
}
(function () { const c0 = compressImage; window.compressImageRaw = c0;
  compressImage = function (file, maxBytes) {
    if (!hasPlan("rider") && photoCount() >= FREE_PHOTOS) {
      modal(upsellBody("rider", { title: "You've used your 5 free photos", text: LOCK_TXT.photos }), m => bindUpsell(m));
      return new Promise(() => {});   // the upgrade box is the answer; the upload just doesn't happen
    }
    return c0(file, maxBytes);
  };
})();
// a locked course part says which part it is
(function () { const v = VIEWS.locked; if (!v) return; const r0 = v.render;
  v.render = function () { if (R.sec !== "lesson") return r0.call(this); const i = lessonIndex(R.lesson), L = LESSONS[R.lesson] || {};
    return `<div class="up-page">${upsellBody("restorer", { title: `Part ${i + 1}: ${L.title || "the next part"} is in Restorer`, text: LOCK_TXT.lesson })}
      <p class="faint" style="text-align:center;margin-top:12px">Parts 1 and 2 stay free. <button class="linkbtn" data-goto="course">Back to the course</button></p></div>`; };
})();
