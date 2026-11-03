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

export function shouldSkipScrollMotion() {
  return prefersReducedMotion() || isCmsEditing()
}

export function softRefreshScroll() {
  clearTimeout(softTimer)
  softTimer = setTimeout(() => {
    if (!isCmsEditing()) ScrollTrigger.refresh()
  }, 120)
}

function unwrapPinSpacers() {
  document.querySelectorAll('.pin-spacer').forEach((el) => {
    const child = el.firstElementChild
    if (child && el.parentNode) {
      el.parentNode.insertBefore(child, el)
    }
    el.remove()
  })
}

/** Restore stacked pin sections so only the first panel is visible (normal mode). */
export function resetPinnedSections() {
  gsap.set('.events-rail-track, .work-runway-track', { clearProps: 'transform', x: 0, y: 0 })

  document.querySelectorAll('.story-panel').forEach((el, i) => {
    gsap.set(el, {
      clearProps: 'transform,filter',
      autoAlpha: i === 0 ? 1 : 0,
      y: 0,
      x: 0,
    })
  })
  document.querySelectorAll('.story-art').forEach((el, i) => {
    gsap.set(el, {
      clearProps: 'transform,filter',
      autoAlpha: i === 0 ? 1 : 0,
      scale: i === 0 ? 1.04 : 1,
    })
  })

  document.querySelectorAll('.manifesto-panel').forEach((el, i) => {
    gsap.set(el, {
      clearProps: 'transform,filter',
      autoAlpha: i === 0 ? 1 : 0,
      y: 0,
    })
  })
  document.querySelectorAll('.manifesto-art').forEach((el, i) => {
    gsap.set(el, {
      clearProps: 'transform,filter',
      autoAlpha: i === 0 ? 1 : 0,
      scale: 1,
    })
  })
}

/**
 * Kill ScrollTriggers for live edit — do NOT force every panel to opacity:1
 * (that stacks story/manifesto text on top of itself).
 */
export function freezeScrollMotion() {
  clearTimeout(softTimer)
  clearTimeout(hardTimer)
  refreshGen += 1
  ScrollTrigger.getAll().forEach((st) => st.kill())
  unwrapPinSpacers()

  gsap.set('.events-rail-track, .work-runway-track', { clearProps: 'transform', x: 0, y: 0 })
  gsap.set(
    '.progressive-art-draw, .reveal, .division-card, .work-thumb, .service-panel, .golf-step, .golf-service-card, .creative-frame, .creative-chip, .about-moment, .division-slide, .value-row, .method-step, .insight-row, .work-case, .work-runway-card, .events-rail-card, .trust-item, .contact-channel, .contact-visual, .contact-form-panel',
    { clearProps: 'transform,filter,x,y,scale,rotate,rotateX', autoAlpha: 1 },
  )

  // Leave story/manifesto opacity alone — CSS in cms-edit-mode unstacks them for editing
  gsap.set('.story-panel, .story-art, .manifesto-panel, .manifesto-art', {
    clearProps: 'transform,filter,x,y,scale',
  })
}

/** Call when leaving edit mode before pages rebuild motion. */
export function resumeScrollMotion() {
  unwrapPinSpacers()
  resetPinnedSections()
  softRefreshScroll()
  window.dispatchEvent(new Event('ag-cms-motion-resume'))
}

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

export function listSignature(items) {
  if (!items?.length) return '0'
  return `${items.length}:${items.map((i) => i.card?.id || i.id || i.title || i.src || '').join('|')}`
}

/**
 * useGSAP deps: while editing, ignore list signatures so add/delete cards
 * does not tear down / rebuild scroll mid-edit (that was breaking GSAP).
 */
export function motionDeps(motionEnabled, motionKey, ...signatures) {
  return motionEnabled ? [motionKey, ...signatures] : [motionKey, 'editing']
}

export function softScrollIn(targets, vars = {}) {
  const {
    y = 28,
    scale = 1,
    stagger = 0.08,
    duration = 0.75,
    trigger,
    start = 'top 88%',
    ...rest
  } = vars

  return gsap.fromTo(
    targets,
    { autoAlpha: 0.2, y, scale },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      ease: 'power2.out',
      overwrite: 'auto',
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            toggleActions: 'play none none none',
            once: true,
          }
        : undefined,
      ...rest,
    },
  )
}
