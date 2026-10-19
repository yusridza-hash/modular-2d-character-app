# Progress Tracker — Modular 2D Studio

**Last update:** 2026-10-19 (Supabase client + migration + publish sync)

## Overall

| Phase | Status | Notes |
|-------|--------|-------|
| 0 | In progress | Supabase client, SQL migration, AuthBar, env example added |
| 1–4 | Partial MVP | Still heuristic CV; **DB path** now available when env+auth set |
| 5–7 | Early / not started | Studio prototype |

## Supabase integration (new)

- [x] `src/lib/supabase.ts` client
- [x] `src/lib/characterSync.ts` upsert + storage upload
- [x] `src/components/AuthBar.tsx` sign in/up
- [x] `supabase/migrations/001_character_engine.sql`
- [x] Publish → `maybeSyncPublishedDraft`
- [ ] User must set `.env.local` + run migration if needed + sign in
- [ ] Load remote characters back into wizard (next)

See `docs/operations/SUPABASE-SETUP.md`.
