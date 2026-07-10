import { readFileSync } from 'node:fs'

const home = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8')
const portfolioChrome = readFileSync(new URL('../src/components/PortfolioChrome.jsx', import.meta.url), 'utf8')
const lightRays = readFileSync(new URL('../src/components/LightRays.jsx', import.meta.url), 'utf8')
const gallery = readFileSync(new URL('../src/components/CircularGallery.jsx', import.meta.url), 'utf8')
const main = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8')
const routes = readFileSync(new URL('../src/AppRoutes.jsx', import.meta.url), 'utf8')

const failures = []

const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

expect(home.includes("from '../assets/projects/geek.webp'"), 'Home should use compressed geek.webp.')
expect(home.includes("from '../assets/projects/enterprise-rag.webp'"), 'Home should use compressed enterprise-rag.webp.')
expect(home.includes("from '../assets/projects/label-server.webp'"), 'Home should use compressed label-server.webp.')
expect(home.includes("from '../assets/projects/portrait.webp'"), 'Home should use compressed portrait.webp.')
expect(portfolioChrome.includes('preload="metadata"'), 'Hero video should avoid eager full-video preload.')
expect(home.includes('loading="lazy"') && home.includes('decoding="async"'), 'Below-fold portrait should lazy/decode async.')
expect(portfolioChrome.includes('followMouse={false}'), 'Hero WebGL rays should not track every mouse move.')
expect(portfolioChrome.includes('noiseAmount={0}') && portfolioChrome.includes('distortion={0}'), 'Hero WebGL rays should keep shader work low.')
expect(!home.includes("import BorderGlow"), 'About section should not load the pointer-reactive BorderGlow effect.')
expect(!home.includes('<BorderGlow'), 'About section should use a static container instead of BorderGlow.')
expect(!home.includes('backdrop-blur-xl'), 'About card should not blur the moving video on every frame.')
expect(home.includes('<div className="w-full max-w-4xl">'), 'About section outer container should stay transparent.')
expect(!home.includes('max-w-4xl rounded-[24px] border border-white/15 bg-black/55'), 'About section should not render a dark outer frame.')

expect(lightRays.includes('Math.min(window.devicePixelRatio, 1.25)'), 'LightRays should cap WebGL DPR at 1.25.')
expect(!lightRays.includes("window.addEventListener('mousemove'"), 'LightRays should not use a global mousemove listener.')
expect(lightRays.includes('const FRAME_INTERVAL = 1000 / 30'), 'LightRays should cap shader rendering at 30 FPS.')

expect(gallery.includes('IntersectionObserver'), 'CircularGallery should lazy-initialize with IntersectionObserver.')
expect(gallery.includes('const [isActive'), 'CircularGallery should expose active viewport state.')
expect(gallery.includes("rootMargin: '120px 0px'"), 'CircularGallery should not initialize while the About section is still far away.')
expect(gallery.includes('const FRAME_INTERVAL = 1000 / 30'), 'CircularGallery should cap rendering at 30 FPS.')
expect(gallery.includes('Math.min(window.devicePixelRatio || 1, 1.25)'), 'CircularGallery should cap WebGL DPR at 1.25.')
expect(gallery.includes('heightSegments: 16') && gallery.includes('widthSegments: 32'), 'CircularGallery should use a lightweight mesh.')
expect(home.includes('const galleryItems = projects.map'), 'Project gallery should avoid creating redundant WebGL cards.')
for (const eventName of ['mousewheel', 'wheel', 'mousedown', 'touchstart', 'touchmove', 'touchend']) {
  expect(!gallery.includes(`window.addEventListener('${eventName}'`), `CircularGallery should not attach global ${eventName} listeners.`)
}

expect(routes.includes('lazy(') && routes.includes('<Suspense'), 'Routes should be lazy loaded for smaller first-screen JS.')
for (const page of ['Home', 'About', 'Blog', 'Bookshelf', 'Admin', 'Agent']) {
  expect(!main.includes(`import ${page} from './pages/${page}.jsx'`), `${page} should not be statically imported by main.jsx.`)
}

if (failures.length > 0) {
  console.error(`Homepage performance contract failed:\n${failures.join('\n')}`)
  process.exit(1)
}

console.log('Homepage performance contract passed.')
