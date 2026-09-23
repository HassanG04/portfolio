const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '../js/motion-preference.js'), 'utf8');

function setup({ reduced = false, saved = null, storageBlocked = false } = {}) {
  const root = { dataset: {} };
  const children = {};
  const attributes = {};
  const listeners = {};
  const button = {
    setAttribute: (key, value) => { attributes[key] = value; },
    querySelector: key => children[key] ||= {},
    addEventListener: (event, callback) => { listeners[event] = callback; }
  };
  let ready;
  let onSystemChange;
  let stored = saved;
  let mounted = false;
  const media = {
    matches: reduced,
    addEventListener: (_, callback) => { onSystemChange = callback; }
  };
  runInNewContext(source, {
    window: { matchMedia: () => media },
    document: {
      documentElement: root,
      addEventListener: (_, callback) => { ready = callback; },
      getElementById: () => ({ append: () => { mounted = true; } }),
      createElement: () => button
    },
    localStorage: {
      getItem: () => { if (storageBlocked) throw new Error('Blocked'); return stored; },
      setItem: (_, value) => { if (storageBlocked) throw new Error('Blocked'); stored = value; }
    }
  });
  return {
    root, attributes, children,
    ready: () => ready(),
    click: () => listeners.click(),
    stored: () => stored,
    mounted: () => mounted,
    systemChange: reduced => { media.matches = reduced; onSystemChange(); }
  };
}

test('enables animations by default, including on reduced-motion systems', () => {
  const site = setup({ reduced: true });
  assert.equal(site.root.dataset.motion, 'full');
  site.ready();
  assert.equal(site.mounted(), true);
  assert.equal(site.attributes['aria-label'], 'Reduce animations');
  assert.equal(site.attributes['aria-pressed'], 'true');
});

test('a saved full-motion choice overrides system reduction on every page', () => {
  const site = setup({ reduced: true, saved: 'full' });
  assert.equal(site.root.dataset.motion, 'full');
  site.ready();
  assert.equal(site.attributes['aria-label'], 'Reduce animations');
  assert.equal(site.root.dataset.motion, 'full');
});

test('toggle saves both choices and survives a reload', () => {
  const site = setup({ saved: 'reduced' });
  site.ready();
  site.click();
  assert.equal(site.root.dataset.motion, 'full');
  assert.equal(site.stored(), 'full');
  assert.equal(setup({ reduced: true, saved: site.stored() }).root.dataset.motion, 'full');
  site.click();
  assert.equal(site.root.dataset.motion, 'reduced');
  assert.equal(site.stored(), 'reduced');
});

test('respects a saved reduced-motion choice', () => {
  const site = setup({ saved: 'reduced' });
  site.ready();
  assert.equal(site.root.dataset.motion, 'reduced');
  assert.equal(site.attributes['aria-label'], 'Enable animations');
  site.click();
  assert.equal(site.root.dataset.motion, 'full');
});

test('controls still work when browser storage is blocked', () => {
  const site = setup({ reduced: true, storageBlocked: true });
  site.ready();
  site.click();
  assert.equal(site.root.dataset.motion, 'reduced');
  site.click();
  assert.equal(site.root.dataset.motion, 'full');
});

test('ignores invalid saved values', () => {
  assert.equal(setup({ saved: 'invalid', reduced: true }).root.dataset.motion, 'full');
});
