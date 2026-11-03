import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CountUp from '../components/CountUp'
import CTABand from '../components/CTABand'
import DivisionCard from '../components/DivisionCard'
import HeroSlideshow from '../components/HeroSlideshow'
import ProgressiveArt, { ArtDrawing } from '../components/ProgressiveArt'
import Reveal from '../components/Reveal'
import SplitHeadline from '../components/SplitHeadline'
import CardEditor from '../cms/CardEditor'
import EditableButton from '../cms/EditableButton'
import EditableText from '../cms/EditableText'
import { useCms } from '../cms/CmsContext'
import { cards, heroes } from '../lib/images'
import { useMotionReady } from '../hooks/useMotionReady'
import { hardRefreshScroll, listSignature, pinOptions } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const slides = [
  { image: heroes.home, alt: 'Luxury event venue at sunset' },
  { image: heroes.events, alt: 'Event production stage setup' },
  { image: heroes.golf, alt: 'Golf hospitality at golden hour' },
]

const FALLBACK_DIVISIONS = [
  {
    to: '/event-solutions',
    title: 'Event Solutions',
    text: 'End-to-end planning, production, and on-site delivery for conferences, launches, and brand experiences.',
    image: heroes.events,
  },
  {
    to: '/creative-marketing',
    title: 'Creative & Marketing',
    text: 'Brand systems, campaigns, content, and digital storytelling that stay sharp across every channel.',
    image: heroes.creative,
  },
  {
    to: '/golf-solutions',
    title: 'Golf Solutions',
    text: 'Corporate golf days, hospitality, and course activations planned with precision and polish.',
    image: heroes.golf,
  },
  {
    to: '/procurement',
    title: 'Sourcing & Procurement',
    text: 'Supplier sourcing, quotations, purchasing coordination, and budget-aligned procurement across projects.',
    image: heroes.procurement,
  },
]

const FALLBACK_WORK = [
  cards.eventsSummitStage,
  cards.creativeBrandSystem,
  cards.golfExecutiveDay,
]

const storyPanels = [
  { titleKey: 'story.1.title', bodyKey: 'story.1.body', art: 'nodes' },
  { titleKey: 'story.2.title', bodyKey: 'story.2.body', art: 'orbit' },
  { titleKey: 'story.3.title', bodyKey: 'story.3.body', art: 'arcs' },
]

