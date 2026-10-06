import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, EmptyState, Modal, Note, ProgressBar, ProvenanceTag, SectionHeading,
  Tabs, Tag, cx,
} from '../components/ui/Kit'
import { useApp, useDerived } from '../context/AppContext'
import { ACTIVITIES } from '../data/mockData'

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/* ------------------------------------------------------------------ *
 * 20-minute countdown timer modal
 * ------------------------------------------------------------------ */
function TimerModal({ activity, onClose }) {
  const { state, dispatch, toast } = useApp()
  const [secondsLeft, setSecondsLeft] = useState(activity.duration * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    setSecondsLeft(activity.duration * 60)
    setRunning(false)
    setFinished(false)
  }, [activity])

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setFinished(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  useEffect(() => {
    dispatch({ type: 'SET_ACTIVITY_DRAFT', id: activity.id, patch: { secondsLeft, state: running ? 'running' : finished ? 'finished' : 'paused' } })
  }, [secondsLeft, running, finished, activity.id, dispatch])

  const total = activity.duration * 60
  const elapsedPct = ((total - secondsLeft) / total) * 100
  const alreadyDone = state.completedActivities.filter((a) => a.id === activity.id).length

  const complete = () => {
    dispatch({ type: 'COMPLETE_ACTIVITY', id: activity.id })
    toast({
      title: `${activity.title} completed`,
      body: alreadyDone ? 'Practice hours and streak updated again — this was a repeat rep.' : 'Practice hours, streak and skill progress have been updated across the dashboard.',
      tone: 'teal',
      icon: 'CheckCircle2',
    })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={activity.title}
      subtitle={`${activity.duration}-minute practice rep · ${activity.level}`}
      icon={activity.icon}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="ghost" icon="RotateCcw" onClick={() => { setSecondsLeft(activity.duration * 60); setRunning(false); setFinished(false) }}>
            Reset
          </Button>
          <Button variant="primary" icon="Check" onClick={complete}>
            {finished ? 'Complete activity' : elapsedPct > 0 ? 'Complete early' : 'Mark complete'}
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        {/* timer */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 p-6 text-center text-white">
          <div className="grid-lines absolute inset-0 opacity-25" aria-hidden="true" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">Countdown timer</p>
            <div className="relative mx-auto mt-4 grid h-44 w-44 place-items-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
                <circle cx="60" cy="60" r="52" fill="none" strokeWidth="7" stroke="rgba(255,255,255,.12)" />
                <circle
                  cx="60" cy="60" r="52" fill="none" strokeWidth="7" strokeLinecap="round"
                  stroke="#2DD4BF"
                  strokeDasharray={`${(elapsedPct / 100) * 326.7} 326.7`}
                  style={{ transition: 'stroke-dasharray .5s linear' }}
                />
              </svg>
              <span className="tnum font-display text-4xl font-extrabold tracking-tight" aria-live="polite">{fmt(secondsLeft)}</span>
            </div>
            <p className={cx('mt-3 text-xs font-bold uppercase tracking-wider', running ? 'text-teal-300' : finished ? 'text-amberx-400' : 'text-white/50')}>
              {running ? 'Focus session running' : finished ? 'Time complete — log your work' : 'Paused / ready'}
            </p>

            <div className="mt-5 flex justify-center gap-2">
              <Button
                variant="primary"
                icon={running ? 'Pause' : 'Play'}
                onClick={() => {
                  if (finished) return
                  setRunning((r) => !r)
                }}
                disabled={finished}
              >
                {running ? 'Pause' : 'Start'}
              </Button>
              <Button variant="ghost" icon="RotateCcw" className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-white/25" onClick={() => { setSecondsLeft(activity.duration * 60); setRunning(false); setFinished(false) }}>
                Reset
              </Button>
            </div>

            <div className="mt-4">
              <ProgressBar value={elapsedPct} tone="teal" height="h-1.5" />
              <p className="mt-2 text-[11px] text-white/50">{Math.round(elapsedPct)}% elapsed · {activity.skill}</p>
            </div>

            {alreadyDone ? (
              <p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-[11px] text-white/70">
                Already completed {alreadyDone}× · a repeat rep still adds practice hours.
              </p>
            ) : null}
          </div>
        </div>

        {/* brief */}
        <div>
          <Tag tone="violet" icon="ClipboardList">Activity brief</Tag>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{activity.summary}</p>
          <ol className="mt-4 space-y-2.5">
            {activity.brief.map((b, i) => (
              <li key={b} className="flex items-start gap-3 rounded-xl bg-ink-50 p-3 dark:bg-white/5">
                <span className="tnum grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white text-[11px] font-bold text-brand-600 dark:bg-white/10 dark:text-brand-200">{i + 1}</span>
                <span className="text-[13px] leading-snug text-ink-600 dark:text-ink-200">{b}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-teal-200/60 bg-teal-50/60 p-3.5 dark:border-teal-400/25 dark:bg-teal-500/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Deliverable</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink-700 dark:text-ink-100">{activity.deliverable}</p>
            </div>
            <div className="rounded-2xl border border-brand-200/60 bg-brand-50/60 p-3.5 dark:border-brand-400/25 dark:bg-brand-500/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-200">Unlocks</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink-700 dark:text-ink-100">{activity.completes}</p>
            </div>
          </div>
          <Note className="mt-4">
            The timer runs locally in your browser. Progress is stored in localStorage — nothing is uploaded.
          </Note>
        </div>
      </div>
    </Modal>
  )
}

/* ------------------------------------------------------------------ *
 * Activity card
 * ------------------------------------------------------------------ */
function ActivityCard({ activity, index, onStart }) {
  const { state } = useApp()
  const doneCount = state.completedActivities.filter((a) => a.id === activity.id).length
  const tones = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
    amberx: 'bg-amberx-500/10 text-amberx-500',
    rose: 'bg-rose-500/10 text-rose-500',
  }
  return (
    <li className="card card-hover flex flex-col animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <span className={cx('grid h-11 w-11 place-items-center rounded-xl', tones[activity.tone] || tones.brand)}>
          <Icon name={activity.icon} size={19} />
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <Tag tone="ink" icon="Clock">{activity.duration} min</Tag>
          <Tag tone={activity.level === 'Beginner' ? 'teal' : activity.level === 'Intermediate' ? 'brand' : 'violet'}>{activity.level}</Tag>
        </div>
      </div>

      <h3 className="mt-4 font-display text-base font-bold text-ink-900 dark:text-white">{activity.title}</h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">{activity.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-ink-400">
        <span className="inline-flex items-center gap-1"><Icon name="Sparkles" size={11} className="text-brand-500" /> {activity.skill}</span>
        <span>·</span>
        <span>Unlocks {activity.completes}</span>
      </div>

      {doneCount ? (
        <div className="mt-3 rounded-xl bg-teal-50 px-3 py-2 dark:bg-teal-500/15">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-300">
            <Icon name="CheckCircle2" size={12} /> Completed {doneCount}× · repeat reps still count
          </p>
        </div>
      ) : null}

      <Button variant="primary" className="mt-4 w-full" icon="Play" onClick={() => onStart(activity)}>
        Start Activity
      </Button>
    </li>
  )
}

export default function Practice() {
  const { state } = useApp()
  const derived = useDerived()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [active, setActive] = useState(null)
  const [tab, setTab] = useState('all')

  // deep link: /practice?activity=act-fm
  useEffect(() => {
    const id = params.get('activity')
    if (!id) return
    const act = ACTIVITIES.find((a) => a.id === id)
    if (act) setActive(act)
    setParams({}, { replace: true })
  }, [params, setParams])

  const list = useMemo(() => {
    if (tab === 'all') return ACTIVITIES
    if (tab === 'done') return ACTIVITIES.filter((a) => state.completedActivities.some((c) => c.id === a.id))
    return ACTIVITIES.filter((a) => !state.completedActivities.some((c) => c.id === a.id))
  }, [tab, state.completedActivities])

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Practice Activities' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Practice"
          title={<>20-Minute <span className="grad-text">Skill Activities</span></>}
          lede="Small, time-boxed reps that produce a reviewable deliverable. Each completed activity updates practice hours, streak and skill progress."
          className="!max-w-2xl"
        />
        <ProvenanceTag kind="illustrative" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300"><Icon name="Clock" size={18} /></span>
            <div>
              <p className="tnum font-display text-xl font-extrabold text-ink-900 dark:text-white">
                <Counter value={state.student.hoursLearned} decimals={1} suffix=" hrs" />
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Practice hours</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200"><Icon name="CheckCircle2" size={18} /></span>
            <div>
              <p className="tnum font-display text-xl font-extrabold text-ink-900 dark:text-white">{state.completedActivities.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Activities logged</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amberx-500/10 text-amberx-500"><Icon name="Flame" size={18} /></span>
            <div>
              <p className="tnum font-display text-xl font-extrabold text-ink-900 dark:text-white">{state.student.streakDays} days</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Learning streak</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300"><Icon name="Gauge" size={18} /></span>
            <div>
              <p className="tnum font-display text-xl font-extrabold text-ink-900 dark:text-white">{derived.readiness}%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Career readiness</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="!p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            size="sm"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All activities', icon: 'Layers', count: ACTIVITIES.length },
              { id: 'todo', label: 'Not yet done', icon: 'Circle', count: ACTIVITIES.filter((a) => !state.completedActivities.some((c) => c.id === a.id)).length },
              { id: 'done', label: 'Completed', icon: 'CheckCircle2', count: derived.uniqueActivitiesDone },
            ]}
          />
          <Note className="!mt-0">Timers run in-browser. Pause, reset or let the clock run out — then mark the activity complete.</Note>
        </div>
      </Card>

      {list.length === 0 ? (
        <EmptyState
          icon={tab === 'done' ? 'Timer' : 'CheckCircle2'}
          title={tab === 'done' ? 'No activities completed yet' : 'Every activity is already done'}
          body={tab === 'done' ? 'Start any activity below and let the 20-minute timer run, then mark it complete.' : 'Nice — switch to the Completed tab to see your logged reps.'}
          action={<Button variant="primary" icon="Play" onClick={() => setTab(tab === 'done' ? 'all' : 'done')}>{tab === 'done' ? 'Browse activities' : 'View completed'}</Button>}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} onStart={setActive} />)}
        </ul>
      )}

      <Card>
        <SectionHeading
          eyebrow="Session history"
          title="Your logged practice"
          lede="Every completed activity is recorded here with its duration."
        />
        {state.completedActivities.length === 0 ? (
          <div className="mt-5">
            <EmptyState icon="Clock" title="No practice logged yet" body="Completed activities will be listed here with duration and timestamp." />
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-ink-100 dark:divide-white/10">
            {[...state.completedActivities].reverse().slice(0, 8).map((a, i) => (
              <li key={`${a.id}-${a.at}-${i}`} className="flex flex-wrap items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300">
                  <Icon name="CheckCircle2" size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-ink-800 dark:text-white">{a.title}</span>
                  <span className="block text-[11px] text-ink-400">
                    {new Date(a.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
                <span className="tnum rounded-lg bg-ink-100 px-2.5 py-1 text-[11px] font-bold text-ink-600 dark:bg-white/10 dark:text-ink-200">{a.minutes} min</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="ghost" icon="TrendingUp" onClick={() => navigate('/progress')}>See progress charts</Button>
          <Button variant="ghost" icon="BadgeCheck" onClick={() => navigate('/proof')}>Skill proof</Button>
        </div>
      </Card>

      {active ? <TimerModal activity={active} onClose={() => setActive(null)} /> : null}
    </div>
  )
}
