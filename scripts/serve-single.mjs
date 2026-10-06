/**
 * Zero-dependency static server for the SkillSync demo.
 *
 * Why this exists: in this sandbox, `node_modules` and `dist` are excluded from
 * workspace snapshots, so they vanish between sessions — but the self-contained
 * `SkillSync-demo.html` persists. Serving that file needs no install step, no
 * bundler and no HMR websocket, which makes it the most reliable possible preview.
 *
 * Run: node scripts/serve-single.mjs [port] [file]
 */
import { createServer } from 'node:http'
import { readFileSync, statSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const PORT = Number(process.argv[2] || 5173)
const ROOT = new URL('..', import.meta.url).pathname
const FILE = join(ROOT, process.argv[3] || 'SkillSync-demo.html')
const DIST_SINGLE = join(ROOT, 'dist-single')

if (!existsSync(FILE)) {
  console.error(`✗ ${FILE} not found. Build it with: npm run build:single`)
  process.exit(1)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

const shell = readFileSync(FILE)

const server = createServer((req, res) => {
  let pathname = '/'
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    /* malformed URL — fall through to the app shell */
  }

  // Static assets emitted alongside the single-file build (if any).
  if (pathname !== '/' && pathname.includes('.')) {
    const candidate = join(DIST_SINGLE, pathname.replace(/^\/+/, ''))
    if (candidate.startsWith(DIST_SINGLE) && existsSync(candidate) && statSync(candidate).isFile()) {
      res.writeHead(200, {
        'Content-Type': MIME[extname(candidate)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      res.end(readFileSync(candidate))
      return
    }
  }

  // Everything else is the app shell. The bundle uses hash routing, so any
  // path or query resolves to the same document — no SPA fallback needed.
  res.writeHead(200, {
    'Content-Type': MIME['.html'],
    'Content-Length': shell.length,
    'Cache-Control': 'no-store',
    // Deliberately NO X-Frame-Options / CSP frame-ancestors: the preview
    // renders inside an iframe and must not be blocked from embedding.
  })
  res.end(req.method === 'HEAD' ? undefined : shell)
})

server.listen(PORT, '0.0.0.0', () => {
  const kb = (shell.length / 1024).toFixed(0)
  console.log(`\n  SkillSync — static preview ready`)
  console.log(`  serving   SkillSync-demo.html (${kb} KB, self-contained)`)
  console.log(`  local     http://localhost:${PORT}/`)
  console.log(`  network   http://0.0.0.0:${PORT}/  (0.0.0.0 — reachable by the preview proxy)`)
  console.log(`\n  No HMR socket, no external requests, no install required.\n`)
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    console.log(`\n  shutting down (${sig})`)
    server.close(() => process.exit(0))
  })
}
