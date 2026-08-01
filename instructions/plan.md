# FamAlbum — build plan

Five slices, template-first: the UI exists on day one as an adaptation of the
purchased template (**`resources/react-template/`** — a runnable React app;
see its README), then each slice swaps one stubbed concern for the real
thing. The riskiest slice is **Slice 4 — upload with rollback** (two services,
two policy systems, a failure path that must clean up after itself); it lands
as early as its dependencies allow — right after there's a real gallery to
show the upload in.

## Architecture at a glance

The browser runs a Vite/React SPA. All data access goes through the one typed
Supabase client (`src/lib/supabase.ts`), which talks to three services:
Postgres (`photos` metadata + RLS), Auth (Google OAuth), and Storage (image
bytes + mirrored bucket policies). **The database enforces who sees what** —
every gallery query returns only rows RLS permits. The UI's filter bar
(all / mine / family's) is a display convenience over already-permitted data,
never a security control.

```
Browser ─► React SPA ─► supabase-js (one client)
                           ├─ Postgres   photos + RLS
                           ├─ Auth       Google OAuth, JWT
                           └─ Storage    bytes + bucket policies
```

The schema and both policy systems already ship in
`supabase/migrations/0001_init.sql` — slices *confirm* them, never rewrite
them. New schema means a new numbered migration file.

## Slices

### Slice 1 — Adapt the template into FamAlbum's stub
- **Goal:** the whole app — header, filter bar, masonry gallery, single-photo
  view with prev/next and curtain, footer — visible and clickable on local
  fixture data, already looking like the template.
- **Backend:** none. No supabase imports anywhere yet.
- **Frontend:** copy from **`resources/react-template/src/`** — its
  components, the tokens in its `tailwind.config.js`, the fonts in its
  `index.html`, and `useMasonry` — into this app's `src/`; swap its
  `data.ts` for `fixtures.ts` whose shape **matches `PhotoRow` from
  `src/lib/database.types.ts` exactly** (`owner_id`, `visibility` instead
  of categories/likes) — that exactness is what lets slice 3 swap data
  sources without touching components; filter pills become
  all / mine / family's.
- **Watch for:** the masonry relayout on image load; the curtain transition
  surviving the copy; no restyling from scratch.
- **Done when:** you can click through grid → large view → prev/next → back,
  with the template's look, offline.
- **Commit:** `feat: stubbed UI on fixture data, adapted from the template`

### Slice 2 — Sign in with Google
- **Goal:** real auth gates the stub — sign in, see who you are, sign out,
  refresh and stay signed in; logged out you see only the sign-in prompt.
- **Backend:** Supabase Auth with Google provider (dashboard config, no
  migration).
- **Frontend:** `useSession` hook (the first `supabase` import); header shows
  user identity + sign-out; gate in `App.tsx`.
- **Watch for:** session restore on refresh; the auth listener unsubscribed
  on unmount; no second `createClient`.
- **Done when:** two different Google accounts can each sign in and see their
  own name.
- **Commit:** `feat: google sign-in and session gate`

### Slice 3 — Real gallery: fixtures → database
- **Goal:** the grid shows actual `photos` rows (an honest empty state at
  first) and `fixtures.ts` is deleted.
- **Backend:** confirms the `photos` SELECT policy in `0001_init.sql` — own
  rows plus shared rows, nothing else.
- **Frontend:** `usePhotos` hook returning `{ data, error, isLoading }`;
  the bucket is **private**, so images render via signed URLs —
  `createSignedUrls`, batched, with per-item failures handled; components
  keep rendering props; "mine / family's" filter works on `owner_id`
  client-side, display-only.
- **Watch for:** the query does **not** filter visibility in JS; one
  `createSignedUrl` per photo in a `map` is an N+1 worth naming; error and
  empty states rendered, not swallowed.
- **Done when:** signed in with no photos you see a friendly empty gallery,
  not a spinner or a crash.
- **Commit:** `feat: gallery grid with RLS-backed visibility`

### Slice 4 — Upload with rollback ⚠ riskiest
- **Goal:** pick an image, choose private/shared (private default), upload,
  watch it appear. Bad files fail loudly on screen.
- **Backend:** confirms the Storage INSERT policy (owner-scoped folder), the
  `photos` INSERT policy, and the path check constraint — all in
  `0001_init.sql`.
- **Frontend:** `useUploadPhoto` hook: Zod-validate the file (≤5 MB,
  jpeg/png/webp/gif) → upload bytes to `<owner_id>/<uuid>.<ext>` → insert the
  row → **on insert failure, delete the orphaned object**; upload UI reusing
  template patterns.
- **Watch for:** the rollback branch actually runs; generated filename, never
  the user's; validation before any network call.
- **Done when:** a 6 MB file or a PDF is rejected with a visible message; a
  good photo appears in the grid without a refresh.
- **Commit:** `feat: photo upload with visibility choice and rollback`

### Slice 5 — Delete your own photos
- **Goal:** a delete control on your own photos only; row and bytes both go
  away. This closes the spec — the two-user test passes.
- **Backend:** confirms the DELETE policies on both `photos` and
  `storage.objects`.
- **Frontend:** `useDeletePhoto` hook (row first, then object); delete
  affordance only rendered on `owner_id === session.user.id` — cosmetic;
  RLS is the enforcement.
- **Watch for:** deletion order and its failure path; no confirm-dialog scope
  creep beyond a simple confirm.
- **Done when:** the spec's definition of done — two users, three visible
  photos each, cross-deletion impossible.
- **Commit:** `feat: delete own photos`

## Not in this plan

Thumbnails, editing, captions UI (the column exists, no UI), albums,
comments, tags, search, per-person sharing, multi-file upload,
drag-and-drop, infinite scroll, a router, a state management library, a
backend server, tests (session 2).

## Assumptions

- Gallery updates after upload/delete by refetching, not optimistic updates
  or realtime *(assumed — change if wrong)*.
- The filter bar resets to "all" on reload; no URL state *(assumed — change
  if wrong)*.
- Prev/next in the single-photo view navigates within the currently filtered
  set *(assumed — change if wrong)*.
