# 05 — Blending ke Background & Skala (Supaya Tidak Kaku)

Masalah umum: karakter “tempel” di background, ukuran tidak masuk akal, kaki melayang, warna tidak nyatu.

## 1. Sistem Skala Konsisten

- Tentukan **reference height** karakter (mis. 1600 px = tinggi penuh karakter default).
- Di scene, karakter punya `scale` dan opsional `world_height`.
- Background punya metadata perkiraan horizon / ground line.
- Aturan: kaki karakter menempel **ground line** scene (snap atau guide).

## 2. Contact & Shadow

- **Contact shadow** sederhana di bawah kaki (ellipse lembut, opacity rendah).
- Opsional: shadow mengikuti arah cahaya scene (arah + panjang shadow bisa di-set per background).
- Jangan biarkan karakter tanpa contact shadow di MVP scene — langsung terasa melayang.

## 3. Blending Warna / Light (Ringan)

- Opsional Phase 5+: color grade ringan (brightness/contrast/hue match ke background).
- Jangan over-process sampai karakter rusak; cukup agar tidak “cutout kertas”.

## 4. Depth & Layer Scene

- Urutan: background → props jauh → karakter → props dekat → UI bubble.
- Multiple karakter: atur z-index manual atau berdasarkan posisi Y (lebih bawah = lebih depan).

## 5. Ukuran di Panel Comic

- Guide panel (1x1, 2x1, dll) + safe margin.
- Karakter penting jangan terlalu kecil/besar tanpa kontrol; sediakan preset “close-up / medium / full body”.

## Definition of Done Terkait

- Scene export tidak menampilkan karakter dengan kaki melayang tanpa shadow.
- Skala antar panel bisa diulang dengan nilai `scale` yang sama.


## Comic-only build alignment (2026-10-19)
Refer to docs/BUILD-SPEC-INDEX.md and canonical UI/rig/blending/versioning/testing contracts. This phase must not add timeline, animation, sound, FPS or video. Character library drag-drop is scene instance based, facial presets are swappable, and scene preview/final export must follow same compositing specification. DoD needs demonstrated tests; documentation alone does not complete phase.

Preview applies lightweight auto contact shadow, conservative tone and edge match, occlusion; final PNG export uses same persisted effects at high resolution. No hidden generative reinterpretation at export. See architecture/SCENE-CANVAS-BLENDING.md.
