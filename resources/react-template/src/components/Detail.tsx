import { Heart } from 'lucide-react'
import type { PortfolioItem } from '../data'

interface DetailProps {
  item: PortfolioItem
  onBack: () => void
  onPrev: () => void
  onNext: () => void
}

const pill =
  'rounded-[3px] px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer'

/** The single-item view: large image, title, categories, likes, prev/next. */
export function Detail({ item, onBack, onPrev, onNext }: DetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className={`${pill} border border-[#dddddd] bg-white text-caption hover:text-ink`}
        >
          ← back to portfolio
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
              src={item.image}
              alt={item.title}
              className="max-h-[70vh] object-contain"
              onError={(e) => {
                if (e.currentTarget.src !== item.fallback) {
                  e.currentTarget.src = item.fallback
                }
              }}
            />
            <span className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-[5px] bg-white/90 px-2.5 py-1 text-xs font-medium text-caption">
              {item.likes}
              <Heart className="h-3 w-3" />
            </span>
          </div>
        </div>

        <figcaption className="px-4 pt-4 text-center">
          <p className="text-lg font-bold text-caption">{item.title}</p>
          <p className="mt-0.5 font-accent text-sm italic capitalize text-meta">
            {item.categories.join(', ')}
          </p>
        </figcaption>
      </figure>
    </div>
  )
}
