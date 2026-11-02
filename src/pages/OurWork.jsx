import { useMemo, useRef, useState } from 'react'
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
  const gridRef = useRef(null)

  const visible = useMemo(
    () =>
      filter === 'All' ? projects : projects.filter((p) => p.category === filter),
    [filter],
  )

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.work-runway-card, .work-case, .work-chip', {
          clearProps: 'all',
          opacity: 1,
          x: 0,
          y: 0,
        })
        return
      }

      gsap.from('.page-work .page-hero-content > *', {
        opacity: 0,
        y: 26,
        stagger: 0.09,
        duration: 0.75,
        ease: 'power3.out',
      })

      const track = pageRef.current?.querySelector('.work-runway-track')
      const teaserBar = pageRef.current?.querySelector('.work-runway .pin-teaser-bar > b')
      const teaser = pageRef.current?.querySelector('.work-runway .pin-teaser')
      if (track) {
        gsap.from('.work-runway-card', {
          opacity: 0,
          y: 36,
          scale: 0.94,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.work-runway', start: 'top 82%' },
        })

        gsap.fromTo(
          track,
          { x: 24 },
          {
            x: () => Math.min(0, -(track.scrollWidth - window.innerWidth + 64)),
            ease: 'none',
            scrollTrigger: {
              trigger: '.work-runway',
              start: 'top top',
              end: () => `+=${Math.max(track.scrollWidth * 0.7, window.innerHeight)}`,
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
      }

      gsap.from('.work-chip', {
        opacity: 0,
        y: 18,
        stagger: 0.06,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.work-filter-bar', start: 'top 90%' },
      })

      const cases = gsap.utils.toArray('.work-case')
      cases.forEach((card, i) => {
        const media = card.querySelector('.work-case-media')
        const img = card.querySelector('img')
        const copy = card.querySelectorAll('.work-case-copy > *')
        const line = card.querySelector('.work-case-line')
        const fromLeft = i % 2 === 0

        gsap.set(line, { scaleX: 0, transformOrigin: fromLeft ? 'left center' : 'right center' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 84%',
            end: 'top 42%',
            scrub: 0.7,
          },
        })

        tl.fromTo(
          media,
          {
            clipPath: fromLeft ? 'inset(0 70% 0 0)' : 'inset(0 0 0 70%)',
            opacity: 0.4,
          },
          { clipPath: 'inset(0 0% 0 0%)', opacity: 1, ease: 'none' },
          0,
        )
          .fromTo(
            img,
            { scale: 1.18, xPercent: fromLeft ? -6 : 6 },
            { scale: 1, xPercent: 0, ease: 'none' },
            0,
          )
          .fromTo(
            copy,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, ease: 'none' },
            0.08,
          )
          .to(line, { scaleX: 1, ease: 'none' }, 0.12)

        card.addEventListener('pointerenter', () => {
          gsap.to(img, { scale: 1.06, duration: 0.55, ease: 'power2.out' })
          gsap.to(card, { y: -6, duration: 0.35, ease: 'power2.out' })
        })
        card.addEventListener('pointerleave', () => {
          gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' })
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' })
        })
      })

      hardRefreshScroll(pageRef.current)
    },
    { scope: pageRef, dependencies: [filter], revertOnUpdate: true },
  )

  const onFilter = (next) => {
    if (next === filter) return
    const grid = gridRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!grid || reduced) {
      setFilter(next)
      return
    }

    const cards = grid.querySelectorAll('.work-case')
    gsap.to(cards, {
      opacity: 0,
      y: 24,
      scale: 0.96,
      stagger: 0.04,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => setFilter(next),
    })
  }

  return (
    <div ref={pageRef} className="page-work">
      <PageHero
        image={heroes.work}
        eyebrow={<p className="eyebrow">Portfolio</p>}
        title={<SplitHeadline text="Our Work" as="h1" immediate />}
        body={
          <p className="hero-lead">
            Selected engagements across events, creative, and golf — each delivered
            with one accountable team.
          </p>
        }
      />

      <section className="work-runway" aria-label="Featured work runway">
        <div className="container work-runway-head">
          <p className="eyebrow">Featured</p>
          <h2>A runway of recent delivery</h2>
        </div>
        <div className="work-runway-track">
          {projects.map((project, i) => (
            <figure className="work-runway-card" key={`runway-${project.title}`}>
              <img src={project.image} alt="" loading="lazy" />
              <figcaption>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{project.title}</strong>
                <em>{project.category}</em>
              </figcaption>
            </figure>
          ))}
        </div>
        <aside className="pin-teaser" aria-hidden="true">
          <p className="eyebrow">Up next</p>
          <strong>Filter the portfolio</strong>
          <span>Keep scrolling to browse the archive</span>
          <i className="pin-teaser-bar">
            <b />
          </i>
        </aside>
      </section>

      <section className="section has-art">
        <ProgressiveArt variant="frames" peak={0.48} />
        <div className="container">
          <div className="work-filter-bar">
            <div>
              <p className="eyebrow">Archive</p>
              <h2>Filter the portfolio</h2>
            </div>
            <div className="chip-row" role="tablist" aria-label="Filter projects">
              {FILTERS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className={`chip work-chip${filter === chip ? ' active' : ''}`}
                  onClick={() => onFilter(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <p className="work-count" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          </p>

          <div className="work-cases" ref={gridRef}>
            {visible.map((project, i) => (
              <article
                className={`work-case${i % 2 ? ' is-flip' : ''}`}
                key={`${filter}-${project.title}`}
              >
                <div className="work-case-media">
                  <img src={project.image} alt="" loading="lazy" />
                </div>
                <div className="work-case-copy">
                  <span className="work-case-index">{String(i + 1).padStart(2, '0')}</span>
                  <p className="eyebrow">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.text}</p>
                  <i className="work-case-line" aria-hidden="true" />
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
