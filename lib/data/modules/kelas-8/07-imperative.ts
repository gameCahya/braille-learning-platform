import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mImperative: GradeModule = {
  id: "k8-mod-7",
  grade: 8,
  title: "Imperative Sentences",
  description: "Kalimat perintah dan instruksi dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 7,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menggunakan kalimat perintah (imperative) untuk memberi instruksi, arahan, dan ajakan dalam situasi sehari-hari.",
    lessons: [
      {
        id: "k8-7-l1",
        title: "Kalimat Perintah di Kelas",
        content: "Perintah yang sering digunakan guru.",
        words: [
          { id: "k8-7-w1", indonesian: "Berdiri", english: "Stand up", braille: toBraille("Stand up") },
          { id: "k8-7-w2", indonesian: "Duduk", english: "Sit down", braille: toBraille("Sit down") },
          { id: "k8-7-w3", indonesian: "Buka bukumu", english: "Open your book", braille: toBraille("Open your book") },
          { id: "k8-7-w4", indonesian: "Tutup bukumu", english: "Close your book", braille: toBraille("Close your book") },
          { id: "k8-7-w5", indonesian: "Dengarkan baik-baik", english: "Listen carefully", braille: toBraille("Listen carefully") },
          { id: "k8-7-w6", indonesian: "Ulangi setelah saya", english: "Repeat after me", braille: toBraille("Repeat after me") },
        ],
      },
      {
        id: "k8-7-l2",
        title: "Kalimat Perintah Sehari-hari",
        content: "Instruksi untuk kegiatan sehari-hari.",
        words: [
          { id: "k8-7-w7", indonesian: "Tenang", english: "Be quiet", braille: toBraille("Be quiet") },
          { id: "k8-7-w8", indonesian: "Angkat tangan", english: "Raise your hand", braille: toBraille("Raise your hand") },
          { id: "k8-7-w9", indonesian: "Kemari", english: "Come here", braille: toBraille("Come here") },
          { id: "k8-7-w10", indonesian: "Tolong dengarkan", english: "Please listen", braille: toBraille("Please listen") },
        ],
      },
      {
        id: "k8-7-l3",
        title: "Contoh Penggunaan",
        content: "Kalimat perintah dalam konteks.",
        braille: toBraille("Open your book please. Sit down quietly. Listen carefully to the audio."),
        example: "Open your book, please.\nSit down quietly.\nListen carefully to the audio.\nRaise your hand before answering.",
      },
    ],
    exercises: [
      {
        id: "k8-7-e1", type: "multiple-choice",
        question: "'Duduk' dalam bahasa Inggris adalah...",
        options: ["Sit down", "Stand up", "Come here", "Go back"],
        correctAnswer: "Sit down", points: 10,
      },
      {
        id: "k8-7-e2", type: "multiple-choice",
        question: "'Open your book' berarti...",
        options: ["Tutup bukumu", "Buka bukumu", "Tulis bukumu", "Ambil bukumu"],
        correctAnswer: "Buka bukumu", points: 10,
      },
      {
        id: "k8-7-e3", type: "multiple-choice",
        question: "Kalimat perintah digunakan untuk...",
        options: ["Bercerita", "Memberi instruksi", "Menanyakan waktu", "Bertanya"],
        correctAnswer: "Memberi instruksi", points: 10,
      },
    ],
  },
};
