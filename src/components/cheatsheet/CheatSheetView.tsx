'use client';

import React, { useState } from 'react';
import { Terminal, Search, Copy, Check, Filter } from 'lucide-react';
import { CHEATSHEET_DATABASE } from '@/data';
import { PillarId } from '@/types';

export function CheatSheetView() {
  const [search, setSearch] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const pillars: { id: string; label: string }[] = [
    { id: 'all', label: 'All Commands' },
    { id: 'linux', label: 'Linux' },
    { id: 'networking', label: 'Networking' },
    { id: 'auth', label: 'Auth' },
    { id: 'containers', label: 'Containers & K8s' },
    { id: 'cloud', label: 'Cloud' },
    { id: 'cicd', label: 'CI/CD' },
    { id: 'iac', label: 'IaC' },
    { id: 'observability', label: 'Observability' },
  ];

  const filteredCommands = CHEATSHEET_DATABASE.filter((entry) => {
    const matchesPillar = selectedPillar === 'all' || entry.pillarId === selectedPillar;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      entry.cmd.toLowerCase().includes(query) ||
      entry.desc.toLowerCase().includes(query) ||
      entry.tool.toLowerCase().includes(query) ||
      (entry.category && entry.category.toLowerCase().includes(query));

    return matchesPillar && matchesSearch;
  });

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-mono font-semibold text-sky-400 mb-3">
          <Terminal className="h-3.5 w-3.5" />
          Production CLI Command Database
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Platform Engineer CLI Cheat Sheet
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Searchable reference of 100+ essential CLI commands across Linux, Docker, Kubernetes, Terraform, Git, and Observability.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands by syntax, tool, or description (e.g., tcpdump, iptables, kubectl rollout)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>

        {/* Pillar filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {pillars.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPillar(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedPillar === p.id
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Command List Grid */}
      <div className="space-y-3">
        {filteredCommands.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-sm text-slate-400">
            No commands match your search query.
          </div>
        ) : (
          filteredCommands.map((entry, i) => (
            <div
              key={i}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-slate-700 hover:bg-slate-850 transition-colors shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-sky-400 border border-sky-500/20">
                    {entry.tool}
                  </span>
                  {entry.category && (
                    <span className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-800">
                      {entry.category}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 font-mono capitalize">
                    {entry.pillarId}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-emerald-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 overflow-x-auto">
                  <span className="text-slate-600 select-none">$</span>
                  <span>{entry.cmd}</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300">
                  {entry.desc}
                </p>
              </div>

              <button
                onClick={() => handleCopy(entry.cmd)}
                className="self-end sm:self-center shrink-0 flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-mono font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors shadow-sm"
              >
                {copiedCmd === entry.cmd ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedCmd === entry.cmd ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
