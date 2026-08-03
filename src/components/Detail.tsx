import type { PhotoRow } from '@/lib/database.types'

interface DetailProps {
  photo: PhotoRow
  imageUrl: string
  fallbackUrl?: string
  ownerLabel: string
  onBack: () => void
  onPrev: () => void
  onNext: () => void
}

const pill =
  'rounded-[3px] px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer'

/**
 * The template's Detail view, adapted: title/categories/likes became
 * owner, date, and the visibility badge. Layout and prev/next unchanged.
 */
export function Detail({
  photo,
  imageUrl,
  fallbackUrl,
  ownerLabel,
  onBack,
  onPrev,
  onNext,
}: DetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className={`${pill} border border-[#dddddd] bg-white text-caption hover:text-ink`}
        >
          ← all photos
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onPrev}
            className={`${pill} bg-chrome text-white hover:bg-chrome/85`}
          >
            ‹ prev
          </button>
          <button
            type="button"
            onClick={onNext}
            className={`${pill} bg-chrome text-white hover:bg-chrome/85`}
          >
            next ›
          </button>
        </div>
      </div>

      <figure className="rounded-[3px] bg-white pb-4 shadow-card">
        <div className="flex justify-center overflow-hidden rounded-t-[3px] bg-page">
          <div className="relative">
            <img
              src={imageUrl}
              alt={photo.caption ?? 'Family photo'}
              className="max-h-[70vh] object-contain"
              onError={(e) => {
                if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                  e.currentTarget.src = fallbackUrl
                }
              }}
            />
            <span
              className={
                photo.visibility === 'private'
                  ? 'absolute right-0 top-0 rounded-bl-[5px] bg-brand px-2.5 py-1 text-xs font-medium text-white'
                  : 'absolute right-0 top-0 rounded-bl-[5px] bg-white/90 px-2.5 py-1 text-xs font-medium text-caption'
              }
            >
              {photo.visibility}
            </span>
          </div>
        </div>

        <figcaption className="px-4 pt-4 text-center">
          <p className="text-lg font-bold text-caption">{ownerLabel}</p>
          <p className="mt-0.5 font-accent text-sm italic text-meta">
            {new Date(photo.created_at).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </figcaption>
      </figure>
    </div>
  )
}
