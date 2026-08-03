import { Facebook, Home, Mail, Twitter, Youtube } from 'lucide-react'

const iconBox =
  'flex h-9 w-9 items-center justify-center border-l border-white/10 text-white/70 transition-colors hover:text-white'

/** The slim dark footer bar with icon squares. Decorative. */
export function Footer() {
  return (
    <footer
      className="mt-8 bg-chrome"
      style={{
        backgroundImage: "url('/theme/bg-footer-pattern.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mx-auto flex max-w-[1420px] items-center justify-between">
        <div className="flex">
          <span className={iconBox}>
            <Home className="h-4 w-4" />
          </span>
          <span className={`${iconBox} border-r`}>
            <Mail className="h-4 w-4" />
          </span>
        </div>
        <div className="flex">
          <span className={iconBox}>
            <Facebook className="h-4 w-4" />
          </span>
          <span className={iconBox}>
            <Youtube className="h-4 w-4" />
          </span>
          <span className={`${iconBox} border-r`}>
            <Twitter className="h-4 w-4" />
          </span>
        </div>
      </div>
    </footer>
  )
}
