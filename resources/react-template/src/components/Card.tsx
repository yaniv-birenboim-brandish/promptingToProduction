import { type CSSProperties, useState } from 'react'
import { Heart, ImageIcon } from 'lucide-react'
import type { PortfolioItem } from '../data'

interface CardProps {
  item: PortfolioItem
  onOpen: (id: string) => void
  onMediaLoad?: () => void
  style?: CSSProperties
}

/**
 * One masonry card: fixed 220px width, image flush at natural height, the
 * like badge tucked into the top-right corner, a white load-reveal panel,
 * and the hover interaction — a white veil wipes down, the caption slides
 * to the centre, a type icon appears.
 */
export function Card({ item, onOpen, onMediaLoad, style }: CardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure
      style={style}
      className="group absolute w-[220px] cursor-pointer rounded-[3px] bg-white pb-12 shadow-card transition-[left,top] duration-300 animate-in fade-in zoom-in-95"
      onClick={() => onOpen(item.id)}
    >
      <div className="relative overflow-hidden rounded-t-[3px]">
        <img
          src={item.image}
          alt={item.title}
          className="block w-full"
          onLoad={() => {
            setLoaded(true)
            onMediaLoad?.()
          }}
          onError={(e) => {
            if (e.currentTarget.src !== item.fallback) {
              e.currentTarget.src = item.fallback
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

      {/* Like badge, tucked into the image corner */}
      <span className="absolute right-0 top-0 z-20 flex items-center gap-1 rounded-bl-[5px] bg-white px-2 py-0.5 text-[11px] font-medium text-caption opacity-60 transition-opacity group-hover:opacity-100">
        {item.likes}
        <Heart className="h-3 w-3" />
      </span>

      {/* Caption — bottom strip, slides to centre on hover */}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-2.5 z-10 text-center transition-all duration-200 ease-out group-hover:bottom-1/2 group-hover:translate-y-1/2">
        <p className="text-[13px] leading-tight text-caption">{item.title}</p>
        <p className="mt-0.5 text-[11px] capitalize text-meta">
          {item.categories.join(', ')}
        </p>
        <ImageIcon
          aria-hidden
          className="mx-auto mt-1.5 hidden h-4 w-4 text-caption group-hover:block"
        />
      </figcaption>
    </figure>
  )
}
