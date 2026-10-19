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


## Static Comic Product Gate (2026-10-19)
The purpose of this work is reusable, versioned character sprites for drag-and-drop comic image panels. Preserve original images, processed masks, source offsets, view compatibility and immutable versions. Pose/edit manual correction and prebuilt facial expression swaps must remain supported downstream. No video, animation or timeline dependency. See docs/BUILD-SPEC-INDEX.md.

## Wizard requirement
Clean, segment and repair stages; background-removal comparison, brush/manual merge/split, confidence overlay, provenance, publish validation preview, non-destructive reprocessing. Follow docs/design/CHARACTER-PREPARATION-WIZARD.md.
