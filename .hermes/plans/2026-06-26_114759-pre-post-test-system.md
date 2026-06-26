# Pre/Post Test System — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Membangun sistem pre-test dan post-test untuk 9 modul Kelas VII, dengan soal tetap (bukan buatan guru), scoring otomatis, perbandingan pre vs post, dan laporan hasil.

**Architecture:**
- Soal disimpan sebagai data statis di `lib/data/pre-post-tests/` (mirip pola `lib/data/quiz.ts`)
- Hasil ujian disimpan di tabel baru `pre_post_results` di database
- Halaman pre-test/post-test sebagai route baru `/prepost-test/`
- Reuse komponen QuizPresenter yang sudah ada, dengan modifikasi untuk input jawaban + penilaian otomatis
- Tipe essay (isian singkat) menggunakan input teks, dinilai semi-otomatis (exact match → 10, partial → 5, review guru)
- Grade level siswa diambil dari tabel `students.grade_level` (atau kolom terkait)
- Guru bisa lihat hasil semua siswa di kelasnya; siswa hanya lihat hasil sendiri
- Semua jawaban essay di data statis disimpan dalam lowercase+trim untuk scoring konsisten

**Tech Stack:** Next.js 16 App Router, Supabase, TailwindCSS, shadcn/ui, Zod

---

## Dokumen Referensi

Soal pre/post test ada di: `docs-braille/soal pre dan pos test kelas VII.docx`

9 modul dengan soal masing-masing 10 (5 PG + 5 isian):
1. **Greetings and Leave Taking** — greeting, leave taking expressions
2. **Introducing Yourself** — self-introduction, identity
3. **Family Members** — family vocabulary, relationships
4. **Numbers, Days, and Months** — numbers, days, months
5. **Telling Time** — time expressions
6. **School Things and Classroom Objects** — school objects
7. **Colors, Animals, and Fruits** — colors, animals, fruits
8. **Simple Instructions** — classroom instructions
9. **Simple Present Tense (Dasar)** — present tense dasar

Setiap instrumen memiliki:
- 5 soal pilihan ganda (5pts each = max 25)
- 5 soal isian singkat (10pts each = max 50)
- Total max = 75, dikonversi ke skala 100: `nilai = (skor / 75) * 100`
- Kategori: Sangat Tinggi (>75), Tinggi (58-75), Sedang (42-58), Rendah (25-42), Sangat Rendah (<25)

---

## Task 1: Migration Database — `pre_post_results`

**Objective:** Buat tabel untuk menyimpan hasil pre-test dan post-test siswa.

**Files:**
- Create: `supabase/migrations/20260626000000_add_pre_post_results.sql`
- Modify: `types/index.ts`

**Asumsi relasi:**
- Setiap siswa di tabel `students` punya `teacher_id` (foreign key ke `profiles.id`). Jadi teacher bisa insert hasil untuk siswa di kelasnya.
- `module_id` bertipe `text`, bukan foreign key ke tabel modul, karena data soal statis (tidak ada tabel database untuk modul pre/post test). Tradeoff: fleksibel, tidak ada constraint referensial.

**Isi migration:**

```sql
-- Tabel hasil pre-test dan post-test
-- Setiap siswa punya teacher_id dari tabel students
-- module_id: string key untuk look up data soal statis (misal "greetings")
CREATE TABLE IF NOT EXISTS public.pre_post_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,           -- misal "greetings", "introducing", dll (no FK — data statis)
  test_type text NOT NULL CHECK (test_type IN ('pre', 'post')),
  attempt integer NOT NULL DEFAULT 1 CHECK (attempt > 0),  -- untuk mekanisme ulang test
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 75),
  score_normalized integer NOT NULL DEFAULT 0 CHECK (score_normalized >= 0 AND score_normalized <= 100),
  mcq_score integer NOT NULL DEFAULT 0 CHECK (mcq_score >= 0 AND mcq_score <= 25),
  essay_score integer NOT NULL DEFAULT 0 CHECK (essay_score >= 0 AND essay_score <= 50),
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{questionId, question, userAnswer, correctAnswer, isCorrect}]
  essay_results jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{questionId, question, userAnswer, acceptedAnswers: string[], score: 0|5|10}]
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending_review')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, module_id, test_type, attempt)
);

ALTER TABLE public.pre_post_results ENABLE ROW LEVEL SECURITY;

-- Guru bisa lihat hasil siswa di kelasnya
CREATE POLICY "teachers_view_own_students_results"
  ON public.pre_post_results
  FOR SELECT
  USING (teacher_id = auth.uid());

-- Siswa bisa lihat hasil milik sendiri
-- Join melalui students → profiles (email matching untuk auth.uid())
CREATE POLICY "students_view_own_results"
  ON public.pre_post_results
  FOR SELECT
  USING (student_id IN (
    SELECT id FROM public.students WHERE teacher_id IN (
      SELECT id FROM public.profiles WHERE id = auth.uid()
    )
  ));

-- Guru bisa insert hasil untuk siswa di kelasnya
CREATE POLICY "teachers_insert_results"
  ON public.pre_post_results
  FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

-- Guru bisa update hasil (untuk review essay)
CREATE POLICY "teachers_update_results"
  ON public.pre_post_results
  FOR UPDATE
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE INDEX idx_pre_post_results_student ON public.pre_post_results (student_id);
CREATE INDEX idx_pre_post_results_teacher ON public.pre_post_results (teacher_id);
CREATE INDEX idx_pre_post_results_module ON public.pre_post_results (module_id);
```

