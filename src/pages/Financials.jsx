import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Counter, Note, ProgressBar, ProvenanceTag, SectionHeading, Tabs, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { NetIncomeChart, NetMarginChart, RevenueExpenseChart, UsersBarChart } from '../components/ui/Charts'
import { FINANCIALS } from '../data/mockData'

const { years } = FINANCIALS

export default function Financials() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('y1')
  const y = years.find((x) => x.id === selected)

  const maxRevenue = Math.max(...years.map((x) => x.revenue))

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Financial Projections' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Financial projections"
          title={<>Three years, from <span className="grad-text">-₹15.6 lakh</span> to <span className="grad-text">₹212.8 lakh</span></>}
          lede={FINANCIALS.noteDetail}
          className="!max-w-3xl"
        />
        <ProvenanceTag kind="illustrative" />
      </div>

      <Card className="border-amberx-400/50 bg-amberx-500/5">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={18} className="mt-0.5 shrink-0 text-amberx-500" />
          <p className="text-[13px] leading-relaxed text-ink-700 dark:text-ink-100">
            <strong className="font-bold">{FINANCIALS.note}</strong> These figures are modelled, not reported. SkillSync has no revenue, no
            paying users and no operating history.
          </p>
        </div>
      </Card>

      {/* year selector */}
      <div className="grid gap-4 lg:grid-cols-3">
        {years.map((yr) => {
          const isActive = yr.id === selected
          const profitable = yr.netIncome >= 0
          return (
            <button
              key={yr.id}
              type="button"
              onClick={() => setSelected(yr.id)}
              aria-pressed={isActive}
              className={cx(
                'card card-hover p-5 text-left',
                isActive && 'border-brand-300 ring-2 ring-brand-500/20 dark:border-brand-400/40',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={cx('label-badge', isActive ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-200')}>{yr.year}</span>
                <span className={cx('label-badge', profitable ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : 'bg-rose-500/10 text-rose-500')}>
                  {profitable ? 'Profitable' : 'Loss-making'}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-extrabold text-ink-900 dark:text-white">{yr.revenueLabel}</p>
              <p className="mt-1 text-[11.5px] text-ink-400">Revenue · {yr.payingUsers.toLocaleString('en-IN')} paying users</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Op. expenses</dt>
                  <dd className="tnum mt-0.5 text-[13px] font-bold text-ink-800 dark:text-white">{yr.expenseLabel}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Net income</dt>
                  <dd className={cx('tnum mt-0.5 text-[13px] font-bold', profitable ? 'text-teal-600 dark:text-teal-300' : 'text-rose-500')}>{yr.netLabel}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Net margin</dt>
                  <dd className={cx('tnum mt-0.5 text-[13px] font-bold', profitable ? 'text-teal-600 dark:text-teal-300' : 'text-rose-500')}>{yr.marginLabel}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Revenue index</dt>
                  <dd className="tnum mt-0.5 text-[13px] font-bold text-ink-800 dark:text-white">{Math.round((yr.revenue / maxRevenue) * 100)}</dd>
                </div>
              </dl>
              <ProgressBar value={yr.revenue} max={maxRevenue} tone={isActive ? 'brand' : 'ink'} height="h-1.5" className="mt-4" />
            </button>
          )
        })}
      </div>

      {/* selected year detail */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="brand" icon="BarChart3">{y.year} detail</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">
              {y.revenueLabel} revenue at {y.marginLabel} net margin
            </h3>
          </div>
          <Tabs
            size="sm"
            value={selected}
            onChange={setSelected}
            tabs={years.map((yy) => ({ id: yy.id, label: yy.year }))}
          />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Paying users', value: y.payingUsers, display: y.payingUsers.toLocaleString('en-IN'), icon: 'Users', tone: 'violet' },
            { label: 'Revenue', value: y.revenue, display: y.revenueLabel, icon: 'TrendingUp', tone: 'brand' },
            { label: 'Operating expenses', value: y.expenses, display: y.expenseLabel, icon: 'Wallet', tone: 'amberx' },
            { label: 'Net income', value: y.netIncome, display: y.netLabel, icon: y.netIncome >= 0 ? 'CheckCircle2' : 'AlertTriangle', tone: y.netIncome >= 0 ? 'teal' : 'rose' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
              <span className={cx('grid h-10 w-10 place-items-center rounded-xl', {
                violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
                amberx: 'bg-amberx-500/10 text-amberx-500',
                teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                rose: 'bg-rose-500/10 text-rose-500',
              }[s.tone])}>
                <Icon name={s.icon} size={18} />
              </span>
              <p className="mt-3.5 text-[10px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
              <p className="tnum mt-1 font-display text-xl font-extrabold text-ink-900 dark:text-white">{s.display}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Revenue per paying user</p>
            <p className="tnum mt-1.5 font-display text-lg font-extrabold text-ink-900 dark:text-white">
              ₹{Math.round((y.revenue * 100000) / y.payingUsers).toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-[11px] text-ink-400">Modelled at the proposed ₹1,188 annual price point.</p>
          </div>
          <div className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Cost per paying user</p>
            <p className="tnum mt-1.5 font-display text-lg font-extrabold text-ink-900 dark:text-white">
              ₹{Math.round((y.expenses * 100000) / y.payingUsers).toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-[11px] text-ink-400">Falls each year as fixed product spend is spread across more users.</p>
          </div>
        </div>
      </Card>

      {/* charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Revenue vs. operating expenses</h3>
              <p className="mt-1 text-xs text-ink-400">₹ lakh per year, with net income overlaid as a line</p>
            </div>
            <Tag tone="brand" icon="BarChart3">3-year view</Tag>
          </div>
          <RevenueExpenseChart data={years} height={300} />
          <Note className="mt-3">
            Year 1 is deliberately loss-making: ₹75 lakh of spend against ₹59 lakh of revenue. The modelled inflection happens in Year 2 when
            revenue growth outpaces the cost base.
          </Note>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Paying users</h3>
              <p className="mt-1 text-xs text-ink-400">5,000 → 15,000 → 35,000</p>
            </div>
            <Tag tone="violet" icon="Users">3× then 2.3×</Tag>
          </div>
          <UsersBarChart data={years} height={250} />
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Net income</h3>
              <p className="mt-1 text-xs text-ink-400">-₹15.6 lakh → ₹51.2 lakh → ₹212.8 lakh</p>
            </div>
            <Tag tone="teal" icon="TrendingUp">Turning profitable in Year 2</Tag>
          </div>
          <NetIncomeChart data={years} height={250} />
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">Net margin</h3>
              <p className="mt-1 text-xs text-ink-400">-26.3% → 28.7% → 51.2%</p>
            </div>
            <Tag tone="teal" icon="Gauge">Year 3 margin 51.2%</Tag>
          </div>
          <NetMarginChart data={years} height={250} />
          <Note className="mt-3">
            A 51.2% net margin at Year 3 assumes the cost base grows far slower than revenue. This is the single most optimistic line in the
            model and the first one to stress-test.
          </Note>
        </Card>
      </div>

      {/* table */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading eyebrow="Full model" title="All three years side by side" className="!max-w-none" />
          <ProvenanceTag kind="illustrative" />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Three-year financial projection detail</caption>
            <thead>
              <tr className="border-b border-ink-100 dark:border-white/10">
                <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-ink-400">Line item</th>
                {years.map((yy) => (
                  <th key={yy.id} scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-ink-400">{yy.year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Paying users', key: 'payingUsers', format: (v) => v.toLocaleString('en-IN'), tone: 'violet' },
                { label: 'Revenue (₹ lakh)', key: 'revenue', format: (v) => `₹${v} lakh`, tone: 'brand' },
                { label: 'Operating expenses (₹ lakh)', key: 'expenses', format: (v) => `₹${v} lakh`, tone: 'amberx' },
                { label: 'Net income (₹ lakh)', key: 'netIncome', format: (v) => `${v < 0 ? '-' : ''}₹${Math.abs(v)} lakh`, tone: 'teal' },
                { label: 'Net margin', key: 'netMargin', format: (v) => `${v}%`, tone: 'teal' },
              ].map((row) => (
                <tr key={row.label} className="border-b border-ink-50 last:border-0 dark:border-white/5">
                  <th scope="row" className="py-3.5 pr-4 text-[13px] font-semibold text-ink-600 dark:text-ink-200">{row.label}</th>
                  {years.map((yy) => (
                    <td key={yy.id} className="tnum py-3.5 px-4 text-[13px] font-bold text-ink-900 dark:text-white">
                      <span className={cx(row.key === 'netIncome' || row.key === 'netMargin' ? (yy[row.key] < 0 ? 'text-rose-500' : 'text-teal-600 dark:text-teal-300') : '')}>
                        {row.format(yy[row.key])}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Cumulative net income', value: <Counter value={-15.6 + 51.2 + 212.8} decimals={1} prefix="₹" suffix=" lakh" />, tone: 'teal' },
            { label: 'Revenue CAGR (Y1→Y3)', value: '165%', tone: 'brand' },
            { label: 'Year-3 revenue multiple of Year 1', value: '7.05×', tone: 'violet' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
              <p className={cx('tnum mt-1 font-display text-lg font-extrabold', {
                teal: 'text-teal-600 dark:text-teal-300',
                brand: 'text-brand-600 dark:text-brand-300',
                violet: 'text-violet-600 dark:text-violet-300',
              }[s.tone])}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* assumptions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeading eyebrow="Assumptions" title="What the model rests on" provenance="illustrative" />
          <ul className="mt-5 space-y-3">
            {[
              { label: 'Revenue per user', value: '₹1,188 / year', note: 'Proposed ₹99 monthly price, no discounting modelled.' },
              { label: 'Mix of revenue', value: '95% premium', note: '5% assumed from the 10% commission on paid expert sessions.' },
              { label: 'Operating expenses Year 1', value: '₹75 lakh', note: 'Product build, ambassador programme, workshops and pilot.' },
              { label: 'Expense growth Y1→Y3', value: '2.7×', note: 'Versus 7.05× revenue growth — the source of the margin expansion.' },
              { label: 'Headcount', value: 'Not modelled', note: 'A salary line would sit inside operating expenses but is not broken out here.' },
            ].map((a) => (
              <li key={a.label} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-100 pb-2.5 last:border-0 dark:border-white/10">
                <span className="text-[12.5px] text-ink-500 dark:text-ink-300">{a.label}</span>
                <span className="tnum text-[13px] font-bold text-ink-900 dark:text-white">{a.value}</span>
                <span className="w-full text-[11px] text-ink-400">{a.note}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionHeading eyebrow="Stress test" title="What would move these numbers most" />
          <div className="mt-5 space-y-4">
            {[
              { label: 'If conversion is half of plan', impact: 'Year-3 revenue falls to ~₹208 lakh', tone: 'rose', pct: 50 },
              { label: 'If price stays at ₹99 but churn doubles', impact: 'Year-3 contribution per user halves', tone: 'amberx', pct: 65 },
              { label: 'If expenses grow with revenue', impact: 'Year-3 net margin compresses to low double digits', tone: 'rose', pct: 38 },
              { label: 'If commission revenue exceeds 5%', impact: 'Upside to revenue mix, no cost impact', tone: 'teal', pct: 82 },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[13px] font-bold text-ink-800 dark:text-white">{s.label}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{s.impact}</p>
                <ProgressBar value={s.pct} tone={s.tone === 'amberx' ? 'amberx' : s.tone} height="h-1.5" className="mt-3" />
              </div>
            ))}
          </div>
          <Note className="mt-5">
            Stress cases are illustrative. The purpose is to show which assumption carries the most weight, not to forecast an outcome.
          </Note>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Tag tone="ink" icon="ArrowRight">Next</Tag>
            <p className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">What the ₹25 lakh raise is for</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Bridge funding to reach the Year-2 revenue line and validate the conversion assumption.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" icon="Coins" onClick={() => navigate('/funding')}>Funding detail</Button>
            <Button variant="ghost" icon="Globe" onClick={() => navigate('/market')}>Market sizing</Button>
          </div>
        </div>
        <Tooltip label="Year 1 net loss of ₹15.6 lakh is smaller than the raise, which is intentional: the raise funds the Year-2 build, not just Year-1 burn.">
          <span className="mt-4 inline-flex cursor-help items-center gap-1.5 text-[11px] font-semibold text-ink-400">
            <Icon name="Info" size={11} /> Why raise more than the modelled Year-1 loss
          </span>
        </Tooltip>
      </Card>
    </div>
  )
}
