import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Mathias/Duocase-style scrubbed count-up */
export default function CountUp({
  to = 100,
  suffix = '',
  prefix = '',
  duration = 1.4,
  className = '',
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        el.textContent = `${prefix}${to}${suffix}`
        return
      }
      const obj = { val: 0 }
      gsap.to(obj, {
        val: to,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`
        },
      })
    },
    { scope: ref, dependencies: [to, suffix, prefix, duration] },
  )

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
