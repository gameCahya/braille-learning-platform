-- Tabel modul buatan guru
CREATE TABLE IF NOT EXISTS public.teacher_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_number integer NOT NULL DEFAULT 0,
  lessons jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_modules ENABLE ROW LEVEL SECURITY;

-- Guru bisa CRUD modul milik sendiri
CREATE POLICY "teachers_manage_own_modules"
  ON public.teacher_modules
  FOR ALL
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Siswa bisa lihat modul yang sudah diterbitkan dari guru kelasnya
CREATE POLICY "students_view_published_modules"
  ON public.teacher_modules
  FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.classrooms c ON c.id = p.classroom_id
      WHERE p.id = auth.uid()
      AND c.teacher_id = teacher_modules.teacher_id
    )
  );
