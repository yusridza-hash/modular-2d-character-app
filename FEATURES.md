# Fitur Lengkap Aplikasi

## 1. Character Project Management

- Buat project karakter baru (nama, deskripsi, tags)
- Upload / import gambar dari beberapa angle:
  - Front
  - Side Left
  - Side Right
  - Back
  - 3/4 Left
  - 3/4 Right
- Auto / manual tagging sudut gambar
- Preview grid semua angle
- Edit metadata karakter
- Hapus / duplikasi project

## 2. Sprite Extraction Pipeline (Inti)

### Input
- Satu atau lebih gambar karakter (multi-angle)
- Opsional: user bisa kasih hint (klik area kepala, badan, dll)

### Proses Otomatis
1. **Background Removal**
   - Hapus background jadi transparent
2. **Human / Body Parsing**
   - Deteksi dan buat mask untuk:
     - Head / Face
     - Hair (front & back)
     - Torso / Body
     - Upper Arm L / R
     - Lower Arm L / R
     - Hand L / R (opsional)
     - Upper Leg L / R
     - Lower Leg L / R
     - Feet (opsional)
3. **Face Parsing** (untuk sistem ekspresi)
   - Eyes, eyebrows, mouth, nose, dll
4. **Mask Refinement**
   - Smooth edge
   - Hapus noise kecil
5. **Crop & Export**
   - Setiap bagian jadi PNG transparent terpisah
   - Simpan posisi & ukuran relatif (untuk reassembly)

### Tools Koreksi Manual
- Brush add / subtract mask
- Erase / restore area
- Merge dua bagian
- Split bagian
- Adjust bounding box & pivot point
- Preview real-time hasil potongan

### Output
Folder sprite modular per angle:
```
character_name/
  front/
    head.png
    hair_front.png
    hair_back.png
    body.png
    arm_upper_l.png
    arm_upper_r.png
    arm_lower_l.png
    arm_lower_r.png
    leg_upper_l.png
    leg_upper_r.png
    leg_lower_l.png
    leg_lower_r.png
    metadata.json          # posisi, pivot, layer order
  side/
    ...
  expressions/
    neutral.png
    smile.png
    angry.png
    ...
```

## 3. Modular Character Composer

- Canvas editor dengan layer system
- Drag, rotate, scale, flip horizontal setiap bagian
- Pivot point per bagian (bisa diubah)
- Layer order yang bisa diubah (z-index)
- Snap to joint (bahu, siku, pinggang, lutut) — semi otomatis
- Simpan & load Pose
- Switch view (Front ↔ Side) dengan mapping bagian yang sesuai
- Zoom, pan, grid, ruler
- Undo / Redo

## 4. Expression System

- Library ekspresi per karakter
- Ganti hanya bagian wajah / mata+mulut
- Upload ekspresi baru (dari generate AI atau gambar manual)
- One-click apply ekspresi ke karakter yang sedang di-compose
- Preview ekspresi sebelum apply

## 5. Outfit / Clothing Variant

- Layer pakaian terpisah (bisa diganti)
- Support multiple outfit set
- Tint / recolor sederhana (opsional)

## 6. Scene Composer

- Library Background (upload + tag: lokasi, waktu, mood)
- Taruh 1 atau lebih karakter modular ke dalam scene
- Atur posisi, skala, depth (depan/belakang)
- Tambah text bubble / dialog box
- Guide panel comic (grid 1x1, 2x2, dll)
- Export:
  - PNG final
  - PNG dengan layer terpisah (opsional)
  - JSON scene data

## 7. Utility & Quality of Life

- Batch process beberapa karakter
- Export full sprite sheet
- Consistency check antar angle (ukuran proporsi)
- Keyboard shortcuts
- Dark / Light mode
- Auto-save project
