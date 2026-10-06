import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set SKILLSYNC_NO_HMR=1 when serving through a proxied preview iframe.
// A failing HMR websocket can cause blank/reloading previews.
const noHmr = process.env.SKILLSYNC_NO_HMR === '1'

export default defineConfig({
  // Required for GitHub Pages project deployment
  base: '/SkillSYNC-/',

  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
    hmr: noHmr ? false : { clientPort: 443 },
  },

  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    allowedHosts: true,
  },
})
