import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import SplitHeadline from '../components/SplitHeadline'
import { gallery, heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const frames = [
  { image: gallery.creative.workshop, title: 'Brand workshop', text: 'Aligning language, tone, and visual direction.' },
  { image: gallery.creative.proof, title: 'Proof review', text: 'Material systems checked before they go live.' },
  { image: gallery.creative.shoot, title: 'Content shoot', text: 'Photography and film built around the brief.' },
  { image: gallery.creative.planning, title: 'Campaign planning', text: 'Channels, cadence, and creative kits.' },
  { image: gallery.creative.editing, title: 'Motion editing', text: 'Cutdowns that stay sharp across screens.' },
  { image: gallery.creative.install, title: 'Installation', text: 'Brand systems that hold up in the room.' },
]

const services = [
  { title: 'Brand identity', text: 'Naming support, visual systems, and guidelines that keep every touchpoint coherent.' },
  { title: 'Campaign strategy', text: 'Insight-led platforms and channel plans built for measurable brand movement.' },
  { title: 'Content & social', text: 'Editorial calendars, production, and community rhythms that stay on-brand.' },
  { title: 'Digital experiences', text: 'Landing pages, microsites, and interactive pieces that convert attention into action.' },
  { title: 'Brand collaterals', text: 'Presentations, print, and environmental graphics aligned to the master system.' },
  { title: 'Launch creative', text: 'Integrated kits for product and event launches — from key visuals to motion.' },
]

export default function CreativeMarketing() {
  const pageRef = useRef(null)

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

      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef} className="page-creative">
      <PageHero
        image={heroes.creative}
        eyebrow={<p className="eyebrow">Division</p>}
        title={<SplitHeadline text="Creative & Marketing" as="h1" />}
        body={
          <p className="hero-lead">
            Brand systems, campaigns, and content that feel considered — sharp across
            every channel, never loud for the sake of it.
          </p>
        }
      />

      <section className="section has-art">
        <ProgressiveArt variant="frames" peak={0.5} />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Studio</p>
              <h2>Craft you can see</h2>
            </div>
          </div>
          <div className="creative-mosaic">
            {frames.map((f) => (
              <article className="creative-frame" key={f.title}>
                <div className="creative-frame-media">
                  <img src={f.image} alt="" loading="lazy" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft creative-services has-art">
        <ProgressiveArt variant="arcs" peak={0.52} />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Creative capabilities</h2>
            </div>
          </div>
          <div className="creative-chips">
            {services.map((s, i) => (
              <article className="creative-chip" key={s.title}>
                <span>0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section has-art">
        <ProgressiveArt variant="orbit" peak={0.4} />
        <div className="container" style={{ maxWidth: '40rem' }}>
          <p className="eyebrow">Engage</p>
          <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
            How to engage
          </h2>
          <p style={{ color: 'var(--ag-mid)', lineHeight: 1.6, marginBottom: '1.1rem' }}>
            Send your brand context, audience, and the outcome you need. We return a
            creative scope covering strategy, assets, and production timelines.
          </p>
          <div className="btn-row">
            <Link to="/request-quote" className="btn btn-primary">
              Request a Quote
            </Link>
            <Link to="/enquiry" className="btn btn-soft">
              Make an Enquiry
            </Link>
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  )
}
