import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Visibility } from '@/lib/database.types'

interface UploadFormProps {
  isUploading: boolean
  error: string | null
  onUpload: (file: File, visibility: Visibility) => Promise<boolean>
}

/**
 * Presentational: holds only UI state (the picked file, the visibility
 * choice) and hands the File to the upload hook via props. Validation
 * lives in the hook — at the boundary, not in the component.
 */
export function UploadForm({ isUploading, error, onUpload }: UploadFormProps) {
  const [visibility, setVisibility] = useState<Visibility>('private')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!file || isUploading) return
    const succeeded = await onUpload(file, visibility)
    if (succeeded) {
      setFile(null)
      setVisibility('private')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[3px] border border-[#dddddd] bg-white p-4 shadow-card"
    >
      <div className="flex flex-wrap items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-caption file:mr-3 file:rounded-[3px] file:border file:border-[#dddddd] file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
        />

        <fieldset className="flex items-center gap-4 font-accent text-sm italic text-caption">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === 'private'}
              onChange={() => setVisibility('private')}
              className="accent-brand"
            />
            private
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="visibility"
              value="shared"
              checked={visibility === 'shared'}
              onChange={() => setVisibility('shared')}
              className="accent-chrome"
            />
            shared with family
          </label>
        </fieldset>

        <Button
          type="submit"
          disabled={!file || isUploading}
          className="bg-brand text-white hover:bg-brand/90"
        >
          {isUploading ? 'Uploading…' : 'Upload'}
        </Button>
      </div>

      {error && (
        <p className="mt-3 rounded-[3px] border border-brand/40 bg-white px-3 py-1.5 text-sm text-brand">
          {error}
        </p>
      )}
    </form>
  )
}
