import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { StaticRouter } from 'react-router-dom/server'
import App from '../src/App'

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }
const noop = () => {}
globalThis.window = { matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }), location: { origin: 'x', hash: '', pathname: '/' }, scrollTo: noop, addEventListener: noop, removeEventListener: noop, localStorage: globalThis.localStorage }
globalThis.document = { documentElement: { classList: { toggle: noop } }, addEventListener: noop, removeEventListener: noop, body: { style: {} }, querySelector: () => null }
globalThis.navigator = {}

const routes = ['/', '/dashboard', '/profile', '/gap-analysis', '/matching', '/peer/aarav', '/learning-path', '/practice', '/exchange', '/progress', '/proof', '/community', '/impact', '/pricing', '/market', '/unit-economics', '/go-to-market', '/financials', '/funding', '/about']
const bad = []
for (const r of routes) {
  const html = renderToString(createElement(StaticRouter, { location: r }, createElement(App)))
  const txt = html.replace(/<[^>]+>/g, ' ')
  for (const needle of ['[object Object]', 'NaN', 'undefined', 'Infinity']) {
    if (txt.includes(needle)) bad.push(`${r} contains "${needle}"`)
  }
  const words = txt.split(/\s+/).filter(Boolean).length
  if (words < 120) bad.push(`${r} looks thin (${words} words)`)
}
console.log(bad.length ? 'ISSUES:\n' + bad.join('\n') : 'Content sanity check passed: no [object Object], NaN, undefined or thin pages ✅')
