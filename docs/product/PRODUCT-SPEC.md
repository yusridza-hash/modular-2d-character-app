# Product Specification — Comic/Image ONLY
Status: approved direction from project discussion, 2026-10-19. Applies to ALL phases.
## Scope and non-goals
Modular 2D Studio is a desktop-first web-based **static comic and image composer**, NOT a video/animation application. No timeline, keyframe animation, FPS, audio, video export, motion clip or FFmpeg requirement. The purpose is consistent reusable AI-generated characters across static panels without regenerating them each time.
## Core user journey
Project → import multi-angle character image → background removal + sprite segmentation + manual repair → rig pivot/hierarchy → prepare reusable facial expression sprite packs and poses → drag character/background/prop from searchable Library onto Comic Canvas → manipulate character body manually with pose mode → instantly swap face expression sprites → assign layer/occlusion → auto scene-fit preview → dialogue bubble/layout → save and reopen → final image export.
## MVP
Project dashboard; character upload/source preservation; sprite cutting and correction; humanoid rig FK; reusable pose presets; expression preset switching (at minimum 5 functional presets; aim curated 20–30 as asset packs, not a promise of automatic generation); scene/page/panel editor; search/favorite asset library; drag/drop character and prop instances; scene background; object and pose editing; non-destructive source; undo/redo; autosave/recovery; automatic simple ground snap/contact shadow/tone adjustment preview; PNG image export with fidelity checks.
## Non-goals
Video, animation timeline, AI autonomous changes without validation, automatic invisible anatomy reconstruction guarantees, fully automatic flawless segmentation, photorealistic physical lighting.
## Core invariants
Character master immutable per asset version; each dropped object is a scene instance with instance-local pose/expression/transform/blend overrides. Existing published panels pin referenced versions. Scene edits must never silently mutate library master. All effects controllable and disableable. Original source preserved.
## End-to-end acceptance
Drag the same Arlo master into 3 panels; pose and expression per instance differ; swap expression in one panel does not modify other panels; reopen project and reproduce identical previews/exports from pinned versions; exported PNG represents the final canvas composition, not raw unblended sprites.
