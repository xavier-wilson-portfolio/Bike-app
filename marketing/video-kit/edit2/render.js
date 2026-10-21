const { chromium } = require('/home/claude/t/node_modules/playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch({executablePath:process.env.HS,args:['--allow-file-access-from-files']}); const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file:///home/claude/edit2/page.html'); const dur=await p.evaluate(()=>DUR); fs.mkdirSync('out',{recursive:true});
 const only=process.argv[2]; const N=Math.ceil(dur*30); const list=only?only.split(',').map(v=>Math.round(+v*30)):[...Array(N).keys()];
 for(const i of list){ await p.evaluate(t=>render(t),i/30); await p.screenshot({path:`out/${String(i).padStart(4,'0')}.png`}); }
 console.log('frames',list.length,'dur',dur.toFixed(2)); await b.close(); })();
