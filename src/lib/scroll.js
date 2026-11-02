import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let softTimer
let hardTimer
let configured = false

/** Safer ScrollTrigger defaults for mobile SPA routing. */
export function setupScrollDefaults() {
  if (configured) return
  configured = true

  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  })

  const soft = () => softRefreshScroll()
  window.addEventListener('orientationchange', soft)
  window.addEventListener('pageshow', soft)
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => softRefreshScroll())
  }
}

export function softRefreshScroll() {
  clearTimeout(softTimer)
  softTimer = setTimeout(() => {
    ScrollTrigger.refresh()
  }, 60)
}

/**
 * Wait for images/fonts, then refresh ScrollTrigger a few times so pin spacers
 * match real layout (fixes mobile section overlap on first paint).
 */
export function hardRefreshScroll(root = document) {
  clearTimeout(hardTimer)

  const scope = root?.querySelectorAll ? root : document
  const imgs = Array.from(scope.querySelectorAll('img'))
  const pending = imgs
    .filter((img) => !img.complete)
    .map(
      (img) =>
        new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true })
          img.addEventListener('error', resolve, { once: true })
        }),
    )

  const fonts = document.fonts?.ready ?? Promise.resolve()

  return Promise.all([fonts, Promise.all(pending)]).then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true)
        clearTimeout(hardTimer)
        hardTimer = setTimeout(() => ScrollTrigger.refresh(), 180)
        setTimeout(() => ScrollTrigger.refresh(), 500)
      })
    })
  })
}

export function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches
}

/** Pin options that are more stable on mobile browsers. */
export function pinOptions(extra = {}) {
  const mobile = isMobileViewport()
  return {
    pin: true,
    scrub: extra.scrub ?? 0.65,
    anticipatePin: mobile ? 0 : 1,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    preventOverlaps: true,
    ...extra,
  }
}
