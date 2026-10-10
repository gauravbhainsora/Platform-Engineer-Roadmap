import React from 'react';
import { CheatSheetView } from '@/components/cheatsheet/CheatSheetView';

export const metadata = {
  title: 'CLI Cheat Sheet | Platform Engineer Roadmap',
  description: 'Searchable database of essential commands for Linux, Docker, Kubernetes, Terraform, Git, and Observability.',
};

export default function CheatSheetPage() {
  return <CheatSheetView />;
}
