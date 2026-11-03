import { config } from './config'

/** Brand-led titles/descriptions for every public route. */
export const PAGE_SEO = {
  default: {
    title: null,
    description: config.description,
  },
  '/': {
    title: null,
    description:
      'Aditona Group — Aditona events, creative & marketing, golf solutions, and sourcing & procurement. One accountable partner in Botswana.',
  },
  '/about': {
    title: 'About Aditona Group',
    description:
      'About Aditona Group — our vision, values, divisions, and delivery method for multidisciplinary projects in Botswana.',
  },
  '/event-solutions': {
    title: 'Event Solutions',
    description:
      'Aditona Event Solutions — planning, production, logistics, and on-site delivery for corporate and private events.',
  },
  '/creative-marketing': {
    title: 'Creative & Marketing',
    description:
      'Aditona Creative & Marketing — branding, content, photography, videography, and campaign support.',
  },
  '/golf-solutions': {
    title: 'Golf Solutions',
    description:
      'Aditona Golf Solutions — corporate golf days, tournaments, hospitality, and course activations.',
  },
  '/procurement': {
    title: 'Sourcing & Procurement',
    description:
      'Aditona Sourcing & Procurement — supplier identification, quotations, purchasing, and budget-aligned delivery.',
  },
  '/our-work': {
    title: 'Our Work',
    description:
      'Selected Aditona Group work across events, creative campaigns, golf hospitality, and integrated delivery.',
  },
  '/insights': {
    title: 'Insights',
    description:
      'Aditona Group insights — delivery lessons from events, creative, golf hospitality, and procurement.',
  },
  '/contact': {
    title: 'Contact',
    description:
      'Contact Aditona Group via info, enquiries, admin, accounts, or operations — or send a message online.',
  },
  '/request-quote': {
    title: 'Request a Quote',
    description: 'Request a quote from Aditona Group for events, creative, golf, or procurement.',
  },
  '/enquiry': {
    title: 'Make an Enquiry',
    description: 'Make an enquiry to Aditona Group — we will route it to the right team.',
  },
}