**Catatan tentang `students_view_own_results`:**
Policy di atas menggunakan pendekatan sederhana — siswa dari teacher yang sama dengan auth user bisa melihat. Jika ada mekanisme auth yang lebih spesifik (email matching), sesuaikan implementasinya. Alternatif: gunakan `auth.uid()` langsung jika ada kolom `user_id` di tabel `students`.

**Catatan tentang kolom `attempt`:**
Kolom `attempt` memungkinkan siswa mengulang test (misal post-test ke-2). Unique constraint mencakup `attempt`. Default 1. Guru bisa reset dengan insert attempt baru. Tidak menghapus record lama sehingga history tetap ada.

**Tambahkan di `types/index.ts`:**

```ts
// =============================================
// Pre/Post Test types
// =============================================

export interface PrePostAnswer {
  questionId: number;
  question: string;
  questionType: "mcq" | "essay";
  userAnswer: string | null;
  correctAnswer: string | string[];
  isCorrect: boolean | null;  // null untuk essay yang belum direview
}

export interface PrePostEssayResult {
  questionId: number;
  question: string;
  userAnswer: string;
  acceptedAnswers: string[];
  score: 0 | 5 | 10;
}

export interface PrePostQuestion {
  id: number;
  question: string;
  type: "mcq" | "essay";
  options?: string[];       // untuk mcq
  answer: string | string[]; // string untuk mcq, string[] untuk essay (multiple accepted answers, sudah lowercase+trim)
}

export interface PrePostTestData {
  moduleId: string;
  moduleTitle: string;
  material: string;
  questions: PrePostQuestion[];
  maxScore: number;     // 75
  mcqCount: number;     // 5
  essayCount: number;   // 5
  mcqMaxScore: number;  // 25
  essayMaxScore: number; // 50
}
```

**Verifikasi:**
1. Migration jalan tanpa error
2. Tipe baru bisa di-import di komponen
3. Policy SELECT untuk siswa berfungsi (siswa hanya lihat hasil sendiri)

---

## Task 2: Data Soal Statis — 9 Modul Pre/Post Test

**Objective:** Buat file data statis berisi semua soal dari docx, terstruktur sebagai `PrePostTestData[]`.

**Files:**
- Create: `lib/data/pre-post-tests/greetings.ts`
- Create: `lib/data/pre-post-tests/introducing.ts`
- Create: `lib/data/pre-post-tests/family.ts`
- Create: `lib/data/pre-post-tests/numbers-days-months.ts`
- Create: `lib/data/pre-post-tests/telling-time.ts`
- Create: `lib/data/pre-post-tests/school-things.ts`
- Create: `lib/data/pre-post-tests/colors-animals-fruits.ts`
- Create: `lib/data/pre-post-tests/simple-instructions.ts`
- Create: `lib/data/pre-post-tests/simple-present.ts`
- Create: `lib/data/pre-post-tests/index.ts` (re-export + helper functions + validasi)

**Aturan konversi dari docx ke TS:**
1. MCQ: `answer` adalah string (satu jawaban benar, ambil dari kunci jawaban)
2. Essay: `answer` adalah string[] dari semua variasi jawaban yang diterima di kunci jawaban
3. Semua jawaban essay disimpan dalam lowercase+trim untuk konsistensi scoring
4. `mcqCount` dan `essayCount` harus sesuai dengan jumlah soal sebenarnya (validasi di `index.ts`)

**Pola setiap file:**

