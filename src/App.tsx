import { useEffect, useRef, useState } from 'react'
import { Detail } from '@/components/Detail'
import { FilterBar, type PhotoFilter } from '@/components/FilterBar'
import { Footer } from '@/components/Footer'
import { Gallery } from '@/components/Gallery'
import { Header } from '@/components/Header'
import { UploadForm } from '@/components/UploadForm'
import {
  FIXTURE_FALLBACK_URLS,
  FIXTURE_IMAGE_URLS,
  FIXTURE_PHOTOS,
  FIXTURE_USER,
  makePlaceholderImage,
} from '@/lib/fixtures'
import type { PhotoRow, Visibility } from '@/lib/database.types'

/**
 * Slice 1: the purchased template (resources/react-template) adapted into
 * FamAlbum's stub — same layout, tokens, and interactions; FamAlbum's
 * data model. Everything runs on fixtures in local state; nothing
 * persists, and a refresh resets it all. That is correct.
 *
 * Still to come, per instructions/plan.md:
 *   2. Google sign-in gating this shell
 *   3. real gallery (fixtures.ts gets deleted)
 *   4. upload with rollback
 *   5. delete for real
 */
export default function App() {
  const [photos, setPhotos] = useState<PhotoRow[]>(FIXTURE_PHOTOS)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>(FIXTURE_IMAGE_URLS)
  const [filter, setFilter] = useState<PhotoFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // The page boots behind the curtain, which lifts once mounted — the
  // template's initial load behaviour.
  const [curtainDown, setCurtainDown] = useState(true)
  const transitionTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const timer = window.setTimeout(() => setCurtainDown(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  /** The template's page transition: curtain covers, view swaps, curtain lifts. */
  function goTo(id: string | null) {
    window.clearTimeout(transitionTimer.current)
    setCurtainDown(true)
    transitionTimer.current = window.setTimeout(() => {
      setSelectedId(id)
      setCurtainDown(false)
    }, 450)
  }

  function handleUpload(fileName: string, visibility: Visibility) {
    const id = crypto.randomUUID()
    const photo: PhotoRow = {
      id,
      owner_id: FIXTURE_USER.id,
      storage_path: `${FIXTURE_USER.id}/${id}.jpg`,
      visibility,
      caption: null,
      created_at: new Date().toISOString(),
    }
    setPhotos((current) => [photo, ...current])
    setImageUrls((current) => ({
      ...current,
      [id]: makePlaceholderImage(photos.length, fileName),
    }))
  }

  function handleDelete(id: string) {
    setPhotos((current) => current.filter((photo) => photo.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  // Display filtering only — never a security control (see CLAUDE.md).
  const visiblePhotos = photos.filter((photo) => {
    if (filter === 'mine') return photo.owner_id === FIXTURE_USER.id
    if (filter === 'family') return photo.owner_id !== FIXTURE_USER.id
    return true
  })

  const selected = photos.find((photo) => photo.id === selectedId) ?? null
  const selectedIndex = selected ? visiblePhotos.indexOf(selected) : -1

  function step(offset: number) {
    if (visiblePhotos.length === 0) return
    const from = selectedIndex === -1 ? 0 : selectedIndex
    const next = (from + offset + visiblePhotos.length) % visiblePhotos.length
    goTo(visiblePhotos[next].id)
  }

  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      {/* The page-transition curtain (design reference: "The reveal") */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-50 bg-page transition-transform duration-500 ease-in-out ${
          curtainDown ? 'translate-y-0' : '-translate-y-full'
        }`}
      />

      <Header userEmail={FIXTURE_USER.email} />

      <main className="mx-auto w-full max-w-[1420px] flex-1 space-y-5 px-6 py-6">
        {selected ? (
          <Detail
            photo={selected}
            imageUrl={imageUrls[selected.id] ?? ''}
            fallbackUrl={FIXTURE_FALLBACK_URLS[selected.id]}
            ownerLabel={selected.owner_id === FIXTURE_USER.id ? 'You' : 'Family'}
            onBack={() => goTo(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        ) : (
          <>
            <UploadForm onUpload={handleUpload} />
            <FilterBar active={filter} onChange={setFilter} />
            <Gallery
              photos={visiblePhotos}
              imageUrls={imageUrls}
              fallbackUrls={FIXTURE_FALLBACK_URLS}
              currentUserId={FIXTURE_USER.id}
              onDelete={handleDelete}
              onOpen={(id) => goTo(id)}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
