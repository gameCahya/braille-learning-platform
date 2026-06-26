import type { PrePostTestData } from "@/types";

export const simplePresentTest: PrePostTestData = {
  moduleId: "simple-present",
  moduleTitle: "Simple Present Tense (Dasar)",
  material: "Pola kalimat Simple Present Tense dasar",
  maxScore: 75,
  mcqCount: 5,
  essayCount: 5,
  mcqMaxScore: 25,
  essayMaxScore: 50,
  questions: [
    {
      id: 1,
      question: "Kalimat Simple Present biasanya digunakan untuk ....",
      type: "mcq",
      options: ["Kejadian yang sedang berlangsung", "Kebiasaan sehari-hari", "Masa lalu"],
      answer: "Kebiasaan sehari-hari",
    },
    {
      id: 2,
      question: 'Kata kerja dasar (verb 1) dari "eat" adalah ....',
      type: "mcq",
      options: ["Eating", "Eat", "Ate"],
      answer: "Eat",
    },
    {
      id: 3,
      question: "Kalimat yang benar adalah ....",
      type: "mcq",
      options: ["She go to school", "She goes to school", "She going to school"],
      answer: "She goes to school",
    },
    {
      id: 4,
      question: '"He plays football" berarti ....',
      type: "mcq",
      options: ["Dia sedang bermain", "Dia bermain (kebiasaan)", "Dia akan bermain"],
      answer: "Dia bermain (kebiasaan)",
    },
    {
      id: 5,
      question: "Kalimat Simple Present yang benar adalah ....",
      type: "mcq",
      options: ["I eat rice every day", "I am eating rice now", "I ate rice yesterday"],
      answer: "I eat rice every day",
    },
    {
      id: 6,
      question: 'Tuliskan bentuk dasar dari kata kerja "run"!',
      type: "essay",
      answer: ["run"],
    },
    {
      id: 7,
      question: 'Buatlah contoh kalimat Simple Present dengan subjek "I"!',
      type: "essay",
      answer: ["i eat", "i study", "i go to school", "i eat rice every day", "i study every day"],
    },
    {
      id: 8,
      question: "Lengkapi: She ______ (go) to school every day.",
      type: "essay",
      answer: ["goes"],
    },
    {
      id: 9,
      question: 'Arti dari kalimat "They play football" adalah ____________.',
      type: "essay",
      answer: ["mereka bermain sepak bola"],
    },
    {
      id: 10,
      question: '"He ______ (eat) rice every morning."',
      type: "essay",
      answer: ["eats"],
    },
  ],
};
