import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Reveal({
  children,
  className = '',
  style,
  y = 22,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 0.75,
  as: Tag = 'div',
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (document.body.classList.contains('cms-edit-mode') || prefersReducedMotion()) {
        gsap.set(el, { clearProps: 'transform,opacity,filter', autoAlpha: 1, x: 0, y: 0, scale: 1 })
        return
      }

      // Soft enter — never hard opacity 0 + blur (that reads as a white flash on light bg)
      gsap.fromTo(
        el,
        { autoAlpha: 0.15, y, x, scale },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration,
          delay,
          ease: 'power2.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
          },
        },
      )
    },
    { scope: ref, dependencies: [y, x, scale, delay, duration] },
  )

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  )
}
