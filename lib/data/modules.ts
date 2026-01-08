import type { Module } from "@/types";

export const MODULES: Module[] = [
  {
    id: "module-1",
    title: "Braille Alphabet (A-Z)",
    description: "Learn the complete Braille alphabet from A to Z",
    difficulty: "beginner",
    orderNumber: 1,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Master the foundation of Braille by learning all 26 letters of the English alphabet.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Letters A-E",
          content: "Learn the first five letters of the Braille alphabet.",
          braille: "⠁ ⠃ ⠉ ⠙ ⠑",
          example: "A = ⠁ (dot 1), B = ⠃ (dots 1-2), C = ⠉ (dots 1-4), D = ⠙ (dots 1-4-5), E = ⠑ (dots 1-5)",
        },
        {
          id: "lesson-1-2",
          title: "Letters F-J",
          content: "Continue with the next five letters.",
          braille: "⠋ ⠛ ⠓ ⠊ ⠚",
          example: "F = ⠋ (dots 1-2-4), G = ⠛ (dots 1-2-4-5), H = ⠓ (dots 1-2-5), I = ⠊ (dots 2-4), J = ⠚ (dots 2-4-5)",
        },
        {
          id: "lesson-1-3",
          title: "Letters K-O",
          content: "Learn the third group of letters.",
          braille: "⠅ ⠇ ⠍ ⠝ ⠕",
          example: "K = ⠅ (dots 1-3), L = ⠇ (dots 1-2-3), M = ⠍ (dots 1-3-4), N = ⠝ (dots 1-3-4-5), O = ⠕ (dots 1-3-5)",
        },
        {
          id: "lesson-1-4",
          title: "Letters P-T",
          content: "Master the fourth group of letters.",
          braille: "⠏ ⠟ ⠗ ⠎ ⠞",
          example: "P = ⠏ (dots 1-2-3-4), Q = ⠟ (dots 1-2-3-4-5), R = ⠗ (dots 1-2-3-5), S = ⠎ (dots 2-3-4), T = ⠞ (dots 2-3-4-5)",
        },
        {
          id: "lesson-1-5",
          title: "Letters U-Z",
          content: "Complete the alphabet with the final letters.",
          braille: "⠥ ⠧ ⠺ ⠭ ⠽ ⠵",
          example: "U = ⠥ (dots 1-3-6), V = ⠧ (dots 1-2-3-6), W = ⠺ (dots 2-4-5-6), X = ⠭ (dots 1-3-4-6), Y = ⠽ (dots 1-3-4-5-6), Z = ⠵ (dots 1-3-5-6)",
        },
      ],
      exercises: [
        {
          id: "ex-1-1",
          type: "multiple-choice",
          question: "What is the Braille representation of letter 'A'?",
          options: ["⠁", "⠃", "⠉", "⠙"],
          correctAnswer: "⠁",
          points: 10,
        },
        {
          id: "ex-1-2",
          type: "multiple-choice",
          question: "Which letter does ⠓ represent?",
          options: ["F", "G", "H", "I"],
          correctAnswer: "H",
          points: 10,
        },
      ],
    },
  },
  {
    id: "module-2",
    title: "Numbers in Braille",
    description: "Learn how to write and read numbers in Braille",
    difficulty: "beginner",
    orderNumber: 2,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Understand the number indicator and how numbers are represented in Braille.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Number Indicator",
          content: "The number indicator (⠼) is placed before numbers to distinguish them from letters.",
          braille: "⠼",
          example: "Number indicator: ⠼ (dots 3-4-5-6). This tells the reader that what follows are numbers, not letters.",
        },
        {
          id: "lesson-2-2",
          title: "Numbers 1-5",
          content: "Learn the first five numbers in Braille.",
          braille: "⠼⠁ ⠼⠃ ⠼⠉ ⠼⠙ ⠼⠑",
          example: "1 = ⠼⠁, 2 = ⠼⠃, 3 = ⠼⠉, 4 = ⠼⠙, 5 = ⠼⠑. Numbers use the same patterns as letters A-E with the number indicator.",
        },
        {
          id: "lesson-2-3",
          title: "Numbers 6-0",
          content: "Complete learning all single-digit numbers.",
          braille: "⠼⠋ ⠼⠛ ⠼⠓ ⠼⠊ ⠼⠚",
          example: "6 = ⠼⠋, 7 = ⠼⠛, 8 = ⠼⠓, 9 = ⠼⠊, 0 = ⠼⠚. Note that 0 uses the pattern for J.",
        },
        {
          id: "lesson-2-4",
          title: "Multi-digit Numbers",
          content: "Learn how to write numbers with multiple digits.",
          braille: "⠼⠁⠃ ⠼⠁⠚⠚",
          example: "12 = ⠼⠁⠃, 100 = ⠼⠁⠚⠚. The number indicator is only used once at the beginning.",
        },
      ],
      exercises: [
        {
          id: "ex-2-1",
          type: "multiple-choice",
          question: "What does the symbol ⠼ indicate?",
          options: ["Capital letter", "Numbers follow", "End of sentence", "Space"],
          correctAnswer: "Numbers follow",
          points: 10,
        },
        {
          id: "ex-2-2",
          type: "multiple-choice",
          question: "How do you write the number 5 in Braille?",
          options: ["⠼⠁", "⠼⠑", "⠼⠋", "⠼⠊"],
          correctAnswer: "⠼⠑",
          points: 10,
        },
      ],
    },
  },
  {
    id: "module-3",
    title: "Common Words",
    description: "Practice reading and writing common English words in Braille",
    difficulty: "beginner",
    orderNumber: 3,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Build your vocabulary by learning frequently used English words in Braille.",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Basic Pronouns",
          content: "Learn common pronouns in Braille.",
          braille: "⠊ ⠽⠕⠥ ⠓⠑ ⠎⠓⠑ ⠺⠑ ⠞⠓⠑⠽",
          example: "I = ⠊, you = ⠽⠕⠥, he = ⠓⠑, she = ⠎⠓⠑, we = ⠺⠑, they = ⠞⠓⠑⠽",
        },
        {
          id: "lesson-3-2",
          title: "Common Verbs",
          content: "Learn basic action words in Braille.",
          braille: "⠊⠎ ⠁⠗⠑ ⠺⠁⠎ ⠓⠁⠧⠑ ⠙⠕",
          example: "is = ⠊⠎, are = ⠁⠗⠑, was = ⠺⠁⠎, have = ⠓⠁⠧⠑, do = ⠙⠕",
        },
        {
          id: "lesson-3-3",
          title: "Question Words",
          content: "Learn how to ask questions in Braille.",
          braille: "⠺⠓⠁⠞ ⠺⠓⠑⠗⠑ ⠺⠓⠑⠝ ⠺⠓⠽ ⠓⠕⠺",
          example: "what = ⠺⠓⠁⠞, where = ⠺⠓⠑⠗⠑, when = ⠺⠓⠑⠝, why = ⠺⠓⠽, how = ⠓⠕⠺",
        },
        {
          id: "lesson-3-4",
          title: "Common Nouns",
          content: "Learn everyday objects and concepts.",
          braille: "⠞⠊⠍⠑ ⠙⠁⠽ ⠺⠁⠽ ⠍⠁⠝ ⠞⠓⠊⠝⠛",
          example: "time = ⠞⠊⠍⠑, day = ⠙⠁⠽, way = ⠺⠁⠽, man = ⠍⠁⠝, thing = ⠞⠓⠊⠝⠛",
        },
      ],
      exercises: [
        {
          id: "ex-3-1",
          type: "text-to-braille",
          question: "Convert the word 'hello' to Braille",
          correctAnswer: "⠓⠑⠇⠇⠕",
          hint: "h-e-l-l-o",
          points: 15,
        },
        {
          id: "ex-3-2",
          type: "braille-to-text",
          question: "What word does ⠞⠓⠁⠝⠅ represent?",
          correctAnswer: "thank",
          hint: "Common polite word",
          points: 15,
        },
      ],
    },
  },
  {
    id: "module-4",
    title: "Simple Sentences",
    description: "Learn to construct basic sentences in Braille",
    difficulty: "intermediate",
    orderNumber: 4,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Combine words and punctuation to form complete sentences in Braille.",
      lessons: [
        {
          id: "lesson-4-1",
          title: "Capital Letters",
          content: "Learn how to indicate uppercase letters in Braille.",
          braille: "⠠⠓⠑⠇⠇⠕",
          example: "Capital indicator: ⠠ (dot 6). Example: 'Hello' = ⠠⠓⠑⠇⠇⠕ (capital H-e-l-l-o)",
        },
        {
          id: "lesson-4-2",
          title: "Basic Punctuation",
          content: "Learn essential punctuation marks.",
          braille: "⠲ ⠂ ⠦ ⠖",
          example: "Period = ⠲, Comma = ⠂, Question mark = ⠦, Exclamation = ⠖",
        },
        {
          id: "lesson-4-3",
          title: "Simple Statements",
          content: "Practice writing basic declarative sentences.",
          braille: "⠠⠊ ⠁⠍ ⠓⠁⠏⠏⠽⠲",
          example: "'I am happy.' = ⠠⠊ ⠁⠍ ⠓⠁⠏⠏⠽⠲",
        },
        {
          id: "lesson-4-4",
          title: "Questions",
          content: "Learn to write questions with proper punctuation.",
          braille: "⠠⠺⠓⠁⠞ ⠊⠎ ⠽⠕⠥⠗ ⠝⠁⠍⠑⠦",
          example: "'What is your name?' = ⠠⠺⠓⠁⠞ ⠊⠎ ⠽⠕⠥⠗ ⠝⠁⠍⠑⠦",
        },
      ],
      exercises: [
        {
          id: "ex-4-1",
          type: "text-to-braille",
          question: "Write 'Hello World' in Braille with proper capitalization",
          correctAnswer: "⠠⠓⠑⠇⠇⠕ ⠠⠺⠕⠗⠇⠙",
          hint: "Remember capital indicators before H and W",
          points: 20,
        },
      ],
    },
  },
  {
    id: "module-5",
    title: "Reading Practice",
    description: "Practice reading complete paragraphs in Braille",
    difficulty: "intermediate",
    orderNumber: 5,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Develop fluency by reading longer texts and stories in Braille.",
      lessons: [
        {
          id: "lesson-5-1",
          title: "Short Paragraphs",
          content: "Practice reading connected sentences.",
          braille: "⠠⠞⠓⠑ ⠎⠥⠝ ⠊⠎ ⠃⠗⠊⠛⠓⠞⠲ ⠠⠊⠞ ⠊⠎ ⠁ ⠃⠑⠁⠥⠞⠊⠋⠥⠇ ⠙⠁⠽⠲",
          example: "'The sun is bright. It is a beautiful day.' Practice reading this fluently.",
        },
        {
          id: "lesson-5-2",
          title: "Simple Story",
          content: "Read a short story in Braille.",
          braille: "⠠⠕⠝⠉⠑ ⠥⠏⠕⠝ ⠁ ⠞⠊⠍⠑⠂ ⠞⠓⠑⠗⠑ ⠺⠁⠎ ⠁ ⠅⠊⠝⠙ ⠛⠊⠗⠇⠲ ⠠⠎⠓⠑ ⠇⠊⠅⠑⠙ ⠞⠕ ⠓⠑⠇⠏ ⠕⠞⠓⠑⠗⠎⠲",
          example: "'Once upon a time, there was a kind girl. She liked to help others.'",
        },
        {
          id: "lesson-5-3",
          title: "Speed Reading",
          content: "Practice reading Braille more quickly and naturally.",
          braille: "⠠⠏⠗⠁⠉⠞⠊⠉⠑ ⠍⠁⠅⠑⠎ ⠏⠑⠗⠋⠑⠉⠞⠲",
          example: "Focus on smooth, continuous reading. 'Practice makes perfect.'",
        },
      ],
      exercises: [
        {
          id: "ex-5-1",
          type: "braille-to-text",
          question: "Read this Braille text: ⠠⠊ ⠇⠕⠧⠑ ⠇⠑⠁⠗⠝⠊⠝⠛⠲",
          correctAnswer: "I love learning.",
          hint: "A positive statement about education",
          points: 20,
        },
      ],
    },
  },
];

export function getModuleById(id: string): Module | undefined {
  return MODULES.find((module) => module.id === id);
}

export function getModulesByDifficulty(difficulty: Module["difficulty"]): Module[] {
  return MODULES.filter((module) => module.difficulty === difficulty);
}