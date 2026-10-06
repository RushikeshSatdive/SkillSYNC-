import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, EmptyState, Modal, Note, ProgressBar, ProvenanceTag, SectionHeading, Tabs, Tag, cx,
} from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import { PROOFS } from '../data/mockData'

function Certificate({ proof }) {
  const { state } = useApp()
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 dark:border-white/15 dark:bg-ink-900">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 font-display text-sm font-extrabold text-white">S</span>
            <div>
              <p className="font-display text-sm font-extrabold text-ink-900 dark:text-white">SkillSync</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">Verified skill record</p>
            </div>
          </div>
          <span className="label-badge bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300">Demo</span>
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">This certifies that</p>
        <p className="mt-1 font-display text-2xl font-extrabold text-ink-900 dark:text-white">{state.student.name} Jadhav</p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">
          has completed the requirements for the SkillSync record <strong className="font-bold text-ink-800 dark:text-white">{proof.title}</strong>
          {' '}({proof.type.toLowerCase()}), issued {proof.date.toLowerCase()}.
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-ink-50 p-3 dark:bg-white/5">
            <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Verified by</dt>
            <dd className="mt-1 text-[12.5px] font-semibold text-ink-800 dark:text-white">{proof.issuer}</dd>
          </div>
          <div className="rounded-xl bg-ink-50 p-3 dark:bg-white/5">
            <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Evidence</dt>
            <dd className="mt-1 text-[12.5px] font-semibold text-ink-800 dark:text-white">{proof.detail}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-ink-400">
              RECORD ID: SS-DEMO-{proof.id.toUpperCase()}-2026
            </p>
            <p className="mt-1 text-[10px] text-ink-400">
              Illustrative certificate UI — not a real credential and not verifiable externally.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 60 60" className="h-14 w-14" aria-hidden="true">
              <circle cx="30" cy="30" r="27" fill="none" stroke="#0D9488" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="30" cy="30" r="20" fill="none" stroke="#0D9488" strokeWidth="1" opacity=".5" />
              <path d="M20 31.5l6.5 6.5L41 25" fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Proof() {
  const { state, toast } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [preview, setPreview] = useState(null)

  const counts = useMemo(() => ({
    all: PROOFS.length,
    earned: PROOFS.filter((p) => !p.status.includes('In Progress')).length,
    progress: PROOFS.filter((p) => p.status.includes('In Progress')).length,
  }), [])

  const list = useMemo(() => {
    if (filter === 'earned') return PROOFS.filter((p) => !p.status.includes('In Progress'))
    if (filter === 'progress') return PROOFS.filter((p) => p.status.includes('In Progress'))
    return PROOFS
  }, [filter])

  const score = Math.round((counts.earned / counts.all) * 100)

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Progress', to: '/progress' }, { label: 'Skill Proof' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Skill proof"
          title={<>Evidence, not <span className="grad-text">attendance</span></>}
          lede="Certificates, verified practice and contribution records — the artefacts a recruiter can actually inspect instead of a list of course names."
          className="!max-w-2xl"
        />
        <ProvenanceTag kind="illustrative" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: 'Award', label: 'Records earned', value: `${counts.earned}`, tone: 'teal', sub: 'Certificates and verified practice' },
          { icon: 'Timer', label: 'In progress', value: `${counts.progress}`, tone: 'amberx', sub: 'Requirements still being logged' },
          { icon: 'Repeat', label: 'Peer teaching', value: `${state.student.sessions} sessions`, tone: 'violet', sub: 'Contribution record on profile' },
          { icon: 'ClipboardList', label: 'Proof completeness', value: `${score}%`, tone: 'brand', sub: 'Earned ÷ total possible records' },
        ].map((s, i) => (
          <Card key={s.label} className="animate-fade-up !p-5" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between gap-2">
              <span className={cx('grid h-10 w-10 place-items-center rounded-xl', {
                teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                amberx: 'bg-amberx-500/10 text-amberx-500',
                violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
              }[s.tone])}>
                <Icon name={s.icon} size={18} />
              </span>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
            <p className="tnum mt-1 font-display text-xl font-extrabold text-ink-900 dark:text-white">{s.value}</p>
            <p className="mt-1.5 text-[11px] text-ink-400">{s.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="!p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            size="sm"
            value={filter}
            onChange={setFilter}
            tabs={[
              { id: 'all', label: 'All records', icon: 'Layers', count: counts.all },
              { id: 'earned', label: 'Earned', icon: 'BadgeCheck', count: counts.earned },
              { id: 'progress', label: 'In progress', icon: 'Timer', count: counts.progress },
            ]}
          />
          <Button size="sm" variant="ghost" icon="Timer" onClick={() => navigate('/practice')}>Log more practice</Button>
        </div>
      </Card>

      {list.length === 0 ? (
        <EmptyState
          icon="Award"
          title="Nothing in this filter yet"
          body="Keep logging practice activities and peer sessions — records appear here as requirements are met."
          action={<Button variant="primary" icon="Timer" onClick={() => navigate('/practice')}>Go to practice activities</Button>}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => {
            const inProgress = p.status.includes('In Progress')
            return (
              <li key={p.id} className="card card-hover animate-fade-up flex flex-col" style={{ animationDelay: `${i * 45}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <span className={cx('grid h-12 w-12 place-items-center rounded-2xl', {
                    teal: 'bg-gradient-to-br from-teal-400 to-teal-600 text-white',
                    brand: 'bg-gradient-to-br from-brand-600 to-violet-600 text-white',
                    violet: 'bg-gradient-to-br from-violet-500 to-brand-600 text-white',
                    amberx: 'bg-amberx-500/15 text-amberx-500',
                  }[p.tone])}>
                    <Icon name={p.icon} size={20} />
                  </span>
                  <Tag tone={inProgress ? 'amber' : 'teal'} icon={inProgress ? 'Timer' : 'Check'}>{p.status}</Tag>
                </div>

                <h3 className="mt-4 font-display text-base font-bold text-ink-900 dark:text-white">{p.title}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-ink-400">{p.type}</p>
                <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{p.detail}</p>

                {p.progress ? (
                  <div className="mt-4">
                    <ProgressBar value={p.progress} tone="amberx" label="Requirements logged" showValue />
                  </div>
                ) : null}

                <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-100 pt-3 text-[11px] dark:border-white/10">
                  <div>
                    <dt className="font-bold uppercase tracking-wider text-ink-400">Issued</dt>
                    <dd className="font-semibold text-ink-700 dark:text-ink-100">{p.date}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-wider text-ink-400">Verified by</dt>
                    <dd className="font-semibold text-ink-700 dark:text-ink-100">{p.issuer}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {inProgress ? (
                    <>
                      <Button size="sm" variant="ghost" className="flex-1" icon="Route" onClick={() => navigate('/learning-path')}>Continue path</Button>
                      <Button size="sm" variant="soft" icon="Timer" onClick={() => navigate('/practice')}>Practise</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="primary" className="flex-1" icon="Eye" onClick={() => setPreview(p)}>View certificate</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Download"
                        onClick={() =>
                          toast({
                            title: 'Download simulated',
                            body: 'This demo does not generate a PDF or image file — the certificate is rendered in-browser only.',
                            tone: 'violet',
                            icon: 'Download',
                          })
                        }
                      >
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Card>
        <SectionHeading
          eyebrow="How proof is earned"
          title="What each record needs"
          lede="Every record has an explicit requirement. Nothing is awarded for time spent or for simply finishing a video."
          provenance="illustrative"
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {[
            { icon: 'BadgeCheck', title: 'Skill certificate', need: 'Verified practice + 1 reviewed deliverable + peer sign-off', tone: 'teal' },
            { icon: 'Table2', title: 'Practice verification', need: 'Same activity completed 3× with an average peer score above 4/5', tone: 'brand' },
            { icon: 'Presentation', title: 'Contribution record', need: '5 delivered teaching sessions with learner feedback above 4/5', tone: 'violet' },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <span className={cx('grid h-9 w-9 place-items-center rounded-xl', {
                teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
                violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
              }[c.tone])}>
                <Icon name={c.icon} size={16} />
              </span>
              <p className="mt-3 text-[13px] font-bold text-ink-900 dark:text-white">{c.title}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{c.need}</p>
            </div>
          ))}
        </div>
        <Note className="mt-5">
          Records, dates and verifying peers are seeded demo values. Real credential verification would require an issuing institution.
        </Note>
      </Card>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview ? `${preview.title} — certificate preview` : ''}
        subtitle="Rendered in-browser. This demo does not generate a downloadable file."
        icon="Award"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPreview(null)}>Close</Button>
            <Button
              variant="primary"
              icon="Download"
              onClick={() =>
                toast({
                  title: 'Download simulated',
                  body: 'No file is produced. In a live product this would export a signed PDF with a verification link.',
                  tone: 'violet',
                  icon: 'Download',
                })
              }
            >
              Download (simulated)
            </Button>
          </>
        }
      >
        {preview ? <Certificate proof={preview} /> : null}
      </Modal>
    </div>
  )
}
