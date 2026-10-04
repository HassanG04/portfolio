/* Supplemental baseline: tools, tag interaction, source image sizes, and
 * carousel transitions. Also reusable for the live-resize acceptance check. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const stage = process.argv[2] || 'baseline';
const output = path.resolve('.baseline/round-2', stage);
const routes = (process.env.QA_ROUTES || 'main,AI').split(',');
const widths = [320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560];
fs.mkdirSync(output, { recursive: true });

async function readLayout(page) {
  return page.evaluate(() => {
    const dimensions = element => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };
    const style = element => {
      const computed = getComputedStyle(element);
      return Object.fromEntries(['transform', 'transition', 'animation', 'perspective', 'transform-style', 'backface-visibility', 'object-fit', 'overflow', 'aspect-ratio'].map(property => [property, computed.getPropertyValue(property)]));
    };
    const tags = [...document.querySelectorAll('.toolkit-tags .tech-tag')].map(tag => {
      const box = tag.getBoundingClientRect();
      const textRange = document.createRange();
      textRange.selectNodeContents(tag);
      const text = textRange.getBoundingClientRect();
      const ancestors = [];
      for (let node = tag; node; node = node.parentElement) {
        const computed = getComputedStyle(node);
        if (!/(hidden|clip|scroll|auto)/.test(`${computed.overflowX} ${computed.overflowY}`)) continue;
        const parent = node.getBoundingClientRect();
        ancestors.push({ classes: node.className, self: node === tag, overflow: computed.overflow,
          clipsText: text.left < parent.left - 1 || text.right > parent.right + 1 || text.top < parent.top - 1 || text.bottom > parent.bottom + 1,
          clipsBorder: box.left < parent.left - 1 || box.right > parent.right + 1 || box.top < parent.top - 1 || box.bottom > parent.bottom + 1 });
      }
      return { text: tag.textContent.trim(), box: dimensions(tag), styles: style(tag), ancestors,
        pseudoBefore: getComputedStyle(tag, '::before').inset };
    });
    return {
      width: innerWidth, horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      tags, activeTag: document.activeElement?.textContent.trim(),
      fonts: { sora: document.fonts.check('600 16px Sora'), body: document.fonts.check('400 16px "Source Sans 3"') },
      track: style(document.querySelector('.ecpc-slider-track')),
      stage: style(document.querySelector('.ecpc-deck-stage')),
      dormantHooks: Object.fromEntries(['[data-count]', '.skill-bar-fill', '#ctaButton', '.trust-panel', '.role-signature', '.timeline-card', '.about-story-card'].map(selector => [selector, document.querySelectorAll(selector).length])),
      photos: [...document.querySelectorAll('.flip-card-image, .depi-progress-icon img')].map(image => ({
        source: image.getAttribute('src'), natural: [image.naturalWidth, image.naturalHeight],
        width: image.offsetWidth, height: image.offsetHeight, styles: style(image),
        frameWidth: image.closest('[data-flip-card]').offsetWidth,
        frameHeight: image.closest('[data-flip-card]').offsetHeight
      }))
    };
  });
}

(async () => {
  const server = await require('./qa-server.cjs').startServer();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const route of routes) for (const theme of ['dark', 'light']) {
      const file = path.join(output, `${route}-${theme}-live-layout.json`);
      if (fs.existsSync(file) && !process.env.QA_FORCE) continue;
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: theme });
      await context.addInitScript(theme => localStorage.setItem('portfolio-theme', theme), theme);
      const page = await context.newPage();
      await page.goto(`${server.origin}/${route === 'main' ? '' : `${route}/`}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('.toolkit-tags .tech-tag'));
      await page.evaluate(() => document.fonts.ready);
      const results = [];
      for (const width of widths) {
        await page.setViewportSize({ width, height: 1000 });
        await page.locator('.toolkit-panel').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.mouse.move(0, 0);
        await page.waitForTimeout(750);
        const rest = await readLayout(page);
        if ([390,1440].includes(width) && ['main','AI'].includes(route)) {
          await page.screenshot({ path: path.join(output, `${route}-${width}-${theme}-tools.png`) });
        }
        const interactions = [];
        for (const tag of await page.locator('.toolkit-tags .tech-tag').all()) {
          await tag.hover({ force: true });
          await page.waitForTimeout(200);
          const hover = await readLayout(page);
          // Tags are spans at baseline. Temporarily add tabindex only in the
          // isolated test page, to inspect the focus-visible treatment.
          await tag.evaluate(element => { element.tabIndex = 0; element.focus(); });
          await page.keyboard.press('Tab');
          await page.keyboard.press('Shift+Tab');
          const focus = await readLayout(page);
          interactions.push({ name: await tag.textContent(), hover: hover.tags, focus: focus.tags });
        }
        results.push({ width, rest, interactions });
        console.log(`${stage} tools ${route}/${theme}/${width}: ${rest.tags.length} tags`);
      }
      fs.writeFileSync(file, JSON.stringify(results, null, 2));
      const clipped = results.flatMap(row => [row.rest.tags, ...row.interactions.flatMap(state => [state.hover,state.focus])]
        .flat().filter(tag => tag.ancestors.some(ancestor => ancestor.clipsText || ancestor.clipsBorder)));
      if (clipped.length) throw new Error(`${route}/${theme}: ${clipped.length} clipped tag states`);
      await context.close();
    }
  } finally { await browser.close(); await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
