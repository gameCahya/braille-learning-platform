import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mColorsAnimalsFruits: GradeModule = {
  id: "k7-mod-7",
  grade: 7,
  title: "Colors, Animals, Fruits",
  description: "Warna, hewan, dan buah dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 7,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar kosakata warna dasar, nama-nama hewan, dan nama-nama buah dalam Bahasa Inggris.",
    lessons: [
      {
        id: "k7-7-l1",
        title: "Colors / Warna",
        content: "Warna-warna dasar.",
        words: [
          { id: "k7-7-w1", indonesian: "Merah", english: "Red", braille: toBraille("Red") },
          { id: "k7-7-w2", indonesian: "Biru", english: "Blue", braille: toBraille("Blue") },
          { id: "k7-7-w3", indonesian: "Kuning", english: "Yellow", braille: toBraille("Yellow") },
          { id: "k7-7-w4", indonesian: "Hijau", english: "Green", braille: toBraille("Green") },
          { id: "k7-7-w5", indonesian: "Hitam", english: "Black", braille: toBraille("Black") },
          { id: "k7-7-w6", indonesian: "Putih", english: "White", braille: toBraille("White") },
          { id: "k7-7-w7", indonesian: "Cokelat", english: "Brown", braille: toBraille("Brown") },
          { id: "k7-7-w8", indonesian: "Oranye", english: "Orange", braille: toBraille("Orange") },
        ],
      },
      {
        id: "k7-7-l2",
        title: "Animals / Hewan",
        content: "Nama-nama hewan umum.",
        words: [
          { id: "k7-7-w9", indonesian: "Kucing", english: "Cat", braille: toBraille("Cat") },
          { id: "k7-7-w10", indonesian: "Anjing", english: "Dog", braille: toBraille("Dog") },
          { id: "k7-7-w11", indonesian: "Burung", english: "Bird", braille: toBraille("Bird") },
          { id: "k7-7-w12", indonesian: "Sapi", english: "Cow", braille: toBraille("Cow") },
          { id: "k7-7-w13", indonesian: "Kambing", english: "Goat", braille: toBraille("Goat") },
          { id: "k7-7-w14", indonesian: "Ikan", english: "Fish", braille: toBraille("Fish") },
          { id: "k7-7-w15", indonesian: "Ayam", english: "Chicken", braille: toBraille("Chicken") },
          { id: "k7-7-w16", indonesian: "Kuda", english: "Horse", braille: toBraille("Horse") },
        ],
      },
      {
        id: "k7-7-l3",
        title: "Fruits / Buah-buahan",
        content: "Nama-nama buah.",
        words: [
          { id: "k7-7-w17", indonesian: "Apel", english: "Apple", braille: toBraille("Apple") },
          { id: "k7-7-w18", indonesian: "Pisang", english: "Banana", braille: toBraille("Banana") },
          { id: "k7-7-w19", indonesian: "Jeruk", english: "Orange", braille: toBraille("Orange") },
          { id: "k7-7-w20", indonesian: "Mangga", english: "Mango", braille: toBraille("Mango") },
          { id: "k7-7-w21", indonesian: "Pepaya", english: "Papaya", braille: toBraille("Papaya") },
          { id: "k7-7-w22", indonesian: "Semangka", english: "Watermelon", braille: toBraille("Watermelon") },
          { id: "k7-7-w23", indonesian: "Anggur", english: "Grapes", braille: toBraille("Grapes") },
          { id: "k7-7-w24", indonesian: "Nanas", english: "Pineapple", braille: toBraille("Pineapple") },
        ],
      },
    ],
    exercises: [
      {
        id: "k7-7-e1", type: "multiple-choice",
        question: "Bahasa Inggris dari warna 'merah' adalah...",
        options: ["Blue", "Red", "Green", "Yellow"],
        correctAnswer: "Red", points: 10,
      },
      {
        id: "k7-7-e2", type: "multiple-choice",
        question: "Warna 'yellow' dalam bahasa Indonesia adalah...",
        options: ["Kuning", "Biru", "Hijau", "Putih"],
        correctAnswer: "Kuning", points: 10,
      },
      {
        id: "k7-7-e3", type: "multiple-choice",
        question: "Hewan 'cat' adalah...",
        options: ["Anjing", "Kucing", "Sapi", "Kambing"],
        correctAnswer: "Kucing", points: 10,
      },
      {
        id: "k7-7-e4", type: "multiple-choice",
        question: "Bahasa Inggris dari 'sapi' adalah...",
        options: ["Cow", "Goat", "Sheep", "Fish"],
        correctAnswer: "Cow", points: 10,
      },
      {
        id: "k7-7-e5", type: "multiple-choice",
        question: "Buah 'apple' adalah...",
        options: ["Jeruk", "Apel", "Pisang", "Mangga"],
        correctAnswer: "Apel", points: 10,
      },
    ],
  },
};
