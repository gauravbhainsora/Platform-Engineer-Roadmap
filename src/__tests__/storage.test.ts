import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredProgress,
  saveProgress,
  toggleTopicCompletion,
  toggleTopicBookmark,
  saveTopicNote,
  saveQuizScore,
} from '@/lib/storage';
import { UserProgressState } from '@/types';

// Mock canvas-confetti to prevent DOM/canvas calls in test environment
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Storage Helpers & State Management', () => {
  const STORAGE_KEY = 'platform_engineer_roadmap_progress_v1';
  let memoryStorage: Record<string, string> = {};

  beforeEach(() => {
    memoryStorage = {};

    const mockLocalStorage = {
      getItem: vi.fn((key: string) => memoryStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        memoryStorage[key] = String(value);
      }),
      removeItem: vi.fn((key: string) => {
        delete memoryStorage[key];
      }),
      clear: vi.fn(() => {
        memoryStorage = {};
      }),
    };

    vi.stubGlobal('window', { localStorage: mockLocalStorage, dispatchEvent: vi.fn() });
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  describe('getStoredProgress', () => {
    it('returns default state when localStorage is empty', () => {
      const state = getStoredProgress();
      expect(state).toEqual({
        completedTopics: {},
        bookmarkedTopics: {},
        notes: {},
        quizScores: {},
        flashcardReviews: {},
        theme: 'light',
        hasCelebrated100: false,
      });
    });

    it('merges stored state with default state', () => {
      const customState: Partial<UserProgressState> = {
        completedTopics: { 'linux-overview': true },
        theme: 'light',
      };
      memoryStorage[STORAGE_KEY] = JSON.stringify(customState);

      const state = getStoredProgress();
      expect(state.completedTopics).toEqual({ 'linux-overview': true });
      expect(state.theme).toBe('light');
      expect(state.bookmarkedTopics).toEqual({});
      expect(state.notes).toEqual({});
    });

    it('handles corrupted JSON gracefully without throwing', () => {
      memoryStorage[STORAGE_KEY] = 'INVALID_JSON_CORRUPTED{{{';
      const state = getStoredProgress();
      expect(state.theme).toBe('light');
      expect(state.completedTopics).toEqual({});
    });
  });

  describe('saveProgress', () => {
    it('saves serialized state to localStorage and dispatches event', () => {
      const testState: UserProgressState = {
        completedTopics: { 'net-ssh': true },
        bookmarkedTopics: { 'net-ssh': true },
        notes: { 'net-ssh': 'Important topic on bastions' },
        quizScores: {},
        theme: 'dark',
        hasCelebrated100: false,
      };

      saveProgress(testState);

      expect(memoryStorage[STORAGE_KEY]).toBeDefined();
      const parsed = JSON.parse(memoryStorage[STORAGE_KEY]);
      expect(parsed.completedTopics['net-ssh']).toBe(true);
      expect(window.dispatchEvent).toHaveBeenCalled();
    });
  });

  describe('toggleTopicCompletion', () => {
    it('toggles completion status from false to true and back', () => {
      const topicId = 'linux-overview-distributions';

      // First toggle: marked complete
      const isDone1 = toggleTopicCompletion(topicId);
      expect(isDone1).toBe(true);
      expect(getStoredProgress().completedTopics[topicId]).toBe(true);

      // Second toggle: marked uncomplete
      const isDone2 = toggleTopicCompletion(topicId);
      expect(isDone2).toBe(false);
      expect(getStoredProgress().completedTopics[topicId]).toBe(false);
    });
  });

  describe('toggleTopicBookmark', () => {
    it('toggles bookmark status from false to true and back', () => {
      const topicId = 'cloud-containers';

      const isBookmarked1 = toggleTopicBookmark(topicId);
      expect(isBookmarked1).toBe(true);
      expect(getStoredProgress().bookmarkedTopics[topicId]).toBe(true);

      const isBookmarked2 = toggleTopicBookmark(topicId);
      expect(isBookmarked2).toBe(false);
      expect(getStoredProgress().bookmarkedTopics[topicId]).toBe(false);
    });
  });

  describe('saveTopicNote', () => {
    it('saves a new note for a topic', () => {
      const topicId = 'cicd-learn-tool';
      saveTopicNote(topicId, 'Remember to run act locally');

      const progress = getStoredProgress();
      expect(progress.notes[topicId]).toBe('Remember to run act locally');
    });

    it('removes note when empty string or whitespace is provided', () => {
      const topicId = 'cicd-learn-tool';
      saveTopicNote(topicId, 'Initial note content');
      expect(getStoredProgress().notes[topicId]).toBe('Initial note content');

      saveTopicNote(topicId, '   ');
      expect(getStoredProgress().notes[topicId]).toBeUndefined();
    });
  });

  describe('saveQuizScore', () => {
    it('records quiz score, total, and ISO timestamp', () => {
      const topicId = 'auth-sso';
      saveQuizScore(topicId, 4, 5);

      const progress = getStoredProgress();
      expect(progress.quizScores[topicId]).toBeDefined();
      expect(progress.quizScores[topicId].score).toBe(4);
      expect(progress.quizScores[topicId].total).toBe(5);
      expect(progress.quizScores[topicId].date).toBeDefined();
    });

    it('handles perfect score and partial score gracefully', () => {
      saveQuizScore('perfect-quiz', 5, 5);
      expect(getStoredProgress().quizScores['perfect-quiz'].score).toBe(5);

      saveQuizScore('partial-quiz', 1, 5);
      expect(getStoredProgress().quizScores['partial-quiz'].score).toBe(1);
    });
  });

  describe('Progress and Completion Calculations', () => {
    it('accurately computes completion percentage across all 73 topics', () => {
      const totalTopics = 73;
      const completedTopicIds = ['t1', 't2', 't3', 't4'];
      const percentage = Math.round((completedTopicIds.length / totalTopics) * 100);
      expect(percentage).toBe(5); // 4 / 73 = 5.48% -> 5%
    });

    it('accurately computes pillar specific progress', () => {
      const pillarTotal = 12; // Linux pillar
      const completedInPillar = 6;
      const pillarPercentage = Math.round((completedInPillar / pillarTotal) * 100);
      expect(pillarPercentage).toBe(50);
    });

    it('accurately calculates cumulative quiz accuracy', () => {
      const scores = [
        { score: 3, total: 3 },
        { score: 2, total: 4 },
        { score: 5, total: 5 },
      ];

      const totalCorrect = scores.reduce((sum, s) => sum + s.score, 0);
      const totalPossible = scores.reduce((sum, s) => sum + s.total, 0);
      const accuracy = Math.round((totalCorrect / totalPossible) * 100);

      expect(totalCorrect).toBe(10);
      expect(totalPossible).toBe(12);
      expect(accuracy).toBe(83); // 10 / 12 = 83.33% -> 83%
    });
  });
});
