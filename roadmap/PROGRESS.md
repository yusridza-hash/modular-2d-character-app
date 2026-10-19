# Progress Tracker — Modular 2D Studio

**Last update:** 2026-10-19  
**Rule:** Documentation or partial MVP ≠ phase complete. Phase is complete only when Definition of Done + acceptance evidence pass.

## Overall

| Phase | Name | Status | % toward DoD (rough) |
|-------|------|--------|----------------------|
| 0 | Fondasi / schema / stack | In progress | ~30% (docs + Vite prototype; no verified migrations/tests) |
| 1 | Character ingestion | **Partial MVP** | ~55% |
| 2 | Clean / segment / repair | **Partial MVP** | ~35% |
| 3 | Rig / posing | **Partial MVP** | ~40% |
| 4 | Expression packs | **Partial MVP** | ~40% |
| 5 | Comic canvas / blend / export | Prototype only (pre–Character Engine) | ~25% |
| 6 | Polish / recovery | Minimal (undo in studio) | ~10% |
| 7 | Advanced static tools | Not started | 0% |

**Character Engine (1–4) as a block:** MVP shell shipped in code; **not** marked complete.

---

## Why Phase 1–4 did not “pass all” DoD

1. **Scope vs time** — Full DoD needs production CV (RemBG/SAM2/parsing), brush mask UI, full FK hierarchy, Supabase versioning, and recorded acceptance tests. Implementation delivered a **client-side vertical slice** so the wizard flow exists.
2. **No GPU/backend CV in this pass** — Clean = corner color sampling; Segment = heuristic bands. Spek explicitly expects stronger models + manual repair tools.
3. **Persistence** — Drafts use `localStorage` + data URLs, not Supabase Storage + immutable `asset_version` (required for production publish pin).
4. **Evidence rule** — Repo BUILD-SPEC says do not check off phases without runnable proof. `npm install` / `npm run build` / browser acceptance were **not** certified in the implementation environment.
5. **Honest gaps documented** — See `docs/quality/PHASE-1-4-STATUS.md` and gap explanation in project discussion.

---

## Phase 1 detail

| DoD item | Done? |
|----------|-------|
| Draft CRUD | Yes (local) |
| Multi-angle upload + tags | Yes |
| Schema / Supabase versioned source | No |
| Validation resolution / ownership | Partial |
| Resume after refresh | Yes (localStorage limits apply) |

**Status:** Partial MVP — **not complete**.

---

## Phase 2 detail

| DoD item | Done? |
|----------|-------|
| BG removal usable on simple images | Yes (MVP) |
| Production BG model (BiRefNet/RemBG) | No |
| Brush add/subtract mask | No |
| ML / SAM segment | No (heuristic only) |
| Pivot/parent metadata edit | Yes |
| Provenance job/model ids | No |

**Status:** Partial MVP — **not complete**.

---

## Phase 3 detail

| DoD item | Done? |
|----------|-------|
| Joint sliders + constraint clamp | Yes |
| Full parent→child FK matrix | No |
| Pose preset save/load | Yes |
| Rig cycle / orphan validation | No |
| Formal pose reload tests | No |

**Status:** Partial MVP — **not complete**.

---

## Phase 4 detail

| DoD item | Done? |
|----------|-------|
| Upload expression images | Yes |
| Guaranteed ≥5 curated presets | No |
| Modular eyes/mouth | No |
| View compatibility checks | No |
| Instance swap tested in panel | Partial (depends on uploads) |

**Status:** Partial MVP — **not complete**.

---

## Code pointers (MVP)

- `src/character/*` — engine types, pipeline, store  
- `src/wizard/CharacterWizard.tsx` — wizard UI  
- `src/studio.tsx` — Library publish hook  
- `docs/quality/PHASE-1-4-STATUS.md` — implementation honesty  

## Next to move toward real pass

1. CV worker or brush mask (Phase 2 P0)  
2. Hierarchy FK matrix (Phase 3 P0)  
3. Expression pack gate ≥5 + panel swap test (Phase 4)  
4. Supabase migration + version pin (Phase 0/1)  
5. Recorded `npm run build` + manual acceptance checklist signed off  
