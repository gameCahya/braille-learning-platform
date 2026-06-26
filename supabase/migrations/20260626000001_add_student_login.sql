-- Tambah kolom tracking akun login di tabel students
-- auth_user_id: referensi manual ke auth.users.id (bukan FK — Supabase tidak izinkan)
-- has_login: flag cepat untuk cek status tanpa JOIN

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS has_login boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auth_user_id uuid;

CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON public.students (auth_user_id);
