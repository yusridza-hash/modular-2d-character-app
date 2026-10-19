# Cara Sprite Dibuat dari Gambar (Detail Pipeline)

Ini adalah jantung aplikasi. Targetnya: dari foto/gambar karakter multi-angle → jadi set sprite modular yang bisa disusun ulang.

## Langkah demi Langkah

### 1. Input Validation
- Terima gambar (PNG/JPG/WebP)
- Cek resolusi minimal (disarankan ≥ 768px)
- User pilih / konfirmasi sudut (front, side, back, dll)

### 2. Background Removal
- Jalankan model background removal (BiRefNet / RemBG)
- Hasil: gambar dengan alpha channel (transparent background)
- Simpan versi clean ini sebagai `source_clean.png`

### 3. Body Part Segmentation
**Tujuan:** Dapatkan mask terpisah untuk setiap bagian tubuh.

Opsi teknis (bisa digabung):

**A. Human Parsing Model**
- Model seperti SCHP, Graphonomy, atau yang lebih baru
- Output: label map (setiap pixel punya kelas: head, hair, torso, left-arm, right-arm, dll)

**B. SAM2 (Segment Anything 2)**
- Bisa dipakai untuk refine mask
- Atau sebagai fallback kalau parsing kurang akurat
- User bisa kasih point prompt (klik “ini kepala”) untuk bantu SAM

**C. Kombinasi (Recommended)**
1. Human Parsing → dapatkan mask kasar per bagian
2. SAM2 + point/box dari hasil parsing → refine mask agar lebih bersih
3. Morphological operation (OpenCV) → hilangkan hole & noise kecil

### 4. Face Parsing (untuk Expression System)
- Jalankan face parsing hanya di region kepala
- Dapatkan mask: eyes, eyebrows, nose, mouth, dll
- Berguna nanti untuk ganti ekspresi tanpa mengganggu rambut & bentuk kepala

### 5. Crop & Normalize
Untuk setiap bagian:
- Ambil bounding box dari mask
- Crop dengan padding kecil
- Simpan sebagai PNG 32-bit (RGBA)
- Catat:
  - Posisi relatif terhadap karakter utuh
  - Ukuran
  - **Pivot point** (titik putar) — penting untuk gerakan natural
    - Kepala: sekitar leher
    - Lengan atas: di bahu
    - Lengan bawah: di siku
    - dll

### 6. Metadata Generation
Buat `metadata.json` berisi:
```json
{
  "view": "front",
  "parts": {
    "head": {
      "file": "head.png",
      "pivot": [0.5, 0.92],
      "original_bbox": [x, y, w, h],
      "layer": 10
    },
    "body": {
      "file": "body.png",
      "pivot": [0.5, 0.3],
      "layer": 5
    }
  },
  "joints": {
    "neck": [cx, cy],
    "shoulder_l": [...],
    "shoulder_r": [...]
  }
}
```

### 7. Manual Correction Loop (Sangat Penting)
Karena segmentation jarang 100% sempurna:
- Tampilkan hasil mask di UI
- User bisa:
  - Brush menambah / mengurangi area mask
  - Merge / split bagian
  - Geser pivot point
  - Lihat preview karakter yang sudah dirakit ulang
- Setelah puas → simpan final

### 8. Multi-Angle Consistency (Opsional tapi bagus)
- Bandingkan proporsi bagian antar angle
- Normalize skala supaya lengan di front dan side proporsinya mirip
- Warning kalau ada bagian yang hilang di salah satu angle

## Target Kualitas Pipeline

| Aspek                    | Target MVP              | Target Ideal          |
|--------------------------|-------------------------|-----------------------|
| Akurasi mask utama       | 80-90%                  | > 95%                 |
| Waktu proses 1 gambar    | < 15 detik              | < 5 detik             |
| Jumlah koreksi manual    | Sedikit (brush)         | Hampir tidak perlu    |
| Support gaya gambar      | Anime / semi-real       | Banyak gaya           |

## Catatan Penting

- Pipeline ini **tidak harus sempurna di awal**. Semi-otomatis + tools koreksi manual sudah sangat usable.
- Fokus dulu ke **front view** yang bagus, baru side & back.
- Pivot point yang benar lebih penting daripada mask yang sempurna.
- Simpan selalu versi source asli + versi clean + hasil sprite, supaya bisa re-process nanti kalau model parsing lebih bagus.
