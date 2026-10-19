# Supabase setup — lanjut setelah database dibuat

## 1. Pastikan schema

Jika tabel belum lengkap, jalankan SQL di:

`supabase/migrations/001_character_engine.sql`

di **Supabase Dashboard → SQL Editor → Run**.

Ini membuat: profiles, characters, character_angles, character_parts, character_expressions, character_poses, RLS, bucket `character-sources` & `character-assets`.

Kalau kamu sudah buat schema manual, bandingkan dengan file itu / `docs/08-DATABASE-SUPABASE.md`.

## 2. Env di project app

```bash
cp .env.example .env.local
```

Isi dari **Project Settings → API**:

- `VITE_SUPABASE_URL` = Project URL
- `VITE_SUPABASE_ANON_KEY` = `anon` `public` key (**bukan** service_role)

## 3. Auth

- Enable Email provider di Authentication.
- Di app: **Sign up** lalu **Sign in** (Auth bar di header).
- RLS memakai `auth.uid()` = `owner_id`.

## 4. Install & run

```bash
npm install
npm run dev
```

## 5. Sync draft ke DB

Di Character Wizard, setelah edit draft, tombol **Sync to Supabase** (jika sudah login) akan:

- upsert `characters`
- upload source/clean/parts/expressions ke Storage
- upsert angles, parts, expressions, poses

Tanpa login atau tanpa env → tetap localStorage (fallback).

## 6. Jangan commit

`.env.local` sudah di `.gitignore`. Jangan upload `service_role` key ke frontend.
