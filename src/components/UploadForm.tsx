import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Visibility } from '@/lib/database.types'

interface UploadFormProps {
  onUpload: (fileName: string, visibility: Visibility) => void
}

/**
 * FamAlbum's addition to the template (the template has no uploads). In
 * slice 1 this only feeds local state — the real upload flow with Zod
 * validation and storage rollback is slice 4.
 */
export function UploadForm({ onUpload }: UploadFormProps) {
  const [visibility, setVisibility] = useState<Visibility>('private')
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!fileName) return
    onUpload(fileName, visibility)
    setFileName(null)
    setVisibility('private')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-4 rounded-[3px] border border-[#dddddd] bg-white p-4 shadow-card"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
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
        disabled={!fileName}
        className="bg-brand text-white hover:bg-brand/90"
      >
        Upload
      </Button>
    </form>
  )
}
