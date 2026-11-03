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
import { hardRefreshScroll } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FALLBACK_FRAMES = [
  { image: gallery.creative.workshop, title: 'Brand workshop', text: 'Aligning language, tone, and visual direction.' },
  { image: gallery.creative.proof, title: 'Proof review', text: 'Material systems checked before they go live.' },
  { image: gallery.creative.shoot, title: 'Content shoot', text: 'Photography and film built around the brief.' },
  { image: gallery.creative.planning, title: 'Campaign planning', text: 'Channels, cadence, and creative kits.' },
  { image: gallery.creative.editing, title: 'Motion editing', text: 'Cutdowns that stay sharp across screens.' },
  { image: gallery.creative.install, title: 'Installation', text: 'Brand systems that hold up in the room.' },
]

const FALLBACK_SERVICES = [
  { title: 'Brand identity', text: 'Naming support, visual systems, and guidelines that keep every touchpoint coherent.' },
  { title: 'Campaign strategy', text: 'Insight-led platforms and channel plans built for measurable brand movement.' },
  { title: 'Content & social', text: 'Editorial calendars, production, and community rhythms that stay on-brand.' },
  { title: 'Digital experiences', text: 'Landing pages, microsites, and interactive pieces that convert attention into action.' },
  { title: 'Brand collaterals', text: 'Presentations, print, and environmental graphics aligned to the master system.' },
  { title: 'Launch creative', text: 'Integrated kits for product and event launches — from key visuals to motion.' },
]

export default function CreativeMarketing() {
  const pageRef = useRef(null)
  const { cardsByCollection, editMode } = useCms()

  const frames = useMemo(
    () => mergeCards(cardsByCollection('creative_frames'), FALLBACK_FRAMES),
    [cardsByCollection],
  )
  const services = useMemo(
    () => mergeCards(cardsByCollection('creative_services'), FALLBACK_SERVICES),
    [cardsByCollection],
  )

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.creative-frame, .creative-chip', { clearProps: 'all', opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.from('.page-creative .page-hero-content > *', {
        opacity: 0,
        y: 28,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.utils.toArray('.creative-frame').forEach((frame, i) => {
        const media = frame.querySelector('.creative-frame-media')
        const img = frame.querySelector('img')
        const copy = frame.querySelectorAll('h3, p')

        gsap.fromTo(
          frame,
          { opacity: 0, y: 70, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.95,
            delay: (i % 3) * 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: frame, start: 'top 88%' },
          },
        )

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.18 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }

        frame.addEventListener('pointerenter', () => {
          gsap.to(frame, { y: -10, duration: 0.35, ease: 'power2.out' })
          if (media) gsap.to(media, { scale: 1.03, duration: 0.45, ease: 'power2.out' })
          gsap.to(copy, { y: -4, duration: 0.35, stagger: 0.04, ease: 'power2.out' })
        })
        frame.addEventListener('pointerleave', () => {
          gsap.to(frame, { y: 0, duration: 0.45, ease: 'power2.out' })
          if (media) gsap.to(media, { scale: 1, duration: 0.5, ease: 'power2.out' })
          gsap.to(copy, { y: 0, duration: 0.4, ease: 'power2.out' })
        })
      })

      gsap.from('.creative-chip', {
        opacity: 0,
        y: 36,
        scale: 0.92,
        rotateY: -10,
        transformOrigin: 'left center',
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.creative-services', start: 'top 82%' },
      })

      gsap.utils.toArray('.creative-chip').forEach((chip) => {
        chip.addEventListener('pointerenter', () => {
          gsap.to(chip, {
            y: -8,
            scale: 1.02,
            borderColor: '#1a1a1b',
            duration: 0.3,
            ease: 'power2.out',
          })
        })
        chip.addEventListener('pointerleave', () => {
          gsap.to(chip, {
            y: 0,
            scale: 1,
            borderColor: '#e8e8e8',
            duration: 0.35,
            ease: 'power2.out',
          })
        })
      })

      hardRefreshScroll(pageRef.current)
    },
    { scope: pageRef, dependencies: [frames, services, editMode] },
  )

  return (
    <div ref={pageRef} className="page-creative">
      <PageHero
        image={heroes.creative}
        eyebrow={<EditableText contentKey="creative.eyebrow" as="p" className="eyebrow" />}
        title={<EditableText contentKey="creative.hero_title" as="h1" />}
        body={
          <EditableText contentKey="creative.hero_body" as="p" className="hero-lead" multiline />
        }
      />

      <section className="section has-art">
        <ProgressiveArt variant="frames" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <EditableText contentKey="creative.studio_eyebrow" as="p" className="eyebrow" />
              <EditableText contentKey="creative.studio_title" as="h2" />
            </div>
          </div>
          <div className="creative-mosaic">
            {frames.map((f) => (
              <CmsClickEdit
                as="article"
                className="creative-frame"
                collection="creative_frames"
                item={f}
                key={f.card?.id || f.title}
              >
                <div className="creative-frame-media">
                  <img src={f.image} alt="" loading="lazy" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </CmsClickEdit>
            ))}
            <CmsAddCard
              collection="creative_frames"
              defaults={{
                sort_order: frames.length,
                image_url: FALLBACK_FRAMES[0].image,
                title: 'New frame',
                body: '',
              }}
              label="+ Add frame"
            />
          </div>
        </div>
      </section>

      <section className="section section--soft creative-services has-art">
        <ProgressiveArt variant="arcs" peak={0.52} />
        <div className="container">
          <div className="section-head">
            <div>
              <EditableText contentKey="creative.services_eyebrow" as="p" className="eyebrow" />
              <EditableText contentKey="creative.services_title" as="h2" />
            </div>
          </div>
          <div className="creative-chips">
            {services.map((s, i) => (
              <CmsClickEdit
                as="article"
                className="creative-chip"
                collection="creative_services"
                item={s}
                key={s.card?.id || s.title}
              >
                <span>0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </CmsClickEdit>
            ))}
            <CmsAddCard
              collection="creative_services"
              defaults={{ sort_order: services.length, title: 'New service', body: '' }}
              label="+ Add service"
            />
          </div>
        </div>
      </section>

      <section className="section has-art">
        <ProgressiveArt variant="orbit" peak={0.4} />
        <div className="container" style={{ maxWidth: '40rem' }}>
          <EditableText contentKey="creative.engage_eyebrow" as="p" className="eyebrow" />
          <EditableText
            contentKey="creative.engage_title"
            as="h2"
            style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}
          />
          <EditableText
            contentKey="creative.engage_body"
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
