export interface Module {
  slug: string;
  title: string;
  orderIndex: number;
  description: string;
  estimatedMinutes: number;
  subsections: Lesson[];
}

/** A lesson is a single teachable unit within a module */
export interface Lesson {
  title: string;
  objective: string;
  pageRange: string;
  blocks: LessonBlock[];
}

/** Content block types for rich lesson content */
export type LessonBlock =
  | { type: "text"; content: string }
  | { type: "concept"; title: string; content: string }
  | { type: "analogy"; content: string }
  | { type: "example"; title: string; content: string }
  | { type: "warning"; content: string }
  | { type: "keypoint"; content: string }
  | { type: "figure"; caption: string }
  | { type: "check"; question: string; answer: string }
  | { type: "formula"; label: string; formula: string; explanation: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "memorize"; items: { label: string; value: string }[] };

/** Legacy subsection format (for backwards compat with raw extracted content) */
export interface Subsection {
  title: string;
  content: string;
  pageRange: string;
}

export interface UserProgress {
  moduleId: string;
  moduleSlug: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  completedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}
