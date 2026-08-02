# Slice 3 — Real gallery: swap fixtures for the database

**Goal:** the grid shows actual database rows — your photos plus everyone's
shared ones, which right now is an honest, friendly empty state — and
`fixtures.ts` is deleted. Same components, new data source.

**Time:** ~15 minutes.

**Commit message:** `feat: gallery grid with RLS-backed visibility`

---

## Prompt

> Read CLAUDE.md and instructions/plan.md first.
>
> Build slice 3 of the plan: the real gallery.
>
> **Requirements**
>
> - A `usePhotos` hook in `src/hooks/` that selects from `photos`, newest
>   first, and returns `{ photos, isLoading, error, refresh }`.
> - **Do not filter by visibility in JavaScript.** RLS already returns exactly
>   the rows this user may see. If you add a `.filter()` in React you're
>   pretending to do security while doing rendering.
> - Storage objects are private, so each image renders via a signed URL —
>   `createSignedUrls` (batched, not one call per photo). Handle the case
>   where a URL fails to sign.
> - Swap the gallery's data source from fixtures to the hook. The existing
>   `Gallery`/`PhotoCard` components should barely change — that was the
>   point of shaping fixtures like `PhotoRow`. **Delete `src/lib/fixtures.ts`.**
> - Loading, error, and empty states all visible on screen. The stub delete
>   and upload controls can go inert or hide for now — they come back real in
>   slices 4 and 5.
> - Components stay presentational — they call the hook, they don't import
>   `supabase`.
>
> **Constraints**
>
> - No thumbnails, no lightbox, no infinite scroll, no captions, no albums.
> - No real upload or delete yet — those are slices 4 and 5.
>
> Plan first.

---

## What to look for when you review the diff

- **Is there a `.filter(p => ...)` on visibility?** If yes, that is the
  teaching moment of the day. It would even *work*. Ask why it's still wrong.
  (The rows already crossed the network — filtering after the fact protects
  nothing. It only looks right because RLS was already doing the real job.)
- Signed URL expiry: what did it pick, and did it say why? A 60-second expiry
  and a slow render is a support ticket.
- N+1: one `createSignedUrl` call per photo inside a `map` works fine with six
  photos and is still worth naming as a smell.
- Does the empty state render, or does an empty array look like a bug?
- Did `PhotoCard` import `supabase`? That's the hooks rule failing visibly.
- **Is `fixtures.ts` actually deleted**, and did the components survive the
  swap mostly untouched? A big component diff here means the fixture shape
  lied in slice 1.

## Teaching beat

The gallery is empty and **that emptiness is load-bearing**: a denied read in
Postgres RLS looks exactly like "there's nothing there" — zero rows, no error,
no 403. Say it now, while the empty grid is on the projector, so it lands
before someone hits it as a "bug" in slice 3. When a query comes back empty:
check you're authenticated, check a row exists at all, *then* suspect the
policy.

## Done when

A signed-in user with no photos sees a friendly empty gallery, not an error —
and the console is clean.
