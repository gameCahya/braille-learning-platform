// Database Models
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  content: ModuleContent;
  braille_content: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  order_number: number; // FIXED: Changed from orderNumber to match database
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
  image?: string; // URL gambar untuk lesson
  imageAlt?: string; // Alt text untuk accessibility
}

export interface Exercise {
  id: string;
  type: "multiple-choice" | "text-to-braille" | "braille-to-text";
  question: string;
  questionImage?: string; // Gambar untuk soal
  options?: string[];
  optionImages?: string[]; // Gambar untuk opsi jawaban
  correctAnswer: string;
  hint?: string;
  points: number;
  explanation?: string; // Penjelasan jawaban
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  score?: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  total_points: number; // NEW: Added to match database
  correct_answers: number; // NEW: Added to match database
  total_questions: number; // NEW: Added to match database
  answers: Record<string, string>;
  details?: Record<string, unknown>; // NEW: Added to match database (JSONB)
  feedback?: string; // NEW: Added to match database
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}

export interface BrailleConversion {
  input: string;
  output: string;
  direction: "text-to-braille" | "braille-to-text";
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
