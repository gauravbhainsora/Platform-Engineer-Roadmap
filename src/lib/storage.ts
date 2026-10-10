'use client';

import confetti from 'canvas-confetti';
import { UserProgressState } from '@/types';
import { createDefaultProgress, recoverStoredProgress, STORAGE_KEY, validateProgress } from './progress';

export { STORAGE_KEY } from './progress';
export const PROGRESS_EVENT = 'platform-roadmap-progress-updated';

export function getStoredProgress(): UserProgressState {
  if (typeof window === 'undefined') return createDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    return recoverStoredProgress(parsed);
  } catch (e) {
    console.error('Failed to parse progress from localStorage', e);
    return createDefaultProgress();
  }
}

export function saveProgress(state: UserProgressState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const validated = validateProgress(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: validated }));
    return true;
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
    return false;
  }
}

export function toggleTopicCompletion(topicId: string): boolean {
  const current = getStoredProgress();
  const isCompleted = !current.completedTopics[topicId];
  current.completedTopics[topicId] = isCompleted;

  if (!saveProgress(current)) return !isCompleted;
  if (isCompleted) {
    triggerMiniConfetti();
  }

  return isCompleted;
}

export function toggleTopicBookmark(topicId: string): boolean {
  const current = getStoredProgress();
  const isBookmarked = !current.bookmarkedTopics[topicId];
  current.bookmarkedTopics[topicId] = isBookmarked;
  return saveProgress(current) ? isBookmarked : !isBookmarked;
}

export function saveTopicNote(topicId: string, noteContent: string) {
  const current = getStoredProgress();
  if (noteContent.trim() === '') {
    delete current.notes[topicId];
  } else {
    current.notes[topicId] = noteContent;
  }
  return saveProgress(current);
}

export function saveQuizScore(topicOrPillarId: string, score: number, total: number) {
  if (!Number.isInteger(score) || !Number.isInteger(total) || total <= 0 || score < 0 || score > total) return false;
  const current = getStoredProgress();
  current.quizScores[topicOrPillarId] = {
    score,
    total,
    date: new Date().toISOString(),
  };

  if (!saveProgress(current)) return false;
  if (score === total) {
    triggerCelebrationConfetti();
  } else if (score >= total * 0.7) {
    triggerMiniConfetti();
  }

  return true;
}

export function saveFlashcardReview(cardId: string, known: boolean, now = new Date()) {
  const progress = getStoredProgress();
  const reviews = progress.flashcardReviews ?? {};
  const streak = known ? Math.min((reviews[cardId]?.streak ?? 0) + 1, 5) : 0;
  const delay = known ? [1, 3, 7, 14, 30][streak - 1] * 86400000 : 10 * 60000;
  progress.flashcardReviews = { ...reviews, [cardId]: {
    known, streak, lastReviewed: now.toISOString(), due: new Date(now.getTime() + delay).toISOString(),
  } };
  return saveProgress(progress);
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
  } catch {
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
  } catch {
    // Ignore in non-browser
  }
}

export const triggerConfetti = triggerCelebrationConfetti;
