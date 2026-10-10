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
          <p>© Platform Engineer Roadmap • Open Source Study Platform</p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com/gauravbhainsora/Platform-Engineer-Roadmap" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub Repository
            </a>
            <span>•</span>
            <a href="/cheatsheet" className="hover:text-white transition-colors">
              CLI Cheat Sheet
            </a>
            <span>•</span>
            <a href="/quizzes" className="hover:text-white transition-colors">
              Quizzes
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
