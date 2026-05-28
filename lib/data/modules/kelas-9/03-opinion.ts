import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mOpinion: GradeModule = {
  id: "k9-mod-3",
  grade: 9,
  title: "Asking Opinion, Agreeing & Disagreeing",
  description: "Menanyakan pendapat, setuju, dan tidak setuju dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 3,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar mengungkapkan pendapat, menanyakan pendapat orang lain, serta menyatakan setuju atau tidak setuju secara sopan.",
    lessons: [
      {
        id: "k9-3-l1",
        title: "Menanyakan Pendapat",
        content: "Cara bertanya tentang pendapat.",
        words: [
          { id: "k9-3-w1", indonesian: "Apa pendapatmu?", english: "What do you think?", braille: toBraille("What do you think") },
          { id: "k9-3-w2", indonesian: "Apakah kamu suka ini?", english: "Do you like this?", braille: toBraille("Do you like this") },
          { id: "k9-3-w3", indonesian: "Bagaimana perasaanmu?", english: "How do you feel about it?", braille: toBraille("How do you feel about it") },
        ],
      },
      {
        id: "k9-3-l2",
        title: "Memberi Pendapat",
        content: "Cara menyampaikan pendapat.",
        words: [
          { id: "k9-3-w4", indonesian: "Saya pikir itu bagus", english: "I think it is good", braille: toBraille("I think it is good") },
          { id: "k9-3-w5", indonesian: "Saya suka itu", english: "I like it", braille: toBraille("I like it") },
          { id: "k9-3-w6", indonesian: "Menurut saya, itu mudah", english: "In my opinion, it is easy", braille: toBraille("In my opinion it is easy") },
        ],
      },
      {
        id: "k9-3-l3",
        title: "Setuju dan Tidak Setuju",
        content: "Ungkapan agree dan disagree.",
        words: [
          { id: "k9-3-w7", indonesian: "Saya setuju", english: "I agree", braille: toBraille("I agree") },
          { id: "k9-3-w8", indonesian: "Ya, kamu benar", english: "Yes, you are right", braille: toBraille("Yes you are right") },
          { id: "k9-3-w9", indonesian: "Saya tidak setuju", english: "I disagree", braille: toBraille("I disagree") },
          { id: "k9-3-w10", indonesian: "Saya tidak yakin", english: "I'm not sure", braille: toBraille("Im not sure") },
        ],
      },
      {
        id: "k9-3-l4",
        title: "Contoh Dialog",
        content: "Percakapan tentang pendapat.",
        braille: toBraille("What do you think about this book? I think it is good. I agree."),
        example: "A: What do you think about this book?\nB: I think it is good.\nA: I agree.\n\nA: Do you like studying English?\nB: Yes, I do. It is interesting.",
      },
    ],
    exercises: [
      {
        id: "k9-3-e1", type: "multiple-choice",
        question: "'I think it is good' berarti...",
        options: ["Saya tidak setuju", "Saya pikir itu baik", "Saya tidak tahu", "Saya suka itu"],
        correctAnswer: "Saya pikir itu baik", points: 10,
      },
      {
        id: "k9-3-e2", type: "multiple-choice",
        question: "'I agree' artinya...",
        options: ["Saya setuju", "Saya marah", "Saya ragu", "Saya tidak suka"],
        correctAnswer: "Saya setuju", points: 10,
      },
      {
        id: "k9-3-e3", type: "multiple-choice",
        question: "'What do you think?' digunakan untuk...",
        options: ["Menanyakan pendapat", "Menanyakan waktu", "Menanyakan nama", "Berpamitan"],
        correctAnswer: "Menanyakan pendapat", points: 10,
      },
    ],
  },
};