export default function Home() {
  const pageRef = useRef(null)
  const { cardsByCollection, get, editMode } = useCms()
  const { enabled: motionEnabled, motionKey } = useMotionReady()
  const [workEditor, setWorkEditor] = useState(null)
  const [addingDivision, setAddingDivision] = useState(false)
  const [addingWork, setAddingWork] = useState(false)

  const divisions = useMemo(() => {
    const fromCms = cardsByCollection('home_divisions')
    if (fromCms.length) {
      return fromCms.map((c, i) => ({
        card: c,
        to: c.link_url || '/',
        title: c.title,
        text: c.body || '',
        image: c.image_url || FALLBACK_DIVISIONS[0].image,
        sortOrder: c.sort_order ?? i,
      }))
    }
    return FALLBACK_DIVISIONS.map((d, i) => ({ ...d, card: null, sortOrder: i }))
  }, [cardsByCollection])

  const workThumbs = useMemo(() => {
    const fromCms = cardsByCollection('home_work')
    if (fromCms.length) {
      return fromCms.map((c, i) => ({
        card: c,
        src: c.image_url,
        title: c.title || `Work ${i + 1}`,
        sortOrder: c.sort_order ?? i,
      }))
    }
    return FALLBACK_WORK.map((src, i) => ({
      card: null,
      src,
      title: `Work ${i + 1}`,
      sortOrder: i,
    }))
  }, [cardsByCollection])

  useGSAP(
    () => {
      if (!motionEnabled) {
        gsap.set('.story-panel, .story-art, .division-card, .work-thumb, .trust-item', {
          clearProps: 'all',
          opacity: 1,
          position: 'relative',
        })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-content h1', { opacity: 0, y: 36, duration: 0.85 })
        .from('.hero-content > p', { opacity: 0, y: 20, duration: 0.55 }, '-=0.45')
        .from('.hero-content .btn-row', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')

      gsap.from('.trust-item', {
        opacity: 0,
        y: 18,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.trust-grid', start: 'top 88%' },
      })

      gsap.from('.division-card', {
        opacity: 0,
        y: 56,
        scale: 0.92,
        rotateX: 8,
        transformOrigin: '50% 100%',
        stagger: 0.14,
        duration: 0.95,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.division-grid', start: 'top 82%' },
      })

      const story = pageRef.current?.querySelector('.story-pin')
      const panels = gsap.utils.toArray('.story-panel')
      const arts = gsap.utils.toArray('.story-art')
      const bars = gsap.utils.toArray('.story-progress span i')
      if (story && panels.length) {
        gsap.set(panels, { opacity: 0, y: 28 })
        gsap.set(panels[0], { opacity: 1, y: 0 })
        gsap.set(arts, { opacity: 0, scale: 0.92 })
        if (arts[0]) gsap.set(arts[0], { opacity: 1, scale: 1.08 })
        gsap.set(bars[0], { width: '100%' })

        const storyTl = gsap.timeline({
          scrollTrigger: {
            trigger: story,
            start: 'top top',
            end: () => `+=${window.innerHeight * panels.length * 0.85}`,
            ...pinOptions({ scrub: true }),
          },
        })

        panels.forEach((panel, i) => {
          if (i === 0) return
          const prev = panels[i - 1]
          storyTl
            .to(prev, { opacity: 0, y: -24, duration: 0.45 }, i)
            .to(arts[i - 1], { opacity: 0, scale: 1.16, duration: 0.45 }, i)
            .to(bars[i - 1], { width: '100%', duration: 0.2 }, i)
            .fromTo(
              panel,
              { opacity: 0, y: 32 },
              { opacity: 1, y: 0, duration: 0.45 },
              i + 0.05,
            )
            .fromTo(
              arts[i],
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1.1, duration: 0.5 },
              i + 0.05,
            )
            .fromTo(
              bars[i],
              { width: '0%' },
              { width: '100%', duration: 0.45 },
              i + 0.05,
            )
        })
      }

      gsap.from('.work-thumb', {
        opacity: 0,
        y: 48,
        scale: 0.94,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.work-gallery', start: 'top 82%' },
      })

      hardRefreshScroll(pageRef.current)
    },
    {
      scope: pageRef,
      dependencies: [listSignature(divisions), listSignature(workThumbs), motionKey],
    },
  )

  const divisionsTitle = get('home.divisions_title')

  return (
    <div ref={pageRef}>
      <HeroSlideshow slides={slides}>
        <EditableText contentKey="hero.headline" as="h1" />
        <EditableText
          contentKey="hero.body"
          as="p"
          className="hero-lead"
          multiline
        />
        <div className="btn-row">
          <EditableButton
            to="/request-quote"
            contentKey="hero.cta_quote"
            className="btn btn-light"
          >
            Request a Quote
          </EditableButton>
          <EditableButton
            to="/enquiry"
            contentKey="hero.cta_enquiry"
            className="btn btn-ghost"
          >
            Make an Enquiry
          </EditableButton>
        </div>
      </HeroSlideshow>

      <section className="section section--tight has-art">
        <ProgressiveArt variant="rings" peak={0.42} />
        <div className="container stats-strip">
          <div className="stat-item">
            <span className="stat-num">
              <CountUp to={4} />
            </span>
            <p>Service lines</p>
          </div>
          <div className="stat-item">
            <span className="stat-num">
              <CountUp to={1} />
            </span>
            <p>Accountable group</p>
          </div>
          <div className="stat-item">
            <span className="stat-num">
              <CountUp to={100} suffix="%" />
            </span>
            <p>Delivery ownership</p>
          </div>
        </div>
      </section>

      <section className="trust-bar has-art">
        <ProgressiveArt variant="nodes" peak={0.4} />
        <div className="container trust-grid">
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div>
              <EditableText contentKey="trust.1.title" as="h3" />
              <EditableText contentKey="trust.1.body" as="p" multiline />
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l3 2" />
            </svg>
            <div>
              <h3>Precision timelines</h3>
              <p>Clear milestones, rehearsed run-of-show, calm delivery.</p>
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 19V5h4l2 4h10v10H4z" />
            </svg>
            <div>
              <EditableText contentKey="trust.2.title" as="h3" />
              <EditableText contentKey="trust.2.body" as="p" multiline />
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 18c3-6 6-9 8-9s5 3 8 9" />
              <circle cx="12" cy="8" r="2" />
            </svg>
            <div>
              <EditableText contentKey="trust.3.title" as="h3" />
              <EditableText contentKey="trust.3.body" as="p" multiline />
            </div>
          </div>
        </div>
      </section>

      <section className="section has-art">
        <ProgressiveArt variant="orbit" peak={0.48} />
        <div className="container">
          <div className="section-head">
            <div>
              <EditableText contentKey="home.divisions_eyebrow" as="p" className="eyebrow" />
              <SplitHeadline text={divisionsTitle} as="h2" />
            </div>
            <EditableButton
              to="/about"
              contentKey="home.divisions_link"
              className="section-link"
            >
              How we work →
            </EditableButton>
          </div>
          <div className="division-grid">
            {divisions.map((d) => (
              <DivisionCard
                key={d.card?.id || `${d.to}-${d.title}`}
                to={d.to}
                title={d.title}
                text={d.text}
                image={d.image}
                card={d.card}
                collection="home_divisions"
                sortOrder={d.sortOrder}
              />
            ))}
            {editMode && (
              <button
                type="button"
                className="cms-add-tile"
                onClick={() => setAddingDivision(true)}
              >
                + Add division card
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="story-pin" aria-label="Brand statement">
        <div className="story-pin-arts" aria-hidden="true">
          {storyPanels.map((panel) => (
            <div className="story-art" key={`art-${panel.titleKey}`}>
              <ArtDrawing variant={panel.art} />
            </div>
          ))}
          <div className="story-pin-veil" />
        </div>
        <div className="story-pin-inner">
          {storyPanels.map((panel, i) => (
            <div
              className={`story-panel${i === 0 ? ' is-first' : ''}`}
              key={panel.titleKey}
            >
              <div>
                <EditableText contentKey={panel.titleKey} as="h2" />
                <EditableText contentKey={panel.bodyKey} as="p" multiline />
              </div>
            </div>
          ))}
          <div className="story-progress" aria-hidden="true">
            {storyPanels.map((panel) => (
              <span key={panel.titleKey}>
                <i />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container work-layout">
          <Reveal>
            <EditableText
              contentKey="home.work_eyebrow"
              as="p"
              className="eyebrow"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            />
            <EditableText
              contentKey="home.work_title"
              as="h2"
              style={{
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                letterSpacing: '-0.03em',
              }}
            />
            <EditableText
              contentKey="home.work_body"
              as="p"
              multiline
              style={{
                color: 'rgba(255,255,255,0.72)',
                marginTop: '0.75rem',
                maxWidth: '28rem',
                lineHeight: 1.55,
              }}
            />
          </Reveal>
          <div className="work-gallery">
            {workThumbs.map((item) => (
              <div
                key={item.card?.id || item.src}
                className={`work-thumb${editMode ? ' cms-editable' : ''}`}
                role={editMode ? 'button' : undefined}
                tabIndex={editMode ? 0 : undefined}
                onClick={() => {
                  if (!editMode) return
                  setWorkEditor(item)
                }}
                onKeyDown={(e) => {
                  if (editMode && e.key === 'Enter') setWorkEditor(item)
                }}
              >
                <img src={item.src} alt="" loading="lazy" />
                {editMode && <span className="cms-pencil cms-pencil--img">✎</span>}
              </div>
            ))}
            {editMode && (
              <button
                type="button"
                className="cms-add-tile work-thumb"
                onClick={() => setAddingWork(true)}
              >
                + Add image
              </button>
            )}
          </div>
          <Reveal delay={0.1}>
            <EditableButton
              to="/our-work"
              contentKey="home.work_cta"
              className="btn btn-ghost"
            >
              View all work
            </EditableButton>
          </Reveal>
        </div>
      </section>

      <CTABand />

      {workEditor && (
        <CardEditor
          kind="card"
          record={workEditor.card?.id ? workEditor.card : null}
          defaults={{
            collection: 'home_work',
            title: workEditor.title,
            body: '',
            image_url: workEditor.src,
            sort_order: workEditor.sortOrder,
            published: true,
          }}
          onClose={() => setWorkEditor(null)}
        />
      )}
      {addingDivision && (
        <CardEditor
          kind="card"
          defaults={{
            collection: 'home_divisions',
            title: 'New division',
            body: '',
            image_url: heroes.events,
            link_url: '/',
            sort_order: divisions.length,
            published: true,
          }}
          onClose={() => setAddingDivision(false)}
        />
      )}
      {addingWork && (
        <CardEditor
          kind="card"
          defaults={{
            collection: 'home_work',
            title: 'Featured work',
            body: '',
            image_url: '',
            sort_order: workThumbs.length,
            published: true,
          }}
          onClose={() => setAddingWork(false)}
        />
      )}
    </div>
  )
}
