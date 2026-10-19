# Phase 2 — Sprite Pipeline

## Tujuan

1 gambar angle → sprite modular + metadata (pivot, parent) + UI koreksi mask.

## Pekerjaan

- Integrasi background removal + parsing + crop (lihat `docs/03-SPRITE-PIPELINE.md`)
- Export PNG per bagian + metadata.json
- UI brush koreksi mask + edit pivot
- Preview rakit ulang sederhana

## Definition of Done

- [ ] Front view 1 karakter berhasil dipecah ke minimal: head, body, 2 arm, 2 leg
- [ ] metadata berisi pivot + parent untuk tiap bagian
- [ ] User bisa koreksi mask dan pivot, lalu simpan ulang
- [ ] Source + clean + sprites tersimpan (reproducible)
- [ ] Mematuhi Build Rules #3 dan #6
