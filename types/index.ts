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
