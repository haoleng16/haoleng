import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

// Portrait photo — replace src/assets/portrait.jpg with a real photo,
// then swap the import below from portraitPlaceholder to:
//   import portrait from '../assets/portrait.jpg'
const portraitPlaceholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#1a1a1a"/><circle cx="200" cy="160" r="70" fill="#3a3a3a"/><path d="M70 400c0-80 58-140 130-140s130 60 130 140z" fill="#3a3a3a"/></svg>`
  )
const portrait = portraitPlaceholder

// Birthday — age auto-calculates from this date.
const BIRTH_DATE = new Date(2004, 7, 16) // months are 0-indexed: 7 = August
const PHONE = '13724573756'
const EMAIL = 'linhe8798@gmail.com'

function calcAge(birth) {
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function About() {
  const age = calcAge(BIRTH_DATE)

  // Hide the global header/footer so this page is full-bleed like Home.
  useEffect(() => {
    const header = document.querySelector('.site-header')
    const footer = document.querySelector('.site-footer')
    const toTop = document.querySelector('.back-to-top')
    const els = [header, footer, toTop]
    els.forEach((el) => {
      if (el) el.style.display = 'none'
    })
    return () => {
      els.forEach((el) => {
        if (el) el.style.display = ''
      })
    }
  }, [])

  const fields = [
    { label: 'Age', value: String(age) },
    { label: 'Phone', value: PHONE, href: `tel:${PHONE}` },
    { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  ]

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-black font-inter text-white">
      {/* Top nav */}
      <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
        <Link
          to="/"
          className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl"
        >
          Haoleng
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
        >
          Back Home
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 sm:px-10 lg:px-16">
        <div className="flex w-full max-w-4xl flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
          {/* Left — portrait */}
          <div className="flex shrink-0 flex-col items-center gap-5">
            <div className="h-56 w-56 overflow-hidden rounded-full ring-2 ring-white/15 sm:h-64 sm:w-64">
              <img
                src={portrait}
                alt="何林 证件照"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="font-podium text-3xl uppercase tracking-wide text-white sm:text-4xl">
              He Lin
            </h1>
            <span className="font-inter text-xs uppercase tracking-widest text-white/50">
              何林
            </span>
          </div>

          {/* Right — info */}
          <div className="w-full md:pt-6">
            <p className="font-inter text-sm uppercase tracking-widest text-white/40">
              About Me
            </p>
            <p className="mt-4 max-w-md font-inter text-base leading-relaxed text-white/70">
              Developer & builder. Recording the journey of learning, projects,
              and ongoing experiments.
            </p>

            <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
              {fields.map((field) => {
                const content = (
                  <div className="group flex items-baseline justify-between gap-4 py-5 transition-colors hover:text-white">
                    <span className="font-inter text-xs uppercase tracking-widest text-white/40">
                      {field.label}
                    </span>
                    <span className="font-inter text-base text-white/85 transition-colors group-hover:text-white sm:text-lg">
                      {field.value}
                    </span>
                  </div>
                )
                return field.href ? (
                  <a key={field.label} href={field.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={field.label}>{content}</div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default About
