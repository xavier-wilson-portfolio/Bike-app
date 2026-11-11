/* ============ Clients of a Revora shop (free) ============
   ?join=<code>   the link a shop sends. Sign up or sign in, and the bike shows up.
   ?mine          "Your bike at <shop>": history, what's due, what's in the shop, and asking for a report, value or budget.
   ?shopdoc=<t>   a report, value or budget a shop sent (anyone with the link).
   ?unsub=<t>     stop a shop's reminder emails. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n = v => +v || 0, D = () => window.rvDue, DOC = () => window.rvShopDoc;
  const digits = s => String(s || "").replace(/\D/g, "");
  const ASK = [["report", "History report", "Every service on record, ready to print or show a buyer."], ["value", "What it's worth", "The shop's estimate of what your bike would sell for today."], ["budget", "Budget", "What's been spent against your budget, and planned upgrades."]];
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = { phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>', wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>', check: '<path d="M5 12l4 4 10-10"/>', clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>' };
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const CODE_RE = /^[A-HJ-NP-Z2-9]{8}$/;
  const cleanCode = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

  async function homes(sb) { try { const { data, error } = await sb.rpc("client_home"); return error ? [] : data || []; } catch (e) { return []; } }

  // claim a code for the signed-in person; returns a message, or "" when it worked
  async function claim(sb, code) {
    const { data: r, error } = await sb.rpc("shop_claim", { c: cleanCode(code) });
    if (error) return /does not exist|schema cache|could not find/i.test(error.message || "") ? "Shop links aren't switched on yet." : "That didn't go through. Check your internet and try again.";
    return { ok: "", nocode: "That code doesn't match a shop's client. Check it with your shop.", taken: "That code is already linked to another Revora account. Ask your shop for a new one.", signin: "Sign in first." }[r] ?? "";
  }

  /* ---------- the client's page ---------- */
  function bikeBlock(h, b, X) {
    const c = D().compute(b), m = b.meta || {}, sil = X.silFile(m.silhouette || "") || X.silFile("bike-" + (m.style || "standard")) || X.silFile("bike-standard");
    const items = c.ranked.filter(i => i.status !== "nointerval" && i.status !== "none"), next = items[0];
    const wos = (b.workorders || []).filter(w => !["Picked up", "Declined"].includes(w.status));
    const mods = (b.mods || []).filter(x => x.status === "Installed" || x.status === "Planned" || x.status === "Ordered");
    const reqs = h.requests.filter(q => q.project_id === b.id), shopName = h.shop.name || "your shop";
    const headline = c.counts.over ? `${c.counts.over} service${c.counts.over === 1 ? " is" : "s are"} overdue` : c.counts.soon ? `${c.counts.soon} service${c.counts.soon === 1 ? "" : "s"} due soon` : items.length ? "Everything's up to date" : "Service schedule coming soon";
    const tone = c.counts.over ? "red" : c.counts.soon ? "amber" : items.length ? "green" : "gray";
    const askBtn = ([k, t, d]) => { const done = reqs.find(q => q.kind === k && q.status === "approved"), wait = reqs.find(q => q.kind === k && q.status === "pending"), no = !done && !wait && reqs.find(q => q.kind === k && q.status === "declined");
      return `<div class="cv-ask"><div><b>${esc(t)}</b><span>${esc(d)}</span></div>${done ? `<a class="btn sm pri" href="?shopdoc=${esc(done.token)}" target="_blank" rel="noopener">Open</a>${wait ? "" : `<button class="linkbtn" data-ask="${esc(b.id)}|${k}">Ask for a new one</button>`}` : wait ? `<span class="cv-wait">${ic(IC.clock)} Asked ${esc(D().fmtDate(wait.created_at))}</span>` : `<button class="btn sm" data-ask="${esc(b.id)}|${k}">Ask ${esc(shopName)}</button>${no ? `<small class="faint">Last request was declined</small>` : ""}`}</div>`; };
    return `<section class="cv-bike">
      ${wos.length ? (window.rvJobs ? wos.map(w => rvJobs.trackCard(w, shopName, b.id)).join("") : `<div class="cv-inshop">${ic(IC.wrench)}<div>${wos.map(w => `<b>In the shop: ${esc(w.title || "Work in progress")}</b><span>${esc(w.status)}${w.promised ? " · ready by " + esc(D().fmtDate(w.promised)) : ""}</span>`).join("")}</div></div>`) : ""}
      <div class="cv-hero t-${tone}">${sil ? `<img src="img/sil/${esc(sil)}" alt="" class="cv-sil">` : ""}<div class="cv-ht">
        <span class="cv-k">At ${esc(shopName)}</span><h2>${esc(m.bike || b.name || "Your bike")}</h2>
        <div class="cv-hm">${c.odo ? `<span>${D().milesFmt(c.odo.miles)} mi</span>` : ""}${c.last ? `<span>Last service ${esc(D().fmtDate(c.last.date))}</span>` : ""}</div>
        <div class="cv-status"><span class="pill ${tone}">${esc(headline)}</span></div>
        ${next ? `<div class="cv-next"><span>Next up</span><b>${esc(next.name)}</b><small>${esc(D().whenTxt(next))}</small></div>` : ""}</div></div>
      <div class="cv-grid">
        <div class="cv-card"><h3>What's due</h3>${items.length ? `<div class="cv-due">${items.slice(0, 10).map(i => `<div class="cv-di"><span class="cv-dot ${i.status}"></span><span class="grow"><b>${esc(i.name)}</b><small>${esc(i.every ? "Every " + i.every : "")}</small></span><span class="cv-when">${esc(D().whenTxt(i))}</span></div>`).join("")}</div>` : `<p class="faint">${esc(shopName)} hasn't set up the service schedule yet. Once they log a service you'll see what's next here.</p>`}</div>
        <div class="cv-card"><h3>Done so far</h3>${c.done.length ? `<div class="cv-tl">${c.done.slice(0, 12).map(r => `<div class="cv-tli"><span class="cv-td">${esc(D().fmtDate(r.date))}</span><div><b>${esc(r.service || "Service")}</b><small>${esc([n(r.odometer) ? D().milesFmt(r.odometer) + " mi" : "", r.doneBy === "A shop" ? r.shop || shopName : r.doneBy === "Myself" ? "You" : r.shop || ""].filter(Boolean).join(" · "))}</small></div></div>`).join("")}</div>${c.done.length > 12 ? `<p class="faint">${c.done.length - 12} more in the history report.</p>` : ""}` : `<p class="faint">No services logged yet.</p>`}</div>
      </div>
      ${mods.length ? `<div class="cv-card"><h3>Upgrades</h3><div class="cv-mods">${mods.map(x => `<span class="cv-mod ${x.status === "Installed" ? "in" : ""}">${x.status === "Installed" ? ic(IC.check) : ""}${esc([x.brand, x.name].filter(Boolean).join(" "))}<small>${x.status === "Installed" ? (x.date ? "Fitted " + esc(D().fmtDate(x.date)) : "Fitted") : x.status === "Ordered" ? "Ordered" : "Planned"}</small></span>`).join("")}</div></div>` : ""}
      <div class="cv-card"><h3>Ask ${esc(shopName)} for</h3><p class="faint cv-askp">They approve it and send it to your email. It shows up here too.</p><div class="cv-asks">${ASK.map(askBtn).join("")}</div></div>
      <div class="cv-take"><div><b>Want the full Revora for this bike?</b><span>Move it into your own garage with its whole history. You can log your own services, fuel and papers, and get reminders. It stops being linked to ${esc(shopName)}.</span></div><button class="btn" data-take="${esc(b.id)}">Move it to my garage</button></div>
    </section>`;
  }
  async function home(X, data) {
    const sb = X.sb; if (!data) { X.spin && X.spin(); data = await homes(sb); }
    document.title = "Your bike · Revora";
    if (!data.length) return codePage(X, "");
    const first = String((X.profile && X.profile.display_name) || "").split(" ")[0];
    X.frame(`<div class="cv">
      <div class="jb-notify" id="cvNotify" hidden></div>
      <div class="cv-top"><div><h1 class="gh-title">${first ? `Hi, ${esc(first)}.` : "Your bike"}</h1><p class="muted">${data.length === 1 ? `Kept up by ${esc(data[0].shop.name || "your shop")}.` : "Kept up by your shops."}</p></div>
        <div class="cv-topb"><button class="btn sm" data-code>Add a shop code</button><button class="btn sm" data-own>Your own bikes</button></div></div>
      ${data.map(h => `${h.bikes.length ? h.bikes.map(b => bikeBlock(h, b, X)).join("") : `<section class="cv-card"><h3>${esc(h.shop.name)}</h3><p class="faint">Your shop hasn't added a bike to your card yet.</p></section>`}
        <section class="cv-shop"><div><span class="cv-k">Your shop</span><b>${esc(h.shop.name || "Your shop")}</b>${h.shop.address ? `<span>${ic(IC.pin)}${esc(h.shop.address)}</span>` : ""}</div>
          <div class="cv-shopb">${h.shop.phone ? `<a class="btn" href="tel:${esc(digits(h.shop.phone))}">${ic(IC.phone)} Call</a>` : ""}${h.shop.email ? `<a class="btn" href="mailto:${esc(h.shop.email)}">${ic(IC.mail)} Email</a>` : ""}</div>
          <p class="faint cv-rem">${h.remind_ok ? `${esc(h.shop.name)} emails you a reminder 2 weeks before each service is due.` : `Want reminder emails before each service? Ask ${esc(h.shop.name)} to turn them on.`} <button class="linkbtn" data-leave="${esc(h.client_id)}">Stop following this shop</button></p></section>`).join("")}
      <p class="cv-foot">Revora keeps every bike's history, schedule and parts in one place. <button class="linkbtn" data-nav="new">Add a bike of your own</button></p></div>`, { wide: true, garage: true });
    const app = X.app;
    const open = data.some(h => h.bikes.some(b => (b.workorders || []).some(w => !["Picked up", "Declined"].includes(w.status))));
    if (window.rvJobs) { rvJobs.notifyStrip(app.querySelector("#cvNotify"), sb, X.note, open); rvJobs.bindTrack(app, sb, X.note, () => { const y = window.scrollY; home(X).then(() => window.scrollTo(0, y)); }); }
    // a bike in the shop: keep the page current while it's open
    clearInterval(window.__cvLive);
    if (open) window.__cvLive = setInterval(async () => {
      if (document.hidden || !document.getElementById("cvNotify")) { if (!document.getElementById("cvNotify")) clearInterval(window.__cvLive); return; }
      const fresh = await homes(sb); if (JSON.stringify(fresh) !== JSON.stringify(data)) { const y = window.scrollY; home(X, fresh).then(() => window.scrollTo(0, y)); }
    }, 45000);
    app.querySelector("[data-code]").onclick = () => codeBox(X);
    app.querySelector("[data-own]").onclick = () => { ls.set("rv.clientHome", "own"); X.goUrl({}); };
    app.querySelectorAll("[data-ask]").forEach(b => b.onclick = async () => {
      const [pid, k] = b.dataset.ask.split("|"); b.disabled = true;
      const { data: r, error } = await sb.rpc("client_request", { pid, k });
      if (error || !["ok", "waiting"].includes(r)) { b.disabled = false; return X.note(r === "slow" ? "That's a lot of requests today. Try again tomorrow." : "That didn't go through. Try again in a minute.", true); }
      X.note(r === "waiting" ? "You've already asked. They'll send it soon." : "Asked. You'll get an email when they send it.");
      home(X);
    });
    app.querySelectorAll("[data-take]").forEach(b => b.onclick = () => takeBox(X, b.dataset.take, data));
    app.querySelectorAll("[data-leave]").forEach(b => b.onclick = async () => {
      if (!confirm("Stop following this shop? You won't see this bike here any more. The shop keeps its records, and can send you the link again.")) return;
      await sb.rpc("client_leave", { cid: b.dataset.leave }); home(X);
    });
  }
  function takeBox(X, pid, data) {
    const h = data.find(x => x.bikes.some(b => b.id === pid)), b = h && h.bikes.find(x => x.id === pid); if (!b) return;
    const box = document.createElement("div"); box.className = "pk-modal";
    box.innerHTML = `<div class="pk-card" role="dialog" aria-modal="true"><h2 class="disp-s">Move ${esc((b.meta && b.meta.bike) || b.name)} to your garage?</h2>
      <p class="muted" style="margin:0">Everything comes with it: every service ${esc(h.shop.name)} logged, the schedule, upgrades and photos. It becomes your bike page, and you can keep logging it yourself.</p>
      <p class="muted" style="margin:0"><b>It stops being linked to ${esc(h.shop.name)}.</b> They won't see it or send reminders for it any more, so only do this if you're taking over its records. ${esc(h.shop.name)} can't undo it.</p>
      <div class="pk-links"><button class="btn" data-x>Keep it with the shop</button><button class="btn pri" data-go>Move it to my garage</button></div></div>`;
    box.onclick = async e => { if (e.target === box || e.target.closest("[data-x]")) return box.remove(); const g = e.target.closest("[data-go]"); if (!g) return;
      g.disabled = true; const { data: r, error } = await X.sb.rpc("client_take_bike", { pid });
      if (error || r !== "moved") { g.disabled = false; return X.note("That didn't go through. Try again in a minute.", true); }
      box.remove(); X.goUrl({ project: pid }); };
    document.body.appendChild(box);
  }

  /* ---------- typing a code ---------- */
  function codeForm(id) { return `<form class="pk-form cv-codef" id="${id}" novalidate><label>Client code from your shop<input name="code" class="cv-codein" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="K7M2Q9XA" inputmode="text"></label><div class="pk-err" hidden></div><button class="btn pri big" type="submit">See my bike</button></form>`; }
  function bindCode(X, f, done) {
    const er = f.querySelector(".pk-err"), inp = f.code;
    inp.oninput = () => { const v = cleanCode(inp.value); if (inp.value !== v) inp.value = v; };
    f.onsubmit = async e => { e.preventDefault(); const c = cleanCode(inp.value); er.hidden = true;
      if (!CODE_RE.test(c)) { er.textContent = "Codes are 8 letters and numbers. Check the one your shop gave you."; er.hidden = false; return; }
      if (!X.session) { ls.set("rv.join", c); return X.showAuth("signup"); }
      f.querySelector("button").disabled = true; const msg = await claim(X.sb, c); f.querySelector("button").disabled = false;
      if (msg) { er.textContent = msg; er.hidden = false; return; }
      done ? done() : home(X); };
  }
  function codeBox(X) {
    const box = document.createElement("div"); box.className = "pk-modal";
    box.innerHTML = `<div class="pk-card" role="dialog" aria-modal="true"><h2 class="disp-s">Add a shop code</h2><p class="muted" style="margin:0">Your shop gives you a code when they add your bike to Revora.</p>${codeForm("cbF")}<div class="pk-links"><button class="linkbtn" data-x>Cancel</button></div></div>`;
    box.onclick = e => { if (e.target === box || e.target.closest("[data-x]")) box.remove(); };
    document.body.appendChild(box); bindCode(X, box.querySelector("#cbF"), () => { box.remove(); home(X); });
    box.querySelector("input").focus();
  }
  // the third choice when someone adds a bike: "My bike is with a shop"
  function pickerHtml() { return `<div class="cv-pick">${codeForm("pkCode")}<p class="muted pk-small">No code? Ask your shop to add your bike in Revora Shop. It's free for you.</p></div>`; }
  function bindPicker(X) { const f = document.getElementById("pkCode"); if (f) bindCode(X, f); }
  function codePage(X, msg) {
    X.frame(`<div class="eyebrow">My bike is with a shop</div><h1 class="disp">See your bike's service history</h1><p class="muted">Type the code your shop gave you. You'll see every service they've logged and what's due next. Free.</p>${msg ? `<div class="pk-err">${esc(msg)}</div>` : ""}${pickerHtml()}<div class="pk-links"><button class="linkbtn" data-nav="projects">Back to your garage</button></div>`);
    bindPicker(X);
  }

  /* ---------- the shop's link: sign up, then the bike is there ---------- */
  async function authBanner(X) {
    const c = ls.get("rv.join"); if (!c || !X.sb) return;
    let shop = ""; try { const { data } = await X.sb.rpc("shop_code_info", { c }); shop = data && data.shop; } catch (e) {}
    const host = X.app.querySelector(".pick-in"); if (!host || host.querySelector(".cv-joinband")) return;
    host.insertAdjacentHTML("afterbegin", `<div class="cv-joinband"><b>${shop ? esc(shop) + " added your bike to Revora" : "Your shop added your bike to Revora"}</b><span>Create a free account, or sign in, to see its service history and what's due next. Nothing to pay.</span></div>`);
  }
  async function afterSignIn(X) {
    const c = ls.get("rv.join"); if (!c || !X.session) return false;
    ls.set("rv.join", "");
    const msg = await claim(X.sb, c);
    if (msg) { codePage(X, msg); return true; }
    ls.set("rv.clientHome", ""); await home(X); setTimeout(() => X.note("Your bike is here. You'll see every service your shop logs."), 400);
    return true;
  }
  async function joinLink(X, code) {
    const c = cleanCode(code);
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    if (!CODE_RE.test(c)) return codePage(X, "That link is missing part of the code. Type the code from your shop below.");
    ls.set("rv.join", c);
    if (!X.session) return X.showAuth("signup");
    return afterSignIn(X);
  }

  /* ---------- a document from the shop ---------- */
  async function docPage(X, token) {
    document.title = "From your shop · Revora";
    const ok = /^[A-Za-z0-9]{20,40}$/.test(token || "");
    const { data, error } = ok ? await X.sb.rpc("get_shop_doc", { t: token }) : { data: null };
    if (error || !data) return X.frame(`<h1 class="disp">This isn't available</h1><p class="muted">The link may be incomplete. Ask your shop to send it again.</p>`);
    document.title = (DOC().KIND[data.kind] || "Document") + " · " + ((data.shop && data.shop.name) || "Revora");
    X.app.innerHTML = `<div class="sd-page"><div class="sd-bar-top"><span>From <b>${esc((data.shop && data.shop.name) || "your shop")}</b></span><button class="btn sm" id="sdPrint">Print or save as PDF</button></div>${DOC().html(data)}
      <p class="sd-cta">${X.session ? `<a href="?mine">See your bike on Revora</a>` : `Keep your bike's history in one place. <a href="?auth=signup">Revora is free for one bike</a>.`}</p></div>`;
    document.getElementById("sdPrint").onclick = () => window.print();
  }
  async function unsubPage(X, token) {
    document.title = "Reminder emails · Revora";
    const { data, error } = X.sb && /^[A-Za-z0-9]{10,40}$/.test(token || "") ? await X.sb.rpc("shop_unsub", { t: token }) : { data: null };
    X.frame(error || !data ? `<h1 class="disp">That link didn't work</h1><p class="muted">Reply to the reminder email and ask the shop to stop them, or email info@revoragarage.com.</p>`
      : `<h1 class="disp">You're unsubscribed</h1><p class="muted">${esc(data)} won't send you service reminder emails from Revora any more. Changed your mind? Ask them to turn reminders back on.</p>`);
  }

  window.rvClient = { homes, home, codeBox, codePage, pickerHtml, bindPicker, authBanner, afterSignIn, joinLink, docPage, unsubPage };
})();
