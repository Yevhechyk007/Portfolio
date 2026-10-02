const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const root=path.resolve('_site');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
 let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.statusCode=404;file=path.join(root,'404.html');}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(8088,'127.0.0.1',r));
 const output=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-architecture-'));
 const debugPort=9300+Math.floor(Math.random()*500);
 const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port='+debugPort,'--user-data-dir='+path.join(output,'chrome'),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let ws;
 try {
  let targets;for(let i=0;i<40;i++){try{targets=await fetch('http://127.0.0.1:'+debugPort+'/json').then(r=>r.json());break;}catch{await wait(250);}}
  ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
  let seq=0;const pending=new Map();ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}});
  const cmd=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  const evaluate=async expression=>{const r=await cmd('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const check=async(label,expression)=>{assert(await evaluate(expression),label);console.log('OK '+label);};
  const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);});
  await cmd('Page.enable');await cmd('Runtime.enable');
  const navigate=async route=>{await cmd('Page.navigate',{url:'http://127.0.0.1:8088'+route});await wait(650);};
  for(const [name,width,height,mobile] of [['desktop',1440,1000,false],['mobile',390,844,true],['small-mobile',320,740,true]]) {
   await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
   await cmd('Emulation.setTouchEmulationEnabled',{enabled:mobile});
   for(const route of ['/','/projects/mobile/','/projects/landings/','/projects/web-apps/','/cases/dripply/','/cases/government-appointment/']) {
    await navigate(route);await check(name+' '+route+' overflow','document.documentElement.scrollWidth <= innerWidth');
    await check(name+' '+route+' visible content',"getComputedStyle(document.querySelector('h1')).display !== 'none'");
    if(route==='/') {
     await check(name+' category card nesting',"[...document.querySelectorAll('.category-card')].every(a=>a.querySelector('.category-thumb')&&a.querySelector('.category-info'))");
     await evaluate("document.querySelector('.hero [data-contact-open]').click()");await check('modal opens',"document.getElementById('contactModal').classList.contains('open')");
     await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");await check('modal closes and restores focus',"!document.getElementById('contactModal').classList.contains('open')&&document.activeElement.matches('[data-contact-open]')");
     if(mobile){await check('mobile menu button visible',"getComputedStyle(document.getElementById('menuBtn')).display!=='none'");await evaluate("document.querySelector('[data-menu-toggle]').click()");await check('mobile menu opens',"document.getElementById('menuBtn').getAttribute('aria-expanded')==='true'");await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");}
    }
    if(route.startsWith('/cases/')) {
     await evaluate("Promise.all([...document.querySelectorAll('.case-slides img')].map(i=>{i.loading='eager';return i.decode()}))");
     await check(name+' slide proportions',"[...document.querySelectorAll('.case-slides img')].every(i=>i.naturalWidth>0&&Math.abs(i.clientHeight-i.clientWidth*i.naturalHeight/i.naturalWidth)<2)");
     await check('case CTA shared styles',"getComputedStyle(document.querySelector('[data-contact-open]')).borderRadius==='100px'");
     await evaluate("document.querySelector('[data-contact-open]').click()");await check('case modal works',"document.getElementById('contactModal').classList.contains('open')");await evaluate("document.querySelector('.modal-close').click()");
    }
    await wait(1300);const shot=await cmd('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,name+'-'+(route.replace(/\//g,'-')||'home')+'.png'),Buffer.from(shot.data,'base64'));
   }
  }
  for(const [hash,target] of [['mobile','/projects/mobile/'],['landings','/projects/landings/'],['web-apps','/projects/web-apps/'],['case-mobile-v1','/cases/dripply/'],['case-government-appointment','/cases/government-appointment/']]){await navigate('/#'+hash);await check('legacy '+hash,`location.pathname===${JSON.stringify(target)}`);}
  await navigate('/projects/web-apps/');await evaluate("document.querySelector('.project-card').click()");await wait(650);await check('normal case link',"location.pathname==='/cases/government-appointment/'");await evaluate('history.back()');await wait(650);await check('browser back',"location.pathname==='/projects/web-apps/'");
  await cmd('Emulation.setScriptExecutionDisabled',{value:true});await navigate('/cases/dripply/');await check('case works without JS',"document.querySelector('.case-slides img').clientWidth>0");await navigate('/');await check('home content visible without JS',"getComputedStyle(document.querySelector('.reveal')).opacity==='1'");
  assert.equal(errors.length,0,JSON.stringify(errors));console.log('Screenshots: '+output);
 } finally {if(ws)ws.close();chrome.kill();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
