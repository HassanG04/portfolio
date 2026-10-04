/* Trusted mouse/touch/keyboard regression checks for Phase 1 interactions. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {startServer}=require('./qa-server.cjs');
const checks=[];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const routes=(process.env.QA_ROUTES||'main,AI,ML,DS,DA,DE').split(',');

(async()=>{
 const server=await startServer(),browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  if (!process.env.QA_AUDIO_ONLY) {
  for(const theme of ['dark','light']) {
   const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme});
   await context.addInitScript(theme=>localStorage.setItem('portfolio-theme',theme),theme);
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   for(const route of routes){
    await page.goto(`${server.origin}/${route==='main'?'':route+'/'}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const portrait=page.locator('.hero-pointer-frame');
    await portrait.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    const box=await portrait.boundingBox();
    await page.mouse.move(box.x+box.width*.8,box.y+box.height*.25);await wait(600);
    const tilt=await portrait.evaluate(e=>getComputedStyle(e).transform);
    assert.notEqual(tilt,'none');
    assert.ok(await portrait.evaluate(e=>e.classList.contains('is-tilting')));
    await page.mouse.move(0,0);await wait(1200);
    assert.equal(await portrait.evaluate(e=>e.style.transform),'');
    checks.push({route,theme,check:'portrait tilt and spring settle',pass:true});

    const trigger=page.locator('[data-certificate-preview]').first();
    await trigger.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    await trigger.click({force:true});
    const dialog=page.locator('#certificateViewer'),stage=page.locator('.certificate-viewer-media'),level=page.locator('#certificateZoomLevel');
    await page.locator('#certificateViewerImage').evaluate(image=>image.decode());
    await wait(500);
    assert.equal(await dialog.evaluate(e=>e.open),true);
    assert.match(await level.textContent(),/100%/);
    const start=await stage.evaluate(e=>({width:e.clientWidth,height:e.clientHeight}));
    await stage.click({force:true});assert.match(await level.textContent(),/250%/);
    await stage.click({force:true});assert.match(await level.textContent(),/500%/);
    await stage.click({force:true});assert.match(await level.textContent(),/100%/);
    await page.getByRole('button',{name:'Zoom in',exact:true}).click();assert.match(await level.textContent(),/250%/);
    const viewport=await stage.boundingBox();
    await page.mouse.move(viewport.x+10,viewport.y+10);await wait(650);
    const pan=await page.locator('#certificateViewerImage').evaluate(e=>e.style.transform);
    assert.match(pan,/scale\(2\.4|scale\(2\.5/);
    await page.mouse.move(viewport.x+viewport.width/2,viewport.y+viewport.height/2);await page.mouse.down();
    await page.mouse.move(viewport.x+viewport.width/2+80,viewport.y+viewport.height/2+70,{steps:8});await page.mouse.up();await wait(500);
    assert.notEqual(await page.locator('#certificateViewerImage').evaluate(e=>e.style.transform),pan);
    assert.match(await level.textContent(),/250%/,'drag must not advance zoom');
    await page.keyboard.press('ArrowRight');await page.keyboard.press('0');assert.match(await level.textContent(),/100%/);
    await page.keyboard.press('+');assert.match(await level.textContent(),/250%/);
    await page.keyboard.press('-');assert.match(await level.textContent(),/100%/);
    const after=await stage.evaluate(e=>({width:e.clientWidth,height:e.clientHeight}));assert.deepEqual(after,start,'zoom must not change the inspector layout box');
    await page.keyboard.press('Escape');assert.equal(await dialog.evaluate(e=>e.open),false);
    assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
    checks.push({route,theme,check:'certificate fit, cycle, hover-pan, drag, keyboard, focus return',pass:true});

    await page.setViewportSize({width:390,height:900});
    const card=page.locator('[data-ecpc-slide="0"] [data-flip-card]');
    await card.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    await card.locator('[data-flip-toggle]').click({force:true});await wait(900);
    const before=await card.locator('.profile-id-card:visible .profile-id-name').textContent();
    const badge=card.locator('.profile-id-card:visible').first();
    await badge.hover({force:true});await wait(200);
    const badgeState=await badge.evaluate(e=>({tag:e.tagName,cursor:getComputedStyle(e).cursor,glow:getComputedStyle(e).getPropertyValue('--profile-rgb').trim(),light:e.style.getPropertyValue('--profile-light-x'),pulse:getComputedStyle(e,'::before').animationName,transform:getComputedStyle(e).transform}));
    assert.equal(badgeState.tag,'DIV');assert.equal(badgeState.cursor,'default');assert.equal(badgeState.glow,'139,92,246');assert.ok(badgeState.light);assert.equal(badgeState.pulse,'profile-badge-pulse');assert.notEqual(badgeState.transform,'none');
    await card.locator('.profile-next').click({force:true});
    assert.notEqual(await card.locator('.profile-id-card:visible .profile-id-name').textContent(),before);
    assert.ok(await card.evaluate(e=>e.classList.contains('is-flipped')));
    await card.locator('.profile-prev').click({force:true});assert.equal(await card.locator('.profile-id-card:visible .profile-id-name').textContent(),before);
    await card.locator('.profile-return').click({force:true});await wait(900);
    checks.push({route,theme,check:'single teammate paging keeps flip state',pass:true});
    console.log(`Interactions passed: ${route}/${theme}`);
    await page.setViewportSize({width:1440,height:1000});
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await page.goto(server.origin,{waitUntil:'networkidle'});
  const portrait=page.locator('.hero-pointer-frame');await portrait.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
  const photo=await portrait.boundingBox();await page.touchscreen.tap(photo.x+photo.width/2,photo.y+photo.height/2);
  assert.ok(await portrait.evaluate(e=>e.classList.contains('is-tap-pulsing')));await wait(500);
  assert.equal(await portrait.evaluate(e=>e.classList.contains('is-tap-pulsing')),false);
  const trigger=page.locator('[data-certificate-preview]').first();await trigger.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await trigger.tap({force:true});
  await page.locator('#certificateViewerImage').evaluate(image=>image.decode());await wait(500);
  const stage=await page.locator('.certificate-viewer-media').boundingBox(),cx=stage.x+stage.width/2,cy=stage.y+stage.height/2;
  await page.touchscreen.tap(cx,cy);await page.touchscreen.tap(cx,cy);assert.match(await page.locator('#certificateZoomLevel').textContent(),/250%/);
  const cdp=await context.newCDPSession(page);
  await page.getByRole('button',{name:'Reset certificate to fit'}).tap();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-30,y:cy,id:1},{x:cx+30,y:cy,id:2}]});
  for(let distance=35;distance<=100;distance+=5){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-distance,y:cy,id:1},{x:cx+distance,y:cy,id:2}]});await wait(25);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(500);
  assert.ok(parseInt(await page.locator('#certificateZoomLevel').textContent())>250,'pinch must zoom');
  const panBefore=await page.locator('#certificateViewerImage').evaluate(e=>e.style.transform);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx,y:cy,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx+70,y:cy+70,id:1}]});await wait(60);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(500);
  assert.notEqual(await page.locator('#certificateViewerImage').evaluate(e=>e.style.transform),panBefore);
  checks.push({check:'touch portrait pulse, certificate double tap, pinch and drag',pass:true});
  await context.close();
  const reduced=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const reducedPage=await reduced.newPage();await reducedPage.goto(server.origin,{waitUntil:'networkidle'});
  const reducedPortrait=reducedPage.locator('.hero-pointer-frame');await reducedPortrait.hover({force:true});await wait(250);
  assert.equal(await reducedPortrait.evaluate(e=>e.style.transform),'');
  assert.equal(await reducedPage.locator('.hero-img-ring').evaluate(e=>getComputedStyle(e).animationName),'none');
  checks.push({check:'new portrait motion respects OS reduced motion',pass:true});await reduced.close();
  }

  // Reuse the existing diagnostic probe without changing production audio.
  const audioContext=await browser.newContext({viewport:{width:1440,height:1000}});
  await audioContext.addInitScript({path:'.baseline/audio-probe.js'});
  const audioPage=await audioContext.newPage();await audioPage.goto(server.origin,{waitUntil:'networkidle'});
  await audioPage.locator('#darkModeToggle').click();await wait(800);
  const events=()=>audioPage.locator('#audioProbeOutput').evaluate(e=>JSON.parse(e.textContent));
  const evidence=[];
  async function cue(label,expected,action){
    const start=(await events()).length;
    await action();await wait(1100);
    const entries=(await events()).slice(start).filter(e=>e.kind==='source-start'&&e.state==='running'||e.kind==='media-playing'&&e.mediaVolume>0);
    assert.ok(entries.some(e=>e.url?.endsWith(`/${expected}.mp3`)),`${label}: ${expected} must still play`);
    evidence.push({label,expected,entries});
  }
  for(const mode of ['muted','zero']){
    const toggle=audioPage.locator('#ambienceToggle');
    if(await toggle.getAttribute('aria-pressed')==='true')await toggle.click();
    if(mode==='zero'){
      await toggle.click();
      await audioPage.locator('#ambienceVolume').evaluate(e=>{e.value='0';e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));});
    }
    await wait(2000);
    await cue(`${mode}/hover`,'cursor',async()=>{
      const tag=audioPage.locator('.toolkit-tags .tech-tag').first();await tag.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await audioPage.mouse.move(0,0);await tag.hover({force:true});
    });
    await cue(`${mode}/click`,'select',()=>audioPage.locator('.navbar-brand').click({force:true}));
    const theme=await audioPage.locator('html').getAttribute('data-theme');
    await cue(`${mode}/theme`,theme==='dark'?'select2':'select',()=>audioPage.locator('#darkModeToggle').click());
    await audioPage.locator('[data-ecpc-index="0"]').click({force:true});await wait(900);
    const flip=audioPage.locator('[data-ecpc-slide="0"] [data-flip-card]');
    await cue(`${mode}/flip-open`,'left',()=>flip.locator('[data-flip-toggle]').click({force:true}));
    await cue(`${mode}/flip-close`,'right',()=>flip.locator('.profile-return').click({force:true}));
    await cue(`${mode}/chapter`,'right',()=>audioPage.locator('#ecpcNext').click({force:true}));
    await cue(`${mode}/certificate-open`,'select2',()=>audioPage.locator('[data-certificate-preview]').first().click({force:true}));
    await cue(`${mode}/certificate-close`,'select',()=>audioPage.locator('#certificateViewerClose').click());
  }
  fs.writeFileSync('.baseline/round-2/phase-1/audio-checks.json',JSON.stringify(evidence,null,2));
  checks.push({check:'independent interface cues with ambience muted and volume zero',pass:true});
  await audioContext.close();
 }finally{await browser.close();await server.close();fs.mkdirSync('.baseline/round-2/phase-1',{recursive:true});fs.writeFileSync(`.baseline/round-2/phase-1/${process.env.QA_AUDIO_ONLY?'audio-summary':'interaction-checks'}.json`,JSON.stringify(checks,null,2));}
 console.log(JSON.stringify({pass:true,checks:checks.length}));
})().catch(e=>{console.error(e);process.exitCode=1});
