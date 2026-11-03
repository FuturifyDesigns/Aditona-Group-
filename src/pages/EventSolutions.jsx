import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import EditableButton from '../cms/EditableButton'
import EditableText from '../cms/EditableText'
import CmsClickEdit, { CmsAddCard } from '../cms/CmsClickEdit'
import { useCms } from '../cms/CmsContext'
import { mergeCards } from '../cms/mergeCards'
import { gallery, heroes } from '../lib/images'
import { hardRefreshScroll, pinOptions } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FALLBACK_MOMENTS = [
  { image: gallery.events.showCaller, title: 'Show calling', text: '', label: 'Show calling' },
  { image: gallery.events.registration, title: 'Registration', text: '', label: 'Registration' },
  { image: gallery.events.livestream, title: 'Livestream', text: '', label: 'Livestream' },
  { image: gallery.events.lighting, title: 'Stage build', text: '', label: 'Stage build' },
  { image: gallery.events.gala, title: 'Gala prep', text: '', label: 'Gala prep' },
  { image: gallery.events.outdoor, title: 'Outdoor activation', text: '', label: 'Outdoor activation' },
]

const FALLBACK_SERVICES = [
  {
    title: 'Conferences & summits',
    text: 'Programme design, speaker management, registration flows, and stage production that keep days on time.',
  },
  {
    title: 'Product launches',
    text: 'Reveal moments, press environments, and guest journeys crafted for impact and brand control.',
  },
  {
    title: 'Brand activations',
    text: 'Experiential builds and sampling environments that feel intentional — not temporary clutter.',
  },
  {
    title: 'Corporate hospitality',
    text: 'VIP hosting, seating plans, and run-of-show that make stakeholders feel looked after.',
  },
  {
    title: 'Technical production',
    text: 'AV, lighting, staging, and crew coordination with clear ownership from load-in to strike.',
  },
  {
    title: 'On-site management',
    text: 'Floor managers and crew leads who keep vendors aligned and guests unaware of the complexity.',
  },
]

