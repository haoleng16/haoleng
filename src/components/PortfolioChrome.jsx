import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, X } from 'lucide-react'
import LightRays from './LightRays'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4'

const CONTACT_EMAIL = 'linhe8798@gmail.com'
const CONTACT_BODY =
  'Hello, I saw your projects on your personal website and hope we can communicate further.'

const navLinks = [
  { label: '首页', to: '/' },
  { label: '博客', to: '/blog' },
  { label: '书架', to: '/bookshelf' },
  { label: 'Agent', to: '/agent' },
]

function getContactHref() {
  return `mailto:${CONTACT_EMAIL}?body=${encodeURIComponent(CONTACT_BODY)}`
}

export default function PortfolioChrome() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const elements = [
      document.querySelector('.site-header'),
      document.querySelector('.site-footer'),
      document.querySelector('.back-to-top'),
    ]
    elements.forEach((element) => {
      if (element) element.style.display = 'none'
    })
    return () => {
      elements.forEach((element) => {
        if (element) element.style.display = ''
      })
    }
  }, [])

  return (
    <>
      <video
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-black/50" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ff3b3b"
          raysSpeed={0.75}
          lightSpread={1.2}
          rayLength={1.8}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0}
          distortion={0}
        />
      </div>

      <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
        <Link
          to="/"
          className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl"
        >
          Haoleng
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="font-inter text-sm uppercase tracking-wide text-white/80 transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = getContactHref()
          }}
          className="hidden items-center gap-2 border border-white/30 bg-transparent px-6 py-3 text-xs uppercase tracking-widest text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/10 md:inline-flex"
        >
          GET IN TOUCH
          <ArrowUpRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="打开菜单"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex flex-col space-y-1.5 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-4 bg-white" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-black/95 transition-opacity duration-300 md:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl"
          >
            Haoleng
          </Link>
          <button
            type="button"
            aria-label="关闭菜单"
            onClick={() => setMenuOpen(false)}
            className="text-white"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="flex h-[calc(100%-80px)] flex-col items-center justify-center gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="font-podium text-4xl uppercase tracking-wide text-white sm:text-5xl"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              window.location.href = getContactHref()
            }}
            className="mt-4 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest text-white"
          >
            GET IN TOUCH
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}
