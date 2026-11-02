import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const DRAWINGS = {
  orbit: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="900" cy="220" r="180" opacity="0.35" />
        <circle cx="900" cy="220" r="260" opacity="0.22" />
        <circle cx="900" cy="220" r="340" opacity="0.14" />
        <path d="M120 640 C320 480 520 720 780 520" opacity="0.28" />
        <path d="M80 560 C300 420 560 680 920 440" opacity="0.18" />
        <line x1="80" y1="120" x2="420" y2="120" opacity="0.2" />
        <line x1="80" y1="150" x2="300" y2="150" opacity="0.14" />
      </g>
      <g fill="currentColor">
        <circle cx="900" cy="220" r="4" opacity="0.45" />
        <circle cx="780" cy="520" r="3" opacity="0.35" />
        <circle cx="120" cy="640" r="3" opacity="0.3" />
      </g>
    </svg>
  ),
  blueprint: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <rect x="140" y="120" width="420" height="280" opacity="0.22" />
        <rect x="180" y="160" width="340" height="200" opacity="0.16" />
        <path d="M140 400 L560 400 L560 620 L140 620 Z" opacity="0.18" />
        <path d="M620 160 H1040 V520 H620 Z" opacity="0.2" />
        <path d="M680 220 H980 V460 H680 Z" opacity="0.14" />
        <path d="M140 100 H560 M620 140 H1040" opacity="0.12" />
        <circle cx="900" cy="340" r="70" opacity="0.16" />
        <path d="M100 700 H1100" opacity="0.12" />
      </g>
      <g fill="currentColor" opacity="0.28">
        <circle cx="140" cy="120" r="2.5" />
        <circle cx="560" cy="120" r="2.5" />
        <circle cx="1040" cy="160" r="2.5" />
      </g>
    </svg>
  ),
  arcs: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M-40 700 Q300 120 640 420 T1280 180" opacity="0.22" />
        <path d="M-20 760 Q340 200 680 460 T1300 240" opacity="0.16" />
        <path d="M40 820 Q380 280 720 500 T1320 300" opacity="0.12" />
        <path d="M180 80 Q420 260 300 480" opacity="0.18" />
        <circle cx="300" cy="480" r="90" opacity="0.14" />
        <circle cx="980" cy="260" r="120" opacity="0.12" />
      </g>
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={80 + i * 95}
            y1="60"
            x2={80 + i * 95}
            y2="740"
            opacity={0.08 + (i % 3) * 0.03}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="60"
            y1={80 + i * 90}
            x2="1140"
            y2={80 + i * 90}
            opacity={0.08 + (i % 2) * 0.04}
          />
        ))}
        <rect x="270" y="200" width="280" height="180" opacity="0.2" />
        <rect x="650" y="340" width="320" height="220" opacity="0.16" />
        <path d="M270 200 L410 110 L550 200" opacity="0.18" />
      </g>
    </svg>
  ),
  fairway: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M80 620 C260 540 340 700 520 640 C700 580 760 720 980 620 C1080 570 1140 600 1180 560" opacity="0.22" />
        <path d="M60 680 C240 600 360 760 560 690 C760 620 820 760 1040 670" opacity="0.14" />
        <ellipse cx="820" cy="280" rx="160" ry="70" opacity="0.16" />
        <ellipse cx="820" cy="280" rx="90" ry="36" opacity="0.12" />
        <path d="M300 180 Q360 320 280 460" opacity="0.18" />
        <circle cx="280" cy="460" r="8" opacity="0.25" fill="currentColor" stroke="none" />
        <line x1="200" y1="120" x2="200" y2="200" opacity="0.16" />
        <line x1="180" y1="140" x2="220" y2="140" opacity="0.12" />
      </g>
    </svg>
  ),
  frames: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.15">
        <rect x="100" y="100" width="260" height="340" opacity="0.2" />
        <rect x="400" y="160" width="300" height="220" opacity="0.18" />
        <rect x="760" y="120" width="320" height="400" opacity="0.16" />
        <rect x="180" y="500" width="420" height="180" opacity="0.14" />
        <path d="M100 100 L230 40 L360 100" opacity="0.14" />
        <circle cx="920" cy="320" r="55" opacity="0.14" />
        <path d="M760 520 H1080" opacity="0.12" />
      </g>
    </svg>
  ),
  nodes: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.15">
        <path d="M180 200 L420 160 L620 280 L860 180 L1040 300" opacity="0.2" />
        <path d="M180 200 L260 420 L520 480 L780 360 L1040 300" opacity="0.14" />
        <path d="M260 420 L420 160 M520 480 L620 280 M780 360 L860 180" opacity="0.12" />
      </g>
      <g fill="currentColor">
        {[
          [180, 200],
          [420, 160],
          [620, 280],
          [860, 180],
          [1040, 300],
          [260, 420],
          [520, 480],
          [780, 360],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" opacity={0.28} />
        ))}
      </g>
    </svg>
  ),
  rings: (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="280" cy="520" r="120" opacity="0.2" />
        <circle cx="280" cy="520" r="190" opacity="0.14" />
        <circle cx="860" cy="240" r="150" opacity="0.18" />
        <circle cx="860" cy="240" r="230" opacity="0.12" />
        <path d="M400 470 C520 360 680 360 760 300" opacity="0.16" />
        <line x1="80" y1="160" x2="420" y2="160" opacity="0.12" />
        <line x1="80" y1="190" x2="300" y2="190" opacity="0.1" />
      </g>
    </svg>
  ),
}

/**
 * Professional grey line-art backdrop that grows in and fades out on scroll.
 * Parent section should use className "has-art".
 */
export default function ProgressiveArt({
  variant = 'orbit',
  className = '',
  peak = 0.55,
  dark = false,
}) {
  const ref = useRef(null)
  const drawing = DRAWINGS[variant] || DRAWINGS.orbit

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const section = el.closest('section') || el.parentElement
      const art = el.querySelector('.progressive-art-draw')
      if (!section || !art) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(art, { opacity: peak * 0.55, scale: 1 })
        return
      }

      gsap.set(art, { opacity: 0, scale: 0.82, transformOrigin: '50% 45%' })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            end: 'bottom 5%',
            scrub: 0.9,
          },
        })
        .to(art, { opacity: peak, scale: 1.08, duration: 0.36, ease: 'none' })
        .to(art, { opacity: peak, scale: 1.14, duration: 0.28, ease: 'none' })
        .to(art, { opacity: 0, scale: 1.22, duration: 0.36, ease: 'none' })
    },
    { scope: ref, dependencies: [variant, peak, dark] },
  )

  return (
    <div
      ref={ref}
      className={`progressive-art${dark ? ' progressive-art--dark' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <div className="progressive-art-draw">{drawing}</div>
    </div>
  )
}

export function ArtDrawing({ variant = 'orbit', className = '' }) {
  return (
    <div className={`art-drawing${className ? ` ${className}` : ''}`} aria-hidden="true">
      {DRAWINGS[variant] || DRAWINGS.orbit}
    </div>
  )
}

export const artVariants = Object.keys(DRAWINGS)
