import React from 'react';
import type { Metadata } from 'next';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';

export const metadata: Metadata = {
  title: 'Platform Engineering Flashcards | Spaced Repetition & Interview Prep',
  description:
    'Test and drill your platform engineering, Kubernetes, Linux, and cloud infrastructure knowledge with 3D spaced repetition flashcards.',
};

export default function FlashcardsPage() {
  return (
    <main className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      <FlashcardDeck />
    </main>
  );
}