export default function EventSolutions() {
  const pageRef = useRef(null)
  const { cardsByCollection, editMode } = useCms()

  const moments = useMemo(
    () => mergeCards(cardsByCollection('events_moments'), FALLBACK_MOMENTS),
    [cardsByCollection],
  )
  const services = useMemo(
    () => mergeCards(cardsByCollection('events_services'), FALLBACK_SERVICES),
    [cardsByCollection],
  )

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.events-rail-track, .events-rail-card, .service-panel', {
          clearProps: 'all',
          opacity: 1,
          x: 0,
        })
        return
      }

      const track = pageRef.current?.querySelector('.events-rail-track')
      const teaserBar = pageRef.current?.querySelector('.pin-teaser-bar > b')
      const teaser = pageRef.current?.querySelector('.events-rail .pin-teaser')
      if (track) {
        const getScroll = () => -(track.scrollWidth - window.innerWidth + 48)
        gsap.fromTo(
          track,
          { x: 40 },
          {
            x: () => getScroll(),
            ease: 'none',
            scrollTrigger: {
              trigger: '.events-rail',
              start: 'top top',
              end: () => `+=${track.scrollWidth * 0.85}`,
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
        gsap.from('.events-rail-card', {
          opacity: 0,
          y: 40,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.events-rail', start: 'top 80%' },
        })
      }

      gsap.utils.toArray('.service-panel').forEach((panel) => {
        const line = panel.querySelector('.service-panel-line')
        const num = panel.querySelector('.service-panel-num')
        const copy = panel.querySelectorAll('h3, p')

        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 86%',
            end: 'top 45%',
            scrub: 0.65,
          },
        })

        tl.fromTo(
          panel,
          { opacity: 0.25, y: 48, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, ease: 'none' },
          0,
        )
          .to(line, { scaleX: 1, ease: 'none' }, 0)
          .fromTo(num, { opacity: 0.2, x: -12 }, { opacity: 1, x: 0, ease: 'none' }, 0)
          .fromTo(copy, { y: 18, opacity: 0.35 }, { y: 0, opacity: 1, stagger: 0.05, ease: 'none' }, 0.05)

        panel.addEventListener('pointerenter', () => {
          gsap.to(panel, {
            y: -6,
            boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
            duration: 0.35,
            ease: 'power2.out',
          })
          gsap.to(line, { backgroundColor: '#1a1a1b', duration: 0.3 })
        })
        panel.addEventListener('pointerleave', () => {
          gsap.to(panel, {
            y: 0,
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.4,
            ease: 'power2.out',
          })
          gsap.to(line, { backgroundColor: '#c2c2c2', duration: 0.3 })
        })
      })

      hardRefreshScroll(pageRef.current)
    },
    { scope: pageRef, dependencies: [moments, services, editMode] },
  )

  return (
    <div ref={pageRef} className="page-events">
      <PageHero
        image={heroes.events}
        eyebrow={<EditableText contentKey="events.eyebrow" as="p" className="eyebrow" />}
        title={<EditableText contentKey="events.hero_title" as="h1" />}
        body={
          <EditableText contentKey="events.hero_body" as="p" className="hero-lead" multiline />
        }
      />

      <section className="events-rail has-art" aria-label="Production moments">
        <ProgressiveArt variant="grid" peak={0.45} dark />
        <div className="events-rail-head container">
          <EditableText contentKey="events.rail_eyebrow" as="p" className="eyebrow" />
          <EditableText contentKey="events.rail_title" as="h2" />
        </div>
        <div className="events-rail-track">
          {moments.map((m) => (
            <CmsClickEdit
              as="figure"
              className="events-rail-card"
              collection="events_moments"
              item={m}
              key={m.card?.id || m.title}
            >
              <img src={m.image} alt="" loading="lazy" />
              <figcaption>{m.label || m.title}</figcaption>
            </CmsClickEdit>
          ))}
          <CmsAddCard
            collection="events_moments"
            defaults={{
              sort_order: moments.length,
              image_url: FALLBACK_MOMENTS[0].image,
              title: 'New moment',
              body: '',
            }}
            label="+ Add moment"
          />
        </div>
        <aside className="pin-teaser" aria-hidden="true">
          <p className="eyebrow">Up next</p>
          <strong>What we deliver</strong>
          <span>Keep scrolling to reveal services</span>
          <i className="pin-teaser-bar">
            <b />
          </i>
        </aside>
      </section>

      <section className="section has-art">
        <ProgressiveArt variant="blueprint" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <EditableText contentKey="events.services_eyebrow" as="p" className="eyebrow" />
              <EditableText contentKey="events.services_title" as="h2" />
            </div>
          </div>
          <div className="service-panels">
            {services.map((s, i) => (
              <CmsClickEdit
                as="article"
                className="service-panel"
                collection="events_services"
                item={s}
                key={s.card?.id || s.title}
              >
                <span className="service-panel-num">0{i + 1}</span>
                <div className="service-panel-body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <i className="service-panel-line" aria-hidden="true" />
                </div>
              </CmsClickEdit>
            ))}
            <CmsAddCard
              collection="events_services"
              defaults={{ sort_order: services.length, title: 'New service', body: '' }}
              label="+ Add service"
            />
          </div>
        </div>
      </section>

      <section className="section section--soft has-art">
        <ProgressiveArt variant="arcs" peak={0.5} />
        <div className="container" style={{ maxWidth: '40rem' }}>
          <EditableText contentKey="events.engage_eyebrow" as="p" className="eyebrow" />
          <EditableText
            contentKey="events.engage_title"
            as="h2"
            style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}
          />
          <EditableText
            contentKey="events.engage_body"
            as="p"
            multiline
            style={{ color: 'var(--ag-mid)', lineHeight: 1.6, marginBottom: '1.1rem' }}
          />
          <div className="btn-row">
            <EditableButton to="/request-quote" contentKey="cta.quote" className="btn btn-primary">
              Request a Quote
            </EditableButton>
            <EditableButton to="/enquiry" contentKey="cta.enquiry" className="btn btn-soft">
              Make an Enquiry
            </EditableButton>
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
