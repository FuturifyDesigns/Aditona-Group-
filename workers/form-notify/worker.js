/**
 * Aditona form notify + admin reply via Brevo.
 * Sends From: enquiries@aditona.com (authenticated domain).
 *
 * Secrets: BREVO_API_KEY
 */
const ALLOWED_ORIGINS = new Set([
  'https://aditona.com',
  'https://www.aditona.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const FROM = { name: 'Aditona Group', email: 'enquiries@aditona.com' }
const ADMIN_TO = { name: 'Aditona Enquiries', email: 'aditonagroup@gmail.com' }

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

function isEmail(value) {
  const email = clean(value, 254)
  return email.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function sendBrevo(env, payload) {
  if (!env.BREVO_API_KEY) throw new Error('BREVO_API_KEY missing')
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${text.slice(0, 300)}`)
  }
  try {
    return JSON.parse(text)
  } catch {
    return { ok: true }
  }
}

function buildNotifyBody(payload) {
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
    'Or use Reply in Admin → Enquiries / Quotes (sends from enquiries@aditona.com).',
  ].join('\n')
}

async function handleNotify(request, env, origin) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400, origin)
  }

  const email = clean(payload?.email, 254)
  const fullName = clean(payload?.full_name, 120)
  const message = clean(payload?.message, 5000)
  if (!isEmail(email) || !fullName || !message) {
    return json({ error: 'Missing required fields' }, 400, origin)
  }

  const formType = clean(payload.form_type, 40) || 'enquiry'
  const subject = `[Aditona] New ${formType}: ${fullName}`

  try {
    await sendBrevo(env, {
      sender: FROM,
      to: [ADMIN_TO],
      replyTo: { email, name: fullName },
      subject,
      textContent: buildNotifyBody(payload),
    })
    return json({ ok: true }, 200, origin)
  } catch (err) {
    return json(
      { error: 'Email send failed', detail: String(err?.message || err) },
      502,
      origin,
    )
  }
}

async function handleReply(request, env, origin) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400, origin)
  }

  const to = clean(payload?.to, 254)
  const subject = clean(payload?.subject, 200)
  const body = clean(payload?.body, 8000)
  const clientName = clean(payload?.client_name, 120)

  if (!isEmail(to) || !subject || body.length < 2) {
    return json({ error: 'Missing required fields' }, 400, origin)
  }

  try {
    await sendBrevo(env, {
      sender: FROM,
      to: [{ email: to, name: clientName || undefined }],
      replyTo: FROM,
      subject,
      textContent: body,
    })
    return json({ ok: true }, 200, origin)
  } catch (err) {
    return json(
      { error: 'Reply send failed', detail: String(err?.message || err) },
      502,
      origin,
    )
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin)
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: 'Origin not allowed' }, 403, origin)
    }

    if (url.pathname === '/reply' || url.pathname.endsWith('/reply')) {
      return handleReply(request, env, origin)
    }

    return handleNotify(request, env, origin)
  },
}
