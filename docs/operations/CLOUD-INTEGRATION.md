# Comical cloud adapter — prototype
Only Comical Supabase project bvhgkqlcegggybflvcqt. NEVER Roude.
Copy .env.example to .env and insert the public publishable key from Comical dashboard. Do not commit secret or service-role credentials.
Cloud mode supports Supabase email/password signup/signin, cloud save and load of a project JSON object in a private bucket under `{auth.uid()}/{project_id}/project.json`. RLS enforces comic_projects ownership; storage path prefix enforces user isolation. Local autosave remains available without sign-in.
This is a prototype bridge, not fully normalized data persistence: asset images are embedded in JSON, no server-side size/quota/corruption/migration handling, no two-device conflict resolution, and the page/panel/rig database tables are not yet written by frontend. Auth requires Supabase email provider to be enabled. Implement proper asset-per-version storage next.
