import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Note, ProgressBar, ProvenanceTag, SectionHeading, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { MARKET, PROBLEM_STATS } from '../data/mockData'

function MarketCard({ tier, active, onSelect }) {
  const isActive = active === tier.id
  const tones = {
    tam: { bar: 'from-brand-500 to-brand-700', text: 'text-brand-600 dark:text-brand-300', bg: 'bg-brand-50 dark:bg-brand-500/15' },
    sam: { bar: 'from-violet-500 to-brand-600', text: 'text-violet-600 dark:text-violet-300', bg: 'bg-violet-500/10' },
    som: { bar: 'from-teal-400 to-teal-600', text: 'text-teal-600 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-500/15' },
  }
  const t = tones[tier.id]
  return (
    <button
      type="button"
      onClick={() => onSelect(tier.id)}
      aria-pressed={isActive}
      className={cx(
        'card card-hover flex flex-col p-5 text-left',
        isActive && 'border-brand-300 ring-2 ring-brand-500/20 dark:border-brand-400/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cx('label-badge', t.bg, t.text)}>{tier.label}</span>
        <Icon name={tier.id === 'som' ? 'Target' : 'Globe'} size={17} className={t.text} />
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-ink-400">{tier.sub}</p>
      <p className="mt-1.5 font-display text-2xl font-extrabold text-ink-900 dark:text-white sm:text-3xl">{tier.value}</p>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{tier.math}</p>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
        <div className={cx('h-full rounded-full bg-gradient-to-r', t.bar)} style={{ width: tier.id === 'tam' ? '100%' : tier.id === 'sam' ? '20%' : '0.9%' }} />
      </div>
      <p className="mt-2 text-[10.5px] font-semibold text-ink-400">
        {tier.id === 'tam' ? 'Full revenue pool' : tier.id === 'sam' ? '20% of TAM pool' : '0.08% of TAM pool'}
      </p>
    </button>
  )
}

export default function Market() {
  const navigate = useNavigate()
  const [active, setActive] = useState('tam')

  const tiers = [MARKET.tam, MARKET.sam, MARKET.som]
  const current = tiers.find((t) => t.id === active)

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Market Opportunity' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Market opportunity"
          title={<>Sizing a <span className="grad-text">₹5,144 crore</span> revenue pool</>}
          lede={MARKET.noteDetail}
          className="!max-w-3xl"
        />
        <ProvenanceTag kind="illustrative" />
      </div>

      {/* inputs */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag tone="teal" icon="ShieldCheck">Inputs from source data</Tag>
            <span className="text-[11px] font-semibold text-ink-400">AISHE 2021–22 · India Skills Report 2025</span>
          </div>
          <ProvenanceTag kind="source" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {PROBLEM_STATS.map((s) => (
            <div key={s.id} className="rounded-2xl bg-gradient-to-br from-ink-50 to-white p-4 dark:from-white/5 dark:to-transparent">
              <p className="tnum font-display text-2xl font-extrabold text-ink-900 dark:text-white">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink-600 dark:text-ink-200">{s.label}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-300">{s.source}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Proposed annual price point', value: '₹1,188', note: '₹99/month × 12 — proposed pricing', tone: 'brand' },
            { label: 'Reachable share at launch', value: '20%', note: 'Of the 86.6 lakh serviceable base', tone: 'violet' },
            { label: 'Year-3 paying users', value: '35,000', note: 'Future target, not current traction', tone: 'teal' },
          ].map((i) => (
            <div key={i.label} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{i.label}</p>
              <p className="tnum mt-1.5 font-display text-xl font-extrabold text-ink-900 dark:text-white">{i.value}</p>
              <p className="mt-1.5 text-[11px] text-ink-400">{i.note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* TAM SAM SOM */}
      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((t) => <MarketCard key={t.id} tier={t} active={active} onSelect={setActive} />)}
      </div>

      {/* visual funnel */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="brand" icon="Filter">Pool narrowing</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">
              {current.label} at a glance — {current.value}
            </h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{current.math}</p>
          </div>
          <span className="text-[11px] font-semibold text-ink-400">Bars are scaled to the TAM pool</span>
        </div>

        <ul className="mt-6 space-y-5">
          {MARKET.funnelOfPool.map((f) => (
            <li key={f.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[13px] font-bold text-ink-800 dark:text-white">{f.label}</span>
                <span className="tnum text-[12px] font-bold text-ink-500 dark:text-ink-300">{f.value}</span>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                <div
                  className={cx('h-full rounded-full bg-gradient-to-r transition-[width] duration-700', {
                    brand: 'from-brand-500 to-brand-700',
                    violet: 'from-violet-500 to-brand-600',
                    teal: 'from-teal-400 to-teal-600',
                  }[f.tone])}
                  style={{ width: `${f.width}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <Note className="mt-5">
          The pool is a modelled revenue pool, not contracted demand. Because the price point is proposed rather than observed, the pool moves
          directly with it: halving the price halves the TAM, SAM and SOM values.
        </Note>
      </Card>

      {/* reconciliation */}
      <Card className="border-amberx-400/50 bg-amberx-500/5">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amberx-500/15 text-amberx-500">
            <Icon name="AlertTriangle" size={20} />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">SOM correction — read this before quoting a number</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600 dark:text-ink-200">{MARKET.reconciliation}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/70 p-3 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">35,000 users</p>
                <p className="tnum mt-1 text-sm font-bold text-ink-900 dark:text-white">× ₹1,188</p>
              </div>
              <div className="grid place-items-center rounded-xl bg-white/70 p-3 dark:bg-white/5">
                <Icon name="ArrowRight" size={18} className="text-ink-400" />
              </div>
              <div className="rounded-xl bg-teal-500/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Correct Year-3 SOM</p>
                <p className="tnum mt-1 text-sm font-bold text-ink-900 dark:text-white">₹4.158 crore</p>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-ink-500 dark:text-ink-300">
              ₹41.6 crore appears in an earlier version of the deck. It is not used anywhere in this prototype.
            </p>
          </div>
        </div>
      </Card>

      {/* sensitivity */}
      <Card>
        <SectionHeading
          eyebrow="Sensitivity"
          title="How the pool moves with price and reach"
          lede="Two variables drive almost all of the market number: the price point and the share of the serviceable base you can reach."
          provenance="illustrative"
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <caption className="sr-only">Year-3 revenue pool sensitivity to price point and reachable share</caption>
            <thead>
              <tr className="border-b border-ink-100 dark:border-white/10">
                <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-ink-400">Annual price</th>
                <th scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-ink-400">TAM (4.33 crore students)</th>
                <th scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-ink-400">SAM (20% reachable)</th>
                <th scope="col" className="py-3 pl-4 text-xs font-bold uppercase tracking-wider text-ink-400">SOM (35,000 users)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { price: 588, label: '₹588 / year (₹49 per month)', tam: '₹2,572 cr', sam: '₹514.4 cr', som: '₹2.06 cr', highlight: false },
                { price: 1188, label: '₹1,188 / year (₹99 per month) — proposed', tam: '₹5,144 cr', sam: '₹1,029 cr', som: '₹4.158 cr', highlight: true },
                { price: 1788, label: '₹1,788 / year (₹149 per month)', tam: '₹7,742 cr', sam: '₹1,548 cr', som: '₹6.26 cr', highlight: false },
              ].map((row) => (
                <tr key={row.price} className={cx('border-b border-ink-50 last:border-0 dark:border-white/5', row.highlight && 'bg-brand-50/60 dark:bg-brand-500/10')}>
                  <th scope="row" className="py-3.5 pr-4 text-[13px] font-semibold text-ink-700 dark:text-ink-100">
                    {row.label}
                    {row.highlight ? <span className="ml-2 label-badge bg-brand-600 text-white">Used</span> : null}
                  </th>
                  <td className="tnum py-3.5 px-4 text-[13px] font-bold text-ink-800 dark:text-white">{row.tam}</td>
                  <td className="tnum py-3.5 px-4 text-[13px] font-bold text-ink-800 dark:text-white">{row.sam}</td>
                  <td className="tnum py-3.5 pl-4 text-[13px] font-bold text-ink-800 dark:text-white">{row.som}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { icon: 'Info', title: 'What is solid', body: 'The student population and enrolment ratio come from AISHE. The employability figure comes from India Skills Report 2025.' },
            { icon: 'AlertTriangle', title: 'What is assumed', body: 'The ₹1,188 price point and the 20% reachable share are both proposals, not observations.' },
            { icon: 'Target', title: 'What to validate', body: 'Willingness to pay at ₹99/month, and whether 20% of the serviceable base can actually be reached at launch.' },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <Icon name={c.icon} size={17} className="text-brand-600 dark:text-brand-300" />
              <p className="mt-3 text-[13px] font-bold text-ink-900 dark:text-white">{c.title}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{c.body}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* next steps */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Tag tone="ink" icon="ArrowRight">Keep going</Tag>
            <p className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">See how the pool converts into revenue per user</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Contribution, LTV and CAC are the bridge between market size and a viable business.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" icon="Gauge" onClick={() => navigate('/unit-economics')}>Unit economics</Button>
            <Button variant="ghost" icon="Rocket" onClick={() => navigate('/go-to-market')}>Go-to-market</Button>
            <Button variant="ghost" icon="BarChart3" onClick={() => navigate('/financials')}>Financials</Button>
          </div>
        </div>
        <div className="mt-5">
          <ProgressBar value={MARKET.sam.pill} max={MARKET.tam.pill} tone="violet" label="SAM as a share of TAM revenue pool" showValue />
        </div>
        <Tooltip label="SAM / TAM = ₹1,029 crore ÷ ₹5,144 crore = 20%">
          <span className="mt-3 inline-flex cursor-help items-center gap-1.5 text-[11px] font-semibold text-ink-400">
            <Icon name="Info" size={11} /> Sensitivity to the reachable-share assumption
          </span>
        </Tooltip>
      </Card>
    </div>
  )
}
