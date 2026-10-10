'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { SearchModal } from './SearchModal';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-sky-500 selection:text-slate-950">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Platform Engineering Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 py-10 text-center text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400">
            <a href="/labs" className="hover:text-white transition-colors">
              Hands-On Labs
            </a>
            <span>•</span>
            <a href="/tools" className="hover:text-white transition-colors">
              DevOps Tools
            </a>
            <span>•</span>
            <a href="/flashcards" className="hover:text-white transition-colors">
              Flashcards
            </a>
            <span>•</span>
            <a href="/interview-prep" className="hover:text-white transition-colors">
              Interview Prep
            </a>
            <span>•</span>
            <a href="/certificate" className="hover:text-white transition-colors">
              Certificate
            </a>
            <span>•</span>
            <a href="/cheatsheet" className="hover:text-white transition-colors">
              CLI Cheatsheet
            </a>
            <span>•</span>
            <a href="https://github.com/gauravbhainsora/Platform-Engineer-Roadmap" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
