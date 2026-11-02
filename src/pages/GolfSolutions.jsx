import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import Reveal from '../components/Reveal'
import SplitHeadline from '../components/SplitHeadline'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const services = [
  {
    title: 'Corporate golf days',
    text: 'Full-day formats with registration, shotgun starts, scoring, and prize-giving choreography.',
  },
  {
    title: 'Hospitality packages',
    text: 'Clubhouse hosting, F&B coordination, and guest flows that feel effortless.',
  },
  {
    title: 'Course activations',
    text: 'Hole sponsorships, brand moments, and photo opportunities placed with restraint.',
  },
  {
    title: 'Player experiences',
    text: 'Clinics, pro demos, and gift strategies tailored to your audience and handicap mix.',
  },
  {
    title: 'Charity & fundraising',
    text: 'Auction support, donor hosting, and run-of-day that protects the cause and the course.',
  },
  {
    title: 'Tournament logistics',
    text: 'Vendor management, marshal briefing, and contingency planning for weather and pace.',
  },
]

export default function GolfSolutions() {
  const pageRef = useRef(null)
  const heroImgRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      if (heroImgRef.current) {
        gsap.fromTo(
          heroImgRef.current,
          { y: -24, scale: 1.08 },
          {
            y: 24,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: '.golf-hero-strip',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }

      gsap.from('.service-item', {
        opacity: 0,
        y: 48,
        scale: 0.94,
        stagger: {
          each: 0.1,
          from: 'center',
        },
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.service-list', start: 'top 82%' },
      })
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Division</p>
          <SplitHeadline text="Golf Solutions" as="h1" />
          <p>
            Corporate golf days and hospitality planned with the same precision we
            bring to stages and campaigns — calm, polished, memorable.
          </p>
        </div>
      </section>

      <section className="section section--tight golf-hero-strip">
        <div className="container">
          <div className="work-thumb" style={{ maxHeight: 380, overflow: 'hidden' }}>
            <img
              ref={heroImgRef}
              src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600&q=80"
              alt="Golf course landscape"
              loading="lazy"
              style={{ width: '100%', height: '120%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>On and around the course</h2>
            </div>
          </div>
          <div className="service-list">
            {services.map((s) => (
              <article className="service-item" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container" style={{ maxWidth: '40rem' }}>
          <Reveal>
            <p className="eyebrow">Engage</p>
            <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
              How to engage
            </h2>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.6, marginBottom: '1.1rem' }}>
              Tell us preferred courses, player count, date window, and hospitality
              level. We return a format proposal with logistics and brand moments.
            </p>
            <div className="btn-row">
              <Link to="/request-quote" className="btn btn-primary">
                Request a Quote
              </Link>
              <Link to="/enquiry" className="btn btn-soft">
                Make an Enquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
