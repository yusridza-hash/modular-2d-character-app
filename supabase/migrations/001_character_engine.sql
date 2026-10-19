-- Modular 2D Studio — Character Engine tables (aligns with docs/08-DATABASE-SUPABASE.md)
-- Run in Supabase SQL Editor if not already applied.

-- Enums (ignore error if already exist)
do $$ begin
  create type public.character_view as enum (
    'front', 'side_left', 'side_right', 'back', 'three_quarter_left', 'three_quarter_right'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.body_part as enum (
    'head', 'hair_front', 'hair_back', 'body',
    'upper_arm_l', 'lower_arm_l', 'hand_l',
    'upper_arm_r', 'lower_arm_r', 'hand_r',
    'upper_leg_l', 'lower_leg_l', 'foot_l',
    'upper_leg_r', 'lower_leg_r', 'foot_r',
    'accessory'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  reference_height_px integer not null default 1600,
  cover_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  wizard_stage text default 'import',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists characters_owner_idx on public.characters(owner_id) where deleted_at is null;

create table if not exists public.character_angles (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  view public.character_view not null,
  source_path text not null default '',
  clean_path text,
  width integer,
  height integer,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'processing', 'cleaned', 'segmented', 'ready', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (character_id, view)
);

create table if not exists public.character_parts (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  angle_id uuid not null references public.character_angles(id) on delete cascade,
  part public.body_part not null,
  file_path text not null default '',
  meta jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (angle_id, part)
);

create index if not exists character_parts_character_idx on public.character_parts(character_id);

create table if not exists public.character_expressions (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  name text not null,
  file_path text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (character_id, name)
);

create table if not exists public.character_poses (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  name text not null,
  view public.character_view not null default 'front',
  parts jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (character_id, name, view)
);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.character_angles enable row level security;
alter table public.character_parts enable row level security;
alter table public.character_expressions enable row level security;
alter table public.character_poses enable row level security;

drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists characters_owner on public.characters;
create policy characters_owner on public.characters
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists character_angles_owner on public.character_angles;
create policy character_angles_owner on public.character_angles
  for all using (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  );

drop policy if exists character_parts_owner on public.character_parts;
create policy character_parts_owner on public.character_parts
  for all using (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  );

drop policy if exists character_expressions_owner on public.character_expressions;
create policy character_expressions_owner on public.character_expressions
  for all using (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  );

drop policy if exists character_poses_owner on public.character_poses;
create policy character_poses_owner on public.character_poses
  for all using (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
  );

-- Storage buckets (run once; ignore if exists)
insert into storage.buckets (id, name, public)
values
  ('character-sources', 'character-sources', false),
  ('character-assets', 'character-assets', false)
on conflict (id) do nothing;

-- Storage policies: path must start with auth.uid()
drop policy if exists character_sources_rw on storage.objects;
create policy character_sources_rw on storage.objects
  for all using (
    bucket_id = 'character-sources' and auth.uid()::text = (storage.foldername(name))[1]
  ) with check (
    bucket_id = 'character-sources' and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists character_assets_rw on storage.objects;
create policy character_assets_rw on storage.objects
  for all using (
    bucket_id = 'character-assets' and auth.uid()::text = (storage.foldername(name))[1]
  ) with check (
    bucket_id = 'character-assets' and auth.uid()::text = (storage.foldername(name))[1]
  );
