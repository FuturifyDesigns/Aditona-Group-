const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

/** Trim, strip control characters, and enforce a max length. */
export function cleanText(value, max = 500) {
  if (typeof value !== 'string') return ''
  return value.replace(CONTROL_CHARS, '').trim().slice(0, max)
}

export function cleanMultiline(value, max = 5000) {
  if (typeof value !== 'string') return ''
  return value.replace(CONTROL_CHARS, '').trim().slice(0, max)
}

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function isValidEmail(value) {
  const email = cleanText(value, 254)
  return email.length > 2 && email.length <= 254 && EMAIL_RE.test(email)
}

/** Client-side throttle keyed in localStorage (defense in depth; not a substitute for edge limits). */
export function checkClientRateLimit(key, windowMs, maxHits = 1) {
  const now = Date.now()
  let state = { hits: [], }
  try {
    state = JSON.parse(localStorage.getItem(key) || '{"hits":[]}')
  } catch {
    state = { hits: [] }
  }
  const hits = (state.hits || []).filter((t) => now - t < windowMs)
  if (hits.length >= maxHits) {
    const retryIn = windowMs - (now - hits[0])
    return { ok: false, retryIn }
  }
  hits.push(now)
  localStorage.setItem(key, JSON.stringify({ hits }))
  return { ok: true, retryIn: 0 }
}
