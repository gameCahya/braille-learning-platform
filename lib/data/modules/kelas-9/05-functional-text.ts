import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mFunctionalText: GradeModule = {
  id: "k9-mod-5",
  grade: 9,
  title: "Functional Text: Announcement, Invitation & Short Message",
  description: "Teks fungsional: pengumuman, undangan, dan pesan singkat",
  difficulty: "intermediate",
  order_number: 5,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar memahami dan menulis teks fungsional sederhana seperti pengumuman, undangan, dan pesan singkat dalam Bahasa Inggris.",
    lessons: [
      {
        id: "k9-5-l1",
        title: "Kosakata Penting",
        content: "Kata-kata untuk teks fungsional.",
        words: [
          { id: "k9-5-w1", indonesian: "Pengumuman", english: "Announcement", braille: toBraille("Announcement") },
          { id: "k9-5-w2", indonesian: "Undangan", english: "Invitation", braille: toBraille("Invitation") },
          { id: "k9-5-w3", indonesian: "Pesan", english: "Message", braille: toBraille("Message") },
          { id: "k9-5-w4", indonesian: "Rapat", english: "Meeting", braille: toBraille("Meeting") },
          { id: "k9-5-w5", indonesian: "Penting", english: "Important", braille: toBraille("Important") },
          { id: "k9-5-w6", indonesian: "Mengundang", english: "Invite", braille: toBraille("Invite") },
        ],
      },
      {
        id: "k9-5-l2",
        title: "Contoh Announcement & Invitation",
        content: "Pengumuman dan undangan sederhana.",
        braille: toBraille("There will be a school meeting on Monday at 9am. All students must come on time."),
        example: "Announcement:\nThere will be a school meeting on Monday at 9 a.m.\nAll students must come on time.\n\nInvitation:\nYou are invited to my birthday party.\nDate: Sunday\nTime: 3 p.m.\nPlace: My house",
      },
      {
        id: "k9-5-l3",
        title: "Contoh Short Message",
        content: "Pesan singkat sehari-hari.",
        braille: toBraille("I am at school now. Please call me later. Dont forget your homework."),
        example: "I am at school now. Please call me later.\nDon't forget your homework.\nI will come late today.",
      },
    ],
    exercises: [
      {
        id: "k9-5-e1", type: "multiple-choice",
        question: "'Announcement' berarti...",
        options: ["Undangan", "Pengumuman", "Pesan", "Rapat"],
        correctAnswer: "Pengumuman", points: 10,
      },
      {
        id: "k9-5-e2", type: "multiple-choice",
        question: "'Please call me later' adalah contoh...",
        options: ["Undangan", "Pesan singkat", "Cerita", "Pengumuman"],
        correctAnswer: "Pesan singkat", points: 10,
      },
      {
        id: "k9-5-e3", type: "multiple-choice",
        question: "Invitation digunakan untuk...",
        options: ["Mengundang seseorang", "Menolak sesuatu", "Bertanya", "Menyapa"],
        correctAnswer: "Mengundang seseorang", points: 10,
      },
    ],
  },
};
