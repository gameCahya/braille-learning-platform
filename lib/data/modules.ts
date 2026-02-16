import type { Module } from "@/types";

export const MODULES: Module[] = [
  // ========== MODUL LAMA (TIDAK DIUBAH) ==========
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

  // ========== MODUL BARU (BAHASA INGGRIS) ==========

  // Module 10: Animals (sekarang order 4)
  {
    id: "module-10",
    title: "Animals",
    description: "Learn the names of common animals in Braille.",
    difficulty: "beginner",
    orderNumber: 4,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Learn animal names such as cat, dog, rabbit, cow, chicken, goat, tiger, elephant, and monkey. Memorize their Braille representations.",
      lessons: [
        {
          id: "lesson-10-1",
          title: "Pets",
          content: "Cat: ⠉⠁⠞ (cat). Dog: ⠙⠕⠛ (dog). Rabbit: ⠗⠁⠃⠃⠊⠞ (rabbit).",
          braille: "⠉⠁⠞ ⠙⠕⠛ ⠗⠁⠃⠃⠊⠞",
          example: "Cats and dogs are common pets.",
        },
        {
          id: "lesson-10-2",
          title: "Farm Animals",
          content: "Cow: ⠉⠕⠺ (cow). Chicken: ⠉⠓⠊⠉⠅⠑⠝ (chicken). Goat: ⠛⠕⠁⠞ (goat).",
          braille: "⠉⠕⠺ ⠉⠓⠊⠉⠅⠑⠝ ⠛⠕⠁⠞",
          example: "Cows give milk, chickens lay eggs.",
        },
        {
          id: "lesson-10-3",
          title: "Wild Animals",
          content: "Tiger: ⠞⠊⠛⠑⠗ (tiger). Elephant: ⠑⠇⠑⠏⠓⠁⠝⠞ (elephant). Monkey: ⠍⠕⠝⠅⠑⠽ (monkey).",
          braille: "⠞⠊⠛⠑⠗ ⠑⠇⠑⠏⠓⠁⠝⠞ ⠍⠕⠝⠅⠑⠽",
          example: "Tigers are wild, elephants have trunks, monkeys love to climb.",
        },
      ],
      exercises: [
        {
          id: "ex-10-1",
          type: "multiple-choice",
          question: "What is the Braille for 'cat'?",
          options: ["⠙⠕⠛", "⠉⠁⠞", "⠗⠁⠃⠃⠊⠞", "⠉⠕⠺"],
          correctAnswer: "⠉⠁⠞",
          points: 10,
        },
        {
          id: "ex-10-2",
          type: "multiple-choice",
          question: "Which animal has the Braille ⠑⠇⠑⠏⠓⠁⠝⠞?",
          options: ["Tiger", "Elephant", "Monkey", "Cow"],
          correctAnswer: "Elephant",
          points: 10,
        },
      ],
    },
  },

  // Module 9: Bathroom Objects (sekarang order 5)
  {
    id: "module-9",
    title: "Bathroom Objects",
    description: "Learn the names of items commonly found in the bathroom.",
    difficulty: "beginner",
    orderNumber: 5,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Bathroom items include soap, toothbrush, toothpaste, towel, toilet, sink, mirror, and shampoo. Memorize their Braille.",
      lessons: [
        {
          id: "lesson-9-1",
          title: "Bath Supplies",
          content: "Soap: ⠎⠕⠁⠏ (soap). Toothbrush: ⠞⠕⠕⠞⠓⠃⠗⠥⠎⠓ (toothbrush). Toothpaste: ⠞⠕⠕⠞⠓⠏⠁⠎⠞⠑ (toothpaste).",
          braille: "⠎⠕⠁⠏ ⠞⠕⠕⠞⠓⠃⠗⠥⠎⠓ ⠞⠕⠕⠞⠓⠏⠁⠎⠞⠑",
          example: "Use soap for washing, toothbrush and toothpaste for cleaning teeth.",
        },
        {
          id: "lesson-9-2",
          title: "Toilet Items",
          content: "Towel: ⠞⠕⠺⠑⠇ (towel). Toilet: ⠞⠕⠊⠇⠑⠞ (toilet). Sink: ⠎⠊⠝⠅ (sink).",
          braille: "⠞⠕⠺⠑⠇ ⠞⠕⠊⠇⠑⠞ ⠎⠊⠝⠅",
          example: "Dry yourself with a towel after shower.",
        },
        {
          id: "lesson-9-3",
          title: "Other Items",
          content: "Mirror: ⠍⠊⠗⠗⠕⠗ (mirror). Shampoo: ⠎⠓⠁⠍⠏⠕⠕ (shampoo).",
          braille: "⠍⠊⠗⠗⠕⠗ ⠎⠓⠁⠍⠏⠕⠕",
          example: "Look in the mirror after washing, use shampoo for hair.",
        },
      ],
      exercises: [
        {
          id: "ex-9-1",
          type: "multiple-choice",
          question: "What is the Braille for 'soap'?",
          options: ["⠎⠓⠁⠍⠏⠕⠕", "⠎⠕⠁⠏", "⠞⠕⠺⠑⠇", "⠞⠕⠕⠞⠓⠃⠗⠥⠎⠓"],
          correctAnswer: "⠎⠕⠁⠏",
          points: 10,
        },
        {
          id: "ex-9-2",
          type: "multiple-choice",
          question: "Which word is spelled ⠞⠕⠺⠑⠇?",
          options: ["Toilet", "Sink", "Towel", "Mirror"],
          correctAnswer: "Towel",
          points: 10,
        },
      ],
    },
  },

  // Module 6: Classroom Objects (order 6)
  {
    id: "module-6",
    title: "Classroom Objects",
    description: "Learn the names of objects commonly found in a classroom, along with their Braille.",
    difficulty: "beginner",
    orderNumber: 6,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Classroom objects include table, chair, blackboard, book, pencil, pen, eraser, and ruler. Memorize their Braille.",
      lessons: [
        {
          id: "lesson-6-1",
          title: "Table and Chair",
          content: "Table: ⠞⠁⠃⠇⠑ (table). Chair: ⠉⠓⠁⠊⠗ (chair).",
          braille: "⠞⠁⠃⠇⠑ ⠉⠓⠁⠊⠗",
          example: "I sit on a chair and write at the table.",
        },
        {
          id: "lesson-6-2",
          title: "Blackboard and Book",
          content: "Blackboard: ⠃⠇⠁⠉⠅⠃⠕⠁⠗⠙ (blackboard). Book: ⠃⠕⠕⠅ (book).",
          braille: "⠃⠇⠁⠉⠅⠃⠕⠁⠗⠙ ⠃⠕⠕⠅",
          example: "The teacher writes on the blackboard, students read books.",
        },
        {
          id: "lesson-6-3",
          title: "Pencil and Pen",
          content: "Pencil: ⠏⠑⠝⠉⠊⠇ (pencil). Pen: ⠏⠑⠝ (pen).",
          braille: "⠏⠑⠝⠉⠊⠇ ⠏⠑⠝",
          example: "I write with a pencil, then trace with a pen.",
        },
        {
          id: "lesson-6-4",
          title: "Eraser and Ruler",
          content: "Eraser: ⠑⠗⠁⠎⠑⠗ (eraser). Ruler: ⠗⠥⠇⠑⠗ (ruler).",
          braille: "⠑⠗⠁⠎⠑⠗ ⠗⠥⠇⠑⠗",
          example: "Use a ruler to draw straight lines, and an eraser to correct mistakes.",
        },
      ],
      exercises: [
        {
          id: "ex-6-1",
          type: "multiple-choice",
          question: "What is the Braille for 'table'?",
          options: ["⠞⠁⠃⠇⠑", "⠉⠓⠁⠊⠗", "⠃⠕⠕⠅", "⠏⠑⠝"],
          correctAnswer: "⠞⠁⠃⠇⠑",
          points: 10,
        },
        {
          id: "ex-6-2",
          type: "multiple-choice",
          question: "Which word is ⠏⠑⠝⠉⠊⠇?",
          options: ["Pen", "Pencil", "Eraser", "Ruler"],
          correctAnswer: "Pencil",
          points: 10,
        },
      ],
    },
  },

  // Module 7: Colors (order 7)
  {
    id: "module-7",
    title: "Colors",
    description: "Learn the basic colors in Braille.",
    difficulty: "beginner",
    orderNumber: 7,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Colors help us describe objects. Memorize Braille for primary colors: red, blue, yellow, green, black, white, orange, purple, brown.",
      lessons: [
        {
          id: "lesson-7-1",
          title: "Primary Colors",
          content: "Red: ⠗⠑⠙ (red). Blue: ⠃⠇⠥⠑ (blue). Yellow: ⠽⠑⠇⠇⠕⠺ (yellow).",
          braille: "⠗⠑⠙ ⠃⠇⠥⠑ ⠽⠑⠇⠇⠕⠺",
          example: "The Indonesian flag is red and white.",
        },
        {
          id: "lesson-7-2",
          title: "More Colors",
          content: "Green: ⠛⠗⠑⠑⠝ (green). Black: ⠃⠇⠁⠉⠅ (black). White: ⠺⠓⠊⠞⠑ (white).",
          braille: "⠛⠗⠑⠑⠝ ⠃⠇⠁⠉⠅ ⠺⠓⠊⠞⠑",
          example: "Leaves are green, night sky is black, clouds are white.",
        },
        {
          id: "lesson-7-3",
          title: "Secondary Colors",
          content: "Orange: ⠕⠗⠁⠝⠛⠑ (orange). Purple: ⠏⠥⠗⠏⠇⠑ (purple). Brown: ⠃⠗⠕⠺⠝ (brown).",
          braille: "⠕⠗⠁⠝⠛⠑ ⠏⠥⠗⠏⠇⠑ ⠃⠗⠕⠺⠝",
          example: "Oranges are orange, eggplants are purple, soil is brown.",
        },
      ],
      exercises: [
        {
          id: "ex-7-1",
          type: "multiple-choice",
          question: "What is the Braille for 'red'?",
          options: ["⠃⠇⠥⠑", "⠛⠗⠑⠑⠝", "⠗⠑⠙", "⠽⠑⠇⠇⠕⠺"],
          correctAnswer: "⠗⠑⠙",
          points: 10,
        },
        {
          id: "ex-7-2",
          type: "multiple-choice",
          question: "Which color is ⠃⠇⠁⠉⠅?",
          options: ["White", "Black", "Brown", "Blue"],
          correctAnswer: "Black",
          points: 10,
        },
      ],
    },
  },

  // Module 8: Body Parts (order 8)
  {
    id: "module-8",
    title: "Body Parts",
    description: "Learn the names of human body parts in Braille.",
    difficulty: "beginner",
    orderNumber: 8,
    created_at: new Date().toISOString(),
    braille_content: null,
    content: {
      summary: "Body parts include head, hair, eye, nose, mouth, hand, finger, foot, arm, back, stomach. Memorize their Braille.",
      lessons: [
        {
          id: "lesson-8-1",
          title: "Head and Face",
          content: "Head: ⠓⠑⠁⠙ (head). Hair: ⠓⠁⠊⠗ (hair). Eye: ⠑⠽⠑ (eye). Nose: ⠝⠕⠎⠑ (nose). Mouth: ⠍⠕⠥⠞⠓ (mouth).",
          braille: "⠓⠑⠁⠙ ⠓⠁⠊⠗ ⠑⠽⠑ ⠝⠕⠎⠑ ⠍⠕⠥⠞⠓",
          example: "We see with our eyes, smell with our nose, and speak with our mouth.",
        },
        {
          id: "lesson-8-2",
          title: "Hands and Feet",
          content: "Hand: ⠓⠁⠝⠙ (hand). Finger: ⠋⠊⠝⠛⠑⠗ (finger). Foot: ⠋⠕⠕⠞ (foot).",
          braille: "⠓⠁⠝⠙ ⠋⠊⠝⠛⠑⠗ ⠋⠕⠕⠞",
          example: "Hands are for holding, feet for walking.",
        },
        {
          id: "lesson-8-3",
          title: "Torso",
          content: "Arm: ⠁⠗⠍ (arm). Back: ⠃⠁⠉⠅ (back). Stomach: ⠎⠞⠕⠍⠁⠉⠓ (stomach).",
          braille: "⠁⠗⠍ ⠃⠁⠉⠅ ⠎⠞⠕⠍⠁⠉⠓",
          example: "Arms swing while walking, back supports the body, stomach digests food.",
        },
      ],
      exercises: [
        {
          id: "ex-8-1",
          type: "multiple-choice",
          question: "What is the Braille for 'eye'?",
          options: ["⠓⠁⠝⠙", "⠑⠽⠑", "⠝⠕⠎⠑", "⠍⠕⠥⠞⠓"],
          correctAnswer: "⠑⠽⠑",
          points: 10,
        },
        {
          id: "ex-8-2",
          type: "multiple-choice",
          question: "Which word is ⠓⠁⠝⠙?",
          options: ["Foot", "Hand", "Arm", "Back"],
          correctAnswer: "Hand",
          points: 10,
        },
      ],
    },
  },

  // ========== MODUL LAMA YANG DIPINDAH URUTANNYA ==========
  {
    id: "module-4",
    title: "Simple Sentences",
    description: "Learn to construct basic sentences in Braille",
    difficulty: "intermediate",
    orderNumber: 9, // diubah dari sebelumnya
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
    orderNumber: 10, // diubah dari sebelumnya
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