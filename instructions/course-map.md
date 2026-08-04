# Course map — what happens at each step, and which branch has what

One-page reference for the instructor. Full minute-by-minute run sheet:
`facilitator-guide.md`.

## The one rule

**Step numbers = course phases.** Every phase's *finished state* is a branch,
so anyone lost or behind runs `git checkout <next step>` and rejoins.
`starter` is the only unnumbered branch — it's the seeded environment, not a
phase.

Mapping formula: **plan slice N = phase N+1 = branch step N+1** (prompt file:
`prompts/session-1/slice-N-*.md`).

## Branches

| Branch | Contains | Used when |
|---|---|---|
| `main` | Course kit only: instructions, skills (`build-spec`, `build-plan`), slice prompts, subagents, the React template. Nothing to run. | Students clone and land here. |
| `step1` | + `instructions/spec.md` and `plan.md` — the two exercise results. Still no code. | Catch-up for phase 1. |
| `starter` | + the seeded app: Vite/React/Tailwind toolchain, typed Supabase client, migration (table + RLS + bucket + policies), logged-out shell. | Everyone checks this out to start coding. Also the pre-course smoke test. |
| `step2` | + phase 2 done: the template adapted into FamAlbum's stub (masonry, filter, badges, upload/delete on fixtures). No supabase imports. | Catch-up after the stubs. |
| `step3` |  + phase 3: Google sign-in gating the stub (`useSession`; sign-in is faked locally until Supabase is configured). | |
| `step4` | + phase 4: real gallery through the `usePhotos` hook — RLS query + batched signed URLs (fixture-fed until Supabase is configured; upload/delete stay clickable via the hook's fake-mode helpers). | |
| `step5` | + phase 5: upload with rollback — Zod validation live in both modes; storage path + orphan rollback real, faked to a local object URL until Supabase is configured. | |
| `step6` | + phase 6: delete your own; the spec's two-user test passes. v1 done. *(to build)* | End of session 1. |
| `step7+` | Session 2: slash commands + hooks, tests + CI, MCP, hardening + thumbnails, deploy. *(to build)* | |

## Phase by phase (session 1)

| Phase | What happens | Driven by | Produces | ~time |
|---|---|---|---|---|
| 0 (home) | Installs; smoke test on `starter` | setup email | working laptop | 30 min |
| 1 | Say "let's write the spec" → **build-spec** skill (≤20 questions, "speed up"/"write the spec" escape hatches). Then "let's plan the build" → **build-plan** skill; class critiques the draft. | the two skills | `instructions/spec.md`, `instructions/plan.md` | 30 min |
| — | `git checkout starter`; Supabase project, migration, `.env`, Google OAuth (README §3–6) | by hand | running shell | in setup / early class |
| 2 | Adapt `resources/react-template/` into the stub | `slice-1-stub.md` | UI on fixtures | 15 min |
| 3 | Google sign-in gates the stub | `slice-2-auth.md` | real session | 10 min |
| 4 | Fixtures → database (RLS + signed URLs) | `slice-3-gallery.md` | real gallery | 12 min |
| 5 | Upload with rollback ⚠ riskiest | `slice-4-upload.md` | real upload | 18 min |
| 6 | Delete your own → two-user test passes | `slice-5-delete.md` | v1 complete | 5 min |
| — | Write a skill live (`skills/stub-skill/`), then break it on purpose (`prompts/break-it.md`) | — | the toolkit lesson | 30 min |

One commit per phase; `/clear` between phases; review every diff against the
prompt's checklist before committing.

## Instructor-only, on your machine (never in the repo)

- `resources/jphotolio-html-bundle/` — the purchased HTML theme (provenance).
- Theme photos/textures/logo in `public/` and the template's `public/` —
  students get graceful fallbacks; you restore yours with
  `resources/react-template/import-theme-assets.sh`.
- `instructions/course_instructions.md` and `spec-example-scope-balloon.md`
  — untracked private notes.
