'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Bookmark,
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Filter,
  Eye,
  Check,
  BookOpen,
  ArrowDown,
  Layers,
  Terminal,
  Network,
  ShieldCheck,
  Box,
  Cloud,
  GitMerge,
  Boxes,
  Activity,
  X,
  Zap,
} from 'lucide-react';
import { PILLARS, getTopicsByPillar } from '@/data';
import { PillarMeta, TopicItem } from '@/types';
import { getStoredProgress, toggleTopicCompletion, toggleTopicBookmark } from '@/lib/storage';

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
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'bookmarked'>('all');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);

  useEffect(() => {
    const syncProgress = () => {
      const progress = getStoredProgress();
      setCompletedMap({ ...progress.completedTopics });
      setBookmarkedMap({ ...progress.bookmarkedTopics });
    };

    syncProgress();
    window.addEventListener('platform-roadmap-progress-updated', syncProgress);
    return () => window.removeEventListener('platform-roadmap-progress-updated', syncProgress);
  }, []);

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
      <div className="mx-auto max-w-7xl mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Visual Platform Engineer Mindmap
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 8-Pillar Flow Chart • Click any node to study
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterMode === 'all'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setFilterMode('incomplete')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterMode === 'incomplete'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              To Learn
            </button>
            <button
              onClick={() => setFilterMode('bookmarked')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterMode === 'bookmarked'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
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
                className="relative w-full my-6 flex flex-col lg:flex-row items-center justify-between gap-6 scroll-mt-24"
              >
                {/* LEFT BRANCH NODES */}
                <div className="w-full lg:w-[42%] flex flex-col items-stretch lg:items-end gap-3.5 order-2 lg:order-1">
                  {leftTopics.map((topic) => {
                    const isDone = !!completedMap[topic.id];
                    const isSaved = !!bookmarkedMap[topic.id];

                    if (filterMode === 'incomplete' && isDone) return null;
                    if (filterMode === 'bookmarked' && !isSaved) return null;

                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className={`mindmap-node-pill group relative w-full lg:max-w-md cursor-pointer rounded-xl border p-3 text-left transition-all backdrop-blur-sm ${
                          isDone
                            ? 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/60'
                            : 'border-slate-800 bg-slate-900/80 hover:border-sky-500/50 hover:bg-slate-850'
                        }`}
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: isDone ? '#10b981' : pillar.borderHex,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                              )}
                              <h4
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  isDone ? 'text-emerald-300 line-through' : 'text-slate-100 group-hover:text-sky-300'
                                }`}
                              >
                                {topic.title}
                              </h4>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                              {topic.subtitle}
                            </p>
                          </div>

                          {/* Action icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleToggleBookmark(e, topic.id)}
                              title={isSaved ? 'Remove bookmark' : 'Bookmark topic'}
                              className={`rounded p-1 transition-colors ${
                                isSaved
                                  ? 'text-amber-400 hover:text-amber-300'
                                  : 'text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleToggleDone(e, topic.id)}
                              title={isDone ? 'Mark incomplete' : 'Mark completed'}
                              className={`rounded p-1 transition-colors ${
                                isDone
                                  ? 'text-emerald-400 hover:text-emerald-300'
                                  : 'text-slate-600 hover:text-emerald-400'
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
                                className="rounded bg-slate-950 px-1.5 py-0.5 text-[9px] font-mono text-slate-400"
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
                <div className="w-full lg:w-[16%] flex flex-col items-center justify-center order-1 lg:order-2 shrink-0">
                  <div
                    className="relative flex flex-col items-center justify-center rounded-2xl border-2 px-5 py-4 text-center shadow-xl transition-transform hover:scale-105 cursor-pointer"
                    style={{
                      borderColor: pillar.borderHex,
                      backgroundColor: `${pillar.borderHex}15`,
                      boxShadow: `0 0 25px ${pillar.borderHex}25`,
                    }}
                    onClick={() => {
                      const first = topics[0];
                      if (first) setSelectedTopic(first);
                    }}
                  >
                    <div
                      className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                      style={{ backgroundColor: pillar.bgHex }}
                    >
                      {PILLAR_ICONS[pillar.icon] || <Layers className="h-5 w-5" />}
                    </div>
                    <span className="text-base font-extrabold text-white tracking-wide">
                      {pillar.name}
                    </span>
                    <span className="mt-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300 bg-slate-900/90 border border-slate-700">
                      {pillarCompletedCount}/{topics.length} Done
                    </span>
                    {isPillarMastered && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs shadow-lg font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT BRANCH NODES */}
                <div className="w-full lg:w-[42%] flex flex-col items-stretch lg:items-start gap-3.5 order-3">
                  {rightTopics.map((topic) => {
                    const isDone = !!completedMap[topic.id];
                    const isSaved = !!bookmarkedMap[topic.id];

                    if (filterMode === 'incomplete' && isDone) return null;
                    if (filterMode === 'bookmarked' && !isSaved) return null;

                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className={`mindmap-node-pill group relative w-full lg:max-w-md cursor-pointer rounded-xl border p-3 text-left transition-all backdrop-blur-sm ${
                          isDone
                            ? 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/60'
                            : 'border-slate-800 bg-slate-900/80 hover:border-sky-500/50 hover:bg-slate-850'
                        }`}
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: isDone ? '#10b981' : pillar.borderHex,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                              )}
                              <h4
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  isDone ? 'text-emerald-300 line-through' : 'text-slate-100 group-hover:text-sky-300'
                                }`}
                              >
                                {topic.title}
                              </h4>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                              {topic.subtitle}
                            </p>
                          </div>

                          {/* Action icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleToggleBookmark(e, topic.id)}
                              title={isSaved ? 'Remove bookmark' : 'Bookmark topic'}
                              className={`rounded p-1 transition-colors ${
                                isSaved
                                  ? 'text-amber-400 hover:text-amber-300'
                                  : 'text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleToggleDone(e, topic.id)}
                              title={isDone ? 'Mark incomplete' : 'Mark completed'}
                              className={`rounded p-1 transition-colors ${
                                isDone
                                  ? 'text-emerald-400 hover:text-emerald-300'
                                  : 'text-slate-600 hover:text-emerald-400'
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
                                className="rounded bg-slate-950 px-1.5 py-0.5 text-[9px] font-mono text-slate-400"
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

              {/* VERTICAL SPINE CONNECTOR ARROW */}
              {pillarIndex < PILLARS.length - 1 && (
                <div className="my-2 flex flex-col items-center">
                  <div className="h-10 w-0.5 bg-gradient-to-b from-sky-400 to-indigo-500" />
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                    <ArrowDown className="h-3 w-3" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* QUICK PREVIEW SLIDE-OVER MODAL */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in p-4 sm:p-6">
          <div className="relative h-full max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-850 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase font-mono font-semibold text-sky-400">
                  {selectedTopic.pillarId} Pillar • {selectedTopic.level}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedTopic.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Summary */}
            <div className="my-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Overview Summary
              </h4>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Key Concepts Preview */}
            <div className="my-4 space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Key Platform Concepts
              </h4>
              {selectedTopic.keyConcepts.map((concept, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span className="text-xs font-bold text-sky-300">{concept.title}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{concept.explanation}</p>
                </div>
              ))}
            </div>

            {/* Quick Commands */}
            {selectedTopic.commands.length > 0 && (
              <div className="my-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Essential Commands
                </h4>
                <div className="mt-2 space-y-1.5">
                  {selectedTopic.commands.slice(0, 3).map((cmd, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-slate-950 p-2 font-mono text-xs text-emerald-400 border border-slate-800"
                    >
                      {cmd.cmd}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleToggleDone(e, selectedTopic.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                  completedMap[selectedTopic.id]
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {completedMap[selectedTopic.id] ? 'Completed ✓' : 'Mark Complete'}
              </button>

              <Link
                href={`/topics/${selectedTopic.slug}`}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:opacity-95 shadow-lg shadow-sky-500/20 transition-all"
              >
                <BookOpen className="h-4 w-4" />
                Open Full Study Guide
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
