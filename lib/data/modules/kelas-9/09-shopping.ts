import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mShoppingK9: GradeModule = {
  id: "k9-mod-9",
  grade: 9,
  title: "Shopping & Foods",
  description: "Belanja dan makanan dalam Bahasa Inggris (lanjutan)",
  difficulty: "intermediate",
  order_number: 9,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar melakukan percakapan belanja, menyebutkan makanan, dan menggunakan ungkapan harga dalam Bahasa Inggris.",
    lessons: [
      {
        id: "k9-9-l1",
        title: "Makanan & Minuman",
        content: "Kosakata makanan dan minuman.",
        words: [
          { id: "k9-9-w1", indonesian: "Nasi", english: "Rice", braille: toBraille("Rice") },
          { id: "k9-9-w2", indonesian: "Roti", english: "Bread", braille: toBraille("Bread") },
          { id: "k9-9-w3", indonesian: "Ayam", english: "Chicken", braille: toBraille("Chicken") },
          { id: "k9-9-w4", indonesian: "Ikan", english: "Fish", braille: toBraille("Fish") },
          { id: "k9-9-w5", indonesian: "Telur", english: "Egg", braille: toBraille("Egg") },
          { id: "k9-9-w6", indonesian: "Air", english: "Water", braille: toBraille("Water") },
          { id: "k9-9-w7", indonesian: "Susu", english: "Milk", braille: toBraille("Milk") },
          { id: "k9-9-w8", indonesian: "Buah", english: "Fruit", braille: toBraille("Fruit") },
        ],
      },
      {
        id: "k9-9-l2",
        title: "Ungkapan Belanja",
        content: "Cara bertransaksi di toko.",
        words: [
          { id: "k9-9-w9", indonesian: "Berapa harganya?", english: "How much is this?", braille: toBraille("How much is this") },
          { id: "k9-9-w10", indonesian: "Saya mau beli ini", english: "I want to buy this", braille: toBraille("I want to buy this") },
          { id: "k9-9-w11", indonesian: "Murah", english: "Cheap", braille: toBraille("Cheap") },
          { id: "k9-9-w12", indonesian: "Mahal", english: "Expensive", braille: toBraille("Expensive") },
          { id: "k9-9-w13", indonesian: "Uang", english: "Money", braille: toBraille("Money") },
        ],
      },
      {
        id: "k9-9-l3",
        title: "Contoh Dialog",
        content: "Percakapan di toko dan restoran.",
        braille: toBraille("How much is this bread? It is five thousand rupiah. I will buy it."),
        example: "At the store:\nA: How much is this bread?\nB: It is five thousand rupiah.\nA: I will buy it.\n\nAt the restaurant:\nA: I want rice and chicken.\nB: Here you are.\nA: Thank you.",
      },
    ],
    exercises: [
      {
        id: "k9-9-e1", type: "multiple-choice",
        question: "'Rice' berarti...",
        options: ["Roti", "Nasi", "Susu", "Telur"],
        correctAnswer: "Nasi", points: 10,
      },
      {
        id: "k9-9-e2", type: "multiple-choice",
        question: "'How much is this?' digunakan untuk...",
        options: ["menanyakan harga", "menanyakan waktu", "menanyakan nama", "menyapa"],
        correctAnswer: "menanyakan harga", points: 10,
      },
      {
        id: "k9-9-e3", type: "multiple-choice",
        question: "'Buy' berarti...",
        options: ["menjual", "membeli", "makan", "minum"],
        correctAnswer: "membeli", points: 10,
      },
    ],
  },
};
