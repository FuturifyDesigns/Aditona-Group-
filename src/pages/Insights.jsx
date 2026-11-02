import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTABand from '../components/CTABand'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import SplitHeadline from '../components/SplitHeadline'
import { gallery, heroes } from '../lib/images'
import { hardRefreshScroll } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const articles = [
  {
    title: 'Run-of-show discipline: why events feel calm',
    excerpt:
      'The difference between a good event and a great one is rarely the décor — it is the invisible timing system behind every cue.',
    image: gallery.insights.runOfShow,
    tag: 'Events',
  },
  {
    title: 'Brand systems that survive the real world',
    excerpt:
      'Guidelines that only look good in a PDF fail on site. We design systems for stages, screens, and social — together.',
    image: gallery.insights.brandSystem,
    tag: 'Creative',
  },
  {
    title: 'Planning a corporate golf day guests remember',
    excerpt:
      'From shotgun logistics to prize-giving pacing — the details that keep players engaged without feeling over-produced.',
    image: gallery.insights.guestJourney,
    tag: 'Golf',
  },
  {
    title: 'The post-event debrief that actually improves the next one',
    excerpt:
      'Capture decisions, vendor notes, and guest feedback while the day is still fresh — then turn it into a cleaner brief.',
    image: gallery.insights.debrief,
    tag: 'Delivery',
  },
  {
    title: 'Content rhythm after the launch',
    excerpt:
      'How to keep campaign energy alive once the reveal is over — without drowning the brand in noise.',
    image: gallery.insights.rhythm,
    tag: 'Creative',
  },
  {
    title: 'One brief, three divisions',
    excerpt:
      'How multidisciplinary briefs save time when your launch needs a campaign, an event, and a hospitality day.',
    image: gallery.insights.brief,
    tag: 'Group',
  },
]

export default function Insights() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('.insight-row, .insights-spine', { clearProps: 'all', opacity: 1, y: 0, scaleY: 1 })
        return
      }

      gsap.from('.insights-spine', {
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.insights-feed',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: true,
        },
      })

      gsap.utils.toArray('.insight-row').forEach((row, i) => {
        const fromX = i % 2 === 0 ? -48 : 48
        gsap.from(row, {
          opacity: 0,
          x: fromX,
          y: 24,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        })
      })

      hardRefreshScroll(pageRef.current)
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef} className="page-insights">
      <PageHero
        image={heroes.insights}
        eyebrow={<p className="eyebrow">Thinking</p>}
        title={<SplitHeadline text="Insights" as="h1" />}
        body={
          <p className="hero-lead">
            Notes from the field — delivery lessons across events, creative, and golf
            hospitality.
          </p>
        }
      />

      <section className="section insights-feed has-art">
        <ProgressiveArt variant="nodes" peak={0.5} />
        <div className="container insights-feed-layout">
          <div className="insights-spine" aria-hidden="true" />
          <div className="insights-rows">
            {articles.map((article) => (
              <article className="insight-row" key={article.title}>
                <div className="insight-row-media">
                  <img src={article.image} alt="" loading="lazy" />
                </div>
                <div className="insight-row-body">
                  <p className="eyebrow">{article.tag}</p>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
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
