import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import SplitHeadline from '../components/SplitHeadline'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FILTERS = ['All', 'Events', 'Creative', 'Golf']

const projects = [
  {
    title: 'Summit Stage Production',
    category: 'Events',
    text: 'Two-day leadership conference with keynote staging and livestream integration.',
    image:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&q=80',
  },
  {
    title: 'Product Reveal Night',
    category: 'Events',
    text: 'Launch experience with controlled reveal sequence and press hospitality.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
  },
  {
    title: 'Brand System Refresh',
    category: 'Creative',
    text: 'Identity update, guidelines, and campaign toolkit for a national retailer.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80',
  },
  {
    title: 'Always-On Content Engine',
    category: 'Creative',
    text: 'Monthly content production and social cadence for a services brand.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
  },
  {
    title: 'Executive Golf Day',
    category: 'Golf',
    text: '36-player corporate day with branded holes and clubhouse hosting.',
    image:
      'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1600&q=80',
  },
  {
    title: 'Charity Scramble',
    category: 'Golf',
    text: 'Fundraising scramble with auction support and player gift programme.',
    image:
      'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1600&q=80',
  },
]

export default function OurWork() {
  const [filter, setFilter] = useState('All')
  const pageRef = useRef(null)

  const visible = useMemo(
    () =>
      filter === 'All' ? projects : projects.filter((p) => p.category === filter),
    [filter],
  )

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      gsap.from('.project-card', {
        opacity: 0,
        y: 50,
        scale: 0.92,
        rotateX: 6,
        transformOrigin: '50% 100%',
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.grid-cards', start: 'top 85%' },
      })
    },
    { scope: pageRef, dependencies: [filter], revertOnUpdate: true },
  )

  return (
    <div ref={pageRef}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Portfolio</p>
          <SplitHeadline text="Our Work" as="h1" />
          <p>
            A selection of engagements across events, creative, and golf — placeholder
            case studies while live work is prepared.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="chip-row" role="tablist" aria-label="Filter projects">
            {FILTERS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip${filter === chip ? ' active' : ''}`}
                onClick={() => setFilter(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="grid-cards">
            {visible.map((project) => (
              <article className="project-card" key={project.title}>
                <img src={project.image} alt="" loading="lazy" />
                <div className="body">
                  <p className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                    {project.category}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
