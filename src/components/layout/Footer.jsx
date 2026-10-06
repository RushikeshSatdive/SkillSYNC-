import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { BRAND } from '../../data/mockData'
import { Wordmark } from './Brand'

const columns = [
  {
    title: 'Product',
    links: [
      { to: '/dashboard', label: 'Student Dashboard' },
      { to: '/gap-analysis', label: 'AI Skill Gap Analysis' },
      { to: '/matching', label: 'Peer Matching' },
      { to: '/learning-path', label: 'Learning Path' },
      { to: '/practice', label: 'Practice Activities' },
      { to: '/proof', label: 'Skill Proof' },
    ],
  },
  {
    title: 'Community',
    links: [
      { to: '/community', label: 'Community' },
      { to: '/impact', label: 'Social Impact' },
      { to: '/exchange', label: 'Skill Exchange' },
    ],
  },
  {
    title: 'Business',
    links: [
      { to: '/pricing', label: 'Business Model' },
      { to: '/market', label: 'Market Opportunity' },
      { to: '/unit-economics', label: 'Unit Economics' },
      { to: '/go-to-market', label: 'Go-To-Market' },
      { to: '/financials', label: 'Financial Projections' },
      { to: '/funding', label: 'Funding' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About SkillSync' },
      { to: '/about#team', label: 'Team' },
      { to: '/', label: 'Landing Page' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white dark:border-white/10 dark:bg-ink-950">
      <div className="section py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Wordmark size="md" />
            <p className="mt-4 max-w-xs font-display text-sm font-semibold leading-relaxed text-ink-700 dark:text-ink-100">
              {BRAND.tagline}
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">
              <span className="rounded-full bg-ink-100 px-2.5 py-1 dark:bg-white/10">Demo Prototype</span>
              <span className="rounded-full bg-ink-100 px-2.5 py-1 dark:bg-white/10">Frontend Only</span>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">No backend</span>
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-white">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label + l.to}>
                    <Link to={l.to} className="text-sm text-ink-500 transition hover:text-brand-600 dark:text-ink-300 dark:hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-100 pt-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-400">© {BRAND.year} SkillSync. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="ShieldCheck" size={13} className="text-teal-500" /> Source data labelled separately from illustrative figures
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Database" size={13} className="text-brand-500" /> Demo data stored locally in your browser
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
