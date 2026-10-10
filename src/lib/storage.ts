'use client';

import confetti from 'canvas-confetti';
import { UserProgressState } from '@/types';

const STORAGE_KEY = 'platform_engineer_roadmap_progress_v1';

const DEFAULT_STATE: UserProgressState = {
  completedTopics: {},
  bookmarkedTopics: {},
  notes: {},
  quizScores: {},
  theme: 'dark',
  hasCelebrated100: false,
};

export function getStoredProgress(): UserProgressState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
    };
  } catch (e) {
    console.error('Failed to parse progress from localStorage', e);
    return DEFAULT_STATE;
  }
}

export function saveProgress(state: UserProgressState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('platform-roadmap-progress-updated', { detail: state }));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function toggleTopicCompletion(topicId: string): boolean {
  const current = getStoredProgress();
  const isCompleted = !current.completedTopics[topicId];
  current.completedTopics[topicId] = isCompleted;

  if (isCompleted) {
    triggerMiniConfetti();
  }

  saveProgress(current);
  return isCompleted;
}

export function toggleTopicBookmark(topicId: string): boolean {
  const current = getStoredProgress();
  const isBookmarked = !current.bookmarkedTopics[topicId];
  current.bookmarkedTopics[topicId] = isBookmarked;
  saveProgress(current);
  return isBookmarked;
}

export function saveTopicNote(topicId: string, noteContent: string) {
  const current = getStoredProgress();
  if (noteContent.trim() === '') {
    delete current.notes[topicId];
  } else {
    current.notes[topicId] = noteContent;
  }
  saveProgress(current);
}

export function saveQuizScore(topicOrPillarId: string, score: number, total: number) {
  const current = getStoredProgress();
  current.quizScores[topicOrPillarId] = {
    score,
    total,
    date: new Date().toISOString(),
  };

  if (score === total) {
    triggerCelebrationConfetti();
  } else if (score >= total * 0.7) {
    triggerMiniConfetti();
  }

  saveProgress(current);
}

export function triggerMiniConfetti() {
  if (typeof window === 'undefined') return;
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#38bdf8', '#34d399', '#c084fc', '#fbbf24'],
    });
  } catch (e) {
    // Ignore in non-browser
  }
}

export function triggerCelebrationConfetti() {
  if (typeof window === 'undefined') return;
  try {
    const end = Date.now() + 2 * 1000;
    const colors = ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    // Ignore in non-browser
  }
}
