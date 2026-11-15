/* ============ Collector cards ============
   9 card designs, one QR code each: revoragarage.com/T/<code>, which lands here as ?c=<code>.
   Scanning plays that bike's token animation (rarer card, bigger animation) and adds it to your garage.
   The account remembers what you've scanned: a token you already have shows without the animation.
   Signed out: the animation plays once (or skip straight to sign-up), and the token is added when you sign up or in.
   Collect all 8 bikes and a gold star shows next to the Revora logo in your garage (the gold card counts as the scooter). */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) {} } };
  const CODE_RE = /^[A-HJ-NP-Z2-9]{6}$/;
  const clean = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // design number -> the bike on the card and its rarity tier (level 1 = most common, 8 = Master, 9 = the gold card)
  const TIERS = {
    1: { name: "Apprentice", color: "#8A97A3" }, 2: { name: "Shop Hand", color: "#D9BF8E" }, 3: { name: "Wrench", color: "#5FA86E" },
    4: { name: "Technician", color: "#4F8FC0" }, 5: { name: "Tuner", color: "#E0872E" }, 6: { name: "Mechanic", color: "#C93C3C" },
    7: { name: "Builder", color: "#9B7BC8" }, 8: { name: "Master", color: "#E8B53A" }, 9: { name: "Legendary", color: "#E8B53A" }
  };
  const CARDS = {
    1: { bike: "Sport", sil: "sport", lvl: 3 }, 2: { bike: "Cafe racer", sil: "cafe", lvl: 7 }, 3: { bike: "Cruiser", sil: "cruiser", lvl: 2 },
    4: { bike: "Adventure", sil: "adventure", lvl: 5 }, 5: { bike: "Standard", sil: "standard", lvl: 1 }, 6: { bike: "Dual sport", sil: "dualsport", lvl: 6 },
    7: { bike: "Touring", sil: "touring", lvl: 4 }, 8: { bike: "Scooter", sil: "scooter", lvl: 8 }, 9: { bike: "Scooter", sil: "scooter", lvl: 9, gold: true }
  };
  const tierOf = d => TIERS[CARDS[d].lvl];
  const num = d => (d === 9 ? 8 : d) + "/8";

  /* ---------- styles (kept here so the feature is one file) ---------- */
  function css() {
    if (document.getElementById("tkCss")) return;
    const s = document.createElement("style"); s.id = "tkCss";
    s.textContent = `
.tk-stage{position:fixed;inset:0;z-index:9000;background:radial-gradient(120% 90% at 50% 40%,#1F2E39 0%,#17232C 55%,#0F171D 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;color:#E6EBEE;font-family:var(--f-ui,system-ui)}
.tk-stage *{box-sizing:border-box}
.tk-skip{position:absolute;top:14px;right:16px;background:none;border:0;color:#7A8890;font:600 13px var(--f-ui,system-ui);cursor:pointer;padding:8px}
.tk-skip:hover{color:#E6EBEE}
.tk-scene{position:relative;width:min(300px,72vw);aspect-ratio:1;display:grid;place-items:center}
.tk-coin{position:relative;width:78%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#2A3D4B 0%,#1A2730 60%,#121C23 100%);box-shadow:0 0 0 3px var(--tc),0 0 0 9px #17232C,0 0 0 11px color-mix(in srgb,var(--tc) 45%,transparent),0 18px 50px rgba(0,0,0,.55);display:grid;place-items:center;overflow:hidden;transform-style:preserve-3d}
.tk-coin.gold{background:radial-gradient(circle at 35% 30%,#5A4718 0%,#3A2E10 55%,#241C08 100%)}
.tk-bike{width:74%;aspect-ratio:2/1.15;background:var(--tc);-webkit-mask:var(--sil) center/contain no-repeat;mask:var(--sil) center/contain no-repeat;margin-top:-6%}
.tk-coin .tk-num{position:absolute;bottom:15%;font:700 13px/1 var(--f-display,system-ui);letter-spacing:.3em;color:var(--tc);font-style:italic}
.tk-shine{position:absolute;inset:-20%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.35) 50%,transparent 60%);transform:translateX(-120%)}
.tk-gauge{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
.tk-gauge circle{fill:none;stroke-width:5;stroke-linecap:butt}
.tk-gauge .bg{stroke:#26394A}
.tk-gauge .seg{stroke:var(--tc);opacity:0}
.tk-rays{position:absolute;inset:-60%;background:repeating-conic-gradient(from 0deg,color-mix(in srgb,var(--tc) 30%,transparent) 0deg 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 18%,transparent 62%);mask:radial-gradient(circle,#000 18%,transparent 62%);opacity:0}
.tk-ring{position:absolute;width:78%;aspect-ratio:1;border-radius:50%;border:2px solid var(--tc);opacity:0}
.tk-spark{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:var(--tc);opacity:0}
.tk-conf{position:absolute;top:-12px;width:7px;height:12px;background:var(--tc);opacity:0}
.tk-txt{text-align:center;margin-top:26px;min-height:130px;max-width:420px;padding:0 20px}
.tk-tier{font:700 15px/1 var(--f-display,system-ui);letter-spacing:.32em;color:var(--tc);font-style:italic;text-transform:uppercase;opacity:0}
.tk-name{font:700 30px/1.15 var(--f-display,system-ui);margin:10px 0 0;opacity:0}
.tk-msg{color:#A5B2BA;margin:10px 0 0;font-size:15px;line-height:1.5;opacity:0}
.tk-msg b{color:#E6EBEE}
.tk-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px;opacity:0}
.tk-btn{border:0;border-radius:8px;padding:11px 18px;font:700 15px var(--f-ui,system-ui);cursor:pointer;background:#26394A;color:#E6EBEE}
.tk-btn.pri{background:#D9BF8E;color:#17232C}
.tk-slots{display:flex;gap:6px;justify-content:center;margin-top:16px;opacity:0}
.tk-slot{width:26px;height:26px;border-radius:50%;border:1.5px dashed #3A5263;display:grid;place-items:center}
.tk-slot.on{border:0;background:var(--tc);box-shadow:0 0 10px color-mix(in srgb,var(--tc) 50%,transparent)}
.tk-slot.on i{width:70%;height:60%;background:#17232C;-webkit-mask:var(--sil) center/contain no-repeat;mask:var(--sil) center/contain no-repeat}
.tk-slot.new{animation:tkPop .6s cubic-bezier(.2,1.6,.4,1) both}
.tk-star{margin-left:2px;flex:none;align-self:center;filter:drop-shadow(0 0 4px rgba(232,181,58,.55));animation:tkStar .6s cubic-bezier(.2,1.6,.4,1) both}@keyframes tkStar{from{transform:scale(0) rotate(-90deg)}to{transform:none}}
.tk-reward{margin-top:14px;padding:12px 14px;border:1px solid #E8B53A;border-radius:10px;color:#F3E2B5;font-size:14px;opacity:0}
.tk-go .tk-tier,.tk-go .tk-name,.tk-go .tk-msg,.tk-go .tk-acts,.tk-go .tk-slots,.tk-go .tk-reward{animation:tkFade .5s ease-out both}
.tk-go .tk-name{animation-delay:.12s}.tk-go .tk-msg{animation-delay:.24s}.tk-go .tk-slots{animation-delay:.34s}.tk-go .tk-reward{animation-delay:.5s}.tk-go .tk-acts{animation-delay:.44s}
@keyframes tkFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes tkPop{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes tkIn{0%{transform:translateY(-40px) scale(.4) rotateY(0);opacity:0}55%{opacity:1}100%{transform:none;opacity:1}}
@keyframes tkSpin{from{transform:rotateY(0)}to{transform:rotateY(var(--turns))}}
@keyframes tkShine{to{transform:translateX(120%)}}
@keyframes tkSeg{to{opacity:1}}
@keyframes tkRays{from{opacity:0;transform:rotate(0)}15%{opacity:1}to{opacity:1;transform:rotate(90deg)}}
@keyframes tkRing{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(1.9)}}
@keyframes tkSpark{0%{opacity:1;transform:translate(-50%,-50%) rotate(var(--a)) translateX(0)}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--d))}}
@keyframes tkShake{0%,100%{transform:none}20%{transform:translate(-4px,2px)}40%{transform:translate(4px,-2px)}60%{transform:translate(-3px,-1px)}80%{transform:translate(2px,1px)}}
@keyframes tkFall{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(105vh) rotate(var(--r))}}
@keyframes tkFlood{0%{opacity:0}30%{opacity:.55}100%{opacity:0}}
@keyframes tkSlam{0%{opacity:0;transform:scale(2.4)}60%{opacity:1;transform:scale(.95)}100%{opacity:1;transform:scale(1)}}
.tk-flood{position:absolute;inset:0;background:radial-gradient(circle,#E8B53A 0%,transparent 70%);opacity:0;pointer-events:none}
.tk-band{margin:18px 0;padding:16px 18px;border:1px solid var(--line,#E9EDEF);border-radius:12px;background:var(--surface,#fff);display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.tk-band b{display:block;font-family:var(--f-display,system-ui);font-size:18px}
.tk-band span{color:var(--muted,#4A545C);font-size:14px}
.tk-band .tk-slots{opacity:1;margin:0 0 0 auto;flex-wrap:wrap}
.tk-band .tk-slot{width:30px;height:30px;border-color:var(--line-2,#D6DDE1)}
@media (prefers-reduced-motion:reduce){.tk-stage *{animation-duration:.01ms!important;animation-delay:0s!important}}`;
    document.head.appendChild(s);
  }

  const silUrl = d => `url('img/sil/bike-${CARDS[d].sil}.svg')`;
  const slots = (have, fresh) => {
    const H = new Set(have.map(d => d === 9 ? 8 : d));
    return `<div class="tk-slots">${[1, 2, 3, 4, 5, 6, 7, 8].map(d => H.has(d)
      ? `<span class="tk-slot on${fresh === d || (fresh === 9 && d === 8) ? " new" : ""}" style="--tc:${(d === 8 && have.includes(9) ? TIERS[9] : tierOf(d)).color};--sil:${silUrl(d)}" title="${esc(CARDS[d].bike)}"><i></i></span>`
      : `<span class="tk-slot" title="${esc(CARDS[d].bike)}, not collected yet"></span>`).join("")}</div>`;
  };

  /* ---------- the reveal: rarer card, more going on ---------- */
  // returns the stage element; onDone runs when the token has landed
  function reveal(d, onDone, o = {}) {
    css();
    const c = CARDS[d], t = tierOf(d), L = c.lvl, R = reduced() || o.instant;
    document.querySelectorAll(".tk-stage").forEach(e => e.remove());
    const st = document.createElement("div"); st.className = "tk-stage"; st.style.setProperty("--tc", t.color);
    const segs = 8, gap = 4, C = 2 * Math.PI * 46, seg = C / segs - gap;
    st.innerHTML = `<button class="tk-skip" data-tkskip>${esc(o.skipLabel || "Skip")}</button>${L >= 9 ? `<div class="tk-flood"></div>` : ""}
      <div class="tk-scene">${L >= 8 ? `<div class="tk-rays"></div>` : ""}
        <div class="tk-coin${c.gold ? " gold" : ""}" style="--sil:${silUrl(d)}">${L >= 2 ? `<div class="tk-shine"></div>` : ""}<div class="tk-bike"></div><span class="tk-num">${num(d)}</span></div>
        ${L >= 3 ? `<svg class="tk-gauge" viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="46" stroke-dasharray="${seg} ${gap}"/>${Array.from({ length: segs }, (_, i) => `<circle class="seg" cx="50" cy="50" r="46" stroke-dasharray="${seg} ${C - seg}" stroke-dashoffset="${-i * (seg + gap)}" data-seg="${i}"/>`).join("")}</svg>` : ""}
      </div>
      <div class="tk-txt"><div class="tk-tier">${esc(t.name)}</div><div class="tk-name">${esc(c.bike)}${c.gold ? " · Gold edition" : ""}</div><div data-tkbody></div></div>`;
    document.body.appendChild(st);
    const coin = st.querySelector(".tk-coin"), scene = st.querySelector(".tk-scene");
    let finished = false, timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, R ? 0 : ms));
    const finish = () => { if (finished) return; finished = true; timers.forEach(clearTimeout); st.querySelectorAll(".tk-spark,.tk-conf,.tk-ring").forEach(e => e.remove()); st.querySelectorAll(".tk-gauge .seg").forEach((s, i) => { if (i < Math.min(L, 8)) s.style.opacity = 1; }); st.classList.add("tk-go"); st.querySelector("[data-tkskip]").remove(); onDone && onDone(st); };
    st.querySelector("[data-tkskip]").onclick = () => o.onSkip ? (finished = true, timers.forEach(clearTimeout), o.onSkip(st)) : finish();
    if (R) { finish(); return st; }

    // 1. every card: the token drops in and spins (more spins for rarer cards)
    coin.style.animation = `tkIn .7s cubic-bezier(.2,.9,.3,1.2) both`;
    const turns = [0, 360, 360, 360, 720, 720, 720, 1080, 1080, 1440][L];
    at(650, () => { coin.style.setProperty("--turns", turns + "deg"); coin.style.animation = `tkSpin ${0.5 + L * 0.15}s cubic-bezier(.25,.8,.3,1) both`; });
    let tEnd = 650 + (0.5 + L * 0.15) * 1000;
    // 2. Shop Hand and up: a shine sweeps across
    if (L >= 2) at(tEnd - 150, () => { const s = st.querySelector(".tk-shine"); if (s) s.style.animation = "tkShine .7s ease-in-out both"; });
    // 3. Wrench and up: the gauge around it revs up to the card's level
    if (L >= 3) { for (let i = 0; i < Math.min(L, 8); i++) at(tEnd + i * 110, () => { const s = st.querySelector(`[data-seg="${i}"]`); if (s) s.style.animation = "tkSeg .12s ease-out both"; }); tEnd += Math.min(L, 8) * 110; }
    // 4. Technician and up: sparks fly off (more from Mechanic up)
    if (L >= 4) at(tEnd, () => { const n = L >= 6 ? 26 : L >= 5 ? 18 : 12; for (let i = 0; i < n; i++) { const p = document.createElement("i"); p.className = "tk-spark"; p.style.setProperty("--a", (360 / n * i + Math.random() * 10) + "deg"); p.style.setProperty("--d", (110 + Math.random() * (L >= 6 ? 120 : 70)) + "px"); p.style.animation = `tkSpark ${0.6 + Math.random() * 0.4}s ease-out both`; scene.appendChild(p); } });
    // 5. Tuner and up: shock rings pulse out (more from Builder up)
    if (L >= 5) (L >= 7 ? [0, 150, 300, 450] : [0, 220]).forEach(dl => at(tEnd + dl, () => { const r = document.createElement("i"); r.className = "tk-ring"; r.style.animation = "tkRing .9s ease-out both"; scene.appendChild(r); }));
    // 6. Master and up: light rays turn behind it and the screen shakes
    if (L >= 8) { at(tEnd - 300, () => { const r = st.querySelector(".tk-rays"); if (r) r.style.animation = "tkRays 4s linear both"; }); at(tEnd, () => { scene.style.animation = "tkShake .45s ease-in-out"; }); }
    // 7. Legendary (the gold card): a gold flash, the tier name slams in, confetti
    if (L >= 9) {
      at(tEnd, () => { const f = st.querySelector(".tk-flood"); if (f) f.style.animation = "tkFlood 1.4s ease-out both"; for (let i = 0; i < 46; i++) { const p = document.createElement("i"); p.className = "tk-conf"; p.style.left = Math.random() * 100 + "%"; p.style.setProperty("--r", (Math.random() * 720 - 360) + "deg"); if (i % 3 === 0) p.style.background = "#F3E2B5"; p.style.animation = `tkFall ${1.6 + Math.random() * 1.4}s ${Math.random() * 0.6}s linear both`; st.appendChild(p); } });
      at(tEnd + 200, () => { const tt = st.querySelector(".tk-tier"); tt.style.animation = "tkSlam .55s cubic-bezier(.2,1.4,.4,1) both"; tt.style.fontSize = "22px"; });
    }
    at(tEnd + (L >= 4 ? 500 : 250), finish);
    return st;
  }

  function body(st, html) { const b = st.querySelector("[data-tkbody]"); b.innerHTML = html; }
  const seen = { has(d) { return (ls.get("rv.tokSeen") || "").split(",").includes(String(d)); }, add(d) { if (!this.has(d)) ls.set("rv.tokSeen", ((ls.get("rv.tokSeen") || "") + "," + d).replace(/^,/, "")); } };

  /* ---------- the scan link ---------- */
  async function scan(X, raw) {
    const code = clean(raw);
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    if (!CODE_RE.test(code) || !X.sb) return miss(X, "That link is missing part of the code. Scan the card again.");
    const { data: d, error } = await X.sb.rpc("card_peek", { c: code });
    if (error) return miss(X, "We couldn't check that card right now. Check your connection and scan it again.");
    if (!d || !CARDS[d]) return miss(X, "We couldn't find this card. If it's a real Revora card, email info@revoragarage.com and we'll sort it out.");
    if (!X.session) {
      // signed out: the token waits on this phone and is added when they sign up or sign in.
      // The animation plays once per phone; they can skip straight to sign-up at any point.
      ls.set("rv.token", code);
      const toSignup = st => { st && st.remove(); X.showAuth("signup"); };
      const st = reveal(d, st => {
        seen.add(d);
        body(st, `<p class="tk-msg">Create a free account to add this <b>${esc(CARDS[d].bike.toLowerCase())}</b> token to your garage. Collect all 8 bikes to earn a gold star in your garage.</p>
          <div class="tk-acts"><button class="tk-btn pri" data-tksignup>Create account</button><button class="tk-btn" data-tksignin>I have an account</button></div>`);
        st.querySelector("[data-tksignup]").onclick = () => toSignup(st);
        st.querySelector("[data-tksignin]").onclick = () => { st.remove(); X.showAuth("signin"); };
      }, { instant: seen.has(d), skipLabel: "Skip to sign up", onSkip: toSignup });
      return true;
    }
    return claimAndShow(X, code, d);
  }

  async function claimAndShow(X, code, d) {
    ls.set("rv.token", "");
    const { data: r, error } = await X.sb.rpc("card_claim", { c: code });
    if (error || !r) return miss(X, "We couldn't add that card right now. Scan it again in a minute.");
    if (r.status === "invalid") return miss(X, "We couldn't find this card. If it's a real Revora card, email info@revoragarage.com and we'll sort it out.");
    const have = await mine(X.sb), design = r.design || d, c = CARDS[design];
    // the account remembers: a token they already have shows without the animation
    reveal(design, st => {
      seen.add(design);
      const left = 8 - (r.count ?? new Set(have.map(x => x === 9 ? 8 : x)).size);
      const msg = r.status === "added" ? `<b>Added to your garage.</b> ${left > 0 ? `${left} more bike${left === 1 ? "" : "s"} to collect.` : "That's the full set."}`
        : `<b>This ${esc(c.bike.toLowerCase())}${c.gold ? " gold" : ""} token is already in your garage.</b> ${left > 0 ? `${left} more bike${left === 1 ? "" : "s"} to collect.` : "You have the full set."}`;
      body(st, `<p class="tk-msg">${msg}</p>${slots(have, r.status === "added" ? design : 0)}${r.full ? `<div class="tk-reward"><b>Full set!</b> Your garage has a gold star next to the Revora logo now.</div>` : ""}<div class="tk-acts"><button class="tk-btn pri" data-tkgarage>Go to my garage</button></div>`);
      st.querySelector("[data-tkgarage]").onclick = () => { st.remove(); location.href = location.pathname; };
    }, { instant: r.status !== "added" });
    return true;
  }

  // after they sign up or sign in: add the card they scanned. They already saw (or skipped) the animation,
  // so it doesn't play again; their garage opens with a note and the new slot filled in.
  async function afterSignIn(X) {
    const code = ls.get("rv.token"); if (!code || !X.session || !CODE_RE.test(code)) return false;
    ls.set("rv.token", "");
    try {
      const { data: r } = await X.sb.rpc("card_claim", { c: code });
      if (r && r.design && CARDS[r.design]) {
        const c = CARDS[r.design];
        ls.set("rv.tokNew", String(r.design));
        const txt = r.status === "added" ? `The ${c.bike.toLowerCase()}${c.gold ? " gold" : ""} token is in your garage.` : `The ${c.bike.toLowerCase()} token was already in your garage.`;
        setTimeout(() => X.note(txt + (r.full ? " Full set: you earned the gold star." : "")), 600);
      }
    } catch (e) {}
    return false;   // carry on to the garage as normal
  }

  function miss(X, msg) {
    X.frame(`<h1 class="disp">Revora collector cards</h1><p class="muted">${esc(msg)}</p><a class="btn pri" href="${esc(location.pathname)}">Open Revora</a>`);
    return true;
  }

  async function mine(sb) { try { const { data } = await sb.rpc("my_card_tokens"); return (data || []).map(r => r.design); } catch (e) { return []; } }

  // the strip in the garage: shows once you have at least one token
  async function band(sb, host) {
    if (!host || !sb) return;
    const have = await mine(sb); if (!have.length) return;
    css();
    const n = new Set(have.map(d => d === 9 ? 8 : d)).size;
    const fresh = +ls.get("rv.tokNew") || 0; ls.set("rv.tokNew", "");
    host.innerHTML = `<section class="tk-band"><div><b>Collector cards · ${n} of 8</b><span>${n >= 8 ? "Full set. Your gold star is up by the logo." : `Scan the QR code on Revora cards to collect bikes. Get all 8 for a gold star next to the logo.`}${have.includes(9) ? " You have the gold Legendary." : ""}</span></div>${slots(have, fresh)}</section>`;
    if (n >= 8) star();
  }

  // full set: a gold star next to the Revora logo at the top of the garage
  function star() {
    const logo = document.querySelector(".is-garage .pk-logo");
    if (!logo || logo.querySelector(".tk-star")) return;
    logo.insertAdjacentHTML("beforeend", `<svg class="tk-star" viewBox="0 0 24 24" width="18" height="18" aria-label="Full collector set" role="img"><title>Full collector set</title><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="#E8B53A" stroke="#A8842F" stroke-width="1" stroke-linejoin="round"/></svg>`);
  }

  window.rvTokens = { scan, afterSignIn, band, reveal, CARDS, TIERS };
})();
