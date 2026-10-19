# 08 — Aturan & Skema Database (Supabase / PostgreSQL)

Dokumen ini adalah **kontrak database**. Implementasi (migration, RLS, client) boleh dikerjakan nanti (mis. ChatGPT); struktur dan aturan di bawah ini tidak boleh dilanggar tanpa update dokumen ini.

Penyimpanan **file** (PNG sprite, source, background) tetap di **Supabase Storage**.  
Database hanya menyimpan **metadata, relasi, dan transform** — bukan binary gambar.

---

## 1. Prinsip Aturan Database

1. **File ≠ row**  
   Gambar disimpan di Storage. Di DB hanya path/URL + metadata.

2. **Character adalah agregat utama**  
   Parts, poses, expressions selalu milik satu `characters.id`.

3. **Scene hanya mereferensi, tidak menduplikasi aset**  
   Scene menyimpan `character_id`, `pose_id`, `expression_id`, transform — bukan salinan sprite.

4. **ID stabil**  
   Pakai `uuid` (gen_random_uuid()) untuk semua PK. Jangan andalkan nama file sebagai PK.

5. **Soft delete opsional**  
   Kolom `deleted_at timestamptz NULL`. Default query: `WHERE deleted_at IS NULL`.

6. **Timestamp wajib**  
   Setiap tabel utama: `created_at`, `updated_at` (auto-update).

7. **JSON untuk yang fleksibel, kolom untuk yang di-query**  
   - Di-query / di-join → kolom tersendiri.  
   - Fleksibel per bagian (pivot, constraint) → `jsonb`.

8. **RLS siap multi-user**  
   Setiap row milik `owner_id` (auth.users). Policy: user hanya CRUD data sendiri (kecuali admin).

9. **Storage path mengikuti konvensi**  
   Lihat bagian Storage di bawah. Path disimpan relatif, bukan hardcode domain.

10. **Migration versioned**  
    Semua perubahan schema lewat migration Supabase/SQL, bukan edit manual di dashboard tanpa catatan.

---

## 2. Enum / Tipe yang Disepakati

```sql
-- Angle view
create type character_view as enum (
  'front', 'side_left', 'side_right', 'back', 'three_quarter_left', 'three_quarter_right'
);

-- Nama bagian tubuh (boleh diperluas nanti, tetap konsisten dengan sprite pipeline)
create type body_part as enum (
  'head', 'hair_front', 'hair_back', 'body',
  'upper_arm_l', 'lower_arm_l', 'hand_l',
  'upper_arm_r', 'lower_arm_r', 'hand_r',
  'upper_leg_l', 'lower_leg_l', 'foot_l',
  'upper_leg_r', 'lower_leg_r', 'foot_r',
  'accessory'
);
```

---

## 3. Tabel Inti

### 3.1 profiles (opsional, mirror auth)

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 3.2 characters

```sql
create table characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  reference_height_px integer not null default 1600,
  cover_path text,                    -- path di Storage (thumbnail)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index characters_owner_idx on characters(owner_id) where deleted_at is null;
```

### 3.3 character_angles

Satu row per sudut yang sudah di-upload / di-process.

```sql
create table character_angles (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  view character_view not null,
  source_path text not null,          -- Storage: gambar asli
  clean_path text,                    -- setelah background removal
  width integer,
  height integer,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'processing', 'ready', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (character_id, view)
);
```

### 3.4 character_parts

Hasil pipeline: satu sprite per bagian per angle.

```sql
create table character_parts (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  angle_id uuid not null references character_angles(id) on delete cascade,
  part body_part not null,
  file_path text not null,            -- Storage path PNG transparent
  -- Transform & rig (disimpan jsonb agar fleksibel, tetap ada konvensi key)
  -- pivot: [x, y] normalisasi 0–1 relatif sprite
  -- parent_part: body_part | null
  -- layer: int
  -- constraints: { "min_deg": number, "max_deg": number } | null
  -- bbox: { "x", "y", "w", "h" } relatif source (opsional)
  meta jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (angle_id, part)
);

create index character_parts_character_idx on character_parts(character_id);
```

**Konvensi key di `meta` (wajib dipatuhi kode):**

```json
{
  "pivot": [0.5, 0.9],
  "parent_part": "body",
  "layer": 10,
  "constraints": { "min_deg": 0, "max_deg": 145 },
  "bbox": { "x": 100, "y": 40, "w": 200, "h": 220 }
}
```

### 3.5 character_expressions

```sql
create table character_expressions (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  name text not null,                 -- neutral, smile, angry, ...
  file_path text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (character_id, name)
);
```

### 3.6 character_poses

Pose = kumpulan rotasi/offset per part (bukan file gambar).

```sql
create table character_poses (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  name text not null,
  view character_view not null default 'front',
  -- parts: { "upper_arm_l": { "rotation": 40, "x": 0, "y": 0 }, ... }
  parts jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (character_id, name, view)
);
```

### 3.7 backgrounds

```sql
create table backgrounds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  file_path text not null,
  -- ground_line_y: 0–1 dari atas gambar (kaki karakter nempel di sini)
  -- light_dir_deg: arah cahaya untuk shadow (opsional)
  meta jsonb not null default '{}',
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

Contoh `meta` background:

```json
{
  "ground_line_y": 0.82,
  "light_dir_deg": 210,
  "width": 1920,
  "height": 1080
}
```

### 3.8 scenes

```sql
create table scenes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  background_id uuid references backgrounds(id) on delete set null,
  -- characters: array of placements
  -- bubbles: array of dialog boxes
  data jsonb not null default '{}',
  export_path text,                   -- last exported PNG if any
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

**Konvensi `data` scene:**

