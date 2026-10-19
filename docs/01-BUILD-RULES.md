# 01 — Build Rules (Wajib Dipatuhi)

Aturan ini mengikat semua phase. Melanggar = utang teknis yang harus dibayar nanti.

## 1. Open Source First

- Library & model yang dipakai harus open source atau lisensi permissif (MIT, Apache 2.0, BSD, dll).
- Catat lisensi setiap dependensi di `docs/02-TECH-AND-OSS.md`.
- Jangan pakai model/API berbayar sebagai dependensi inti tanpa alternatif open source.

## 2. Data-Driven, Bukan Hardcode

- Semua karakter, pose, ekspresi, scene disimpan sebagai data (DB + Storage / JSON + file).
- Kode hanya membaca schema yang didefinisikan di `docs/07-DATA-SCHEMA.md` dan `docs/08-DATABASE-SUPABASE.md`.
- Jangan hardcode nama bagian tubuh di banyak tempat — pakai konstanta/enum dari schema.

## 3. Pipeline Sprite Harus Reproducible

- Input yang sama + parameter yang sama = output sprite yang sama.
- Simpan selalu: source asli, source clean (tanpa background), mask, sprite final, metadata.
- Bisa di-reprocess ulang nanti kalau model parsing lebih bagus.

## 4. Posing Wajib Hierarchy + Pivot + Constraint

- Tidak boleh ada bagian yang “free float” tanpa parent (kecuali root).
- Setiap bagian yang bisa diputar wajib punya pivot point.
- Joint utama (siku, lutut, bahu) wajib punya constraint sudut minimal.
- Detail: `docs/04-POSING-SYSTEM.md`.

## 5. Skala & Blending Tidak Boleh Diabaikan

- Karakter di scene harus punya sistem unit/skala yang konsisten (mis. pixels-per-meter atau reference height).
- Blending ke background (shadow, contact, color grade ringan) wajib ada di Phase 5+.
- Detail: `docs/05-BLENDING-AND-SCALE.md`.

## 6. UI Koreksi Manual Selalu Tersedia

- Segmentation tidak akan sempurna. Selalu sediakan brush add/subtract mask + edit pivot.
- Jangan buat pipeline “fully automatic only” tanpa jalan keluar manual.

## 7. Phase Selesai Hanya Jika Kriteria Terpenuhi

- Setiap phase punya file `roadmap/phase-X.md` dengan **Definition of Done**.
- Jangan loncat phase sebelum DoD sebelumnya terpenuhi (kecuali dicatat sebagai exception).

## 8. Commit & Dokumentasi

- Perubahan schema data / database harus update `docs/07-DATA-SCHEMA.md` dan `docs/08-DATABASE-SUPABASE.md` di commit yang sama.
- Fitur baru yang mengubah cara pose/blend harus update dokumen terkait.

## 9. Performa & Ukuran Aset

- Sprite per bagian diusahakan wajar (hindari 4K untuk satu lengan).
- Canvas editor harus tetap responsif untuk 1–3 karakter di satu scene pada hardware target.

## 10. Bahasa & Naming

- Kode: English (variable, function, class).
- Dokumentasi user-facing bisa Indonesia.
- Nama file sprite: `snake_case` (`upper_arm_l.png`).

## 11. Database & Storage (Supabase)

- Metadata & relasi → PostgreSQL (Supabase).
- File gambar → Supabase Storage (bukan bytea di DB).
- RLS: user hanya akses data sendiri (`owner_id = auth.uid()`).
- Path Storage mengikuti konvensi di `docs/08-DATABASE-SUPABASE.md`.
- Migration wajib versioned; jangan ubah enum production tanpa migration data.


## 12. Current Product Lock (2026-10-19)
This is a static COMIC/IMAGE-only editor. No video, animation timeline, FPS, motion clips, sound, video encoding, or related UI. Required everyday workflow: always-accessible searchable asset Library + central Comic Canvas + contextual right Inspector + compact page/panel strip. Character drop creates independent instance, movable and manually posable; prebuilt face-expression sprites swap immediately without altering the body. Layering and blend preview auto-run on placement, with high-fidelity same-document PNG export. Library master remains immutable. Current detailed rules: docs/BUILD-SPEC-INDEX.md and linked specifications. Older examples are noncanonical if contradictory.
