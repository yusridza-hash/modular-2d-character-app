# Modular 2D Character / Sprite Composer App

Aplikasi untuk mengubah karakter AI-generated (multi-angle) menjadi **sprite modular 2D** yang bisa disusun, dipose, diganti ekspresi, di-flip, dan digabungkan dengan background untuk membuat scene/comic panel yang konsisten.

## Konsep Utama

1. User generate karakter dari beberapa sudut (depan, samping, belakang, 3/4).
2. App memecah gambar tersebut menjadi bagian-bagian sprite (kepala, rambut, badan, lengan, kaki, dll).
3. User menyusun ulang karakter secara modular, mengatur pose, ekspresi, dan view.
4. Background bisa di-reuse berulang kali.
5. Hasilnya konsisten karena asetnya fixed, bukan di-generate ulang setiap kali.

## Roadmap

Lihat file [ROADMAP.md](./ROADMAP.md) untuk detail lengkap setiap phase.

## Status

- [x] Perencanaan & Roadmap
- [ ] Phase 0 - Setup
- [ ] Phase 1 - Character Ingestion
- [ ] Phase 2 - Auto Segmentation
- [ ] Phase 3 - Modular Composer
- [ ] Phase 4 - Expression System
- [ ] Phase 5 - Scene Composer
- [ ] Phase 6 - Polish

## Tech Stack (Rencana)

- **Frontend:** React / Next.js + Canvas (Fabric.js / Konva.js)
- **Backend:** Python (FastAPI)
- **AI Engine:** ComfyUI / diffusers + SAM2 + Human Parsing
- **Storage:** Local folder → nanti cloud

---

Dibuat untuk kebutuhan pembuatan comic/scene dengan karakter yang benar-benar konsisten.
