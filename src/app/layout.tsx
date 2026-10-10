import type { Metadata } from 'next';
import './globals.css';
import { LayoutWrapper } from '@/components/ui/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Platform Engineer Roadmap | Interactive Study Platform',
  description:
    'Comprehensive Platform Engineering and Cloud Infrastructure curriculum covering Linux, Networking, Auth, Containers, Cloud, CI/CD, IaC, and Observability.',
  keywords: [
    'Platform Engineer',
    'DevOps Roadmap',
    'Kubernetes',
    'Docker',
    'Terraform',
    'Linux',
    'Networking',
    'Observability',
    'Cloud Architecture',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
