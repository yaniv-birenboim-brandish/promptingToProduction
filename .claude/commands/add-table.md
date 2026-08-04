---
description: Add a new database table the FamAlbum way — new numbered migration, RLS from day one, regenerated types
---

Add a new table named **$ARGUMENTS** to the database, following this
repo's rules exactly:

1. **Never edit an applied migration.** Create a new numbered file in
   `supabase/migrations/` (next number after the highest existing one,
   e.g. `0002_<table>.sql`).
2. In that migration:
   - Create the table with `id uuid primary key default gen_random_uuid()`,
     an `owner_id uuid not null references auth.users (id) on delete
     cascade` if rows belong to a user, and `created_at timestamptz not
     null default now()`.
   - `alter table ... enable row level security;` **in the same migration**
     — a table without RLS is wide open to the anon key by design of this
     stack, so RLS is not an add-on, it ships with the table.
   - Write the four policies (select / insert / update / delete) modelled
     on `photos` in `0001_init.sql`. If a policy should be broader or
     narrower than photos', say why in a SQL comment.
   - `grant select, insert, update, delete on ... to authenticated;`
3. Update `src/lib/database.types.ts` with the new table's Row/Insert/
   Update shapes, matching the style of the existing `photos` entry (in a
   real project you'd regenerate with `npx supabase gen types`; here,
   mirror the migration by hand and say so).
4. Do NOT build hooks or UI for the table — that's a separate slice.

Show me the migration SQL and the types diff, then stop.
