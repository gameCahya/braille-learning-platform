import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panduan Bralingo",
  description: "Panduan penggunaan platform Bralingo untuk guru dan siswa",
};

export default function HelpPage() {
  return (
    <div className="max-w-3xl space-y-10 py-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Panduan Bralingo</h1>
        <p className="text-muted-foreground mt-2">
          Panduan lengkap penggunaan platform pembelajaran Braille untuk guru, siswa, dan admin.
        </p>
      </div>

      {/* ======== Daftar Isi ======== */}
      <nav aria-label="Daftar isi panduan" className="bg-card border rounded-2xl p-5 space-y-1">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Daftar Isi</h2>
        <a href="#tentang" className="block text-sm text-primary hover:underline py-0.5">Tentang Bralingo</a>
        <a href="#navigasi" className="block text-sm text-primary hover:underline py-0.5">Navigasi &amp; Screen Reader</a>
        <a href="#login" className="block text-sm text-primary hover:underline py-0.5">Membuat Akun &amp; Login</a>
        <a href="#kelas-siswa" className="block text-sm text-primary hover:underline py-0.5">Mengelola Kelas &amp; Siswa</a>
        <a href="#materi" className="block text-sm text-primary hover:underline py-0.5">Membuat Modul (Materi)</a>
        <a href="#quiz" className="block text-sm text-primary hover:underline py-0.5">Membuat Quiz / Ujian</a>
        <a href="#bahan-ajar" className="block text-sm text-primary hover:underline py-0.5">Menggunakan Bahan Ajar</a>
        <a href="#practice" className="block text-sm text-primary hover:underline py-0.5">Latihan (Practice)</a>
        <a href="#progress" className="block text-sm text-primary hover:underline py-0.5">Melihat Progres Siswa</a>
        <a href="#tips" className="block text-sm text-primary hover:underline py-0.5">Tips untuk Pengguna Tunanetra</a>
      </nav>

      {/* ======== Tentang ======== */}
      <section id="tentang">
        <h2 className="text-xl font-bold text-foreground mb-3">Tentang Bralingo</h2>
        <p className="text-muted-foreground leading-relaxed">
          Bralingo adalah platform pembelajaran Braille Bahasa Inggris untuk siswa SMPLB tunanetra.
          Website ini digunakan oleh <strong>guru</strong> sebagai alat bantu mengajar di kelas.
          Guru menampilkan konten Braille, memutar audio Bahasa Inggris, membuat modul dan quiz,
          serta melacak progres belajar siswa.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-2">
          Ada tiga peran pengguna: <strong>Admin</strong> (menyetujui pendaftaran), <strong>Guru</strong> (mengelola kelas, modul, quiz),
          dan <strong>Siswa</strong> (melihat materi, mengerjakan latihan dan quiz).
        </p>
      </section>

      {/* ======== Navigasi ======== */}
      <section id="navigasi">
        <h2 className="text-xl font-bold text-foreground mb-3">Navigasi &amp; Screen Reader</h2>
        <p className="text-muted-foreground leading-relaxed">
          Website ini dirancang untuk kompatibel dengan pembaca layar (screen reader) seperti NVDA, JAWS, dan TalkBack.
          Di setiap halaman terdapat <strong>Skip Link</strong> ("Langsung ke konten utama") yang muncul saat pertama kali
          tekan <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Tab</kbd>.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-muted-foreground">
          <li>Sidebar navigasi di kiri layar memiliki label <em>"Navigasi sidebar"</em> — gunakan <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Tab</kbd> untuk berpindah menu.</li>
          <li>Setiap ikon dekoratif disembunyikan dari screen reader (<code>aria-hidden</code>).</li>
          <li>Setiap tombol tanpa teks memiliki label tersembunyi (<code>aria-label</code>) yang dibacakan screen reader.</li>
          <li>Form input mengumumkan error dengan suara — tidak hanya warna merah.</li>
          <li>Karakter Braille (⠓⠑⠇⠇⠕) ditampilkan secara visual, tapi screen reader akan membacakan deskripsi titik: "H: titik 1, 2, dan 5. E: titik 1 dan 5..."</li>
          <li>Di halaman latihan, aktifkan <strong>Mode Dengar</strong> agar soal dibacakan otomatis.</li>
        </ul>
      </section>

      {/* ======== Login ======== */}
      <section id="login">
        <h2 className="text-xl font-bold text-foreground mb-3">Membuat Akun &amp; Login</h2>
        <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
          <li>Buka halaman <a href="/register" className="text-primary hover:underline">Daftar</a>.</li>
          <li>Isi: Nama Lengkap, pilih peran (Guru/Siswa), Nama Sekolah, dan jika Siswa pilih Tingkat Kelas.</li>
          <li>Masukkan Email dan Password (minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka).</li>
          <li>Klik <strong>Daftar Sekarang</strong>. Cek email untuk konfirmasi.</li>
          <li>Setelah dikonfirmasi, <strong>Admin</strong> akan menyetujui akun kamu (maksimal 1×24 jam).</li>
          <li>Setelah disetujui, login di halaman <a href="/login" className="text-primary hover:underline">Masuk</a>.</li>
        </ol>
      </section>

      {/* ======== Kelas & Siswa ======== */}
      <section id="kelas-siswa">
        <h2 className="text-xl font-bold text-foreground mb-3">Mengelola Kelas &amp; Siswa</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Hanya guru yang bisa mengelola kelas dan siswa. Buka menu <strong>Kelas</strong> atau <strong>Siswa</strong> di sidebar.
        </p>
        <h3 className="text-base font-semibold text-foreground mt-4 mb-2">Menambah Kelas</h3>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          <li>Buka <strong>Kelas</strong> → klik <strong>Kelas Baru</strong>.</li>
          <li>Isi nama kelas dan deskripsi. Klik <strong>Buat Kelas</strong>.</li>
        </ol>
        <h3 className="text-base font-semibold text-foreground mt-4 mb-2">Menambah Siswa</h3>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          <li>Buka <strong>Siswa</strong> → klik <strong>Tambah Siswa</strong>.</li>
          <li>Isi nama, email (opsional), pilih kelas, dan catatan. Klik <strong>Tambah Siswa</strong>.</li>
          <li>Untuk mengedit: klik ikon pensil di tabel. Untuk menghapus: klik ikon tong sampah.</li>
        </ol>
      </section>

      {/* ======== Materi ======== */}
      <section id="materi">
        <h2 className="text-xl font-bold text-foreground mb-3">Membuat Modul (Materi)</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Modul adalah materi pembelajaran yang dibuat guru. Buka menu <strong>Materi</strong> di sidebar.
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          <li>Klik <strong>Modul Baru</strong>.</li>
          <li>Isi judul, deskripsi, tingkat kesulitan (Pemula/Menengah/Lanjutan), dan target kelas (opsional).</li>
          <li>Tambahkan pelajaran (lesson): judul, konten, dan Braille (opsional). Gunakan tombol <strong>Tambah Pelajaran</strong> untuk menambah.</li>
          <li>Toggle <strong>Publikasikan</strong> agar siswa bisa melihat modul.</li>
          <li>Klik <strong>Buat Modul</strong>.</li>
          <li>Anda juga bisa <strong>menduplikasi</strong> modul standar dari halaman Bahan Ajar untuk dijadikan modul sendiri.</li>
        </ol>
      </section>

      {/* ======== Quiz ======== */}
      <section id="quiz">
        <h2 className="text-xl font-bold text-foreground mb-3">Membuat Quiz / Ujian</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Quiz adalah kumpulan soal pilihan ganda. Buka menu <strong>Quiz &amp; Test</strong> di sidebar.
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          <li>Klik <strong>Buat Quiz</strong>.</li>
          <li>Isi judul, deskripsi, dan topik.</li>
          <li>Untuk setiap soal: tulis pertanyaan, isi 4 opsi jawaban, dan pilih jawaban benar dengan radio button.</li>
          <li>Setiap soal diberi label <em>"Soal ke-N"</em> untuk memudahkan navigasi screen reader.</li>
          <li>Klik <strong>Tambah Soal</strong> untuk menambah soal baru (minimal 1 soal).</li>
          <li>Toggle <strong>Publikasikan</strong> agar siswa bisa mengakses.</li>
          <li>Klik <strong>Buat Quiz</strong>.</li>
          <li>Quiz yang sudah dibuat bisa diedit (ikon pensil) atau dihapus (ikon tong sampah) dari daftar quiz.</li>
        </ol>
      </section>

      {/* ======== Bahan Ajar ======== */}
      <section id="bahan-ajar">
        <h2 className="text-xl font-bold text-foreground mb-3">Menggunakan Bahan Ajar</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Bahan Ajar berisi modul Braille standar untuk Kelas 7, 8, dan 9. Setiap modul punya 4 fase belajar:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li><strong>Fase Menulis</strong> — Tampilkan huruf/kata ke siswa, minta siswa tulis Braille di kertas. Guru bisa melihat pola titik Braille sebagai panduan.</li>
          <li><strong>Fase Mendengarkan</strong> — Putar audio Bahasa Inggris. Ada tombol ulangi 1×/2×/3×/5×/10×. Cocok untuk melatih pendengaran siswa.</li>
          <li><strong>Fase Membaca</strong> — Kosakata dengan gambar dan Braille. Screen reader akan membacakan deskripsi titik setiap kata.</li>
          <li><strong>Fase Berbicara</strong> — Putar audio, minta siswa mengucapkan. Guru bisa upload rekaman audio siswa.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-2">
          Guru bebas memilih urutan fase — klik kartu fase untuk membuka/menutup. Di halaman Panduan Braille,
          tersedia tombol <strong>Dengarkan Alfabet</strong> yang membacakan semua 26 huruf dengan deskripsi titik.
        </p>
      </section>

      {/* ======== Practice ======== */}
      <section id="practice">
        <h2 className="text-xl font-bold text-foreground mb-3">Latihan (Practice)</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Halaman Practice menyediakan latihan interaktif dengan 3 mode:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li><strong>Flashcards</strong> — Kartu bolak-balik: tampilkan huruf/kata, klik untuk lihat Braille-nya.</li>
          <li><strong>Braille → Teks</strong> — Lihat Braille, ketik teksnya. Untuk tunanetra: aktifkan <strong>Mode Dengar</strong> agar soal dibacakan.</li>
          <li><strong>Teks → Braille</strong> — Lihat teks, tulis Braille-nya. Input bisa via teks biasa atau keyboard Braille visual.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-2">
          <strong>Mode Dengar:</strong> Toggle di header latihan. Saat aktif, setiap soal otomatis dibacakan lewat TTS.
          Untuk soal Braille→Teks, yang dibacakan adalah deskripsi titik ("H: titik 1, 2, dan 5. I: titik 2 dan 4."),
          bukan karakter Unicode yang tidak terbaca screen reader.
        </p>
      </section>

      {/* ======== Progress ======== */}
      <section id="progress">
        <h2 className="text-xl font-bold text-foreground mb-3">Melihat Progres Siswa</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Ada dua halaman untuk melihat progres:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li><strong>Progres</strong> — Melihat progres diri sendiri: modul selesai, skor rata-rata, kuis dikerjakan, pencapaian. Grafik tersedia secara visual, tapi screen reader akan membacakan data dalam bentuk teks.</li>
          <li><strong>Laporan</strong> — Khusus guru: ringkasan kelas, progres per siswa (modul selesai, skor rata-rata), daftar quiz. Tabel progres siswa bisa dibaca screen reader per baris.</li>
        </ul>
      </section>

      {/* ======== Tips ======== */}
      <section id="tips">
        <h2 className="text-xl font-bold text-foreground mb-3">Tips untuk Pengguna Tunanetra</h2>
        <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
          <li>
            <strong>Gunakan shortcut keyboard:</strong> <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Tab</kbd> untuk navigasi antar elemen,
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono ml-1">Enter</kbd> untuk klik,
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono ml-1">H</kbd> untuk buka tutorial di halaman tertentu.
          </li>
          <li>
            <strong>Deskripsi titik Braille:</strong> Setiap karakter Braille di website ini memiliki deskripsi tersembunyi
            yang dibacakan screen reader. Contoh: ⠓ akan dibacakan "H: titik 1, 2, dan 5". Dengarkan baik-baik pola titiknya.
          </li>
          <li>
            <strong>Mode Dengar di Practice:</strong> Saat mengerjakan latihan, nyalakan Mode Dengar.
            Soal akan otomatis dibacakan, dan kamu tinggal mengetik jawaban dalam teks biasa (bukan Braille Unicode).
          </li>
          <li>
            <strong>Form selalu punya label:</strong> Setiap input form memiliki label yang terbaca screen reader,
            bahkan jika label tidak terlihat secara visual (menggunakan teknik <code>sr-only</code>).
            Jika ada error, fokus akan otomatis pindah ke pesan error.
          </li>
          <li>
            <strong>Dengarkan Alfabet:</strong> Di halaman Panduan Braille, gunakan tombol "Dengarkan Alfabet"
            untuk mendengarkan semua 26 huruf A-Z dengan deskripsi titiknya satu per satu.
          </li>
          <li>
            <strong>Skip link:</strong> Di setiap halaman, tekan <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Tab</kbd> saat pertama kali
            untuk memunculkan link "Langsung ke konten utama" — langsung lompat ke isi halaman tanpa harus melewati sidebar.
          </li>
          <li>
            <strong>Toast notifikasi:</strong> Notifikasi sukses/gagal muncul di pojok kanan atas.
            Screen reader akan mengumumkannya secara otomatis.
          </li>
        </ul>
      </section>

      {/* Footer */}
      <div className="border-t pt-6 text-sm text-muted-foreground">
        <p>
          Ada pertanyaan atau butuh bantuan? Hubungi admin sekolah kamu atau gunakan tombol WhatsApp di halaman menunggu persetujuan.
        </p>
      </div>
    </div>
  );
}
