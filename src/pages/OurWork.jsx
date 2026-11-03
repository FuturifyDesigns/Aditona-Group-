import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import SplitHeadline from '../components/SplitHeadline'
import CardEditor from '../cms/CardEditor'
import EditableText from '../cms/EditableText'
import { useCms } from '../cms/CmsContext'
import { gallery, heroes } from '../lib/images'
import { hardRefreshScroll, pinOptions } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FILTERS = ['All', 'Events', 'Creative', 'Golf']

const FALLBACK_PROJECTS = [
  {
    title: 'Leadership Summit',
    division: 'Events',
    summary: 'Stage, livestream, and hospitality for a two-day executive conference.',
    image_url: gallery.work.summit,
  },
  {
    title: 'Product Reveal',
    division: 'Events',
    summary: 'Controlled unveil sequence with press environment and guest journey.',
    image_url: gallery.work.reveal,
  },
  {
    title: 'Integrated Campaign',
    division: 'Creative',
    summary: 'Brand system, content, and experiential install working as one story.',
    image_url: gallery.work.campaign,
  },
  {
    title: 'Business Interview Series',
    division: 'Creative',
    summary: 'On-camera leadership content produced for always-on channels.',
    image_url: gallery.work.interview,
  },
  {
    title: 'Golf Hospitality Day',
    division: 'Golf',
    summary: 'Corporate foursomes, course ops, and clubhouse hosting end to end.',
    image_url: gallery.work.hospitality,
  },
  {
    title: 'Charity Auction Evening',
    division: 'Golf',
    summary: 'Sunset auction and fundraising programme on the terrace.',
    image_url: gallery.work.auction,
  },
]

export default function OurWork() {
  const [filter, setFilter] = useState('All')
  const [editor, setEditor] = useState(null)
  const [adding, setAdding] = useState(false)
  const pageRef = useRef(null)
  const gridRef = useRef(null)
  const { projects, editMode } = useCms()

  const allProjects = useMemo(() => {
    if (projects?.length) {
      return projects.map((p) => ({
        ...p,
        category: p.division || 'Events',
        text: p.summary || '',
        image: p.image_url,
      }))
    }
    return FALLBACK_PROJECTS.map((p, i) => ({
      ...p,
      id: null,
      category: p.division,
      text: p.summary,
      image: p.image_url,
      sort_order: i,
      published: true,
    }))
  }, [projects])

  const visible = useMemo(
    () =>
      filter === 'All'
        ? allProjects
        : allProjects.filter((p) => p.category === filter),
    [filter, allProjects],
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

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work-runway',
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.35}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (teaserBar) teaserBar.style.transform = `scaleX(${self.progress})`
              if (teaser) teaser.classList.toggle('is-done', self.progress > 0.92)
            },
            ...pinOptions,
          },
        })
      }

      hardRefreshScroll(pageRef.current)
    },
    { scope: pageRef, dependencies: [allProjects, editMode] },
  )

  useGSAP(
    () => {
      const grid = gridRef.current
      if (!grid) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.work-case', { clearProps: 'all', opacity: 1, y: 0, scale: 1 })
        return
      }
      gsap.from('.work-case', {
        opacity: 0,
        y: 28,
        stagger: 0.06,
        duration: 0.55,
        ease: 'power3.out',
      })
    },
    { scope: gridRef, dependencies: [filter, visible] },
  )

  const onFilter = (next) => {
    if (next === filter) return
    const grid = gridRef.current
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

  const openProject = (project) => {
    if (!editMode) return
    setEditor(project)
  }

  return (
    <div ref={pageRef} className="page-work">
      <PageHero
        image={heroes.work}
        eyebrow={<EditableText contentKey="work.eyebrow" as="p" className="eyebrow">Portfolio</EditableText>}
        title={<SplitHeadline text="Our Work" as="h1" immediate />}
        body={
          <EditableText contentKey="work.hero_body" as="p" className="hero-lead" multiline>
            Selected engagements across events, creative, and golf — each delivered
            with one accountable team.
          </EditableText>
        }
      />

      <section className="work-runway" aria-label="Featured work runway">
        <div className="container work-runway-head">
          <EditableText contentKey="work.runway_eyebrow" as="p" className="eyebrow">
            Featured
          </EditableText>
          <EditableText contentKey="work.runway_title" as="h2">
            A runway of recent delivery
          </EditableText>
        </div>
        <div className="work-runway-track">
          {allProjects.map((project, i) => (
            <figure
              className={`work-runway-card${editMode ? ' cms-editable' : ''}`}
              key={project.id || `runway-${project.title}`}
              onClick={() => openProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openProject(project)
              }}
              role={editMode ? 'button' : undefined}
              tabIndex={editMode ? 0 : undefined}
            >
              <img src={project.image} alt="" loading="lazy" />
              <figcaption>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{project.title}</strong>
                <em>{project.category}</em>
              </figcaption>
              {editMode && <span className="cms-pencil cms-pencil--img">✎</span>}
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
              <EditableText contentKey="work.archive_eyebrow" as="p" className="eyebrow">
                Archive
              </EditableText>
              <EditableText contentKey="work.archive_title" as="h2">
                Filter the portfolio
              </EditableText>
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
                className={`work-case${i % 2 ? ' is-flip' : ''}${editMode ? ' cms-editable' : ''}`}
                key={`${filter}-${project.id || project.title}`}
                onClick={() => openProject(project)}
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
                {editMode && <span className="cms-pencil">✎</span>}
              </article>
            ))}
            {editMode && (
              <button type="button" className="cms-add-tile" onClick={() => setAdding(true)}>
                + Add project
              </button>
            )}
          </div>
        </div>
      </section>

      <CTABand />

      {editor && (
        <CardEditor
          kind="project"
          record={editor.id ? editor : null}
          defaults={{
            title: editor.title,
            summary: editor.summary || editor.text,
            image_url: editor.image_url || editor.image,
            division: editor.division || editor.category,
            sort_order: editor.sort_order || 0,
            published: true,
          }}
          onClose={() => setEditor(null)}
        />
      )}
      {adding && (
        <CardEditor
          kind="project"
          defaults={{
            title: 'New project',
            summary: '',
            image_url: '',
            division: 'Events',
            sort_order: allProjects.length,
            published: true,
          }}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  )
}
