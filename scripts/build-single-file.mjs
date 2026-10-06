/**
 * Builds a single, fully self-contained HTML file of the SkillSync demo.
 *
 * Why: the app can then be opened — or previewed in a sandboxed iframe —
 * with zero network access: no CDN fonts, no external bundles, no dev server.
 *
 * Run: npm run build:single
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const OUT_DIR = join(ROOT, 'dist-single')
const OUT_FILE = join(ROOT, 'SkillSync-demo.html')

const assets = readdirSync(join(OUT_DIR, 'assets'))
const jsFile = assets.find((f) => f.endsWith('.js'))
const cssFile = assets.find((f) => f.endsWith('.css'))

let html = readFileSync(join(OUT_DIR, 'index.html'), 'utf8')
let js = readFileSync(join(OUT_DIR, 'assets', jsFile), 'utf8')
let css = readFileSync(join(OUT_DIR, 'assets', cssFile), 'utf8')

const before = { kb: (n) => `${(n / 1024).toFixed(0)} KB`, js: js.length, css: css.length }

// 1. Drop remote @import statements — nothing may require the network.
//    Two traps here: Vite emits the compact `@import"…"` form (no parens), and
//    the font URL itself contains semicolons inside `wght@400;500;600`. So the
//    match must run to the closing QUOTE, not to the first semicolon.
css = css.replace(/@import\s*(?:url\(\s*)?(["'])https?:\/\/[\s\S]*?\1\s*\)?\s*;?/gi, '')
css = css.replace(/@import\s+url\(\s*https?:\/\/[\s\S]*?\)\s*;?/gi, '')

// 2. Never let bundle contents terminate the <script> element early.
js = js.replace(/<\/script/gi, '<\\/script')

// 3. Inline the CSS and JS.
//    NOTE: replacer FUNCTIONS are required — a string replacement would expand
//    `$&`, `` $` `` and `$'` sequences present in the minified bundle, which
//    silently duplicated markup the first time this was built.
html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, () => `<style>${css}</style>`)
html = html.replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '')
html = html.replace(
  /<script[^>]*type="module"[^>]*src="[^"]*"[^>]*>\s*<\/script>/g,
  () => `<script type="module">${js}</script>`,
)

writeFileSync(OUT_FILE, html)

/* ------------------------- verification ------------------------- */
const problems = []
const count = (re) => (html.match(re) || []).length

if (count(/<title>/g) !== 1) problems.push(`expected exactly 1 <title>, found ${count(/<title>/g)}`)
if (count(/<style>/g) !== 1) problems.push(`expected exactly 1 <style>, found ${count(/<style>/g)}`)
if (count(/<script type="module">/g) !== 1) problems.push(`expected exactly 1 inline module script, found ${count(/<script type="module">/g)}`)
if (count(/id="root"/g) !== 1) problems.push(`expected exactly 1 #root, found ${count(/id="root"/g)}`)
if (count(/<script[^>]*src=/g) !== 0) problems.push('a script with an external src survived')
if (count(/<link[^>]+rel="stylesheet"/g) !== 0) problems.push('an external stylesheet link survived')
if (/fonts\.googleapis/.test(html)) problems.push('remote font @import survived')
const leftoverImports = [...css.matchAll(/@import[^;{]{0,80}/gi)].map((m) => m[0])
if (leftoverImports.length) problems.push(`unresolved @import in CSS: ${leftoverImports.join(' | ')}`)
if (!html.includes('__SKILLSYNC_ROUTER__')) problems.push('hash-router marker missing — wrong router for a sandboxed iframe')
if (!html.includes('hash')) problems.push('no hash routing hint present')

const externals = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map((m) => m[1])

console.log(`\nWrote ${OUT_FILE.replace(ROOT, '')}`)
console.log(`  inline JS   ${before.kb(before.js)}`)
console.log(`  inline CSS  ${before.kb(before.css)}`)
console.log(`  total HTML  ${before.kb(html.length)}`)
console.log(`  external refs: ${externals.length ? externals.join(', ') : 'none — fully self-contained'}`)

if (problems.length) {
  console.log('\n✗ Single-file verification FAILED:')
  problems.forEach((p) => console.log(`   - ${p}`))
  process.exit(1)
}
console.log('  verification: 8/8 checks passed ✅')
