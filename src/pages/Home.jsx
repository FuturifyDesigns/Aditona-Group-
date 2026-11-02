import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import DivisionCard from '../components/DivisionCard'
import HeroSlideshow from '../components/HeroSlideshow'
import Reveal from '../components/Reveal'
import SplitHeadline from '../components/SplitHeadline'
import { config } from '../lib/config'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80',
    alt: 'Corporate event stage lighting',
  },
  {
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    alt: 'Creative studio workspace',
  },
  {
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600&q=80',
    alt: 'Golf course fairway',
  },
]

const divisions = [
  {
    to: '/event-solutions',
    title: 'Event Solutions',
    text: 'End-to-end planning, production, and on-site delivery for conferences, launches, and brand experiences.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
  },
  {
    to: '/creative-marketing',
    title: 'Creative & Marketing',
    text: 'Brand systems, campaigns, content, and digital storytelling that stay sharp across every channel.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
  },
  {
    to: '/golf-solutions',
    title: 'Golf Solutions',
    text: 'Corporate golf days, hospitality, and course activations planned with precision and polish.',
    image:
      'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1600&q=80',
  },
]

const workThumbs = [
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80',
  'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1600&q=80',
]

export default function Home() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-content .eyebrow', { opacity: 0, y: 16, duration: 0.6 })
        .from('.hero-content h1', { opacity: 0, y: 28, duration: 0.8 }, '-=0.35')
        .from('.hero-content p', { opacity: 0, y: 18, duration: 0.6 }, '-=0.45')
        .from('.hero-content .btn-row', { opacity: 0, y: 14, duration: 0.55 }, '-=0.35')
        .from('.hero-tag', { opacity: 0, duration: 0.5 }, '-=0.25')

      gsap.from('.trust-item', {
        opacity: 0,
        y: 22,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.trust-grid', start: 'top 85%' },
      })

      gsap.from('.division-card', {
        opacity: 0,
        y: 36,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.division-grid', start: 'top 82%' },
      })

      const pinSection = pageRef.current?.querySelector('.pin-statement')
      const pinTitle = pageRef.current?.querySelector('.pin-statement h2')
      const pinSub = pageRef.current?.querySelector('.pin-statement p')
      if (pinSection && pinTitle) {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSection,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.65,
          },
        })
        pinTl
          .fromTo(pinTitle, { opacity: 0.12, y: 36 }, { opacity: 1, y: 0, ease: 'none' })
          .fromTo(
            pinSub,
            { opacity: 0, y: 24 },
            { opacity: 0.78, y: 0, ease: 'none' },
            0.25,
          )
      }

      gsap.from('.work-thumb', {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-gallery', start: 'top 80%' },
      })
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef}>
      <HeroSlideshow slides={slides}>
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>
          MULTI-DISCIPLINARY SOLUTIONS COMPANY
        </p>
        <h1>{config.headline}</h1>
        <p>
          Aditona Group unites Event Solutions, Creative &amp; Marketing, and Golf
          Solutions — one accountable partner from brief to delivery.
        </p>
        <div className="btn-row">
          <Link to="/request-quote" className="btn btn-light">
            Request a Quote
          </Link>
          <Link to="/enquiry" className="btn btn-ghost">
            Make an Enquiry
          </Link>
        </div>
        <p className="hero-tag">{config.tagline}</p>
      </HeroSlideshow>

      <section className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div>
              <h3>One accountable team</h3>
              <p>Cross-division coordination without agency sprawl.</p>
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l3 2" />
            </svg>
            <div>
              <h3>Precision timelines</h3>
              <p>Clear milestones, rehearsed run-of-show, calm delivery.</p>
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 19V5h4l2 4h10v10H4z" />
            </svg>
            <div>
              <h3>Brand-safe creative</h3>
              <p>Visual systems and campaigns that stay on-message.</p>
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 18c3-6 6-9 8-9s5 3 8 9" />
              <circle cx="12" cy="8" r="2" />
            </svg>
            <div>
              <h3>Golf hospitality</h3>
              <p>Corporate days and activations planned to the tee.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Capabilities</p>
              <SplitHeadline text="Our Divisions" as="h2" />
            </div>
            <Link to="/about" className="section-link">
              How we work →
            </Link>
          </div>
          <div className="division-grid">
            {divisions.map((d) => (
              <DivisionCard key={d.to} {...d} />
            ))}
          </div>
        </div>
      </section>

      <section className="pin-statement" aria-label="Statement">
        <div>
          <h2>One group. Three divisions. Multiple solutions.</h2>
          <p style={{ marginTop: '1rem', maxWidth: '32rem', marginInline: 'auto', lineHeight: 1.6 }}>
            Events, creative, and golf — delivered with the same standard of vision,
            precision, and execution.
          </p>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container work-layout">
          <Reveal>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Selected
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', letterSpacing: '-0.03em' }}>
              Featured Work
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', marginTop: '0.75rem', maxWidth: '28rem', lineHeight: 1.55 }}>
              A snapshot of recent productions, campaigns, and golf hospitality
              engagements across the group.
            </p>
          </Reveal>
          <div className="work-gallery">
            {workThumbs.map((src) => (
              <Reveal key={src} className="work-thumb">
                <img src={src} alt="" loading="lazy" />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link to="/our-work" className="btn btn-ghost">
              View all work
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
