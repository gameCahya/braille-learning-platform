# AGENTS.md

Proyek: **Bralingo** — Platform pembelajaran Braille untuk siswa tunanetra SMPLB.

File ini diupdate manual oleh `/memory` command di akhir setiap sesi.

---

## ✅ Sesi Terakhir (01 Jun 2026 — Sesi 3)

**Periode:** 01 Jun 2026 (0 commits — perubahan uncommitted)

### Fitur Baru
- (tidak ada fitur baru)

### Perbaikan
- **Aksesibilitas form login** — tambah `<label>` + `id` pada input email/password (`login/page.tsx`)
- **Aksesibilitas form register** — tambah `<label>` + `id` pada semua input: fullName, schoolName, gradeLevel, email, password, confirmPassword (`register/page.tsx`)
- **Ikon dekoratif** — tambah `aria-hidden="true"` pada ikon Eye/EyeOff di halaman login dan register
- **Redirect error check** — investigasi `isRedirectError()` dari `next/navigation`, tidak tersedia di Next.js 16.1.1 (hanya `getRedirectError` tapi itu creator bukan checker); tetap pakai pola `error.message === "NEXT_REDIRECT"`

### Perubahan Arsitektur
- (tidak ada perubahan arsitektur)

### Belum Selesai
- Perubahan masih uncommitted — 4 file modified: `login/page.tsx`, `register/page.tsx`, `AGENTS.md`, `.opencode/commands/memory.sh`

---

## ✅ Sesi Terakhir (28 Mei 2026 — Sesi 2)

**Periode:** 28 Mei 2026 (6 commits: 64e140b..c2a3e60)

### Fitur Baru
- **Link "Bahan Ajar" di sidebar guru** — akses modul Braille statis via `/learn/`
- **Guru skip ClassPicker** — guru langsung lihat GradePicker di `/learn/` tanpa milih kelas
- **Duplikasi modul standar → materi guru** — server action `duplicate-module.ts`, tombol di `ModuleDetailClient`, modul hasil duplikasi jadi draft di `teacher_modules`
- **Aksesibilitas tunanetra** (batch 10 fix):
  - Skip-to-content link di dashboard layout
  - `aria-hidden` pada ikon sidebar, `aria-label` pada nav
  - `aria-label` pada teks Braille (PhaseMembaca/Mendengarkan/Berbicara)
  - `aria-live` region untuk notifikasi status
  - Alt text deskriptif di QuizComponent
  - `AlertDialog` gantikan `confirm()` di ModulesTable
- **Semua migration ter-apply ke DB** via psql pooler langsung

### Perbaikan
- Fix: label sidebar dari "Belajar" → "Bahan Ajar"

### Perubahan Arsitektur
- Server action baru: `app/(dashboard)/learn/_actions/duplicate-module.ts`
- Aksesibilitas diterapkan di: `layout.tsx`, `DashboardSidebar`, `NavItem`, `ModuleDetailClient`, `PhaseMembaca/Mendengarkan/Berbicara`, `ModulesTable`, `QuizComponent`

### Belum Selesai
- Migration apply masih via psql langsung, belum `supabase db push`

---

## ✅ Ringkasan Proyek

**Target pengguna:** Admin, guru, dan siswa — ketiganya mengoperasikan website. Admin mengelola approval & data; guru membuat & mengelola modul, kelas, dan siswa; siswa mengakses modul Braille, mengerjakan kuis, dan melihat progress.

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
- **Route naming:** Semua rute dashboard pake Bahasa Indonesia (`/materi/`, `/belajar/` via `learn`, `/kuis/` via `quiz`). Sidebar label "Bahan Ajar" mengarah ke `/learn/`.
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
