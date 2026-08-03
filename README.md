# Prompting to Production — agentic coding course

Two sessions, two hours each. Build and ship a real full-stack app working
*with* an AI agent — planning, delegating, reviewing — rather than chatting with
one.

The project is **FamAlbum**: a shared family photo album where you sign in with
Google, upload photos, and mark each one private or shared. The gallery shows
exactly what you're allowed to see, and the database is what makes that true.

---

## How this repo is organised

**`main` is the course kit, not the app.** It holds the instructions, the agent
toolkit, and reference material — everything that stays useful after the app is
built. There is no `package.json` here and nothing to run.

**The work lives on the `step*` branches**, each one the completed state after
that step. They chain: `step2` branches from `step1`, and so on. So if you fall
behind, check out the next step branch and you're caught up.

```
main            course kit — instructions, prompts, skills, agents, resources, examples
 └─ step1       the thinking: spec + architecture plan. Still no code.
     └─ step2   the runnable starter: toolchain, typed client, migration, empty shell
         └─ step3   (session 1 — auth)
             └─ …
```

**No code exists until `step2`.** Step 1 is deliberately about deciding what to
build (the spec) and how to build it (the plan) — the two exercises below.
Every step branch inherits everything on `main`, so `CLAUDE.md`, the prompts
and the skills travel with you.

### Getting started

```bash
git clone https://github.com/yaniv-birenboim-brandish/promptingToProduction.git
cd promptingToProduction
git checkout step1
```

No `npm install` yet — there's nothing to install until the starter arrives on
`step2`. Step 1 is the two exercises below; both produce markdown, not code.

### The first exercise: write the spec

There is deliberately **no spec in this repo** — creating it is the first
thing you do, together with the agent. Start Claude Code in the repo:

```bash
claude
```

and say, in your own words, something like:

> Let's write the spec for FamAlbum.

The `build-spec` skill takes over from there. It knows the project (a shared
family photo album) and the technology (already fixed in
`instructions/tech-stack.md` — you will never be asked to choose a database),
and it guides you through short batches of questions about what the app
should do — **20 questions at most**, usually far fewer. At any point you can
say **"speed up"** to cut to the essentials, or **"write the spec"** to stop
the questions and get the file immediately, with gaps filled by marked
assumptions.

When it's done you'll have `instructions/spec.md` — the file every plan,
slice, and test in the course is built from.

### The second exercise: plan the build

With the spec written, say something like:

> Let's plan the build.

The `build-plan` skill acts as the project architect: it reads the spec, the
fixed tech stack, and `CLAUDE.md`, then proposes a development plan as
**vertical slices** — backend and frontend per slice, each ending with
something you can see working. **Critique the draft before accepting it** —
that's the exercise, and the most valuable minutes of session 1. Say
**"write the plan"** at any point to save it to `instructions/plan.md`.

### Then: the starter

With the spec and plan in hand, `git checkout step2` brings in the runnable
app skeleton. Follow the `README.md` on that branch — it covers `npm install`,
Supabase setup, and the one manual Google OAuth step.

---

## What's on `main`

| Path | What it is |
|---|---|
| `CLAUDE.md` | The agent's brief — stack, conventions, guardrails, scope. Inherited by every step branch. The highest-value file in the repo. |
| `instructions/tech-stack.md` | The fixed technology choices, with the why for each. Not up for discussion — that's the point. |
| `.claude/skills/build-spec/` | A working skill that guides you to the spec: short batches of questions (20 max), "speed up" / "write the spec" escape hatches, and technology never asked about. Session 1 opens with it — there is deliberately no spec in the repo. |
| `.claude/skills/build-plan/` | The architect skill: turns the spec into a critique-ready development plan (`instructions/plan.md`) — vertical slices with backend, frontend, risks, and a done-check per slice. |
| `instructions/setup-email.md` | Pre-session setup checklist, ready to send. |
| `instructions/facilitator-guide.md` | Minute-by-minute run sheet for both sessions. |
| `prompts/session-1/` | A starting prompt per slice, each with a "what to look for in the diff" review checklist. |
| `prompts/break-it.md` | The deliberately mis-scoped prompt, plus the debrief. |
| `skills/supabase-data-access/` | A finished skill, to study. |
| `skills/stub-skill/` | The one completed live in session 1. |
| `.claude/agents/` | Subagent definitions — `implementer` and `test-writer`. |
| `resources/` | The design. `react-template/` is the "purchased template" — the design as a runnable React app that slice 1 adapts into FamAlbum; `design-reference.md` documents its tokens and patterns. The original HTML theme lives only on the instructor's machine (gitignored; see `resources/README.md`). |
| `examples/` | The reference pieces the starter is assembled from — the configured Supabase client, generated types, the migration, and the env template. On `step2` these are wired into their real locations. |

### Not pre-built, on purpose

Slash commands (`/add-table`, `/scaffold-component`), hooks (format-on-write,
block-commit-on-failing-tests), and the PR-review agent are **built live in
session 2**. Shipping them finished would remove the segment. The two subagents
in `.claude/agents/` are here because session 2 uses them as a starting point
for the implementer-vs-test-writer contrast, not because they're the lesson.

---

## The two sessions

**Session 1 — build it.** `CLAUDE.md` walkthrough, then write the spec *with*
the agent using the `build-spec` skill, plan mode and a class critique of the
agent's plan, then five vertical slices with a commit each (the purchased
React template adapted into the stubbed UI, auth, real gallery, upload,
delete).
Then write a project skill live, and finish by breaking the app on purpose with
a bad prompt to see what the guardrails were doing.

**Session 2 — ship it.** Slash commands and hooks, subagents and tests, MCP
against the real Supabase schema, then hardening: RLS and Storage policies, a
serverless thumbnail function, and a live test of whether one user can load
another's private photo. Deploy to Netlify, agent-driven PR review in CI, and a
written team policy for where agents may act.

Full timings in `instructions/facilitator-guide.md`.

---

## For instructors

Read `instructions/facilitator-guide.md` first — it has the run sheet, the
things worth saying out loud, the known failure modes, and what to cut if you're
running long.

Two decisions to make before you send the setup email: how attendees get Google
OAuth credentials (three options, discussed at the bottom of
`instructions/setup-email.md`), and whether the Storage policies ship tight or
deliberately loose for the session-2 bypass demo (the migration in `examples/`
ships tight, with a commented loosened variant at the bottom for the demo).
