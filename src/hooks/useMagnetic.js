import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Subtle magnetic pull toward the pointer (Duocase / Mathias-style).
 * Applies quickTo x/y on the element; optional opacity scrub on a child.
 */
export function useMagnetic(ref, options = {}) {
  const {
    strength = 0.28,
    max = 14,
    duration = 0.45,
    ease = 'power3',
    opacityTarget = null,
    enabled = true,
  } = options

  useEffect(() => {
    const el = ref?.current
    if (!el || !enabled) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const xTo = gsap.quickTo(el, 'x', { duration, ease })
    const yTo = gsap.quickTo(el, 'y', { duration, ease })
    const opacityEl = opacityTarget?.current || null
    const oTo = opacityEl
      ? gsap.quickTo(opacityEl, 'opacity', { duration: 0.35, ease: 'power2' })
      : null

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      xTo(gsap.utils.clamp(-max, max, dx))
      yTo(gsap.utils.clamp(-max, max, dy))
      if (oTo) {
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
        const t = gsap.utils.clamp(0.72, 1, 1 - dist / (rect.width * 1.2))
        oTo(t)
      }
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
      if (oTo) oTo(1)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.set(el, { x: 0, y: 0 })
      if (opacityEl) gsap.set(opacityEl, { opacity: 1 })
    }
  }, [ref, strength, max, duration, ease, opacityTarget, enabled])
}
