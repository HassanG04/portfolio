const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const context = { window: {} };
vm.runInNewContext(source('js/portfolio-data.js'), context);
vm.runInNewContext(source('js/portfolio-components.js'), context);

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
