/* Phase 1 sizing gate. Test browser only; no site dependency or build step. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const { startServer } = require('./qa-server.cjs');
const widths = [320,360,390,768,1024,1280,1440,1920,2560];
const routes = (process.env.QA_ROUTES || 'main,AI,ML,DS,DA,DE').split(',');
const failures = [], results = [];
const output = `.baseline/round-2/${process.env.QA_STAGE || 'phase-1'}`;

async function measure(page) {
  return page.evaluate(() => {
    const rect = element => {
      const box = element.getBoundingClientRect();
      return { x:box.x,y:box.y,width:box.width,height:box.height,right:box.right,bottom:box.bottom };
    };
    const boxesOverlap = (a,b) => Math.min(a.right,b.right)-Math.max(a.x,b.x)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1;
    const face = document.querySelector('.depi-visual-back');
    const button = face.querySelector('.profile-return');
    const faceBox = rect(face), buttonBox = rect(button);
    return {
      depiReturn: { width:button.offsetWidth, height:button.offsetHeight,
        inset:Math.min(buttonBox.x-faceBox.x,buttonBox.y-faceBox.y,faceBox.right-buttonBox.right,faceBox.bottom-buttonBox.bottom),
        overlapsBadge:boxesOverlap(buttonBox,rect(face.querySelector('.profile-id-card'))) },
      pageOverflow: document.documentElement.scrollWidth > innerWidth,
      photos: [...document.querySelectorAll('.profile-flip')].map(frame => {
        const image = frame.querySelector('.flip-card-image, .depi-progress-icon img');
        const parent = frame.parentElement, style = getComputedStyle(parent);
        const contentWidth = parent.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
        const ratio = image.naturalWidth/image.naturalHeight;
        return { source:image.getAttribute('src'),width:frame.offsetWidth,height:frame.offsetHeight,ratio,ratioError:Math.abs(frame.offsetHeight-frame.offsetWidth/ratio),columnFraction:frame.offsetWidth/contentWidth,fit:getComputedStyle(image).objectFit,front:rect(frame.querySelector('.flip-card-front')),back:rect(frame.querySelector('.flip-card-back')) };
      }),
      badges:[...document.querySelectorAll('.profile-id-card')].filter(card=>card.offsetWidth).map(card=>{
        const box=rect(card), children=[...card.children].filter(el=>el.offsetWidth).map(el=>({name:el.className,...rect(el),overflow:el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1}));
        const collisions=[];
        children.forEach((a,i)=>children.slice(i+1).forEach(b=>{if(boxesOverlap(a,b)) collisions.push([a.name,b.name]);}));
        return {name:card.querySelector('strong').textContent,width:card.offsetWidth,height:card.offsetHeight,ratioError:Math.abs(card.offsetWidth/card.offsetHeight-1.586),overflow:card.scrollWidth>card.clientWidth+1||card.scrollHeight>card.clientHeight+1,collisions,outside:children.filter(child=>child.x<box.x-1||child.y<box.y-1||child.right>box.right+1||child.bottom>box.bottom+1||child.overflow).map(c=>c.name)};
      }),
      tags:[...document.querySelectorAll('.toolkit-tags .tech-tag')].map(tag=>({text:tag.textContent,overflow:tag.scrollHeight>tag.clientHeight+1||tag.scrollWidth>tag.clientWidth+1,box:rect(tag)}))
    };
  });
}

(async()=>{
  const server=await startServer(), browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    for(const theme of ['dark','light']) {
      const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme});
      await context.addInitScript(theme=>localStorage.setItem('portfolio-theme',theme),theme);
      const page=await context.newPage();
      page.on('pageerror',e=>failures.push({type:'pageerror',message:e.message}));
      for(const route of routes) {
        await page.goto(`${server.origin}/${route==='main'?'':route+'/'}`,{waitUntil:'networkidle'});
        await page.evaluate(async()=>{
          await document.fonts.ready;
          await Promise.all([...document.querySelectorAll('img')].map(image=>{image.loading='eager';return image.decode().catch(()=>{});}));
          document.querySelectorAll('.profile-flip [data-flip-toggle]').forEach(button=>button.click());
        });
        await page.waitForTimeout(1050);
        for(const width of widths) {
          await page.setViewportSize({width,height:1000});
          await page.waitForTimeout(180);
          const metrics=await measure(page), key={route,theme,width};
          results.push({...key,...metrics});
          if(metrics.pageOverflow) failures.push({...key,type:'page-overflow'});
          if(metrics.depiReturn.width<36||metrics.depiReturn.height<36||metrics.depiReturn.inset<10||metrics.depiReturn.overlapsBadge) failures.push({...key,type:'depi-return',...metrics.depiReturn});
          for(const photo of metrics.photos) {
            if(photo.ratioError>1||photo.fit!=='contain'||photo.columnFraction<(width>=992?.599:.99)||Math.abs(photo.front.width-photo.back.width)>.5||Math.abs(photo.front.height-photo.back.height)>.5) failures.push({...key,type:'photo',...photo});
          }
          for(const badge of metrics.badges) if(badge.overflow||badge.outside.length||badge.collisions.length||badge.ratioError>.025) failures.push({...key,type:'badge',...badge});
          for(const tag of metrics.tags) if(tag.overflow) failures.push({...key,type:'tag',...tag});
        }
        console.log(`Measured ${route}/${theme}: ${widths.length} live viewport sizes`);
      }
      await context.close();
    }
  } finally {await browser.close();await server.close();}
  fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(`${output}/measurements.json`,JSON.stringify({pass:!failures.length,views:results.length,failures,results},null,2));
  console.log(JSON.stringify({pass:!failures.length,views:results.length,failures},null,2));
  process.exitCode=failures.length?1:0;
})().catch(e=>{console.error(e);process.exitCode=1;});
