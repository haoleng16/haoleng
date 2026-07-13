import { readFileSync } from 'node:fs'

const home = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8')
const gallery = readFileSync(new URL('../src/components/CircularGallery.jsx', import.meta.url), 'utf8')

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

expect(!home.includes('Clickable project links'), 'Standalone project link pills should be removed.')
expect(!home.includes('href={p.href}'), 'Standalone project anchors should be removed from Home.')
expect(home.includes('href: p.href'), 'Gallery items should carry their GitHub URLs.')
expect(home.includes('autoSpeed={0.18}'), 'Project cards should auto-scroll more slowly.')

expect(gallery.includes('this.href = href'), 'Each WebGL card should retain its target URL.')
expect(gallery.includes('findMediaAt('), 'Gallery should hit-test clicked cards.')
expect(gallery.includes('openMedia('), 'Gallery should open a card target after a click.')
expect(gallery.includes('this.hasDragged'), 'Gallery should distinguish dragging from clicking.')
expect(gallery.includes('DRAG_THRESHOLD'), 'Gallery should use a movement threshold before suppressing clicks.')
expect(gallery.includes("window.open(media.href, '_blank', 'noopener,noreferrer')"), 'Project links should open safely in a new tab.')

if (failures.length > 0) {
  console.error(`Project gallery link contract failed:\n${failures.join('\n')}`)
  process.exit(1)
}

console.log('Project gallery link contract passed.')
