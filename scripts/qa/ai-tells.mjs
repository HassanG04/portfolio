import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const fileUrl = 'file://' + path.resolve('index.html');
const reportPath = path.resolve('docs/shots/R1/report.txt');

async function runTests() {
  const browser = await chromium.launch();
  let report = [];
  function logFail(msg) { report.push('FAIL: ' + msg); }
  function logPass(msg) { report.push('PASS: ' + msg); }

  try {
    const page = await browser.newPage();
    await page.goto(fileUrl);
    
    // 1. HERO TYPE
    await page.setViewportSize({ width: 1440, height: 900 });
    let h1FontSize1440 = await page.$eval('h1', el => parseFloat(getComputedStyle(el).fontSize));
    let titleFontSize1440 = await page.$eval('.hero-subtitle, .hero-title-lockup', el => parseFloat(getComputedStyle(el).fontSize)).catch(() => 0);
    if (h1FontSize1440 < 112) logFail('h1 font-size at 1440 is ' + h1FontSize1440 + 'px (needs >= 112)');
    else logPass('h1 font-size at 1440 is ' + h1FontSize1440 + 'px');

    await page.setViewportSize({ width: 390, height: 844 });
    let h1FontSize390 = await page.$eval('h1', el => parseFloat(getComputedStyle(el).fontSize));
    if (h1FontSize390 < 48) logFail('h1 font-size at 390 is ' + h1FontSize390 + 'px (needs >= 48)');
    else logPass('h1 font-size at 390 is ' + h1FontSize390 + 'px');

    // Overflow check 320 to 2560
    let overflow = false;
    for (let w of [320, 768, 1440, 2560]) {
      await page.setViewportSize({ width: w, height: 900 });
      let bodyWidth = await page.$eval('body', el => el.scrollWidth);
      if (bodyWidth > w) { overflow = true; logFail(`Overflow at ${w}px width (body scrollWidth ${bodyWidth})`); }
    }
    if (!overflow) logPass('No overflow 320 to 2560');

    // 2. HERO PORTRAIT
    await page.setViewportSize({ width: 1440, height: 900 });
    let portraitWidth = await page.$eval('.hero-img, .hero-portrait', el => el.getBoundingClientRect().width).catch(() => 0);
    if (portraitWidth < 380) logFail('Hero portrait width is ' + portraitWidth + 'px (needs >= 380 at 1440px)');
    else logPass('Hero portrait width is ' + portraitWidth + 'px');

    let cssText = await fs.readFile('css/pages.css', 'utf-8').catch(()=>'');
    if (cssText.includes('clip-path: path(')) logFail('clip-path: path( is used in CSS');
    else logPass('clip-path: path( not found in CSS');

    // We skip exact pixel diffs in this simplified run, as we know the current state will fail most checks.
    // 3. SECTION TITLES
    let sectionTitleDefs = (cssText.match(/\.section-anchor-heading/g) || []).length;
    if (sectionTitleDefs !== 1) logFail(`.section-anchor-heading definitions: ${sectionTitleDefs} (needs 1)`);
    else logPass(`.section-anchor-heading definitions: 1`);

    // 4. NO template tells
    let bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('01 / 04')) logFail('Contains "01 / 04" overlay');
    else logPass('No "01 / 04" overlay');

    // 5. ICONS
    let heroGap = await page.evaluate(() => {
       const btnRow = document.querySelector('.hero-buttons');
       const socialRow = document.querySelector('.hero-socials');
       if (!btnRow || !socialRow) return 0;
       return socialRow.getBoundingClientRect().top - btnRow.getBoundingClientRect().bottom;
    });
    if (heroGap < 20) logFail(`Vertical gap between hero buttons and socials is ${heroGap}px (needs >= 20px)`);
    else logPass(`Vertical gap between hero buttons and socials is ${heroGap}px`);

    // 6. SLIDE 4 AMBIENCE
    // Will fail currently since it is not implemented
    logFail('Slide 4 ambience lobes not verified in script yet');

  } catch (e) {
    report.push('ERROR running tests: ' + e.toString());
  } finally {
    await browser.close();
  }

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report.join('\n'), 'utf-8');
  console.log('Report saved to ' + reportPath);
  console.log(report.join('\n'));
}

runTests();
