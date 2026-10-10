import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function loadData(relativePath) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  // These source modules contain local data or a pure formatter; type imports are erased.
  vm.runInNewContext(code, { exports }, { filename: relativePath });
  return exports;
}
const { STUDY_PLAN } = loadData('src/data/study-plan.ts');
const { formatStudyPlan } = loadData('src/lib/study-plan-export.ts');
const guides = {};
for (const filename of fs.readdirSync(path.join(root, 'src/data/topics')).sort()) {
  for (const topics of Object.values(loadData(`src/data/topics/${filename}`))) {
    for (const topic of topics) guides[topic.id] = { title: topic.title, path: `/topics/${topic.slug}` };
  }
}
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/platform-engineering-study-plan.txt'), formatStudyPlan(STUDY_PLAN, guides));
console.log(`Exported ${STUDY_PLAN.stages.length} stages and ${STUDY_PLAN.stages.reduce((sum, stage) => sum + stage.modules.length, 0)} modules.`);
