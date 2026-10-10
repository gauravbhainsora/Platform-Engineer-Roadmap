'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, RotateCcw, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { PILLARS, getTopicsByPillar } from '@/data';
import { PillarId, PillarMeta, QuizQuestion } from '@/types';
import { getStoredProgress, saveQuizScore } from '@/lib/storage';

export function QuizHub() {
  const [selectedPillarId, setSelectedPillarId] = useState<PillarId>('linux');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctScore, setCorrectScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; total: number }>>({});

  useEffect(() => {
    const progress = getStoredProgress();
    setQuizScores({ ...progress.quizScores });
  }, []);

  const startQuizForPillar = (pillarId: PillarId) => {
    setSelectedPillarId(pillarId);
    const topics = getTopicsByPillar(pillarId);
    const allPillarQuestions: QuizQuestion[] = [];
    topics.forEach((t) => {
      allPillarQuestions.push(...t.quiz);
    });

    // Shuffle and pick 10 questions max
    const selected = allPillarQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    setActiveQuestions(selected);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectScore(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    startQuizForPillar(selectedPillarId);
  }, []);

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
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      const finalScore = selectedOption === currentQ.answerIndex ? correctScore + 1 : correctScore;
      saveQuizScore(selectedPillarId, finalScore, activeQuestions.length);
      const progress = getStoredProgress();
      setQuizScores({ ...progress.quizScores });
    }
  };

  const currentPillar = PILLARS.find((p) => p.id === selectedPillarId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-mono font-semibold text-amber-400 mb-3">
          <Award className="h-3.5 w-3.5" />
          Technical Assessment Center
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Platform Engineer Knowledge Checks
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
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
                  ? 'border-sky-500 bg-sky-950/30 shadow-lg shadow-sky-500/10'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{p.name}</span>
                {prevScore && (
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {prevScore.score}/{prevScore.total}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{p.totalTopics} Topics</p>
            </button>
          );
        })}
      </div>

      {/* Quiz Area */}
      {currentQ && !quizFinished && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-sky-400">
                {currentPillar?.name} Knowledge Check
              </span>
              <h3 className="text-sm text-slate-400">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </h3>
            </div>
            <span className="text-sm font-mono font-bold text-slate-300">
              Score: {correctScore}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              let style = 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (i === currentQ.answerIndex) {
                  style = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold';
                } else if (isSelected) {
                  style = 'border-rose-500 bg-rose-950/40 text-rose-300';
                }
              } else if (isSelected) {
                style = 'border-sky-500 bg-sky-950/40 text-sky-300 font-bold';
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
                    <span className="text-emerald-400 font-bold text-xs">✓ Correct</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswerSubmitted && (
            <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs sm:text-sm text-slate-300 animate-fade-in">
              <strong className={selectedOption === currentQ.answerIndex ? 'text-emerald-400' : 'text-rose-400'}>
                {selectedOption === currentQ.answerIndex ? 'Great job! ' : 'Explanation: '}
              </strong>
              {currentQ.explanation}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:opacity-95 disabled:opacity-50 transition-all shadow-md"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:opacity-95 transition-all shadow-md"
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
          <p className="mt-1 text-sm text-slate-400">
            You scored {correctScore} out of {activeQuestions.length} on the {currentPillar?.name} assessment.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => startQuizForPillar(selectedPillarId)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Quiz
            </button>
            <Link
              href={`/#pillar-${selectedPillarId}`}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:opacity-95 transition-all"
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
