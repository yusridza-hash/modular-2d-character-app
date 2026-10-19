# Roadmap Detail — Modular 2D Character / Sprite Composer

**Tujuan akhir:**  
User masukkan karakter multi-angle → App semi-otomatis pecah jadi sprite modular → User bisa menyusun, mempose, ganti ekspresi, flip, dan pakai background berulang untuk membuat scene/comic panel yang konsisten.

Dokumen terkait:
- [FEATURES.md](./FEATURES.md) — Daftar fitur lengkap
- [TECH_STACK.md](./TECH_STACK.md) — Teknologi & arsitektur
- [SPRITE_PIPELINE.md](./SPRITE_PIPELINE.md) — Cara sprite dibuat dari gambar

---

## Phase 0: Persiapan & Fondasi (1–2 minggu)
**Target jelas:**
- Repo & struktur project siap
- Tech stack final dipilih
- JSON schema Character Project & Scene Project selesai
- Environment development jalan (frontend + FastAPI dummy)
- Riset model: BiRefNet/RemBG, Human Parsing, SAM2 sudah diuji di local/Colab

**Deliverable:**
- Folder struktur project
- `schema/character.json` & `schema/scene.json`
- Script uji coba background removal + parsing sederhana

---

## Phase 1: Character Ingestion & Multi-View Management (2–3 minggu)
**Target jelas:**
- User bisa buat Character Project baru
- Upload 2–6 gambar angle
- Tagging sudut (manual dulu)
- Preview grid semua angle
- Data tersimpan rapi (local storage / folder)

**Fitur wajib selesai:**
- CRUD Character Project
- Upload & preview multi-image
- Basic metadata

**Belum perlu:** segmentation

---

## Phase 2: Auto Segmentation & Sprite Breaking (3–5 minggu) — **Paling Kritis**
**Target jelas:**
- Dari 1 gambar front → berhasil keluar beberapa sprite terpisah (head, body, arms, legs) + metadata.json
- Ada UI koreksi mask (brush add/subtract)
- Pivot point bisa diatur
- Hasil bisa di-preview sebagai karakter yang dirakit ulang sederhana

**Yang harus jalan:**
1. Background removal
2. Human parsing → mask per bagian
3. Crop + export PNG transparent
4. Tools koreksi manual dasar
5. Simpan struktur folder sprite + metadata

**Sukses criteria:**
- 1 karakter front view bisa dipecah dan dirakit ulang dengan kesalahan minimal setelah koreksi manual ringan.

---

## Phase 3: Modular Character Composer (3–4 minggu)
**Target jelas:**
- Canvas editor yang bisa load hasil Phase 2
- Drag, rotate, scale, flip setiap bagian
- Layer order bisa diubah
- Pivot point berfungsi (bagian berputar di titik yang benar)
- Bisa simpan & load Pose
- Switch Front ↔ Side (kalau side sudah ada)

**Sukses criteria:**
- User bisa merakit karakter dan membuat 3–5 pose berbeda dengan nyaman.

---

## Phase 4: Expression & Variant System (2–3 minggu)
**Target jelas:**
- Library ekspresi per karakter
- Ganti ekspresi dengan 1 klik
- Support upload ekspresi baru
- (Opsional) Outfit layer sederhana

**Sukses criteria:**
- Karakter yang sama bisa menampilkan minimal 5 ekspresi berbeda tanpa merusak bagian lain.

---

## Phase 5: Scene Composer & Background (2–3 minggu)
**Target jelas:**
- Upload & kelola background
- Taruh 1–lebih karakter modular ke scene
- Atur posisi, skala, depth
- Tambah text bubble sederhana
- Export PNG final

**Sukses criteria:**
- Bisa membuat 1 panel comic lengkap (background + 1–2 karakter + bubble) dan di-export.

---

## Phase 6: Polish & QoL (2–4 minggu)
- Undo/Redo solid
- Keyboard shortcuts
- Batch process
- Export sprite sheet
- Consistency warning antar angle
- UI/UX polish + dark mode

---

## Phase 7: Advanced (Opsional)
- Auto generate angle yang kurang
- Simple animation (blink, idle)
- Integrasi ComfyUI untuk generate ekspresi baru
- Collaborative / cloud sync

---

## Ringkasan Prioritas & Estimasi

| Phase | Fokus Utama                      | Estimasi | Prioritas      | Sukses Criteria Utama                      |
|-------|----------------------------------|----------|----------------|--------------------------------------------|
| 0     | Setup + Schema + Riset Model     | 1-2 mg   | Tinggi         | Environment & schema siap                  |
| 1     | Upload Multi-Angle               | 2-3 mg   | Tinggi         | Bisa kelola project + gambar angle         |
| 2     | Segmentation → Sprite            | 3-5 mg   | **Sangat Tinggi** | 1 gambar → sprite modular + koreksi mask |
| 3     | Composer Modular                 | 3-4 mg   | **Sangat Tinggi** | Bisa pose karakter dengan nyaman         |
| 4     | Ekspresi                         | 2-3 mg   | Tinggi         | 5+ ekspresi per karakter                   |
| 5     | Scene + Background               | 2-3 mg   | Tinggi         | 1 panel comic bisa di-export               |
| 6     | Polish                           | 2-4 mg   | Sedang         | App terasa nyaman dipakai                  |

---

*Update terakhir: penyusunan fitur, tech stack, dan pipeline sprite agar target tiap phase lebih jelas.*
