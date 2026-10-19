# Modular 2D Character / Sprite Composer App

**Tujuan akhir:**  
User masukkan karakter multi-angle → App otomatis (semi-otomatis) pecah jadi sprite modular → User bisa menyusun, mempose, ganti ekspresi, flip, dan pakai background berulang untuk membuat scene/comic panel.

---

## Phase 0: Persiapan & Fondasi (1–2 minggu)
**Tujuan:** Menyiapkan pondasi teknis dan keputusan arsitektur.

### Yang harus dilengkapi:
- Tentukan tech stack (contoh rekomendasi):
  - Frontend: React / Next.js + Canvas (Fabric.js atau Konva.js)
  - Backend: Python (FastAPI) + ComfyUI / diffusers sebagai engine AI
  - Storage: Lokal dulu (folder system), nanti bisa Supabase/S3
- Buat struktur folder project yang rapi
- Tentukan format data karakter (JSON schema)
- Riset & uji model:
  - Segment Anything 2 (SAM2)
  - Human Parsing model
  - Face Parsing
  - RemBG / BiRefNet
- Buat dokumen spesifikasi fitur MVP

**Deliverable:**  
Project setup + JSON schema karakter + daftar model yang akan dipakai.

---

## Phase 1: Character Ingestion & Multi-View Management (2–3 minggu)
**Tujuan:** User bisa memasukkan dan mengelola gambar karakter dari berbagai sudut.

### Fitur yang harus ada:
- Upload multiple images (depan, samping kiri, samping kanan, belakang, 3/4)
- Tagging sudut otomatis / manual (user pilih sudut mana)
- Preview semua angle dalam satu halaman
- Simpan sebagai “Character Project”
- Basic metadata: nama karakter, catatan, tanggal

**Deliverable:**  
Bisa buat project karakter baru dan menyimpan beberapa angle dengan rapi.

---

## Phase 2: Auto Segmentation & Sprite Breaking (3–5 minggu) — **Inti Aplikasi**
**Tujuan:** App bisa memecah gambar karakter menjadi bagian-bagian sprite.

### Fitur yang harus dilengkapi:
- Deteksi dan buang background
- Human Parsing (kepala, rambut, badan, lengan kiri/kanan, kaki kiri/kanan)
- Face Parsing (opsional di fase ini)
- Generate mask per bagian
- Potong menjadi sprite terpisah (PNG transparent)
- Preview hasil potongan
- Tools koreksi manual:
  - Brush untuk perbaiki mask
  - Hapus / gabung bagian
  - Sesuaikan posisi & skala
- Simpan hasil sebagai set sprite modular per angle

**Deliverable:**  
Dari 1 set multi-angle → menghasilkan library sprite terpisah yang sudah rapi.

---

## Phase 3: Modular Character Composer (3–4 minggu)
**Tujuan:** User bisa menyusun dan memanipulasi karakter dari sprite modular.

### Fitur wajib:
- Layer system (urutan: rambut belakang → badan → pakaian → lengan → rambut depan → kepala)
- Drag & drop bagian
- Rotate, scale, flip horizontal
- Pivot point per bagian (supaya gerakan natural)
- Simpan “Pose”
- Ganti ekspresi (kalau sudah ada library ekspresi)
- Switch view (Front / Side)
- Zoom & pan canvas

**Deliverable:**  
Bisa merakit karakter dari bagian-bagian dan mengatur pose dasar.

---

## Phase 4: Expression & Variant System (2–3 minggu)
**Tujuan:** Membuat karakter lebih hidup dengan banyak ekspresi dan variasi.

### Fitur:
- Library ekspresi (mata + mulut, atau full face)
- Upload / generate ekspresi tambahan
- One-click ganti ekspresi
- Sistem Outfit / Clothing layer (bisa diganti)
- Warna rambut / aksesoris (opsional tint)
- Simpan “Character State” (pose + ekspresi + outfit)

**Deliverable:**  
Karakter punya banyak ekspresi dan bisa diganti dengan mudah.

---

## Phase 5: Scene Composer & Background System (2–3 minggu)
**Tujuan:** Menyusun panel comic / scene lengkap.

### Fitur:
- Library Background (upload + tagging)
- Taruh multiple karakter dalam satu scene
- Atur depth / layer antar karakter
- Tambah text bubble / dialog
- Grid / guide untuk panel comic
- Export hasil (PNG, PSD layer, atau PDF panel)
- Simpan Scene Project

**Deliverable:**  
Bisa membuat 1 panel comic lengkap dari karakter modular + background.

---

## Phase 6: Polish, Automation & Quality of Life (2–4 minggu)
**Tujuan:** Membuat aplikasi nyaman dipakai jangka panjang.

### Fitur tambahan:
- Batch process (banyak karakter sekaligus)
- Auto-suggest pose dari OpenPose
- Consistency checker antar angle
- Undo / Redo yang kuat
- Shortcut keyboard
- Template pose & ekspresi
- Export sprite sheet siap pakai
- Dark mode + UI yang rapi

---

## Phase 7: Advanced (Opsional - Jangka Panjang)
- Semi-otomatis generate bagian yang kurang dari angle lain
- Simple animation (idle, blink, mouth movement)
- Integrasi langsung dengan ComfyUI / AI generate ekspresi baru
- Collaborative editing
- Marketplace aset (opsional)

---

## Ringkasan Prioritas

| Phase | Fokus Utama                     | Estimasi | Prioritas |
|-------|---------------------------------|----------|---------|
| 0     | Setup & Keputusan               | 1-2 mg   | Tinggi  |
| 1     | Upload & Kelola Multi-Angle     | 2-3 mg   | Tinggi  |
| 2     | Pecah jadi Sprite (Segmentation)| 3-5 mg   | Sangat Tinggi |
| 3     | Composer Modular                | 3-4 mg   | Sangat Tinggi |
| 4     | Ekspresi & Variant              | 2-3 mg   | Tinggi  |
| 5     | Scene + Background              | 2-3 mg   | Tinggi  |
| 6     | Polish                          | 2-4 mg   | Sedang  |

---

*Dokumen ini dibuat berdasarkan diskusi perencanaan aplikasi Modular 2D Character / Sprite Composer.*
