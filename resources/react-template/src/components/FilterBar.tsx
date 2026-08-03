import { LayoutGrid } from 'lucide-react'

interface FilterBarProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

/**
 * The segmented category filter: centred row, lowercase italic labels,
 * active pill solid chrome-black. Filtering only changes what's displayed.
 */
export function FilterBar({ categories, active, onChange }: FilterBarProps) {
  const pills = ['all', ...categories]

  return (
    <div className="flex justify-center">
      <div className="flex overflow-hidden rounded-[3px] border border-[#dddddd] bg-white shadow-card">
        <span
          aria-hidden
          className="flex items-center border-r border-[#eeeeee] px-3 text-caption"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </span>
        {pills.map((category, i) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`px-5 py-2 font-accent text-sm italic transition-colors ${
              active === category
                ? 'bg-chrome text-white'
                : 'text-caption hover:bg-[#f5f5f5]'
            } ${i > 0 ? 'border-l border-[#eeeeee]' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
