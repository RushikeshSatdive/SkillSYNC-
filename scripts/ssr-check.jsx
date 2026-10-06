import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { StaticRouter } from 'react-router-dom/server'
import App from '../src/App'
import { PEERS } from '../src/data/mockData'
import { ALL_PAGES } from '../src/data/nav'

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }
const noop = () => {}
globalThis.window = {
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }),
  location: { origin: 'http://localhost:5173', hash: '', pathname: '/' },
  scrollTo: noop, addEventListener: noop, removeEventListener: noop,
  localStorage: globalThis.localStorage,
}
globalThis.document = {
  documentElement: { classList: { toggle: noop, add: noop, remove: noop }, scrollHeight: 1000, clientHeight: 800, scrollTop: 0 },
  addEventListener: noop, removeEventListener: noop, body: { style: {} },
  querySelector: () => null,
  createElement: () => ({ style: {}, classList: { add: noop }, appendChild: noop }),
}
globalThis.navigator = { clipboard: { writeText: async () => {} } }

const ROUTES = [...ALL_PAGES.map(p => p.to), ...PEERS.map(p => `/peer/${p.id}`), '/peer/nope', '/nope']

const errors = []
const warns = []
const oe = console.error, ow = console.warn
console.error = (...a) => errors.push(a.map(x => typeof x === 'string' ? x : (x && x.message) || String(x)).join(' '))
console.warn = (...a) => warns.push(a.map(x => typeof x === 'string' ? x : (x && x.message) || String(x)).join(' '))

let ok = 0
for (const route of ROUTES) {
  try {
    const html = renderToString(createElement(StaticRouter, { location: route }, createElement(App)))
    if (!html || html.length < 400) throw new Error('small output: ' + (html ? html.length : 0))
    ok++
  } catch (e) {
    errors.push(`ROUTE ${route} THREW: ${e.message}`)
  }
}
console.error = oe; console.warn = ow
console.log(`${ok}/${ROUTES.length} routes rendered`)
const hard = errors.filter(e => !/width\(0\) and height\(0\)|ResponsiveContainer/i.test(e))
if (warns.length) { console.log(`WARN x${warns.length}`); [...new Set(warns)].slice(0,10).forEach(w=>console.log('  ⚠ '+w.slice(0,200))) }
if (hard.length) { console.log(`ERR x${hard.length}`); [...new Set(hard)].slice(0,20).forEach(e=>console.log('  ✗ '+e.slice(0,300))); process.exit(1) }
console.log('No render errors ✅')
