# Slice 1 — Stubbed UI on fixture data, styled from the start

**Goal:** the whole app is visible, clickable, and **already looks like
FamAlbum** before any backend exists: gallery grid, upload control with a
private/shared choice, delete on "your" photos — all styled per
`resources/design-reference.md`. Everything runs on fixture data in local
state; nothing persists — a refresh resets it all, and that's correct.

**Time:** ~15 minutes. The fast visible win.

**Commit message:** `feat: stubbed UI on fixture data, styled per design reference`

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

> Read CLAUDE.md, instructions/plan.md, and resources/design-reference.md
> first.
>
> Build slice 1 of the plan: the stubbed UI, styled per the design reference.
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
> - Clicking a photo opens a **single-photo view** — large image, owner and
>   date, prev/next, and a back control — behind the reference's **curtain
>   transition**: a page-covering panel slides down, the view swaps, the
>   panel lifts. No router — conditional rendering.
> - Local state only, in `App`. Delete removes from local state.
> - Style it per the design reference as you build: the palette and fonts
>   into `tailwind.config.js` (PT Sans Narrow 400/700, Overlock 400 italic
>   from Google Fonts), white cards on the off-white page, tight gutters,
>   3px radius, the card shadow, caption strip below the image, and the
>   private/shared **corner badge** tucked into the image (private = accent,
>   shared = neutral). **Masonry** via CSS multi-column (`columns-*` +
>   `break-inside-avoid`); give the fixtures mixed portrait/landscape sizes
>   so the columns interlock. Header per the reference: nav cells with
>   label + italic sublabel, the logo splitting the middle.
> - A centered **filter bar** (all / my photos / family's) styled as the
>   reference's pills — active pill solid chrome-black. It filters the
>   *display* only; put that in a comment, because it will come up.
>
> **Constraints**
>
> - **No `supabase` import anywhere in this slice.** No hooks that talk to
>   the network. That starts in slice 2.
> - No router, no new dependencies. One accent colour, used sparingly —
>   the private badge and the primary action, nothing else.
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
- **The accent discipline**: the reference is eight greys and one accent —
  if the red-orange shows up anywhere beyond the private badge and the
  primary action, push back.
- **Is the filter display-only, and does a comment say so?** This line is
  the seed of the homework and of session 2's whole security argument.

## Teaching beat

Two lessons in one slice. First: **the UI shape is a spec conversation** —
with everything clickable in ten minutes, the non-technical people in the
room can react to what FamAlbum *is* before any backend argument starts.
Second: **swap data, not components** — say out loud that slice 3's entire
job will be deleting `fixtures.ts` and pointing the same components at real
rows. That only works because the fixtures were shaped like `PhotoRow` from
the start. Cheap discipline now, free refactor later.

## Done when

The grid renders, the upload form adds a card, delete removes one, clicking
a photo opens it large behind the curtain and back returns to the grid — and
a refresh resets everything to the fixtures.
