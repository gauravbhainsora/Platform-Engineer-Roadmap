import React from 'react';
import { QuizHub } from '@/components/quiz/QuizHub';

export const metadata = {
  title: 'Platform Engineering Quizzes | Platform Engineer Roadmap',
  description: 'Self-assessment technical quizzes with instant feedback and explanations across all 8 pillars.',
};

export default function QuizzesPage() {
  return <QuizHub />;
}
