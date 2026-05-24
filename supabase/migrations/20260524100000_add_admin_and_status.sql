-- Tambah nilai 'admin' ke enum user_role
ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'admin';

-- Tambah kolom status ke profiles (nullable dulu agar bisa diisi sebelum NOT NULL)
ALTER TABLE "public"."profiles"
  ADD COLUMN IF NOT EXISTS "status" text
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Semua user yang sudah ada langsung approved (mereka sudah pakai platform sebelumnya)
UPDATE "public"."profiles" SET "status" = 'approved' WHERE "status" IS NULL;

-- Jadikan NOT NULL dengan default 'pending' untuk registrasi baru
ALTER TABLE "public"."profiles"
  ALTER COLUMN "status" SET NOT NULL,
  ALTER COLUMN "status" SET DEFAULT 'pending';
