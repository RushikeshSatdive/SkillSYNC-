import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { Button, Modal, Tooltip, cx } from '../ui/Kit'
import { NAV_GROUPS, MOBILE_TABS } from '../../data/nav'
import { DEMO_MODE } from '../../data/mockData'
import { useApp, useDerived } from '../../context/AppContext'
import { ThemeToggle, Wordmark } from './Brand'
import SearchOverlay from './SearchOverlay'

/* ------------------------------------------------------------------ *
 * Demo banner
 * ------------------------------------------------------------------ */
function DemoBanner() {
  const { resetDemo, state } = useApp()
  const [confirm, setConfirm] = useState(false)
  const [me, setMe] = useState(null)

  useEffect(() => {
    // count interactions so the reset meaningfully differs from a fresh load
    const count =
      state.completedActivities.length +
      state.connections.length +
      state.community.likes.length +
      state.community.saved.length +
      Object.values(state.pathStatus).filter((s) => s === 'completed').length
    setMe(count)
  }, [state])

  return (
    <>
      <div className="relative z-40 flex flex-wrap items-center justify-between gap-2 border-b border-brand-500/20 bg-gradient-to-r from-brand-600 via-brand-700 to-violet-600 px-4 py-2 text-white sm:px-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-300" />
            </span>
            {DEMO_MODE.title}
          </span>
          <span className="text-xs font-medium text-white/90">{DEMO_MODE.subtitle}</span>
          <span className="hidden text-[11px] text-white/70 lg:inline">· {DEMO_MODE.detail}</span>
        </div>
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/25"
        >
          <Icon name="RotateCcw" size={13} /> Reset Demo Data
        </button>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Reset demo data?"
        subtitle="This restores every value to its starting state."
        icon="RotateCcw"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon="RotateCcw"
              data-autofocus
              onClick={() => {
                resetDemo()
                setConfirm(false)
              }}
            >
              Reset demo data
            </Button>
          </>
        }
      >
        <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-300">
          <li className="flex items-start gap-2">
            <Icon name="RefreshCw" size={15} className="mt-0.5 shrink-0 text-brand-500" />
            Learning-path progress, completed activities and practice hours return to the deck figures.
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Users" size={15} className="mt-0.5 shrink-0 text-brand-500" />
            Saved matches, connection requests and session setups are cleared.
          </li>
          <li className="flex items-start gap-2">
            <Icon name="MessagesSquare" size={15} className="mt-0.5 shrink-0 text-brand-500" />
            Community likes, saves and comments return to the seeded set.
          </li>
        </ul>
        {me > 0 ? (
          <p className="mt-4 rounded-xl bg-ink-50 px-3 py-2.5 text-xs text-ink-500 dark:bg-white/5 dark:text-ink-300">
            You have <strong className="tnum text-ink-800 dark:text-white">{me}</strong> recorded interaction{me === 1 ? '' : 's'} in this session.
          </p>
        ) : null}
      </Modal>
    </>
  )
}

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */
function SidebarContent({ onNavigate }) {
  const { state } = useApp()
  const derived = useDerived()
  const { pathname } = useLocation()

  const badges = {
    '/matching': state.savedPeers.length || null,
    '/community': state.community.saved.length || null,
    '/practice': state.completedActivities.length || null,
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Wordmark size="md" className="[&_span]:!text-white" />
      </div>

      <nav aria-label="Dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{group.label}</p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    onClick={onNavigate}
                    title={item.hint}
                    className={({ isActive }) =>
                      cx(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                        isActive
                          ? 'bg-gradient-to-r from-brand-500/25 to-violet-500/10 text-white'
                          : 'text-white/65 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-teal-400" /> : null}
                        <Icon name={item.icon} size={17} className={isActive ? 'text-teal-300' : 'text-white/50 group-hover:text-white/80'} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {badges[item.to] ? (
                          <span className="tnum rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white">{badges[item.to]}</span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl bg-white/5 p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 font-display text-xs font-bold text-white">
              {state.student.name.slice(0, 1)}
              J
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">{state.student.name} Jadhav</p>
              <p className="truncate text-[11px] text-white/50">{state.student.careerGoal}</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-brand-400 transition-[width] duration-700" style={{ width: `${derived.readiness}%` }} />
          </div>
          <p className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-white/45">
            <span>Career readiness</span>
            <span className="tnum text-teal-300">{derived.readiness}%</span>
          </p>
        </div>
        <p className="mt-3 px-1 text-[10px] leading-relaxed text-white/35">
          Demo profile · data stored locally. No account required.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * App layout
 * ------------------------------------------------------------------ */
export default function AppLayout() {
  const { theme, toggleTheme, state } = useApp()
  const derived = useDerived()
  const [drawer, setDrawer] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setDrawer(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

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

  const crumb = useMemo(() => {
    if (pathname.startsWith('/peer/')) return 'Peer Profile'
    const found = NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label }))).find((i) => i.to === pathname)
    return found ? found.label : 'SkillSync'
  }, [pathname])

  const group = useMemo(() => {
    if (pathname.startsWith('/peer/')) return 'Peer Matching'
    const found = NAV_GROUPS.find((g) => g.items.some((i) => i.to === pathname))
    return found ? found.label : 'SkillSync'
  }, [pathname])

  return (
    <div className="min-h-dvh bg-ink-50 dark:bg-ink-950">
      <a href="#app-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
        Skip to content
      </a>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-[17.5rem] shrink-0 bg-ink-900 lg:block">
          <SidebarContent />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-40">
            <DemoBanner />
            <header className="flex h-16 items-center gap-3 border-b border-ink-100 bg-white/85 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/85 sm:px-6">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                aria-label="Open navigation"
                className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-600 dark:border-white/15 dark:text-white lg:hidden"
              >
                <Icon name="Menu" size={18} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">{group}</p>
                <h1 className="truncate font-display text-base font-bold text-ink-900 dark:text-white sm:text-lg">{crumb}</h1>
              </div>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-400 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/15 dark:bg-white/5 dark:text-ink-300 md:flex"
              >
                <Icon name="Search" size={15} />
                <span className="hidden lg:inline">Search SkillSync</span>
                <kbd className="hidden rounded border border-ink-200 px-1.5 py-0.5 text-[10px] font-bold dark:border-white/15 lg:inline">⌘K</kbd>
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-500 dark:border-white/15 dark:text-ink-200 md:hidden"
              >
                <Icon name="Search" size={17} />
              </button>

              <ThemeToggle theme={theme} onToggle={toggleTheme} />

              <Tooltip label={`${state.student.name}'s demo profile — ${state.student.careerGoal}`}>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-1 pr-3 transition hover:border-brand-300 dark:border-white/15 dark:bg-white/5"
                  aria-label="Open skill profile"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 font-display text-xs font-bold text-white">SJ</span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-[11px] font-bold leading-tight text-ink-800 dark:text-white">{state.student.name}</span>
                    <span className="tnum block text-[10px] leading-tight text-teal-600 dark:text-teal-300">{derived.readiness}% ready</span>
                  </span>
                </button>
              </Tooltip>
            </header>
          </div>

          <main id="app-main" className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
            <div key={pathname} className="animate-fade-up">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav aria-label="Quick navigation" className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/95 lg:hidden">
        <ul className="grid grid-cols-5">
          {MOBILE_TABS.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) =>
                  cx('flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition', isActive ? 'text-brand-600 dark:text-brand-300' : 'text-ink-400 dark:text-ink-300')
                }
              >
                <Icon name={tab.icon} size={19} />
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile drawer */}
      {drawer ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" aria-label="Close navigation" onClick={() => setDrawer(false)} className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in" />
          <div className="absolute left-0 top-0 h-full w-[17.5rem] bg-ink-900 shadow-card animate-fade-in">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Icon name="X" size={18} />
            </button>
            <SidebarContent onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      ) : null}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
