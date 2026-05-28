import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mAnnouncement: GradeModule = {
  id: "k8-mod-8",
  grade: 8,
  title: "Announcement & Short Messages",
  description: "Pengumuman dan pesan singkat dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 8,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar memahami dan membuat pengumuman sederhana serta pesan singkat dalam Bahasa Inggris.",
    lessons: [
      {
        id: "k8-8-l1",
        title: "Kosakata Penting",
        content: "Kata-kata yang sering digunakan dalam pengumuman dan pesan.",
        words: [
          { id: "k8-8-w1", indonesian: "Pengumuman", english: "Announcement", braille: toBraille("Announcement") },
          { id: "k8-8-w2", indonesian: "Rapat", english: "Meeting", braille: toBraille("Meeting") },
          { id: "k8-8-w3", indonesian: "Jadwal", english: "Schedule", braille: toBraille("Schedule") },
          { id: "k8-8-w4", indonesian: "Penting", english: "Important", braille: toBraille("Important") },
          { id: "k8-8-w5", indonesian: "Pesan", english: "Message", braille: toBraille("Message") },
          { id: "k8-8-w6", indonesian: "Telepon", english: "Call", braille: toBraille("Call") },
          { id: "k8-8-w7", indonesian: "Ingat", english: "Remember", braille: toBraille("Remember") },
        ],
      },
      {
        id: "k8-8-l2",
        title: "Contoh Pengumuman",
        content: "Teks pengumuman sederhana.",
        braille: toBraille("There will be a meeting on Monday at 9am. Please come on time."),
        example: "Announcement\nThere will be a meeting on Monday at 9 a.m.\nPlease come on time.",
      },
      {
        id: "k8-8-l3",
        title: "Contoh Pesan Singkat",
        content: "Pesan singkat sehari-hari.",
        braille: toBraille("I am at school. Please call me later. Dont forget your book."),
        example: "I am at school. Please call me later.\nI will come late today.\nDon't forget your book.",
      },
    ],
    exercises: [
      {
        id: "k8-8-e1", type: "multiple-choice",
        question: "'Pengumuman' dalam bahasa Inggris adalah...",
        options: ["Message", "Announcement", "Meeting", "Schedule"],
        correctAnswer: "Announcement", points: 10,
      },
      {
        id: "k8-8-e2", type: "multiple-choice",
        question: "'I will come late today' berarti...",
        options: ["Saya datang tepat waktu", "Saya akan datang terlambat", "Saya tidak datang", "Saya datang besok"],
        correctAnswer: "Saya akan datang terlambat", points: 10,
      },
      {
        id: "k8-8-e3", type: "multiple-choice",
        question: "Announcement digunakan untuk...",
        options: ["Menyapa", "Menyampaikan informasi", "Bertanya", "Berpamitan"],
        correctAnswer: "Menyampaikan informasi", points: 10,
      },
    ],
  },
};
