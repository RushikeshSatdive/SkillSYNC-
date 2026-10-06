import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Avatar, Breadcrumbs, Button, Card, EmptyState, Modal, Note, ProgressBar, ProvenanceTag, RatingStars,
  SectionHeading, SkillChip, Tag, cx,
} from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import { ACTIVITIES, PEERS } from '../data/mockData'

const SLOTS = ['Weekdays 7 PM – 9 PM', 'Weekends 10 AM – 1 PM', 'Weekends 3 PM – 6 PM', 'Flexible']
const FORMATS = ['1:1 exchange (60 min)', 'Pair practice (30 min)', 'Deliverable review (45 min)', 'Group of 3 (90 min)']

function SetupModal({ peer, open, onClose }) {
  const { dispatch, toast, state } = useApp()
  const [format, setFormat] = useState(FORMATS[0])
  const [slot, setSlot] = useState(SLOTS[0])
  const [focus, setFocus] = useState('')
  const [busy, setBusy] = useState(false)

  if (!peer) return null

  const submit = () => {
    setBusy(true)
    setTimeout(() => {
      dispatch({ type: 'REQUEST_SESSION', peerId: peer.id, activity: `${format} · ${state.student.teach[0]} ⇄ ${peer.teach[0]}`, when: slot })
      setBusy(false)
      onClose()
      toast({
        title: 'Exchange session setup simulated',
        body: `${peer.name} would receive: teach ${peer.teach[0]}, learn ${state.student.teach[0]}, ${slot}. No messaging backend exists in this prototype.`,
        tone: 'teal',
        icon: 'Repeat',
      })
    }, 700)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Set up your exchange with ${peer.name}`}
      subtitle="Simulated session setup — no invite, email or message is actually sent."
      icon="Repeat"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" icon={busy ? 'RefreshCw' : 'Check'} onClick={submit} disabled={busy}>
            {busy ? 'Setting up…' : 'Confirm exchange'}
          </Button>
        </>
      }
    >
      <div className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">The swap</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-xl bg-teal-50 p-3 dark:bg-teal-500/15">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">You teach</p>
            <p className="mt-1 text-sm font-bold text-ink-900 dark:text-white">{state.student.teach[0]}</p>
          </div>
          <Icon name="ArrowLeftRight" size={18} className="mx-auto text-brand-500" />
          <div className="rounded-xl bg-brand-50 p-3 dark:bg-brand-500/15">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-200">{peer.name.split(' ')[0]} teaches</p>
            <p className="mt-1 text-sm font-bold text-ink-900 dark:text-white">{peer.teach[0]}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="x-format" className="label">Session format</label>
          <select id="x-format" value={format} onChange={(e) => setFormat(e.target.value)} className="input" data-autofocus>
            {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="x-slot" className="label">Preferred slot</label>
          <select id="x-slot" value={slot} onChange={(e) => setSlot(e.target.value)} className="input">
            {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="x-focus" className="label">First-session focus (optional)</label>
        <textarea
          id="x-focus"
          rows={3}
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="e.g. Session 1: Aarav audits my Excel model; I structure his first DCF."
          className="input resize-none"
        />
      </div>

      <Note className="mt-4">
        Both sides log the session when it finishes. Logged sessions accrue to skill proof for the teacher and to practice hours for the learner.
      </Note>
    </Modal>
  )
}

export default function Exchange() {
  const { state, toast } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState('aarav')
  const [modalOpen, setModalOpen] = useState(false)

  const partners = useMemo(
    () =>
      [...PEERS].sort((a, b) => {
        const scoreA = (state.student.learn.some((l) => a.teach.includes(l)) ? 20 : 0) + a.matchScore
        const scoreB = (state.student.learn.some((l) => b.teach.includes(l)) ? 20 : 0) + b.matchScore
        return scoreB - scoreA
      }),
    [state.student.learn],
  )
  const peer = partners.find((p) => p.id === selected) || partners[0]
  const requests = state.sessionRequests

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Skill Exchange' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Skill exchange"
          title={<>Teach one thing. <span className="grad-text">Learn one thing.</span></>}
          lede="SkillSync pairs a skill you can teach with a skill you want to learn, and finds a peer on the other side of exactly that swap."
          className="!max-w-2xl"
        />
        <ProvenanceTag kind="illustrative" />
      </div>

      {/* the swap */}
      <Card className="relative overflow-hidden">
        <div className="mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="rounded-3xl border border-teal-200/70 bg-white/80 p-5 dark:border-teal-400/25 dark:bg-ink-900/70">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500 text-white"><Icon name="Presentation" size={17} /></span>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">I Teach</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {state.student.teach.length ? state.student.teach.map((t) => <SkillChip key={t} tone="teach" icon="Check">{t}</SkillChip>) : <span className="text-sm text-ink-400">No teach skills yet</span>}
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">
              You can explain this well enough to teach it. Peers book sessions against this skill.
            </p>
          </div>

          <div className="relative flex flex-col items-center gap-2 px-2 py-2">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400 lg:block">Exchange</span>
            <div className="relative flex h-14 w-14 items-center justify-center">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 opacity-90" />
              <Icon name="ArrowLeftRight" size={22} className="relative text-white" />
              <span className="absolute inset-0 rounded-2xl border border-brand-400/50 animate-pulse-ring" />
            </div>
            <svg viewBox="0 0 120 40" className="h-8 w-28" aria-hidden="true">
              <path d="M4 28 C 34 4, 86 4, 116 28" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="5 6" className="animate-dash" />
              <path d="M4 12 C 34 36, 86 36, 116 12" fill="none" stroke="#14B8A6" strokeWidth="2" strokeDasharray="5 6" className="animate-dash" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Two-way</span>
          </div>

          <div className="rounded-3xl border border-brand-200/70 bg-white/80 p-5 dark:border-brand-400/25 dark:bg-ink-900/70">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white"><Icon name="BookOpenCheck" size={17} /></span>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-200">I Want to Learn</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {state.student.learn.length ? state.student.learn.map((l) => <SkillChip key={l} tone="learn" icon="Target">{l}</SkillChip>) : <span className="text-sm text-ink-400">No learning goals yet</span>}
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">
              Your target skill. Matching looks for the peer who already does this and wants your teach skill back.
            </p>
          </div>
        </div>

        {/* featured partner */}
        <div className="relative mt-6 rounded-3xl border border-ink-100 bg-white p-5 dark:border-white/10 dark:bg-ink-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar initials={peer.initials} tone={peer.avatarTone} size={56} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg font-extrabold text-ink-900 dark:text-white">{peer.name}</p>
                  <Tag tone="violet" icon="Sparkles">{peer.matchScore}% {peer.scoreLabel}</Tag>
                </div>
                <p className="mt-1 text-xs text-ink-400">{peer.campus} · {peer.availability} {peer.availabilitySlots}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-ink-500 dark:text-ink-300">
                  <RatingStars value={peer.rating} size={12} />
                  <span className="inline-flex items-center gap-1"><Icon name="Repeat" size={11} className="text-teal-500" /> {peer.exchanges} exchanges</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" icon="UserRoundPlus" onClick={() => navigate(`/peer/${peer.id}`)}>View Profile</Button>
              <Button variant="primary" icon="Repeat" onClick={() => setModalOpen(true)}>Start Skill Exchange</Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-2xl bg-teal-50 p-4 dark:bg-teal-500/15">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">You teach</p>
              <p className="mt-1 text-sm font-bold text-ink-900 dark:text-white">{state.student.teach[0]}</p>
            </div>
            <Icon name="ArrowLeftRight" size={18} className="mx-auto text-brand-500" />
            <div className="rounded-2xl bg-brand-50 p-4 dark:bg-brand-500/15">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-200">{peer.name.split(' ')[0]} teaches</p>
              <p className="mt-1 text-sm font-bold text-ink-900 dark:text-white">{peer.teach.join(', ')}</p>
            </div>
          </div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-3">
            {[
              'Both sides log the session on completion',
              'Sessions accrue to skill proof for the teacher',
              'Repeat exchanges build a track record',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-500 dark:text-ink-300">
                <Icon name="CheckCircle2" size={14} className="mt-0.5 shrink-0 text-teal-500" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* partner picker */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="ink" icon="Users">Choose your exchange partner</Tag>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
              Ranked by how directly their teach list covers <strong className="font-semibold text-ink-700 dark:text-white">{state.student.learn.join(', ') || 'your learning goals'}</strong>.
            </p>
          </div>
          <Button size="sm" variant="ghost" icon="Sparkles" onClick={() => navigate('/matching')}>Open full matching</Button>
        </div>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => {
            const covers = p.teach.filter((t) => state.student.learn.includes(t)).length > 0
            const isActive = p.id === peer.id
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className={cx(
                    'w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft',
                    isActive ? 'border-brand-300 bg-brand-50/60 dark:border-brand-400/40 dark:bg-brand-500/10' : 'border-ink-100 dark:border-white/10',
                  )}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-3">
                    <Avatar initials={p.initials} tone={p.avatarTone} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-ink-900 dark:text-white">{p.name}</p>
                      <p className="truncate text-[11px] text-ink-400">{p.availability} · {p.learningPreference}</p>
                    </div>
                    <span className="tnum text-[11px] font-bold text-brand-600 dark:text-brand-300">{p.matchScore}%</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {covers ? <Tag tone="teal" icon="Target">Covers your goal</Tag> : <Tag tone="ink">Adjacent skill</Tag>}
                    <Tag tone="brand" icon="Presentation">{p.teach[0]}</Tag>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
        <Note className="mt-5">
          Peer availability and match scores are seeded demo values. Selecting a partner only changes which profile is highlighted on this page.
        </Note>
      </Card>

      {/* active exchanges */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Your exchanges</h3>
          <span className="tnum rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-bold text-ink-600 dark:bg-white/10 dark:text-ink-200">{requests.length} set up</span>
        </div>
        {requests.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon="Repeat"
              title="No exchanges set up yet"
              body="Pick a partner above and start a skill exchange to simulate the session setup flow."
              action={<Button variant="primary" icon="Repeat" onClick={() => setModalOpen(true)}>Start Skill Exchange</Button>}
            />
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {requests.map((r) => {
              const p = PEERS.find((x) => x.id === r.peerId)
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-100 p-4 dark:border-white/10">
                  <Avatar initials={p?.initials || 'SS'} tone={p?.avatarTone} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-ink-900 dark:text-white">{p?.name || 'Peer'}</p>
                    <p className="truncate text-[11px] text-ink-400">{r.activity} · {r.when}</p>
                  </div>
                  <Tag tone="amber" icon="Clock">Scheduled (simulated)</Tag>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      {/* practice loop */}
      <Card>
        <SectionHeading eyebrow="Keep the loop moving" title="Activities that pair with an exchange" lede="Each exchange session should end with a deliverable. These 20-minute activities produce one." />
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.slice(0, 3).map((a) => (
            <li key={a.id} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                  <Icon name={a.icon} size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-ink-900 dark:text-white">{a.title}</p>
                  <p className="text-[11px] text-ink-400">{a.duration} min · {a.level}</p>
                </div>
              </div>
              <ProgressBar value={state.completedActivities.filter((c) => c.id === a.id).length ? 100 : 0} tone="teal" className="mt-3" />
              <Button size="sm" variant="ghost" className="mt-3 w-full" icon="Play" onClick={() => navigate(`/practice?activity=${a.id}`)}>
                Start Activity
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <SetupModal peer={peer} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
