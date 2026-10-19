# Overview — Comic/Image Only
Modular 2D Studio is a desktop-first web editor for static comic panels and images. It is **not** a video/animation tool. Reusable sprites, face expression packs and manual body rigging preserve character consistency.
## Core workflow
Import AI/multi-angle image → segment/correct sprite → configure rig/pivot/constraints → save pose and face expressions → search Library → drag/drop character on Comic Canvas → manipulate rig body manually → one-click swap facial sprite expression → add background/props/dialogue → live automatic shadow, tone and occlusion blend → final PNG export and save/edit later.
## Main UX
Left library stays available while central Canvas and right contextual Inspector are visible; bottom page/panel strip replaces any proposed timeline. Every drop creates an independent instance pinned to character/asset versions. Master source never modified by scene edits.
## Core docs
See [canonical index](BUILD-SPEC-INDEX.md), [product](product/PRODUCT-SPEC.md), [UI](design/UI-UX-SPEC.md), [character](architecture/CHARACTER-RIG-AND-EXPRESSION.md), [blending](architecture/SCENE-CANVAS-BLENDING.md) and [database](08-DATABASE-SUPABASE.md).
