import type { DriveStep } from "driver.js";

export const dashboardSteps: DriveStep[] = [
  {
    element: "#dashboard-greeting",
    popover: {
      title: "Selamat Datang di Bralingo",
      description: "Ini adalah halaman utama dashboard Anda sebagai guru Braille.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#dashboard-actions",
    popover: {
      title: "Menu Cepat",
      description: "Akses semua fitur utama dari sini — Panduan Braille, Modul Belajar, Practice, Quiz, Siswa, dan Kelas.",
      side: "top",
    },
  },
  {
    element: "#sidebar-nav",
    popover: {
      title: "Navigasi Sidebar",
      description: "Sidebar ini selalu tersedia. Berisi tiga kelompok menu: Belajar Mandiri (untuk persiapan), Mengajar di Kelas (saat sesi), dan Manajemen (data siswa & kelas).",
      side: "right",
    },
  },
  {
    popover: {
      title: "Siap Mengajar!",
      description: "Mulai dengan memilih kelas di menu Modul Belajar, atau gunakan Panduan Braille sebagai referensi cepat saat mengajar.",
    },
  },
];

export const learnSteps: DriveStep[] = [
  {
    element: "#class-picker-header",
    popover: {
      title: "Pilih Kelas untuk Mengajar",
      description: "Sebelum membuka modul, pilih kelas yang sedang Anda ajar. Progress tiap kelas akan tersimpan secara terpisah.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#class-picker-grid",
    popover: {
      title: "Kartu Kelas",
      description: "Setiap kartu menampilkan nama kelas dan jumlah modul yang sudah selesai diajarkan. Klik salah satu untuk melihat daftar modul.",
      side: "top",
    },
  },
  {
    popover: {
      title: "Belum Ada Kelas?",
      description: "Buat kelas baru terlebih dahulu di menu Manajemen → Kelas. Setelah kelas dibuat, kelas akan muncul di halaman ini.",
    },
  },
];

export const modulesSteps: DriveStep[] = [
  {
    element: "#modules-header",
    popover: {
      title: "Daftar Modul Belajar",
      description: "Semua modul tersedia dan bisa dibuka dalam urutan bebas. Pilih modul sesuai materi yang ingin diajarkan hari ini.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#modules-progress",
    popover: {
      title: "Progress Kelas",
      description: "Ringkasan berapa modul yang sudah selesai diajarkan untuk kelas yang dipilih. Progress ini tersimpan per kelas.",
      side: "bottom",
    },
  },
  {
    element: "#modules-list",
    popover: {
      title: "Kartu Modul",
      description: "Setiap kartu menampilkan judul modul, tingkat kesulitan (beginner/intermediate), jumlah pelajaran, dan status pengajaran. Klik tombol 'Buka' untuk memulai.",
      side: "top",
    },
  },
];

export const moduleDetailSteps: DriveStep[] = [
  {
    element: "#module-title",
    popover: {
      title: "Informasi Modul",
      description: "Judul, deskripsi, dan tingkat kesulitan modul yang sedang dibuka. Badge menunjukkan apakah modul sudah pernah diajarkan.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#phase-selector",
    popover: {
      title: "Pilih Fase Belajar",
      description: "Ada 4 fase pengajaran yang bisa dipilih dalam urutan bebas:\n• Menulis — siswa tulis pola Braille di kertas\n• Mendengarkan — putar audio, siswa mendengarkan\n• Membaca — kosakata dan gambar\n• Berbicara — siswa ucapkan kata, rekam audio",
      side: "bottom",
    },
  },
  {
    element: "#module-actions",
    popover: {
      title: "Tombol Aksi",
      description: "Setelah selesai mengajar, klik 'Mulai Mengajarkan' lalu 'Selesai Diajarkan' untuk mencatat progress kelas. Anda juga bisa mengambil Quiz dari sini.",
      side: "top",
    },
  },
];

export const brailleReferenceSteps: DriveStep[] = [
  {
    element: "#braille-header",
    popover: {
      title: "Panduan Braille",
      description: "Referensi lengkap Braille Bahasa Inggris Grade 1. Gunakan halaman ini saat mengajar sebagai panduan visual dan audio.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#braille-cell-structure",
    popover: {
      title: "Struktur Sel Braille",
      description: "Setiap karakter Braille terdiri dari 6 titik dalam 2 kolom × 3 baris, diberi nomor 1–6. Penjelasan ini berguna untuk mengajarkan konsep dasar.",
      side: "bottom",
    },
  },
  {
    element: "#braille-alphabet",
    popover: {
      title: "Alfabet A–Z",
      description: "26 kartu huruf Braille. Klik tombol suara di setiap kartu untuk memutar audio pengucapan. Bisa diputar berkali-kali untuk latihan mendengarkan siswa.",
      side: "top",
    },
  },
  {
    element: "#braille-numbers",
    popover: {
      title: "Angka 0–9",
      description: "Representasi Braille untuk angka. Ingat: angka selalu didahului tanda indikator angka (⠼) sebelum karakter angka.",
      side: "top",
    },
  },
  {
    element: "#braille-punctuation",
    popover: {
      title: "Tanda Baca",
      description: "Tanda baca umum dalam Braille. Berguna untuk pelajaran lanjutan setelah siswa menguasai alfabet dasar.",
      side: "top",
    },
  },
];

export const practiceSteps: DriveStep[] = [
  {
    element: "#practice-header",
    popover: {
      title: "Practice Braille",
      description: "Halaman latihan Braille interaktif. Tersedia tiga jenis latihan berbeda dengan tiga tingkat kesulitan.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#accessibility-notice",
    popover: {
      title: "Mode Aksesibel",
      description: "Platform ini mendukung Audio Mode untuk screen reader, Text Mode untuk input mudah, dan Visual Keyboard untuk latihan interaktif.",
      side: "bottom",
    },
  },
  {
    element: "#practice-types",
    popover: {
      title: "Jenis Latihan",
      description: "• Flashcards — tinjau karakter Braille dengan kartu interaktif\n• Braille → Text — baca Braille dan ketik jawabannya\n• Text → Braille — konversi teks ke Braille\n\nSetiap jenis tersedia dalam level Easy, Medium, dan Hard.",
      side: "top",
    },
  },
];

export const quizSteps: DriveStep[] = [
  {
    element: "#quiz-header",
    popover: {
      title: "Quiz & Test",
      description: "Daftar quiz yang bisa ditampilkan kepada siswa saat sesi di kelas. Pilih quiz sesuai materi yang sudah diajarkan.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#quiz-topics",
    popover: {
      title: "Quiz per Topik",
      description: "Quiz dikelompokkan berdasarkan topik (Huruf Braille, Angka, Kosakata, dll). Klik kartu quiz untuk mulai mempresentasikan soal ke siswa.",
      side: "top",
    },
  },
];

export const classroomsSteps: DriveStep[] = [
  {
    element: "#classrooms-header",
    popover: {
      title: "Manajemen Kelas",
      description: "Daftar semua kelas yang Anda kelola. Kelas digunakan untuk melacak progress pengajaran per kelompok siswa.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#classrooms-add-btn",
    popover: {
      title: "Buat Kelas Baru",
      description: "Klik tombol ini untuk membuat kelas baru. Isi nama dan deskripsi kelas, lalu kelas siap digunakan di Modul Belajar.",
      side: "left",
    },
  },
  {
    element: "#classrooms-table",
    popover: {
      title: "Tabel Kelas",
      description: "Daftar semua kelas Anda. Dari sini Anda bisa mengedit informasi kelas atau menghapus kelas yang sudah tidak aktif.",
      side: "top",
    },
  },
];

export const studentsSteps: DriveStep[] = [
  {
    element: "#students-header",
    popover: {
      title: "Manajemen Siswa",
      description: "Daftar semua siswa dari seluruh kelas yang Anda kelola. Tambahkan siswa ke kelas yang sesuai.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#students-add-btn",
    popover: {
      title: "Tambah Siswa",
      description: "Klik tombol ini untuk mendaftarkan siswa baru. Isi nama, email (opsional), dan pilih kelas tempat siswa bergabung.",
      side: "left",
    },
  },
  {
    element: "#students-table",
    popover: {
      title: "Tabel Siswa",
      description: "Daftar semua siswa beserta kelas mereka. Klik nama siswa untuk melihat atau mengedit detail.",
      side: "top",
    },
  },
];
