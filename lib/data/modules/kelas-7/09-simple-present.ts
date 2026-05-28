import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mSimplePresent: GradeModule = {
  id: "k7-mod-9",
  grade: 7,
  title: "Simple Present Tense Dasar",
  description: "Penggunaan Simple Present Tense untuk kegiatan sehari-hari",
  difficulty: "intermediate",
  order_number: 9,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar membuat kalimat sederhana menggunakan Simple Present Tense untuk menyatakan kebiasaan dan kegiatan sehari-hari.",
    lessons: [
      {
        id: "k7-9-l1",
        title: "Kosakata Kegiatan",
        content: "Kata kerja sehari-hari.",
        words: [
          { id: "k7-9-w1", indonesian: "Makan", english: "Eat", braille: toBraille("Eat") },
          { id: "k7-9-w2", indonesian: "Minum", english: "Drink", braille: toBraille("Drink") },
          { id: "k7-9-w3", indonesian: "Membaca", english: "Read", braille: toBraille("Read") },
          { id: "k7-9-w4", indonesian: "Menulis", english: "Write", braille: toBraille("Write") },
          { id: "k7-9-w5", indonesian: "Belajar", english: "Study", braille: toBraille("Study") },
          { id: "k7-9-w6", indonesian: "Bermain", english: "Play", braille: toBraille("Play") },
          { id: "k7-9-w7", indonesian: "Tidur", english: "Sleep", braille: toBraille("Sleep") },
          { id: "k7-9-w8", indonesian: "Pergi", english: "Go", braille: toBraille("Go") },
        ],
      },
      {
        id: "k7-9-l2",
        title: "Kalimat Positif",
        content: "Rumus: Subject + Verb 1. Untuk He/She/It tambah s/es.",
        braille: toBraille("I read a book. She reads a book. They play football."),
        example: "I eat rice every day.\nShe eats rice every day.\nThey study English.\nHe plays football.\nWe read books.",
      },
      {
        id: "k7-9-l3",
        title: "Contoh Dialog",
        content: "Percakapan menggunakan Simple Present Tense.",
        braille: toBraille("What do you do every morning? I study English."),
        example: "A: What do you do every morning?\nB: I study English.\nA: Does your brother play football?\nB: Yes, he does.",
      },
    ],
    exercises: [
      {
        id: "k7-9-e1", type: "multiple-choice",
        question: "'Saya belajar setiap hari' dalam bahasa Inggris adalah...",
        options: ["I study every day.", "I studies every day.", "She study every day.", "I studied every day"],
        correctAnswer: "I study every day.", points: 10,
      },
      {
        id: "k7-9-e2", type: "multiple-choice",
        question: "Kalimat yang benar adalah...",
        options: ["He play football.", "He plays football.", "He playing football.", "He played football"],
        correctAnswer: "He plays football.", points: 10,
      },
      {
        id: "k7-9-e3", type: "multiple-choice",
        question: "'Mereka membaca buku' dalam bahasa Inggris adalah...",
        options: ["They reads books.", "They read books.", "They reading books.", "They are read"],
        correctAnswer: "They read books.", points: 10,
      },
    ],
  },
};