```ts
// lib/data/pre-post-tests/greetings.ts
import type { PrePostTestData } from "@/types";

export const greetingsTest: PrePostTestData = {
  moduleId: "greetings",
  moduleTitle: "Greetings and Leave Taking",
  material: "Ungkapan salam dan perpisahan",
  maxScore: 75,
  mcqCount: 5,
  essayCount: 5,
  mcqMaxScore: 25,
  essayMaxScore: 50,
  questions: [
    // MCQ (id 1-5)
    {
      id: 1,
      question: "Ketika bertemu teman pada pagi hari, kita mengucapkan ....",
      type: "mcq",
      options: ["Good morning", "Good night", "Good bye"],
      answer: "Good morning",
    },
    // ... (soal 2-5 dari docx)
    // Essay (id 6-10) — semua answer sudah lowercase untuk konsistensi scoring
    {
      id: 6,
      question: 'Tuliskan ungkapan bahasa Inggris untuk "Selamat pagi"!',
      type: "essay",
      answer: ["good morning"],
    },
    // ... (soal 7-10 dari docx)
  ],
};
```

**Helper di index.ts dengan validasi:**

```ts
import { greetingsTest } from "./greetings";
// ... imports ...

export const prePostTests: PrePostTestData[] = [
  greetingsTest,
  introducingTest,
  // ... semua 9 modul
];

// Validasi dev: pastikan jumlah soal sesuai deklarasi
if (process.env.NODE_ENV === "development") {
  for (const test of prePostTests) {
    const mcqActual = test.questions.filter((q) => q.type === "mcq").length;
    const essayActual = test.questions.filter((q) => q.type === "essay").length;
    if (mcqActual !== test.mcqCount) {
      console.warn(`[PrePostTest] ${test.moduleId}: mcqCount=${test.mcqCount} tapi ada ${mcqActual} soal MCQ`);
    }
    if (essayActual !== test.essayCount) {
      console.warn(`[PrePostTest] ${test.moduleId}: essayCount=${test.essayCount} tapi ada ${essayActual} soal essay`);
    }
  }
}

export function getPrePostTest(moduleId: string): PrePostTestData | undefined {
  return prePostTests.find((t) => t.moduleId === moduleId);
}
```

**Verifikasi:**
1. Semua 9 modul tercakup dengan all 10 soal
2. Jawaban cocok dengan kunci jawaban di docx (termasuk multiple accepted answers untuk essay)
3. `getPrePostTest("greetings")` mengembalikan data yang benar
4. Tidak ada warning validasi di dev console

---

## Task 3: Halaman Daftar Pre/Post Test

**Objective:** Halaman `/prepost-test/` yang menampilkan daftar modul, status pre/post test siswa (sudah/belum), dan tombol mulai.

**Files:**
- Create: `app/(dashboard)/prepost-test/page.tsx`

**Data fetching untuk status pre/post:**

```ts
// Server component — query status pre/post untuk siswa yang sedang login
// Untuk siswa: cari student_id dari tabel students berdasarkan auth user
// Query example:
const { data: student } = await supabase
  .from("students")
  .select("id, grade_level")
  .eq("teacher_id", user.id) // atau filter berdasarkan auth
  .single();

// Ambil semua hasil pre/post untuk siswa ini
const { data: results } = await supabase
  .from("pre_post_results")
  .select("module_id, test_type, score, score_normalized")
  .eq("student_id", student.id);

// Build map: { [moduleId]: { pre: {score, ...}?, post: {score, ...}? } }
```

**Grade level filtering untuk siswa:**
- Grade level siswa diambil dari kolom `grade_level` di tabel `students`
- Filter modul: tampilkan hanya modul Kelas VII (karena soal docx khusus Kelas VII)
- Untuk pengembangan ke depan: filter berdasarkan grade jika ada data modul untuk kelas lain

**Halaman ini:**
1. Menampilkan grid 9 kartu modul (khusus Kelas VII untuk saat ini)
2. Setiap kartu menunjukkan: nama modul, status Pre (Belum/Selesai), status Post (Belum/Selesai), skor jika sudah
3. Tombol "Kerjakan Pre-Test" / "Kerjakan Post-Test" / "Lihat Hasil"
4. Untuk siswa: hanya bisa melihat modul yang sesuai grade level-nya
5. Untuk guru: bisa melihat hasil semua siswa (dropdown pilih siswa) + grafik kelas

**UI:**
```
┌─────────────────────────────────────────────┐
│  Pre-Test & Post-Test                        │
│  Ukur kemampuan sebelum dan sesudah belajar  │
├─────────────────────────────────────────────┤
│ ┌── Modul 1 ──┐  ┌── Modul 2 ──┐  ...       │
│ │ Greetings   │  │ Introducing │            │
│ │ Pre: ✅ 60  │  │ Pre: ❌     │            │
│ │ Post: ✅ 75 │  │ Post: ❌    │            │
│ │ [Hasil]     │  │ [Mulai Pre] │            │
│ └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────┘
```

**Verifikasi:**
1. Halaman render tanpa error
2. Data dari Supabase (hasil siswa) muncul dengan benar
3. Tombol navigasi mengarah ke route yang tepat
4. Siswa hanya melihat modul sesuai grade level

---

## Task 4: Halaman Pelaksanaan Test

