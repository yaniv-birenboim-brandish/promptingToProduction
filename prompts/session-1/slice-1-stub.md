# Slice 1 — Adapt the purchased template into FamAlbum's stub

**Goal:** the whole app is visible, clickable, and **already looks like the
template** before any backend exists — because you start *from* the
template. `resources/react-template/` is the course's "purchased template":
the JPhotolio portfolio page as a working React app in our exact stack.
Slice 1 adapts its data model to FamAlbum: photos with owners and
private/shared visibility, on fixture data in local state. Nothing
persists — a refresh resets it all, and that's correct.

**The lesson this slice embodies:** buy a template in the technology you
plan to build with. Then adapting it is a *data-model* change, not a
porting project.

**Time:** ~15 minutes.

**Commit message:** `feat: stubbed UI on fixture data, adapted from the template`

---

## Before you prompt

Do these by hand — they're setup, not agent work:

- [ ] `supabase/migrations/0001_init.sql` has been run in the SQL Editor
- [ ] Table Editor shows `photos` with the **RLS enabled** badge; Storage
      shows a private `photos` bucket
- [ ] `.env` is filled in and `npm run dev` shows **no** "Supabase isn't
      configured" banner
- [ ] Optional but worth it: run the template once so you know what you're
      adapting (`cd resources/react-template && npm install && npm run dev`)

---

## Prompt

> Read CLAUDE.md, instructions/plan.md, and resources/react-template/README.md
> first.
>
> Build slice 1 of the plan: adapt the React template at
> `resources/react-template/` into FamAlbum's stubbed UI, inside this app's
> `src/`.
>
> **Keep from the template** (layout, tokens, interactions — unchanged):
>
> - The design tokens in its `tailwind.config.js`, and the fonts in its
>   `index.html`
> - The header (nav cells, logo slot), the measured masonry (`useMasonry`),
>   the card hover interaction, the load reveal, the page-transition
>   curtain, the single-item view with prev/next, the footer
>
> **Adapt** (the data model becomes FamAlbum's):
>
> - `data.ts` becomes `src/lib/fixtures.ts`: a fixture user and ~12 photos
>   whose shape **matches `PhotoRow` from `src/lib/database.types.ts`** —
>   mixed owners and visibilities. Family members' photos are only ever
>   `shared` (you can never see someone else's private photo — a fixture
>   showing one would lie).
> - The **like badge** becomes the **private/shared badge** (private =
>   accent colour, shared = neutral) — same corner, same tuck.
> - The **category filter** becomes **all / my photos / family's** —
>   display-only; keep a comment saying so, because it will come up.
> - Card captions show owner ("You" / "Family") and date instead of title
>   and categories; nav cells say Gallery / You instead of the template's
>   pages.
>
> **Add** (FamAlbum features the template doesn't have):
>
> - An `UploadForm`: file input, private/shared choice defaulting to
>   **private**, submit adds a fixture entry to local state (file name is
>   enough — no reading bytes)
> - Delete on your own photos only (the template's closeme slot), removing
>   from local state
> - Local state in `App`; delete and upload update it
>
> **Constraints**
>
> - **No `supabase` import anywhere in this slice.** That starts in slice 2.
> - No router, no new dependencies. One accent colour: the private badge
>   and the primary action, nothing else.
>
> Plan first, then wait for me.

---

## What to look for when you review the diff

- **Any import of `supabase`?** Too early — that's the boundary of this
  slice, and the first test of whether the agent respects a "not yet".
- **Does the fixture shape match `PhotoRow` exactly**, or did it invent a
  `Photo` interface? Load-bearing: slice 3 swaps the data source and should
  not touch a single component.
- Did it *adapt* the template or *rewrite* it? A huge diff in layout code
  means it ported when it should have copied. The masonry hook, curtain,
  and hover should arrive essentially verbatim.
- Is the delete control keyed off `owner_id === fixtureUser.id`, mirroring
  the real ownership check later?
- **The accent discipline**: if the red-orange shows up beyond the private
  badge and the primary action, push back.
- **Is the filter display-only, and does a comment say so?** That line is
  the seed of the homework and session 2's whole security argument.

## Teaching beat

Say the quiet part about templates: the expensive thing was never the CSS —
it was the hundred small decisions (gutters, badge position, hover
choreography) that the template already made. Buying it in your own stack
means you inherit the decisions *and* the implementation, and "make it
yours" collapses to a data-model swap. Then point at the fixture shape:
slice 3 will delete `fixtures.ts` and point the same components at real
rows. Cheap discipline now, free refactor later.

## Done when

The grid renders looking like the template, the upload form adds a card,
delete removes one, clicking a photo opens it large behind the curtain,
the filter narrows the display — and a refresh resets everything to the
fixtures.
