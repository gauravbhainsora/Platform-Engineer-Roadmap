import { LayoutWrapper } from '@/components/ui/LayoutWrapper';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
