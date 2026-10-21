const { chromium } = require('/home/claude/t/node_modules/playwright'); const S = require('./seed.js');
const wheel = async (p, dy, steps = 18, ms = 28) => { for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, dy / steps); await p.waitForTimeout(ms); } };
(async () => {
  const { b, ctx, p } = await S.open(chromium, "suzuki-dl650a-2012"); await S.setup(p);
  await p.evaluate(() => go("home")); await p.waitForTimeout(1500); await p.evaluate(() => scrollTo(0, 0));
  await p.evaluate(() => document.querySelectorAll(".toast").forEach(t => t.remove()));
  await p.mouse.move(195, 400);
  await S.rec(p, "s0", async () => { await p.waitForTimeout(700); await wheel(p, 330, 40, 30); await p.waitForTimeout(600); await wheel(p, 420, 40, 30); await p.waitForTimeout(900); });
  await b.close(); })();
