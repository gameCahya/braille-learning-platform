import { toBraille } from "../utils";
import type { GradeModule } from "../types";

export const mTenses: GradeModule = {
  id: "k9-mod-7",
  grade: 9,
  title: "Simple Present, Past & Future",
  description: "Penguatan tiga tenses dasar dalam Bahasa Inggris",
  difficulty: "intermediate",
  order_number: 7,
  braille_content: null,
  created_at: "2026-05-01T00:00:00.000Z",
  content: {
    summary: "Penguatan pemahaman perbedaan Simple Present Tense, Simple Past Tense, dan Simple Future Tense (will).",
    lessons: [
      {
        id: "k9-7-l1",
        title: "Simple Present Tense",
        content: "Kebiasaan sehari-hari.",
        braille: toBraille("I go to school every day. She eats rice in the morning. They study English."),
        example: "I go to school every day.\nShe eats rice in the morning.\nThey study English.",
      },
      {
        id: "k9-7-l2",
        title: "Simple Past Tense",
        content: "Kegiatan masa lalu.",
        braille: toBraille("I went to school yesterday. She played with her friend. They visited the zoo."),
        example: "I went to school yesterday.\nShe played with her friend.\nThey visited the zoo.",
      },
      {
        id: "k9-7-l3",
        title: "Simple Future Tense",
        content: "Kegiatan yang akan datang (will).",
        braille: toBraille("I will go to school tomorrow. She will study English. They will play football."),
        example: "I will go to school tomorrow.\nShe will study English.\nThey will play football.",
      },
      {
        id: "k9-7-l4",
        title: "Perbandingan Tenses",
        content: "Pentingnya waktu dalam kalimat.",
        braille: toBraille("Present: I go to school. Past: I went to school. Future: I will go to school."),
        example: "Present: I go to school. (sekarang)\nPast: I went to school. (kemarin)\nFuture: I will go to school. (besok)",
      },
    ],
    exercises: [
      {
        id: "k9-7-e1", type: "multiple-choice",
        question: "'I went to school yesterday' adalah...",
        options: ["Present", "Past", "Future", "Present continuous"],
        correctAnswer: "Past", points: 10,
      },
      {
        id: "k9-7-e2", type: "multiple-choice",
        question: "'I will go to school tomorrow' berarti...",
        options: ["Kemarin", "Sekarang", "Besok", "Sehari-hari"],
        correctAnswer: "Besok", points: 10,
      },
      {
        id: "k9-7-e3", type: "multiple-choice",
        question: "'She eats rice every day' adalah...",
        options: ["Present", "Past", "Future", "Present tense"],
        correctAnswer: "Present", points: 10,
      },
    ],
  },
};
