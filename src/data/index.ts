import { PillarId, PillarMeta, TopicItem } from '@/types';
import { PILLARS } from './pillars';
import { LINUX_TOPICS } from './topics/linux';
import { NETWORKING_TOPICS } from './topics/networking';
import { AUTH_TOPICS } from './topics/auth';
import { CONTAINERS_TOPICS } from './topics/containers';
import { CLOUD_TOPICS } from './topics/cloud';
import { CICD_TOPICS } from './topics/cicd';
import { IAC_TOPICS } from './topics/iac';
import { OBSERVABILITY_TOPICS } from './topics/observability';
import { CHEATSHEET_DATABASE } from './cheatsheets';

export {
  PILLARS,
  LINUX_TOPICS,
  NETWORKING_TOPICS,
  AUTH_TOPICS,
  CONTAINERS_TOPICS,
  CLOUD_TOPICS,
  CICD_TOPICS,
  IAC_TOPICS,
  OBSERVABILITY_TOPICS,
  CHEATSHEET_DATABASE,
};

export const ALL_TOPICS: TopicItem[] = [
  ...LINUX_TOPICS,
  ...NETWORKING_TOPICS,
  ...AUTH_TOPICS,
  ...CONTAINERS_TOPICS,
  ...CLOUD_TOPICS,
  ...CICD_TOPICS,
  ...IAC_TOPICS,
  ...OBSERVABILITY_TOPICS,
];

// Helper maps
const TOPIC_BY_SLUG = new Map<string, TopicItem>(
  ALL_TOPICS.map((t) => [t.slug, t])
);

const TOPIC_BY_ID = new Map<string, TopicItem>(
  ALL_TOPICS.map((t) => [t.id, t])
);

const PILLAR_BY_ID = new Map<PillarId, PillarMeta>(
  PILLARS.map((p) => [p.id, p])
);

export function getAllTopics(): TopicItem[] {
  return ALL_TOPICS;
}

export function getTopicBySlug(slug: string): TopicItem | undefined {
  return TOPIC_BY_SLUG.get(slug);
}

export function getTopicById(id: string): TopicItem | undefined {
  return TOPIC_BY_ID.get(id);
}

export function getPillars(): PillarMeta[] {
  return PILLARS;
}

export function getPillarById(id: PillarId): PillarMeta | undefined {
  return PILLAR_BY_ID.get(id);
}

export function getTopicsByPillar(pillarId: PillarId): TopicItem[] {
  return ALL_TOPICS.filter((t) => t.pillarId === pillarId);
}

export function getNextTopic(currentSlug: string): TopicItem | undefined {
  const currentIndex = ALL_TOPICS.findIndex((t) => t.slug === currentSlug);
  if (currentIndex === -1 || currentIndex === ALL_TOPICS.length - 1) {
    return undefined;
  }
  return ALL_TOPICS[currentIndex + 1];
}

export function getPreviousTopic(currentSlug: string): TopicItem | undefined {
  const currentIndex = ALL_TOPICS.findIndex((t) => t.slug === currentSlug);
  if (currentIndex <= 0) {
    return undefined;
  }
  return ALL_TOPICS[currentIndex - 1];
}

export function searchTopics(query: string): TopicItem[] {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  return ALL_TOPICS.filter((t) => {
    return (
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.commands.some((c) => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    );
  });
}
