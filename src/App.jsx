import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import './App.css'

const navItems = [
  { label: '首页', path: '/' },
  { label: '博客', path: '/blog' },
  { label: '书架', path: '/bookshelf' },
  { label: 'Agent', path: '/agent' },
]

const themeLabels = { light: '明亮模式', dark: '暗黑模式', warm: '暖色模式' }

const inspirations = [
  '今天也要把 Bug 变成 Feature 哦～',
  '代码写不完没关系，咖啡先喝完',
  '你离完美只差一个 commit 的距离',
  '报错不是终点，是重构的起点',
  '摸鱼一时爽，一直摸鱼一直爽',
  'Ctrl+C 和 Ctrl+V 是人类文明之光',
  '别慌，Stack Overflow 知道一切',
  '今天的不开心就到此为止吧，push 一下就好',
  '你的代码比你想象的更棒',
  '每个大佬都曾是复制粘贴的小白',
  '写代码就像做饭，火候到了自然香',
]

const EASTER_EGG_TRIGGER = 10

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [inspirationOpen, setInspirationOpen] = useState(false)
  const [inspirationIndex, setInspirationIndex] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [easterEgg, setEasterEgg] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function cycleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'warm' : 'light')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleInspiration() {
    const next = clickCount + 1
    setClickCount(next)

    if (next >= EASTER_EGG_TRIGGER) {
      setEasterEgg(true)
      setInspirationOpen(true)
      setClickCount(0)
      return
    }

    setInspirationIndex(Math.floor(Math.random() * inspirations.length))
    setInspirationOpen(true)
  }

  function closeInspiration() {
    setInspirationOpen(false)
    setEasterEgg(false)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="site-nav" aria-label="主导航">
          <Link className="brand-mark" to="/" onClick={closeMenu}>
            HaoLeng
          </Link>

          <div className="nav-links" aria-label="桌面导航">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <div className="inspiration-wrapper">
              <button className="icon-button inspiration-btn" type="button" onClick={handleInspiration} aria-label="今日灵感">
                <span className="inspiration-icon" aria-hidden="true">✦</span>
              </button>
              {inspirationOpen && (
                <div className="inspiration-card">
                  <button className="inspiration-close" type="button" onClick={closeInspiration} aria-label="关闭">✕</button>
                  {easterEgg ? (
                    <div className="inspiration-easter">
                      <span className="easter-badge">🏆</span>
                      <p>连续点击10次解锁<br /><strong>隐藏成就：摸鱼之神</strong></p>
                    </div>
                  ) : (
                    <p className="inspiration-text">{inspirations[inspirationIndex]}</p>
                  )}
                </div>
              )}
            </div>
            <button className="icon-button theme-toggle" type="button" onClick={cycleTheme} aria-label={themeLabels[theme]}>
              <span className="theme-indicator" aria-hidden="true">
                <span className={`theme-dot ${theme}`}></span>
              </span>
            </button>
            <button
              className="menu-button"
              type="button"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `mobile-link${isActive ? ' mobile-link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>© 2026 HaoLeng. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/blog">博客</Link>
          <Link to="/bookshelf">书架</Link>
        </div>
      </footer>

      <button className="back-to-top" type="button" onClick={scrollToTop} aria-label="返回顶部">
        ↑
      </button>
    </div>
  )
}

export default App
