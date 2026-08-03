import { Card } from './Card'
import { useMasonry } from '../useMasonry'
import type { PortfolioItem } from '../data'

interface GalleryProps {
  items: PortfolioItem[]
  onOpen: (id: string) => void
}

/**
 * Measured masonry: fixed 220px items, 10px gutters, placed left-to-right
 * into the shortest column, centred, animating into place — see useMasonry.
 */
export function Gallery({ items, onOpen }: GalleryProps) {
  const { containerRef, positions, containerHeight, relayout } = useMasonry(
    items.length
  )

  if (items.length === 0) {
    return (
      <div className="rounded-[3px] border border-dashed border-[#dddddd] bg-white p-12 text-center shadow-card">
        <p className="text-sm font-bold uppercase tracking-wide text-caption">
          Nothing in this category
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
      {items.map((item, i) => (
        <Card
          key={item.id}
          item={item}
          onOpen={onOpen}
          onMediaLoad={relayout}
          style={positions[i] ?? { left: 0, top: 0 }}
        />
      ))}
    </div>
  )
}
