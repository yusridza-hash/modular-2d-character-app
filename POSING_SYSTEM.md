# Sistem Posing: Agar Karakter Bisa Digerakkan Manual Tanpa Terlihat Aneh

Ini adalah bagian krusial setelah sprite berhasil dipecah.  
Tujuan: User bisa drag / rotate bagian tubuh sesuka hati, tapi hasilnya tetap terlihat natural (tidak patah, tidak melayang, tidak saling tembus jelek).

---

## 1. Prinsip Dasar yang Harus Ada

### A. Hierarchy (Parent-Child Relationship)
Bagian tubuh harus punya hubungan induk-anak, mirip skeleton:

```
Body (root)
├─ Head
├─ Hair Back
├─ Hair Front
├─ Upper Arm L
│   └─ Lower Arm L
│       └─ Hand L (opsional)
├─ Upper Arm R
│   └─ Lower Arm R
│       └─ Hand R
├─ Upper Leg L
│   └─ Lower Leg L
│       └─ Foot L
└─ Upper Leg R
    └─ Lower Leg R
        └─ Foot R
```

**Akibatnya:**
- Kalau Body digeser → semua anak ikut bergerak.
- Kalau Upper Arm diputar → Lower Arm & Hand ikut berputar mengikuti.
- User tidak perlu mengatur setiap bagian satu per satu dari nol.

### B. Pivot Point (Titik Putar) yang Benar
Setiap bagian punya **satu titik putar** yang logis secara anatomi:

| Bagian          | Pivot Point berada di          | Alasan                          |
|-----------------|--------------------------------|---------------------------------|
| Head            | Dasar leher (bawah kepala)     | Kepala mengangguk/menggeleng    |
| Upper Arm       | Sendi bahu                     | Lengan berayun dari bahu        |
| Lower Arm       | Sendi siku                     | Lengan bawah lipat di siku      |
| Hand            | Sendi pergelangan              | Telapak bergerak dari wrist     |
| Upper Leg       | Sendi panggul / pinggul        | Kaki bergerak dari panggul      |
| Lower Leg       | Sendi lutut                    | Betis lipat di lutut            |
| Foot            | Sendi pergelangan kaki         | Kaki berputar di ankle          |
| Hair Front/Back | Biasanya ikut Head             | Atau punya pivot sendiri di atas kepala |

Pivot disimpan sebagai koordinat relatif (0–1 atau pixel offset dari pojok kiri atas sprite).

**Contoh di metadata:**
```json
"upper_arm_l": {
  "file": "arm_upper_l.png",
  "pivot": [0.75, 0.12],
  "parent": "body",
  "layer": 6
}
```

### C. Layer Order (Z-Index) yang Dinamis
Urutan gambar harus berubah tergantung pose supaya tidak saling menembus secara aneh.

Contoh aturan sederhana:
- Saat lengan di depan badan → lengan punya layer lebih tinggi.
- Saat lengan di belakang → layer lebih rendah.
- Rambut belakang selalu di belakang kepala & badan.
- Rambut depan selalu di depan kepala.

Bisa dibuat semi-otomatis berdasarkan sudut rotasi lengan.

---

## 2. Cara User Menggerakkan (Interaksi)

### Mode Dasar (Recommended untuk MVP)
1. **Select bagian** (klik)
2. **Drag** → memindahkan posisi (jika root atau free)
3. **Rotate** → putar mengelilingi pivot point (handle rotasi atau drag jauh dari pivot)
4. **Scale** (opsional, biasanya dikunci biar proporsi tetap)

Anak-anak otomatis ikut bergerak karena hierarchy.

### Mode Lebih Nyaman (Sangat Disarankan)
- **Forward Kinematics (FK)** — default  
  User putar Upper Arm → Lower Arm ikut. Sederhana dan mudah dikontrol.

- **Inverse Kinematics (IK)** — fitur lanjutan  
  User tarik tangan → sistem otomatis hitung sudut siku & bahu supaya tangan sampai ke posisi itu.  
  Lebih natural untuk pose kompleks, tapi implementasinya lebih sulit.

Untuk versi awal, **FK saja sudah cukup bagus**.

---

## 3. Constraint (Batasan Gerakan) agar Tidak Aneh

Tanpa batasan, user bisa memutar lengan 360° sampai terlihat patah.

Contoh batasan yang bagus:

