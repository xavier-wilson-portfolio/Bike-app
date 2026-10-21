// shared setup: demo data, no tips, no chat bubble, tap ripples
module.exports.setup = async (p) => {
  await p.evaluate(async () => {
    setTipPrefs({ tipsOff: true, tipsAsked: true });
    const t = today(), ago = d => { const x = new Date(); x.setDate(x.getDate() - d); return isoDay(x); };
    const sch = sorted("schedule"), find = re => (sch.find(s => re.test(s.name)) || {}).id;
    const recs = [
      { date: ago(212), odometer: 14210, title: "Oil and filter change", kind: "Scheduled service", cost: 64.5, items: [find(/oil/i)].filter(Boolean) },
      { date: ago(150), odometer: 15890, title: "New rear tire and brake pads", kind: "Tires", cost: 238, items: [find(/brake pad/i), find(/tire/i)].filter(Boolean) },
      { date: ago(41), odometer: 17330, title: "Chain clean, lube and adjust", kind: "Scheduled service", cost: 0, items: [find(/chain clean/i), find(/chain slack/i)].filter(Boolean) },
    ];
    for (const r of recs) await store.put("maintenance", blank("maintenance", r), { silent: true, noLog: true });
    await store.put("mileage", blank("mileage", { date: ago(41), miles: 17330 }), { silent: true, noLog: true });
    await store.put("mileage", blank("mileage", { date: ago(3), miles: 18120 }), { silent: true, noLog: true });
  });
  await p.addStyleTag({ content: `.tap-dot{position:fixed;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(17,20,24,.18);border:2px solid rgba(17,20,24,.35);pointer-events:none;z-index:99999;animation:tapd .45s ease-out forwards}@keyframes tapd{from{transform:scale(.4);opacity:1}to{transform:scale(1.25);opacity:0}}` });
  await p.evaluate(() => {
    document.addEventListener("pointerdown", e => { const d = document.createElement("div"); d.className = "tap-dot"; d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px"; document.body.appendChild(d); setTimeout(() => d.remove(), 500); }, true);
    const hide = () => document.querySelectorAll("button,a,div").forEach(el => { const cs = getComputedStyle(el); if (cs.position === "fixed" && /mechanic|chat/i.test((el.className || "") + " " + (el.getAttribute("aria-label") || "") + " " + el.textContent.slice(0, 40)) && el.getBoundingClientRect().bottom > innerHeight - 140) el.style.display = "none"; });
    setInterval(hide, 200); hide();
  });
};
module.exports.open = async (chromium, bike) => {
  const b = await chromium.launch({ executablePath: process.env.HS, args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 1080 / 390, hasTouch: false });
  const NM = "/home/claude/t/node_modules/three/";
  await ctx.route(/three@/, r => { const u = r.request().url(); r.fulfill({ path: NM + u.split("three@0.147.0/")[1], contentType: "application/javascript" }); });
  await ctx.addInitScript(() => { Object.defineProperty(window, "rvPlanOf", { configurable: true, get: () => () => ({ id: "shop", admin: true }), set: () => {} }); });
  const p = await ctx.newPage(); p.on("dialog", d => d.accept());
  await p.goto("http://localhost:8766/?bike=" + bike); await p.waitForFunction(() => typeof store !== "undefined" && store.ready && typeof pvGen === "function", null, { timeout: 20000 }); await p.waitForTimeout(1500);
  return { b, ctx, p };
};
// record a scene with CDP screencast -> frames + concat list
module.exports.rec = async (p, name, fn) => {
  const fs = require("fs"), dir = "/home/claude/vid/sc/" + name; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cdp = await p.context().newCDPSession(p), frames = [];
  cdp.on("Page.screencastFrame", async f => { frames.push({ d: f.data, t: f.metadata.timestamp }); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch (e) {} });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  const t0 = Date.now() / 1000; await p.waitForTimeout(300); await fn(); await p.waitForTimeout(500);
  await cdp.send("Page.stopScreencast"); const t1 = Date.now() / 1000;
  let list = "ffconcat version 1.0\n";
  frames.forEach((f, i) => { const fn2 = `f${String(i).padStart(4, "0")}.jpg`; fs.writeFileSync(`${dir}/${fn2}`, Buffer.from(f.d, "base64")); const next = i < frames.length - 1 ? frames[i + 1].t : t1; list += `file ${fn2}\nduration ${Math.max(0.001, next - f.t).toFixed(3)}\n`; });
  if (frames.length) list += `file f${String(frames.length - 1).padStart(4, "0")}.jpg\n`;
  fs.writeFileSync(`${dir}/list.txt`, list); console.log(name, frames.length, "frames", (t1 - t0).toFixed(1) + "s");
};
