---
description: Generate Playwright E2E test untuk Bralingo.
argument-hint: "[nama fitur | path halaman]"
---

# E2E Test Generator

Generate Playwright E2E test untuk flow Bralingo.

## Cara Kerja

1. Baca page source Next.js untuk tahu element selectors + aria labels
2. Cek existing test pattern di `tests/` atau `e2e/` (jika ada)
3. Generate test file dengan Playwright
4. Verify test bisa jalan: `pnpm exec playwright test`

## Test Patterns

Uses [Page Object Model](https://playwright.dev/docs/pom) jika ada halaman kompleks.

## Integration dengan Bralingo

- **Auth flow**: login → approval gate → dashboard sesuai role
- **Student flow**: pilih kelas → buka modul Braille → baca/fase → quiz → lihat hasil
- **Teacher flow**: buat kelas → buat modul → publish → lihat progress siswa
- **Admin flow**: approval user → kelola data

## Auth Helper

Tests perlu login dulu via Supabase auth. Gunakan `setup` project Playwright dengan cookie-based session.

## Accessibility Testing

Bralingo untuk pengguna tunanetra — wajib test:
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader labels (cek `aria-label`, `aria-live`)
- Skip-to-content link
- Focus order logis
