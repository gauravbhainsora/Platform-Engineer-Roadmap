import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Layers,
  Terminal,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { RoadmapCanvas } from '@/components/roadmap/RoadmapCanvas';
import { ALL_TOPICS, PILLARS } from '@/data';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-[#090d16] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        {/* Ambient glow backgrounds */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-10 right-10 h-[250px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-sky-400 mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <span>Interactive Cloud & DevOps Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Platform Engineer{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
            The complete visual study platform for mastering cloud-native infrastructure, internal developer platforms (IDP), Linux systems, Kubernetes, and SRE observability.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
              <span className="text-xl sm:text-2xl font-black text-sky-400">8</span>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Core Pillars</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{ALL_TOPICS.length}</span>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Deep Topics</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
              <span className="text-xl sm:text-2xl font-black text-purple-400">100+</span>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">CLI Commands</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
              <span className="text-xl sm:text-2xl font-black text-amber-400">100%</span>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Free & Local</p>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#mindmap-canvas"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Compass className="h-4 w-4" />
              Explore Visual Mindmap
            </a>
            <Link
              href="/topics"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-850 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Curriculum Track
            </Link>
          </div>
        </div>
      </section>

      {/* Main Roadmap Mindmap Canvas */}
      <section id="mindmap-canvas" className="scroll-mt-16">
        <RoadmapCanvas />
      </section>
    </div>
  );
}
