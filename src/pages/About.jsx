import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import SplitHeadline from '../components/SplitHeadline'
import { heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const manifesto = [
  {
    kicker: '01 — Origin',
    title: 'One accountable group.',
    text: 'Aditona Group was built to close the gap between strategy decks and live delivery — one owner for the brief, the look, and the day itself.',
  },
  {
    kicker: '02 — Vision',
    title: 'Experiences that feel like one story.',
    text: 'We aim to be the most trusted multidisciplinary partner for brands that need events, creative, and golf to move as a single narrative.',
  },
  {
    kicker: '03 — Mission',
    title: 'Ambition, translated into precision.',
    text: 'We turn intent into rehearsed plans and calm execution — across venues, channels, and courses — with shared standards at every stage.',
  },
]

const divisions = [
  {
    index: '01',
    title: 'Event Solutions',
    text: 'Planning, production, and on-site ownership for conferences, launches, and brand experiences.',
    to: '/event-solutions',
    image: heroes.events,
  },
  {
    index: '02',
    title: 'Creative & Marketing',
    text: 'Brand systems, campaigns, photography, and digital storytelling that stay sharp everywhere.',
    to: '/creative-marketing',
    image: heroes.creative,
  },
  {
    index: '03',
    title: 'Golf Solutions',
    text: 'Corporate golf days, hospitality, and course activations planned with polish and pace.',
    to: '/golf-solutions',
    image: heroes.golf,
  },
]

const values = [
  {
    title: 'Vision',
    text: 'We clarify the outcome before we invent the method — so every decision points the same way.',
  },
  {
    title: 'Precision',
    text: 'Details are not decoration. Timelines, vendors, and brand standards are held with discipline.',
  },
  {
    title: 'Execution',
    text: 'Plans become performance. On the day, our teams stay calm, visible, and accountable.',
  },
  {
    title: 'Integrity',
    text: 'We say what we can deliver, then deliver it — with clear communication at every stage.',
  },
]

const steps = [
  { title: 'Brief', text: 'Align on goals, audience, constraints, and success measures.' },
  { title: 'Design', text: 'Shape the experience, creative system, or golf programme.' },
  { title: 'Rehearse', text: 'Pressure-test timelines, vendors, and contingencies.' },
  { title: 'Deliver', text: 'Execute with visible ownership from start to close-out.' },
]

export default function About() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(
          '.about-hero-media, .about-hero-copy > *, .manifesto-panel, .division-slide, .value-row, .method-step, .about-line',
          { clearProps: 'all', opacity: 1, y: 0, x: 0, scale: 1 },
        )
        return
      }

      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from('.about-hero-media', { scale: 1.18, opacity: 0.5, duration: 1.4 }, 0)
        .from('.about-hero-copy .eyebrow', { y: 24, opacity: 0, duration: 0.6 }, 0.25)
        .from('.about-hero-copy .about-hero-body', { y: 28, opacity: 0, duration: 0.7 }, 0.55)
        .from('.about-hero-copy .about-scroll-cue', { y: 12, opacity: 0, duration: 0.5 }, 0.9)

      gsap.to('.about-hero-media', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      const manifesto = pageRef.current?.querySelector('.about-manifesto')
      const panels = gsap.utils.toArray('.manifesto-panel')
      const progress = gsap.utils.toArray('.manifesto-progress span i')

      if (manifesto && panels.length) {
        gsap.set(panels, { opacity: 0, y: 40 })
        gsap.set(panels[0], { opacity: 1, y: 0 })
        if (progress[0]) gsap.set(progress[0], { scaleX: 1 })

        const mTl = gsap.timeline({
          scrollTrigger: {
            trigger: manifesto,
            start: 'top top',
            end: () => `+=${window.innerHeight * panels.length * 0.9}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        panels.forEach((panel, i) => {
          if (i === 0) return
          mTl
            .to(panels[i - 1], { opacity: 0, y: -36, duration: 0.5 }, i)
            .to(progress[i - 1], { scaleX: 1, duration: 0.2 }, i)
            .fromTo(
              panel,
              { opacity: 0, y: 48 },
              { opacity: 1, y: 0, duration: 0.5 },
              i + 0.05,
            )
            .fromTo(
              progress[i],
              { scaleX: 0 },
              { scaleX: 1, duration: 0.5 },
              i + 0.05,
            )
        })
      }

      gsap.from('.about-divisions-head > *', {
        opacity: 0,
        y: 32,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-divisions', start: 'top 78%' },
      })

      gsap.utils.toArray('.division-slide').forEach((slide, i) => {
        const media = slide.querySelector('.division-slide-media img')
        const copy = slide.querySelectorAll('.division-slide-copy > *')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 0.7,
          },
        })
        tl.fromTo(
          media,
          { scale: 1.2, opacity: 0.35 },
          { scale: 1, opacity: 1, ease: 'none' },
          0,
        ).fromTo(
          copy,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: 'none' },
          0.05,
        )
        gsap.fromTo(
          slide,
          { y: i % 2 === 0 ? 40 : 60 },
          {
            y: i % 2 === 0 ? -20 : -40,
            ease: 'none',
            scrollTrigger: {
              trigger: slide,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      gsap.from('.value-row', {
        opacity: 0,
        y: 48,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-values', start: 'top 78%' },
      })

      gsap.from('.about-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.about-values', start: 'top 70%' },
      })

      gsap.from('.method-step', {
        opacity: 0,
        y: 36,
        scale: 0.96,
        stagger: 0.14,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-method', start: 'top 78%' },
      })

      gsap.from('.method-track', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.about-method', start: 'top 75%' },
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef} className="about-page">
      <section className="about-hero">
        <div className="about-hero-media" aria-hidden="true">
          <img src={heroes.about} alt="" />
        </div>
        <div className="about-hero-scrim" aria-hidden="true" />
        <div className="container about-hero-copy">
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.65)' }}>
            About Aditona Group
          </p>
          <SplitHeadline
            text="Built as one group. Delivered as specialists."
            as="h1"
            className="about-hero-title"
            immediate
            delay={0.2}
          />
          <p className="about-hero-body">
            A multidisciplinary partner for brands that need events, creative, and golf
            experiences to feel intentional — and land without friction.
          </p>
          <div className="about-scroll-cue" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </div>
      </section>

      <section className="about-manifesto" aria-label="Our story">
        <div className="about-manifesto-inner">
          {manifesto.map((panel) => (
            <article className="manifesto-panel" key={panel.kicker}>
              <p className="eyebrow">{panel.kicker}</p>
              <h2>{panel.title}</h2>
              <p>{panel.text}</p>
            </article>
          ))}
          <div className="manifesto-progress" aria-hidden="true">
            {manifesto.map((panel) => (
              <span key={panel.kicker}>
                <i />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-divisions">
        <div className="container">
          <div className="about-divisions-head">
            <p className="eyebrow">Divisions</p>
            <h2>Three specialist branches. One standard of delivery.</h2>
            <p>
              Each division runs with depth — and shares planning, brand discipline, and
              on-the-day accountability with the rest of the group.
            </p>
          </div>

          <div className="division-slides">
            {divisions.map((d) => (
              <article className="division-slide" key={d.title}>
                <div className="division-slide-media">
                  <img src={d.image} alt="" loading="lazy" />
                </div>
                <div className="division-slide-copy">
                  <span className="division-index">{d.index}</span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <Link to={d.to} className="section-link">
                    Explore →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft about-values">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Values</p>
              <h2>What we protect on every brief</h2>
            </div>
          </div>
          <div className="about-line" aria-hidden="true" />
          <div className="value-rows">
            {values.map((v, i) => (
              <div className="value-row" key={v.title}>
                <span className="value-num">0{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-method">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Method</p>
              <h2>Brief. Design. Rehearse. Deliver.</h2>
            </div>
          </div>
          <div className="method-track" aria-hidden="true" />
          <div className="method-grid">
            {steps.map((step, i) => (
              <div className="method-step" key={step.title}>
                <span>0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link to="/request-quote" className="btn btn-primary">
              Request a Quote
            </Link>
            <Link to="/contact" className="btn btn-soft">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
