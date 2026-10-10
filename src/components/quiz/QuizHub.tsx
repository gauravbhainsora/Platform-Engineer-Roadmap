'use client';

import { PILLARS, getTopicsByPillar } from '@/data';
import { sampleQuestions } from '@/lib/quiz';
import { saveQuizScore } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import { PillarId, QuizQuestion } from '@/types';
import { ArrowRight, Award, BookOpen, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function QuizHub() {
  const [selectedPillarId, setSelectedPillarId] = useState<PillarId>('linux');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(() => getTopicsByPillar('linux').flatMap((topic) => topic.quiz).slice(0, 10));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctScore, setCorrectScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const { quizScores } = useProgress();
  const [saveError, setSaveError] = useState('');

  const startQuizForPillar = (pillarId: PillarId) => {
    setSelectedPillarId(pillarId);
    const topics = getTopicsByPillar(pillarId);
    const allPillarQuestions: QuizQuestion[] = [];
    topics.forEach((t) => {
      allPillarQuestions.push(...t.quiz);
    });

    // Shuffle and pick 10 questions max
    const selected = sampleQuestions(allPillarQuestions);
    setActiveQuestions(selected);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectScore(0);
    setQuizFinished(false);
    setSaveError('');
  };

  const currentQ = activeQuestions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.answerIndex) {
      setCorrectScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!isAnswerSubmitted || quizFinished) return;
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      if (!saveQuizScore(selectedPillarId, correctScore, activeQuestions.length)) {
        setSaveError('Your result could not be saved. Browser storage is unavailable or full.');
      }
    }
  };

  const currentPillar = PILLARS.find((p) => p.id === selectedPillarId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-line bg-amber-soft px-3 py-1 text-xs font-medium text-amber-ink mb-3">
          <Award className="h-3.5 w-3.5 text-amber-ink" />
          Technical Assessment Center
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Platform Engineer Knowledge Checks
        </h1>
        <p className="mt-2 text-sm sm:text-base text-body">
          Validate your mastery across Linux, Containers, Networking, Cloud, CI/CD, and SRE with instant explanations.
        </p>
      </div>

      {/* Pillar Selection Tabs */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PILLARS.map((p) => {
          const isSelected = p.id === selectedPillarId;
          const prevScore = quizScores[p.id];

          return (
            <button
              key={p.id}
              onClick={() => startQuizForPillar(p.id)}
              className={`rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-sky-line bg-sky-tint shadow-sm'
                  : 'border-line bg-surface hover:border-line'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-ink">{p.name}</span>
                {prevScore && (
                  <span className="text-xs font-mono text-emerald-ink font-semibold">
                    {prevScore.score}/{prevScore.total}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted line-clamp-1">{p.totalTopics} Topics</p>
            </button>
          );
        })}
      </div>

      {/* Quiz Area */}
      {currentQ && !quizFinished && (
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
            <div>
              <span className="text-xs font-semibold text-sky-ink">
                {currentPillar?.name} Knowledge Check
              </span>
              <h3 className="text-sm text-muted">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </h3>
            </div>
            <span className="text-sm font-semibold text-body">
              Score: {correctScore}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-ink mb-6 leading-snug">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              let style = 'border-line bg-inset text-ink hover:border-line';

              if (isAnswerSubmitted) {
                if (i === currentQ.answerIndex) {
                  style = 'border-emerald-line bg-emerald-tint text-emerald-ink font-bold';
                } else if (isSelected) {
                  style = 'border-rose-line bg-rose-tint text-rose-ink';
                }
              } else if (isSelected) {
                style = 'border-sky-line bg-sky-tint text-sky-ink font-bold';
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full rounded-xl border p-4 text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && i === currentQ.answerIndex && (
                    <span className="text-emerald-ink font-bold text-xs">✓ Correct</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswerSubmitted && (
            <div className="mb-6 rounded-xl border border-line bg-inset p-4 text-xs sm:text-sm text-body animate-fade-in">
              <strong className={selectedOption === currentQ.answerIndex ? 'text-emerald-ink' : 'text-rose-ink'}>
                {selectedOption === currentQ.answerIndex ? 'Great job! ' : 'Explanation: '}
              </strong>
              {currentQ.explanation}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="rounded-xl bg-sky-fill px-6 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:bg-sky-fill disabled:opacity-50 transition-colors shadow-sm"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 rounded-xl bg-sky-fill px-6 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:bg-sky-fill transition-colors shadow-sm"
              >
                <span>{currentQuestionIndex < activeQuestions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Finished Summary */}
      {quizFinished && (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-soft border border-amber-line text-amber-ink mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-ink">Quiz Completed!</h2>
          {saveError && <p role="alert" className="text-sm text-rose-ink">{saveError}</p>}
          <p className="mt-1 text-sm text-body">
            You scored {correctScore} out of {activeQuestions.length} on the {currentPillar?.name} assessment.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => startQuizForPillar(selectedPillarId)}
              className="flex items-center gap-2 rounded-xl border border-line bg-subtle px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:bg-selected transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Quiz
            </button>
            <Link
              href={`/#pillar-${selectedPillarId}`}
              className="flex items-center gap-2 rounded-xl bg-sky-fill px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:bg-sky-fill transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Study Topics on Roadmap
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
