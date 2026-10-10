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
  Box,
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
              href="/labs"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Box className="h-4 w-4" />
              Hands-On Labs
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-5 py-3 text-xs sm:text-sm font-bold text-sky-300 hover:bg-sky-500/20 transition-all"
            >
              <Terminal className="h-4 w-4" />
              DevOps Tools Suite
            </Link>
            <Link
              href="/topics"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-850 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Curriculum Track
            </Link>
          </div>

          {/* Feature Quick Launch Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
            <Link
              href="/labs"
              className="group p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-sky-500/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-sky-400">Hands-On Labs</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300">New</span>
              </div>
              <p className="text-xs text-slate-300 group-hover:text-white transition">
                Interactive K8s, Dockerfile & Terraform outage challenges with live linting.
              </p>
            </Link>
            <Link
              href="/tools"
              className="group p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-cyan-400">DevOps Tools</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">4 Tools</span>
              </div>
              <p className="text-xs text-slate-300 group-hover:text-white transition">
                Web Terminal, CIDR Subnetter, JWT Decoder & K8s Hardener.
              </p>
            </Link>

            <Link
              href="/flashcards"
              className="group p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-purple-400">3D Flashcards</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">Spaced Drill</span>
              </div>
              <p className="text-xs text-slate-300 group-hover:text-white transition">
                High-yield Kubernetes, Linux, and DNS concept cards with 3D flip.
              </p>
            </Link>

            <Link
              href="/interview-prep"
              className="group p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400">Mock Interview</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">Timed 45m</span>
              </div>
              <p className="text-xs text-slate-300 group-hover:text-white transition">
                Incident triage, live scratchpad, and Staff Engineer model solutions.
              </p>
            </Link>

            <Link
              href="/certificate"
              className="group p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-400">CPE Certificate</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">Verifiable</span>
              </div>
              <p className="text-xs text-slate-300 group-hover:text-white transition">
                Earn 8 milestone badges and print your certified credential.
              </p>
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
