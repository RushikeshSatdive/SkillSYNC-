import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'
import { Button, cx } from '../ui/Kit'
import { SITE_NAV } from '../../data/nav'
import { ThemeToggle, Wordmark, LogoMark } from './Brand'
import Footer from './Footer'
import SearchOverlay from './SearchOverlay'
import { useApp } from '../../context/AppContext'

function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-transparent" aria-hidden="true">
      <div className="h-full bg-gradient-to-r from-brand-500 via-violet-500 to-teal-400 transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function SiteLayout() {
  const { theme, toggleTheme } = useApp()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-ink-950">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
        Skip to content
      </a>

      <header className={cx('sticky top-0 z-50 transition', scrolled ? 'glass-light border-b border-ink-100 dark:border-white/10' : 'bg-transparent')}>
        <div className="section flex h-16 items-center justify-between gap-4 sm:h-18">
          <Wordmark size="md" />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {SITE_NAV.map((item) => {
              if (item.hash) {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50 hover:text-brand-700 dark:text-ink-200 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    cx(
                      'rounded-lg px-3 py-2 text-sm font-semibold transition',
                      isActive ? 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white' : 'text-ink-600 hover:bg-ink-50 hover:text-brand-700 dark:text-ink-200 dark:hover:bg-white/5 dark:hover:text-white',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-400 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/15 dark:bg-white/5 dark:text-ink-300 sm:flex"
              aria-label="Search SkillSync"
            >
              <Icon name="Search" size={15} />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border border-ink-200 px-1.5 py-0.5 text-[10px] font-bold dark:border-white/15 md:inline">⌘K</kbd>
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <Button to="/dashboard" variant="primary" size="sm" className="hidden sm:inline-flex" iconRight="ArrowRight">
              Explore SkillSync
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-600 dark:border-white/15 dark:text-white lg:hidden"
            >
              <Icon name={menuOpen ? 'X' : 'Menu'} size={18} />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-ink-100 bg-white px-5 pb-6 pt-4 animate-fade-in dark:border-white/10 dark:bg-ink-950 lg:hidden">
            <nav aria-label="Mobile primary" className="grid gap-1">
              {SITE_NAV.map((item) => (
                <Link key={item.label} to={item.to} className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-white/5">
                  {item.label}
                </Link>
              ))}
              <Link to="/dashboard" className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-white/5">
                Student Dashboard
              </Link>
              <Link to="/financials" className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-white/5">
                Investor Dashboard
              </Link>
            </nav>
            <div className="mt-4 flex gap-3">
              <Button to="/dashboard" variant="primary" className="flex-1" iconRight="ArrowRight">
                Explore SkillSync
              </Button>
              <Button onClick={() => setSearchOpen(true)} variant="ghost" icon="Search" aria-label="Search">
                Search
              </Button>
            </div>
          </div>
        ) : null}
        <ScrollProgress />
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

export { LogoMark }
