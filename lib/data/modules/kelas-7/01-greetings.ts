import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mGreetings: GradeModule = {
  id: "k7-mod-1",
  grade: 7,
  title: "Greetings and Leave Taking",
  description: "Salam sapaan dan perpisahan dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 1,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar mengucapkan salam berdasarkan waktu (Good morning/afternoon/evening/night) dan ungkapan perpisahan (Goodbye, See you later).",
    lessons: [
      {
        id: "k7-1-l1",
        title: "Salam Berdasarkan Waktu",
        content: "Ungkapan salam yang digunakan berdasarkan waktu bertemu.",
        words: [
          { id: "k7-1-w1", indonesian: "Selamat pagi", english: "Good morning", braille: toBraille("Good morning") },
          { id: "k7-1-w2", indonesian: "Selamat siang", english: "Good afternoon", braille: toBraille("Good afternoon") },
          { id: "k7-1-w3", indonesian: "Selamat sore/malam", english: "Good evening", braille: toBraille("Good evening") },
          { id: "k7-1-w4", indonesian: "Selamat malam (tidur)", english: "Good night", braille: toBraille("Good night") },
        ],
      },
      {
        id: "k7-1-l2",
        title: "Salam Umum",
        content: "Ungkapan sapaan sehari-hari.",
        words: [
          { id: "k7-1-w5", indonesian: "Halo", english: "Hello", braille: toBraille("Hello") },
          { id: "k7-1-w6", indonesian: "Hai", english: "Hi", braille: toBraille("Hi") },
          { id: "k7-1-w7", indonesian: "Apa kabar?", english: "How are you?", braille: toBraille("How are you") },
          { id: "k7-1-w8", indonesian: "Senang bertemu", english: "Nice to meet you", braille: toBraille("Nice to meet you") },
        ],
      },
      {
        id: "k7-1-l3",
        title: "Ungkapan Perpisahan",
        content: "Cara berpamitan dalam Bahasa Inggris.",
        words: [
          { id: "k7-1-w9", indonesian: "Selamat tinggal", english: "Goodbye", braille: toBraille("Goodbye") },
          { id: "k7-1-w10", indonesian: "Dadah", english: "Bye", braille: toBraille("Bye") },
          { id: "k7-1-w11", indonesian: "Sampai jumpa nanti", english: "See you later", braille: toBraille("See you later") },
          { id: "k7-1-w12", indonesian: "Sampai jumpa besok", english: "See you tomorrow", braille: toBraille("See you tomorrow") },
          { id: "k7-1-w13", indonesian: "Hati-hati", english: "Take care", braille: toBraille("Take care") },
        ],
      },
      {
        id: "k7-1-l4",
        title: "Contoh Dialog",
        content: "Praktik percakapan salam dan perpisahan.",
        braille: toBraille("Good morning. How are you? I am fine, thank you. Goodbye."),
        example: "Ani: Good morning, Budi.\nBudi: Good morning, Ani.\nAni: How are you?\nBudi: I am fine, thank you. And you?\nAni: I'm fine too.\n\nRina: I have to go now.\nSiti: Okay. See you tomorrow.\nRina: See you. Bye.\nSiti: Bye.",
      },
    ],
    exercises: [
      {
        id: "k7-1-e1", type: "multiple-choice",
        question: "Jika bertemu teman pada pagi hari, kita mengatakan...",
        options: ["Good night", "Good morning", "Goodbye", "Good evening"],
        correctAnswer: "Good morning", points: 10,
      },
      {
        id: "k7-1-e2", type: "multiple-choice",
        question: "Saat akan tidur malam, kita mengatakan...",
        options: ["Good night", "Hello", "Good afternoon", "Good evening"],
        correctAnswer: "Good night", points: 10,
      },
      {
        id: "k7-1-e3", type: "multiple-choice",
        question: "Ungkapan 'Hello' digunakan untuk...",
        options: ["berpamitan", "memberi salam", "berterima kasih", "bertanya"],
        correctAnswer: "memberi salam", points: 10,
      },
      {
        id: "k7-1-e4", type: "multiple-choice",
        question: "Jika ingin berpamitan kepada guru, kita mengatakan...",
        options: ["Goodbye", "Good morning", "Good evening", "Hello"],
        correctAnswer: "Goodbye", points: 10,
      },
      {
        id: "k7-1-e5", type: "multiple-choice",
        question: "Arti dari 'See you later' adalah...",
        options: ["Selamat pagi", "Sampai jumpa nanti", "Selamat malam", "Terima kasih"],
        correctAnswer: "Sampai jumpa nanti", points: 10,
      },
    ],
  },
};
