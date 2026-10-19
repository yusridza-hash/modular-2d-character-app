# Character Preparation Wizard — Approved Pre-Build Design
## Purpose
Convert imported 2D character image(s) to validated reusable comic character without forcing novice users to configure everything in one advanced editor. STATIC COMIC / IMAGE ONLY.
## Flow and UX
1. Import: drop source image(s), choose character name, tags, illustrated views; validate formats, resolution, ownership; preserve originals.
2. Clean: automatic background removal, compare before/after, manual brush add/subtract and feather control.
3. Segment: candidate body/cloth/hair parts with confidence and overlay; manual split/merge/paint, preserve source offsets and occluded geometry flags.
4. Repair: fill missing seams manually or import replacement image; never claim invisible anatomy is reconstructed with certainty.
5. Rig: choose humanoid/custom skeleton, assign parts, set hierarchy/pivots/constraints; quick test shoulders/elbows/head/knees.
6. Expressions: import whole-face expression variants or modular eye/brow/mouth sprites; set view compatibility, at least 5 baseline presets; preview quick swap.
7. Validate & Publish: quality checklist, rig cycle check, source/mask/sprite provenance, preview standing/pointing/face swap; publish pinned character asset version to Library.
## UI
Progress rail across stages; central preview with compare/overlay; left step instructions and parts tree; right context controls; previous/next/save draft buttons; background jobs show status/retry/cancel, step errors non-destructive. Can return later to unfinished draft.
## Contract
Wizard stores stage revisions and never mutates published asset version. All accepted outputs are registered in shared Asset Registry. Published characters get thumbnail, supported view/expressions, tags, status Published.
## Exit tests
Import→segment→manual repair→rig→5 expression swaps→publish→drag character into panel works without raw file dependencies or orphan joints. Resume wizard draft after refresh.
