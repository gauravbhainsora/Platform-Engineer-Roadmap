import React from 'react';
import { CurriculumList } from '@/components/roadmap/CurriculumList';

export const metadata = {
  title: 'Curriculum Track | Platform Engineer Roadmap',
  description: 'Complete syllabus and learning track of all 67 platform engineering topics.',
};

export default function TopicsPage() {
  return <CurriculumList />;
}
