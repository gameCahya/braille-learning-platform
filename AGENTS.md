# AGENTS.md

Proyek: **Bralingo** — Platform pembelajaran Braille untuk siswa tunanetra SMPLB.

File ini diupdate manual di akhir setiap sesi.

---

## ✅ Sesi Terakhir (26 Jun 2026 — Sesi 7)

**Periode:** 26 Jun 2026 (1 commit: 94b27ed; 24 file)

### Fitur Baru
- **Pre/Post Test Kelas VIII & IX** — menambahkan 11 modul baru ke sistem pre/post test yang sudah ada
- **Filter grade level** — halaman `/prepost-test` hanya menampilkan modul sesuai `grade_level` siswa
- **Loading state guard** — skeleton loading tampil sampai grade level diketahui (cegah flash semua modul)
- **Grade fallback** — siswa tanpa grade_level melihat pesan "Grade level tidak tersedia"

### Modul Baru
**Kelas VIII (4 modul):**
| Module ID | Title |
|-----------|-------|
| giving-information | Giving Information |
| daily-activities | Daily Activities |
| hobbies | Hobbies |
| asking-giving-directions | Asking and Giving Directions |

**Kelas IX (7 modul):**
| Module ID | Title |
|-----------|-------|
| descriptive-text | Descriptive Text |
| functional-text | Functional Text |
| recount-text | Recount Text |
| tenses | Simple Present, Past & Future |
| directions-public-places | Asking Directions & Public Places |
| shopping-foods | Shopping & Foods |
| procedure-text | Procedure Text |

### Perubahan Arsitektur
- Tipe baru: `PrePostTestData.gradeLevel?: "7" | "8" | "9"` di `types/index.ts`
- 11 file data baru di `lib/data/pre-post-tests/` (masing-masing 5 MCQ + 5 Essay, maxScore=75)
- 9 file existing ditambahi `gradeLevel: "7"`
- Filter grade di `app/(dashboard)/prepost-test/page.tsx` — state `gradeLoaded` + `gradeLevel`
- Test: 354 passing (233 baru untuk validasi data integrity)

### Catatan Penting
- Data soal dari dokumen `instrument pre dan post test kelas VIII dan IX smp lb.docx`
- Setiap modul: 5 pilihan ganda (5pts each) + 5 isian singkat (exact 10, partial 5, salah 0)
- Semua jawaban essay di-lowercase dan multi-keyword untuk akomodasi variasi jawaban

---

## ✅ Sesi 6 (26 Jun 2026 — Sesi 6 sebelumnya)

**Periode:** 26 Jun 2026 (1 commit: e073a37; 29 file)

### Fitur Baru
- **Guru buat akun siswa** — guru bisa membuat akun login untuk siswa (email + password) dari form tambah siswa
- **Auto-approve** — student buatan guru langsung `status='approved'` (guru sudah terverifikasi admin)
- **Akun untuk siswa existing** — dialog "Buat Akun" di tabel siswa untuk yang belum punya login
- **Kolom status akun** — badge "Ada"/"Tidak" di tabel siswa + tombol UserPlus
- **Conditional form** — checkbox "Buatkan akun login" + field email/password/confirm (muncul jika dicentang)
- **Warning edit** — jika siswa sudah punya akun, email tidak bisa diubah (read-only + banner warning)
- **Delete aman** — hapus siswa dengan akun juga hapus profile + auth user (manual, no CASCADE)

### Perubahan Arsitektur
- Migration baru: `supabase/migrations/20260626000001_add_student_login.sql` (has_login, auth_user_id)
- Client baru: `lib/supabase/admin.ts` — service_role client untuk admin auth API
- Component baru: `components/ui/checkbox.tsx` — shadcn/ui Checkbox
- Type update: `types/supabase.ts` — tambah has_login, auth_user_id di students Row/Insert/Update
- 3 fungsi server action baru: `createStudentWithAuth`, `createAuthForExistingStudent`, update `deleteStudent`
- Unit test: 15 test untuk validasi schema conditional

### Catatan Penting
- **SECRET_SUPABASE_KEY** perlu ditambahkan di `.env.local` — ambil dari Supabase Dashboard → Settings → API (service_role key)
- Migration sudah di-apply via `supabase db query --linked`
- Trigger `handle_new_user()` akan fire saat `admin.createUser()`, tapi kita pakai `upsert` on conflict untuk amankan profile
- Untuk operasi profile (insert/update/delete) selalu pakai `createAdminClient()` (service_role) karena RLS mencegah akses antar user

---

## ✅ Sesi 5 (26 Jun 2026 — Sesi 5)

**Periode:** 26 Jun 2026 (2 commits: 6ca6aa7, 756f2d3; 34 file)

