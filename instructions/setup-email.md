# Attendee setup email

*Copy from the line below. Replace the date/time and decide the Google OAuth
question before sending (see the note at the bottom).*

---

**Subject:** Before session 1 — 20 minutes of setup, please do this in advance

Hi all,

Looking forward to **[DATE, TIME]**. We have two hours and I'd like to spend all
of them building rather than installing things, so please work through the
checklist below **before** we start. It takes about 20 minutes, most of which is
waiting for downloads.

We're building **FamAlbum** — a shared family photo album where you log in with
Google, upload photos, and mark each one private or shared. You'll build it
alongside an AI agent: planning, delegating, and reviewing, rather than typing
every line. Session 2 takes it to production.

## Checklist

- [ ] **VS Code** installed — https://code.visualstudio.com
- [ ] **Node.js LTS** installed — https://nodejs.org — check with `node -v`
      (should print v20 or newer)
- [ ] **Claude Code** installed *and authenticated*. Run `claude` in a terminal
      and confirm it starts without asking you to log in.
- [ ] **GitHub account**, and you can clone and push from this machine
- [ ] **Supabase account** (free tier) — https://supabase.com
- [ ] **Netlify account** (free tier) — https://netlify.com — we need this in
      session 2, but sign up now so it's done
- [ ] **Google Cloud project** for OAuth credentials — instructions are in the
      README on the `step2` branch, section 6. *(See the note below.)*
- [ ] **Clone the repo and confirm the app skeleton runs:**

```bash
git clone https://github.com/yaniv-birenboim-brandish/promptingToProduction.git
cd promptingToProduction
git checkout step2
npm install
npm run dev
```

*(The `git checkout step2` matters: `main` is the course kit and `step1` is
where we write the spec and plan — no code exists until `step2`. Checking out
`step2` here is only to prove your machine can run the app; in class we start
back on `step1`.)*

Open http://localhost:5173. You should see the FamAlbum welcome screen with a
greyed-out "Sign in with Google" button.

**That greyed-out button is the correct result.** The repo deliberately ships
without login, upload, or the gallery — those are what we build together. If
you see the screen, you're done.

You'll also see a red "Supabase isn't configured" box until you finish the
Supabase steps in the README. That's expected too, and fine to leave until
class if you run out of time — but please at least get to the point where
`npm run dev` starts cleanly.

## If something breaks

Reply to this email with what you ran and what you saw, ideally before the
session rather than during it. The README has a troubleshooting section at the
bottom that covers the usual suspects.

## What to bring

Just the laptop you did the setup on. No prep reading.

See you **[DATE]**,
**[YOUR NAME]**

---

## Instructor note — the Google OAuth decision

Google OAuth credentials are the one thing that can't be seeded, and they're the
most likely thing to eat class time. Pick one before you send this:

**Option A — everyone creates their own.** Follows the README section 6. More
realistic, and they'll need to do it for real eventually. Costs 10–15 minutes of
setup and produces the most support email. Choose this if the group is
comfortable with cloud consoles.

**Option B — you provide shared credentials.** Create one Google Cloud project,
one OAuth client, and share the client ID and secret with the room. Each
attendee still points their own Supabase project at them, and adds their own
callback URL to the authorised redirect list in your Google project — which
means either you add them in advance (collect project refs beforehand) or you
add them live, which is its own bottleneck. Fastest if you collect refs early.

**Option C — you run one shared Supabase project.** Everyone points at the same
database. Setup collapses to almost nothing, and the "two people, one private
photo" demo becomes trivially real because the whole room is the family. The
trade-off: they don't practise wiring their own backend, and one person running
a destructive migration affects everybody. Good for a large or non-technical
room; use `Option A` or `B` if attendees will carry the project forward.

If you choose B or C, edit the checklist above and the README before sending.
