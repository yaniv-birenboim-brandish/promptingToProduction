import { useState } from 'react'

interface NavCell {
  label: string
  sublabel: string
}

const LEFT_NAV: NavCell[] = [
  { label: 'Portfolio', sublabel: 'What we have done' },
  { label: 'Blog Page', sublabel: 'Your daily blog' },
]

const RIGHT_NAV: NavCell[] = [
  { label: 'Page', sublabel: 'Testimonial, shortcode' },
  { label: 'Contact Us', sublabel: "We won't bite you" },
]

function Cell({ label, sublabel }: NavCell) {
  return (
    <div className="group flex min-w-[140px] cursor-pointer flex-col justify-center border-x border-[#e7e7e7] bg-white/70 px-9 text-center transition-colors duration-300 hover:bg-chrome">
      <span className="text-base font-bold uppercase leading-none transition-colors group-hover:text-white">
        {label}
      </span>
      <span className="mt-1.5 font-accent text-[13px] italic text-caption transition-colors group-hover:text-white">
        {sublabel}
      </span>
    </div>
  )
}

/**
 * The template header: 5px charcoal top border, textured band, nav cells
 * (bold label over an italic sublabel, cell blacks out on hover), and the
 * logo splitting the middle. Drop your logo at /theme/logo.png — the text
 * wordmark renders when it's absent.
 */
export function Header() {
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
        {LEFT_NAV.map((cell) => (
          <Cell key={cell.label} {...cell} />
        ))}

        <div className="flex flex-col items-center justify-center px-12">
          {logoLoaded ? (
            <img
              src="/theme/logo.png"
              alt="JPhotolio"
              className="h-12 w-auto"
              onError={() => setLogoLoaded(false)}
            />
          ) : (
            <>
              <span className="font-accent text-3xl italic leading-none">
                JPhotolio
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-meta">
                wedding photography
              </span>
            </>
          )}
        </div>

        {RIGHT_NAV.map((cell) => (
          <Cell key={cell.label} {...cell} />
        ))}
      </div>
    </header>
  )
}
