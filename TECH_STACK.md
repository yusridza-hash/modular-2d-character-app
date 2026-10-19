# Technology Stack & Arsitektur

## Frontend
- **Framework:** Next.js 14/15 (App Router) atau React + Vite
- **Canvas Engine:** 
  - Konva.js / react-konva (lebih ringan & bagus untuk transform)
  - atau Fabric.js
- **UI:** Tailwind CSS + shadcn/ui atau Radix
- **State:** Zustand atau Jotai (untuk editor state yang kompleks)
- **File Handling:** browser File API + drag & drop

## Backend
- **API:** FastAPI (Python)
- **Task Queue (opsional):** Celery / RQ / atau sederhana dengan background task FastAPI
- **File Storage:** 
  - Development: local folder
  - Production: S3-compatible (Cloudflare R2 / MinIO / Supabase Storage)

## AI / Computer Vision Pipeline

| Fungsi                    | Model / Library                          | Keterangan |
|---------------------------|------------------------------------------|----------|
| Background Removal        | BiRefNet / RemBG / BRIA RMBG             | Cepat & akurat |
| Body Part Segmentation    | Human Parsing (SCHP / Graphonomy / modern) + SAM2 | Mask per bagian tubuh |
| Face Parsing              | Face parsing model (BiSeNet-based / modern) | Untuk ekspresi |
| Mask Refinement           | OpenCV morphological + custom            | Rapikan tepi |
| Pose Detection (bantuan)  | RTMPose / OpenPose / MediaPipe           | Bantu deteksi joint & pivot |
| Optional AI Generate      | ComfyUI / diffusers (PuLID, InstantID)   | Generate ekspresi / angle tambahan |

## Data Format

### Character Project (JSON)
```json
{
  "id": "char_001",
  "name": "Luna",
  "created_at": "...",
  "angles": {
    "front": {
      "source_image": "front.png",
      "sprites": {
        "head": { "file": "head.png", "pivot": [0.5, 0.9], "bbox": [...] },
        "body": { ... }
      }
    },
    "side": { ... }
  },
  "expressions": [
    { "id": "smile", "file": "expressions/smile.png" }
  ],
  "outfits": [],
  "poses": []
}
```

### Scene Project (JSON)
```json
{
  "id": "scene_001",
  "background": "bg_rainy_street.png",
  "characters": [
    {
      "character_id": "char_001",
      "pose_id": "standing_01",
      "expression_id": "neutral",
      "x": 120,
      "y": 80,
      "scale": 1.0,
      "flip": false,
      "view": "front"
    }
  ],
  "bubbles": []
}
```

## Arsitektur Sederhana

```
[Frontend Canvas Editor]
        ↔→
[FastAPI Backend]
        ↔→
[AI Worker]
  - Background Removal
  - Human Parsing + SAM2
  - Face Parsing
  - Mask post-process
        ↔→
[File Storage]
```

## Prioritas Implementasi Teknologi

1. **Phase 1-2:** Fokus pipeline segmentation (paling kritis)
2. **Phase 3:** Canvas composer (Konva/Fabric)
3. **Phase 4-5:** Expression + Scene
4. Baru optimasi & automation lanjutan
