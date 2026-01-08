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
  orderNumber: number;
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
  description?: string; // Made optional
  braille?: string;
  example?: string;
  audioUrl?: string;
  image?: string;
}

export interface Exercise {
  id: string;
  type: "multiple-choice" | "text-to-braille" | "braille-to-text" | "fill-blank";
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  points: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  score?: number | null; // Made optional and nullable
  completed_at: string | null;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  answers: Record<string, string>;
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