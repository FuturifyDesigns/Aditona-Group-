import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function HeroSlideshow({ slides = [], children }) {
  const rootRef = useRef(null)
  const [index, setIndex] = useState(0)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (!rootRef.current || !slides.length) return
      const nodes = rootRef.current.querySelectorAll('.hero-slide')
      if (!nodes.length) return

      if (reduced) {
        gsap.set(nodes, { opacity: 0, scale: 1 })
        gsap.set(nodes[0], { opacity: 1, scale: 1 })
        return
      }

      nodes.forEach((node, i) => {
        gsap.set(node, {
          opacity: i === index ? 1 : 0,
          scale: i === index ? 1.08 : 1.06,
        })
      })

      const active = nodes[index]
      if (!active) return

      gsap.fromTo(
        active,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1.12, duration: 5, ease: 'none' },
      )
    },
    { scope: rootRef, dependencies: [index, slides.length, reduced], revertOnUpdate: true },
  )

  useEffect(() => {
    if (reduced || slides.length < 2) return undefined
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
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
      <div className="hero-content">{children}</div>
    </section>
  )
}
