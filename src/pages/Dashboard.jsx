import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Avatar, Breadcrumbs, Button, Card, Counter, EmptyState, MatchRing, Note, ProgressBar, ProvenanceTag,
  ScoreRow, SectionHeading, SkillChip, StatTile, Tabs, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { ActivityAreaChart } from '../components/ui/Charts'
import { useApp, useDerived } from '../context/AppContext'
import { ACTIVITIES, PEERS, PROGRESS, SKILL_GAP, WORKSHOPS } from '../data/mockData'

const QUICK_ACTIONS = [
  { to: '/gap-analysis', icon: 'ScanSearch', label: 'Run skill gap analysis', tone: 'brand' },
  { to: '/matching', icon: 'Sparkles', label: 'Find a peer match', tone: 'violet' },
  { to: '/practice', icon: 'Timer', label: 'Start a 20-min activity', tone: 'teal' },
  { to: '/exchange', icon: 'Repeat', label: 'Set up a skill exchange', tone: 'amberx' },
]

function WelcomeHeader() {
  const { state } = useApp()
  const derived = useDerived()
  const navigate = useNavigate()
  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-ink-900 sm:p-7">
      <div className="mesh pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar initials="SJ" size={56} />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">Student dashboard</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
              Welcome back, {state.student.name}
              <span className="ml-2 align-middle text-2xl">👋</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-ink-300">
              Target: <strong className="font-bold text-ink-700 dark:text-white">{state.student.careerGoal}</strong>. You are{' '}
              <strong className="font-bold text-teal-600 dark:text-teal-300">{derived.readiness}% career ready</strong> with a{' '}
              <strong className="font-bold text-ink-700 dark:text-white">{state.student.streakDays}-day</strong> learning streak.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amberx-500/10 px-3 py-1.5 text-xs font-bold text-amberx-500">
            <Icon name="Flame" size={14} /> {state.student.streakDays}-day streak
          </span>
          <Button size="sm" variant="primary" icon="Timer" onClick={() => navigate('/practice')}>
            Start practising
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { state, dispatch, toast } = useApp()
  const derived = useDerived()
  const navigate = useNavigate()
  const [window7, setWindow7] = useState('7')

  const topPeer = useMemo(() => PEERS.find((p) => p.id === 'aarav') || PEERS[0], [])
  const nextActivity = useMemo(() => {
    const done = new Set(state.completedActivities.map((a) => a.id))
    return ACTIVITIES.find((a) => !done.has(a.id)) || ACTIVITIES[0]
  }, [state.completedActivities])

  const stats = [
    {
      id: 'goal',
      icon: 'Target',
      tone: 'brand',
      label: 'Career Goal',
      value: state.student.careerGoal,
      sub: 'Benchmark for every recommendation on SkillSync.',
      to: '/profile',
      cta: 'Change goal',
    },
    {
      id: 'gap',
      icon: 'ScanSearch',
      tone: 'rose',
      label: 'AI Skill Gap',
      value: `${SKILL_GAP.gapSkills.length} skills`,
      sub: SKILL_GAP.gapSkills.map((g) => g.name).join(' · '),
      to: '/gap-analysis',
      cta: 'Open analysis',
    },
    {
      id: 'match',
      icon: 'Sparkles',
      tone: 'violet',
      label: 'Recommended Match',
      value: `${topPeer.matchScore}%`,
      sub: `${topPeer.name} · teaches ${topPeer.teach[0]}`,
      to: `/peer/${topPeer.id}`,
      cta: 'View profile',
    },
    {
      id: 'progress',
      icon: 'TrendingUp',
      tone: 'teal',
      label: 'Progress',
      value: `${state.student.progress}%`,
      sub: `${derived.pathPercent}% of the learning path logged.`,
      to: '/progress',
      cta: 'See charts',
    },
    {
      id: 'streak',
      icon: 'Flame',
      tone: 'amberx',
      label: 'Learning Streak',
      value: `${state.student.streakDays} days`,
      sub: 'Longest run of consecutive activity days.',
      to: '/progress',
      cta: 'Activity log',
    },
    {
      id: 'completed',
      icon: 'BadgeCheck',
      tone: 'sky',
      label: 'Skills Completed',
      value: `${state.student.skillsCompleted}`,
      sub: `${state.student.proofs} proof records · ${derived.uniqueActivitiesDone} practice reps done`,
      to: '/proof',
      cta: 'View proof',
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Student Dashboard' }]} />

      <WelcomeHeader />

      {/* stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s, i) => (
          <StatTile
            key={s.id}
            icon={s.icon}
            tone={s.tone}
            label={s.label}
            value={s.value}
            sub={s.sub}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 45}ms` }}
            footer={
              <Link to={s.to} className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 transition hover:gap-2.5 dark:text-brand-300">
                {s.cta} <Icon name="ArrowRight" size={13} />
              </Link>
            }
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        {/* gap summary */}
        <Card className="animate-fade-up">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Tag tone="brand" icon="ScanSearch">AI Skill Gap</Tag>
                <ProvenanceTag kind="illustrative" />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Three skills decide this outcome</h3>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">
                Measured against the illustrative benchmark for <strong className="font-semibold text-ink-700 dark:text-white">{SKILL_GAP.career}</strong>.
              </p>
            </div>
            <Button size="sm" variant="ghost" icon="ArrowRight" onClick={() => navigate('/gap-analysis')}>
              Full analysis
            </Button>
          </div>

          <ul className="mt-5 space-y-4">
            {SKILL_GAP.gapSkills.map((g) => (
              <li key={g.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-bold text-ink-800 dark:text-white">{g.name}</span>
                  <span className="tnum text-xs font-semibold text-ink-400">
                    {g.current}% → <span className="text-teal-600 dark:text-teal-300">{g.target}%</span>
                    <span className="ml-2 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-500 dark:bg-rose-500/15 dark:text-rose-300">{g.priority}</span>
                  </span>
                </div>
                <div className="relative mt-2">
                  <ProgressBar value={g.target} tone="ink" height="h-2.5" className="opacity-30" />
                  <div className="absolute inset-0">
                    <ProgressBar value={g.current} tone={g.priority === 'Critical' ? 'rose' : 'amberx'} height="h-2.5" />
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-ink-400">{g.why}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4 dark:border-white/10">
            <Button size="sm" variant="primary" icon="Wand2" onClick={() => navigate('/gap-analysis')}>
              Generate Learning Path
            </Button>
            <Button size="sm" variant="ghost" icon="Route" onClick={() => navigate('/learning-path')}>
              View current path
            </Button>
          </div>
        </Card>

        {/* top match */}
        <Card className="animate-fade-up animate-delay-100">
          <div className="flex items-center justify-between gap-2">
            <Tag tone="violet" icon="Sparkles">Recommended match</Tag>
            <ProvenanceTag kind="illustrative" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <MatchRing
              value={topPeer.matchScore}
              size={132}
              label={topPeer.scoreLabel}
              caption={
                <p className="mt-3 max-w-[15rem] text-center text-[10px] leading-relaxed text-ink-400">
                  94% is an illustrative product example and not a validated outcome.
                </p>
              }
            />
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-ink-50 p-3.5 dark:bg-white/5">
            <Avatar initials={topPeer.initials} tone={topPeer.avatarTone} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{topPeer.name}</p>
              <p className="truncate text-xs text-ink-400">{topPeer.year} · {topPeer.campus}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <ScoreRow label="Skill compatibility" value={topPeer.breakdown.skillCompatibility} />
            <ScoreRow label="Career alignment" value={topPeer.breakdown.careerAlignment} tone="violet" />
            <ScoreRow label="Learning preference" value={topPeer.breakdown.learningPreference} tone="teal" />
            <ScoreRow label="Availability" value={topPeer.breakdown.availability} tone="amberx" />
          </div>
          <div className="mt-5 flex gap-2">
            <Button size="sm" variant="primary" className="flex-1" onClick={() => navigate(`/peer/${topPeer.id}`)}>
              View profile
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={state.connections.includes(topPeer.id) ? 'UserCheck' : 'UserPlus'}
              onClick={() => {
                if (state.connections.includes(topPeer.id)) {
                  toast({ title: 'Already connected', body: `${topPeer.name} is in your connections.`, tone: 'violet', icon: 'UserCheck' })
                  return
                }
                dispatch({ type: 'CONNECT_PEER', id: topPeer.id })
                toast({ title: 'Connection request simulated successfully.', body: `${topPeer.name} would receive a request from ${state.student.name}.`, tone: 'teal' })
              }}
            >
              {state.connections.includes(topPeer.id) ? 'Connected' : 'Connect'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        {/* activity chart */}
        <Card className="animate-fade-up">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Learning activity</h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
                {window7 === '7' ? 'Hours logged this week' : window7 === '30' ? 'Hours logged over 30 days' : 'Hours logged over 90 days'} ·{' '}
                <span className="tnum font-semibold text-ink-700 dark:text-white">{state.student.hoursLearned} hrs</span> total
              </p>
            </div>
            <Tabs
              size="sm"
              value={window7}
              onChange={setWindow7}
              tabs={[
                { id: '7', label: '7 days' },
                { id: '30', label: '30 days' },
                { id: '90', label: '90 days' },
              ]}
            />
          </div>
          <ActivityAreaChart data={PROGRESS.series[window7].activity} height={252} />
          <Note className="mt-2">
            Activity data is seeded demo content. Completing a practice activity updates the practice-hours and streak figures across the app.
          </Note>
        </Card>

        {/* next activity + workshops */}
        <div className="space-y-4">
          <Card className="animate-fade-up animate-delay-100">
            <Tag tone="teal" icon="Timer">Next best action</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">{nextActivity.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{nextActivity.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-ink-400">
              <span className="inline-flex items-center gap-1"><Icon name="Clock" size={12} /> {nextActivity.duration} min</span>
              <span>·</span>
              <span>{nextActivity.level}</span>
              <span>·</span>
              <span>Unlocks {nextActivity.completes}</span>
            </div>
            <Button size="sm" variant="teal" className="mt-4 w-full" icon="Play" onClick={() => navigate('/practice')}>
              Start Activity
            </Button>
          </Card>

          <Card className="animate-fade-up animate-delay-200">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Upcoming workshops</h3>
              <Link to="/community" className="text-xs font-bold text-brand-600 dark:text-brand-300">All</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {WORKSHOPS.slice(0, 2).map((w) => (
                <li key={w.id} className="rounded-2xl border border-ink-100 p-3.5 dark:border-white/10">
                  <p className="text-sm font-bold text-ink-800 dark:text-white">{w.title}</p>
                  <p className="mt-1 text-[11px] text-ink-400">{w.host} · {w.when}</p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <ProgressBar value={w.filled} max={w.seats} tone="violet" height="h-1.5" className="flex-1" />
                    <span className="tnum text-[10px] font-bold text-ink-400">{w.filled}/{w.seats}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* quick actions */}
      <Card>
        <SectionHeading eyebrow="Quick actions" title="What do you want to do next?" className="!max-w-none" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.to}
              type="button"
              onClick={() => navigate(a.to)}
              className="group flex items-center gap-3 rounded-2xl border border-ink-100 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft dark:border-white/10 dark:hover:border-brand-400/40"
            >
              <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', {
                brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
                violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                amberx: 'bg-amberx-500/10 text-amberx-500',
              }[a.tone])}>
                <Icon name={a.icon} size={18} />
              </span>
              <span className="flex-1 text-sm font-semibold text-ink-700 dark:text-ink-100">{a.label}</span>
              <Icon name="ArrowRight" size={15} className="text-ink-300 transition group-hover:translate-x-1 group-hover:text-brand-600" />
            </button>
          ))}
        </div>
      </Card>

      {/* exchange summary */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <Tag tone="teal" icon="Repeat">Your exchange</Tag>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-2xl border border-teal-200/70 bg-teal-50/60 p-4 dark:border-teal-400/25 dark:bg-teal-500/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">I teach</p>
              <ul className="mt-2 space-y-1.5">
                {state.student.teach.map((s) => (
                  <li key={s}><SkillChip tone="teach" icon="Presentation">{s}</SkillChip></li>
                ))}
              </ul>
            </div>
            <span className="grid place-items-center">
              <Icon name="ArrowLeftRight" size={20} className="text-brand-500" />
            </span>
            <div className="rounded-2xl border border-brand-200/70 bg-brand-50/60 p-4 dark:border-brand-400/25 dark:bg-brand-500/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-200">I want to learn</p>
              <ul className="mt-2 space-y-1.5">
                {state.student.learn.map((s) => (
                  <li key={s}><SkillChip tone="learn" icon="BookOpenCheck">{s}</SkillChip></li>
                ))}
              </ul>
            </div>
          </div>
          <Button size="sm" variant="soft" className="mt-4 w-full" icon="Repeat" onClick={() => navigate('/exchange')}>
            Start Skill Exchange
          </Button>
        </Card>

        <Card>
          <Tag tone="violet" icon="Route">Learning path snapshot</Tag>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
                <Counter value={derived.pathPercent} suffix="%" />
              </p>
              <p className="mt-1 text-xs text-ink-400">{derived.completedSteps} of {derived.steps.length} steps completed</p>
            </div>
            <Button size="sm" variant="ghost" iconRight="ArrowRight" onClick={() => navigate('/learning-path')}>
              Open path
            </Button>
          </div>
          <ul className="mt-5 space-y-2.5">
            {derived.steps.slice(0, 4).map((s) => {
              const status = state.pathStatus[s.id]
              return (
                <li key={s.id} className="flex items-center gap-3">
                  <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-bold', status === 'completed' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300' : status === 'in-progress' ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200' : 'bg-ink-100 text-ink-400 dark:bg-white/10 dark:text-ink-300')}>
                    {status === 'completed' ? <Icon name="Check" size={13} /> : s.title.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink-700 dark:text-ink-100">{s.title}</span>
                    <ProgressBar value={state.pathProgress[s.id] || 0} tone={status === 'completed' ? 'teal' : 'brand'} height="h-1" className="mt-1" />
                  </span>
                  <span className="tnum shrink-0 text-[11px] font-bold text-ink-400">{state.pathProgress[s.id] || 0}%</span>
                </li>
              )
            })}
          </ul>
          {derived.steps.length > 4 ? (
            <p className="mt-3 text-center text-[11px] font-semibold text-ink-400">+{derived.steps.length - 4} more steps in the full path</p>
          ) : null}
        </Card>
      </div>

      {/* saved matches */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag tone="ink" icon="BookmarkCheck">Saved matches</Tag>
            <span className="tnum text-xs font-bold text-ink-400">{state.savedPeers.length}</span>
          </div>
          <Button size="sm" variant="ghost" icon="Sparkles" onClick={() => navigate('/matching')}>
            Find more peers
          </Button>
        </div>
        {state.savedPeers.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon="Bookmark"
              title="No saved matches yet"
              body="Save a peer from the matching page and they will appear here for quick access."
              action={<Button size="sm" variant="primary" icon="Sparkles" onClick={() => navigate('/matching')}>Go to peer matching</Button>}
            />
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.savedPeers.map((id) => {
              const peer = PEERS.find((p) => p.id === id)
              if (!peer) return null
              return (
                <li key={id} className="flex items-center gap-3 rounded-2xl border border-ink-100 p-3.5 transition hover:border-brand-200 hover:shadow-soft dark:border-white/10">
                  <Avatar initials={peer.initials} tone={peer.avatarTone} size={42} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{peer.name}</p>
                    <p className="truncate text-[11px] text-ink-400">Teaches {peer.teach[0]}</p>
                  </div>
                  <Tooltip label={`Open ${peer.name}'s profile`}>
                    <Link to={`/peer/${peer.id}`} className="grid h-8 w-8 place-items-center rounded-lg bg-ink-50 text-ink-500 transition hover:bg-brand-50 hover:text-brand-600 dark:bg-white/5 dark:text-ink-200">
                      <Icon name="ArrowRight" size={15} />
                    </Link>
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}
