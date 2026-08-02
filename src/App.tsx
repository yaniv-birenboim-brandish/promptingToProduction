import { isSupabaseConfigured } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

/**
 * The starter shell. This is deliberately the *whole* app right now:
 * a logged-out screen and nothing else.
 *
 * You will build the five slices of instructions/plan.md, in order:
 *   1. the purchased template (resources/react-template/) adapted into
 *      FamAlbum's stub on fixtures   <- replaces this file
 *   2. Google sign-in gating the stub
 *   3. real gallery — fixtures swapped for RLS-backed rows
 *   4. upload with rollback (the riskiest slice)
 *   5. delete your own photos
 *
 * See prompts/session-1/ for a starting prompt per slice.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">FamAlbum</span>
          <span className="text-xs text-muted-foreground">v0 · starter</span>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          A shared family photo album
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Sign in to upload photos and choose who sees them — just you, or the
          whole family.
        </p>

        {/* TODO(slice-2): wire this to supabase.auth.signInWithOAuth({ provider: 'google' }) */}
        <Button className="mt-8" size="lg" disabled>
          Sign in with Google
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Not wired up yet — that&apos;s slice 2.
        </p>

        {!isSupabaseConfigured && (
          <div className="mt-12 w-full max-w-md rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-left">
            <p className="text-sm font-medium">Supabase isn&apos;t configured</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Copy <code className="font-mono">.env.example</code> to{' '}
              <code className="font-mono">.env</code> and fill in your project
              URL and anon key, then restart <code className="font-mono">npm run dev</code>.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
