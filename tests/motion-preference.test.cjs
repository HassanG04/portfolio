const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '../js/motion-preference.js'), 'utf8');

function setup({ saved = null, reduced = false, storageBlocked = false } = {}) {
  const root = { dataset: {} };
  let created = false;
  let onChange;
  const preference = { matches: reduced, addEventListener: (event, callback) => { if (event === 'change') onChange = callback; } };
  runInNewContext(source, {
    window: { matchMedia: () => preference },
    document: {
      documentElement: root,
      createElement: () => { created = true; }
    },
    localStorage: {
      getItem: () => { if (storageBlocked) throw new Error('Blocked'); return saved; }
    }
  });
  return { root, created, change(reduce) { preference.matches = reduce; onChange(); } };
}

test('animations start enabled and no settings control is created', () => {
  const site = setup();
  assert.equal(site.root.dataset.motion, 'full');
  assert.equal(site.created, false);
  assert.doesNotMatch(source, /motionPreferenceToggle|DOMContentLoaded/);
});

test('the OS preference takes priority over any stale removed setting', () => {
  for (const saved of ['full', 'reduced', 'invalid']) {
    assert.equal(setup({ saved, reduced: true }).root.dataset.motion, 'reduced');
    assert.equal(setup({ saved, reduced: false }).root.dataset.motion, 'full');
  }
});

test('OS motion preference changes apply while the page is open', () => {
  const site = setup();
  site.change(true);
  assert.equal(site.root.dataset.motion, 'reduced');
  site.change(false);
  assert.equal(site.root.dataset.motion, 'full');
});

test('animations do not depend on browser storage access', () => {
  assert.equal(setup({ storageBlocked: true }).root.dataset.motion, 'full');
});

test('every portfolio loads the shared motion initializer before styles', () => {
  for (const page of ['index.html', ...['AI', 'ML', 'DS', 'DA', 'DE'].map(role => `${role}/index.html`)]) {
    const html = readFileSync(join(__dirname, '..', page), 'utf8');
    assert.ok(html.includes('js/motion-preference.js'));
    assert.ok(html.indexOf('js/motion-preference.js') < html.indexOf('css/tokens-base.css'));
    assert.doesNotMatch(html, /motionPreferenceToggle/);
  }
});
