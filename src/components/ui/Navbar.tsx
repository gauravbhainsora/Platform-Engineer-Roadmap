'use client';

import { ALL_TOPICS } from '@/data';
import { useProgress } from '@/lib/useProgress';
import {
  Award,
  BookOpen,
  Box,
  CheckCircle2,
  Compass,
  Database,
  Layers,
  Menu,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import BackupSyncModal from './BackupSyncModal';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const progress = useProgress();
  const completedCount = ALL_TOPICS.filter((topic) => progress.completedTopics[topic.id]).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const totalCount = ALL_TOPICS.length;

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
      <header className="sticky top-0 z-40 w-full border-b border-line bg-inset backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <Link href="/" className="group flex items-center gap-1 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-sky-fill text-ink font-bold shadow-sm transition-transform group-hover:scale-105">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold leading-tight tracking-tight text-ink text-xs sm:text-lg">
                    Platform Engineer
                  </span>
                  <span className="hidden sm:inline rounded bg-subtle px-1.5 py-0.5 text-xs font-semibold text-body border border-line">
                    ROADMAP
                  </span>
                </div>
                <p className="text-xs text-muted font-normal hidden xl:block">
                  8 Pillars • {totalCount} Topics
                </p>
              </div>
            </Link>

          </div>

          {/* Right Action Tools */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <ThemeToggle />
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Search topics"
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-muted hover:border-line hover:text-ink transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-muted" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden sm:inline rounded bg-subtle px-1.5 py-0.5 text-xs text-muted font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Backup & Sync Trigger Button */}
            <button
              onClick={() => setIsBackupModalOpen(true)}
              title="Backup, Sync & Data Migration"
              className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-body hover:border-cyan-line hover:text-cyan-ink transition-colors"
            >
              <Database className="h-3.5 w-3.5 text-cyan-ink" />
              <span className="hidden lg:inline font-medium">Sync</span>
            </button>

            {/* Progress Tracker Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-ink">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-subtle">
                <div
                  className="h-full bg-gradient-to-r from-sky-fill to-emerald-fill transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-muted">
                {percentage}%
              </span>
            </div>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/gauravbhainsora/Platform-Engineer-Roadmap"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-body hover:border-line hover:text-ink transition-colors"
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
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="xl:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-body hover:text-ink"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main navigation" className="hidden xl:flex mx-auto max-w-7xl flex-wrap items-center gap-1 px-4 sm:px-6 lg:px-8 pb-3 text-sm font-medium">
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
                        ? 'bg-subtle text-ink font-semibold'
                        : 'text-body hover:bg-hover hover:text-ink'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

        {/* Mobile / Tablet Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-line bg-inset px-4 py-3 space-y-1">
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
                        ? 'bg-subtle text-sky-ink'
                        : 'text-body hover:bg-surface'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-line flex items-center justify-between text-xs text-muted px-1">
              <span>Progress: {completedCount}/{totalCount} ({percentage}%)</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBackupModalOpen(true);
                }}
                className="text-cyan-ink hover:underline flex items-center gap-1 font-medium"
              >
                <Database className="h-3 w-3" />
                Backup & Sync
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Backup and Sync Modal */}
      {isBackupModalOpen && <BackupSyncModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />}
    </>
  );
}
