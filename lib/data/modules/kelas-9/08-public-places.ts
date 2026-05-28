import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mPublicPlaces: GradeModule = {
  id: "k9-mod-8",
  grade: 9,
  title: "Asking Directions & Public Places",
  description: "Menanyakan arah dan tempat umum dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 8,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Belajar menanyakan dan memberi arah serta mengenal nama-nama tempat umum seperti sekolah, rumah sakit, pasar, masjid.",
    lessons: [
      {
        id: "k9-8-l1",
        title: "Tempat Umum",
        content: "Nama-nama tempat umum.",
        words: [
          { id: "k9-8-w1", indonesian: "Sekolah", english: "School", braille: toBraille("School") },
          { id: "k9-8-w2", indonesian: "Rumah sakit", english: "Hospital", braille: toBraille("Hospital") },
          { id: "k9-8-w3", indonesian: "Pasar", english: "Market", braille: toBraille("Market") },
          { id: "k9-8-w4", indonesian: "Masjid", english: "Mosque", braille: toBraille("Mosque") },
          { id: "k9-8-w5", indonesian: "Perpustakaan", english: "Library", braille: toBraille("Library") },
          { id: "k9-8-w6", indonesian: "Taman", english: "Park", braille: toBraille("Park") },
          { id: "k9-8-w7", indonesian: "Bank", english: "Bank", braille: toBraille("Bank") },
          { id: "k9-8-w8", indonesian: "Kantor pos", english: "Post office", braille: toBraille("Post office") },
        ],
      },
      {
        id: "k9-8-l2",
        title: "Menanyakan dan Memberi Arah",
        content: "Ungkapan untuk bertanya dan memberi arah.",
        words: [
          { id: "k9-8-w9", indonesian: "Di mana sekolah?", english: "Where is the school?", braille: toBraille("Where is the school") },
          { id: "k9-8-w10", indonesian: "Bagaimana cara ke pasar?", english: "How can I get to the market?", braille: toBraille("How can I get to the market") },
          { id: "k9-8-w11", indonesian: "Jalan lurus", english: "Go straight", braille: toBraille("Go straight") },
          { id: "k9-8-w12", indonesian: "Belok kiri", english: "Turn left", braille: toBraille("Turn left") },
          { id: "k9-8-w13", indonesian: "Belok kanan", english: "Turn right", braille: toBraille("Turn right") },
        ],
      },
      {
        id: "k9-8-l3",
        title: "Contoh Dialog",
        content: "Percakapan menanyakan arah ke tempat umum.",
        braille: toBraille("Excuse me where is the library? Go straight and turn left. It is near the school."),
        example: "A: Excuse me, where is the library?\nB: Go straight and turn left. It is near the school.\n\nA: How can I get to the market?\nB: Turn right and go straight.",
      },
    ],
    exercises: [
      {
        id: "k9-8-e1", type: "multiple-choice",
        question: "'Turn left' berarti...",
        options: ["Belok kanan", "Lurus", "Belok kiri", "Berhenti"],
        correctAnswer: "Belok kiri", points: 10,
      },
      {
        id: "k9-8-e2", type: "multiple-choice",
        question: "'Market' adalah...",
        options: ["Pasar", "Sekolah", "Rumah sakit", "Bank"],
        correctAnswer: "Pasar", points: 10,
      },
      {
        id: "k9-8-e3", type: "multiple-choice",
        question: "'Go straight' artinya...",
        options: ["belok kiri", "lurus", "berhenti", "belok kanan"],
        correctAnswer: "lurus", points: 10,
      },
    ],
  },
};
