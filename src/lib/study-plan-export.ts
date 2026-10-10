import type { StudyPlan } from '@/types/study-plan';

export function formatStudyPlan(plan: StudyPlan, guideLinks: Record<string, { title: string; path: string }>) {
  const lines = [plan.title, `References reviewed: ${plan.reviewedAt}`, '', plan.scope, '', 'HOW TO STUDY', ...plan.studyMethod.map((item) => `- ${item}`), ''];
  const modules = new Map(plan.stages.flatMap((stage) => stage.modules.map((module) => [module.id, module] as const)));
  const sources = new Map(plan.sources.map((source) => [source.id, source]));
  for (const [stageIndex, stage] of plan.stages.entries()) {
    lines.push(`STAGE ${stageIndex + 1}: ${stage.title} (${stage.level})`, stage.goal, '', 'Before you start:', ...stage.entryRequirements.map((item) => `- ${item}`), '');
    for (const [moduleIndex, module] of stage.modules.entries()) {
      lines.push(`${stageIndex + 1}.${moduleIndex + 1}. ${module.title}`, `Prerequisites: ${module.prerequisites.length ? module.prerequisites.map((id) => modules.get(id)!.title).join('; ') : 'None; start here.'}`, '');
      for (const [title, items] of [['Core concepts', module.core], ['Advanced details', module.advanced], ['Edge cases and failure modes', module.edgeCases]] as const) lines.push(`${title}:`, ...items.map((item) => `- ${item}`), '');
      lines.push('Lab and evidence:', module.lab, '');
      if (module.guideIds.length) lines.push('Existing study guides (paths relative to the running application):', ...module.guideIds.map((id) => `- ${guideLinks[id].title}: ${guideLinks[id].path}`), '');
      lines.push('Primary reading:', ...module.sourceIds.map((id) => { const source = sources.get(id)!; return `- ${source.title}: ${source.url}`; }), '');
    }
    lines.push('Stage capstone:', stage.capstone, '', 'Exit criteria:', ...stage.exitCriteria.map((item) => `- ${item}`), '', '');
  }
  return lines.join('\n').trimEnd() + '\n';
}
