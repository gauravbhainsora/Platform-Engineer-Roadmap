import { describe, it, expect } from 'vitest';
import {
  PILLARS,
  ALL_TOPICS,
  CHEATSHEET_DATABASE,
  getAllTopics,
  getTopicBySlug,
  getTopicById,
  getPillars,
  getPillarById,
  getTopicsByPillar,
  getNextTopic,
  getPreviousTopic,
  searchTopics,
  LINUX_TOPICS,
  NETWORKING_TOPICS,
  AUTH_TOPICS,
  CONTAINERS_TOPICS,
  CLOUD_TOPICS,
  CICD_TOPICS,
  IAC_TOPICS,
  OBSERVABILITY_TOPICS,
} from '@/data';
import { PillarId } from '@/types';

const EXPECTED_PILLAR_IDS: PillarId[] = [
  'linux',
  'networking',
  'auth',
  'containers',
  'cloud',
  'cicd',
  'iac',
  'observability',
];

describe('Data Integrity: Pillars & Metadata', () => {
  it('contains exactly 8 core pillars', () => {
    expect(PILLARS).toHaveLength(8);
    expect(getPillars()).toHaveLength(8);
  });

  it('has unique pillar IDs matching expected domain pillars', () => {
    const ids = PILLARS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(8);
    EXPECTED_PILLAR_IDS.forEach((expectedId) => {
      expect(ids).toContain(expectedId);
    });
  });

  it('validates each pillar metadata fields, color hex codes, and topic counts', () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;

    PILLARS.forEach((pillar) => {
      expect(pillar.id).toBeTruthy();
      expect(pillar.name.trim()).not.toBe('');
      expect(pillar.title.trim()).not.toBe('');
      expect(pillar.tagline.trim()).not.toBe('');
      expect(pillar.description.trim()).not.toBe('');
      expect(pillar.icon.trim()).not.toBe('');
      expect(pillar.color.trim()).not.toBe('');

      expect(pillar.bgHex).toMatch(hexPattern);
      expect(pillar.borderHex).toMatch(hexPattern);
      expect(pillar.textHex).toMatch(hexPattern);
      expect(pillar.accentHex).toMatch(hexPattern);

      expect(pillar.totalTopics).toBeGreaterThan(0);

      // Verify totalTopics strictly matches topics assigned to this pillar
      const topicsInPillar = getTopicsByPillar(pillar.id);
      expect(topicsInPillar.length).toBe(pillar.totalTopics);
    });

    const sumTotalTopics = PILLARS.reduce((acc, p) => acc + p.totalTopics, 0);
    expect(sumTotalTopics).toBe(ALL_TOPICS.length);
  });

  it('resolves pillar correctly via getPillarById', () => {
    EXPECTED_PILLAR_IDS.forEach((id) => {
      const pillar = getPillarById(id);
      expect(pillar).toBeDefined();
      expect(pillar?.id).toBe(id);
    });

    expect(getPillarById('unknown-pillar' as PillarId)).toBeUndefined();
  });
});

