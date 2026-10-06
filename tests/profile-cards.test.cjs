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
  assert.equal(markup.split('hadeer-makhlouf.jpeg').length - 1, 1, 'Only Hadeer’s own badge uses her portrait');
});

test('only provided LinkedIn profiles are links', () => {
  assert.equal((markup.match(/<a class="profile-id-card/g) || []).length, 3);
  assert.equal((markup.match(/<div class="profile-id-card/g) || []).length, 5);
  for (const slug of ['yaseen-moataz-49b39b308', 'mohammed-hamed-b81064195', 'hadeermakhlouf']) {
    assert.ok(markup.includes(`https://www.linkedin.com/in/${slug}/`));
  }
});

test('missing person photos use initials and only the pre-existing instructor image is used', () => {
  assert.ok(markup.includes('<span aria-hidden="true">AB</span>'));
  assert.ok(markup.includes('<span aria-hidden="true">MH</span>'));
  assert.ok(!markup.includes('class="fas fa-user"'));
  const avatars = [...markup.matchAll(/class="profile-id-avatar">([\s\S]*?)<\/span>/g)];
  assert.equal(avatars.filter(match => match[1].includes('<img ')).length, 1);
  assert.ok(avatars.find(match => match[1].includes('<img '))[1].includes('hadeer-makhlouf.jpeg'));
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
  assert.ok(links.includes('https://www.fiverr.com/hassan_g04'));
  assert.ok(!links.includes('mostaql.com'));
});

test('hero buttons are icon-only with accessible names and hover labels', () => {
  const links = context.window.PORTFOLIO_COMPONENTS.renderFreelanceLinks({ variant: 'social' });
  assert.equal((links.match(/class="social-btn /g) || []).length, 3);
  assert.equal((links.match(/interactable/g) || []).length, 3);
  assert.equal((links.match(/rel="noopener noreferrer"/g) || []).length, 3);
  assert.ok(links.includes('class="fa-brands fa-upwork"'));
  assert.ok(links.includes('src="images/fiverr-icon.png" alt=""'));
  assert.ok(!links.includes('fa-fiverr'), 'Fiverr has no glyph in the loaded icon font');
  assert.ok(links.includes('src="images/khamsat-icon.png" alt=""'));
  for (const label of ['Upwork', 'Khamsat', 'Fiverr']) {
    assert.ok(links.includes(`title="${label}"`));
    assert.ok(links.includes(`aria-label="Open Hassan's ${label} profile (new tab)"`));
    assert.ok(!links.includes(`>${label}<`));
  }
  assert.ok(!links.includes('fa-arrow-up-right-from-square'));
});

test('shared renderer resolves local profile icons from profession routes', () => {
  const links = context.window.PORTFOLIO_COMPONENTS.renderFreelanceLinks({ assetRoot: '../' });
  assert.equal((links.match(/class="social-btn /g) || []).length, 3);
  assert.ok(links.includes('src="../images/khamsat-icon.png"'));
  assert.ok(links.includes('src="../images/fiverr-icon.png"'));
  assert.ok(!links.includes('btn-glass'));
});

test('main page inserts freelance links immediately after LinkedIn in the hero only', () => {
  const root = { innerHTML:'' };
  const mainContext = { window: context.window, document: {
    getElementById: () => root
  } };
  runInNewContext(readFileSync(join(__dirname, '../js/main-page.js'), 'utf8'), mainContext);
  assert.match(root.innerHTML, /<a href="https:\/\/www\.linkedin\.com[^>]+>[\s\S]*?<\/a>\s*<span class="freelance-links-slot" data-portfolio-render="hero-freelance-links"/);
  assert.ok(root.innerHTML.includes('khamsat.com/user/hassan_g04'));
  assert.doesNotMatch(root.innerHTML, /data-portfolio-render="freelance-links"/);
});

for (const role of ['AI', 'ML', 'DS', 'DA', 'DE']) {
  test(`${role} places all freelance profiles beside LinkedIn in the hero only`, () => {
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
      assert.equal(root.innerHTML.split(`href="${url}"`).length - 1, 1);
    }
    assert.match(root.innerHTML, /aria-label="LinkedIn"><i[^>]+><\/i><\/a><span class="freelance-links-slot"[^>]+><a class="social-btn freelance-profile-link/);
    assert.doesNotMatch(root.innerHTML, /Discuss a Project<\/a><a class="social-btn freelance-profile-link/);
    assert.equal(root.innerHTML.split('src="../images/khamsat-icon.png"').length - 1, 1);
    assert.equal(root.innerHTML.split('src="../images/fiverr-icon.png"').length - 1, 1);
  });
}

test('general portfolio uses its new title and resume at both entry points', () => {
  const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
  assert.ok(html.includes('<title>Hassan Gebril | AI Engineer | Models to software</title>'));
  const resume = 'https://drive.google.com/file/d/1ej3BehMnJGrt4uYgD0utkQDmA8SbthKs/view?usp=drive_link';
  assert.equal(context.window.PORTFOLIO_COMPONENTS.renderPage().split(`href="${resume}"`).length - 1, 2);
  assert.ok(!html.includes('1OtvoA3evwZXAcb-kifyhtX20TDkF-zF1'));
});
