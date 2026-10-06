import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

/**
 * BrowserRouter for `npm run dev` / normal hosting.
 * HashRouter when building the self-contained single-file bundle
 * (VITE_HASH_ROUTER=1), because a sandboxed iframe with an opaque origin
 * blocks history.pushState — hash routing needs no History API at all.
 */
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter

// Build marker so a bundle's router mode can be verified by inspection.
globalThis.__SKILLSYNC_ROUTER__ = import.meta.env.VITE_HASH_ROUTER === '1' ? 'hash' : 'browser'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
