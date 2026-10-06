import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Avatar, Breadcrumbs, Button, Card, EmptyState, Modal, Note, ProgressBar, ProvenanceTag, RatingStars,
  SkillChip, Tag, Tabs, Tooltip, } from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import { AVAILABILITY_OPTIONS, CAREER_GOALS, DEMO_STUDENT, LEARNING_PREFERENCES, PEERS, SKILLS, SKILL_LEVELS } from '../data/mockData'

function SkillPicker({ open, onClose, kind }) {
  const { state, dispatch, toast } = useApp()
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('Intermediate')

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const taken = new Set([...state.student.teach, ...state.student.learn])
    return SKILLS.filter((s) => !taken.has(s)).filter((s) => !term || s.toLowerCase().includes(term))
  }, [q, state.student.teach, state.student.learn])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={kind === 'teach' ? 'Add a skill you can teach' : 'Add a skill you want to learn'}
      subtitle="Skills are matched against the SkillSync taxonomy so peer matching stays precise."
      icon={kind === 'teach' ? 'Presentation' : 'BookOpenCheck'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Done</Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills…" aria-label="Search skills" className="input pl-9" data-autofocus />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Skill level" className="input sm:w-44">
          {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="mt-4 max-h-72 overflow-y-auto pr-1">
        {list.length === 0 ? (
          <EmptyState icon="Search" title="No matching skills" body="Everything in the taxonomy is already on your lists, or nothing matches your search." />
        ) : (
          <ul className="flex flex-wrap gap-2">
            {list.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'ADD_SKILL', kind, skill: s, level })
                    toast({
                      title: `${s} added to ${kind === 'teach' ? 'your teach list' : 'your learn list'}`,
                      body: kind === 'teach' ? `Peers who want ${s} will now see you in matching.` : `Skill-gap analysis will factor ${s} into your next run.`,
                      tone: kind === 'teach' ? 'teal' : 'brand',
                      icon: kind === 'teach' ? 'Presentation' : 'BookOpenCheck',
                    })
                  }}
                  className="chip hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/10"
                >
                  <Icon name="Plus" size={12} /> {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Note className="mt-4">Adding a skill here is a local demo action — nothing is sent anywhere.</Note>
    </Modal>
  )
}

function ProfileStrength() {
  const { state } = useApp()
  const items = [
    { label: 'Career goal set', done: true },
    { label: 'At least one teach skill', done: state.student.teach.length > 0 },
    { label: 'At least one learn skill', done: state.student.learn.length > 0 },
    { label: 'Availability window', done: true },
    { label: 'Learning preference', done: true },
    { label: 'Linked a completed activity', done: state.completedActivities.length > 0 },
  ]
  const done = items.filter((i) => i.done).length
  const pct = Math.round((done / items.length) * 100)
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Profile strength</h3>
        <span className="tnum font-display text-lg font-extrabold text-brand-600 dark:text-brand-300">{pct}%</span>
      </div>
      <ProgressBar value={pct} className="mt-3" />
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2 text-[13px]">
            <Icon name={i.done ? 'CheckCircle2' : 'Circle'} size={14} className={i.done ? 'text-teal-500' : 'text-ink-300'} />
            <span className={i.done ? 'text-ink-600 dark:text-ink-200' : 'text-ink-400'}>{i.label}</span>
          </li>
        ))}
      </ul>
      <Note className="mt-4">Stronger profiles surface in more peer match lists. This is a demo heuristic, not a ranking guarantee.</Note>
    </Card>
  )
}

