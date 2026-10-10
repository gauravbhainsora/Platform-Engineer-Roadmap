'use client';

import { PILLARS, getAllTopics } from '@/data';
import { useProgress } from '@/lib/useProgress';
import { PillarId } from '@/types';
import {
  Activity,
  Award,
  Box,
  Calendar,
  CheckCircle2,
  Cloud,
  GitBranch,
  Globe,
  Key,
  Layers,
  Lock,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  User
} from 'lucide-react';
import React, { useState } from 'react';

const PILLAR_ICONS: Record<PillarId, React.ElementType> = {
  linux: Terminal,
  networking: Globe,
  auth: Key,
  containers: Box,
  cloud: Cloud,
  cicd: GitBranch,
  iac: Layers,
  observability: Activity,
};

export default function CertificateGenerator() {
  const [candidateName, setCandidateName] = useState('');
  const { completedTopics: actualCompletedTopics } = useProgress();
  const [isPreview, setIsPreview] = useState(false);
  const [issueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const completedTopics = isPreview ? Object.fromEntries(getAllTopics().map((topic) => [topic.id, true])) : actualCompletedTopics;

  const allTopics = getAllTopics();
  const totalTopicsCount = allTopics.length;

  const getPillarStats = (pillarId: PillarId) => {
    const pillarTopics = allTopics.filter((t) => t.pillarId === pillarId);
    const completedCount = pillarTopics.filter((t) => completedTopics[t.id]).length;
    const percent = Math.round((completedCount / pillarTopics.length) * 100);
    const isUnlocked = completedCount >= Math.ceil(pillarTopics.length * 0.7); // 70% threshold
    return { total: pillarTopics.length, completed: completedCount, percent, isUnlocked };
  };

  const totalCompletedCount = allTopics.filter((t) => completedTopics[t.id]).length;
  const overallPercent = Math.round((totalCompletedCount / totalTopicsCount) * 100);
  const actualCompletedCount = allTopics.filter((topic) => actualCompletedTopics[topic.id]).length;
  const isEligibleForGrandCert = actualCompletedCount === totalTopicsCount && totalTopicsCount > 0;
  const canPrint = isEligibleForGrandCert && !isPreview && candidateName.trim().length > 0;
  const handlePrint = () => { if (canPrint) window.print(); };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-surface via-subtle to-surface border border-line print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-soft text-cyan-ink border border-cyan-line flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Completion Records
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-soft text-emerald-ink border border-emerald-line">
              {overallPercent}% Syllabus Completed
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            Milestones & Platform Engineer Completion Certificate
          </h1>
          <p className="text-muted text-sm mt-1">
            Track your learning milestones and print a completion record after finishing every topic. Progress is self-reported and stored in your browser.
          </p>
        </div>

        {/* Demo simulator toggles */}
        <div className="flex items-center gap-2 bg-inset p-2 rounded-xl border border-line">
          <button
            onClick={() => setIsPreview(true)}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-soft text-cyan-ink hover:bg-cyan-soft transition flex items-center gap-1.5"
            title="Preview certificate with 100% completion"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Preview 100%
          </button>
          <button
            onClick={() => setIsPreview(false)}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-subtle text-muted hover:text-ink transition flex items-center gap-1.5"
            title="Restore actual tracked progress"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actual Progress
          </button>
        </div>
      </div>

      {/* 8 Milestone Badges Grid */}
      <div className="print:hidden space-y-4">
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-ink" />
          Pillar Milestone Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((pillar) => {
            const stats = getPillarStats(pillar.id);
            const Icon = PILLAR_ICONS[pillar.id] || Terminal;
            return (
              <div
                key={pillar.id}
                className={`p-4 rounded-xl border transition-all ${
                  stats.isUnlocked
                    ? 'bg-surface border-emerald-line shadow-sm ring-1 ring-emerald-500/20'
                    : 'bg-inset border-line opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      stats.isUnlocked
                        ? 'bg-emerald-soft border-emerald-line text-emerald-ink'
                        : 'bg-surface border-line text-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {stats.isUnlocked ? (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-soft text-emerald-ink border border-emerald-line flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-subtle text-muted border border-line flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked ({stats.percent}%)
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-ink text-sm mb-1">{pillar.title}</h3>
                <p className="text-xs text-muted line-clamp-2 mb-3">
                  {pillar.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted font-mono">
                    <span>Mastery</span>
                    <span>
                      {stats.completed} / {stats.total} topics
                    </span>
                  </div>
                  <div className="w-full bg-inset h-1.5 rounded-full overflow-hidden border border-line">
                    <div
                      className={`h-full transition-all duration-500 ${
                        stats.isUnlocked ? 'bg-emerald-fill' : 'bg-selected'
                      }`}
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Preview & Customizer */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-cyan-ink" />
            <input
              aria-label="Full name for certificate"
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter your full name for certificate"
              className="bg-surface border border-line rounded-xl px-4 py-2 text-ink font-medium text-sm focus-visible:outline-2 focus-visible:outline-focus focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={!canPrint}
              className="px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs transition flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>

          </div>
        </div>

        <p className="text-sm text-muted print:hidden" role="status">
          {isPreview ? 'Preview only. Return to Actual Progress to print your completed record.' :
            !isEligibleForGrandCert ? `Complete all ${totalTopicsCount} topics to print (${actualCompletedCount} completed).` :
            !candidateName.trim() ? 'Enter your name to print your completion certificate.' : 'Your completion certificate is ready to print.'}
        </p>
        {/* Printable Certificate Canvas */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-inset via-surface to-inset border-4 border-line p-8 sm:p-12 shadow-lg text-center space-y-8 print:p-8 print:border-2 print:border-black print:bg-white print:bg-none print:text-black">
          {!canPrint && <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" aria-label="Preview only">
            <span className="-rotate-12 border-4 border-amber-line bg-inset px-8 py-4 text-3xl font-black text-amber-ink print:bg-white print:text-black print:border-black">PREVIEW ONLY</span>
          </div>}
          {/* Subtle Geometric Background Watermark */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Top Brand & Badge Header */}
          <div className="flex items-center justify-between border-b border-line pb-6 print:border-line-strong">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-fill to-emerald-fill flex items-center justify-center shadow-sm text-ink font-black text-xl">
                PE
              </div>
              <div>
                <h3 className="text-ink font-black text-base uppercase tracking-wider print:text-black">
                  Platform Engineer Roadmap
                </h3>
                <p className="text-xs text-cyan-ink font-mono print:text-muted">
                  Self-reported learning record
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-line text-xs font-mono text-muted print:border-line-strong print:text-black">
              <ShieldCheck className="w-4 h-4 text-emerald-ink" />
              <span>Local completion record</span>
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="space-y-3 py-4">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-ink print:text-cyan-ink">
              Certificate of Curriculum Completion
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-ink tracking-tight font-serif italic print:text-black">
              {candidateName || 'Platform Engineer'}
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-body leading-relaxed print:text-ink">
              has marked every topic complete across all 8 foundational pillars of modern Cloud Native Infrastructure, Kubernetes Architecture, Linux Systems, CI/CD, and Observability.
            </p>
          </div>

          {/* 8 Track Completion Stamp Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto py-2">
            {PILLARS.map((pillar) => {
              const stats = getPillarStats(pillar.id);
              return (
                <div
                  key={pillar.id}
                  className="p-2.5 rounded-xl bg-inset border border-line text-left print:border-line-strong print:bg-slate-50"
                >
                  <div className="text-xs font-bold text-body print:text-black truncate">
                    {pillar.title}
                  </div>
                  <div className="text-xs text-emerald-ink font-mono mt-0.5 print:text-emerald-ink flex items-center justify-between">
                    <span>{stats.percent === 100 ? 'Complete' : 'In progress'}</span>
                    <span>{stats.percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Signature & Seal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-line print:border-line-strong">
            <div className="text-left text-xs text-muted print:text-muted space-y-1">
              <div className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-cyan-ink" />
                <span>Issued On: {issueDate}</span>
              </div>
              <p className="text-xs text-muted">
                Based on locally tracked, self-reported study progress.
              </p>
            </div>

            {/* Official Gold Seal */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-amber-line bg-gradient-to-tr from-amber-100 to-yellow-100 flex flex-col items-center justify-center p-2 text-center shadow-sm">
                <Award className="w-6 h-6 text-amber-ink mb-0.5" />
                <span className="text-xs font-black uppercase text-amber-ink tracking-tighter">
                  COMPLETED
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-ink print:text-black">
                  Platform Engineer Roadmap
                </div>
                <div className="text-xs text-muted print:text-muted">
                  Curriculum completion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
