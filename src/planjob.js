/* ============ Plan this job: parts, tools, time and a rough cost before you start ============
   Free gets 2 to try, Rider 10 a day, Restorer and up as many as they like (checked again on the server). */
function planAllowed() {
  if (hasPlan("restorer")) return true;
  const P = window.rvPrefs ? rvPrefs.get() : {};
  if (!hasPlan("rider")) { const used = +P.freePlans || 0;
    if (used >= 2) { modal(upsellBody("rider", { title: "That's your 2 free job plans", text: "Plan this job lists the parts, tools, time and rough cost before you start. Rider includes 10 a day, and Restorer as many as you like." }), m => bindUpsell(m)); return false; }
    if (window.rvPrefs) rvPrefs.set({ freePlans: used + 1 }); return true; }
  const d = today(), used = P.planDay && P.planDay.d === d ? P.planDay.n : 0;
  if (used >= 10) { modal(upsellBody("restorer", { title: "That's your 10 job plans for today", text: "Rider includes 10 a day. Restorer lets you plan as many jobs as you like." }), m => bindUpsell(m)); return false; }
  if (window.rvPrefs) rvPrefs.set({ planDay: { d, n: used + 1 } }); return true;
}
async function planJob(job, ctx) {
  if (!window.RV_CLOUD) { toast("Create a free account to plan jobs with the AI.", "err"); return; }
  if (!planAllowed()) return;
  const o = odoNow();
  modal(`<div class="pj"><h2 style="margin:0">Planning: ${esc(job)}</h2><div class="rc-load" style="margin-top:14px"><div><b>Working out parts, tools and time…</b><span class="muted">This takes a few seconds.</span><div class="rc-spin" aria-hidden="true"></div></div></div></div>`);
  let p = null, err = "";
  try {
    const res = await fetch(CHAT_API, { method: "POST", headers: await aiHeaders(), body: JSON.stringify({ task: { kind: "plan", text: `Bike: ${BIKE.name}${o ? ", about " + Math.round(o.miles) + " miles" : ""}.\nJob: ${job}${ctx ? "\nMore about it: " + ctx : ""}` } }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(res.status === 429 && /daily limit/.test(j.error || "") ? "you've used your job plans for now" : res.status === 400 ? "the AI isn't updated for job plans yet" : res.status === 401 ? "you need to be signed in" : "the AI is busy. Try again in a minute");
    const t = String(j.text || ""), a = t.indexOf("{"), b = t.lastIndexOf("}");
    try { p = JSON.parse(t.slice(a, b + 1)); } catch (e) { p = JSON.parse(t.slice(a, b + 1).replace(/,\s*([}\]])/g, "$1")); }
  } catch (e) { err = e.message || "it didn't work"; }
  if (!p) { modal(`<div class="pj"><h2 style="margin:0">Couldn't plan that one</h2><p class="muted">${esc(err || "The AI's answer didn't come through.")}. Try again, or ask the mechanic.</p><div class="row" style="justify-content:flex-end"><button class="btn" data-x>Close</button></div></div>`, m => m.querySelector("[data-x]").onclick = closeModal); return; }
  const arr = v => Array.isArray(v) ? v : [], parts = arr(p.parts).slice(0, 20).map(x => typeof x === "string" ? { name: x, qty: 1 } : { name: String(x.name || "").slice(0, 100), qty: +x.qty || 1, note: String(x.note || "").slice(0, 120) }).filter(x => x.name);
  const tools = arr(p.tools).map(String).slice(0, 20), steps = arr(p.steps).map(String).slice(0, 8), lo = Math.round(+p.cost_low || 0), hi = Math.round(+p.cost_high || 0);
  const canCart = typeof cartAdd === "function" && hasPlan("restorer") && ME.canWrite;
  modal(`<div class="pj"><div class="eyebrow">Plan this job</div><h2 style="margin:2px 0 6px">${esc(job)}</h2>${p.summary ? `<p style="margin:0">${esc(p.summary)}</p>` : ""}
    <div class="pj-stats"><div><span>Time</span><b>${+p.hours ? "About " + (+p.hours) + " h" : "—"}</b></div><div><span>Difficulty</span><b>${esc(p.difficulty || "—")}</b></div><div><span>Parts, roughly</span><b>${hi ? "$" + lo + "–$" + hi : "—"}</b></div></div>
    ${p.safety ? `<div class="num-note">${ic("alert")}<span>${esc(p.safety)}</span></div>` : ""}
    <div class="pj-cols"><section><h3>Parts</h3>${parts.length ? `<ul class="pj-list">${parts.map((x, i) => `<li><label><input type="checkbox" data-pjp="${i}" checked><span><b>${esc(x.name)}</b>${x.qty > 1 ? ` × ${x.qty}` : ""}${x.note ? `<small>${esc(x.note)}</small>` : ""}</span></label></li>`).join("")}</ul>` : `<p class="muted">No parts needed.</p>`}</section>
      <section><h3>Tools</h3>${tools.length ? `<ul class="pj-list plain">${tools.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : `<p class="muted">Basic hand tools.</p>`}</section></div>
    ${steps.length ? `<section><h3>The steps</h3><ol class="pj-steps">${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></section>` : ""}
    <p class="faint" style="font-size:12.5px">An AI estimate to plan with. Check part numbers, torque values and capacities in the service manual for your bike before you buy or tighten anything.</p>
    <div class="row" style="justify-content:flex-end;gap:8px;flex-wrap:wrap"><button class="btn" data-pj-copy>${ic("copy")} Copy parts list</button>${parts.length ? (canCart ? `<button class="btn pri" data-pj-cart>${ic("cart")} Add to shopping list</button>` : `<button class="btn pri" data-pj-up>${ic("cart")} Add to shopping list</button>`) : ""}<button class="btn" data-x>Close</button></div></div>`, m => {
    const picked = () => parts.filter((x, i) => { const c = m.querySelector(`[data-pjp="${i}"]`); return !c || c.checked; });
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelector("[data-pj-copy]").onclick = async () => { const t = `${job} (${BIKE.name})\n` + picked().map(x => "- " + x.name + (x.qty > 1 ? " x" + x.qty : "")).join("\n") + (tools.length ? "\nTools: " + tools.join(", ") : ""); try { await navigator.clipboard.writeText(t); toast("Copied."); } catch (e) { prompt("Copy this list:", t); } };
    const c = m.querySelector("[data-pj-cart]"); if (c) c.onclick = async () => { c.disabled = true; for (const x of picked()) await cartAdd({ title: x.name + (x.note ? " (" + x.note + ")" : ""), qty: x.qty || 1, price: 0, ship: 0, store: "To find", url: "", note: "From Plan this job: " + job }); closeModal(); toast("Added " + picked().length + " parts to your shopping list."); };
    const u = m.querySelector("[data-pj-up]"); if (u) u.onclick = () => gate("restorer", "purchasing", "the shopping list");
  });
}
document.addEventListener("click", e => { const b = e.target.closest("[data-planjob]"); if (!b) return; e.preventDefault(); e.stopPropagation(); planJob(b.dataset.planjob, b.dataset.planctx || ""); });
// buttons: on every due item in the maintenance log, and inside each open course step
(function () {
  const v = VIEWS.maintenance; if (v) { const b0 = v.bind; v.bind = function (root) { b0.call(this, root);
    $$("[data-logfor]", root).forEach(b => { if (b.parentNode.querySelector("[data-planjob]")) return; const it = S.schedule && S.schedule[b.dataset.logfor]; if (!it) return;
      b.insertAdjacentHTML("beforebegin", `<button class="btn sm" data-planjob="${esc(it.name)}" title="Parts, tools, time and cost before you start">${ic("spark")} Plan it</button>`); }); }; }
  const l = VIEWS.lesson; if (l) { const b1 = l.bind; l.bind = function (root) { b1.call(this, root);
    $$(".st.open", root).forEach(st => { const id = (st.querySelector("[data-toggle]") || {}).dataset?.toggle, t = id && S.tasks && S.tasks[id], body = st.querySelector(".st-b"); if (!t || !body || body.querySelector("[data-planjob]")) return;
      body.insertAdjacentHTML("afterbegin", `<div><button class="btn sm" data-planjob="${esc(t.title)}" data-planctx="${esc(String(t.instructions || "").slice(0, 300))}">${ic("spark")} Plan this step: parts, tools, time and cost</button></div>`); }); }; }
})();
