import { CurriculumList } from '@/components/roadmap/CurriculumList';
import { StudyPlan } from '@/components/roadmap/StudyPlan';

export const metadata = {
  title: 'Curriculum Track | Platform Engineer Roadmap',
  description: 'Beginner-to-expert platform engineering study plan: foundations, Linux, networking, Kubernetes, cloud delivery, distributed systems, reliability, security, and internal platform design.',
};

export default function TopicsPage() {
  return <CurriculumList studyPlan={<StudyPlan />} />;
}
