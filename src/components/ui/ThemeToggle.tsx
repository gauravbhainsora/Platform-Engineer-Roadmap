'use client';

import { getStoredProgress, saveProgress } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme } = useProgress();
  const [error, setError] = useState(false);
  const isDark = theme === 'dark';

  const toggle = () => {
    const current = getStoredProgress();
    setError(!saveProgress({ ...current, theme: current.theme === 'dark' ? 'light' : 'dark' }));
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-body hover:bg-hover hover:text-ink transition-colors"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      {error && (
        <p role="alert" className="absolute right-0 top-11 z-50 w-60 rounded-xl border border-line bg-surface p-3 text-sm text-rose-ink shadow-lg">
          Could not save your theme. Allow browser storage and try again.
        </p>
      )}
    </div>
  );
}
