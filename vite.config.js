import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set SKILLSYNC_NO_HMR=1 when serving through a proxied preview iframe:
// a failing HMR websocket is a common cause of blank / reload-looping previews.
const noHmr = process.env.SKILLSYNC_NO_HMR === '1'

export default defineConfig({
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
