import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Engineering Flashcards | Spaced Repetition & Interview Prep',
  description:
    'Review platform engineering, Kubernetes, Linux, and cloud concepts with flashcards and locally saved review schedules.',
};

export default function FlashcardsPage() {
  return (
    <main className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      <FlashcardDeck />
    </main>
  );
}
