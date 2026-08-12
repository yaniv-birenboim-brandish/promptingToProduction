import { describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { usePhotos } from './usePhotos'
import { FIXTURE_PHOTOS } from '@/lib/fixtures'
import type { PhotoRow } from '@/lib/database.types'

/**
 * Fake-data mode: with Supabase unconfigured the hook serves the fixtures.
 * What's under test is the hook's contract with the components — a photo
 * list plus a display URL per photo — not the fixture contents themselves.
 */
describe('usePhotos (fake-data mode)', () => {
  it('loads photos with a display URL for each', async () => {
    const { result } = renderHook(() => usePhotos())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isFakeData).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.photos.length).toBeGreaterThan(0)
    for (const photo of result.current.photos) {
      expect(result.current.imageUrls[photo.id]).toBeTruthy()
    }
  })

  it('serves photos from more than one owner, so the gallery can show family photos', async () => {
    const { result } = renderHook(() => usePhotos())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const owners = new Set(result.current.photos.map((p) => p.owner_id))
    expect(owners.size).toBeGreaterThan(1)
  })

  it('inserts an uploaded photo at the front of the list with its URL', async () => {
    const { result } = renderHook(() => usePhotos())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const photo: PhotoRow = {
      id: 'test-photo-id',
      owner_id: FIXTURE_PHOTOS[0].owner_id,
      storage_path: `${FIXTURE_PHOTOS[0].owner_id}/test-photo-id.jpg`,
      visibility: 'private',
      caption: null,
      created_at: new Date().toISOString(),
    }
    act(() => result.current.insertLocalPhoto(photo, 'blob:local-url'))

    expect(result.current.photos[0]).toEqual(photo)
    expect(result.current.imageUrls[photo.id]).toBe('blob:local-url')
  })

  it('removes a photo from the list', async () => {
    const { result } = renderHook(() => usePhotos())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const victim = result.current.photos[0]
    const countBefore = result.current.photos.length
    act(() => result.current.removePhoto(victim.id))

    expect(result.current.photos).toHaveLength(countBefore - 1)
    expect(result.current.photos.find((p) => p.id === victim.id)).toBeUndefined()
  })
})
