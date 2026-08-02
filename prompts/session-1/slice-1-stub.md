# Slice 1 — Stubbed UI on fixture data

**Goal:** the whole app is visible and clickable before any backend exists:
gallery grid, upload control with a private/shared choice, delete on "your"
photos. Everything runs on fixture data in local state; nothing persists — a
refresh resets it all, and that's correct.

**Time:** ~10 minutes. The fast visible win.

**Commit message:** `feat: stubbed UI on fixture data`

---

## Before you prompt

Do these by hand — they're setup, not agent work:

- [ ] `supabase/migrations/0001_init.sql` has been run in the SQL Editor
- [ ] Table Editor shows `photos` with the **RLS enabled** badge; Storage
      shows a private `photos` bucket
- [ ] `.env` is filled in and `npm run dev` shows **no** "Supabase isn't
      configured" banner

(The migration isn't used in this slice — but confirming it now means slice 2
onward never stops for setup.)

---

## Prompt

> Read CLAUDE.md and instructions/plan.md first.
>
> Build slice 1 of the plan: the stubbed UI.
>
> **Requirements**
>
> - `src/lib/fixtures.ts`: a fixture "current user" and 6–8 fixture photos
>   whose shape **matches `PhotoRow` from `src/lib/database.types.ts`** — a
>   mix of visibilities and owners. Image sources are embedded placeholders
>   (inline SVG data URIs are fine); no network calls.
> - A `Gallery` grid of `PhotoCard`s: image, a plain private/shared badge,
>   and a delete control shown only on photos owned by the fixture user.
> - An `UploadForm`: file input, private/shared choice defaulting to
>   **private**, and a submit that adds a fixture entry to local state (the
>   picked file's name is enough — no reading bytes).
> - Local state only, in `App`. Delete removes from local state.
>
> **Constraints**
>
> - **No `supabase` import anywhere in this slice.** No hooks that talk to
>   the network. That starts in slice 2.
> - No router, no new dependencies, no styling beyond the barest Tailwind —
>   the design pass is slice 6.
>
> Plan first, then wait for me.

---

## What to look for when you review the diff

- **Any import of `supabase`?** Too early — that's the whole boundary of this
  slice. It's also the first test of whether the agent respects a "not yet"
  constraint.
- **Does the fixture shape match `PhotoRow` exactly**, or did it invent a
  `Photo` interface by hand? This is load-bearing: slice 3 swaps the data
  source and should not touch a single component.
- Is the delete control keyed off `owner_id === fixtureUser.id`, mirroring
  how the real ownership check will read later?
- Did it sneak in persistence (localStorage) to be "helpful"? Out of scope.

## Teaching beat

Two lessons in one slice. First: **the UI shape is a spec conversation** —
with everything clickable in ten minutes, the non-technical people in the
room can react to what FamAlbum *is* before any backend argument starts.
Second: **swap data, not components** — say out loud that slice 3's entire
job will be deleting `fixtures.ts` and pointing the same components at real
rows. That only works because the fixtures were shaped like `PhotoRow` from
the start. Cheap discipline now, free refactor later.

## Done when

The grid renders, the upload form adds a card, delete removes one — and a
refresh resets everything to the fixtures.
