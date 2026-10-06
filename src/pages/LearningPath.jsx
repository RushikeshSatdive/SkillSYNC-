import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Modal, Note, ProgressBar, ProvenanceTag, SectionHeading, Tabs, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { useApp, useDerived } from '../context/AppContext'
import { ACTIVITIES, PEERS } from '../data/mockData'

const STATUS_META = {
  completed: { label: 'Completed', tone: 'teal', icon: 'CheckCircle2' },
  'in-progress': { label: 'In progress', tone: 'brand', icon: 'Timer' },
  'not-started': { label: 'Not started', tone: 'ink', icon: 'Circle' },
}

function StepCard({ step, index, total, status, progress, onStatus, onOpenActivity }) {
  const meta = STATUS_META[status] || STATUS_META['not-started']
  const isLast = index === total - 1

  return (
    <li className="relative pl-12 sm:pl-16">
      {/* rail */}
      {!isLast ? (
        <span className={cx('absolute left-[1.30rem] top-12 h-[calc(100%-1rem)] w-0.5 sm:left-[1.80rem]', status === 'completed' ? 'bg-teal-300 dark:bg-teal-500/40' : 'bg-ink-200 dark:bg-white/10')} aria-hidden="true" />
      ) : null}
      <span
        className={cx(
          'absolute left-0 top-1 grid h-11 w-11 place-items-center rounded-2xl font-display text-sm font-extrabold sm:h-14 sm:w-14 sm:text-base',
          status === 'completed'
            ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-soft'
            : status === 'in-progress'
            ? 'bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lift'
            : 'border border-ink-200 bg-white text-ink-400 dark:border-white/15 dark:bg-ink-900 dark:text-ink-300',
        )}
        aria-hidden="true"
      >
        {status === 'completed' ? <Icon name="Check" size={20} /> : index + 1}
      </span>

      <Card className="mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={meta.tone} icon={meta.icon}>{meta.label}</Tag>
              <span className="text-[11px] font-semibold text-ink-400">Step {index + 1} of {total}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">{step.title}</h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500 dark:text-ink-300">{step.outcome}</p>
          </div>
          <div className="tnum shrink-0 rounded-2xl bg-ink-50 px-3.5 py-2.5 text-center dark:bg-white/5">
            <p className="font-display text-xl font-extrabold text-ink-900 dark:text-white">{progress}%</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">done</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Estimated time', value: `${step.weeks} weeks · ${step.hours}`, icon: 'Clock' },
            { label: 'Practice activity', value: step.practice, icon: 'Timer' },
            { label: 'Milestone', value: step.milestone, icon: 'Trophy' },
          ].map((d) => (
            <div key={d.label} className="rounded-2xl bg-ink-50 p-3.5 dark:bg-white/5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-400">
                <Icon name={d.icon} size={11} /> {d.label}
              </p>
              <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-ink-700 dark:text-ink-100">{d.value}</p>
            </div>
          ))}
        </div>

        <ProgressBar value={progress} tone={status === 'completed' ? 'teal' : 'brand'} className="mt-5" label="Step progress" showValue />

        <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4 dark:border-white/10">
          {status === 'not-started' ? (
            <Button size="sm" variant="primary" icon="Play" onClick={() => onStatus('in-progress')}>Start step</Button>
          ) : null}
          {status === 'in-progress' ? (
            <>
              <Button size="sm" variant="primary" icon="Check" onClick={() => onStatus('completed')}>Mark Complete</Button>
              <Tooltip label="Log another practice block and add 20% to this step">
                <Button size="sm" variant="ghost" icon="Plus" onClick={() => onStatus('in-progress', Math.min(95, progress + 20))}>Log practice</Button>
              </Tooltip>
            </>
          ) : null}
          {status === 'completed' ? (
            <>
              <Button size="sm" variant="soft" icon="CheckCircle2" disabled>Completed</Button>
              <Button size="sm" variant="ghost" icon="RotateCcw" onClick={() => onStatus('in-progress', 60)}>Reopen step</Button>
            </>
          ) : null}
          <Button size="sm" variant="ghost" icon="Timer" onClick={onOpenActivity}>Start {step.practice}</Button>
        </div>
      </Card>
    </li>
  )
}

