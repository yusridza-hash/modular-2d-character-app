# 02 — Tech Stack & Integrasi Open Source

## Frontend

| Komponen | Pilihan | Lisensi | Keterangan |
|----------|---------|---------|----------|
| Framework | Next.js atau React + Vite | MIT | App Router Next.js disarankan |
| Canvas | Konva.js + react-konva | MIT | Transform, group, layer mudah |
| UI | Tailwind + shadcn/ui | MIT | Konsisten & cepat |
| State editor | Zustand | MIT | Ringan untuk canvas state |

## Backend

| Komponen | Pilihan | Lisensi | Keterangan |
|----------|---------|---------|----------|
| API | FastAPI | MIT | Async, mudah integrasi Python CV |
| Task panjang | BackgroundTasks / RQ / Celery | - | Segmentation bisa > beberapa detik |

## Computer Vision & AI (Open Source)

| Fungsi | Model / Library | Lisensi | Catatan |
|--------|-----------------|---------|--------|
| Background removal | BiRefNet / RemBG / BRIA RMBG | Apache / BSD-ish | Pilih yang paling stabil di uji |
| Body parsing | Human Parsing (SCHP / setara modern) | Cek per model | Label per bagian tubuh |
| Segment refine | SAM2 (Meta) | Apache 2.0 | Point/box prompt + refine mask |
| Face parsing | BiSeNet-based / modern face parsing | Cek per model | Untuk ekspresi |
| Pose/joint bantu | RTMPose / MediaPipe | Apache / lain | Bantu usul pivot & joint |
| Image process | OpenCV, Pillow, NumPy | BSD / MIT | Crop, morph, resize |

## Integrasi Cara Kerja

```
Frontend (Konva)
    ↔ HTTP/JSON →
FastAPI
    → panggil pipeline Python:
         1. RemBG / BiRefNet
         2. Human Parsing
         3. SAM2 refine (opsional)
         4. OpenCV post-process
         5. Tulis PNG + metadata.json
    ← kembalikan path / URL hasil
```

- Model dijalankan **lokal** atau di worker GPU (Colab/RunPod hanya untuk dev jika perlu).
- Jangan bergantung pada API berbayar untuk path kritis (segmentation & posing).

## Yang Sengaja Dihindari di Core

- Closed model tanpa bobot open sebagai satu-satunya jalan.
- Engine berbayar (Spine Pro, Live2D berbayar) sebagai dependensi wajib — boleh jadi inspirasi, bukan requirement.
