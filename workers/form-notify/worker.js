/**
 * Aditona form → email notify.
 * Sends to a verified Email Routing destination (free on Workers Free).
 */
const ALLOWED_ORIGINS = new Set([
  'https://aditona.com',
  'https://www.aditona.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const FROM = 'Aditona Forms <enquiries@aditona.com>'
const TO = 'aditonagroup@gmail.com'

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://aditona.com'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  })
}

function clean(value, max = 500) {
  if (value == null) return ''
  return String(value).replace(/\r/g, '').trim().slice(0, max)
}

function buildBody(payload) {
  return [
    `New ${clean(payload.form_type, 40) || 'enquiry'} from the Aditona website`,
    '',
    `Name: ${clean(payload.full_name, 120)}`,
    `Email: ${clean(payload.email, 254)}`,
    `Phone: ${clean(payload.phone, 40) || '—'}`,
    `Company: ${clean(payload.company, 160) || '—'}`,
    `Division: ${clean(payload.division, 80) || '—'}`,
    `Service: ${clean(payload.service, 160) || '—'}`,
    `Budget: ${clean(payload.budget, 40) || '—'}`,
    `Project date: ${clean(payload.project_date, 40) || '—'}`,
    `Page: ${clean(payload.page_source, 200) || '—'}`,
    '',
    'Message:',
    clean(payload.message, 5000) || '—',
    '',
    '—',
    'Reply to this email to respond directly to the client.',
    'Also saved in Admin → Enquiries / Quotes (use Reply there too).',
  ].join('\n')
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin)
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: 'Origin not allowed' }, 403, origin)
    }

    let payload
    try {
      payload = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400, origin)
    }

    const email = clean(payload?.email, 254)
    const fullName = clean(payload?.full_name, 120)
    const message = clean(payload?.message, 5000)
    if (!email || !fullName || !message) {
      return json({ error: 'Missing required fields' }, 400, origin)
    }

    const formType = clean(payload.form_type, 40) || 'enquiry'
    const subject = `[Aditona] New ${formType}: ${fullName}`
    const text = buildBody(payload)

    try {
      try {
        await env.EMAIL.send({
          from: FROM,
          to: TO,
          replyTo: email,
          subject,
          text,
        })
      } catch {
        const { EmailMessage } = await import('cloudflare:email')
        const raw = [
          `From: ${FROM}`,
          `To: ${TO}`,
          `Reply-To: ${email}`,
          `Subject: ${subject.replace(/[\r\n]+/g, ' ')}`,
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=utf-8',
          '',
          text,
        ].join('\r\n')
        await env.EMAIL.send(new EmailMessage('enquiries@aditona.com', TO, raw))
      }
      return json({ ok: true }, 200, origin)
    } catch (err) {
      return json(
        { error: 'Email send failed', detail: String(err?.message || err) },
        502,
        origin,
      )
    }
  },
}
