import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mTellingTime: GradeModule = {
  id: "k7-mod-5",
  grade: 7,
  title: "Telling Time",
  description: "Menyebutkan waktu/jam dalam Bahasa Inggris",
  difficulty: "beginner",
  order_number: 5,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menanyakan dan menyebutkan waktu dalam Bahasa Inggris: o'clock, half past, quarter past/to.",
    lessons: [
      {
        id: "k7-5-l1",
        title: "Kosakata Waktu",
        content: "Kata-kata dasar tentang waktu.",
        words: [
          { id: "k7-5-w1", indonesian: "Waktu", english: "Time", braille: toBraille("Time") },
          { id: "k7-5-w2", indonesian: "Jam", english: "Hour", braille: toBraille("Hour") },
          { id: "k7-5-w3", indonesian: "Menit", english: "Minute", braille: toBraille("Minute") },
          { id: "k7-5-w4", indonesian: "Pagi", english: "Morning", braille: toBraille("Morning") },
          { id: "k7-5-w5", indonesian: "Siang", english: "Afternoon", braille: toBraille("Afternoon") },
          { id: "k7-5-w6", indonesian: "Sore", english: "Evening", braille: toBraille("Evening") },
          { id: "k7-5-w7", indonesian: "Malam", english: "Night", braille: toBraille("Night") },
        ],
      },
      {
        id: "k7-5-l2",
        title: "Menanyakan Waktu",
        content: "Cara bertanya dan menjawab waktu.",
        words: [
          { id: "k7-5-w8", indonesian: "Jam berapa sekarang?", english: "What time is it?", braille: toBraille("What time is it") },
          { id: "k7-5-w9", indonesian: "Sekarang jam tujuh", english: "It is seven o'clock", braille: toBraille("It is seven oclock") },
          { id: "k7-5-w10", indonesian: "Jam setengah delapan", english: "Half past seven", braille: toBraille("Half past seven") },
          { id: "k7-5-w11", indonesian: "Jam tujuh lewat seperempat", english: "Quarter past seven", braille: toBraille("Quarter past seven") },
          { id: "k7-5-w12", indonesian: "Jam delapan kurang seperempat", english: "Quarter to eight", braille: toBraille("Quarter to eight") },
        ],
      },
      {
        id: "k7-5-l3",
        title: "Aktivitas Harian dan Waktu",
        content: "Kegiatan sehari-hari berdasarkan waktu.",
        braille: toBraille("I go to school at seven oclock. I sleep at nine oclock."),
        example: "Wake up at 5 o'clock\nBreakfast at 6 o'clock\nGo to school at 7 o'clock\nGo home at 1 o'clock\nSleep at 9 o'clock",
      },
    ],
    exercises: [
      {
        id: "k7-5-e1", type: "multiple-choice",
        question: "Bahasa Inggris dari 'jam satu' adalah...",
        options: ["One o'clock", "Two o'clock", "Three o'clock", "Twelve o'clock"],
        correctAnswer: "One o'clock", points: 10,
      },
      {
        id: "k7-5-e2", type: "multiple-choice",
        question: "Pukul 07.00 dalam bahasa Inggris adalah...",
        options: ["Seven o'clock", "Eight o'clock", "Nine o'clock", "Six o'clock"],
        correctAnswer: "Seven o'clock", points: 10,
      },
      {
        id: "k7-5-e3", type: "multiple-choice",
        question: "Kalimat untuk menanyakan waktu adalah...",
        options: ["What is your name?", "What time is it?", "How are you?", "Where do you live"],
        correctAnswer: "What time is it?", points: 10,
      },
    ],
  },
};
