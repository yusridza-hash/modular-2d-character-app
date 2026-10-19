# 03 — Sprite Pipeline (Gambar → Sprite Modular)

## Tujuan

Satu set gambar multi-angle → folder sprite per bagian + metadata (pivot, parent, layer, bbox).

## Langkah

1. **Validasi input** — resolusi, format, angle tag.
2. **Background removal** — hasil `source_clean.png` (RGBA).
3. **Body parsing** — label map (head, hair, torso, arms, legs…).
4. **Refine mask** — SAM2 + morphological OpenCV.
5. **Face parsing** (opsional di phase awal) — region kepala.
6. **Crop per bagian** — PNG transparent + padding.
7. **Pivot & parent** — isi metadata (bisa diedit user).
8. **Koreksi manual** — brush mask, geser pivot, merge/split.
9. **Simpan** — struktur folder + `metadata.json`.

## Struktur Output (Contoh)

```
characters/luna/
  source/
    front.png
    side.png
  clean/
    front.png
  front/
    head.png
    hair_front.png
    hair_back.png
    body.png
    upper_arm_l.png
    lower_arm_l.png
    upper_arm_r.png
    lower_arm_r.png
    upper_leg_l.png
    lower_leg_l.png
    upper_leg_r.png
    lower_leg_r.png
    metadata.json
  expressions/
    neutral.png
    smile.png
```

## Aturan Kualitas

- Mask boleh dikoreksi user; jangan anggap 100% otomatis.
- Pivot lebih penting daripada mask sempurna.
- Source asli + clean + mask disimpan agar bisa reprocess.

Lihat juga: [01-BUILD-RULES.md](01-BUILD-RULES.md) poin 3 & 6.
