---
description: Fix issue yang ditemukan oleh /code-review secara incremental.
---

# Fix Issue

Fix issue dari hasil `/code-review` terakhir.

## Step 1: Detect Scope

```bash
git diff --name-only HEAD
```

Jika kosong, scan file dari konteks review terakhir.

## Step 2: Scan Issues

Periksa file untuk pola issue berikut:

| Kategori | Issue | Cari |
|---|---|---|
| Kritis | `dangerouslySetInnerHTML` | `dangerouslySetInnerHTML` + data user |
| Kritis | Hardcoded secrets | `sk-`, `eyJ`, `supabase.*key` |
| High | Missing `'use client'` | `useState`/`useEffect` tanpa directive |
| High | `any` type | `: any`, `as any`, `Record<.*any>` |
| High | Missing try/catch di Server Action | `"use server"` tanpa try/catch |
| Medium | Komponen > 200 lines | Hitung line count |
| Medium | Missing `key` prop | `.map(` tanpa `key=` |
| Medium | a11y label | JSX element interaktif tanpa `aria-label` |
| Medium | `any` in types | `import.*any` |

## Step 3: Fix Loop

Satu issue per siklus:
1. Read file (10 line context)
2. Diagnose root cause
3. Edit minimal
4. Re-run `pnpm build`
5. Lanjut issue berikutnya

## Fix Recipes

### Missing `'use client'`
```
// BEFORE
import { useState } from 'react';
export function MyComponent() { ...

// AFTER
"use client";
import { useState } from 'react';
export function MyComponent() { ...
```

### a11y label di icon button
```
// BEFORE
<button onClick={...}><Icon /></button>

// AFTER
<button onClick={...} aria-label="Buka menu"><Icon aria-hidden /></button>
```

### `any` type ke proper type
```
// BEFORE
const data: any = await supabase.from('teacher_modules').select();

// AFTER
import type { Tables } from '@/types/supabase';
const { data } = await supabase.from('teacher_modules').select();
```

### Missing `key` prop
```
// BEFORE
{items.map(item => <ModuleCard module={item} />)}

// AFTER
{items.map(item => <ModuleCard key={item.id} module={item} />)}
```

## Guardrails

- Stop jika 3 percobaan gagal untuk issue yang sama
- Stop jika butuh perubahan arsitektur
- Tanya user jika ada keputusan desain yang ambigu
