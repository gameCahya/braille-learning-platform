-- Fungsi SECURITY DEFINER untuk cek admin — bypass RLS saat query profiles
-- sehingga tidak terjadi rekursi infinite pada policy
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Policy: admin bisa SELECT semua baris di profiles
CREATE POLICY "Admin can view all profiles"
ON "public"."profiles"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (is_admin());

-- Policy: admin bisa UPDATE semua profil (misal approve/reject status)
CREATE POLICY "Admin can update all profiles"
ON "public"."profiles"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (is_admin());
