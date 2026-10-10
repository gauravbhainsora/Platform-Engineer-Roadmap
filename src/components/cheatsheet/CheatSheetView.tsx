'use client';

import { CHEATSHEET_DATABASE } from '@/data';
import { useClipboard } from '@/lib/useClipboard';
import { Check, Copy, Search, Terminal } from 'lucide-react';
import { useState } from 'react';

export function CheatSheetView() {
  const [search, setSearch] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const { copy, copiedId: copiedCmd, copyError } = useClipboard();

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

  const handleCopy = (cmd: string) => copy(cmd, cmd);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {copyError && <p role="alert" className="text-sm text-rose-ink">{copyError}</p>}
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-line bg-sky-soft px-3 py-1 text-xs font-mono font-semibold text-sky-ink mb-3">
          <Terminal className="h-3.5 w-3.5" />
          Production CLI Command Database
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Platform Engineer CLI Cheat Sheet
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted">
          Searchable reference of 100+ essential CLI commands across Linux, Docker, Kubernetes, Terraform, Git, and Observability.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
          <input aria-label="Search CLI commands"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands by syntax, tool, or description (e.g., tcpdump, iptables, kubectl rollout)..."
            className="w-full rounded-xl border border-line bg-inset pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder-muted focus:border-sky-line focus-visible:outline-2 focus-visible:outline-focus"
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
                  ? 'bg-sky-fill text-ink font-bold'
                  : 'bg-inset text-muted hover:text-ink border border-line'
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
          <div className="rounded-2xl border border-line bg-surface p-12 text-center text-sm text-muted">
            No commands match your search query.
          </div>
        ) : (
          filteredCommands.map((entry, i) => (
            <div
              key={i}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 hover:border-line hover:bg-hover transition-colors shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded bg-sky-soft px-2 py-0.5 text-xs font-semibold uppercase text-sky-ink border border-sky-line">
                    {entry.tool}
                  </span>
                  {entry.category && (
                    <span className="rounded bg-inset px-2 py-0.5 text-xs text-body border border-line">
                      {entry.category}
                    </span>
                  )}
                  <span className="text-xs text-muted capitalize font-normal">
                    {entry.pillarId}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-emerald-ink bg-inset px-3 py-2 rounded-lg border border-line overflow-x-auto">
                  <span className="text-muted select-none">$</span>
                  <span>{entry.cmd}</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-body leading-normal">
                  {entry.desc}
                </p>
              </div>

              <button
                onClick={() => handleCopy(entry.cmd)}
                className="self-end sm:self-center shrink-0 flex items-center gap-1.5 rounded-xl border border-line bg-subtle px-3 py-1.5 text-xs font-medium text-ink hover:text-ink hover:bg-selected transition-colors shadow-sm"
              >
                {copiedCmd === entry.cmd ? (
                  <Check className="h-3.5 w-3.5 text-emerald-ink" />
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
