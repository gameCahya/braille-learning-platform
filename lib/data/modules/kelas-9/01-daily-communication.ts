import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mDailyCommunication: GradeModule = {
  id: "k9-mod-1",
  grade: 9,
  title: "Daily Communication & Greetings",
  description: "Komunikasi sehari-hari dan sapaan dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 1,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Penguatan kemampuan menyapa, memperkenalkan diri, dan menggunakan ungkapan sopan (thank you, sorry, excuse me) dalam komunikasi sehari-hari.",
    lessons: [
      {
        id: "k9-1-l1",
        title: "Sapaan dan Perkenalan",
        content: "Ungkapan sapaan dan perkenalan diri.",
        words: [
          { id: "k9-1-w1", indonesian: "Selamat pagi", english: "Good morning", braille: toBraille("Good morning") },
          { id: "k9-1-w2", indonesian: "Selamat siang", english: "Good afternoon", braille: toBraille("Good afternoon") },
          { id: "k9-1-w3", indonesian: "Apa kabar?", english: "How are you?", braille: toBraille("How are you") },
          { id: "k9-1-w4", indonesian: "Saya baik-baik saja", english: "I am fine", braille: toBraille("I am fine") },
          { id: "k9-1-w5", indonesian: "Nama saya ...", english: "My name is ...", braille: toBraille("My name is") },
          { id: "k9-1-w6", indonesian: "Senang bertemu denganmu", english: "Nice to meet you", braille: toBraille("Nice to meet you") },
        ],
      },
      {
        id: "k9-1-l2",
        title: "Ungkapan Sopan",
        content: "Kata-kata sopan dalam komunikasi.",
        words: [
          { id: "k9-1-w7", indonesian: "Terima kasih", english: "Thank you", braille: toBraille("Thank you") },
          { id: "k9-1-w8", indonesian: "Sama-sama", english: "You're welcome", braille: toBraille("Youre welcome") },
          { id: "k9-1-w9", indonesian: "Maaf", english: "Sorry", braille: toBraille("Sorry") },
          { id: "k9-1-w10", indonesian: "Permisi", english: "Excuse me", braille: toBraille("Excuse me") },
        ],
      },
      {
        id: "k9-1-l3",
        title: "Contoh Dialog",
        content: "Percakapan sehari-hari.",
        braille: toBraille("Good morning. How are you? I am fine thank you."),
        example: "A: Good morning.\nB: Good morning.\nA: How are you?\nB: I am fine, thank you.\n\nA: Goodbye!\nB: Bye! See you tomorrow.",
      },
    ],
    exercises: [
      {
        id: "k9-1-e1", type: "multiple-choice",
        question: "'Selamat pagi' dalam bahasa Inggris adalah...",
        options: ["Good night", "Good morning", "Good bye", "Good evening"],
        correctAnswer: "Good morning", points: 10,
      },
      {
        id: "k9-1-e2", type: "multiple-choice",
        question: "'How are you?' digunakan untuk...",
        options: ["Menanyakan kabar", "Menanyakan waktu", "Menanyakan nama", "Berpamitan"],
        correctAnswer: "Menanyakan kabar", points: 10,
      },
      {
        id: "k9-1-e3", type: "multiple-choice",
        question: "'Thank you' berarti...",
        options: ["Maaf", "Terima kasih", "Halo", "Sampai jumpa"],
        correctAnswer: "Terima kasih", points: 10,
      },
    ],
  },
};
