import type { DriveStep } from "driver.js";

// tambahan di akhir file
export const materiSteps: DriveStep[] = [
  {
    element: "#materi-header",
    popover: {
      title: "Halaman Materi",
      description: "Di sini Anda bisa membuat dan mengelola modul pembelajaran untuk siswa.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#materi-add-btn",
    popover: {
      title: "Tambah Modul Baru",
      description: "Klik tombol ini untuk membuat modul baru. Isi judul, deskripsi, tingkat kesulitan, dan pelajaran.",
      side: "bottom",
    },
  },
  {
    element: "#materi-table",
    popover: {
      title: "Daftar Modul Anda",
      description: "Tabel ini menampilkan semua modul yang sudah Anda buat. Klik judul untuk melihat detail, gunakan tombol edit dan hapus untuk mengelola modul.",
      side: "top",
    },
  },
];