describe('Data Integrity: Topics & Comprehensive Content', () => {
  it('contains topics across all pillars matching sum of individual pillar arrays', () => {
    expect(ALL_TOPICS.length).toBeGreaterThanOrEqual(67);
    expect(getAllTopics().length).toBe(ALL_TOPICS.length);

    const sum =
      LINUX_TOPICS.length +
      NETWORKING_TOPICS.length +
      AUTH_TOPICS.length +
      CONTAINERS_TOPICS.length +
      CLOUD_TOPICS.length +
      CICD_TOPICS.length +
      IAC_TOPICS.length +
      OBSERVABILITY_TOPICS.length;

    expect(sum).toBe(ALL_TOPICS.length);
  });

  it('guarantees globally unique topic IDs and slugs', () => {
    const ids = ALL_TOPICS.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ALL_TOPICS.length);

    const slugs = ALL_TOPICS.map((t) => t.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(ALL_TOPICS.length);
  });

  it('verifies each topic has valid non-empty fields, content, and key takeaways', () => {
    ALL_TOPICS.forEach((topic) => {
      // Identity & Navigation
      expect(topic.id.trim()).not.toBe('');
      expect(topic.slug.trim()).not.toBe('');
      expect(EXPECTED_PILLAR_IDS).toContain(topic.pillarId);
      expect(['left', 'right']).toContain(topic.branch);
      expect(topic.order).toBeGreaterThanOrEqual(1);

      // Titles & Metadata
      expect(topic.title.trim()).not.toBe('');
      expect(topic.subtitle.trim()).not.toBe('');
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(topic.level);
      expect(topic.estimatedMinutes).toBeGreaterThanOrEqual(5);
      expect(Array.isArray(topic.tags)).toBe(true);
      expect(topic.tags.length).toBeGreaterThanOrEqual(1);

      // Summary & Content/Overview
      expect(topic.summary.trim().length).toBeGreaterThanOrEqual(20);
      const content = topic.overview || (topic as any).content;
      expect(content).toBeDefined();
      expect(typeof content).toBe('string');
      expect(content.trim().length).toBeGreaterThanOrEqual(30);

      // Key Concepts / Takeaways
      const keyTakeaways = (topic as any).keyTakeaways || topic.keyConcepts;
      expect(keyTakeaways).toBeDefined();
      expect(Array.isArray(keyTakeaways)).toBe(true);
      expect(keyTakeaways.length).toBeGreaterThanOrEqual(1);
      keyTakeaways.forEach((k: any) => {
        expect(k.title.trim()).not.toBe('');
        expect(k.explanation.trim()).not.toBe('');
      });

      // Commands
      expect(Array.isArray(topic.commands)).toBe(true);
      topic.commands.forEach((cmd) => {
        expect(cmd.cmd.trim()).not.toBe('');
        expect(cmd.desc.trim()).not.toBe('');
      });

      // Production Snippet
      expect(topic.productionCode).toBeDefined();
      expect(topic.productionCode.language.trim()).not.toBe('');
      expect(topic.productionCode.code.trim()).not.toBe('');
      expect(topic.productionCode.explanation.trim()).not.toBe('');

      // Gotchas & Interview Questions
      expect(Array.isArray(topic.gotchas)).toBe(true);
      topic.gotchas.forEach((g) => {
        expect(g.issue.trim()).not.toBe('');
        expect(g.resolution.trim()).not.toBe('');
        expect(['warning', 'critical', 'tip']).toContain(g.severity);
      });

      expect(Array.isArray(topic.interviewQuestions)).toBe(true);
      topic.interviewQuestions.forEach((q) => {
        expect(q.question.trim()).not.toBe('');
        expect(q.answer.trim()).not.toBe('');
        expect(q.platformContext.trim()).not.toBe('');
      });

      // References
      expect(Array.isArray(topic.references)).toBe(true);
      topic.references.forEach((ref) => {
        expect(ref.title.trim()).not.toBe('');
        expect(ref.url.trim()).not.toBe('');
      });

      // Quiz Questions
      expect(Array.isArray(topic.quiz)).toBe(true);
      expect(topic.quiz.length).toBeGreaterThanOrEqual(1);
      topic.quiz.forEach((q) => {
        expect(q.id.trim()).not.toBe('');
        expect(q.question.trim().length).toBeGreaterThanOrEqual(10);
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        q.options.forEach((opt) => expect(opt.trim()).not.toBe(''));

        // Validate answerIndex or correctAnswer
        const hasValidAnswerIndex =
          typeof q.answerIndex === 'number' &&
          q.answerIndex >= 0 &&
          q.answerIndex < q.options.length;
        const hasCorrectAnswer = (q as any).correctAnswer !== undefined;
        expect(hasValidAnswerIndex || hasCorrectAnswer).toBe(true);

        expect(q.explanation.trim().length).toBeGreaterThanOrEqual(10);
      });
    });
  });

  it('validates sequential order within each pillar', () => {
    EXPECTED_PILLAR_IDS.forEach((pillarId) => {
      const topics = getTopicsByPillar(pillarId);
      const orders = topics.map((t) => t.order);
      for (let i = 1; i <= topics.length; i++) {
        expect(orders).toContain(i);
      }
    });
  });

  it('supports lookup helpers getTopicById and getTopicBySlug', () => {
    const first = ALL_TOPICS[0];
    expect(getTopicById(first.id)).toEqual(first);
    expect(getTopicBySlug(first.slug)).toEqual(first);

    expect(getTopicById('non-existent-topic-id-12345')).toBeUndefined();
    expect(getTopicBySlug('non-existent-slug-12345')).toBeUndefined();
  });

  it('supports navigation helpers getNextTopic and getPreviousTopic', () => {
    const first = ALL_TOPICS[0];
    const second = ALL_TOPICS[1];
    const last = ALL_TOPICS[ALL_TOPICS.length - 1];

    expect(getNextTopic(first.slug)?.id).toBe(second.id);
    expect(getNextTopic(last.slug)).toBeUndefined();

    expect(getPreviousTopic(second.slug)?.id).toBe(first.id);
    expect(getPreviousTopic(first.slug)).toBeUndefined();
  });

  it('supports search query matching across topics', () => {
    expect(searchTopics('')).toEqual([]);
    expect(searchTopics('   ')).toEqual([]);

    const linuxMatches = searchTopics('linux');
    expect(linuxMatches.length).toBeGreaterThan(0);

    const k8sMatches = searchTopics('kubernetes');
    expect(k8sMatches.length).toBeGreaterThan(0);

    const emptyMatches = searchTopics('supercalifragilisticexpialidocious_404');
    expect(emptyMatches).toEqual([]);
  });
});

describe('Data Integrity: Cheatsheets Database', () => {
  it('contains populated cheatsheet database with at least 50 commands', () => {
    expect(Array.isArray(CHEATSHEET_DATABASE)).toBe(true);
    expect(CHEATSHEET_DATABASE.length).toBeGreaterThanOrEqual(50);
  });

  it('covers all 8 roadmap pillars in the cheatsheet database', () => {
    const coveredPillars = new Set(CHEATSHEET_DATABASE.map((c) => c.pillarId));
    EXPECTED_PILLAR_IDS.forEach((pillarId) => {
      expect(coveredPillars.has(pillarId)).toBe(true);
    });
  });

  it('validates each cheat sheet entry command, tool, description, and category', () => {
    const categories = new Set<string>();

    CHEATSHEET_DATABASE.forEach((entry) => {
      expect(EXPECTED_PILLAR_IDS).toContain(entry.pillarId);
      expect(entry.tool.trim()).not.toBe('');
      expect(entry.cmd.trim()).not.toBe('');
      expect(entry.desc.trim()).not.toBe('');
      expect(entry.category?.trim()).not.toBe('');
      if (entry.category) {
        categories.add(entry.category);
      }
    });

    expect(categories.size).toBeGreaterThanOrEqual(10);
  });
});
