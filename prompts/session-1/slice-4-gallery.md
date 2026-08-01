# Slice 4 — Gallery: everything you're allowed to see

**Goal:** a grid showing your own photos (private and shared) plus everyone's
shared photos. Delete your own. Nothing else.

**Time:** ~15 minutes.

**Commit message:** `slice 4: gallery grid with permission-scoped reads`

---

## Prompt

> Read CLAUDE.md first.
>
> Build slice 4: the gallery.
>
> **Requirements**
>
> - A `usePhotos` hook in `src/hooks/` that selects from `photos`, newest
>   first, and returns `{ photos, isLoading, error, refresh }`.
> - **Do not filter by visibility in JavaScript.** RLS already returns exactly
>   the rows this user may see. If you add a `.filter()` in React you're
>   pretending to do security while doing rendering.
> - Storage objects are private, so each image needs a signed URL —
>   `createSignedUrl`. Batch them if you can (`createSignedUrls`). Handle the
>   case where a URL fails to sign.
> - A `PhotoGrid` component: responsive grid, full-size images, a small badge
>   showing private vs shared, and an empty state. Presentational only.
> - Delete your own photo: remove the Storage object and the row. Photos you
>   don't own show no delete control. Refresh the list after.
> - After a successful upload the gallery updates without a manual reload.
>
> **Constraints**
>
> - No thumbnails, no lightbox, no infinite scroll, no captions, no albums.
>
> Plan first.

---

## What to look for when you review the diff

- **Is there a `.filter(p => ...)` on visibility?** If yes, that is the teaching
  moment of the day. It will even *work*. Ask why it's still wrong. (Because the
  rows already crossed the network — filtering after the fact protects nothing.
  The only reason it looks right is that RLS was already doing the real job.)
- Signed URL expiry: what did it pick, and did it say why? A 60-second expiry
  and a slow render is a support ticket.
- Does delete remove the object *and* the row, or leave one behind?
- Is the delete control hidden for other people's photos in the UI only, or is
  the app relying on the policy too? (Both is the right answer — the UI hides
  it, the policy enforces it.)
- N+1: one `createSignedUrl` call per photo inside a `map` is a performance
  smell worth naming even though it works fine with six photos.

## Teaching beat

Have two people sign in on the same project. One uploads a private photo. The
other refreshes. It isn't there — and no code you wrote made that true. The
database did. That's the payoff for the whole session, and it sets up session 2:
*if the row is protected, is the file?* Leave the question hanging.
