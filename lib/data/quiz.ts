export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  topic: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: "alphabet-basic",
    title: "Huruf Braille — Dasar",
    description: "Mengenal titik Braille untuk huruf A–J",
    topic: "Alfabet",
    questions: [
      {
        id: 1,
        question: "Huruf Braille manakah yang memiliki 1 titik di posisi kiri atas (titik 1)?",
        options: ["A", "B", "C", "D"],
        answer: "A",
      },
      {
        id: 2,
        question: "Berapa jumlah titik pada huruf Braille 'B'?",
        options: ["1", "2", "3", "4"],
        answer: "2",
      },
      {
        id: 3,
        question: "Huruf apa yang direpresentasikan oleh titik Braille di posisi 1 dan 2?",
        options: ["A", "B", "C", "D"],
        answer: "B",
      },
      {
        id: 4,
        question: "Huruf Braille 'C' memiliki titik di posisi mana saja?",
        options: ["1, 4", "1, 2", "2, 4", "1, 3"],
        answer: "1, 4",
      },
      {
        id: 5,
        question: "Manakah huruf Braille yang memiliki titik di posisi 1, 4, 5?",
        options: ["C", "D", "E", "F"],
        answer: "D",
      },
    ],
  },
  {
    id: "alphabet-advanced",
    title: "Huruf Braille — Lanjutan",
    description: "Mengenal titik Braille untuk huruf K–Z",
    topic: "Alfabet",
    questions: [
      {
        id: 1,
        question: "Huruf K dalam Braille adalah huruf A ditambah titik di posisi mana?",
        options: ["3", "6", "5", "4"],
        answer: "3",
      },
      {
        id: 2,
        question: "Pola Braille huruf L terdiri dari titik di posisi mana?",
        options: ["1, 2, 3", "1, 3", "2, 3", "1, 2"],
        answer: "1, 2, 3",
      },
      {
        id: 3,
        question: "Huruf W dalam Braille adalah satu-satunya huruf yang tidak mengikuti pola dasar. Titiknya berada di posisi?",
        options: ["2, 4, 5, 6", "1, 3, 4, 5", "1, 2, 4, 5", "2, 3, 4, 6"],
        answer: "2, 4, 5, 6",
      },
    ],
  },
  {
    id: "numbers",
    title: "Angka Braille",
    description: "Mengenal representasi angka 0–9 dalam Braille",
    topic: "Angka",
    questions: [
      {
        id: 1,
        question: "Angka dalam Braille diawali dengan tanda khusus yang disebut?",
        options: ["Number indicator", "Capital indicator", "Letter indicator", "Space indicator"],
        answer: "Number indicator",
      },
      {
        id: 2,
        question: "Angka 1 dalam Braille menggunakan pola huruf apa?",
        options: ["A", "B", "C", "J"],
        answer: "A",
      },
      {
        id: 3,
        question: "Angka 0 dalam Braille menggunakan pola huruf apa?",
        options: ["J", "A", "Z", "O"],
        answer: "J",
      },
      {
        id: 4,
        question: "Berapa nilai angka Braille yang menggunakan pola huruf E?",
        options: ["5", "3", "4", "6"],
        answer: "5",
      },
    ],
  },
  {
    id: "vocabulary-colors",
    title: "Kosakata — Warna",
    description: "Kosakata warna dalam Bahasa Inggris dan Braille",
    topic: "Kosakata",
    questions: [
      {
        id: 1,
        question: "Apa kata Bahasa Inggris untuk 'merah'?",
        options: ["Red", "Blue", "Green", "Yellow"],
        answer: "Red",
      },
      {
        id: 2,
        question: "Warna apa yang dieja B-L-U-E dalam Bahasa Inggris?",
        options: ["Biru", "Hijau", "Ungu", "Abu-abu"],
        answer: "Biru",
      },
      {
        id: 3,
        question: "Apa kata Bahasa Inggris untuk 'kuning'?",
        options: ["Yellow", "Orange", "Brown", "White"],
        answer: "Yellow",
      },
      {
        id: 4,
        question: "Kata 'GREEN' berarti warna apa?",
        options: ["Hijau", "Merah", "Biru", "Hitam"],
        answer: "Hijau",
      },
      {
        id: 5,
        question: "Apa kata Bahasa Inggris untuk 'hitam'?",
        options: ["Black", "White", "Gray", "Brown"],
        answer: "Black",
      },
    ],
  },
  {
    id: "vocabulary-animals",
    title: "Kosakata — Hewan",
    description: "Kosakata nama hewan dalam Bahasa Inggris dan Braille",
    topic: "Kosakata",
    questions: [
      {
        id: 1,
        question: "Apa kata Bahasa Inggris untuk 'kucing'?",
        options: ["Cat", "Dog", "Bird", "Fish"],
        answer: "Cat",
      },
      {
        id: 2,
        question: "Kata 'DOG' berarti hewan apa?",
        options: ["Anjing", "Kucing", "Kelinci", "Tikus"],
        answer: "Anjing",
      },
      {
        id: 3,
        question: "Apa kata Bahasa Inggris untuk 'burung'?",
        options: ["Bird", "Fish", "Frog", "Cow"],
        answer: "Bird",
      },
      {
        id: 4,
        question: "Kata 'ELEPHANT' berarti hewan apa?",
        options: ["Gajah", "Harimau", "Singa", "Kuda"],
        answer: "Gajah",
      },
      {
        id: 5,
        question: "Apa kata Bahasa Inggris untuk 'ikan'?",
        options: ["Fish", "Frog", "Crab", "Snail"],
        answer: "Fish",
      },
    ],
  },
];

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id);
}

export function getQuizzesByTopic(topic: string): Quiz[] {
  return quizzes.filter((q) => q.topic === topic);
}

export const quizTopics = [...new Set(quizzes.map((q) => q.topic))];
