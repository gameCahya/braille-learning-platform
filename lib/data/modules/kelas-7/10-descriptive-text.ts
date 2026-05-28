import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mDescriptiveText: GradeModule = {
  id: "k7-mod-10",
  grade: 7,
  title: "Descriptive Text Sederhana",
  description: "Teks deskripsi sederhana tentang orang, hewan, dan benda",
  difficulty: "intermediate",
  order_number: 10,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar mendeskripsikan orang, hewan, dan benda menggunakan kata sifat sederhana.",
    lessons: [
      {
        id: "k7-10-l1",
        title: "Kata Sifat / Adjectives",
        content: "Kata-kata untuk mendeskripsikan.",
        words: [
          { id: "k7-10-w1", indonesian: "Besar", english: "Big", braille: toBraille("Big") },
          { id: "k7-10-w2", indonesian: "Kecil", english: "Small", braille: toBraille("Small") },
          { id: "k7-10-w3", indonesian: "Tinggi", english: "Tall", braille: toBraille("Tall") },
          { id: "k7-10-w4", indonesian: "Pendek", english: "Short", braille: toBraille("Short") },
          { id: "k7-10-w5", indonesian: "Cantik/Indah", english: "Beautiful", braille: toBraille("Beautiful") },
          { id: "k7-10-w6", indonesian: "Tampan", english: "Handsome", braille: toBraille("Handsome") },
          { id: "k7-10-w7", indonesian: "Lucu", english: "Cute", braille: toBraille("Cute") },
          { id: "k7-10-w8", indonesian: "Ramah", english: "Friendly", braille: toBraille("Friendly") },
        ],
      },
      {
        id: "k7-10-l2",
        title: "Mendeskripsikan Hewan",
        content: "Contoh teks deskriptif tentang hewan.",
        braille: toBraille("My cat is small and cute. Its fur is white and brown. It likes fish."),
        example: "My Cat\nI have a cat. Its name is Mimi.\nMimi is small and cute.\nIts fur is white and brown.\nMimi likes fish.",
      },
      {
        id: "k7-10-l3",
        title: "Mendeskripsikan Teman",
        content: "Contoh teks deskriptif tentang teman.",
        braille: toBraille("I have a friend. His name is Andi. He is tall and friendly. He likes football."),
        example: "My Friend\nI have a friend. His name is Andi.\nHe is tall and friendly.\nHe likes football.",
      },
    ],
    exercises: [
      {
        id: "k7-10-e1", type: "multiple-choice",
        question: "'Kucing saya lucu' dalam bahasa Inggris adalah...",
        options: ["My cat is cute.", "My cat are cute.", "My cats cute.", "My cat was cute"],
        correctAnswer: "My cat is cute.", points: 10,
      },
      {
        id: "k7-10-e2", type: "multiple-choice",
        question: "Kata 'friendly' berarti...",
        options: ["Tinggi", "Ramah", "Kecil", "Lucu"],
        correctAnswer: "Ramah", points: 10,
      },
      {
        id: "k7-10-e3", type: "multiple-choice",
        question: "'Tas saya hitam' dalam bahasa Inggris adalah...",
        options: ["My bag is black.", "My bag black.", "My bags is black.", "My bag are black"],
        correctAnswer: "My bag is black.", points: 10,
      },
    ],
  },
};
