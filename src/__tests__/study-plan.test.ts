import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ALL_TOPICS } from '@/data';
import { STUDY_PLAN } from '@/data/study-plan';
import { formatStudyPlan } from '@/lib/study-plan-export';

const modules = STUDY_PLAN.stages.flatMap((stage) => stage.modules);

describe('Beginner-to-expert study plan', () => {
  it('covers every existing guide without broken references', () => {
    const actual = new Set(ALL_TOPICS.map((topic) => topic.id));
    const covered = new Set(modules.flatMap((unit) => unit.guideIds));
    expect([...covered].sort()).toEqual([...actual].sort());
  });

  it('orders all prerequisites before their dependents and has unique anchor IDs', () => {
    const seen = new Set<string>();
    expect(new Set(STUDY_PLAN.stages.map((stage) => stage.id)).size).toBe(STUDY_PLAN.stages.length);
    for (const unit of modules) {
      expect(seen.has(unit.id)).toBe(false);
      for (const prerequisite of unit.prerequisites) expect(seen.has(prerequisite), `${unit.id}: unknown or later prerequisite ${prerequisite}`).toBe(true);
      seen.add(unit.id);
    }
  });

  it('provides labs, advanced material, failure cases, and assessment at every stage', () => {
    for (const stage of STUDY_PLAN.stages) {
      expect(stage.entryRequirements.length).toBeGreaterThan(0);
      expect(stage.capstone.length).toBeGreaterThan(80);
      expect(stage.exitCriteria.length).toBeGreaterThanOrEqual(4);
      for (const unit of stage.modules) {
        expect(unit.core.length).toBeGreaterThanOrEqual(4);
        expect(unit.advanced.length).toBeGreaterThanOrEqual(2);
        expect(unit.edgeCases.length).toBeGreaterThanOrEqual(3);
        expect(unit.lab.length).toBeGreaterThan(80);
      }
    }
  });

  it('uses only defined primary-reading sources with HTTPS links', () => {
    const sources = new Set(STUDY_PLAN.sources.map((source) => source.id));
    expect(sources.size).toBe(STUDY_PLAN.sources.length);
    for (const source of STUDY_PLAN.sources) expect(new URL(source.url).protocol).toBe('https:');
    for (const unit of modules) {
      expect(unit.sourceIds.length).toBeGreaterThan(0);
      for (const id of unit.sourceIds) expect(sources.has(id)).toBe(true);
    }
  });

  it('keeps the complete offline download synchronized with the displayed syllabus', () => {
    const guideLinks = Object.fromEntries(ALL_TOPICS.map((topic) => [topic.id, { title: topic.title, path: `/topics/${topic.slug}` }]));
    expect(readFileSync('public/platform-engineering-study-plan.txt', 'utf8')).toBe(formatStudyPlan(STUDY_PLAN, guideLinks));
  });
});
