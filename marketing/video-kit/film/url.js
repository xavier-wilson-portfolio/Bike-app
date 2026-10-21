const { chromium } = require('/home/claude/t/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:process.env.HS}); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<style>body{margin:0;background:transparent;font-family:'Inter Display','Inter',sans-serif;width:1080px;height:1920px}.w{position:absolute;left:0;right:0;top:1250px;text-align:center}.u{font-size:40px;font-weight:600;letter-spacing:.08em;color:#D9BF8E}.s{font-size:32px;font-weight:500;color:#B9D9EB;margin-top:20px}</style><div class="w"><div class="s">Free to start</div><div class="u" style="margin-top:22px">REVORAGARAGE.COM</div></div>`);
await p.screenshot({path:'url.png',omitBackground:true}); await b.close();})();
