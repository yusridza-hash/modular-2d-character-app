# 07 — Data Schema (Ringkas)

Schema lengkap akan diisi di Phase 0. Di bawah ini kontrak minimum.

## Character Project

```json
{
  "id": "char_luna",
  "name": "Luna",
  "reference_height_px": 1600,
  "angles": {
    "front": {
      "parts": {
        "body": {
          "file": "body.png",
          "pivot": [0.5, 0.2],
          "parent": null,
          "layer": 5
        },
        "upper_arm_l": {
          "file": "upper_arm_l.png",
          "pivot": [0.8, 0.1],
          "parent": "body",
          "layer": 6,
          "constraints": { "min_deg": -60, "max_deg": 120 }
        }
      }
    }
  },
  "expressions": [{ "id": "smile", "file": "expressions/smile.png" }],
  "poses": [{ "id": "idle", "parts": { "upper_arm_l": { "rotation": 10 } } }]
}
```

## Scene

```json
{
  "id": "scene_01",
  "background_id": "bg_street_night",
  "ground_line_y": 0.82,
  "characters": [
    {
      "character_id": "char_luna",
      "pose_id": "idle",
      "expression_id": "smile",
      "view": "front",
      "x": 0.4,
      "y": 0.82,
      "scale": 1.0,
      "flip": false,
      "shadow": true
    }
  ],
  "bubbles": []
}
```

Perubahan schema **wajib** update file ini (Build Rule #8).
