# Phase 1–4 Character Engine — Implementation Status

**Date:** 2026-10-19  
**Verdict:** Partial MVP shipped — **phases NOT marked complete** in roadmap.

Canonical progress: [roadmap/PROGRESS.md](../../roadmap/PROGRESS.md).

## Why not 100% DoD pass

- Production CV models and brush mask tools not integrated.
- FK is joint sliders + per-part pivot preview, not full hierarchical FK.
- Persistence is localStorage, not Supabase versioned assets.
- No certified `npm run build` / browser acceptance log in CI or session notes.
- Product/BUILD-SPEC forbid checking phases complete on docs or partial UI alone.

## Delivered in code

| Phase | Feature | MVP |
|-------|---------|-----|
| 1 | Draft CRUD, multi-angle, wizard resume | Yes |
| 2 | Corner BG remove, heuristic segment, pivot table | Yes |
| 3 | Joint sliders, constraints, pose presets, preview | Yes |
| 4 | Expression upload, publish to Library | Yes |

## Files

- `src/character/types.ts`, `pipeline.ts`, `engineStore.ts`
- `src/wizard/CharacterWizard.tsx`
- `src/studio.tsx`

## How to run

```bash
npm install
npm run dev
```

Open **Character Wizard**.

## Next for real phase pass

Listed under roadmap/PROGRESS.md “Next to move toward real pass”.
