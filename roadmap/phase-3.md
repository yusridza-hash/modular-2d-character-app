# Phase 3 — Composer + Posing Natural

## Tujuan

User mempose karakter modular tanpa terlihat patah/aneh.

## Pekerjaan

- Canvas Konva load parts dari metadata
- Hierarchy parent-child
- Rotasi berporos pivot
- Constraint siku & lutut
- Simpan / load pose
- Layer order dasar

## Definition of Done

- [ ] FK hierarchy berfungsi (putar upper arm → lower arm ikut)
- [ ] Pivot benar di bahu/siku/leher (tidak berputar di tengah sembarangan)
- [ ] Constraint mencegah siku/lutut hiperekstensi
- [ ] 3+ pose tersimpan dan bisa diload ulang
- [ ] Sesuai `docs/04-POSING-SYSTEM.md` dan Build Rule #4


## Comic-only build alignment (2026-10-19)
Refer to docs/BUILD-SPEC-INDEX.md and canonical UI/rig/blending/versioning/testing contracts. This phase must not add timeline, animation, sound, FPS or video. Character library drag-drop is scene instance based, facial presets are swappable, and scene preview/final export must follow same compositing specification. DoD needs demonstrated tests; documentation alone does not complete phase.
