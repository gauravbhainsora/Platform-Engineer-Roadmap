'use client';

import { ALL_TOPICS, PILLARS, getTopicsByPillar } from '@/data';
import { toggleTopicCompletion } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function CurriculumList() {
  const { completedTopics: completedMap } = useProgress();
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({
    linux: true,
    networking: true,
    containers: true,
  });

  const togglePillarExpand = (pillarId: string) => {
    setExpandedPillars((prev) => ({ ...prev, [pillarId]: !prev[pillarId] }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-line bg-sky-soft px-3 py-1 text-xs font-mono font-semibold text-sky-ink mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          Structured Learning Curriculum
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Platform Engineering Syllabus
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted">
          {ALL_TOPICS.length} comprehensive technical modules across Linux, Networking, Auth, Containers, Cloud, CI/CD, IaC, and Observability.
        </p>
      </div>

      {/* Pillars Accordion List */}
      <div className="space-y-6">
        {PILLARS.map((pillar) => {
          const topics = getTopicsByPillar(pillar.id);
          const isExpanded = !!expandedPillars[pillar.id];
          const completedCount = topics.filter((t) => completedMap[t.id]).length;
          const percentage = Math.round((completedCount / topics.length) * 100);

          return (
            <div
              key={pillar.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg transition-colors"
            >
              {/* Pillar Header Bar */}
              <div
                onClick={() => togglePillarExpand(pillar.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer hover:bg-hover transition-colors border-b border-transparent"
                style={{
                  borderLeftWidth: '5px',
                  borderLeftColor: `var(--color-${pillar.color}-line)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-ink shadow-md shrink-0"
                    style={{ backgroundColor: `var(--color-${pillar.color}-soft)`, color: `var(--color-${pillar.color}-ink)` }}
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-ink">
                        {pillar.name}: {pillar.title}
                      </h2>
                    </div>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">
                      {pillar.tagline}
                    </p>
                  </div>
                </div>

                {/* Progress Gauge */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-body">
                      {completedCount} / {topics.length} Done
                    </span>
                    <div className="mt-1 h-2 w-28 overflow-hidden rounded-full bg-subtle">
                      <div
                        className="h-full bg-gradient-to-r from-sky-fill to-emerald-fill transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted" />
                  )}
                </div>
              </div>

              {/* Topics List */}
              {isExpanded && (
                <div className="divide-y divide-line bg-inset px-2 sm:px-6 py-2">
                  {topics.map((topic, i) => {
                    const isDone = !!completedMap[topic.id];

                    return (
                      <div
                        key={topic.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-surface rounded-xl transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTopicCompletion(topic.id)}
                            className={`mt-0.5 sm:mt-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isDone
                                ? 'border-emerald-line bg-emerald-fill text-ink'
                                : 'border-line bg-surface text-transparent hover:border-sky-line'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/topics/${topic.slug}`}
                              className="text-sm font-semibold text-ink group-hover:text-sky-ink transition-colors block leading-relaxed"
                            >
                              {i + 1}. {topic.title}
                            </Link>
                            <p className="text-sm text-muted leading-relaxed mt-1">
                              {topic.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                          <span className="text-xs font-mono text-muted flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {topic.estimatedMinutes}m
                          </span>
                          <span className="rounded bg-surface px-2 py-0.5 text-xs font-mono text-muted border border-line">
                            {topic.level}
                          </span>
                          <Link
                            href={`/topics/${topic.slug}`}
                            className="rounded-lg bg-subtle px-3 py-1 text-xs font-semibold text-sky-ink hover:bg-selected transition-colors"
                          >
                            Read Guide →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
