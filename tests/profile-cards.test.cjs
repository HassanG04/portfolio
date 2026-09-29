const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const context = { window: {} };
for (const file of ['portfolio-data.js', 'portfolio-components.js']) {
  runInNewContext(readFileSync(join(__dirname, '../js', file), 'utf8'), context);
}
const markup = context.window.PORTFOLIO_COMPONENTS.renderActivity();

test('all teammates and instructors share the ID card component', () => {
  assert.equal((markup.match(/class="profile-id-card/g) || []).length, 8);
  assert.equal((markup.match(/class="profile-id-avatar"/g) || []).length, 8);
  assert.equal((markup.match(/class="profile-return /g) || []).length, 5);
  assert.ok(!markup.includes('hadeer-makhlouf.jpeg'), 'Do not reuse a person’s photo for unrelated teammates');
});

test('only provided LinkedIn profiles are links', () => {
  assert.equal((markup.match(/<a class="profile-id-card/g) || []).length, 3);
  assert.equal((markup.match(/<div class="profile-id-card/g) || []).length, 5);
  for (const slug of ['yaseen-moataz-49b39b308', 'mohammed-hamed-b81064195', 'hadeermakhlouf']) {
    assert.ok(markup.includes(`https://www.linkedin.com/in/${slug}/`));
  }
});

test('the shared activity renders on profession routes with correct photo paths', () => {
  const roleMarkup = context.window.PORTFOLIO_COMPONENTS.renderActivity('../');
  assert.ok(roleMarkup.includes('src="../images/ECPC1.jpg"'));
  assert.ok(roleMarkup.includes('src="../images/softskills.jpeg"'));
  assert.ok(roleMarkup.includes('profile-id-back'));
});

test('freelance buttons expose only confirmed public profile URLs', () => {
  const links = context.window.PORTFOLIO_COMPONENTS.renderFreelanceLinks();
  assert.ok(links.includes('https://www.upwork.com/freelancers/~01a4a740c603955a24/'));
  assert.ok(links.includes('https://khamsat.com/user/hassan_g04'));
  assert.ok(!links.includes('mostaql.com'));
});

test('hero buttons are icon-only with accessible names and hover labels', () => {
  const links = context.window.PORTFOLIO_COMPONENTS.renderFreelanceLinks({ variant: 'social' });
  assert.equal((links.match(/class="social-btn /g) || []).length, 2);
  assert.equal((links.match(/interactable/g) || []).length, 2);
  assert.equal((links.match(/rel="noopener noreferrer"/g) || []).length, 2);
  assert.ok(links.includes('class="fa-brands fa-upwork"'));
  assert.ok(links.includes('src="images/khamsat-icon.png" alt=""'));
  for (const label of ['Upwork', 'Khamsat']) {
    assert.ok(links.includes(`title="${label}"`));
    assert.ok(links.includes(`aria-label="Open Hassan's ${label} profile (new tab)"`));
    assert.ok(!links.includes(`>${label}<`));
  }
  assert.ok(!links.includes('fa-arrow-up-right-from-square'));
});

test('contact uses matching compact icons and role pages resolve the local icon', () => {
  const links = context.window.PORTFOLIO_COMPONENTS.renderFreelanceLinks({ assetRoot: '../' });
  assert.equal((links.match(/class="social-btn /g) || []).length, 2);
  assert.ok(links.includes('src="../images/khamsat-icon.png"'));
  assert.ok(!links.includes('btn-glass'));
});

test('main page inserts freelance links immediately after LinkedIn in both locations', () => {
  const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
  const slots = new Map();
  const mainContext = { window: context.window, document: {
    querySelector(selector) {
      const slot = { innerHTML: '' };
      slots.set(selector, slot);
      return slot;
    }
  } };
  runInNewContext(readFileSync(join(__dirname, '../js/main-page.js'), 'utf8'), mainContext);
  for (const name of ['hero-freelance-links', 'freelance-links']) {
    assert.match(html, new RegExp(`</a>\\s*<span class="freelance-links-slot" data-portfolio-render="${name}"`));
    assert.ok(slots.get(`[data-portfolio-render="${name}"]`).innerHTML.includes('khamsat.com/user/hassan_g04'));
  }
});

for (const role of ['AI', 'ML', 'DS', 'DA', 'DE']) {
  test(`${role} places both freelance profiles beside LinkedIn in hero and contact`, () => {
    const root = { innerHTML: '' };
    runInNewContext(readFileSync(join(__dirname, '../js/role-page.js'), 'utf8'), {
      window: context.window,
      document: {
        body: { dataset: { role } },
        getElementById: () => root,
        querySelectorAll: () => []
      }
    });
    for (const url of context.window.PORTFOLIO_DATA.shared.freelanceProfiles.map(profile => profile.url)) {
      assert.equal(root.innerHTML.split(`href="${url}"`).length - 1, 2);
    }
    assert.match(root.innerHTML, /aria-label="LinkedIn"><i[^>]+><\/i><\/a><a class="social-btn freelance-profile-link/);
    assert.match(root.innerHTML, /Discuss a Project<\/a><a class="social-btn freelance-profile-link/);
    assert.equal(root.innerHTML.split('src="../images/khamsat-icon.png"').length - 1, 2);
  });
}
