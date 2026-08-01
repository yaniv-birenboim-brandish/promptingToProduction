# FamAlbum — the spec

A shared family photo album. Family members sign in with Google, upload
photos, and mark each one **private** (only them) or **shared** (the whole
family). The gallery shows exactly what the signed-in member is allowed to
see.

- Sign in with Google
- Upload a photo, choosing **private** or **shared** (private is the default)
- Browse the gallery of every photo you're allowed to see: your own (private
  *and* shared) plus everyone else's shared photos
- Filter the gallery display: all / my photos / family's
- Click a photo to view it large — a single-photo view with prev/next and
  the curtain transition from the design reference
- Delete your own photos

**Out of scope for v1:** thumbnails, editing, captions, albums, comments,
tags, search, per-person sharing, multi-file upload. *(These are the
expansion paths.)*

## Constraints

- Full-size images only. No resizing, no thumbnails.
- One image per upload.
- 5 MB per file, images only (jpeg / png / webp / gif).
- Exactly two visibility levels: `private`, `shared`. No third state.
- Masonry grid (CSS columns) with a display-only filter bar (all / mine /
  family's); a photo opens large in a single-photo view. No album nesting,
  no infinite scroll.

## Permissions

- A user sees their own photos (both visibilities) plus everyone's shared
  photos — enforced by the database, not by the UI.
- A user can insert, update, and delete only their own photos.
- Logged-out visitors see nothing.

## Definition of done

Two people sign in to the same project. Each uploads one private photo and
one shared photo. Each sees three photos: their own two, and the other
person's shared one. Neither can see the other's private photo. Each can
delete only their own. Nothing in the React code makes that true — the
database does.

## Data model sketch

```
photos
  id            uuid
  owner_id      uuid   -> auth.users
  storage_path  text   -> '<owner_id>/<uuid>.<ext>' in the `photos` bucket
  visibility    'private' | 'shared'
  caption       text (nullable — column exists, no UI in v1)
  created_at    timestamptz
```
