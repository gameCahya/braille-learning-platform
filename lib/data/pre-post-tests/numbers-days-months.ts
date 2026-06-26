import type { PrePostTestData } from "@/types";

export const numbersDaysMonthsTest: PrePostTestData = {
  moduleId: "numbers-days-months",
  moduleTitle: "Numbers, Days, and Months",
  material: "Angka, hari, dan bulan dalam bahasa Inggris",
  maxScore: 75,
  mcqCount: 5,
  essayCount: 5,
  mcqMaxScore: 25,
  essayMaxScore: 50,
  questions: [
    {
      id: 1,
      question: 'Which number means "lima"?',
      type: "mcq",
      options: ["Four", "Five", "Six"],
      answer: "Five",
    },
    {
      id: 2,
      question: "What day comes after Monday?",
      type: "mcq",
      options: ["Tuesday", "Thursday", "Sunday"],
      answer: "Tuesday",
    },
    {
      id: 3,
      question: "Which month comes after January?",
      type: "mcq",
      options: ["March", "April", "February"],
      answer: "February",
    },
    {
      id: 4,
      question: 'Arti dari "ten" adalah ....',
      type: "mcq",
      options: ["delapan", "sembilan", "sepuluh"],
      answer: "sepuluh",
    },
    {
      id: 5,
      question: "We usually celebrate Independence Day of Indonesia in ....",
      type: "mcq",
      options: ["August", "December", "February"],
      answer: "August",
    },
    {
      id: 6,
      question: 'Arti dari angka "seven" adalah ____________.',
      type: "essay",
      answer: ["tujuh"],
    },
    {
      id: 7,
      question: "Hari setelah Wednesday adalah ____________.",
      type: "essay",
      answer: ["thursday"],
    },
    {
      id: 8,
      question: "Bulan sebelum December adalah ____________.",
      type: "essay",
      answer: ["november"],
    },
    {
      id: 9,
      question: 'Arti dari "Friday" adalah ____________.',
      type: "essay",
      answer: ["jumat"],
    },
    {
      id: 10,
      question: "Bulan pertama dalam satu tahun adalah ____________.",
      type: "essay",
      answer: ["january"],
    },
  ],
};
