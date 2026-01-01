// User related types
export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  createdAt: string
  updatedAt?: string
}

// Lesson structure untuk Braille learning
export interface Lesson {
  id: string
  letter?: string
  braille?: string
  dots?: string
  description: string
  example?: string
  audioUrl?: string
}

// Exercise structure
export interface Exercise {
  id: string
  type: 'multiple-choice' | 'text-to-braille' | 'braille-to-text' | 'fill-blank'
  question: string
  options?: string[]
  correctAnswer: string
  points: number
  explanation?: string
}

// Module content structure
export interface ModuleContent {
  lessons: Lesson[]
  exercises?: Exercise[]
  summary?: string
  resources?: {
    title: string
    url: string
    type: 'pdf' | 'video' | 'article'
  }[]
}

// Main Module interface
export interface Module {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  orderNumber: number
  content: ModuleContent
  brailleContent?: string
  createdAt: string
}

// User progress tracking
export interface UserProgress {
  id: string
  userId: string
  moduleId: string
  completed: boolean
  score?: number
  completedAt?: string
  createdAt: string
}

// Quiz types
export interface Quiz {
  id: string
  moduleId: string
  title: string
  questions: Exercise[]
  totalPoints: number
}

export interface QuizResult {
  id: string
  userId: string
  moduleId: string
  quizId?: string
  score: number
  totalPoints: number
  correctAnswers: number
  totalQuestions: number
  answers: Record<string, string>
  details?: {
    questionId: string
    correct: boolean
    userAnswer: string
    correctAnswer: string
    points: number
  }[]
  feedback?: string
  createdAt: string
}

// Chat history for AI tutor
export interface ChatMessage {
  id: string
  userId: string
  message: string
  response: string
  createdAt: string
}

export interface ConversationHistory {
  role: 'user' | 'assistant'
  content: string
}

// Braille conversion types
export interface BrailleConversion {
  input: string
  output: string
  direction: 'text-to-braille' | 'braille-to-text'
}

export interface BrailleCharacter {
  char: string
  braille: string
  dots: string
  unicode?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Statistics for progress dashboard
export interface LearningStatistics {
  totalModules: number
  completedModules: number
  averageScore: number
  totalTimeSpent?: number
  currentStreak?: number
  bestScore?: number
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName: string
}

// Database table names (for type safety)
export enum Tables {
  PROFILES = 'profiles',
  MODULES = 'modules',
  USER_PROGRESS = 'user_progress',
  QUIZ_RESULTS = 'quiz_results',
  CHAT_HISTORY = 'chat_history'
}