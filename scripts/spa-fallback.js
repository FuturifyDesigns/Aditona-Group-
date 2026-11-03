import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Static hosts often serve 404.html for unknown paths.
 * Copy the SPA shell there so client routing (and the branded NotFound view) stays in-app.
 */
const dist = resolve('dist')
const indexPath = resolve(dist, 'index.html')
const notFoundPath = resolve(dist, '404.html')

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html missing — run the production build first')
}

copyFileSync(indexPath, notFoundPath)

const html = readFileSync(notFoundPath, 'utf8')
if (!html.includes('data-aditona-404')) {
  const patched = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>
    <noscript data-aditona-404>
      <div style="font-family:Inter,system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1.25rem;color:#1a1a1b">
        <p style="letter-spacing:.16em;text-transform:uppercase;font-size:.72rem;color:#6d6c6c">Error 404</p>
        <h1 style="letter-spacing:-.04em">This page isn’t here.</h1>
        <p style="color:#444342;line-height:1.6">Enable JavaScript, or go back to the homepage.</p>
        <p><a href="/" style="color:#000;font-weight:600">Back to home</a></p>
      </div>
    </noscript>`,
  )
  writeFileSync(notFoundPath, patched)
}

console.log('Created dist/404.html for SPA deep-link fallback')
