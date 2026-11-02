import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import Reveal from '../components/Reveal'
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
      'Conferences & summits',
      'Product launches',
      'Brand activations',
      'On-site production',
    ],
  },
  {
    title: 'Creative & Marketing',
    leaves: [
      'Brand identity',
      'Campaign strategy',
      'Content & social',
      'Digital experiences',
    ],
  },
  {
    title: 'Golf Solutions',
    leaves: [
      'Corporate golf days',
      'Hospitality packages',
      'Course activations',
      'Player experiences',
    ],
  },
]

export default function About() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.from('.tree-root', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.tree', start: 'top 80%' },
      })

      gsap.from('.tree-branch', {
        opacity: 0,
        y: 40,
        scale: 0.96,
        stagger: 0.14,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.tree-branches', start: 'top 82%' },
      })

      gsap.from('.value-card', {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.values-grid', start: 'top 85%' },
      })
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About</p>
          <SplitHeadline text="Built as one group. Delivered as specialists." as="h1" />
          <p>
            Aditona Group is a multi-disciplinary solutions company. Three divisions.
            One standard of clarity, craft, and calm execution.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gap: '1.5rem', maxWidth: '48rem' }}>
          <Reveal>
            <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
              Background
            </h2>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.65 }}>
              We formed Aditona Group to close the gap between strategy decks and live
              delivery. Clients were juggling event teams, creative agencies, and golf
              operators — often with no single owner of the outcome. We give them one
              group that can brief, design, produce, and host with shared standards.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
              Vision &amp; Mission
            </h2>
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
          </Reveal>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Structure</p>
              <h2>How the group connects</h2>
            </div>
          </div>
          <div className="tree">
            <div className="tree-root">Aditona Group</div>
            <div className="tree-stem" aria-hidden="true" />
            <div className="tree-branches">
              {branches.map((branch) => (
                <div className="tree-branch" key={branch.title}>
                  <h3>{branch.title}</h3>
                  <ul>
                    {branch.leaves.map((leaf) => (
                      <li key={leaf}>{leaf}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Principles</p>
              <h2>Values</h2>
            </div>
          </div>
          <div className="values-grid">
            {values.map((v) => (
              <div className="value-card" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container" style={{ maxWidth: '42rem' }}>
          <Reveal>
            <p className="eyebrow">Approach</p>
            <h2 style={{ fontSize: '1.7rem', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              Brief. Design. Rehearse. Deliver.
            </h2>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              Every engagement starts with a clear brief and success measures. We
              design the experience or campaign, pressure-test the plan, then execute
              with visible ownership — whether that is a stage cue, a campaign launch,
              or a tee-off sequence.
            </p>
            <div className="btn-row">
              <Link to="/request-quote" className="btn btn-primary">
                Request a Quote
              </Link>
              <Link to="/contact" className="btn btn-soft">
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
