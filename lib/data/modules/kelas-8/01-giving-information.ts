import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mGivingInformation: GradeModule = {
  id: "k8-mod-1",
  grade: 8,
  title: "Giving Information",
  description: "Meminta bantuan, berterima kasih, meminta maaf, dan memberi selamat",
  difficulty: "beginner",
  order_number: 1,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar mengungkapkan cara meminta bantuan, berterima kasih, meminta maaf, dan memberi ucapan selamat dalam Bahasa Inggris.",
    lessons: [
      {
        id: "k8-1-l1",
        title: "Asking Help",
        content: "Cara meminta bantuan dengan sopan.",
        words: [
          { id: "k8-1-w1", indonesian: "Bisakah kamu membantu saya?", english: "Can you help me?", braille: toBraille("Can you help me") },
          { id: "k8-1-w2", indonesian: "Tolong bantu saya", english: "Please help me", braille: toBraille("Please help me") },
          { id: "k8-1-w3", indonesian: "Saya butuh bantuanmu", english: "I need your help", braille: toBraille("I need your help") },
        ],
      },
      {
        id: "k8-1-l2",
        title: "Thanking",
        content: "Ungkapan terima kasih.",
        words: [
          { id: "k8-1-w4", indonesian: "Terima kasih", english: "Thank you", braille: toBraille("Thank you") },
          { id: "k8-1-w5", indonesian: "Terima kasih banyak", english: "Thanks a lot", braille: toBraille("Thanks a lot") },
          { id: "k8-1-w6", indonesian: "Saya sangat menghargainya", english: "I really appreciate it", braille: toBraille("I really appreciate it") },
        ],
      },
      {
        id: "k8-1-l3",
        title: "Apologizing",
        content: "Cara meminta maaf.",
        words: [
          { id: "k8-1-w7", indonesian: "Maaf", english: "I'm sorry", braille: toBraille("Im sorry") },
          { id: "k8-1-w8", indonesian: "Maaf saya terlambat", english: "I'm sorry, I am late", braille: toBraille("Im sorry I am late") },
          { id: "k8-1-w9", indonesian: "Mohon maafkan saya", english: "Please forgive me", braille: toBraille("Please forgive me") },
        ],
      },
      {
        id: "k8-1-l4",
        title: "Congratulating",
        content: "Ucapan selamat.",
        words: [
          { id: "k8-1-w10", indonesian: "Selamat!", english: "Congratulations!", braille: toBraille("Congratulations") },
          { id: "k8-1-w11", indonesian: "Kerja bagus!", english: "Well done!", braille: toBraille("Well done") },
          { id: "k8-1-w12", indonesian: "Selamat ulang tahun", english: "Happy birthday", braille: toBraille("Happy birthday") },
        ],
      },
      {
        id: "k8-1-l5",
        title: "Contoh Dialog",
        content: "Percakapan menggunakan ungkapan giving information.",
        braille: toBraille("Can you help me? Yes sure. Thank you. You are welcome."),
        example: "A: Can you help me?\nB: Yes, sure.\nA: Thank you.\nB: You're welcome.",
      },
    ],
    exercises: [
      {
        id: "k8-1-e1", type: "multiple-choice",
        question: "'Terima kasih' dalam bahasa Inggris adalah...",
        options: ["Sorry", "Thank you", "Hello", "Goodbye"],
        correctAnswer: "Thank you", points: 10,
      },
      {
        id: "k8-1-e2", type: "multiple-choice",
        question: "'I'm sorry' digunakan untuk...",
        options: ["Meminta maaf", "Memberi selamat", "Bertanya", "Berterima kasih"],
        correctAnswer: "Meminta maaf", points: 10,
      },
      {
        id: "k8-1-e3", type: "multiple-choice",
        question: "'Well done!' berarti...",
        options: ["Kerja bagus!", "Selamat tinggal", "Apa kabar", "Terima kasih"],
        correctAnswer: "Kerja bagus!", points: 10,
      },
    ],
  },
};