**Objective:** Halaman `/prepost-test/[moduleId]/[testType]` untuk mengerjakan pre-test atau post-test.

**Files:**
- Create: `app/(dashboard)/prepost-test/[moduleId]/[testType]/page.tsx`
- Create: `app/(dashboard)/prepost-test/[moduleId]/[testType]/_components/TestRunner.tsx`
- Create: `app/(dashboard)/prepost-test/_actions/submit-test.ts`

**TestRunner component:**
1. Menampilkan soal satu per satu dengan navigasi prev/next
2. MCQ: pilih salah satu opsi (radio button / clickable card), bisa diubah sebelum submit
3. Essay: `<textarea>` atau `<input>` untuk jawaban teks
4. Progress bar dengan `role="progressbar"` + `aria-*`
5. Tombol "Kumpulkan" di soal terakhir — dengan konfirmasi (AlertDialog)
6. Setelah submit: hitung nilai otomatis
   - MCQ: exact match jawaban → 5pts per benar, 0 jika salah
   - Essay: scoring sesuai algoritma di bawah
   - Status: "completed" jika semua essay exact match, "pending_review" jika ada essay partial atau 0
7. Simpan ke tabel `pre_post_results`
8. Redirect ke halaman hasil

**Server Action untuk submit:**

```ts
// app/(dashboard)/prepost-test/_actions/submit-test.ts
"use server";

export async function submitPrePostTest(data: {
  studentId: string;
  teacherId: string;
  moduleId: string;
  testType: "pre" | "post";
  answers: PrePostAnswer[];
}) {
  // 1. Validasi — pastikan semua soal terjawab
  if (data.answers.length !== 10) {
    return { success: false, error: "Semua soal harus dijawab." };
  }

  // 2. Ambil data soal dari data statis untuk scoring
  const testData = getPrePostTest(data.moduleId);
  if (!testData) return { success: false, error: "Modul tidak ditemukan." };

  // 3. Hitung skor
  let mcqScore = 0;
  let essayScore = 0;
  let pendingReview = false;

  for (const answer of data.answers) {
    if (answer.questionType === "mcq") {
      // MCQ: exact match case-insensitive
      const isCorrect = answer.userAnswer?.trim().toLowerCase() ===
        String(answer.correctAnswer).trim().toLowerCase();
      answer.isCorrect = isCorrect;
      if (isCorrect) mcqScore += 5;
    } else {
      // Essay: scoring dengan tolerance
      const accepted = answer.correctAnswer as string[];
      const essayResult = scoreEssay(answer.userAnswer || "", accepted);
      essayScore += essayResult.score;
      (answer as any).essayScore = essayResult.score;
      if (essayResult.needsReview) pendingReview = true;
    }
  }

  const totalScore = mcqScore + essayScore;
  const normalizedScore = Math.round((totalScore / 75) * 100);

  // 4. Simpan ke database
  const { error } = await supabase.from("pre_post_results").insert({
    student_id: data.studentId,
    teacher_id: data.teacherId,
    module_id: data.moduleId,
    test_type: data.testType,
    score: totalScore,
    score_normalized: normalizedScore,
    mcq_score: mcqScore,
    essay_score: essayScore,
    answers: data.answers as unknown as Json,
    status: pendingReview ? "pending_review" : "completed",
  });

  // ...
}
```

**Algoritma penskoran essay (lebih baik dari versi awal):**

```ts
/**
 * Score essay answer with partial match tolerance.
 *
 * @returns { score: 0|5|10, needsReview: boolean }
 *   - 10: exact match → completed
 *   - 5: partial match (answer contains accepted keyword of ≥3 chars, atau vice versa) → pending_review
 *   - 0: wrong / empty → pending_review
 */
function scoreEssay(userAnswer: string, acceptedAnswers: string[]): { score: 0 | 5 | 10; needsReview: boolean } {
  const answer = userAnswer.trim().toLowerCase();
  if (!answer) return { score: 0, needsReview: true };

  // Exact match — sempurna
  if (acceptedAnswers.some((a) => a.toLowerCase() === answer)) {
    return { score: 10, needsReview: false };
  }

  // Partial match — cek apakah jawaban mengandung kata kunci (min 3 chars)
  // Filter accepted answers, ambil kata kunci yang meaningful (>= 3 chars)
  const keywords = acceptedAnswers
    .flatMap((a) => a.split(" "))
    .filter((k) => k.length >= 3);

  const hasRelevantKeyword = keywords.some(
    (kw) => answer.includes(kw) || kw.includes(answer)
  );

  if (hasRelevantKeyword) {
    return { score: 5, needsReview: true };
  }

  // Tidak cocok sama sekali
  return { score: 0, needsReview: true };
}
```

