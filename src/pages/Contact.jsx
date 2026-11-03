import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EnquiryForm from '../components/EnquiryForm'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import EditableText from '../cms/EditableText'
import { config, waLink } from '../lib/config'
import { gallery, heroes } from '../lib/images'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const channels = config.emailChannels.map((c) => ({
  label: c.label,
  value: c.email,
  href: `mailto:${c.email}`,
  hint: c.hint,
}))

export default function Contact() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.contact-channel, .contact-visual, .contact-form-panel', {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          x: 0,
        })
        return
      }

      gsap.from('.contact-channel', {
        opacity: 0,
        y: 28,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-channels', start: 'top 85%' },
      })

      gsap.from('.contact-visual', {
        opacity: 0,
        clipPath: 'inset(8% 8% 8% 8% round 18px)',
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-split', start: 'top 80%' },
      })

      gsap.from('.contact-form-panel', {
        opacity: 0,
        x: 36,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-split', start: 'top 78%' },
      })

      gsap.to('.contact-visual img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact-split',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef} className="page-contact">
      <PageHero
        image={heroes.contact}
        eyebrow={
          <EditableText contentKey="contact.eyebrow" as="p" className="eyebrow">
            Contact
          </EditableText>
        }
        title={
          <EditableText contentKey="contact.hero_title" as="h1">
            Let’s talk.
          </EditableText>
        }
        body={
          <EditableText contentKey="contact.hero_body" as="p" className="hero-lead" multiline>
            Reach the right inbox — or send a message and we will route it to the
            right division.
          </EditableText>
        }
      />

      <section className="section section--tight has-art">
        <ProgressiveArt variant="orbit" peak={0.48} />
        <div className="container contact-channels">
          {channels.map((c) => (
            <a className="contact-channel" key={c.label} href={c.href}>
              <span className="eyebrow">{c.label}</span>
              <strong>{c.value}</strong>
              <span>{c.hint}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section contact-split-section has-art">
        <ProgressiveArt variant="blueprint" peak={0.45} />
        <div className="container contact-split">
          <div className="contact-visual">
            <img src={gallery.about.briefing} alt="" loading="lazy" />
            <div className="contact-visual-card">
              <EditableText contentKey="contact.wa_eyebrow" as="p" className="eyebrow">
                Prefer WhatsApp?
              </EditableText>
              <EditableText contentKey="contact.wa_body" as="p" multiline>
                Message the team during business hours for a faster first reply.
              </EditableText>
              <a
                className="btn btn-primary"
                href={waLink('Hello Aditona Group — I would like to get in touch.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <EditableText contentKey="contact.wa_cta" as="span">
                  Open WhatsApp
                </EditableText>
              </a>
            </div>
          </div>
          <div className="contact-form-panel">
            <EditableText contentKey="contact.form_eyebrow" as="p" className="eyebrow">
              Send a message
            </EditableText>
            <EditableText contentKey="contact.form_title" as="h2">
              Tell us what you need
            </EditableText>
            <EditableText contentKey="contact.form_lead" as="p" className="contact-form-lead" multiline>
              Share a short brief and we will route it to Events, Creative, or Golf.
            </EditableText>
            <EnquiryForm type="contact" />
          </div>
        </div>
      </section>
    </div>
  )
}
