---
description: Code review untuk local changes atau GitHub PR Bralingo.
argument-hint: "[blank untuk local | pr-number | pr-url]"
---

# Code Review

## Local Mode (default)

### Phase 1 — Gather

```bash
git diff --name-only HEAD
```

### Phase 2 — Review Checklist

**Kritis (block commit):**
- Hardcoded secrets/credentials (Supabase keys, DB passwords)
- SQL injection via Supabase queries
- RLS policy bypass
- XSS dari user input (terutama modul Braille, soal quiz)
- `dangerouslySetInnerHTML` dengan data user

**High:**
- Server Component import client hooks (`useState`, `useEffect`, etc.)
- Missing `'use client'` directive
- Improper Supabase auth flow (SSR cookie handling)
- Missing error handling try/catch di Server Actions
- `console.log` di production code

**Medium:**
- Komponen > 200 lines
- Nesting > 4 level
- **Aksesibilitas** — critical untuk pengguna tunanetra:
  - Missing `aria-label`/`aria-hidden`/`aria-live`
  - Missing alt text di gambar/ikon
  - Braille text tanpa label screen reader
  - Focus management hilang
- TODO/FIXME comments
- Missing `key` prop di list rendering
- `any` type usage (cek di `types/index.ts`)

### Phase 3 — Report

Format: severity, file:line, issue, suggested fix.

## PR Mode

```bash
gh pr view <NUMBER> --json number,title,body,changedFiles,additions,deletions
gh pr diff <NUMBER>
```

Review + post ke GitHub via `gh pr review`.
