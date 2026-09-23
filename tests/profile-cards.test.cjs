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
