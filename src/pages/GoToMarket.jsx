import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Note, ProgressBar, ProvenanceTag, SectionHeading, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { GTM } from '../data/mockData'

const PHASES = [
  {
    id: 'p1',
    phase: 'Phase 1',
    window: 'Months 0–3',
    title: 'Five campuses, one city',
    body: 'Hand-recruit ambassadors at five Pune campuses. Run one workshop per campus per month. Manual matching to protect quality.',
    metrics: [
      { label: 'Campuses', target: 5 },
      { label: 'Ambassadors', target: 10 },
      { label: 'Workshops', target: 15 },
    ],
    status: 'planned',
  },
  {
    id: 'p2',
    phase: 'Phase 2',
    window: 'Months 4–9',
    title: 'Placement cells and clubs',
    body: 'Convert campus workshops into club partnerships and placement-cell pilots. Introduce skill challenges as the weekly retention loop.',
    metrics: [
      { label: 'Campuses', target: 25 },
      { label: 'Partnerships', target: 8 },
      { label: 'Challenges run', target: 24 },
    ],
    status: 'planned',
  },
  {
    id: 'p3',
    phase: 'Phase 3',
    window: 'Months 10–18',
    title: 'Multi-city, referral-led',
    body: 'Referral and peer invitations take over from ambassador-led acquisition. Paid premium becomes the primary revenue line.',
    metrics: [
      { label: 'Campuses', target: 100 },
      { label: 'Partnerships', target: 25 },
      { label: 'Referral share of signups', target: 40, suffix: '%' },
    ],
    status: 'planned',
  },
]

const toneBg = {
  brand: 'from-brand-500 to-brand-700',
  violet: 'from-violet-500 to-brand-600',
  teal: 'from-teal-400 to-teal-600',
  amberx: 'from-amberx-400 to-amberx-500',
  rose: 'from-rose-400 to-rose-500',
  sky: 'from-sky-400 to-brand-500',
}

