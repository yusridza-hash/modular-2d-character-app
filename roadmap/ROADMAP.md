# Modular 2D Roadmap — Static Comic/Image Only
**Mandatory source:** [docs/BUILD-SPEC-INDEX.md](../docs/BUILD-SPEC-INDEX.md). All old references to video/animation/timeline are superseded. Keep original Phase 0–7 naming and order; use per-phase acceptance tests. 
## Phases
| Phase | Build work and exit gate |
|---|---|
| 0 | Lock product scope, editor wireframe, asset/rig/expression/scene contracts, Supabase versioning migrations/RLS, stack/OSS and test harness. Exit: schemas validated and dev stack runnable. |
| 1 | Character project and multi-angle uploads, source preservation, versioned registration. Exit: uploads/reload/ownership tests pass. |
| 2 | Background removal, segmentation, manual mask repair, pivot proposal, reproducible process jobs. Exit: validated sprite previews and stored provenance. |
| 3 | Character canvas rig hierarchy, joint FK/constraints, object vs pose mode, pose preset and undo/redo. Exit: test poses and reload without drift. |
| 4 | Prebuilt facial expression packs, whole-face and optionally modular eyes/brows/mouth swaps, view compatibility, outfit. Exit: >=5 presets swap independently per instance; plan curated 20–30. |
| 5 | Always-accessible asset Library + static Comic Canvas; drag/drop, page/panel strip, scene instance creation, layer/occlusion, ground guides, auto shadow/tone/edge blend preview, Inspector, bubble, export PNG final render. Exit: full Arlo vertical slice passes. |
| 6 | Save recovery, usability, keyboard support, project portability, performance/visual regression and polishing. |
| 7 | Optional static-only: IK pose helpers, mesh repair, angle/face asset assistance, AI validated skills, story continuity, comic page layout enhancements. NO animation/video. |
## Milestone integration test
Import Arlo -> segment -> manual repair -> rig -> save pose -> drag to panel -> swap shocked face -> add foreground prop/background -> auto scene-fit preview -> export PNG -> reopen unchanged. Do not certify any phase without test evidence.
## Required specs
[Product](../docs/product/PRODUCT-SPEC.md) · [Editor](../docs/design/UI-UX-SPEC.md) · [Rig](../docs/architecture/CHARACTER-RIG-AND-EXPRESSION.md) · [Blending](../docs/architecture/SCENE-CANVAS-BLENDING.md) · [Versions](../docs/architecture/ASSET-VERSIONING.md) · [Database](../docs/08-DATABASE-SUPABASE.md) · [Tests](../docs/quality/TEST-STRATEGY.md).
