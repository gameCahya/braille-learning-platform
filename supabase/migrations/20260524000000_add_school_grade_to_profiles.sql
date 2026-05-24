ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school_name TEXT,
  ADD COLUMN IF NOT EXISTS grade_level TEXT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_name, grade_level)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher')::public.user_role,
    NEW.raw_user_meta_data->>'school_name',
    NEW.raw_user_meta_data->>'grade_level'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    school_name = EXCLUDED.school_name,
    grade_level = EXCLUDED.grade_level;
  RETURN NEW;
END; $$;
