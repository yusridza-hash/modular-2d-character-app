# Comic Production / Scene Instance and Page Contract
## Separation
Asset Creation Layer (Character Studio, sprite repair, rig, expressions, props/backgrounds) → Asset Registry/Library → Comic Production Layer (panels, instances, scene composer) → Publishing Layer (static PNG/WebP and optional PDF).
## Identity
CharacterMaster logical identity; CharacterVariant for angle/outfit; immutable AssetVersion; independent CharacterInstance on each panel with own transform, pose joint overrides, facial expression preset, layer, blend style. PanelSnapshot pins all version IDs and never mutates Library master. Asset re-publish must not silently update published panels.
## Page/panel model
Project → Chapter optional → Page → Panel → Scene document → ordered object instances. Panel content independent of page layout; rearranging/reflowing panels preserves scene references. Page layout supports grid/gutters/margins/read direction, later irregular borders. Static image exports only; no timeline/video.
## Commands
Drop asset, duplicate instance, copy/paste pose, copy/paste expression, clone panel, reorder panel, set background/crop, attach prop to rig anchor, change z order, apply blend preset, add speech bubble, undo/redo. All commands transactional, schema validated and undoable at document scope.
## Acceptance
Same Arlo source in three panels can have three different poses/expressions/outfits without interference, clone panel retains pins, copying panel to a different page retains content, export/reopen produce same result.