**Contoh konkret scoring essay:**
- Jawaban siswa: "good morning" → kunci: ["good morning"] → exact match → 10 ✅
- Jawaban siswa: "morning" → kunci: ["good morning"] → mengandung "morning" (≥3 chars) → partial → 5 ⚠️ (review)
- Jawaban siswa: "hi" → kunci: ["good morning"] → tidak ada keyword ≥3 chars match → 0 ❌ (review)
- Jawaban siswa: "I am from Solo, Indonesia" → kunci: ["i am from solo"] → mengandung "from" (4 chars) → partial → 5 ⚠️ (review — false positive positif, guru koreksi)

**Verifikasi:**
1. Form bisa diisi dan disubmit
2. Skor dihitung dengan benar (cek dengan data sample)
3. Data tersimpan di database
4. Redirect ke halaman hasil setelah submit
5. Status "pending_review" untuk hasil yang perlu review guru

---

## Task 5: Halaman Hasil Test

**Objective:** Halaman `/prepost-test/[moduleId]/results` yang menampilkan hasil pre-test dan post-test.

**Files:**
- Create: `app/(dashboard)/prepost-test/[moduleId]/results/page.tsx`

**Query untuk perbandingan pre vs post:**

```ts
// Ambil hasil pre dan post untuk siswa tertentu di modul tertentu
const { data: results } = await supabase
  .from("pre_post_results")
  .select("*")
  .eq("student_id", studentId)
  .eq("module_id", moduleId)
  .in("test_type", ["pre", "post"])
  .order("test_type", { ascending: true }); // pre dulu, baru post

// Bandingkan answers JSONB untuk lihat perubahan per soal
const preResult = results.find((r) => r.test_type === "pre");
const postResult = results.find((r) => r.test_type === "post");

if (preResult && postResult) {
  // Bandingkan jawaban per soal
  const preAnswers = preResult.answers as PrePostAnswer[];
  const postAnswers = postResult.answers as PrePostAnswer[];
  // Cari: soal yang di pre benar tapi di post salah (menurun), dan sebaliknya (meningkat)
}
```

**Halaman hasil menampilkan:**
1. **Score card:** skor pre, skor post, selisih (peningkatan/penurunan) — dengan warna hijau jika meningkat, merah jika menurun
2. **Kategori:** Sangat Tinggi / Tinggi / Sedang / Rendah / Sangat Rendah (untuk pre dan post)
3. **Perbandingan detail per soal:** tabel yang menunjukkan jawaban siswa di pre vs post, mana yang berubah
4. **Grafik sederhana:** perbandingan pre vs post (bisa pakai recharts — sudah terinstall)
5. **Rekomendasi:** indikator mana yang masih lemah (berdasarkan mapping soal → indikator dari docx)
6. Untuk guru: dropdown pilih siswa, lihat hasil semua siswa di kelas
7. **Export CSV:** tombol download ringkasan hasil (pre score, post score, selisih, normalized)

**Format export CSV:**
```
Nama Siswa, Modul, Pre Score, Post Score, Selisih, Pre Kategori, Post Kategori
Budi, Greetings, 40, 65, +25, Sedang, Tinggi
Ani, Greetings, 55, 70, +15, Sedang, Tinggi
```

**Fungsi kategori (akan dipakai di banyak tempat, jadikan shared utility):**

```ts
// lib/data/pre-post-tests/scoring.ts
export function getCategory(score: number): string {
  if (score > 75) return "Sangat Tinggi";
  if (score >= 58) return "Tinggi";
  if (score >= 42) return "Sedang";
  if (score >= 25) return "Rendah";
  return "Sangat Rendah";
}

export function normalizeScore(rawScore: number, maxScore: number = 75): number {
  return Math.round((rawScore / maxScore) * 100);
}
```

**Verifikasi:**
1. Halaman menampilkan data dengan benar
2. Perbandingan pre vs post akurat
3. Grafik render tanpa error (recharts sudah terinstall)
4. Export CSV berfungsi

---

## Task 6: Sidebar Navigation

**Objective:** Tambah link "Pre/Post Test" di sidebar untuk guru dan siswa.

**Files:**
- Modify: `components/dashboard/DashboardSidebar.tsx`

**Role-based view:**
- Guru: link di section "Konten Pembelajaran", setelah "Quiz & Test"
- Siswa: link di section "Belajar", setelah "Quiz"

```tsx
// Cek dulu ikon mana yang tersedia di lucide-react 0.562.0
// FileCheck mungkin tidak ada; fallback ke ClipboardCheck atau FileText
import { ClipboardCheck } from "lucide-react";

// Di section guru (setelah NavItem quiz):
<NavItem href="/prepost-test" icon={ClipboardCheck} label="Pre/Post Test" />

// Di section siswa (setelah NavItem quiz):
<NavItem href="/prepost-test" icon={ClipboardCheck} label="Pre/Post Test" />
```

