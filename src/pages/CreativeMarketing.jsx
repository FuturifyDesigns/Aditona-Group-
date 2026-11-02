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
    title: 'Brand identity',
    text: 'Naming support, visual systems, and guidelines that keep every touchpoint coherent.',
  },
  {
    title: 'Campaign strategy',
    text: 'Insight-led platforms and channel plans built for measurable brand movement.',
  },
  {
    title: 'Content & social',
    text: 'Editorial calendars, production, and community rhythms that stay on-brand.',
  },
  {
    title: 'Digital experiences',
    text: 'Landing pages, microsites, and interactive pieces that convert attention into action.',
  },
  {
    title: 'Brand collaterals',
    text: 'Presentations, print, and environmental graphics aligned to the master system.',
  },
  {
    title: 'Launch creative',
    text: 'Integrated kits for product and event launches — from key visuals to motion.',
  },
]

export default function CreativeMarketing() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.from('.service-item', {
        opacity: 0,
        scale: 0.88,
        y: 40,
        clipPath: 'inset(18% 12% 18% 12% round 12px)',
        stagger: 0.11,
        duration: 0.95,
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
          <SplitHeadline text="Creative & Marketing" as="h1" />
          <p>
            Brand systems, campaigns, and content that feel considered — sharp across
            every channel, never loud for the sake of it.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="work-thumb" style={{ maxHeight: 360 }}>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
              alt="Creative workspace"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Creative capabilities</h2>
            </div>
          </div>
          <div className="service-list">
            <div className="grid-cards">
              {services.map((s) => (
                <article className="service-item" key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
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
              Send your brand context, audience, and the outcome you need. We return a
              creative scope covering strategy, assets, and production timelines.
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
