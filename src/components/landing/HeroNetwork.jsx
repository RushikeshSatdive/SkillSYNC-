import { useEffect, useState } from 'react'
import Icon from '../ui/Icon'
import { cx } from '../ui/Kit'

const CENTER = { x: 255, y: 262 }

const NODES = [
  { id: 'student', label: 'Student', sub: 'Sakshi · Final year', x: 255, y: 70, icon: 'UserRoundPlus', tone: '#6366F1' },
  { id: 'gap', label: 'Skill Gap', sub: 'Modelling · Valuation', x: 432, y: 168, icon: 'ScanSearch', tone: '#8B5CF6' },
  { id: 'peer', label: 'Peer', sub: 'Aarav · 94% match', x: 432, y: 356, icon: 'Users', tone: '#14B8A6' },
  { id: 'learning', label: 'Learning', sub: '7-step path', x: 255, y: 454, icon: 'Route', tone: '#0EA5E9' },
  { id: 'career', label: 'Career Goal', sub: 'Investment Banking', x: 78, y: 356, icon: 'Target', tone: '#F59E0B' },
]

const CHAIN = ['student', 'gap', 'peer', 'learning', 'career']

const FLOATING_TAGS = [
  { label: 'Financial Analysis', top: '4%', left: '-6%', delay: '0s', tone: 'teal' },
  { label: 'Digital Marketing', top: '16%', left: '72%', delay: '1.1s', tone: 'violet' },
  { label: 'Python', top: '62%', left: '-10%', delay: '2.2s', tone: 'brand' },
  { label: 'Data Analytics', top: '84%', left: '66%', delay: '.6s', tone: 'sky' },
  { label: 'Excel', top: '40%', left: '88%', delay: '1.6s', tone: 'amber' },
  { label: 'Leadership', top: '94%', left: '12%', delay: '2.8s', tone: 'brand' },
  { label: 'Communication', top: '-4%', left: '44%', delay: '1.9s', tone: 'rose' },
  { label: 'Product Management', top: '48%', left: '-14%', delay: '.4s', tone: 'violet' },
]

const tagTones = {
  teal: 'border-teal-300/70 bg-teal-50/90 text-teal-700 dark:border-teal-400/30 dark:bg-teal-500/15 dark:text-teal-300',
  violet: 'border-violet-300/70 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  brand: 'border-brand-200 bg-brand-50/90 text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-200',
  sky: 'border-sky-200 bg-sky-50/90 text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-sky-300',
  amber: 'border-amberx-400/50 bg-amberx-500/10 text-amberx-500',
  rose: 'border-rose-200 bg-rose-50/90 text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-300',
}

