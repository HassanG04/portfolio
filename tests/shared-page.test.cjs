const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname,'..');
const source = name => fs.readFileSync(path.join(root,name),'utf8');
const context = {window:{}};
for (const name of ['portfolio-data','portfolio-components']) vm.runInNewContext(source(`js/${name}.js`),context);

test('both entry points delegate every section to the same renderer',()=>{
  for(const entry of ['main-page','role-page']){
    assert.match(source(`js/${entry}.js`),/components.renderPage\(/);
    assert.doesNotMatch(source(`js/${entry}.js`),/<(?:header|section|footer|main)\b/);
  }
  for(const role of ['MAIN','AI','ML','DS','DA','DE']){
    const page=context.window.PORTFOLIO_COMPONENTS.renderPage(role,role==='MAIN'?'':'../');
    for(const id of ['home','about','services','activity','accomplishments','contact','ecpcDeck','certificateViewer'])
      assert.equal(page.split(`id="${id}"`).length-1,1,`${role}/${id}`);
  }
});

test('role shells differ only in their metadata and role key',()=>{
  const normalize=html=>html.replace(/<title>.*?<\/title>/g,'').replace(/<meta[^>]+>/g,'').replace(/<link rel="canonical"[^>]+>/g,'').replace(/data-role="[A-Z]+"/,'data-role="ROLE"');
  const base=normalize(source('AI/index.html'));
  for(const role of ['ML','DS','DA','DE']) assert.equal(normalize(source(`${role}/index.html`)),base,role);
});

test('people references resolve locally and only the original instructor has an image',()=>{
  const {people,activity,shared}=context.window.PORTFOLIO_DATA;
  for(const id of [...activity.ecpc.flatMap(slide=>slide.teammates),activity.depi.instructor,activity.softSkills.instructor]){
    assert.equal(people[id].id,id);assert.ok(people[id].name);
  }
  assert.deepEqual(Object.values(people).filter(p=>p.image).map(p=>p.image),['hadeer-makhlouf.jpeg']);
  assert.equal(shared.about.intro,shared.usp);
});
