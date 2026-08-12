import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useUploadPhoto } from './useUploadPhoto'

/**
 * The rollback is the architecture's promise: if the metadata insert fails,
 * the just-uploaded object must not be left orphaned in Storage. That only
 * exists on the real path, so this file mocks the supabase module as
 * configured and scripts each failure.
 */
const mocks = vi.hoisted(() => ({
  storageUpload: vi.fn(),
  storageRemove: vi.fn(),
  insert: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  PHOTOS_BUCKET: 'photos',
  supabase: {
    storage: {
      from: () => ({
        upload: mocks.storageUpload,
        remove: mocks.storageRemove,
      }),
    },
    from: () => ({ insert: mocks.insert }),
  },
}))

const OWNER_ID = '00000000-0000-4000-8000-00000000000a'
const GOOD_FILE = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })

beforeEach(() => {
  mocks.storageUpload.mockReset().mockResolvedValue({ error: null })
  mocks.storageRemove.mockReset().mockResolvedValue({ error: null })
  mocks.insert.mockReset().mockResolvedValue({ error: null })
})

describe('useUploadPhoto (real path, mocked supabase)', () => {
  it('uploads bytes then inserts the row, and touches nothing else', async () => {
    const { result } = renderHook(() => useUploadPhoto(OWNER_ID))

    let outcome
    await act(async () => {
      outcome = await result.current.upload(GOOD_FILE, 'private')
    })

    expect(outcome).not.toBeNull()
    expect(mocks.storageUpload).toHaveBeenCalledTimes(1)
    expect(mocks.insert).toHaveBeenCalledTimes(1)
    expect(mocks.storageRemove).not.toHaveBeenCalled()
    expect(result.current.error).toBeNull()
  })

  it('deletes the orphaned object when the metadata insert fails', async () => {
    mocks.insert.mockResolvedValue({ error: { message: 'insert rejected' } })
    const { result } = renderHook(() => useUploadPhoto(OWNER_ID))

    let outcome
    await act(async () => {
      outcome = await result.current.upload(GOOD_FILE, 'private')
    })

    expect(outcome).toBeNull()
    // The rollback IS the contract: remove must target the path just uploaded.
    const uploadedPath = mocks.storageUpload.mock.calls[0][0] as string
    expect(mocks.storageRemove).toHaveBeenCalledWith([uploadedPath])
    expect(result.current.error).toBe('insert rejected')
  })

  it('stops before the insert when the byte upload fails', async () => {
    mocks.storageUpload.mockResolvedValue({
      error: { message: 'storage rejected' },
    })
    const { result } = renderHook(() => useUploadPhoto(OWNER_ID))

    let outcome
    await act(async () => {
      outcome = await result.current.upload(GOOD_FILE, 'private')
    })

    expect(outcome).toBeNull()
    expect(mocks.insert).not.toHaveBeenCalled()
    expect(mocks.storageRemove).not.toHaveBeenCalled()
    expect(result.current.error).toBe('storage rejected')
  })
})
