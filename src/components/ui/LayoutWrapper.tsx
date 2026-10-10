'use client';

import Link from 'next/link';
import { getStoredProgress } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { SearchModal } from './SearchModal';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useProgress();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useEffect(() => {
    // Read the persisted value even during hydration's initial server snapshot.
    document.documentElement.dataset.theme = getStoredProgress().theme;
  }, [theme]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-page text-ink selection:bg-sky-fill selection:text-ink">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Platform Engineering Footer */}
      <footer className="border-t border-line bg-inset py-8 text-center text-xs text-muted font-normal print:hidden">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-muted">
            <Link href="/labs" className="hover:text-ink transition-colors">
              Hands-On Labs
            </Link>
            <span>•</span>
            <Link href="/tools" className="hover:text-ink transition-colors">
              DevOps Tools
            </Link>
            <span>•</span>
            <Link href="/flashcards" className="hover:text-ink transition-colors">
              Flashcards
            </Link>
            <span>•</span>
            <Link href="/interview-prep" className="hover:text-ink transition-colors">
              Interview Prep
            </Link>
            <span>•</span>
            <Link href="/certificate" className="hover:text-ink transition-colors">
              Certificate
            </Link>
            <span>•</span>
            <Link href="/cheatsheet" className="hover:text-ink transition-colors">
              CLI Cheatsheet
            </Link>
            <span>•</span>
            <a href="https://github.com/gauravbhainsora/Platform-Engineer-Roadmap" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
