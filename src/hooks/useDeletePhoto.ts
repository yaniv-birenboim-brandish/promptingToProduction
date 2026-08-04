import { useState } from 'react'
import { isSupabaseConfigured, PHOTOS_BUCKET, supabase } from '@/lib/supabase'
import type { PhotoRow } from '@/lib/database.types'

interface UseDeletePhotoResult {
  isDeleting: boolean
  error: string | null
  /** True when the photo is gone from the user's view; error may still be set
   *  for a half-failure (row deleted, bytes left behind). */
  deletePhoto: (photo: PhotoRow) => Promise<boolean>
}

/**
 * Delete goes ROW FIRST, then the storage object — the order is about
 * failure modes: if the object delete then fails you have an orphaned
 * object nobody can see; the other order can leave a row whose image
 * 404s — a broken card on screen. Both failures surface; neither is
 * swallowed. RLS enforces "your own photos only" — the hidden button in
 * the UI is a courtesy, not the security.
 *
 * FAKE-MODE SCAFFOLD (temporary, by instructor decision): while Supabase
 * isn't configured there is nothing to delete on a server — the hook
 * reports success and the caller drops the photo from the in-memory set.
 */
export function useDeletePhoto(): UseDeletePhotoResult {
  const isFake = !isSupabaseConfigured
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function deletePhoto(photo: PhotoRow): Promise<boolean> {
    setError(null)

    if (isFake) {
      return true
    }

    setIsDeleting(true)
    try {
      // 1. The row first — this is the permission proof: RLS only lets the
      //    owner's delete through.
      const { error: rowError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id)
      if (rowError) {
        setError(rowError.message)
        return false
      }

      // 2. Then the bytes. A failure here leaves an invisible orphan — we
      //    surface it rather than pretend it didn't happen.
      const { error: storageError } = await supabase.storage
        .from(PHOTOS_BUCKET)
        .remove([photo.storage_path])
      if (storageError) {
        setError(
          `Photo removed, but its file couldn't be cleaned up: ${storageError.message}`
        )
      }

      return true
    } finally {
      setIsDeleting(false)
    }
  }

  return { isDeleting, error, deletePhoto }
}
