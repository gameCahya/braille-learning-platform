import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mHobbies: GradeModule = {
  id: "k8-mod-3",
  grade: 8,
  title: "Hobbies",
  description: "Hobi dan kegemaran dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 3,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menyebutkan hobi dan menanyakan hobi orang lain menggunakan 'I like...' dan 'Do you like...?'.",
    lessons: [
      {
        id: "k8-3-l1",
        title: "Macam-macam Hobi",
        content: "Kosakata tentang hobi dan kegemaran.",
        words: [
          { id: "k8-3-w1", indonesian: "Membaca", english: "Reading", braille: toBraille("Reading") },
          { id: "k8-3-w2", indonesian: "Menulis", english: "Writing", braille: toBraille("Writing") },
          { id: "k8-3-w3", indonesian: "Menggambar", english: "Drawing", braille: toBraille("Drawing") },
          { id: "k8-3-w4", indonesian: "Bernyanyi", english: "Singing", braille: toBraille("Singing") },
          { id: "k8-3-w5", indonesian: "Menari", english: "Dancing", braille: toBraille("Dancing") },
          { id: "k8-3-w6", indonesian: "Berenang", english: "Swimming", braille: toBraille("Swimming") },
          { id: "k8-3-w7", indonesian: "Bermain sepak bola", english: "Playing football", braille: toBraille("Playing football") },
          { id: "k8-3-w8", indonesian: "Memasak", english: "Cooking", braille: toBraille("Cooking") },
          { id: "k8-3-w9", indonesian: "Bersepeda", english: "Cycling", braille: toBraille("Cycling") },
          { id: "k8-3-w10", indonesian: "Mendengarkan musik", english: "Listening to music", braille: toBraille("Listening to music") },
        ],
      },
      {
        id: "k8-3-l2",
        title: "Ungkapan Tentang Hobi",
        content: "Cara menyatakan suka/tidak suka.",
        braille: toBraille("I like reading. She likes singing. He likes playing football."),
        example: "I like reading books.\nShe likes singing.\nHe likes playing football.\nMy hobby is swimming.",
      },
      {
        id: "k8-3-l3",
        title: "Contoh Dialog",
        content: "Tanya jawab tentang hobi.",
        braille: toBraille("What is your hobby? I like dancing. Do you like music? Yes I do."),
        example: "A: What is your hobby?\nB: I like singing.\nA: That's nice!\n\nA: Do you like music?\nB: Yes, I do.",
      },
    ],
    exercises: [
      {
        id: "k8-3-e1", type: "multiple-choice",
        question: "'Membaca' dalam bahasa Inggris adalah...",
        options: ["Writing", "Reading", "Singing", "Drawing"],
        correctAnswer: "Reading", points: 10,
      },
      {
        id: "k8-3-e2", type: "multiple-choice",
        question: "'I like dancing' berarti...",
        options: ["Saya suka menari", "Saya suka membaca", "Saya suka tidur", "Saya suka menyanyi"],
        correctAnswer: "Saya suka menari", points: 10,
      },
      {
        id: "k8-3-e3", type: "multiple-choice",
        question: "'Berenang' dalam bahasa Inggris adalah...",
        options: ["Swimming", "Running", "Cooking", "Cycling"],
        correctAnswer: "Swimming", points: 10,
      },
    ],
  },
};
