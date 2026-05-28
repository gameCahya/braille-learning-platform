# AGENTS.md

Proyek: **Bralingo** — Platform pembelajaran Braille untuk siswa tunanetra SMPLB.

File ini diupdate manual oleh `/memory` command di akhir setiap sesi.

---

## ✅ Sesi Terakhir (28 Mei 2026)

**Periode:** 7 Mei – 28 Mei 2026 (16 commits + migration apply via psql)

### Fitur Baru
- **Guru CRUD Modul (`/materi/`)** — halaman *new*, *detail*, *edit*, dan daftar modul dengan Server Actions + form validasi Zod
- **Filter modul per kelas** — kolom `target_grade` di `teacher_modules`, guru pilih target kelas (VII/VIII/IX/Semua) saat buat modul, siswa cuma lihat modul untuk kelasnya
- **Admin approval system** — user registrasi butuh approval admin; halaman `/admin/`, `/menunggu-persetujuan/`, `/ditolak/` + RLS policies
- **School/grade field** — field `school_name` dan `grade_level` di tabel `profiles` + migration
- **WhatsApp admin button** — tombol WA di halaman menunggu persetujuan, menampilkan sekolah & kelas user
- **Per-class progress tracking** — tabel `class_progress`, komponen `ClassPicker`
- **Driver.js tutorial** — tutorial interaktif di semua halaman dashboard (refactored ke `TutorialDriverImpl`)
- **Vocabulary word structure** — `Lesson.words[]` dengan `VocabularyWord` (indonesian, english, braille, image)
- **Performance** — eliminasi waterfall DB queries, kurangi TTI

### Perbaikan
- Fix `Performance.measure` error — pindah Tabs admin ke client component
- Fix build errors terkait import/types
- Fix: ganti `confirm()` dengan `AlertDialog` accessible di ModulesTable

### Aksesibilitas Tunanetra
- Skip-to-content link di dashboard layout
- `aria-hidden` pada ikon sidebar, `aria-label` pada nav & Phase buttons
- `aria-label` pada teks Braille di PhaseMembaca/Mendengarkan/Berbicara
- `aria-live` region untuk notifikasi status
- Alt text deskriptif di QuizComponent

### Perubahan Arsitektur
- Route `app/(dashboard)/materi/` — halaman CRUD modul untuk guru
- Route `app/admin/`, `/menunggu-persetujuan/`, `/ditolak/` — sistem approval
- Route `app/(dashboard)/entertain/` — halaman hiburan
- Tabel baru di Supabase: `class_progress`, `teacher_modules`; kolom baru: `profiles.school_name`, `profiles.grade_level`, `profiles.status`, `teacher_modules.target_grade`
- Migrasi Supabase CLI — semua schema via migration files di `supabase/migrations/`
- Restrukturisasi `learn/` — GradePicker, grade-specific routes (`kelas-7`, `kelas-8`, `kelas-9`), Phase components pindah ke `_components/`
- Duplikasi modul standar: server action `duplicate-module.ts` + tombol di ModuleDetailClient

### Belum Selesai
- Belum ada tes otomatis (unit/integrasi)
- Belum ada halaman help/docs untuk guru

---

## ✅ Ringkasan Proyek

---

## ✅ Ringkasan Proyek

**Target pengguna:** Guru (bukan siswa). Siswa tidak mengoperasikan website — mereka belajar Braille secara fisik di kelas.

**Stack:**
- Next.js 16 (App Router), React 19, TypeScript 5
- Supabase (PostgreSQL + Auth) — via Supabase CLI, migrations di `supabase/migrations/`
- TailwindCSS 4, shadcn/ui (New York), Radix UI
- React Hook Form + Zod
- Package manager: pnpm

**Route groups:**
- `app/(auth)/` — login, register, forgot/reset-password (public)
- `app/(dashboard)/` — braille-reference, classrooms, converter, entertain, learn, **materi**, practice, progress, quiz, reports, settings, students
- `app/admin/` — admin approval panel
- `app/menunggu-persetujuan/` — halaman tunggu approval (public)
- `app/ditolak/` — halaman registrasi ditolak (public)

**Database tables:**
- `profiles` — user profil (dengan `school_name`, `grade_level`, `status` untuk approval)
- `classrooms`, `students` — manajemen kelas & siswa
- `user_progress`, `quiz_results`, `class_progress` — progress & quiz
- `module_audio` — audio modul
- `teacher_modules` — modul buatan guru (CRUD)
- `class_progress` — progress per kelas

---

## ✅ Catatan Penting

- **Types:** Gunakan `types/index.ts` — semua type diambil dari `@/types/supabase` (generated) + static types manual. Jangan buat tipe duplikat.
- **Materi CRUD:** Gunakan Server Actions di `app/(dashboard)/materi/_actions/module-actions.ts`. Form menggunakan React Hook Form + Zod. Data disimpan di tabel `teacher_modules`.
- **Admin approval:** User baru otomatis `status = 'pending'`. Admin menyetujui/menolak dari panel `/admin/`. RLS di `profiles` cegah akses user non-approved.
- **Migrations:** Semua perubahan schema harus via file di `supabase/migrations/`. Jangan edit langsung di dashboard Supabase.
- **Tutorial:** Driver.js — komponen `TutorialDriverImpl` dipasang di layout dashboard. Steps di `lib/tutorial/steps.ts`.
- **Braille modul statis:** Ada di `lib/data/modules.ts`. Untuk modul dinamis (guru), pakai tabel `teacher_modules`.
- **Progress:** Ada dua sistem: `user_progress` (per user) dan `class_progress` (per kelas). Dipilih via `ClassPicker`.
- **Route naming:** Semua rute dashboard pake Bahasa Indonesia (`/materi/`, `/belajar/` via `learn`, `/kuis/` via `quiz`).
- **Target grade:** Kolom `target_grade` di `teacher_modules` — nullable. NULL berarti "Semua Kelas". Filter siswa: tampilkan modul dengan `target_grade IS NULL` atau `target_grade = student.grade_level`.

---

## ✅ Pending Issues

- **Belum ada automated tests** — perlu setup testing (Vitest + Playwright)
- **Belum ada halaman help/docs** untuk guru
- **Belum ada fitur edit siswa** di halaman students
- **Belum ada fitur export raport** (PDF/Excel)
- **Tutorial Driver.js belum mencakup halaman `/materi/`** — perlu update `lib/tutorial/steps.ts`
- **Belum ada validasi unique** untuk nama modul per guru di `teacher_modules`
- **Belum ada sistem caching** — banyak halaman dashboard query langsung ke Supabase tiap render
- **Migrasi belum via `supabase db push`** — terakhir di-apply manual via psql langsung
