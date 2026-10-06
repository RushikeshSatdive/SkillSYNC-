import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { cx } from '../ui/Kit'
import { ALL_PAGES } from '../../data/nav'
import { ACTIVITIES, PEERS, SKILLS } from '../../data/mockData'

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        open ? onClose() : null
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const pages = ALL_PAGES.filter((p) => !term || p.label.toLowerCase().includes(term) || p.hint.toLowerCase().includes(term) || p.group.toLowerCase().includes(term)).map((p) => ({
      kind: 'Page',
      icon: p.icon,
      title: p.label,
      sub: `${p.group} · ${p.hint}`,
      to: p.to,
    }))
    const peers = PEERS.filter((p) => !term || p.name.toLowerCase().includes(term) || p.teach.join(' ').toLowerCase().includes(term) || p.careerGoal.toLowerCase().includes(term)).map((p) => ({
      kind: 'Peer',
      icon: 'Users',
      title: p.name,
      sub: `Teaches ${p.teach.join(', ')} · match ${p.matchScore}%`,
      to: `/peer/${p.id}`,
    }))
    const skills = SKILLS.filter((s) => term && s.toLowerCase().includes(term)).map((s) => ({
      kind: 'Skill',
      icon: 'Sparkles',
      title: s,
      sub: 'Open peer matching filtered by this skill',
      to: `/matching?skill=${encodeURIComponent(s)}`,
    }))
    const acts = ACTIVITIES.filter((a) => !term || a.title.toLowerCase().includes(term) || a.skill.toLowerCase().includes(term)).map((a) => ({
      kind: 'Activity',
      icon: a.icon,
      title: a.title,
      sub: `${a.duration} min · ${a.level}`,
      to: '/practice',
    }))
    if (!term) return [...pages.slice(0, 6), ...peers.slice(0, 3)]
    return [...pages, ...peers, ...skills, ...acts].slice(0, 18)
  }, [q])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      navigate(results[active].to)
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Search SkillSync">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 cursor-default bg-ink-950/60 backdrop-blur-sm animate-fade-in" />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card animate-fade-up dark:border-white/10 dark:bg-ink-900">
        <div className="flex items-center gap-3 border-b border-ink-100 px-4 dark:border-white/10">
          <Icon name="Search" size={18} className="text-ink-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, peers, skills, activities…"
            aria-label="Search input"
            className="w-full bg-transparent py-4 text-sm text-ink-800 outline-none placeholder-ink-400 dark:text-white"
          />
          <kbd className="hidden rounded-md border border-ink-200 px-2 py-1 text-[10px] font-bold text-ink-400 dark:border-white/15 sm:block">ESC</kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Icon name="Search" size={20} className="mx-auto mb-3 text-ink-300" />
              <p className="text-sm font-semibold text-ink-700 dark:text-white">No results for “{q}”</p>
              <p className="mt-1 text-xs text-ink-400">Try “valuation”, “Aarav”, “practice” or “funding”.</p>
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.kind}-${r.title}-${i}`}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  navigate(r.to)
                  onClose()
                }}
                className={cx(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  i === active ? 'bg-brand-50 dark:bg-white/10' : 'hover:bg-ink-50 dark:hover:bg-white/5',
                )}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-soft dark:bg-white/10 dark:text-brand-300">
                  <Icon name={r.icon} size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-800 dark:text-white">{r.title}</span>
                  <span className="block truncate text-xs text-ink-400 dark:text-ink-300">{r.sub}</span>
                </span>
                <span className="hidden shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-500 dark:bg-white/10 dark:text-ink-200 sm:block">
                  {r.kind}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t border-ink-100 px-4 py-2.5 text-[11px] text-ink-400 dark:border-white/10">
          <span>↑ ↓ to navigate · Enter to open</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  )
}
