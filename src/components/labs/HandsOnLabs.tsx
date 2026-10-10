'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Play,
  Lightbulb,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  Server,
  Layers,
  Box,
  FileCode,
  ArrowRight,
  ChevronRight,
  Award,
  Zap,
  Wrench,
  ShieldCheck,
  RefreshCw,
  Flame,
  Cpu,
} from 'lucide-react';
import { triggerConfetti } from '@/lib/storage';

import {
  LAB_CHALLENGES,
  LAB_PROGRESS_KEY,
  LabChallenge,
  CriterionResult,
  validateLabChallenge,
} from '@/data/labs';

export default function HandsOnLabs() {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const activeChallenge = LAB_CHALLENGES[activeChallengeIndex];

  // Code state per challenge
  const [userCodes, setUserCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    LAB_CHALLENGES.forEach((c) => {
      initial[c.id] = c.starterCode;
    });
    return initial;
  });

  // Solved challenges saved in localStorage
  const [solvedLabs, setSolvedLabs] = useState<Record<string, boolean>>({});

  // Validation output results
  const [results, setResults] = useState<CriterionResult[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // UI helpers
  const [hintIndex, setHintIndex] = useState(0);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(LAB_PROGRESS_KEY);
      if (saved) {
        setSolvedLabs(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading lab progress', e);
    }
  }, []);

  // Save progress helper
  const markLabCompleted = (labId: string) => {
    const updated = { ...solvedLabs, [labId]: true };
    setSolvedLabs(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LAB_PROGRESS_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('platform-roadmap-labs-updated', { detail: updated }));
      } catch (e) {
        console.error('Error saving lab progress', e);
      }
    }
  };

  // Reset results when switching tabs
  const handleSelectChallenge = (index: number) => {
    setActiveChallengeIndex(index);
    setResults([]);
    setHasValidated(false);
    setShowModelSolution(false);
    setHintIndex(0);
  };

  const currentCode = userCodes[activeChallenge.id] || activeChallenge.starterCode;

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserCodes((prev) => ({
      ...prev,
      [activeChallenge.id]: e.target.value,
    }));
    setHasValidated(false);
  };

  // Tab key indenter support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const original = textarea.value;

      const updated = original.substring(0, start) + '  ' + original.substring(end);
      setUserCodes((prev) => ({
        ...prev,
        [activeChallenge.id]: updated,
      }));

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this challenge back to original buggy code?')) {
      setUserCodes((prev) => ({
        ...prev,
        [activeChallenge.id]: activeChallenge.starterCode,
      }));
      setResults([]);
      setHasValidated(false);
      setShowModelSolution(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApplyModelSolution = () => {
    setUserCodes((prev) => ({
      ...prev,
      [activeChallenge.id]: activeChallenge.modelSolution,
    }));
    setHasValidated(false);
  };

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      const outcome = validateLabChallenge(activeChallenge.id, currentCode);

      setResults(outcome.results);
      setHasValidated(true);
      setIsValidating(false);

      if (outcome.passed) {
        triggerConfetti();
        markLabCompleted(activeChallenge.id);
      }
    }, 350);
  };

  const allPassed = hasValidated && results.length > 0 && results.every((r) => r.passed);
  const totalSolved = Object.values(solvedLabs).filter(Boolean).length;
  const progressPercent = Math.round((totalSolved / LAB_CHALLENGES.length) * 100);

  // Line numbers calculation
  const lineCount = currentCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c121e] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-mono font-semibold text-sky-400 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Interactive Incident Labs</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Production Scenario Labs
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              Solve real-world platform engineering outages: debug Kubernetes CrashLoopBackOff YAML, craft multi-stage distroless Dockerfiles, and remediate Terraform resource drift.
            </p>
          </div>

          {/* Progress Card */}
          <div className="flex-shrink-0 rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md min-w-[220px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Labs Completed</span>
              <span className="font-mono font-bold text-emerald-400">
                {totalSolved} / {LAB_CHALLENGES.length}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{progressPercent}% Solved</span>
              {totalSolved === LAB_CHALLENGES.length && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Award className="h-3 w-3" /> Certified!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {LAB_CHALLENGES.map((challenge, idx) => {
            const Icon = challenge.icon || Box;
            const isSolved = solvedLabs[challenge.id];
            const isActive = activeChallengeIndex === idx;

            return (
              <button
                key={challenge.id}
                onClick={() => handleSelectChallenge(idx)}
                className={`group flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-sky-500 text-slate-950'
                    : 'border border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
                <span>{challenge.shortTitle || challenge.title}</span>
                {isSolved ? (
                  <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-emerald-950' : 'text-emerald-400'}`} />
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? 'bg-slate-950' : 'bg-slate-600 group-hover:bg-slate-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Scenario Details & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Incident Description & Criteria */}
        <div className="lg:col-span-5 space-y-6">
          {/* Incident Overview Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${activeChallenge.severityColor}`}>
                <ShieldAlert className="h-3 w-3" />
                {activeChallenge.severity}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wide font-normal">
                {activeChallenge.pillar}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{activeChallenge.title}</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">{activeChallenge.subtitle}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <span className="text-rose-400 font-semibold block mb-1">INCIDENT ALERT:</span>
              {activeChallenge.incidentSummary}
            </div>

            {/* Symptoms & Root Causes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                Telemetry & Symptoms
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeChallenge.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-sky-400" />
                Root Causes to Remediate
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeChallenge.rootCauses.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Validation Checklist Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Remediation Criteria ({activeChallenge.criteria.length})
              </span>
              {hasValidated && (
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                    allPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {allPassed ? 'ALL PASSED' : 'ACTION REQUIRED'}
                </span>
              )}
            </h3>

            <div className="space-y-2.5">
              {activeChallenge.criteria.map((crit) => {
                const result = results.find((r) => r.id === crit.id);
                return (
                  <div
                    key={crit.id}
                    className={`rounded-xl border p-3 transition-all ${
                      result
                        ? result.passed
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-200'
                          : 'border-rose-500/40 bg-rose-950/20 text-slate-200'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {result ? (
                        result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        )
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 text-xs">
                        <span className="font-medium">{crit.label}</span>
                        {result && (
                          <p
                            className={`mt-1 font-mono text-[11px] ${
                              result.passed ? 'text-emerald-400' : 'text-rose-300'
                            }`}
                          >
                            {result.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progressive Hint Drawer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                Staff Hints ({hintIndex} / {activeChallenge.hints.length})
              </span>
              {hintIndex < activeChallenge.hints.length && (
                <button
                  onClick={() => setHintIndex((h) => Math.min(h + 1, activeChallenge.hints.length))}
                  className="text-xs font-mono text-sky-400 hover:text-sky-300 hover:underline"
                >
                  Reveal Hint {hintIndex + 1}
                </button>
              )}
            </div>

            {hintIndex > 0 ? (
              <div className="space-y-2">
                {activeChallenge.hints.slice(0, hintIndex).map((hint, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 font-mono"
                  >
                    <span className="font-bold text-amber-400 mr-2">Hint #{i + 1}:</span>
                    {hint}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Stuck on a rule? Click &quot;Reveal Hint&quot; to inspect step-by-step guidance.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Action Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-sky-400" />
                  {activeChallenge.filename || (activeChallenge.id === 'k8s-crashloop'
                    ? 'deployment.yaml'
                    : activeChallenge.id === 'docker-multistage'
                    ? 'Dockerfile'
                    : 'main.tf')}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                  {activeChallenge.language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-850 transition"
                  title="Copy code"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-850 transition"
                  title="Reset to starter code"
                >
                  <RotateCcw className="h-3 w-3 text-slate-400" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setShowModelSolution((prev) => !prev)}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] transition ${
                    showModelSolution
                      ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle model reference solution"
                >
                  {showModelSolution ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      <span>Hide Solution</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      <span>Model Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Model Solution Comparison Banner */}
            {showModelSolution && (
              <div className="border-b border-indigo-500/30 bg-indigo-950/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    Staff Engineer Model Solution
                  </span>
                  <button
                    onClick={handleApplyModelSolution}
                    className="text-xs font-mono font-semibold text-sky-400 hover:text-sky-300 bg-slate-900 border border-sky-500/40 rounded px-2.5 py-1"
                  >
                    Apply into Editor
                  </button>
                </div>
                <pre className="max-h-60 overflow-y-auto rounded-lg bg-slate-950 p-3 text-[11px] font-mono text-indigo-200 border border-indigo-500/20">
                  {activeChallenge.modelSolution}
                </pre>
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  <strong className="text-indigo-300">Staff Architecture Rationale: </strong>
                  {activeChallenge.staffEngineeringNotes}
                </p>
              </div>
            )}

            {/* Code Editor Body with Line Numbers */}
            <div className="relative flex min-h-[460px] bg-[#0b0f19] font-mono text-xs leading-relaxed">
              {/* Line Numbers Column */}
              <div
                aria-hidden="true"
                className="select-none py-4 px-3 text-right text-slate-600 bg-slate-950/60 border-r border-slate-800 font-mono text-xs"
                style={{ minWidth: '3.5rem' }}
              >
                {lineNumbers.map((num) => (
                  <div key={num} className="leading-6">
                    {num}
                  </div>
                ))}
              </div>

              {/* Editable Textarea */}
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="w-full h-full min-h-[460px] resize-none bg-transparent p-4 font-mono text-xs leading-6 text-slate-100 placeholder-slate-600 focus:outline-none selection:bg-sky-500/30 selection:text-white"
                />
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900/90 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-normal">
                <Terminal className="h-4 w-4 text-sky-400" />
                <span>Press &quot;Validate Solution&quot; to test against automated SRE linters.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-sm ${
                    isValidating
                      ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                      : allPassed
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                  }`}
                >
                  {isValidating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Validating Rules...</span>
                    </>
                  ) : allPassed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Passed! Run Again</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Validate Solution</span>
                    </>
                  )}
                </button>

                {allPassed && (activeChallengeIndex < LAB_CHALLENGES.length - 1) && (
                  <button
                    onClick={() => handleSelectChallenge(activeChallengeIndex + 1)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <span>Next Lab</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Validation Status Banner */}
          {hasValidated && (
            <div
              className={`rounded-2xl border p-5 transition-all ${
                allPassed
                  ? 'border-emerald-500/40 bg-emerald-950/30'
                  : 'border-rose-500/40 bg-rose-950/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {allPassed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-sm font-bold ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {allPassed
                      ? 'Congratulations! Production Incident Remediated!'
                      : 'Validation Failed: Criteria Not Met'}
                  </h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {allPassed
                      ? 'All automated linters and security checks passed. Pods will now safely deploy, run as unprivileged users, and prevent cascading cluster outages.'
                      : 'Review the failing checklist criteria on the left column, refine your code, and run validation again.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
