import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Note, ProgressBar, ProvenanceTag, SectionHeading, Skeleton, Tabs, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import {
  ActivityAreaChart, ReadinessLineChart, SessionsChart, SkillImprovementChart, PALETTE,
} from '../components/ui/Charts'
import { useApp, useDerived } from '../context/AppContext'
import { PROOFS, PROGRESS } from '../data/mockData'

const WINDOWS = [
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
  { id: '90', label: '90 days' },
]

function KpiCard({ icon, label, value, sub, tone = 'brand', provenance, delay = 0 }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    amberx: 'bg-amberx-500/10 text-amberx-500',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
  }
  return (
    <Card className="animate-fade-up !p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-2">
        <span className={cx('grid h-10 w-10 place-items-center rounded-xl', tones[tone])}>
          <Icon name={icon} size={18} />
        </span>
        {provenance ? <ProvenanceTag kind={provenance} /> : null}
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
      <p className="tnum mt-1 font-display text-2xl font-extrabold text-ink-900 dark:text-white">{value}</p>
      {sub ? <p className="mt-1.5 text-[11px] leading-relaxed text-ink-400">{sub}</p> : null}
    </Card>
  )
}

export default function Progress() {
  const { state } = useApp()
  const derived = useDerived()
  const navigate = useNavigate()
  const [win, setWin] = useState('30')
  // Brief shimmer while the window recomputes — shows the loading pattern without faking latency.
  const [recomputing, setRecomputing] = useState(false)
  const shimmerTimer = useRef(null)
  const changeWindow = (id) => {
    if (id === win) return
    setRecomputing(true)
    setWin(id)
    clearTimeout(shimmerTimer.current)
    shimmerTimer.current = setTimeout(() => setRecomputing(false), 260)
  }
  useEffect(() => () => clearTimeout(shimmerTimer.current), [])

  const series = PROGRESS.series[win]
  const totalHours = useMemo(() => series.activity.reduce((a, b) => a + b.hours, 0), [series])
  const totalActivities = useMemo(() => series.activity.reduce((a, b) => a + b.activities, 0), [series])
  const sessionsCompleted = useMemo(() => series.sessions.reduce((a, b) => a + b.completed, 0), [series])
  const sessionsScheduled = useMemo(() => series.sessions.reduce((a, b) => a + b.scheduled, 0), [series])

  const proofCount = PROOFS.filter((p) => p.status.includes('Completed') || p.status.includes('Verified') || p.status.includes('Sessions')).length

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Progress & Skill Proof' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Progress"
          title={<>Career readiness, <span className="grad-text">tracked</span></>}
          lede="Readiness is a weighted view of gap closure, logged practice and completed path steps. Switch the window to see how the last week, month or quarter compares."
          className="!max-w-2xl"
        />
        <div className="flex flex-wrap items-center gap-2">
          <ProvenanceTag kind="illustrative" />
          <Tabs value={win} onChange={changeWindow} tabs={WINDOWS} size="sm" />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon="Gauge" label="Overall career readiness" value={<Counter value={derived.readiness} suffix="%" />} sub="Weighted from gap closure, practice and completed steps." tone="teal" delay={0} />
        <KpiCard icon="Clock" label="Practice hours" value={<Counter value={state.student.hoursLearned} decimals={1} suffix=" hrs" />} sub={`${totalActivities} logged blocks in the selected window.`} tone="brand" delay={60} />
        <KpiCard icon="CalendarCheck" label="Sessions" value={<Counter value={state.student.sessions} />} sub={`${sessionsCompleted} completed · ${sessionsScheduled} scheduled in window.`} tone="violet" delay={120} />
        <KpiCard icon="BadgeCheck" label="Skills proof" value={<Counter value={proofCount} />} sub="Verified practice and certificates on file." tone="sky" delay={180} />
      </div>

      {/* skill progress */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="brand" icon="TrendingUp">Skill progress</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Where each gap stands today</h3>
          </div>
          <Button size="sm" variant="ghost" icon="ScanSearch" onClick={() => navigate('/gap-analysis')}>Re-run gap analysis</Button>
        </div>
        <ul className="mt-5 grid gap-6 lg:grid-cols-3">
          {state.skillProgress.map((s) => (
            <li key={s.name} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-bold text-ink-900 dark:text-white">{s.name}</span>
                <span className="tnum text-sm font-extrabold text-brand-600 dark:text-brand-300">{s.value}%</span>
              </div>
              <ProgressBar value={s.value} tone="brand" className="mt-3" target={s.target} />
              <div className="tnum mt-2 flex items-center justify-between text-[11px] font-semibold text-ink-400">
                <span>Target {s.target}%</span>
                <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-300">
                  <Icon name="ArrowUpRight" size={11} /> +{s.delta} pts
                </span>
              </div>
              <Tooltip label={`${s.target - s.value} points still to close against the role benchmark.`}>
                <span className="mt-3 inline-flex cursor-help items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-1 text-[10.5px] font-bold text-ink-500 dark:bg-white/5 dark:text-ink-300">
                  <Icon name="Info" size={10} /> Gap remaining: {s.target - s.value} pts
                </span>
              </Tooltip>
            </li>
          ))}
        </ul>
        <Note className="mt-5">
          Skill levels move when you complete practice activities in this demo. They are seeded values, not measured proficiency.
        </Note>
      </Card>

      {/* charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Weekly learning activity</h3>
              <p className="mt-1 text-xs text-ink-400">Hours logged · <span className="tnum font-semibold text-ink-600 dark:text-ink-200">{totalHours} hrs</span> in window</p>
            </div>
            <Tag tone="brand" icon="Clock">{WINDOWS.find((w) => w.id === win).label}</Tag>
          </div>
          {recomputing ? <Skeleton className="h-[248px] w-full" /> : <ActivityAreaChart data={series.activity} height={248} />}
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Skill improvement</h3>
              <p className="mt-1 text-xs text-ink-400">Before vs. now, per skill</p>
            </div>
            <Tag tone="teal" icon="TrendingUp">+{series.improvement.reduce((a, b) => a + (b.now - b.start), 0)} pts total</Tag>
          </div>
          {recomputing ? <Skeleton className="h-[248px] w-full" /> : <SkillImprovementChart data={series.improvement} height={248} />}
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Career readiness</h3>
              <p className="mt-1 text-xs text-ink-400">Readiness trajectory across the selected window</p>
            </div>
            <Tag tone="violet" icon="Gauge">{derived.readiness}% now</Tag>
          </div>
          {recomputing ? <Skeleton className="h-[248px] w-full" /> : <ReadinessLineChart data={series.readiness} height={248} />}
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Sessions completed</h3>
              <p className="mt-1 text-xs text-ink-400">{sessionsCompleted} completed · {sessionsScheduled} scheduled</p>
            </div>
            <Tag tone="sky" icon="CalendarCheck">Peer sessions</Tag>
          </div>
          {recomputing ? <Skeleton className="h-[248px] w-full" /> : <SessionsChart data={series.sessions} height={248} />}
        </Card>
      </div>

      {/* milestone timeline */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading eyebrow="Milestones" title="Recent progress events" className="!max-w-none" />
          <Button size="sm" variant="ghost" icon="BadgeCheck" onClick={() => navigate('/proof')}>Open skill proof</Button>
        </div>
        <ol className="mt-6 space-y-4">
          {[
            { icon: 'CheckCircle2', tone: 'teal', title: 'Advanced Excel step completed', when: '3 days ago', body: 'Excel Dashboard Challenge logged 3× at an average score of 4.6/5.' },
            { icon: 'Repeat', tone: 'brand', title: 'Exchange session with Aarav Mehta', when: '5 days ago', body: 'Digital marketing audit reviewed; next session focuses on campaign structure.' },
            { icon: 'BadgeCheck', tone: 'violet', title: 'Advanced Excel practice verified', when: '2 weeks ago', body: 'Verified by Priya Shah after a reviewed dashboard deliverable.' },
            { icon: 'Target', tone: 'amberx', title: 'Career goal benchmarked', when: '3 weeks ago', body: 'Investment Banking benchmark loaded: 14 skills, 3 critical gaps identified.' },
            { icon: 'UserRoundPlus', tone: 'sky', title: 'Profile created', when: '4 weeks ago', body: 'Teach list: Financial Analysis. Learn list: Digital Marketing.' },
          ].map((m, i, arr) => (
            <li key={m.title} className="relative flex gap-4 pl-1">
              {i < arr.length - 1 ? <span className="absolute left-[1.02rem] top-9 h-full w-0.5 bg-ink-100 dark:bg-white/10" aria-hidden="true" /> : null}
              <span className={cx('relative grid h-9 w-9 shrink-0 place-items-center rounded-xl', {
                teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
                violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                amberx: 'bg-amberx-500/10 text-amberx-500',
                sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
              }[m.tone])}>
                <Icon name={m.icon} size={16} />
              </span>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{m.title}</p>
                  <span className="text-[11px] font-semibold text-ink-400">{m.when}</span>
                </div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Note className="mt-5">Timeline entries are seeded demo content illustrating how progress history would read in a live product.</Note>
      </Card>

      {/* skill proof preview */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="teal" icon="BadgeCheck">Skill proof</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Your proof record</h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Certificates and verified practice that a recruiter could inspect.</p>
          </div>
          <Button size="sm" variant="primary" iconRight="ArrowRight" onClick={() => navigate('/proof')}>Full proof page</Button>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROOFS.slice(0, 6).map((p) => (
            <li key={p.id} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <div className="flex items-start justify-between gap-2">
                <span className={cx('grid h-9 w-9 place-items-center rounded-xl', {
                  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
                  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                  amberx: 'bg-amberx-500/10 text-amberx-500',
                }[p.tone])}>
                  <Icon name={p.icon} size={16} />
                </span>
                <Tag tone={p.status.includes('In Progress') ? 'amber' : 'teal'}>{p.status}</Tag>
              </div>
              <p className="mt-3 text-[13px] font-bold text-ink-900 dark:text-white">{p.title}</p>
              <p className="mt-1 text-[11px] text-ink-400">{p.detail}</p>
              {p.progress ? <ProgressBar value={p.progress} tone="amberx" className="mt-3" showValue /> : null}
            </li>
          ))}
        </ul>
      </Card>

      {/* how readiness is computed */}
      <Card>
        <SectionHeading eyebrow="Method" title="How career readiness is computed here" lede="Transparent, deterministic and not a black box — so the demo can be explained in one breath." provenance="illustrative" />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {[
            { icon: 'ScanSearch', title: 'Gap closure (60%)', body: 'Average of current ÷ target across the three benchmark gaps for the selected career goal.' },
            { icon: 'Timer', title: 'Practice volume (25%)', body: 'Logged practice hours against a 20-hour quarterly reference. Capped so it cannot be gamed by time alone.' },
            { icon: 'Route', title: 'Path completion (15%)', body: 'Weighted share of learning-path steps marked complete, with in-progress steps counting partially.' },
          ].map((m) => (
            <div key={m.title} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                <Icon name={m.icon} size={16} />
              </span>
              <p className="mt-3 text-[13px] font-bold text-ink-900 dark:text-white">{m.title}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{m.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: PALETTE.teal }}>
            <Icon name="Gauge" size={15} className="text-white" />
          </span>
          <p className="text-[12.5px] text-ink-600 dark:text-ink-200">
            Current demo value: <strong className="tnum font-bold text-ink-900 dark:text-white">{derived.readiness}%</strong> · recomputed live as you complete steps and activities.
          </p>
        </div>
      </Card>
    </div>
  )
}
