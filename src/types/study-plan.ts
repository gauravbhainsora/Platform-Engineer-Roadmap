export interface StudyModule {
  id: string;
  title: string;
  prerequisites: string[];
  core: string[];
  advanced: string[];
  edgeCases: string[];
  lab: string;
  guideIds: string[];
  sourceIds: string[];
}

export interface StudyStage {
  id: string;
  title: string;
  level: string;
  goal: string;
  entryRequirements: string[];
  capstone: string;
  exitCriteria: string[];
  modules: StudyModule[];
}

export interface StudyPlan {
  title: string;
  reviewedAt: string;
  scope: string;
  studyMethod: string[];
  stages: StudyStage[];
  sources: { id: string; title: string; url: string }[];
}
