# Phase 1 — Character Ingestion

## Status (2026-10-19)

**Partial MVP — NOT complete.**  
See [PROGRESS.md](./PROGRESS.md).

## Tujuan

User bisa buat project karakter dan menyimpan beberapa angle.

## Pekerjaan

- CRUD Character Project
- Upload multi image + tag angle (manual)
- Preview grid
- Simpan ke storage sesuai schema

## Definition of Done

- [x] Buat / rename / hapus character draft (local engine)
- [x] Upload minimal 2 angle possible (UI supports 6 views)
- [ ] Data tertulis sesuai schema production + Supabase versioned source
- [x] Tidak ada segmentation di phase ini (hanya ingestion) — OK in wizard stage Import
- [ ] Ownership / resolution validation formal
- [ ] Acceptance test recorded

## Static Comic Product Gate

Reusable versioned character sprites for comic panels. Preserve originals. No video/animation.

## Wizard requirement

Import stage of Character Preparation Wizard — implemented in `src/wizard/CharacterWizard.tsx` (draft/resume local).
