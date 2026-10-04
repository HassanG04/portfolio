/* Exact computed contract comparison, not selector-order or text comparison.
 * Usage: node scripts/compare-round-2.cjs phase-1
 */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('.baseline/round-2');
const after = process.argv[2];
if (!after || after === 'baseline') throw new Error('Specify a post-change capture directory.');
const baseline = path.join(root, 'baseline');
const output = path.join(root, after);
const selectedWidths = (process.env.QA_WIDTHS || '').split(',').filter(Boolean).map(Number);
const differences = [];
let views = 0, tokens = 0, flipStates = 0;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function compareObject(before, current, location) {
  for (const key of new Set([...Object.keys(before), ...Object.keys(current)])) {
    if (before[key] !== current[key]) differences.push({ location: `${location}/${key}`, before: before[key], after: current[key] });
  }
}
for (const file of fs.readdirSync(baseline).filter(file => /^(main|AI)-\d+-(dark|light)\.json$/.test(file))) {
  if (selectedWidths.length && !selectedWidths.includes(Number(file.split('-')[1]))) continue;
  const currentFile = path.join(output, file);
  if (!fs.existsSync(currentFile)) { differences.push({ location: file, error: 'Missing post-change capture' }); continue; }
  const before = read(path.join(baseline, file));
  const current = read(currentFile);
  compareObject(before.tokens, current.tokens, `${file}/root`);
  tokens += Object.keys(before.tokens).length;
  for (const [state, elements] of Object.entries(before.styles)) {
    const currentElements = current.styles[state];
    if (!currentElements || elements.length !== currentElements.length) {
      differences.push({ location: `${file}/${state}`, error: 'Missing or extra flip elements' });
      continue;
    }
    elements.forEach((element, index) => compareObject(element.styles, currentElements[index].styles, `${file}/${state}/${index}`));
    flipStates++;
  }
  views++;
}
for (const route of ['main', 'AI']) for (const theme of ['dark', 'light']) {
  const file = `${route}-${theme}-live-layout.json`;
  if (!fs.existsSync(path.join(output, file))) { differences.push({ location: file, error: 'Missing carousel transition capture' }); continue; }
  const before = read(path.join(baseline, file));
  const current = read(path.join(output, file));
  for (const row of before) {
    const next = current.find(item => item.width === row.width);
    if (!next) { differences.push({ location: `${file}/${row.width}`, error: 'Missing viewport' }); continue; }
    // Pixel track translations change with intentional image/grid geometry.
    // Its transition timing/easing must remain exact outside a live drag.
    for (const target of ['track', 'stage']) for (const property of ['transition', 'animation', 'perspective', 'transform-style', 'backface-visibility']) {
      compareObject({ [property]: row.rest[target][property] }, { [property]: next.rest[target][property] }, `${file}/${row.width}/${target}`);
    }
  }
}
const result = { pass: !differences.length, views, tokens, flipStates, differences };
fs.writeFileSync(path.join(root, `${after}-contract-diff.json`), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
process.exitCode = differences.length ? 1 : 0;
