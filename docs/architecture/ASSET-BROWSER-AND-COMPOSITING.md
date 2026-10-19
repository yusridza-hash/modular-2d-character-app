# Smart Asset Library, Character Compositing, Props and Background Layers
## Smart Asset Browser
Persistent searchable, dockable panel next to Comic Canvas. Filter Characters, Backgrounds, Props, Expressions, Poses, Layouts and Bubble Templates. Metadata tags, synonyms, compatible-rig/view filters, favorites, recent/frequent, thumbnails and Published/Incomplete status. Search 'sitting' can match pose, chair, table by explicitly indexed tags (not presumed AI search). Drag shows ghost preview; accessible click Add to Canvas fallback. Character assets resolve pinned rig/sprite/expression versions before insertion.
## Composite Character Rendering
Single CharacterInstance with internal rig scenegraph and ordered sprite part layers. Object Mode treats instance as one selectable object; Pose Mode exposes pivot/joint controls. Applying per-character tint, alpha, shadow and blending must not recolor source sprites. A render adapter separates scene-data format from Konva implementation; caching/flattening allowed for idle composite display, invalidated upon pose/expression change; avoid cache explosion and test memory.
## Prop attachments
Attachment point on rig node, e.g. hand anchor; prop follows transformed joint, retains local rotate/offset override, detachable without losing reference. Hit testing, z-order front/behind hand, and copy/paste behavior specified.
## Background scene decomposition
Accept plain single bitmap as baseline. Optional independent background, midground, foreground/occluder and ground/contact guides. Foreground masks or manually-defined foreground props occlude character. Optional automatic segmentation requires human correction and can NEVER block manual composition. Per-layer scaling/crop and mask provenance versioned.
## Editor and render neutrality
One source scene schema independent of rendering library. Select Konva as provisional editor rendering adapter, but prove with representative multi-sprite characters + layered masks + shadow + PNG export before lock; do not integrate two graphics engines by default. Export/preview share effects and pinned versions, quality may differ but composition must not.
## Acceptance
Drag/drop, rapid character pose and expression swap, isolated character tone compositing, chair sitting with front table occluding legs, prop follows hand, correct foreground grass occlusion, visible blend in preview and consistent static PNG.
