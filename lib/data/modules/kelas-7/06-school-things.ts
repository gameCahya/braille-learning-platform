import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mSchoolThings: GradeModule = {
  id: "k7-mod-6",
  grade: 7,
  title: "School Things & Classroom Objects",
  description: "Benda-benda di sekolah dan kelas dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 6,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar kosakata tentang benda-benda yang ada di sekolah dan di kelas seperti buku, pensil, kursi, meja.",
    lessons: [
      {
        id: "k7-6-l1",
        title: "Alat Tulis",
        content: "Perlengkapan menulis dan belajar.",
        words: [
          { id: "k7-6-w1", indonesian: "Buku", english: "Book", braille: toBraille("Book") },
          { id: "k7-6-w2", indonesian: "Pensil", english: "Pencil", braille: toBraille("Pencil") },
          { id: "k7-6-w3", indonesian: "Pulpen", english: "Pen", braille: toBraille("Pen") },
          { id: "k7-6-w4", indonesian: "Penghapus", english: "Eraser", braille: toBraille("Eraser") },
          { id: "k7-6-w5", indonesian: "Penggaris", english: "Ruler", braille: toBraille("Ruler") },
          { id: "k7-6-w6", indonesian: "Buku tulis", english: "Notebook", braille: toBraille("Notebook") },
          { id: "k7-6-w7", indonesian: "Tas", english: "Bag", braille: toBraille("Bag") },
          { id: "k7-6-w8", indonesian: "Rautan", english: "Sharpener", braille: toBraille("Sharpener") },
        ],
      },
      {
        id: "k7-6-l2",
        title: "Furnitur Kelas",
        content: "Perabot yang ada di ruang kelas.",
        words: [
          { id: "k7-6-w9", indonesian: "Kursi", english: "Chair", braille: toBraille("Chair") },
          { id: "k7-6-w10", indonesian: "Meja", english: "Table", braille: toBraille("Table") },
          { id: "k7-6-w11", indonesian: "Papan tulis", english: "Whiteboard", braille: toBraille("Whiteboard") },
          { id: "k7-6-w12", indonesian: "Pintu", english: "Door", braille: toBraille("Door") },
          { id: "k7-6-w13", indonesian: "Jendela", english: "Window", braille: toBraille("Window") },
          { id: "k7-6-w14", indonesian: "Jam dinding", english: "Clock", braille: toBraille("Clock") },
          { id: "k7-6-w15", indonesian: "Spidol", english: "Marker", braille: toBraille("Marker") },
        ],
      },
      {
        id: "k7-6-l3",
        title: "Contoh Dialog",
        content: "Percakapan tentang benda di kelas.",
        braille: toBraille("What is this? This is a pencil."),
        example: "A: What is this?\nB: This is a pencil.\nA: Is this a book?\nB: Yes, it is.",
      },
    ],
    exercises: [
      {
        id: "k7-6-e1", type: "multiple-choice",
        question: "Bahasa Inggris dari 'buku' adalah...",
        options: ["Book", "Bag", "Pencil", "Pen"],
        correctAnswer: "Book", points: 10,
      },
      {
        id: "k7-6-e2", type: "multiple-choice",
        question: "Kata 'chair' berarti...",
        options: ["Meja", "Kursi", "Papan tulis", "Pintu"],
        correctAnswer: "Kursi", points: 10,
      },
      {
        id: "k7-6-e3", type: "multiple-choice",
        question: "Bahasa Inggris dari 'pensil' adalah...",
        options: ["Pen", "Pencil", "Eraser", "Ruler"],
        correctAnswer: "Pencil", points: 10,
      },
      {
        id: "k7-6-e4", type: "multiple-choice",
        question: "'Table' dalam bahasa Indonesia berarti...",
        options: ["Meja", "Kursi", "Tas", "Pintu"],
        correctAnswer: "Meja", points: 10,
      },
      {
        id: "k7-6-e5", type: "multiple-choice",
        question: "Kata bahasa Inggris untuk 'tas sekolah' adalah...",
        options: ["Book", "School bag", "Ruler", "Sharpener"],
        correctAnswer: "School bag", points: 10,
      },
    ],
  },
};
