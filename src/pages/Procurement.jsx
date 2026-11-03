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
  {
    image: gallery.procurement.brief,
    title: 'Brief & requirements',
    text: 'Clarify what needs to be sourced, timelines, and approved project budgets.',
  },
  {
    image: gallery.procurement.suppliers,
    title: 'Supplier identification',
    text: 'Find the right vendors and service providers for the scope — not just the cheapest option.',
  },
  {
    image: gallery.procurement.quotes,
    title: 'Quotes & comparison',
    text: 'Request, compare, and coordinate quotations so decisions stay clear and documented.',
  },
  {
    image: gallery.procurement.delivery,
    title: 'Purchase & delivery',
    text: 'Coordinate purchasing, supply scheduling, and delivery against the project plan.',
  },
  {
    image: gallery.procurement.oversight,
    title: 'Partner oversight',
    text: 'Keep suppliers aligned — communication, scheduling, and delivery monitoring.',
  },
  {
    image: gallery.procurement.budget,
    title: 'Budget control',
    text: 'Manage procurement within approved budgets with accountable close-out.',
  },
]

const services = [
  {
    title: 'Product & service sourcing',
    text: 'Identify and source the products and services required for events, creative, golf, and wider projects.',
  },
  {
    title: 'Supplier identification',
    text: 'Build and engage a reliable supplier pool matched to quality, availability, and project needs.',
  },
  {
    title: 'Quotation management',
    text: 'Request, collect, and compare supplier quotations so clients can decide with clarity.',
  },
  {
    title: 'Purchasing coordination',
    text: 'Coordinate purchasing and procurement once scope and budget are approved.',
  },
  {
    title: 'Delivery & supply logistics',
    text: 'Track delivery schedules and supply coordination through to on-site readiness.',
  },
  {
    title: 'Budget-aligned procurement',
    text: 'Manage procurement inside approved project budgets with transparent oversight.',
  },
]

export default function Procurement() {
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
        clearProps: 'transform',
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
    <div ref={pageRef} className="page-procurement">
      <PageHero
        image={heroes.procurement}
        eyebrow={<p className="eyebrow">Group capability</p>}
        title={<SplitHeadline text="Sourcing & Procurement" as="h1" immediate />}
        body={
          <p className="hero-lead">
            Product and service sourcing, supplier coordination, and budget-aligned
            procurement that supports delivery across every Aditona brief.
          </p>
        }
      />

      <section className="section golf-journey has-art">
        <ProgressiveArt variant="blueprint" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">How we source</p>
              <h2>From requirement to delivery</h2>
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
        <ProgressiveArt variant="nodes" peak={0.48} />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Procurement across the group</h2>
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
        <ProgressiveArt variant="rings" peak={0.4} />
        <div className="container" style={{ maxWidth: '40rem' }}>
          <p className="eyebrow">Engage</p>
          <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
            How to engage
          </h2>
          <p style={{ color: 'var(--ag-mid)', lineHeight: 1.6, marginBottom: '1.1rem' }}>
            Share what you need sourced, timing, and budget envelope. We return a
            clear procurement plan with supplier options and next steps.
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
