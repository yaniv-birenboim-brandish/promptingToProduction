# Slice 1 — Confirm the schema, policies, and typed client

**Goal:** prove the plumbing is real before building anything on top of it.
By the end you can see, in the running app, that the client is configured and
talking to your Supabase project.

**Time:** ~10 minutes. This is the warm-up.

**Commit message:** `slice 1: verify schema, policies and typed client`

---

## Before you prompt

Do these by hand — they're setup, not agent work:

- [ ] `supabase/migrations/0001_init.sql` has been run in the SQL Editor
- [ ] Table Editor shows `photos` with the **RLS enabled** badge
- [ ] Storage shows a `photos` bucket, marked private
- [ ] `.env` is filled in and `npm run dev` shows **no** "Supabase isn't
      configured" banner

---

## Prompt

> Read CLAUDE.md first.
>
> I've applied `supabase/migrations/0001_init.sql` to my project and filled in
> `.env`. Before we build any features I want to prove the plumbing works.
>
> Add a small, temporary diagnostic to the logged-out screen in `src/App.tsx`
> that shows three things:
>
> 1. whether the env vars are present
> 2. the result of a `select` against `photos` — I expect zero rows and **no
>    error**, because RLS denies an unauthenticated read by returning an empty
>    set rather than a 403
> 3. whether the `photos` Storage bucket is reachable
>
> Use the existing client in `src/lib/supabase.ts` and the types in
> `src/lib/database.types.ts`. Do not add dependencies. Do not build auth,
> upload, or the gallery — that's the next three slices.
>
> Keep it to one file if you can, and mark it clearly as temporary
> scaffolding we'll delete in slice 2.
>
> Show me the plan before you write code.

---

## What to look for when you review the diff

- Did it import `supabase` from `src/lib/supabase.ts`, or quietly create a
  second client? (CLAUDE.md forbids the second client — did the rule hold?)
- Did it use `PhotoRow` from the types file, or invent its own interface?
- Did it stay in scope, or start scaffolding a login button "while it was in
  there"?

## Teaching beat

The empty-array-with-no-error result is the thing to dwell on. **A denied read
in Postgres RLS looks exactly like "there's nothing there."** Half the debugging
pain in this stack comes from not internalising that. Say it now so it lands
before anyone hits it at 1:15.
