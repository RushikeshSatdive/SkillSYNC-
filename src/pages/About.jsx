import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Breadcrumbs, Button, Card, Note, ProvenanceTag, SectionHeading, Tag, cx,
} from '../components/ui/Kit'
import { ABOUT, BRAND, PROVENANCE, TEAM } from '../data/mockData'

const DATA_LEDGER = [
  { kind: 'source', label: 'AISHE 2021–22', items: '4.33 crore enrolled students · 28.4% Gross Enrolment Ratio', where: 'Landing page, Market page' },
  { kind: 'source', label: 'India Skills Report 2025', items: '54.81% graduates expected to be employable', where: 'Landing page, Market page' },
  { kind: 'illustrative', label: 'Product examples', items: '94% match score · skill levels · progress percentages · proof records', where: 'Dashboard, matching, gap analysis, progress, proof' },
  { kind: 'illustrative', label: 'Financial projections', items: '₹59 / ₹178 / ₹416 lakh revenue · net margins · TAM/SAM/SOM pool', where: 'Financials, Market, Unit economics' },
  { kind: 'modelled', label: 'Planning assumptions', items: '₹1,188 ARPU · ₹240 variable cost · ₹2,370 LTV · ₹450 CAC · 5.3× ratio', where: 'Unit economics, Pricing' },
  { kind: 'target', label: 'Future targets', items: '100 campuses · 25 partnerships · 500 children · 2,000 teaching hours · funnel targets', where: 'Go-to-market, Social impact' },
  { kind: 'proposed', label: 'Proposals', items: '₹99/month pricing · 10% commission · ₹25 lakh raise at 10% equity', where: 'Pricing, Funding' },
]

