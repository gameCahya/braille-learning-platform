import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mDirections: GradeModule = {
  id: "k8-mod-5",
  grade: 8,
  title: "Asking and Giving Directions",
  description: "Menanyakan dan memberi arah dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 5,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menanyakan lokasi dan memberi petunjuk arah menggunakan prepositions of place (next to, in front of, behind).",
    lessons: [
      {
        id: "k8-5-l1",
        title: "Ungkapan Arah",
        content: "Kata dan frasa untuk memberi arah.",
        words: [
          { id: "k8-5-w1", indonesian: "Jalan lurus", english: "Go straight", braille: toBraille("Go straight") },
          { id: "k8-5-w2", indonesian: "Belok kiri", english: "Turn left", braille: toBraille("Turn left") },
          { id: "k8-5-w3", indonesian: "Belok kanan", english: "Turn right", braille: toBraille("Turn right") },
          { id: "k8-5-w4", indonesian: "Di mana toilet?", english: "Where is the toilet?", braille: toBraille("Where is the toilet") },
          { id: "k8-5-w5", indonesian: "Di mana kelas?", english: "Where is the classroom?", braille: toBraille("Where is the classroom") },
        ],
      },
      {
        id: "k8-5-l2",
        title: "Prepositions of Place",
        content: "Kata depan untuk menunjukkan posisi.",
        words: [
          { id: "k8-5-w6", indonesian: "di dalam", english: "in", braille: toBraille("in") },
          { id: "k8-5-w7", indonesian: "di atas", english: "on", braille: toBraille("on") },
          { id: "k8-5-w8", indonesian: "di bawah", english: "under", braille: toBraille("under") },
          { id: "k8-5-w9", indonesian: "di samping", english: "next to", braille: toBraille("next to") },
          { id: "k8-5-w10", indonesian: "di belakang", english: "behind", braille: toBraille("behind") },
          { id: "k8-5-w11", indonesian: "di depan", english: "in front of", braille: toBraille("in front of") },
        ],
      },
      {
        id: "k8-5-l3",
        title: "Contoh Dialog",
        content: "Percakapan menanyakan arah.",
        braille: toBraille("Where is the toilet? It is next to the classroom."),
        example: "A: Where is the toilet?\nB: It is next to the classroom.\nA: Where is the library?\nB: It is in front of the office.",
      },
    ],
    exercises: [
      {
        id: "k8-5-e1", type: "multiple-choice",
        question: "'Belok kiri' dalam bahasa Inggris adalah...",
        options: ["Turn right", "Turn left", "Go straight", "Stop"],
        correctAnswer: "Turn left", points: 10,
      },
      {
        id: "k8-5-e2", type: "multiple-choice",
        question: "'Next to' berarti...",
        options: ["Di depan", "Di samping", "Di bawah", "Di belakang"],
        correctAnswer: "Di samping", points: 10,
      },
      {
        id: "k8-5-e3", type: "multiple-choice",
        question: "'Where is the toilet?' digunakan untuk...",
        options: ["Menanyakan lokasi", "Meminta maaf", "Mengucapkan selamat", "Berpamitan"],
        correctAnswer: "Menanyakan lokasi", points: 10,
      },
    ],
  },
};
