import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { cx } from '../ui/Kit'

export function LogoMark({ size = 36, className }) {
  return (
    <span
      className={cx('relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-600 shadow-lift', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-teal-400/70 blur-[6px]" />
      <svg viewBox="0 0 32 32" width={size * 0.62} height={size * 0.62} fill="none">
        <path d="M8 22c0 3.2 2.6 4.6 5.9 4.6" stroke="white" strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
        <path d="M24 10c0-3.2-2.6-4.6-5.9-4.6" stroke="white" strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
        <circle cx="8.5" cy="21.5" r="3.4" stroke="white" strokeWidth="2.4" />
        <circle cx="23.5" cy="10.5" r="3.4" stroke="white" strokeWidth="2.4" />
        <path d="M13 16h6" stroke="#5EEAD4" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export function Wordmark({ size = 'md', to = '/', showTag = false, className }) {
  const sizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }
  return (
    <Link to={to} className={cx('group flex items-center gap-2.5', className)} aria-label="SkillSync home">
      <LogoMark size={size === 'sm' ? 30 : size === 'lg' ? 40 : 36} />
      <span className="leading-none">
        <span className={cx('block font-display font-extrabold tracking-tight text-ink-900 dark:text-white', sizes[size])}>
          Skill<span className="grad-text">Sync</span>
        </span>
        {showTag ? <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">Skill network</span> : null}
      </span>
    </Link>
  )
}

export function ThemeToggle({ theme, onToggle, className }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cx(
        'relative grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-500 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/15 dark:bg-white/5 dark:text-ink-200 dark:hover:text-white',
        className,
      )}
    >
      <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={17} />
    </button>
  )
}
