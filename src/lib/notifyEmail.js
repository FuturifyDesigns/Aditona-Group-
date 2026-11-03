import { config } from './config'

/** Cloudflare Worker that emails verified destination via Email Routing. */
export const FORM_NOTIFY_URL =
  'https://aditona-form-notify.futurifydesigns.workers.dev'

/**
 * Fire-and-forget email notify. Never throws to the caller when used with void.
 * Keep a short timeout so a slow Worker cannot hang the form UI if awaited.
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
