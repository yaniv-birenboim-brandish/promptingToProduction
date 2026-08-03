import { LayoutGrid } from 'lucide-react'

export type PhotoFilter = 'all' | 'mine' | 'family'

const FILTERS: Array<{ key: PhotoFilter; label: string }> = [
  { key: 'all', label: 'all' },
  { key: 'mine', label: 'my photos' },
  { key: 'family', label: "family's" },
]

interface FilterBarProps {
  active: PhotoFilter
  onChange: (filter: PhotoFilter) => void
}

/**
 * The template's FilterBar, adapted: six portfolio categories became
 * three ownership filters. Styling and behaviour unchanged.
 *
 * NOTE (and say this in class): this filters what's *displayed*. It is a
 * rendering convenience, never a security control — who can see what is
 * always the database's decision.
 */
export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex justify-center">
      <div className="flex overflow-hidden rounded-[3px] border border-[#dddddd] bg-white shadow-card">
        <span
          aria-hidden
          className="flex items-center border-r border-[#eeeeee] px-3 text-caption"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </span>
        {FILTERS.map(({ key, label }, i) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`px-5 py-2 font-accent text-sm italic transition-colors ${
              active === key
                ? 'bg-chrome text-white'
                : 'text-caption hover:bg-[#f5f5f5]'
            } ${i > 0 ? 'border-l border-[#eeeeee]' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
