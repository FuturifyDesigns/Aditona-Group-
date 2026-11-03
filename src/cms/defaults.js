import { config } from '../lib/config'

/** Fallback copy when a site_content key is missing. */
export const DEFAULTS = {
  'nav.cta': 'Request a Quote',
  'hero.headline': config.headline,
  'hero.body':
    'Aditona Group unites Event Solutions, Creative & Marketing, Golf Solutions, and Sourcing & Procurement — one accountable partner from brief to delivery.',
  'hero.cta_quote': 'Request a Quote',
  'hero.cta_enquiry': 'Make an Enquiry',
  'hero.tagline': config.tagline,
  'home.divisions_eyebrow': 'Capabilities',
  'home.divisions_title': 'What we deliver',
  'home.divisions_link': 'How we work →',
  'home.work_eyebrow': 'Selected',
  'home.work_title': 'Featured Work',
  'home.work_body':
    'A snapshot of recent productions, campaigns, and golf hospitality engagements across the group.',
  'home.work_cta': 'View all work',
  'cta.title': 'Have a project in mind?',
  'cta.body':
    'Tell us what you need — we will route it to the right division and respond with a clear next step.',
  'cta.quote': 'Request a Quote',
  'cta.enquiry': 'Make an Enquiry',
}
