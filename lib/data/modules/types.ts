export interface VocabularyWord {
  id: string;
  indonesian: string;
  english: string;
  braille: string;
  image?: string;
  imageAlt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  description?: string;
  braille?: string;
  example?: string;
  audioUrl?: string;
  image?: string;
  imageAlt?: string;
  words?: VocabularyWord[];
}

export interface Exercise {
  id: string;
  type: "multiple-choice" | "text-to-braille" | "braille-to-text";
  question: string;
  questionImage?: string;
  imageAlt?: string;
  options?: string[];
  optionImages?: string[];
  correctAnswer: string;
  hint?: string;
  points: number;
  explanation?: string;
}

export interface ModuleContent {
  lessons: Lesson[];
  exercises?: Exercise[];
  summary?: string;
}

export type Grade = 7 | 8 | 9;

export interface GradeModule {
  id: string;
  grade: Grade;
  title: string;
  description: string;
  content: ModuleContent;
  braille_content: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  order_number: number;
  created_at: string;
}