export default function About() {
  return (
    <div className="bg-white dark:bg-ink-950">
      {/* hero */}
      <section className="relative overflow-hidden pt-12">
        <div className="mesh pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden="true" />
        <div className="section pb-12">
          <Breadcrumbs items={[{ label: 'SkillSync', to: '/' }, { label: 'About SkillSync' }]} />
          <div className="max-w-3xl">
            <Tag tone="brand" icon="Info">About</Tag>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink-900 dark:text-white sm:text-4xl lg:text-[2.9rem]">
              Most students are not short of effort. They are short of <span className="grad-text">information.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-500 dark:text-ink-300">{ABOUT.mission}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="primary" icon="LayoutDashboard" to="/dashboard" iconRight="ArrowRight">Open the demo</Button>
              <Button variant="ghost" icon="FileText" to="/pricing">Business model</Button>
            </div>
          </div>
        </div>
      </section>

      {/* principles */}
      <section className="border-y border-ink-100 bg-ink-50 py-14 dark:border-white/10 dark:bg-ink-900/40">
        <div className="section">
          <SectionHeading eyebrow="Principles" title="Four rules this product is built on" lede="They are also the rules this prototype is presented under." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT.principles.map((p, i) => (
              <Card key={p.title} className="card-hover animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white">
                  <Icon name={p.icon} size={19} />
                </span>
                <h3 className="mt-4 font-display text-[15px] font-bold text-ink-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section id="team" className="py-14 sm:py-16">
        <div className="section">
          <SectionHeading eyebrow="Team" title="Who is building this" lede="Two people, clearly divided responsibilities, no photographs required — the work is the credential." />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {TEAM.map((t, i) => (
              <Card key={t.id} className="card-hover animate-fade-up relative overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" aria-hidden="true" />
                <div className="relative flex items-start gap-4">
                  <span className={cx('grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display text-xl font-extrabold text-white shadow-lift', t.tone)}>
                    {t.initials}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl font-extrabold text-ink-900 dark:text-white">{t.name}</h3>
                      <Tag tone="brand" icon="Award">{t.role}</Tag>
                    </div>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">{t.bio}</p>
                  </div>
                </div>
                <div className="relative mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Owns</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {t.focus.map((f) => (
                      <span key={f} className="rounded-full border border-ink-200 px-3 py-1.5 text-[11.5px] font-semibold text-ink-600 dark:border-white/15 dark:text-ink-200">{f}</span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Note className="mt-6">
            Both founders are students working on SkillSync alongside their studies. This prototype represents their own analysis and product
            direction, not an incorporated company.
          </Note>
        </div>
      </section>

      {/* roadmap */}
      <section className="border-y border-ink-100 bg-ink-50 py-14 dark:border-white/10 dark:bg-ink-900/40">
        <div className="section">
          <SectionHeading eyebrow="Roadmap" title="What exists, what is next" lede="Stated plainly so nothing here reads as traction." provenance="target" />
          <ol className="mt-8 grid gap-4 lg:grid-cols-4">
            {ABOUT.roadmap.map((r, i) => (
              <li key={r.phase} className="relative">
                {i < ABOUT.roadmap.length - 1 ? (
                  <span className="absolute left-full top-6 hidden h-0.5 w-4 bg-ink-200 dark:bg-white/10 lg:block" aria-hidden="true" />
                ) : null}
                <Card className="h-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="label-badge bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">{r.phase}</span>
                    <span className={cx('label-badge', r.status === 'done' ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : r.status === 'next' ? 'bg-amberx-500/10 text-amberx-500' : 'bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300')}>
                      {r.status === 'done' ? 'Done' : r.status === 'next' ? 'Next' : 'Planned'}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[15px] font-bold text-ink-900 dark:text-white">{r.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-300">{r.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* data ledger */}
      <section className="py-14 sm:py-16">
        <div className="section">
          <SectionHeading
            eyebrow="Data integrity"
            title="The full data ledger"
            lede="Every number in this prototype falls into one of five categories. This is the complete list, so nothing can be mistaken for traction."
          />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <caption className="sr-only">Data provenance ledger for all figures used in the SkillSync prototype</caption>
              <thead>
                <tr className="border-b border-ink-100 dark:border-white/10">
                  <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-ink-400">Category</th>
                  <th scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-ink-400">Examples used on this site</th>
                  <th scope="col" className="py-3 pl-4 text-xs font-bold uppercase tracking-wider text-ink-400">Where it appears</th>
                </tr>
              </thead>
              <tbody>
                {DATA_LEDGER.map((row) => (
                  <tr key={row.label} className="border-b border-ink-50 last:border-0 dark:border-white/5">
                    <th scope="row" className="py-4 pr-4 align-top">
                      <ProvenanceTag kind={row.kind} />
                      <span className="mt-2 block text-[12.5px] font-bold text-ink-800 dark:text-white">{row.label}</span>
                    </th>
                    <td className="py-4 px-4 align-top text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-200">{row.items}</td>
                    <td className="py-4 pl-4 align-top text-[12px] leading-relaxed text-ink-400">{row.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-5">
            {Object.values(PROVENANCE).map((p) => (
              <div key={p.id} className={cx('rounded-2xl p-4', {
                teal: 'bg-teal-50 dark:bg-teal-500/10',
                violet: 'bg-violet-500/10',
                amber: 'bg-amberx-500/10',
                brand: 'bg-brand-50 dark:bg-brand-500/10',
                ink: 'bg-ink-100 dark:bg-white/5',
              }[p.tone])}>
                <ProvenanceTag kind={p.id} withTooltip={false} />
                <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-600 dark:text-ink-200">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tech + honesty block */}
      <section className="border-t border-ink-100 bg-ink-50 py-14 dark:border-white/10 dark:bg-ink-900/40">
        <div className="section grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Under the hood" title="What this prototype actually is" />
            <ul className="mt-6 space-y-3">
              {[
                { icon: 'Code2', label: 'React + Vite + Tailwind CSS', body: 'Single-page application with client-side routing.' },
                { icon: 'BarChart3', label: 'Recharts + Lucide icons', body: 'All charts and icons render locally.' },
                { icon: 'Database', label: 'localStorage state, no database', body: 'Your progress persists on this device only.' },
                { icon: 'Lock', label: 'No backend, no auth, no API keys', body: 'Nothing is transmitted anywhere.' },
                { icon: 'Sparkles', label: 'Simulated AI', body: 'Matching and gap analysis are deterministic functions of seeded data, not a model call.' },
              ].map((t) => (
                <li key={t.label} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft dark:bg-white/10 dark:text-brand-300">
                    <Icon name={t.icon} size={16} />
                  </span>
                  <span>
                    <span className="block text-[13px] font-bold text-ink-800 dark:text-white">{t.label}</span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-500 dark:text-ink-300">{t.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="border-amberx-400/50 bg-amberx-500/5">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amberx-500/15 text-amberx-500">
                <Icon name="AlertTriangle" size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">What this prototype is not</h3>
                <ul className="mt-3 space-y-2">
                  {[
                    'Not a live product — there are no users, no revenue and no partnerships.',
                    'Not a validated AI system — no model has been trained or benchmarked.',
                    'Not a fundraising offer — pricing and funding terms are proposals for discussion.',
                    'Not affiliated with AISHE or the India Skills Report; their data is cited as source material.',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-200">
                      <Icon name="Minus" size={13} className="mt-1 shrink-0 text-amberx-500" /> {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-amberx-500">{ABOUT.disclaimer}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* cta */}
      <section className="py-14">
        <div className="section">
          <Card className="!p-0">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-600 p-7 text-white sm:p-9">
              <div className="grid-lines absolute inset-0 opacity-25" aria-hidden="true" />
              <div className="relative flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{BRAND.tagline}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Twenty product surfaces, an investor dashboard, and a demo profile you can drive end to end. No signup, no login.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="dark" to="/dashboard" icon="LayoutDashboard" className="bg-white text-brand-700 hover:bg-white/90 dark:bg-white dark:text-brand-700">
                    Explore SkillSync
                  </Button>
                  <Button variant="ghost" to="/impact" icon="HeartHandshake" className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white dark:border-white/25 dark:bg-white/5 dark:text-white">
                    Social impact
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { to: '/dashboard', label: 'Student Dashboard' },
              { to: '/matching', label: 'Peer Matching' },
              { to: '/financials', label: 'Financial Projections' },
              { to: '/funding', label: 'Funding' },
              { to: '/community', label: 'Community' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="chip hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/10"
              >
                {l.label} <Icon name="ArrowRight" size={12} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
