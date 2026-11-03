import { config } from './config'

/**
 * Forward a website form submission to the inbox.
 * Uses FormSubmit (no SMTP needed with Cloudflare receive-only routing).
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

  const body = {
    _subject: `[Aditona] ${kind} — ${payload.full_name || 'Website'}`,
    _template: 'table',
    _captcha: 'false',
    _replyto: payload.email || undefined,
    Form: kind,
    Name: payload.full_name || '',
    Company: payload.company || '—',
    Email: payload.email || '',
    Phone: payload.phone || '—',
    Division: payload.division || '—',
    Service: payload.service || '—',
    'Project date': payload.project_date || '—',
    Budget: payload.budget || '—',
    Message: payload.message || '',
    Page: payload.page_source || '—',
  }

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Email notify failed (${res.status})`)
  }

  return res.json().catch(() => ({ ok: true }))
}
