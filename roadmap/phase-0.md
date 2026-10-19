# Phase 0 — Fondasi & Setup

## Tujuan

Lingkungan dev siap, schema data + **aturan database Supabase** final, model OSS dipilih dan diuji singkat.

## Pekerjaan

- Struktur monorepo / folder `apps/web`, `apps/api`
- FastAPI hello + Next/React hello
- Schema JSON: `docs/07-DATA-SCHEMA.md`
- **Database rules & SQL**: `docs/08-DATABASE-SUPABASE.md` (sudah ada — implementasikan migration mengikuti dokumen itu)
- Uji RemBG/BiRefNet + parsing/SAM2 di script
- Catat lisensi di `docs/02-TECH-AND-OSS.md`

## Definition of Done

- [ ] `docs/07` dan `docs/08` lengkap dan konsisten
- [ ] Migration Supabase (enum + tabel + RLS + bucket path) sesuai `08-DATABASE-SUPABASE.md` **atau** dicatat sebagai tugas follow-up eksplisit dengan dokumen sebagai sumber kebenaran
- [ ] Script lokal: 1 gambar → tanpa background
- [ ] Script lokal: parsing/SAM2 mask berjalan
- [ ] README menunjuk roadmap & build rules
- [ ] Tidak ada dependensi berbayar di path inti
