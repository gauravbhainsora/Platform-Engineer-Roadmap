'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  Award,
  Star,
  Check,
} from 'lucide-react';
import { PILLARS, getTopicsByPillar } from '@/data';
import { PillarId, TopicItem } from '@/types';
import { getStoredProgress, toggleTopicCompletion, toggleTopicBookmark } from '@/lib/storage';

export function CurriculumList() {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({
    linux: true,
    networking: true,
    containers: true,
  });

  useEffect(() => {
    const sync = () => {
      const progress = getStoredProgress();
      setCompletedMap({ ...progress.completedTopics });
      setBookmarkedMap({ ...progress.bookmarkedTopics });
    };
    sync();
    window.addEventListener('platform-roadmap-progress-updated', sync);
    return () => window.removeEventListener('platform-roadmap-progress-updated', sync);
  }, []);

  const togglePillarExpand = (pillarId: string) => {
    setExpandedPillars((prev) => ({ ...prev, [pillarId]: !prev[pillarId] }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-mono font-semibold text-sky-400 mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          Structured Learning Curriculum
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Platform Engineering Syllabus
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          67 comprehensive technical modules across Linux, Networking, Containers, Cloud, CI/CD, IaC, and Observability.
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
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg transition-colors"
            >
              {/* Pillar Header Bar */}
              <div
                onClick={() => togglePillarExpand(pillar.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer hover:bg-slate-850 transition-colors border-b border-transparent"
                style={{
                  borderLeftWidth: '5px',
                  borderLeftColor: pillar.borderHex,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md shrink-0"
                    style={{ backgroundColor: pillar.bgHex }}
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        {pillar.name}: {pillar.title}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {pillar.tagline}
                    </p>
                  </div>
                </div>

                {/* Progress Gauge */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {completedCount} / {topics.length} Done
                    </span>
                    <div className="mt-1 h-2 w-28 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Topics List */}
              {isExpanded && (
                <div className="divide-y divide-slate-800/60 bg-slate-950/40 px-2 sm:px-6 py-2">
                  {topics.map((topic, i) => {
                    const isDone = !!completedMap[topic.id];
                    const isBookmarked = !!bookmarkedMap[topic.id];

                    return (
                      <div
                        key={topic.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-slate-900/60 rounded-xl transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTopicCompletion(topic.id)}
                            className={`mt-0.5 sm:mt-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isDone
                                ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                                : 'border-slate-700 bg-slate-900 text-transparent hover:border-sky-500'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/topics/${topic.slug}`}
                              className="text-sm font-semibold text-slate-200 group-hover:text-sky-400 transition-colors block truncate"
                            >
                              {i + 1}. {topic.title}
                            </Link>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {topic.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {topic.estimatedMinutes}m
                          </span>
                          <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-800">
                            {topic.level}
                          </span>
                          <Link
                            href={`/topics/${topic.slug}`}
                            className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-sky-400 hover:bg-slate-700 transition-colors"
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
