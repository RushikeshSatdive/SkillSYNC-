/**
 * Verifies the built single-file artifact actually boots.
 *
 * Extracts the inline module bundle from SkillSync-demo.html, executes it
 * inside a jsdom browser environment, and asserts that React mounted the
 * SkillSync app (not just that the HTML looks right).
 *
 * Run: npm run check:single
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { JSDOM } from 'jsdom'

const ROOT = new URL('..', import.meta.url).pathname
const html = readFileSync(join(ROOT, 'SkillSync-demo.html'), 'utf8')

/* ---------- extract the inline bundle ---------- */
const m = html.match(/<script type="module">([\s\S]*?)<\/script>/)
if (!m) {
  console.log('✗ no inline module script found in SkillSync-demo.html')
  process.exit(1)
}
const bundle = m[1].replace(/<\\\/script/g, '</script')

mkdirSync(join(ROOT, '.cache'), { recursive: true })
const bundlePath = join(ROOT, '.cache', 'single-bundle.mjs')
writeFileSync(bundlePath, bundle)

/* ---------- jsdom browser environment ---------- */
const dom = new JSDOM(html.replace(/<script type="module">[\s\S]*?<\/script>/, ''), {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})
const { window } = dom

globalThis.window = window
globalThis.document = window.document
globalThis.navigator = window.navigator

// jsdom puts these on `window`, but the bundled React/prop-types code refers to
// them as bare globals. Mirror every constructor the bundle might touch.
for (const key of [
  'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLButtonElement',
  'Element', 'Node', 'NodeList', 'DocumentFragment', 'ShadowRoot', 'SVGElement', 'Event', 'CustomEvent',
  'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'InputEvent', 'PointerEvent', 'MutationObserver',
  'DOMParser', 'XMLSerializer', 'getComputedStyle', 'DOMException', 'CSSStyleDeclaration',
  'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'localStorage', 'sessionStorage',
]) {
  if (key in window) {
    try {
      globalThis[key] = window[key]
    } catch {
      /* getters that throw (localStorage under an opaque origin) are handled below */
    }
  }
}
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0)
globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
globalThis.IS_REACT_ACT_ENVIRONMENT = false

// A sandboxed preview iframe has an OPAQUE origin, where localStorage throws.
// Simulate that exactly, to prove the app survives it rather than assuming.
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  get() {
    throw new window.DOMException(
      'Failed to read the "localStorage" property from "Window": The document is sandboxed and lacks the "allow-same-origin" flag.',
      'SecurityError',
    )
  },
})

window.matchMedia = () => ({
  matches: false, media: '', onchange: null,
  addListener: () => {}, removeListener: () => {},
  addEventListener: () => {}, removeEventListener: () => {},
  dispatchEvent: () => false,
})
window.scrollTo = () => {}
class Obs { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver = Obs
window.ResizeObserver = Obs
globalThis.IntersectionObserver = class {
  constructor(cb) { this.cb = cb }
  observe(el) { this.cb([{ isIntersecting: true, target: el }], this) }
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = globalThis.IntersectionObserver

/* ---------- run the real artifact ---------- */
const errors = []
const origError = console.error
console.error = (...a) => {
  const msg = a.map((x) => (typeof x === 'string' ? x : (x && x.message) || String(x))).join(' ')
  if (!/width\(0\) and height\(0\)|ResponsiveContainer/.test(msg)) errors.push(msg)
}

let booted = false
try {
  await import(bundlePath + `?t=${Date.now()}`)
  await new Promise((r) => setTimeout(r, 400))
  booted = true
} catch (e) {
  errors.push(`bundle threw on import: ${e.message}`)
}
console.error = origError

const results = []
const check = (name, pass, detail = '') => {
  results.push({ name, pass })
  console.log(`${pass ? '  ok  ' : '  FAIL'} ${name}${detail ? ` — ${detail}` : ''}`)
}

const root = document.getElementById('root')
const mounted = (root?.innerHTML || '').length
const bodyText = document.body.textContent || ''

console.log('\nSkillSync single-file boot check\n')
check('bundle imports without throwing', booted)
check('React mounted content into #root', mounted > 2000, `${mounted} chars`)
check('hash router active (sandbox-safe navigation)', globalThis.__SKILLSYNC_ROUTER__ === 'hash', `router=${globalThis.__SKILLSYNC_ROUTER__}`)
check('renders the SkillSync wordmark', /Skill\s*Sync/i.test(bodyText))
check('renders the hero tagline', bodyText.includes('Find the Right') && bodyText.includes('Build the Right Career'))
check('renders source-data statistics', bodyText.includes('4.33') && bodyText.includes('28.4') && bodyText.includes('54.81'))
check('renders problem section heading', bodyText.includes('Matching Problem'))
check('survives a throwing localStorage (sandboxed iframe)', errors.every((e) => !/localStorage/i.test(e)))
check('no unexpected console errors', errors.length === 0, errors.slice(0, 3).join(' | '))

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length) {
  failed.forEach((f) => console.log(`  ✗ ${f.name}`))
  process.exit(1)
}
console.log('Single-file artifact boots and renders ✅')
process.exit(0)
