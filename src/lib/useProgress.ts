'use client';

import { useSyncExternalStore } from 'react';
import { createDefaultProgress } from './progress';
import { getStoredProgress, PROGRESS_EVENT, STORAGE_KEY } from './storage';

const serverSnapshot = createDefaultProgress();
let snapshot = serverSnapshot;
let serialized = '';

function getSnapshot() {
  const next = getStoredProgress();
  const nextSerialized = JSON.stringify(next);
  if (serialized !== nextSerialized) {
    snapshot = next;
    serialized = nextSerialized;
  }
  return snapshot;
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  };
  window.addEventListener(PROGRESS_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
