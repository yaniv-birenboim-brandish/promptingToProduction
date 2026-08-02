# Slice 2 — Sign in with Google

**Goal:** a real signed-in state gating the stubbed app. Click sign in, come
back from Google as a known user, see who you are, sign out. Refresh the page
and stay signed in. Logged out, you see only the sign-in prompt.

**Time:** ~10 minutes.

**Commit message:** `feat: google sign-in and session gate`

---

## Before you prompt

- [ ] Google OAuth is configured (README section 6)

---

## Prompt

> Read CLAUDE.md and instructions/plan.md first.
>
> Build slice 2 of the plan: authentication.
>
> **Requirements**
>
> - A `useSession` hook in `src/hooks/` that returns the current session, the
>   user, and a loading flag. It must subscribe to
>   `supabase.auth.onAuthStateChange` and clean the subscription up on unmount.
> - Sign in with Google via `supabase.auth.signInWithOAuth`; sign out.
> - `src/App.tsx` gates on the session: while loading show a neutral state,
>   when signed out show a welcome screen with a working sign-in button, when
>   signed in show a header with the user's email and a sign-out button above
>   the existing stubbed UI from slice 1.
>
> **Constraints**
>
> - The hook is the only thing that touches `supabase.auth`. Components read
>   from the hook.
> - Use the existing shadcn Button. No router — one page, conditional
>   rendering.
> - Handle the "auth failed" case visibly — don't swallow the error.
> - Don't touch the stubbed photo UI beyond gating it — real data starts in
>   slice 3.
>
> Plan first, then wait for me.

---

## What to look for when you review the diff

- **Is the auth listener cleaned up?** A missing `subscription.unsubscribe()`
  in the effect's return is the classic bug here, and it won't show up until
  someone hot-reloads twenty times and gets duplicate state updates.
- Is there a loading state, or does the UI flash "signed out" for a beat on
  every refresh before the session resolves? That flash is a real bug and a
  great one to catch on the projector.
- Exactly one `createClient` in the whole app — did the rule hold?
- Did it invent a `redirectTo`? If so, does it match your Supabase URL config?
- Did it modify the stubbed photo UI beyond gating it? That's scope creep in
  its politest form.

## Teaching beat

This is the first slice where the agent produces enough code that nobody reads
all of it. Resist. **Read the effect.** The rest you can skim; the subscription
lifecycle you cannot. "Review the diff" doesn't mean "review every line
equally" — it means knowing which twelve lines actually carry risk.

## Done when

Two different Google accounts can each sign in and out on the same project.
