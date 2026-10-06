import { useState } from 'react'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Modal, Note, ProgressBar, ProvenanceTag, SectionHeading, Tag, cx,
} from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import { IMPACT } from '../data/mockData'

const PROOF_TARGETS = [
  { id: 'p1', name: 'Weekend academic support', detail: 'Two-hour slots, Saturday & Sunday', need: 'Maths, Science, English', slots: 24, filled: 15 },
  { id: 'p2', name: 'Digital literacy basics', detail: 'One-hour slots, weekday evenings', need: 'Computers, typing, internet safety', slots: 16, filled: 9 },
  { id: 'p3', name: 'Career awareness talks', detail: '45-minute sessions, monthly', need: 'Finance, design, technology, healthcare', slots: 8, filled: 2 },
]

const metricTones = {
  brand: 'from-brand-600 to-violet-600',
  violet: 'from-violet-500 to-brand-600',
  teal: 'from-teal-400 to-teal-600',
  amberx: 'from-amberx-400 to-amberx-500',
}

function VolunteerModal({ open, onClose }) {
  const { toast } = useApp()
  const [programme, setProgramme] = useState(PROOF_TARGETS[0].name)
  const [hours, setHours] = useState('2 hours / week')
  const [skill, setSkill] = useState('Maths')
  const [busy, setBusy] = useState(false)

  const submit = () => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      onClose()
      toast({
        title: 'Volunteer registration simulated',
        body: `${programme} · ${hours} · ${skill}. In a live programme this would go to an NGO partner for screening — nothing is transmitted here.`,
        tone: 'teal',
        icon: 'HeartHandshake',
        duration: 5200,
      })
    }, 750)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Become a Volunteer"
      subtitle="Simulated sign-up. Screening, safeguarding checks and NGO placement would happen outside this prototype."
      icon="HeartHandshake"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" icon={busy ? 'RefreshCw' : 'HeartHandshake'} onClick={submit} disabled={busy}>
            {busy ? 'Registering…' : 'Register interest'}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="v-programme" className="label">Programme</label>
          <select id="v-programme" value={programme} onChange={(e) => setProgramme(e.target.value)} className="input" data-autofocus>
            {PROOF_TARGETS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="v-hours" className="label">Time commitment</label>
          <select id="v-hours" value={hours} onChange={(e) => setHours(e.target.value)} className="input">
            {['2 hours / week', '4 hours / week', 'One-off session', 'Flexible'].map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="v-skill" className="label">I can teach</label>
          <select id="v-skill" value={skill} onChange={(e) => setSkill(e.target.value)} className="input">
            {['Maths', 'Science', 'English', 'Computers & digital literacy', 'Art & design', 'Career awareness'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
        {[
          'Identity and background verification before any child-facing session',
          'Supervised sessions with a two-adult rule',
          'No child photographs, no personal identifiers',
        ].map((t) => (
          <p key={t} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-600 dark:text-ink-200">
            <Icon name="ShieldCheck" size={14} className="mt-0.5 shrink-0 text-teal-500" /> {t}
          </p>
        ))}
      </div>

      <Note className="mt-4">
        This is a frontend-only prototype. Registering here stores nothing and contacts nobody — it demonstrates the intended flow.
      </Note>
    </Modal>
  )
}

export default function Impact() {
  const { state } = useApp()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Social Impact' }]} />

      {/* hero */}
      <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-900 via-ink-900 to-teal-900 p-6 text-white shadow-card sm:p-9">
        <div className="grid-lines absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-10 top-6 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-badge bg-white/15 text-white"><Icon name="HeartHandshake" size={11} /> Social impact</span>
            <span className="label-badge bg-amberx-500/20 text-amberx-400"><Icon name="Target" size={11} /> Illustrative 12-month targets</span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.85rem]">
            Turning Skills Into <span className="bg-gradient-to-r from-teal-300 to-brand-300 bg-clip-text text-transparent">Opportunity</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">{IMPACT.lede}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="primary" icon="HeartHandshake" onClick={() => setModalOpen(true)} className="shadow-lift">
              Become a Volunteer
            </Button>
            <Button variant="ghost" icon="MessagesSquare" to="/community" className="border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 hover:text-white dark:border-white/25 dark:bg-white/5 dark:text-white">
              See community hours
            </Button>
          </div>
        </div>
      </div>

      {/* metrics */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag tone="amber" icon="Target">Illustrative 12-month targets</Tag>
            <span className="text-[11px] font-semibold text-ink-400">Not current traction</span>
          </div>
          <ProvenanceTag kind="target" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {IMPACT.metrics.map((m, i) => (
            <Card key={m.id} className="card-hover animate-fade-up relative overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={cx('pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl', metricTones[m.tone])} aria-hidden="true" />
              <span className={cx('grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-soft', metricTones[m.tone])}>
                <Icon name={m.icon} size={20} />
              </span>
              <p className="tnum mt-4 font-display text-3xl font-extrabold text-ink-900 dark:text-white">
                <Counter value={m.value} suffix={m.suffix} />
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-400">{m.label}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-amberx-500">Illustrative 12-month target</p>
            </Card>
          ))}
        </div>
        <Note className="mt-4">
          These four figures are planning targets for the first 12 months of the social-impact programme. They are not users, revenue or
          verified outcomes and should not be read as traction.
        </Note>
      </div>

      {/* children / volunteers */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <Tag tone="brand" icon="Users">For children</Tag>
          <h2 className="mt-3 font-display text-xl font-bold text-ink-900 dark:text-white">What a child actually gets</h2>
          <ul className="mt-5 space-y-4">
            {IMPACT.forChildren.map((c) => (
              <li key={c.title} className="flex items-start gap-3 rounded-2xl border border-ink-100 p-4 dark:border-white/10">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                  <Icon name="Sparkles" size={16} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold text-ink-900 dark:text-white">{c.title}</span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{c.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <Tag tone="teal" icon="Award">For volunteers</Tag>
          <h2 className="mt-3 font-display text-xl font-bold text-ink-900 dark:text-white">What a volunteer gets back</h2>
          <ul className="mt-5 space-y-4">
            {IMPACT.forVolunteers.map((c) => (
              <li key={c.title} className="flex items-start gap-3 rounded-2xl border border-teal-200/60 bg-teal-50/40 p-4 dark:border-teal-400/25 dark:bg-teal-500/10">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-500 text-white">
                  <Icon name="BadgeCheck" size={16} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold text-ink-900 dark:text-white">{c.title}</span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{c.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Your contribution record (demo)</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { label: 'Hours logged', value: state.student.hoursLearned },
                { label: 'Peer sessions', value: state.student.sessions },
                { label: 'Teaching sessions', value: 9 },
              ].map((s) => (
                <div key={s.label}>
                  <p className="tnum font-display text-lg font-extrabold text-ink-900 dark:text-white">{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
                </div>
              ))}
            </div>
            <ProgressBar value={Math.min(100, state.student.hoursLearned * 2)} tone="teal" className="mt-4" label="Volunteer eligibility (20 hrs)" showValue />
          </div>
        </Card>
      </div>

      {/* open slots */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="violet" icon="CalendarCheck">Programme slots</Tag>
            <h2 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Where teaching hours are needed</h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Capacity and fill rates are illustrative targets for the first pilot cohort.</p>
          </div>
          <ProvenanceTag kind="target" />
        </div>
        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {PROOF_TARGETS.map((p) => (
            <li key={p.id} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <p className="text-[14px] font-bold text-ink-900 dark:text-white">{p.name}</p>
              <p className="mt-1 text-[11.5px] text-ink-400">{p.detail}</p>
              <p className="mt-3 flex items-start gap-1.5 text-[11.5px] text-ink-500 dark:text-ink-300">
                <Icon name="BookOpen" size={12} className="mt-0.5 shrink-0 text-brand-500" /> Needs: {p.need}
              </p>
              <div className="mt-4">
                <ProgressBar value={p.filled} max={p.slots} tone="violet" label={`${p.filled} of ${p.slots} slots filled`} showValue />
              </div>
              <Button size="sm" variant="ghost" className="mt-4 w-full" icon="HeartHandshake" onClick={() => setModalOpen(true)}>
                Volunteer for this
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* governance */}
      <Card>
        <SectionHeading
          eyebrow="Responsible implementation"
          title="How this is kept safe"
          lede="Running a children's education programme is not the same as running a peer skill network. Delivery only happens through partners, with screening and safeguarding in front of every session."
          provenance="proposed"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {IMPACT.governance.map((g, i) => (
            <div key={g.title} className="relative rounded-2xl border border-ink-100 p-5 dark:border-white/10 animate-fade-up" style={{ animationDelay: `${i * 55}ms` }}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white">
                <Icon name={g.icon} size={18} />
              </span>
              <p className="mt-4 font-display text-[14px] font-bold text-ink-900 dark:text-white">{g.title}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{g.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-amberx-400/50 bg-amberx-500/5 p-5">
          <Icon name="AlertTriangle" size={18} className="shrink-0 text-amberx-500" />
          <p className="text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-200">
            <strong className="font-bold text-ink-800 dark:text-white">Not yet operational.</strong> No NGO partnership is signed, no
            volunteer has been screened and no child has been taught through SkillSync. This page describes the intended programme and its
            safeguards, all of which are proposals at this stage.
          </p>
        </div>
      </Card>

      <Card className="!p-0">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-600 p-6 text-white sm:p-8">
          <div className="grid-lines absolute inset-0 opacity-25" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-display text-xl font-extrabold sm:text-2xl">Teach one hour a month. Change one trajectory.</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Register interest and the demo will simulate the placement flow — screening, matching to a partner programme and logging the
                hours to your profile.
              </p>
            </div>
            <Button variant="dark" icon="HeartHandshake" onClick={() => setModalOpen(true)} className="bg-white text-brand-700 hover:bg-white/90 dark:bg-white dark:text-brand-700">
              Become a Volunteer
            </Button>
          </div>
        </div>
      </Card>

      <VolunteerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