**Verifikasi ikon:**
Cek di `node_modules/lucide-react/dist/esm/icons/` apakah `file-check.ts` atau `clipboard-check.ts` tersedia.

```bash
ls node_modules/lucide-react/dist/esm/icons/ | grep -E "file-check|clipboard-check|file-text"
```

**Verifikasi:**
1. Sidebar menampilkan link yang benar untuk guru dan siswa
2. Navigasi ke `/prepost-test/` berfungsi

---

## Task 7: Unit Tests

**Objective:** Tulis unit test untuk fungsi penskoran, kategorisasi, dan helper data.

**Files:**
- Create: `lib/data/pre-post-tests/scoring.ts` (shared utility — scoring + kategori)
- Create: `tests/unit/pre-post-test.test.ts`

**Test cases:**

```ts
import { describe, it, expect } from "vitest";
import { scoreEssay, getCategory, normalizeScore } from "@/lib/data/pre-post-tests/scoring";
import { getPrePostTest } from "@/lib/data/pre-post-tests";

describe("scoreEssay", () => {
  it("exact match → 10, no review needed", () => {
    const result = scoreEssay("good morning", ["good morning"]);
    expect(result.score).toBe(10);
    expect(result.needsReview).toBe(false);
  });

  it("exact match case-insensitive → 10", () => {
    const result = scoreEssay("GOOD MORNING", ["good morning"]);
    expect(result.score).toBe(10);
  });

  it("keyword match (≥3 chars) → 5, needs review", () => {
    const result = scoreEssay("morning", ["good morning"]);
    expect(result.score).toBe(5);
    expect(result.needsReview).toBe(true);
  });

  it("empty answer → 0, needs review", () => {
    const result = scoreEssay("", ["good morning"]);
    expect(result.score).toBe(0);
    expect(result.needsReview).toBe(true);
  });

  it("whitespace-only → 0", () => {
    const result = scoreEssay("   ", ["good morning"]);
    expect(result.score).toBe(0);
  });

  it("irrelevant answer → 0, needs review", () => {
    const result = scoreEssay("hi there", ["good morning"]);
    expect(result.score).toBe(0);
  });

  it("multiple accepted answers — exact match any → 10", () => {
    const result = scoreEssay("see you later", ["goodbye", "see you later", "see you"]);
    expect(result.score).toBe(10);
  });

  it("partial match with short keyword (<3 chars) → 0", () => {
    // "hi" hanya 2 chars, tidak dianggap keyword meaningful
    const result = scoreEssay("hi", ["good morning"]);
    expect(result.score).toBe(0);
  });
});

describe("getCategory", () => {
  it(">75 → Sangat Tinggi", () => {
    expect(getCategory(80)).toBe("Sangat Tinggi");
    expect(getCategory(76)).toBe("Sangat Tinggi");
  });
  it("58-75 → Tinggi", () => {
    expect(getCategory(75)).toBe("Tinggi");
    expect(getCategory(58)).toBe("Tinggi");
    expect(getCategory(60)).toBe("Tinggi");
  });
  it("42-58 → Sedang", () => {
    expect(getCategory(42)).toBe("Sedang");
    expect(getCategory(50)).toBe("Sedang");
  });
  it("25-42 → Rendah", () => {
    expect(getCategory(25)).toBe("Rendah");
    expect(getCategory(30)).toBe("Rendah");
  });
  it("<25 → Sangat Rendah", () => {
    expect(getCategory(0)).toBe("Sangat Rendah");
    expect(getCategory(24)).toBe("Sangat Rendah");
  });
});

describe("normalizeScore", () => {
  it("75 → 100", () => expect(normalizeScore(75)).toBe(100));
  it("37.5 → 50", () => expect(normalizeScore(37.5)).toBe(50));
  it("0 → 0", () => expect(normalizeScore(0)).toBe(0));
});

describe("getPrePostTest", () => {
  it("returns test data for valid moduleId", () => {
    const test = getPrePostTest("greetings");
    expect(test).toBeDefined();
    expect(test!.moduleTitle).toBe("Greetings and Leave Taking");
  });

  it("returns undefined for unknown moduleId", () => {
    expect(getPrePostTest("nonexistent")).toBeUndefined();
  });

  it("all 9 modules have correct question counts", () => {
    const allModules = ["greetings", "introducing", "family", "numbers-days-months",
      "telling-time", "school-things", "colors-animals-fruits", "simple-instructions", "simple-present"];

    for (const modId of allModules) {
      const test = getPrePostTest(modId);
      expect(test).toBeDefined();
      expect(test!.questions).toHaveLength(10);
      expect(test!.questions.filter(q => q.type === "mcq")).toHaveLength(test!.mcqCount);
      expect(test!.questions.filter(q => q.type === "essay")).toHaveLength(test!.essayCount);
    }
  });
});

describe("scoring integration — full test", () => {
  it("5 MCQ benar + 5 essay sempurna = 75", () => {
    // Simulasi
    let mcqScore = 5 * 5; // 25
    let essayScore = 5 * 10; // 50
    expect(mcqScore + essayScore).toBe(75);
    expect(normalizeScore(75)).toBe(100);
  });

  it("3 MCQ benar + 3 essay sempurna + 2 essay partial = 15 + 30 + 10 = 55", () => {
    const mcqScore = 3 * 5; // 15
    const essayScore = (3 * 10) + (2 * 5); // 30 + 10 = 40
    expect(mcqScore + essayScore).toBe(55);
    expect(normalizeScore(55)).toBe(73);
  });
});
```

