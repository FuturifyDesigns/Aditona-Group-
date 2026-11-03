import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { submitEnquiry } from '../lib/supabase'
import {
  checkClientRateLimit,
  cleanMultiline,
  cleanText,
  isValidEmail,
} from '../lib/sanitize'

const RATE_KEY = 'aditona_enquiry_hits'
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 2

const DIVISIONS = [
  'Event Solutions',
  'Creative & Marketing',
  'Golf Solutions',
  'Sourcing & Procurement',
  'Not sure / Multiple',
]

const emptyQuote = {
  full_name: '',
  company: '',
  email: '',
  phone: '',
  division: '',
  service: '',
  message: '',
  project_date: '',
  budget: '',
  website_url: '',
}

const emptyShort = {
  full_name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
  website_url: '',
}

function validate(type, values) {
  const errors = {}
  if (!values.full_name.trim()) errors.full_name = 'Name is required.'
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email.'
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Please share a little more detail (10+ characters).'
  }
  if (type === 'quote') {
    if (!values.division) errors.division = 'Select a division.'
    if (!values.service.trim()) errors.service = 'Service is required.'
  }
  return errors
}

export default function EnquiryForm({ type = 'enquiry' }) {
  const location = useLocation()
  const initial = useMemo(
    () => (type === 'quote' ? { ...emptyQuote } : { ...emptyShort }),
    [type],
  )
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', text: '' })

    // Honeypot — bots that fill hidden fields are silently accepted.
    if (values.website_url) {
      setStatus({ type: 'ok', text: 'Thank you. We have received your message.' })
      return
    }

    const nextErrors = validate(type, values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const rate = checkClientRateLimit(RATE_KEY, RATE_WINDOW_MS, RATE_MAX)
    if (!rate.ok) {
      setStatus({
        type: 'err',
        text: 'Please wait about a minute before sending another message.',
      })
      return
    }

    setSubmitting(true)
    try {
      await submitEnquiry({
        form_type: type,
        full_name: cleanText(values.full_name, 120),
        company: cleanText(values.company || '', 160) || null,
        email: cleanText(values.email, 254),
        phone: cleanText(values.phone || '', 40) || null,
        division: values.division ? cleanText(values.division, 80) : null,
        service: values.service ? cleanText(values.service, 160) : null,
        message: cleanMultiline(values.message, 5000),
        project_date: values.project_date || null,
        budget: values.budget ? cleanText(values.budget, 40) : null,
        page_source: cleanText(location.pathname, 200),
      })
      setValues(initial)
      setErrors({})
      setStatus({
        type: 'ok',
        text: 'Thank you. Your message has been sent — we will be in touch shortly.',
      })
    } catch {
      setStatus({
        type: 'err',
        text: 'Something went wrong. Please try again or email enquiries@aditona.com.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const title =
    type === 'quote'
      ? 'Request a Quote'
      : type === 'contact'
        ? 'Send a Message'
        : 'Make an Enquiry'

  return (
    <div className="form-card">
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="form-grid two">
          <div className="field">
            <label htmlFor="full_name">Full name *</label>
            <input
              id="full_name"
              name="full_name"
              value={values.full_name}
              onChange={onChange}
              autoComplete="name"
              maxLength={120}
              required
            />
            {errors.full_name && <div className="error">{errors.full_name}</div>}
          </div>

          <div className="field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              value={values.company}
              onChange={onChange}
              autoComplete="organization"
              maxLength={160}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              autoComplete="email"
              maxLength={254}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={onChange}
              autoComplete="tel"
              maxLength={40}
            />
          </div>

          {type === 'quote' && (
            <>
              <div className="field">
                <label htmlFor="division">Division *</label>
                <select
                  id="division"
                  name="division"
                  value={values.division}
                  onChange={onChange}
                >
                  <option value="">Select…</option>
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.division && <div className="error">{errors.division}</div>}
              </div>

              <div className="field">
                <label htmlFor="service">Service needed *</label>
                <input
                  id="service"
                  name="service"
                  value={values.service}
                  onChange={onChange}
                  placeholder="e.g. Conference production"
                  maxLength={160}
                />
                {errors.service && <div className="error">{errors.service}</div>}
              </div>

              <div className="field">
                <label htmlFor="project_date">Project date</label>
                <input
                  id="project_date"
                  name="project_date"
                  type="date"
                  value={values.project_date}
                  onChange={onChange}
                />
              </div>

              <div className="field">
                <label htmlFor="budget">Budget range (Pula)</label>
                <select
                  id="budget"
                  name="budget"
                  value={values.budget}
                  onChange={onChange}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Under P50k">Under P50k</option>
                  <option value="P50k – P150k">P50k – P150k</option>
                  <option value="P150k – P500k">P150k – P500k</option>
                  <option value="P500k+">P500k+</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="field" style={{ marginTop: '0.9rem' }}>
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={onChange}
            placeholder="Tell us about your goals, timeline, and any must-haves."
            maxLength={5000}
            required
          />
          {errors.message && <div className="error">{errors.message}</div>}
        </div>

        <div className="hp" aria-hidden="true">
          <label htmlFor="website_url">Website</label>
          <input
            id="website_url"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            value={values.website_url}
            onChange={onChange}
          />
        </div>

        <div className="btn-row" style={{ marginTop: '1.1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Submit'}
          </button>
        </div>

        {status.text && (
          <div className={`form-msg ${status.type}`} role="status">
            {status.text}
          </div>
        )}
      </form>
    </div>
  )
}
