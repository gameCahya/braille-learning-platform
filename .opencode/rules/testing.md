# Testing Rules — Bralingo

## Minimum Coverage
- 80% coverage untuk semua logic code (server actions, helpers, utils)
- E2E mencakup semua critical user flow

## Test Tools
- **Unit/Integration**: Vitest (belum setup — PENDING)
- **E2E**: Playwright (belum setup — PENDING)

## TDD Workflow (RED → GREEN → REFACTOR)
1. Tulis test dulu — test harus FAIL
2. Tulis minimal implementation — test harus PASS
3. Refactor — pertahankan passing tests
4. Verifikasi 80% coverage

## Test Structure
```typescript
test('deskripsi perilaku yang diuji', async () => {
  // Arrange — setup data
  // Act — action yang diuji
  // Assert — verify hasil
})
```

## E2E Priority
1. Auth flow (login, register, approval gate)
2. Dashboard routing (role-based: admin/guru/siswa)
3. Student flow (class picker → module view → quiz → results)
4. Teacher flow (CRUD kelas → CRUD modul → lihat progress)
5. Admin approval flow (pending → approve/reject)
6. Braille accessibility (keyboard nav, screen reader)

## Accessibility Testing (Wajib)
- Keyboard navigation: semua interaksi bisa via keyboard
- Screen reader: `aria-label`, `aria-live`, `aria-hidden` valid
- Skip-to-content link berfungsi
- Focus order logis
- Alt text pada konten Braille & gambar
