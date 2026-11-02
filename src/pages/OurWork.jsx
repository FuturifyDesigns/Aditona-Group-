import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import SplitHeadline from '../components/SplitHeadline'
import { cards, heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FILTERS = ['All', 'Events', 'Creative', 'Golf']

const projects = [
  {
    title: 'Summit Stage Production',
    category: 'Events',
    text: 'Two-day leadership conference with keynote staging and livestream integration.',
    image: cards.eventsSummitStage,
  },
  {
    title: 'Product Reveal Night',
    category: 'Events',
    text: 'Launch experience with controlled reveal sequence and press hospitality.',
    image: cards.eventsProductReveal,
  },
  {
    title: 'Brand System Refresh',
    category: 'Creative',
    text: 'Identity update, guidelines, and campaign toolkit for a national retailer.',
    image: cards.creativeBrandSystem,
  },
  {
    title: 'Always-On Content Engine',
    category: 'Creative',
    text: 'Monthly content production and social cadence for a services brand.',
    image: cards.creativeContentEngine,
  },
  {
    title: 'Executive Golf Day',
    category: 'Golf',
    text: '36-player corporate day with branded holes and clubhouse hosting.',
    image: cards.golfExecutiveDay,
  },
  {
    title: 'Charity Scramble',
    category: 'Golf',
    text: 'Fundraising scramble with auction support and player gift programme.',
    image: cards.golfCharityScramble,
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
      <PageHero
        image={heroes.work}
        eyebrow={<p className="eyebrow">Portfolio</p>}
        title={<SplitHeadline text="Our Work" as="h1" />}
        body={
          <p>
            A selection of engagements across events, creative, and golf — placeholder
            case studies while live work is prepared.
          </p>
        }
      />

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