export default function GoToMarket() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Go-To-Market' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Go-to-market"
          title={<>Campus-led acquisition, <span className="grad-text">referral-fed</span> growth</>}
          lede="SkillSync is sold the way it spreads: a student shows a peer what they learned, and the peer already has someone to learn from. Everything below is a future target."
          className="!max-w-3xl"
        />
        <ProvenanceTag kind="target" />
      </div>

      {/* channels */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="brand" icon="Megaphone">Acquisition channels</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Eight routes into a campus</h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Two are low-effort and compounding (referrals, peer invitations). The rest buy reach.</p>
          </div>
          <Note className="!mt-0">Effort ratings are estimates for the pilot, not measured values.</Note>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {GTM.channels.map((c, i) => (
            <li
              key={c.id}
              className="group rounded-2xl border border-ink-100 p-4 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft dark:border-white/10 dark:hover:border-brand-400/40 animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className={cx('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-soft', toneBg[c.tone])}>
                <Icon name={c.icon} size={18} />
              </span>
              <p className="mt-4 text-[13.5px] font-bold text-ink-900 dark:text-white">{c.name}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{c.reach}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <Tooltip label={`Estimated effort to run: ${c.effort}`}>
                  <span className={cx('cursor-help rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider', {
                    'bg-rose-500/10 text-rose-500': c.effort === 'High' || c.effort === 'High touch',
                    'bg-amberx-500/10 text-amberx-500': c.effort === 'Medium',
                    'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300': c.effort === 'Low',
                  })}>
                    {c.effort} effort
                  </span>
                </Tooltip>
                <Icon name="ArrowRight" size={14} className={cx('transition', hovered === c.id ? 'translate-x-1 text-brand-600' : 'text-ink-300')} />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* funnel */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="violet" icon="Filter">Acquisition funnel</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Registered → Active → Paying</h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">The Year-1 conversion ladder. Each stage has a defined definition so it can be measured.</p>
          </div>
          <ProvenanceTag kind="target" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <ul className="space-y-4">
            {GTM.funnel.map((f, i) => {
              const pct = (f.value / GTM.funnel[0].value) * 100
              const conv = i === 0 ? 100 : (f.value / GTM.funnel[i - 1].value) * 100
              return (
                <li key={f.stage}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="tnum grid h-6 w-6 place-items-center rounded-lg bg-ink-100 text-[10px] font-bold text-ink-500 dark:bg-white/10 dark:text-ink-200">{i + 1}</span>
                      <span className="text-[14px] font-bold text-ink-900 dark:text-white">{f.stage}</span>
                    </div>
                    <span className="tnum font-display text-lg font-extrabold text-ink-900 dark:text-white">{f.value.toLocaleString('en-IN')}</span>
                  </div>
                  <div
                    className="mt-2.5 h-11 w-full overflow-hidden rounded-xl bg-ink-100 dark:bg-white/10"
                    role="img"
                    aria-label={`${f.stage}: ${f.value} users, ${Math.round(conv)}% of previous stage`}
                  >
                    <div
                      className={cx('h-full rounded-xl bg-gradient-to-r transition-[width] duration-700', toneBg[f.tone])}
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="text-ink-400">{f.note}</span>
                    <span className="font-bold text-ink-500 dark:text-ink-300">
                      {i === 0 ? 'Entry point' : `${Math.round(conv)}% of previous stage`}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="space-y-4">
            <div className="rounded-2xl border border-ink-100 p-5 dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Funnel maths</p>
              <ul className="mt-3 space-y-2 text-[12.5px]">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-ink-500 dark:text-ink-300">Registered → Active</span>
                  <span className="tnum font-bold text-ink-900 dark:text-white">30%</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-ink-500 dark:text-ink-300">Active → Paying</span>
                  <span className="tnum font-bold text-ink-900 dark:text-white">33%</span>
                </li>
                <li className="flex items-center justify-between gap-3 border-t border-ink-100 pt-2 dark:border-white/10">
                  <span className="font-semibold text-ink-600 dark:text-ink-200">Registered → Paying</span>
                  <span className="tnum font-bold text-brand-600 dark:text-brand-300">10%</span>
                </li>
              </ul>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
                A 10% registered-to-paying rate is aggressive for a student product. It is the single assumption most worth testing in the pilot.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {GTM.targets.map((t) => (
                <div key={t.label} className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-5 text-white">
                  <Icon name={t.icon} size={18} className="text-teal-300" />
                  <p className="tnum mt-3 font-display text-3xl font-extrabold">
                    <Counter value={t.value} suffix={t.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/70">{t.label}</p>
                </div>
              ))}
            </div>
            <p className="rounded-xl bg-amberx-500/10 px-3.5 py-2.5 text-[11.5px] font-semibold text-amberx-500">
              {GTM.note}
            </p>
          </div>
        </div>
      </Card>

      {/* phases */}
      <Card>
        <SectionHeading eyebrow="Sequence" title="Eighteen months in three phases" lede="Each phase has an exit criterion. If the criterion is not met, the next phase does not start." provenance="target" />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {PHASES.map((p, i) => (
            <div key={p.id} className="relative rounded-2xl border border-ink-100 p-5 dark:border-white/10 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-center justify-between gap-3">
                <span className="label-badge bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">{p.phase}</span>
                <span className="text-[11px] font-semibold text-ink-400">{p.window}</span>
              </div>
              <h3 className="mt-4 font-display text-[15px] font-bold text-ink-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{p.body}</p>
              <ul className="mt-4 space-y-2.5">
                {p.metrics.map((m) => (
                  <li key={m.label}>
                    <div className="flex items-baseline justify-between gap-2 text-[11.5px]">
                      <span className="text-ink-500 dark:text-ink-300">{m.label}</span>
                      <span className="tnum font-bold text-ink-900 dark:text-white">{m.target}{m.suffix || ''}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-ink-100 pt-3 dark:border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Exit criterion</p>
                <p className="mt-1 text-[11.5px] leading-snug text-ink-500 dark:text-ink-300">
                  {i === 0
                    ? '40% of workshop attendees complete one 20-minute activity within a week.'
                    : i === 1
                    ? 'Two club partnerships each contribute 250 activated students.'
                    : 'Referrals account for 40% of new signups without paid spend.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* retention loop */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <Tag tone="teal" icon="RefreshCw">Retention loop</Tag>
          <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Why a student comes back on Tuesday</h3>
          <ul className="mt-5 space-y-3.5">
            {[
              { icon: 'Timer', title: 'A 20-minute task they can finish', body: 'Short enough to start between lectures, real enough to produce a reviewable deliverable.' },
              { icon: 'Users', title: 'Someone expecting them', body: 'An exchange partner and a weekly session create lightweight accountability.' },
              { icon: 'TrendingUp', title: 'A number that moves', body: 'Career readiness and step progress only move when work is logged, so progress is earned.' },
              { icon: 'Trophy', title: 'A weekly challenge', body: 'Cohort challenges give a shared deadline and a visible leaderboard.' },
            ].map((r) => (
              <li key={r.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300">
                  <Icon name={r.icon} size={15} />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-ink-800 dark:text-white">{r.title}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{r.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <Tag tone="amber" icon="AlertTriangle">Risks to the plan</Tag>
          <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">What could break acquisition</h3>
          <ul className="mt-5 space-y-3.5">
            {[
              { title: 'Ambassador churn each semester', body: 'Student turnover is constant. The ambassador model needs a handover process, not just a recruitment process.' },
              { title: 'Semester seasonality', body: 'Exam months will depress activity. The model should not assume flat monthly engagement.' },
              { title: 'Conversion to paid is unproven', body: 'Students pay for outcomes. Until placements or interviews are attributed to SkillSync, ₹99 will be a hard ask.' },
              { title: 'Cold-start per campus', body: 'A skill network only works where there is density. Fifty thin campuses perform worse than five dense ones.' },
            ].map((r) => (
              <li key={r.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
                  <Icon name="AlertTriangle" size={15} />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-ink-800 dark:text-white">{r.title}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{r.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Tag tone="ink" icon="ArrowRight">Next</Tag>
            <p className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">What this funnel produces in revenue</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Paying-user targets translate directly into the three-year financial model.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" icon="BarChart3" onClick={() => navigate('/financials')}>Financial projections</Button>
            <Button variant="ghost" icon="Gauge" onClick={() => navigate('/unit-economics')}>Unit economics</Button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Year 1 paying users', value: 5000 },
            { label: 'Year 2 paying users', value: 15000 },
            { label: 'Year 3 paying users', value: 35000 },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11.5px] font-semibold text-ink-500 dark:text-ink-300">{s.label}</span>
                <span className="tnum text-[12px] font-bold text-ink-900 dark:text-white">{s.value.toLocaleString('en-IN')}</span>
              </div>
              <ProgressBar value={s.value} max={35000} tone="violet" height="h-1.5" className="mt-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
