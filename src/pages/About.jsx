import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import SplitHeadline from '../components/SplitHeadline'

gsap.registerPlugin(useGSAP, ScrollTrigger)

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

const branches = [
  {
    title: 'Event Solutions',
    leaves: [
      'Event planning & coordination',
      'Event management & production',
      'Corporate & private events',
      'Procurement & logistics',
    ],
  },
  {
    title: 'Creative & Marketing',
    leaves: [
      'Branding & graphic design',
      'Photography & videography',
      'Social & digital content',
      'Marketing communication',
    ],
  },
  {
    title: 'Golf Solutions',
    leaves: [
      'Tournament management',
      'Corporate golf solutions',
      'Player & club support',
      'Sponsorship coordination',
    ],
  },
]

const approach = [
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
        gsap.set('.tree-leaf, .about-chapter, .value-card, .approach-step', {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          scale: 1,
        })
        return
      }

      gsap.from('.about-hero-copy > *', {
        opacity: 0,
        y: 28,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.utils.toArray('.about-chapter').forEach((chapter) => {
        const node = chapter.querySelector('.about-node')
        const connector = chapter.querySelector('.about-connector')
        const body = chapter.querySelector('.about-chapter-body')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.6,
          },
        })

        if (connector) {
          gsap.set(connector, { scaleY: 0 })
          tl.to(connector, { scaleY: 1, ease: 'none' }, 0)
        }
        if (node) {
          tl.fromTo(
            node,
            { opacity: 0.25, scale: 0.9 },
            { opacity: 1, scale: 1, ease: 'none' },
            0,
          )
        }
        if (body) {
          tl.fromTo(
            body,
            { opacity: 0.15, y: 36 },
            { opacity: 1, y: 0, ease: 'none' },
            0.05,
          )
        }
      })

      gsap.from('.tree-branch', {
        opacity: 0,
        y: 50,
        scale: 0.94,
        stagger: 0.16,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.tree-branches', start: 'top 80%' },
      })

      gsap.from('.tree-leaf', {
        opacity: 0,
        x: -16,
        stagger: 0.05,
        duration: 0.45,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tree-branches', start: 'top 70%' },
      })

      gsap.from('.value-card', {
        opacity: 0,
        y: 40,
        rotateY: -8,
        transformOrigin: 'left center',
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.values-grid', start: 'top 82%' },
      })

      gsap.from('.approach-step', {
        opacity: 0,
        y: 32,
        scale: 0.95,
        stagger: 0.12,
        duration: 0.7,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.approach-grid', start: 'top 82%' },
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef}>
      <section className="page-hero">
        <div className="container about-hero-copy">
          <p className="eyebrow">About</p>
          <SplitHeadline text="Built as one group. Delivered as specialists." as="h1" />
          <p>
            Scroll the story of Aditona Group — from one root organisation into three
            specialist divisions, shared values, and a clear way of working.
          </p>
        </div>
      </section>

      <section className="section section--soft about-tree-stage">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Our story</p>
              <h2>A group that branches with purpose</h2>
            </div>
          </div>

          <article className="about-chapter">
            <div className="about-chapter-grid">
              <div>
                <div className="about-node">Root</div>
                <div className="about-connector" aria-hidden="true" />
              </div>
              <div className="about-chapter-body">
                <h3 style={{ fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
                  Aditona Group
                </h3>
                <p style={{ color: 'var(--ag-mid)', lineHeight: 1.65 }}>
                  We formed Aditona Group to close the gap between strategy decks and live
                  delivery. Clients were juggling event teams, creative agencies, and golf
                  operators — often with no single owner of the outcome. We give them one
                  group that can brief, design, produce, and host with shared standards.
                </p>
              </div>
            </div>
          </article>

          <article className="about-chapter">
            <div className="about-chapter-grid">
              <div>
                <div className="about-node about-node--soft">Direction</div>
                <div className="about-connector" aria-hidden="true" />
              </div>
              <div className="about-chapter-body">
                <h3 style={{ fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
                  Vision &amp; Mission
                </h3>
                <p style={{ color: 'var(--ag-mid)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
                  <strong style={{ color: 'var(--ag-ink)' }}>Vision:</strong> To be the
                  most trusted multidisciplinary partner for brands that need events,
                  creative, and golf experiences to feel like one story.
                </p>
                <p style={{ color: 'var(--ag-mid)', lineHeight: 1.65 }}>
                  <strong style={{ color: 'var(--ag-ink)' }}>Mission:</strong> Translate
                  ambition into precise plans and flawless delivery — across venues,
                  channels, and courses.
                </p>
              </div>
            </div>
          </article>

          <article className="about-chapter">
            <div className="about-chapter-grid">
              <div>
                <div className="about-node">Branches</div>
                <div className="about-connector" aria-hidden="true" />
              </div>
              <div className="about-chapter-body">
                <h3 style={{ fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                  Three specialist divisions
                </h3>
                <div className="tree-branches">
                  {branches.map((branch) => (
                    <div className="tree-branch" key={branch.title}>
                      <h3>{branch.title}</h3>
                      <ul>
                        {branch.leaves.map((leaf) => (
                          <li className="tree-leaf" key={leaf}>
                            {leaf}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={
                          branch.title.startsWith('Event')
                            ? '/event-solutions'
                            : branch.title.startsWith('Creative')
                              ? '/creative-marketing'
                              : '/golf-solutions'
                        }
                        className="section-link"
                        style={{ display: 'inline-block', marginTop: '0.75rem' }}
                      >
                        Explore →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="about-chapter">
            <div className="about-chapter-grid">
              <div>
                <div className="about-node about-node--soft">Values</div>
                <div className="about-connector" aria-hidden="true" />
              </div>
              <div className="about-chapter-body">
                <h3 style={{ fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                  What we protect on every brief
                </h3>
                <div className="values-grid">
                  {values.map((v) => (
                    <div className="value-card" key={v.title}>
                      <h3>{v.title}</h3>
                      <p>{v.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="about-chapter">
            <div className="about-chapter-grid">
              <div>
                <div className="about-node">Method</div>
              </div>
              <div className="about-chapter-body">
                <h3 style={{ fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                  Brief. Design. Rehearse. Deliver.
                </h3>
                <div
                  className="approach-grid"
                  style={{
                    display: 'grid',
                    gap: '0.85rem',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  }}
                >
                  {approach.map((step, i) => (
                    <div className="value-card approach-step" key={step.title}>
                      <p className="eyebrow" style={{ marginBottom: '0.4rem' }}>
                        0{i + 1}
                      </p>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  ))}
                </div>
                <div className="btn-row" style={{ marginTop: '1.35rem' }}>
                  <Link to="/request-quote" className="btn btn-primary">
                    Request a Quote
                  </Link>
                  <Link to="/contact" className="btn btn-soft">
                    Contact us
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
