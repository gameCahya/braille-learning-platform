---
description: Deteksi sistem build Bralingo dan fix error satu per satu.
---

# Build Fix

Fix error build/type Bralingo secara incremental.

## Step 1: Run Check

```bash
pnpm build 2>&1 | head -80
pnpm lint 2>&1 | head -80
```

## Step 2: Parse Errors

Group errors by file. Fix dependency order: imports/types → Server/Client boundary → logic → JSX.

## Step 3: Fix Loop

Satu error per siklus:
1. Read file (10 line context)
2. Diagnose root cause
3. Edit minimal
4. Re-run `pnpm build`
5. Lanjut error berikutnya

## Error Patterns Khas Bralingo

| Error | Sering di | Fix |
|---|---|---|
| Type mismatch Supabase | Queries | Cek generated types di `types/index.ts` / `@/types/supabase` |
| Server Component import client | Pages | Tambah `"use client"` atau pindahkan ke client component |
| `useState` in Server Component | Server pages | Pindahkan logic ke client component terpisah |
| Missing `'use client'` | shadcn/ui interactions | Tambahkan directive di top file |
| `async` Server Component | Pages | Boleh, tapi tidak boleh import hooks client |
| Tailwind v4 class | Templates | Utility class mungkin berubah di v4 |
| `createServerClient` vs `createBrowserClient` | SSR | `createServerClient` di server, `createBrowserClient` di client |
| unused import/var | ESLint | Hapus atau prefix `_` |
| missing `key` prop | Lists | Tambah `key={id}` di `.map()` |
| Zod schema mismatch | Forms | Sesuaikan dengan type `teacher_modules` insert |

## Guardrails

- Stop jika 3 percobaan gagal untuk error yang sama
- Stop jika butuh perubahan arsitektur
- Tanya user jika butuh `pnpm add` package baru
