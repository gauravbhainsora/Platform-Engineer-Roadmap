import { ALL_TOPICS, getTopicById } from '@/data';
import { STUDY_PLAN } from '@/data/study-plan';
import Link from 'next/link';
import { buildStudyPlanSearchIndex } from '@/lib/study-plan-search';
import { StudyPlanSearch } from './StudyPlanSearch';

const modules = STUDY_PLAN.stages.flatMap((stage) => stage.modules);
const moduleById = new Map(modules.map((module) => [module.id, module]));
const sourceById = new Map(STUDY_PLAN.sources.map((source) => [source.id, source]));
const searchEntries = buildStudyPlanSearchIndex(STUDY_PLAN, Object.fromEntries(ALL_TOPICS.map((topic) => [topic.id, topic.title])));

function ConceptList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="space-y-2">
      <h5 className="text-base font-semibold text-ink">{title}</h5>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-body">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function StudyPlan() {
  return (
    <section id="study-plan" aria-labelledby="study-plan-title" className="mb-10 scroll-mt-36 space-y-6">
      <div className="space-y-3">
        <h2 id="study-plan-title" className="text-2xl font-bold text-ink">Beginner-to-expert study path</h2>
        <p className="text-base leading-relaxed text-body">{STUDY_PLAN.stages.length} stages · {modules.length} syllabus modules · all {ALL_TOPICS.length} existing study guides linked into the path</p>
        <p className="text-sm leading-relaxed text-muted">Start with computing and programming, progress through infrastructure and reliability, then build and defend an internal platform. Each module includes prerequisites, core and advanced concepts, failure cases, and a practical lab.</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <a href="/platform-engineering-study-plan.txt" download className="inline-flex min-h-11 items-center rounded-xl border border-line bg-surface px-4 font-semibold text-sky-ink hover:bg-hover">Download full study plan</a>
          <a href="#study-guides" className="inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-sky-ink hover:bg-hover">Browse existing guides →</a>
          <span className="text-muted">References reviewed {STUDY_PLAN.reviewedAt}</span>
        </div>
      </div>

      <details className="rounded-2xl border border-line bg-surface p-5">
        <summary className="cursor-pointer text-base font-semibold text-ink">How to study and demonstrate mastery</summary>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-body">{STUDY_PLAN.studyMethod.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="mt-4 text-sm leading-relaxed text-muted">{STUDY_PLAN.scope}</p>
      </details>

      <StudyPlanSearch entries={searchEntries} />

      <nav aria-label="Study plan stages" className="flex flex-wrap gap-2">
        {STUDY_PLAN.stages.map((stage, index) => <a key={stage.id} href={`#stage-${stage.id}`} className="inline-flex min-h-11 items-center rounded-xl border border-line bg-surface px-3 text-sm font-medium text-body hover:bg-hover">{index + 1}. {stage.title}</a>)}
      </nav>

      <div className="space-y-4">
        {STUDY_PLAN.stages.map((stage, stageIndex) => (
          <section key={stage.id} id={`stage-${stage.id}`} className="scroll-mt-36 rounded-2xl border border-line bg-surface p-4 sm:p-6">
            <div className="mb-4 space-y-2">
              <p className="text-sm font-semibold text-sky-ink">Stage {stageIndex + 1} · {stage.level} · {stage.modules.length} modules</p>
              <h3 className="text-xl font-bold text-ink">{stage.title}</h3>
              <p className="text-sm leading-relaxed text-body">{stage.goal}</p>
            </div>
            <div className="mb-5 space-y-2">
              <h4 className="text-base font-semibold text-ink">Before you start</h4>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">{stage.entryRequirements.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="space-y-3">
              {stage.modules.map((module, moduleIndex) => (
                <details key={module.id} id={`module-${module.id}`} open={stageIndex === 0 && moduleIndex === 0} className="scroll-mt-36 rounded-xl border border-line bg-inset p-4">
                  <summary className="min-h-11 cursor-pointer text-base font-semibold leading-relaxed text-ink">
                    <h4 className="inline">{stageIndex + 1}.{moduleIndex + 1}. {module.title}</h4>
                  </summary>
                  <div className="mt-4 space-y-5">
                    <div className="text-sm leading-relaxed text-muted">
                      <span className="font-semibold text-body">Prerequisites: </span>
                      {module.prerequisites.length ? <ul className="mt-2 list-disc space-y-1 pl-5">{module.prerequisites.map((id) => <li key={id}><a href={`#module-${id}`} className="font-medium text-sky-ink underline decoration-sky-line underline-offset-4">{moduleById.get(id)!.title}</a></li>)}</ul> : 'None; start here.'}
                    </div>
                    <ConceptList title="Core concepts" items={module.core} />
                    <ConceptList title="Advanced details" items={module.advanced} />
                    <ConceptList title="Edge cases and failure modes" items={module.edgeCases} />
                    <section className="space-y-2 rounded-xl border border-emerald-line bg-emerald-tint p-4"><h5 className="text-base font-semibold text-emerald-ink">Lab and evidence</h5><p className="text-sm leading-relaxed text-body">{module.lab}</p></section>
                    {module.guideIds.length > 0 && <section className="space-y-2"><h5 className="text-base font-semibold text-ink">Existing study guides</h5><ul className="list-disc space-y-2 pl-5 text-sm">{module.guideIds.map((id) => { const topic = getTopicById(id)!; return <li key={id}><Link href={`/topics/${topic.slug}`} className="font-medium leading-relaxed text-sky-ink underline decoration-sky-line underline-offset-4">{topic.title}</Link></li>; })}</ul></section>}
                    <section className="space-y-2"><h5 className="text-base font-semibold text-ink">Primary reading</h5><ul className="list-disc space-y-2 pl-5 text-sm">{module.sourceIds.map((id) => { const source = sourceById.get(id)!; return <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sky-ink underline decoration-sky-line underline-offset-4">{source.title}<span className="sr-only"> (opens in a new tab)</span></a></li>; })}</ul></section>
                  </div>
                </details>
              ))}
            </div>
            <div className="mt-5 space-y-4 rounded-xl border border-line bg-inset p-4">
              <section className="space-y-2"><h4 className="text-base font-semibold text-ink">Stage capstone</h4><p className="text-sm leading-relaxed text-body">{stage.capstone}</p></section>
              <section className="space-y-2"><h4 className="text-base font-semibold text-ink">Exit criteria</h4><ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-body">{stage.exitCriteria.map((item) => <li key={item}>{item}</li>)}</ul></section>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
