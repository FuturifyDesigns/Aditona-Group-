import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CountUp from '../components/CountUp'
import CTABand from '../components/CTABand'
import DivisionCard from '../components/DivisionCard'
import HeroSlideshow from '../components/HeroSlideshow'
import Reveal from '../components/Reveal'
import SplitHeadline from '../components/SplitHeadline'
import EditableButton from '../cms/EditableButton'
import EditableText from '../cms/EditableText'
import { useCms } from '../cms/CmsContext'
import { cards, heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const slides = [
  { image: heroes.home, alt: 'Luxury event venue at sunset' },
  { image: heroes.events, alt: 'Event production stage setup' },
  { image: heroes.golf, alt: 'Golf hospitality at golden hour' },
]

const FALLBACK_DIVISIONS = [
  {
    to: '/event-solutions',
    title: 'Event Solutions',
    text: 'End-to-end planning, production, and on-site delivery for conferences, launches, and brand experiences.',
    image: heroes.events,
  },
  {
    to: '/creative-marketing',
    title: 'Creative & Marketing',
    text: 'Brand systems, campaigns, content, and digital storytelling that stay sharp across every channel.',
    image: heroes.creative,
  },
  {
    to: '/golf-solutions',
    title: 'Golf Solutions',
    text: 'Corporate golf days, hospitality, and course activations planned with precision and polish.',
    image: heroes.golf,
  },
]

const FALLBACK_WORK = [
  cards.eventsSummitStage,
  cards.creativeBrandSystem,
  cards.golfExecutiveDay,
]

const storyPanels = [
  {
    title: 'One group.',
    text: 'A single accountable partner — not a patchwork of vendors.',
  },
  {
    title: 'Three divisions.',
    text: 'Events, creative & marketing, and golf — each with specialist depth.',
  },
  {
    title: 'Multiple solutions.',
    text: 'Vision. Precision. Execution. Across every brief we take on.',
  },
]

export default function Home() {
  const pageRef = useRef(null)
  const { cardsByCollection, get } = useCms()

  const divisions = useMemo(() => {
    const fromCms = cardsByCollection('home_divisions')
    if (fromCms.length) {
      return fromCms.map((c) => ({
        to: c.link_url || '/',
        title: c.title,
        text: c.body || '',
        image: c.image_url || FALLBACK_DIVISIONS[0].image,
      }))
    }
    return FALLBACK_DIVISIONS
  }, [cardsByCollection])

  const workThumbs = useMemo(() => {
    const fromCms = cardsByCollection('home_work')
    if (fromCms.length) {
      return fromCms
        .map((c) => c.image_url)
        .filter(Boolean)
    }
    return FALLBACK_WORK
  }, [cardsByCollection])

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.story-panel', { clearProps: 'all', opacity: 1, position: 'relative' })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-content .eyebrow', { opacity: 0, y: 18, duration: 0.55 })
        .from('.hero-content h1', { opacity: 0, y: 36, duration: 0.85 }, '-=0.3')
        .from('.hero-content p', { opacity: 0, y: 20, duration: 0.55 }, '-=0.45')
        .from('.hero-content .btn-row', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
        .from('.hero-tag', { opacity: 0, duration: 0.45 }, '-=0.2')

      gsap.from('.trust-item', {
        opacity: 0,
        y: 28,
        scale: 0.97,
        stagger: 0.1,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.trust-grid', start: 'top 85%' },
      })

      gsap.from('.division-card', {
        opacity: 0,
        y: 56,
        scale: 0.92,
        rotateX: 8,
        transformOrigin: '50% 100%',
        stagger: 0.14,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.division-grid', start: 'top 82%' },
      })

      const story = pageRef.current?.querySelector('.story-pin')
      const panels = gsap.utils.toArray('.story-panel')
      const bars = gsap.utils.toArray('.story-progress span i')
      if (story && panels.length) {
        gsap.set(panels, { opacity: 0, y: 28 })
        gsap.set(panels[0], { opacity: 1, y: 0 })
        gsap.set(bars[0], { width: '100%' })

        const storyTl = gsap.timeline({
          scrollTrigger: {
            trigger: story,
            start: 'top top',
            end: () => `+=${window.innerHeight * panels.length * 0.85}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        panels.forEach((panel, i) => {
          if (i === 0) return
          const prev = panels[i - 1]
          storyTl
            .to(prev, { opacity: 0, y: -24, duration: 0.45 }, i)
            .to(bars[i - 1], { width: '100%', duration: 0.2 }, i)
            .fromTo(
              panel,
              { opacity: 0, y: 32 },
              { opacity: 1, y: 0, duration: 0.45 },
              i + 0.05,
            )
            .fromTo(
              bars[i],
              { width: '0%' },
              { width: '100%', duration: 0.45 },
              i + 0.05,
            )
        })
      }

      gsap.from('.work-thumb', {
        opacity: 0,
        y: 48,
        scale: 0.94,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-gallery', start: 'top 82%' },
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { scope: pageRef, dependencies: [divisions, workThumbs] },
  )

  const divisionsTitle = get('home.divisions_title')

  return (
    <div ref={pageRef}>
      <HeroSlideshow slides={slides}>
        <EditableText
          contentKey="hero.eyebrow"
          as="p"
          className="eyebrow"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        />
        <EditableText contentKey="hero.headline" as="h1" />
        <EditableText contentKey="hero.body" as="p" multiline />
        <div className="btn-row">
          <EditableButton
            to="/request-quote"
            contentKey="hero.cta_quote"
            className="btn btn-light"
          >
            Request a Quote
          </EditableButton>
          <EditableButton
            to="/enquiry"
            contentKey="hero.cta_enquiry"
            className="btn btn-ghost"
          >
            Make an Enquiry
          </EditableButton>
        </div>
        <EditableText contentKey="hero.tagline" as="p" className="hero-tag" />
      </HeroSlideshow>

      <section className="section section--tight">
        <div className="container stats-strip">
          <div className="stat-item">
            <span className="stat-num">
              <CountUp to={3} />
            </span>
            <p>Specialist divisions</p>
          </div>
          <div className="stat-item">
            <span className="stat-num">
              <CountUp to={1} />
            </span>
            <p>Accountable group</p>
          </div>
          <div className="stat-item">
            <span className="stat-num">
              <CountUp to={100} suffix="%" />
            </span>
            <p>Delivery ownership</p>
          </div>
        </div>
      </section>

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
              <EditableText contentKey="home.divisions_eyebrow" as="p" className="eyebrow" />
              <SplitHeadline text={divisionsTitle} as="h2" />
            </div>
            <EditableButton
              to="/about"
              contentKey="home.divisions_link"
              className="section-link"
            >
              How we work →
            </EditableButton>
          </div>
          <div className="division-grid">
            {divisions.map((d) => (
              <DivisionCard key={`${d.to}-${d.title}`} {...d} />
            ))}
          </div>
        </div>
      </section>

      <section className="story-pin" aria-label="Brand statement">
        <div className="story-pin-inner">
          {storyPanels.map((panel, i) => (
            <div
              className={`story-panel${i === 0 ? ' is-first' : ''}`}
              key={panel.title}
            >
              <div>
                <h2>{panel.title}</h2>
                <p>{panel.text}</p>
              </div>
            </div>
          ))}
          <div className="story-progress" aria-hidden="true">
            {storyPanels.map((panel) => (
              <span key={panel.title}>
                <i />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container work-layout">
          <Reveal>
            <EditableText
              contentKey="home.work_eyebrow"
              as="p"
              className="eyebrow"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            />
            <EditableText
              contentKey="home.work_title"
              as="h2"
              style={{
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                letterSpacing: '-0.03em',
              }}
            />
            <EditableText
              contentKey="home.work_body"
              as="p"
              multiline
              style={{
                color: 'rgba(255,255,255,0.72)',
                marginTop: '0.75rem',
                maxWidth: '28rem',
                lineHeight: 1.55,
              }}
            />
          </Reveal>
          <div className="work-gallery">
            {workThumbs.map((src) => (
              <div key={src} className="work-thumb">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <Reveal delay={0.1}>
            <EditableButton
              to="/our-work"
              contentKey="home.work_cta"
              className="btn btn-ghost"
            >
              View all work
            </EditableButton>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
