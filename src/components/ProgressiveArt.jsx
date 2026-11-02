import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Atmospheric photo backdrop that fades in then out as the parent section scrolls.
 * Parent section should be position: relative (use .has-art).
 */
export default function ProgressiveArt({
  image,
  className = '',
  opacity = 0.2,
  dark = false,
}) {
  const ref = useRef(null)
  const peak = dark ? Math.min(opacity + 0.22, 0.58) : opacity

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const section = el.closest('section') || el.parentElement
      if (!section) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(el, { opacity: peak * 0.7 })
        return
      }

      gsap.set(el, { opacity: 0, scale: 1.1 })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 92%',
            end: 'bottom 8%',
            scrub: 0.85,
          },
        })
        .to(el, { opacity: peak, scale: 1, duration: 0.38, ease: 'none' })
        .to(el, { opacity: peak, scale: 1, duration: 0.24, ease: 'none' })
        .to(el, { opacity: 0, scale: 1.04, duration: 0.38, ease: 'none' })
    },
    { scope: ref, dependencies: [image, peak] },
  )

  return (
    <div
      ref={ref}
      className={`progressive-art${dark ? ' progressive-art--dark' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <img src={image} alt="" loading="lazy" decoding="async" />
      <div className="progressive-art-veil" />
    </div>
  )
}
