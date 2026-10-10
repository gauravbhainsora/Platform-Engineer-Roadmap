'use client';

import { useSyncExternalStore } from 'react';
import { LAB_PROGRESS_KEY } from '@/data/labs';

const empty: Record<string, boolean> = {};
let cached = empty;
let cachedRaw: string | null = null;
function getSnapshot() {
  try {
    const raw = localStorage.getItem(LAB_PROGRESS_KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    cached = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) &&
      Object.values(parsed).every((value) => typeof value === 'boolean') ? parsed as Record<string, boolean> : empty;
  } catch { cached = empty; }
  return cached;
}
function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === LAB_PROGRESS_KEY || event.key === null) onChange(); };
  window.addEventListener('platform-roadmap-labs-updated', onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('platform-roadmap-labs-updated', onChange);
    window.removeEventListener('storage', onStorage);
  };
}
export function useLabProgress() { return useSyncExternalStore(subscribe, getSnapshot, () => empty); }
