# UI/UX — Comic Workspace
## Navigation
Home/Projects → Comic Editor, Character Studio (Ingestion, Sprite Repair, Rig, Expressions, Pose Presets), Asset Library, Page Manager, Exports, Settings. NO Animation/Timeline Studio.
## Standard comic editor
Top bar: project + page + panel breadcrumb, save status, undo/redo, export.
LEFT resizable/collapsible Asset Library default 240–280px: search, categories Characters/Backgrounds/Props/Poses, filters, favorites, thumbnails, drag affordance, loading/empty/error states. Library must stay visible next to canvas during normal composition.
CENTER flexible Canvas: selected panel/page visual output, zoom-to-pointer, space-drag pan, selection bounding box, transform gizmos, drag/drop preview ghost, snap lines, context menu.
RIGHT resizable/collapsible Inspector default 280–320px: selected object identity, position/scale/rotation, layer, visibility/lock; for characters quick facial expression thumbnail grid, view/outfit selector, pose preset, Edit Joints, Blend & Scene Fit settings; for props anchors/layers; for bubbles text/tail/style.
BOTTOM compact Page/Panel strip 100–140px, NOT video timeline: ordered panel thumbnails, duplicate panel, navigate pages, change panel composition.
Desktop-first, target 1280x720 minimum (test usability), 1920x1080 comfortable. Collapsing panels must give canvas maximum space.
## Modes
Object mode default: click/select, drag object, resize, rotate, reorder; double-click character enters Pose mode: show rig handles, FK dragging by joints; escape exits. Face swap always reachable in Inspector without navigating away. Manual pivot edits confined to Character Studio rig editor unless explicitly advanced.
## Drag and drop contract
Library drag begins asset payload with stable asset_id + selected_version; hover canvas shows placement preview; drop adds ONE new instance at pointer-local scene coordinates with default view/pose/neutral face and scene blend preset. If background is dropped: choose set/replace background, not arbitrary character instance. Failure returns understandable error; never add half-created objects. Drag must support pointer and keyboard-accessible Add to Scene alternative.
## History, persistence
Command-based undo/redo for structure and transforms (including swap and blend); draft autosave debounced with explicit saved/syncing/failed indicator; reload last successfully persisted draft; no silent data loss. Delete and update master warn about dependencies. Empty/error/progress states defined.
## Design
Quiet dark-neutral editor; one accent for selection; compact icon toolbar with tooltips; consistent panel padding and typography. Avoid decorative controls or large permanent AI/chat sidebars; AI can open on demand.
