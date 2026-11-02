import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Reveal({
  children,
  className = '',
  style,
  y = 40,
  x = 0,
  scale = 0.96,
  delay = 0,
  duration = 0.9,
  as: Tag = 'div',
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(el, { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1 })
        return
      }

      gsap.fromTo(
        el,
        { opacity: 0, y, x, scale, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
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
