import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

/**
 * The user shape the app consumes — deliberately smaller than Supabase's
 * User so components never depend on supabase types.
 */
export interface AppUser {
  id: string
  email: string
}

interface UseSessionResult {
  user: AppUser | null
  isLoading: boolean
  error: string | null
  /** True while Supabase isn't configured — sign-in is faked locally. */
  isFakeAuth: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

/**
 * FAKE-AUTH SCAFFOLD (temporary, by instructor decision): while Supabase
 * isn't configured, signing in creates this local session instead of
 * calling Google. The id matches the fixture user's so ownership in the
 * stub keeps working. The real path below takes over automatically once
 * .env exists — then this constant and the localStorage branch go away.
 */
const FAKE_USER: AppUser = {
  id: '00000000-0000-4000-8000-00000000000a',
  email: 'you@example.com',
}
const FAKE_SESSION_KEY = 'famalbum.fakeSession'

/**
 * The one place that touches supabase.auth (see CLAUDE.md). Components
 * read session state and call the actions — they never import supabase.
 */
export function useSession(): UseSessionResult {
  const isFakeAuth = !isSupabaseConfigured
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isFakeAuth) {
      // Fake mode: "session" is a localStorage flag, so refresh keeps you
      // signed in — same observable behaviour the real path will have.
      setUser(
        window.localStorage.getItem(FAKE_SESSION_KEY) ? FAKE_USER : null
      )
      setIsLoading(false)
      return
    }

    let active = true

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError(sessionError.message)
      const sessionUser = data.session?.user
      setUser(
        sessionUser
          ? { id: sessionUser.id, email: sessionUser.email ?? 'signed in' }
          : null
      )
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user
      setUser(
        sessionUser
          ? { id: sessionUser.id, email: sessionUser.email ?? 'signed in' }
          : null
      )
      setIsLoading(false)
    })

    // The classic bug this cleanup prevents: without unsubscribe, every
    // hot reload stacks another listener and state updates duplicate.
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [isFakeAuth])

  async function signInWithGoogle() {
    setError(null)
    if (isFakeAuth) {
      window.localStorage.setItem(FAKE_SESSION_KEY, '1')
      setUser(FAKE_USER)
      return
    }
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (signInError) setError(signInError.message)
  }

  async function signOut() {
    setError(null)
    if (isFakeAuth) {
      window.localStorage.removeItem(FAKE_SESSION_KEY)
      setUser(null)
      return
    }
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(signOutError.message)
  }

  return { user, isLoading, error, isFakeAuth, signInWithGoogle, signOut }
}
