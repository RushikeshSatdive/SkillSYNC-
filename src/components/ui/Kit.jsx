import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { PROVENANCE } from '../../data/mockData'

export const cx = (...c) => c.filter(Boolean).join(' ')

/* ---------------------------------------------------------------- *
 * Provenance tag — the honesty layer used everywhere numbers appear
 * ---------------------------------------------------------------- */
const toneMap = {
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  violet: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  amber: 'bg-amberx-500/10 text-amberx-500 dark:bg-amberx-500/20 dark:text-amberx-400',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200',
  ink: 'bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
}

export function Tag({ tone = 'brand', icon, children, className }) {
  return (
    <span className={cx('label-badge', toneMap[tone] || toneMap.brand, className)}>
      {icon ? <Icon name={icon} size={11} strokeWidth={2.6} aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export function ProvenanceTag({ kind, withTooltip = true }) {
  const p = PROVENANCE[kind]
  if (!p) return null
  const tag = (
    <Tag tone={p.tone} icon={kind === 'source' ? 'ShieldCheck' : kind === 'illustrative' ? 'Sparkles' : kind === 'target' ? 'Target' : kind === 'proposed' ? 'Lightbulb' : 'Gauge'}>
      {p.label}
    </Tag>
  )
  if (!withTooltip) return tag
  return (
    <Tooltip label={`${p.label} — ${p.note}`}>
      <span tabIndex={0} className="cursor-help rounded-full">
        {tag}
      </span>
    </Tooltip>
  )
}

export function Note({ children, kind = 'modelled', className }) {
  return (
    <p className={cx('flex items-start gap-2 text-xs leading-relaxed text-ink-400 dark:text-ink-300', className)}>
      <Icon name="Info" size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

/* ---------------------------------------------------------------- *
 * Tooltip (CSS + state, keyboard accessible)
 * ---------------------------------------------------------------- */
export function Tooltip({ label, children, side = 'top' }) {
  const [open, setOpen] = useState(false)
  const pos = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[side]
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && label ? (
        <span
          role="tooltip"
          className={cx(
            'pointer-events-none absolute z-50 w-56 animate-fade-in rounded-xl bg-ink-900 px-3 py-2 text-[11px] font-medium leading-relaxed text-white shadow-card dark:bg-white dark:text-ink-900',
            pos,
          )}
        >
          {label}
        </span>
      ) : null}
    </span>
  )
}

/* ---------------------------------------------------------------- *
 * Buttons
 * ---------------------------------------------------------------- */
export function Button({ variant = 'primary', size, icon, iconRight, children, className, as, to, href, onClick, ...rest }) {
  const variants = {
    primary: 'btn-primary',
    dark: 'btn-dark',
    ghost: 'btn-ghost',
    soft: 'btn-soft',
    teal: 'btn-teal',
    plain: 'btn text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:hover:bg-white/10 dark:hover:text-white',
    danger: 'btn bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-300',
  }
  const cls = cx(variants[variant] || variants.primary, size === 'sm' && 'btn-sm', size === 'lg' && 'px-6 py-3.5 text-base', className)
  const inner = (
    <>
      {icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} strokeWidth={2.2} aria-hidden="true" /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={size === 'sm' ? 14 : 16} strokeWidth={2.2} aria-hidden="true" /> : null}
    </>
  )
  if (as === 'link' || to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>
  return <button type="button" onClick={onClick} className={cls} {...rest}>{inner}</button>
}

/* ---------------------------------------------------------------- *
 * Animated counter
 * ---------------------------------------------------------------- */
export function Counter({ value, decimals = 0, prefix = '', suffix = '', duration = 1400, className, compact = false }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const run = () => {
      if (started.current) return
      started.current = true
      if (reduce) {
        setDisplay(value)
        return
      }
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(value * eased)
        if (p < 1) requestAnimationFrame(tick)
        else setDisplay(value)
      }
      requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, duration])

  const formatted = useMemo(() => {
    if (compact && Math.abs(value) >= 1000) return (display / 1000).toFixed(0) + 'k'
    return display.toFixed(decimals)
  }, [display, decimals, compact, value])

  return (
    <span ref={ref} className={cx('tnum', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

/* ---------------------------------------------------------------- *
 * Progress bar
 * ---------------------------------------------------------------- */
export function ProgressBar({ value, max = 100, tone = 'brand', height = 'h-2', label, showValue, className, target }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const tones = {
    brand: 'from-brand-500 to-violet-500',
    teal: 'from-teal-400 to-teal-600',
    violet: 'from-violet-500 to-brand-500',
    amberx: 'from-amberx-400 to-amberx-500',
    rose: 'from-rose-400 to-rose-500',
    sky: 'from-sky-400 to-brand-500',
    ink: 'from-ink-400 to-ink-600',
  }
  return (
    <div className={className}>
      {label || showValue ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label ? <span className="text-xs font-semibold text-ink-600 dark:text-ink-200">{label}</span> : <span />}
          {showValue ? <span className="tnum text-xs font-bold text-ink-500 dark:text-ink-300">{Math.round(pct)}%</span> : null}
        </div>
      ) : null}
      <div
        className={cx('relative w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10', height)}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'progress'}
      >
        <div
          className={cx('h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out', tones[tone] || tones.brand)}
          style={{ width: `${pct}%` }}
        />
        {target != null ? (
          <span
            className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-ink-700 dark:bg-white"
            style={{ left: `${Math.min(100, target)}%` }}
            title={`Target ${target}%`}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Match-score ring
 * ---------------------------------------------------------------- */
export function MatchRing({ value, size = 128, stroke = 10, label = 'Top Match', sub, tone = 'brand', caption, animate = true }) {
  const [shown, setShown] = useState(animate ? 0 : value)
  useEffect(() => {
    if (!animate) return
    const id = requestAnimationFrame(() => setShown(value))
    return () => cancelAnimationFrame(id)
  }, [value, animate])
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (shown / 100) * c
  const gid = `ring-${tone}-${size}`
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`Match score ${value}%`}>
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              {tone === 'teal' ? (
                <>
                  <stop offset="0%" stopColor="#2DD4BF" />
                  <stop offset="100%" stopColor="#0D9488" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="60%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#2DD4BF" />
                </>
              )}
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-ink-100 dark:stroke-white/10" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke={`url(#${gid})`}
            strokeDasharray={`${dash} ${c - dash}`}
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.16,1,.3,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="tnum font-display text-3xl font-extrabold text-ink-900 dark:text-white" style={{ fontSize: size / 4 }}>
            {value}%
          </span>
          {label ? <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">{label}</span> : null}
        </div>
      </div>
      {sub ? <p className="max-w-[16rem] text-center text-xs text-ink-400 dark:text-ink-300">{sub}</p> : null}
      {caption ?? null}
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Modal
 * ---------------------------------------------------------------- */
export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', icon }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'Tab' && ref.current) {
        const nodes = ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const list = Array.from(nodes).filter((n) => !n.disabled)
        if (!list.length) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => ref.current?.querySelector('[data-autofocus]')?.focus(), 60)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 cursor-default bg-ink-950/60 backdrop-blur-sm animate-fade-in" />
      <div
        ref={ref}
        className={cx(
          'relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-ink-100 bg-white p-6 shadow-card animate-fade-up dark:border-white/10 dark:bg-ink-900 sm:rounded-3xl',
          sizes[size],
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {icon ? (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                <Icon name={icon} size={18} />
              </span>
            ) : null}
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">{title}</h3>
              {subtitle ? <p className="mt-1 text-sm text-ink-400 dark:text-ink-300">{subtitle}</p> : null}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10 dark:hover:text-white">
            <Icon name="X" size={18} />
          </button>
        </div>
        {children}
        {footer ? <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-ink-100 pt-5 dark:border-white/10">{footer}</div> : null}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Toasts
 * ---------------------------------------------------------------- */
export function ToastStack({ toasts, onDismiss }) {
  const tones = {
    brand: 'border-brand-200 bg-white dark:border-brand-400/30 dark:bg-ink-900',
    teal: 'border-teal-300 bg-white dark:border-teal-400/30 dark:bg-ink-900',
    violet: 'border-violet-300 bg-white dark:border-violet-400/30 dark:bg-ink-900',
    rose: 'border-rose-300 bg-white dark:border-rose-400/30 dark:bg-ink-900',
    amber: 'border-amberx-400 bg-white dark:border-amberx-400/30 dark:bg-ink-900',
  }
  const iconTone = {
    brand: 'text-brand-600 dark:text-brand-300',
    teal: 'text-teal-600 dark:text-teal-300',
    violet: 'text-violet-600 dark:text-violet-300',
    rose: 'text-rose-500',
    amber: 'text-amberx-500',
  }
  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[90] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3 sm:bottom-6 sm:right-6" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx('pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-card animate-fade-up', tones[t.tone] || tones.brand)}
        >
          <Icon name={t.icon || 'CheckCircle2'} size={18} className={cx('mt-0.5 shrink-0', iconTone[t.tone] || iconTone.brand)} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-900 dark:text-white">{t.title}</p>
            {t.body ? <p className="mt-0.5 text-xs leading-relaxed text-ink-500 dark:text-ink-300">{t.body}</p> : null}
          </div>
          <button type="button" aria-label="Dismiss notification" onClick={() => onDismiss(t.id)} className="rounded-md p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10">
            <Icon name="X" size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Misc building blocks
 * ---------------------------------------------------------------- */
export function SectionHeading({ eyebrow, title, lede, align = 'left', provenance, className, id }) {
  return (
    <div className={cx('max-w-3xl', align === 'center' && 'mx-auto text-center', className)} id={id}>
      {eyebrow ? (
        <div className={cx('mb-3 flex items-center gap-2', align === 'center' && 'justify-center')}>
          <span className="label-badge bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">{eyebrow}</span>
          {provenance ? <ProvenanceTag kind={provenance} /> : null}
        </div>
      ) : null}
      <h2 className="font-display text-2xl font-extrabold leading-tight text-ink-900 dark:text-white sm:text-3xl lg:text-[2.5rem]">{title}</h2>
      {lede ? <p className="mt-4 text-base leading-relaxed text-ink-500 dark:text-ink-300">{lede}</p> : null}
    </div>
  )
}

export function EmptyState({ icon = 'Search', title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 px-6 py-14 text-center dark:border-white/15">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-ink-100 text-ink-400 dark:bg-white/5 dark:text-ink-300">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="font-display text-base font-bold text-ink-800 dark:text-white">{title}</h3>
      {body ? <p className="mt-2 max-w-sm text-sm text-ink-400 dark:text-ink-300">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cx('skeleton', className)} />
}

export function Card({ children, className, as = 'div', ...rest }) {
  const Cmp = as
  return (
    <Cmp className={cx('card p-5 sm:p-6', className)} {...rest}>
      {children}
    </Cmp>
  )
}

export function StatTile({ icon, label, value, sub, tone = 'brand', provenance, footer, className, children, ...rest }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
    violet: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
    amberx: 'bg-amberx-500/10 text-amberx-500 dark:bg-amberx-500/20 dark:text-amberx-400',
    rose: 'bg-rose-500/10 text-rose-500',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
  }
  return (
    <div className={cx('card card-hover flex flex-col p-5', className)} {...rest}>
      <div className="flex items-start justify-between gap-3">
        <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-xl', tones[tone] || tones.brand)}>
          <Icon name={icon} size={19} />
        </span>
        {provenance ? <ProvenanceTag kind={provenance} /> : null}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-300">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-ink-900 dark:text-white">{value}</p>
      {sub ? <p className="mt-1.5 text-xs leading-relaxed text-ink-400 dark:text-ink-300">{sub}</p> : null}
      {children}
      {footer ? <div className="mt-4 border-t border-ink-100 pt-3 dark:border-white/10">{footer}</div> : null}
    </div>
  )
}

export function Tabs({ tabs, value, onChange, className, size = 'md' }) {
  return (
    <div className={cx('no-scrollbar flex gap-1.5 overflow-x-auto rounded-xl bg-ink-100/70 p-1 dark:bg-white/5', className)} role="tablist">
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              'flex shrink-0 items-center gap-2 rounded-lg font-semibold transition',
              size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
              active
                ? 'bg-white text-ink-900 shadow-soft dark:bg-white/15 dark:text-white'
                : 'text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-white',
            )}
          >
            {t.icon ? <Icon name={t.icon} size={14} /> : null}
            {t.label}
            {t.count != null ? (
              <span className={cx('tnum rounded-full px-1.5 py-0.5 text-[10px] font-bold', active ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/30 dark:text-brand-100' : 'bg-ink-200 text-ink-600 dark:bg-white/10 dark:text-ink-200')}>
                {t.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function Accordion({ items, className, defaultOpen = null }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={cx('divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-ink-900', className)}>
      {items.map((it) => {
        const isOpen = open === it.id
        return (
          <div key={it.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : it.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-ink-50 dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-3">
                {it.icon ? <Icon name={it.icon} size={17} className="text-brand-600 dark:text-brand-300" /> : null}
                <span className="font-semibold text-ink-800 dark:text-white">{it.title}</span>
              </span>
              <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={16} className="shrink-0 text-ink-400" />
            </button>
            {isOpen ? <div className="animate-fade-in px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed text-ink-500 dark:text-ink-300">{it.body}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

export function SkillChip({ children, tone = 'default', onRemove, className, icon }) {
  const tones = {
    default: 'border-ink-200 bg-white text-ink-600 dark:border-white/15 dark:bg-white/5 dark:text-ink-200',
    teach: 'border-teal-300/60 bg-teal-50 text-teal-700 dark:border-teal-400/30 dark:bg-teal-500/15 dark:text-teal-300',
    learn: 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-200',
    gap: 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-300',
    violet: 'border-violet-300/60 bg-violet-500/10 text-violet-600 dark:text-violet-300',
  }
  return (
    <span className={cx('chip', tones[tone] || tones.default, className)}>
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={`Remove ${children}`} className="ml-0.5 rounded-full p-0.5 transition hover:bg-black/5 dark:hover:bg-white/10">
          <Icon name="X" size={11} />
        </button>
      ) : null}
    </span>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-ink-400 dark:text-ink-300">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {it.to && i < items.length - 1 ? (
              <Link to={it.to} className="transition hover:text-brand-600 dark:hover:text-brand-300">
                {it.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? 'font-semibold text-ink-600 dark:text-ink-100' : ''}>{it.label}</span>
            )}
            {i < items.length - 1 ? <Icon name="ChevronRight" size={12} className="opacity-60" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function SectionDivider({ label }) {
  return (
    <div className="my-10 flex items-center gap-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-200 to-transparent dark:via-white/15" />
      {label ? <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400 dark:text-ink-300">{label}</span> : null}
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-200 to-transparent dark:via-white/15" />
    </div>
  )
}

export function Avatar({ initials, tone = 'from-brand-600 to-violet-600', size = 44, ring }) {
  return (
    <span
      className={cx('grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display font-bold text-white', tone, ring && 'ring-2 ring-white dark:ring-ink-900')}
      style={{ width: size, height: size, fontSize: size / 2.9 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

export function RatingStars({ value, size = 13, showValue = true }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="Star" size={size} className={i <= Math.round(value) ? 'fill-amberx-400 text-amberx-400' : 'text-ink-200 dark:text-white/20'} />
      ))}
      {showValue ? <span className="tnum ml-0.5 text-xs font-bold text-ink-600 dark:text-ink-200">{value.toFixed(1)}</span> : null}
    </span>
  )
}

export function ScoreRow({ label, value, tone = 'brand' }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold text-ink-600 dark:text-ink-200">{label}</span>
        <span className="tnum text-xs font-bold text-ink-800 dark:text-white">{value}%</span>
      </div>
      <ProgressBar value={value} tone={tone} height="h-1.5" className="mt-1.5" />
    </div>
  )
}
