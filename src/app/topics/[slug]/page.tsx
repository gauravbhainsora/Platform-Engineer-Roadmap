import { TopicReader } from '@/components/guide/TopicReader';
import { ALL_TOPICS, getTopicBySlug } from '@/data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return ALL_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: 'Topic Not Found' };

  return {
    title: `${topic.title} | Platform Engineer Roadmap`,
    description: topic.summary,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return <TopicReader topic={topic} />;
}
