import { describe, expect, it } from 'vitest';
import { ALL_TOPICS } from '@/data';
import { STUDY_PLAN } from '@/data/study-plan';
import { buildStudyPlanSearchIndex, searchStudyPlan, studyPlanMatchExcerpt } from '@/lib/study-plan-search';

const entries = buildStudyPlanSearchIndex(STUDY_PLAN, Object.fromEntries(ALL_TOPICS.map((topic) => [topic.id, topic.title])));

describe('Study plan search', () => {
  it('makes every module findable by its title', () => {
    expect(entries).toHaveLength(60);
    for (const entry of entries) {
      expect(searchStudyPlan(entries, entry.title).map((result) => result.entry.id)).toContain(entry.id);
    }
  });

  it('finds advanced details and failure cases that are absent from module titles', () => {
    const failure = searchStudyPlan(entries, '  SQL INJECTION  ').find((result) => result.entry.id === 'sql-basics');
    expect(failure?.match.label).toBe('Edge cases and failure modes');
    expect(failure?.match.text).toContain('SQL injection');
    const advanced = searchStudyPlan(entries, 'idempotency keys').find((result) => result.entry.id === 'formats-api');
    expect(advanced?.match.label).toBe('Advanced details');
  });

  it('searches labs and readable prerequisite names', () => {
    const unit = STUDY_PLAN.stages[0].modules.find((unit) => unit.id === 'programming')!;
    expect(searchStudyPlan(entries, unit.lab).find((result) => result.entry.id === unit.id)?.match.label).toBe('Lab and evidence');
    const dependent = entries.find((entry) => entry.id === 'sql-basics')!;
    const prerequisite = dependent.fields.find((field) => field.label === 'Prerequisites')!.text;
    expect(prerequisite).not.toBe('');
    expect(searchStudyPlan(entries, prerequisite).map((result) => result.entry.id)).toContain('sql-basics');
  });

  it('supports punctuation, all query terms, stage filters, and no matches', () => {
    expect(searchStudyPlan(entries, 'TCP/UDP').map((result) => result.entry.id)).toContain('ip-transport');
    expect(searchStudyPlan(entries, 'sql injection', 'orchestration')).toEqual([]);
    expect(searchStudyPlan(entries, '', 'foundations')).toHaveLength(STUDY_PLAN.stages[0].modules.length);
    expect(searchStudyPlan(entries, 'SQL impossiblemissingterm')).toEqual([]);
    expect(searchStudyPlan(entries, 'SQL')[0].entry.id).toBe('sql-basics');
  });

  it('provides an excerpt around a match near the end of long text', () => {
    const text = `${'Unrelated context. '.repeat(30)}Connection pooling prevents saturation.`;
    const excerpt = studyPlanMatchExcerpt(text, 'pooling');
    expect(excerpt).toContain('pooling');
    expect(excerpt.length).toBeLessThanOrEqual(222);
  });
});
