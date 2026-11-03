import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import CardEditor from '../cms/CardEditor'
import { useCms } from '../cms/CmsContext'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(useGSAP)

export default function DivisionCard({
  image,
  title,
  text,
  to,
  card = null,
  collection = 'home_divisions',
  sortOrder = 0,
}) {
  const cardRef = useRef(null)
  const bodyRef = useRef(null)
  const arrowRef = useRef(null)
  const { editMode } = useCms()
  const [open, setOpen] = useState(false)

  useMagnetic(cardRef, {
    strength: 0.22,
    max: 12,
    duration: 0.4,
    opacityTarget: bodyRef,
    enabled: !editMode,
  })

  useGSAP(
    () => {
      const el = cardRef.current
      const arrow = arrowRef.current
      if (!el || !arrow) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || editMode) return

      const xTo = gsap.quickTo(arrow, 'x', { duration: 0.35, ease: 'power3' })
      const yTo = gsap.quickTo(arrow, 'y', { duration: 0.35, ease: 'power3' })

      const onMove = (e) => {
        const rect = el.getBoundingClientRect()
        const relX = e.clientX - rect.left - rect.width + 40
        const relY = e.clientY - rect.top - rect.height + 40
        xTo(gsap.utils.clamp(-12, 12, relX * 0.1))
        yTo(gsap.utils.clamp(-12, 12, relY * 0.1))
      }

      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: cardRef, dependencies: [editMode] },
  )

  const onClick = (e) => {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  return (
    <>
      <Link
        to={editMode ? '#' : to}
        className={`division-card${editMode ? ' cms-editable' : ''}`}
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
        {editMode && <span className="cms-pencil cms-pencil--img">✎</span>}
      </Link>
      {open && (
        <CardEditor
          kind="card"
          record={card?.id ? card : null}
          defaults={{
            collection,
            title,
            body: text,
            image_url: image,
            link_url: to,
            sort_order: sortOrder,
            published: true,
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
