# FamAlbum — `starter`, the seeded environment

> **Branch map.** `main` is the course kit — instructions, prompts, skills,
> agents, resources. `step1` added the thinking: the spec and the build plan,
> still no code. This branch, `starter`, is the seeded environment you build
> from — it is not a course phase. The phases continue as `step2` (the
> template adapted into stubs), `step3` (auth), and so on — each branch the
> completed state after that phase, so if you fall behind, check out the
> next one and you're caught up.

A shared family photo album. Sign in with Google, upload photos, mark each one
**private** (just you) or **shared** (the whole family). The gallery shows only
what you're allowed to see.

This is the starter for the **Agentic Coding** course. The environment is seeded
so you don't lose class time to bucket policies and CORS. The *features* are
not — you build those with the agent.

> **What's already here:** the toolchain, a configured Supabase client, typed
> schema definitions, and a migration that sets up the table, RLS, the Storage
> bucket and its policies.
>
> **What's missing (this is the course):** login, upload, and the gallery.
> `npm run dev` boots to a logged-out screen with a dead sign-in button. That's
> correct.

---

## 1. Prerequisites

- Node.js LTS (`node -v` should print v20 or newer)
- A [Supabase](https://supabase.com) account (free tier)
- A Google Cloud project for OAuth credentials — **or** the shared credentials
  your instructor hands out
- Claude Code, installed and authenticated
- Git, and a GitHub account you can push to

---

## 2. Install

```bash
git clone https://github.com/yaniv-birenboim-brandish/promptingToProduction.git
cd promptingToProduction
git checkout starter
npm install
```

> **Already did step 1?** Your `instructions/spec.md` and
> `instructions/plan.md` carry over from `step1` — this branch ships the same
> two files as committed reference, produced by the `build-spec` and
> `build-plan` skills. If you skipped step 1, read them before slice 1: the
> plan is what you're about to build.

---

## 3. Create your Supabase project

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
   Any name. Save the database password somewhere; you won't need it today but
   you'll be annoyed later if you lose it.
2. Wait for it to finish provisioning (~2 minutes).

---

## 4. Apply the migration

1. In the dashboard: **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/migrations/0001_init.sql`.
3. **Run**.

This creates the `photos` table, its RLS policies, the `photos` Storage bucket,
and the Storage policies. Verify it worked:

- **Table Editor** → you should see `photos` with an "RLS enabled" badge.
- **Storage** → you should see a `photos` bucket, marked private.

> If you use the Supabase CLI instead, `supabase link` then `supabase db push`
> does the same thing.

---

## 5. Set your environment variables

```bash
cp .env.example .env
```

In the dashboard: **Project Settings → API**. Copy:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

The anon key is *supposed* to be in your browser bundle. It isn't a secret —
RLS is what protects your data. (More on this in session 2.) The
**`service_role`** key is a real secret. Don't put it in this project at all.

---

## 6. The one manual step: Google OAuth

This is the only piece that can't be seeded, because the credentials are per
environment. **If your instructor gave you shared credentials, skip to 6c.**

### 6a. Create the credentials in Google Cloud

1. [console.cloud.google.com](https://console.cloud.google.com) → create or pick
   a project.
2. **APIs & Services → OAuth consent screen**. Choose **External**, fill in an
   app name and your email, save. Add yourself under **Test users**.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
   - Application type: **Web application**
   - **Authorised redirect URI**: your Supabase callback URL, which is
     `https://<your-project-ref>.supabase.co/auth/v1/callback`
     (Supabase shows you this exact string in step 6b — copy it from there.)
4. Copy the **Client ID** and **Client secret**.

### 6b. Tell Supabase about them

Supabase dashboard → **Authentication → Sign In / Providers → Google**:

- Enable it
- Paste the Client ID and Client secret
- Copy the **Callback URL** shown here back into Google if you haven't already
- Save

### 6c. Set your redirect URLs

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:5173`
- **Redirect URLs**: add `http://localhost:5173/**`

(Session 2 adds your Netlify URL here too.)

---

## 7. Run it

```bash
npm run dev
```

Open http://localhost:5173. You should see the FamAlbum logged-out screen with a
greyed-out "Sign in with Google" button and no error banner.

**That's a successful setup.** The button doesn't work yet — you're going to
make it work.

---

## Project layout

The app:

```
.env.example               every variable, named and commented
index.html
src/
  App.tsx                  the logged-out shell — you'll replace this
  main.tsx
  index.css                Tailwind + the shadcn theme variables
  lib/supabase.ts          the one configured client. All access goes through it.
  lib/database.types.ts    generated types for the schema
  lib/utils.ts             the `cn` helper
  components/              you build these
  components/ui/           shadcn/ui primitives
supabase/migrations/
  0001_init.sql            table + RLS + bucket + Storage policies
```

Inherited from `main`, and travelling with you onto every later step:

```
CLAUDE.md                  the agent's brief: stack, conventions, guardrails
prompts/session-1/         a starting prompt per slice, if you want one
prompts/break-it.md        the deliberately bad prompt (session 1, last segment)
skills/                    a finished skill to study, and the stub you complete
.claude/agents/            implementer and test-writer subagents
instructions/              the spec, tech stack, setup email, facilitator run sheet
resources/                 design material (see resources/README.md)
```

The three files under `src/lib/` and the migration started life in `examples/`
on `main` — `starter` is where they're wired into their real locations.
`git diff step1..starter` is a short, readable summary of what "seeding the
environment" actually meant.

---

## What you build (session 1)

The five slices of `instructions/plan.md`, one commit each:

1. **Stubs** — the purchased template (`resources/react-template/`) adapted
   into FamAlbum's UI on fixtures *(phase 2 → the `step2` branch)*.
2. **Auth** — Google sign-in gating the stub *(step3)*.
3. **Real gallery** — fixtures swapped for RLS-backed rows *(step4)*.
4. **Upload with rollback** — the riskiest slice *(step5)*.
5. **Delete your own** — the spec's two-user test passes *(step6)*.

---

## Troubleshooting

**Blank page, console says "Missing VITE_SUPABASE_URL"** — you didn't restart
the dev server after creating `.env`. Vite only reads it at startup.

**`redirect_uri_mismatch` from Google** — the URI in Google Cloud must match the
Supabase callback URL character for character, including `https://` and no
trailing slash.

**Login works but you land back logged out** — check **Authentication → URL
Configuration**. Site URL must be `http://localhost:5173`.

**Queries return an empty array and no error** — that's RLS doing its job. An
empty result is what a denied read looks like; you don't get a 403. Check that
you're actually authenticated (`supabase.auth.getSession()`), then check the
policy.

**Upload fails with "new row violates row-level security policy"** — your
storage path isn't `<your-user-id>/<filename>`. The Storage policies and the
table's check constraint both require that prefix.

**"Bucket not found"** — the migration didn't run, or it ran before you were
authenticated as the project owner. Re-run section 4.
