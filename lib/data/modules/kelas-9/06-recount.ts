import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mRecount: GradeModule = {
  id: "k9-mod-6",
  grade: 9,
  title: "Recount Text",
  description: "Menceritakan pengalaman masa lalu dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 6,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menceritakan pengalaman masa lalu secara sederhana menggunakan Simple Past Tense dengan urutan waktu (first, then, after that, finally).",
    lessons: [
      {
        id: "k9-6-l1",
        title: "Kosakata Recount",
        content: "Kata-kata untuk menceritakan pengalaman.",
        words: [
          { id: "k9-6-w1", indonesian: "Pergi", english: "Went", braille: toBraille("Went") },
          { id: "k9-6-w2", indonesian: "Membantu", english: "Helped", braille: toBraille("Helped") },
          { id: "k9-6-w3", indonesian: "Bermain", english: "Played", braille: toBraille("Played") },
          { id: "k9-6-w4", indonesian: "Mengunjungi", english: "Visited", braille: toBraille("Visited") },
          { id: "k9-6-w5", indonesian: "Kemarin", english: "Yesterday", braille: toBraille("Yesterday") },
          { id: "k9-6-w6", indonesian: "Pertama", english: "First", braille: toBraille("First") },
          { id: "k9-6-w7", indonesian: "Kemudian", english: "Then", braille: toBraille("Then") },
          { id: "k9-6-w8", indonesian: "Akhirnya", english: "Finally", braille: toBraille("Finally") },
        ],
      },
      {
        id: "k9-6-l2",
        title: "Contoh Recount Text",
        content: "Teks menceritakan liburan.",
        braille: toBraille("Last Sunday I went to my grandmothers house. First I helped my grandmother. Then I played with my cousin. Finally I went home."),
        example: "My Holiday\n\nLast Sunday, I went to my grandmother's house.\nFirst, I helped my grandmother.\nThen, I played with my cousin.\nFinally, I went home in the evening.",
      },
      {
        id: "k9-6-l3",
        title: "Contoh Dialog",
        content: "Tanya jawab tentang pengalaman.",
        braille: toBraille("What did you do yesterday? I went to my grandmothers house."),
        example: "A: What did you do yesterday?\nB: I went to my grandmother's house.\nA: Did you play with your cousin?\nB: Yes, I did.",
      },
    ],
    exercises: [
      {
        id: "k9-6-e1", type: "multiple-choice",
        question: "Recount text digunakan untuk...",
        options: ["masa depan", "pengalaman masa lalu", "instruksi", "deskripsi"],
        correctAnswer: "pengalaman masa lalu", points: 10,
      },
      {
        id: "k9-6-e2", type: "multiple-choice",
        question: "'Yesterday' berarti...",
        options: ["hari ini", "kemarin", "besok", "sekarang"],
        correctAnswer: "kemarin", points: 10,
      },
      {
        id: "k9-6-e3", type: "multiple-choice",
        question: "'Went' adalah bentuk lampau dari...",
        options: ["go", "going", "goes", "gone"],
        correctAnswer: "go", points: 10,
      },
    ],
  },
};
