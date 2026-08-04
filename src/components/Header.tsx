import { useState } from 'react'

interface HeaderProps {
  userEmail: string
  onSignOut?: () => void
}

/**
 * The template's Header, adapted: FamAlbum has one page, so the four nav
 * cells became two (Gallery / You) and the wordmark fallback says
 * FamAlbum. The textured band, cell hover, and logo slot are the
 * template's, unchanged.
 */
export function Header({ userEmail, onSignOut }: HeaderProps) {
  const [logoLoaded, setLogoLoaded] = useState(true)

  return (
    <header
      className="relative border-t-[5px] border-[#4b4b4b] bg-white"
      style={{
        backgroundImage: "url('/theme/bg-header-pattern.png')",
        backgroundPosition: '0 -51px',
        backgroundRepeat: 'repeat-x',
      }}
    >
      <div className="mx-auto flex min-h-[99px] max-w-6xl items-stretch justify-center">
        <div className="group flex min-w-[140px] cursor-pointer flex-col justify-center border-x border-[#e7e7e7] bg-white/70 px-9 text-center transition-colors duration-300 hover:bg-chrome">
          <span className="text-base font-bold uppercase leading-none transition-colors group-hover:text-white">
            Gallery
          </span>
          <span className="mt-1.5 font-accent text-[13px] italic text-caption transition-colors group-hover:text-white">
            What we've been up to
          </span>
        </div>

        <div className="flex flex-col items-center justify-center px-12">
          {logoLoaded ? (
            <img
              src="/theme/logo.png"
              alt="FamAlbum"
              className="h-12 w-auto"
              onError={() => setLogoLoaded(false)}
            />
          ) : (
            <>
              <span className="font-accent text-3xl italic leading-none">
                FamAlbum
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-meta">
                family photography
              </span>
            </>
          )}
        </div>

        <div className="group flex min-w-[140px] cursor-pointer flex-col justify-center border-x border-[#e7e7e7] bg-white/70 px-9 text-center transition-colors duration-300 hover:bg-chrome">
          <span className="text-base font-bold uppercase leading-none transition-colors group-hover:text-white">
            You
          </span>
          <span className="mt-1.5 font-accent text-[13px] italic text-caption transition-colors group-hover:text-white">
            {userEmail}
          </span>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="mt-1 font-accent text-[11px] italic text-meta underline-offset-2 transition-colors hover:underline group-hover:text-white"
            >
              sign out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
