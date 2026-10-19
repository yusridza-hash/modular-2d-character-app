# Modular 2D Studio — Static Comic & Image Composer

**Current approved direction: Comic/Image ONLY. No video, animation, timeline, FPS, audio or motion clips.**

This application transforms consistent character images into reusable 2D sprite rigs with prebuilt facial-expression sprites. Users drag characters/props/backgrounds from a library into a comic canvas, pose bodies, swap expressions, compose panels, then export static images.

## Progress (honest)

See **[roadmap/PROGRESS.md](roadmap/PROGRESS.md)**.

- Phase **1–4 Character Engine:** **Partial MVP** in code (wizard + client pipelines) — **not DoD-complete**.
- Phase **5+:** early studio prototype only.

Do not treat documentation or partial features as finished phases.

## REQUIRED reading order (canonical)

1. [Build Specification Index](docs/BUILD-SPEC-INDEX.md)
2. [Progress tracker](roadmap/PROGRESS.md)
3. [Product scope](docs/product/PRODUCT-SPEC.md)
4. [Phase 1–4 status](docs/quality/PHASE-1-4-STATUS.md)
5. [Data schema](docs/07-DATA-SCHEMA.md) / [Supabase](docs/08-DATABASE-SUPABASE.md)
6. [Roadmap](roadmap/ROADMAP.md)

## Prototype

```bash
npm install
npm run dev
```

Use **Character Wizard** for Phase 1–4 MVP flow. Uploaded images may use data URLs; localStorage is not production persistence.