**Verifikasi:**
1. `pnpm test` — semua test pass (minimal 20 test)
2. Logika scoring mencakup semua edge case

---

## Task 8: Halaman Review Essay untuk Guru

**Objective:** Halaman untuk guru mereview jawaban essay yang statusnya `pending_review`.

**Files:**
- Create: `app/(dashboard)/prepost-test/[moduleId]/[testType]/review/[resultId]/page.tsx`
- Create: `app/(dashboard)/prepost-test/_actions/review-essay.ts` (server action)

**Cara guru menemukan hasil yang perlu review:**

```ts
// Di halaman daftar: tambahkan badge/section untuk hasil pending_review
const { data: pendingResults } = await supabase
  .from("pre_post_results")
  .select("*, students(full_name)")
  .eq("teacher_id", user.id)
  .eq("status", "pending_review");
```

**Fitur halaman review:**
1. Tampilkan daftar hasil yang perlu direview (kartu per siswa + modul + test_type)
2. Klik salah satu → detail: pertanyaan essay + jawaban siswa + kunci jawaban + skor otomatis
3. Guru bisa memilih untuk setiap soal essay: Benar (10pts) / Cukup (5pts) / Salah (0pts)
4. Tombol "Simpan" → panggil server action `reviewEssay`

**Server Action:**

```ts
"use server";

export async function reviewEssay(resultId: string, essayScores: { questionId: number; score: 0 | 5 | 10 }[]) {
  // 1. Ambil result dari DB
  // 2. Update essay_results JSONB dengan skor baru
  // 3. Hitung ulang total essay_score
  // 4. Update score dan score_normalized
  // 5. Jika semua essay sudah direview → status = "completed"
}
```

**Notifikasi (opsional — enhancement):**
- Badge di sidebar guru: "X perlu review" — menggunakan query count `pending_review`
- Bisa ditambahkan di iteration berikutnya

**Verifikasi:**
1. Guru bisa akses halaman review
2. Update score berfungsi
3. Status berubah jadi completed setelah semua direview

---

## Task 9: Laporan Guru — Perbandingan Kelas

**Objective:** Halaman laporan untuk guru melihat perbandingan pre/post test seluruh kelas.

**Files:**
- Modify: `app/(dashboard)/reports/page.tsx` (tambah tab/section baru "Pre/Post Test")

**Fitur:**
1. Dropdown pilih modul (dari 9 modul Kelas VII)
2. Tabel: Nama Siswa | Pre Score | Post Score | Selisih | Kategori Pre | Kategori Post | Status
3. Rata-rata kelas (pre dan post)
4. Jumlah siswa yang meningkat / menurun / tetap
5. Persentase ketuntasan (nilai ≥ 70)
6. Grafik batang perbandingan antar siswa

**Query:**

```ts
// Ambil semua pre dan post results untuk kelas guru
const { data: preResults } = await supabase
  .from("pre_post_results")
  .select("*, students(full_name)")
  .eq("teacher_id", user.id)
  .eq("module_id", selectedModule)
  .eq("test_type", "pre");

const { data: postResults } = await supabase
  .from("pre_post_results")
  .select("*, students(full_name)")
  .eq("teacher_id", user.id)
  .eq("module_id", selectedModule)
  .eq("test_type", "post");

// Gabungkan berdasarkan student_id
```

**Verifikasi:**
1. Data per kelas akurat
2. Perhitungan rata-rata dan persentase benar
3. Grafik render tanpa error

---

## Ringkasan File yang Dibuat/Diubah

