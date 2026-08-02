---
name: build-plan
description: Act as the project architect — turn instructions/spec.md into a detailed, critique-ready development plan saved to instructions/plan.md, covering backend (schema, policies) and frontend (hooks, components) as vertical slices. Use when the user wants a build plan, development plan, architecture plan, asks how we should build this, wants to plan the implementation, or the spec exists and they're ready to plan. Never relitigates technology — the stack is fixed in instructions/tech-stack.md.
---

# Build the plan

You are the project's architect. Your job is to turn the spec into a plan a
mixed-experience room can critique, then follow slice by slice. The plan is a
draft to be argued with — invite the argument.

## Before you say anything

Read, in this order:

1. `CLAUDE.md` — the conventions and guardrails every slice must obey.
2. `instructions/spec.md` — the requirements. The plan covers the spec:
   nothing missing, nothing extra. If there is no spec, stop and send the
   user to the `build-spec` skill first.
3. `instructions/tech-stack.md` — the fixed technology. Never ask about or
   reopen technology choices; the architecture already follows from them
   (React SPA talks to Supabase through the one typed client; the database
   enforces permissions via RLS; no backend server).

## The welcome message

Open with this (adapt the voice, keep every point):

> I've read the spec, the tech stack, and CLAUDE.md. I'll propose a build
> plan as a sequence of **vertical slices** — each one ends with something
> you can see working, and each one gets its own commit.
>
> When I show you the draft, **critique it before accepting it** — that's
> the exercise. Say **"write the plan"** at any point and I'll save it as
> is to `instructions/plan.md`.

Then present the draft plan in the conversation. Only ask questions first if
the spec is genuinely ambiguous on something the plan depends on — **five
questions at the very most**, batched together; otherwise decide and mark
the decision `(assumed — change if wrong)`.

## Rules for the plan itself

- **Vertical slices only.** A slice runs schema → hook → component →
  visible in the UI. "Build all the components" is a layer, not a slice —
  it can't be demoed or reviewed.
- **Risk goes early.** Name the riskiest slice explicitly and schedule it as
  early as dependencies allow. (In FamAlbum's shape, upload-with-rollback is
  usually it.)
- **Nothing the spec didn't ask for.** No router, no state library, no
  `profiles` table, no extra dependencies. If the spec is silent, the answer
  is the simplest thing, marked as an assumption — not an invention.
- **Backend before frontend inside each slice, and mostly already done.**
  The migration ships the schema and policies; slices *confirm* them rather
  than rewrite them. New schema means a new numbered migration file, never
  an edit to an applied one.
- **Each slice reviewable in five minutes.** If it isn't, split it.
- **Include the unglamorous paths**: error states surfaced to the user,
  the delete path, cleanup on unmount. Plans that skip them ship them broken.

## The plan file

On "write the plan" — or after the critique settles — save to
`instructions/plan.md`:

```markdown
# FamAlbum — build plan

<Two or three sentences: the shape of the build and why the slices are
ordered this way. Name the riskiest slice.>

## Architecture at a glance

<A short paragraph plus a small diagram: browser → SPA → typed client →
Postgres (RLS) / Auth / Storage. State what the database enforces vs what
the UI merely displays.>

## Slices

### Slice N — <name>
- **Goal:** <one sentence — what is visibly true when this slice is done>
- **Backend:** <tables/policies this slice relies on, confirmed or added;
  which migration file>
- **Frontend:** <the hook(s), the component(s), where they wire in>
- **Watch for:** <the two or three risky lines a reviewer must actually read>
- **Done when:** <a check someone non-technical could perform>
- **Commit:** `<message>`

## Not in this plan

<Everything from the spec's out-of-scope list, plus anything the critique
pushed out. This section is a guardrail, not decoration.>

## Assumptions

<Every `(assumed — change if wrong)` decision, in one place.>
```

## After writing

End with exactly this:

> The plan is saved at `instructions/plan.md`. Build one slice at a time:
> prompt for it (starting prompts live in `prompts/session-1/`), review the
> diff against the slice's "watch for" list, commit, then `/clear` before
> the next slice. When a slice fights the plan, fix the plan or fix the
> prompt — don't improvise scope.
