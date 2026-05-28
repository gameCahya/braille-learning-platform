import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mProcedure: GradeModule = {
  id: "k9-mod-10",
  grade: 9,
  title: "Procedure Text",
  description: "Teks prosedur / langkah-langkah dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 10,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar memahami dan menulis teks prosedur yang menjelaskan cara melakukan sesuatu secara berurutan (step by step) menggunakan kalimat imperatif.",
    lessons: [
      {
        id: "k9-10-l1",
        title: "Kosakata Prosedur",
        content: "Kata-kata yang sering digunakan dalam teks prosedur.",
        words: [
          { id: "k9-10-w1", indonesian: "Merebus", english: "Boil", braille: toBraille("Boil") },
          { id: "k9-10-w2", indonesian: "Menuang", english: "Pour", braille: toBraille("Pour") },
          { id: "k9-10-w3", indonesian: "Mengaduk", english: "Stir", braille: toBraille("Stir") },
          { id: "k9-10-w4", indonesian: "Menambahkan", english: "Add", braille: toBraille("Add") },
          { id: "k9-10-w5", indonesian: "Meletakkan", english: "Put", braille: toBraille("Put") },
          { id: "k9-10-w6", indonesian: "Langkah", english: "Step", braille: toBraille("Step") },
          { id: "k9-10-w7", indonesian: "Pertama", english: "First", braille: toBraille("First") },
          { id: "k9-10-w8", indonesian: "Kemudian", english: "Then", braille: toBraille("Then") },
        ],
      },
      {
        id: "k9-10-l2",
        title: "Struktur Procedure Text",
        content: "Goal - Materials - Steps.",
        braille: toBraille("How to Make Tea. Materials: Water, tea bag, sugar. Steps: Boil the water. Put the tea bag. Pour hot water. Add sugar and stir."),
        example: "How to Make Tea\n\nGoal: Make a cup of tea\nMaterials:\n- Water\n- Tea bag\n- Sugar\n\nSteps:\n1. Boil the water.\n2. Put the tea bag in the cup.\n3. Pour hot water into the cup.\n4. Add sugar and stir it.",
      },
      {
        id: "k9-10-l3",
        title: "Contoh Dialog",
        content: "Tanya jawab tentang cara membuat sesuatu.",
        braille: toBraille("How do you make tea? First boil the water. Then put the tea bag."),
        example: "A: How do you make tea?\nB: First, boil the water.\nA: What's next?\nB: Then, put the tea bag in the cup and pour hot water.",
      },
    ],
    exercises: [
      {
        id: "k9-10-e1", type: "multiple-choice",
        question: "Procedure text digunakan untuk...",
        options: ["bercerita masa lalu", "menjelaskan langkah", "bertanya", "mendeskripsikan"],
        correctAnswer: "menjelaskan langkah", points: 10,
      },
      {
        id: "k9-10-e2", type: "multiple-choice",
        question: "'Boil' artinya...",
        options: ["mengaduk", "merebus", "memotong", "menuang"],
        correctAnswer: "merebus", points: 10,
      },
      {
        id: "k9-10-e3", type: "multiple-choice",
        question: "Langkah pertama dalam procedure text disebut...",
        options: ["last", "first", "then", "finally"],
        correctAnswer: "first", points: 10,
      },
    ],
  },
};
