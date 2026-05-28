import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mDailyActivities: GradeModule = {
  id: "k8-mod-2",
  grade: 8,
  title: "Daily Activities",
  description: "Kegiatan sehari-hari dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 2,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menyebutkan kegiatan sehari-hari menggunakan Simple Present Tense.",
    lessons: [
      {
        id: "k8-2-l1",
        title: "Kegiatan Pagi Hari",
        content: "Aktivitas dari bangun tidur sampai pergi ke sekolah.",
        words: [
          { id: "k8-2-w1", indonesian: "Bangun tidur", english: "Wake up", braille: toBraille("Wake up") },
          { id: "k8-2-w2", indonesian: "Mandi", english: "Take a bath", braille: toBraille("Take a bath") },
          { id: "k8-2-w3", indonesian: "Sarapan", english: "Eat breakfast", braille: toBraille("Eat breakfast") },
          { id: "k8-2-w4", indonesian: "Pergi ke sekolah", english: "Go to school", braille: toBraille("Go to school") },
        ],
      },
      {
        id: "k8-2-l2",
        title: "Kegiatan di Sekolah & Rumah",
        content: "Aktivitas belajar dan di rumah.",
        words: [
          { id: "k8-2-w5", indonesian: "Belajar", english: "Study", braille: toBraille("Study") },
          { id: "k8-2-w6", indonesian: "Membaca", english: "Read", braille: toBraille("Read") },
          { id: "k8-2-w7", indonesian: "Menulis", english: "Write", braille: toBraille("Write") },
          { id: "k8-2-w8", indonesian: "Bermain", english: "Play", braille: toBraille("Play") },
          { id: "k8-2-w9", indonesian: "Tidur", english: "Sleep", braille: toBraille("Sleep") },
        ],
      },
      {
        id: "k8-2-l3",
        title: "Contoh Kalimat",
        content: "Kalimat sederhana tentang kegiatan sehari-hari.",
        braille: toBraille("I wake up at 5 oclock. I go to school at 7 oclock. I study at school. I sleep at night."),
        example: "I wake up at 5 o'clock.\nI take a bath and eat breakfast.\nI go to school at 7 o'clock.\nI study at school.\nI sleep at night.",
      },
      {
        id: "k8-2-l4",
        title: "Contoh Dialog",
        content: "Percakapan tentang rutinitas harian.",
        example: "A: What do you do in the morning?\nB: I take a bath and eat breakfast.\nA: What time do you go to school?\nB: I go to school at 7 o'clock.",
      },
    ],
    exercises: [
      {
        id: "k8-2-e1", type: "multiple-choice",
        question: "'Bangun tidur' dalam bahasa Inggris adalah...",
        options: ["Sleep", "Wake up", "Study", "Play"],
        correctAnswer: "Wake up", points: 10,
      },
      {
        id: "k8-2-e2", type: "multiple-choice",
        question: "'I go to school' berarti...",
        options: ["Saya tidur", "Saya pergi ke sekolah", "Saya bermain", "Saya belajar"],
        correctAnswer: "Saya pergi ke sekolah", points: 10,
      },
      {
        id: "k8-2-e3", type: "multiple-choice",
        question: "'Take a bath' berarti...",
        options: ["Sarapan", "Mandi", "Tidur", "Belajar"],
        correctAnswer: "Mandi", points: 10,
      },
    ],
  },
};
