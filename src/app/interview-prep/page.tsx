import MockInterview from '@/components/interview/MockInterview';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Engineer Mock Interview Room | Incident Response & System Design',
  description:
    'Practice 45-minute timed technical platform engineering interview scenarios, incident triage rubrics, and staff engineer model solutions.',
};

export default function InterviewPrepPage() {
  return (
    <main className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      <MockInterview />
    </main>
  );
}
