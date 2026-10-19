# 06 — Aset Tambahan & Scene Composer

## Jenis Aset

| Jenis | Contoh | Keterangan |
|-------|--------|----------|
| Character sprites | Hasil pipeline | Modular + metadata |
| Expressions | smile, angry, … | Ganti bagian wajah / full face |
| Outfits | layer pakaian | Opsional |
| Backgrounds | lokasi, waktu, mood | + ground line + light direction |
| Props | meja, pohon, item | Bisa di-layer depan/belakang karakter |
| Bubbles | dialog, thought | Template + teks |

## Scene Composer — Fitur Wajib

- Pilih background dari library.
- Letakkan 1+ karakter (pose + ekspresi + scale + flip + view).
- Snap ke ground line.
- Contact shadow on/off.
- Props opsional.
- Text bubble (posisi, ekor, teks).
- Export PNG (dan simpan scene JSON).

## Agar Tidak Ada Masalah Umum

1. **Skala** — pakai sistem di `05-BLENDING-AND-SCALE.md`.
2. **Konsistensi karakter** — hanya pakai sprite dari Character Project, jangan generate ad-hoc di scene.
3. **File hilang** — scene JSON hanya menyimpan ID + transform; file PNG tetap di folder karakter/background.
4. **Revisi** — ubah pose di Character Composer → scene yang referensi pose_id bisa di-refresh (desain data harus mendukung).

## Export

- PNG final (flatten).
- Opsional: data scene JSON untuk edit ulang.
