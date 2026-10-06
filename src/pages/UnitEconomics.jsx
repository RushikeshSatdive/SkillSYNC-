import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Note, ProgressBar, ProvenanceTag, SectionHeading, Tabs, Tag, cx,
} from '../components/ui/Kit'
import { ContributionChart, LtvCacChart, RatioGauge } from '../components/ui/Charts'
import { UNIT_ECONOMICS } from '../data/mockData'

function Assumption({ item, tone }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    amberx: 'bg-amberx-500/10 text-amberx-500',
    rose: 'bg-rose-500/10 text-rose-500',
  }
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-100 py-3.5 last:border-0 dark:border-white/10">
      <div className="flex items-start gap-3">
        <span className={cx('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg', tones[tone])}>
          <Icon name="Calculator" size={14} />
        </span>
        <div>
          <p className="text-[13px] font-bold text-ink-800 dark:text-white">{item.label}</p>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-400">{item.note}</p>
        </div>
      </div>
      <p className="tnum shrink-0 text-sm font-extrabold text-ink-900 dark:text-white">{item.value}</p>
    </div>
  )
}

export default function UnitEconomics() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('summary')
  const { annualRevenue, variableCost, contribution, ltv, cac, ltvCac, contributionPct, cacPaybackMonths } = UNIT_ECONOMICS

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Business Model', to: '/pricing' }, { label: 'Unit Economics' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Unit economics"
          title={<>Does one paying student <span className="grad-text">pay for themselves?</span></>}
          lede="Every figure below is a planning assumption built on the proposed ₹99 monthly price. The purpose is to state clearly what has to be true, not to claim what is."
          className="!max-w-3xl"
        />
        <ProvenanceTag kind="modelled" />
      </div>

      {/* headline numbers */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Annual revenue per user', value: annualRevenue, prefix: '₹', tone: 'brand', sub: '₹99 × 12 months' },
          { label: 'Variable cost per user', value: variableCost, prefix: '₹', tone: 'rose', sub: 'Hosting, delivery, support, payments' },
          { label: 'Annual contribution', value: contribution, prefix: '₹', tone: 'teal', sub: `${contributionPct}% contribution margin` },
          { label: 'LTV / CAC', value: ltvCac, suffix: '×', decimals: 1, tone: 'violet', sub: `₹${ltv} LTV vs ₹${cac} CAC` },
        ].map((s, i) => (
          <Card key={s.label} className="animate-fade-up !p-5" style={{ animationDelay: `${i * 55}ms` }}>
            <span className={cx('grid h-10 w-10 place-items-center rounded-xl', {
              brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
              rose: 'bg-rose-500/10 text-rose-500',
              teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
              violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
            }[s.tone])}>
              <Icon name="IndianRupee" size={18} />
            </span>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
            <p className="tnum mt-1 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals || 0} />
            </p>
            <p className="mt-1.5 text-[11px] text-ink-400">{s.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="border-amberx-400/50 bg-amberx-500/5">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-amberx-500" />
          <p className="text-[13px] leading-relaxed text-ink-700 dark:text-ink-100">
            <strong className="font-bold">{UNIT_ECONOMICS.note}</strong> None of these values has been observed in a live cohort, because no
            cohort exists yet. They exist to define the pilot&apos;s measurement plan.
          </p>
        </div>
      </Card>

      {/* charts */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Contribution bridge</h3>
            <Tag tone="teal" icon="Gauge">{contributionPct}% margin</Tag>
          </div>
          <p className="mt-1 text-xs text-ink-400">Annual revenue → variable cost → contribution, per paying user.</p>
          <ContributionChart revenue={annualRevenue} cost={variableCost} height={210} />
          <div className="mt-2 rounded-xl bg-ink-50 p-3 dark:bg-white/5">
            <p className="tnum text-[12px] text-ink-500 dark:text-ink-300">
              ₹{annualRevenue} − ₹{variableCost} = <strong className="font-bold text-ink-900 dark:text-white">₹{contribution}</strong> contribution per user per year
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">LTV vs. CAC</h3>
            <Tag tone="violet" icon="TrendingUp">{ltvCac}× ratio</Tag>
          </div>
          <p className="mt-1 text-xs text-ink-400">Lifetime value against blended campus acquisition cost.</p>
          <LtvCacChart ltv={ltv} cac={cac} height={210} />
          <div className="mt-2 rounded-xl bg-ink-50 p-3 dark:bg-white/5">
            <p className="tnum text-[12px] text-ink-500 dark:text-ink-300">
              ₹{ltv} ÷ ₹{cac} = <strong className="font-bold text-ink-900 dark:text-white">{ltvCac}×</strong> · CAC payback ≈ {cacPaybackMonths} months
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">LTV / CAC gauge</h3>
            <Tag tone="teal" icon="Target">5×+ planning target</Tag>
          </div>
          <p className="mt-1 text-xs text-ink-400">Scale runs from 0 to 8×.</p>
          <RatioGauge value={ltvCac} max={8} height={210} />
          <div className="mt-2 space-y-1.5">
            {UNIT_ECONOMICS.ltvCacBands.map((b) => (
              <div key={b.label} className={cx('flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[11.5px]', {
                rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
                amberx: 'bg-amberx-500/10 text-amberx-500',
                teal: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
              }[b.tone])}>
                <strong className="shrink-0 font-bold">{b.label}</strong>
                <span className="leading-snug">{b.body}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* assumptions table */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="ink" icon="ClipboardList">Assumption ledger</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Every number, with its derivation</h3>
          </div>
          <Tabs
            size="sm"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'summary', label: 'Summary' },
              { id: 'detail', label: 'Detail' },
            ]}
          />
        </div>

        {tab === 'summary' ? (
          <div className="mt-4">
            {UNIT_ECONOMICS.detail.map((d, i) => (
              <Assumption key={d.label} item={d} tone={['brand', 'rose', 'teal', 'violet', 'amberx', 'teal'][i] || 'brand'} />
            ))}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {UNIT_ECONOMICS.detail.map((d) => (
              <div key={d.label} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13px] font-bold text-ink-800 dark:text-white">{d.label}</p>
                  <p className="tnum text-sm font-extrabold text-brand-600 dark:text-brand-300">{d.value}</p>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{d.note}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* what has to be true */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeading eyebrow="Requirements" title="What has to be true for this to hold" provenance="modelled" />
          <ul className="mt-5 space-y-3.5">
            {[
              { title: 'Retention of at least 2.5 years', body: 'The ₹2,370 LTV assumes a 2.5-year average paying life. If retention is one year, LTV falls to ₹948 and the ratio drops to 2.1×.', tone: 'rose' },
              { title: 'Variable cost stays near ₹240', body: 'Heavy video delivery or one-to-one human support would push variable cost up fast and compress the contribution line.', tone: 'amberx' },
              { title: 'CAC holds at ₹450 blended', body: 'Ambassador and referral-led acquisition is cheap. Paid social at scale is not, and would move this line materially.', tone: 'rose' },
              { title: 'Free tier stays liquid', body: 'If exchange volume falls, the reason students open the product disappears — and so does the upgrade path.', tone: 'amberx' },
            ].map((r) => (
              <li key={r.title} className="flex items-start gap-3">
                <span className={cx('mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg', {
                  rose: 'bg-rose-500/10 text-rose-500',
                  amberx: 'bg-amberx-500/10 text-amberx-500',
                }[r.tone])}>
                  <Icon name="AlertTriangle" size={13} />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-ink-800 dark:text-white">{r.title}</span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{r.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <Note className="mt-5">Each requirement maps to a measurable pilot metric, which is what the ₹25 lakh raise is intended to fund.</Note>
        </Card>

        <Card>
          <SectionHeading eyebrow="Downside case" title="What if the assumptions are wrong?" provenance="illustrative" />
          <div className="mt-5 space-y-4">
            {[
              { label: 'Base case (₹99/month)', ltv: 2370, cac: 450, ratio: '5.3×', value: 5.3, tone: 'teal' },
              { label: '1-year retention only', ltv: 948, cac: 450, ratio: '2.1×', value: 2.1, tone: 'amberx' },
              { label: 'CAC rises to ₹900', ltv: 2370, cac: 900, ratio: '2.6×', value: 2.6, tone: 'rose' },
              { label: 'Variable cost rises to ₹600', ltv: 1470, cac: 450, ratio: '3.3×', value: 3.3, tone: 'amberx' },
            ].map((row) => (
              <div key={row.label} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[13px] font-bold text-ink-800 dark:text-white">{row.label}</span>
                  <span className={cx('tnum text-sm font-extrabold', {
                    teal: 'text-teal-600 dark:text-teal-300',
                    amberx: 'text-amberx-500',
                    rose: 'text-rose-500',
                  }[row.tone])}>
                    {row.ratio}
                  </span>
                </div>
                <p className="tnum mt-1 text-[11.5px] text-ink-400">LTV ₹{row.ltv} ÷ CAC ₹{row.cac}</p>
                <ProgressBar value={row.value} max={8} tone={row.tone === 'amberx' ? 'amberx' : row.tone} height="h-1.5" className="mt-3" />
              </div>
            ))}
          </div>
          <Note className="mt-5">Sensitivity is shown so the model can be challenged, not to suggest these outcomes have been tested.</Note>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Tag tone="ink" icon="ArrowRight">Next</Tag>
            <p className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">From unit economics to a three-year model</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Multiplied across 5,000, 15,000 and 35,000 paying users.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" icon="BarChart3" onClick={() => navigate('/financials')}>Financial projections</Button>
            <Button variant="ghost" icon="Coins" onClick={() => navigate('/funding')}>Funding ask</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
