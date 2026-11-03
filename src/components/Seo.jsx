import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl, config } from '../lib/config'

const DEFAULT_OG = absoluteUrl('/favicon-512.png')

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, extras = {}) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]${extras.sizes ? `[sizes="${extras.sizes}"]` : ''}`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  Object.entries(extras).forEach(([k, v]) => el.setAttribute(k, v))
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Per-route SEO. Brand-first titles help “Aditona” / “Aditona Group” queries.
 * Ranking #1 is never guaranteed — this maximizes on-page signals Google can use.
 */
export default function Seo({
  title,
  description = config.description,
  path,
  image = DEFAULT_OG,
  type = 'website',
  noIndex = false,
}) {
  const location = useLocation()
  const pathname = path ?? location.pathname
  const url = absoluteUrl(pathname === '/' ? '/' : pathname)
  const fullTitle = title
    ? `${title} | ${config.brand}`
    : `${config.brand} | Aditona — Events, Creative, Golf & Procurement`

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = 'en'

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', [
      'Aditona',
      'Aditona Group',
      'Aditona Botswana',
      'Aditona events',
      'Aditona procurement',
      'event solutions Botswana',
      'creative marketing Botswana',
      'golf solutions Botswana',
      'sourcing and procurement',
    ].join(', '))
    upsertMeta('name', 'author', config.brand)
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    upsertMeta('name', 'googlebot', noIndex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('name', 'theme-color', '#1A1A1B')
    upsertMeta('name', 'application-name', config.brand)

    upsertMeta('property', 'og:locale', 'en_BW')
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', config.brand)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:alt', `${config.brand} logo`)

    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    upsertLink('canonical', url)
    upsertLink('icon', absoluteUrl('/favicon-48.png?v=3'), {
      type: 'image/png',
      sizes: '48x48',
    })
    upsertLink('icon', absoluteUrl('/favicon-32.png?v=3'), {
      type: 'image/png',
      sizes: '32x32',
    })
    upsertLink('apple-touch-icon', absoluteUrl('/apple-touch-icon.png?v=3'), {
      sizes: '180x180',
    })
    upsertLink('manifest', absoluteUrl('/site.webmanifest'))

    upsertJsonLd('aditona-org-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${config.siteUrl}/#organization`,
      name: config.brand,
      alternateName: ['Aditona', 'Aditona Group Proprietary Limited'],
      url: config.siteUrl,
      logo: absoluteUrl('/favicon-512.png'),
      image: absoluteUrl('/favicon-512.png'),
      description: config.description,
      email: config.emails.info,
      telephone: `+${config.whatsapp}`,
      slogan: config.tagline,
      areaServed: {
        '@type': 'Country',
        name: 'Botswana',
      },
      sameAs: Object.values(config.social).filter((v) => v && v !== '#'),
      contactPoint: config.emailChannels.map((c) => ({
        '@type': 'ContactPoint',
        email: c.email,
        contactType: c.hint,
        areaServed: 'BW',
        availableLanguage: ['en'],
      })),
      knowsAbout: [
        'Event Solutions',
        'Creative and Marketing',
        'Golf Solutions',
        'Sourcing and Procurement',
      ],
    })

    upsertJsonLd('aditona-website-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${config.siteUrl}/#website`,
      name: config.brand,
      alternateName: 'Aditona',
      url: config.siteUrl,
      description: config.description,
      publisher: { '@id': `${config.siteUrl}/#organization` },
      inLanguage: 'en',
    })

    upsertJsonLd('aditona-webpage-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: fullTitle,
      description,
      isPartOf: { '@id': `${config.siteUrl}/#website` },
      about: { '@id': `${config.siteUrl}/#organization` },
      inLanguage: 'en',
    })
  }, [fullTitle, description, url, image, type, noIndex])

  return null
}
