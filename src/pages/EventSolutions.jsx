import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import SplitHeadline from '../components/SplitHeadline'
import { gallery, heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const moments = [
  { image: gallery.events.showCaller, label: 'Show calling' },
  { image: gallery.events.registration, label: 'Registration' },
  { image: gallery.events.livestream, label: 'Livestream' },
  { image: gallery.events.lighting, label: 'Stage build' },
  { image: gallery.events.gala, label: 'Gala prep' },
  { image: gallery.events.outdoor, label: 'Outdoor activation' },
]

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
      if (reduced) {
        gsap.set('.events-rail-track, .events-rail-card, .service-item', {
          clearProps: 'all',
          opacity: 1,
          x: 0,
        })
        return
      }

      const track = pageRef.current?.querySelector('.events-rail-track')
      if (track) {
        const getScroll = () => -(track.scrollWidth - window.innerWidth + 48)
        gsap.fromTo(
          track,
          { x: 40 },
          {
            x: () => getScroll(),
            ease: 'none',
            scrollTrigger: {
              trigger: '.events-rail',
              start: 'top top',
              end: () => `+=${track.scrollWidth * 0.85}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          },
        )
        gsap.from('.events-rail-card', {
          opacity: 0,
          y: 40,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.events-rail', start: 'top 80%' },
        })
      }

      gsap.from('.service-item', {
        opacity: 0,
        x: -48,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.service-list', start: 'top 82%' },
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef} className="page-events">
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

      <section className="events-rail" aria-label="Production moments">
        <div className="events-rail-head container">
          <p className="eyebrow">On the floor</p>
          <h2>Production in motion</h2>
        </div>
        <div className="events-rail-track">
          {moments.map((m) => (
            <figure className="events-rail-card" key={m.label}>
              <img src={m.image} alt="" loading="lazy" />
              <figcaption>{m.label}</figcaption>
            </figure>
          ))}
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
        </div>
      </section>

      <CTABand />
    </div>
  )
}