export default function HeroNetwork() {
  const [active, setActive] = useState(0)

  // Cycle the highlighted chain step so the flow reads as a process, not a picture.
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % CHAIN.length), 2100)
    return () => clearInterval(id)
  }, [])

  const activeId = CHAIN[active]

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-56 w-56 rounded-full bg-brand-400/25 blur-3xl animate-blob" />
        <div className="absolute bottom-8 right-8 h-48 w-48 rounded-full bg-teal-400/25 blur-3xl animate-blob animate-delay-500" />
        <div className="absolute right-1/3 top-2/3 h-40 w-40 rounded-full bg-violet-400/25 blur-3xl animate-blob animate-delay-300" />
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-card backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/60">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 p-2">
          <div className="grid-lines absolute inset-0 opacity-40" aria-hidden="true" />

          <svg viewBox="0 0 520 520" className="relative w-full" role="img" aria-label="SkillSync flow: Student to Skill Gap to AI Matching to Peer to Learning to Career Goal">
            <defs>
              <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity=".75" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity=".75" />
              </linearGradient>
              <radialGradient id="coreGrad" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="60%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#312E81" />
              </radialGradient>
              <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="7" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Chain ring connecting outer nodes in sequence */}
            <path
              d="M255 70 Q 400 96 432 168 Q 468 260 432 356 Q 360 460 255 454 Q 120 446 78 356 Q 44 260 78 168 Q 130 92 255 70 Z"
              fill="none"
              stroke="url(#edgeGrad)"
              strokeWidth="1.6"
              strokeDasharray="7 9"
              className="animate-dash"
              opacity=".55"
            />

            {/* Edges to the core */}
            {NODES.map((n) => (
              <line
                key={n.id}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={n.x}
                y2={n.y}
                stroke={n.id === activeId ? n.tone : '#4F46E5'}
                strokeOpacity={n.id === activeId ? 0.85 : 0.28}
                strokeWidth={n.id === activeId ? 2.2 : 1.3}
                strokeDasharray={n.id === activeId ? '6 6' : '3 7'}
                className={n.id === activeId ? 'animate-dash' : ''}
              />
            ))}

            {/* Traveling packets */}
            {NODES.map((n, i) => (
              <circle key={`pk-${n.id}`} r="3.4" fill={n.tone} opacity=".95" filter="url(#softGlow)">
                <animateMotion dur={`${3 + i * 0.35}s`} repeatCount="indefinite" path={`M${n.x},${n.y} L${CENTER.x},${CENTER.y}`} begin={`${i * 0.45}s`} />
                <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.45}s`} />
              </circle>
            ))}
            {NODES.map((n, i) => (
              <circle key={`pk2-${n.id}`} r="2.6" fill="#5EEAD4" opacity=".9">
                <animateMotion dur={`${3.4 + i * 0.3}s`} repeatCount="indefinite" path={`M${CENTER.x},${CENTER.y} L${n.x},${n.y}`} begin={`${1 + i * 0.5}s`} />
              </circle>
            ))}

            {/* Outer nodes */}
            {NODES.map((n) => {
              const isActive = n.id === activeId
              return (
                <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                  {isActive ? <circle r="34" fill={n.tone} opacity=".14" className="animate-pulse-ring" /> : null}
                  <circle r={isActive ? 27 : 24} fill="#0B1220" stroke={n.tone} strokeWidth={isActive ? 2.4 : 1.6} style={{ transition: 'all .4s' }} />
                  <circle r="24" fill={n.tone} opacity={isActive ? 0.18 : 0.08} />
                  <foreignObject x="-15" y="-15" width="30" height="30">
                    <span className="grid h-[30px] w-[30px] place-items-center" style={{ color: n.tone }}>
                      <Icon name={n.icon} size={isActive ? 17 : 15} />
                    </span>
                  </foreignObject>
                  <text y="46" textAnchor="middle" className="fill-white" style={{ fontSize: 13, fontWeight: 700 }}>
                    {n.label}
                  </text>
                  <text y="61" textAnchor="middle" className="fill-white/50" style={{ fontSize: 10.5 }}>
                    {n.sub}
                  </text>
                </g>
              )
            })}

            {/* Core: AI Matching */}
            <g transform={`translate(${CENTER.x} ${CENTER.y})`}>
              <circle r="74" fill="#6366F1" opacity=".1" className="animate-pulse-ring" />
              <circle r="58" fill="url(#coreGrad)" filter="url(#softGlow)" />
              <circle r="58" fill="none" stroke="#A5B4FC" strokeOpacity=".5" strokeWidth="1" />
              <foreignObject x="-44" y="-40" width="88" height="80">
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center">
                  <Icon name="Sparkles" size={20} className="text-teal-300" />
                  <p className="font-display text-[13px] font-extrabold leading-tight text-white">AI Matching</p>
                  <p className="text-[9.5px] font-semibold uppercase tracking-wider text-white/60">SkillSync engine</p>
                </div>
              </foreignObject>
            </g>
          </svg>

          {/* Legend */}
          <div className="glass relative mx-1 -mt-1 mb-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-2xl px-3 py-2.5 text-[10px] font-semibold text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-gradient-to-r from-brand-400 to-teal-300" /> Recommend
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-teal-300" /> Exchange
            </span>
            <span>Simulated visualisation · no live model call</span>
          </div>
        </div>
      </div>

      {/* Floating skill tags */}
      {FLOATING_TAGS.map((t, i) => (
        <span
          key={t.label}
          className={cx(
            'pointer-events-none absolute hidden rounded-full border px-3 py-1.5 text-[11px] font-bold shadow-soft backdrop-blur-md animate-float sm:inline-flex',
            tagTones[t.tone],
            i > 5 && 'hidden lg:inline-flex',
          )}
          style={{ top: t.top, left: t.left, animationDelay: t.delay }}
        >
          {t.label}
        </span>
      ))}
    </div>
  )
}
