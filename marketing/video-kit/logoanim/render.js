const { chromium } = require('/home/claude/t/node_modules/playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch({executablePath:process.env.HS}); const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file:///home/claude/logoanim/page.html'); fs.mkdirSync('out',{recursive:true});
 const only=process.argv[2]; const N=Math.round(3.0*30); const list=only?only.split(',').map(x=>Math.round(+x*30)):[...Array(N).keys()];
 for(const i of list){ await p.evaluate(t=>render(t),i/30); await p.screenshot({path:`out/${String(i).padStart(4,'0')}.png`,omitBackground:true}); }
 await b.close(); })();
