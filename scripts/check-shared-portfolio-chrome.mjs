import { existsSync, readFileSync } from 'node:fs'

const read = (path) => {
  const url = new URL(path, import.meta.url)
  return existsSync(url) ? readFileSync(url, 'utf8') : ''
}
const home = read('../src/pages/Home.jsx')
const blog = read('../src/pages/Blog.jsx')
const bookshelf = read('../src/pages/Bookshelf.jsx')
const chrome = read('../src/components/PortfolioChrome.jsx')
const styles = read('../src/index.css')

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

for (const [name, source] of [['Home', home], ['Blog', blog], ['Bookshelf', bookshelf]]) {
  expect(source.includes("import PortfolioChrome from '../components/PortfolioChrome'"), `${name} should import the shared portfolio chrome.`)
  expect(source.includes('<PortfolioChrome />'), `${name} should render the shared portfolio chrome.`)
}

expect(chrome.includes('preload="metadata"'), 'Shared background video should avoid eager full-video preload.')
expect(chrome.includes('followMouse={false}'), 'Shared WebGL background should not track pointer movement.')
for (const path of ['/', '/blog', '/bookshelf', '/agent']) {
  expect(chrome.includes(`to: '${path}'`), `Shared navigation should include ${path}.`)
}

expect(blog.includes('className="portfolio-page blog-layout"'), 'Blog should opt into the homepage visual shell.')
expect(styles.includes('.portfolio-page.blog-layout'), 'Blog should have a readable transparent content surface.')
expect(styles.includes('.bookshelf-3d-page') && styles.includes('background: transparent;'), 'Bookshelf should reveal the shared video background.')

if (failures.length > 0) {
  console.error(`Shared portfolio chrome contract failed:\n${failures.join('\n')}`)
  process.exit(1)
}

console.log('Shared portfolio chrome contract passed.')
