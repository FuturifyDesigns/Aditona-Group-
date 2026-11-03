import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let softTimer
let hardTimer
let configured = false
let refreshGen = 0

/** Safer ScrollTrigger defaults for mobile SPA routing. */
export function setupScrollDefaults() {
  if (configured) return
  configured = true

  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  })

  // Match scroll position more tightly — high scrub numbers feel laggy / “glitchy”.
  ScrollTrigger.defaults({
    anticipatePin: 1,
  })

  const soft = () => softRefreshScroll()
  window.addEventListener('orientationchange', soft)
  window.addEventListener('pageshow', soft)
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => softRefreshScroll())
  }
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isCmsEditing() {
  return document.body.classList.contains('cms-edit-mode')
}

/** True when scroll choreography should be skipped (edit live or reduced motion). */
export function shouldSkipScrollMotion() {
  return prefersReducedMotion() || isCmsEditing()
}

export function softRefreshScroll() {
  clearTimeout(softTimer)
  softTimer = setTimeout(() => {
    ScrollTrigger.refresh()
  }, 120)
}

/**
 * Kill every ScrollTrigger and clear common transform leftovers so the page
 * can be edited / scrolled normally without pin spacers fighting the layout.
 */
export function freezeScrollMotion() {
  clearTimeout(softTimer)
  clearTimeout(hardTimer)
  refreshGen += 1
  ScrollTrigger.getAll().forEach((st) => st.kill())
  // Clear leftover pin spacers GSAP may leave mid-kill
  document.querySelectorAll('.pin-spacer').forEach((el) => {
    const child = el.firstElementChild
    if (child && el.parentNode) {
      el.parentNode.insertBefore(child, el)
    }
    el.remove()
  })
  gsap.set(
    '.story-panel, .story-art, .manifesto-panel, .manifesto-art, .events-rail-track, .work-runway-track, .progressive-art-draw, .reveal, .division-card, .work-thumb, .service-panel, .golf-step, .golf-service-card, .creative-frame, .creative-chip, .about-moment, .division-slide, .value-row, .method-step, .insight-row, .work-case, .work-runway-card, .events-rail-card',
    { clearProps: 'transform,opacity,filter,x,y,scale,rotate,rotateX' },
  )
}

/**
 * Wait for images/fonts, then refresh ScrollTrigger once (debounced).
 * Avoids the old triple-refresh that made pins jump while scrolling.
 */
export function hardRefreshScroll(root = document) {
  clearTimeout(hardTimer)
  const gen = ++refreshGen

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
    if (gen !== refreshGen) return
    if (isCmsEditing()) return
    requestAnimationFrame(() => {
      if (gen !== refreshGen) return
      clearTimeout(hardTimer)
      hardTimer = setTimeout(() => {
        if (gen !== refreshGen || isCmsEditing()) return
        ScrollTrigger.refresh()
      }, 80)
    })
  })
}

export function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches
}

/** Stable pin options — low scrub lag, no preventOverlaps (that caused jumps). */
export function pinOptions(extra = {}) {
  const mobile = isMobileViewport()
  const { scrub: scrubOverride, ...rest } = extra
  return {
    pin: true,
    scrub: scrubOverride ?? (mobile ? true : 0.35),
    anticipatePin: mobile ? 0 : 1,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    pinSpacing: true,
    ...rest,
  }
}

/** Stable signature for CMS lists so useGSAP does not re-init on every render. */
export function listSignature(items) {
  if (!items?.length) return '0'
  return `${items.length}:${items.map((i) => i.card?.id || i.id || i.title || i.src || '').join('|')}`
}
