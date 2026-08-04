import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, PHOTOS_BUCKET, supabase } from '@/lib/supabase'
import {
  FIXTURE_FALLBACK_URLS,
  FIXTURE_IMAGE_URLS,
  FIXTURE_PHOTOS,
  makePlaceholderImage,
} from '@/lib/fixtures'
import type { PhotoRow, Visibility } from '@/lib/database.types'

interface UsePhotosResult {
  photos: PhotoRow[]
  /** Display URL per photo id — signed URLs in real mode. */
  imageUrls: Record<string, string>
  /** Embedded placeholder per photo id, used by <img onError>. */
  fallbackUrls: Record<string, string>
  isLoading: boolean
  error: string | null
  /** True while Supabase isn't configured — the hook serves fixtures. */
  isFakeData: boolean
  refresh: () => Promise<void>
  /**
   * Fake-mode conveniences so the demo stays fully clickable: add to /
   * remove from the in-memory fixture set. The REAL upload (with storage
   * rollback) and delete are slices 4 and 5 — in real mode these surface
   * an error instead of pretending.
   */
  addPhoto: (fileName: string, visibility: Visibility, ownerId: string) => void
  removePhoto: (id: string) => void
}

/** Signed URLs live for an hour — long enough to browse, no 60s surprises. */
const SIGNED_URL_TTL_SECONDS = 60 * 60

/**
 * The gallery's data source, and the only place that queries `photos`.
 *
 * The real path: select every row RLS lets this user see (own private +
 * everyone's shared — NO visibility filtering in JS, that's the policy's
 * job), newest first, then batch-sign storage URLs because the bucket is
 * private.
 *
 * FAKE-DATA SCAFFOLD (temporary, by instructor decision): while Supabase
 * isn't configured, the hook serves the slice-1 fixtures instead — the
 * components can't tell the difference, which is the point of the hook
 * boundary. Once .env exists the real path takes over and fixtures.ts
 * can be deleted.
 */
export function usePhotos(): UsePhotosResult {
  const isFakeData = !isSupabaseConfigured
  const [photos, setPhotos] = useState<PhotoRow[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (isFakeData) {
      setPhotos(FIXTURE_PHOTOS)
      setImageUrls(FIXTURE_IMAGE_URLS)
      setIsLoading(false)
      return
    }

    setError(null)
    const { data, error: queryError } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
      setIsLoading(false)
      return
    }

    const rows = data ?? []

    // The bucket is private: sign all paths in one batch (an unsigned URL
    // 400s, and one createSignedUrl per photo in a map is an N+1).
    const urls: Record<string, string> = {}
    if (rows.length > 0) {
      const { data: signed, error: signError } = await supabase.storage
        .from(PHOTOS_BUCKET)
        .createSignedUrls(
          rows.map((row) => row.storage_path),
          SIGNED_URL_TTL_SECONDS
        )
      if (signError) {
        setError(signError.message)
      } else {
        signed?.forEach((entry, i) => {
          // Per-item failures come back as entry.error, not a throw.
          if (!entry.error && entry.signedUrl) {
            urls[rows[i].id] = entry.signedUrl
          }
        })
      }
    }

    setPhotos(rows)
    setImageUrls(urls)
    setIsLoading(false)
  }, [isFakeData])

  useEffect(() => {
    void refresh()
  }, [refresh])

  function addPhoto(fileName: string, visibility: Visibility, ownerId: string) {
    if (!isFakeData) {
      setError('The real upload flow arrives in slice 4 — coming soon.')
      return
    }
    const id = crypto.randomUUID()
    const photo: PhotoRow = {
      id,
      owner_id: ownerId,
      storage_path: `${ownerId}/${id}.jpg`,
      visibility,
      caption: null,
      created_at: new Date().toISOString(),
    }
    setPhotos((current) => [photo, ...current])
    setImageUrls((current) => ({
      ...current,
      [id]: makePlaceholderImage(photos.length, fileName),
    }))
  }

  function removePhoto(id: string) {
    if (!isFakeData) {
      setError('The real delete arrives in slice 5 — coming soon.')
      return
    }
    setPhotos((current) => current.filter((photo) => photo.id !== id))
  }

  return {
    photos,
    imageUrls,
    fallbackUrls: FIXTURE_FALLBACK_URLS,
    isLoading,
    error,
    isFakeData,
    refresh,
    addPhoto,
    removePhoto,
  }
}
