-- ===========================================================================
-- FamAlbum — 0001_init.sql
--
-- Creates everything the app needs on the database side:
--   1. the `photo_visibility` enum
--   2. the `photos` metadata table
--   3. Row Level Security policies on `photos`
--   4. the `photos` Storage bucket
--   5. Storage access policies on `storage.objects` that MIRROR the table rules
--
-- Run it once, in the Supabase dashboard -> SQL Editor -> New query -> paste ->
-- Run. (Or `supabase db push` if you use the CLI.) It is idempotent enough to
-- re-run safely.
--
-- THE BIG IDEA, and the thing to say out loud in class:
--   The database stores METADATA. Storage stores BYTES. They are two separate
--   services with two separate policy systems, and you must configure BOTH.
--   Getting the table right and forgetting the bucket is one of the most common
--   real-world Supabase mistakes.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- 1. Visibility enum
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'photo_visibility') then
    create type public.photo_visibility as enum ('private', 'shared');
  end if;
end
$$;


-- ---------------------------------------------------------------------------
-- 2. photos table (metadata only — no image bytes live here)
-- ---------------------------------------------------------------------------
create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users (id) on delete cascade,
  storage_path  text not null unique,
  visibility    public.photo_visibility not null default 'private',
  caption       text,
  created_at    timestamptz not null default now(),

  -- Storage paths must be `<owner_id>/<filename>`. The Storage policies below
  -- depend on this convention, so we enforce it at the table too. If you let
  -- clients write arbitrary paths, the folder-prefix check stops meaning
  -- anything.
  constraint photos_storage_path_is_owner_scoped
    check (storage_path like (owner_id::text || '/%')),

  constraint photos_caption_length check (caption is null or char_length(caption) <= 280)
);

comment on table  public.photos                is 'Metadata for one uploaded photo. Bytes live in the `photos` Storage bucket.';
comment on column public.photos.storage_path   is 'Object key inside the `photos` bucket. Always `<owner_id>/<uuid>.<ext>`.';
comment on column public.photos.visibility     is 'private = owner only. shared = every signed-in family member.';

-- Supabase's default privileges usually grant these automatically, but being
-- explicit costs nothing and turns a confusing "permission denied for table
-- photos" into a problem you never have. Note: a GRANT is not a policy. This
-- says "the authenticated role may attempt these operations"; RLS below decides
-- which rows it actually gets.
grant select, insert, update, delete on public.photos to authenticated;

-- Gallery query is "newest first, filtered by visibility", so index for it.
create index if not exists photos_created_at_idx on public.photos (created_at desc);
create index if not exists photos_owner_id_idx   on public.photos (owner_id);
create index if not exists photos_visibility_idx on public.photos (visibility);


-- ---------------------------------------------------------------------------
-- 3. Row Level Security on public.photos
--
-- Without RLS enabled, the anon key that ships in the browser bundle would let
-- anyone read every row. RLS is not an extra — it is the security model.
-- ---------------------------------------------------------------------------
alter table public.photos enable row level security;

-- Belt and braces: even the table owner shouldn't bypass these in practice.
alter table public.photos force row level security;

drop policy if exists "photos_select_shared_or_own" on public.photos;
create policy "photos_select_shared_or_own"
  on public.photos
  for select
  to authenticated
  using (
    visibility = 'shared'
    or owner_id = (select auth.uid())
  );

drop policy if exists "photos_insert_own" on public.photos;
create policy "photos_insert_own"
  on public.photos
  for insert
  to authenticated
  with check ( owner_id = (select auth.uid()) );

drop policy if exists "photos_update_own" on public.photos;
create policy "photos_update_own"
  on public.photos
  for update
  to authenticated
  using      ( owner_id = (select auth.uid()) )
  with check ( owner_id = (select auth.uid()) );

drop policy if exists "photos_delete_own" on public.photos;
create policy "photos_delete_own"
  on public.photos
  for delete
  to authenticated
  using ( owner_id = (select auth.uid()) );

-- Note: no policy is granted to the `anon` role at all, so a logged-out visitor
-- sees zero rows. That is deliberate — FamAlbum has no public gallery.


-- ---------------------------------------------------------------------------
-- 4. Storage bucket
--
-- `public = false` means "no unauthenticated CDN URL". Reads must go through
-- either an authenticated request or a signed URL, and either way the policies
-- in section 5 are evaluated.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  false,
  5242880,                                            -- 5 MB hard cap (v1 scope)
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;


-- ---------------------------------------------------------------------------
-- 5. Storage policies — the mirror of section 3
--
-- storage.objects is just a table, so these are ordinary RLS policies. The
-- filename convention `<owner_id>/<file>` is what makes them cheap:
--   (storage.foldername(name))[1]  ->  the owner_id segment
--
-- READ is the interesting one. An object is readable if:
--   (a) you own the folder, OR
--   (b) a `photos` row points at this exact object and is marked shared.
-- (b) is what makes "user B pastes user A's private object URL" fail in
-- session 2 — go try it.
-- ---------------------------------------------------------------------------
alter table storage.objects enable row level security;

drop policy if exists "photos_storage_read_shared_or_own" on storage.objects;
create policy "photos_storage_read_shared_or_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1
        from public.photos p
        where p.storage_path = storage.objects.name
          and p.visibility = 'shared'
      )
    )
  );

drop policy if exists "photos_storage_insert_own_folder" on storage.objects;
create policy "photos_storage_insert_own_folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "photos_storage_update_own_folder" on storage.objects;
create policy "photos_storage_update_own_folder"
  on storage.objects
  for update
  to authenticated
  using      ( bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text )
  with check ( bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text );

drop policy if exists "photos_storage_delete_own_folder" on storage.objects;
create policy "photos_storage_delete_own_folder"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );


-- ===========================================================================
-- INSTRUCTOR NOTE — the session 2 "break the policy" demo
--
-- The policies above are correct. If you want the bypass test to FAIL loudly
-- in front of the room before the agent fixes it, run this in the SQL editor
-- to deliberately loosen storage reads, then run the demo, then re-run this
-- file to restore:
--
--   drop policy if exists "photos_storage_read_shared_or_own" on storage.objects;
--   create policy "photos_storage_read_any_authenticated"
--     on storage.objects for select to authenticated
--     using ( bucket_id = 'photos' );
--
-- With that in place, user B can fetch user A's private object by path — the
-- table is locked down but the bucket is wide open, which is exactly the
-- two-policy-systems gotcha. Ask the room to predict the result before you run
-- it; most people expect the table RLS to protect the file. It does not.
-- ===========================================================================
