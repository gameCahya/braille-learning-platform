import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mDescriptiveK9: GradeModule = {
  id: "k9-mod-4",
  grade: 9,
  title: "Descriptive Text: People & Places",
  description: "Mendeskripsikan orang dan tempat dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 4,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar mendeskripsikan orang (ciri fisik dan sifat) dan tempat menggunakan kata sifat dan kalimat sederhana.",
    lessons: [
      {
        id: "k9-4-l1",
        title: "Kata Sifat untuk Orang",
        content: "Adjectives untuk mendeskripsikan orang.",
        words: [
          { id: "k9-4-w1", indonesian: "Baik", english: "Kind", braille: toBraille("Kind") },
          { id: "k9-4-w2", indonesian: "Pintar", english: "Smart", braille: toBraille("Smart") },
          { id: "k9-4-w3", indonesian: "Tinggi", english: "Tall", braille: toBraille("Tall") },
          { id: "k9-4-w4", indonesian: "Pendek", english: "Short", braille: toBraille("Short") },
          { id: "k9-4-w5", indonesian: "Ramah", english: "Friendly", braille: toBraille("Friendly") },
        ],
      },
      {
        id: "k9-4-l2",
        title: "Kata Sifat untuk Tempat",
        content: "Adjectives untuk mendeskripsikan tempat.",
        words: [
          { id: "k9-4-w6", indonesian: "Besar", english: "Big", braille: toBraille("Big") },
          { id: "k9-4-w7", indonesian: "Bersih", english: "Clean", braille: toBraille("Clean") },
          { id: "k9-4-w8", indonesian: "Indah", english: "Beautiful", braille: toBraille("Beautiful") },
          { id: "k9-4-w9", indonesian: "Tenang", english: "Quiet", braille: toBraille("Quiet") },
        ],
      },
      {
        id: "k9-4-l3",
        title: "Contoh Teks Deskriptif",
        content: "Paragraf sederhana mendeskripsikan orang dan tempat.",
        braille: toBraille("My friend is Rina. She is kind and friendly. She is smart. My school is big and clean."),
        example: "About Person:\nMy friend is Rina. She is kind and friendly. She is smart.\n\nAbout Place:\nMy school is big and clean. There is a library in my school.",
      },
    ],
    exercises: [
      {
        id: "k9-4-e1", type: "multiple-choice",
        question: "'Beautiful' berarti...",
        options: ["Jelek", "Indah", "Kecil", "Besar"],
        correctAnswer: "Indah", points: 10,
      },
      {
        id: "k9-4-e2", type: "multiple-choice",
        question: "'My school is big' artinya...",
        options: ["Sekolah saya kecil", "Sekolah saya besar", "Sekolah saya jauh", "Sekolah saya bersih"],
        correctAnswer: "Sekolah saya besar", points: 10,
      },
      {
        id: "k9-4-e3", type: "multiple-choice",
        question: "Descriptive text digunakan untuk...",
        options: ["bercerita masa depan", "menjelaskan orang/tempat", "menanyakan waktu", "memberi perintah"],
        correctAnswer: "menjelaskan orang/tempat", points: 10,
      },
    ],
  },
};
