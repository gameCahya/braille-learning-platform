ALTER TABLE public.teacher_modules
  ADD COLUMN IF NOT EXISTS target_grade text
  CHECK (target_grade IN ('VII', 'VIII', 'IX'));
