# Character, Rig, Pose, Expression Contract
## IDs/variants
Separate character identity, image angle/view variant, sprite set version, rig version, pose preset, face expression pack, outfit variant, scene instance. A front sprite may NOT simply be flipped to simulate a side/back image.
## Coordinate contract
Canvas/image origin top-left, +X right +Y down; angles positive clockwise. Sprite pivot normalized [0..1] within stored cropped sprite bounds, with original source offset and size persisted. Hierarchical local transforms multiply through parents; one root, no cycles, no orphan parts. Flip separate from scale; fixed coordinate convention across browser and export.
## Rig
Rig nodes hold id, parent_id, sprite_asset_version_id, pivot, local position/rotation/scale, draw order, joint constraints; support arbitrary parts beyond humanoid but MVP proves humanoid. Foreground/back hair, clothes, sleeves and hidden geometry require layered sprites. Rotating cutout cannot invent occluded anatomy: use replacement sprite angle/variant, manually repaired assets or later optional deformations. Do not promise perfect auto cuts.
## Pose behavior
Pose preset stores part-local transforms keyed by compatible rig id/signature; applying a pose modifies only selected scene instance. FK shoulder moves elbow/hand; constraints prevent impossible angles; manual override remains possible within editor policy. Pose mode distinct from whole-object move mode.
## Facial expressions
Face sprites are reusable prebuilt character-specific packs, not full body regeneration. Support whole-face replacement AND optional modular eyes/eyebrows/mouth/extras; curated preset links compatible components and view angle. Allow full-image expression import if parsing is imperfect. Baseline functional >=5 presets in Phase 4; target library 20–30 curated variants later, with intensity/gaze when supplied. Missing angle/part must show unavailable rather than substitute incompatible assets.
## Acceptance
Swap Shocked→Neutral instant visually, no limb movement; panel A face changes while panel B stays unchanged; pose can be saved and reapplied; tests cover nested transforms and occlusion at joints.
