import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function HeroSlideshow({ slides = [], children }) {
  const rootRef = useRef(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (!rootRef.current || !slides.length) return
      const nodes = Array.from(rootRef.current.querySelectorAll('.hero-slide'))
      if (!nodes.length) return

      gsap.set(nodes, { opacity: 0, scale: 1.04 })
      gsap.set(nodes[0], { opacity: 1, scale: 1.06 })
      indexRef.current = 0
    },
    { scope: rootRef, dependencies: [slides.length] },
  )

  useEffect(() => {
    if (reduced || slides.length < 2) return undefined

    const id = window.setInterval(() => {
      const root = rootRef.current
      if (!root) return
      const nodes = root.querySelectorAll('.hero-slide')
      if (nodes.length < 2) return

      const prev = indexRef.current
      const next = (prev + 1) % nodes.length
      indexRef.current = next
      setIndex(next)

      // Crossfade on black hero — never drop all slides to 0 (that flashes)
      gsap.to(nodes[prev], {
        opacity: 0,
        scale: 1.1,
        duration: 1.1,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
      gsap.fromTo(
        nodes[next],
        { opacity: 0, scale: 1.04 },
        {
          opacity: 1,
          scale: 1.06,
          duration: 1.1,
          ease: 'power2.inOut',
          overwrite: 'auto',
        },
      )
    }, 5500)

    return () => window.clearInterval(id)
  }, [slides.length, reduced])

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero-slides" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={`hero-slide${i === index ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            role="img"
            aria-label={slide.alt || ''}
          />
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-content hero-content--home">{children}</div>
    </section>
  )
}
