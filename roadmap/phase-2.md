# Phase 2 — Sprite Pipeline

## Status (2026-10-19)

**Partial MVP — NOT complete.**  
Client heuristic only. See [PROGRESS.md](./PROGRESS.md).

## Tujuan

1 gambar angle → sprite modular + metadata (pivot, parent) + UI koreksi mask.

## Definition of Done

- [x] Front dapat dipecah ke beberapa part (heuristic bands)
- [x] metadata pivot + parent editable
- [ ] User brush koreksi mask (add/subtract/feather)
- [ ] Production BG removal model
- [ ] ML / SAM segmentation + confidence
- [x] Source + clean + sprites tersimpan di draft lokal
- [ ] Provenance model/job ids + Supabase Storage
- [ ] Acceptance test recorded

## Wizard stages

Clean, Segment, Repair — UI present; CV quality below production gate.
