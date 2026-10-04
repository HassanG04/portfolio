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
  if (!process.env.QA_AUDIO_ONLY && !process.env.QA_CAROUSEL_ONLY) {
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

  if (process.env.QA_CAROUSEL_ONLY) {
   if(process.env.QA_POINTER!=='touch') for(const theme of ['dark','light']) for(const reduced of [false,true]) {
    const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:reduced?'reduce':'no-preference'});
    await context.addInitScript(theme=>localStorage.setItem('portfolio-theme',theme),theme);
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const route of routes){
     await page.goto(`${server.origin}/${route==='main'?'':route+'/'}`,{waitUntil:'networkidle'});
     const stage=page.locator('.ecpc-deck-stage'),track=page.locator('.ecpc-slider-track');
     await stage.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(900);
     assert.equal(await page.locator('html').getAttribute('data-motion'),reduced?'reduced':'full');
     const active=()=>page.locator('[data-ecpc-index][aria-current="true"]').getAttribute('data-ecpc-index');
     async function mouseDrag(fraction,delay=12){
      const box=await stage.boundingBox(),startX=box.x+box.width*(fraction<0?.86:.14),y=box.y+8;
      await page.mouse.move(startX,y);await page.mouse.down();await page.mouse.move(startX+(fraction<0?-3:3),y);await wait(35);
      assert.equal(await stage.evaluate(e=>e.classList.contains('is-dragging')),false,'below threshold');
      const start=await track.evaluate(e=>getComputedStyle(e).transform);
      for(let step=1;step<=8;step++){
       await page.mouse.move(startX+box.width*fraction*step/8,y);await wait(delay);
       if(step===4){
        assert.ok(await stage.evaluate(e=>e.classList.contains('is-dragging')));
        assert.notEqual(await track.evaluate(e=>getComputedStyle(e).transform),start,'track follows pointer');
        if(!reduced)assert.equal(await track.evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
       }
      }
      await page.mouse.up();await wait(950);
      assert.equal(await stage.evaluate(e=>e.classList.contains('is-dragging')),false);
      assert.equal(await page.locator('.ecpc-showcase .is-flipped').count(),0,'real drag must not flip');
     }
     await mouseDrag(-.6,35);assert.equal(await active(),'1');
     await mouseDrag(.6,35);assert.equal(await active(),'0');
     await mouseDrag(.6,35);assert.equal(await active(),'3','wrap to last chapter');
     await page.locator('[data-ecpc-index="0"]').click({force:true});await wait(900);
     await mouseDrag(-.45,1);assert.equal(await active(),reduced?'0':'1','reduced mode removes fling momentum');
     await page.locator('[data-ecpc-index="0"]').click({force:true});await wait(900);
     const text=await page.locator('[data-ecpc-slide="0"] p').boundingBox();
     await page.mouse.move(text.x+5,text.y+8);await page.mouse.down();await page.mouse.move(text.x+110,text.y+8,{steps:8});await page.mouse.up();
     assert.equal(await active(),'0','text selection must not navigate');
     assert.equal(await stage.evaluate(e=>e.classList.contains('is-dragging')),false);
     await page.evaluate(()=>getSelection().removeAllRanges());
     const toggle=page.locator('[data-ecpc-slide="0"] [data-flip-toggle]');await toggle.click({force:true});await wait(950);
     assert.ok(await toggle.evaluate(e=>e.closest('[data-flip-card]').classList.contains('is-flipped')));
     await page.locator('[data-ecpc-slide="0"] .profile-return').click({force:true});await wait(950);
     await page.locator('#ecpcNext').click({force:true});await wait(950);assert.equal(await active(),'1');
     await page.locator('#ecpcDeck').focus();await page.keyboard.press('ArrowLeft');await wait(950);assert.equal(await active(),'0');
     checks.push({route,theme,reduced,check:'mouse threshold, live drag, snap, wrap, fling, text selection, flip, arrows and keyboard',pass:true});
     console.log(`Carousel mouse passed: ${route}/${theme}/${reduced?'reduced':'full'}`);
    }
    assert.deepEqual(errors,[]);await context.close();
   }
   if(process.env.QA_POINTER!=='mouse') for(const theme of ['dark','light']) for(const reduced of [false,true]){
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,colorScheme:theme,reducedMotion:reduced?'reduce':'no-preference'});
    await context.addInitScript(theme=>localStorage.setItem('portfolio-theme',theme),theme);
    const page=await context.newPage();
    for(const route of routes){
    await page.goto(`${server.origin}/${route==='main'?'':route+'/'}`,{waitUntil:'networkidle'});
    const stage=page.locator('.ecpc-deck-stage');await stage.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(900);
    const cdp=await context.newCDPSession(page),box=await page.locator('[data-ecpc-slide="0"] [data-flip-card]').boundingBox();
    const x=box.x+box.width*.9,y=box.y+box.height*.55;
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    for(let step=1;step<=10;step++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-box.width*.85*step/10,y,id:1}]});await wait(35);}
    assert.ok(await stage.evaluate(e=>e.classList.contains('is-dragging')));
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(950);
    assert.equal(await page.locator('[data-ecpc-index][aria-current="true"]').getAttribute('data-ecpc-index'),'1');
    assert.equal(await page.locator('.ecpc-showcase .is-flipped').count(),0);
    await page.locator('[data-ecpc-index="0"]').tap({force:true});await wait(900);
    const verticalBox=await page.locator('[data-ecpc-slide="0"] [data-flip-card]').boundingBox(),vx=verticalBox.x+verticalBox.width/2,vy=verticalBox.y+verticalBox.height*.8;
    const scroll=await page.evaluate(()=>scrollY);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:vx,y:vy,id:1}]});
    for(let step=1;step<=6;step++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:vx,y:vy-step*20,id:1}]});await wait(30);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(500);
    assert.equal(await page.locator('[data-ecpc-index][aria-current="true"]').getAttribute('data-ecpc-index'),'0');
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-scroll)>20,'vertical touch scroll remains available');
    checks.push({route,theme,reduced,check:'touch swipe over photo, click suppression and vertical scrolling',pass:true});
    console.log(`Carousel touch passed: ${route}/${theme}/${reduced?'reduced':'full'}`);
    }
    await context.close();
   }
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
 }finally{await browser.close();await server.close();fs.mkdirSync('.baseline/round-2/phase-1',{recursive:true});fs.writeFileSync(`.baseline/round-2/phase-1/${process.env.QA_CAROUSEL_ONLY?'carousel-checks':process.env.QA_AUDIO_ONLY?'audio-summary':'interaction-checks'}.json`,JSON.stringify(checks,null,2));}
 console.log(JSON.stringify({pass:true,checks:checks.length}));
})().catch(e=>{console.error(e);process.exitCode=1});
