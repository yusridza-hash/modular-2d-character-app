# Modular 2D Studio — Static Comic & Image Composer
**Current approved direction: Comic/Image ONLY. No video, animation, timeline, FPS, audio or motion clips.**

This application transforms consistent character images into reusable 2D sprite rigs with prebuilt facial-expression sprites. Users drag characters/props/backgrounds from a permanently accessible library into a comic canvas, manually pose bodies, swap facial expressions instantly, compose page/panel layouts, preview automatic scene blending, then export high-quality static images.

## REQUIRED reading order (canonical)
1. [Build Specification Index](docs/BUILD-SPEC-INDEX.md)
2. [Product scope](docs/product/PRODUCT-SPEC.md)
3. [Comic editor UI](docs/design/UI-UX-SPEC.md)
4. [Rig and expressions](docs/architecture/CHARACTER-RIG-AND-EXPRESSION.md)
5. [Scene canvas, layering and auto blend](docs/architecture/SCENE-CANVAS-BLENDING.md)
6. [Asset revision rules](docs/architecture/ASSET-VERSIONING.md)
7. [Data schema](docs/07-DATA-SCHEMA.md) and [Supabase contract](docs/08-DATABASE-SUPABASE.md)
8. [Quality](docs/quality/TEST-STRATEGY.md), [deployment](docs/operations/DEPLOYMENT-AND-RECOVERY.md), and [Roadmap](roadmap/ROADMAP.md)

## Implementation status
- [x] Initial planning documents and current comic-specific design baseline committed
- [ ] Phase 0 — validated architecture and environment
- [ ] Phase 1 — import / ingestion
- [ ] Phase 2 — sprite extraction / correction
- [ ] Phase 3 — rig and posing
- [ ] Phase 4 — expression packs
- [ ] Phase 5 — static comic canvas and blending
- [ ] Phase 6 — UX and reliability polish
- [ ] Phase 7 — optional **static-image** advanced tools

**Do not mark code/build/tests complete based solely on documentation.** Engineering details, migration and UI wireframe must be validated in Phase 0.

## Prototype source (Phase 0 in progress)
Source code now exists under `src/` with React/Vite + Konva + Zustand. Run `npm install`, `npm run dev` to inspect locally, and `npm run build` before calling it tested. **Build/runtime verification not yet completed.** See [honest feature and test status](docs/quality/PROTOTYPE-STATUS.md). Uploaded images use session-only blob URLs and localStorage layout save is NOT production persistence; do not rely on it for important work.

## Branch validation (Comic Editor)
Build, Vitest unit tests, Playwright Chromium smoke test and FastAPI tests now PASS on [GitHub Actions run 39224071175](https://github.com/yusridza-hash/modular-2d-character-app/actions/runs/39224071175). This is a tested prototype, not finished Phase 0/5/6. See [canonical current status](docs/quality/PROTOTYPE-STATUS.md). Start frontend: `npm install && npm run dev`; API: `cd apps/api && pip install -r requirements-dev.txt && uvicorn main:app --reload`. Work remains isolated on feature/comic-editor until integration review with Character Engine.
