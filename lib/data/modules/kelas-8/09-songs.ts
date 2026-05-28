import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mSongs: GradeModule = {
  id: "k8-mod-9",
  grade: 8,
  title: "Songs & Listening Activity",
  description: "Lagu dan latihan mendengarkan dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 9,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar Bahasa Inggris melalui lagu sederhana untuk melatih listening dan speaking.",
    lessons: [
      {
        id: "k8-9-l1",
        title: "Kosakata dalam Lagu",
        content: "Kata-kata yang sering muncul dalam lagu.",
        words: [
          { id: "k8-9-w1", indonesian: "Senang", english: "Happy", braille: toBraille("Happy") },
          { id: "k8-9-w2", indonesian: "Teman", english: "Friend", braille: toBraille("Friend") },
          { id: "k8-9-w3", indonesian: "Sekolah", english: "School", braille: toBraille("School") },
          { id: "k8-9-w4", indonesian: "Cinta/suka", english: "Love", braille: toBraille("Love") },
          { id: "k8-9-w5", indonesian: "Hari", english: "Day", braille: toBraille("Day") },
          { id: "k8-9-w6", indonesian: "Pagi", english: "Morning", braille: toBraille("Morning") },
          { id: "k8-9-w7", indonesian: "Bermain", english: "Play", braille: toBraille("Play") },
          { id: "k8-9-w8", indonesian: "Bernyanyi", english: "Sing", braille: toBraille("Sing") },
        ],
      },
      {
        id: "k8-9-l2",
        title: "Lirik Lagu Sederhana",
        content: "Good Morning Song.",
        braille: toBraille("Good morning good morning how are you today I am happy I am happy lets study and play"),
        example: "Good Morning Song\n\nGood morning, good morning\nHow are you today?\nI am happy, I am happy\nLet's study and play.\n\nMakna:\nGood morning = Selamat pagi\nI am happy = Saya senang\nLet's study and play = Mari belajar dan bermain",
      },
    ],
    exercises: [
      {
        id: "k8-9-e1", type: "multiple-choice",
        question: "'Happy' berarti...",
        options: ["Sedih", "Senang", "Marah", "Lelah"],
        correctAnswer: "Senang", points: 10,
      },
      {
        id: "k8-9-e2", type: "multiple-choice",
        question: "Lagu digunakan untuk melatih...",
        options: ["Menulis saja", "Listening dan speaking", "Menggambar", "Berhitung"],
        correctAnswer: "Listening dan speaking", points: 10,
      },
      {
        id: "k8-9-e3", type: "multiple-choice",
        question: "'Friend' berarti...",
        options: ["Teman", "Sekolah", "Rumah", "Keluarga"],
        correctAnswer: "Teman", points: 10,
      },
    ],
  },
};
