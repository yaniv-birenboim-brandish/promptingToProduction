---
name: build-spec
description: Collect requirements through one short round of questions and write the one-page project spec to instructions/spec.md. Use when the user wants to define what to build, write or create a spec, gather or collect requirements, describe their app idea, or start a new project and doesn't have a spec yet. Never asks about technology — the stack is fixed in instructions/tech-stack.md.
---

# Build the spec

You are helping someone — possibly non-technical — turn an app idea into a
one-page spec the whole project will be built from. Be brief, concrete, and
decisive. The spec matters because every plan, slice, and test derives from it.

## Rules

- **One round of questions, four at most, all asked together.** No follow-up
  interviews. If an answer is missing or vague, make the sensible choice
  yourself and mark it `(assumed — change if wrong)` in the spec. A student
  correcting one assumption beats a student answering ten questions.
- **Never ask about technology.** Language, database, auth provider, hosting —
  all fixed in `instructions/tech-stack.md`. Read it first; don't relitigate it.
  If the user names a technology, note it under "Expansion paths" and move on.
- **Keep it to one page.** A spec nobody reads is worse than none.
- **Scope ruthlessly toward v1.** Push every "nice to have" into
  "Out of scope (expansion paths)". A good v1 is 3–5 core actions.
- Write the spec to `instructions/spec.md`, show it, and offer **one** round of
  edits. Then stop — don't polish forever, and don't start building.

## The four questions

Ask exactly these, in one message, adapted to their idea if they've already
described one:

1. **What are we building?** One or two sentences, in plain words.
2. **Who uses it, and what should stay private between users?** (This decides
   the permission model — the most important answer of the four.)
3. **What are the 3–5 things a user can do?** Verbs, not features — "upload a
   photo", "mark it private", "delete my own".
4. **Name two things it should NOT do in v1.** (Scope is defined by its edges.)

## Spec template

```markdown
# <Name> — the spec

<One-paragraph description in plain language.>

- <Core action 1>
- <Core action 2>
- ...

**Out of scope for v1:** <the user's exclusions plus anything you pushed out>.
*(These are the expansion paths.)*

## Constraints

<Hard limits that make v1 buildable: file sizes, counts, levels of
visibility/permission — each one line. Mark assumptions.>

## Permissions

<Who can see and do what, stated as rules the database will enforce.
E.g. "A user sees their own items plus anything marked shared.">

## Definition of done

<A concrete test with two users that proves the permission rules. If two
people can't sit down and verify it in five minutes, rewrite it.>

## Data model sketch

<The main table(s): name, columns with types, one line each. Keep it to what
v1 needs.>
```

## After writing

End with exactly this note to the user:

> The stack is already decided (see `instructions/tech-stack.md`) — the spec
> deliberately doesn't mention technology. Next step: ask the agent to read
> `CLAUDE.md` and this spec and propose a build plan in vertical slices —
> then critique the plan before any code gets written.
