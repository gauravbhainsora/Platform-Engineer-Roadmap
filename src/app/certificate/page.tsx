import React from 'react';
import type { Metadata } from 'next';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';

export const metadata: Metadata = {
  title: 'Certified Platform Engineer | Verifiable Milestones & Certificate',
  description:
    'Generate and print your verified Certified Platform Engineer (CPE) completion certificate and track pillar milestone badges.',
};

export default function CertificatePage() {
  return (
    <main className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      <CertificateGenerator />
    </main>
  );
}
