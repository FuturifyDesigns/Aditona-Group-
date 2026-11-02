import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import SplitHeadline from '../components/SplitHeadline'
import { gallery, heroes } from '../lib/images'
import { hardRefreshScroll, pinOptions } from '../lib/scroll'

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
        gsap.set('.events-rail-track, .events-rail-card, .service-panel', {
          clearProps: 'all',
          opacity: 1,
          x: 0,
        })
        return
      }

      const track = pageRef.current?.querySelector('.events-rail-track')
      const teaserBar = pageRef.current?.querySelector('.pin-teaser-bar > b')
      const teaser = pageRef.current?.querySelector('.events-rail .pin-teaser')
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
              ...pinOptions({
                scrub: 0.7,
                onUpdate: (self) => {
                  if (teaserBar) gsap.set(teaserBar, { scaleX: self.progress })
                  if (teaser) {
                    gsap.set(teaser, {
                      opacity: 0.45 + self.progress * 0.55,
                      y: (1 - self.progress) * 12,
                    })
                  }
                },
              }),
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

      gsap.utils.toArray('.service-panel').forEach((panel) => {
        const line = panel.querySelector('.service-panel-line')
        const num = panel.querySelector('.service-panel-num')
        const copy = panel.querySelectorAll('h3, p')

        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 86%',
            end: 'top 45%',
            scrub: 0.65,
          },
        })

        tl.fromTo(
          panel,
          { opacity: 0.25, y: 48, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, ease: 'none' },
          0,
        )
          .to(line, { scaleX: 1, ease: 'none' }, 0)
          .fromTo(num, { opacity: 0.2, x: -12 }, { opacity: 1, x: 0, ease: 'none' }, 0)
          .fromTo(copy, { y: 18, opacity: 0.35 }, { y: 0, opacity: 1, stagger: 0.05, ease: 'none' }, 0.05)

        panel.addEventListener('pointerenter', () => {
          gsap.to(panel, {
            y: -6,
            boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
            duration: 0.35,
            ease: 'power2.out',
          })
          gsap.to(line, { backgroundColor: '#1a1a1b', duration: 0.3 })
        })
        panel.addEventListener('pointerleave', () => {
          gsap.to(panel, {
            y: 0,
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.4,
            ease: 'power2.out',
          })
          gsap.to(line, { backgroundColor: '#c2c2c2', duration: 0.3 })
        })
      })

      hardRefreshScroll(pageRef.current)
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
          <p className="hero-lead">
            From intimate briefings to multi-day conferences — we plan, produce, and
            deliver events with precision and presence.
          </p>
        }
      />

      <section className="events-rail has-art" aria-label="Production moments">
        <ProgressiveArt variant="grid" peak={0.45} dark />
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
        <aside className="pin-teaser" aria-hidden="true">
          <p className="eyebrow">Up next</p>
          <strong>What we deliver</strong>
          <span>Keep scrolling to reveal services</span>
          <i className="pin-teaser-bar">
            <b />
          </i>
        </aside>
      </section>

      <section className="section has-art">
        <ProgressiveArt variant="blueprint" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>What we deliver</h2>
            </div>
          </div>
          <div className="service-panels">
            {services.map((s, i) => (
              <article className="service-panel" key={s.title}>
                <span className="service-panel-num">0{i + 1}</span>
                <div className="service-panel-body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <i className="service-panel-line" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft has-art">
        <ProgressiveArt variant="arcs" peak={0.5} />
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
