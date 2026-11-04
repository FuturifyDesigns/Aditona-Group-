import { config } from './config'

/** Cloudflare Worker that sends via Brevo as enquiries@aditona.com */
export const FORM_NOTIFY_URL =
  'https://aditona-form-notify.futurifydesigns.workers.dev'

export const FORM_REPLY_URL = `${FORM_NOTIFY_URL}/reply`

/**
 * Fire-and-forget email notify. Never throws to the caller when used with void.
 */
export async function notifyFormEmail(payload, { timeoutMs = 8000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(FORM_NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        form_type: payload.form_type,
        full_name: payload.full_name,
        company: payload.company,
        email: payload.email,
        phone: payload.phone,
        division: payload.division,
        service: payload.service,
        message: payload.message,
        project_date: payload.project_date,
        budget: payload.budget,
        page_source: payload.page_source,
        brand: config.brand,
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`notify ${res.status}: ${detail.slice(0, 200)}`)
    }
    return true
  } finally {
    clearTimeout(timer)
  }
}

/** Admin reply to a client — From: enquiries@aditona.com via Brevo. */
export async function sendClientReply({ to, client_name, subject, body }) {
  const res = await fetch(FORM_REPLY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ to, client_name, subject, body }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`reply ${res.status}: ${detail.slice(0, 200)}`)
  }
  return true
}

export function buildReplyDraft(row, noun) {
  const name = String(row?.full_name || 'there').trim()
  const formType = String(row?.form_type || noun || 'enquiry').trim()
  const subject = `Re: Your Aditona ${formType} request`
  const quote = String(row?.message || '')
    .trim()
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join('\n')

  const body = [
    `Hi ${name},`,
    '',
    'Thank you for getting in touch with Aditona Group.',
    '',
    '',
    '',
    'Kind regards,',
    'Aditona Group',
    'enquiries@aditona.com',
    '',
    '----------',
    `Original ${formType}:`,
    quote || '(no message)',
  ].join('\n')

  return { to: String(row?.email || '').trim(), subject, body }
}
