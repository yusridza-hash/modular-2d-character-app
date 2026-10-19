# Phase 0 — Fondasi & Setup

## Tujuan

Lingkungan dev siap, schema data final untuk MVP, model OSS dipilih dan diuji singkat.

## Pekerjaan

- Struktur monorepo / folder `apps/web`, `apps/api`, `packages` (atau setara)
- FastAPI hello + Next/React hello
- Tulis schema final di `docs/07-DATA-SCHEMA.md` (character + scene minimum)
- Uji RemBG/BiRefNet + 1 human parsing + SAM2 di script terpisah
- Catat lisensi di `docs/02-TECH-AND-OSS.md`

## Definition of Done

- [ ] `docs/07-DATA-SCHEMA.md` berisi field wajib character + scene
- [ ] Script lokal berhasil: 1 gambar → tanpa background
- [ ] Script lokal berhasil: parsing kasar atau SAM2 mask berjalan
- [ ] README menunjuk ke roadmap & build rules
- [ ] Tidak ada dependensi berbayar di path inti
