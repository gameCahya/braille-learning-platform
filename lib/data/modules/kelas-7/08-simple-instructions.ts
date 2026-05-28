import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mSimpleInstructions: GradeModule = {
  id: "k7-mod-8",
  grade: 7,
  title: "Simple Instructions",
  description: "Instruksi sederhana dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 8,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar memahami dan menggunakan instruksi sederhana seperti stand up, sit down, open your book, listen carefully.",
    lessons: [
      {
        id: "k7-8-l1",
        title: "Instruksi di Kelas",
        content: "Perintah yang sering digunakan guru di kelas.",
        words: [
          { id: "k7-8-w1", indonesian: "Berdiri", english: "Stand up", braille: toBraille("Stand up") },
          { id: "k7-8-w2", indonesian: "Duduk", english: "Sit down", braille: toBraille("Sit down") },
          { id: "k7-8-w3", indonesian: "Buka bukumu", english: "Open your book", braille: toBraille("Open your book") },
          { id: "k7-8-w4", indonesian: "Tutup bukumu", english: "Close your book", braille: toBraille("Close your book") },
          { id: "k7-8-w5", indonesian: "Dengarkan baik-baik", english: "Listen carefully", braille: toBraille("Listen carefully") },
          { id: "k7-8-w6", indonesian: "Ulangi setelah saya", english: "Repeat after me", braille: toBraille("Repeat after me") },
        ],
      },
      {
        id: "k7-8-l2",
        title: "Instruksi Tambahan",
        content: "Perintah lainnya di kelas.",
        words: [
          { id: "k7-8-w7", indonesian: "Tenang", english: "Be quiet", braille: toBraille("Be quiet") },
          { id: "k7-8-w8", indonesian: "Angkat tangan", english: "Raise your hand", braille: toBraille("Raise your hand") },
          { id: "k7-8-w9", indonesian: "Kemari", english: "Come here", braille: toBraille("Come here") },
          { id: "k7-8-w10", indonesian: "Kembali", english: "Go back", braille: toBraille("Go back") },
          { id: "k7-8-w11", indonesian: "Sentuh bendanya", english: "Touch the object", braille: toBraille("Touch the object") },
          { id: "k7-8-w12", indonesian: "Jawab pertanyaannya", english: "Answer the question", braille: toBraille("Answer the question") },
        ],
      },
      {
        id: "k7-8-l3",
        title: "Contoh Dialog",
        content: "Percakapan menggunakan instruksi.",
        braille: toBraille("Open your book please. Yes Maam. Read the text. Okay."),
        example: "Teacher: Open your book, please.\nStudent: Yes, Ma'am.\nTeacher: Read the text.\nStudent: Okay.",
      },
    ],
    exercises: [
      {
        id: "k7-8-e1", type: "multiple-choice",
        question: "Arti dari 'Stand up' adalah...",
        options: ["Duduk", "Berdiri", "Tidur", "Diam"],
        correctAnswer: "Berdiri", points: 10,
      },
      {
        id: "k7-8-e2", type: "multiple-choice",
        question: "'Sit down' berarti...",
        options: ["Berdiri", "Tidur", "Duduk", "Lari"],
        correctAnswer: "Duduk", points: 10,
      },
      {
        id: "k7-8-e3", type: "multiple-choice",
        question: "Jika guru berkata 'Open your book', artinya adalah...",
        options: ["Tutup buku", "Buka buku", "Ambil buku", "Simpan buku"],
        correctAnswer: "Buka buku", points: 10,
      },
      {
        id: "k7-8-e4", type: "multiple-choice",
        question: "'Listen carefully' berarti...",
        options: ["Tulis cepat", "Dengarkan dengan baik", "Baca keras", "Diam"],
        correctAnswer: "Dengarkan dengan baik", points: 10,
      },
      {
        id: "k7-8-e5", type: "multiple-choice",
        question: "'Raise your hand' berarti...",
        options: ["Angkat tangan", "Turunkan tangan", "Tepuk tangan", "Diam"],
        correctAnswer: "Angkat tangan", points: 10,
      },
    ],
  },
};
