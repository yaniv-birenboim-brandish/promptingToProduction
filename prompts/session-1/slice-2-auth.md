# Slice 2 — Google sign-in, session, protected shell

**Goal:** a real signed-in state. Click sign in, come back from Google as a
known user, see your email and a sign-out button. Refresh the page and stay
signed in.

**Time:** ~15 minutes.

**Commit message:** `slice 2: google oauth, session handling, protected shell`

---

## Prompt

> Read CLAUDE.md first.
>
> Build slice 2: authentication.
>
> **Requirements**
>
> - A `useSession` hook in `src/hooks/` that returns the current session, the
>   user, and a loading flag. It must subscribe to
>   `supabase.auth.onAuthStateChange` and clean the subscription up on unmount.
> - Sign in with Google via `supabase.auth.signInWithOAuth`.
> - Sign out.
> - `src/App.tsx` becomes a shell: while loading show a neutral state, when
>   signed out show the existing marketing screen with a working button, when
>   signed in show a header with the user's email and a sign-out button, and an
>   empty main area with a placeholder that says the gallery is coming.
> - Delete the temporary diagnostic from slice 1.
>
> **Constraints**
>
> - The hook is the only thing that touches `supabase.auth`. Components read
>   from the hook.
> - Use the existing shadcn Button. Add other shadcn primitives with
>   `npx shadcn@latest add` if you need them — don't hand-roll.
> - No router. One page, conditional rendering.
> - Handle the "auth failed" case visibly — don't swallow the error.
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
- Did the sign-out path clear local state, or just call the API?
- Did it invent a `redirectTo`? If so, does it match your Supabase URL config?

## Teaching beat

This is the first slice where the agent produces enough code that nobody reads
all of it. Resist. **Read the effect.** The rest you can skim; the subscription
lifecycle you cannot. Point out that "review the diff" doesn't mean "review
every line equally" — it means knowing which twelve lines actually carry risk.
