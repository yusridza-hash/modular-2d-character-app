# Phase 1 — Character Ingestion

## Tujuan

User bisa buat project karakter dan menyimpan beberapa angle.

## Pekerjaan

- CRUD Character Project
- Upload multi image + tag angle (manual)
- Preview grid
- Simpan ke storage sesuai schema

## Definition of Done

- [ ] Buat / rename / hapus character project
- [ ] Upload minimal 2 angle, tag front & side
- [ ] Data tertulis sesuai `docs/07-DATA-SCHEMA.md`
- [ ] Tidak ada segmentation di phase ini (hanya ingestion)


## Static Comic Product Gate (2026-10-19)
The purpose of this work is reusable, versioned character sprites for drag-and-drop comic image panels. Preserve original images, processed masks, source offsets, view compatibility and immutable versions. Pose/edit manual correction and prebuilt facial expression swaps must remain supported downstream. No video, animation or timeline dependency. See docs/BUILD-SPEC-INDEX.md.

## Wizard requirement
Import stage of Character Preparation Wizard: draft/resume, input validation, versioned original source, view tags and Library visibility status. Follow docs/design/CHARACTER-PREPARATION-WIZARD.md.
