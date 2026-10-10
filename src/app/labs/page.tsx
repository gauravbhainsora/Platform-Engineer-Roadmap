import HandsOnLabs from '@/components/labs/HandsOnLabs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hands-On Production Labs | Platform Engineer Incident Challenges',
  description:
    'Master real-world platform engineering: fix Kubernetes CrashLoopBackOff YAML, architect secure multi-stage distroless Dockerfiles, and remediate Terraform state drift.',
  keywords: [
    'Kubernetes CrashLoopBackOff Lab',
    'Docker Multi-Stage Build Challenge',
    'Terraform State Drift Remediation',
    'Platform Engineering Labs',
    'DevOps Hands-On Scenarios',
    'Production Outage Debugging',
  ],
};

export default function LabsPage() {
  return (
    <main className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      <HandsOnLabs />
    </main>
  );
}
