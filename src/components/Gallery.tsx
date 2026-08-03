import { Card } from '@/components/Card'
import { useMasonry } from '@/components/useMasonry'
import type { PhotoRow } from '@/lib/database.types'

interface GalleryProps {
  photos: PhotoRow[]
  imageUrls: Record<string, string>
  fallbackUrls?: Record<string, string>
  currentUserId: string
  onDelete: (id: string) => void
  onOpen: (id: string) => void
}

/**
 * The template's Gallery, adapted to photos: measured masonry — fixed
 * 220px items, 10px gutters, shortest-column packing, relayout on resize
 * and image load (see useMasonry). Layout unchanged from the template.
 */
export function Gallery({
  photos,
  imageUrls,
  fallbackUrls,
  currentUserId,
  onDelete,
  onOpen,
}: GalleryProps) {
  const { containerRef, positions, containerHeight, relayout } = useMasonry(
    photos.length
  )

  if (photos.length === 0) {
    return (
      <div className="rounded-[3px] border border-dashed border-[#dddddd] bg-white p-12 text-center shadow-card">
        <p className="text-sm font-bold uppercase tracking-wide text-caption">
          No photos here
        </p>
        <p className="mt-1 font-accent text-sm italic text-meta">
          Upload the first one above — private means only you see it.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerHeight }}
    >
      {photos.map((photo, i) => (
        <Card
          key={photo.id}
          photo={photo}
          imageUrl={imageUrls[photo.id] ?? ''}
          fallbackUrl={fallbackUrls?.[photo.id]}
          ownerLabel={photo.owner_id === currentUserId ? 'You' : 'Family'}
          canDelete={photo.owner_id === currentUserId}
          onDelete={onDelete}
          onOpen={onOpen}
          onMediaLoad={relayout}
          style={positions[i] ?? { left: 0, top: 0 }}
        />
      ))}
    </div>
  )
}
