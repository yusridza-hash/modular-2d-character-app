# Static Scene Canvas, Layers and Blend Rendering
## Data model
Project→Page→Panel. Each panel has background version/reference, viewport/crop, ordered scene object instances (character/prop/bubble/foreground), and effects. A character instance references pinned character/rig/expression asset versions plus pose local overrides, transform, view, render style. No timeline/time properties.
## Layer composition
Background → depth/background overlays → contact shadows → behind-character props → character back layers → character body/face layers → foreground props and occlusion masks → bubbles/text → final scene-level color treatment (exclude UI guides from export). Z-order can be user overridden; depth-by-Y optional, never silently reorder pinned layers.
## Drag-drop defaults
On drop create instance, choose default view/pose/neutral expression; snap foot anchor to ground guide when available, allow manual override. Generate contact shadow beneath contact points, not always just one oval at character bounding-box center; allow seated or lying contact zones. Auto layer and background scene-fit preset; missing guides use conservative fallback and warning, NOT fake certainty.
## Hybrid preview/render
Preview during editing applies effects automatically using same deterministic scene document as final export: ground placement, simple soft contact shadow, lightweight tone/tint match, color grade, lightweight edge integration, masks/occlusion. Export rerenders at requested full image resolution with high-quality resampling, anti-alias, precise masks/shadows and text; should look consistent with preview. Never perform a hidden generative re-imagination during export.
Preview prioritizes responsiveness; export prioritizes fidelity. Quantify preview-export tolerances and visually compare test fixtures. Effects saved with scene instance/preset version; no destructive image changes.
## Inspector fields
Auto Blend on/off; Ground Snap; Contact Shadow enabled/opacity/blur/shape/offset; Tone Match enabled/strength/brightness/contrast/saturation/tint; Edge Preserve/Softness (protect deliberate ink outlines); Layer/Depth, foreground occlusion mask, Light Match auto/manual. Default uses background blend preset, editable per character and copyable across panels. Blending must never flatten or recolor original sprite file.
## Output
PNG first, transparent output optional, later WebP and page export. Save editable panel document plus immutable export render metadata (size, engine version, source revision).
## Acceptance
Duplicate character in two panels with different expressions/shadows; load and edit; foreground grass occludes legs correctly; exports correspond to preview; shadows align with feet even when character scale changes. Background preset applies to new drops but does not rewrite previously published panels.