```json
{
  "ground_line_y": 0.82,
  "characters": [
    {
      "instance_id": "uuid-or-local-id",
      "character_id": "uuid",
      "pose_id": "uuid",
      "expression_id": "uuid",
      "view": "front",
      "x": 0.4,
      "y": 0.82,
      "scale": 1.0,
      "flip": false,
      "shadow": true,
      "z": 1
    }
  ],
  "bubbles": [
    {
      "id": "b1",
      "text": "Hello",
      "x": 0.5,
      "y": 0.2,
      "style": "speech"
    }
  ],
  "props": []
}
```

x/y dinormalisasi 0–1 terhadap canvas/background agar resolusi export fleksibel.

---

## 4. Supabase Storage — Konvensi Path

Bucket disarankan:

| Bucket | Isi |
|--------|-----|
| `character-sources` | Upload asli |
| `character-assets` | clean, parts, expressions |
| `backgrounds` | gambar background |
| `exports` | hasil export scene |

Path contoh:

```
character-sources/{user_id}/{character_id}/front.png
character-assets/{user_id}/{character_id}/front/head.png
character-assets/{user_id}/{character_id}/expressions/smile.png
backgrounds/{user_id}/{background_id}.png
exports/{user_id}/{scene_id}/{timestamp}.png
```

Di DB simpan path relatif bucket, misalnya:  
`{character_id}/front/head.png` + bucket name di config app.

**Policy Storage:** user hanya read/write path dengan prefix `/{auth.uid()}/`.

---

## 5. RLS (Row Level Security) — Aturan

Aktifkan RLS di semua tabel di atas.

Policy dasar (pola sama untuk characters, backgrounds, scenes):

- **SELECT / INSERT / UPDATE / DELETE**: `owner_id = auth.uid()`
- Tabel anak (`character_angles`, `character_parts`, …): izinkan jika parent `characters.owner_id = auth.uid()`

Contoh pola parts:

```sql
create policy character_parts_owner on character_parts
  for all using (
    exists (
      select 1 from characters c
      where c.id = character_parts.character_id
        and c.owner_id = auth.uid()
        and c.deleted_at is null
    )
  );
```

Service role (backend FastAPI) boleh bypass RLS untuk job pipeline; client browser selalu lewat anon/authenticated key + RLS.

---

## 6. Relasi Ringkas (ER)

```
profiles (1) — (N) characters
characters (1) — (N) character_angles
character_angles (1) — (N) character_parts
characters (1) — (N) character_expressions
characters (1) — (N) character_poses
profiles (1) — (N) backgrounds
profiles (1) — (N) scenes
scenes (N) — (0..1) backgrounds
scenes.data.characters[] → characters, poses, expressions (by uuid)
```

---

## 7. Mapping ke File JSON Lama (docs/07)

| Konsep di 07-DATA-SCHEMA | Tabel / kolom Supabase |
|--------------------------|-------------------------|
| Character Project root | `characters` |
| angles.*.parts | `character_parts` + `meta` |
| expressions[] | `character_expressions` |
| poses[] | `character_poses.parts` |
| Scene JSON | `scenes.data` |
| background file + ground | `backgrounds` + `meta` |

Kode boleh tetap pakai bentuk JSON di API response (compose dari join), asalkan sumber kebenaran = tabel di atas.

---

## 8. Yang Tidak Disimpan di Database

- Binary PNG/JPEG (hanya path)
- Hasil sementara mask mentah (boleh di Storage temporary, tidak wajib row)
- Session editor canvas (cukup di frontend state)

---

## 9. Checklist Implementasi (untuk yang buat migration)

- [ ] Extension `pgcrypto` atau pakai `gen_random_uuid()` dari pgcatalog
- [ ] Semua enum + tabel di atas
- [ ] Index owner + soft delete
- [ ] RLS policies
- [ ] Bucket Storage + policy path per user
- [ ] Trigger `updated_at`
- [ ] Seed kosong / user test opsional

---

## 10. Perubahan Schema Nanti

Wajib:
1. Tulis migration SQL baru.
2. Update dokumen ini di commit yang sama.
3. Jangan rename enum value yang sudah dipakai production tanpa migration data.

---

*Dokumen ini mengikat Phase 0+ jika Supabase dipilih sebagai persistence. Build Rules tetap berlaku; file aset tetap di Storage, bukan di bytea.*


---
## 11. REQUIRED SCHEMA MIGRATION BEFORE BUILD (2026-10-19)
Legacy SQL in Sections 1–10 is a starting scaffold, **not a final production schema** for the updated static comic workflow. Do not deploy as complete without a versioned migration resolving the following:
1. Add projects, pages, panels, immutable asset registry/version/dependency tables and scene_revisions; pin panel instance references to exact asset/rig/face/pose versions, never only mutable master IDs.
2. Character expressions currently single file per name: expand to expression pack versions, compatible view angles, full-face or modular eye/brow/mouth component references and preset compositions; preserve backward compatibility.
3. Scene JSON now requires separate object instances with independent pose, facial preset, transform and blend settings. Include foreground mask/props, background blending metadata, layer order and panel/page position.
4. Store original, cleaned, masks, rendered sprites and processing model/parameter provenance persistently in private versioned Storage. Older example storage paths without version IDs must be superseded for published revisions.
5. Avoid cascade deletion of published referenced assets; enforce integrity, authorizations and soft-delete/dependency warnings. Supabase RLS for all new project-scoped tables, Storage policies, worker authorization, migrations and restore tests mandatory.
6. Do not claim an already-created table, migration or bucket simply because SQL is written here.
**Canonical design links:** [assets](architecture/ASSET-VERSIONING.md), [static scene](architecture/SCENE-CANVAS-BLENDING.md), [rig and face](architecture/CHARACTER-RIG-AND-EXPRESSION.md). Migration implementation is outstanding.
