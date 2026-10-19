# Phase 5 — Static Comic Canvas, Library, Layering & Auto Blend
## Required
- Library visible simultaneously with canvas and Inspector; search/thumbs/favorites for characters, props, background. Pointer drag/drop and accessible Add button create version-pinned scene instances, never change master.
- Page/panel navigation strip, panel duplicate, per-panel scene doc, background crop, dialogue balloons.
- Object mode for transforms; character pose mode (from Phase 3) and expression thumbnail quick swap (Phase 4) in Inspector.
- Depth/layer order, foreground occlusion, prop anchors, ground guides, multi-contact shadow.
- Live automatic blending preview: grounding, shadows, conservative color/tone match, edge outline-preserving softness. Inspector auto/quick/advanced controls; background blend presets. Export final high-resolution PNG using same scene definition; no hidden generative rerender.
- Persistent page/panel/revisions/asset references; reopen unchanged.
## Definition of Done
- [ ] Drag Arlo into panel, independent expression and pose in two instances.
- [ ] Drop foreground prop and verify correct occlusion with image test.
- [ ] Ground/shadow follows movement and scale; no mandatory snap if ground absent.
- [ ] Live preview and final exported PNG match documented quality tolerance.
- [ ] Save/reopen, undo/redo, panel duplicate work without master asset mutation.
- [ ] No video controls, timeline or FPS are implemented.
See docs/design/UI-UX-SPEC.md and docs/architecture/SCENE-CANVAS-BLENDING.md.

## Additional approved Phase 5 scope
Unified searchable/favoritable Library with tags, status and thumbnails; editor compositor keeps each rigged character as one selectable scene instance; optional cache invalidation on expression/pose change; hand anchor prop follows wrist; background may contain midground/foreground masks; page layout templates and editable bubble tail; export entire comic page statically. Acceptance per docs/architecture/ASSET-BROWSER-AND-COMPOSITING.md and docs/design/COMIC-PAGE-EDITOR.md.