| Task | Action | File |
|------|--------|------|
| T1 | Create | `supabase/migrations/20260626000000_add_pre_post_results.sql` |
| T1 | Modify | `types/index.ts` |
| T2 | Create | `lib/data/pre-post-tests/greetings.ts` |
| T2 | Create | `lib/data/pre-post-tests/introducing.ts` |
| T2 | Create | `lib/data/pre-post-tests/family.ts` |
| T2 | Create | `lib/data/pre-post-tests/numbers-days-months.ts` |
| T2 | Create | `lib/data/pre-post-tests/telling-time.ts` |
| T2 | Create | `lib/data/pre-post-tests/school-things.ts` |
| T2 | Create | `lib/data/pre-post-tests/colors-animals-fruits.ts` |
| T2 | Create | `lib/data/pre-post-tests/simple-instructions.ts` |
| T2 | Create | `lib/data/pre-post-tests/simple-present.ts` |
| T2 | Create | `lib/data/pre-post-tests/index.ts` |
| T5, T7 | Create | `lib/data/pre-post-tests/scoring.ts` |
| T3 | Create | `app/(dashboard)/prepost-test/page.tsx` |
| T4 | Create | `app/(dashboard)/prepost-test/[moduleId]/[testType]/page.tsx` |
| T4 | Create | `app/(dashboard)/prepost-test/[moduleId]/[testType]/_components/TestRunner.tsx` |
| T4 | Create | `app/(dashboard)/prepost-test/_actions/submit-test.ts` |
| T5 | Create | `app/(dashboard)/prepost-test/[moduleId]/results/page.tsx` |
| T6 | Modify | `components/dashboard/DashboardSidebar.tsx` |
| T7 | Create | `tests/unit/pre-post-test.test.ts` |
| T8 | Create | `app/(dashboard)/prepost-test/[moduleId]/[testType]/review/[resultId]/page.tsx` |
| T8 | Create | `app/(dashboard)/prepost-test/_actions/review-essay.ts` |
| T9 | Modify | `app/(dashboard)/reports/page.tsx` |

**Total:** ~23 file (15 baru, 3 modify, 2 migration+types, 3 tests+scoring)

---

## Risks & Tradeoffs

1. **Penilaian essay otomatis terbatas** — hanya exact match (10) dan partial keyword ≥3 chars (5). Essay dengan jawaban benar tapi berbeda ekspresi (misal "I am fine, thank you" vs "Fine, thanks") masuk partial → 5 dan perlu review. Sudah sesuai pedoman docx: "jawaban sempurna" (10) vs "cukup tepat" (5).

2. **Akurasi partial match** — false positive mungkin terjadi (contoh: "I am from Solo" mengandung "from" → kena 5 padahal jawaban untuk pertanyaan berbeda). Tradeoff: lebih baik false positive (guru koreksi turunkan) daripada false negative (siswa dirugikan). Keyword minimal 3 chars mengurangi noise.

3. **Tidak ada timer** — pre/post test tidak dibatasi waktu. Siswa tunanetra perlu waktu lebih lama untuk mengakses konten melalui screen reader.

4. **Route `/prepost-test/` baru** — perlu dipastikan tidak bentrok dengan route lain. Cek `app/(dashboard)/` untuk route existing.

5. **Mekanisme ulang test** — kolom `attempt` memungkinkan multiple attempts. Default 1. Guru bisa reset dari UI (insert attempt baru). History tetap ada. Tradeoff: perlu validasi agar siswa tidak spam.

6. **Migration harus di-apply** — perlu `supabase db push` atau apply manual via psql.

7. **Student-to-auth mapping** — policy RLS untuk siswa (`students_view_own_results`) perlu dicek apakah `teacher_id` di tabel `students` cocok dengan `auth.uid()`. Alternatif: tambah kolom `user_id` di `students` jika belum ada.

---

## Verification Checklist

- [ ] Migration berjalan tanpa error (termasuk RLS policies)
- [ ] Semua 9 modul memiliki data soal lengkap (10 soal per modul, jumlah MCQ/essay sesuai)
- [ ] Validasi dev: warning jika mcqCount/essayCount tidak sesuai
- [ ] Test runner menampilkan soal dan menerima input (MCQ clickable, essay text input)
- [ ] MCQ dinilai otomatis dengan benar (exact match case-insensitive)
- [ ] Essay dinilai: exact match → 10, partial keyword → 5, kosong/tidak relevan → 0
- [ ] Skor tersimpan di database dengan status yang benar
- [ ] Halaman hasil menampilkan perbandingan pre vs post
- [ ] Grade level filtering: siswa hanya lihat modul sesuai kelasnya
- [ ] Sidebar menampilkan link yang benar untuk guru dan siswa
- [ ] Unit test passing (minimal 25 test — scoring, kategori, helper, validasi data)
- [ ] Guru bisa review essay yang pending_review
- [ ] Guru bisa lihat laporan perbandingan kelas
- [ ] Export CSV berfungsi
- [ ] Akses siswa: hanya lihat hasil sendiri, tidak bisa lihat data siswa lain
