'use client';

import { CidrCalculator } from '@/components/tools/CidrCalculator';
import { JwtDebugger } from '@/components/tools/JwtDebugger';
import { K8sManifestGenerator } from '@/components/tools/K8sManifestGenerator';
import { TerminalSimulator } from '@/components/tools/TerminalSimulator';
import { Box, Network, ShieldCheck, Terminal as TerminalIcon, Wrench } from 'lucide-react';
import { useState } from 'react';

export default function ToolsHubPage() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'cidr' | 'jwt' | 'k8s'>('terminal');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-line bg-sky-soft px-3 py-1 text-xs font-medium text-sky-ink mb-3">
          <Wrench className="h-3.5 w-3.5 text-sky-ink" />
          Interactive DevOps Utility Suite
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Platform Engineering Interactive Tools
        </h1>
        <p className="mt-2 text-sm sm:text-base text-body">
          Hands-on developer tools: web terminal simulator, visual CIDR calculator, JWT debugger, and Kubernetes manifest hardener.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-4 mb-8">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'terminal'
              ? 'bg-sky-fill text-ink'
              : 'border border-line bg-surface text-body hover:text-ink hover:border-line'
          }`}
        >
          <TerminalIcon className="h-4 w-4" />
          Terminal Shell Simulator
        </button>

        <button
          onClick={() => setActiveTab('cidr')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'cidr'
              ? 'bg-sky-fill text-ink'
              : 'border border-line bg-surface text-body hover:text-ink hover:border-line'
          }`}
        >
          <Network className="h-4 w-4" />
          CIDR Subnet Calculator
        </button>

        <button
          onClick={() => setActiveTab('jwt')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'jwt'
              ? 'bg-sky-fill text-ink'
              : 'border border-line bg-surface text-body hover:text-ink hover:border-line'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          JWT Decoder & Inspector
        </button>

        <button
          onClick={() => setActiveTab('k8s')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'k8s'
              ? 'bg-sky-fill text-ink'
              : 'border border-line bg-surface text-body hover:text-ink hover:border-line'
          }`}
        >
          <Box className="h-4 w-4" />
          K8s Manifest Hardener
        </button>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'terminal' && <TerminalSimulator />}
        {activeTab === 'cidr' && <CidrCalculator />}
        {activeTab === 'jwt' && <JwtDebugger />}
        {activeTab === 'k8s' && <K8sManifestGenerator />}
      </div>
    </div>
  );
}
