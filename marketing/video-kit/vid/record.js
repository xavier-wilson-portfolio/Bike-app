const { chromium } = require('/home/claude/t/node_modules/playwright'); const S = require('./seed.js');
const wheel = async (p, dy, steps = 18, ms = 28) => { for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, dy / steps); await p.waitForTimeout(ms); } };
const tap = async (p, sel) => { const el = await p.$(sel); if (!el) { console.log("missing", sel); return; } await el.scrollIntoViewIfNeeded(); const bb = await el.boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout(70); await p.mouse.up(); };
(async () => {
  const { b, ctx, p } = await S.open(chromium, "suzuki-dl650a-2012"); await S.setup(p);
  await ctx.route(/workers\.dev/, async r => { const bd = JSON.parse(r.request().postData() || "{}"); if (!bd.scan) return r.fulfill({ status: 400, body: "{}" });
    await new Promise(z => setTimeout(z, 1600));
    r.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ text: '[{"n":1,"seen":"yes","count":1,"note":"terminals look clean"},{"n":2,"seen":"yes","count":1},{"n":3,"seen":"maybe","count":1},{"n":7,"seen":"yes","count":1},{"n":0,"name":"License plate light","seen":"yes","count":1}]' }) }); });
  // S1 maintenance
  await p.evaluate(() => go("maintenance")); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, 0));
  await S.rec(p, "s1", async () => { await p.waitForTimeout(500); await wheel(p, 260, 20, 30); await p.waitForTimeout(500); await wheel(p, 380, 22, 30); await p.waitForTimeout(700); await tap(p, ".tl-due button, [data-logit], button:has-text('Log it')"); await p.waitForTimeout(1600); });
  await p.keyboard.press("Escape"); await p.evaluate(() => { try { closeDrawer(); closeModal(); } catch (e) {} });
  // S2 reminders
  await p.evaluate(() => go("reminders")); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, 0));
  await S.rec(p, "s2", async () => { await p.waitForTimeout(600); await wheel(p, 300, 18, 30); await p.waitForTimeout(400); await p.evaluate(() => { const l = document.querySelector(".rm-sw"); l && l.scrollIntoView({ block: "center", behavior: "smooth" }); }); await p.waitForTimeout(450); await tap(p, ".rm-sw"); await p.waitForTimeout(150); console.log("email", await p.$eval("#rmEmail", e => e.checked)); await p.waitForTimeout(900); await wheel(p, 520, 24, 30); await p.waitForTimeout(1200); });
  // S3 parts deck (main parts, photo silhouettes)
  await p.evaluate(() => { go("inventory"); R.tab.inventory = "deck"; render(false); scrollTo(0, 0); }); await p.waitForTimeout(900);
  await p.evaluate(() => { const c = document.querySelector(".pv-top"); c && c.scrollIntoView({ block: "center" }); }); await p.waitForTimeout(300);
  await S.rec(p, "s3", async () => {
    for (const dir of [1, 1, -1]) { await p.waitForTimeout(650); const bb = await (await p.$(".pv-top")).boundingBox(); const y = bb.y + 90, x0 = bb.x + bb.width / 2;
      await p.mouse.move(x0, y); await p.mouse.down(); for (let i = 1; i <= 14; i++) { await p.mouse.move(x0 + dir * i * 16, y + i * 0.6); await p.waitForTimeout(16); } await p.mouse.up(); await p.waitForTimeout(450); }
    await p.waitForTimeout(500);
  });
  // S4 scan without a catalogue
  await p.evaluate(() => { R.tab.inventory = ""; go("inventory"); scrollTo(0, 0); }); await p.waitForTimeout(700);
  await S.rec(p, "s4", async () => { await p.waitForTimeout(400); await tap(p, ".pv-opt [data-pvscan]"); await p.waitForTimeout(900); await tap(p, '[data-psys="Electrical"]'); await p.waitForTimeout(800);
    await p.setInputFiles("input[data-psfile]:not([capture])", "/home/claude/vid/scanphoto.jpg"); await p.waitForSelector('[data-ps="save"]', { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(1300);
    await p.evaluate(() => { const l = document.querySelector(".scan .sclist"); l && l.scrollIntoView({ block: "center" }); }); await p.waitForTimeout(500); await tap(p, '[data-ps="save"]'); await p.waitForTimeout(1400); });
  await p.evaluate(() => closeModal());
  // S5 shopping list with a running total
  await p.evaluate(async () => { for (const it of [{ title: "Front brake pads (pair), sintered", price: 42.99, ship: 0, store: "RevZilla", url: "https://www.revzilla.com" }, { title: "Chain and sprocket kit, 525 x 118", price: 189.95, ship: 0, store: "eBay", url: "https://www.ebay.com" }, { title: "Oil filter", price: 11.49, ship: 0, store: "Amazon", url: "https://www.amazon.com" }]) await cartAdd(it); R.tab.purchasing = ""; go("purchasing"); }); await p.waitForTimeout(4600);
  await p.waitForTimeout(900); await p.evaluate(() => { const c = document.querySelector(".ct-cart"); c && c.scrollIntoView({ block: "start" }); scrollBy(0, -120); }); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelectorAll(".toast").forEach(t => t.remove())); await S.rec(p, "s5", async () => { await p.waitForTimeout(700); console.log("before", await p.$eval(".ct-tot b", e => e.textContent)); await tap(p, '.ct-store:has-text("Amazon") [data-cq$="|1"]'); await p.waitForTimeout(900); await tap(p, '.ct-store:has-text("Amazon") [data-cq$="|1"]'); await p.waitForTimeout(1300); console.log("after", await p.$eval(".ct-tot b", e => e.textContent)); });
  await b.close();
})();
