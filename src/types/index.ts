export type PillarId =
  | 'linux'
  | 'networking'
  | 'auth'
  | 'containers'
  | 'cloud'
  | 'cicd'
  | 'iac'
  | 'observability';

export type BranchSide = 'left' | 'right';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CommandItem {
  cmd: string;
  desc: string;
  example?: string;
  category?: string;
}

export interface ProductionSnippet {
  language: string;
  filename: string;
  code: string;
  explanation: string;
}

export interface KeyConcept {
  title: string;
  explanation: string;
}

export interface GotchaItem {
  issue: string;
  resolution: string;
  severity: 'warning' | 'critical' | 'tip';
}

export interface InterviewQnA {
  question: string;
  answer: string;
  platformContext: string;
}

export interface ReferenceItem {
  title: string;
  url: string;
  source: string;
  type: 'official' | 'guide' | 'spec';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface TopicItem {
  id: string;
  slug: string;
  pillarId: PillarId;
  branch: BranchSide;
  order: number;
  title: string;
  subtitle: string;
  level: SkillLevel;
  estimatedMinutes: number;
  tags: string[];
  summary: string;
  overview: string;
  keyConcepts: KeyConcept[];
  diagram?: {
    title: string;
    type: 'ascii' | 'mermaid' | 'svg';
    code: string;
  };
  commands: CommandItem[];
  productionCode: ProductionSnippet;
  gotchas: GotchaItem[];
  interviewQuestions: InterviewQnA[];
  references: ReferenceItem[];
  quiz: QuizQuestion[];
}

export interface PillarMeta {
  id: PillarId;
  name: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  accentHex: string;
  totalTopics: number;
}

export interface UserProgressState {
  completedTopics: Record<string, boolean>;
  bookmarkedTopics: Record<string, boolean>;
  notes: Record<string, string>;
  quizScores: Record<string, { score: number; total: number; date: string }>;
  theme: 'dark' | 'light';
  hasCelebrated100?: boolean;
}
