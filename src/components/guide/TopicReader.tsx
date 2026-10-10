'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Bookmark,
  Star,
  Copy,
  Check,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Terminal,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Edit3,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TopicItem } from '@/types';
import { getPillarById, getNextTopic, getPreviousTopic } from '@/data';
import {
  getStoredProgress,
  toggleTopicCompletion,
  toggleTopicBookmark,
  saveTopicNote,
  saveQuizScore,
} from '@/lib/storage';

interface TopicReaderProps {
  topic: TopicItem;
}

export function TopicReader({ topic }: TopicReaderProps) {
  const pillar = getPillarById(topic.pillarId);
  const nextTopic = getNextTopic(topic.slug);
  const prevTopic = getPreviousTopic(topic.slug);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const progress = getStoredProgress();
    setIsCompleted(!!progress.completedTopics[topic.id]);
    setIsBookmarked(!!progress.bookmarkedTopics[topic.id]);
    setNoteText(progress.notes[topic.id] || '');
  }, [topic.id]);

  const handleToggleComplete = () => {
    const next = toggleTopicCompletion(topic.id);
    setIsCompleted(next);
  };

  const handleToggleBookmark = () => {
    const next = toggleTopicBookmark(topic.id);
    setIsBookmarked(next);
  };

  const handleSaveNote = (text: string) => {
    setNoteText(text);
    saveTopicNote(topic.id, text);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    let correct = 0;
    topic.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.answerIndex) {
        correct++;
      }
    });
    saveQuizScore(topic.id, correct, topic.quiz.length);
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/" className="hover:text-sky-400 transition-colors">
          Roadmap
        </Link>
        <span>/</span>
        <Link
          href={`/#pillar-${topic.pillarId}`}
          className="text-slate-300 hover:text-sky-400 transition-colors"
        >
          {pillar?.name || topic.pillarId}
        </Link>
        <span>/</span>
        <span className="text-sky-400 font-semibold">{topic.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: pillar?.bgHex || '#0284c7' }}
            >
              {pillar?.name}
            </span>
            <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
              {topic.level}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              ⏱ {topic.estimatedMinutes} min read
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                isBookmarked
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Star className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  : 'border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isCompleted ? 'Completed ✓' : 'Mark Complete'}
            </button>
            <button
              onClick={() => setIsNoteDrawerOpen(!isNoteDrawerOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Notes
            </button>
          </div>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {topic.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          {topic.subtitle}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-950/80 px-2.5 py-0.5 text-xs text-slate-400 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Personal Notes Drawer */}
      {isNoteDrawerOpen && (
        <div className="my-6 rounded-2xl border border-sky-500/30 bg-slate-900 p-5 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Your Personal Topic Notes</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Auto-saved to local browser</span>
          </div>
          <textarea
            value={noteText}
            onChange={(e) => handleSaveNote(e.target.value)}
            placeholder="Jot down notes, personal reminders, or questions to revisit..."
            rows={4}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>
      )}

      {/* Section 1: Conceptual Overview */}
      <section className="my-10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
          <BookOpen className="h-5 w-5 text-sky-400" />
          1. Architecture & Core Concepts
        </h2>
        <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed sm:leading-7 text-sm sm:text-base space-y-4">
          {topic.overview.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Section 2: Architecture Diagram */}
      {topic.diagram && (
        <section className="my-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-sky-400" />
              Architecture Diagram: {topic.diagram.title}
            </h3>
            <button
              onClick={() => copyToClipboard(topic.diagram!.code, 'diagram')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
            >
              {copiedIndex === 'diagram' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedIndex === 'diagram' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-sky-300 shadow-inner">
            <pre>{topic.diagram.code}</pre>
          </div>
        </section>
      )}

      {/* Section 3: Key Concepts Breakdown */}
      <section className="my-10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          2. Under The Hood: Core Mechanics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topic.keyConcepts.map((concept, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-700 transition-colors"
            >
              <h3 className="text-sm font-semibold text-white">{concept.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {concept.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Production Commands */}
      {topic.commands.length > 0 && (
        <section className="my-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            3. Production CLI Command Reference
          </h2>
          <div className="space-y-3">
            {topic.commands.map((cmd, i) => (
              <div
                key={i}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-emerald-400 font-semibold truncate">
                    <span>$</span>
                    <span className="truncate">{cmd.cmd}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{cmd.desc}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(cmd.cmd, `cmd-${i}`)}
                  className="self-end sm:self-center shrink-0 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                >
                  {copiedIndex === `cmd-${i}` ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedIndex === `cmd-${i}` ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 5: Production Configuration Snippet */}
      {topic.productionCode && (
        <section className="my-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
            <Terminal className="h-5 w-5 text-indigo-400" />
            4. Production Configuration & Automation
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
              <span className="font-mono text-xs text-sky-400 font-semibold">
                {topic.productionCode.filename} ({topic.productionCode.language})
              </span>
              <button
                onClick={() => copyToClipboard(topic.productionCode.code, 'snippet')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono"
              >
                {copiedIndex === 'snippet' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedIndex === 'snippet' ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div className="overflow-x-auto p-4 font-mono text-xs text-slate-200">
              <pre>{topic.productionCode.code}</pre>
            </div>
            <div className="border-t border-slate-800 bg-slate-900/50 p-3.5 text-xs text-slate-400">
              💡 <span className="font-semibold text-slate-300">Rationale:</span> {topic.productionCode.explanation}
            </div>
          </div>
        </section>
      )}

      {/* Section 6: Production Gotchas & Pitfalls */}
      {topic.gotchas.length > 0 && (
        <section className="my-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            5. Production Gotchas & Common Pitfalls
          </h2>
          <div className="space-y-3">
            {topic.gotchas.map((gotcha, i) => (
              <div
                key={i}
                className="rounded-xl border border-rose-900/30 bg-rose-950/20 p-4 border-l-4 border-l-rose-500"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase text-rose-300">
                    {gotcha.severity}
                  </span>
                  <h3 className="text-sm font-semibold text-rose-200">{gotcha.issue}</h3>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  <strong className="text-emerald-400 font-semibold">Resolution: </strong>
                  {gotcha.resolution}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 7: Senior Platform Interview Questions */}
      {topic.interviewQuestions.length > 0 && (
        <section className="my-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
            <HelpCircle className="h-5 w-5 text-purple-400" />
            6. Senior Platform Engineer Interview Questions
          </h2>
          <div className="space-y-4">
            {topic.interviewQuestions.map((qna, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-white">
                  Q: {qna.question}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  <strong className="text-sky-400 font-semibold">Answer: </strong>
                  {qna.answer}
                </p>
                <div className="mt-3 rounded-lg bg-slate-950/80 p-2.5 text-xs text-slate-400 border border-slate-800">
                  💡 <strong className="text-slate-300">Context:</strong> {qna.platformContext}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 8: Interactive Topic Quiz */}
      {topic.quiz.length > 0 && (
        <section className="my-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-amber-400" />
            7. Interactive Knowledge Check
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Test your understanding before advancing to the next topic.
          </p>

          <div className="space-y-6">
            {topic.quiz.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.answerIndex;

              return (
                <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <h4 className="text-sm font-semibold text-slate-100">
                    {qIndex + 1}. {q.question}
                  </h4>

                  <div className="mt-3 space-y-2">
                    {q.options.map((option, optIdx) => {
                      const isChosen = selected === optIdx;
                      let btnStyle = 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700';

                      if (quizSubmitted) {
                        if (optIdx === q.answerIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-300';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-sky-500 bg-sky-950/40 text-sky-300 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`w-full text-left rounded-lg border p-2.5 text-xs sm:text-sm transition-all ${btnStyle}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-3 rounded-lg bg-slate-900 p-3 text-xs text-slate-300 border border-slate-800">
                      <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                        {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 disabled:opacity-50 transition-colors shadow-sm"
              >
                Submit Answers & Check Mastery
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Retry Quiz
              </button>
            )}
          </div>
        </section>
      )}

      {/* Section 9: References & Authoritative Sources */}
      {topic.references.length > 0 && (
        <section className="my-10">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Authoritative References & Documentation
          </h3>
          <div className="flex flex-wrap gap-2">
            {topic.references.map((ref, i) => (
              <a
                key={i}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-sky-400 hover:border-sky-500 hover:bg-slate-850 transition-colors shadow-sm"
              >
                <span>{ref.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">({ref.source})</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Pagination Footer */}
      <footer className="mt-12 border-t border-slate-800 pt-6 flex items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/topics/${prevTopic.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Previous Topic</span>
              <p className="text-xs font-bold text-slate-200 group-hover:text-sky-400">{prevTopic.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <Link
            href={`/topics/${nextTopic.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 hover:border-slate-700 transition-colors ml-auto"
          >
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Next Topic</span>
              <p className="text-xs font-bold text-slate-200 group-hover:text-sky-400">{nextTopic.title}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </footer>
    </article>
  );
}
