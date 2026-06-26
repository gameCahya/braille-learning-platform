---
description: Buat rencana implementasi bertahap. WAIT for user CONFIRM before coding.
argument-hint: "[fitur | path file PRD]"
---

# Plan

Buat rencana implementasi detail sebelum menulis kode.

## Cara Kerja

1. **Restate requirements** — klarifikasi apa yang perlu dibangun
2. **Cari pattern existing** — cek Next.js routes, Supabase queries, komponen serupa
3. **Pecah jadi fase** — step konkret per file
4. **Assess risk** — surface potensi masalah
5. **Tunggu konfirmasi** — JANGAN menulis kode sampai user approve

## Spesifik Bralingo

- **Tech stack grounding**: Next.js 16 (App Router), React 19, TypeScript 5, Supabase SSR, Tailwind v4, shadcn/ui (New York), Radix UI, React Hook Form + Zod
- **Pattern grounding**: cari route/component/server action yang sudah ada sebagai referensi
- **Design grounding**: ikuti komponen shadcn/ui existing + Tailwind utility classes
- **Accessibility**: selalu pertimbangkan screen reader (pengguna tunanetra)

## Output

Tulis plan inline kecuali ada PRD file, maka tulis ke `.claude/plans/{name}.plan.md`.

## Example

```
User: /plan tambah halaman export raport siswa

Assistant:
# Plan: Halaman Export Raport Siswa

## Requirements
- Guru bisa export raport siswa per kelas dalam PDF/Excel
- Filter per siswa atau per kelas
- Tampilkan progress + hasil quiz

## Pattern to Mirror
- Route: `app/(dashboard)/reports/` (existing)
- Query: `user_progress` + `quiz_results` tables
- Komponen: table seperti di `ModulesTable`

## Fase
1. Buat server action untuk aggregate data progress + quiz
2. Buat UI filter kelas & siswa
3. Generate PDF/Excel di server action
4. Download button di client

## Risk
- MEDIUM: perlu package baru untuk generate PDF
- LOW: data aggregation mungkin berat tanpa caching

**WAITING FOR CONFIRMATION**
```
