import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useCms } from '../cms/CmsContext'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(useGSAP)

export default function DivisionCard({ image, title, text, to }) {
  const cardRef = useRef(null)
  const bodyRef = useRef(null)
  const arrowRef = useRef(null)
  const { editMode } = useCms()

  useMagnetic(cardRef, {
    strength: 0.22,
    max: 12,
    duration: 0.4,
    opacityTarget: bodyRef,
    enabled: !editMode,
  })

  useGSAP(
    () => {
      const card = cardRef.current
      const arrow = arrowRef.current
      if (!card || !arrow) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || editMode) return

      const xTo = gsap.quickTo(arrow, 'x', { duration: 0.35, ease: 'power3' })
      const yTo = gsap.quickTo(arrow, 'y', { duration: 0.35, ease: 'power3' })

      const onMove = (e) => {
        const rect = card.getBoundingClientRect()
        const relX = e.clientX - rect.left - rect.width + 40
        const relY = e.clientY - rect.top - rect.height + 40
        xTo(gsap.utils.clamp(-12, 12, relX * 0.1))
        yTo(gsap.utils.clamp(-12, 12, relY * 0.1))
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
    { scope: cardRef, dependencies: [editMode] },
  )

  const onClick = (e) => {
    if (editMode) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <Link
      to={editMode ? '#' : to}
      className="division-card"
      ref={cardRef}
      onClick={onClick}
      onClickCapture={editMode ? onClick : undefined}
    >
      <img src={image} alt="" loading="lazy" />
      <div className="division-card-body" ref={bodyRef}>
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="card-arrow" ref={arrowRef} aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  )
}
