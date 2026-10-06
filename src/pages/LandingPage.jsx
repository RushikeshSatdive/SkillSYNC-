import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HeroNetwork from '../components/landing/HeroNetwork'
import Icon from '../components/ui/Icon'
import { Button, Card, Counter, Note, ProvenanceTag, SectionHeading, Tag, Tooltip, cx } from '../components/ui/Kit'
import {
  BRAND, IMPACT, JOURNEY, LANDSCAPE, MARKET, PRICING, PROBLEMS, PROBLEM_STATS, WHY_SKILLSYNC,
} from '../data/mockData'

/* ---------------- hash scroll for /#section links ---------------- */
function useHashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (pathname !== '/' || !hash) return
    const t = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [hash, pathname])
}

/* ---------------- hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-10 dark:bg-ink-950 sm:pt-14">
      <div className="mesh pointer-events-none absolute inset-0 -z-10 opacity-90" aria-hidden="true" />
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-50" aria-hidden="true" />

      <div className="section grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24">
        <div className="animate-fade-up">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Tag tone="violet" icon="Sparkles">AI-powered skill network</Tag>
            <Tag tone="ink" icon="ShieldCheck">Source data labelled</Tag>
            <Tag tone="teal" icon="Timer">20-minute practice reps</Tag>
          </div>

          <h1 className="font-display text-[2.15rem] font-extrabold leading-[1.05] tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-[3.6rem]">
            <span className="block">Find the Right <span className="grad-text">Skill.</span></span>
            <span className="block">Find the Right <span className="grad-text">Person.</span></span>
            <span className="block">Build the Right <span className="grad-text">Career.</span></span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 dark:text-ink-300 sm:text-[1.0625rem]">
            {BRAND.supporting}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/dashboard" variant="primary" size="lg" icon="LayoutDashboard" iconRight="ArrowRight" className="shadow-lift">
              Explore SkillSync
            </Button>
            <Button href="#how" variant="ghost" size="lg" icon="PlayCircle">
              See How It Works
            </Button>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink-100 pt-6 dark:border-white/10">
            {[
              { k: '4.33 crore', v: 'students enrolled', s: 'AISHE 2021–22' },
              { k: '54.81%', v: 'expected employable', s: 'India Skills Report 2025' },
              { k: '20 min', v: 'per skill activity', s: 'Product design choice' },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-display text-lg font-extrabold text-ink-900 dark:text-white sm:text-xl">{s.k}</dt>
                <dd className="mt-1 text-[11px] leading-snug text-ink-400 dark:text-ink-300">
                  {s.v}
                  <span className="mt-0.5 block font-semibold uppercase tracking-wide text-[9.5px] text-ink-300 dark:text-ink-400">{s.s}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-up animate-delay-200">
          <HeroNetwork />
        </div>
      </div>
    </section>
  )
}

/* ---------------- problem ---------------- */
function Problem() {
  return (
    <section id="problem" className="border-y border-ink-100 bg-ink-50 py-16 dark:border-white/10 dark:bg-ink-950 sm:py-24">
      <div className="section">
        <SectionHeading
          eyebrow="The problem"
          title={
            <>
              Students Don&apos;t Have a Learning Problem.
              <br className="hidden sm:block" /> They Have a <span className="grad-text">Matching Problem.</span>
            </>
          }
          lede="The content exists, the mentors exist, the capable classmates exist. What is missing is the layer that connects the right skill, the right person and the right next step to one career goal."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <Card key={p.id} className="card-hover animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-500/10 text-brand-600 dark:from-brand-500/20 dark:to-violet-500/10 dark:text-brand-200">
                <Icon name={p.icon} size={19} />
              </span>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-300 dark:text-ink-400">{String(i + 1).padStart(2, '0')} · {p.short}</span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-bold text-ink-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{p.body}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-1.5 text-[11px] font-bold text-ink-500 dark:bg-white/5 dark:text-ink-300">
                <Icon name="AlertTriangle" size={12} className="text-amberx-500" />
                {p.stat}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-ink-900 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">The scale of the opportunity</h3>
            <div className="flex items-center gap-2">
              <ProvenanceTag kind="source" />
              <span className="text-[11px] font-semibold text-ink-400">AISHE 2021–22 · India Skills Report 2025</span>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {PROBLEM_STATS.map((s) => (
              <div key={s.id} className="relative rounded-2xl bg-gradient-to-br from-ink-50 to-white p-5 dark:from-white/5 dark:to-transparent">
                <p className="font-display text-3xl font-extrabold text-ink-900 dark:text-white sm:text-4xl">
                  <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-600 dark:text-ink-200">{s.label}</p>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-teal-600 dark:text-teal-300">{s.source}</p>
              </div>
            ))}
          </div>
          <Note className="mt-6">
            These three figures are published third-party statistics and are the only source data on this page. Every other number in this
            prototype is labelled illustrative, a future target, or a proposal.
          </Note>
        </div>
      </div>
    </section>
  )
}

