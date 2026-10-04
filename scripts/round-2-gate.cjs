/* Verify completeness of the immutable Round 2 baseline before source edits. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve('.baseline/round-2');
const baseline = path.join(root, 'baseline');
const sourceFiles = ['index.html', 'home.html', ...['AI', 'ML', 'DS', 'DA', 'DE'].map(role => `${role}/index.html`),
  ...['css', 'js'].flatMap(directory => fs.readdirSync(directory).filter(file => /\.(css|js)$/.test(file)).map(file => `${directory}/${file}`))];
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

if (process.argv[2] === 'lock') {
  const lockFile = path.join(root, 'source-lock.json');
  if (fs.existsSync(lockFile)) throw new Error('Source lock already exists; do not overwrite the baseline.');
  const old = path.join(root, 'pre-overhaul');
  fs.mkdirSync(old, { recursive: true });
  for (const file of ['index.html', 'css/style.css', 'css/design-system.css', 'js/portfolio-components.js', 'js/role-page.js']) {
    fs.writeFileSync(path.join(old, file.replaceAll('/', '--')), execFileSync('git', ['show', `658dea7:${file}`]));
  }
  fs.writeFileSync(lockFile, JSON.stringify(Object.fromEntries(sourceFiles.map(file => [file, hash(file)])), null, 2));
  console.log(`Locked ${sourceFiles.length} production source files and archived pre-overhaul sources.`);
} else {
  const issues = [];
  let combinations = 0, screenshots = 0, states = 0, resizeViews = 0;
  for (const route of ['main', 'AI']) for (const width of [360, 390, 768, 1024, 1280, 1440, 1920, 2560]) for (const theme of ['dark', 'light']) {
    const name = `${route}-${width}-${theme}`;
    const file = path.join(baseline, `${name}.json`);
    if (!fs.existsSync(file)) { issues.push(`${name}: missing capture`); continue; }
    const result = JSON.parse(fs.readFileSync(file));
    combinations++;
    if (Object.keys(result.tokens).length < 160) issues.push(`${name}: incomplete CSS tokens or external CSS failed`);
    if (Object.keys(result.styles).length !== 18) issues.push(`${name}: missing flip states`);
    states += Object.keys(result.styles).length;
    for (const shot of result.shots) {
      if (!fs.existsSync(path.join(baseline, shot))) issues.push(`${name}: missing screenshot ${shot}`);
      else screenshots++;
    }
    if (result.shots.length !== 17) issues.push(`${name}: incomplete screenshot set`);
    if (!fs.existsSync(path.join(baseline, `${name}-tools.png`))) issues.push(`${name}: missing tools screenshot`);
    else screenshots++;
    if (!fs.existsSync(path.join(baseline, `${name}-coverage.json`))) issues.push(`${name}: missing CSS coverage`);
    for (const image of result.metrics.images) if (!image.natural.every(value => value > 0)) issues.push(`${name}: unloaded image ${image.source}`);
    // HTMLMediaElement cancels its first preload request when the loop is set up.
    // Keep this event in the raw log; it is not a missing/failed audio asset.
    for (const issue of result.issues) if (!(issue.type === 'requestfailed' && issue.message === 'net::ERR_ABORTED' && issue.url.endsWith('/sounds/ambience.mp3'))) issues.push(`${name}: ${JSON.stringify(issue)}`);
  }
  for (const route of ['main', 'AI']) for (const theme of ['dark', 'light']) {
    const file = path.join(baseline, `${route}-${theme}-live-layout.json`);
    if (!fs.existsSync(file)) { issues.push(`${route}/${theme}: missing live resize evidence`); continue; }
    const rows = JSON.parse(fs.readFileSync(file));
    resizeViews += rows.length;
    if (rows.length !== 9) issues.push(`${route}/${theme}: incomplete resize sweep`);
    for (const row of rows) {
      if (!row.rest.fonts.sora || !row.rest.fonts.body) issues.push(`${route}/${theme}/${row.width}: fonts did not load`);
      if (row.interactions.length !== (route === 'main' ? 12 : 8)) issues.push(`${route}/${theme}/${row.width}: incomplete tag interaction capture`);
    }
  }
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'source-lock.json')));
  const sourceChanges = Object.entries(lock).filter(([file, before]) => hash(file) !== before).map(([file]) => file);
  if (sourceChanges.length) issues.push(`Production source changed before Phase 0 passed: ${sourceChanges.join(', ')}`);
  const result = { pass: !issues.length, combinations, screenshots, states, resizeViews, sourceChanges, issues };
  fs.writeFileSync(path.join(root, 'phase-0-gate.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = issues.length ? 1 : 0;
}
