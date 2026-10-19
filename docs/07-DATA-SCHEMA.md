# 07 — Data Schema (Aplikasi + Mapping DB)

Schema logika aplikasi. **Sumber kebenaran production** jika pakai Supabase: lihat [08-DATABASE-SUPABASE.md](08-DATABASE-SUPABASE.md).

API / frontend boleh mengirim/menerima bentuk JSON di bawah; backend memetakan ke tabel.

## Character (response API / export)

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

## Mapping cepat → Supabase

| JSON field | Tabel |
|------------|--------|
| character root | `characters` |
| angles + parts | `character_angles` + `character_parts` |
| expressions | `character_expressions` |
| poses | `character_poses` |
| scene | `scenes.data` + `backgrounds` |

Perubahan kontrak JSON atau tabel **wajib** update file ini dan `08-DATABASE-SUPABASE.md`.
