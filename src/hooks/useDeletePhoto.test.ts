import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDeletePhoto } from './useDeletePhoto'
import type { PhotoRow } from '@/lib/database.types'

/**
 * Delete is row FIRST, then bytes — and a half-failure (row gone, bytes
 * left) must be surfaced, not swallowed. Real path only, so the supabase
 * module is mocked as configured.
 */
const mocks = vi.hoisted(() => ({
  order: [] as string[],
  rowDelete: vi.fn(),
  storageRemove: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  PHOTOS_BUCKET: 'photos',
  supabase: {
    from: () => ({
      delete: () => ({
        eq: (...args: unknown[]) => {
          mocks.order.push('row')
          return mocks.rowDelete(...args)
        },
      }),
    }),
    storage: {
      from: () => ({
        remove: (...args: unknown[]) => {
          mocks.order.push('bytes')
          return mocks.storageRemove(...args)
        },
      }),
    },
  },
}))

const PHOTO: PhotoRow = {
  id: 'photo-1',
  owner_id: '00000000-0000-4000-8000-00000000000a',
  storage_path: '00000000-0000-4000-8000-00000000000a/photo-1.jpg',
  visibility: 'private',
  caption: null,
  created_at: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  mocks.order.length = 0
  mocks.rowDelete.mockReset().mockResolvedValue({ error: null })
  mocks.storageRemove.mockReset().mockResolvedValue({ error: null })
})

describe('useDeletePhoto (real path, mocked supabase)', () => {
  it('deletes the row first, then the bytes', async () => {
    const { result } = renderHook(() => useDeletePhoto())

    let gone
    await act(async () => {
      gone = await result.current.deletePhoto(PHOTO)
    })

    expect(gone).toBe(true)
    expect(mocks.order).toEqual(['row', 'bytes'])
    expect(mocks.storageRemove).toHaveBeenCalledWith([PHOTO.storage_path])
    expect(result.current.error).toBeNull()
  })

  it('leaves the bytes alone when the row delete is refused', async () => {
    mocks.rowDelete.mockResolvedValue({ error: { message: 'RLS says no' } })
    const { result } = renderHook(() => useDeletePhoto())

    let gone
    await act(async () => {
      gone = await result.current.deletePhoto(PHOTO)
    })

    expect(gone).toBe(false)
    expect(mocks.order).toEqual(['row'])
    expect(result.current.error).toBe('RLS says no')
  })

  it('surfaces a half-failure: row gone but bytes left behind', async () => {
    mocks.storageRemove.mockResolvedValue({
      error: { message: 'network blip' },
    })
    const { result } = renderHook(() => useDeletePhoto())

    let gone
    await act(async () => {
      gone = await result.current.deletePhoto(PHOTO)
    })

    // The photo IS gone from the user's view…
    expect(gone).toBe(true)
    // …but the cleanup failure is reported, not swallowed.
    expect(result.current.error).toMatch(/couldn't be cleaned up/)
    expect(result.current.error).toMatch(/network blip/)
  })
})