/* ---------------- why skillsync ---------------- */
function Why() {
  const toneMap = { rose: 'rose', amber: 'amber', sky: 'sky', teal: 'teal' }
  return (
    <section id="why" className="bg-white py-16 dark:bg-ink-950 sm:py-24">
      <div className="section">
        <SectionHeading
          eyebrow="Why SkillSync"
          title={<>Where SkillSync sits — and what it does <span className="grad-text">not</span> claim</>}
          lede="Each alternative category already does something well. SkillSync is positioned as the layer that personalises across all of them, toward one career goal."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {LANDSCAPE.map((l) => (
            <Card key={l.id} className="card-hover flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <Tag tone={toneMap[l.tone]}>{l.category}</Tag>
                <Icon name={l.icon} size={17} className="text-ink-300" />
              </div>
              <h3 className="mt-4 font-display text-sm font-bold text-ink-900 dark:text-white">{l.product}</h3>
              <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-1 text-[11px] font-bold text-ink-500 dark:bg-white/5 dark:text-ink-300">
                <Icon name="ArrowRight" size={11} /> {l.gives}
              </p>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">{l.detail}</p>
            </Card>
          ))}

          <Card className="relative overflow-hidden border-transparent bg-gradient-to-br from-brand-600 via-brand-700 to-violet-600 p-5 text-white shadow-lift card-hover lg:col-span-1">
            <div className="grid-lines absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between gap-2">
                <span className="label-badge bg-white/20 text-white">
                  <Icon name="Sparkles" size={11} /> {WHY_SKILLSYNC.category}
                </span>
                <Icon name="Zap" size={17} className="text-teal-300" />
              </div>
              <h3 className="mt-4 font-display text-sm font-bold">{WHY_SKILLSYNC.product}</h3>
              <p className="mt-2 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-bold">Discovery + Matching + Progress</p>
              <ul className="mt-3 space-y-2">
                {WHY_SKILLSYNC.pillars.map((p) => (
                  <li key={p.id} className="flex items-start gap-2 text-[12.5px] leading-snug text-white/90">
                    <Icon name="Check" size={13} className="mt-0.5 shrink-0 text-teal-300" />
                    <span>
                      <strong className="font-bold">{p.title}.</strong> {p.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-5 dark:border-brand-400/30 dark:bg-brand-500/10">
          <Icon name="Info" size={17} className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-300" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-200">{WHY_SKILLSYNC.note.split('.')[0]}.</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-200">{WHY_SKILLSYNC.note.replace(/^SkillSync positioning thesis\.\s*/, '')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- how it works ---------------- */
function How() {
  const [step, setStep] = useState(0)
  const active = JOURNEY[step]
  const progress = ((step + 1) / JOURNEY.length) * 100

  return (
    <section id="how" className="border-y border-ink-100 bg-ink-50 py-16 dark:border-white/10 dark:bg-ink-900/40 sm:py-24">
      <div className="section">
        <SectionHeading
          eyebrow="How SkillSync works"
          title={<>Eight steps from <span className="grad-text">goal</span> to <span className="grad-text">proof</span></>}
          lede="Click any step to see what happens there and what it produces. The whole loop is designed to be re-entered every semester, not completed once."
        />

        <div className="mt-10 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft dark:border-white/10 dark:bg-ink-900">
          {/* rail */}
          <div className="relative border-b border-ink-100 px-4 pt-6 dark:border-white/10 sm:px-6">
            <div className="relative mb-6 h-1 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-teal-400 transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
            <ol className="no-scrollbar scroll-fade -mx-1 flex gap-2 overflow-x-auto pb-5" role="tablist" aria-label="Journey steps">
              {JOURNEY.map((s, i) => {
                const isActive = i === step
                const isDone = i < step
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setStep(i)}
                      className={cx(
                        'flex w-[8.5rem] shrink-0 flex-col items-start gap-2 rounded-2xl border p-3 text-left transition sm:w-[9.5rem]',
                        isActive
                          ? 'border-brand-300 bg-brand-50 shadow-soft dark:border-brand-400/40 dark:bg-brand-500/15'
                          : 'border-ink-100 bg-white hover:border-brand-200 hover:bg-ink-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10',
                      )}
                    >
                      <span className={cx('grid h-8 w-8 place-items-center rounded-xl', isActive ? 'bg-gradient-to-br from-brand-600 to-violet-600 text-white' : isDone ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300' : 'bg-ink-100 text-ink-400 dark:bg-white/10 dark:text-ink-300')}>
                        <Icon name={isDone ? 'Check' : s.icon} size={15} />
                      </span>
                      <span className={cx('text-[11.5px] font-bold leading-snug', isActive ? 'text-brand-800 dark:text-white' : 'text-ink-600 dark:text-ink-200')}>
                        {i + 1}. {s.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* detail */}
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div key={active.id} className="animate-fade-up">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lift">
                  <Icon name={active.icon} size={22} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">Step {active.id} of 8</p>
                  <h3 className="font-display text-xl font-extrabold text-ink-900 dark:text-white">{active.title}</h3>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-300">{active.body}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Tag tone="teal" icon="PackageCheck">Produces: {active.output}</Tag>
                <Tag tone="ink" icon="Clock">~2 min to set up</Tag>
                {step < JOURNEY.length - 1 ? (
                  <Button size="sm" variant="soft" iconRight="ArrowRight" onClick={() => setStep(step + 1)}>
                    Next step
                  </Button>
                ) : (
                  <Button size="sm" variant="primary" to="/dashboard" iconRight="ArrowRight">
                    Open the demo dashboard
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">What you get at this step</p>
              <ul className="mt-3 space-y-2.5">
                {[
                  'A visible artefact you can act on today',
                  'No commitment, no payment, no account',
                  step >= 4 ? 'Runs entirely in-browser in this prototype' : 'Built on the skills and goal you entered',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13px] leading-snug text-ink-600 dark:text-ink-200">
                    <Icon name="CheckCircle2" size={14} className="mt-0.5 shrink-0 text-teal-500" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl bg-white p-3 dark:bg-ink-900">
                <p className="text-[11px] leading-relaxed text-ink-400">
                  <Icon name="Info" size={11} className="mr-1 inline" />
                  Steps 5 and 6 are simulated in the browser for this demo. No live AI service is called.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button to="/gap-analysis" variant="ghost" icon="ScanSearch" size="sm">Try the skill-gap analysis</Button>
          <Button to="/matching" variant="ghost" icon="Sparkles" size="sm">See peer matching</Button>
          <Button to="/learning-path" variant="ghost" icon="Route" size="sm">View a learning path</Button>
          <Button to="/practice" variant="ghost" icon="Timer" size="sm">Start a 20-minute activity</Button>
        </div>
      </div>
    </section>
  )
}

/* ---------------- product preview ---------------- */
function ProductPreview() {
  const navigate = useNavigate()
  const tiles = [
    { to: '/dashboard', icon: 'LayoutDashboard', title: 'Student Dashboard', body: 'Career goal, gap, best match and progress in one view.', tone: 'brand' },
    { to: '/matching', icon: 'Sparkles', title: 'Peer Matching', body: 'Filters, sorting and match-score breakdowns.', tone: 'violet' },
    { to: '/learning-path', icon: 'Route', title: 'Learning Path', body: 'Seven sequenced steps with completion tracking.', tone: 'teal' },
    { to: '/practice', icon: 'Timer', title: 'Practice Activities', body: 'A working 20-minute timer with progress updates.', tone: 'amberx' },
    { to: '/progress', icon: 'TrendingUp', title: 'Progress & Proof', body: 'Charts across 7, 30 and 90-day windows.', tone: 'sky' },
    { to: '/community', icon: 'MessagesSquare', title: 'Community', body: 'Discussions, challenges and workshops with local state.', tone: 'rose' },
  ]
  return (
    <section className="bg-white py-16 dark:bg-ink-950 sm:py-24">
      <div className="section">
        <SectionHeading
          eyebrow="Inside the product"
          title={<>A working demo, not a <span className="grad-text">screenshot</span></>}
          lede="Every card below opens a live page with real interactions — filters, timers, progress updates, modals and toasts. Everything runs locally in your browser."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <button
              key={t.to}
              type="button"
              onClick={() => navigate(t.to)}
              className="card card-hover group flex items-start gap-4 p-5 text-left animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-xl', {
                brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
                violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                amberx: 'bg-amberx-500/10 text-amberx-500',
                sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
                rose: 'bg-rose-500/10 text-rose-500',
              }[t.tone])}>
                <Icon name={t.icon} size={19} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 font-display text-base font-bold text-ink-900 dark:text-white">
                  {t.title}
                  <Icon name="ArrowUpRight" size={14} className="text-ink-300 transition group-hover:text-brand-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-ink-500 dark:text-ink-300">{t.body}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- impact + business teaser ---------------- */
function ImpactTeaser() {
  return (
    <section className="border-y border-ink-100 bg-ink-50 py-16 dark:border-white/10 dark:bg-ink-900/40 sm:py-24">
      <div className="section grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Social impact"
            title={<>Turning skills into <span className="grad-text">opportunity</span></>}
            lede={IMPACT.lede}
          />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ProvenanceTag kind="target" />
            <span className="text-[11px] font-semibold text-ink-400">Illustrative 12-month targets</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/impact" variant="primary" icon="HeartHandshake" iconRight="ArrowRight">See the impact plan</Button>
            <Button to="/pricing" variant="ghost" icon="CreditCard">Business model</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {IMPACT.metrics.map((m) => (
            <Card key={m.id} className="card-hover text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white">
                <Icon name={m.icon} size={19} />
              </span>
              <p className="mt-3 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
                <Counter value={m.value} suffix={m.suffix} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{m.label}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amberx-500">12-mo target</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function BusinessTeaser() {
  return (
    <section className="bg-white py-16 dark:bg-ink-950 sm:py-24">
      <div className="section">
        <SectionHeading
          eyebrow="Business model"
          title={<>Free to exchange. Premium to <span className="grad-text">progress faster.</span></>}
          lede="Peer skill exchange stays free forever — that is what keeps the network liquid. Premium adds the diagnostic and sequencing layer."
          provenance="proposed"
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr_1.1fr]">
          {PRICING.plans.map((p) => (
            <Card key={p.id} className={cx('card-hover flex flex-col', p.highlighted && 'border-transparent bg-gradient-to-br from-brand-600 via-brand-700 to-violet-600 text-white shadow-lift')}>
              <div className="flex items-start justify-between gap-2">
                <span className={cx('label-badge', p.highlighted ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-200')}>{p.name}</span>
                {p.badge ? <span className="label-badge bg-teal-400 text-ink-900">{p.badge}</span> : null}
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold">
                {p.price}
                <span className={cx('ml-1.5 text-xs font-semibold', p.highlighted ? 'text-white/70' : 'text-ink-400')}>{p.cadence}</span>
              </p>
              <p className={cx('mt-2 text-sm leading-relaxed', p.highlighted ? 'text-white/85' : 'text-ink-500 dark:text-ink-300')}>{p.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className={cx('flex items-start gap-2 text-[13px] font-medium', p.highlighted ? 'text-white' : 'text-ink-600 dark:text-ink-200')}>
                    <Icon name="Check" size={14} className={cx('mt-0.5 shrink-0', p.highlighted ? 'text-teal-300' : 'text-teal-500')} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button to="/pricing" variant={p.highlighted ? 'dark' : 'ghost'} className={cx('mt-6 w-full', p.highlighted && 'bg-white text-brand-700 hover:bg-white/90 dark:bg-white dark:text-brand-700')} iconRight="ArrowRight">
                {p.cta}
              </Button>
            </Card>
          ))}
          <Card className="card-hover flex flex-col justify-between">
            <div>
              <Tag tone="violet" icon="Coins">Secondary revenue</Tag>
              <p className="mt-4 font-display text-4xl font-extrabold text-ink-900 dark:text-white">{PRICING.secondary.rate}</p>
              <p className="mt-2 text-sm font-semibold text-ink-600 dark:text-ink-200">{PRICING.secondary.label}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">{PRICING.secondary.detail}</p>
            </div>
            <div className="mt-6">
              <div className="flex h-3 w-full overflow-hidden rounded-full">
                <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600" style={{ width: '90%' }} />
                <div className="h-full bg-gradient-to-r from-brand-500 to-violet-600" style={{ width: '10%' }} />
              </div>
              <div className="mt-2.5 flex justify-between text-[11px] font-semibold text-ink-400">
                <span>Expert 90%</span>
                <span className="text-brand-600 dark:text-brand-300">SkillSync 10%</span>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400">Year-3 revenue pool</p>
              <p className="mt-1 font-display text-xl font-extrabold text-ink-900 dark:text-white">{MARKET.som.value}</p>
              <p className="text-[11px] text-ink-400">{MARKET.som.math}</p>
              <Link to="/pricing" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-300">
                Full business model <Icon name="ArrowRight" size={12} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

/* ---------------- final CTA ---------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 py-16 sm:py-20">
      <div className="grid-lines absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-10 top-10 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl" aria-hidden="true" />
      <div className="section relative text-center">
        <Tag tone="teal" icon="Rocket" className="mx-auto">Demo prototype · frontend only</Tag>
        <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
          Pick a career goal. Find the gap. Find the person.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
          No signup, no login, no backend. The full SkillSync product surface is open — including the investor dashboards behind it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button to="/dashboard" variant="primary" size="lg" icon="LayoutDashboard" iconRight="ArrowRight" className="shadow-lift">
            Explore SkillSync
          </Button>
          <Button to="/financials" variant="ghost" size="lg" icon="BarChart3" className="border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 hover:text-white dark:border-white/25 dark:bg-white/5 dark:text-white">
            Open investor dashboard
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-white/45">
          <Tooltip label="Data is stored in localStorage on this device only.">
            <span className="inline-flex items-center gap-1.5"><Icon name="Database" size={12} /> Local demo state</span>
          </Tooltip>
          <span className="inline-flex items-center gap-1.5"><Icon name="ShieldCheck" size={12} /> No account required</span>
          <span className="inline-flex items-center gap-1.5"><Icon name="Sparkles" size={12} /> Simulated AI matching</span>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  useHashScroll()
  return (
    <>
      <Hero />
      <Problem />
      <Why />
      <How />
      <ProductPreview />
      <ImpactTeaser />
      <BusinessTeaser />
      <FinalCTA />
    </>
  )
}
