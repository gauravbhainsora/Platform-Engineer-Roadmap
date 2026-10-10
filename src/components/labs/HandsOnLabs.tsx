'use client';

import { triggerConfetti } from '@/lib/storage';
import { useClipboard } from '@/lib/useClipboard';
import { useLabProgress } from '@/lib/useLabProgress';
import {
  AlertTriangle,
  Award,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  FileCode,
  Lightbulb,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  XCircle
} from 'lucide-react';
import React, { useRef, useState } from 'react';

import {
  CriterionResult,
  LAB_CHALLENGES,
  LAB_PROGRESS_KEY,
  validateLabChallenge
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
  const solvedLabs = useLabProgress();
  const [saveError, setSaveError] = useState('');

  // Validation output results
  const [results, setResults] = useState<CriterionResult[]>([]);
  const [hasValidated, setHasValidated] = useState(false);

  // UI helpers
  const [hintIndex, setHintIndex] = useState(0);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const { copy, copiedId: copiedId, copyError } = useClipboard();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save progress helper
  const markLabCompleted = (labId: string) => {
    const updated = { ...solvedLabs, [labId]: true };
    if (typeof window !== 'undefined') {
      try {
        setSaveError('');
        localStorage.setItem(LAB_PROGRESS_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('platform-roadmap-labs-updated', { detail: updated }));
      } catch (e) {
        console.error('Error saving lab progress', e);
        setSaveError('Lab progress could not be saved. Browser storage is unavailable or full.');
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

  const currentCode = userCodes[activeChallenge.id] ?? activeChallenge.starterCode;

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

  const handleCopy = () => copy(currentCode, 'lab');
  const copiedCode = copiedId === 'lab';

  const handleApplyModelSolution = () => {
    setUserCodes((prev) => ({
      ...prev,
      [activeChallenge.id]: activeChallenge.modelSolution,
    }));
    setHasValidated(false);
  };

  const handleValidate = () => {
    const outcome = validateLabChallenge(activeChallenge.id, currentCode);
    setResults(outcome.results);
    setHasValidated(true);
    if (outcome.passed) {
      triggerConfetti();
      markLabCompleted(activeChallenge.id);
    }
  };

  const allPassed = hasValidated && results.length > 0 && results.every((r) => r.passed);
  const totalSolved = Object.values(solvedLabs).filter(Boolean).length;
  const progressPercent = Math.round((totalSolved / LAB_CHALLENGES.length) * 100);

  // Line numbers calculation
  const lineCount = currentCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {saveError && <p role="alert" className="text-sm text-rose-ink">{saveError}</p>}
      {copyError && <p role="alert" className="text-sm text-rose-ink">{copyError}</p>}
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-inset via-surface to-inset p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-soft blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-soft blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-line bg-sky-soft px-3 py-1 text-xs font-mono font-semibold text-sky-ink mb-3">
              <Sparkles className="h-3.5 w-3.5 text-sky-ink" />
              <span>Interactive Incident Labs</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Production Scenario Labs
            </h1>
            <p className="mt-2 text-sm sm:text-base text-body">
              Practice configuration checks for platform engineering outages: debug Kubernetes CrashLoopBackOff YAML, craft multi-stage distroless Dockerfiles, and remediate Terraform resource drift.
            </p>
          </div>

          {/* Progress Card */}
          <div className="flex-shrink-0 rounded-xl border border-line bg-surface p-4 sm:p-5 backdrop-blur-md min-w-[220px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-body">Labs Completed</span>
              <span className="font-mono font-bold text-emerald-ink">
                {totalSolved} / {LAB_CHALLENGES.length}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-subtle">
              <div
                className="h-full bg-emerald-fill transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted">
              <span>{progressPercent}% Solved</span>
              {totalSolved === LAB_CHALLENGES.length && (
                <span className="text-emerald-ink font-semibold flex items-center gap-1">
                  <Award className="h-3 w-3" /> Certified!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
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
                    ? 'bg-sky-fill text-ink'
                    : 'border border-line bg-surface text-body hover:border-line hover:text-ink'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-ink' : 'text-sky-ink'}`} />
                <span>{challenge.shortTitle || challenge.title}</span>
                {isSolved ? (
                  <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-emerald-950' : 'text-emerald-ink'}`} />
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? 'bg-inset' : 'bg-slate-600 group-hover:bg-slate-400'
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
          <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${activeChallenge.severityColor}`}>
                <ShieldAlert className="h-3 w-3" />
                {activeChallenge.severity}
              </span>
              <span className="text-xs text-muted uppercase tracking-wide font-normal">
                {activeChallenge.pillar}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-ink">{activeChallenge.title}</h2>
              <p className="mt-1 text-xs sm:text-sm text-muted">{activeChallenge.subtitle}</p>
            </div>

            <div className="rounded-xl border border-line bg-inset p-4 text-xs sm:text-sm text-ink leading-relaxed font-sans">
              <span className="text-rose-ink font-semibold block mb-1">INCIDENT ALERT:</span>
              {activeChallenge.incidentSummary}
            </div>

            {/* Symptoms & Root Causes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-ink" />
                Telemetry & Symptoms
              </h3>
              <ul className="space-y-1.5 text-xs text-body">
                {activeChallenge.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-ink font-bold">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-2 border-t border-line">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-sky-ink" />
                Root Causes to Remediate
              </h3>
              <ul className="space-y-1.5 text-xs text-body">
                {activeChallenge.rootCauses.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-ink font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Validation Checklist Card */}
          <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-ink" />
                Remediation Criteria ({activeChallenge.criteria.length})
              </span>
              {hasValidated && (
                <span
                  className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    allPassed ? 'bg-emerald-soft text-emerald-ink' : 'bg-rose-soft text-rose-ink'
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
                          ? 'border-emerald-line bg-emerald-tint text-ink'
                          : 'border-rose-line bg-rose-tint text-ink'
                        : 'border-line bg-inset text-body'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {result ? (
                        result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-ink flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-ink flex-shrink-0 mt-0.5" />
                        )
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-line-strong flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 text-xs">
                        <span className="font-medium">{crit.label}</span>
                        {result && (
                          <p
                            className={`mt-1 font-mono text-xs ${
                              result.passed ? 'text-emerald-ink' : 'text-rose-ink'
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
          <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-ink" />
                Staff Hints ({hintIndex} / {activeChallenge.hints.length})
              </span>
              {hintIndex < activeChallenge.hints.length && (
                <button
                  onClick={() => setHintIndex((h) => Math.min(h + 1, activeChallenge.hints.length))}
                  className="text-xs font-mono text-sky-ink hover:text-sky-ink hover:underline"
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
                    className="rounded-lg border border-amber-line bg-amber-soft p-3 text-xs text-amber-ink font-mono"
                  >
                    <span className="font-bold text-amber-ink mr-2">Hint #{i + 1}:</span>
                    {hint}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic">
                Stuck on a rule? Click &quot;Reveal Hint&quot; to inspect step-by-step guidance.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Action Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-line bg-inset shadow-lg overflow-hidden flex flex-col">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-soft" />
                  <div className="h-3 w-3 rounded-full bg-amber-soft" />
                  <div className="h-3 w-3 rounded-full bg-emerald-soft" />
                </div>
                <span className="ml-2 text-xs font-mono text-muted flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-sky-ink" />
                  {activeChallenge.filename || (activeChallenge.id === 'k8s-crashloop'
                    ? 'deployment.yaml'
                    : activeChallenge.id === 'docker-multistage'
                    ? 'Dockerfile'
                    : 'main.tf')}
                </span>
                <span className="rounded bg-subtle px-1.5 py-0.5 text-xs font-mono text-muted uppercase">
                  {activeChallenge.language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs text-body hover:text-ink hover:bg-hover transition"
                  title="Copy code"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-ink" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-muted" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs text-body hover:text-ink hover:bg-hover transition"
                  title="Reset to starter code"
                >
                  <RotateCcw className="h-3 w-3 text-muted" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setShowModelSolution((prev) => !prev)}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs transition ${
                    showModelSolution
                      ? 'border-indigo-line bg-indigo-soft text-indigo-ink'
                      : 'border-line bg-surface text-body hover:text-ink'
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
              <div className="border-b border-indigo-line bg-indigo-tint p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-ink flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-ink" />
                    Staff Engineer Model Solution
                  </span>
                  <button
                    onClick={handleApplyModelSolution}
                    className="text-xs font-mono font-semibold text-sky-ink hover:text-sky-ink bg-surface border border-sky-line rounded px-2.5 py-1"
                  >
                    Apply into Editor
                  </button>
                </div>
                <pre className="max-h-60 overflow-y-auto rounded-lg bg-inset p-3 text-xs font-mono text-indigo-ink border border-indigo-line">
                  {activeChallenge.modelSolution}
                </pre>
                <p className="text-xs text-body leading-relaxed font-mono">
                  <strong className="text-indigo-ink">Staff Architecture Rationale: </strong>
                  {activeChallenge.staffEngineeringNotes}
                </p>
              </div>
            )}

            {/* Code Editor Body with Line Numbers */}
            <div className="relative flex min-h-[460px] bg-page font-mono text-xs leading-relaxed">
              {/* Line Numbers Column */}
              <div
                aria-hidden="true"
                className="select-none py-4 px-3 text-right text-muted bg-inset border-r border-line font-mono text-xs"
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
                <textarea aria-label="Lab configuration editor"
                  ref={textareaRef}
                  value={currentCode}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="w-full h-full min-h-[460px] resize-none bg-transparent p-4 font-mono text-xs leading-6 text-ink placeholder-muted focus-visible:outline-2 focus-visible:outline-focus selection:bg-sky-soft selection:text-ink"
                />
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface p-4">
              <div className="flex items-center gap-2 text-xs text-muted font-normal">
                <Terminal className="h-4 w-4 text-sky-ink" />
                <span>Validate configuration checks. Labs do not execute deployments.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleValidate}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-sm ${
                    allPassed
                      ? 'bg-emerald-fill text-ink hover:bg-emerald-fill'
                      : 'bg-sky-fill text-ink hover:bg-sky-fill'
                  }`}
                >
                  {allPassed ? (
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
                    className="flex items-center gap-1.5 rounded-xl border border-line bg-subtle px-4 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:bg-selected transition-colors"
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
                  ? 'border-emerald-line bg-emerald-tint'
                  : 'border-rose-line bg-rose-tint'
              }`}
            >
              <div className="flex items-start gap-3">
                {allPassed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-ink flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-ink flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-sm font-bold ${allPassed ? 'text-emerald-ink' : 'text-rose-ink'}`}>
                    {allPassed
                      ? 'Congratulations! Production Incident Remediated!'
                      : 'Validation Failed: Criteria Not Met'}
                  </h4>
                  <p className="mt-1 text-xs text-body leading-relaxed">
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
