import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import ProgressiveArt, { ArtDrawing } from '../components/ProgressiveArt'
import EditableButton from '../cms/EditableButton'
import EditableText from '../cms/EditableText'
import CmsClickEdit, { CmsAddCard } from '../cms/CmsClickEdit'
import { useCms } from '../cms/CmsContext'
import { mergeCards } from '../cms/mergeCards'
import { useMotionReady } from '../hooks/useMotionReady'
import { gallery, heroes } from '../lib/images'
import { hardRefreshScroll, listSignature, pinOptions, softScrollIn } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FALLBACK_MANIFESTO = [
  {
    title: 'One accountable group.',
    text: 'Aditona Group was built to close the gap between strategy decks and live delivery — one owner for the brief, the look, and the day itself.',
    label: '01 — Origin',
    to: 'nodes',
    art: 'nodes',
  },
  {
    title: 'Experiences that feel like one story.',
    text: 'We aim to be the most trusted multidisciplinary partner for brands that need events, creative, and golf to move as a single narrative.',
    label: '02 — Vision',
    to: 'orbit',
    art: 'orbit',
  },
  {
    title: 'Ambition, translated into precision.',
    text: 'We turn intent into rehearsed plans and calm execution — across venues, channels, and courses — with shared standards at every stage.',
    label: '03 — Mission',
    to: 'arcs',
    art: 'arcs',
  },
]

const FALLBACK_MOMENTS = [
  { title: 'Leadership review', image: gallery.about.leadership },
  { title: 'Client briefing', image: gallery.about.briefing },
  { title: 'Venue recce', image: gallery.about.venue },
  { title: 'Quality control', image: gallery.about.quality },
  { title: 'Team huddle', image: gallery.about.huddle },
  { title: 'Integrated planning', image: gallery.about.planning },
]

const FALLBACK_DIVISIONS = [
  {
    title: 'Event Solutions',
    text: 'Planning, production, and on-site ownership for conferences, launches, and brand experiences.',
    to: '/event-solutions',
    image: gallery.about.venue,
  },
  {
    title: 'Creative & Marketing',
    text: 'Brand systems, campaigns, photography, and digital storytelling that stay sharp everywhere.',
    to: '/creative-marketing',
    image: gallery.about.planning,
  },
  {
    title: 'Golf Solutions',
    text: 'Corporate golf days, hospitality, and course activations planned with polish and pace.',
    to: '/golf-solutions',
    image: gallery.about.quality,
  },
  {
    title: 'Sourcing & Procurement',
    text: 'Supplier sourcing, quotations, purchasing coordination, and budget-aligned procurement across projects.',
    to: '/procurement',
    image: gallery.procurement.quotes,
  },
]

