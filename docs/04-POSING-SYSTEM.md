# 04 — Posing System (Gerakan Manual Natural)

## Wajib Ada

1. **Hierarchy** parent-child (body root → head, arms, legs…).
2. **Pivot point** di setiap sendi (bahu, siku, leher, panggul, lutut, ankle).
3. **Constraint** sudut minimal (siku & lutut dulu).
4. **Layer order** (rambut belakang di belakang, lengan bisa pindah layer).
5. **Overlap** kecil di sambungan supaya tidak ada celah.

## Interaksi User

- Select bagian → rotate mengelilingi pivot (FK).
- Anak ikut transform parent.
- Simpan pose sebagai data (bukan screenshot saja).

## Yang Dihindari

- Bagian free-float tanpa parent.
- Rotasi 360° tanpa batas di siku/lutut.
- Pivot di tengah sprite sembarangan.

## MVP vs Nanti

| Fitur | MVP (Phase 3) | Nanti (Phase 7) |
|-------|---------------|-----------------|
| FK + hierarchy | Ya | Ya |
| Constraint dasar | Ya | Lengkap |
| IK | Tidak | Ya |
| Soft mesh di sendi | Tidak | Opsional |

Detail implementasi canvas: group Konva / hitung matrix; pivot sebagai offset.
