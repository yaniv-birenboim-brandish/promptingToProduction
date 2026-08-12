import { describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useSession } from './useSession'

/**
 * These tests run in fake-auth mode: no VITE_SUPABASE_* env vars exist in
 * the test environment, so the hook takes its localStorage branch. The
 * observable contract (sign in → identified user, survive a refresh, sign
 * out → gone) is the same one the real path must honour.
 */
describe('useSession (fake-auth mode)', () => {
  it('starts signed out, not loading, and flagged as fake auth', async () => {
    const { result } = renderHook(() => useSession())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.user).toBeNull()
    expect(result.current.isFakeAuth).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('signs in and exposes an identified user', async () => {
    const { result } = renderHook(() => useSession())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.id).toBeTruthy()
    expect(result.current.user?.email).toBeTruthy()
  })

  it('keeps the session across a refresh (a fresh mount)', async () => {
    const first = renderHook(() => useSession())
    await waitFor(() => expect(first.result.current.isLoading).toBe(false))
    await act(() => first.result.current.signInWithGoogle())
    first.unmount()

    // A new mount with nothing but persisted state — the "refresh".
    const second = renderHook(() => useSession())
    await waitFor(() => expect(second.result.current.isLoading).toBe(false))
    expect(second.result.current.user).not.toBeNull()
  })

  it('signs out and stays signed out on the next mount', async () => {
    const first = renderHook(() => useSession())
    await waitFor(() => expect(first.result.current.isLoading).toBe(false))
    await act(() => first.result.current.signInWithGoogle())
    await act(() => first.result.current.signOut())
    expect(first.result.current.user).toBeNull()
    first.unmount()

    const second = renderHook(() => useSession())
    await waitFor(() => expect(second.result.current.isLoading).toBe(false))
    expect(second.result.current.user).toBeNull()
  })
})
