import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Detail } from '@/components/Detail'
import { FilterBar, type PhotoFilter } from '@/components/FilterBar'
import { Footer } from '@/components/Footer'
import { Gallery } from '@/components/Gallery'
import { Header } from '@/components/Header'
import { UploadForm } from '@/components/UploadForm'
import { usePhotos } from '@/hooks/usePhotos'
import { useSession } from '@/hooks/useSession'

/**
 * Slice 3: the gallery reads from the data hook instead of local fixture
 * state — the App no longer imports fixtures at all. In real mode the
 * hook queries `photos` through RLS and signs storage URLs; while
 * Supabase is unconfigured it serves fixtures from inside the hook, and
 * the components can't tell the difference. Upload and delete are
 * dormant this slice — they return, real, in slices 4 and 5.
 *
 * Still to come, per instructions/plan.md:
 *   4. upload with rollback
 *   5. delete for real
 */
export default function App() {
  const {
    user,
    isLoading,
    error,
    isFakeAuth,
    isDemoAuth,
    signInWithGoogle,
    signOut,
  } = useSession()
  const {
    photos,
    imageUrls,
    fallbackUrls,
    isLoading: photosLoading,
    error: photosError,
    isFakeData,
    addPhoto,
    removePhoto,
  } = usePhotos()
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

  const currentUserId = user?.id ?? ''

  // Display filtering only — never a security control (see CLAUDE.md).
  // RLS already decided which rows exist here at all.
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
            {isDemoAuth ? 'Sign in' : 'Sign in with Google'}
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

          {isDemoAuth && (
            <p className="mt-6 rounded-[3px] border border-[#dddddd] bg-white px-4 py-2 font-accent text-xs italic text-meta shadow-card">
              Google OAuth isn't configured yet, so sign-in creates an
              anonymous demo session — real database, real permissions, no
              Google involved. Configure the provider and drop VITE_DEMO_AUTH
              from .env for the real thing.
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
            fallbackUrl={fallbackUrls[selected.id]}
            ownerLabel={selected.owner_id === currentUserId ? 'You' : 'Family'}
            onBack={() => goTo(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        ) : (
          <>
            <UploadForm
              onUpload={(fileName, visibility) =>
                addPhoto(fileName, visibility, currentUserId)
              }
            />
            <FilterBar active={filter} onChange={setFilter} />

            {isFakeData && (
              <p className="text-center font-accent text-xs italic text-meta">
                fixture data — the real gallery (RLS + signed URLs) activates
                once Supabase is configured
              </p>
            )}

            {photosError && (
              <p className="mx-auto max-w-xl rounded-[3px] border border-brand/40 bg-white px-4 py-2 text-center text-sm text-brand shadow-card">
                Couldn't load photos: {photosError}
              </p>
            )}

            {photosLoading ? (
              <div className="rounded-[3px] border border-dashed border-[#dddddd] bg-white p-12 text-center shadow-card">
                <p className="font-accent text-sm italic text-meta">
                  loading the album…
                </p>
              </div>
            ) : (
              <Gallery
                photos={visiblePhotos}
                imageUrls={imageUrls}
                fallbackUrls={fallbackUrls}
                currentUserId={currentUserId}
                onDelete={(id) => {
                  removePhoto(id)
                  if (selectedId === id) setSelectedId(null)
                }}
                onOpen={(id) => goTo(id)}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
