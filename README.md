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

**The app lives on the `step*` branches**, each one the completed state after
that step. They chain: `step2` branches from `step1`, and so on. So if you fall
behind, check out the next step branch and you're caught up, with a working app.

```
main            course kit — instructions, prompts, skills, agents, resources, examples
 └─ step1       the runnable starter: toolchain, typed client, migration, empty shell
     └─ step2   (session 1, slice 2 — auth)
         └─ …
```

Every step branch inherits everything on `main`, so `CLAUDE.md`, the prompts and
the skills travel with you.

### Getting started

```bash
git clone https://github.com/yaniv-birenboim-brandish/promptingToProduction.git
cd promptingToProduction
git checkout step1
npm install
```

Then follow `README.md` on that branch — it covers Supabase setup and the one
manual Google OAuth step.

---

## What's on `main`

| Path | What it is |
|---|---|
| `CLAUDE.md` | The agent's brief — stack, conventions, guardrails, scope. Inherited by every step branch. The highest-value file in the repo. |
| `instructions/spec.md` | The one-page spec, handed out in session 1. |
| `instructions/setup-email.md` | Pre-session setup checklist, ready to send. |
| `instructions/facilitator-guide.md` | Minute-by-minute run sheet for both sessions. |
| `prompts/session-1/` | A starting prompt per slice, each with a "what to look for in the diff" review checklist. |
| `prompts/break-it.md` | The deliberately mis-scoped prompt, plus the debrief. |
| `skills/supabase-data-access/` | A finished skill, to study. |
| `skills/stub-skill/` | The one completed live in session 1. |
| `.claude/agents/` | Subagent definitions — `implementer` and `test-writer`. |
| `resources/` | Design reference material. |
| `examples/` | The reference pieces the starter is assembled from — the configured Supabase client, generated types, the migration, and the env template. On `step1` these are wired into their real locations. |

### Not pre-built, on purpose

Slash commands (`/add-table`, `/scaffold-component`), hooks (format-on-write,
block-commit-on-failing-tests), and the PR-review agent are **built live in
session 2**. Shipping them finished would remove the segment. The two subagents
in `.claude/agents/` are here because session 2 uses them as a starting point
for the implementer-vs-test-writer contrast, not because they're the lesson.

---

## The two sessions

**Session 1 — build it.** `CLAUDE.md` walkthrough, spec, plan mode and a class
critique of the agent's plan, then four vertical slices with a commit each.
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