const FALLBACK_VALUES = [
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

const FALLBACK_STEPS = [
  { title: 'Brief', text: 'Align on goals, audience, constraints, and success measures.' },
  { title: 'Design', text: 'Shape the experience, creative system, or golf programme.' },
  { title: 'Rehearse', text: 'Pressure-test timelines, vendors, and contingencies.' },
  { title: 'Deliver', text: 'Execute with visible ownership from start to close-out.' },
]

export default function About() {
  const pageRef = useRef(null)
  const { cardsByCollection } = useCms()
  const { enabled: motionEnabled, motionKey } = useMotionReady()

  const manifesto = useMemo(
    () =>
      mergeCards(cardsByCollection('about_manifesto'), FALLBACK_MANIFESTO).map((item, i) => {
        const fb = FALLBACK_MANIFESTO[i] || FALLBACK_MANIFESTO[0] || {}
        return {
          ...item,
          kicker: item.label || fb.label,
          art: item.to || fb.art || 'nodes',
        }
      }),
    [cardsByCollection],
  )

  const moments = useMemo(
    () => mergeCards(cardsByCollection('about_moments'), FALLBACK_MOMENTS),
    [cardsByCollection],
  )

  const divisions = useMemo(
    () => mergeCards(cardsByCollection('about_divisions'), FALLBACK_DIVISIONS),
    [cardsByCollection],
  )

  const values = useMemo(
    () => mergeCards(cardsByCollection('about_values'), FALLBACK_VALUES),
    [cardsByCollection],
  )

  const steps = useMemo(
    () => mergeCards(cardsByCollection('about_method'), FALLBACK_STEPS),
    [cardsByCollection],
  )

  useGSAP(
    () => {
      if (!motionEnabled) {
        gsap.set(
          '.about-hero-media, .about-hero-copy > *, .manifesto-panel, .about-moment, .division-slide, .value-row, .method-step, .about-line',
          { clearProps: 'all', opacity: 1, y: 0, x: 0, scale: 1 },
        )
        return
      }

      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from('.about-hero-media', { scale: 1.18, opacity: 0.5, duration: 1.4 }, 0)
        .from('.about-hero-copy .eyebrow', { y: 24, opacity: 0, duration: 0.6 }, 0.25)
        .from('.about-hero-copy .about-hero-title', { y: 36, opacity: 0, duration: 0.75 }, 0.35)
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

      const manifestoSection = pageRef.current?.querySelector('.about-manifesto')
      const panels = gsap.utils.toArray('.manifesto-panel')
      const arts = gsap.utils.toArray('.manifesto-art')
      const progress = gsap.utils.toArray('.manifesto-progress span i')

      if (manifestoSection && panels.length) {
        gsap.set(panels, { autoAlpha: 0, y: 16 })
        gsap.set(panels[0], { autoAlpha: 1, y: 0 })
        gsap.set(arts, { autoAlpha: 0, scale: 1 })
        if (arts[0]) gsap.set(arts[0], { autoAlpha: 1, scale: 1.04 })
        if (progress[0]) gsap.set(progress[0], { scaleX: 1 })

        const mTl = gsap.timeline({
          scrollTrigger: {
            trigger: manifestoSection,
            start: 'top top',
            end: () => `+=${window.innerHeight * panels.length * 0.9}`,
            ...pinOptions({ scrub: true }),
          },
        })

        panels.forEach((panel, i) => {
          if (i === 0) return
          const prev = panels[i - 1]
          // Overlapped crossfade — no empty white gap between panels
          mTl
            .to(prev, { autoAlpha: 0, y: -12, duration: 0.55 }, i)
            .to(arts[i - 1], { autoAlpha: 0, scale: 1.06, duration: 0.55 }, i)
            .fromTo(
              panel,
              { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: 0.55 },
              i,
            )
            .fromTo(
              arts[i],
              { autoAlpha: 0, scale: 0.98 },
              { autoAlpha: 1, scale: 1.04, duration: 0.55 },
              i,
            )
            .fromTo(
              progress[i],
              { scaleX: 0 },
              { scaleX: 1, duration: 0.55 },
              i,
            )
        })
      }

      softScrollIn('.about-moment', {
        y: 48,
        scale: 0.94,
        stagger: 0.08,
        duration: 0.75,
        trigger: '.about-moments',
        start: 'top 82%',
      })

      softScrollIn('.about-divisions-head > *', {
        y: 32,
        stagger: 0.1,
        duration: 0.8,
        trigger: '.about-divisions',
        start: 'top 78%',
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
        if (window.matchMedia('(min-width: 768px)').matches) {
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
        }
      })

      softScrollIn('.value-row', {
        y: 48,
        stagger: 0.12,
        duration: 0.85,
        trigger: '.about-values',
        start: 'top 78%',
      })

      gsap.from('.about-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.about-values', start: 'top 70%' },
      })

      softScrollIn('.method-step', {
        y: 36,
        scale: 0.96,
        stagger: 0.14,
        duration: 0.75,
        trigger: '.about-method',
        start: 'top 78%',
      })

      gsap.from('.method-track', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.about-method', start: 'top 75%' },
      })

      gsap.utils.toArray('.value-row').forEach((row) => {
        const accent = row.querySelector('.value-accent')
        const arrow = row.querySelector('.value-arrow')
        row.addEventListener('pointerenter', () => {
          gsap.to(row, { y: -4, duration: 0.35, ease: 'power2.out' })
          if (accent) gsap.to(accent, { scaleX: 1, duration: 0.4, ease: 'power2.out' })
          if (arrow) gsap.to(arrow, { x: 6, opacity: 1, duration: 0.3 })
        })
        row.addEventListener('pointerleave', () => {
          gsap.to(row, { y: 0, duration: 0.4, ease: 'power2.out' })
          if (accent) gsap.to(accent, { scaleX: 0, duration: 0.3 })
          if (arrow) gsap.to(arrow, { x: 0, opacity: 0.35, duration: 0.3 })
        })
      })

      gsap.utils.toArray('.method-step').forEach((step) => {
        const mark = step.querySelector('.method-step-mark')
        step.addEventListener('pointerenter', () => {
          gsap.to(step, {
            y: -6,
            boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
            duration: 0.35,
            ease: 'power2.out',
          })
          if (mark) gsap.to(mark, { backgroundColor: '#1a1a1b', color: '#fff', duration: 0.3 })
        })
        step.addEventListener('pointerleave', () => {
          gsap.to(step, {
            y: 0,
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.4,
            ease: 'power2.out',
          })
          if (mark) gsap.to(mark, { backgroundColor: '#f4f4f4', color: '#1a1a1b', duration: 0.3 })
        })
      })

      hardRefreshScroll(pageRef.current)
    },
    {
      scope: pageRef,
      dependencies: [
        listSignature(manifesto),
        listSignature(moments),
        listSignature(divisions),
        listSignature(values),
        listSignature(steps),
        motionKey,
      ],
    },
  )

  return (
    <div ref={pageRef} className="about-page">
      <section className="about-hero">
        <div className="about-hero-media" aria-hidden="true">
          <img src={heroes.about} alt="" />
        </div>
        <div className="about-hero-scrim" aria-hidden="true" />
        <div className="container about-hero-copy">
          <EditableText
            contentKey="about.eyebrow"
            as="p"
            className="eyebrow"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            About Aditona Group
          </EditableText>
          <EditableText contentKey="about.hero_title" as="h1" className="about-hero-title">
            Built as one group. Delivered as specialists.
          </EditableText>
          <EditableText contentKey="about.hero_body" as="p" className="about-hero-body" multiline>
            A multidisciplinary partner for brands that need events, creative, and golf
            experiences to feel intentional — and land without friction.
          </EditableText>
          <div className="about-scroll-cue" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </div>
      </section>

      <section className="about-manifesto" aria-label="Our story">
        <div className="about-manifesto-arts" aria-hidden="true">
          {manifesto.map((panel, i) => (
            <div className="manifesto-art" key={`art-${panel.kicker || panel.title || i}`}>
              <ArtDrawing variant={panel.art} />
            </div>
          ))}
          <div className="about-manifesto-veil" />
        </div>
        <div className="about-manifesto-inner">
          {manifesto.map((panel, i) => (
            <CmsClickEdit
              key={panel.card?.id || panel.kicker || panel.title || i}
              collection="about_manifesto"
              item={panel}
              as="article"
              className="manifesto-panel"
            >
              <p className="eyebrow">{panel.kicker}</p>
              <h2>{panel.title}</h2>
              <p>{panel.text}</p>
            </CmsClickEdit>
          ))}
          <CmsAddCard
            collection="about_manifesto"
            label="+ Add manifesto"
            defaults={{ link_label: '0X — New', link_url: 'nodes', sort_order: manifesto.length }}
          />
          <div className="manifesto-progress" aria-hidden="true">
            {manifesto.map((panel, i) => (
              <span key={panel.kicker || panel.title || i}>
                <i />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-moments has-art">
        <ProgressiveArt variant="frames" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <EditableText contentKey="about.moments_eyebrow" as="p" className="eyebrow">
                How we work
              </EditableText>
              <EditableText contentKey="about.moments_title" as="h2">
                Moments from the room
              </EditableText>
            </div>
          </div>
          <div className="about-moments-grid">
            {moments.map((m, i) => (
              <CmsClickEdit
                key={m.card?.id || m.title || i}
                collection="about_moments"
                item={m}
                as="figure"
                className="about-moment"
              >
                <div className="about-moment-media">
                  <img src={m.image} alt="" loading="lazy" />
                </div>
                <figcaption>{m.title}</figcaption>
              </CmsClickEdit>
            ))}
            <CmsAddCard
              collection="about_moments"
              label="+ Add moment"
              defaults={{ sort_order: moments.length }}
            />
          </div>
        </div>
      </section>

      <section className="section about-divisions has-art">
        <ProgressiveArt variant="blueprint" peak={0.48} />
        <div className="container">
          <div className="about-divisions-head">
            <EditableText contentKey="about.divisions_eyebrow" as="p" className="eyebrow">
              Divisions
            </EditableText>
            <EditableText contentKey="about.divisions_title" as="h2">
              Specialist branches. Shared procurement. One standard of delivery.
            </EditableText>
            <EditableText contentKey="about.divisions_body" as="p" multiline>
              Each division runs with depth — supported by group-wide sourcing &
              procurement, planning, and on-the-day accountability.
            </EditableText>
          </div>

          <div className="division-slides">
            {divisions.map((d, i) => (
              <CmsClickEdit
                key={d.card?.id || d.title || i}
                collection="about_divisions"
                item={d}
                as="article"
                className="division-slide"
              >
                <div className="division-slide-media">
                  <img src={d.image} alt="" loading="lazy" />
                </div>
                <div className="division-slide-copy">
                  <span className="division-index">0{i + 1}</span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <Link to={d.to || '/'} className="section-link">
                    Explore →
                  </Link>
                </div>
              </CmsClickEdit>
            ))}
            <CmsAddCard
              collection="about_divisions"
              label="+ Add division"
              defaults={{ link_url: '/', sort_order: divisions.length }}
            />
          </div>
        </div>
      </section>

      <section className="section section--soft about-values has-art">
        <ProgressiveArt variant="nodes" peak={0.52} />
        <div className="container">
          <div className="section-head">
            <div>
              <EditableText contentKey="about.values_eyebrow" as="p" className="eyebrow">
                Values
              </EditableText>
              <EditableText contentKey="about.values_title" as="h2">
                What we protect on every brief
              </EditableText>
            </div>
          </div>
          <div className="about-line" aria-hidden="true" />
          <div className="value-rows">
            {values.map((v, i) => (
              <CmsClickEdit
                key={v.card?.id || v.title || i}
                collection="about_values"
                item={v}
                as="article"
                className="value-row"
              >
                <i className="value-accent" aria-hidden="true" />
                <span className="value-num">0{i + 1}</span>
                <div className="value-row-main">
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
                <span className="value-arrow" aria-hidden="true">
                  →
                </span>
              </CmsClickEdit>
            ))}
            <CmsAddCard
              collection="about_values"
              label="+ Add value"
              defaults={{ sort_order: values.length }}
            />
          </div>
        </div>
      </section>

      <section className="section about-method has-art">
        <ProgressiveArt variant="rings" peak={0.45} />
        <div className="container">
          <div className="section-head">
            <div>
              <EditableText contentKey="about.method_eyebrow" as="p" className="eyebrow">
                Method
              </EditableText>
              <EditableText contentKey="about.method_title" as="h2">
                Brief. Design. Rehearse. Deliver.
              </EditableText>
            </div>
          </div>
          <div className="method-track" aria-hidden="true" />
          <div className="method-grid">
            {steps.map((step, i) => (
              <CmsClickEdit
                key={step.card?.id || step.title || i}
                collection="about_method"
                item={step}
                as="article"
                className="method-step"
              >
                <span className="method-step-mark">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </CmsClickEdit>
            ))}
            <CmsAddCard
              collection="about_method"
              label="+ Add step"
              defaults={{ sort_order: steps.length }}
            />
          </div>
          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <EditableButton to="/request-quote" contentKey="about.cta_quote" className="btn btn-primary">
              Request a Quote
            </EditableButton>
            <EditableButton to="/contact" contentKey="about.cta_contact" className="btn btn-soft">
              Contact us
            </EditableButton>
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
