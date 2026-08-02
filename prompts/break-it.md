# Break it on purpose

**When:** session 1, final 10 minutes — after six clean slices, when everyone
is feeling good about the agent.

**Why:** every guardrail in `CLAUDE.md` is invisible while it's working. The
fastest way to make people believe in scoping is to show them ten minutes of
what happens without it. Nobody remembers a rule they never watched fail.

---

## Run this

Start a **fresh context** (`/clear`) so the good habits from the session don't
carry over. Then paste this, exactly as written:

> Make the photo album better. Add thumbnails so it loads faster, and albums so
> people can organise photos by event, and captions, and comments, and a search
> box. Also the code could be cleaner — refactor anything that needs it while
> you're in there. Use whatever libraries make this easier.

Do not add "read CLAUDE.md". Do not ask for a plan. That's the point.

---

## What to watch for out loud

Narrate as it goes. The interesting failures usually include:

- **A schema change nobody approved.** New tables, new columns, a fresh
  migration file — often edits to `0001_init.sql` itself, which CLAUDE.md
  explicitly forbids and which would break every attendee who already applied
  it.
- **New dependencies.** A state manager, a router, an image library, maybe a
  lightbox. None of them asked for, all of them plausible.
- **The refactor.** "Refactor anything that needs it" is a blank cheque. Watch
  it rewrite the four hooks you just reviewed and committed.
- **Silent scope invention.** Comments? On which model? With what permissions?
  It will invent an answer, and the answer will be reasonable and wrong.
- **RLS drift.** New tables usually arrive without policies, or with a policy
  copied from `photos` that doesn't fit. This is the dangerous one.
- **The diff size.** Say the number out loud. Six slices of careful work
  produced maybe 400 reviewable lines. This will produce more than that in one
  shot, and no one in the room will read it.

Let it run about three minutes. Don't rescue it.

---

## Then: `git checkout .`

Throw the whole thing away in front of everyone. That's part of the
demonstration — the cost of a bad prompt is bounded by how recently you
committed, which is *why* every slice got its own commit.

---

## Debrief — the actual lesson (5 min)

Ask the room, in this order:

1. **Which guardrail would have stopped each failure?** Walk the list. Most map
   to a line that already exists in `CLAUDE.md` — the rule wasn't missing, the
   context was. That's the uncomfortable insight: a great `CLAUDE.md` does
   nothing if the prompt doesn't put the agent in a position to use it.
2. **What was actually wrong with the prompt?** Five features in one sentence.
   No acceptance criteria. An open-ended refactor. Permission to add
   dependencies. Any *one* of those is survivable; together they're a blank
   cheque.
3. **What's the smallest edit that fixes it?** Push for a specific answer. Not
   "be more detailed" — the real one is: *pick one feature, state what done
   looks like, and ask for a plan first.* That's it. Same agent, same repo,
   totally different outcome.
4. **What guardrail is genuinely missing from `CLAUDE.md`?** There usually is
   one. Add it, live, and commit it. Ending the session by improving the
   toolkit — rather than the app — is the note you want people leaving on.

---

## Instructor notes

- **If it produces something impressively good:** great, that's a more
  interesting debrief, not a failed demo. Ask: would you merge this? Could you
  review it in the time you have? What would you have to verify before you
  trusted the permission model in there? "It's good" and "it's safe to merge
  unread" are different claims.
- **If it fails early** (typecheck error, dead end): fine — ask whether a
  failure you catch in ninety seconds is better or worse than a plausible diff
  you merge. Fast, loud failure is the cheap outcome.
- Keep it to ten minutes. The temptation is to let it run because it's fun to
  watch. The debrief is where the value is.
