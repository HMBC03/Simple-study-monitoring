export type Study = {
  ts: number;
  date: string;
  minutes: number;
  steps: boolean[];
  note: string;
};

export type NotePage = {
  id: string;
  name: string;
  md: string;
  updatedAt: number;
};

export type Topic = {
  id: string;
  subjectId: string;
  name: string;
  created: string;
  studies: Study[];
  notes: NotePage[];
};

export type Subject = {
  id: string;
  name: string;
  color: string;
};

export type Archived = Study & {
  id: string;
  topic: string;
  color: string;
  subName: string;
};

export type Loose = {
  id: string;
  ts: number;
  date: string;
  minutes: number;
};

export type StepDef = { t: string; s: string };

export type LastNb = {
  subjId: string | null;
  topicId: string | null;
  pageId: string | null;
  mode: 'w' | 'md';
};

export type State = {
  name: string;
  weeklyGoal: number;
  pomodoros: number;
  ivActive: boolean[];
  stepsOn: boolean;
  steps: StepDef[];
  subjects: Subject[];
  topics: Topic[];
  loose: Loose[];
  archived: Archived[];
  lastNb: LastNb;
};

export type View = 'hoy' | 'mesa' | 'notebook' | 'historial' | 'herr' | 'guia' | 'fuentes';

export type TopicStatus = {
  cls: string;
  label: string;
  diff: number | null;
  due: Date | null;
  ret: number;
  n: number;
};

export type Entry = {
  kind: 'estudio' | 'archivo' | 'pomo';
  date: string;
  ts: number;
  minutes: number;
  subName: string;
  color: string;
  topic: string;
  topicId?: string;
  stTs?: number;
  archId?: string;
  looseId?: string;
  steps: number | null;
  stepsTot?: number;
  note: string;
};
