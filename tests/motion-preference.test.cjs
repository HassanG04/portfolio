const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '../js/motion-preference.js'), 'utf8');

function setup({ urlParam = null, cookie = '', reduced = false, throwCookie = false } = {}) {
  const root = { dataset: {} };
  let onChange;
  const preference = { matches: reduced, addEventListener: (event, callback) => { if (event === 'change') onChange = callback; } };
  let currentCookie = cookie;
  const env = {
    window: { 
      matchMedia: () => preference,
      location: { search: urlParam ? `?motion=${urlParam}` : '' },
      __portfolioMotion: undefined
    },
    document: {
      documentElement: root,
      get cookie() {
        if (throwCookie) throw new Error('Blocked');
        return currentCookie;
      },
      set cookie(val) {
        if (throwCookie) throw new Error('Blocked');
        currentCookie = val;
      }
    },
    URLSearchParams: class {
      constructor(str) { this.str = str; }
      get(key) { 
        if (this.str.includes(`${key}=full`)) return 'full';
        if (this.str.includes(`${key}=calm`)) return 'calm';
        if (this.str.includes(`${key}=invalid`)) return 'invalid';
        return null;
      }
    }
  };
  runInNewContext(source, env);
  return { 
    root, 
    env,
    getCookie: () => currentCookie,
    changeOS(reduce) { preference.matches = reduce; onChange(); } 
  };
}

test('animations start full by default', () => {
  const site = setup();
  assert.equal(site.root.dataset.motion, 'full');
});

test('OS prefers-reduced-motion applies calm tier', () => {
  assert.equal(setup({ reduced: true }).root.dataset.motion, 'calm');
});

test('cookie overrides OS preference', () => {
  const site = setup({ cookie: 'portfolio_motion_v1=full', reduced: true });
  assert.equal(site.root.dataset.motion, 'full');
});

test('URL parameter overrides cookie and OS, and sets cookie', () => {
  const site = setup({ urlParam: 'calm', cookie: 'portfolio_motion_v1=full', reduced: false });
  assert.equal(site.root.dataset.motion, 'calm');
  assert.match(site.getCookie(), /portfolio_motion_v1=calm/);
});

test('invalid cookie or URL parameter falls back to OS', () => {
  assert.equal(setup({ cookie: 'portfolio_motion_v1=invalid', reduced: true }).root.dataset.motion, 'calm');
  assert.equal(setup({ urlParam: 'invalid', cookie: 'portfolio_motion_v1=invalid', reduced: false }).root.dataset.motion, 'full');
});

test('OS preference change applies live only if user has not set a preference', () => {
  const site1 = setup({ reduced: false });
  site1.changeOS(true);
  assert.equal(site1.root.dataset.motion, 'calm'); // applied

  const site2 = setup({ cookie: 'portfolio_motion_v1=full', reduced: false });
  site2.changeOS(true);
  assert.equal(site2.root.dataset.motion, 'full'); // ignored user choice
});

test('toggle object is exposed and works', () => {
  const site = setup();
  const api = site.env.window.__portfolioMotion;
  assert.equal(api.tier, 'full');
  
  api.toggle();
  assert.equal(site.root.dataset.motion, 'calm');
  assert.match(site.getCookie(), /portfolio_motion_v1=calm/);

  api.set('full');
  assert.equal(site.root.dataset.motion, 'full');
});

test('animations do not depend on cookie access', () => {
  assert.equal(setup({ throwCookie: true }).root.dataset.motion, 'full');
});

test('every portfolio loads the shared motion initializer before styles', () => {
  for (const page of ['index.html', ...['AI', 'ML', 'DS', 'DA', 'DE'].map(role => `${role}/index.html`)]) {
    const html = readFileSync(join(__dirname, '..', page), 'utf8');
    assert.ok(html.includes('js/motion-preference.js'));
    assert.ok(html.indexOf('js/motion-preference.js') < html.indexOf('css/tokens-base.css'));
  }
});
