import type { StudyPlan } from '@/types/study-plan';

export interface StudyPlanSearchEntry {
  id: string;
  title: string;
  number: string;
  stageId: string;
  stageTitle: string;
  fields: { label: string; text: string }[];
}

function normalize(text: string) {
  return text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function buildStudyPlanSearchIndex(plan: StudyPlan, guideTitles: Record<string, string>): StudyPlanSearchEntry[] {
  const modules = new Map(plan.stages.flatMap((stage) => stage.modules.map((module) => [module.id, module])));
  const sources = new Map(plan.sources.map((source) => [source.id, source.title]));
  return plan.stages.flatMap((stage, stageIndex) => stage.modules.map((module, moduleIndex) => ({
    id: module.id,
    title: module.title,
    number: `${stageIndex + 1}.${moduleIndex + 1}`,
    stageId: stage.id,
    stageTitle: stage.title,
    fields: [
      { label: 'Module', text: `${module.title}. ${stage.title}. ${stage.level}` },
      ...module.core.map((text) => ({ label: 'Core concepts', text })),
      ...module.advanced.map((text) => ({ label: 'Advanced details', text })),
      ...module.edgeCases.map((text) => ({ label: 'Edge cases and failure modes', text })),
      { label: 'Lab and evidence', text: module.lab },
      { label: 'Prerequisites', text: module.prerequisites.map((id) => modules.get(id)?.title ?? id).join('; ') },
      { label: 'Existing study guides', text: module.guideIds.map((id) => guideTitles[id] ?? id).join('; ') },
      { label: 'Primary reading', text: module.sourceIds.map((id) => sources.get(id) ?? id).join('; ') },
    ],
  })));
}

export function searchStudyPlan(entries: StudyPlanSearchEntry[], query: string, stageId = '') {
  const normalized = normalize(query);
  const tokens = normalized.split(' ').filter(Boolean);
  return entries.flatMap((entry) => {
    if (stageId && entry.stageId !== stageId) return [];
    const fields = entry.fields.map((field) => ({ ...field, searchable: normalize(`${field.label} ${field.text}`) }));
    const searchable = fields.map((field) => field.searchable).join(' ');
    if (!tokens.every((token) => searchable.includes(token))) return [];
    const match = fields.reduce((best, field) => {
      const hits = tokens.filter((token) => field.searchable.includes(token)).length;
      return hits > best.hits ? { field, hits } : best;
    }, { field: fields[0], hits: -1 }).field;
    const title = normalize(entry.title);
    const score = tokens.filter((token) => title.includes(token)).length * 10 + (normalized && title.includes(normalized) ? 20 : 0);
    return [{ entry, match, score }];
  }).sort((a, b) => b.score - a.score);
}

export function studyPlanMatchExcerpt(text: string, query: string) {
  if (text.length <= 220) return text;
  const tokens = normalize(query).split(' ').filter(Boolean);
  const firstMatch = tokens.map((token) => text.toLowerCase().indexOf(token)).filter((index) => index >= 0);
  const start = firstMatch.length ? Math.max(0, Math.min(...firstMatch) - 60) : 0;
  const end = Math.min(text.length, start + 220);
  return `${start ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}
