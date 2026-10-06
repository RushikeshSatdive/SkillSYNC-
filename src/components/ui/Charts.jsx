import { useMemo } from 'react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart,
  PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from 'recharts'
import { useApp } from '../../context/AppContext'

const PALETTE = {
  brand: '#6366F1',
  brandDeep: '#4F46E5',
  violet: '#8B5CF6',
  teal: '#14B8A6',
  tealLight: '#2DD4BF',
  amber: '#F59E0B',
  rose: '#F43F5E',
  sky: '#0EA5E9',
  ink: '#46587A',
  gridLight: '#E9EDF4',
  gridDark: 'rgba(255,255,255,.08)',
  axisLight: '#9FAEC6',
  axisDark: '#9FAEC6',
}

export const TONE_HEX = {
  brand: PALETTE.brand,
  violet: PALETTE.violet,
  teal: PALETTE.teal,
  amberx: PALETTE.amber,
  amber: PALETTE.amber,
  rose: PALETTE.rose,
  sky: PALETTE.sky,
  ink: PALETTE.ink,
}

const useChartTheme = () => {
  const { theme } = useApp()
  return useMemo(
    () => ({
      grid: theme === 'dark' ? PALETTE.gridDark : PALETTE.gridLight,
      axis: PALETTE.axisLight,
      tooltip: {
        contentStyle: {
          borderRadius: 14,
          border: theme === 'dark' ? '1px solid rgba(255,255,255,.12)' : '1px solid #E9EDF4',
          background: theme === 'dark' ? '#141E33' : '#fff',
          color: theme === 'dark' ? '#fff' : '#0B1220',
          boxShadow: '0 18px 40px -24px rgba(16,24,40,.3)',
          fontSize: 12,
          padding: '10px 12px',
        },
        labelStyle: { fontWeight: 700, marginBottom: 4, color: theme === 'dark' ? '#fff' : '#0B1220' },
        itemStyle: { fontSize: 12 },
      },
    }),
    [theme],
  )
}

function Axis({ theme, ...rest }) {
  return <XAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} {...rest} />
}

const wrap = (children, height = 240, className) => (
  <div className={className} style={{ width: '100%', height }}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
)

/* ---------- Weekly learning activity (area) ---------- */
export function ActivityAreaChart({ data, height = 240, dataKey = 'hours', labelKey = 'label', unit = 'hrs' }) {
  const theme = useChartTheme()
  return wrap(
    <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <defs>
        <linearGradient id="gradActivity" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE.brand} stopOpacity={0.45} />
          <stop offset="100%" stopColor={PALETTE.brand} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey={labelKey} stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={44} />
      <RTooltip {...theme.tooltip} formatter={(v) => [`${v} ${unit}`, 'Logged']} />
      <Area type="monotone" dataKey={dataKey} stroke={PALETTE.brand} strokeWidth={2.5} fill="url(#gradActivity)" activeDot={{ r: 5 }} />
    </AreaChart>,
    height,
  )
}

/* ---------- Skill improvement (grouped bars: start vs now) ---------- */
export function SkillImprovementChart({ data, height = 240 }) {
  const theme = useChartTheme()
  return wrap(
    <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barGap={6}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="label" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={44} domain={[0, 100]} />
      <RTooltip {...theme.tooltip} formatter={(v, n) => [`${v}%`, n === 'start' ? 'Before' : 'Now']} />
      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} formatter={(v) => (v === 'start' ? 'Before' : 'Now')} />
      <Bar dataKey="start" fill={PALETTE.gridLight} radius={[6, 6, 0, 0]} maxBarSize={26} className="dark:opacity-40" />
      <Bar dataKey="now" fill={PALETTE.brand} radius={[6, 6, 0, 0]} maxBarSize={26} />
    </BarChart>,
    height,
  )
}

/* ---------- Career readiness (line) ---------- */
export function ReadinessLineChart({ data, height = 240, color = PALETTE.teal }) {
  const theme = useChartTheme()
  return wrap(
    <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="label" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={44} domain={[0, 100]} />
      <RTooltip {...theme.tooltip} formatter={(v) => [`${v}%`, 'Career readiness']} />
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 3.5, fill: color }} activeDot={{ r: 6 }} />
    </LineChart>,
    height,
  )
}

/* ---------- Sessions (stacked bars) ---------- */
export function SessionsChart({ data, height = 240 }) {
  const theme = useChartTheme()
  return wrap(
    <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="label" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={44} allowDecimals={false} />
      <RTooltip {...theme.tooltip} />
      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
      <Bar dataKey="completed" name="Completed" stackId="a" fill={PALETTE.teal} radius={[0, 0, 0, 0]} maxBarSize={30} />
      <Bar dataKey="scheduled" name="Scheduled" stackId="a" fill={PALETTE.violet} radius={[6, 6, 0, 0]} maxBarSize={30} />
    </BarChart>,
    height,
  )
}

/* ---------- Revenue vs expenses (composed) ---------- */
export function RevenueExpenseChart({ data, height = 280 }) {
  const theme = useChartTheme()
  return wrap(
    <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="year" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={52} unit="L" />
      <RTooltip {...theme.tooltip} formatter={(v) => [`₹${v} lakh`, '']} />
      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
      <Bar dataKey="revenue" name="Revenue (₹ lakh)" fill={PALETTE.brand} radius={[8, 8, 0, 0]} maxBarSize={42} />
      <Bar dataKey="expenses" name="Operating expenses (₹ lakh)" fill={PALETTE.violet} radius={[8, 8, 0, 0]} maxBarSize={42} />
      <Line type="monotone" dataKey="netIncome" name="Net income (₹ lakh)" stroke={PALETTE.teal} strokeWidth={3} dot={{ r: 4, fill: PALETTE.teal }} />
    </ComposedChart>,
    height,
  )
}

