import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Avatar, Breadcrumbs, Button, Card, Note, ProgressBar, ProvenanceTag, SectionHeading, SkillChip, Tag, cx,
} from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import { DEMO_STUDENT, LEARNING_PATH, PEERS, SKILL_GAP } from '../data/mockData'

/* ---------------- simulated analysis run ---------------- */
function AnalysisRunner() {
  const { toast } = useApp()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('idle') // idle | running | done
  const [stepIndex, setStepIndex] = useState(0)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    setPhase('running')
    setStepIndex(0)
    SKILL_GAP.analysisTrace.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStepIndex(i + 1), 420 * (i + 1)))
    })
    timers.current.push(
      setTimeout(() => {
        setPhase('done')
        toast({
          title: 'Learning path generated',
          body: '7 steps sequenced from your three critical gaps. Simulated in-browser — no live AI service was called.',
          tone: 'teal',
          icon: 'Route',
        })
      }, 420 * SKILL_GAP.analysisTrace.length + 500),
    )
  }

  const progress = (stepIndex / SKILL_GAP.analysisTrace.length) * 100

  if (phase === 'idle') {
    return (
      <Card className="border-brand-200 bg-gradient-to-br from-brand-50 to-white dark:border-brand-400/30 dark:from-brand-500/10 dark:to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lift">
              <Icon name="Wand2" size={19} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Ready to build your learning path</h3>
              <p className="mt-1 max-w-lg text-sm text-ink-500 dark:text-ink-300">
                The engine sequences all three critical gaps into a 12-week plan with practice activities and proof checkpoints.
              </p>
            </div>
          </div>
          <Button variant="primary" icon="Wand2" onClick={run}>Generate Learning Path</Button>
        </div>
      </Card>
    )
  }

  if (phase === 'running') {
    return (
      <Card className="border-brand-200 bg-gradient-to-br from-ink-900 to-brand-900 text-white dark:border-brand-400/30">
        <div className="grid-lines absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/10">
              <Icon name="Brain" size={20} className="text-teal-300" />
              <span className="absolute inset-0 rounded-xl border border-teal-300/40 animate-pulse-ring" />
            </span>
            <div>
              <p className="font-display text-base font-bold">AI is analyzing your career goal…</p>
              <p className="text-xs text-white/60">Simulated in-browser trace · no live model call</p>
            </div>
          </div>
          <ProgressBar value={progress} tone="teal" className="mt-5" />
          <ul className="mt-5 space-y-2 font-mono text-[12px]">
            {SKILL_GAP.analysisTrace.map((line, i) => (
              <li key={line} className={cx('flex items-start gap-2 transition', i < stepIndex ? 'text-white/90' : 'text-white/30')}>
                <Icon name={i < stepIndex ? 'CheckCircle2' : 'Circle'} size={13} className={cx('mt-0.5 shrink-0', i < stepIndex ? 'text-teal-300' : 'text-white/30')} />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-teal-300/60 bg-gradient-to-br from-teal-50 to-white dark:border-teal-400/30 dark:from-teal-500/10 dark:to-transparent">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-500 text-white">
            <Icon name="Route" size={20} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Learning path generated</h3>
              <ProvenanceTag kind="illustrative" />
            </div>
            <p className="mt-1 max-w-xl text-sm text-ink-500 dark:text-ink-300">
              7 steps over 12 weeks, ordered so each one unlocks the next. Financial Modelling and Valuation are scheduled first because
              both are called out as critical in the role benchmark.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" icon="RotateCcw" onClick={() => setPhase('idle')}>Run again</Button>
          <Button variant="primary" size="sm" iconRight="ArrowRight" onClick={() => navigate('/learning-path')}>Open full path</Button>
        </div>
      </div>

      <ol className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_PATH.steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-3 rounded-xl border border-teal-200/60 bg-white/70 p-3 dark:border-teal-400/20 dark:bg-white/5">
            <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-500/15 text-[11px] font-bold text-teal-700 dark:text-teal-300">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-ink-800 dark:text-white">{s.title}</span>
              <span className="block text-[10.5px] text-ink-400">{s.weeks} weeks · {s.hours}</span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

export default function GapAnalysis() {
  const { toast } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const rows = useMemo(
    () => (filter === 'all' ? SKILL_GAP.gapSkills : SKILL_GAP.gapSkills.filter((g) => g.priority.toLowerCase() === filter)),
    [filter],
  )

  const totalGap = SKILL_GAP.gapSkills.reduce((a, g) => a + (g.target - g.current), 0)
  const readiness = Math.round(
    SKILL_GAP.gapSkills.reduce((a, g) => a + (g.current / g.target) * 100, 0) / SKILL_GAP.gapSkills.length,
  )

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Skill Profile', to: '/profile' }, { label: 'AI Skill Gap Analysis' }]} />

      {/* hero */}
      <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 p-6 text-white shadow-card sm:p-8">
        <div className="grid-lines absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-badge bg-white/15 text-white"><Icon name="ScanSearch" size={11} /> AI Skill Gap Analysis</span>
              <span className="label-badge bg-amberx-500/20 text-amberx-400"><Icon name="Sparkles" size={11} /> Simulated demo output</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Your Career Skill Gap</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              Career target: <strong className="font-bold text-white">{SKILL_GAP.career}</strong>. Your current profile is compared against
              the illustrative benchmark for this role and the three largest gaps are ranked by interview impact.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SKILL_GAP.gapSkills.map((g) => (
                <span key={g.name} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold">
                  <Icon name="AlertTriangle" size={11} className="text-amberx-400" /> {g.name}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Readiness', value: `${readiness}%`, hint: 'Avg. of current ÷ target across gaps' },
              { label: 'Gap points', value: `+${totalGap}`, hint: 'Sum of points still to close' },
              { label: 'Critical', value: `${SKILL_GAP.gapSkills.filter((g) => g.priority === 'Critical').length}`, hint: 'Ranked critical for entry roles' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
                <p className="tnum font-display text-2xl font-extrabold">{s.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/60">{s.label}</p>
                <p className="mt-1.5 text-[10px] leading-snug text-white/45">{s.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* current vs required */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Tag tone="teal" icon="CheckCircle2">Current skills</Tag>
            <span className="text-[11px] font-semibold text-ink-400">{SKILL_GAP.currentSkills.length} validated</span>
          </div>
          <ul className="mt-5 space-y-4">
            {SKILL_GAP.currentSkills.map((s) => (
              <li key={s.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-bold text-ink-800 dark:text-white">{s.name}</span>
                  <span className="tnum text-xs font-bold text-teal-600 dark:text-teal-300">{s.level}%</span>
                </div>
                <ProgressBar value={s.level} tone="teal" className="mt-1.5" />
                <p className="mt-1.5 text-[11px] text-ink-400">{s.note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4 dark:border-white/10">
            {DEMO_STUDENT.teach.map((t) => <SkillChip key={t} tone="teal" icon="Presentation">{t}</SkillChip>)}
            <SkillChip tone="default" icon="Table2">Excel</SkillChip>
            <SkillChip tone="default" icon="Briefcase">Business Analysis</SkillChip>
          </div>
          <Note className="mt-4">Levels are seeded demo values in this prototype. In a live product they would be derived from verified activity and peer review.</Note>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tag tone="rose" icon="Target">Required skills · {SKILL_GAP.career}</Tag>
            <div className="flex gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'critical', label: 'Critical' },
                { id: 'high', label: 'High' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cx('chip', filter === f.id && 'chip-active')}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {rows.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400 dark:border-white/15">
              No gaps in this priority band — switch the filter to see all three.
            </p>
          ) : (
            <ul className="mt-5 space-y-6">
              {rows.map((g) => (
                <li key={g.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-bold text-ink-900 dark:text-white">{g.name}</span>
                    <span className={cx('label-badge', g.priority === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300' : 'bg-amberx-500/10 text-amberx-500')}>
                      {g.priority}
                    </span>
                  </div>
                  <div className="relative mt-2.5">
                    <ProgressBar value={g.target} tone="ink" height="h-3" className="opacity-25" />
                    <div className="absolute inset-0">
                      <ProgressBar value={g.current} tone={g.priority === 'Critical' ? 'rose' : 'amberx'} height="h-3" />
                    </div>
                    <span
                      className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-ink-900 dark:bg-white"
                      style={{ left: `${g.target}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="tnum mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold">
                    <span className="text-ink-400">Current: <strong className="text-ink-700 dark:text-white">{g.current}%</strong></span>
                    <span className="text-ink-400">Target: <strong className="text-teal-600 dark:text-teal-300">{g.target}%</strong></span>
                    <span className="text-ink-400">Gap: <strong className="text-rose-500">+{g.target - g.current} pts</strong></span>
                    <span className="text-ink-400">Est. <strong className="text-ink-700 dark:text-white">{g.weeks} weeks</strong></span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{g.why}</p>
                </li>
              ))}
            </ul>
          )}
          <Note className="mt-6">{SKILL_GAP.benchmarkNote}</Note>
        </Card>
      </div>

      {/* generator */}
      <AnalysisRunner />

      {/* peer recommendations tied to gaps */}
      <Card>
        <SectionHeading
          eyebrow="Recommended peers"
          title="Who can close these gaps?"
          lede="Ranked by overlap between their teach list and your three critical gaps."
          provenance="illustrative"
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...PEERS]
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3)
            .map((p) => {
              const overlap = p.teach.filter((t) => SKILL_GAP.gapSkills.some((g) => g.name === t))
              return (
                <li key={p.id} className="rounded-2xl border border-ink-100 p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar initials={p.initials} tone={p.avatarTone} size={42} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{p.name}</p>
                      <p className="truncate text-[11px] text-ink-400">{p.careerGoal}</p>
                    </div>
                    <span className="tnum rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">{p.matchScore}%</span>
                  </div>
                  <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <Icon name="Presentation" size={12} className="text-teal-500" />
                    {overlap.length ? (
                      <>Closes <strong className="font-bold text-ink-700 dark:text-white">{overlap.join(', ')}</strong></>
                    ) : (
                      <>Teaches {p.teach[0]} — adjacent to your goal</>
                    )}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => navigate(`/peer/${p.id}`)}>View profile</Button>
                    <Button
                      size="sm"
                      variant="soft"
                      icon="UserPlus"
                      onClick={() => toast({ title: 'Connection request simulated successfully.', body: `${p.name} would receive a request from Sakshi.`, tone: 'teal' })}
                    >
                      Connect
                    </Button>
                  </div>
                </li>
              )
            })}
        </ul>
      </Card>
    </div>
  )
}
