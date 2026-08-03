import { useEffect, useRef, useState } from 'react'
import { Detail } from './components/Detail'
import { FilterBar } from './components/FilterBar'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { ALL_CATEGORIES, PORTFOLIO_ITEMS } from './data'

/**
 * JPhotolio React template — a portfolio page: header, category filter,
 * measured masonry gallery, single-item view, footer. Page transitions run
 * behind a curtain that covers, swaps the view, and lifts.
 */
export default function App() {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // The page boots behind the curtain, which lifts once mounted.
  const [curtainDown, setCurtainDown] = useState(true)
  const transitionTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const timer = window.setTimeout(() => setCurtainDown(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  function goTo(id: string | null) {
    window.clearTimeout(transitionTimer.current)
    setCurtainDown(true)
    transitionTimer.current = window.setTimeout(() => {
      setSelectedId(id)
      setCurtainDown(false)
    }, 450)
  }

  const visibleItems = PORTFOLIO_ITEMS.filter(
    (item) => filter === 'all' || item.categories.includes(filter)
  )

  const selected = PORTFOLIO_ITEMS.find((item) => item.id === selectedId) ?? null
  const selectedIndex = selected ? visibleItems.indexOf(selected) : -1

  function step(offset: number) {
    if (visibleItems.length === 0) return
    const from = selectedIndex === -1 ? 0 : selectedIndex
    const next = (from + offset + visibleItems.length) % visibleItems.length
    goTo(visibleItems[next].id)
  }

  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      {/* The page-transition curtain */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-50 bg-page transition-transform duration-500 ease-in-out ${
          curtainDown ? 'translate-y-0' : '-translate-y-full'
        }`}
      />

      <Header />

      <main className="mx-auto w-full max-w-[1420px] flex-1 space-y-5 px-6 py-6">
        {selected ? (
          <Detail
            item={selected}
            onBack={() => goTo(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        ) : (
          <>
            <FilterBar
              categories={ALL_CATEGORIES}
              active={filter}
              onChange={setFilter}
            />
            <Gallery items={visibleItems} onOpen={(id) => goTo(id)} />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
