export const config = {
  brand: 'Aditona Group',
  tagline: 'VISION. PRECISION. EXECUTION.',
  headline: 'One Group. Three Divisions. Multiple Solutions.',
  whatsapp: '27600000000',
  emails: {
    info: 'info@aditona.com',
    enquiries: 'enquiries@aditona.com',
    admin: 'admin@aditona.com',
    accounts: 'accounts@aditona.com',
    operations: 'operations@aditona.com',
  },
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
