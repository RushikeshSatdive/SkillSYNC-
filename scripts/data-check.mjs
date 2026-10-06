/**
 * Data integrity check.
 * Verifies that every figure from the SkillSync numeric deck is present on the site,
 * and that each dataset carries an explicit provenance label.
 *
 * Run: npm run check:data
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    const full = join(dir, f)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const sources = walk(join(ROOT, 'src')).map((f) => readFileSync(f, 'utf8')).join('\n')

/* ---- every number that must appear, grouped by slide ---- */
const REQUIRED = [
  // Slide 2 — source data
  ['4.33 crore students', /4\.33/],
  ['28.4% GER', /28\.4/],
  ['54.81% employability', /54\.81/],
  ['AISHE 2021–22 attribution', /AISHE 2021/],
  ['India Skills Report 2025 attribution', /India Skills Report 2025/],

  // Slide 6 — social impact
  ['500+ children', /value: 500/],
  ['100+ educators', /value: 100,/],
  ['2,000+ teaching hours', /value: 2000/],
  ['1,000+ sessions', /value: 1000/],
  ['illustrative 12-month targets label', /Illustrative 12-month targets/],

  // Slides 7/8 — match score
  ['94% illustrative match', /matchScore: 94/],
  ['3 peer matches considered', /3 peer matches considered/],
  ['not a validated outcome disclaimer', /not a validated outcome/],

  // Slide 9 — market
  ['TAM ₹5,144 crore', /₹5,144 crore/],
  ['SAM ₹1,029 crore', /₹1,029 crore/],
  ['SOM ₹4.158 crore', /₹4\.158 crore/],
  ['₹41.6 crore reconciliation note', /₹41\.6 crore/],
  ['35,000 Year-3 paying users', /35,000 paying users/],
  ['₹1,188 per year', /₹1,188/],
  ['revenue pool assumption label', /Revenue pool assumptions/],

  // Slide 10 — pricing
  ['₹99/month premium', /₹99/],
  ['10% commission', /10% commission/],
  ['proposed pricing label', /Proposed pricing/],
  ['Premium recommended badge', /Recommended/],

  // Slide 11 — unit economics
  ['₹240 variable cost', /variableCost: 240/],
  ['₹948 contribution', /contribution: 948/],
  ['₹2,370 LTV', /ltv: 2370/],
  ['₹450 CAC', /cac: 450/],
  ['5.3x LTV/CAC', /ltvCac: 5\.3/],
  ['planning assumption label', /Planning assumptions – to be validated through pilot/],

  // Slide 12 — GTM
  ['100 campuses target', /value: 100/],
  ['25 partnerships target', /value: 25/],
  ['5,000 registered', /value: 5000/],
  ['1,500 active', /value: 1500/],
  ['500 paying', /value: 500,/],
  ['future targets label', /Future targets, not current traction/],

  // Slide 14 — financials
  ['Year-1 revenue ₹59 lakh', /revenue: 59/],
  ['Year-2 revenue ₹178 lakh', /revenue: 178/],
  ['Year-3 revenue ₹416 lakh', /revenue: 416/],
  ['Year-1 expenses ₹75 lakh', /expenses: 75/],
  ['Year-2 expenses ₹127 lakh', /expenses: 127/],
  ['Year-3 expenses ₹203 lakh', /expenses: 203/],
  ['Year-1 net income -₹15.6 lakh', /netIncome: -15\.6/],
  ['Year-2 net income ₹51.2 lakh', /netIncome: 51\.2/],
  ['Year-3 net income ₹212.8 lakh', /netIncome: 212\.8/],
  ['Year-1 margin -26.3%', /netMargin: -26\.3/],
  ['Year-2 margin 28.7%', /netMargin: 28\.7/],
  ['Year-3 margin 51.2%', /netMargin: 51\.2/],
  ['illustrative projections label', /Illustrative projections, not actual results/],

  // Slide 15 — funding
  ['₹25 lakh funding sought', /sought: '₹25 lakh'/],
  ['10% equity', /equity: '10%'/],
  ['₹2.5 crore post-money', /postMoney: '₹2\.5 crore'/],
  ['₹2.25 crore pre-money', /preMoney: '₹2\.25 crore'/],
  ['65% product + acquisition', /productPlusAcquisition: 65/],
  ['funding assumption label', /Founder-proposed fundraising assumption/],
]

/* ---- figures that must NOT appear ---- */
const FORBIDDEN = [
  ['₹41.6 crore as a SOM value (must appear only in the correction note)', /som[^\n]*41\.6/i],
  ['41.6 crore headline claim', /SOM[^\n]{0,40}₹41\.6 crore/i],
]

/* ---- provenance labelling must exist for each category ---- */
const PROVENANCE = [
  ['source category', /id: 'source'/],
  ['illustrative category', /id: 'illustrative'/],
  ['target category', /id: 'target'/],
  ['proposed category', /id: 'proposed'/],
  ['modelled category', /id: 'modelled'/],
]

let pass = 0
const failures = []

for (const [label, rx] of REQUIRED) {
  if (rx.test(sources)) pass += 1
  else failures.push(`missing: ${label}`)
}

for (const [label, rx] of FORBIDDEN) {
  if (!rx.test(sources)) pass += 1
  else failures.push(`forbidden pattern present: ${label}`)
}

for (const [label, rx] of PROVENANCE) {
  if (rx.test(sources)) pass += 1
  else failures.push(`provenance label missing: ${label}`)
}

const total = REQUIRED.length + FORBIDDEN.length + PROVENANCE.length
console.log(`\nSkillSync data integrity check\n${pass}/${total} assertions passed`)
if (failures.length) {
  console.log('\nFailures:')
  failures.forEach((f) => console.log(`  ✗ ${f}`))
  process.exit(1)
}
console.log('All deck values present and labelled ✅\n')
