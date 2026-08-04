import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Detail } from '@/components/Detail'
import { FilterBar, type PhotoFilter } from '@/components/FilterBar'
import { Footer } from '@/components/Footer'
import { Gallery } from '@/components/Gallery'
import { Header } from '@/components/Header'
import { UploadForm } from '@/components/UploadForm'
import { useSession } from '@/hooks/useSession'
import {
  FIXTURE_FALLBACK_URLS,
  FIXTURE_IMAGE_URLS,
  FIXTURE_PHOTOS,
  makePlaceholderImage,
} from '@/lib/fixtures'
import type { PhotoRow, Visibility } from '@/lib/database.types'

/**
 * Slice 2: sign-in gates the slice-1 stub. While loading, a neutral
 * page; signed out, only the welcome screen; signed in, the stubbed UI
 * with the session user's identity in the header. While Supabase is
 * unconfigured the session is faked locally (see useSession) — the flow
 * is identical, no Google involved.
 *
 * Photo data is still fixtures; ownership is keyed to the session user's
 * id (which the fake session aligns with the fixture user) until slice 3
 * swaps the data source for the database.
 *
 * Still to come, per instructions/plan.md:
 *   3. real gallery (fixtures.ts gets deleted)
 *   4. upload with rollback
 *   5. delete for real
 */
export default function App() {
  const { user, isLoading, error, isFakeAuth, signInWithGoogle, signOut } =
    useSession()
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

  // Ownership is keyed to the signed-in user (fake or real). Empty string
  // only while signed out, where none of this renders.
  const currentUserId = user?.id ?? ''

  function handleUpload(fileName: string, visibility: Visibility) {
    const id = crypto.randomUUID()
    const photo: PhotoRow = {
      id,
      owner_id: currentUserId,
      storage_path: `${currentUserId}/${id}.jpg`,
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
    if (filter === 'mine') return photo.owner_id === currentUserId
    if (filter === 'family') return photo.owner_id !== currentUserId
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

  // While the session resolves, show nothing but the page colour — the
  // alternative is a "signed out" flash on every refresh, which is a bug.
  if (isLoading) {
    return <div className="min-h-screen bg-page" aria-busy />
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col font-sans text-ink">
        <Header userEmail="not signed in" />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-6 py-20 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            A shared family photo album
          </h1>
          <p className="mt-3 font-accent text-base italic text-caption">
            Sign in to upload photos and choose who sees them — just you, or
            the whole family.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-brand text-white hover:bg-brand/90"
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </Button>

          {error && (
            <p className="mt-4 rounded-[3px] border border-brand/40 bg-white px-4 py-2 text-sm text-brand shadow-card">
              Sign-in failed: {error}
            </p>
          )}

          {isFakeAuth && (
            <p className="mt-6 rounded-[3px] border border-[#dddddd] bg-white px-4 py-2 font-accent text-xs italic text-meta shadow-card">
              Supabase isn't configured yet, so sign-in is faked locally — no
              Google involved. Wire up .env and it switches to the real thing.
            </p>
          )}
        </main>
        <Footer />
      </div>
    )
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

      <Header userEmail={user.email} onSignOut={signOut} />

      <main className="mx-auto w-full max-w-[1420px] flex-1 space-y-5 px-6 py-6">
        {selected ? (
          <Detail
            photo={selected}
            imageUrl={imageUrls[selected.id] ?? ''}
            fallbackUrl={FIXTURE_FALLBACK_URLS[selected.id]}
            ownerLabel={selected.owner_id === currentUserId ? 'You' : 'Family'}
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
              currentUserId={currentUserId}
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
