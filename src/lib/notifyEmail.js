import { config } from './config'

/**
 * Forward a website form submission to the inbox via FormSubmit.
 * Uses application/x-www-form-urlencoded (simple request) to avoid CORS preflight.
 * First-time: FormSubmit emails enquiries@ for a one-click confirm, then delivers.
 */
export async function notifyFormEmail(payload) {
  const to = config.emails.enquiries || 'enquiries@aditona.com'
  const kind =
    payload.form_type === 'quote'
      ? 'Quote request'
      : payload.form_type === 'contact'
        ? 'Contact message'
        : 'Enquiry'

  const params = new URLSearchParams()
  params.set('_subject', `[Aditona] ${kind} — ${payload.full_name || 'Website'}`)
  params.set('_template', 'table')
  params.set('_captcha', 'false')
  if (payload.email) params.set('_replyto', payload.email)
  params.set('Form', kind)
  params.set('Name', payload.full_name || '')
  params.set('Company', payload.company || '—')
  params.set('Email', payload.email || '')
  params.set('Phone', payload.phone || '—')
  params.set('Division', payload.division || '—')
  params.set('Service', payload.service || '—')
  params.set('Project date', payload.project_date || '—')
  params.set('Budget', payload.budget || '—')
  params.set('Message', payload.message || '')
  params.set('Page', payload.page_source || '—')

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Email notify failed (${res.status})`)
  }

  return res.json().catch(() => ({ ok: true }))
}
