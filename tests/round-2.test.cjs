const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const context = { window: {} };
vm.runInNewContext(source('js/portfolio-data.js'), context);
vm.runInNewContext(source('js/portfolio-components.js'), context);

test('all six pages load the portrait and inspector controllers once', () => {
  for (const file of ['index.html', ...['AI','ML','DS','DA','DE'].map(role => `${role}/index.html`)]) {
    for (const name of ['interactive-motion', 'certificate-inspector']) assert.equal(source(file).split(`${name}.js?v=`).length - 1, 1, file);
  }
  assert.equal((source('js/script.js').match(/addEventListener\('pointermove'/g) || []).length, 1);
  assert.doesNotMatch(source('js/interactive-motion.js') + source('js/certificate-inspector.js'), /addEventListener\('pointermove'/);
});

test('media dimensions and accessible teammate controls come from shared data', () => {
  const data=context.window.PORTFOLIO_DATA, markup=context.window.PORTFOLIO_COMPONENTS.renderActivity();
  assert.equal(data.activity.depi.imageWidth,225);
  assert.equal(data.activity.softSkills.imageWidth/data.activity.softSkills.imageHeight,16/9);
  assert.equal((markup.match(/data-profile-deck/g)||[]).length,3);
  assert.equal((markup.match(/is-current-profile/g)||[]).length,3);
  assert.equal((markup.match(/aria-label="Next teammate"/g)||[]).length,3);
  assert.doesNotMatch(markup, /<div class="profile-id-card[^>]+(?:href|role="button")/);
});

test('the formula strip and its animation are removed at their source', () => {
  for (const file of ['index.html', 'js/main-page.js', 'js/role-page.js', 'js/portfolio-components.js', 'css/editorial.css']) {
    assert.doesNotMatch(source(file), /renderTechnicalSignature|hero-signature-slot|delivery-signature|delivery-trace/, file);
  }
});

test('the old About portrait structure is shared by main and specialist pages', () => {
  for (const role of ['MAIN', 'AI', 'ML', 'DS', 'DA', 'DE']) {
    const markup = context.window.PORTFOLIO_COMPONENTS.renderAbout(role, role === 'MAIN' ? '' : '../');
    assert.match(markup, /about-profile-panel[^>]*><div class="profile-image-wrapper"><img[^>]+class="profile-image"/);
    assert.doesNotMatch(markup, /about-portrait/);
  }
  const css = source('css/editorial.css');
  assert.equal((css.match(/@keyframes rotate-ring/g) || []).length, 1);
  assert.equal((css.match(/@keyframes pulse-glow/g) || []).length, 1);
});

test('general identity is AI Engineer and the honest scope stays explicit', () => {
  const { shared, professions } = context.window.PORTFOLIO_DATA;
  assert.equal(shared.identity, 'AI Engineer');
  assert.match(shared.usp, /I build AI models/);
  assert.match(shared.usp, /held-out evaluation and passing tests support/);
  assert.match(professions.AI.description, /I build AI models/);
  assert.equal(professions.ML.label, 'ML Engineer');
  assert.match(source('index.html'), /data-words="AI Engineering\|/);
});

test('every entry point has consistent identity and social image descriptions', () => {
  for (const file of ['index.html', 'home.html', ...['AI', 'ML', 'DS', 'DA', 'DE'].map(role => `${role}/index.html`)]) {
    const html = source(file);
    assert.match(html, /<title>Hassan Gebril[^<]*AI Engineer[^<]*<\/title>/, file);
    assert.match(html, /property="og:image:alt"[^>]+AI [Ee]ngineer/, file);
    assert.match(html, /name="twitter:image:alt"[^>]+AI [Ee]ngineer/, file);
    assert.doesNotMatch(html, /(?:og:title|twitter:title)[^>]*Machine Learning Engineer/, file);
  }
});

test('carousel drag shares the pointer stream and does not cancel capture transferred from a photo', () => {
  const js = source('js/script.js');
  assert.equal((js.match(/addEventListener\('pointermove'/g) || []).length, 1);
  assert.match(js, /if \(event\.target === stage\) finishEcpcDrag\(event, true\)/);
  assert.match(js, /document\.addEventListener\('pointerup', event => finishEcpcDrag\(event\)\)/);
  assert.match(js, /reducedCarouselMotion\.matches \|\| performance\.now\(\) - gesture\.lastAt > 100 \? 0/);
  assert.doesNotMatch(js, /stage\.addEventListener\('touch(?:start|move|end)'/);
});

test('focused visual pass removes decorative labels and portrait caption without replacing fonts', () => {
  assert.doesNotMatch(context.window.PORTFOLIO_COMPONENTS.renderPortrait(), /figcaption|Based in/);
  for (const file of ['index.html','js/role-page.js','js/portfolio-components.js']) {
    assert.doesNotMatch(source(file), /class="(?:section-tag|ecpc-chapter|depi-progress-eyebrow)"/, file);
  }
  assert.doesNotMatch(source('css/style.css'), /(?:section-tag|ecpc-chapter|depi-progress-eyebrow)::before/);
  assert.doesNotMatch(source('css/editorial.css'), /hero-portrait figcaption/);
  const redesign = source('css/redesign.css');
  assert.doesNotMatch(redesign, /font|--[\w-]+\s*:/);
  assert.match(redesign, /width:36px/);
  for (const file of ['index.html', ...['AI','ML','DS','DA','DE'].map(role => `${role}/index.html`)]) {
    const html=source(file);
    assert.match(html, /family=Sora[^"\n]+family=Source\+Sans\+3/);
    assert.equal((html.match(/css\/redesign\.css\?v=/g)||[]).length,1);
  }
});
