# Slice 5 — Styling pass (the design reference)

**Goal:** the app matches `resources/design-reference.md`. Behaviour is
byte-for-byte the same — this diff touches classes, tokens, and markup
structure, never hooks, queries, or policies.

**Time:** ~8 minutes. It's one prompt and a review.

**Commit message:** `style: apply design reference`

---

## Why styling is one batched slice

Every earlier diff was about behaviour, which kept each review about one
thing. Styling sprinkled through feature slices would have made every diff
about two things. Batching it also gives you a clean before/after on the
projector.

## Prompt

The ready-made prompt lives at the bottom of `resources/design-reference.md`
("Prompt for the agent") — paste it as written. It reads, in short: apply the
reference's palette, fonts, card treatment, and corner-badge pattern; keep
the fixed aspect-ratio grid (**no masonry**); scope is visual only, no
behaviour changes, no new features.

---

## What to look for when you review the diff

- **Zero changes to hooks, queries, or `supabase` calls.** If the diff
  touches a `.ts` file under `src/hooks/` or `src/lib/`, the scope boundary
  failed — that's worth naming out loud.
- The accent colour appearing in more than two places per screen. The
  reference's discipline is eight greys and one accent, used sparingly —
  private badge and primary action, nothing else.
- Did it reach for masonry anyway? The reference explains why not: masonry
  needs image dimensions, and v1 has no thumbnails. **The pretty layout has a
  data dependency** — say that sentence; it generalises.
- Fonts loaded as specified (PT Sans Narrow 400/700, Overlock italic only) —
  not the whole families.

## Teaching beat

This is scope discipline in its purest form: a prompt whose boundary is "change
how it looks, change nothing about what it does." The review is trivially
mechanical — `git diff --stat` should show config, CSS, and `.tsx` markup, and
nothing else. A perfect slice to let someone who's been quiet drive.

## Done when

It looks like the reference, `npm run typecheck` passes, and a click-through
of all four earlier slices behaves exactly as before.