export default function LearningPath() {
  const { state, dispatch, toast } = useApp()
  const derived = useDerived()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [activityModal, setActivityModal] = useState(null)

  const steps = derived.steps
  const filtered = useMemo(() => {
    if (tab === 'all') return steps
    return steps.filter((s) => state.pathStatus[s.id] === tab)
  }, [tab, steps, state.pathStatus])

  const counts = {
    completed: steps.filter((s) => state.pathStatus[s.id] === 'completed').length,
    'in-progress': steps.filter((s) => state.pathStatus[s.id] === 'in-progress').length,
    'not-started': steps.filter((s) => state.pathStatus[s.id] === 'not-started').length,
  }

  const setStatus = (id, status, progress) => {
    dispatch({ type: 'SET_PATH_STEP', id, status, progress })
    const step = steps.find((s) => s.id === id)
    if (status === 'completed') {
      toast({
        title: `${step.title} complete`,
        body: 'Career readiness and step progress have been updated across the dashboard.',
        tone: 'teal',
        icon: 'CheckCircle2',
      })
    } else if (status === 'in-progress') {
      toast({ title: `${step.title} in progress`, tone: 'brand', icon: 'Play' })
    }
  }

  const nextIncomplete = steps.find((s) => state.pathStatus[s.id] !== 'completed')
  const totalHours = steps.reduce((acc, s) => acc + parseFloat(s.hours), 0)

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'AI Skill Gap Analysis', to: '/gap-analysis' }, { label: 'Learning Path' }]} />

      {/* header */}
      <Card className="relative overflow-hidden">
        <div className="mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="brand" icon="Route">Learning path</Tag>
              <ProvenanceTag kind="illustrative" />
            </div>
            <h1 className="mt-3 font-display text-2xl font-extrabold text-ink-900 dark:text-white sm:text-3xl">
              12 weeks to <span className="grad-text">{state.student.careerGoal}</span> readiness
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500 dark:text-ink-300">
              A seven-step sequence built from your three critical gaps. Mark steps complete or log practice and every progress number in the
              app updates with it.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="primary" icon="Timer" onClick={() => navigate('/practice')}>
                Open 20-minute activities
              </Button>
              <Button variant="ghost" icon="Sparkles" onClick={() => navigate('/matching')}>
                Find a peer for step {nextIncomplete ? steps.indexOf(nextIncomplete) + 1 : 7}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Path progress', value: <Counter value={derived.pathPercent} suffix="%" />, tone: 'brand' },
              { label: 'Steps done', value: <>{derived.completedSteps}<span className="text-lg text-ink-400">/{steps.length}</span></>, tone: 'teal' },
              { label: 'Planned hours', value: <Counter value={totalHours} suffix=" hrs" />, tone: 'violet' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink-100 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="tnum font-display text-xl font-extrabold text-ink-900 dark:text-white sm:text-2xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { id: 'completed', label: 'Completed', icon: 'CheckCircle2', tone: 'teal', value: counts.completed },
          { id: 'in-progress', label: 'In progress', icon: 'Timer', tone: 'brand', value: counts['in-progress'] },
          { id: 'not-started', label: 'Not started', icon: 'Circle', tone: 'ink', value: counts['not-started'] },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setTab(tab === s.id ? 'all' : s.id)}
            className={cx('card card-hover flex items-center gap-4 p-4 text-left', tab === s.id && 'border-brand-300 dark:border-brand-400/40')}
          >
            <span className={cx('grid h-11 w-11 place-items-center rounded-xl', {
              teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
              brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
              ink: 'bg-ink-100 text-ink-400 dark:bg-white/10 dark:text-ink-300',
            }[s.tone])}>
              <Icon name={s.icon} size={19} />
            </span>
            <span>
              <span className="tnum block font-display text-xl font-extrabold text-ink-900 dark:text-white">{s.value}</span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-400">{s.label}</span>
            </span>
            <Icon name={tab === s.id ? 'ChevronUp' : 'Filter'} size={15} className="ml-auto text-ink-300" />
          </button>
        ))}
      </div>

      <Card className="!p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            size="sm"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'All steps', icon: 'Layers', count: steps.length },
              { id: 'in-progress', label: 'In progress', icon: 'Timer', count: counts['in-progress'] },
              { id: 'not-started', label: 'Not started', icon: 'Circle', count: counts['not-started'] },
              { id: 'completed', label: 'Completed', icon: 'CheckCircle2', count: counts.completed },
            ]}
          />
          <Note className="!mt-0">Filter the sequence, or mark a step complete to see progress flow into the dashboard.</Note>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <Icon name="Route" size={22} className="mx-auto mb-3 text-ink-300" />
            <p className="font-display text-base font-bold text-ink-800 dark:text-white">Nothing in this status yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-400">
              Switch back to <button type="button" className="font-bold text-brand-600 underline decoration-dotted dark:text-brand-300" onClick={() => setTab('all')}>all steps</button> to mark one complete.
            </p>
          </div>
        </Card>
      ) : (
        <ol>
          {filtered.map((s) => (
            <StepCard
              key={s.id}
              step={s}
              index={steps.indexOf(s)}
              total={steps.length}
              status={state.pathStatus[s.id]}
              progress={state.pathProgress[s.id] || 0}
              onStatus={(status, progress) => setStatus(s.id, status, progress)}
              onOpenActivity={() => setActivityModal(s)}
            />
          ))}
        </ol>
      )}

      <Card>
        <SectionHeading
          eyebrow="What happens next"
          title="Peers and activities attached to this path"
          lede="Each step pairs with a 20-minute activity and a recommended peer whose teach list covers that step."
          provenance="illustrative"
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="label">Recommended peers</p>
            <ul className="space-y-2.5">
              {PEERS.filter((p) => p.matchScore >= 86).slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 p-3.5 dark:border-white/10">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                    <Icon name="Users" size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-ink-800 dark:text-white">{p.name}</span>
                    <span className="block truncate text-[11px] text-ink-400">Covers {p.teach.slice(0, 2).join(', ')}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/peer/${p.id}`)}>View</Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">20-minute activities</p>
            <ul className="space-y-2.5">
              {ACTIVITIES.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 p-3.5 dark:border-white/10">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300">
                    <Icon name={a.icon} size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-ink-800 dark:text-white">{a.title}</span>
                    <span className="block truncate text-[11px] text-ink-400">{a.duration} min · {a.level}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/practice')}>Start</Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Modal
        open={!!activityModal}
        onClose={() => setActivityModal(null)}
        title={activityModal ? `Start ${activityModal.practice}` : ''}
        subtitle="A 20-minute practice rep attached to this learning-path step."
        icon="Timer"
        footer={
          <>
            <Button variant="ghost" onClick={() => setActivityModal(null)}>Close</Button>
            <Button
              variant="primary"
              icon="Play"
              onClick={() => {
                const act = ACTIVITIES.find((a) => a.title === activityModal?.practice)
                setActivityModal(null)
                navigate(act ? `/practice?activity=${act.id}` : '/practice')
              }}
            >
              Open activity
            </Button>
          </>
        }
      >
        {activityModal ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Unlocks</p>
                <p className="mt-1.5 text-sm font-semibold text-ink-800 dark:text-white">{activityModal.title}</p>
              </div>
              <div className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Milestone</p>
                <p className="mt-1.5 text-sm font-semibold text-ink-800 dark:text-white">{activityModal.milestone}</p>
              </div>
            </div>
            <Note>
              Completing the activity from the practice page adds practice hours, bumps the streak and moves this step&apos;s progress bar.
            </Note>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
