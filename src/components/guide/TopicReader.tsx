'use client';

import { getNextTopic, getPillarById, getPreviousTopic } from '@/data';
import {
  saveQuizScore,
  saveTopicNote,
  toggleTopicBookmark,
  toggleTopicCompletion,
} from '@/lib/storage';
import { useClipboard } from '@/lib/useClipboard';
import { useProgress } from '@/lib/useProgress';
import { TopicItem } from '@/types';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Star,
  Terminal
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GuideContent, InlineGuideText } from './GuideContent';
import { GuideSectionNav } from './GuideSectionNav';

interface TopicReaderProps {
  topic: TopicItem;
}

export function TopicReader({ topic }: TopicReaderProps) {
  const pillar = getPillarById(topic.pillarId);
  const nextTopic = getNextTopic(topic.slug);
  const prevTopic = getPreviousTopic(topic.slug);
  const sections = [
    { id: 'architecture-core-concepts', label: 'Overview' },
    ...(topic.diagram ? [{ id: 'architecture-diagram', label: 'Diagram' }] : []),
    { id: 'core-mechanics', label: 'Mechanics' },
    ...(topic.commands.length ? [{ id: 'command-reference', label: 'Commands' }] : []),
    ...(topic.productionCode ? [{ id: 'production-configuration', label: 'Configuration' }] : []),
    ...(topic.gotchas.length ? [{ id: 'production-pitfalls', label: 'Pitfalls' }] : []),
    ...(topic.interviewQuestions.length ? [{ id: 'interview-questions', label: 'Interview' }] : []),
    ...(topic.quiz.length ? [{ id: 'knowledge-check', label: 'Quiz' }] : []),
    ...(topic.references.length ? [{ id: 'guide-references', label: 'References' }] : []),
  ];

  const progress = useProgress();
  const isCompleted = !!progress.completedTopics[topic.id];
  const isBookmarked = !!progress.bookmarkedTopics[topic.id];
  const storedNote = progress.notes[topic.id] || '';
  const [noteDraft, setNoteDraft] = useState<{ topicId: string; baseNote: string; text: string } | null>(null);
  const noteText = noteDraft?.topicId === topic.id && noteDraft.baseNote === storedNote ? noteDraft.text : storedNote;
  const [noteError, setNoteError] = useState('');
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const { copy, copiedId: copiedIndex, copyError } = useClipboard();

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleToggleComplete = () => {
    toggleTopicCompletion(topic.id);
  };

  const handleToggleBookmark = () => {
    toggleTopicBookmark(topic.id);
  };

  const handleSaveNote = (text: string) => {
    if (saveTopicNote(topic.id, text)) { setNoteDraft(null); setNoteError(''); }
    else { setNoteDraft({ topicId: topic.id, baseNote: storedNote, text }); setNoteError('Could not save your note. Browser storage is unavailable or full.'); }
  };

  const copyToClipboard = (text: string, id: string) => copy(text, id);

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
      {copyError && <p role="alert" className="text-sm text-rose-ink">{copyError}</p>}
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
        <Link href="/" className="hover:text-sky-ink transition-colors">
          Roadmap
        </Link>
        <span>/</span>
        <Link
          href={`/#pillar-${topic.pillarId}`}
          className="text-body hover:text-sky-ink transition-colors"
        >
          {pillar?.name || topic.pillarId}
        </Link>
        <span>/</span>
        <span className="text-sky-ink font-semibold">{topic.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="relative rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-semibold text-ink"
              style={{ backgroundColor: `var(--color-${pillar?.color || 'sky'}-soft)`, color: `var(--color-${pillar?.color || 'sky'}-ink)` }}
            >
              {pillar?.name}
            </span>
            <span className="rounded-md bg-subtle px-2.5 py-1 text-xs font-medium text-body">
              {topic.level}
            </span>
            <span className="text-xs text-muted font-normal">
              ⏱ {topic.estimatedMinutes} min read
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                isBookmarked
                  ? 'border-amber-line bg-amber-soft text-amber-ink'
                  : 'border-line bg-surface text-muted hover:text-ink'
              }`}
            >
              <Star className={`h-4 w-4 ${isBookmarked ? 'fill-amber-ink' : ''}`} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'border-emerald-line bg-emerald-soft text-emerald-ink'
                  : 'border-sky-line bg-sky-soft text-sky-ink hover:bg-sky-soft'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isCompleted ? 'Completed ✓' : 'Mark Complete'}
            </button>
            <button
              onClick={() => setIsNoteDrawerOpen(!isNoteDrawerOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs text-muted hover:text-ink transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Notes
            </button>
          </div>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          {topic.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-body leading-relaxed font-normal">
          {topic.subtitle}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-inset px-2.5 py-0.5 text-xs text-muted border border-line"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <GuideSectionNav sections={sections} />

      {/* Personal Notes Drawer */}
      {isNoteDrawerOpen && (
        <div className="my-6 rounded-2xl border border-sky-line bg-surface p-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-sky-ink" />
              <h3 className="text-sm font-bold text-ink">Your Personal Topic Notes</h3>
            </div>
            <span className="text-xs text-muted font-mono">Auto-saved to local browser</span>
          </div>
          {noteError && <p role="alert" className="text-xs text-rose-ink mb-2">{noteError}</p>}
          <textarea
            aria-label="Personal topic notes"
            value={noteText}
            onChange={(e) => handleSaveNote(e.target.value)}
            placeholder="Jot down notes, personal reminders, or questions to revisit..."
            rows={4}
            className="w-full rounded-xl border border-line bg-inset p-3 text-xs sm:text-sm text-ink placeholder-muted focus:border-sky-line focus-visible:outline-2 focus-visible:outline-focus"
          />
        </div>
      )}

      {/* Section 1: Conceptual Overview */}
      <section id="architecture-core-concepts" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
        <h2 className="text-lg font-bold text-ink flex items-start gap-3 mb-6 border-b border-line pb-3 sm:text-xl">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-sky-ink" aria-hidden="true" />
          1. Architecture & Core Concepts
        </h2>
        <GuideContent text={topic.overview} />
      </section>

      {/* Section 2: Architecture Diagram */}
      {topic.diagram && (
        <section id="architecture-diagram" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Terminal className="h-4 w-4 text-sky-ink" />
              Architecture Diagram: {topic.diagram.title}
            </h3>
            <button
              onClick={() => copyToClipboard(topic.diagram!.code, 'diagram')}
              className="text-xs text-muted hover:text-ink flex items-center gap-1 font-mono"
            >
              {copiedIndex === 'diagram' ? <Check className="h-3.5 w-3.5 text-emerald-ink" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedIndex === 'diagram' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-line bg-inset p-4 font-mono text-xs text-sky-ink shadow-inner">
            <pre>{topic.diagram.code}</pre>
          </div>
        </section>
      )}

      {/* Section 3: Key Concepts Breakdown */}
      <section id="core-mechanics" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
        <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-4 border-b border-line pb-2">
          <Sparkles className="h-5 w-5 text-amber-ink" />
          2. Under The Hood: Core Mechanics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topic.keyConcepts.map((concept, i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-surface p-5 hover:border-line transition-colors"
            >
              <h3 className="text-base font-semibold text-ink">{concept.title}</h3>
              <p className="mt-2 text-sm sm:text-base text-body leading-relaxed font-normal">
                <InlineGuideText text={concept.explanation} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Production Commands */}
      {topic.commands.length > 0 && (
        <section id="command-reference" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-4 border-b border-line pb-2">
            <Terminal className="h-5 w-5 text-emerald-ink" />
            3. Production CLI Command Reference
          </h2>
          <div className="space-y-3">
            {topic.commands.map((cmd, i) => (
              <div
                key={i}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-line bg-inset p-3.5 hover:border-line transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 font-mono text-sm leading-6 text-emerald-ink font-semibold">
                    <span aria-hidden="true" className="shrink-0 select-none">$</span>
                    <code className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">{cmd.cmd}</code>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-body"><InlineGuideText text={cmd.desc} /></p>
                </div>
                <button
                  onClick={() => copyToClipboard(cmd.cmd, `cmd-${i}`)}
                  aria-label={`Copy command: ${cmd.cmd}`}
                  className="self-end sm:self-center min-h-11 shrink-0 flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-mono text-body hover:text-ink hover:border-line transition-colors"
                >
                  {copiedIndex === `cmd-${i}` ? (
                    <Check className="h-3.5 w-3.5 text-emerald-ink" />
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
        <section id="production-configuration" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-4 border-b border-line pb-2">
            <Terminal className="h-5 w-5 text-indigo-ink" />
            4. Production Configuration & Automation
          </h2>
          <div className="overflow-hidden rounded-2xl border border-line bg-inset shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
              <span className="min-w-0 font-mono text-sm text-sky-ink font-semibold [overflow-wrap:anywhere]">
                {topic.productionCode.filename} ({topic.productionCode.language})
              </span>
              <button
                onClick={() => copyToClipboard(topic.productionCode.code, 'snippet')}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-ink font-mono"
              >
                {copiedIndex === 'snippet' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-ink" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedIndex === 'snippet' ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div className="overflow-x-auto p-4 font-mono text-sm leading-6 text-ink">
              <pre>{topic.productionCode.code}</pre>
            </div>
            <div className="border-t border-line bg-surface p-4 text-sm leading-relaxed text-body">
              <span className="font-semibold text-ink">Rationale: </span><InlineGuideText text={topic.productionCode.explanation} />
            </div>
          </div>
        </section>
      )}

      {/* Section 6: Production Gotchas & Pitfalls */}
      {topic.gotchas.length > 0 && (
        <section id="production-pitfalls" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-4 border-b border-line pb-2">
            <AlertTriangle className="h-5 w-5 text-rose-ink" />
            5. Production Gotchas & Common Pitfalls
          </h2>
          <div className="space-y-3">
            {topic.gotchas.map((gotcha, i) => (
              <div
                key={i}
                className="rounded-xl border border-rose-line bg-rose-tint p-4 border-l-4 border-l-rose-500"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <span className="rounded bg-rose-soft px-2 py-0.5 text-xs font-semibold uppercase text-rose-ink">
                    {gotcha.severity}
                  </span>
                  <h3 className="text-sm font-semibold text-rose-ink">{gotcha.issue}</h3>
                </div>
                <p className="mt-2 text-sm sm:text-base text-body leading-relaxed font-normal">
                  <strong className="text-emerald-ink font-semibold">Resolution: </strong>
                  <InlineGuideText text={gotcha.resolution} />
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 7: Senior Platform Interview Questions */}
      {topic.interviewQuestions.length > 0 && (
        <section id="interview-questions" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-4 border-b border-line pb-2">
            <HelpCircle className="h-5 w-5 text-purple-ink" />
            6. Senior Platform Engineer Interview Questions
          </h2>
          <div className="space-y-4">
            {topic.interviewQuestions.map((qna, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-surface p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold leading-relaxed text-ink">
                  Q: <InlineGuideText text={qna.question} />
                </h3>
                <p className="mt-2 text-sm sm:text-base text-body leading-relaxed font-normal">
                  <strong className="text-sky-ink font-semibold">Answer: </strong>
                  <InlineGuideText text={qna.answer} />
                </p>
                <div className="mt-3 rounded-lg bg-inset p-3 text-sm leading-relaxed text-body border border-line">
                  <strong className="text-ink">Context: </strong><InlineGuideText text={qna.platformContext} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 8: Interactive Topic Quiz */}
      {topic.quiz.length > 0 && (
        <section id="knowledge-check" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56 rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-amber-ink" />
            7. Interactive Knowledge Check
          </h2>
          <p className="text-xs text-muted mb-6">
            Test your understanding before advancing to the next topic.
          </p>

          <div className="space-y-6">
            {topic.quiz.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.answerIndex;

              return (
                <div key={q.id} className="rounded-xl border border-line bg-inset p-4">
                  <h4 className="text-sm font-semibold text-ink">
                    {qIndex + 1}. {q.question}
                  </h4>

                  <div className="mt-3 space-y-2">
                    {q.options.map((option, optIdx) => {
                      const isChosen = selected === optIdx;
                      let btnStyle = 'border-line bg-surface text-body hover:border-line';

                      if (quizSubmitted) {
                        if (optIdx === q.answerIndex) {
                          btnStyle = 'border-emerald-line bg-emerald-tint text-emerald-ink font-semibold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'border-rose-line bg-rose-tint text-rose-ink';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-sky-line bg-sky-tint text-sky-ink font-semibold';
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
                    <div className="mt-3 rounded-lg bg-surface p-3 text-xs text-body border border-line">
                      <strong className={isCorrect ? 'text-emerald-ink' : 'text-rose-ink'}>
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
                className="w-full rounded-xl bg-sky-fill hover:bg-sky-fill py-2.5 text-xs sm:text-sm font-semibold text-ink disabled:opacity-50 transition-colors shadow-sm"
              >
                Submit Answers & Check Mastery
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                }}
                className="w-full rounded-xl border border-line bg-subtle py-2.5 text-xs text-body hover:bg-selected transition-colors"
              >
                Retry Quiz
              </button>
            )}
          </div>
        </section>
      )}

      {/* Section 9: References & Authoritative Sources */}
      {topic.references.length > 0 && (
        <section id="guide-references" tabIndex={-1} className="my-10 scroll-mt-48 xl:scroll-mt-56">
          <h3 className="text-sm font-semibold text-body mb-3">
            Authoritative References & Documentation
          </h3>
          <div className="flex flex-wrap gap-2">
            {topic.references.map((ref, i) => (
              <a
                key={i}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs text-sky-ink hover:border-sky-line hover:bg-hover transition-colors shadow-sm"
              >
                <span>{ref.title}</span>
                <span className="text-xs text-muted font-mono">({ref.source})</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Pagination Footer */}
      <footer className="mt-12 border-t border-line pt-6 flex items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/topics/${prevTopic.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-line bg-surface p-3 hover:border-line transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted group-hover:-translate-x-0.5 transition-transform" />
            <div className="text-left">
              <span className="text-xs text-muted uppercase font-mono">Previous Topic</span>
              <p className="text-xs font-bold text-ink group-hover:text-sky-ink">{prevTopic.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <Link
            href={`/topics/${nextTopic.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-line bg-surface p-3 hover:border-line transition-colors ml-auto"
          >
            <div className="text-right">
              <span className="text-xs text-muted uppercase font-mono">Next Topic</span>
              <p className="text-xs font-bold text-ink group-hover:text-sky-ink">{nextTopic.title}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </footer>
    </article>
  );
}
