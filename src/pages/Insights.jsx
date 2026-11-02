import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import SplitHeadline from '../components/SplitHeadline'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const articles = [
  {
    title: 'Run-of-show discipline: why events feel calm',
    excerpt:
      'The difference between a good event and a great one is rarely the décor — it is the invisible timing system behind every cue.',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80',
    tag: 'Events',
  },
  {
    title: 'Brand systems that survive the real world',
    excerpt:
      'Guidelines that only look good in a PDF fail on site. We design systems for stages, screens, and social — together.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    tag: 'Creative',
  },
  {
    title: 'Planning a corporate golf day that guests remember',
    excerpt:
      'From shotgun logistics to prize-giving pacing — the details that keep players engaged without feeling over-produced.',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600&q=80',
    tag: 'Golf',
  },
  {
    title: 'One brief, three divisions',
    excerpt:
      'How multidisciplinary briefs save time when your launch needs a campaign, an event, and a hospitality day.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
    tag: 'Group',
  },
]

export default function Insights() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      gsap.from('.insight-card', {
        opacity: 0,
        y: 42,
        scale: 0.94,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.grid-cards', start: 'top 85%' },
      })
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Thinking</p>
          <SplitHeadline text="Insights" as="h1" />
          <p>
            Notes from the field — delivery lessons across events, creative, and golf
            hospitality.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-cards">
          {articles.map((article) => (
            <article className="insight-card" key={article.title}>
              <img src={article.image} alt="" loading="lazy" />
              <div className="body">
                <p className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                  {article.tag}
                </p>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTABand />
    </div>
  )
}
