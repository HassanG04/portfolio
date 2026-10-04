/* Local visual regression harness. Run with the workspace Playwright runtime:
 * npx --offline -c "node scripts/round-2-browser.cjs baseline"
 * No dependency is added to this static site. Artifacts stay in .baseline/.
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const mode = process.argv[2] || 'baseline';
const output = path.resolve('.baseline/round-2', mode);
const widths = process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : [360, 390, 768, 1024, 1280, 1440, 1920, 2560];
const routes = process.env.QA_ROUTES ? process.env.QA_ROUTES.split(',') : ['main', 'AI'];
const themes = process.env.QA_THEMES ? process.env.QA_THEMES.split(',') : ['dark', 'light'];
let origin = process.env.QA_ORIGIN;
const flipSelectors = ['.flip-card', '.flip-card-inner', '.flip-card-face'];
fs.mkdirSync(output, { recursive: true });

const save = (file, value) => fs.writeFileSync(path.join(output, file), JSON.stringify(value, null, 2));

async function flipStyles(card) {
  return card.evaluate((element, selectors) => {
    const properties = ['transition', 'transform', 'perspective', 'transform-style', 'backface-visibility', 'animation'];
    const nodes = [element, ...element.querySelectorAll(selectors.slice(1).join(','))];
    return nodes.map(node => ({
      classes: node.className,
      styles: Object.fromEntries(properties.map(property => [property, getComputedStyle(node).getPropertyValue(property)]))
    }));
  }, flipSelectors);
}

async function measurements(page) {
  return page.evaluate(() => {
    const rect = element => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };
    return {
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      images: [...document.querySelectorAll('.flip-card-image, .depi-progress-icon img')].map(image => ({
        source: image.getAttribute('src'), natural: [image.naturalWidth, image.naturalHeight],
        box: rect(image), layout: [image.offsetWidth, image.offsetHeight],
        fit: getComputedStyle(image).objectFit,
        frame: rect(image.closest('[data-flip-card]'))
      })),
      tags: [...document.querySelectorAll('.toolkit-tags .tech-tag')].map(tag => ({
        text: tag.textContent.trim(), box: rect(tag),
        overflow: tag.scrollWidth > tag.clientWidth || tag.scrollHeight > tag.clientHeight,
        clippingAncestors: [...(function* () { for (let node = tag.parentElement; node; node = node.parentElement) yield node; })()]
          .filter(node => ['hidden', 'clip', 'scroll', 'auto'].includes(getComputedStyle(node).overflowX))
          .map(node => ({ classes: node.className, box: rect(node) }))
      })),
      ids: [...document.querySelectorAll('.profile-id-card')].map(card => ({
        name: card.querySelector('.profile-id-name').textContent, box: rect(card),
        overflow: card.scrollWidth > card.clientWidth || card.scrollHeight > card.clientHeight
      }))
    };
  });
}

async function capture(browser, route, width, theme) {
  const name = `${route}-${width}-${theme}`;
  if (fs.existsSync(path.join(output, `${name}.json`)) && !process.env.QA_FORCE) return;
  const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: 'no-preference', deviceScaleFactor: 1 });
  await context.addInitScript(theme => localStorage.setItem('portfolio-theme', theme), theme);
  const page = await context.newPage();
  const issues = [];
  page.on('requestfailed', request => issues.push({ type: 'requestfailed', url: request.url(), message: request.failure().errorText }));
  page.on('pageerror', error => issues.push({ type: 'pageerror', message: error.message }));
  page.on('console', message => { if (message.type() === 'error') issues.push({ type: 'console', message: message.text() }); });
  await page.coverage.startCSSCoverage({ resetOnNavigation: false });
  const shots = [];
  const styles = {};
  const screenshot = async (label, selector) => {
    const target = page.locator(selector).first();
    if (label === 'hero') await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
    else await target.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(450);
    const file = `${name}-${label}.png`;
    // Element screenshots wait for geometric stability forever on idle-floating
    // cards. Capture their live bounding box without disabling any animation.
    const clip = await target.evaluate(element => {
      const box = element.getBoundingClientRect();
      const x = Math.max(0, box.left + scrollX);
      return { x, y: Math.max(0, box.top + scrollY), width: Math.min(box.width, innerWidth - x), height: box.height };
    });
    await page.screenshot({ path: path.join(output, file), clip, fullPage: true, animations: 'allow', timeout: 15000 });
    shots.push(file);
  };
  try {
    await page.goto(`${origin}/${route === 'main' ? '' : `${route}/`}`, { waitUntil: 'networkidle', timeout: 45000 });
    if (issues.length) console.log(`${name} load issues: ${JSON.stringify(issues)}`);
    await page.waitForFunction(() => document.querySelectorAll('[data-ecpc-slide]').length === 4);
    await page.evaluate(() => document.fonts.ready);
    for (let top = 0; top < await page.evaluate(() => document.documentElement.scrollHeight); top += 850) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(1000);
    const tokens = await page.evaluate(() => Object.fromEntries([...getComputedStyle(document.documentElement)].filter(property => property.startsWith('--')).sort().map(property => [property, getComputedStyle(document.documentElement).getPropertyValue(property).trim()])));
    for (const [label, selector] of [['hero', '#home'], ['about', '#about'], ['services-tools', '#services']]) await screenshot(label, selector);
    const flipCapture = async (label, selector, shotSelector = selector) => {
      const card = page.locator(selector).first();
      await card.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.mouse.move(0, 0);
      await page.waitForTimeout(1100);
      styles[`${label}-idle`] = await flipStyles(card);
      await screenshot(`${label}-front`, shotSelector);
      await card.hover({ force: true });
      await page.waitForTimeout(1000);
      styles[`${label}-hover`] = await flipStyles(card);
      await card.locator('[data-flip-toggle]').click({ force: true });
      await page.waitForTimeout(1150);
      if (!(await card.evaluate(element => element.classList.contains('is-flipped')))) throw new Error(`${label} did not flip`);
      await page.mouse.move(0, 0);
      styles[`${label}-flipped`] = await flipStyles(card);
      await screenshot(`${label}-flipped`, shotSelector);
      const firstId = card.locator('.profile-id-card').first();
      if (await firstId.count()) await firstId.hover({ force: true });
      const back = card.locator('.profile-return');
      if (await back.count()) await back.click({ force: true });
      else await card.locator('.flip-card-back').click({ force: true, position: { x: 12, y: 12 } });
      await page.waitForTimeout(1100);
    };
    for (let chapter = 0; chapter < 4; chapter++) {
      await page.locator(`[data-ecpc-index="${chapter}"]`).click({ force: true });
      await page.waitForTimeout(1100);
      await flipCapture(`ecpc-${chapter + 1}`, `[data-ecpc-slide="${chapter}"] [data-flip-card]`, '.ecpc-showcase');
    }
    await flipCapture('depi', '.depi-visual-flip', '.depi-progress-card');
    await flipCapture('soft-skills', '#softSkillsFlip', '.soft-skills-section');
    await screenshot('accomplishments', '#accomplishments');
    await page.locator('[data-certificate-preview]').first().click({ force: true });
    await page.waitForFunction(() => document.querySelector('#certificateViewerImage').naturalWidth > 0);
    await screenshot('certificate-viewer', '#certificateViewer');
    await page.locator('#certificateViewerClose').click();
    for (const tag of await page.locator('.toolkit-tags .tech-tag').all()) {
      await tag.hover({ force: true });
      await tag.evaluate(element => { element.tabIndex = 0; element.focus(); });
    }
    const metrics = await measurements(page);
    const coverage = await page.coverage.stopCSSCoverage();
    save(`${name}-coverage.json`, coverage.filter(sheet => sheet.url.startsWith(origin)));
    save(`${name}.json`, { route, width, theme, tokens, styles, metrics, shots, issues });
    console.log(`PASS ${name}: ${shots.length} screenshots; ${Object.keys(tokens).length} tokens; ${Object.keys(styles).length} flip states; ${issues.length} browser issues`);
  } finally { save(`${name}-issues.json`, issues); await context.close(); }
}

(async () => {
  const server = origin ? null : await require('./qa-server.cjs').startServer();
  origin ||= server.origin;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    save('source.json', {
      commit: execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      files: ['css/style.css', 'css/design-system.css', 'css/editorial.css', ...fs.readdirSync('js').filter(file => file.endsWith('.js')).map(file => `js/${file}`)]
        .map(file => { const source = fs.readFileSync(file, 'utf8'); return { file, lines: source.split('\n').length, crlf: (source.match(/\r\n/g) || []).length, bytes: Buffer.byteLength(source) }; })
    });
    const jobs = routes.flatMap(route => widths.flatMap(width => themes.map(theme => [route, width, theme])));
    const concurrency = Number(process.env.QA_CONCURRENCY) || 4;
    for (let index = 0; index < jobs.length; index += concurrency) await Promise.all(jobs.slice(index, index + concurrency).map(job => capture(browser, ...job)));
  } finally { await browser.close(); await server?.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
