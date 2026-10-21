const { chromium } = require('/home/claude/t/node_modules/playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch({executablePath:process.env.HS,args:['--allow-file-access-from-files']}); const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file:///home/claude/edit/page.html'); await p.evaluate(s=>setLogo(s), fs.readFileSync('/home/claude/vid/ov/revora-garage-dark.svg','utf8'));
 const dur=await p.evaluate(()=>DUR); fs.mkdirSync('out',{recursive:true});
 const only=process.argv[2]; const N=Math.ceil(dur*30); const list=only?only.split(',').map(v=>Math.round(+v*30)):[...Array(N).keys()];
 for(const i of list){ await p.evaluate(t=>render(t),i/30); await p.screenshot({path:`out/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:93}); }
 console.log('frames',list.length,'dur',dur); await b.close(); })();
