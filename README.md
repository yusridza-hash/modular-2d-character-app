# Modular 2D Character / Sprite Composer App

Aplikasi untuk mengubah karakter AI-generated (multi-angle) menjadi **sprite modular 2D** yang bisa disusun, dipose secara natural, diganti ekspresi, di-flip, digabung dengan background, dan dipakai untuk scene/comic panel yang konsisten.

## Struktur Dokumentasi (Baca Sesuai Urutan)

```
docs/
  00-OVERVIEW.md          ← Mulai dari sini
  01-BUILD-RULES.md       ← Aturan wajib saat build (sangat penting)
  02-TECH-AND-OSS.md      ← Tech stack + integrasi open source
  03-SPRITE-PIPELINE.md   ← Cara gambar → sprite modular
  04-POSING-SYSTEM.md     ← Gerakan manual agar tidak aneh
  05-BLENDING-AND-SCALE.md← Blending ke background + ukuran tidak kaku
  06-ASSETS-AND-SCENE.md  ← Aset tambahan, background, scene composer
  07-DATA-SCHEMA.md       ← Format data (JSON) yang dipakai

roadmap/
  ROADMAP.md              ← Arahan utama + lokasi semua dokumen
  phase-0.md ... phase-7.md ← Kriteria detail & definisi selesai tiap phase
```

## Status Saat Ini

- [x] Perencanaan & dokumentasi lengkap
- [ ] Phase 0 – Setup
- [ ] Phase 1 – Character Ingestion
- [ ] Phase 2 – Sprite Extraction
- [ ] Phase 3 – Composer + Posing
- [ ] Phase 4 – Expression
- [ ] Phase 5 – Scene
- [ ] Phase 6 – Polish
- [ ] Phase 7 – Advanced

## Prinsip Utama

1. **Aset fixed > generate ulang** — konsistensi dari sprite modular, bukan dari prompt.
2. **Semi-otomatis** — AI bantu pecah sprite, user koreksi ringan.
3. **Posing natural** — hierarchy + pivot + constraint.
4. **Blending & skala** — karakter menyatu dengan background, ukuran proporsional.
5. **Open source first** — semua model & library yang dipilih harus open source / permissif.

Mulai baca: [docs/00-OVERVIEW.md](docs/00-OVERVIEW.md) lalu [roadmap/ROADMAP.md](roadmap/ROADMAP.md).
