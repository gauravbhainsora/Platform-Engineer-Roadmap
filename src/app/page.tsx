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
      <section className="relative border-b border-slate-800/80 bg-slate-900/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-medium text-sky-400 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <span>Structured Study Guide & Practice Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Platform Engineer{' '}
            <span className="text-sky-400">Roadmap</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            A comprehensive, interactive study guide to master cloud infrastructure, Kubernetes, Linux systems, CI/CD pipelines, and SRE observability.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
              <span className="text-2xl font-bold text-white">8</span>
              <p className="text-xs font-medium text-slate-400 mt-1">Core Pillars</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
              <span className="text-2xl font-bold text-sky-400">{ALL_TOPICS.length}</span>
              <p className="text-xs font-medium text-slate-400 mt-1">Deep Topics</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
              <span className="text-2xl font-bold text-emerald-400">100+</span>
              <p className="text-xs font-medium text-slate-400 mt-1">CLI Commands</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
              <span className="text-2xl font-bold text-slate-200">100%</span>
              <p className="text-xs font-medium text-slate-400 mt-1">Free & Offline</p>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#mindmap-canvas"
              className="flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors shadow-sm"
            >
              <Compass className="h-4 w-4" />
              Explore Visual Mindmap
            </a>
            <Link
              href="/labs"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors"
            >
              <Box className="h-4 w-4 text-sky-400" />
              Hands-On Labs
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors"
            >
              <Terminal className="h-4 w-4 text-slate-300" />
              DevOps Tools
            </Link>
            <Link
              href="/topics"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-slate-300" />
              Curriculum Track
            </Link>
          </div>

          {/* Feature Quick Launch Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
            <Link
              href="/labs"
              className="group p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">Hands-On Labs</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300">Practice</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Troubleshoot real K8s, Dockerfile, and Terraform incidents in your browser.
              </p>
            </Link>
            <Link
              href="/tools"
              className="group p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">DevOps Tools</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">4 Tools</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                CIDR subnet calculator, terminal simulator, JWT debugger, and K8s generator.
              </p>
            </Link>

            <Link
              href="/flashcards"
              className="group p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">Flashcards</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Quick Review</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-yield Kubernetes, Linux, and DNS flashcards with spaced repetition.
              </p>
            </Link>

            <Link
              href="/interview-prep"
              className="group p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">Mock Interview</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">45 Min</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Production outage simulations, triage checklists, and Staff Engineer solutions.
              </p>
            </Link>

            <Link
              href="/certificate"
              className="group p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">Certificate</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Verifiable</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete all pillars and generate your certified completion credential.
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
