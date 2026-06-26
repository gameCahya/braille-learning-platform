---
description: Update AGENTS.md dengan ringkasan sesi terbaru.
---

# Memory

Update `AGENTS.md` dengan ringkasan komprehensif dari seluruh percakapan sesi ini.

## Cara Kerja

1. Baca `AGENTS.md` untuk lihat struktur dan sesi terakhir
2. Scan git log untuk lihat commit sesi ini: `git log --oneline -20`
3. Tulis ringkasan ke bagian **"Sesi Terakhir"** di `AGENTS.md`

## Aturan Penulisan

1. **Update, jangan timpa** — bagian "Ringkasan Proyek", "Catatan Penting", dan "Pending Issues" tetap dipertahankan, hanya update jika ada perubahan signifikan
2. **Sesi Terakhir**: format selalu sama — periode, fitur baru, perbaikan, perubahan arsitektur, belum selesai
3. **Gaya**: ringkas, faktual, Bahasa Indonesia
4. **Secret-safe**: jangan pernah tulis password, API key, atau credential di AGENTS.md

## Template Sesi Terakhir

```markdown
## ✅ Sesi Terakhir (DD MMM YYYY — Sesi N)

**Periode:** DD MMM YYYY (N commits: abc1234..def5678)

### Fitur Baru
- **Fitur A** — deskripsi singkat

### Perbaikan
- Fix: deskripsi

### Perubahan Arsitektur
- Deskripsi perubahan penting

### Belum Selesai
- Item yang masih pending
```
