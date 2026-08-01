# CLAUDE.md — FamAlbum

Context and rules for any agent working in this repo. Read this before writing code.

> This file lives on `main` and is inherited by every `step*` branch. The
> commands and file paths below describe the app, which lives on the step
> branches — on `main` there is nothing to run.

---

## What this is

FamAlbum is a shared family photo album. Family members sign in with Google,
upload photos, and mark each photo **private** (only them) or **shared** (whole
family). The gallery shows exactly what the signed-in user is allowed to see.

This is also a teaching repo. Prefer the boring, obvious implementation over the
clever one, and prefer small diffs that a room full of people can read on a
projector.

---

## Stack

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| Frontend | Vite + React 18, SPA, no router in v1 |
| Styling | Tailwind CSS + shadcn/ui |
| DB / Auth / Storage | Supabase |
| Auth provider | Google OAuth via Supabase Auth |
| Validation | Zod |
| Deploy | Netlify (session 2) |

Path alias: `@/` → `src/`.

---

## Commands

```bash
npm install       # install deps
npm run dev       # vite dev server on http://localhost:5173
npm run build     # tsc -b && vite build
npm run typecheck # tsc --noEmit  <- run this before you tell me you're done
npm run preview   # serve the production build
```

There is no test runner yet. Session 2 adds Vitest and Playwright. Do not add
one unprompted.

---

## Architecture

**The database stores metadata. Storage stores bytes.** A `photos` row holds
`owner_id`, `storage_path`, `visibility`, `caption`, `created_at`. The actual
image lives in the `photos` Storage bucket at `<owner_id>/<uuid>.<ext>`.

Upload is therefore always two steps, in this order:

1. Upload the file to Storage at an owner-scoped path.
2. Insert the metadata row pointing at that path.

If step 2 fails, delete the orphaned object. Don't leave garbage in the bucket.

**Two policy systems.** Row Level Security on `public.photos` *and* access
policies on `storage.objects`. Both live in `supabase/migrations/0001_init.sql`.
Changing one without the other is a bug, every time.

```
Browser ─► React SPA (Vite)
             └─ @supabase/supabase-js  (src/lib/supabase.ts — the only client)
                   ├─ Postgres      photos table + RLS
                   ├─ Auth          Google OAuth, JWT
                   └─ Storage       image bytes + Storage policies
```

---

## Conventions — follow these

**All Supabase access goes through the typed client** in `src/lib/supabase.ts`.
Never `fetch()` the REST endpoint directly. Never construct a second
`createClient` — two clients fight over the session in localStorage.

**Types come from `src/lib/database.types.ts`.** Import `PhotoRow`,
`PhotoInsert`, `Visibility` from there. Do not redeclare a `Photo` interface by
hand — if the shape you need isn't there, the schema changed and the types file
should be regenerated.

**Components are presentational. Data lives in hooks.**

- `src/components/` — renders props, holds UI state (open/closed, hover). Does
  not import `supabase`.
- `src/components/ui/` — shadcn/ui primitives. Add with
  `npx shadcn@latest add <name>`. Don't hand-roll a button.
- `src/hooks/` — `usePhotos`, `useUploadPhoto`, `useSession`, etc. This is the
  **only** layer that imports `supabase`. One hook per concern, each returning
  `{ data, error, isLoading }` plus any actions.

If you find yourself calling `supabase` inside a `.tsx` component, stop and put
it in a hook.

**Validate at the boundary with Zod.** Anything crossing into the app from
outside — a file the user picked, a form field, a row shape you're about to
trust — gets parsed, not cast. `as PhotoRow` is not validation.

**Errors surface to the user.** No silent `catch {}`. No `console.log` as the
only handling. A failed upload says so on screen.

**Named exports** everywhere except React page/route components.

---

## Security — non-negotiable

- `VITE_SUPABASE_ANON_KEY` **ships to the browser. That is by design and it is
  not a leak.** RLS is what makes it safe. Do not "fix" it by proxying it.
- **Never** put `service_role` anywhere in this repo — not in `.env`, not in
  `src/`, not in a comment. It bypasses RLS entirely. v1 does not need it.
- Never disable RLS to make something work. If a query returns nothing, the
  policy is the bug or the query is — fix the actual cause.
- Every query filters by permission at the database, not in JavaScript.
  `.filter(p => p.visibility === 'shared')` in React is not a security control;
  it is a rendering detail that runs after the data already left the server.
- File uploads: cap the size, check the MIME type, and generate the filename
  yourself. Never use the user's filename as the storage path.

---

## Scope discipline for v1

In scope: Google login, upload one image at a time, private/shared toggle,
gallery grid of what you're allowed to see, delete your own photos.

**Out of scope — do not build these unless asked:** thumbnails, image
resizing, albums or folders, captions UI, comments, tags, search, per-person
sharing, multi-file upload, drag-and-drop, lightbox, infinite scroll, dark mode
toggle, i18n, a router, a state management library, a backend server.

Full-size images only. One image per upload. Two visibility levels.

---

## How to work with me

- **Plan before you build.** For anything past a one-file change, tell me the
  plan first and wait. I will critique it.
- **One vertical slice at a time.** A slice is schema → hook → component →
  visible in the UI. Finish it, I review it, we commit, then next.
- **Stop at the edge of the slice.** If you notice something out of scope,
  mention it in one line and move on. Do not fix it.
- **Say what you're unsure about.** "I guessed at X" is more useful than
  confident wrong code.
- **Don't run `git commit`** unless I ask. Don't push. Don't create branches.
- Don't edit `supabase/migrations/0001_init.sql` — it is already applied. New
  schema changes go in a new numbered migration file.
- Don't add dependencies without asking. Everything v1 needs is already in
  `package.json`.
