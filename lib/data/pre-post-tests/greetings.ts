import type { PrePostTestData } from "@/types";

export const greetingsTest: PrePostTestData = {
  moduleId: "greetings",
  moduleTitle: "Greetings and Leave Taking",
  material: "Ungkapan salam dan perpisahan",
  maxScore: 75,
  mcqCount: 5,
  essayCount: 5,
  mcqMaxScore: 25,
  essayMaxScore: 50,
  questions: [
    {
      id: 1,
      question: "Ketika bertemu teman pada pagi hari, kita mengucapkan ....",
      type: "mcq",
      options: ["good morning", "good night", "good bye"],
      answer: "Good morning",
    },
    {
      id: 2,
      question: 'Jika seseorang berkata "Hello", kita dapat menjawab ....',
      type: "mcq",
      options: ["Goodbye", "Hello", "Good night"],
      answer: "Hello",
    },
    {
      id: 3,
      question: "Ungkapan yang digunakan untuk berpamitan adalah ....",
      type: "mcq",
      options: ["Good afternoon", "How are you?", "See you later"],
      answer: "See you later",
    },
    {
      id: 4,
      question: 'Arti dari "Good evening" adalah ....',
      type: "mcq",
      options: ["Selamat pagi", "Selamat sore/malam", "Selamat tinggal"],
      answer: "Selamat sore/malam",
    },
    {
      id: 5,
      question: "Ketika akan pulang dari sekolah, kita dapat mengatakan ....",
      type: "mcq",
      options: ["Goodbye", "Good morning", "Hello"],
      answer: "Goodbye",
    },
    {
      id: 6,
      question: 'Tuliskan ungkapan bahasa Inggris untuk "Selamat pagi"!',
      type: "essay",
      answer: ["good morning"],
    },
    {
      id: 7,
      question: 'Jika guru bertanya "How are you?", jawaban yang tepat adalah ____________.',
      type: "essay",
      answer: ["i am fine", "fine, thank you", "i'm fine", "fine"],
    },
    {
      id: 8,
      question: "Tuliskan satu ungkapan bahasa Inggris yang digunakan untuk berpamitan!",
      type: "essay",
      answer: ["goodbye", "see you later", "see you"],
    },
    {
      id: 9,
      question: 'Arti dari kata "Hello" adalah ____________.',
      type: "essay",
      answer: ["halo", "hai"],
    },
    {
      id: 10,
      question: '"Good ________" digunakan untuk mengucapkan selamat malam sebelum tidur.',
      type: "essay",
      answer: ["night"],
    },
  ],
};
