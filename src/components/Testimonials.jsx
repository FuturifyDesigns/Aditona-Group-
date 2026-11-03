import { useCallback, useEffect, useState } from 'react'
import EditableText from '../cms/EditableText'
import Reveal from './Reveal'
import {
  listPublicTestimonials,
  submitTestimonial,
} from '../lib/supabase'
import {
  checkClientRateLimit,
  cleanMultiline,
  cleanText,
  isValidEmail,
} from '../lib/sanitize'

const RATE_KEY = 'aditona_testimonial_hits'
const RATE_WINDOW_MS = 120_000
const RATE_MAX = 2

function Stars({ value, onChange, interactive = false }) {
  const rating = Number(value) || 0
  if (!interactive) {
    return (
      <span className="testimonial-stars" aria-label={`${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < rating ? 'is-on' : ''} aria-hidden="true">
            ★
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className="testimonial-stars testimonial-stars--input" role="group" aria-label="Rating">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1
        return (
          <button
            key={n}
            type="button"
            className={n <= rating ? 'is-on' : ''}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            aria-pressed={n === rating}
            onClick={() => onChange?.(n)}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

const emptyForm = {
  full_name: '',
  company: '',
  email: '',
  rating: 5,
  message: '',
  website_url: '',
}

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await listPublicTestimonials())
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', text: '' })

    if (values.website_url) {
      setStatus({ type: 'ok', text: 'Thank you — your review has been posted.' })
      return
    }

    const next = {}
    if (!cleanText(values.full_name, 120) || cleanText(values.full_name, 120).length < 2) {
      next.full_name = 'Name is required.'
    }
    if (values.email.trim() && !isValidEmail(values.email)) {
      next.email = 'Enter a valid email.'
    }
    if (!cleanMultiline(values.message, 1200) || cleanMultiline(values.message, 1200).length < 10) {
      next.message = 'Please write a short review (10+ characters).'
    }
    const rating = Number(values.rating) || 0
    if (rating < 1 || rating > 5) next.rating = 'Choose a rating.'
    setErrors(next)
    if (Object.keys(next).length) return

    const rate = checkClientRateLimit(RATE_KEY, RATE_WINDOW_MS, RATE_MAX)
    if (!rate.ok) {
      setStatus({
        type: 'err',
        text: 'Please wait a couple of minutes before posting another review.',
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        full_name: cleanText(values.full_name, 120),
        company: cleanText(values.company || '', 160) || null,
        email: cleanText(values.email || '', 254) || null,
        rating,
        message: cleanMultiline(values.message, 1200),
      }
      await submitTestimonial(payload)
      setValues(emptyForm)
      setErrors({})
      setStatus({ type: 'ok', text: 'Thank you — your review is now on the site.' })
      await load()
    } catch {
      setStatus({
        type: 'err',
        text: 'Could not post the review. Please try again shortly.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section testimonials-section has-art" id="testimonials">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <EditableText contentKey="home.testimonials_eyebrow" as="p" className="eyebrow">
                Testimonials
              </EditableText>
            </Reveal>
            <Reveal delay={0.05}>
              <EditableText contentKey="home.testimonials_title" as="h2">
                What clients say
              </EditableText>
            </Reveal>
            <Reveal delay={0.08}>
              <EditableText
                contentKey="home.testimonials_body"
                as="p"
                className="testimonials-lead"
                multiline
              >
                Real feedback from people we have worked with — share your experience below.
              </EditableText>
            </Reveal>
          </div>
        </div>

        <div className="testimonials-layout">
          <div className="testimonials-list" aria-live="polite">
            {loading && <p className="admin-muted">Loading reviews…</p>}
            {!loading && items.length === 0 && (
              <p className="testimonials-empty">
                Be the first to leave a review for Aditona Group.
              </p>
            )}
            {!loading &&
              items.map((item, i) => (
                <Reveal key={item.id} delay={Math.min(i * 0.04, 0.2)}>
                  <article className="testimonial-item">
                    <Stars value={item.rating} />
                    <p className="testimonial-copy">{item.message}</p>
                    <footer className="testimonial-byline">
                      <strong>{item.full_name}</strong>
                      {item.company ? <span>{item.company}</span> : null}
                    </footer>
                  </article>
                </Reveal>
              ))}
          </div>

          <Reveal delay={0.1}>
            <form className="testimonial-form" onSubmit={onSubmit} noValidate>
              <h3>Share your review</h3>
              <p className="testimonial-form-hint">
                Your name and review appear on this page. Email stays private for our records.
              </p>

              <div className="field">
                <label htmlFor="t_rating">Rating *</label>
                <Stars
                  value={values.rating}
                  interactive
                  onChange={(n) => setValues((v) => ({ ...v, rating: n }))}
                />
                {errors.rating && <div className="error">{errors.rating}</div>}
              </div>

              <div className="form-grid two">
                <div className="field">
                  <label htmlFor="t_full_name">Name *</label>
                  <input
                    id="t_full_name"
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
                  <label htmlFor="t_company">Company</label>
                  <input
                    id="t_company"
                    name="company"
                    value={values.company}
                    onChange={onChange}
                    autoComplete="organization"
                    maxLength={160}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="t_email">Email (private)</label>
                <input
                  id="t_email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={onChange}
                  autoComplete="email"
                  maxLength={254}
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>

              <div className="field">
                <label htmlFor="t_message">Your review *</label>
                <textarea
                  id="t_message"
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={onChange}
                  maxLength={1200}
                  required
                />
                {errors.message && <div className="error">{errors.message}</div>}
              </div>

              <div className="hp" aria-hidden="true">
                <label htmlFor="t_website_url">Website</label>
                <input
                  id="t_website_url"
                  name="website_url"
                  value={values.website_url}
                  onChange={onChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {status.text ? (
                <p className={`form-msg ${status.type}`} role="status">
                  {status.text}
                </p>
              ) : null}

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post review'}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
