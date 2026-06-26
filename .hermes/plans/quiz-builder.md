# Quiz Builder — Implementation Plan

> **Untuk:** Febri — Bralingo project
> **Goal:** Guru (termasuk tunanetra) bisa membuat, mengedit, dan menghapus quiz sendiri via form yang fully accessible dengan screen reader.
> **Architecture:** Ikuti pola CRUD `/materi` yang sudah ada — migration → server actions → React Hook Form + Zod → halaman Next.js App Router. Quiz statis tetap ada di `lib/data/quiz.ts`, quiz guru disimpan di tabel baru `teacher_quizzes`.
> **Stack:** Next.js 16, Supabase, React Hook Form + Zod, shadcn/ui, TypeScript

---

## Task 1: Buat migration tabel `teacher_quizzes`

**Files:**
- Create: `supabase/migrations/20260603000000_add_teacher_quizzes.sql`

**SQL:**
```sql
-- Tabel quiz buatan guru
CREATE TABLE IF NOT EXISTS public.teacher_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  topic text NOT NULL DEFAULT 'Umum',
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_quizzes ENABLE ROW LEVEL SECURITY;

-- Guru bisa CRUD quiz milik sendiri
CREATE POLICY "teachers_manage_own_quizzes"
  ON public.teacher_quizzes
  FOR ALL
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Siswa bisa lihat quiz yang sudah diterbitkan
CREATE POLICY "students_view_published_quizzes"
  ON public.teacher_quizzes
  FOR SELECT
  USING (is_published = true);
```

**Verifikasi:** File tersimpan di `supabase/migrations/`, siap di-push.

---

## Task 2: Update types

**Files:**
- Modify: `types/index.ts`

**Changes:** Tambah di bagian Database types:
```ts
export type TeacherQuizRow = Tables<"teacher_quizzes">;

export interface TeacherQuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface TeacherQuiz extends Omit<TeacherQuizRow, "questions"> {
  questions: TeacherQuizQuestion[];
}
```

**Verifikasi:** Tidak ada TypeScript error.

---

## Task 3: Buat server actions

**Files:**
- Create: `app/(dashboard)/quiz/_actions/quiz-actions.ts`

**Fungsi:**
1. `createTeacherQuiz(data)` — validasi Zod, insert ke `teacher_quizzes`, revalidate
2. `updateTeacherQuiz(id, data)` — validasi Zod, update, revalidate
3. `deleteTeacherQuiz(id)` — delete, revalidate

**Schema Zod:**
```ts
const questionSchema = z.object({
  id: z.number(),
  question: z.string().min(1, "Soal wajib diisi"),
  options: z.array(z.string().min(1, "Opsi tidak boleh kosong")).min(2, "Minimal 2 opsi"),
  answer: z.string().min(1, "Jawaban wajib diisi"),
});

const quizSchema = z.object({
  title: z.string().min(1, "Judul quiz wajib diisi"),
  description: z.string().optional(),
  topic: z.string().min(1, "Topik wajib diisi"),
  is_published: z.boolean().default(false),
  questions: z.array(questionSchema).min(1, "Minimal satu soal"),
});
```

**Verifikasi:** TypeScript check sukses, import berfungsi.

---

## Task 4: Buat QuizForm component

**Files:**
- Create: `app/(dashboard)/quiz/_components/QuizForm.tsx`

**Komponen client dengan fitur:**
- React Hook Form + Zod validation
- Field: judul, deskripsi, topik, is_published (Switch)
- Dynamic questions: `useFieldArray` — tombol "Tambah Soal" / "Hapus Soal"
- Setiap soal: input pertanyaan, 4 opsi jawaban dinamis, pilih jawaban benar via radio button
- Full aksesibilitas: `<label htmlFor>`, `aria-required`, `aria-describedby`, `role="alert"` error
- Support mode create & edit (props `quiz?: TeacherQuiz`)
- Indikator nomor soal untuk screen reader
- Tactile 3D submit button

**Verifikasi:** Form bisa diisi dan divalidasi, keyboard navigasi lancar.

---

## Task 5: Buat halaman `/quiz/new`

**Files:**
- Create: `app/(dashboard)/quiz/new/page.tsx`

**Pattern:** Ikuti `app/(dashboard)/materi/new/page.tsx`
- Server component, cek auth + role teacher
- Judul + deskripsi
- Render `<QuizForm />`

**Verifikasi:** Halaman bisa diakses via `/quiz/new`, form muncul.

---

## Task 6: Buat halaman `/quiz/[id]/edit`

**Files:**
- Create: `app/(dashboard)/quiz/[id]/edit/page.tsx`

**Pattern:** Mirip `/materi/[id]/edit/page.tsx`
- Server component, fetch quiz dari `teacher_quizzes`
- Render `<QuizForm quiz={quiz} />` dengan data existing

**Verifikasi:** Bisa edit quiz yang sudah ada.

---

## Task 7: Update halaman `/quiz` (daftar quiz)

**Files:**
- Modify: `app/(dashboard)/quiz/page.tsx`

**Changes:**
- Fetch quiz guru dari `teacher_quizzes` (untuk guru)
- Tampilkan 2 section: "Quiz Standar" (statis) + "Quiz Saya" (guru, dengan tombol tambah/edit/hapus)
- Tombol "Buat Quiz Baru" di header untuk guru
- Quiz guru yang belum published tampil dengan badge "Draft"
- Tombol hapus dengan konfirmasi (AlertDialog, bukan `confirm()`)

**Verifikasi:** Guru lihat quiz-nya sendiri, bisa akses tambah/edit/hapus.

---

## Task 8: Update `/quiz/[id]` (detail quiz)

**Files:**
- Modify: `app/(dashboard)/quiz/[id]/page.tsx`

**Changes:**
- Cek dulu di `lib/data/quiz.ts` (static), kalau tidak ada → cek di `teacher_quizzes`
- Quiz guru: fetch dari DB, convert ke format `Quiz`, render `QuizPresenter`
- Tambah link "Edit Quiz" untuk quiz milik guru sendiri
- `notFound()` kalau tidak ditemukan

**Verifikasi:** Quiz guru bisa dibuka dan ditampilkan di QuizPresenter.

---

## Task 9: Build check + aksesibilitas test

- `pnpm build` — pastikan semua route terkompilasi
- Navigasi screen reader: buka `/quiz/new`, isi form, submit
- Verifikasi: semua field bisa diakses keyboard + screen reader
- Verifikasi: flow create → edit → delete berfungsi

---

## Estimasi Total: 9 task, ~2-3 sesi

| # | Task | Estimasi |
|---|---|---|
| 1 | Migration | 5 menit |
| 2 | Types | 5 menit |
| 3 | Server actions | 20 menit |
| 4 | QuizForm component | 40 menit |
| 5 | `/quiz/new` page | 10 menit |
| 6 | `/quiz/[id]/edit` page | 10 menit |
| 7 | Update `/quiz` list page | 20 menit |
| 8 | Update `/quiz/[id]` detail page | 15 menit |
| 9 | Build + a11y test | 10 menit |
