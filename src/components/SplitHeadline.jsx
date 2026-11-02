import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function SplitHeadline({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
}) {
  const ref = useRef(null)
  const words = useMemo(() => text.split(' ').filter(Boolean), [text])

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const spans = el.querySelectorAll('.split-line > span')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set(spans, { y: 0, clearProps: 'transform' })
        return
      }

      gsap.fromTo(
        spans,
        { y: '110%' },
        {
          y: '0%',
          duration: 0.9,
          stagger: 0.045,
          delay,
          ease: 'power3.out',
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              }),
        },
      )
    },
    { scope: ref, dependencies: [text, delay, immediate] },
  )

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          className="split-line"
          key={`${word}-${i}`}
          aria-hidden="true"
          style={{ display: 'inline-block', verticalAlign: 'bottom' }}
        >
          <span>
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
