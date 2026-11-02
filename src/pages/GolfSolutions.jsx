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
import { hardRefreshScroll } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const journey = [
  { image: gallery.golf.checkin, title: 'Guest check-in', text: 'Calm arrival, clear kits, no queues.' },
  { image: gallery.golf.foursome, title: 'On the fairway', text: 'Formats that keep groups moving together.' },
  { image: gallery.golf.tee, title: 'Tee activations', text: 'Brand moments placed with restraint.' },
  { image: gallery.golf.ops, title: 'Course ops', text: 'Marshal cues and radio discipline.' },
  { image: gallery.golf.kit, title: 'Welcome kits', text: 'Gifts and scoring that feel considered.' },
  { image: gallery.golf.prize, title: 'Prize-giving', text: 'Closing energy without losing pace.' },
]

const services = [
  { title: 'Corporate golf days', text: 'Full-day formats with registration, shotgun starts, scoring, and prize-giving choreography.' },
  { title: 'Hospitality packages', text: 'Clubhouse hosting, F&B coordination, and guest flows that feel effortless.' },
  { title: 'Course activations', text: 'Hole sponsorships, brand moments, and photo opportunities placed with restraint.' },
  { title: 'Player experiences', text: 'Clinics, pro demos, and gift strategies tailored to your audience and handicap mix.' },
  { title: 'Charity & fundraising', text: 'Auction support, donor hosting, and run-of-day that protects the cause and the course.' },
  { title: 'Tournament logistics', text: 'Vendor management, marshal briefing, and contingency planning for weather and pace.' },
]

export default function GolfSolutions() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.golf-step, .golf-service-card', { clearProps: 'all', opacity: 1, y: 0 })
        return
      }

      gsap.utils.toArray('.golf-step').forEach((step) => {
        const media = step.querySelector('.golf-step-media img')
        const copy = step.querySelectorAll('.golf-step-copy > *')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 78%',
            end: 'top 35%',
            scrub: 0.8,
          },
        })
        tl.fromTo(media, { yPercent: 14, scale: 1.12 }, { yPercent: 0, scale: 1, ease: 'none' }, 0)
          .fromTo(copy, { y: 36, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, ease: 'none' }, 0.05)
      })

      gsap.from('.golf-service-card', {
        opacity: 0,
        y: 50,
        scale: 0.94,
        stagger: { each: 0.1, from: 'center' },
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.golf-services', start: 'top 82%' },
      })

      gsap.utils.toArray('.golf-service-card').forEach((card) => {
        const mark = card.querySelector('.golf-service-mark')
        card.addEventListener('pointerenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.35,
            ease: 'power2.out',
          })
          if (mark) {
            gsap.to(mark, {
              scale: 1.15,
              rotation: 8,
              duration: 0.4,
              ease: 'back.out(1.6)',
            })
          }
        })
        card.addEventListener('pointerleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
          if (mark) gsap.to(mark, { scale: 1, rotation: 0, duration: 0.35, ease: 'power2.out' })
        })
      })

      hardRefreshScroll(pageRef.current)
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef} className="page-golf">
      <PageHero
        image={heroes.golf}
        eyebrow={<p className="eyebrow">Division</p>}
        title={<SplitHeadline text="Golf Solutions" as="h1" />}
        body={
          <p className="hero-lead">
            Corporate golf days and hospitality planned with the same precision we
            bring to stages and campaigns — calm, polished, memorable.
          </p>
        }
      />

      <section className="section golf-journey has-art">
        <ProgressiveArt variant="fairway" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Guest journey</p>
              <h2>From first tee to final toast</h2>
            </div>
          </div>
          <div className="golf-steps">
            {journey.map((step, i) => (
              <article className={`golf-step${i % 2 ? ' is-flip' : ''}`} key={step.title}>
                <div className="golf-step-media">
                  <img src={step.image} alt="" loading="lazy" />
                </div>
                <div className="golf-step-copy">
                  <span className="eyebrow">0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft golf-services has-art">
        <ProgressiveArt variant="rings" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>On and around the course</h2>
            </div>
          </div>
          <div className="golf-service-grid">
            {services.map((s, i) => (
              <article className="golf-service-card" key={s.title}>
                <span className="golf-service-mark" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section has-art">
        <ProgressiveArt variant="fairway" peak={0.4} />
        <div className="container" style={{ maxWidth: '40rem' }}>
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
        </div>
      </section>

      <CTABand />
    </div>
  )
}
