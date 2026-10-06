import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Accordion, Breadcrumbs, Button, Card, Modal, Note, ProgressBar, ProvenanceTag, SectionHeading, Tag, cx,
} from '../components/ui/Kit'
import { DonutChart } from '../components/ui/Charts'
import { useApp } from '../context/AppContext'
import { FUNDING, MARKET, PRICING, UNIT_ECONOMICS } from '../data/mockData'

const COMPARISON = [
  { feature: 'Skill profile & career goal', free: true, premium: true },
  { feature: 'Peer discovery', free: true, premium: true },
  { feature: 'Basic skill exchange', free: true, premium: true },
  { feature: 'Basic matching', free: true, premium: true },
  { feature: 'Advanced matching (weighted factors)', free: false, premium: true },
  { feature: 'Skill-gap analysis against role benchmark', free: false, premium: true },
  { feature: 'Personalized learning path & recommendations', free: false, premium: true },
  { feature: 'Enhanced progress tracking & 90-day history', free: false, premium: true },
  { feature: 'Verified profile & skill proof records', free: false, premium: true },
  { feature: '20-minute practice activities', free: true, premium: true },
  { feature: 'Community, challenges & workshops', free: true, premium: true },
]

export default function Pricing() {
  const { toast } = useApp()
  const navigate = useNavigate()
  const [annual, setAnnual] = useState(true)
  const [dialog, setDialog] = useState(null)

  const monthly = 99
  const annualPrice = UNIT_ECONOMICS.annualRevenue

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Business Model' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Business model"
          title={<>Free to exchange. <span className="grad-text">Premium</span> to progress faster.</>}
          lede="Peer skill exchange stays free because liquidity is the product. Premium is priced at roughly the cost of one canteen week, and the secondary stream takes a commission only on paid expert sessions."
          className="!max-w-3xl"
        />
        <ProvenanceTag kind="proposed" />
      </div>

      {/* plan cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {PRICING.plans.map((plan) => (
          <Card key={plan.id} className={cx('relative flex flex-col', plan.highlighted && 'border-transparent bg-gradient-to-br from-brand-600 via-brand-700 to-violet-600 text-white shadow-lift')}>
            <div className="flex items-start justify-between gap-3">
              <span className={cx('label-badge', plan.highlighted ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-200')}>{plan.name}</span>
              {plan.badge ? <span className="label-badge bg-teal-400 text-ink-900"><Icon name="Star" size={11} /> {plan.badge}</span> : null}
            </div>

            <div className="mt-5">
              <p className="font-display text-4xl font-extrabold">
                {annual && plan.highlighted ? (
                  <>
                    ₹{(annualPrice / 12).toFixed(0)}
                    <span className={cx('ml-1.5 text-sm font-semibold', plan.highlighted ? 'text-white/70' : 'text-ink-400')}>/month</span>
                    <span className={cx('mt-1 block text-xs font-semibold', plan.highlighted ? 'text-teal-200' : 'text-teal-600')}>
                      billed annually at ₹{annualPrice.toLocaleString('en-IN')}
                    </span>
                  </>
                ) : (
                  <>
                    {plan.price}
                    <span className={cx('ml-1.5 text-sm font-semibold', plan.highlighted ? 'text-white/70' : 'text-ink-400')}>/{plan.cadence === 'forever' ? 'forever' : 'month'}</span>
                  </>
                )}
              </p>
              <p className={cx('mt-3 text-sm leading-relaxed', plan.highlighted ? 'text-white/85' : 'text-ink-500 dark:text-ink-300')}>{plan.blurb}</p>
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className={cx('flex items-start gap-2.5 text-[13.5px] font-medium', plan.highlighted ? 'text-white' : 'text-ink-600 dark:text-ink-200')}>
                  <Icon name="Check" size={15} className={cx('mt-0.5 shrink-0', plan.highlighted ? 'text-teal-300' : 'text-teal-500')} /> {f}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.highlighted ? 'dark' : 'ghost'}
              className={cx('mt-7 w-full', plan.highlighted && 'bg-white text-brand-700 hover:bg-white/90 dark:bg-white dark:text-brand-700')}
              iconRight="ArrowRight"
              onClick={() =>
                toast({
                  title: plan.id === 'free' ? 'Free plan selected' : 'Premium plan selected',
                  body: 'No payment exists in this prototype and no account is created — this demonstrates the intended flow only.',
                  tone: plan.id === 'free' ? 'brand' : 'violet',
                  icon: plan.id === 'free' ? 'Unlock' : 'CreditCard',
                })
              }
            >
              {plan.cta}
            </Button>
            <p className={cx('mt-3 text-center text-[10.5px]', plan.highlighted ? 'text-white/60' : 'text-ink-400')}>
              No signup, no payment, no account
            </p>
          </Card>
        ))}

        {/* secondary revenue */}
        <Card className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <span className="label-badge bg-violet-500/10 text-violet-600 dark:text-violet-300">SECONDARY REVENUE</span>
            <Icon name="Coins" size={17} className="text-violet-500" />
          </div>
          <p className="mt-5 font-display text-4xl font-extrabold text-ink-900 dark:text-white">{PRICING.secondary.rate}</p>
          <p className="mt-2 text-sm font-semibold text-ink-600 dark:text-ink-200">{PRICING.secondary.label}</p>
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">{PRICING.secondary.detail}</p>

          <div className="mt-6">
            <DonutChart
              data={PRICING.secondary.split.map((s) => ({ label: s.label, value: s.value }))}
              height={190}
              centerLabel="10%"
              centerSub="Commission"
              colors={['#0D9488', '#6366F1']}
            />
            <ul className="mt-2 space-y-1.5">
              {PRICING.secondary.split.map((s, i) => (
                <li key={s.label} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="flex items-center gap-2 text-ink-500 dark:text-ink-300">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? '#0D9488' : '#6366F1' }} />
                    {s.label}
                  </span>
                  <span className="tnum font-bold text-ink-800 dark:text-white">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 rounded-xl bg-ink-50 px-3 py-2.5 text-[11px] text-ink-500 dark:bg-white/5 dark:text-ink-300">
            Peer exchange stays free. Commission applies only to paid expert sessions and workshops.
          </p>
        </Card>
      </div>

      {/* billing toggle */}
      <Card className="!p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-ink-700 dark:text-white">Show annual billing</span>
            <button
              type="button"
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((a) => !a)}
              className={cx('relative h-6 w-11 rounded-full transition', annual ? 'bg-brand-600' : 'bg-ink-300 dark:bg-white/20')}
            >
              <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', annual ? 'left-[1.375rem]' : 'left-0.5')} />
              <span className="sr-only">Toggle annual billing</span>
            </button>
          </div>
          <Note className="!mt-0">
            ₹99/month × 12 = ₹1,188/year — the annual revenue per paying user used throughout the financial model.
          </Note>
        </div>
      </Card>

      {/* comparison table */}
      <Card>
        <SectionHeading eyebrow="What is included" title="Free vs. Premium" lede="The free tier is deliberately generous: exchange and discovery stay free so the network keeps growing." />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">Feature comparison between the Free and Premium plans</caption>
            <thead>
              <tr className="border-b border-ink-100 dark:border-white/10">
                <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-ink-400">Feature</th>
                <th scope="col" className="w-28 py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-ink-400">Free</th>
                <th scope="col" className="w-32 py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">Premium</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-b border-ink-50 last:border-0 dark:border-white/5">
                  <th scope="row" className="py-3 pr-4 text-[13px] font-medium text-ink-600 dark:text-ink-200">{row.feature}</th>
                  <td className="py-3 px-4 text-center">
                    {row.free ? (
                      <Icon name="Check" size={15} className="mx-auto text-teal-500" aria-label="Included" />
                    ) : (
                      <Icon name="Minus" size={15} className="mx-auto text-ink-300" aria-label="Not included" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Icon name="Check" size={15} className="mx-auto text-brand-600 dark:text-brand-300" aria-label="Included" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* economics of a paying user */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <Tag tone="teal" icon="Gauge">Unit economics</Tag>
          <p className="mt-4 font-display text-2xl font-extrabold text-ink-900 dark:text-white">₹948</p>
          <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-300">Annual contribution per paying user (₹1,188 − ₹240 variable cost).</p>
          <ProgressBar value={UNIT_ECONOMICS.contributionPct} tone="teal" className="mt-4" label="Contribution margin" showValue />
          <Note className="mt-4">{UNIT_ECONOMICS.note}</Note>
        </Card>

        <Card>
          <Tag tone="violet" icon="TrendingUp">Conversion assumption</Tag>
          <p className="mt-4 font-display text-2xl font-extrabold text-ink-900 dark:text-white">500 <span className="text-base font-bold text-ink-400">paying</span></p>
          <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-300">Out of 5,000 registered and 1,500 active in the Year-1 funnel target.</p>
          <ProgressBar value={500} max={5000} tone="violet" className="mt-4" label="Registered → paying (10%)" showValue />
          <Note className="mt-4">Future target, not current traction.</Note>
        </Card>

        <Card>
          <Tag tone="brand" icon="Globe">Year-3 revenue pool</Tag>
          <p className="mt-4 font-display text-2xl font-extrabold text-ink-900 dark:text-white">{MARKET.som.value}</p>
          <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-300">{MARKET.som.math}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="soft" icon="BarChart3" onClick={() => navigate('/financials')}>Financial projections</Button>
            <Button size="sm" variant="ghost" icon="Globe" onClick={() => navigate('/market')}>Market sizing</Button>
          </div>
        </Card>
      </div>

      {/* pricing rationale */}
      <Card>
        <SectionHeading eyebrow="Rationale" title="Why ₹99 a month" lede="Three constraints set the price: student willingness to pay, the unit economics needed to fund campus acquisition, and the need for Premium to feel like a small decision." />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            { icon: 'Wallet', title: 'Affordability', body: '₹99 sits inside one week of campus discretionary spend, which keeps the decision casual rather than considered.' },
            { icon: 'Calculator', title: 'Contribution', body: 'At a ₹240 variable cost the contribution is ₹948 per year — enough to fund a ₹450 CAC at a 5.3× LTV/CAC ratio.' },
            { icon: 'Layers', title: 'Tier design', body: 'The free tier keeps exchange liquid. Premium adds diagnostics, sequencing and proof — not access to peers.' },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl border border-ink-100 p-5 dark:border-white/10">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                <Icon name={r.icon} size={18} />
              </span>
              <p className="mt-4 font-display text-[14px] font-bold text-ink-900 dark:text-white">{r.title}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{r.body}</p>
            </div>
          ))}
        </div>
      </Card>


      {/* FAQ */}
      <Card>
        <SectionHeading
          eyebrow="Common questions"
          title="What people ask about this model"
          lede="The questions an MBA jury, an investor or a student would ask first — answered as directly as possible."
        />
        <Accordion
          className="mt-6"
          defaultOpen="q1"
          items={[
            {
              id: 'q1',
              icon: 'HelpCircle',
              title: 'Why would a student pay when YouTube is free?',
              body: 'They are not paying for content. They are paying for the diagnosis and the sequence: which skill matters for their goal, who can teach it, and whether they are actually improving. The free tier keeps discovery and exchange open, so the paid tier only sells the layer that free content does not provide.',
            },
            {
              id: 'q2',
              icon: 'Users',
              title: 'What stops students from just asking a classmate?',
              body: 'Nothing — that is the behaviour SkillSync wants, just with structure. The value is finding the right classmate outside your own circle, in a different department or campus, who needs exactly what you can teach. A matching layer turns a lucky conversation into a repeatable one.',
            },
            {
              id: 'q3',
              icon: 'IndianRupee',
              title: 'Is ₹99/month the right price?',
              body: 'It is a proposal, not a finding. It sits inside weekly campus discretionary spend and produces a ₹948 annual contribution against a ₹240 variable cost. Price sensitivity is the single most important thing the pilot needs to measure, which is why the market page shows the pool at ₹588, ₹1,188 and ₹1,788.',
            },
            {
              id: 'q4',
              icon: 'Coins',
              title: 'Why take a 10% commission on expert sessions?',
              body: 'Peer exchange must stay free for the network to grow, so commission applies only where money already changes hands — paid expert sessions and workshops. At 10%, SkillSync takes a small share of a transaction it enables rather than taxing the free behaviour.',
            },
            {
              id: 'q5',
              icon: 'ShieldCheck',
              title: 'What is actually proven today?',
              body: 'Nothing commercial. There are no users, no revenue and no partnerships. What exists is this working frontend prototype, a stated product thesis, and a set of explicitly labelled assumptions. The data ledger on the About page lists every figure and its category.',
            },
          ]}
        />
      </Card>

      {/* funding teaser */}
      <Card className="relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <Tag tone="ink" icon="Lightbulb">Proposed pricing</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">
              {PRICING.note} Pricing, commission and funding terms are founder proposals, not commitments.
            </h3>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">
              Funding sought {FUNDING.sought} for {FUNDING.equity} equity, implying a {FUNDING.postMoney} post-money valuation.
              {' '}{FUNDING.productPlusAcquisition}% of the raise is allocated to product and acquisition.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" icon="Coins" onClick={() => setDialog('funding')}>Funding detail</Button>
            <Button variant="primary" icon="BarChart3" onClick={() => navigate('/funding')}>Open funding page</Button>
          </div>
        </div>
      </Card>

      <Modal
        open={dialog === 'funding'}
        onClose={() => setDialog(null)}
        title="Funding assumption"
        subtitle="Founder-proposed fundraising assumption."
        icon="Coins"
        size="sm"
        footer={<Button variant="primary" onClick={() => { setDialog(null); navigate('/funding') }}>Open funding page</Button>}
      >
        <ul className="space-y-3">
          {FUNDING.detail.map((d) => (
            <li key={d.label} className="flex items-center justify-between gap-4 border-b border-ink-100 pb-2.5 last:border-0 dark:border-white/10">
              <span className="text-[13px] text-ink-500 dark:text-ink-300">{d.label}</span>
              <span className="tnum text-sm font-bold text-ink-900 dark:text-white">{d.value}</span>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}
