import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import SplitHeadline from '../components/SplitHeadline'
import { gallery, heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FILTERS = ['All', 'Events', 'Creative', 'Golf']

const projects = [
  {
    title: 'Leadership Summit',
    category: 'Events',
    text: 'Stage, livestream, and hospitality for a two-day executive conference.',
    image: gallery.work.summit,
  },
  {
    title: 'Product Reveal',
    category: 'Events',
    text: 'Controlled unveil sequence with press environment and guest journey.',
    image: gallery.work.reveal,
  },
  {
    title: 'Integrated Campaign',
    category: 'Creative',
    text: 'Brand system, content, and experiential install working as one story.',
    image: gallery.work.campaign,
  },
  {
    title: 'Business Interview Series',
    category: 'Creative',
    text: 'On-camera leadership content produced for always-on channels.',
    image: gallery.work.interview,
  },
  {
    title: 'Golf Hospitality Day',
    category: 'Golf',
    text: 'Corporate foursomes, course ops, and clubhouse hosting end to end.',
    image: gallery.work.hospitality,
  },
  {
    title: 'Charity Auction Evening',
    category: 'Golf',
    text: 'Sunset auction and fundraising programme on the terrace.',
    image: gallery.work.auction,
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
      if (reduced) {
        gsap.set('.project-card', { clearProps: 'all', opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        '.project-card',
        {
          opacity: 0,
          y: 64,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          stagger: 0.12,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.work-grid', start: 'top 85%' },
        },
      )

      gsap.utils.toArray('.project-card img').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.project-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: pageRef, dependencies: [filter], revertOnUpdate: true },
  )

  return (
    <div ref={pageRef} className="page-work">
      <PageHero
        image={heroes.work}
        eyebrow={<p className="eyebrow">Portfolio</p>}
        title={<SplitHeadline text="Our Work" as="h1" />}
        body={
          <p>
            Selected engagements across events, creative, and golf — each delivered
            with one accountable team.
          </p>
        }
      />

      <section className="section has-art">
        <ProgressiveArt image={gallery.work.campaign} opacity={0.14} />
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

          <div className="grid-cards work-grid">
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
