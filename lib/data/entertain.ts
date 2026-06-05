export interface Song {
  id: string;
  title: string;
  description: string;
  lyrics: string[]; // per baris
}

export interface CountingExercise {
  id: string;
  title: string;
  description: string;
  items: string[]; // teks yang akan dibacakan TTS
}

export const songs: Song[] = [
  {
    id: "abc",
    title: "ABC Song",
    description: "Lagu alfabet Bahasa Inggris — cocok untuk melatih pelafalan huruf",
    lyrics: [
      "A B C D E F G",
      "H I J K L M N O P",
      "Q R S T U V",
      "W X Y and Z",
      "Now I know my ABCs",
      "Next time won't you sing with me?",
    ],
  },
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    description: "Lagu anak klasik — melatih pelafalan dan ritme",
    lyrics: [
      "Twinkle, twinkle, little star",
      "How I wonder what you are",
      "Up above the world so high",
      "Like a diamond in the sky",
      "Twinkle, twinkle, little star",
      "How I wonder what you are",
    ],
  },
  {
    id: "head-shoulders",
    title: "Head, Shoulders, Knees and Toes",
    description: "Lagu bagian tubuh — belajar kosakata anggota tubuh",
    lyrics: [
      "Head, shoulders, knees and toes, knees and toes",
      "Head, shoulders, knees and toes, knees and toes",
      "And eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes, knees and toes",
    ],
  },
  {
    id: "happy",
    title: "If You're Happy and You Know It",
    description: "Lagu interaktif — siswa bisa ikut bertepuk tangan",
    lyrics: [
      "If you're happy and you know it, clap your hands",
      "If you're happy and you know it, clap your hands",
      "If you're happy and you know it, then your face will surely show it",
      "If you're happy and you know it, clap your hands",
    ],
  },
];

export const countingExercises: CountingExercise[] = [
  {
    id: "numbers-0-9",
    title: "Angka 0 sampai 9",
    description: "Pengucapan angka dalam Bahasa Inggris",
    items: ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
  },
  {
    id: "numbers-10-20",
    title: "Angka 10 sampai 20",
    description: "Pengucapan angka belasan dalam Bahasa Inggris",
    items: ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"],
  },
  {
    id: "addition",
    title: "Penjumlahan Sederhana",
    description: "Latihan penjumlahan dasar dalam Bahasa Inggris",
    items: [
      "One plus one equals two",
      "Two plus two equals four",
      "Three plus one equals four",
      "Two plus three equals five",
      "Four plus one equals five",
      "Three plus three equals six",
      "Five plus two equals seven",
      "Four plus four equals eight",
      "Five plus four equals nine",
      "Five plus five equals ten",
    ],
  },
  {
    id: "subtraction",
    title: "Pengurangan Sederhana",
    description: "Latihan pengurangan dasar dalam Bahasa Inggris",
    items: [
      "Five minus one equals four",
      "Four minus two equals two",
      "Three minus one equals two",
      "Five minus two equals three",
      "Four minus one equals three",
      "Six minus three equals three",
      "Eight minus four equals four",
      "Ten minus five equals five",
      "Nine minus three equals six",
      "Seven minus two equals five",
    ],
  },
];