### Fitur Baru
- **Pre/Post Test System** — sistem pre-test dan post-test untuk 9 modul Kelas VII
- **Test runner** — MCQ clickable cards + essay textarea dengan navigasi prev/next
- **Scoring otomatis** — MCQ exact match 5pts, essay exact 10 / partial 5 / salah 0
- **Halaman hasil** — perbandingan pre vs post dengan grafik (recharts) dan export CSV
- **Review essay** — halaman guru untuk review jawaban essay (Benar/Cukup/Salah)
- **Laporan kelas** — tab Pre/Post Test di halaman /reports dengan statistik kelas
- **Unit testing** — setup Vitest + 121 test untuk scoring, kategori, validasi data
- **Sidebar** — link "Pre/Post Test" untuk guru dan siswa

### Perubahan Arsitektur
- Migration baru: `supabase/migrations/20260626000000_add_pre_post_results.sql`
- Tipe baru di `types/index.ts`: `PrePostTestData`, `PrePostQuestion`, `PrePostAnswer`, `PrePostEssayResult`
- Data soal statis: `lib/data/pre-post-tests/` — 9 file modul + index.ts + scoring.ts
- Route baru: `/prepost-test/`, `/prepost-test/[moduleId]/[testType]`, `/prepost-test/[moduleId]/results`, `/prepost-test/review`
- Setup testing: `vitest.config.ts`, `vitest.setup.ts`, `tests/unit/*.test.ts`

### Perbaikan
- Tidak ada perbaikan — sesi full fitur baru

---

## ⏳ Pending Issues (dari sesi sebelumnya)

- Belum ada automated E2E tests (Playwright)
- Belum ada fitur export raport PDF/Excel (CSV untuk pre/post test sudah ada)
- Belum ada sistem caching
- Migrasi belum via `supabase db push`
- Tutorial Driver.js belum mencakup halaman `/materi/` (sudah ada materi-steps.ts)

---

## ✅ Sesi 4 (02 Jun 2026)

**Periode:** 02 Jun 2026 (belum commit; ~18 file modified)

### Fitur Baru
_(tidak ada fitur baru — sesi full aksesibilitas audit + fix)_

### Perbaikan — Audit & Fix Aksesibilitas Seluruh Aplikasi

**Batch 1 — Login & Register:**
- `app/(auth)/layout.tsx`: Hapus duplicate `<main>`, skip link diterjemahkan ke Indonesia, ganti target `#main-content` → `#auth-content`
- `app/(auth)/login/page.tsx`: `aria-required` pada semua input, server error summary dengan `role="alert"` + auto-fokus, `<fieldset>` grouping, semua ID diprefix (`login-*`)
- `app/(auth)/register/page.tsx`: Role selector dirombak jadi proper radio group (`role="radiogroup"` + `aria-checked` + keyboard Arrow nav), `aria-required` pada semua input, conditional `aria-describedby` pada password, `aria-hidden` pada ikon confirmPassword, `aria-live` untuk gradeLevel dinamis, `<fieldset>` grouping per section, semua ID diprefix (`register-*`)

**Batch 2 — Halaman Publik & Admin:**
- `app/menunggu-persetujuan/page.tsx`: Tambah `<main>` landmark, `aria-hidden` pada Clock/Mail/MessageCircle, `aria-label` pada link WhatsApp eksternal
- `app/ditolak/page.tsx`: Tambah `<main>` landmark, `aria-hidden` pada XCircle
- `app/admin/layout.tsx`: Skip-to-content link + `tabIndex={-1}` pada `<main>`, `aria-hidden` ShieldCheck, `aria-label` pada header
- `app/admin/page.tsx`: `aria-hidden` pada 6 ikon stat card, `aria-label` pada section statistik + value
- `app/admin/_components/UserTabs.tsx`: `aria-hidden` UserCheck empty state, `aria-label` pada TabsList & tabel
- `app/admin/_components/UserActionButtons.tsx`: `aria-hidden` pada Check/X/Loader2, `aria-label` pada tombol & select

**Batch 3 — Dashboard Components:**
- `components/dashboard/DashboardHeader.tsx`: `aria-label` pada mobile menu button & avatar trigger, `aria-hidden` pada Menu/Settings/LogOut, judul header dinamis (Dashboard Guru/Siswa)
- `components/SignOutButton.tsx`: `aria-hidden` pada LogOut, `aria-label` pada button
- `components/braille/BrailleCharCard.tsx`: `aria-hidden` pada Volume2

