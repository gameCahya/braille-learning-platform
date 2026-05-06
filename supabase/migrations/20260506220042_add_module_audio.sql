-- Tabel untuk menyimpan URL audio yang diupload guru per lesson
CREATE TABLE IF NOT EXISTS module_audio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_id, lesson_id)
);

ALTER TABLE module_audio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read module_audio"
  ON module_audio FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert module_audio"
  ON module_audio FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated can update module_audio"
  ON module_audio FOR UPDATE TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated can delete module_audio"
  ON module_audio FOR DELETE TO authenticated
  USING (auth.uid() = uploaded_by);
