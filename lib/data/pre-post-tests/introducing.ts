import type { PrePostTestData } from "@/types";

export const introducingTest: PrePostTestData = {
  moduleId: "introducing",
  moduleTitle: "Introducing Yourself",
  material: "Ungkapan perkenalan diri",
  maxScore: 75,
  mcqCount: 5,
  essayCount: 5,
  mcqMaxScore: 25,
  essayMaxScore: 50,
  questions: [
    {
      id: 1,
      question: "Ketika memperkenalkan diri, kita dapat mengatakan ....",
      type: "mcq",
      options: ["My name is Andi.", "Goodbye.", "See you later."],
      answer: "My name is Andi.",
    },
    {
      id: 2,
      question: 'Jika seseorang bertanya "What is your name?", jawaban yang tepat adalah ....',
      type: "mcq",
      options: ["I am fine.", "My name is Rina.", "Good morning."],
      answer: "My name is Rina.",
    },
    {
      id: 3,
      question: "Ungkapan yang digunakan untuk menyebutkan usia adalah ....",
      type: "mcq",
      options: ["I am 13 years old.", "I like football.", "Goodbye."],
      answer: "I am 13 years old.",
    },
    {
      id: 4,
      question: 'Arti dari kalimat "My name is Budi" adalah ....',
      type: "mcq",
      options: ["Saya berusia Budi.", "Nama saya Budi.", "Saya suka Budi."],
      answer: "Nama saya Budi.",
    },
    {
      id: 5,
      question: "Jika ingin memberi tahu asal tempat tinggal, kita dapat mengatakan ....",
      type: "mcq",
      options: ["I am from Solo.", "Good afternoon.", "Thank you."],
      answer: "I am from Solo.",
    },
    {
      id: 6,
      question: 'Tuliskan ungkapan bahasa Inggris untuk "Nama saya Siti"!',
      type: "essay",
      answer: ["my name is siti"],
    },
    {
      id: 7,
      question: '"I am ________ years old." (Jika usia kamu 14 tahun)',
      type: "essay",
      answer: ["14"],
    },
    {
      id: 8,
      question: 'Jika seseorang bertanya "Where are you from?", jawaban yang tepat adalah ____________.',
      type: "essay",
      answer: ["i am from solo", "i am from jakarta", "i'm from solo", "i'm from jakarta"],
    },
    {
      id: 9,
      question: 'Arti dari kalimat "I am from Indonesia" adalah ____________.',
      type: "essay",
      answer: ["saya berasal dari indonesia"],
    },
    {
      id: 10,
      question: '"Hello, my ________ is Dika."',
      type: "essay",
      answer: ["name"],
    },
  ],
};
