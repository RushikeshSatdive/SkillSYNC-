import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Avatar, Breadcrumbs, Button, Card, EmptyState, MatchRing, Modal, Note, ProgressBar, ProvenanceTag, RatingStars,
  ScoreRow, SkillChip, Tag, Tooltip, } from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import { ACTIVITIES, PEERS } from '../data/mockData'

const TIME_SLOTS = ['7 PM – 8 PM', '8 PM – 9 PM', '9 PM – 10 PM', 'Sat 10 AM – 12 PM', 'Sun 3 PM – 5 PM']

function ScheduleModal({ peer, open, onClose }) {
  const { dispatch, toast, state } = useApp()
  const [activity, setActivity] = useState(ACTIVITIES[0].title)
  const [slot, setSlot] = useState(TIME_SLOTS[0])
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = () => {
    setBusy(true)
    setTimeout(() => {
      dispatch({ type: 'REQUEST_SESSION', peerId: peer.id, activity, when: slot })
      setBusy(false)
      onClose()
      toast({
        title: 'Session setup simulated',
        body: `${activity} with ${peer.name} on ${slot}. In a live product this would send a calendar invite.`,
        tone: 'brand',
        icon: 'CalendarCheck',
      })
    }, 650)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Schedule a session with ${peer.name}`}
      subtitle="This is a simulated setup flow — no invite is sent and no messaging backend exists."
      icon="CalendarCheck"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" icon={busy ? 'RefreshCw' : 'CalendarCheck'} onClick={submit} disabled={busy}>
            {busy ? 'Scheduling…' : 'Confirm session'}
          </Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="s-activity" className="label">Practice activity</label>
          <select id="s-activity" value={activity} onChange={(e) => setActivity(e.target.value)} className="input" data-autofocus>
            {ACTIVITIES.map((a) => <option key={a.id} value={a.title}>{a.title} · {a.duration} min</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="s-slot" className="label">Time slot ({peer.availability})</label>
          <select id="s-slot" value={slot} onChange={(e) => setSlot(e.target.value)} className="input">
            {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="s-note" className="label">What do you want to cover? (optional)</label>
        <textarea
          id="s-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`e.g. Build a first draft of a ${activity} deliverable and get feedback on structure.`}
          className="input resize-none"
        />
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
        <Avatar initials="SJ" size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Exchange pair</p>
          <p className="mt-1 text-[13px] text-ink-600 dark:text-ink-200">
            You teach <strong className="font-bold text-teal-600 dark:text-teal-300">{state.student.teach[0]}</strong> · {peer.name.split(' ')[0]} teaches{' '}
            <strong className="font-bold text-brand-600 dark:text-brand-300">{peer.teach[0]}</strong>
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default function PeerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch, toast } = useApp()
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const peer = useMemo(() => PEERS.find((p) => p.id === id), [id])

  if (!peer) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Peer Matching', to: '/matching' }, { label: 'Not found' }]} />
        <EmptyState
          icon="XCircle"
          title="That peer profile does not exist"
          body={`No demo peer with the id “${id}”. The seeded profiles are Aarav, Priya, Rahul, Ananya, Rohan and Meera.`}
          action={<Button variant="primary" icon="Users" onClick={() => navigate('/matching')}>Back to peer matching</Button>}
        />
      </div>
    )
  }

  const saved = state.savedPeers.includes(peer.id)
  const connected = state.connections.includes(peer.id)
  const sessions = state.sessionRequests.filter((s) => s.peerId === peer.id)

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'SkillSync', to: '/dashboard' },
          { label: 'Peer Matching', to: '/matching' },
          { label: peer.name },
        ]}
      />

      {/* header */}
      <Card className="relative overflow-hidden !p-0">
        <div className="relative h-28 bg-gradient-to-r from-brand-700 via-brand-600 to-violet-600 sm:h-32">
          <div className="grid-lines absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="absolute right-4 top-4 flex gap-2">
            <Tooltip label={saved ? 'Remove from saved matches' : 'Save this peer'}>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'TOGGLE_SAVE_PEER', id: peer.id })
                  toast({
                    title: saved ? 'Match removed' : 'Match saved',
                    body: saved ? `${peer.name} removed from your saved matches.` : `${peer.name} added to saved matches.`,
                    tone: saved ? 'amber' : 'brand',
                    icon: saved ? 'Bookmark' : 'BookmarkCheck',
                  })
                }}
                aria-label={saved ? 'Unsave match' : 'Save match'}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <Icon name={saved ? 'BookmarkCheck' : 'Bookmark'} size={16} />
              </button>
            </Tooltip>
            <Tooltip label="Copy a shareable profile link (demo)">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/peer/${peer.id}`).catch(() => {})
                  toast({ title: 'Profile link copied', body: 'The link is local to this demo — sharing it will still open the same demo profile.', tone: 'violet', icon: 'Link2' })
                }}
                aria-label="Share profile"
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <Icon name="Share2" size={16} />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-5">
            <div className="flex items-end gap-4">
              <Avatar initials={peer.initials} tone={peer.avatarTone} size={92} ring className="!rounded-3xl shadow-card" />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">{peer.name}</h1>
                  <Tag tone="teal" icon="BadgeCheck">{peer.scoreLabel}</Tag>
                </div>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{peer.year} · {peer.campus}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-ink-500 dark:text-ink-300">
                  <RatingStars value={peer.rating} />
                  <span className="inline-flex items-center gap-1"><Icon name="MessageCircle" size={11} className="text-brand-500" /> {peer.reviews} reviews</span>
                  <span className="inline-flex items-center gap-1"><Icon name="Repeat" size={11} className="text-teal-500" /> {peer.exchanges} skills exchanged</span>
                  <span className="inline-flex items-center gap-1"><Icon name="CalendarCheck" size={11} className="text-violet-500" /> {peer.sessions} sessions completed</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={connected ? 'soft' : 'primary'}
                icon={connected ? 'UserCheck' : 'UserPlus'}
                onClick={() => {
                  if (connected) {
                    toast({ title: 'Already connected', body: `${peer.name} is in your connections.`, tone: 'violet', icon: 'UserCheck' })
                    return
                  }
                  dispatch({ type: 'CONNECT_PEER', id: peer.id })
                  toast({ title: 'Connection request simulated successfully.', body: `${peer.name} would now see a request from Sakshi. No messaging backend exists in this prototype.`, tone: 'teal' })
                }}
              >
                {connected ? 'Connected' : 'Connect'}
              </Button>
              <Button variant="ghost" icon="CalendarCheck" onClick={() => setScheduleOpen(true)}>Schedule Activity</Button>
            </div>
          </div>
        </div>
      </Card>

      {sessions.length ? (
        <Card className="border-teal-300/60 bg-teal-50/60 dark:border-teal-400/30 dark:bg-teal-500/10">
          <div className="flex items-start gap-3">
            <Icon name="CalendarCheck" size={18} className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-300" />
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">
                {sessions.length} simulated session{sessions.length === 1 ? '' : 's'} set up with {peer.name}
              </p>
              <ul className="mt-2 space-y-1">
                {sessions.map((s) => (
                  <li key={s.id} className="text-[12.5px] text-ink-600 dark:text-ink-200">
                    {s.activity} · {s.when}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-ink-400">
                Demo only — reset from the DEMO MODE bar to clear.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{peer.bio}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-teal-200/60 bg-teal-50/50 p-4 dark:border-teal-400/25 dark:bg-teal-500/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Can teach</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {peer.teach.map((t) => <SkillChip key={t} tone="teach" icon="Presentation">{t}</SkillChip>)}
                </div>
              </div>
              <div className="rounded-2xl border border-brand-200/60 bg-brand-50/50 p-4 dark:border-brand-400/25 dark:bg-brand-500/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-200">Wants to learn</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {peer.learn.map((l) => <SkillChip key={l} tone="learn" icon="BookOpenCheck">{l}</SkillChip>)}
                </div>
              </div>
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Career goal', value: peer.careerGoal, icon: 'Target' },
                { label: 'Availability', value: `${peer.availability} · ${peer.availabilitySlots}`, icon: 'Clock' },
                { label: 'Learning style', value: peer.learningPreference, icon: 'Lightbulb' },
                { label: 'Teaching style', value: peer.teachingStyle, icon: 'Presentation' },
              ].map((d) => (
                <div key={d.label} className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-400">
                    <Icon name={d.icon} size={11} /> {d.label}
                  </dt>
                  <dd className="mt-1.5 text-[13px] font-semibold leading-snug text-ink-800 dark:text-white">{d.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Skill proof</h2>
              <ProvenanceTag kind="illustrative" />
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {peer.proof.map((p) => (
                <li key={p} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300">
                    <Icon name="BadgeCheck" size={16} />
                  </span>
                  <p className="mt-3 text-[13px] font-semibold leading-snug text-ink-800 dark:text-white">{p}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {peer.badges.map((b) => <Tag key={b} tone="violet" icon="Award">{b}</Tag>)}
            </div>
            <Note className="mt-4">
              Proof records and ratings are seeded demo values. In a live product they would be derived from verified sessions and peer review.
            </Note>
          </Card>

          <Card>
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Practice activities {peer.name.split(' ')[0]} suggests</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {ACTIVITIES.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-2xl border border-ink-100 p-4 transition hover:border-brand-200 hover:shadow-soft dark:border-white/10">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                    <Icon name={a.icon} size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-ink-800 dark:text-white">{a.title}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-400">{a.duration} min · {a.level}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/practice')} aria-label={`Start ${a.title}`}>Start</Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* sidebar */}
        <div className="space-y-4">
          <Card className="text-center">
            <Tag tone="violet" icon="Sparkles" className="mx-auto">Match with you</Tag>
            <div className="mt-5 flex justify-center">
              <MatchRing value={peer.matchScore} size={150} label={peer.scoreLabel} />
            </div>
            <div className="mt-6 space-y-3 text-left">
              <ScoreRow label="Skill compatibility" value={peer.breakdown.skillCompatibility} />
              <ScoreRow label="Career alignment" value={peer.breakdown.careerAlignment} tone="violet" />
              <ScoreRow label="Learning preference" value={peer.breakdown.learningPreference} tone="teal" />
              <ScoreRow label="Availability" value={peer.breakdown.availability} tone="amberx" />
            </div>
            <Note className="mt-5 text-left">
              {peer.matchScore}% is an illustrative product example and not a validated outcome.
            </Note>
          </Card>

          <Card>
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Why you match</h3>
            <ul className="mt-4 space-y-3">
              {peer.reasons.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-600 dark:text-ink-200">
                  <Icon name="CheckCircle2" size={15} className="mt-0.5 shrink-0 text-teal-500" /> {r}
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-3 border-t border-ink-100 pt-4 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-ink-400">You teach</span>
                <SkillChip tone="teach">{state.student.teach[0]}</SkillChip>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-ink-400">{peer.name.split(' ')[0]} teaches</span>
                <SkillChip tone="learn">{peer.teach[0]}</SkillChip>
              </div>
            </div>
            <Button variant="primary" className="mt-5 w-full" icon="Repeat" onClick={() => navigate('/exchange')}>
              Start Skill Exchange
            </Button>
          </Card>

          <Card>
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Exchange history</h3>
            <ul className="mt-4 space-y-3">
              {[
                { label: 'Sessions delivered', value: peer.sessions },
                { label: 'Skills exchanged', value: peer.exchanges },
                { label: 'Average learner rating', value: `${peer.rating}/5` },
                { label: 'Response rate', value: '96%' },
              ].map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-3 border-b border-ink-100 pb-2.5 last:border-0 last:pb-0 dark:border-white/10">
                  <span className="text-[12.5px] text-ink-500 dark:text-ink-300">{r.label}</span>
                  <span className="tnum text-sm font-bold text-ink-900 dark:text-white">{r.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <ProgressBar value={peer.matchScore} tone="teal" label="Overall compatibility" showValue />
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Other peers you might match</h3>
            <ul className="mt-4 space-y-3">
              {PEERS.filter((p) => p.id !== peer.id).slice(0, 3).map((p) => (
                <li key={p.id}>
                  <Link to={`/peer/${p.id}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-ink-50 dark:hover:bg-white/5">
                    <Avatar initials={p.initials} tone={p.avatarTone} size={38} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-ink-800 dark:text-white">{p.name}</span>
                      <span className="block truncate text-[11px] text-ink-400">Teaches {p.teach[0]}</span>
                    </span>
                    <span className="tnum text-[11px] font-bold text-brand-600 dark:text-brand-300">{p.matchScore}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <ScheduleModal peer={peer} open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  )
}
