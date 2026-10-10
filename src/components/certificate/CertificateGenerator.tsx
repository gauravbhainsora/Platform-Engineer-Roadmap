'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Printer,
  Share2,
  Sparkles,
  ShieldCheck,
  Calendar,
  User,
  ExternalLink,
  RefreshCw,
  Sliders,
  Terminal,
  Cpu,
  Globe,
  Key,
  Box,
  Cloud,
  GitBranch,
  Layers,
  Activity
} from 'lucide-react';
import { PILLARS, getAllTopics } from '@/data';
import { getStoredProgress, triggerCelebrationConfetti } from '@/lib/storage';
import { PillarId } from '@/types';

const PILLAR_ICONS: Record<PillarId, any> = {
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
  const [candidateName, setCandidateName] = useState<string>('Alex Chen');
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [certificateId, setCertificateId] = useState<string>('PER-8849-2026-PROD');
  const [issueDate, setIssueDate] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const allTopics = getAllTopics();
  const totalTopicsCount = allTopics.length;

  useEffect(() => {
    const progress = getStoredProgress();
    setCompletedTopics(progress.completedTopics || {});
    setIssueDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const getPillarStats = (pillarId: PillarId) => {
    const pillarTopics = allTopics.filter((t) => t.pillarId === pillarId);
    const completedCount = pillarTopics.filter((t) => completedTopics[t.id]).length;
    const percent = Math.round((completedCount / pillarTopics.length) * 100);
    const isUnlocked = completedCount >= Math.ceil(pillarTopics.length * 0.7); // 70% threshold
    return { total: pillarTopics.length, completed: completedCount, percent, isUnlocked };
  };

  const totalCompletedCount = allTopics.filter((t) => completedTopics[t.id]).length;
  const overallPercent = Math.round((totalCompletedCount / totalTopicsCount) * 100);
  const isEligibleForGrandCert = overallPercent >= 60 || Object.keys(completedTopics).length >= 10;

  const handleSimulateAll = () => {
    const simulated: Record<string, boolean> = {};
    allTopics.forEach((t) => {
      simulated[t.id] = true;
    });
    setCompletedTopics(simulated);
    triggerCelebrationConfetti();
  };

  const handleResetToReal = () => {
    const progress = getStoredProgress();
    setCompletedTopics(progress.completedTopics || {});
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `https://platform-engineer-roadmap.dev/verify/${certificateId}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Verifiable Credentials
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {overallPercent}% Syllabus Completed
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Milestones & Certified Platform Engineer Credential
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Unlock verifiable milestone badges for each architectural domain and generate your printable, cryptographic completion certificate.
          </p>
        </div>

        {/* Demo simulator toggles */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <button
            onClick={handleSimulateAll}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition flex items-center gap-1.5"
            title="Preview certificate with 100% completion"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Preview 100%
          </button>
          <button
            onClick={handleResetToReal}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1.5"
            title="Restore actual tracked progress"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actual Progress
          </button>
        </div>
      </div>

      {/* 8 Milestone Badges Grid */}
      <div className="print:hidden space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
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
                    ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      stats.isUnlocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {stats.isUnlocked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-500 border border-slate-700 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked ({stats.percent}%)
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm mb-1">{pillar.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {pillar.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Mastery</span>
                    <span>
                      {stats.completed} / {stats.total} topics
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        stats.isUnlocked ? 'bg-emerald-500' : 'bg-slate-700'
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
            <User className="w-5 h-5 text-cyan-400" />
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter your full name for certificate"
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-2 border border-slate-700"
            >
              <Share2 className="w-4 h-4" />
              {isCopied ? 'Link Copied!' : 'Copy Verify URL'}
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-slate-800 p-8 sm:p-12 shadow-2xl text-center space-y-8 print:p-8 print:border-2 print:border-black print:bg-white print:text-black">
          {/* Subtle Geometric Background Watermark */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Top Brand & Badge Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-slate-300">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-xl">
                PE
              </div>
              <div>
                <h3 className="text-white font-black text-base uppercase tracking-wider print:text-black">
                  Platform Engineer Roadmap
                </h3>
                <p className="text-xs text-cyan-400 font-mono print:text-slate-600">
                  Curriculum & Verification Authority
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 print:border-slate-300 print:text-black">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ID: {certificateId}</span>
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="space-y-3 py-4">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 print:text-cyan-700">
              Certificate of Mastery & Completion
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif italic print:text-black">
              {candidateName || 'Platform Engineer'}
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed print:text-slate-700">
              has successfully demonstrated verified competency across all 8 foundational pillars of modern Cloud Native Infrastructure, Kubernetes Architecture, Linux Systems, CI/CD, and Observability.
            </p>
          </div>

          {/* 8 Track Completion Stamp Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto py-2">
            {PILLARS.map((pillar) => {
              const stats = getPillarStats(pillar.id);
              return (
                <div
                  key={pillar.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left print:border-slate-300 print:bg-slate-50"
                >
                  <div className="text-[11px] font-bold text-slate-300 print:text-black truncate">
                    {pillar.title}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5 print:text-emerald-700 flex items-center justify-between">
                    <span>Verified</span>
                    <span>{stats.percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Signature & Seal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-800 print:border-slate-300">
            <div className="text-left text-xs text-slate-400 print:text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Issued On: {issueDate}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cryptographically hashed against syllabus commit 403f002
              </p>
            </div>

            {/* Official Gold Seal */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-amber-400/80 bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 flex flex-col items-center justify-center p-2 text-center shadow-lg shadow-amber-500/10">
                <Award className="w-6 h-6 text-amber-400 mb-0.5" />
                <span className="text-[8px] font-black uppercase text-amber-300 tracking-tighter">
                  CPE GOLD
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white print:text-black">
                  Certified Platform Engineer
                </div>
                <div className="text-[10px] text-slate-400 print:text-slate-600">
                  Global Standard Assessment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
