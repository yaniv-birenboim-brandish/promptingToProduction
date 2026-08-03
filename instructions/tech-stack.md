# Tech stack — decided, not up for discussion

These choices are fixed for the course. They were made so you don't have to
make them — some of you aren't developers, and none of you should spend class
time comparing databases. The agent must never ask you to pick a framework,
database, host, or language; if it does, point it at this file.

| Layer | Choice | Why this one |
|---|---|---|
| Language | TypeScript (strict) | Types are what make agent output reviewable — wrong shapes fail loudly at `npm run typecheck`. |
| Frontend | Vite + React 18, single-page app | Deliberately mainstream: the agent has deep training coverage, and the skills transfer anywhere. |
| Styling / UI | Tailwind CSS + shadcn/ui | Utility classes keep diffs small; shadcn gives real components without hand-rolling buttons. |
| Database / Auth / Storage | Supabase (Postgres, Auth, Storage) | One service for all three, free tier, and Row Level Security is the security model the course teaches. |
| Sign-in | Google OAuth, via Supabase Auth | Everyone has a Google account; no password handling, ever. |
| Validation | Zod | Parse at the boundary instead of trusting casts. |
| Serverless (session 2) | Netlify Functions | The thumbnail generator showcase. |
| Deploy (session 2) | Netlify, Git-connected | Push to deploy; env vars in the dashboard. |
| CI (session 2) | GitHub Actions | Runs typecheck and tests on every push. |
| Design | Predefined — the purchased React template at `resources/react-template/` | Buy a template in the stack you build with; slice 1 adapts its data model instead of porting markup. Tokens documented in `resources/design-reference.md`. |

Two consequences worth knowing even if you never touch the config:

- **No separate backend server.** The browser talks to Supabase directly; the
  database's own policies (RLS) decide who sees what. That's a feature, not a
  shortcut — it's the architecture the whole course is built around.
- **The one key that ships to the browser is supposed to.** The Supabase
  "anon" key is public by design; RLS is what makes it safe. Session 2 covers
  this in depth.
