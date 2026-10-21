const { chromium } = require('/home/claude/t/node_modules/playwright');
const caps = { c1: ["01", "Service log", "Every service, logged."], c2: ["02", "Reminders", "Know before it's due."], c3: ["03", "Parts", "Swipe through every part."], c4: ["04", "Photo scan", "Snap it. It finds the parts."], c5: ["05", "Shopping list", "One list. Running total."] };
(async () => { const b = await chromium.launch({ executablePath: process.env.HS }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const css = `body{margin:0;background:transparent;font-family:'Inter Display','Inter',sans-serif}`;
  await p.setContent(`<style>${css}.b{position:absolute;left:0;right:0;top:0;height:540px;background:linear-gradient(#17232C 0,#17232C 440px,rgba(23,35,44,0) 540px)}.r{position:absolute;left:80px;top:338px;width:64px;height:4px;background:#D9BF8E}</style><div class="b"></div>`);
  await p.screenshot({ path: 'ov/band.png', omitBackground: true });
  for (const [k, [n, lab, t]] of Object.entries(caps)) {
    await p.setContent(`<style>${css}.z{position:absolute;left:0;right:0;bottom:400px;display:flex;justify-content:center}.w{max-width:880px;text-align:center;color:#fff;background:rgba(23,35,44,.94);border-radius:24px;padding:30px 40px 34px;box-shadow:0 14px 40px rgba(0,0,0,.22)}.k{font-size:24px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#D9BF8E;display:flex;gap:22px;justify-content:center}.k i{font-style:normal;color:#8DBBD8}.t{margin-top:14px;font-size:56px;font-weight:700;letter-spacing:-.02em;line-height:1.05}</style><div class="z"><div class="w"><div class="k"><i>${n}</i><span>${lab}</span></div><div class="t">${t}</div></div></div>`);
    await p.screenshot({ path: `ov/${k}.png`, omitBackground: true });
  }
  await b.close(); })();
