# Phase 1–4 Character Engine — Implementation Status

**Date:** 2026-10-19  
**Scope:** Character Preparation Wizard + client MVP pipelines (not production CV workers).

## Delivered in code

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Draft CRUD, multi-angle upload, view tags, localStorage persist | Done |
| 1 | Wizard stage rail + resume draft | Done |
| 2 | Background removal (corner-sample client MVP) | Done (replaceable by RemBG/BiRefNet worker) |
| 2 | Heuristic band segmentation → part PNGs | Done (not ML human parsing) |
| 2 | Pivot / parent repair table | Done |
| 3 | FK joint sliders + constraint clamp | Done |
| 3 | Pose preset save/load | Done |
| 3 | Rig canvas preview (pivot markers) | Done |
| 4 | Expression upload pack + list | Done |
| 4 | Publish → Library asset with expression map | Done |

## Not done (honest gaps)

- Server SAM2 / human-parsing / BiRefNet
- Brush mask paint UI on canvas
- Full hierarchical matrix FK (preview uses per-part pivot rotation)
- Supabase persistence (still localStorage + data URLs)
- Immutable asset_version rows in Postgres
- ≥5 curated expressions auto-generated

## How to run

```bash
npm install
npm run dev
```

Open **Character Wizard** from the top toolbar.

## Acceptance path (manual)

1. New draft → upload **front** (and optionally side)
2. Clean → Run clean → compare source/clean
3. Segment → Run heuristic segment → see part cards
4. Repair → adjust pivots/parents
5. Rig → move joints → Save pose preset → Load preset
6. Expressions → upload face images with names
7. Publish → character appears in Asset Library → drag to panel

## Files

- `src/character/types.ts`
- `src/character/pipeline.ts`
- `src/character/engineStore.ts`
- `src/wizard/CharacterWizard.tsx`
- `src/studio.tsx` (integration)