export function UsersBarChart({ data, height = 240 }) {
  const theme = useChartTheme()
  return wrap(
    <BarChart data={data} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="year" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={52} tickFormatter={(v) => `${v / 1000}k`} />
      <RTooltip {...theme.tooltip} formatter={(v) => [v.toLocaleString('en-IN'), 'Paying users']} />
      <Bar dataKey="payingUsers" fill={PALETTE.violet} radius={[8, 8, 0, 0]} maxBarSize={48}>
        {data.map((_, i) => (
          <Cell key={i} fill={[PALETTE.violet, PALETTE.brand, PALETTE.teal][i % 3]} />
        ))}
      </Bar>
    </BarChart>,
    height,
  )
}

export function NetMarginChart({ data, height = 240 }) {
  const theme = useChartTheme()
  return wrap(
    <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="year" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={48} unit="%" />
      <RTooltip {...theme.tooltip} formatter={(v) => [`${v}%`, 'Net margin']} />
      <Bar dataKey="netMargin" radius={[8, 8, 0, 0]} maxBarSize={48}>
        {data.map((d, i) => (
          <Cell key={i} fill={d.netMargin < 0 ? PALETTE.rose : PALETTE.teal} />
        ))}
      </Bar>
    </BarChart>,
    height,
  )
}

export function NetIncomeChart({ data, height = 240 }) {
  const theme = useChartTheme()
  return wrap(
    <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="year" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={52} unit="L" />
      <RTooltip {...theme.tooltip} formatter={(v) => [`₹${v} lakh`, 'Net income']} />
      <Bar dataKey="netIncome" radius={[8, 8, 0, 0]} maxBarSize={48}>
        {data.map((d, i) => (
          <Cell key={i} fill={d.netIncome < 0 ? PALETTE.rose : PALETTE.teal} />
        ))}
      </Bar>
    </BarChart>,
    height,
  )
}

export function ContributionChart({ revenue = 1188, cost = 240, height = 200 }) {
  const theme = useChartTheme()
  const data = [
    { name: 'Revenue', value: revenue, fill: PALETTE.brand },
    { name: 'Variable cost', value: cost, fill: PALETTE.rose },
    { name: 'Contribution', value: revenue - cost, fill: PALETTE.teal },
  ]
  return wrap(
    <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} horizontal={false} />
      <XAxis type="number" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
      <YAxis type="category" dataKey="name" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={92} />
      <RTooltip {...theme.tooltip} formatter={(v) => [`₹${v}`, 'Per user / year']} />
      <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={30}>
        {data.map((d, i) => (
          <Cell key={i} fill={d.fill} />
        ))}
      </Bar>
    </BarChart>,
    height,
  )
}

export function LtvCacChart({ ltv = 2370, cac = 450, height = 200 }) {
  const theme = useChartTheme()
  const data = [
    { name: 'LTV', value: ltv, fill: PALETTE.teal },
    { name: 'CAC', value: cac, fill: PALETTE.violet },
  ]
  return wrap(
    <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 6" stroke={theme.grid} vertical={false} />
      <XAxis dataKey="name" stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} />
      <YAxis stroke={theme.axis} tick={{ fontSize: 11, fill: theme.axis }} axisLine={false} tickLine={false} width={52} tickFormatter={(v) => `₹${v}`} />
      <RTooltip {...theme.tooltip} formatter={(v) => [`₹${v}`, '']} />
      <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
        {data.map((d, i) => (
          <Cell key={i} fill={d.fill} />
        ))}
      </Bar>
    </BarChart>,
    height,
  )
}

export function RatioGauge({ value = 5.3, max = 8, height = 200, label = 'LTV / CAC' }) {
  const theme = useChartTheme()
  const data = [{ name: label, value: Math.min(value, max), fill: PALETTE.teal }]
  return (
    <div className="relative" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart data={data} innerRadius="68%" outerRadius="104%" startAngle={220} endAngle={-40}>
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={12} background={{ fill: theme.grid }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="tnum font-display text-3xl font-extrabold text-ink-900 dark:text-white">{value}×</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{label}</span>
      </div>
    </div>
  )
}

export function DonutChart({ data, height = 240, centerLabel, centerSub, colors }) {
  const theme = useChartTheme()
  const total = data.reduce((a, b) => a + b.value, 0)
  return (
    <div className="relative" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius="58%" outerRadius="84%" paddingAngle={3} stroke="none">
            {data.map((d, i) => (
              <Cell key={i} fill={colors?.[i] || [PALETTE.brand, PALETTE.violet, PALETTE.teal, PALETTE.amber, PALETTE.sky][i % 5]} />
            ))}
          </Pie>
          <RTooltip {...theme.tooltip} formatter={(v) => [`${v}%`, '']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum font-display text-2xl font-extrabold text-ink-900 dark:text-white">{centerLabel ?? `${total}%`}</span>
        {centerSub ? <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-400">{centerSub}</span> : null}
      </div>
    </div>
  )
}

export { PALETTE }
