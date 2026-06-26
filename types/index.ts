import type { Tables } from "@/types/supabase";

// =============================================
// Database types — langsung dari generated schema
// Selalu akurat, tidak perlu update manual
// =============================================
export type Profile = Tables<"profiles">;
export type UserProgress = Tables<"user_progress">;
export type QuizResult = Tables<"quiz_results">;
export type ModuleAudio = Tables<"module_audio">;
export type Classroom = Tables<"classrooms">;
export type Student = Tables<"students">;
export type TeacherModuleRow = Tables<"teacher_modules">;

export interface TeacherModuleLesson {
  id: string;
  title: string;
  content: string;
  braille?: string;
}

export interface TeacherModule extends Omit<TeacherModuleRow, "lessons"> {
  lessons: TeacherModuleLesson[];
}

// =============================================
// Teacher Quiz types
// =============================================
export type TeacherQuizRow = Tables<"teacher_quizzes">;

export interface TeacherQuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface TeacherQuiz extends Omit<TeacherQuizRow, "questions"> {
  questions: TeacherQuizQuestion[];
}

// =============================================
// Static data types — tidak ada di database,
// dipakai untuk data modul statis di lib/data/
// =============================================
export interface Module {
  id: string;
  title: string;
  description: string;
  content: ModuleContent;
  braille_content: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  order_number: number;
  created_at: string;
}

export interface ModuleContent {
  lessons: Lesson[];
  exercises?: Exercise[];
  summary?: string;
}

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

export interface BrailleConversion {
  input: string;
  output: string;
  direction: "text-to-braille" | "braille-to-text";
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// =============================================
// Pre/Post Test types
// =============================================

export interface PrePostAnswer {
  questionId: number;
  question: string;
  questionType: "mcq" | "essay";
  userAnswer: string | null;
  correctAnswer: string | string[];
  isCorrect: boolean | null;  // null untuk essay yang belum direview
}

export interface PrePostEssayResult {
  questionId: number;
  question: string;
  userAnswer: string;
  acceptedAnswers: string[];
  score: 0 | 5 | 10;
}

export interface PrePostQuestion {
  id: number;
  question: string;
  type: "mcq" | "essay";
  options?: string[];
  answer: string | string[]; // string untuk mcq, string[] untuk essay (lowercase+trim)
}

export interface PrePostTestData {
  moduleId: string;
  moduleTitle: string;
  material: string;
  gradeLevel?: "7" | "8" | "9";
  questions: PrePostQuestion[];
  maxScore: number;     // 75
  mcqCount: number;     // 5
  essayCount: number;   // 5
  mcqMaxScore: number;  // 25
  essayMaxScore: number; // 50
}
