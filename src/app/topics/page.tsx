import React from 'react';
import { CurriculumList } from '@/components/roadmap/CurriculumList';

export const metadata = {
  title: 'Curriculum Track | Platform Engineer Roadmap',
  description: 'Complete syllabus and learning track of all 73 platform engineering topics across 8 core architectural pillars.',
};

export default function TopicsPage() {
  return <CurriculumList />;
}
