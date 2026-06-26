-- Tabel hasil pre-test dan post-test
-- Setiap siswa punya teacher_id dari tabel students
-- module_id: string key untuk lookup data soal statis (misal "greetings")
-- attempt: untuk mekanisme ulang test (default 1)
CREATE TABLE IF NOT EXISTS public.pre_post_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,           -- misal "greetings", "introducing", dll (no FK — data statis)
  test_type text NOT NULL CHECK (test_type IN ('pre', 'post')),
  attempt integer NOT NULL DEFAULT 1 CHECK (attempt > 0),
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 75),
  score_normalized integer NOT NULL DEFAULT 0 CHECK (score_normalized >= 0 AND score_normalized <= 100),
  mcq_score integer NOT NULL DEFAULT 0 CHECK (mcq_score >= 0 AND mcq_score <= 25),
  essay_score integer NOT NULL DEFAULT 0 CHECK (essay_score >= 0 AND essay_score <= 50),
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  essay_results jsonb NOT NULL DEFAULT '[]'::jsonb,
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

-- Siswa bisa lihat hasil milik sendiri (melalui relasi students.teacher_id)
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
