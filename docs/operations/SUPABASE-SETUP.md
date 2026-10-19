# Supabase setup — lanjut setelah database dibuat

## 1. Schema

Jika belum, jalankan di SQL Editor:

`supabase/migrations/001_character_engine.sql`

(tabel characters, angles, parts, expressions, poses, RLS, storage buckets)

## 2. Env

```bash
cp .env.example .env.local
```

Dari **Settings → API**:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Restart `npm run dev` setelah mengubah env.

## 3. Auth

1. Authentication → Providers → Email ON  
2. Di app header: **Sign up** / **Sign in**  
3. RLS: hanya data `owner_id = auth.uid()`

## 4. Alur pakai

```bash
npm install
npm run dev
```

1. Sign in  
2. Character Wizard → kerjakan draft  
3. **Publish to Library** → otomatis coba **sync ke Supabase** (upload Storage + upsert rows)  
4. Cek Table Editor: `characters`, Storage: `character-sources` / `character-assets`

Tanpa env/login → tetap localStorage saja.

## 5. Security

- Jangan pakai `service_role` di frontend  
- Jangan commit `.env.local`

## 6. Jika sync error

- Belum login  
- Tabel/enum belum match migration  
- Storage policy path harus `{user_id}/...`  
- Cek browser console
