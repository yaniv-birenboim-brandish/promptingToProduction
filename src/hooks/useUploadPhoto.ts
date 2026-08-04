import { useState } from 'react'
import { z } from 'zod'
import { isSupabaseConfigured, PHOTOS_BUCKET, supabase } from '@/lib/supabase'
import type { PhotoRow, Visibility } from '@/lib/database.types'

/**
 * Validate at the boundary, with Zod — a file the user picked is outside
 * input until proven otherwise. `file as ValidImage` is not validation.
 */
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const
const MAX_BYTES = 5 * 1024 * 1024

const uploadInputSchema = z.object({
  type: z.enum(ACCEPTED_TYPES, {
    errorMap: () => ({
      message: 'Only images are allowed: jpeg, png, webp, or gif.',
    }),
  }),
  size: z
    .number()
    .max(MAX_BYTES, 'That file is over 5 MB — pick a smaller photo.'),
})

const EXTENSION_BY_TYPE: Record<(typeof ACCEPTED_TYPES)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export interface UploadResult {
  photo: PhotoRow
  /** Fake mode only: a local object URL so the picked image displays. */
  localUrl?: string
}

interface UseUploadPhotoResult {
  isUploading: boolean
  error: string | null
  /** Returns the new row on success, null on failure (error is set). */
  upload: (file: File, visibility: Visibility) => Promise<UploadResult | null>
}

/**
 * The upload flow, in the fixed order the architecture demands:
 * bytes to Storage first (owner-scoped path, generated filename — never
 * the user's), then the metadata row — and if the insert fails, DELETE
 * the object we just uploaded so no orphan bytes sit in the bucket.
 *
 * FAKE-MODE SCAFFOLD (temporary, by instructor decision): while Supabase
 * isn't configured, validation runs exactly the same, but the "upload"
 * produces a local object URL instead of touching Storage. The rollback
 * path only exists for real — there's nothing honest to fake about it.
 */
export function useUploadPhoto(ownerId: string): UseUploadPhotoResult {
  const isFake = !isSupabaseConfigured
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(
    file: File,
    visibility: Visibility
  ): Promise<UploadResult | null> {
    setError(null)

    const parsed = uploadInputSchema.safeParse({
      type: file.type,
      size: file.size,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'That file can’t be uploaded.')
      return null
    }

    const id = crypto.randomUUID()
    const extension = EXTENSION_BY_TYPE[parsed.data.type]
    const storagePath = `${ownerId}/${id}.${extension}`

    const photo: PhotoRow = {
      id,
      owner_id: ownerId,
      storage_path: storagePath,
      visibility,
      caption: null,
      created_at: new Date().toISOString(),
    }

    if (isFake) {
      // Same contract, no network: the picked image displays via a local
      // object URL until Supabase is wired up.
      return { photo, localUrl: URL.createObjectURL(file) }
    }

    setIsUploading(true)
    try {
      // 1. Bytes first — the cheaper failure to recover from.
      const { error: storageError } = await supabase.storage
        .from(PHOTOS_BUCKET)
        .upload(storagePath, file, { contentType: file.type, upsert: false })
      if (storageError) {
        setError(storageError.message)
        return null
      }

      // 2. Metadata second.
      const { error: insertError } = await supabase.from('photos').insert({
        id,
        owner_id: ownerId,
        storage_path: storagePath,
        visibility,
      })

      // 3. The rollback: a row that failed must not leave orphan bytes.
      if (insertError) {
        await supabase.storage.from(PHOTOS_BUCKET).remove([storagePath])
        setError(insertError.message)
        return null
      }

      return { photo }
    } finally {
      setIsUploading(false)
    }
  }

  return { isUploading, error, upload }
}
