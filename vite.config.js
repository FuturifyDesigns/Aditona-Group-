import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const PRODUCTION_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "worker-src 'self' blob:",
  'upgrade-insecure-requests',
].join('; ')

function htmlSecurity() {
  return {
    name: 'html-security',
    transformIndexHtml(html, ctx) {
      if (!ctx.server) {
        // Production build only — avoid breaking Vite HMR in dev.
        const tags = [
          `<meta http-equiv="Content-Security-Policy" content="${PRODUCTION_CSP}" />`,
          '<meta name="referrer" content="strict-origin-when-cross-origin" />',
          '<meta http-equiv="X-Content-Type-Options" content="nosniff" />',
          '<meta http-equiv="X-Frame-Options" content="DENY" />',
        ].join('\n    ')
        return html.replace('<head>', `<head>\n    ${tags}`)
      }
      return html
    },
  }
}

export default defineConfig({
  plugins: [react(), htmlSecurity()],
  base: '/',
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    modulePreload: { polyfill: false },
  },
  oxc: {
    drop: ['console', 'debugger'],
  },
})
