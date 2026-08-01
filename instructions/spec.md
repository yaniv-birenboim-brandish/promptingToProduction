# FamAlbum — the spec

*Hand this out at 0:10 in session 1. It is deliberately one page. Everything you
need to decide, you decide with the agent.*

---

## FamAlbum

A shared family photo album.

- Users log in with **Google**.
- A logged-in user uploads a photo and marks it **private** (only them) or
  **shared** (whole family).
- The gallery shows every photo the current user is allowed to see: their own
  (private *and* shared) plus everyone else's shared photos.
- Users can delete their own photos.

**Out of scope for v1:** thumbnails, editing, captions, albums, comments,
per-person sharing, search.
*(Those are your expansion paths — session 2 and take-home.)*

---

## Constraints

- Full-size images only. No resizing, no thumbnails.
- One image per upload.
- 5 MB per file, images only (jpeg / png / webp / gif).
- Two visibility levels: `private`, `shared`. No third state, no per-person
  sharing.
- Simple responsive grid. No lightbox, no album nesting, no infinite scroll.

---

## Already built for you

- The toolchain: Vite + React + TypeScript + Tailwind + shadcn/ui.
- `src/lib/supabase.ts` — one configured, typed client.
- `src/lib/database.types.ts` — types for the schema.
- `supabase/migrations/0001_init.sql` — the `photos` table, its RLS policies,
  the Storage bucket, and the Storage policies.
- `CLAUDE.md` — the conventions and guardrails the agent works under.

## You build

1. **Schema confirmed** — migration applied, client reads env, prove it end to
   end.
2. **Auth** — Google sign-in, session handling, protected shell.
3. **Upload** — file → Storage → metadata row, with a private/shared choice.
4. **Gallery** — grid of what you're allowed to see, plus delete-your-own.

One commit per slice.

---

## Definition of done

Two people sign in to the same project. Each uploads one private photo and one
shared photo. Each sees three photos: their own two, and the other person's
shared one. Neither can see the other's private photo. Each can delete only
their own.

Nothing in your React code makes that true. The database does.

---

## The data model

```
photos
  id            uuid
  owner_id      uuid   -> auth.users
  storage_path  text   -> '<owner_id>/<uuid>.<ext>' in the `photos` bucket
  visibility    'private' | 'shared'
  caption       text (nullable — column exists, no UI in v1)
  created_at    timestamptz
```

**The database stores metadata. Storage stores bytes.** Two services, two
policy systems, both configured — that separation is the architectural idea
worth taking away from today.
