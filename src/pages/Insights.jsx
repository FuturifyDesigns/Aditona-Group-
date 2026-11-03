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
import { useMotionReady } from '../hooks/useMotionReady'
import { gallery, heroes } from '../lib/images'
import { hardRefreshScroll, listSignature, softScrollIn } from '../lib/scroll'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FALLBACK_ARTICLES = [
  {
    title: 'Run-of-show discipline: why events feel calm',
    body: 'The difference between a good event and a great one is rarely the décor — it is the invisible timing system behind every cue.',
    image_url: gallery.insights.runOfShow,
    link_label: 'Events',
  },
  {
    title: 'Brand systems that survive the real world',
    body: 'Guidelines that only look good in a PDF fail on site. We design systems for stages, screens, and social — together.',
    image_url: gallery.insights.brandSystem,
    link_label: 'Creative',
  },
  {
    title: 'Planning a corporate golf day guests remember',
    body: 'From shotgun logistics to prize-giving pacing — the details that keep players engaged without feeling over-produced.',
    image_url: gallery.insights.guestJourney,
    link_label: 'Golf',
  },
  {
    title: 'The post-event debrief that actually improves the next one',
    body: 'Capture decisions, vendor notes, and guest feedback while the day is still fresh — then turn it into a cleaner brief.',
    image_url: gallery.insights.debrief,
    link_label: 'Delivery',
  },
  {
    title: 'Content rhythm after the launch',
    body: 'How to keep campaign energy alive once the reveal is over — without drowning the brand in noise.',
    image_url: gallery.insights.rhythm,
    link_label: 'Creative',
  },
  {
    title: 'One brief, one coordinated group',
    body: 'How multidisciplinary briefs save time when your launch needs a campaign, an event, and a hospitality day.',
    image_url: gallery.insights.brief,
    link_label: 'Group',
  },
]

export default function Insights() {
  const pageRef = useRef(null)
  const { cardsByCollection, editMode } = useCms()
  const { enabled: motionEnabled, motionKey } = useMotionReady()
  const [editor, setEditor] = useState(null)
  const [adding, setAdding] = useState(false)

  const articles = useMemo(() => {
    const fromCms = cardsByCollection('insights')
    if (fromCms.length) {
      return fromCms.map((c) => ({
        ...c,
        tag: c.link_label || 'Insight',
        excerpt: c.body || '',
        image: c.image_url,
      }))
    }
    return FALLBACK_ARTICLES.map((a, i) => ({
      ...a,
      id: null,
      tag: a.link_label,
      excerpt: a.body,
      image: a.image_url,
      collection: 'insights',
      sort_order: i,
      published: true,
    }))
  }, [cardsByCollection])

  useGSAP(
    () => {
      if (!motionEnabled) {
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

      gsap.utils.toArray('.insight-row').forEach((row) => {
        softScrollIn(row, {
          y: 24,
          stagger: 0,
          duration: 0.85,
          trigger: row,
          start: 'top 85%',
        })
      })

      hardRefreshScroll(pageRef.current)
    },
    { scope: pageRef, dependencies: [listSignature(articles), motionKey] },
  )

  return (
    <div ref={pageRef} className="page-insights">
      <PageHero
        image={heroes.insights}
        eyebrow={
          <EditableText contentKey="insights.eyebrow" as="p" className="eyebrow">
            Thinking
          </EditableText>
        }
        title={<SplitHeadline text="Insights" as="h1" />}
        body={
          <EditableText contentKey="insights.hero_body" as="p" className="hero-lead" multiline>
            Notes from the field — delivery lessons across events, creative, and golf
            hospitality.
          </EditableText>
        }
      />

      <section className="section insights-feed has-art">
        <ProgressiveArt variant="nodes" peak={0.5} />
        <div className="container insights-feed-layout">
          <div className="insights-spine" aria-hidden="true" />
          <div className="insights-rows">
            {articles.map((article) => (
              <article
                className={`insight-row${editMode ? ' cms-editable' : ''}`}
                key={article.id || article.title}
                onClick={() => {
                  if (!editMode) return
                  setEditor(article)
                }}
              >
                <div className="insight-row-media">
                  <img src={article.image} alt="" loading="lazy" />
                </div>
                <div className="insight-row-body">
                  <p className="eyebrow">{article.tag}</p>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                </div>
                {editMode && <span className="cms-pencil">✎</span>}
              </article>
            ))}
            {editMode && (
              <button type="button" className="cms-add-tile" onClick={() => setAdding(true)}>
                + Add insight
              </button>
            )}
          </div>
        </div>
      </section>

      <CTABand />

      {editor && (
        <CardEditor
          kind="card"
          record={editor.id ? editor : null}
          defaults={{
            collection: 'insights',
            title: editor.title,
            body: editor.body || editor.excerpt,
            image_url: editor.image_url || editor.image,
            link_label: editor.link_label || editor.tag,
            sort_order: editor.sort_order || 0,
            published: true,
          }}
          onClose={() => setEditor(null)}
        />
      )}
      {adding && (
        <CardEditor
          kind="card"
          defaults={{
            collection: 'insights',
            title: 'New insight',
            body: '',
            image_url: '',
            link_label: 'Insight',
            sort_order: articles.length,
            published: true,
          }}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  )
}
