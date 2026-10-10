'use client';

import { Modal } from '@/components/ui/Modal';
import { PILLARS, getTopicsByPillar } from '@/data';
import { toggleTopicBookmark, toggleTopicCompletion } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import { TopicItem } from '@/types';
import {
  Activity,
  ArrowDown,
  BookOpen,
  Box,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  Cloud,
  GitMerge,
  Layers,
  Network,
  ShieldCheck,
  Star,
  Terminal,
  X
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface RoadmapCanvasProps {
  onSelectTopic?: (topic: TopicItem) => void;
}

const PILLAR_ICONS: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="h-5 w-5" />,
  Network: <Network className="h-5 w-5" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5" />,
  Box: <Box className="h-5 w-5" />,
  Cloud: <Cloud className="h-5 w-5" />,
  GitMerge: <GitMerge className="h-5 w-5" />,
  Boxes: <Boxes className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
};

export function RoadmapCanvas({ onSelectTopic }: RoadmapCanvasProps) {
  const { completedTopics: completedMap, bookmarkedTopics: bookmarkedMap } = useProgress();
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'bookmarked'>('all');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);

  const handleToggleDone = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    toggleTopicCompletion(topicId);
  };

  const handleToggleBookmark = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    toggleTopicBookmark(topicId);
  };

  return (
    <div className="relative w-full py-8 px-2 sm:px-4 lg:px-8">
      {/* Control Bar */}
      <div className="mx-auto max-w-7xl mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-soft text-sky-ink border border-sky-line">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
              Platform Engineering Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Interactive 8-pillar learning guide • Click any topic node to inspect concepts and commands
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-inset p-1 border border-line text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterMode === 'all'
                  ? 'bg-subtle text-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setFilterMode('incomplete')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterMode === 'incomplete'
                  ? 'bg-subtle text-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              To Learn
            </button>
            <button
              onClick={() => setFilterMode('bookmarked')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterMode === 'bookmarked'
                  ? 'bg-amber-soft text-amber-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              ★ Bookmarked
            </button>
          </div>
        </div>
      </div>

      {/* Main Mindmap Canvas Tree */}
      <div className="relative mx-auto max-w-7xl flex flex-col items-center">
        {PILLARS.map((pillar, pillarIndex) => {
          const topics = getTopicsByPillar(pillar.id);
          const leftTopics = topics.filter((t) => t.branch === 'left');
          const rightTopics = topics.filter((t) => t.branch === 'right');

          const pillarCompletedCount = topics.filter((t) => completedMap[t.id]).length;
          const isPillarMastered = pillarCompletedCount === topics.length && topics.length > 0;

          return (
            <React.Fragment key={pillar.id}>
              {/* Pillar Module Cluster */}
              <div
                id={`pillar-${pillar.id}`}
                className="relative w-full my-6 flex flex-col lg:flex-row items-center justify-between gap-6 scroll-mt-32"
              >
                {/* LEFT BRANCH NODES */}
                <div className="w-full lg:w-[41%] flex flex-col items-stretch lg:items-end gap-3 order-2 lg:order-1 relative">
                  {leftTopics.map((topic) => {
                    const isDone = !!completedMap[topic.id];
                    const isSaved = !!bookmarkedMap[topic.id];

                    if (filterMode === 'incomplete' && isDone) return null;
                    if (filterMode === 'bookmarked' && !isSaved) return null;

                    return (
                      <div
                        key={topic.id}
                        className={`mindmap-node-pill group relative w-full lg:max-w-md cursor-pointer rounded-2xl border p-4 text-left transition-all backdrop-blur-sm shadow-md ${
                          isDone
                            ? 'border-emerald-line bg-emerald-tint hover:border-emerald-line shadow-none'
                            : 'border-line bg-surface hover:border-sky-line hover:bg-hover hover:shadow-none'
                        }`}
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: `var(--color-${isDone ? 'emerald' : pillar.color}-line)`,
                        }}
                      >
                        {/* Connecting branch notch indicator for desktop */}
                        <div
                          className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-0.5"
                          style={{ backgroundColor: `var(--color-${pillar.color}-line)`, opacity: 0.6 }}
                        />

                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => { setSelectedTopic(topic); onSelectTopic?.(topic); }}
                            aria-label={`Preview ${topic.title}`}
                            className="flex-1 min-w-0 text-left rounded focus-visible:outline-sky-400"
                          >
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-fill text-ink">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--color-${pillar.color}-line)` }} />
                              )}
                              <h4
                                className={`text-sm sm:text-base font-semibold leading-snug ${
                                  isDone ? 'text-emerald-ink' : 'text-ink group-hover:text-sky-ink'
                                }`}
                              >
                                {topic.title}
                              </h4>
                            </div>
                            <p className="mt-2 text-sm text-muted leading-relaxed">
                              {topic.subtitle}
                            </p>
                          </button>

                          {/* Action icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleToggleBookmark(e, topic.id)}
                              title={isSaved ? 'Remove bookmark' : 'Bookmark topic'}
                              className={`rounded-lg p-2 transition-colors hover:bg-inset ${
                                isSaved
                                  ? 'text-amber-ink hover:text-amber-ink'
                                  : 'text-muted hover:text-body '
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-amber-ink' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleToggleDone(e, topic.id)}
                              title={isDone ? 'Mark incomplete' : 'Mark completed'}
                              className={`rounded-lg p-2 transition-colors hover:bg-inset ${
                                isDone
                                  ? 'text-emerald-ink hover:text-emerald-ink'
                                  : 'text-muted hover:text-emerald-ink'
                              }`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subnode tag previews */}
                        {topic.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {topic.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-inset px-2 py-0.5 text-xs text-muted border border-line"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* CENTRAL PILLAR SPINE NODE */}
                <div className="w-full lg:w-[18%] flex flex-col items-center justify-center order-1 lg:order-2 shrink-0 relative">
                  <button
                    type="button"
                    aria-label={`Preview ${pillar.name} pillar`}
                    className="relative flex flex-col items-center justify-center rounded-2xl border-2 px-5 py-5 text-center shadow-sm transition-colors hover:border-line-strong cursor-pointer z-10"
                    style={{
                      borderColor: `var(--color-${pillar.color}-line)`,
                      backgroundColor: 'var(--color-surface)',
                    }}
                    onClick={() => {
                      const first = topics[0];
                      if (first) setSelectedTopic(first);
                    }}
                  >
                    <span
                      className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl text-ink shadow-md"
                      style={{ backgroundColor: `var(--color-${pillar.color}-soft)`, color: `var(--color-${pillar.color}-ink)` }}
                    >
                      {PILLAR_ICONS[pillar.icon] || <Layers className="h-6 w-6" />}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-ink tracking-wide">
                      {pillar.name}
                    </span>
                    <span className="mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-body bg-surface border border-line">
                      {pillarCompletedCount}/{topics.length} Done
                    </span>
                    {isPillarMastered && (
                      <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-fill text-ink text-xs shadow-md font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                </div>

                {/* RIGHT BRANCH NODES */}
                <div className="w-full lg:w-[41%] flex flex-col items-stretch lg:items-start gap-3 order-3 relative">
                  {rightTopics.map((topic) => {
                    const isDone = !!completedMap[topic.id];
                    const isSaved = !!bookmarkedMap[topic.id];

                    if (filterMode === 'incomplete' && isDone) return null;
                    if (filterMode === 'bookmarked' && !isSaved) return null;

                    return (
                      <div
                        key={topic.id}
                        className={`mindmap-node-pill group relative w-full lg:max-w-md cursor-pointer rounded-2xl border p-4 text-left transition-all backdrop-blur-sm shadow-md ${
                          isDone
                            ? 'border-emerald-line bg-emerald-tint hover:border-emerald-line shadow-none'
                            : 'border-line bg-surface hover:border-sky-line hover:bg-hover hover:shadow-none'
                        }`}
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: `var(--color-${isDone ? 'emerald' : pillar.color}-line)`,
                        }}
                      >
                        {/* Connecting branch notch indicator for desktop */}
                        <div
                          className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5"
                          style={{ backgroundColor: `var(--color-${pillar.color}-line)`, opacity: 0.6 }}
                        />

                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => { setSelectedTopic(topic); onSelectTopic?.(topic); }}
                            aria-label={`Preview ${topic.title}`}
                            className="flex-1 min-w-0 text-left rounded focus-visible:outline-sky-400"
                          >
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-fill text-ink">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--color-${pillar.color}-line)` }} />
                              )}
                              <h4
                                className={`text-sm sm:text-base font-semibold leading-snug ${
                                  isDone ? 'text-emerald-ink' : 'text-ink group-hover:text-sky-ink'
                                }`}
                              >
                                {topic.title}
                              </h4>
                            </div>
                            <p className="mt-2 text-sm text-muted leading-relaxed">
                              {topic.subtitle}
                            </p>
                          </button>

                          {/* Action icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleToggleBookmark(e, topic.id)}
                              title={isSaved ? 'Remove bookmark' : 'Bookmark topic'}
                              className={`rounded-lg p-2 transition-colors hover:bg-inset ${
                                isSaved
                                  ? 'text-amber-ink hover:text-amber-ink'
                                  : 'text-muted hover:text-body '
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-amber-ink' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleToggleDone(e, topic.id)}
                              title={isDone ? 'Mark incomplete' : 'Mark completed'}
                              className={`rounded-lg p-2 transition-colors hover:bg-inset ${
                                isDone
                                  ? 'text-emerald-ink hover:text-emerald-ink'
                                  : 'text-muted hover:text-emerald-ink'
                              }`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subnode tag previews */}
                        {topic.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {topic.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-inset px-2 py-0.5 text-xs text-muted border border-line"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VERTICAL SPINE CONNECTOR FLOW */}
              {pillarIndex < PILLARS.length - 1 && (
                <div className="my-3 flex flex-col items-center">
                  <div className="h-12 w-0.5 bg-line-strong" />
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-sky-ink border border-line shadow-md">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* QUICK PREVIEW SLIDE-OVER DRAWER */}
      {selectedTopic && (
        <Modal isOpen={!!selectedTopic} onClose={() => setSelectedTopic(null)} label="Topic preview" className="flex items-center justify-end sm:p-6">
          <div className="relative h-full max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-line bg-surface p-6 sm:p-7 shadow-lg">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <span className="text-xs uppercase font-mono font-semibold text-sky-ink">
                  {selectedTopic.pillarId} Pillar • {selectedTopic.level}
                </span>
                <h3 className="text-xl font-bold text-ink mt-1">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-muted mt-1">
                  {selectedTopic.subtitle}
                </p>
              </div>
              <button
                aria-label="Close topic preview"
                onClick={() => setSelectedTopic(null)}
                className="rounded-lg p-1.5 text-muted hover:bg-subtle hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Summary */}
            <div className="my-4">
              <h4 className="text-xs font-semibold text-body uppercase tracking-wider font-mono">
                Overview Summary
              </h4>
              <p className="text-sm text-body mt-1.5 leading-relaxed">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Key Concepts Preview */}
            <div className="my-4 space-y-2">
              <h4 className="text-xs font-semibold text-body uppercase tracking-wider font-mono">
                Key Platform Concepts
              </h4>
              {selectedTopic.keyConcepts.map((concept, i) => (
                <div key={i} className="rounded-xl border border-line bg-inset p-3">
                  <span className="text-xs font-bold text-sky-ink">{concept.title}</span>
                  <p className="text-xs text-muted mt-0.5">{concept.explanation}</p>
                </div>
              ))}
            </div>

            {/* Quick Commands */}
            {selectedTopic.commands.length > 0 && (
              <div className="my-4">
                <h4 className="text-xs font-semibold text-body uppercase tracking-wider font-mono">
                  Essential Commands
                </h4>
                <div className="mt-2 space-y-1.5">
                  {selectedTopic.commands.slice(0, 3).map((cmd, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-inset p-2 font-mono text-xs text-emerald-ink border border-line"
                    >
                      {cmd.cmd}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-line flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleToggleDone(e, selectedTopic.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                  completedMap[selectedTopic.id]
                    ? 'bg-emerald-soft text-emerald-ink border border-emerald-line'
                    : 'bg-subtle text-ink hover:bg-selected'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {completedMap[selectedTopic.id] ? 'Completed ✓' : 'Mark Complete'}
              </button>

              <Link
                href={`/topics/${selectedTopic.slug}`}
                className="flex items-center gap-2 rounded-xl bg-sky-fill hover:bg-sky-fill px-5 py-2.5 text-xs font-semibold text-ink transition-colors shadow-sm"
              >
                <BookOpen className="h-4 w-4" />
                Open Full Study Guide
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