export default function SkillProfile() {
  const { state, dispatch, toast } = useApp()
  const navigate = useNavigate()
  const [picker, setPicker] = useState(null)
  const [tab, setTab] = useState('teach')

  const complementary = useMemo(
    () => PEERS.filter((p) => p.teach.some((t) => state.student.learn.includes(t)) || state.student.teach.some((t) => p.learn.includes(t))),
    [state.student.learn, state.student.teach],
  )

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Skill Profile' }]} />

      {/* identity card */}
      <Card className="relative overflow-hidden">
        <div className="mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar initials="SJ" size={68} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">{DEMO_STUDENT.name}</h2>
                <Tag tone="teal" icon="ShieldCheck">Demo profile</Tag>
              </div>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{DEMO_STUDENT.year} · {DEMO_STUDENT.campus}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-ink-300">{DEMO_STUDENT.headline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-500 dark:text-ink-300">
                <span className="inline-flex items-center gap-1.5"><Icon name="Star" size={13} className="fill-amberx-400 text-amberx-400" /> {DEMO_STUDENT.rating} rating</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="Repeat" size={13} className="text-brand-500" /> {DEMO_STUDENT.exchanges} exchanges</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="CalendarCheck" size={13} className="text-teal-500" /> {state.student.sessions} sessions</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="Clock" size={13} className="text-violet-500" /> {state.student.hoursLearned} hrs learned</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" icon="Sparkles" onClick={() => navigate('/matching')}>Find matches</Button>
            <Button size="sm" variant="primary" icon="ScanSearch" onClick={() => navigate('/gap-analysis')}>Run gap analysis</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* skills */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: 'teach', label: 'I can teach', icon: 'Presentation', count: state.student.teach.length },
                { id: 'learn', label: 'I want to learn', icon: 'BookOpenCheck', count: state.student.learn.length },
              ]}
            />
            <Button size="sm" variant="soft" icon="Plus" onClick={() => setPicker(tab)}>
              Add {tab === 'teach' ? 'teach' : 'learn'} skill
            </Button>
          </div>

          <div className="mt-5">
            {tab === 'teach' ? (
              state.student.teach.length === 0 ? (
                <EmptyState icon="Presentation" title="No teach skills yet" body="Add something you can explain well — even a single formula, tool or framework is teachable." action={<Button size="sm" variant="primary" icon="Plus" onClick={() => setPicker('teach')}>Add a skill</Button>} />
              ) : (
                <ul className="space-y-3">
                  {state.student.teach.map((s) => {
                    const detail = DEMO_STUDENT.teachDetail.find((d) => d.name === s)
                    return (
                      <li key={s} className="flex flex-wrap items-center gap-3 rounded-2xl border border-teal-200/60 bg-teal-50/50 p-4 dark:border-teal-400/25 dark:bg-teal-500/10">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-teal-600 dark:bg-white/10 dark:text-teal-300"><Icon name="Presentation" size={18} /></span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-ink-900 dark:text-white">{s}</p>
                          <p className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-300">
                            {detail ? `${detail.level} · ${detail.sessions} teaching sessions delivered` : 'Level set on add · no sessions delivered yet'}
                          </p>
                        </div>
                        <Tooltip label="Remove from teach list">
                          <Button size="sm" variant="plain" icon="Trash2" aria-label={`Remove ${s}`} onClick={() => { dispatch({ type: 'REMOVE_SKILL', kind: 'teach', skill: s }); toast({ title: `${s} removed from teach list`, tone: 'amber', icon: 'Trash2' }) }} />
                        </Tooltip>
                      </li>
                    )
                  })}
                </ul>
              )
            ) : (
              state.student.learn.length === 0 ? (
                <EmptyState icon="BookOpenCheck" title="No learning goals yet" body="Add skills you want to learn — this drives both gap analysis and peer matching." action={<Button size="sm" variant="primary" icon="Plus" onClick={() => setPicker('learn')}>Add a skill</Button>} />
              ) : (
                <ul className="space-y-3">
                  {state.student.learn.map((s) => {
                    const detail = DEMO_STUDENT.learnDetail.find((d) => d.name === s)
                    return (
                      <li key={s} className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-200/60 bg-brand-50/50 p-4 dark:border-brand-400/25 dark:bg-brand-500/10">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 dark:bg-white/10 dark:text-brand-200"><Icon name="BookOpenCheck" size={18} /></span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-ink-900 dark:text-white">{s}</p>
                          <p className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-300">
                            {detail ? `${detail.level} → ${detail.target} target` : 'Beginner → Intermediate target'}
                          </p>
                        </div>
                        <Tooltip label="Remove from learn list">
                          <Button size="sm" variant="plain" icon="Trash2" aria-label={`Remove ${s}`} onClick={() => { dispatch({ type: 'REMOVE_SKILL', kind: 'learn', skill: s }); toast({ title: `${s} removed from learn list`, tone: 'amber', icon: 'Trash2' }) }} />
                        </Tooltip>
                      </li>
                    )
                  })}
                </ul>
              )
            )}
          </div>

          <Note className="mt-5">
            Skills on your teach list are the ones peers can book sessions for. Skills on your learn list are what the matching engine
            looks to find a teacher for.
          </Note>
        </Card>

        <div className="space-y-4">
          <ProfileStrength />

          <Card>
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Career goal</h3>
            <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">One goal at a time keeps recommendations precise.</p>
            <label htmlFor="career-goal" className="label mt-4">Selected goal</label>
            <select
              id="career-goal"
              value={state.student.careerGoal}
              onChange={(e) => {
                dispatch({ type: 'SET_CAREER_GOAL', goal: e.target.value })
                toast({ title: 'Career goal updated', body: `Recommendations are now benchmarked against ${e.target.value}.`, tone: 'brand', icon: 'Target' })
              }}
              className="input"
            >
              {CAREER_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="mt-4 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <ProvenanceTag kind="illustrative" />
                <span className="text-[11px] font-semibold text-ink-400">Benchmark</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">
                {state.student.careerGoal} currently maps to 14 role skills, of which 3 are critical for entry-level hiring.
              </p>
              <Button size="sm" variant="ghost" className="mt-3" icon="ScanSearch" onClick={() => navigate('/gap-analysis')}>See the gap</Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Availability & style</h3>
            <div className="mt-4 space-y-3">
              <div>
                <p className="label">When you can meet</p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <SkillChip key={a} tone={a === 'Evenings' ? 'teal' : 'default'} icon={a === 'Evenings' ? 'Check' : undefined}>{a}</SkillChip>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">Preferred learning style</p>
                <div className="flex flex-wrap gap-2">
                  {LEARNING_PREFERENCES.map((p) => (
                    <SkillChip key={p} tone={p === 'Hands-on' ? 'learn' : 'default'} icon={p === 'Hands-on' ? 'Check' : undefined}>{p}</SkillChip>
                  ))}
                </div>
              </div>
            </div>
            <Note className="mt-4">Selected preferences are shown in teal/indigo. Availability and preference both feed the match score.</Note>
          </Card>
        </div>
      </div>

      {/* complementary peers */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="violet" icon="Repeat">Complementary peers</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Who needs what you teach?</h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
              Peers whose teach list covers your learn list, or who want to learn what you can teach.
            </p>
          </div>
          <Button size="sm" variant="ghost" iconRight="ArrowRight" onClick={() => navigate('/matching')}>Open matching</Button>
        </div>

        {complementary.length === 0 ? (
          <div className="mt-5">
            <EmptyState icon="Users" title="No complementary peers yet" body="Add a skill to learn or teach and matching will surface peers who swap it with you." />
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {complementary.slice(0, 6).map((p) => (
              <li key={p.id} className="rounded-2xl border border-ink-100 p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft dark:border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar initials={p.initials} tone={p.avatarTone} size={42} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{p.name}</p>
                    <RatingStars value={p.rating} size={12} />
                  </div>
                  <span className="tnum rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">{p.matchScore}%</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <p className="flex items-center gap-1.5 text-[11px] text-ink-500 dark:text-ink-300">
                    <Icon name="Presentation" size={12} className="text-teal-500" /> Teaches {p.teach.slice(0, 2).join(', ')}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-ink-500 dark:text-ink-300">
                    <Icon name="BookOpenCheck" size={12} className="text-brand-500" /> Wants {p.learn.join(', ')}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="mt-3 w-full" iconRight="ArrowRight" onClick={() => navigate(`/peer/${p.id}`)}>View profile</Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <SkillPicker open={!!picker} onClose={() => setPicker(null)} kind={picker || 'teach'} />
    </div>
  )
}
