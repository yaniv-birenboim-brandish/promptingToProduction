import { type CSSProperties, useState } from 'react'
import { ImageIcon, X } from 'lucide-react'
import type { PhotoRow } from '@/lib/database.types'

interface CardProps {
  photo: PhotoRow
  imageUrl: string
  fallbackUrl?: string
  ownerLabel: string
  canDelete: boolean
  onDelete: (id: string) => void
  onOpen: (id: string) => void
  onMediaLoad?: () => void
  style?: CSSProperties
}

/**
 * The template's Card, adapted: the like badge became the private/shared
 * badge (private = accent), the title/categories caption became
 * owner/date, and the closeme slot became delete-your-own. Layout,
 * load-reveal, and the hover interaction are the template's, unchanged.
 */
export function Card({
  photo,
  imageUrl,
  fallbackUrl,
  ownerLabel,
  canDelete,
  onDelete,
  onOpen,
  onMediaLoad,
  style,
}: CardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure
      style={style}
      className="group absolute w-[220px] cursor-pointer rounded-[3px] bg-white pb-12 shadow-card transition-[left,top] duration-300 animate-in fade-in zoom-in-95"
      onClick={() => onOpen(photo.id)}
    >
      <div className="relative overflow-hidden rounded-t-[3px]">
        <img
          src={imageUrl}
          alt={photo.caption ?? 'Family photo'}
          className="block w-full"
          onLoad={() => {
            setLoaded(true)
            onMediaLoad?.()
          }}
          onError={(e) => {
            if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
              e.currentTarget.src = fallbackUrl
            }
          }}
        />
        {/* Load reveal — a white panel wipes away as the image arrives */}
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 z-[5] bg-white transition-[height] duration-700 ease-out ${
            loaded ? 'h-0' : 'h-full'
          }`}
        />
      </div>

      {/* Hover veil — wipes down over the card */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[1] h-0 rounded-[3px] bg-white/95 transition-[height] duration-200 ease-out group-hover:h-full"
      />

      {/* Visibility badge, in the template's like-badge slot */}
      <span
        className={
          photo.visibility === 'private'
            ? 'absolute right-0 top-0 z-20 rounded-bl-[5px] bg-brand px-2 py-0.5 text-[11px] font-medium text-white opacity-80 transition-opacity group-hover:opacity-100'
            : 'absolute right-0 top-0 z-20 rounded-bl-[5px] bg-white px-2 py-0.5 text-[11px] font-medium text-caption opacity-80 transition-opacity group-hover:opacity-100'
        }
      >
        {photo.visibility}
      </span>

      {/* Delete — your own photos only: a small icon under the badge,
          top-right, revealed by the hover flip */}
      {canDelete && (
        <button
          type="button"
          aria-label="Delete photo"
          className="absolute right-0 top-7 z-20 rounded-l-[5px] bg-white p-1 text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-70 hover:!opacity-100 hover:text-brand"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(photo.id)
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Caption — bottom strip, slides to centre on hover */}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-2.5 z-10 text-center transition-all duration-200 ease-out group-hover:bottom-1/2 group-hover:translate-y-1/2">
        <p className="text-[13px] leading-tight text-caption">{ownerLabel}</p>
        <p className="mt-0.5 text-[11px] text-meta">
          {new Date(photo.created_at).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <ImageIcon
          aria-hidden
          className="mx-auto mt-1.5 hidden h-4 w-4 text-caption group-hover:block"
        />
      </figcaption>
    </figure>
  )
}
