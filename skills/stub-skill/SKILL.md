---
name: TODO-rename-me
description: TODO — this is the field that decides whether the skill ever fires. Write it last, after the body. See the checklist below.
---

<!--
  ===========================================================================
  SESSION 1 · 1:30–1:50 — you complete this file, live, together.

  Everything below is scaffolding and prompts to you. Delete the HTML comments
  as you fill each section in. By the end of the segment this should be a real
  skill you can fire on a real feature.

  The pattern you're capturing: **a typed query hook with Zod validation** —
  the thing you wrote four times in slices 2, 3 and 4. That repetition is the
  signal. A skill is worth writing exactly when you notice you've explained the
  same shape to the agent more than twice.
  ===========================================================================
-->

# TODO: name the pattern

<!--
  One or two sentences. What is this pattern, and when does someone reach for
  it? Write it for a teammate who joined today.

  Example shape: "Every data-fetching hook in this repo has the same skeleton:
  a typed query through the shared client, a Zod parse at the boundary, and a
  { data, error, isLoading } return. Follow it so hooks stay swappable."
-->

## When to use this

<!--
  Be concrete. "Adding a hook that reads or writes photos" beats "working with
  data". Ambiguity here is why skills fire at the wrong time.
-->

## The shape

<!--
  Show the skeleton as code. Real code from your repo beats invented code —
  open src/hooks/usePhotos.ts and generalise what's already there.

  Cover at least:
    - importing the one client from '@/lib/supabase'
    - importing row types from '@/lib/database.types'
    - the Zod schema, and where the .parse() happens
    - the { data, error, isLoading } return contract
    - cleanup / cancellation on unmount
-->

```ts
// TODO: paste and generalise a real hook
```

## Rules

<!--
  Short imperative bullets. The ones the agent got wrong at least once today
  are the ones worth writing down. Candidates from the slices:
    - components never import supabase
    - never filter for security in JavaScript
    - parse at the boundary, don't cast
    - check `error` before touching `data`
-->

- TODO

## Anti-patterns

<!--
  Show the wrong version next to the right one. Negative examples are the
  highest-value part of a skill and the part people skip.
-->

```ts
// ❌ TODO
// ✅ TODO
```

---

<!--
  ===========================================================================
  NOW GO BACK AND WRITE THE FRONTMATTER. This is the actual exercise.

  The `description` is the only part of a skill the agent sees before deciding
  whether to load it. A perfect body with a vague description never runs. It is
  a retrieval problem, not a documentation problem.

  Checklist for the description:
    [ ] Says what the skill DOES, in the words someone would actually use
    [ ] Says WHEN to use it — the triggering situation, not just the topic
    [ ] Contains the concrete nouns that appear in real requests:
        "hook", "photos table", "Supabase", "Zod", "fetch data"
    [ ] Third person, one or two sentences
    [ ] Would still match a request phrased completely differently from how
        you'd phrase it

  Weak:   "Helper for hooks."
  Better: "Creating a data hook in FamAlbum."
  Strong: "Scaffold a typed data hook that reads or writes FamAlbum data
           through Supabase, with Zod validation at the boundary and a
           { data, error, isLoading } return. Use when adding any hook under
           src/hooks/ that touches the photos table or Storage."

  Then TEST IT. Start a fresh context and ask for a new feature in your own
  words — "let me toggle a photo between private and shared" — without
  mentioning the skill. Did it fire?

    - Fired, right output      -> done, commit it
    - Didn't fire              -> the description is the bug, not the body
    - Fired but did the wrong thing -> the body is the bug

  That loop is the whole lesson. Triggering is the game.
  ===========================================================================
-->
