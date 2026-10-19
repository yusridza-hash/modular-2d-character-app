# 00 — Overview Aplikasi

## Masalah yang Diselesaikan

Karakter AI sering tidak konsisten antar scene karena setiap generate adalah dari nol.  
Solusi: **pecah karakter menjadi sprite modular**, lalu susun ulang secara deterministic.

## Alur Pengguna (End-to-End)

1. User generate / siapkan gambar karakter dari beberapa angle.
2. Upload ke app → app semi-otomatis pecah jadi bagian (kepala, badan, lengan, kaki, rambut…).
3. User koreksi mask & pivot point jika perlu.
4. User susun & pose karakter di Composer (gerakan natural).
5. User pilih/ganti ekspresi & outfit.
6. User taruh karakter ke Scene + background + bubble.
7. Export panel comic / PNG.

## Modul Utama

| Modul | Fungsi | Dokumen |
|-------|--------|--------|
| Character Ingestion | Upload & kelola multi-angle | roadmap/phase-1.md |
| Sprite Pipeline | Gambar → sprite modular | docs/03-SPRITE-PIPELINE.md |
| Posing System | Gerakan manual natural | docs/04-POSING-SYSTEM.md |
| Blending & Scale | Menyatu ke background, ukuran benar | docs/05-BLENDING-AND-SCALE.md |
| Assets & Scene | Background, props, bubble, export | docs/06-ASSETS-AND-SCENE.md |
| Data Schema | Format JSON semua entity | docs/07-DATA-SCHEMA.md |

## Aturan Build

Semua kode dan integrasi **wajib** mengikuti [docs/01-BUILD-RULES.md](01-BUILD-RULES.md).
