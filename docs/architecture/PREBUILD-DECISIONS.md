# Prebuild decisions — Static Comic App
Approved baseline, 2026-10-19. No timeline, video, sound, animation.
## Hard architectural decisions
1. Sprite anatomy: FK rigid cutout with pivot hierarchy, layered overlap and explicit replaceable visual parts. Hidden areas cannot be invented automatically; expose manual mask/repair and missing-source status.
2. Multi-view: canonical semantic joint IDs with distinct sprite assets and pivots for front/side/back/three-quarter; switching views validates mappings and poses; no assumption that flipping creates missing views.
3. Scene scale: stage design pixel coords, optional manual horizon/perspective guides, anchors and per-instance scale; a single ground_line_y is only the simple fallback. Contact points account for seated/lying poses.
4. Compositing: immutable scene document; low latency browser preview and high resolution image export use same transform/layer/blend semantics. Character group composed from parts then shadow, tint, outlined edge preservation and masks applied without changing originals.
5. Typography: speech/thought/narration bubbles, editable tail anchors, safe margin, text wrapping, font fallback and export fidelity tests.
6. Recovery: autosaved versioned drafts, undo/redo, schema/versioned portable project bundle containing dependency assets, migration and restore verification.
## Build gate and development policy
Phase 0 requires final schema, editor interaction contracts, a runnable frontend/API skeleton, initial tests and compositor proof of concept. It does NOT require the completed Phase 5 end-to-end production workflow. Each phase must have executable evidence.
Initial vertical slice: thumbnail library -> drop test character onto static page panel -> move/scale -> swap face sprite -> simple body rig rotate -> background and foreground overlay -> preview shadow/tint -> PNG export; save/reopen after persistence is implemented.
Deferred: automatic perspective/depth inference, perfect cutout repair, advanced IK/mesh and AI continuity. 
