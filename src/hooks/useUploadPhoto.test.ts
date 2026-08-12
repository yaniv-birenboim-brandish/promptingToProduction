import { beforeAll, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useUploadPhoto } from './useUploadPhoto'

const OWNER_ID = '00000000-0000-4000-8000-00000000000a'

function makeFile(name: string, type: string, bytes: number): File {
  const file = new File(['x'], name, { type })
  // jsdom Files are as big as their contents; the size rule needs real
  // numbers without allocating 6 MB per test.
  Object.defineProperty(file, 'size', { value: bytes })
  return file
}

beforeAll(() => {
  // jsdom has no URL.createObjectURL — the fake upload path needs one.
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL: vi.fn(() => 'blob:fake-object-url'),
  })
})

/**
 * Validation is LIVE in both modes — these rejections are exactly what a
 * user with a real backend would see. The spec's rules: images only
 * (jpeg/png/webp/gif), 5 MB cap, and the storage filename is generated,
 * never the user's.
 */
describe('useUploadPhoto (validation and fake-mode upload)', () => {
  it('rejects a file over 5 MB with a visible message', async () => {
    const { result } = renderHook(() => useUploadPhoto(OWNER_ID))

    let outcome
    await act(async () => {
      outcome = await result.current.upload(
        makeFile('big.jpg', 'image/jpeg', 6 * 1024 * 1024),
        'private'
      )
    })

    expect(outcome).toBeNull()
    expect(result.current.error).toMatch(/5 MB/)
  })

  it('rejects a non-image file with a visible message', async () => {
    const { result } = renderHook(() => useUploadPhoto(OWNER_ID))

    let outcome
    await act(async () => {
      outcome = await result.current.upload(
        makeFile('doc.pdf', 'application/pdf', 1024),
        'shared'
      )
    })

    expect(outcome).toBeNull()
    expect(result.current.error).toMatch(/jpeg, png, webp, or gif/)
  })

  it('accepts a good photo and returns an owner-scoped, generated path', async () => {
    const { result } = renderHook(() => useUploadPhoto(OWNER_ID))

    const file = makeFile('my vacation photo!!.jpeg', 'image/jpeg', 1024)
    let outcome: Awaited<ReturnType<typeof result.current.upload>> = null
    await act(async () => {
      outcome = await result.current.upload(file, 'shared')
    })

    expect(outcome).not.toBeNull()
    const { photo, localUrl } = outcome!
    expect(result.current.error).toBeNull()
    expect(photo.owner_id).toBe(OWNER_ID)
    expect(photo.visibility).toBe('shared')
    // Never the user's filename: <owner_id>/<uuid>.<ext>.
    expect(photo.storage_path).toMatch(
      new RegExp(`^${OWNER_ID}/[0-9a-f-]{36}\\.jpg$`)
    )
    expect(photo.storage_path).not.toContain('vacation')
    expect(localUrl).toBe('blob:fake-object-url')
  })
})
