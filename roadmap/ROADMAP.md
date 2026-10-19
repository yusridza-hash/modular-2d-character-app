# Modular 2D Roadmap — Static Comic/Image Only

**Mandatory source:** [docs/BUILD-SPEC-INDEX.md](../docs/BUILD-SPEC-INDEX.md).  
**Live progress:** [PROGRESS.md](./PROGRESS.md) ← **read this for % / partial vs complete**.

All old references to video/animation/timeline are superseded. Keep Phase 0–7 naming; use per-phase acceptance tests.

## Phases (status snapshot 2026-10-19)

| Phase | Build work and exit gate | Progress |
|---|---|---|
| 0 | Lock product scope, contracts, Supabase versioning, stack/OSS, test harness. Exit: schemas validated and dev stack runnable. | In progress |
| 1 | Character project and multi-angle uploads, source preservation, versioned registration. | **Partial MVP** (not DoD-complete) |
| 2 | Background removal, segmentation, manual mask repair, pivot proposal, reproducible jobs. | **Partial MVP** (heuristic CV only) |
| 3 | Rig hierarchy, FK/constraints, pose presets, undo-friendly pose edit. | **Partial MVP** |
| 4 | Facial expression packs, swap per instance, view compatibility. | **Partial MVP** |
| 5 | Library + static Comic Canvas, blend preview, bubbles, PNG export. | Early prototype (studio) |
| 6 | Recovery, UX, portability, regression. | Minimal |
| 7 | Optional static-only advanced tools. NO animation/video. | Not started |

## Milestone integration test (Character Engine → panel)

Import character → clean → segment → repair → rig → save pose → expressions → publish → drag to panel → swap face → export PNG → reopen.

**Current:** Wizard path exists in UI; quality/CV/Supabase/test evidence **insufficient** to certify pass.

## Required specs

[Product](../docs/product/PRODUCT-SPEC.md) · [Editor](../docs/design/UI-UX-SPEC.md) · [Rig](../docs/architecture/CHARACTER-RIG-AND-EXPRESSION.md) · [Blending](../docs/architecture/SCENE-CANVAS-BLENDING.md) · [Versions](../docs/architecture/ASSET-VERSIONING.md) · [Database](../docs/08-DATABASE-SUPABASE.md) · [Tests](../docs/quality/TEST-STRATEGY.md) · [Phase 1–4 status](../docs/quality/PHASE-1-4-STATUS.md).
