import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * True when both env vars are present. The UI uses this to show a friendly
 * "finish your .env" message instead of throwing on a blank screen.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[FamAlbum] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env and fill it in — see README.md.'
  )
}

/**
 * The single Supabase client for the whole app.
 *
 * Rule (see CLAUDE.md): every database, auth, and storage call goes through
 * this client. Do not call the REST endpoints with fetch, and do not create a
 * second client instance — multiple clients fight over the auth session in
 * localStorage.
 */
export const supabase = createClient<Database>(
  url ?? 'http://localhost:54321',
  anonKey ?? 'public-anon-key-placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

/** The Storage bucket that holds photo bytes. Created in 0001_init.sql. */
export const PHOTOS_BUCKET = 'photos'
