import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mSimplePast: GradeModule = {
  id: "k8-mod-6",
  grade: 8,
  title: "Simple Past Tense",
  description: "Kegiatan masa lalu dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 6,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menggunakan Simple Past Tense untuk menceritakan kegiatan yang sudah terjadi menggunakan kata kerja bentuk lampau (Verb 2).",
    lessons: [
      {
        id: "k8-6-l1",
        title: "Verb 2 (Kata Kerja Lampau)",
        content: "Perubahan kata kerja dari bentuk sekarang ke lampau.",
        words: [
          { id: "k8-6-w1", indonesian: "pergi", english: "go - went", braille: toBraille("went") },
          { id: "k8-6-w2", indonesian: "makan", english: "eat - ate", braille: toBraille("ate") },
          { id: "k8-6-w3", indonesian: "minum", english: "drink - drank", braille: toBraille("drank") },
          { id: "k8-6-w4", indonesian: "baca", english: "read - read", braille: toBraille("read") },
          { id: "k8-6-w5", indonesian: "tulis", english: "write - wrote", braille: toBraille("wrote") },
          { id: "k8-6-w6", indonesian: "main", english: "play - played", braille: toBraille("played") },
          { id: "k8-6-w7", indonesian: "belajar", english: "study - studied", braille: toBraille("studied") },
        ],
      },
      {
        id: "k8-6-l2",
        title: "Contoh Kalimat",
        content: "Kalimat sederhana menggunakan Simple Past Tense.",
        braille: toBraille("I went to school yesterday. She ate rice this morning. They played football last Sunday."),
        example: "I went to school yesterday.\nShe ate rice this morning.\nThey played football last Sunday.\nHe wrote a letter yesterday.",
      },
      {
        id: "k8-6-l3",
        title: "Contoh Dialog",
        content: "Percakapan tentang kegiatan masa lalu.",
        braille: toBraille("What did you do yesterday? I went to school."),
        example: "A: What did you do yesterday?\nB: I went to school.\nA: What did you eat for breakfast?\nB: I ate rice.",
      },
    ],
    exercises: [
      {
        id: "k8-6-e1", type: "multiple-choice",
        question: "'Pergi' dalam bentuk lampau adalah...",
        options: ["go", "went", "gone", "going"],
        correctAnswer: "went", points: 10,
      },
      {
        id: "k8-6-e2", type: "multiple-choice",
        question: "'I went to school yesterday' berarti...",
        options: ["Saya pergi ke sekolah kemarin", "Saya pergi sekarang", "Saya akan pergi", "Saya suka sekolah"],
        correctAnswer: "Saya pergi ke sekolah kemarin", points: 10,
      },
      {
        id: "k8-6-e3", type: "multiple-choice",
        question: "'Eat' bentuk lampau adalah...",
        options: ["eaten", "ate", "eats", "eating"],
        correctAnswer: "ate", points: 10,
      },
    ],
  },
};
