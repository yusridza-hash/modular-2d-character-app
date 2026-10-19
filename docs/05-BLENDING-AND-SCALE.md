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
