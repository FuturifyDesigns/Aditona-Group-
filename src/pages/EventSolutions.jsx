import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SplitHeadline from '../components/SplitHeadline'
import { cards, heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const services = [
  {
    title: 'Conferences & summits',
    text: 'Programme design, speaker management, registration flows, and stage production that keep days on time.',
  },
  {
    title: 'Product launches',
    text: 'Reveal moments, press environments, and guest journeys crafted for impact and brand control.',
  },
  {
    title: 'Brand activations',
    text: 'Experiential builds and sampling environments that feel intentional — not temporary clutter.',
  },
  {
    title: 'Corporate hospitality',
    text: 'VIP hosting, seating plans, and run-of-show that make stakeholders feel looked after.',
  },
  {
    title: 'Technical production',
    text: 'AV, lighting, staging, and crew coordination with clear ownership from load-in to strike.',
  },
  {
    title: 'On-site management',
    text: 'Floor managers and crew leads who keep vendors aligned and guests unaware of the complexity.',
  },
]

export default function EventSolutions() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.from('.service-item', {
        opacity: 0,
        x: 64,
        rotateY: -12,
        transformOrigin: 'left center',
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.service-list', start: 'top 82%' },
      })
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef}>
      <PageHero
        image={heroes.events}
        eyebrow={<p className="eyebrow">Division</p>}
        title={<SplitHeadline text="Event Solutions" as="h1" />}
        body={
          <p>
            From intimate briefings to multi-day conferences — we plan, produce, and
            deliver events with precision and presence.
          </p>
        }
      />

      <section className="section section--tight">
        <div className="container">
          <Reveal className="work-thumb" style={{ maxHeight: 360 }} y={50} scale={0.94}>
            <img
              src={cards.eventsProductReveal}
              alt="Event stage with audience"
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
              <h2>What we deliver</h2>
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
          <Reveal y={36} scale={0.97}>
            <p className="eyebrow">Engage</p>
            <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
              How to work with us
            </h2>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.6, marginBottom: '1.1rem' }}>
              Share your date, audience size, venue preferences, and success measures.
              We respond with a scoped proposal covering creative direction, production,
              and on-site staffing.
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
