import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mIntroducing: GradeModule = {
  id: "k7-mod-2",
  grade: 7,
  title: "Introducing Yourself",
  description: "Memperkenalkan diri dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 2,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menyebutkan nama, umur, asal, dan hobi saat memperkenalkan diri.",
    lessons: [
      {
        id: "k7-2-l1",
        title: "Ungkapan Perkenalan Diri",
        content: "Kalimat dasar untuk memperkenalkan diri.",
        words: [
          { id: "k7-2-w1", indonesian: "Nama saya ...", english: "My name is ...", braille: toBraille("My name is") },
          { id: "k7-2-w2", indonesian: "Saya berusia ... tahun", english: "I am ... years old", braille: toBraille("I am years old") },
          { id: "k7-2-w3", indonesian: "Saya tinggal di ...", english: "I live in ...", braille: toBraille("I live in") },
          { id: "k7-2-w4", indonesian: "Saya seorang siswa", english: "I am a student", braille: toBraille("I am a student") },
          { id: "k7-2-w5", indonesian: "Hobi saya adalah ...", english: "My hobby is ...", braille: toBraille("My hobby is") },
          { id: "k7-2-w6", indonesian: "Senang bertemu denganmu", english: "Nice to meet you", braille: toBraille("Nice to meet you") },
        ],
      },
      {
        id: "k7-2-l2",
        title: "Pertanyaan Saat Berkenalan",
        content: "Pertanyaan yang sering diajukan saat perkenalan.",
        words: [
          { id: "k7-2-w7", indonesian: "Siapa namamu?", english: "What is your name?", braille: toBraille("What is your name") },
          { id: "k7-2-w8", indonesian: "Berapa umurmu?", english: "How old are you?", braille: toBraille("How old are you") },
          { id: "k7-2-w9", indonesian: "Di mana kamu tinggal?", english: "Where do you live?", braille: toBraille("Where do you live") },
          { id: "k7-2-w10", indonesian: "Apa hobimu?", english: "What is your hobby?", braille: toBraille("What is your hobby") },
        ],
      },
      {
        id: "k7-2-l3",
        title: "Contoh Dialog Perkenalan",
        content: "Praktik percakapan perkenalan.",
        braille: toBraille("Hello. My name is Andi. I am thirteen years old. Nice to meet you."),
        example: "Budi: Hello, my name is Budi. What is your name?\nRani: My name is Rani.\nBudi: Nice to meet you.\nRani: Nice to meet you too.",
      },
    ],
    exercises: [
      {
        id: "k7-2-e1", type: "multiple-choice",
        question: "Jika ingin memperkenalkan nama diri sendiri, kita mengatakan...",
        options: ["My name is Rina.", "Goodbye Rina.", "Good night Rina.", "How are you?"],
        correctAnswer: "My name is Rina.", points: 10,
      },
      {
        id: "k7-2-e2", type: "multiple-choice",
        question: "Kalimat 'I am twelve years old' digunakan untuk menyatakan...",
        options: ["nama", "umur", "alamat", "hobi"],
        correctAnswer: "umur", points: 10,
      },
      {
        id: "k7-2-e3", type: "multiple-choice",
        question: "Jika seseorang bertanya 'What is your name?', jawaban yang tepat adalah...",
        options: ["I am fine.", "My name is Andi.", "See you later.", "I am twelve"],
        correctAnswer: "My name is Andi.", points: 10,
      },
      {
        id: "k7-2-e4", type: "multiple-choice",
        question: "Ungkapan untuk menyebutkan asal kota adalah...",
        options: ["I am from Solo.", "Good morning.", "Thank you.", "Nice to meet you"],
        correctAnswer: "I am from Solo.", points: 10,
      },
      {
        id: "k7-2-e5", type: "multiple-choice",
        question: "Kalimat 'Nice to meet you' berarti...",
        options: ["Sampai jumpa", "Senang bertemu denganmu", "Selamat pagi", "Apa kabar"],
        correctAnswer: "Senang bertemu denganmu", points: 10,
      },
    ],
  },
};