**Batch 4 — Halaman Konten:**
- `app/(dashboard)/converter/page.tsx`: `aria-hidden` pada semua ikon, `aria-label` pada clear button + textarea + contoh, semua UI teks diterjemahkan ke Indonesia (sebelumnya Inggris)
- `app/(dashboard)/practice/_components/PracticeClient.tsx`: `aria-hidden` pada semua ikon, semua UI teks diterjemahkan ke Indonesia
- `app/(dashboard)/quiz/[id]/_components/QuizPresenter.tsx`: `aria-hidden` pada semua ikon, progress bar pakai `role="progressbar"` + `aria-valuenow/min/max`, `aria-label` pada tombol nav & opsi
- `app/(dashboard)/braille-reference/page.tsx`: Indikator simbol Braille pakai `role="img"` + `aria-label`
- `app/(dashboard)/quiz/page.tsx`: `aria-hidden` pada ClipboardList & ChevronRight
- `app/(dashboard)/classrooms/page.tsx`: `aria-hidden` pada Plus
- `app/(dashboard)/students/page.tsx`: `aria-hidden` pada Plus
- `app/(dashboard)/entertain/page.tsx`: `aria-hidden` pada Music

### Prinsip Aksesibilitas yang Diterapkan di Seluruh App
- ✅ Setiap halaman punya tepat 1 `<main>` landmark
- ✅ Semua layout punya skip-to-content link (Bahasa Indonesia)
- ✅ Semua ikon dekoratif lucide-react diberi `aria-hidden="true"`
- ✅ Semua input/tombol tanpa teks punya `aria-label`
- ✅ Semua input required punya `aria-required="true"`
- ✅ Error message menggunakan `role="alert"` + auto-fokus
- ✅ Dynamic content menggunakan `aria-live` region
- ✅ Semua teks UI konsisten Bahasa Indonesia
- ✅ Progress bar menggunakan `role="progressbar"` + `aria-valuenow`

### Belum Selesai (masih dari sesi sebelumnya)
- Perlu commit semua perubahan a11y ini
- Belum ada automated tests (Vitest + Playwright)
- Belum ada halaman help/docs untuk guru
- Belum ada fitur edit siswa di halaman students
- Belum ada fitur export raport (PDF/Excel)
- Tutorial Driver.js belum mencakup halaman `/materi/`
- Belum ada validasi unique untuk nama modul per guru
- Belum ada sistem caching
- Migrasi belum via `supabase db push`

---

## ✅ Sesi 3 (01 Jun 2026)

**Periode:** 01 Jun 2026 (1 commit: dc73378; 3 file uncommitted)

### Fitur Baru
- **Daily notes** — template dan command daily note di `.opencode/templates/daily.md` + `.opencode/commands/daily.md`, daily note pertama di `docs-braille/daily/2026-06-01.md`
- **`@vercel/next-browser` skill** — experimental agent devtools: inspek component tree, props, hooks, screenshot, network, errors dari terminal (Next.js 16.2+ feature, tapi bekerja di 16.1.1 untuk fitur non-PPR)

### Perbaikan
- **Aksesibilitas form login** — tambah `<label>` + `id` pada input email/password, `aria-hidden` pada ikon Eye/EyeOff, `aria-live` region untuk status loading (`login/page.tsx`)
- **Aksesibilitas form register** — tambah `<label>` + `id` pada 6 input + `aria-hidden` pada ikon Eye/EyeOff (`register/page.tsx`)
- **Aksesibilitas dashboard** — tambah `aria-hidden` pada ikon dekoratif, ganti `as string` cast dengan type guard, rename `Icon` → `ActionIcon`, ganti `<p>` → `<span>` dalam `<Link>` (`page.tsx`)
- **Indentasi login page** — perbaiki indentasi tidak konsisten di section email
- **Redirect error check** — investigasi `isRedirectError()`, tidak tersedia di Next.js 16.1.1; tetap pakai pola `error.message === "NEXT_REDIRECT"`

### Perubahan Arsitektur
- Rename `docs/` → `docs-braille/` — update `.gitignore`, `.opencode/commands/daily.md`
- Install `@vercel/next-browser` 0.7.1 global via pnpm

---

## ✅ Sesi 2 (28 Mei 2026)

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
- **next-browser:** `@vercel/next-browser` 0.7.1 terinstall global. Command: `next-browser tree`, `tree <id>`, `screenshot`, `snapshot`, `network`, `errors`. Butuh `pnpm dev` berjalan.
- **Aksesibilitas:** Semua halaman sudah diaudit dan difix (02 Jun 2026). Patuhi prinsip: 1 `<main>` per halaman, `aria-hidden` pada ikon dekoratif, `aria-label` pada elemen tanpa teks, `aria-required` pada input wajib, error pakai `role="alert"`, skip-link di setiap layout.
- **DashboardHeader role:** Komponen `DashboardHeader` sekarang menerima `profile.role` untuk menampilkan judul "Dashboard Guru" atau "Dashboard Siswa". Dashboard layout harus melempar `role` dari query profile.

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
- **Belum commit** perubahan aksesibilitas sesi 4 (02 Jun 2026) — ~18 file modified
