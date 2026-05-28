import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mAskingInfo: GradeModule = {
  id: "k9-mod-2",
  grade: 9,
  title: "Asking and Giving Information",
  description: "Menanyakan dan memberi informasi dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 2,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menggunakan kata tanya (what, where, when, who, how) untuk bertanya dan memberi informasi sederhana.",
    lessons: [
      {
        id: "k9-2-l1",
        title: "Question Words",
        content: "Kata tanya dalam Bahasa Inggris.",
        words: [
          { id: "k9-2-w1", indonesian: "Apa", english: "What", braille: toBraille("What") },
          { id: "k9-2-w2", indonesian: "Di mana", english: "Where", braille: toBraille("Where") },
          { id: "k9-2-w3", indonesian: "Kapan", english: "When", braille: toBraille("When") },
          { id: "k9-2-w4", indonesian: "Siapa", english: "Who", braille: toBraille("Who") },
          { id: "k9-2-w5", indonesian: "Bagaimana", english: "How", braille: toBraille("How") },
        ],
      },
      {
        id: "k9-2-l2",
        title: "Menanyakan Informasi",
        content: "Contoh pertanyaan dan jawaban.",
        words: [
          { id: "k9-2-w6", indonesian: "Siapa namamu?", english: "What is your name?", braille: toBraille("What is your name") },
          { id: "k9-2-w7", indonesian: "Di mana kamu tinggal?", english: "Where do you live?", braille: toBraille("Where do you live") },
          { id: "k9-2-w8", indonesian: "Berapa umurmu?", english: "How old are you?", braille: toBraille("How old are you") },
          { id: "k9-2-w9", indonesian: "Jam berapa?", english: "What time is it?", braille: toBraille("What time is it") },
        ],
      },
      {
        id: "k9-2-l3",
        title: "Contoh Dialog",
        content: "Tanya jawab informasi pribadi.",
        braille: toBraille("What is your name? My name is Andi. Where do you live? I live in the village."),
        example: "A: What is your name?\nB: My name is Andi.\nA: Where do you live?\nB: I live in the village.\nA: How old are you?\nB: I am 15 years old.",
      },
    ],
    exercises: [
      {
        id: "k9-2-e1", type: "multiple-choice",
        question: "'Where' digunakan untuk menanyakan...",
        options: ["Orang", "Tempat", "Waktu", "Alasan"],
        correctAnswer: "Tempat", points: 10,
      },
      {
        id: "k9-2-e2", type: "multiple-choice",
        question: "'My name is ...' digunakan untuk...",
        options: ["Menanyakan nama", "Memberi nama", "Menyapa", "Berpamitan"],
        correctAnswer: "Memberi nama", points: 10,
      },
      {
        id: "k9-2-e3", type: "multiple-choice",
        question: "'How old are you?' berarti...",
        options: ["Apa kabar", "Berapa umurmu", "Di mana kamu", "Siapa namamu"],
        correctAnswer: "Berapa umurmu", points: 10,
      },
    ],
  },
};
