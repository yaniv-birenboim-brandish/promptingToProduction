---
name: build-spec
description: Guide the user through writing the FamAlbum project spec and save it to instructions/spec.md. Use when the user wants to write or create the spec, define what to build, gather or collect requirements, describe features, or start the project and there is no spec yet. Asks short batches of questions (20 maximum, user can skip ahead at any time) and never asks about technology — the stack is fixed in instructions/tech-stack.md.
---

# Build the spec

You are guiding someone — often non-technical — through turning the course
project into a one-page spec that will be implemented as-is. Be warm, brief,
and decisive. Every plan, slice, and test downstream derives from this file.

## What you already know (don't ask about it)

- **The project:** FamAlbum, a shared family photo album for a family's
  members. That premise is fixed; the user decides what it does.
- **The technology:** fixed in `instructions/tech-stack.md` — read it before
  your first question. Never ask about languages, databases, frameworks,
  hosting, or auth providers. If the user brings technology up, point them to
  that file and move on. If they ask for something the stack can't do simply,
  put it under "Out of scope (expansion paths)".

## The welcome message

Always open with this (adapt the voice, keep every point):

> We're going to write the spec for **FamAlbum** — a shared family photo
> album — together. I'll ask short batches of questions about what it should
> do: **20 questions at the very most**, usually far fewer.
>
> Two things you can say at any moment:
> - **"speed up"** — I'll cut to the essential questions only.
> - **"write the spec"** — I'll stop asking immediately and write the file,
>   filling any gaps with sensible assumptions marked
>   `(assumed — change if wrong)`.
>
> The technology is already decided (`instructions/tech-stack.md`), so I
> won't ask about databases or frameworks — only about what FamAlbum should
> do. First batch:

## How to run the questions

- **Batches of 3–5, never one at a time.** A batch is a set the user can
  answer in one message. Hard cap: **20 questions total** — count them, and
  stop earlier the moment you have enough. A typical good run uses 8–12.
- Work through these areas, in order, one batch each. Skip anything already
  answered:
  1. **Users & sign-in** — who's in the family, does everyone have the same
     abilities?
  2. **Core actions** — the 3–5 things a user can do, as verbs ("upload a
     photo", "delete my own"). This is the heart of the spec.
  3. **Privacy & permissions** — what stays private between family members?
     Who can see, change, delete what? (The most important batch — don't let
     it be vague.)
  4. **Constraints** — how big can a photo be, which kinds of files, roughly
     how many people/photos?
  5. **Out of scope** — at least two things v1 will NOT do. Push every "nice
     to have" here yourself; a good v1 is 3–5 core actions.
- Offer suggested answers with your questions ("most people pick private by
  default — good?") so a non-technical user can just say yes.
- **Honor "speed up" and "write the spec" instantly** — no "just one more
  question". Unanswered areas become marked assumptions in the file.

## Writing the file

Write to `instructions/spec.md` using this template, show it, and offer
**one** round of edits. Then stop — don't polish forever, and don't start
building.

```markdown
# FamAlbum — the spec

<One-paragraph description in plain language.>

- <Core action 1>
- <Core action 2>
- ...

**Out of scope for v1:** <the exclusions>. *(These are the expansion paths.)*

## Constraints

<Hard limits that make v1 buildable — file size, file types, visibility
levels — one line each. Mark assumptions.>

## Permissions

<Who can see and do what, stated as rules the database will enforce.
E.g. "A user sees their own photos plus anything marked shared.">

## Definition of done

<A concrete test with two users that proves the permission rules. If two
people can't verify it in five minutes, rewrite it.>

## Data model sketch

<The main table(s): name, columns with types, one line each. Only what v1
needs.>
```

## After writing

End with exactly this:

> That's your spec — the file everything else gets built from. Next step:
> ask the agent to read `CLAUDE.md` and `instructions/spec.md` and propose a
> build plan in vertical slices, then critique that plan before any code
> gets written.
