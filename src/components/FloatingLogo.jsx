import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function FloatingLogo({ tone = 'light' }) {
  const ref = useRef(null)
  const logoSrc = `${import.meta.env.BASE_URL}${tone === 'dark' ? 'logo-white.png' : 'logo.png'}`

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.fromTo(
        el,
        { opacity: 0, y: 18, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, delay: 0.35, ease: 'power3.out' },
      )

      gsap.to(el, {
        y: -10,
        duration: 2.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    { scope: ref, dependencies: [tone] },
  )

  return (
    <div
      ref={ref}
      className={`floating-logo floating-logo--${tone}`}
      aria-hidden="true"
    >
      <img src={logoSrc} alt="" />
    </div>
  )
}
