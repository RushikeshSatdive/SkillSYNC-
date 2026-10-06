import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Note, ProgressBar, ProvenanceTag, SectionHeading, Tabs, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { DonutChart } from '../components/ui/Charts'
import { useApp } from '../context/AppContext'
import { FINANCIALS, FUNDING, TEAM } from '../data/mockData'

const TONE_COLORS = ['#6366F1', '#8B5CF6', '#14B8A6', '#F59E0B', '#0EA5E9']

const MILESTONES = [
  { id: 'm1', label: 'Matching engine v1 in production', amount: '₹7.5 lakh', pct: 30, where: 'Product' },
  { id: 'm2', label: '5-campus Pune pilot completed', amount: '₹3.75 lakh', pct: 15, where: 'Pilot' },
  { id: 'm3', label: 'CAC and retention measured, not assumed', amount: '₹3 lakh', pct: 12, where: 'PMF validation' },
  { id: 'm4', label: '1,500 activated students acquired', amount: '₹8.75 lakh', pct: 35, where: 'Acquisition' },
  { id: 'm5', label: 'Scale decisions funded from evidence', amount: '₹2 lakh', pct: 8, where: 'Scale' },
]

export default function Funding() {
  const { toast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('use')

  const totalCheck = MILESTONES.reduce((a, m) => a + m.pct, 0)

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Financial Projections', to: '/financials' }, { label: 'Funding' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Funding"
          title={<>Raising <span className="grad-text">₹25 lakh</span> for {FUNDING.equity} equity</>}
          lede="A small, milestone-linked round intended to move SkillSync from a working prototype to a measured pilot with real acquisition and retention numbers."
          className="!max-w-3xl"
        />
        <ProvenanceTag kind="proposed" />
      </div>

      {/* headline */}
      <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 p-6 text-white shadow-card sm:p-8">
        <div className="grid-lines absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-8 top-0 h-52 w-52 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="label-badge bg-white/15 text-white"><Icon name="Coins" size={11} /> Funding sought</span>
            <p className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
              <Counter value={25} prefix="₹" suffix=" lakh" />
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              For <strong className="font-bold text-white">{FUNDING.equity} equity</strong>, implying a {FUNDING.postMoney} post-money and a{' '}
              {FUNDING.preMoney} pre-money valuation. {FUNDING.productPlusAcquisition}% of the raise is allocated to product and acquisition.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="primary" icon="Send" onClick={() => toast({ title: 'Interest noted (simulated)', body: 'No data leaves your browser. This demo does not submit anything.', tone: 'violet', icon: 'Send' })}>
                Register interest
              </Button>
              <Button variant="ghost" icon="FileText" className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white dark:border-white/25 dark:bg-white/5 dark:text-white">
                Data room (demo)
              </Button>
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-amberx-400">{FUNDING.note}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Funding sought', value: '₹25 lakh' },
              { label: 'Equity offered', value: '10%' },
              { label: 'Implied post-money', value: '₹2.5 crore' },
              { label: 'Implied pre-money', value: '₹2.25 crore' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">{s.label}</p>
                <p className="tnum mt-1.5 font-display text-lg font-extrabold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* valuation maths */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="brand" icon="Calculator">Valuation maths</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">How ₹25 lakh at 10% becomes ₹2.5 crore</h3>
          </div>
          <ProvenanceTag kind="proposed" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Post-money valuation', formula: '₹25 lakh ÷ 10%', result: '₹2.5 crore', note: 'The value of the company after the money is in.', tone: 'brand' },
            { label: 'Pre-money valuation', formula: '₹2.5 crore − ₹25 lakh', result: '₹2.25 crore', note: 'The value agreed before this round.', tone: 'violet' },
            { label: 'Dilution implied', formula: '10% new shares', result: '10% of post', note: 'Founders hold the remaining 90% on a fully diluted basis.', tone: 'teal' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-ink-100 p-5 dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
              <p className="tnum mt-2 text-[12.5px] font-semibold text-ink-500 dark:text-ink-300">{s.formula}</p>
              <p className={cx('tnum mt-2 font-display text-2xl font-extrabold', {
                brand: 'text-brand-600 dark:text-brand-300',
                violet: 'text-violet-600 dark:text-violet-300',
                teal: 'text-teal-600 dark:text-teal-300',
              }[s.tone])}>
                {s.result}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-400">{s.note}</p>
            </div>
          ))}
        </div>
        <Note className="mt-5">
          Valuation is a negotiated outcome, not a calculation. The ₹2.5 crore post-money figure is what this specific ask implies — it is not
          a claim about market value.
        </Note>
      </Card>

      {/* use of funds */}
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Tag tone="violet" icon="PieChart">Use of funds</Tag>
              <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Where the ₹25 lakh goes</h3>
            </div>
            <span className="tnum rounded-lg bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
              {FUNDING.productPlusAcquisition}% to product + acquisition
            </span>
          </div>

          <DonutChart
            data={FUNDING.useOfFunds.map((u) => ({ label: u.label, value: u.value }))}
            height={250}
            centerLabel={`${FUNDING.productPlusAcquisition}%`}
            centerSub="Product + growth"
            colors={TONE_COLORS}
          />

          <ul className="mt-4 space-y-3">
            {FUNDING.useOfFunds.map((u, i) => (
              <li key={u.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-ink-700 dark:text-ink-100">
                    <span className="grid h-6 w-6 place-items-center rounded-md" style={{ background: `${TONE_COLORS[i]}22` }}>
                      <Icon name={u.icon} size={13} style={{ color: TONE_COLORS[i] }} />
                    </span>
                    {u.label}
                  </span>
                  <span className="tnum text-[12.5px] font-bold text-ink-900 dark:text-white">
                    {u.value}% · ₹{((25 * u.value) / 100).toFixed(2)} lakh
                  </span>
                </div>
                <ProgressBar value={u.value} max={35} tone={['brand', 'violet', 'teal', 'amberx', 'sky'][i]} height="h-1.5" className="mt-2" />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Tag tone="teal" icon="Target">Milestone-linked allocation</Tag>
              <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Tranches tied to evidence</h3>
            </div>
            <Tabs
              size="sm"
              value={tab}
              onChange={setTab}
              tabs={[
                { id: 'use', label: 'By category' },
                { id: 'milestone', label: 'By milestone' },
              ]}
            />
          </div>

          <ul className="mt-5 space-y-3">
            {MILESTONES.map((m) => (
              <li key={m.id} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300">
                      <Icon name="CheckCircle2" size={14} />
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-ink-800 dark:text-white">{m.label}</p>
                      <p className="mt-0.5 text-[11px] text-ink-400">{m.where} · {m.pct}% of raise</p>
                    </div>
                  </div>
                  <span className="tnum text-[12.5px] font-bold text-ink-900 dark:text-white">{m.amount}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-semibold text-ink-500 dark:text-ink-300">Allocation check</span>
              <span className={cx('tnum text-[12px] font-bold', totalCheck === 100 ? 'text-teal-600 dark:text-teal-300' : 'text-rose-500')}>
                {totalCheck}% of the raise allocated
              </span>
            </div>
            <ProgressBar value={totalCheck} tone="teal" height="h-1.5" className="mt-2.5" />
          </div>
          <Note className="mt-4">
            Tranche release is a proposal for discussion. Nothing here is a signed term, and no investor has committed to this round.
          </Note>
        </Card>
      </div>

      {/* what it buys */}
      <Card>
        <SectionHeading
          eyebrow="Investor lens"
          title="What specifically changes with ₹25 lakh"
          lede="Each line below is a measurable state change, not a spending category. If a milestone is not met, the next tranche is reconsidered."
          provenance="proposed"
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink-100 p-5 dark:border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Today</p>
            <ul className="mt-3 space-y-2.5">
              {[
                'Working frontend prototype across 20 product surfaces',
                'Rule-based matching with fixed weightings',
                'Illustrative market, unit-economic and financial models',
                'Zero users, zero revenue, zero partnerships',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-ink-500 dark:text-ink-300">
                  <Icon name="Circle" size={13} className="mt-0.5 shrink-0 text-ink-300" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-teal-300/50 bg-teal-50/50 p-5 dark:border-teal-400/25 dark:bg-teal-500/10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">After the round (target)</p>
            <ul className="mt-3 space-y-2.5">
              {[
                'Matching engine v1 with measured match acceptance rate',
                '1,500 activated students across 5–25 campuses',
                'Observed CAC, retention and conversion replacing assumptions',
                '8 campus partnerships and a functioning ambassador model',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[12.5px] font-medium leading-snug text-ink-700 dark:text-ink-100">
                  <Icon name="CheckCircle2" size={13} className="mt-0.5 shrink-0 text-teal-500" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* returns framing + team */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <Tag tone="teal" icon="TrendingUp">Return framing</Tag>
          <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">The case at Year 3</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">
            On the modelled Year-3 net income of ₹212.8 lakh, a ₹2.5 crore post-money entry implies roughly a{' '}
            <strong className="font-bold text-ink-800 dark:text-white">8.5× earnings multiple</strong> at that point — before any exit
            multiple is applied.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Year-3 net income</p>
              <p className="tnum mt-1 font-display text-lg font-extrabold text-ink-900 dark:text-white">{FINANCIALS.years[2].netLabel}</p>
            </div>
            <div className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Implied multiple</p>
              <p className="tnum mt-1 font-display text-lg font-extrabold text-ink-900 dark:text-white">≈ 8.5×</p>
            </div>
          </div>
          <Note className="mt-4">
            This is arithmetic on an illustrative projection, not a forecast of returns. The projection itself has not been validated.
          </Note>
        </Card>

        <Card>
          <Tag tone="ink" icon="Users">Who is asking</Tag>
          <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">The founding team</h3>
          <ul className="mt-5 space-y-4">
            {TEAM.map((t) => (
              <li key={t.id} className="flex items-start gap-3.5">
                <span className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display text-base font-bold text-white', t.tone)}>
                  {t.initials}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-bold text-ink-900 dark:text-white">{t.name}</span>
                    <Tag tone="brand">{t.role}</Tag>
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {t.focus.map((f) => (
                      <span key={f} className="rounded-full bg-ink-100 px-2.5 py-1 text-[10.5px] font-semibold text-ink-600 dark:bg-white/10 dark:text-ink-200">{f}</span>
                    ))}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" icon="Info" onClick={() => navigate('/about')}>About SkillSync</Button>
            <Button
              size="sm"
              variant="primary"
              icon="Mail"
              onClick={() => toast({ title: 'Intro request simulated', body: 'No email is sent — this prototype has no backend and no contact form.', tone: 'violet', icon: 'Mail' })}
            >
              Request an intro
            </Button>
          </div>
        </Card>
      </div>

      {/* risk disclosure */}
      <Card className="border-rose-300/50 bg-rose-500/5">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
            <Icon name="AlertTriangle" size={20} />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Risk disclosure for this page</h3>
            <ul className="mt-3 space-y-2">
              {[
                'SkillSync is a student project presented as a demonstration prototype. It is not an incorporated fundraising vehicle.',
                'No revenue, users or partnerships exist. Every projection on this site is illustrative.',
                'Nothing on this page is an offer to sell securities or a solicitation to invest.',
                'Valuation, equity and use-of-funds figures are founder proposals for discussion, not committed terms.',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-200">
                  <Icon name="Info" size={13} className="mt-1 shrink-0 text-rose-500" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Tooltip label="The raise covers the modelled Year-1 loss plus the Year-2 product build, which is why it exceeds the Year-1 deficit.">
        <span className="inline-flex cursor-help items-center gap-1.5 text-[11px] font-semibold text-ink-400">
          <Icon name="Info" size={11} /> Cross-check against the three-year model
        </span>
      </Tooltip>
    </div>
  )
}
