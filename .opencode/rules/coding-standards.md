# Coding Standards — Bralingo

## TypeScript
- Strict mode — no `any` tanpa alasan
- Gunakan `import type` untuk type-only imports
- Named exports lebih diutamakan
- Types dari `@/types/supabase` (generated) + `types/index.ts` untuk static types

## React / Next.js 16 (App Router)
- **Server Components** default — semua page.tsx/layout.tsx adalah server component
- **Client Components** hanya jika butuh interaktivitas — tambah `"use client"` directive
- JANGAN import hooks client di server component
- Server Actions di `_actions/` folder — pakai `"use server"` directive
- `async` component OK di server, tapi jangan di client

## Supabase
- Server: `createServerClient` dari `@supabase/ssr` (cookies-based)
- Client: `createBrowserClient` dari `@supabase/ssr`
- Query via RLS policies; bypass hanya di Server Actions
- Gunakan generated types dari `types/index.ts`
- Migration: selalu via file di `supabase/migrations/`, jangan edit langsung di dashboard

## shadcn/ui (New York style)
- Komponen di `components/ui/` — ikuti pattern dari shadcn CLI
- Gunakan `cn()` utility dari `lib/utils.ts` untuk class merging
- Gunakan `variants` dari `class-variance-authority` untuk varian komponen

## Tailwind v4
- Utility classes langsung di JSX className
- Gunakan design tokens yang sudah didefinisikan di `globals.css`

## Form + Validasi
- React Hook Form + Zod untuk semua form
- Schema Zod di file terpisah atau inline di komponen form
- Server-side validation juga wajib di Server Action

## Accessibility (KRITIS — pengguna tunanetra)
- Semua elemen interaktif wajib `aria-label`
- Ikon dekoratif wajib `aria-hidden="true"`
- Notifikasi status pakai `aria-live` region
- Skip-to-content link di layout dashboard
- Alt text deskriptif untuk semua gambar/ikon konten
- Braille text wajib punya label screen reader
- Keyboard navigation support (Tab, Enter, Escape)

## Git
- Bahasa Indonesia untuk commit messages
- Commit message format: `kategori: deskripsi singkat`
- Contoh: `feat: tambah halaman export raport`, `fix: a11y label di sidebar`