| Joint            | Batasan Rotasi (contoh)      | Keterangan                     |
|------------------|------------------------------|--------------------------------|
| Kepala           | -30° sampai +30° (kiri-kanan), -20° sampai +25° (angguk) | Jangan sampai kepala terbalik |
| Bahu             | -60° sampai +120°            | Lengan tidak masuk ke badan   |
| Siku             | 0° sampai 145°               | Tidak bisa tekuk ke belakang  |
| Lutut            | 0° sampai 140°               | Sama, tidak hiperekstensi     |
| Pergelangan kaki | -30° sampai +30°             | Terbatas                      |

Constraint ini bisa di-set per karakter atau pakai default manusiawi.

---

## 4. Teknik Tambahan supaya Lebih Natural

### A. Joint Visual Guide (Opsional tapi membantu)
Saat user memilih bagian, tampilkan:
- Titik pivot
- Lingkaran / garis rotasi
- Batas sudut yang diizinkan

### B. Soft Connection / Overlap
Di area sambungan (bahu, siku, pinggang), biarkan ada sedikit overlap antar sprite supaya tidak ada celah kosong saat diputar.

### C. Mesh Deformation Ringan (Advanced)
Kalau mau lebih premium nanti:
- Pakai simple mesh (beberapa titik) di area sambungan
- Saat diputar, sedikit deformasi supaya lipatan terlihat lebih organik
- Ini mirip cara Live2D / Spine bekerja, tapi jauh lebih kompleks.

Untuk MVP **tidak perlu**. Sprite rigid + pivot + hierarchy sudah sangat usable.

### D. Preset Pose
Sediakan tombol pose siap pakai:
- Idle / Standing
- Sitting
- Walking (frame 1)
- Pointing
- Arms crossed
- dll

User bisa mulai dari preset lalu menyesuaikan manual.

---

## 5. Alur Data Saat User Mempose

1. User memutar `upper_arm_l` sebesar +40°
2. Sistem:
   - Update rotation `upper_arm_l`
   - Karena hierarchy, `lower_arm_l` dan `hand_l` ikut terpengaruh transform-nya
   - Cek constraint (apakah masih dalam batas)
   - Update layer order jika diperlukan
   - Render ulang canvas
3. Simpan state pose sebagai JSON:
```json
{
  "pose_name": "pointing_right",
  "parts": {
    "upper_arm_r": { "rotation": 45, "x": 0, "y": 0 },
    "lower_arm_r": { "rotation": 20 },
    "head": { "rotation": -8 }
  }
}
```

---

## 6. Target Kualitas Posing (MVP vs Ideal)

| Aspek                        | Target MVP                          | Target Ideal                        |
|-----------------------------|-------------------------------------|-------------------------------------|
| Hierarchy                   | Ada (minimal body → arms/legs/head) | Lengkap + hair terpisah             |
| Pivot akurat                | Manual di-set user                  | Auto-detect + bisa dikoreksi        |
| Constraint sudut            | Dasar (siku & lutut)                | Lengkap semua joint                 |
| IK                          | Belum                               | Ada untuk tangan & kaki             |
| Layer otomatis              | Manual / semi                       | Otomatis berdasarkan sudut          |
| Deformasi sambungan         | Tidak ada (rigid)                   | Soft mesh di joint                  |
| Rasanya natural             | Cukup baik setelah sedikit latihan  | Hampir seperti bone di Spine/Live2D |

---

## 7. Rekomendasi Implementasi di Canvas (Konva / Fabric)

- Setiap sprite = satu `Konva.Image` / `Fabric.Image`
- Simpan `offset` pivot (supaya rotasi terjadi di titik yang benar)
- Pakai group / container untuk hierarchy (parent group mengandung child)
- Saat parent di-rotate/drag, child ikut karena berada di dalam group
- Atau hitung transform matrix manual (lebih fleksibel untuk IK nanti)

---

## Kesimpulan Praktis

Agar karakter **bisa digerakkan manual tanpa terlihat aneh**, yang wajib ada sejak awal:

1. **Hierarchy** (parent-child)
2. **Pivot point** yang benar di setiap sendi
3. **Constraint** sudut minimal di siku dan lutut
4. **Layer order** yang masuk akal
5. **Overlap** sedikit di area sambungan

Dengan 5 hal di atas, meskipun sprite-nya rigid (tidak melengkung), hasil posing sudah terasa jauh lebih natural dan bisa dipakai untuk comic panel.

Fitur IK, mesh deformation, dan auto layer bisa ditambahkan di phase selanjutnya.
