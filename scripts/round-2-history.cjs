/* Read the effective old About portrait from Git without checkout/reset. */
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve('.baseline/round-2/pre-overhaul');
fs.mkdirSync(output, { recursive: true });
const ref = '658dea7';
const gitArgs = ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`];
const source = file => execFileSync('git', [...gitArgs, 'show', `${ref}:${file}`]);

(async () => {
  const server = await require('./qa-server.cjs').startServer();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [390, 1440]) for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme });
      await context.addInitScript(theme => localStorage.setItem('portfolio-theme', theme), theme);
      await context.route(`${server.origin}/**`, route => {
        const relative = new URL(route.request().url()).pathname.slice(1) || 'index.html';
        if (!/^(index\.html|(?:js|css)\/[^/]+\.(?:js|css))$/.test(relative)) return route.continue();
        const contentType = relative.endsWith('.css') ? 'text/css' : relative.endsWith('.js') ? 'text/javascript' : 'text/html';
        return route.fulfill({ body: source(relative), contentType });
      });
      const page = await context.newPage();
      await page.goto(server.origin, { waitUntil: 'networkidle' });
      await page.locator('.about-profile-panel').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(1200);
      const record = await page.evaluate(() => {
        const properties = ['width', 'height', 'border-radius', 'border', 'box-shadow', 'object-fit', 'object-position', 'margin', 'padding', 'overflow', 'animation', 'transition'];
        const select = selector => {
          const element = document.querySelector(selector);
          const style = getComputedStyle(element);
          return { html: element.outerHTML, values: Object.fromEntries(properties.map(property => [property, style.getPropertyValue(property)])) };
        };
        return { panel: select('.about-profile-panel'), wrapper: select('.profile-image-wrapper'), image: select('.profile-image'),
          before: getComputedStyle(document.querySelector('.profile-image-wrapper'), '::before').animation,
          after: getComputedStyle(document.querySelector('.profile-image-wrapper'), '::after').animation };
      });
      fs.writeFileSync(path.join(output, `about-${width}-${theme}.json`), JSON.stringify(record, null, 2));
      await page.screenshot({ path: path.join(output, `about-${width}-${theme}.png`) });
      await context.close();
      console.log(`Historical About ${width}/${theme} saved.`);
    }
  } finally { await browser.close(); await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
