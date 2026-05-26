import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import './App.css'

const navItems = [
  { label: '首页', path: '/' },
  { label: '博客', path: '/blog' },
  { label: '书架', path: '/bookshelf' },
]

const themeLabels = { light: '明亮模式', dark: '暗黑模式', warm: '暖色模式' }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

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
            <button className="icon-button" type="button" aria-label="搜索暂未启用">
              <span aria-hidden="true">⌕</span>
            </button>
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
