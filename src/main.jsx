import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

/**
 * Use BrowserRouter during local development.
 * Use HashRouter in production/GitHub Pages so
 * client-side routes work correctly on static hosting.
 */
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

// Build marker so the router mode can be verified if needed.
globalThis.__SKILLSYNC_ROUTER__ = import.meta.env.PROD ? 'hash' : 'browser'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
