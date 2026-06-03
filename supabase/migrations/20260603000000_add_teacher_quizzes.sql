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
