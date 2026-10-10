import CertificateGenerator from '@/components/certificate/CertificateGenerator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Engineer | Milestones & Completion Certificate',
  description:
    'Track milestones and print a self-reported completion certificate after finishing the curriculum.',
};

export default function CertificatePage() {
  return (
    <main className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      <CertificateGenerator />
    </main>
  );
}
