import type { UserProgressState } from '@/types';

export const STORAGE_KEY = 'platform_engineer_roadmap_progress_v1';

export function createDefaultProgress(): UserProgressState {
  return {
    completedTopics: {}, bookmarkedTopics: {}, notes: {}, quizScores: {},
    flashcardReviews: {}, theme: 'light', hasCelebrated100: false,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readMap<T>(value: unknown, name: string, validate: (item: unknown) => item is T): Record<string, T> {
  if (!isRecord(value) || Object.entries(value).some(([key, item]) =>
    ['__proto__', 'constructor', 'prototype'].includes(key) || !validate(item))) {
    throw new Error(`Invalid ${name} in progress data.`);
  }
  return Object.fromEntries(Object.entries(value)) as Record<string, T>;
}

export function validateProgress(value: unknown, requireBackupFields = false): UserProgressState {
  if (!isRecord(value)) throw new Error('Progress must be a JSON object.');
  const defaults = createDefaultProgress();
  for (const field of ['completedTopics', 'bookmarkedTopics', 'notes', 'quizScores']) {
    if (requireBackupFields && !Object.hasOwn(value, field)) {
      throw new Error(`Backup is missing ${field}.`);
    }
  }
  const boolean = (item: unknown): item is boolean => typeof item === 'boolean';
  const string = (item: unknown): item is string => typeof item === 'string';
  const score = (item: unknown): item is UserProgressState['quizScores'][string] =>
    isRecord(item) && Number.isInteger(item.score) && Number.isInteger(item.total) &&
    typeof item.score === 'number' && typeof item.total === 'number' &&
    item.total > 0 && item.score >= 0 && item.score <= item.total &&
    typeof item.date === 'string' && Number.isFinite(Date.parse(item.date));
  const review = (item: unknown): item is NonNullable<UserProgressState['flashcardReviews']>[string] =>
    isRecord(item) && typeof item.known === 'boolean' && Number.isInteger(item.streak) &&
    typeof item.streak === 'number' && item.streak >= 0 && item.streak <= 5 &&
    typeof item.due === 'string' && Number.isFinite(Date.parse(item.due)) &&
    typeof item.lastReviewed === 'string' && Number.isFinite(Date.parse(item.lastReviewed));
  if (value.theme !== undefined && value.theme !== 'dark' && value.theme !== 'light') {
    throw new Error('Invalid theme in progress data.');
  }
  if (value.hasCelebrated100 !== undefined && typeof value.hasCelebrated100 !== 'boolean') {
    throw new Error('Invalid celebration flag in progress data.');
  }
  return {
    completedTopics: readMap(value.completedTopics === undefined ? defaults.completedTopics : value.completedTopics, 'completed topics', boolean),
    bookmarkedTopics: readMap(value.bookmarkedTopics === undefined ? defaults.bookmarkedTopics : value.bookmarkedTopics, 'bookmarks', boolean),
    notes: readMap(value.notes === undefined ? defaults.notes : value.notes, 'notes', string),
    quizScores: readMap(value.quizScores === undefined ? defaults.quizScores : value.quizScores, 'quiz scores', score),
    flashcardReviews: readMap(value.flashcardReviews === undefined ? {} : value.flashcardReviews, 'flashcard reviews', review),
    theme: value.theme === 'dark' ? 'dark' : 'light',
    hasCelebrated100: value.hasCelebrated100 === true,
  };
}

export function recoverStoredProgress(value: unknown): UserProgressState {
  if (!isRecord(value)) return createDefaultProgress();
  const recovered: Record<string, unknown> = { ...createDefaultProgress() };
  for (const key of Object.keys(recovered)) {
    let entry = value[key];
    if (entry === undefined) continue;
    // Repair scores written by the former final-answer double-counting bug.
    if (key === 'quizScores' && isRecord(entry)) {
      entry = Object.fromEntries(Object.entries(entry).map(([id, item]) => [id,
        isRecord(item) && typeof item.score === 'number' && typeof item.total === 'number' && item.score === item.total + 1
          ? { ...item, score: item.total } : item,
      ]));
    }
    try {
      const validated = validateProgress({ [key]: entry });
      recovered[key] = validated[key as keyof UserProgressState];
    } catch {
      // Keep intact fields when one legacy or corrupted field cannot be recovered.
    }
  }
  return validateProgress(recovered);
}
