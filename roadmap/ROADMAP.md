# Roadmap — Arahan Utama & Lokasi Dokumen

## Cara Pakai Roadmap Ini

1. Baca aturan build: [docs/01-BUILD-RULES.md](../docs/01-BUILD-RULES.md)
2. Pahami overview: [docs/00-OVERVIEW.md](../docs/00-OVERVIEW.md)
3. Kerjakan phase berurutan; setiap phase punya file kriteria sendiri di folder ini.
4. Jangan anggap phase selesai sebelum **Definition of Done** di file phase terpenuhi.

## Peta Dokumen

| Topik | Lokasi |
|-------|--------|
| Overview | docs/00-OVERVIEW.md |
| **Aturan build (wajib)** | docs/01-BUILD-RULES.md |
| Tech + Open Source | docs/02-TECH-AND-OSS.md |
| Sprite dari gambar | docs/03-SPRITE-PIPELINE.md |
| Gerakan / posing | docs/04-POSING-SYSTEM.md |
| Blending + skala | docs/05-BLENDING-AND-SCALE.md |
| Aset + scene | docs/06-ASSETS-AND-SCENE.md |
| Schema data | docs/07-DATA-SCHEMA.md |
| Kriteria Phase 0 | roadmap/phase-0.md |
| Kriteria Phase 1 | roadmap/phase-1.md |
| Kriteria Phase 2 | roadmap/phase-2.md |
| Kriteria Phase 3 | roadmap/phase-3.md |
| Kriteria Phase 4 | roadmap/phase-4.md |
| Kriteria Phase 5 | roadmap/phase-5.md |
| Kriteria Phase 6 | roadmap/phase-6.md |
| Kriteria Phase 7 | roadmap/phase-7.md |

## Urutan Phase

| Phase | Nama | Dokumen kriteria | Prioritas |
|-------|------|------------------|----------|
| 0 | Fondasi, schema, riset OSS | phase-0.md | Tinggi |
| 1 | Ingestion multi-angle | phase-1.md | Tinggi |
| 2 | Sprite pipeline | phase-2.md | Sangat Tinggi |
| 3 | Composer + posing natural | phase-3.md | Sangat Tinggi |
| 4 | Ekspresi & variant | phase-4.md | Tinggi |
| 5 | Scene, background, blending | phase-5.md | Tinggi |
| 6 | Polish QoL | phase-6.md | Sedang |
| 7 | Advanced (IK, mesh, dll) | phase-7.md | Opsional |

## Prinsip

- **Rule** ada di `docs/01-BUILD-RULES.md` — semua kode tunduk ke situ.
- **Bagaimana sprite dibuat** → `docs/03-SPRITE-PIPELINE.md`
- **Bagaimana gerakan tidak aneh** → `docs/04-POSING-SYSTEM.md`
- **Bagaimana tidak kaku di background** → `docs/05-BLENDING-AND-SCALE.md`
- **Scene & aset** → `docs/06-ASSETS-AND-SCENE.md`
