import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function DivisionCard({ image, title, text, to }) {
  const cardRef = useRef(null)
  const arrowRef = useRef(null)

  useGSAP(
    () => {
      const card = cardRef.current
      const arrow = arrowRef.current
      if (!card || !arrow) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const xTo = gsap.quickTo(arrow, 'x', { duration: 0.35, ease: 'power3' })
      const yTo = gsap.quickTo(arrow, 'y', { duration: 0.35, ease: 'power3' })

      const onMove = (e) => {
        const rect = card.getBoundingClientRect()
        const relX = e.clientX - rect.left - rect.width + 40
        const relY = e.clientY - rect.top - rect.height + 40
        xTo(gsap.utils.clamp(-10, 10, relX * 0.08))
        yTo(gsap.utils.clamp(-10, 10, relY * 0.08))
      }

      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerleave', onLeave)
      return () => {
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: cardRef },
  )

  return (
    <Link to={to} className="division-card" ref={cardRef}>
      <img src={image} alt="" loading="lazy" />
      <div className="division-card-body">
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="card-arrow" ref={arrowRef} aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  )
}
