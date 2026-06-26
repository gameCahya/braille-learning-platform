import type { PrePostTestData } from "@/types";

export const colorsAnimalsFruitsTest: PrePostTestData = {
  moduleId: "colors-animals-fruits",
  moduleTitle: "Colors, Animals, and Fruits",
  material: "Warna, hewan, dan buah dalam bahasa Inggris",
  maxScore: 75,
  mcqCount: 5,
  essayCount: 5,
  mcqMaxScore: 25,
  essayMaxScore: 50,
  questions: [
    {
      id: 1,
      question: "Warna kuning dalam bahasa Inggris adalah ....",
      type: "mcq",
      options: ["Red", "Yellow", "Blue"],
      answer: "Yellow",
    },
    {
      id: 2,
      question: "Manakah yang termasuk buah?",
      type: "mcq",
      options: ["Banana", "Lion", "Blue"],
      answer: "Banana",
    },
    {
      id: 3,
      question: "Manakah yang termasuk hewan?",
      type: "mcq",
      options: ["Apple", "Green", "Cat"],
      answer: "Cat",
    },
    {
      id: 4,
      question: 'Arti kata "Red" adalah ....',
      type: "mcq",
      options: ["Biru", "Merah", "Hijau"],
      answer: "Merah",
    },
    {
      id: 5,
      question: 'Kata "Apple" termasuk kelompok ....',
      type: "mcq",
      options: ["Animal", "Color", "Fruit"],
      answer: "Fruit",
    },
    {
      id: 6,
      question: 'Tuliskan bahasa Inggris dari warna "Hijau"!',
      type: "essay",
      answer: ["green"],
    },
    {
      id: 7,
      question: "Tuliskan satu nama buah dalam bahasa Inggris!",
      type: "essay",
      answer: ["banana", "apple", "orange", "mango", "grape"],
    },
    {
      id: 8,
      question: "Tuliskan satu nama hewan dalam bahasa Inggris!",
      type: "essay",
      answer: ["cat", "dog", "bird", "fish", "lion"],
    },
    {
      id: 9,
      question: 'Arti kata "Blue" adalah ____________.',
      type: "essay",
      answer: ["biru"],
    },
    {
      id: 10,
      question: "Cat = ____________ (Pilih: Animal / Fruit / Color)",
      type: "essay",
      answer: ["animal"],
    },
  ],
};
