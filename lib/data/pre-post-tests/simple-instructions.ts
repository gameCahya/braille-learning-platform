import type { PrePostTestData } from "@/types";

export const simpleInstructionsTest: PrePostTestData = {
  moduleId: "simple-instructions",
  moduleTitle: "Simple Instructions",
  material: "Instruksi sederhana dalam bahasa Inggris",
  maxScore: 75,
  mcqCount: 5,
  essayCount: 5,
  mcqMaxScore: 25,
  essayMaxScore: 50,
  questions: [
    {
      id: 1,
      question: 'Instruksi "Stand up" berarti ....',
      type: "mcq",
      options: ["Duduk", "Berdiri", "Tidur"],
      answer: "Berdiri",
    },
    {
      id: 2,
      question: 'Jika guru berkata "Sit down", kita harus ....',
      type: "mcq",
      options: ["Berdiri", "Tidur", "Duduk"],
      answer: "Duduk",
    },
    {
      id: 3,
      question: '"Don\'t run" berarti ....',
      type: "mcq",
      options: ["Jangan berlari", "Jangan makan", "Jangan tidur"],
      answer: "Jangan berlari",
    },
    {
      id: 4,
      question: 'Arti "Open the book" adalah ....',
      type: "mcq",
      options: ["Tutup buku", "Buka buku", "Baca buku"],
      answer: "Buka buku",
    },
    {
      id: 5,
      question: 'Jika guru mengatakan "Listen", kita harus ....',
      type: "mcq",
      options: ["Berbicara", "Mendengarkan", "Menulis"],
      answer: "Mendengarkan",
    },
    {
      id: 6,
      question: 'Tuliskan bahasa Inggris dari "Berdiri"!',
      type: "essay",
      answer: ["stand up"],
    },
    {
      id: 7,
      question: 'Jika guru berkata "Sit down", apa yang harus kamu lakukan?',
      type: "essay",
      answer: ["sit down", "duduk"],
    },
    {
      id: 8,
      question: "Tuliskan satu contoh larangan dalam bahasa Inggris!",
      type: "essay",
      answer: ["don't run", "don't shout", "don't eat in class"],
    },
    {
      id: 9,
      question: 'Arti dari "Listen" adalah ____________.',
      type: "essay",
      answer: ["mendengarkan"],
    },
    {
      id: 10,
      question: '"______ the door" digunakan untuk membuka pintu.',
      type: "essay",
      answer: ["open"],
    },
  ],
};
