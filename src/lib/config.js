export const config = {
  brand: 'Aditona Group',
  shortName: 'Aditona',
  tagline: 'VISION. PRECISION. EXECUTION.',
  headline: 'One Group. Multiple Solutions.',
  description:
    'Aditona Group is a Botswana multi-disciplinary solutions company for events, creative & marketing, golf solutions, and sourcing & procurement.',
  siteUrl: 'https://aditona.com',
  whatsapp: '26778691888',
  emails: {
    info: 'info@aditona.com',
    enquiries: 'enquiries@aditona.com',
    admin: 'admin@aditona.com',
    accounts: 'accounts@aditona.com',
    operations: 'operations@aditona.com',
  },
  emailChannels: [
    {
      key: 'info',
      label: 'General',
      email: 'info@aditona.com',
      hint: 'General company enquiries',
    },
    {
      key: 'enquiries',
      label: 'Enquiries',
      email: 'enquiries@aditona.com',
      hint: 'Service and business enquiries',
    },
    {
      key: 'admin',
      label: 'Admin',
      email: 'admin@aditona.com',
      hint: 'Administration and official correspondence',
    },
    {
      key: 'accounts',
      label: 'Accounts',
      email: 'accounts@aditona.com',
      hint: 'Invoices, payments and financial matters',
    },
    {
      key: 'operations',
      label: 'Operations',
      email: 'operations@aditona.com',
      hint: 'Project execution, supplier coordination and operational matters',
    },
  ],
  social: {
    linkedin: '#',
    instagram: '#',
    facebook: '#',
  },
  supabaseUrl: 'https://hhwzfkvosotfilyrumda.supabase.co',
  supabaseAnon:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhod3pma3Zvc290ZmlseXJ1bWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MzcwODUsImV4cCI6MjEwOTIxMzA4NX0.SmRzCGbzmjYbq86WPaXH_tgstIP6grRa-xncOn2rFzc',
}

export function waLink(message) {
  const text = encodeURIComponent(
    message ||
      'Hello Aditona Group, I would like to enquire about your services.',
  )
  return `https://wa.me/${config.whatsapp}?text=${text}`
}

export function absoluteUrl(path = '/') {
  const base = config.siteUrl.replace(/\/$/, '')
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
