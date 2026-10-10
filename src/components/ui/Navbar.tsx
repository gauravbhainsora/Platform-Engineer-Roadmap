'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  BookOpen,
  Terminal,
  Award,
  Search,
  CheckCircle2,
  Layers,
  Wrench,
  Sparkles,
  Server,
  Database,
  Menu,
  X,
  ShieldCheck,
  Box,
} from 'lucide-react';
import { getStoredProgress } from '@/lib/storage';
import { ALL_TOPICS } from '@/data';
import BackupSyncModal from './BackupSyncModal';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [completedCount, setCompletedCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const totalCount = ALL_TOPICS.length;

  useEffect(() => {
    const updateStats = () => {
      const progress = getStoredProgress();
      const count = Object.values(progress.completedTopics).filter(Boolean).length;
      setCompletedCount(count);
    };

    updateStats();
    window.addEventListener('platform-roadmap-progress-updated', updateStats);
    return () => window.removeEventListener('platform-roadmap-progress-updated', updateStats);
  }, []);

  const percentage = Math.round((completedCount / totalCount) * 100);

  const navLinks = [
    { href: '/', label: 'Mindmap', icon: Compass },
    { href: '/topics', label: 'Curriculum', icon: BookOpen },
    { href: '/labs', label: 'Hands-On Labs', icon: Box },
    { href: '/tools', label: 'DevOps Tools', icon: Wrench },
    { href: '/flashcards', label: 'Flashcards', icon: Sparkles },
    { href: '/interview-prep', label: 'Mock Interview', icon: Server },
    { href: '/quizzes', label: 'Quizzes', icon: Award },
    { href: '/certificate', label: 'Certificate', icon: ShieldCheck },
    { href: '/cheatsheet', label: 'CLI Cheat Sheet', icon: Terminal },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 shadow-lg shadow-sky-500/20 transition-transform group-hover:scale-105">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                    Platform Engineer
                  </span>
                  <span className="rounded-md bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/20">
                    ROADMAP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono hidden xl:block">
                  8 Pillars • 67 In-Depth Topics
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 text-xs font-medium">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-800 text-sky-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Backup & Sync Trigger Button */}
            <button
              onClick={() => setIsBackupModalOpen(true)}
              title="Backup, Sync & Data Migration"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
            >
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden lg:inline font-medium">Sync</span>
            </button>

            {/* Progress Tracker Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {percentage}%
              </span>
            </div>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/gauravbhainsora/Platform-Engineer-Roadmap"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-800 text-sky-400'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Progress: {completedCount}/{totalCount} ({percentage}%)</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBackupModalOpen(true);
                }}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Database className="h-3 w-3" />
                Backup & Sync
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Backup and Sync Modal */}
      <BackupSyncModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </>
  );
}
