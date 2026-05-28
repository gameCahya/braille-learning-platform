import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mShoppingFoods: GradeModule = {
  id: "k8-mod-4",
  grade: 8,
  title: "Shopping & Foods",
  description: "Belanja dan makanan dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 4,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar kosakata makanan, minuman, barang, dan cara bertransaksi sederhana di toko dalam Bahasa Inggris.",
    lessons: [
      {
        id: "k8-4-l1",
        title: "Makanan / Foods",
        content: "Nama-nama makanan.",
        words: [
          { id: "k8-4-w1", indonesian: "Nasi", english: "Rice", braille: toBraille("Rice") },
          { id: "k8-4-w2", indonesian: "Roti", english: "Bread", braille: toBraille("Bread") },
          { id: "k8-4-w3", indonesian: "Mie", english: "Noodles", braille: toBraille("Noodles") },
          { id: "k8-4-w4", indonesian: "Ayam", english: "Chicken", braille: toBraille("Chicken") },
          { id: "k8-4-w5", indonesian: "Ikan", english: "Fish", braille: toBraille("Fish") },
          { id: "k8-4-w6", indonesian: "Telur", english: "Egg", braille: toBraille("Egg") },
          { id: "k8-4-w7", indonesian: "Kue", english: "Cake", braille: toBraille("Cake") },
        ],
      },
      {
        id: "k8-4-l2",
        title: "Minuman / Drinks",
        content: "Nama-nama minuman.",
        words: [
          { id: "k8-4-w8", indonesian: "Air", english: "Water", braille: toBraille("Water") },
          { id: "k8-4-w9", indonesian: "Susu", english: "Milk", braille: toBraille("Milk") },
          { id: "k8-4-w10", indonesian: "Teh", english: "Tea", braille: toBraille("Tea") },
          { id: "k8-4-w11", indonesian: "Kopi", english: "Coffee", braille: toBraille("Coffee") },
          { id: "k8-4-w12", indonesian: "Jus", english: "Juice", braille: toBraille("Juice") },
        ],
      },
      {
        id: "k8-4-l3",
        title: "Ungkapan Belanja",
        content: "Cara bertanya harga dan membeli barang.",
        braille: toBraille("I want rice please. How much is it? It is five thousand rupiah."),
        example: "A: I want rice, please.\nB: Here you are.\nA: How much is it?\nB: It is five thousand rupiah.\nA: Thank you.\nB: You're welcome.",
      },
    ],
    exercises: [
      {
        id: "k8-4-e1", type: "multiple-choice",
        question: "'Roti' dalam bahasa Inggris adalah...",
        options: ["Rice", "Bread", "Milk", "Egg"],
        correctAnswer: "Bread", points: 10,
      },
      {
        id: "k8-4-e2", type: "multiple-choice",
        question: "'How much is it?' digunakan untuk...",
        options: ["Menanyakan harga", "Menyapa", "Meminta maaf", "Berpamitan"],
        correctAnswer: "Menanyakan harga", points: 10,
      },
      {
        id: "k8-4-e3", type: "multiple-choice",
        question: "'Saya ingin susu' dalam bahasa Inggris adalah...",
        options: ["I want milk", "I like milk", "I eat milk", "I drink milk"],
        correctAnswer: "I want milk", points: 10,
      },
    ],
  },
};
