import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProgress, recoverStoredProgress, validateProgress } from '@/lib/progress';
import { getStoredProgress, saveFlashcardReview, saveProgress, saveQuizScore, STORAGE_KEY, toggleTopicBookmark } from '@/lib/storage';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

describe('Progress recovery and persistence', () => {
  let memory: Record<string, string>;
  beforeEach(() => {
    memory = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => memory[key] ?? null,
      setItem: (key: string, value: string) => { memory[key] = value; },
    });
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('does not retain mutations when storage is cleared', () => {
    toggleTopicBookmark('topic');
    memory = {};
    expect(getStoredProgress().bookmarkedTopics).toEqual({});
    const first = getStoredProgress();
    first.notes.topic = 'changed';
    expect(getStoredProgress().notes).toEqual({});
  });

  it('recovers valid fields while isolating corrupt fields and legacy scores', () => {
    const restored = recoverStoredProgress({
      completedTopics: null, notes: { topic: 'Keep this note' },
      quizScores: { linux: { score: 11, total: 10, date: '2026-10-10T00:00:00.000Z' } },
    });
    expect(restored.completedTopics).toEqual({});
    expect(restored.notes.topic).toBe('Keep this note');
    expect(restored.quizScores.linux.score).toBe(10);
  });

  it.each([{}, [], null, { ...createDefaultProgress(), completedTopics: 'all' },
    { ...createDefaultProgress(), notes: { topic: 42 } },
    { ...createDefaultProgress(), theme: 'invalid' },
    { ...createDefaultProgress(), quizScores: { topic: { score: 11, total: 10, date: 'invalid' } } },
  ])('rejects invalid backups without replacing saved progress: %j', (input) => {
    saveProgress({ ...createDefaultProgress(), notes: { topic: 'Keep me' } });
    const previous = memory[STORAGE_KEY];
    expect(() => validateProgress(input, true)).toThrow();
    expect(memory[STORAGE_KEY]).toBe(previous);
  });

  it('accepts exported v1 backups without flashcard reviews', () => {
    const legacy = { completedTopics: {}, bookmarkedTopics: {}, notes: {}, quizScores: {}, theme: 'dark' };
    expect(validateProgress(legacy, true).flashcardReviews).toEqual({});
  });

  it('reports failed writes and does not dispatch a success event', () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('Quota exceeded'); } });
    expect(saveProgress(createDefaultProgress())).toBe(false);
    expect(window.dispatchEvent).not.toHaveBeenCalled();
    expect(toggleTopicBookmark('topic')).toBe(false);
  });

  it('rejects impossible quiz scores', () => {
    expect(saveQuizScore('linux', 11, 10)).toBe(false);
    expect(saveQuizScore('linux', 0, 0)).toBe(false);
    expect(memory[STORAGE_KEY]).toBeUndefined();
  });

  it('persists review intervals and resets the streak for forgotten cards', () => {
    const now = new Date('2026-10-10T00:00:00Z');
    saveFlashcardReview('card', true, now);
    expect(getStoredProgress().flashcardReviews?.card.due).toBe('2026-10-11T00:00:00.000Z');
    saveFlashcardReview('card', true, now);
    expect(getStoredProgress().flashcardReviews?.card.due).toBe('2026-10-13T00:00:00.000Z');
    saveFlashcardReview('card', false, now);
    expect(getStoredProgress().flashcardReviews?.card).toMatchObject({ known: false, streak: 0, due: '2026-10-10T00:10:00.000Z' });
  });
});
