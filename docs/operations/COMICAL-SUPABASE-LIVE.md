# Live Supabase Setup — Comical Editor
Verified 2026-10-19. Dedicated Supabase project **bvhgkqlcegggybflvcqt**, separate from Roude-APP. Do not point this app to Roude database.
## Executed migrations in Comical
1. comic_core_tables_v1 — 11 public tables: comic_projects, comic_assets, comic_asset_versions, comic_characters, comic_rigs, comic_expression_packs, comic_pose_presets, comic_pages, comic_panels, comic_scene_revisions, comic_jobs.
2. comic_rls_and_private_storage_v1 — enabled RLS on all 11, project-owner scoped policies and private 'comic-assets' bucket; private Storage object policies require first path segment == auth.uid().
3. comic_immutable_revisions_and_author_guard — clients cannot update/delete published asset_versions or scene_revisions; scene revision insert requires author_id == auth.uid().
## Verification (direct SQL)
11 public comic tables, 1 private comic-assets bucket; RLS enabled on all 11. Security advisors returned zero lints when first run. Policies reduced from initial 44 after immutable revision hardening. No data from Roude touched.
## Application connection
Project URL is https://bvhgkqlcegggybflvcqt.supabase.co. Fetch a publishable key in Comical dashboard. Add only VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to local .env; never commit secrets or service_role. Auth, browser Storage integration, migrations tracked in git, login flow and real multi-user RLS tests are NEXT work; don't mark Phase 0 completed.
## Caveats
Current in-place migrations were executed by managed Supabase migration tool, and reproducible source SQL should be captured before deployment to other environments. No end-to-end user auth/upload tests yet.
