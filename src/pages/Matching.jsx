import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Avatar, Breadcrumbs, Button, Card, EmptyState, MatchRing, Modal, Note, ProvenanceTag, RatingStars,
  ScoreRow, SectionHeading, SkillChip, Tabs, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import {
  AVAILABILITY_OPTIONS, CAREER_GOALS, LEARNING_PREFERENCES, PEERS, SKILL_LEVELS, SKILLS,
} from '../data/mockData'

const SORTS = [
  { id: 'match', label: 'Sort by Match Score (high → low)' },
  { id: 'rating', label: 'Sort by Rating' },
  { id: 'sessions', label: 'Sort by Sessions Delivered' },
  { id: 'name', label: 'Sort by Name (A → Z)' },
]

function FilterPanel({ filters, setFilters, onReset, resultCount }) {
  const [openMobile, setOpenMobile] = useState(false)
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const activeCount = Object.entries(filters).filter(([k, v]) => k !== 'q' && v && v !== 'all').length

  const body = (
    <div className="space-y-4">
      <div>
        <label htmlFor="f-skill" className="label">Skill</label>
        <select id="f-skill" value={filters.skill} onChange={(e) => set({ skill: e.target.value })} className="input">
          <option value="all">Any skill</option>
          {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="f-goal" className="label">Career Goal</label>
        <select id="f-goal" value={filters.goal} onChange={(e) => set({ goal: e.target.value })} className="input">
          <option value="all">Any career goal</option>
          {CAREER_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="f-avail" className="label">Availability</label>
        <select id="f-avail" value={filters.availability} onChange={(e) => set({ availability: e.target.value })} className="input">
          <option value="all">Any availability</option>
          {AVAILABILITY_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="f-level" className="label">Skill Level</label>
        <select id="f-level" value={filters.level} onChange={(e) => set({ level: e.target.value })} className="input">
          <option value="all">Any level</option>
          {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="f-pref" className="label">Learning Preference</label>
        <select id="f-pref" value={filters.preference} onChange={(e) => set({ preference: e.target.value })} className="input">
          <option value="all">Any preference</option>
          {LEARNING_PREFERENCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <p className="label">Minimum match score</p>
        <input
          type="range"
          min="0"
          max="95"
          step="1"
          value={filters.minScore}
          onChange={(e) => set({ minScore: Number(e.target.value) })}
          className="w-full accent-brand-600"
          aria-label="Minimum match score"
        />
        <div className="tnum mt-1 flex justify-between text-[11px] font-semibold text-ink-400">
          <span>0%</span>
          <span className="text-brand-600 dark:text-brand-300">≥ {filters.minScore}%</span>
          <span>95%</span>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="ghost" size="sm" icon="RotateCcw" onClick={onReset} className="flex-1">Reset filters</Button>
      </div>
    </div>
  )

  return (
    <>
      <Card className="hidden lg:block">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-900 dark:text-white">
            <Icon name="SlidersHorizontal" size={16} className="text-brand-600 dark:text-brand-300" /> Filters
          </h3>
          {activeCount ? <span className="label-badge bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">{activeCount} active</span> : null}
        </div>
        <div className="mt-5">{body}</div>
        <Note className="mt-5">Filters apply instantly. {resultCount} peer{resultCount === 1 ? '' : 's'} match the current set.</Note>
      </Card>

      <div className="lg:hidden">
        <Button variant="ghost" icon="SlidersHorizontal" onClick={() => setOpenMobile(true)} className="w-full">
          Filters {activeCount ? `(${activeCount})` : ''} · {resultCount} result{resultCount === 1 ? '' : 's'}
        </Button>
        <Modal open={openMobile} onClose={() => setOpenMobile(false)} title="Filter peers" subtitle="Narrow the match list" icon="SlidersHorizontal" size="sm">
          {body}
          <Button variant="primary" className="mt-5 w-full" onClick={() => setOpenMobile(false)}>Show {resultCount} result{resultCount === 1 ? '' : 's'}</Button>
        </Modal>
      </div>
    </>
  )
}

function PeerCard({ peer, index }) {
  const { state, dispatch, toast } = useApp()
  const navigate = useNavigate()
  const [openWhy, setOpenWhy] = useState(false)

  const saved = state.savedPeers.includes(peer.id)
  const connected = state.connections.includes(peer.id)

  return (
    <li className="card card-hover animate-fade-up overflow-hidden p-0" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="flex flex-wrap items-start gap-4 p-5">
        <Avatar initials={peer.initials} tone={peer.avatarTone} size={54} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">{peer.name}</h3>
            <Tag tone={peer.matchScore >= 90 ? 'violet' : 'ink'}>{peer.scoreLabel}</Tag>
          </div>
          <p className="mt-1 text-xs text-ink-400">{peer.year} · {peer.campus}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-ink-500 dark:text-ink-300">
            <RatingStars value={peer.rating} size={12} />
            <span className="inline-flex items-center gap-1"><Icon name="Repeat" size={11} className="text-brand-500" /> {peer.exchanges} exchanges</span>
            <span className="inline-flex items-center gap-1"><Icon name="Users" size={11} className="text-teal-500" /> {peer.sessions} sessions</span>
          </div>
        </div>
        <div className="shrink-0 text-center">
          <div className="relative grid h-16 w-16 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-ink-100 dark:stroke-white/10" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" strokeLinecap="round"
                stroke={peer.matchScore >= 90 ? '#14B8A6' : '#6366F1'}
                strokeDasharray={`${(peer.matchScore / 100) * 97.4} 97.4`}
              />
            </svg>
            <span className="tnum font-display text-sm font-extrabold text-ink-900 dark:text-white">{peer.matchScore}%</span>
          </div>
          <p className="mt-1 text-[9.5px] font-bold uppercase tracking-wider text-ink-400">Match</p>
        </div>
      </div>

      <div className="grid gap-3 px-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-teal-200/60 bg-teal-50/50 p-3.5 dark:border-teal-400/25 dark:bg-teal-500/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Can teach</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {peer.teach.map((t) => <SkillChip key={t} tone="teach">{t}</SkillChip>)}
          </div>
        </div>
        <div className="rounded-2xl border border-brand-200/60 bg-brand-50/50 p-3.5 dark:border-brand-400/25 dark:bg-brand-500/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-200">Wants to learn</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {peer.learn.map((l) => <SkillChip key={l} tone="learn">{l}</SkillChip>)}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => setOpenWhy((o) => !o)}
          aria-expanded={openWhy}
          className="flex w-full items-center justify-between gap-2 rounded-xl bg-ink-50 px-3.5 py-2.5 text-left transition hover:bg-ink-100 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-ink-700 dark:text-ink-100">
            <Icon name="Lightbulb" size={14} className="text-amberx-500" /> Why this peer?
          </span>
          <Icon name={openWhy ? 'ChevronUp' : 'ChevronDown'} size={15} className="text-ink-400" />
        </button>
        {openWhy ? (
          <ul className="mt-3 animate-fade-in space-y-2">
            {peer.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-600 dark:text-ink-200">
                <Icon name="CheckCircle2" size={14} className="mt-0.5 shrink-0 text-teal-500" /> {r}
              </li>
            ))}
            <li className="mt-3 grid gap-2 rounded-xl border border-ink-100 p-3 dark:border-white/10 sm:grid-cols-2">
              <ScoreRow label="Skill compatibility" value={peer.breakdown.skillCompatibility} />
              <ScoreRow label="Career alignment" value={peer.breakdown.careerAlignment} tone="violet" />
              <ScoreRow label="Learning preference" value={peer.breakdown.learningPreference} tone="teal" />
              <ScoreRow label="Availability" value={peer.breakdown.availability} tone="amberx" />
            </li>
            <li className="pt-1">
              <Note>
                {peer.matchScore}% is an illustrative product example and not a validated outcome. Scores are seeded demo values.
              </Note>
            </li>
          </ul>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 p-4 dark:border-white/10">
        <Button size="sm" variant="primary" icon="UserRoundPlus" onClick={() => navigate(`/peer/${peer.id}`)} className="flex-1">
          View Profile
        </Button>
        <Button
          size="sm"
          variant={connected ? 'soft' : 'ghost'}
          icon={connected ? 'UserCheck' : 'UserPlus'}
          onClick={() => {
            if (connected) {
              toast({ title: 'Already connected', body: `${peer.name} is already in your connections.`, tone: 'violet', icon: 'UserCheck' })
              return
            }
            dispatch({ type: 'CONNECT_PEER', id: peer.id })
            toast({ title: 'Connection request simulated successfully.', body: `${peer.name} would receive your request in a live product.`, tone: 'teal' })
          }}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
        <Tooltip label={saved ? 'Remove from saved matches' : 'Save this match to your dashboard'}>
          <Button
            size="sm"
            variant={saved ? 'soft' : 'ghost'}
            icon={saved ? 'BookmarkCheck' : 'Bookmark'}
            aria-label={saved ? 'Unsave match' : 'Save match'}
            onClick={() => {
              dispatch({ type: 'TOGGLE_SAVE_PEER', id: peer.id })
              toast({
                title: saved ? 'Match removed' : 'Match saved',
                body: saved ? `${peer.name} was removed from your saved matches.` : `${peer.name} now appears in your dashboard saved matches.`,
                tone: saved ? 'amber' : 'brand',
                icon: saved ? 'Bookmark' : 'BookmarkCheck',
              })
            }}
          >
            {saved ? 'Saved' : 'Save Match'}
          </Button>
        </Tooltip>
      </div>
    </li>
  )
}

export default function Matching() {
  const { state, dispatch, toast } = useApp()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const [filters, setFilters] = useState({
    q: params.get('q') || '',
    skill: params.get('skill') || 'all',
    goal: 'all',
    availability: 'all',
    level: 'all',
    preference: 'all',
    minScore: 0,
  })
  const [sort, setSort] = useState('match')
  const [tab, setTab] = useState('all')

  // keep ?skill= deep links in sync (used by global search)
  useEffect(() => {
    const skill = params.get('skill')
    if (skill) setFilters((f) => ({ ...f, skill }))
  }, [params])

  const filtered = useMemo(() => {
    const term = filters.q.trim().toLowerCase()
    const list = PEERS.filter((p) => {
      if (tab === 'saved' && !state.savedPeers.includes(p.id)) return false
      if (tab === 'connected' && !state.connections.includes(p.id)) return false
      if (term && !(`${p.name} ${p.teach.join(' ')} ${p.learn.join(' ')} ${p.careerGoal} ${p.campus}`.toLowerCase().includes(term))) return false
      if (filters.skill !== 'all' && !p.teach.includes(filters.skill)) return false
      if (filters.goal !== 'all' && p.careerGoal !== filters.goal) return false
      if (filters.availability !== 'all' && p.availability !== filters.availability) return false
      if (filters.level !== 'all' && p.level !== filters.level) return false
      if (filters.preference !== 'all' && p.learningPreference !== filters.preference) return false
      if (p.matchScore < filters.minScore) return false
      return true
    })
    const sorted = [...list]
    if (sort === 'match') sorted.sort((a, b) => b.matchScore - a.matchScore)
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (sort === 'sessions') sorted.sort((a, b) => b.sessions - a.sessions)
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [filters, sort, tab, state.savedPeers, state.connections])

  const top = useMemo(() => [...PEERS].sort((a, b) => b.matchScore - a.matchScore)[0], [])
  const resetFilters = () => {
    setFilters({ q: '', skill: 'all', goal: 'all', availability: 'all', level: 'all', preference: 'all', minScore: 0 })
    setParams({})
    toast({ title: 'Filters reset', body: 'Showing all peers again.', tone: 'brand', icon: 'RotateCcw' })
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Peer Matching' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Peer matching"
          title={<>Find the Right <span className="grad-text">Person</span></>}
          lede="Matching weighs skill compatibility, career alignment, learning preference and availability. Adjust the filters and the ranking updates instantly."
          className="!max-w-2xl"
        />
        <div className="flex items-center gap-2">
          <ProvenanceTag kind="illustrative" />
          <Button size="sm" variant="ghost" icon="ArrowLeftRight" onClick={() => navigate('/exchange')}>Skill exchange</Button>
        </div>
      </div>

      {/* match score explainer */}
      <Card className="relative overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_1fr] lg:items-center">
          <div className="flex flex-col items-center">
            <MatchRing
              value={top.matchScore}
              size={148}
              label={top.scoreLabel}
              caption={
                <p className="mt-3 max-w-[15rem] text-center text-[10px] leading-relaxed text-ink-400">
                  {top.matchScore}% is an illustrative product example and not a validated outcome.
                </p>
              }
            />
          </div>
          <div className="lg:border-l lg:border-ink-100 lg:pl-6 dark:lg:border-white/10">
            <div className="flex items-center gap-2">
              <Avatar initials={top.initials} tone={top.avatarTone} size={40} />
              <div>
                <p className="text-sm font-bold text-ink-900 dark:text-white">{top.name}</p>
                <p className="text-[11px] text-ink-400">{top.campus} · {top.availability} {top.availabilitySlots}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{top.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="primary" icon="UserRoundPlus" onClick={() => navigate(`/peer/${top.id}`)}>Open profile</Button>
              <Button
                size="sm"
                variant="ghost"
                icon={state.connections.includes(top.id) ? 'UserCheck' : 'UserPlus'}
                onClick={() => {
                  if (state.connections.includes(top.id)) {
                    toast({ title: 'Already connected', tone: 'violet', icon: 'UserCheck' })
                    return
                  }
                  dispatch({ type: 'CONNECT_PEER', id: top.id })
                  toast({ title: 'Connection request simulated successfully.', tone: 'teal' })
                }}
              >
                {state.connections.includes(top.id) ? 'Connected' : 'Connect'}
              </Button>
            </div>
          </div>
          <div className="space-y-3 lg:border-l lg:border-ink-100 lg:pl-6 dark:lg:border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">How this score is built</p>
            <ScoreRow label="Skill compatibility" value={top.breakdown.skillCompatibility} />
            <ScoreRow label="Career alignment" value={top.breakdown.careerAlignment} tone="violet" />
            <ScoreRow label="Learning preference" value={top.breakdown.learningPreference} tone="teal" />
            <ScoreRow label="Availability" value={top.breakdown.availability} tone="amberx" />
            <Note className="pt-1">Weightings are fixed planning values in this prototype, not a trained model.</Note>
          </div>
        </div>
      </Card>

      {/* search + sort + tabs */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              placeholder="Search by name, skill or campus…"
              aria-label="Search peers"
              className="input pl-10"
            />
            {filters.q ? (
              <button type="button" onClick={() => setFilters((f) => ({ ...f, q: '' }))} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10">
                <Icon name="X" size={14} />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Tabs
              size="sm"
              value={tab}
              onChange={setTab}
              tabs={[
                { id: 'all', label: 'All peers', icon: 'Users', count: PEERS.length },
                { id: 'saved', label: 'Saved', icon: 'Bookmark', count: state.savedPeers.length },
                { id: 'connected', label: 'Connected', icon: 'UserCheck', count: state.connections.length },
              ]}
            />
            <label htmlFor="sort" className="sr-only">Sort peers</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto !py-2 text-xs font-semibold">
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[19rem_1fr] lg:items-start">
        <div className="lg:sticky lg:top-32">
          <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} resultCount={filtered.length} />
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink-600 dark:text-ink-200">
              <span className="tnum font-bold text-ink-900 dark:text-white">{filtered.length}</span> peer{filtered.length === 1 ? '' : 's'} found
              {filters.skill !== 'all' ? <> · teaching <span className="font-bold text-brand-600 dark:text-brand-300">{filters.skill}</span></> : null}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-ink-400">
              <Icon name="ArrowUpDown" size={12} /> {SORTS.find((s) => s.id === sort).label}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="Search"
              title={tab === 'saved' ? 'No saved matches in this filter set' : tab === 'connected' ? 'No connections yet' : 'No peers match these filters'}
              body={
                tab === 'saved'
                  ? 'Save a peer from the full list and they will show up here.'
                  : tab === 'connected'
                  ? 'Send a connection request from any peer card and it will appear here.'
                  : 'Try widening the availability, level or minimum match score filters.'
              }
              action={<Button variant="primary" icon="RotateCcw" onClick={resetFilters}>Reset filters</Button>}
            />
          ) : (
            <ul className="grid gap-4 xl:grid-cols-2">
              {filtered.map((p, i) => <PeerCard key={p.id} peer={p} index={i} />)}
            </ul>
          )}

          <Card className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                  <Icon name="Repeat" size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900 dark:text-white">Prefer a two-way exchange instead?</p>
                  <p className="mt-0.5 text-[13px] text-ink-500 dark:text-ink-300">Set up an exchange where you teach Financial Analysis and learn Digital Marketing.</p>
                </div>
              </div>
              <Button variant="primary" size="sm" icon="Repeat" onClick={() => navigate('/exchange')}>Start Skill Exchange</Button>
            </div>
          </Card>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { icon: 'ShieldCheck', title: 'No cold outreach', body: 'Connection requests are simulated locally — nothing is transmitted in this prototype.' },
              { icon: 'Users', title: '3 peer matches considered', body: 'The demo ranks across six seeded peer profiles so sorting and filters stay meaningful.' },
              { icon: 'Info', title: 'Honest scoring', body: 'Match percentages are illustrative product examples, not validated model output.' },
            ].map((t) => (
              <Card key={t.title} className="!p-4">
                <Icon name={t.icon} size={17} className="text-brand-600 dark:text-brand-300" />
                <p className="mt-3 text-sm font-bold text-ink-900 dark:text-white">{t.title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{t.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
