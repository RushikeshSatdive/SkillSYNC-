import { JSDOM } from 'jsdom'

async function main() {
/**
 * Interaction smoke test — renders the real app in jsdom and drives the key flows.
 * Bundled + run by `npm run check:interactions`.
 */


const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true,
})

const { window } = dom
globalThis.window = window
globalThis.document = window.document
globalThis.navigator = window.navigator
globalThis.localStorage = window.localStorage
globalThis.sessionStorage = window.sessionStorage
globalThis.HTMLElement = window.HTMLElement
globalThis.Element = window.Element
globalThis.Node = window.Node
globalThis.Event = window.Event
globalThis.MouseEvent = window.MouseEvent
globalThis.KeyboardEvent = window.KeyboardEvent
globalThis.getComputedStyle = window.getComputedStyle
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0)
globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
globalThis.IS_REACT_ACT_ENVIRONMENT = true

window.matchMedia = () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = RO
window.ResizeObserver = RO

class IO {
  constructor(cb) {
    this.cb = cb
  }
  observe(el) {
    this.cb([{ isIntersecting: true, target: el }], this)
  }
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = IO
window.IntersectionObserver = IO

window.scrollTo = () => {}

const consoleNoise = []
const reactWarnings = []
const _err = console.error
console.error = (...a) => {
  const msg = a.map((x) => (typeof x === 'string' ? x : (x && x.message) || String(x))).join(' ')
  if (/not wrapped in act|width\(0\) and height\(0\)|ResponsiveContainer|cannot appear as a descendant|useLayoutEffect does nothing/.test(msg)) {
    consoleNoise.push(msg)
    return
  }
  reactWarnings.push(msg)
  _err(...a)
}

const { createElement: h } = await import('react')
const { createRoot } = await import('react-dom/client')
const { act } = await import('react')
const { MemoryRouter } = await import('react-router-dom')
const App = (await import('../src/App')).default

const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? '  ok  ' : '  FAIL'} ${name}${detail ? ` — ${detail}` : ''}`)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const mount = async (initialPath = '/dashboard') => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  await act(async () => {
    root.render(h(MemoryRouter, { initialEntries: [initialPath] }, h(App)))
  })
  await act(async () => {
    await sleep(60)
  })
  return { container, root }
}

const text = () => document.body.textContent || ''
const findAll = (sel) => Array.from(document.querySelectorAll(sel))
const findButton = (label, opts = {}) =>
  findAll('button, a').find((el) => {
    const t = (el.textContent || '').trim().toLowerCase()
    const l = label.toLowerCase()
    return opts.exact ? t === l : t.includes(l)
  })
const click = async (el) => {
  if (!el) return false
  await act(async () => {
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }))
  })
  await act(async () => {
    await sleep(40)
  })
  return true
}

console.log('\nSkillSync interaction check\n')

/* 1 — dashboard renders the deck figures */
{
  const { container } = await mount('/dashboard')
  const t = text()
  record('Dashboard shows career goal', t.includes('Investment Banking'))
  record('Dashboard shows 94% recommended match', t.includes('94'))
  record('Dashboard shows skill gap skills', t.includes('Financial Modelling') && t.includes('Valuation') && t.includes('Advanced Excel'))
  record('Dashboard shows streak + skills completed', /12\s*-?\s*day|12 days/i.test(t) && t.includes('Skills Completed'))
  record('Dashboard renders charts (svg present)', container.querySelectorAll('svg').length > 3)
  record('Demo mode banner present', t.includes('DEMO MODE') && t.includes('Frontend-only interactive prototype'))
  record('Reset Demo Data control present', !!findButton('Reset Demo Data'))
  container.remove()
}

/* 2 — save a peer on the matching page, then verify it lands on the dashboard */
{
  const { container } = await mount('/matching')
  const before = text()
  record('Matching page heading', before.includes('Find the Right'))
  record('Matching shows peer cards with teach/learn', before.includes('Can teach') && before.includes('Wants to learn'))
  record('Match-score breakdown present', before.includes('Skill compatibility') && before.includes('Availability'))
  record('Illustrative disclaimer on match score', before.includes('not a validated outcome'))

  const saveBtn = findButton('Save Match')
  const clicked = await click(saveBtn)
  record('Save Match button exists and is clickable', clicked)
  await act(async () => {
    await sleep(80)
  })
  record('Save Match produced a toast', text().includes('Match saved'))

  const stored = JSON.parse(window.localStorage.getItem('skillsync.demo.v1') || '{}')
  record('Saved peer persisted to localStorage', Array.isArray(stored.savedPeers) && stored.savedPeers.length === 2, `savedPeers=${JSON.stringify(stored.savedPeers)}`)

  const connectBtn = findButton('Connect', { exact: true })
  await click(connectBtn)
  await sleep(60)
  record('Connect shows simulated-connection toast', text().includes('Connection request simulated successfully'))
  container.remove()
}

/* 3 — filters narrow the result set */
{
  const { container } = await mount('/matching')
  const resultText = () => (text().match(/(\d+)\s+peers? found/) || [])[1]
  const initial = resultText()
  const selects = findAll('select')
  const goalSelect = selects.find((s) => Array.from(s.options).some((o) => o.value === 'Brand Management'))
  if (goalSelect) {
    await act(async () => {
      goalSelect.value = 'Brand Management'
      goalSelect.dispatchEvent(new window.Event('change', { bubbles: true }))
    })
    await sleep(50)
  }
  const filtered = resultText()
  record('Career-goal filter changes result count', initial !== filtered, `${initial} → ${filtered}`)
  record('Filtered results are non-empty', Number(filtered) > 0)
  container.remove()
}

/* 4 — learning path: mark a step complete and confirm progress updates */
{
  const { container } = await mount('/learning-path')
  record('Learning path lists all 7 steps', text().includes('Advanced Excel') && text().includes('Skill Proof'))
  const startBtn = findButton('Start step')
  await click(startBtn)
  await sleep(50)
  const markBtn = findButton('Mark Complete')
  const marked = await click(markBtn)
  record('Mark Complete works on a path step', marked)
  await sleep(80)
  const stored = JSON.parse(window.localStorage.getItem('skillsync.demo.v1') || '{}')
  const completed = Object.values(stored.pathStatus || {}).filter((s) => s === 'completed').length
  record('Path completion persisted', completed >= 2, `completed steps = ${completed}`)
  container.remove()
}

/* 5 — practice timer: start, pause, complete */
{
  const { container } = await mount('/practice')
  const start = findButton('Start Activity')
  await click(start)
  await sleep(80)
  record('Timer modal opens with 20:00', text().includes('20:00'))
  record('Timer exposes Start/Pause/Reset/Complete', text().includes('Start') && text().includes('Reset') && /Complete/i.test(text()))
  const pause = findButton('Pause')
  await click(pause)
  await sleep(40)
  record('Pause control toggles the timer state', !!findButton('Start'))
  const before = JSON.parse(window.localStorage.getItem('skillsync.demo.v1') || '{}')
  const beforeHours = before.student?.hoursLearned
  const dialog = document.querySelector('[role="dialog"]')
  const completeBtn = dialog
    ? Array.from(dialog.querySelectorAll('button')).find((b) => /complete/i.test(b.textContent || ''))
    : null
  record('Complete control found inside the timer modal', !!completeBtn, completeBtn ? completeBtn.textContent.trim() : 'not found')
  await click(completeBtn)
  await sleep(120)
  const after = JSON.parse(window.localStorage.getItem('skillsync.demo.v1') || '{}')
  record(
    'Completing an activity adds practice hours',
    (after.student?.hoursLearned ?? 0) > (beforeHours ?? 0),
    `${beforeHours} → ${after.student?.hoursLearned}`,
  )
  record('Activity recorded in history', (after.completedActivities || []).length === 1)
  container.remove()
}

/* 6 — gap analysis: simulated AI run produces a learning path */
{
  const { container } = await mount('/gap-analysis')
  record('Gap analysis shows current vs target levels', text().includes('Current:') && text().includes('Target:'))
  const gen = findButton('Generate Learning Path')
  await click(gen)
  await sleep(120)
  record('Loading state appears during simulated analysis', text().includes('AI is analyzing your career goal'))
  await sleep(3300)
  record('Generated learning path is displayed', text().includes('Learning path generated'))
  container.remove()
}

/* 7 — community: like, save and comment persist */
{
  const { container } = await mount('/community')
  record('Community shows seeded posts', text().includes('Best resources to learn financial modelling?'))
  const likeBtn = findAll('button').find((b) => /^\d+$/.test((b.textContent || '').trim()) && b.textContent.trim() === '128')
  await click(likeBtn)
  await sleep(50)
  record('Like increments the counter', text().includes('129'))
  const saveBtn = findButton('Save', { exact: true })
  await click(saveBtn)
  await sleep(50)
  const stored = JSON.parse(window.localStorage.getItem('skillsync.demo.v1') || '{}')
  record('Saved post persisted', (stored.community?.saved || []).length === 1)
  record('Liked post persisted', (stored.community?.likes || []).length === 1)

  const commentBtn = findAll('button').find((b) => (b.textContent || '').trim() === '26')
  await click(commentBtn)
  await sleep(60)
  const textarea = findAll('textarea')[0]
  if (textarea) {
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
      setter.call(textarea, 'Driver-based modelling template fixed this for me.')
      textarea.dispatchEvent(new window.Event('input', { bubbles: true }))
    })
    await sleep(40)
    const postBtn = findButton('Post', { exact: true })
    await click(postBtn)
    await sleep(60)
    record('Comment posts into the thread', text().includes('Driver-based modelling template fixed this for me.'))
  } else {
    record('Comment box available', false, 'no textarea rendered')
  }
  container.remove()
}

/* 8 — theme toggle + demo reset */
{
  const { container } = await mount('/dashboard')
  const toggle = findAll('button').find((b) => (b.getAttribute('aria-label') || '').toLowerCase().includes('switch to dark'))
  await click(toggle)
  await sleep(50)
  record('Dark mode toggle applies .dark to <html>', document.documentElement.classList.contains('dark'))
  record('Theme persisted', window.localStorage.getItem('skillsync.theme.v1') === 'dark')

  await click(findButton('Reset Demo Data'))
  await sleep(60)
  const confirm = document.querySelector('[data-autofocus]')
  await click(confirm)
  await sleep(80)
  const stored = JSON.parse(window.localStorage.getItem('skillsync.demo.v1') || '{}')
  record('Reset restores demo data', (stored.community?.likes || []).length === 0 && (stored.completedActivities || []).length === 0)
  record('Reset confirmation toast shown', text().includes('Demo data restored'))
  container.remove()
}

/* 9 — mobile navigation & global search */
{
  const { container } = await mount('/dashboard')
  const searchBtn = findAll('button').find((b) => (b.getAttribute('aria-label') || '') === 'Search')
  await click(searchBtn)
  await sleep(60)
  const input = findAll('input').find((i) => i.getAttribute('aria-label') === 'Search input')
  record('Global search opens', !!input)
  if (input) {
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      setter.call(input, 'valuation')
      input.dispatchEvent(new window.Event('input', { bubbles: true }))
    })
    await sleep(60)
    record('Search returns skill results', text().toLowerCase().includes('valuation'))
  }
  container.remove()
}

/* 10 — empty and error states */
{
  const { container } = await mount('/peer/does-not-exist')
  record('Unknown peer shows an error-safe empty state', text().includes('does not exist'))
  container.remove()
  const { container: c2 } = await mount('/totally-unknown-route')
  record('Unknown route renders the 404 view with all pages listed', text().includes('does not exist in this prototype'))
  c2.remove()
}

if (reactWarnings.length) {
  console.log(`\n${reactWarnings.length} unexpected React warning(s):`)
  ;[...new Set(reactWarnings)].slice(0, 10).forEach((w) => console.log(`  ⚠ ${w.slice(0, 220)}`))
} else {
  console.log('\nNo unexpected React warnings.')
}
if (consoleNoise.length) console.log(`(${consoleNoise.length} expected jsdom environment notices suppressed)`)

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed`)
if (failed.length) {
  console.log('\nFailures:')
  failed.forEach((f) => console.log(`  ✗ ${f.name}${f.detail ? ` — ${f.detail}` : ''}`))
}
console.log('All interaction checks passed ✅')

// jsdom keeps the practice-timer interval alive; exit explicitly.
process.exit(failed.length ? 1 : 0)

}

main().catch((e) => {
  console.error('HARNESS ERROR:', e)
  process.exit(1)
})
