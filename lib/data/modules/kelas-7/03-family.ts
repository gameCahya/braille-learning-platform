import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mFamily: GradeModule = {
  id: "k7-mod-3",
  grade: 7,
  title: "Family Members",
  description: "Anggota keluarga dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 3,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menyebutkan anggota keluarga seperti ayah, ibu, kakak, adik, kakek, nenek dalam Bahasa Inggris.",
    lessons: [
      {
        id: "k7-3-l1",
        title: "Anggota Keluarga Inti",
        content: "Keluarga inti: ayah, ibu, saudara.",
        words: [
          { id: "k7-3-w1", indonesian: "Ayah", english: "Father", braille: toBraille("Father") },
          { id: "k7-3-w2", indonesian: "Ibu", english: "Mother", braille: toBraille("Mother") },
          { id: "k7-3-w3", indonesian: "Orang tua", english: "Parents", braille: toBraille("Parents") },
          { id: "k7-3-w4", indonesian: "Saudara laki-laki", english: "Brother", braille: toBraille("Brother") },
          { id: "k7-3-w5", indonesian: "Saudara perempuan", english: "Sister", braille: toBraille("Sister") },
        ],
      },
      {
        id: "k7-3-l2",
        title: "Keluarga Besar",
        content: "Kakek, nenek, paman, bibi, sepupu.",
        words: [
          { id: "k7-3-w6", indonesian: "Kakek", english: "Grandfather", braille: toBraille("Grandfather") },
          { id: "k7-3-w7", indonesian: "Nenek", english: "Grandmother", braille: toBraille("Grandmother") },
          { id: "k7-3-w8", indonesian: "Paman", english: "Uncle", braille: toBraille("Uncle") },
          { id: "k7-3-w9", indonesian: "Bibi", english: "Aunt", braille: toBraille("Aunt") },
          { id: "k7-3-w10", indonesian: "Sepupu", english: "Cousin", braille: toBraille("Cousin") },
        ],
      },
      {
        id: "k7-3-l3",
        title: "Kalimat Sederhana",
        content: "Contoh kalimat tentang keluarga.",
        braille: toBraille("This is my father. She is my mother. I have one brother. I love my family."),
        example: "This is my father. My father is Mr. Budi.\nThis is my mother. My mother is Mrs. Sinta.\nI have one brother.\nI love my family.",
      },
    ],
    exercises: [
      {
        id: "k7-3-e1", type: "multiple-choice",
        question: "Kata bahasa Inggris untuk 'ayah' adalah...",
        options: ["Mother", "Father", "Sister", "Brother"],
        correctAnswer: "Father", points: 10,
      },
      {
        id: "k7-3-e2", type: "multiple-choice",
        question: "Kata bahasa Inggris untuk 'ibu' adalah...",
        options: ["Mother", "Brother", "Uncle", "Aunt"],
        correctAnswer: "Mother", points: 10,
      },
      {
        id: "k7-3-e3", type: "multiple-choice",
        question: "'Brother' berarti...",
        options: ["Kakak perempuan", "Adik perempuan", "Saudara laki-laki", "Sepupu"],
        correctAnswer: "Saudara laki-laki", points: 10,
      },
      {
        id: "k7-3-e4", type: "multiple-choice",
        question: "Jika ingin menyebut 'saudara perempuan', kita mengatakan...",
        options: ["Sister", "Father", "Cousin", "Brother"],
        correctAnswer: "Sister", points: 10,
      },
      {
        id: "k7-3-e5", type: "multiple-choice",
        question: "Kata 'grandmother' berarti...",
        options: ["Kakek", "Nenek", "Tante", "Sepupu"],
        correctAnswer: "Nenek", points: 10,
      },
    ],
  },
};
